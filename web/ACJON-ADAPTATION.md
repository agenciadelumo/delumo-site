# Acjon adaptation for Delumo

Licensed source supplied by the owner: Acjon Digital Agency & Creative Portfolio Next.js template.

Implemented from the purchased package:
- `src/components/text-slider/TextSliderArea.tsx`: two opposite Swiper marquees, tilted primary band and alternating filled/outlined typography.
- `src/components/service/DesignStudioService.tsx` and `subComponents/DesignStudioServiceItem.tsx`: service grid, icon/title/content grouping, bottom action and expanding hover fill.
- `public/assets/scss/layout/pages/_service.scss` and `_text-slider.scss`: adapted geometry, hover transition, type and band composition.
- `src/hooks/useGsapAnimation.ts` (`fadeAnimation`): scoped GSAP entrance animation with route cleanup and reduced-motion handling added.
- Bricolage Grotesque display typography and animated arrow buttons.

Only the selected components are adapted; demo copy, unrelated demos and placeholder assets are not shipped. Delumo content is in `src/data/content.ts`. The original package remains in the owner's template directory.

Sources used for the service copy: the existing Delumo site, the owner's September 2026 company/project PDF, and the owner's supplied requirements. Proposed capabilities are presented as custom development services, not as a released proprietary training product. No financial/incubator information is published.

Technical reference: https://nextjs.org/docs/app/getting-started/installation
Learning reference: https://www.cdc.gov/training-development/php/about/develop-training-captivating-and-motivating-adult-learners.html

The site is statically rendered with Next.js. `scripts/package-site.mjs` combines that output with existing standalone routes to preserve proposals, demos and tours.
