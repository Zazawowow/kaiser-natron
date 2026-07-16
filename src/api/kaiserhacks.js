import { publicAsset } from '@/lib/publicAsset.js'
// Mock Kaiserhacks content at the API boundary. Localized copy lives in
// src/i18n/messages.js under `kaiserhacks.*` keys, matching the bundle
// fixture pattern. The backend can replace this module with HTTP calls while
// callers keep the same structural shape.
//
// Video contract for the UI:
//   video.src       final playable MP4 URL
//   video.poster    final thumbnail URL
//   video.sourceHref optional import/origin metadata, not used for playback

const genericThumb = publicAsset('videos/kaiserhacks/generic-thumbnail.svg')
const videoPath = (id) => publicAsset(`videos/kaiserhacks/${id}.mp4`)
const posterPath = (id) => publicAsset(`videos/kaiserhacks/${id}.jpg`)

export const kaiserhacksPage = {
  eyebrowKey: 'kaiserhacks.eyebrow',
  headlineKey: 'kaiserhacks.headline',
  subKey: 'kaiserhacks.sub',
  instagramHref: 'https://www.instagram.com/explore/tags/kaiserhacks/',
  categories: [
    {
      id: 'kochen-backen',
      titleKey: 'kaiserhacks.category.kochenBacken.title',
      summaryKey: 'kaiserhacks.category.kochenBacken.summary',
      href: '/shop#cook',
      ctaLabelKey: 'kaiserhacks.category.kochenBacken.cta',
      hacks: [
        {
          id: 'zuckerfreie-limonade',
          titleKey: 'kaiserhacks.hack.zuckerfreieLimonade.title',
          descriptionKey: 'kaiserhacks.hack.zuckerfreieLimonade.description',
          detailKey: 'kaiserhacks.hack.zuckerfreieLimonade.detail',
          duration: '0:25',
          tagKeys: ['kaiserhacks.tag.kueche', 'kaiserhacks.tag.getraenk'],
          video: {
            src: videoPath('zuckerfreie-limonade'),
            poster: posterPath('zuckerfreie-limonade'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1093112835730953%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.zuckerfreieLimonade.alt',
          },
        },
        {
          id: 'burger',
          titleKey: 'kaiserhacks.hack.burger.title',
          descriptionKey: 'kaiserhacks.hack.burger.description',
          detailKey: 'kaiserhacks.hack.burger.detail',
          duration: '0:31',
          tagKeys: ['kaiserhacks.tag.backen', 'kaiserhacks.tag.teig'],
          video: {
            src: videoPath('burger'),
            poster: posterPath('burger'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F2381822465547336%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.burger.alt',
          },
        },
        {
          id: 'obst-gemuese-waesche',
          titleKey: 'kaiserhacks.hack.obstGemueseWaesche.title',
          descriptionKey: 'kaiserhacks.hack.obstGemueseWaesche.description',
          detailKey: 'kaiserhacks.hack.obstGemueseWaesche.detail',
          duration: '0:22',
          tagKeys: ['kaiserhacks.tag.kueche', 'kaiserhacks.tag.vorbereiten'],
          video: {
            src: videoPath('obst-gemuese-waesche'),
            poster: posterPath('obst-gemuese-waesche'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1026985529610447%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.obstGemueseWaesche.alt',
          },
        },
        {
          id: 'ofen-risotto',
          titleKey: 'kaiserhacks.hack.ofenRisotto.title',
          descriptionKey: 'kaiserhacks.hack.ofenRisotto.description',
          detailKey: 'kaiserhacks.hack.ofenRisotto.detail',
          duration: '0:37',
          tagKeys: ['kaiserhacks.tag.kochen', 'kaiserhacks.tag.ofen'],
          video: {
            src: videoPath('ofen-risotto'),
            poster: posterPath('ofen-risotto'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1676469699652231%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.ofenRisotto.alt',
          },
        },
      ],
    },
    {
      id: 'haus-garten',
      titleKey: 'kaiserhacks.category.hausGarten.title',
      summaryKey: 'kaiserhacks.category.hausGarten.summary',
      href: '/shop#clean',
      ctaLabelKey: 'kaiserhacks.category.hausGarten.cta',
      hacks: [
        {
          id: 'beauty-zubehoer',
          titleKey: 'kaiserhacks.hack.beautyZubehoer.title',
          descriptionKey: 'kaiserhacks.hack.beautyZubehoer.description',
          detailKey: 'kaiserhacks.hack.beautyZubehoer.detail',
          duration: '0:35',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.reinigen'],
          video: {
            src: videoPath('beauty-zubehoer'),
            poster: posterPath('beauty-zubehoer'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F798060882682814%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.beautyZubehoer.alt',
          },
        },
        {
          id: 'metallspuren-geschirr',
          titleKey: 'kaiserhacks.hack.metallspurenGeschirr.title',
          descriptionKey: 'kaiserhacks.hack.metallspurenGeschirr.description',
          detailKey: 'kaiserhacks.hack.metallspurenGeschirr.detail',
          duration: '0:20',
          tagKeys: ['kaiserhacks.tag.haushalt', 'kaiserhacks.tag.geschirr'],
          video: {
            src: videoPath('metallspuren-geschirr'),
            poster: posterPath('metallspuren-geschirr'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2625021024499858%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.metallspurenGeschirr.alt',
          },
        },
        {
          id: 'muelleimer-gerueche',
          titleKey: 'kaiserhacks.hack.muelleimerGerueche.title',
          descriptionKey: 'kaiserhacks.hack.muelleimerGerueche.description',
          detailKey: 'kaiserhacks.hack.muelleimerGerueche.detail',
          duration: '0:34',
          tagKeys: ['kaiserhacks.tag.haushalt', 'kaiserhacks.tag.geruch'],
          video: {
            src: '',
            poster: posterPath('muelleimer-gerueche'),
            sourceHref: 'https://www.kaiser-natron.de/kaiserhacks/hack/gerueche-aus-muelleimer-entfernen/',
            altKey: 'kaiserhacks.hack.muelleimerGerueche.alt',
          },
        },
        {
          id: 'express-backblech-reinigung',
          titleKey: 'kaiserhacks.hack.expressBackblechReinigung.title',
          descriptionKey: 'kaiserhacks.hack.expressBackblechReinigung.description',
          detailKey: 'kaiserhacks.hack.expressBackblechReinigung.detail',
          duration: '0:25',
          tagKeys: ['kaiserhacks.tag.reinigen', 'kaiserhacks.tag.kueche'],
          video: {
            src: videoPath('express-backblech-reinigung'),
            poster: posterPath('express-backblech-reinigung'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1473646797116293%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.expressBackblechReinigung.alt',
          },
        },
      ],
    },
    {
      id: 'koerper-pflege',
      titleKey: 'kaiserhacks.category.koerperPflege.title',
      summaryKey: 'kaiserhacks.category.koerperPflege.summary',
      href: '/shop#care',
      ctaLabelKey: 'kaiserhacks.category.koerperPflege.cta',
      hacks: [
        {
          id: 'glow-peeling',
          titleKey: 'kaiserhacks.hack.glowPeeling.title',
          descriptionKey: 'kaiserhacks.hack.glowPeeling.description',
          detailKey: 'kaiserhacks.hack.glowPeeling.detail',
          duration: '0:36',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.haut'],
          video: {
            src: '',
            poster: posterPath('glow-peeling'),
            sourceHref: 'https://www.kaiser-natron.de/kaiserhacks/hack/glow-peeling/',
            altKey: 'kaiserhacks.hack.glowPeeling.alt',
          },
        },
        {
          id: 'lippen-blaeschen',
          titleKey: 'kaiserhacks.hack.lippenBlaeschen.title',
          descriptionKey: 'kaiserhacks.hack.lippenBlaeschen.description',
          detailKey: 'kaiserhacks.hack.lippenBlaeschen.detail',
          duration: '0:25',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.lippen'],
          video: {
            src: '',
            poster: posterPath('lippen-blaeschen'),
            sourceHref: 'https://www.kaiser-natron.de/kaiserhacks/hack/lippen-blaeschen/',
            altKey: 'kaiserhacks.hack.lippenBlaeschen.alt',
          },
        },
        {
          id: 'lackschaden-nagellack',
          titleKey: 'kaiserhacks.hack.lackschadenNagellack.title',
          descriptionKey: 'kaiserhacks.hack.lackschadenNagellack.description',
          detailKey: 'kaiserhacks.hack.lackschadenNagellack.detail',
          duration: '0:30',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.naegel'],
          video: {
            src: videoPath('lackschaden-nagellack'),
            poster: posterPath('lackschaden-nagellack'),
            sourceHref: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F964807425679685%2F&show_text=false&width=267&t=0',
            altKey: 'kaiserhacks.hack.lackschadenNagellack.alt',
          },
        },
        {
          id: 'mueckenstich',
          titleKey: 'kaiserhacks.hack.mueckenstich.title',
          descriptionKey: 'kaiserhacks.hack.mueckenstich.description',
          detailKey: 'kaiserhacks.hack.mueckenstich.detail',
          duration: '0:30',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.sommer'],
          video: {
            src: '',
            poster: posterPath('mueckenstich'),
            sourceHref: 'https://www.kaiser-natron.de/kaiserhacks/hack/mueckenstich-juckt-mich-nicht/',
            altKey: 'kaiserhacks.hack.mueckenstich.alt',
          },
        },
      ],
    },
  ],
}

export async function fetchKaiserhacks() {
  return kaiserhacksPage
}

export function localizeKaiserhacks(page, t) {
  return {
    eyebrow: t(page.eyebrowKey),
    headline: t(page.headlineKey),
    sub: t(page.subKey),
    instagramHref: page.instagramHref,
    categories: page.categories.map((category) => ({
      id: category.id,
      title: t(category.titleKey),
      summary: t(category.summaryKey),
      href: category.href,
      ctaLabel: t(category.ctaLabelKey),
      hacks: category.hacks.map((hack) => ({
        id: hack.id,
        title: t(hack.titleKey),
        description: t(hack.descriptionKey),
        detailDescription: hack.detailKey ? t(hack.detailKey) : t(hack.descriptionKey),
        duration: hack.duration,
        tags: hack.tagKeys.map((key) => t(key)),
        video: {
          src: hack.video.src,
          poster: hack.video.poster,
          sourceHref: hack.video.sourceHref || '',
          alt: t(hack.video.altKey),
        },
      })),
    })),
  }
}
