const fs = require('fs');
const path = require('path');

const logos = {
  'company-fpt.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(14, 20)">
    <!-- FPT 3-color curves -->
    <path d="M6 38 C6 20, 20 10, 32 10 C32 19, 23 27, 23 38 C23 48, 30 52, 24 58 C14 58, 6 50, 6 38 Z" fill="#005A9C"/>
    <path d="M34 10 C46 10, 56 20, 56 34 C56 46, 46 54, 36 54 C36 44, 44 38, 44 30 C44 20, 36 18, 34 10 Z" fill="#F37021"/>
    <path d="M58 34 C68 22, 82 24, 88 34 C82 42, 74 42, 70 50 C66 56, 68 62, 58 60 C58 50, 64 42, 58 34 Z" fill="#009639"/>
    <!-- FPT Letters -->
    <text x="46" y="44" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" font-style="italic" letter-spacing="1">FPT</text>
  </g>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="12" fill="#005A9C" text-anchor="middle" letter-spacing="1.5">SOFTWARE</text>
</svg>`,

  'company-techcombank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Left Chevron -->
    <path d="M-8 -26 L-28 -6 L-8 14 L-1 14 L-17 -6 L-1 -26 Z" fill="#ED1C24"/>
    <!-- Right Chevron -->
    <path d="M8 -26 L28 -6 L8 14 L1 14 L17 -6 L1 -26 Z" fill="#ED1C24"/>
    <!-- Center Red Diamond -->
    <polygon points="0,-14 8,-6 0,2 -8,-6" fill="#ED1C24"/>
  </g>
  <text x="60" y="85" font-family="'Inter', -apple-system, sans-serif" font-weight="800" font-size="10.5" fill="#ED1C24" text-anchor="middle" letter-spacing="0.5">TECHCOM</text>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="800" font-size="10" fill="#1E293B" text-anchor="middle" letter-spacing="1">BANK</text>
</svg>`,

  'company-vng.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <defs>
    <linearGradient id="vngGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7A00"/>
      <stop offset="100%" stop-color="#FF3D00"/>
    </linearGradient>
  </defs>
  <g transform="translate(60, 48)">
    <path d="M-28 -24 L-8 22 L8 22 L28 -24 L14 -24 L0 10 L-14 -24 Z" fill="url(#vngGrad)"/>
    <circle cx="0" cy="-14" r="5" fill="#FF7A00"/>
  </g>
  <text x="60" y="95" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="18" fill="#FF5500" text-anchor="middle" letter-spacing="2">VNG</text>
</svg>`,

  'company-zalo.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#0068FF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 56)">
    <!-- White speech bubble shape -->
    <path d="M-40 -26 C-40 -40, -22 -44, 0 -44 C22 -44, 40 -40, 40 -26 C40 -12, 22 2, 0 2 C-8 2, -18 0, -26 -4 L-36 6 L-34 -8 C-38 -13, -40 -19, -40 -26 Z" fill="#FFFFFF" opacity="0.15"/>
  </g>
  <text x="60" y="68" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">Zalo</text>
  <circle cx="94" cy="48" r="4.5" fill="#FFFFFF"/>
</svg>`,

  'company-viettel.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#EE0033"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 52)">
    <!-- Iconic Viettel curved V ribbon -->
    <path d="M-36 -16 L-20 20 L-4 20 L-16 -16 Z" fill="#FFFFFF"/>
    <circle cx="1" cy="-14" r="5" fill="#FFFFFF"/>
    <path d="M-2 -3 L6 -3 C16 -3, 22 3, 22 11 C22 19, 16 25, 6 25 L-2 25 Z M7 6 L6 6 L6 16 L7 16 C11 16, 13 14, 13 11 C13 8, 11 6, 7 6 Z" fill="#FFFFFF"/>
  </g>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">viettel</text>
</svg>`,

  'company-shopee.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#EE4D2D"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 52)">
    <!-- Bag handles -->
    <path d="M-14 -16 C-14 -28, 14 -28, 14 -16" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
    <!-- Bag body -->
    <path d="M-26 -16 L26 -16 L22 30 C22 34, 18 36, 14 36 L-14 36 C-18 36, -22 34, -22 30 Z" fill="#FFFFFF"/>
    <!-- S on bag -->
    <text x="0" y="24" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="28" fill="#EE4D2D" text-anchor="middle">S</text>
  </g>
  <text x="60" y="104" font-family="'Inter', -apple-system, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">SHOPEE</text>
</svg>`,

  'company-momo.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#A50064"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 60)">
    <text x="0" y="-8" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">mo</text>
    <text x="0" y="24" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">mo</text>
  </g>
</svg>`,

  'company-vnpay.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <!-- VNPAY curved ribbons -->
    <path d="M-30 -20 C-10 -28, 10 -20, 26 -4 L16 4 C6 -8, -10 -12, -24 -6 Z" fill="#005BAA"/>
    <path d="M-26 4 C-10 16, 12 16, 30 4 L24 -4 C8 6, -6 6, -18 -4 Z" fill="#E31B23"/>
    <circle cx="-2" cy="-2" r="6" fill="#005BAA"/>
  </g>
  <g transform="translate(60, 94)">
    <text x="-16" y="0" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#005BAA" text-anchor="middle">VN</text>
    <text x="14" y="0" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#E31B23" text-anchor="middle">PAY</text>
  </g>
</svg>`,

  'company-vingroup.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#C8102E"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 50)">
    <!-- Circle badge -->
    <circle cx="0" cy="0" r="32" fill="#BA0C2F" stroke="#D4AF37" stroke-width="2.5"/>
    <!-- Golden Winged V -->
    <path d="M-22 -8 C-14 4, -4 14, 0 20 C4 14, 14 4, 22 -8 C14 -4, 4 -2, 0 6 C-4 -2, -14 -4, -22 -8 Z" fill="#FFD700"/>
    <!-- Center Star -->
    <polygon points="0,-18 3,-10 11,-10 5,-4 7,4 0,0 -7,4 -5,-4 -11,-10 -3,-10" fill="#FFD700"/>
  </g>
  <text x="60" y="100" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">VINGROUP</text>
</svg>`,

  'company-vinai.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#0F172A"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#334155" stroke-width="2"/>
  <defs>
    <linearGradient id="vinaiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="100%" stop-color="#4FACFE"/>
    </linearGradient>
  </defs>
  <g transform="translate(60, 48)">
    <!-- AI Neural geometric V -->
    <path d="M-24 -20 L-6 18 L6 18 L24 -20 L12 -20 L0 8 L-12 -20 Z" fill="url(#vinaiGrad)"/>
    <circle cx="0" cy="-6" r="4.5" fill="#00F2FE"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">Vin<tspan fill="#00F2FE">AI</tspan></text>
</svg>`,

  'company-vinfast.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#1E293B"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#475569" stroke-width="2"/>
  <defs>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
  </defs>
  <g transform="translate(60, 48)">
    <path d="M-32 -18 L-22 -18 L-8 16 L8 16 L22 -18 L32 -18 L14 24 L-14 24 Z" fill="url(#silverGrad)"/>
    <path d="M-14 -18 L-4 6 L4 6 L14 -18 L8 -18 L0 0 L-8 -18 Z" fill="url(#silverGrad)"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">VINFAST</text>
</svg>`,

  'company-cmc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <!-- 3 CMC Petals -->
    <path d="M-16 -18 C-4 -26, 12 -22, 20 -10 C14 -8, 6 -12, -4 -10 Z" fill="#00A3E0"/>
    <path d="M-22 4 C-26 -10, -18 -20, -6 -24 C-8 -16, -6 -8, -12 2 Z" fill="#0066B2"/>
    <path d="M12 18 C-4 22, -18 14, -20 0 C-12 4, -4 4, 6 -2 Z" fill="#002D62"/>
  </g>
  <text x="60" y="86" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="18" fill="#002D62" text-anchor="middle" letter-spacing="1">CMC</text>
  <text x="60" y="100" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="9" fill="#00A3E0" text-anchor="middle" letter-spacing="1.5">TELECOM</text>
</svg>`,

  'company-basevn.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#183B7E"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 50)">
    <!-- Base.vn stylized B -->
    <path d="M-16 -24 L4 -24 C14 -24, 22 -18, 22 -8 C22 0, 16 6, 8 8 C18 10, 24 18, 24 28 C24 38, 14 44, 2 44 L-16 44 Z" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="2" cy="-6" r="3" fill="#FF7A00"/>
    <circle cx="4" cy="24" r="3" fill="#00D2D3"/>
  </g>
  <text x="60" y="102" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">Base.vn</text>
</svg>`,

  'company-onemount.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Origami 1 mark -->
    <polygon points="-18,-24 0,-34 0,22 -18,12" fill="#E52331"/>
    <polygon points="0,-34 18,-24 18,12 0,22" fill="#A8101E"/>
    <polygon points="0,-10 18,-20 0,-30 -18,-20" fill="#FF4D5E"/>
  </g>
  <text x="60" y="86" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="11" fill="#0F172A" text-anchor="middle" letter-spacing="1">ONE MOUNT</text>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="9" fill="#E52331" text-anchor="middle" letter-spacing="2">GROUP</text>
</svg>`,

  'company-kms.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#1E293B"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#334155" stroke-width="2"/>
  <g transform="translate(60, 50)">
    <!-- KMS Monogram -->
    <text x="0" y="8" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">K<tspan fill="#DC2626">M</tspan>S</text>
    <rect x="-24" y="16" width="48" height="3" fill="#DC2626" rx="1.5"/>
  </g>
  <text x="60" y="94" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="9" fill="#94A3B8" text-anchor="middle" letter-spacing="2">TECHNOLOGY</text>
</svg>`,

  'company-tiki.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#1A94FF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 52)">
    <!-- Smiling Eyes -->
    <circle cx="-14" cy="-14" r="4.5" fill="#FFFFFF"/>
    <circle cx="14" cy="-14" r="4.5" fill="#FFFFFF"/>
    <!-- Big Tiki Smile -->
    <path d="M-22 0 C-18 18, 18 18, 22 0" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
  </g>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">tiki</text>
</svg>`,

  'company-masan.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <!-- Masan dynamic wings -->
    <path d="M-26 -12 C-8 -22, 12 -22, 28 -8 C18 -12, -2 -14, -18 -6 Z" fill="#003399"/>
    <path d="M-28 2 C-10 -6, 10 -6, 26 8 C16 4, -4 2, -20 10 Z" fill="#0055D4"/>
    <circle cx="0" cy="-6" r="4" fill="#E52331"/>
  </g>
  <text x="60" y="86" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#003399" text-anchor="middle" letter-spacing="2">MASAN</text>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="8.5" fill="#64748B" text-anchor="middle" letter-spacing="1.5">CONSUMER</text>
</svg>`,

  'company-nashtech.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 52)">
    <!-- Red Chevron/Rhombus mark -->
    <polygon points="-12,-20 0,-32 12,-20 0,-8" fill="#D32F2F"/>
    <polygon points="-24,-8 -12,-20 0,-8 -12,4" fill="#212121"/>
    <polygon points="0,-8 12,-20 24,-8 12,4" fill="#212121"/>
  </g>
  <text x="60" y="88" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="14" fill="#212121" text-anchor="middle" letter-spacing="0.5">Nash<tspan fill="#D32F2F">Tech</tspan></text>
</svg>`,

  'company-mbbank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#003B70"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <!-- MB Asterisk / Star Stripes -->
    <rect x="-4" y="-24" width="8" height="48" rx="4" fill="#DA251C"/>
    <rect x="-4" y="-24" width="8" height="48" rx="4" fill="#FFFFFF" transform="rotate(60)"/>
    <rect x="-4" y="-24" width="8" height="48" rx="4" fill="#00A3E0" transform="rotate(120)"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">MB</text>
</svg>`,

  'company-vinamilk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#00509E"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 56)">
    <!-- Circle border badge -->
    <circle cx="0" cy="-6" r="34" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="3 3"/>
    <circle cx="0" cy="-6" r="30" fill="#003D7A"/>
    <text x="0" y="-1" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">VINAMILK</text>
    <text x="0" y="12" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="7" fill="#88C4FF" text-anchor="middle" letter-spacing="1.5">EST. 1976</text>
  </g>
  <text x="60" y="104" font-family="'Inter', -apple-system, sans-serif" font-weight="800" font-size="9" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">VIETNAM</text>
</svg>`,

  'company-bosch.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Bosch Armature Circle -->
    <circle cx="0" cy="0" r="24" fill="none" stroke="#EA1C24" stroke-width="4.5"/>
    <rect x="-18" y="-7" width="36" height="14" rx="2" fill="none" stroke="#EA1C24" stroke-width="4"/>
    <line x1="0" y1="-24" x2="0" y2="24" stroke="#EA1C24" stroke-width="4"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="15" fill="#EA1C24" text-anchor="middle" letter-spacing="2">BOSCH</text>
</svg>`,

  'company-unilever.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <!-- Unilever Iconic U -->
    <path d="M-24 -24 C-24 16, -16 26, 0 26 C16 26, 24 16, 24 -24 L14 -24 C14 10, 8 16, 0 16 C-8 16, -14 10, -14 -24 Z" fill="#1F36C7"/>
    <circle cx="-16" cy="-28" r="3.5" fill="#1F36C7"/>
    <circle cx="16" cy="-28" r="3.5" fill="#1F36C7"/>
    <circle cx="0" cy="6" r="3" fill="#1F36C7"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="800" font-size="11" fill="#1F36C7" text-anchor="middle" letter-spacing="1">Unilever</text>
</svg>`,

  'company-vpbank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Blooming Flower -->
    <path d="M0 -22 C-14 -12, -18 6, 0 20 C18 6, 14 -12, 0 -22 Z" fill="#DA251C"/>
    <path d="M-14 -8 C-22 4, -12 18, 0 20 C-10 12, -14 2, -14 -8 Z" fill="#FF5E57"/>
    <path d="M14 -8 C22 4, 12 18, 0 20 C10 12, 14 2, 14 -8 Z" fill="#B31A12"/>
  </g>
  <g transform="translate(60, 92)">
    <text x="-14" y="0" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="14" fill="#008853" text-anchor="middle">VP</text>
    <text x="14" y="0" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="14" fill="#DA251C" text-anchor="middle">Bank</text>
  </g>
</svg>`,

  'company-gemadept.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#00387A"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <!-- Gemadept G & Arrow -->
    <circle cx="0" cy="0" r="22" fill="none" stroke="#FFFFFF" stroke-width="5"/>
    <rect x="0" y="-3" width="16" height="6" fill="#FFFFFF"/>
    <polygon points="12,-10 24,0 12,10" fill="#ED1C24"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">GEMADEPT</text>
</svg>`,

  'company-vnpt.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#0072CE"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Globe lines -->
    <circle cx="0" cy="0" r="22" fill="none" stroke="#FFFFFF" stroke-width="3"/>
    <ellipse cx="0" cy="0" rx="12" ry="22" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>
    <line x1="-22" y1="0" x2="22" y2="0" stroke="#FFFFFF" stroke-width="2.5"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">VNPT</text>
</svg>`,

  'company-samsung.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#1428A0"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 56) rotate(-10)">
    <ellipse cx="0" cy="0" rx="46" ry="26" fill="#0C1B75" stroke="#FFFFFF" stroke-width="2"/>
  </g>
  <text x="60" y="62" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">SAMSUNG</text>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="9" fill="#93C5FD" text-anchor="middle" letter-spacing="1">R&amp;D CENTER</text>
</svg>`,

  'company-orion.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#E52421"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <circle cx="0" cy="0" r="24" fill="#C21A17" stroke="#FFC72C" stroke-width="2"/>
    <polygon points="0,-16 4,-4 16,-4 7,3 10,15 0,8 -10,15 -7,3 -16,-4 -4,-4" fill="#FFC72C"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">ORION</text>
</svg>`,

  'company-ssi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Interlocking blocks -->
    <rect x="-18" y="-18" width="16" height="16" rx="2" fill="#C8102E"/>
    <rect x="2" y="-18" width="16" height="16" rx="2" fill="#EAAA00"/>
    <rect x="-18" y="2" width="16" height="16" rx="2" fill="#EAAA00"/>
    <rect x="2" y="2" width="16" height="16" rx="2" fill="#C8102E"/>
  </g>
  <text x="60" y="92" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="18" fill="#C8102E" text-anchor="middle" letter-spacing="2">SSI</text>
</svg>`,

  'company-mwg.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FED100"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#EAB308" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <circle cx="0" cy="0" r="26" fill="#212121"/>
    <!-- Yellow running man silhouette -->
    <circle cx="-2" cy="-14" r="3.5" fill="#FED100"/>
    <path d="M-6 -8 L2 -6 L-2 4 L-8 12" stroke="#FED100" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M2 -6 L8 0 L6 14" stroke="#FED100" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="12" fill="#212121" text-anchor="middle" letter-spacing="1">MWG</text>
</svg>`,

  'company-sungroup.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#2B1E16"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#443024" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Sunburst circle -->
    <circle cx="0" cy="0" r="16" fill="#C5A059"/>
    <circle cx="0" cy="0" r="22" fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="2 4"/>
  </g>
  <text x="60" y="86" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="11" fill="#C5A059" text-anchor="middle" letter-spacing="1.5">SUN GROUP</text>
</svg>`,

  'company-vccorp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- VCCorp ribbons -->
    <path d="M-22 -14 C-10 -22, 10 -22, 22 -6 L14 2 C6 -10, -6 -10, -14 -2 Z" fill="#FF4500"/>
    <path d="M-18 4 C-8 16, 12 16, 24 2 L16 -4 C6 6, -6 6, -12 -2 Z" fill="#0066CC"/>
  </g>
  <text x="60" y="92" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="15" fill="#0066CC" text-anchor="middle" letter-spacing="1">VC<tspan fill="#FF4500">Corp</tspan></text>
</svg>`,

  'company-mailinh.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#008000"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <circle cx="0" cy="0" r="24" fill="#006800" stroke="#FFD700" stroke-width="2.5"/>
    <text x="0" y="8" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">ML</text>
  </g>
  <text x="60" y="96" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="12" fill="#FFD700" text-anchor="middle" letter-spacing="1">MAI LINH</text>
</svg>`,

  'company-datxanh.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Layered Green & Blue Diamond -->
    <polygon points="0,-22 20,-2 0,18 -20,-2" fill="#007A3D"/>
    <polygon points="0,-14 12,0 0,14 -12,0" fill="#005BAA"/>
  </g>
  <text x="60" y="86" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="11" fill="#007A3D" text-anchor="middle" letter-spacing="0.5">ĐẤT XANH</text>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="8.5" fill="#005BAA" text-anchor="middle" letter-spacing="1.5">GROUP</text>
</svg>`,

  'company-pwc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- PwC colored cubes -->
    <rect x="-18" y="-18" width="12" height="12" fill="#DC6900"/>
    <rect x="-4" y="-18" width="12" height="12" fill="#EB8C00"/>
    <rect x="10" y="-18" width="12" height="12" fill="#F3BE00"/>
    <rect x="-18" y="-4" width="12" height="12" fill="#E0301E"/>
    <rect x="-4" y="-4" width="12" height="12" fill="#D04A02"/>
  </g>
  <text x="60" y="88" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="22" fill="#2D2D2D" text-anchor="middle" letter-spacing="1">pwc</text>
</svg>`,

  'company-vietcombank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- 3D loop diamond in emerald green -->
    <path d="M0 -22 C-14 -10, -20 4, -14 14 C-8 24, 8 24, 14 14 C20 4, 14 -10, 0 -22 Z" fill="none" stroke="#007833" stroke-width="7"/>
    <circle cx="0" cy="4" r="4" fill="#007833"/>
  </g>
  <text x="60" y="92" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="10.5" fill="#007833" text-anchor="middle" letter-spacing="0.5">Vietcombank</text>
</svg>`,

  'company-dentsu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#000000"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#333333" stroke-width="2"/>
  <g transform="translate(60, 52)">
    <circle cx="0" cy="-10" r="14" fill="#E50012"/>
  </g>
  <text x="60" y="84" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">dentsu</text>
</svg>`,

  'company-tanadaithanh.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#005BAA"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <g transform="translate(60, 48)">
    <polygon points="0,-22 6,-6 22,-6 10,4 14,20 0,10 -14,20 -10,4 -22,-6 -6,-6" fill="#00D2D3"/>
    <circle cx="0" cy="0" r="6" fill="#FFFFFF"/>
  </g>
  <text x="60" y="94" font-family="'Inter', -apple-system, sans-serif" font-weight="800" font-size="9.5" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">TÂN Á ĐẠI THÀNH</text>
</svg>`,

  'company-beelogistics.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFCC00"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#EAB308" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Bee Stripes Hexagon -->
    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="#1E1E1E"/>
    <circle cx="-5" cy="-5" r="2.5" fill="#FFCC00"/>
    <circle cx="5" cy="-5" r="2.5" fill="#FFCC00"/>
    <rect x="-12" y="2" width="24" height="4" fill="#FFCC00" rx="2"/>
  </g>
  <text x="60" y="94" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="10" fill="#1E1E1E" text-anchor="middle" letter-spacing="1">BEE LOGISTICS</text>
</svg>`,

  'company-saigonretail.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="#FFFFFF"/>
  <rect x="1" y="1" width="118" height="118" rx="15" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 46)">
    <!-- Red and Blue Clover -->
    <circle cx="-10" cy="-6" r="12" fill="#ED1C24"/>
    <circle cx="10" cy="-6" r="12" fill="#005BAA"/>
    <circle cx="0" cy="10" r="12" fill="#009639"/>
  </g>
  <text x="60" y="86" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="10" fill="#005BAA" text-anchor="middle" letter-spacing="1">SAIGON CO.OP</text>
  <text x="60" y="98" font-family="'Inter', -apple-system, sans-serif" font-weight="700" font-size="8.5" fill="#ED1C24" text-anchor="middle" letter-spacing="1">RETAIL CORP</text>
</svg>`
};

const dir = path.resolve(__dirname, '../assets/logos');
const pubDir = path.resolve(__dirname, '../public/assets/logos');

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

let count = 0;
for (const [filename, content] of Object.entries(logos)) {
  const filePath = path.join(dir, filename);
  const pubFilePath = path.join(pubDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  fs.writeFileSync(pubFilePath, content.trim(), 'utf8');
  count++;
}

console.log(`Successfully generated and synchronized ${count} corporate SVG logos!`);
