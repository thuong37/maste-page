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

## 2. Global Color Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Primary (EasyCV Orange)** | `#F97316` | `--color-primary` | Main CTAs, brand mark, active tabs, highlight tags |
| **Primary Hover** | `#EA580C` | `--color-primary-hover` | Button hover, pressed states |
| **Primary Light / Tint** | `#FFF7ED` | `--color-primary-light` | Job salary badge background, active filter pill |
| **On Primary** | `#FFFFFF` | `--color-on-primary` | White text on primary buttons |
| **Secondary (Slate Navy)** | `#0F172A` | `--color-secondary` | Dark header bar, enterprise employers, footer |
| **On Secondary** | `#FFFFFF` | `--color-on-secondary` | Text on secondary backgrounds |
| **Accent / Success (Match Green)** | `#16A34A` | `--color-accent` | "Đã ứng tuyển", "Khớp 95% CV", "Hot Job" badge |
| **On Accent** | `#FFFFFF` | `--color-on-accent` | Text on accent elements |
| **Tech Info Blue** | `#0284C7` | `--color-info` | Verified company badge, IT skill pills |
| **Background** | `#FFFFFF` | `--color-background` | Page container, main sections |
| **Surface** | `#F8FAFC` | `--color-surface` | Body background, job list wrapper, search panel |
| **Card Surface** | `#FFFFFF` | `--color-card` | Job listing cards, company cards |
| **Foreground / Text** | `#0F172A` | `--color-foreground` | Main headings, job titles |
| **Muted Text** | `#64748B` | `--color-muted-foreground` | Location, salary details, company name |
| **Border** | `#E2E8F0` | `--color-border` | Card borders, divider lines, inputs |
| **Destructive** | `#DC2626` | `--color-destructive` | Job expired, report job |
| **Ring** | `#F97316` | `--color-ring` | Focus ring for a11y keyboard navigation |

---

## 3. Typography

- **Primary Font:** Plus Jakarta Sans / Inter / Be Vietnam Pro
- **Monospace Font:** JetBrains Mono
- **Mood:** Modern, Energetic, Trustworthy, Professional Recruitment Marketplace
- **Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

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
