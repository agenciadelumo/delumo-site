# Branding update verification

- Hero interval: 10 seconds. Browser observation confirmed slide 0 after five seconds and slide 1 after ten seconds. Existing pause, focus and visibility handling retained.
- Website previews: fresh public-site screenshots, all 1265 x 720, compressed to WebP without cropping or distortion. Matching browser frames on desktop and full-width previews on mobile.
- Portrait: original 640 x 640 PNG copied unchanged. Source and published asset SHA-256 match. Rendered at 520 x 520 on desktop and 335 x 335 on mobile, using contain.
- Footer: white logo with a masked green sweep inside the original lettering and symbol. Screenshot comparison detected changing logo pixels. Animation follows the global pause and reduced-motion preference.
- Layout: visually reviewed at 1440px and 390px; no horizontal overflow at 390px or 320px. No browser console errors during the local review.
- Production build and six export tests passed. Proposal, tour and trainer entry points remain unchanged.
