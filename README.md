# norcook

Norcook — a video-first Nordic cuisine recipe platform (norcook.app). [Next.js](https://nextjs.org)
project, UI/component layer scaffolded with [v0](https://v0.app); backend data (recipes,
creators, affiliate routing) built out separately.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data layer

- `lib/data/recipe-seeds.ts` — 77 recipes across Sápmi, Vestlandet, Sørlandet, Østlandet, and
  modern Nordic bakery, expanded into full `Recipe` objects by `lib/data/recipe-builder.ts`.
- `lib/data/creators.ts` — creator roster (one voice per region).
- `lib/site.ts` — `SITE_NAME` / `SITE_URL`; set `NEXT_PUBLIC_SITE_URL` to override in production.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
