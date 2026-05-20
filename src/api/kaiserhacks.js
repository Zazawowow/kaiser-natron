// Mock Kaiserhacks content at the API boundary. Localized copy lives in
// src/i18n/messages.js under `kaiserhacks.*` keys, matching the bundle
// fixture pattern. The backend can replace this module with HTTP calls while
// callers keep the same structural shape.

const genericThumb = '/videos/kaiserhacks/generic-thumbnail.svg'

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
      href: '/kaiserhacks#kochen-backen',
      ctaLabelKey: 'kaiserhacks.category.kochenBacken.cta',
      hacks: [
        {
          id: 'zuckerfreie-limonade',
          titleKey: 'kaiserhacks.hack.zuckerfreieLimonade.title',
          descriptionKey: 'kaiserhacks.hack.zuckerfreieLimonade.description',
          duration: '0:38',
          tagKeys: ['kaiserhacks.tag.kueche', 'kaiserhacks.tag.getraenk'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1093112835730953%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.zuckerfreieLimonade.alt',
          },
        },
        {
          id: 'burger',
          titleKey: 'kaiserhacks.hack.burger.title',
          descriptionKey: 'kaiserhacks.hack.burger.description',
          duration: '0:45',
          tagKeys: ['kaiserhacks.tag.backen', 'kaiserhacks.tag.teig'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F2381822465547336%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.burger.alt',
          },
        },
        {
          id: 'obst-gemuese-waesche',
          titleKey: 'kaiserhacks.hack.obstGemueseWaesche.title',
          descriptionKey: 'kaiserhacks.hack.obstGemueseWaesche.description',
          duration: '0:31',
          tagKeys: ['kaiserhacks.tag.kueche', 'kaiserhacks.tag.vorbereiten'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1026985529610447%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.obstGemueseWaesche.alt',
          },
        },
        {
          id: 'ofen-risotto',
          titleKey: 'kaiserhacks.hack.ofenRisotto.title',
          descriptionKey: 'kaiserhacks.hack.ofenRisotto.description',
          duration: '0:52',
          tagKeys: ['kaiserhacks.tag.kochen', 'kaiserhacks.tag.ofen'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1676469699652231%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.ofenRisotto.alt',
          },
        },
      ],
    },
    {
      id: 'haus-garten',
      titleKey: 'kaiserhacks.category.hausGarten.title',
      summaryKey: 'kaiserhacks.category.hausGarten.summary',
      href: '/kaiserhacks#haus-garten',
      ctaLabelKey: 'kaiserhacks.category.hausGarten.cta',
      hacks: [
        {
          id: 'beauty-zubehoer',
          titleKey: 'kaiserhacks.hack.beautyZubehoer.title',
          descriptionKey: 'kaiserhacks.hack.beautyZubehoer.description',
          duration: '0:33',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.reinigen'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F798060882682814%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.beautyZubehoer.alt',
          },
        },
        {
          id: 'metallspuren-geschirr',
          titleKey: 'kaiserhacks.hack.metallspurenGeschirr.title',
          descriptionKey: 'kaiserhacks.hack.metallspurenGeschirr.description',
          duration: '0:29',
          tagKeys: ['kaiserhacks.tag.haushalt', 'kaiserhacks.tag.geschirr'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2625021024499858%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.metallspurenGeschirr.alt',
          },
        },
        {
          id: 'muelleimer-gerueche',
          titleKey: 'kaiserhacks.hack.muelleimerGerueche.title',
          descriptionKey: 'kaiserhacks.hack.muelleimerGerueche.description',
          duration: '0:34',
          tagKeys: ['kaiserhacks.tag.haushalt', 'kaiserhacks.tag.geruch'],
          video: {
            src: '',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.muelleimerGerueche.alt',
          },
        },
        {
          id: 'express-backblech-reinigung',
          titleKey: 'kaiserhacks.hack.expressBackblechReinigung.title',
          descriptionKey: 'kaiserhacks.hack.expressBackblechReinigung.description',
          duration: '0:41',
          tagKeys: ['kaiserhacks.tag.reinigen', 'kaiserhacks.tag.kueche'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F1473646797116293%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.expressBackblechReinigung.alt',
          },
        },
      ],
    },
    {
      id: 'koerper-pflege',
      titleKey: 'kaiserhacks.category.koerperPflege.title',
      summaryKey: 'kaiserhacks.category.koerperPflege.summary',
      href: '/kaiserhacks#koerper-pflege',
      ctaLabelKey: 'kaiserhacks.category.koerperPflege.cta',
      hacks: [
        {
          id: 'glow-peeling',
          titleKey: 'kaiserhacks.hack.glowPeeling.title',
          descriptionKey: 'kaiserhacks.hack.glowPeeling.description',
          duration: '0:36',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.haut'],
          video: {
            src: '',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.glowPeeling.alt',
          },
        },
        {
          id: 'lippen-blaeschen',
          titleKey: 'kaiserhacks.hack.lippenBlaeschen.title',
          descriptionKey: 'kaiserhacks.hack.lippenBlaeschen.description',
          duration: '0:25',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.lippen'],
          video: {
            src: '',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.lippenBlaeschen.alt',
          },
        },
        {
          id: 'lackschaden-nagellack',
          titleKey: 'kaiserhacks.hack.lackschadenNagellack.title',
          descriptionKey: 'kaiserhacks.hack.lackschadenNagellack.description',
          duration: '0:33',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.naegel'],
          video: {
            src: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100077375413679%2Fvideos%2F964807425679685%2F&show_text=false&width=267&t=0',
            poster: genericThumb,
            altKey: 'kaiserhacks.hack.lackschadenNagellack.alt',
          },
        },
        {
          id: 'mueckenstich',
          titleKey: 'kaiserhacks.hack.mueckenstich.title',
          descriptionKey: 'kaiserhacks.hack.mueckenstich.description',
          duration: '0:30',
          tagKeys: ['kaiserhacks.tag.pflege', 'kaiserhacks.tag.sommer'],
          video: {
            src: '',
            poster: genericThumb,
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
        duration: hack.duration,
        tags: hack.tagKeys.map((key) => t(key)),
        video: {
          src: hack.video.src,
          poster: hack.video.poster,
          alt: t(hack.video.altKey),
        },
      })),
    })),
  }
}
