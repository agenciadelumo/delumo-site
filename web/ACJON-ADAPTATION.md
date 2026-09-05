# Acjon adaptation for Delumo

Licensed source supplied by the owner: Acjon Digital Agency & Creative Portfolio Next.js template.

Implemented from the purchased package:
- `src/components/text-slider/TextSliderArea.tsx`: two opposite Swiper marquees, tilted primary band and alternating filled/outlined typography.
- `src/components/service/DesignStudioService.tsx` and `subComponents/DesignStudioServiceItem.tsx`: service grid, icon/title/content grouping, bottom action and expanding hover fill.
- `public/assets/scss/layout/pages/_service.scss` and `_text-slider.scss`: adapted geometry, hover transition, type and band composition.
- `src/hooks/useGsapAnimation.ts` (`fadeAnimation`): scoped GSAP entrance animation with route cleanup and reduced-motion handling added.
- Bricolage Grotesque display typography and animated arrow buttons.
- `src/components/hero/DigitalMarketingHero.tsx`: editorial heading and rotating identity mark adapted to a full-bleed immersive-training cover, with the original Delumo symbol. The two-cover carousel advances every four seconds and has keyboard-accessible navigation, pause, reduced-motion and visibility handling.

Only the selected components are adapted; demo copy, unrelated demos and placeholder assets are not shipped. Delumo content is in `src/data/content.ts`. The original package remains in the owner's template directory.

Sources used for the service copy: the existing Delumo site, the owner's September 2026 company/project PDF, and the owner's supplied requirements. Proposed capabilities are presented as custom development services, not as a released proprietary training product. No financial/incubator information is published.

Technical reference: https://nextjs.org/docs/app/getting-started/installation
Learning reference: https://www.cdc.gov/training-development/php/about/develop-training-captivating-and-motivating-adult-learners.html

The site is statically rendered with Next.js. `scripts/package-site.mjs` combines that output with existing standalone routes to preserve proposals, demos and tours.

September 2026 update: the owner's four RH PDFs informed the general onboarding, conduct, quality, 5S and workplace-safety service categories. Internal rules, personal contacts and source PDFs are not published. Technical content requires client specialist review; the site makes no certification or legal-compliance guarantees.

The full-bleed geographic map uses D3 Geo with locally bundled Natural Earth 1:50m country and Brazil state geometry (public domain): https://www.naturalearthdata.com/about/terms-of-use/ . Source GeoJSON: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson . The animated connections use real city coordinates and do not represent measured customer locations.

`public/media/immersive-team.webp` is an AI-generated illustrative corporate-training photograph, optimized to approximately 115 KB. It does not document a client engagement.
