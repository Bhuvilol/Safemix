---
name: SafeMix Core
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1b1c1a'
  on-surface-variant: '#434843'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ee'
  outline: '#737873'
  outline-variant: '#c3c8c1'
  surface-tint: '#4e6354'
  primary: '#465b4c'
  on-primary: '#ffffff'
  primary-container: '#5e7464'
  on-primary-container: '#e1f9e5'
  inverse-primary: '#b5ccba'
  secondary: '#4c6454'
  on-secondary: '#ffffff'
  secondary-container: '#cce6d2'
  on-secondary-container: '#516858'
  tertiary: '#6e4e51'
  on-tertiary: '#ffffff'
  tertiary-container: '#886669'
  on-tertiary-container: '#ffefef'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d5'
  primary-fixed-dim: '#b5ccba'
  on-primary-fixed: '#0b1f14'
  on-primary-fixed-variant: '#374b3d'
  secondary-fixed: '#cfe9d5'
  secondary-fixed-dim: '#b3cdba'
  on-secondary-fixed: '#092014'
  on-secondary-fixed-variant: '#354c3d'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#e6bcbf'
  on-tertiary-fixed: '#2c1518'
  on-tertiary-fixed-variant: '#5d3f42'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2e0'
typography:
  h1:
    fontFamily: manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: manrope
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0em
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  caps-xs:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built on the intersection of pharmaceutical precision and digital-first accessibility. The brand personality is authoritative yet empathetic—a "clinical concierge" that prioritizes safety without the sterile coldness of traditional medical software. 

The visual style is a hybrid of **Minimalism** and **Corporate/Modern**. It utilizes generous whitespace and a restricted, nature-inspired palette to reduce cognitive load for healthcare professionals and patients. Drawing from Stripe’s aesthetic polish, the system uses subtle motion and high-contrast typography to guide users through complex data flows, while "organic" influences soften the edges to maintain a sense of calm and well-being.

## Colors

The palette is anchored by a triad of greens and a technical blue, set against a warm, paper-like neutral.

- **Primary (Deep Sage):** Used for main actions, active states, and branding elements. It provides a grounded, organic feel.
- **Secondary (Medical Forest):** Reserved for high-hierarchy text, headers, and navigation backgrounds to establish structural authority.
- **Accent (Modern Blue):** Used sparingly for critical information, callouts, and progress indicators, providing a "digital-native" spark to the earthy palette.
- **Background (Warm White):** A deliberate departure from pure #FFFFFF to reduce eye strain and create a premium, tactile feel.

## Typography

This design system uses a dual-font strategy to balance character with utility. **Manrope** is used for headlines to provide a refined, balanced, and modern look that feels high-end. Its geometric yet friendly curves mirror the organic shapes of the UI.

**Inter** is utilized for all functional UI elements, body copy, and data visualizations. Its neutral, systematic nature ensures maximum legibility in high-density healthcare dashboards. For medical labels and metadata, a slightly increased letter-spacing is applied to "caps-xs" styles to maintain clarity at small sizes.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for desktop environments to maintain a "contained" and safe feeling, while transitioning to a fluid model for mobile tablets. 

A 12-column grid is standard for dashboards, using 24px gutters to allow the UI to breathe. Spacing is strictly derivative of an 8px base unit. For sections containing sensitive patient data or medication lists, "stack-lg" (32px) padding is preferred to prevent the interface from feeling cluttered or overwhelming.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers** rather than heavy borders. Surfaces use a "layered lift" approach:

1.  **Level 0 (Background):** The Warm White base.
2.  **Level 1 (Cards):** Pure white surfaces with a very soft, diffused shadow (15% opacity of Deep Sage Green) to create a subtle organic lift.
3.  **Level 2 (Popovers/Modals):** Increased shadow spread with a slight backdrop blur (8px) to isolate the interaction from the background.

Shadows should never be pure black; they are always tinted with the Primary or Secondary green to maintain the palette's warmth.

## Shapes

The shape language is the core of the "organic" feel of the design system. While it follows a `roundedness: 2` (0.5rem base) logic, it employs a tiered approach to corner radii:

- **Sections & Large Containers:** Use a "Large" radius (1.5rem / 24px) to create a soft, friendly frame for content.
- **Cards & Primary Modules:** Use a "Medium" radius (1rem / 16px) for a balanced professional look.
- **Buttons & Inputs:** Use the base radius (0.5rem / 8px) to ensure they feel like interactive tools within the softer containers.
- **Badges/Chips:** Full pill-shape for distinct categorization.

## Components

- **Buttons:** Primary buttons use the Deep Sage Green with white text and a subtle bottom-heavy shadow to create a tactile "pressable" feel. 
- **Cards:** White backgrounds with 16px radius and "stack-md" internal padding. Borders are rarely used; if necessary, a 1px stroke in 10% opacity Medical Forest Green is applied.
- **Inputs:** High-contrast fields with a Warm White fill and a 1px border that shifts to Modern Blue on focus. Labels are always positioned above the field in "label-sm" weight.
- **Dosage Chips:** Pill-shaped indicators using the Accent Blue for "Current" and a muted version of Sage for "Historical" records.
- **Safety Alerts:** Use a soft-washed version of a warm amber (not part of the primary palette) to signify caution without inducing panic.
- **Progress Steppers:** Use thin, 2px lines with Modern Blue indicators to reflect the technical precision of medical workflows.