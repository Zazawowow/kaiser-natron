import { spawn, spawnSync } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourcePath = path.join(root, 'src/api/kaiserhacks.js')
const outDir = path.join(root, 'public/videos/kaiserhacks')
const tmpDir = path.join(root, '.tmp/kaiserhacks-videos')

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} exited with ${code}`))
    })
  })
}

function curl(url, output) {
  return run('curl', ['--http1.1', '-L', '--fail', '--retry', '3', '-A', 'Mozilla/5.0', url, '-o', output])
}

function decodeFacebookUrl(raw) {
  return raw
    .replace(/\\\//g, '/')
    .replace(/\\u0025/g, '%')
    .replace(/\\u00253D/g, '%3D')
    .replace(/&amp;/g, '&')
}

function firstTrackUrl(html, key) {
  const match = html.match(new RegExp(`"${key}":\\[\\{"url":"([^"]+)"`))
  return match ? decodeFacebookUrl(match[1]) : ''
}

function videoEntries(source) {
  const entries = []
  let currentId = ''
  let currentSourceHref = ''

  for (const line of source.split('\n')) {
    const id = line.match(/id: '([^']+)'/)
    if (id) currentId = id[1]

    const sourceHref = line.match(/sourceHref: '([^']*)'/)
    if (sourceHref) currentSourceHref = sourceHref[1]

    const altKey = line.match(/altKey: /)
    if (altKey && currentId && currentSourceHref.includes('facebook.com/plugins/video.php')) {
      entries.push({ id: currentId, embed: currentSourceHref })
      currentSourceHref = ''
    }
  }

  return entries
}

await mkdir(outDir, { recursive: true })
await mkdir(tmpDir, { recursive: true })

const source = await readFile(sourcePath, 'utf8')
const entries = videoEntries(source)

for (const entry of entries) {
  const mp4 = path.join(outDir, `${entry.id}.mp4`)
  const poster = path.join(outDir, `${entry.id}.jpg`)
  const htmlPath = path.join(tmpDir, `${entry.id}.html`)
  const videoPath = path.join(tmpDir, `${entry.id}.video.mp4`)
  const audioPath = path.join(tmpDir, `${entry.id}.audio.mp4`)

  console.log(`\n${entry.id}`)
  if (existsSync(mp4) && existsSync(poster)) {
    console.log(`Skipping ${entry.id}: local video and poster already exist`)
    continue
  }

  await curl(entry.embed, htmlPath)
  const html = await readFile(htmlPath, 'utf8')
  const videoUrl = firstTrackUrl(html, 'video')
  const audioUrl = firstTrackUrl(html, 'audio')

  if (!videoUrl || !audioUrl) {
    console.warn(`Skipping ${entry.id}: no DASH media URLs found`)
    continue
  }

  await curl(videoUrl, videoPath)
  await curl(audioUrl, audioPath)
  await run('ffmpeg', [
    '-y',
    '-i',
    videoPath,
    '-i',
    audioPath,
    '-c',
    'copy',
    '-movflags',
    '+faststart',
    mp4,
  ])
  await run('ffmpeg', [
    '-y',
    '-ss',
    '00:00:01',
    '-i',
    mp4,
    '-frames:v',
    '1',
    '-update',
    '1',
    '-vf',
    'scale=720:-1',
    '-q:v',
    '3',
    poster,
  ])

  const probe = spawnSync('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    mp4,
  ], { encoding: 'utf8' })
  const seconds = Number.parseFloat(probe.stdout || '0')
  console.log(`Wrote ${path.relative(root, mp4)} (${seconds.toFixed(1)}s)`)
}

if (existsSync(tmpDir)) {
  await rm(tmpDir, { recursive: true, force: true })
}
