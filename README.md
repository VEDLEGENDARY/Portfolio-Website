# Ved Patel — Portfolio

A responsive editorial portfolio built with Next.js, TypeScript, and React.
Cormorant Garamond provides display typography; Inter handles navigation and body copy.
Espresso and parchment themes use coffee-toned surfaces and restrained muted taupe accents.
Every fresh page load starts dark; the navigation toggle changes the theme for the current visit.

## Development

Requires Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run lint
npm run build
```

## Editing

- `src/app/globals.css`: palette, typography, and responsive layout.
- `src/styles/motion.css`: headline choreography, hover interactions, and reduced-motion rules.
- `src/content/`: project and career data, separate from presentation.
- `src/components/`: server-rendered page sections and shared theme/motion controllers.
- `src/components/hero.tsx` and `contact.tsx`: introduction and contact details.
- `public/Resume_VedPatel.pdf`: linked résumé.

Images use Next.js optimization and responsive sizing. Content renders on the server;
theme selection and one shared animation observer provide client-side enhancements. The site uses native scrolling,
visible keyboard focus, a skip link, and reduced-motion preferences.

The opening title lasts 2.2 seconds, supports Escape/Tab dismissal, and is omitted for reduced-motion preferences. The opening is decorative and never captures pointer input. CSS dismisses it even if JavaScript fails; it never waits on network requests.

## Private reach analytics

When this project is deployed on Vercel, enable **Analytics** in the project dashboard. The layout loads Vercel's first-party Web Analytics script after the page becomes interactive. Page Views count every page load, including repeat opens from the same visitor, while the totals remain visible only in the private Vercel dashboard. No count, identifier, or analytics UI is rendered in the portfolio.
