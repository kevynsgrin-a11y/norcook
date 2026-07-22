module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node node_modules/next/dist/bin/next start',
      startServerReadyPattern: 'Ready',
      url: ['http://127.0.0.1:3000/', 'http://127.0.0.1:3000/recipes/gravlaks'],
      numberOfRuns: 1,
      settings: {
        budgetPath: './performance-budget.json',
        chromeFlags: '--headless --no-sandbox --disable-gpu',
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 },
      },
    },
    assert: {
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
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/mobile' },
  },
}
