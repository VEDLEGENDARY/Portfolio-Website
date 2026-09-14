# Ved Patel — Portfolio

A responsive editorial portfolio built with Next.js, TypeScript, and React.
Cormorant Garamond provides display typography; Inter handles navigation and body copy.
The warm ivory and charcoal themes share taupe surfaces and a restrained blush accent.

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
