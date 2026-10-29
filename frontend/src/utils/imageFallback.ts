import React from 'react';

/**
 * High-aesthetic, self-contained SVG Data URI generator for news categories.
 * Works 100% offline with zero network requests, zero CORS issues, and zero 404s.
 */
export const getCategorySvg = (category?: string): string => {
  const cat = (category || 'general').toLowerCase().trim();

  let gradientStart = '#0f172a'; // slate-900
  let gradientEnd = '#1e1b4b';   // indigo-950
  let accentColor = '#38bdf8';   // sky-400
  let badgeBg = 'rgba(56, 189, 248, 0.15)';
  let badgeBorder = 'rgba(56, 189, 248, 0.4)';
  let label = 'ARTIFICIAL INTELLIGENCE';
  let subtitle = 'AI & Neural Deep Learning Architecture';
  let iconPath = 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7.003 7.003 0 0 1 5.07 11H5a1 1 0 0 1 0-2h.07A7.003 7.003 0 0 1 11 3.07V3a1 1 0 0 1 2 0v.07A7.003 7.003 0 0 1 18.93 9H19a1 1 0 0 1 0 2h-.07A7.003 7.003 0 0 1 13 16.93z';

  if (cat.includes('tech') || cat.includes('comput') || cat.includes('software')) {
    gradientStart = '#030712';
    gradientEnd = '#172554';
    accentColor = '#60a5fa';
    badgeBg = 'rgba(96, 165, 250, 0.15)';
    badgeBorder = 'rgba(96, 165, 250, 0.4)';
    label = 'TECHNOLOGY';
    subtitle = 'Silicon, Semiconductors & Cloud Computing';
    iconPath = 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm4 2v2h2V8H8zm6 0v2h2V8h-2zm-6 6v2h2v-2H8zm6 0v2h2v-2h-2z';
  } else if (cat.includes('scien') || cat.includes('physic') || cat.includes('astro')) {
    gradientStart = '#0f172a';
    gradientEnd = '#311042';
    accentColor = '#c084fc';
    badgeBg = 'rgba(192, 132, 252, 0.15)';
    badgeBorder = 'rgba(192, 132, 252, 0.4)';
    label = 'SCIENCE & RESEARCH';
    subtitle = 'Astrophysical, Quantum & Bio Discoveries';
    iconPath = 'M12 2v2a8 8 0 1 1-8 8H2a10 10 0 1 0 10-10zm0 4a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4V6z';
  } else if (cat.includes('busin') || cat.includes('econ') || cat.includes('finan') || cat.includes('market')) {
    gradientStart = '#022c22';
    gradientEnd = '#064e3b';
    accentColor = '#34d399';
    badgeBg = 'rgba(52, 211, 153, 0.15)';
    badgeBorder = 'rgba(52, 211, 153, 0.4)';
    label = 'BUSINESS & MARKETS';
    subtitle = 'Global Equities, Capital & Fiscal Policy';
    iconPath = 'M3 3v18h18V3H3zm16 16H5V5h14v14zm-9-4l3-3 2 2 4-4-1.41-1.41L15 13.17l-2-2-4.41 4.42L10 15z';
  } else if (cat.includes('cric') || cat.includes('sport') || cat.includes('match') || cat.includes('game')) {
    gradientStart = '#052e16';
    gradientEnd = '#14532d';
    accentColor = '#4ade80';
    badgeBg = 'rgba(74, 222, 128, 0.15)';
    badgeBorder = 'rgba(74, 222, 128, 0.4)';
    label = 'SPORTS & CRICKET';
    subtitle = 'Live Dispatches, Tournaments & Series';
    iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z';
  } else if (cat.includes('cyber') || cat.includes('secur')) {
    gradientStart = '#020617';
    gradientEnd = '#1e293b';
    accentColor = '#22d3ee';
    badgeBg = 'rgba(34, 211, 238, 0.15)';
    badgeBorder = 'rgba(34, 211, 238, 0.4)';
    label = 'CYBERSECURITY';
    subtitle = 'Threat Intelligence & Cryptographic Defense';
    iconPath = 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z';
  } else if (cat.includes('space')) {
    gradientStart = '#030712';
    gradientEnd = '#1e1b4b';
    accentColor = '#a78bfa';
    badgeBg = 'rgba(167, 139, 250, 0.15)';
    badgeBorder = 'rgba(167, 139, 250, 0.4)';
    label = 'SPACE EXPLORATION';
    subtitle = 'Deep Cosmos, Orbital Telescopes & Missions';
    iconPath = 'M12 2.5a9.5 9.5 0 0 1 9.5 9.5c0 5.25-4.25 9.5-9.5 9.5A9.5 9.5 0 0 1 2.5 12C2.5 6.75 6.75 2.5 12 2.5m0-2C5.65 0 .5 5.15.5 11.5S5.65 23 12 23s11.5-5.15 11.5-11.5S18.35.5 12 .5z';
  } else {
    label = (category || 'GENERAL').toUpperCase();
    subtitle = 'NewsSphere Editorial Intelligence & Analysis';
  }

  const gradId = `g_${label.replace(/[^a-zA-Z]/g, '')}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}"/>
        <stop offset="100%" stop-color="${gradientEnd}"/>
      </linearGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="675" fill="url(#${gradId})"/>
    <rect width="1200" height="675" fill="url(#grid)"/>
    <circle cx="950" cy="180" r="300" fill="${accentColor}" opacity="0.08"/>
    <circle cx="200" cy="520" r="260" fill="${accentColor}" opacity="0.06"/>
    
    <!-- Top Editorial Masthead Bar -->
    <text x="80" y="85" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" letter-spacing="3">NEWSSPHERE • EDITORIAL WIRE</text>
    
    <!-- Category Pill Badge -->
    <rect x="80" y="240" width="340" height="48" rx="24" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="1.5"/>
    <circle cx="108" cy="264" r="6" fill="${accentColor}"/>
    <text x="128" y="271" fill="${accentColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" letter-spacing="2">${label}</text>
    
    <!-- Headline Section -->
    <text x="80" y="370" fill="#ffffff" font-family="Georgia, Cambria, serif" font-size="48" font-weight="bold">${label}</text>
    <text x="80" y="420" fill="#cbd5e1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22">${subtitle}</text>
    
    <!-- Bottom Verified Metadata Bar -->
    <line x1="80" y1="575" x2="1120" y2="575" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="80" y="615" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15">AI-Powered Multi-Signal Ranking • Explainable Recommendation</text>
    <text x="1120" y="615" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" text-anchor="end">Live Editorial Wire</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'artificial intelligence': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'science': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'business': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
  'sports': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  'cricket': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  'cybersecurity': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  'space': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'world news': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
  'entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  'health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  'default': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'
};

export const getCategoryFallbackImage = (category?: string): string => {
  if (!category) return getCategorySvg('general');
  const key = category.toLowerCase().trim();
  // Return SVG directly if no verified external URL exists
  return CATEGORY_IMAGE_MAP[key] || getCategorySvg(category);
};

/**
 * Bulletproof image error handler.
 * Completely immune to infinite loops, offline network drops, 404s, and CORS blocks.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  category?: string
): void => {
  const target = e.currentTarget;
  // Step 1: Immediately detach onError callback to eliminate ANY risk of an infinite loop
  target.onerror = null;

  // Step 2: Instantly set self-contained, offline vector graphic
  target.src = getCategorySvg(category);
};
