# Reproducible release gate

The supported local and CI runtime is Node 22 with pnpm 11.9.0.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm check:content
pnpm check:images
pnpm audit:dependencies
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm test:performance:mobile
pnpm test:performance:desktop
```

`next build` performs TypeScript validation because build errors are no longer
ignored. CI also runs a separate typecheck for faster diagnostics.

pnpm build scripts use an explicit allowlist in `pnpm-workspace.yaml`: Sharp and
the native resolver may run their required install checks; MSW's nonessential
postinstall is denied.

## Performance budgets

- source hero assets: 300 KiB and 1920 px maximum;
- source card assets: 180 KiB and 1200 px maximum;
- page images: 900 KiB transfer budget;
- scripts: 330 KiB transfer budget;
- total page weight: 1.5 MiB;
- mobile LCP ≤ 3.5 s, CLS ≤ 0.1, TBT ≤ 600 ms;
- desktop LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms.

Lighthouse CI runs the homepage and a representative safety-sensitive recipe
on both mobile and desktop profiles. Lab TBT is used as a responsiveness proxy;
production INP still requires consented real-user measurement.
