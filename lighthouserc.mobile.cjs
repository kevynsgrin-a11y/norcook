module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node node_modules/next/dist/bin/next start',
      startServerReadyPattern: 'Ready',
      url: [
        'http://127.0.0.1:3000/',
        'http://127.0.0.1:3000/recipes/gravlaks',
        'http://127.0.0.1:3000/regions/vestlandet',
      ],
      // Mobile Lab metrics on a shared CI runner swing by well over a second
      // run to run: the homepage measured 2.2-3.7s LCP across three runs on an
      // unchanged tree, so a single sample against a 3.5s budget is a coin
      // flip. Three runs asserted at the median is the cheapest way to make
      // this gate mean something. A gate that cries wolf gets switched off.
      numberOfRuns: 3,
      settings: {
        budgetPath: './performance-budget.json',
        chromeFlags: '--headless --no-sandbox --disable-gpu',
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 },
      },
    },
    assert: {
      // Median, not LHCI's default 'optimistic' — otherwise three runs would
      // just be three chances to get a lucky one.
      aggregationMethod: 'median',
      assertions: {
        'categories:performance': ['error', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2200 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 600 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 337920 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 921600 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 102400 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 1536000 }],
        'resource-summary:third-party:count': ['error', { maxNumericValue: 0 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/mobile' },
  },
}
