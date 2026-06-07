const Svg = ({ size = 18, color = 'currentColor', className = '', strokeWidth = 2, children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ flexShrink: 0 }}
  >
    {children}
  </svg>
);

export const I = {
  Cart:      (p) => <Svg {...p}><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></Svg>,
  Search:    (p) => <Svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></Svg>,
  MapPin:    (p) => <Svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></Svg>,
  Car:       (p) => <Svg {...p}><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></Svg>,
  Bus:       (p) => <Svg {...p}><path d="M8 6v6m8-6v6M2 12h20M18 18h2a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M9 18h6"/></Svg>,
  Bike:      (p) => <Svg {...p}><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 100-2 1 1 0 000 2zm-3 11.5L9 7H6"/><path d="M9 7l6 4.5M15 6l3 5.5H12"/></Svg>,
  Walk:      (p) => <Svg {...p}><circle cx="12" cy="5" r="1"/><path d="M9 20l1.5-6-2.5-3 4-4 3 3h3M10.5 20h3"/><path d="M7.5 8l-2.5 4h5"/></Svg>,
  Plus:      (p) => <Svg {...p}><path d="M12 5v14M5 12h14"/></Svg>,
  X:         (p) => <Svg {...p}><path d="M18 6 6 18M6 6l12 12"/></Svg>,
  Check:     (p) => <Svg {...p}><path d="M20 6 9 17l-5-5"/></Svg>,
  Sparkles:  (p) => <Svg {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75zM19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/></Svg>,
  TrendDown: (p) => <Svg {...p}><path d="M22 17l-9.5-9.5-5 5L1 6"/><path d="M16 17h6v-6"/></Svg>,
  Award:     (p) => <Svg {...p}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></Svg>,
  Download:  (p) => <Svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></Svg>,
  Swap:      (p) => <Svg {...p}><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></Svg>,
  Tag:       (p) => <Svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></Svg>,
  Spinner:   (p) => <Svg {...p} className={(p.className || '') + ' anim-spin'}><path d="M21 12a9 9 0 11-6.219-8.56"/></Svg>,
  Clock:     (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Svg>,
  Users:     (p) => <Svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Svg>,
  Banknote:  (p) => <Svg {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></Svg>,
  Leaf:      (p) => <Svg {...p}><path d="M2 22c1-1 2-5 6-9 4-4 8-6 12-7-1 4-3 8-7 12-4 4-10 4-11 4zM12 10c-1.5 1.5-2 3-2 5"/></Svg>,
  Play:      (p) => <Svg {...p}><polygon points="5 3 19 12 5 21 5 3"/></Svg>,
  Store:     (p) => <Svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>,
  Grid:      (p) => <Svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Svg>,
  Trash:     (p) => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></Svg>,
  ChevDown:  (p) => <Svg {...p}><path d="M6 9l6 6 6-6"/></Svg>,
  ChevUp:    (p) => <Svg {...p}><path d="M18 15l-6-6-6 6"/></Svg>,
  Zap:       (p) => <Svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>,
  Percent:   (p) => <Svg {...p}><path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/></Svg>,
  Fire:      (p) => <Svg {...p}><path d="M12 12c-2-2.5-4-5-2-8 0 0 2.5 1 3 3.5 1-2 2.5-3 3.5-4 0 3 1.5 5 .5 7.5-1 2.5-3 4-5 1zm0 0c-1 2-2 3-2 5a4 4 0 008 0c0-2-1-3-2-5"/></Svg>,
  Info:      (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></Svg>,
  LocPin:    (p) => <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></Svg>,
  Navigation:(p) => <Svg {...p}><polygon points="3 11 22 2 13 21 11 13 3 11"/></Svg>,
  AlertCircle:(p)=> <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>,
};
