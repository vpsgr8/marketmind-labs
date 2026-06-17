export const BLOG_POSTS = [
  {
    title: 'Understanding NIFTY Probability Scores',
    date: '2024-12-01',
    excerpt: 'Learn how our probability engine calculates bull, bear, and sideways probabilities for NIFTY options and index traders.',
    slug: 'understanding-nifty-probability',
    keywords: ['NIFTY probability', 'bull bear probability', 'options trading India'],
    relatedTools: ['/nifty-probability-calculator', '/banknifty-probability-calculator'],
    content: `
      <p>Our NIFTY probability calculator combines candle strength, momentum, bull/bear force, trend, volatility, and GANN factors into a single objective score.</p>
      <h2>How to use it</h2>
      <p>Enter the open, high, low, and close of the current or previous candle. The engine returns bull, bear, and sideways probabilities plus a confidence score.</p>
      <h2>Why probability beats gut feel</h2>
      <p>Retail traders often overreact to single candles. Quantitative probability helps you stay objective during volatile NIFTY sessions.</p>
    `,
  },
  {
    title: 'Master Candle Strategy Guide',
    date: '2024-11-28',
    excerpt: 'Complete guide to identifying and trading master candle breakouts with swish confirmation on NIFTY and BANKNIFTY.',
    slug: 'master-candle-strategy-guide',
    keywords: ['master candle', 'breakout trading', 'NIFTY intraday'],
    relatedTools: ['/master-candle-detector', '/swish-breakout-scanner'],
    content: `
      <p>A master candle is a wide-range candle that contains subsequent inside bars. Breakouts from this structure often lead to directional moves.</p>
      <h2>Swish confirmation</h2>
      <p>Combine master candle detection with our Swish Breakout Scanner for higher-probability entries with defined target and risk levels.</p>
    `,
  },
  {
    title: 'GANN Square of 9 for Beginners',
    date: '2024-11-25',
    excerpt: 'Introduction to GANN theory and practical application of Square of 9 for NIFTY and BANKNIFTY intraday support and resistance.',
    slug: 'gann-square-of-9-beginners',
    keywords: ['GANN square of 9', 'GANN calculator', 'NIFTY support resistance'],
    relatedTools: ['/gann-square-of-9', '/gann-time-cycle-calculator', '/intraday-reversal-time'],
    content: `
      <p>W.D. Gann used geometric angles to project price support and resistance. The Square of 9 maps price levels to harmonic degrees — 45°, 90°, 180°, 270°, and 360°.</p>
      <h2>Using our free calculator</h2>
      <p>Enter the current NIFTY or BANKNIFTY price to get harmonic support and resistance levels, cardinal points, and ordinal points instantly.</p>
      <h2>Combine with time cycles</h2>
      <p>Pair Square of 9 price levels with our GANN Time Cycle and Intraday Reversal Time tools for confluence.</p>
    `,
  },
  {
    title: 'BANKNIFTY vs NIFTY: Volatility Comparison',
    date: '2024-11-22',
    excerpt: 'Quantitative comparison of BANKNIFTY and NIFTY volatility patterns for options traders.',
    slug: 'banknifty-vs-nifty-volatility',
    keywords: ['BANKNIFTY', 'NIFTY volatility', 'bank nifty options'],
    relatedTools: ['/banknifty-probability-calculator', '/nifty-probability-calculator'],
    content: `
      <p>BANKNIFTY typically shows higher intraday range than NIFTY. Our probability engines account for candle volatility in the confidence score.</p>
      <p>Use the dedicated BANKNIFTY and NIFTY calculators to compare signals on the same session.</p>
    `,
  },
  {
    title: 'Swish Breakout Pattern Explained',
    date: '2024-11-19',
    excerpt: 'What is a swish breakout and how to trade it with high probability on Indian indices.',
    slug: 'swish-breakout-pattern',
    keywords: ['swish breakout', 'breakout scanner', 'intraday trading'],
    relatedTools: ['/swish-breakout-scanner', '/master-candle-detector'],
    content: `
      <p>The swish pattern identifies compression followed by a decisive breakout. Our scanner calculates direction, probability, target, and risk.</p>
    `,
  },
  {
    title: 'GANN Time Cycles in Indian Markets',
    date: '2024-11-16',
    excerpt: 'Applying GANN time cycle analysis to NIFTY and BANKNIFTY for reversal date prediction.',
    slug: 'gann-time-cycles-indian-markets',
    keywords: ['GANN time cycle', 'market reversal', 'NIFTY BANKNIFTY'],
    relatedTools: ['/gann-time-cycle-calculator', '/intraday-reversal-time', '/gann-square-of-9'],
    content: `
      <p>GANN time cycles project future dates from swing high and swing low durations. Common cycles include 30, 45, 60, 90, 180, and 360 days.</p>
      <p>Use our GANN Time Cycle Calculator with recent swing dates to project potential reversal windows.</p>
    `,
  },
]
