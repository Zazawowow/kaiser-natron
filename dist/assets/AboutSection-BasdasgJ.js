import{C as e,G as t,c as n,j as r,lt as i,m as a,p as o,s}from"./runtime-core.esm-bundler-BD0e4RlP.js";import{t as c}from"./i18n-CJQl3WLC.js";import{t as l}from"./SectionShell-Cd_Fu3uI.js";import{t as u}from"./DevicePreview-Dx8DzWeH.js";var d={class:`eyebrow mb-5`},f=`/design/preview/about`,p={__name:`AboutSection`,setup(p){let{t:m}=c();return(c,p)=>(e(),n(l,{eyebrow:t(m)(`ds.eyebrow.components`),title:t(m)(`ds.about.title`),description:t(m)(`ds.about.description`),wide:``},{default:r(()=>[s(`section`,null,[a(u,{src:f,initial:`desktop`,height:820})]),s(`section`,null,[s(`h2`,d,i(t(m)(`ds.heading.usage`)),1),p[0]||=s(`div`,{class:`rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink`},[s(`pre`,{class:`whitespace-pre-wrap`},`<About
  :eyebrow="t('about.eyebrow')"
  :headline="t('about.headline')"
  :sub="t('about.sub')"
  :milestones="[1, 2, 3].map((i) => ({
    year: t(\`about.milestone.\${i}.year\`),
    title: t(\`about.milestone.\${i}.title\`),
    text: t(\`about.milestone.\${i}.text\`),
  }))"
/>`)],-1)]),p[1]||=s(`section`,null,[s(`h2`,{class:`eyebrow mb-5`},`Tone sequence`),s(`p`,{class:`text-sm text-muted max-w-2xl`},[o(` The three milestone cards cycle the Card primitive's tones left-to-right: `),s(`code`,{class:`font-mono text-[12px]`},`paper`),o(` → `),s(`code`,{class:`font-mono text-[12px]`},`cream`),o(` → `),s(`code`,{class:`font-mono text-[12px]`},`brand`),o(`. The sequence is part of the component's visual contract and is not configurable — see `),s(`code`,{class:`font-mono text-[12px]`},`CARD_TONES`),o(` in `),s(`code`,{class:`font-mono text-[12px]`},`About.vue`),o(`. `)])],-1)]),_:1},8,[`eyebrow`,`title`,`description`]))}};export{p as default};