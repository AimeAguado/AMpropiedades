---
name: Portal Inmobiliario Moderno
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#594237'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#8c7166'
  outline-variant: '#e0c0b2'
  surface-tint: '#a14000'
  primary: '#9d3e00'
  on-primary: '#ffffff'
  primary-container: '#c55000'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb694'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#5c5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#757474'
  on-tertiary-container: '#fefcfc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb694'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7b2f00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  price-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
  price-card:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '800'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  specs-label:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-btn:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  badge-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-performance, trustworthy, and conversion-focused real estate discovery experience. Built for property seekers, brokers, and investors navigating high-value residential and commercial decisions, the visual voice projects institutional clarity, commercial authority, and energetic momentum.

The design movement combines **Corporate Modern** with **High-Utility Functionalism**:
- Deep, assertive black structure conveys stability, market authority, and structural legibility.
- High-saturation corporate orange acts as an intentional catalyst for engagement, highlighting transaction pathways, urgent badges, active filters, and interactive triggers without visual clutter.
- Surfaces leverage crisp, clinical white foundations with subtle cool-neutral grounding to keep architectural imagery and real estate assets front and center.
- Clear typographic hierarchy guarantees that property pricing, administrative expenses (*expensas*), surface area, and property specs are scannable in split-second listing audits.

## Colors

The palette establishes high operational contrast between institutional structure, editorial property photos, and transaction-driven calls to action.

- **Primary Accent (`#ec6718`)**: Reserved strictly for high-value user triggers: primary conversion moments, interactive active-tab pill indicators, featured/premium listing badges, price adjustments, and energetic hover states.
- **Deep Structural Black (`#000000`)**: Governs high-emphasis typography, primary interface buttons, map pins, core navigational icons, and structural anchor lines.
- **Secondary Slate (`#555555`)**: Anchors descriptive body copy, secondary location tags, subheadings, and property specs (expensas, maintenance details, legal disclosures).
- **Backgrounds & Foundation**:
  - `#ffffff`: Dedicated canvas for interactive listing cards, modals, search query pods, and input fields.
  - `#f8f9fa` / `#f3f4f6`: Subtle atmospheric background base to generate soft contrast beneath floating cards and filter bars.
- **Dividers & Structural Borders**:
  - `#e5e7eb` and `#e0e0e0`: Thin structural line-work separating photo media galleries, sticky search filter sections, and tabular listing specs.

## Typography

The type system blends the energetic geometric authority of **Plus Jakarta Sans** for headlines, pricing, and key calls-to-action with the utilitarian legibility of **Inter** for descriptions, listing parameters, and technical metadata.

- **Tabular Figures & Spec Uniformity**: For all numeric roles (`price-xl`, `price-card`, surface area `m²`, and expenses), activate OpenType `tnum` (tabular lining figures). This ensures currency values and quantitative specifications align across comparative vertical rows.
- **Visual Weight**: Numerical valuations and operation categories (*Venta, Alquiler*) utilize heavy weights (700/800) to stand out immediately against surrounding architectural imagery.

## Layout & Spacing

The layout uses a 12-column fluid grid system pinned to a maximum canvas constraint of `1280px` for primary listings, and expands to a full viewport split-screen layout (55% property card feed / 45% interactive sticky map) at larger desktop viewports.

- **Breakpoints**:
  - `Mobile` (< 768px): Single column. Horizontal scroll snapping for operational filter chips. Search bar docks at the top with condensed modal triggers. Sticky bottom call bar for broker contact.
  - `Tablet` (768px - 1023px): 6-to-8 column flow. Property search cards switch from stacked media to side-by-side or dual-column grid cards.
  - `Desktop` (≥ 1024px): 12-column structure. Multi-facet floating search bars, persistent filter drawers, and synchronized map/list viewing modes.
- **Rhythm & Grid Alignment**: Consistent multi-attribute alignment using multiples of `8px`. Card padding uses `space-md` (16px) internally, while search bar clusters leverage dense `space-sm` (8px) internal separations for rapid filtering.

## Elevation & Depth

Visual hierarchy uses crisp, border-defined planar separation paired with soft ambient diffusion:

- **Flat Foundation**: Background layers use `#f8f9fa` with flat layout dividers (`#e5e7eb`, 1px solid).
- **Default Card Surface (`elevation-card`)**: Crisp pure white `#ffffff` bound by a structural 1px border (`#e5e7eb`) accompanied by an ultra-soft ambient shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.06)`. This ensures distinct separation from the canvas without visual heaviness.
- **Hover & Active Lift (`elevation-hover`)**: Upon card interaction, apply an instant physical hover translation of `translateY(-4px)` with amplified depth: `0 12px 28px -4px rgba(0, 0, 0, 0.12)`, while maintaining subtle border definition.
- **Floating Overlays & Portals (`elevation-overlay`)**: Dedicated for floating search engines, price filter popovers, and sticky navigation headers: `0 8px 30px rgba(0, 0, 0, 0.08)` over pure white surfaces with backdrop-filter support (`blur(8px)` on supporting translucent header chrome).

## Shapes

The interface balances sharp architectural utility with modern geometric softness:

- **Property Cards (`12px`)**: Corner radii of precisely 12px (`rounded-lg` level) for primary property cards, detail panels, and lead capture modules. Image carousels inherit this radius on their outer perimeter with zero inner gap.
- **Search Bars & Inputs (`8px`)**: Precise 8px radius on query inputs, drop-down select triggers, and inline pricing fields, establishing an orderly, structured tool-like appearance.
- **Status Tags, Counter Badges & Operation Pills (`9999px` Full Pill)**: Operation selector tabs (*Comprar, Alquilar, Temporal*), property feature chips, verified agency tags, and photo counter indicators (*1/24*) utilize rounded pill shapes to distinguish status metadata from actionable cards and inputs.

## Components

### Zonaprop-Style Multi-Attribute Search Engine
- **Operation Bar**: Segmented pill group resting atop the search box (*Comprar*, *Alquilar*, *Temporal*). Active item set to pure black background (`#000000`) or primary orange (`#ec6718`) with bold white text; inactive items set to transparent background with `#555555` text.
- **Search Inputs**: Grouped segmented inputs (Location search field, Property Type drop-down, Price Range filter button) encased within a consolidated container styled with an 8px radius, pure white background, `#e5e7eb` boundary, and `elevation-overlay`.
- **Primary Search CTA**: High-visibility `#ec6718` background, bold white typography, 8px radius. On hover: shifts toward dark corporate `#d4550e` with a slight drop shadow.

### Property Cards
- **Image Carousel Area**: Fixed 16:10 or 3:2 ratio top container. Houses previous/next chevron navigation controls that appear on hover with glass/semi-opaque backing (`rgba(0,0,0,0.5)`). Bottom-right edge features a photo count pill (e.g., `1/18`) with an icon and semi-transparent dark backing. Top-left displays transaction badge tags (*Destacado*, *Super Destacado*).
- **Favorite Heart Toggle**: Anchored top-right of image frame. Circular 36px white button with subtle shadow. Unchecked: outlined heart `#000000`; Active: filled `#ec6718` with slight scale bounce transition.
- **Financial Content Block**:
  - Property Price: `price-card` typography in `#000000`.
  - Expenses / Expensas: Displayed inline or directly below in `body-sm` (`#555555`), e.g., `+ $45.000 expensas`.
- **Property Specs Ribbon**: Dedicated horizontal icon row (surface area in `m²`, total rooms/ambientes, bedrooms/dormitorios, parking spaces/cocheras). Icons rendered in clean 16px line-art style alongside tabular text in `#555555`.
- **Publisher Stamp**: Clean footer separating the agency logo or broker profile alongside rapid contact buttons (WhatsApp trigger in green accent or structural outline, "Contactar" button in black).

### Buttons & CTAs
- **Primary Action**: Pure black (`#000000`) with `#ffffff` text, or Corporate Orange (`#ec6718`) for core conversions. Height: 44px (default), 48px (hero). Border radius: 8px.
- **Secondary Action**: White `#ffffff` surface, 1px solid border in `#000000` or `#e5e7eb`, text in `#000000`. Hover brings subtle background wash of `#f8f9fa`.

### Form Controls & Filter Chips
- **Chips**: 32px height, 9999px border radius. Inactive: `#ffffff` surface with `#e5e7eb` border and `#555555` label. Active: `#ec6718` or `#000000` fill with `#ffffff` text.
- **Checkbox & Radio**: 18px rounded square (checkbox: 4px radius; radio: circle). 1.5px border `#e5e7eb`. Checked state fills `#ec6718` with crisp white vector checkmark.