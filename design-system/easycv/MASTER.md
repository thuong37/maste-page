# Design System Master File — EasyCV

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** EasyCV  
**Category:** Recruitment Marketplace & Smart Job Platform (TopCV / ITviec / VietnamWorks model)  
**Last Updated:** 2026-09-21  

---

## 1. Brand Identity & Logo Assets

All skills (`ui-ux-pro-max`, `brand`, `design`, `design-system`, `banner-design`) MUST use the following official assets for EasyCV:

| Asset Name | Canonical File Path | Public Web Path (HTML / Next / Vite) | Best Context |
|------------|---------------------|--------------------------------------|--------------|
| **Full Horizontal (Transparent)** | `assets/logos/easycv-logo-transparent.png` | `/assets/logo/easycv-logo-transparent.png` | Light Header, Navigation bar, White/Light cards |
| **Full Horizontal (Dark Mode)** | `assets/logos/easycv-logo-dark.png` | `/assets/logo/easycv-logo-dark.png` | Dark Header (`#0F172A`), Recruitment Event Banners |
| **Full Horizontal (Original)** | `assets/logos/easycv-logo.png` | `/assets/logo/easycv-logo.png` | Documents, PDF export, Employer branding |
| **Brand Mark Icon (1:1 Square)** | `assets/logos/easycv-icon.png` | `/assets/logo/easycv-icon.png` | Mobile App Header, Avatar, Collapsed Sidebar |
| **Favicon** | `assets/logos/easycv-icon.png` | `/favicon.png` | Browser Tab Favicon |
| **Vector SVG Logo** | `assets/logos/easycv-logo.svg` | `/assets/logo/easycv-logo.svg` | Scalable Vector Header / Responsive display |
| **Original Anchor File** | `EASYCV_LOGO_EXACT_FROM_USER_ANCHOR.png` | *(Root Workspace)* | Original file provided by user |

### Code Usage Examples

```html
<!-- Light Navigation Bar -->
<a href="/" class="flex items-center gap-2">
  <img src="/assets/logo/easycv-logo-transparent.png" alt="EasyCV - Nền tảng tuyển dụng thông minh" class="h-9 w-auto" />
</a>

<!-- Dark Navigation Bar -->
<nav class="bg-slate-900 px-6 py-4">
  <img src="/assets/logo/easycv-logo-dark.png" alt="EasyCV" class="h-9 w-auto" />
</nav>

<!-- Mobile Compact Icon -->
<img src="/assets/logo/easycv-icon.png" alt="EasyCV" class="h-8 w-8 rounded-lg" />
```

---

## 2. Global Color Palette (Non-Copying Brand Foundation)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Primary (EasyCV Orange)** | `#F97316` | `--color-primary` / `--color-orange-500` | Main CTAs, brand mark, active tabs, highlight tags |
| **Primary Hover** | `#EA580C` | `--color-primary-hover` / `--color-orange-600` | Button hover, pressed states |
| **Primary Light / Raised** | `#FFF7ED` | `--color-primary-light` / `--color-surface-raised` | Job salary badge background, active filter pill, card quick-view |
| **Primary Border** | `#FED7AA` | `--color-primary-border` / `--color-orange-200` | Soft orange borders for highlight badges |
| **On Primary** | `#FFFFFF` | `--color-on-primary` | White text on primary buttons |
| **Text Primary** | `#1E293B` | `--color-text-primary` / `--text-main` | Content-first headings, job titles, primary body |
| **Text Secondary** | `#475569` | `--color-text-secondary` / `--text-muted` | Subtitles, company metadata, locations, filters |
| **Text Tertiary (Brand)** | `#F97316` | `--color-text-tertiary` | Accent highlights, salary numbers, active icons |
| **Text Inverse / Subtle** | `#64748B` | `--color-text-inverse` | Secondary captions, breadcrumb text |
| **Surface Base** | `#FFFFFF` | `--color-surface-base` / `--color-card` | Clean card surfaces, modal dialogs, search inputs |
| **Surface Muted** | `#F8FAFC` | `--color-surface-muted` / `--color-surface` | Page background, subtle slate rhythm |
| **Surface Raised** | `#FFF7ED` | `--color-surface-raised` | Warm peach raised surfaces, chips, badges |
| **Surface Strong** | `#F1F5F9` | `--color-surface-strong` | Structural containers, section dividers |
| **Border Subtle** | `#E2E8F0` | `--color-border` | Card borders, input outlines |
| **Accent / Match Score** | `#16A34A` | `--color-accent` | "Khớp 95% CV", "Hot Job", "Đã ứng tuyển" |
| **Tech Info Blue** | `#0284C7` | `--color-info` | Verified company badge, IT skill pills |
| **Destructive** | `#DC2626` | `--color-destructive` | Job expired, report job |
| **Focus Ring** | `#F97316` | `--color-ring` | Focus ring for keyboard accessibility |

---

## 3. Structured Typography System

- **Visual Style:** Structured, tokenized, content-first
- **Primary Font:** Inter (`font.family.primary = Inter`, `font.family.stack = Inter, sans-serif`)
- **Monospace Font:** JetBrains Mono
- **Base Metrics:** `font.size.base = 14px`, `font.weight.base = 500`, `font.lineHeight.base = 22px`
- **Typography Scale:**
  - `font.size.xs = 12px` (Badges, tags, timestamps)
  - `font.size.sm = 13px` (Metadata, company labels, captions)
  - `font.size.md = 14px` (Base body text, form inputs, navigation items)
  - `font.size.lg = 15px` (Button text, salary highlight, callout body)
  - `font.size.xl = 16px` (Card titles, section subheadings)
  - `font.size.2xl = 18px` (Modal titles, secondary headers)
  - `font.size.3xl = 20px` (Main section headings)
- **Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 4. Spacing, Radius, Shadow & Motion Tokens

### Spacing Scale
- `space.1 = 2px`
- `space.2 = 4px`
- `space.3 = 5px`
- `space.4 = 6px`
- `space.5 = 8px`
- `space.6 = 10px`
- `space.7 = 11px`
- `space.8 = 12px`
- Extended: `space.9 = 16px`, `space.10 = 20px`, `space.11 = 24px`, `space.12 = 32px`, `space.13 = 40px`, `space.14 = 48px`, `space.15 = 64px`

### Radius Tokens
- `radius.xs = 6px`
- `radius.sm = 8px`
- `radius.md = 10px`
- `radius.lg = 22px`
- `radius.xl = 32.29px`
- `radius.2xl = 44px`
- `radius.step7 = 50px`
- `radius.step8 = 56px`
- `radius.full = 9999px`

### Shadow Tokens
- `shadow.1 = rgba(0, 0, 0, 0.1) 0px 0px 12px 0px`
- `shadow.card = 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`
- `shadow.card.hover = 0 8px 24px -4px rgba(249, 115, 22, 0.14), 0 4px 8px -2px rgba(15, 23, 42, 0.04)`
- `shadow.dropdown = 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`

### Motion Tokens
- `motion.duration.instant = 200ms`
- `motion.timing = cubic-bezier(0.16, 1, 0.3, 1)`
- `transition.instant = 200ms cubic-bezier(0.16, 1, 0.3, 1)`

---

## 4. Recruitment Platform UI Components

### 1. Smart Hero Job Search
```css
.search-hero-box {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 12px;
}
.btn-search {
  background: #F97316;
  color: #FFFFFF;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}
.btn-search:hover {
  background: #EA580C;
  transform: translateY(-1px);
}
```

### 2. Job Listing Card
```css
.job-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  transition: all 200ms ease;
  cursor: pointer;
}
.job-card:hover {
  border-color: #FDBA74;
  box-shadow: 0 10px 20px -5px rgba(249, 115, 22, 0.1);
  transform: translateY(-2px);
}
.salary-tag {
  color: #EA580C;
  background: #FFF7ED;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
}
```

### 3. Primary & Secondary Buttons
```css
.btn-primary {
  background: #F97316;
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 150ms ease;
  cursor: pointer;
}
.btn-primary:hover {
  background: #EA580C;
}

.btn-secondary {
  background: #F8FAFC;
  color: #0F172A;
  border: 1px solid #CBD5E1;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 150ms ease;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #F1F5F9;
}
```

---

## 5. Pre-Delivery & Quality Checklist

Before completing UI code:
- [x] Logo correctly referenced from `assets/logos/` or `/assets/logo/`
- [x] Transparent logo used on light/colored headers to prevent white box artifacts
- [x] Dark mode logo (`easycv-logo-dark.png`) used when background is dark
- [x] Primary CTA color matches EasyCV Orange (`#F97316`)
- [x] No emojis as functional icons — use Lucide / Heroicons SVG
- [x] `cursor: pointer` on all clickable cards, buttons, badges
- [x] Focus ring (`ring-2 ring-orange-500`) active for keyboard navigation
- [x] Responsive on Mobile (375px), Tablet (768px), Desktop (1280px+)
