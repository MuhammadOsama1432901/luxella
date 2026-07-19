// ─── Premium Custom SVG Icon Components ──────────────────────────────────────
// Each icon has a fully distinct visual identity — no two look alike.

interface IconProps {
  size?: number;
  className?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// JEWELRY CATEGORY ICONS
// Each category has a completely different silhouette
// ══════════════════════════════════════════════════════════════════════════════

/** Necklace — U-curve chain with teardrop pendant */
export function NecklaceIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Chain curve */}
      <path d="M3 4C6 4 8 13 12 15.5C16 13 18 4 21 4"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Drop wire */}
      <line x1="12" y1="15.5" x2="12" y2="17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Teardrop pendant */}
      <path d="M12 17.5C12 17.5 9.5 20 9.5 21.5A2.5 2.5 0 0014.5 21.5C14.5 20 12 17.5 12 17.5Z"
        fill="currentColor"/>
      {/* Shine on pendant */}
      <circle cx="11" cy="20" r="0.6" fill="white" opacity="0.7"/>
    </svg>
  );
}

/** Earring — single stud + geometric drop (NOT similar to necklace) */
export function EarringIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Left stud */}
      <circle cx="8" cy="4" r="2.2" fill="currentColor"/>
      <circle cx="7.2" cy="3.2" r="0.7" fill="white" opacity="0.6"/>
      {/* Left wire */}
      <line x1="8" y1="6.2" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Left diamond drop */}
      <polygon points="8,10 11,14 8,20 5,14" fill="currentColor" opacity="0.9"/>
      <polygon points="8,10 11,14 8,13" fill="white" opacity="0.3"/>

      {/* Right stud */}
      <circle cx="16" cy="4" r="2.2" fill="currentColor"/>
      <circle cx="15.2" cy="3.2" r="0.7" fill="white" opacity="0.6"/>
      {/* Right wire */}
      <line x1="16" y1="6.2" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Right diamond drop */}
      <polygon points="16,10 19,14 16,20 13,14" fill="currentColor" opacity="0.9"/>
      <polygon points="16,10 19,14 16,13" fill="white" opacity="0.3"/>
    </svg>
  );
}

/** Ring — classic band viewed from angle with solitaire gem on top */
export function RingIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Ring band — ellipse bottom */}
      <path d="M5 16C5 19.3 8.1 22 12 22C15.9 22 19 19.3 19 16C19 12.7 15.9 10 12 10C8.1 10 5 12.7 5 16Z"
        stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Band thickness top line */}
      <path d="M5 16C5 12.7 8.1 10 12 10C15.9 10 19 12.7 19 16"
        stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.15"/>
      {/* Gem setting prongs */}
      <path d="M9 10L12 4L15 10" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
      {/* Gem */}
      <polygon points="12,3 15,6 14,9 10,9 9,6" fill="currentColor"/>
      <polygon points="12,3 15,6 12,5.5" fill="white" opacity="0.5"/>
      <polygon points="12,3 9,6 12,5.5" fill="white" opacity="0.25"/>
    </svg>
  );
}

/** Bracelet — horizontal oval bangle (NOT an ellipse like ring) */
export function BraceletIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Bangle band */}
      <rect x="2" y="9" width="20" height="6" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Clasp / charm on left */}
      <circle cx="5" cy="12" r="2" fill="currentColor"/>
      <circle cx="4.3" cy="11.3" r="0.7" fill="white" opacity="0.6"/>
      {/* Gems along the top */}
      <circle cx="10" cy="9" r="1.2" fill="currentColor" opacity="0.6"/>
      <circle cx="14" cy="9" r="1.2" fill="currentColor" opacity="0.6"/>
      <circle cx="18" cy="9" r="1.2" fill="currentColor" opacity="0.6"/>
      {/* Inner shine */}
      <rect x="3" y="10" width="18" height="2" rx="1" fill="currentColor" opacity="0.12"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAVIGATION ICONS
// ══════════════════════════════════════════════════════════════════════════════

/** Cart — shopping bag with handles */
export function CartIcon({ size = 22, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 01-8 0"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** User — person silhouette with body curve */
export function UserIcon({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

/** Menu — three lines tapering right (staircase, NOT standard hamburger) */
export function MenuIcon({ size = 22, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="7" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="11" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BRAND / DECORATIVE ICONS
// These must each look completely different from each other
// ══════════════════════════════════════════════════════════════════════════════

/** Logo Gem — faceted square diamond (45° rotated square with internal cuts) */
export function LogoGemIcon({ size = 22, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Outer diamond square */}
      <polygon points="12,1 23,12 12,23 1,12"
        stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.18" strokeLinejoin="round"/>
      {/* Top facet */}
      <polygon points="12,1 18,8 6,8" fill="currentColor" fillOpacity="0.35"/>
      {/* Left facet */}
      <polygon points="1,12 6,8 6,16" fill="currentColor" fillOpacity="0.15"/>
      {/* Right facet */}
      <polygon points="23,12 18,8 18,16" fill="currentColor" fillOpacity="0.15"/>
      {/* Center cross-lines */}
      <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
      <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
      {/* Centre sparkle dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

/** Chat Gem — hexagon gem (for ChatWidget float button, different from LogoGem) */
export function ChatGemIcon({ size = 22, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Hexagon */}
      <polygon points="12,2 20,7 20,17 12,22 4,17 4,7"
        stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15" strokeLinejoin="round"/>
      {/* Top face highlight */}
      <polygon points="12,2 20,7 12,12 4,7" fill="currentColor" fillOpacity="0.28"/>
      {/* Center horizontal line */}
      <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
      {/* Vertical centre line */}
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.25"/>
      {/* Inner sparkle cross */}
      <path d="M12 9L12.6 11.4L15 12L12.6 12.6L12 15L11.4 12.6L9 12L11.4 11.4Z"
        fill="currentColor"/>
    </svg>
  );
}

/** Sparkle — 4-point burst star (for Lexa AI avatar, clearly a star NOT a gem) */
export function SparkleIcon({ size = 20, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Main 4-pointed star */}
      <path d="M12 2L13.8 10.2L22 12L13.8 13.8L12 22L10.2 13.8L2 12L10.2 10.2Z"
        fill="currentColor" strokeLinejoin="round"/>
      {/* Small top-right sparkle */}
      <path d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2Z"
        fill="currentColor" opacity="0.55"/>
      {/* Small bottom-left sparkle */}
      <path d="M4 17L4.5 18.5L6 19L4.5 19.5L4 21L3.5 19.5L2 19L3.5 18.5Z"
        fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTION ICONS
// Every one must look instantly recognisable and different
// ══════════════════════════════════════════════════════════════════════════════

/** Send — diagonal paper-plane triangle */
export function SendIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill="currentColor" fillOpacity="0.15"/>
    </svg>
  );
}

/** Close — bold X */
export function CloseIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  );
}

/** Minimize — compress-to-center arrows (4 inward arrows) */
export function MinimizeIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* top-left inward */}
      <path d="M9 9L3 3M3 3h5M3 3v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* top-right inward */}
      <path d="M15 9L21 3M21 3h-5M21 3v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* bottom-left inward */}
      <path d="M9 15L3 21M3 21h5M3 21v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* bottom-right inward */}
      <path d="M15 15L21 21M21 21h-5M21 21v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Download — tray with downward arrow INTO it */
export function DownloadIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Arrow down */}
      <path d="M12 3v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M7 10l5 6 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Tray */}
      <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Camera — distinct viewfinder shape */
export function CameraIcon({ size = 28, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        fill="currentColor" fillOpacity="0.08"/>
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8"/>
      {/* Lens shine */}
      <circle cx="10.5" cy="11.5" r="1.2" fill="currentColor" opacity="0.35"/>
    </svg>
  );
}

/** Upload — cloud with upward arrow (different container from Download's tray) */
export function UploadIcon({ size = 48, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Cloud */}
      <path d="M18 15a4 4 0 000-8h-.5A6 6 0 106 15"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrow up */}
      <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 16l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Try-On Refresh — magic wand with sparkle trail (NOT circular arrows) */
export function RefreshIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Wand stick */}
      <line x1="4" y1="20" x2="14" y2="10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      {/* Wand handle grip */}
      <line x1="4" y1="20" x2="6" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      {/* Star tip */}
      <polygon points="14,4 15.2,7.5 19,7.5 16.2,9.5 17.2,13 14,11 10.8,13 11.8,9.5 9,7.5 12.8,7.5"
        fill="currentColor"/>
      {/* Sparkles */}
      <circle cx="19" cy="15" r="1.2" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="11" r="0.8" fill="currentColor" opacity="0.4"/>
      <circle cx="18" cy="19" r="0.8" fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

/** Reset photo — trash bin (clearly delete, NOT rotation) */
export function ResetIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Chevron right — simple > caret */
export function ChevronRightIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Spinner — arc spinner for loading (self-animating) */
export function SpinnerIcon({ size = 22, className = "" }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={["animate-spin", className].join(" ")}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.15"/>
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
