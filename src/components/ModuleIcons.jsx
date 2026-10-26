import { metaFor } from '../content/meta';
// Duotone line icons for each module (24x24). Strokes use currentColor; soft fills are currentColor at low opacity.

const F = { fill: 'currentColor', fillOpacity: 0.28, stroke: 'none' };

const icons = {
  start: (<>
    <path d="M12 2.5c3.2 2.2 4.6 6 3.8 10.5H8.2C7.4 8.5 8.8 4.7 12 2.5Z" {...F} />
    <path d="M12 2.5c3.2 2.2 4.6 6 3.8 10.5H8.2C7.4 8.5 8.8 4.7 12 2.5Z" />
    <circle cx="12" cy="8.5" r="1.8" />
    <path d="M8.2 11 5.5 14.5l3 .2M15.8 11l2.7 3.5-3 .2M10 16.5c.5 2 1.2 3.4 2 4.5.8-1.1 1.5-2.5 2-4.5" />
  </>),
  'ai-coder': (<>
    <rect x="2.5" y="4" width="19" height="16" rx="3" {...F} />
    <rect x="2.5" y="4" width="19" height="16" rx="3" />
    <path d="m7 10 3 2.5L7 15M12.5 15.5H17" />
  </>),
  accounts: (<>
    <rect x="2.5" y="5" width="13" height="14" rx="2.5" {...F} />
    <rect x="2.5" y="5" width="13" height="14" rx="2.5" />
    <circle cx="9" cy="10.5" r="2.2" />
    <path d="M5.5 16c.7-1.6 2-2.4 3.5-2.4s2.8.8 3.5 2.4" />
    <circle cx="18" cy="12" r="2.6" />
    <path d="M18 14.6V21m0-3h2" />
  </>),
  plan: (<>
    <rect x="3" y="4" width="5" height="16" rx="1.5" {...F} />
    <rect x="3" y="4" width="5" height="16" rx="1.5" />
    <rect x="9.5" y="4" width="5" height="10" rx="1.5" />
    <rect x="16" y="4" width="5" height="13" rx="1.5" {...F} />
    <rect x="16" y="4" width="5" height="13" rx="1.5" />
  </>),
  build: (<>
    <rect x="2.5" y="3.5" width="19" height="17" rx="3" {...F} />
    <rect x="2.5" y="3.5" width="19" height="17" rx="3" />
    <path d="M2.5 8h19M9.5 11.5 7 14l2.5 2.5M14.5 11.5 17 14l-2.5 2.5M12.7 11l-1.4 6" />
  </>),
  ui: (<>
    <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 1.8-1 1.4-2.1-.5-1.3.3-2.4 1.7-2.4h2.1c2 0 3.3-1.5 3.3-3.5 0-5-3.8-9-8.5-9Z" {...F} />
    <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 1.8-1 1.4-2.1-.5-1.3.3-2.4 1.7-2.4h2.1c2 0 3.3-1.5 3.3-3.5 0-5-3.8-9-8.5-9Z" />
    <circle cx="7.8" cy="11.5" r="1.2" /><circle cx="10.5" cy="7.6" r="1.2" /><circle cx="15" cy="7.8" r="1.2" />
  </>),
  blocks: (<>
    <path d="m12 3 8.5 4.2L12 11.4 3.5 7.2Z" {...F} />
    <path d="m12 3 8.5 4.2L12 11.4 3.5 7.2Z" />
    <path d="m3.5 11.6 8.5 4.2 8.5-4.2M3.5 16l8.5 4.2 8.5-4.2" />
  </>),
  'data-money': (<>
    <ellipse cx="9.5" cy="5.5" rx="6" ry="2.5" {...F} />
    <ellipse cx="9.5" cy="5.5" rx="6" ry="2.5" />
    <path d="M3.5 5.5v11c0 1.4 2.7 2.5 6 2.5M3.5 11c0 1.4 2.7 2.5 6 2.5M15.5 5.5V9" />
    <rect x="12" y="12" width="9.5" height="7" rx="1.5" {...F} />
    <rect x="12" y="12" width="9.5" height="7" rx="1.5" />
    <path d="M12 14.5h9.5" />
  </>),
  live: (<>
    <circle cx="12" cy="12" r="9" {...F} />
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.6 5.6 3.6 9s-1.1 6.4-3.6 9c-2.5-2.6-3.6-5.6-3.6-9S9.5 5.6 12 3Z" />
  </>),
  secure: (<>
    <path d="M12 2.8 19.5 5.6v6c0 4.6-3.1 8-7.5 9.6-4.4-1.6-7.5-5-7.5-9.6v-6Z" {...F} />
    <path d="M12 2.8 19.5 5.6v6c0 4.6-3.1 8-7.5 9.6-4.4-1.6-7.5-5-7.5-9.6v-6Z" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
    <path d="M10.2 11V9.6a1.8 1.8 0 0 1 3.6 0V11" />
  </>),
  'grown-up': (<>
    <rect x="4.5" y="4" width="15" height="17" rx="2.5" {...F} />
    <rect x="4.5" y="4" width="15" height="17" rx="2.5" />
    <path d="M9 4V2.8h6V4M8 10l1.5 1.5L12.5 8.5M8 15.5l1.5 1.5 3-3M14.5 10.5H16M14.5 16H16" />
  </>),
  'save-money': (<>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" {...F} />
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
    <path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3" />
    <rect x="9.8" y="9.8" width="4.4" height="4.4" rx=".8" />
  </>),
  agents: (<>
    <rect x="4" y="7" width="16" height="12" rx="4" {...F} />
    <rect x="4" y="7" width="16" height="12" rx="4" />
    <path d="M12 7V4M2 12v3M22 12v3" />
    <circle cx="12" cy="3.2" r="1" />
    <circle cx="9" cy="12.5" r="1.3" /><circle cx="15" cy="12.5" r="1.3" />
    <path d="M9.5 16h5" />
  </>),
  'ai-products': (<>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4V16A2.5 2.5 0 0 1 4 13.5Z" {...F} />
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4V16A2.5 2.5 0 0 1 4 13.5Z" />
    <path d="M12 6.5c.4 1.6.9 2.1 2.5 2.5-1.6.4-2.1.9-2.5 2.5-.4-1.6-.9-2.1-2.5-2.5 1.6-.4 2.1-.9 2.5-2.5Z" />
  </>),
  'github-pro': (<>
    <circle cx="6.5" cy="5.5" r="2.3" {...F} /><circle cx="17.5" cy="9" r="2.3" {...F} />
    <circle cx="6.5" cy="5.5" r="2.3" /><circle cx="6.5" cy="18.5" r="2.3" /><circle cx="17.5" cy="9" r="2.3" />
    <path d="M6.5 7.8v8.4M17.5 11.3c0 3.5-4 3.2-9.2 5.8" />
  </>),
  capstone: (<>
    <path d="M4 10.5V20h16v-9.5" {...F} />
    <path d="M4 10.5V20h16v-9.5M3 5h18l-1.5 4.5a2.5 2.5 0 0 1-4.7.4 2.5 2.5 0 0 1-4.6 0 2.5 2.5 0 0 1-4.7-.4Z" />
    <path d="M10 20v-5h4v5" />
  </>),
};

export default function ModuleIcon({ moduleId, size = 20, color = '#fff', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color, display: 'block' }}>
      {icons[moduleId] || icons[metaFor(moduleId).art] || icons.start}
    </svg>
  );
}
