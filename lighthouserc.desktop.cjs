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
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1600 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 337920 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 921600 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/desktop' },
  },
}
