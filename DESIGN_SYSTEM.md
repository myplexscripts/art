# Margin Design System

Margin is a living archive for visual work. Public facing areas should feel closer to an art book, studio wall, or catalogue than a dashboard. Management surfaces can be more structured, but they must still use the same materials, typography, spacing, and controls.

## Core principles

1. Artwork leads. Interface chrome should recede until it is needed.
2. Rhythm is intentionally uneven. Avoid repeated equal cards and perfectly uniform rows on public pages.
3. Hierarchy comes from scale, spacing, type, and tone before borders.
4. Surfaces are warm and physical, not glossy, neon, or glassy.
5. Serif type carries authored and editorial moments. Sans serif carries controls and utility.
6. Public profiles should feel authored. Creator tools should feel organized.
7. Motion is quiet and short. Images can shift slightly, but UI should never bounce, glow, pulse, or perform for attention.
8. No decorative gradients, coloured edge accents, glass cards, generic bento layouts, or status decoration without functional meaning.

## Colour

Primary background: `#171512`
Deep background: `#11100e`
Primary surface: `#201d19`
Raised surface: `#29251f`
Text: `#f1ece4`
Muted text: `#aaa198`
Faint text: `#766f68`
Paper: `#eee7dc`
Ink: `#1a1713`
Clay accent: `#d09a76`
Danger: `#df8379`
Availability: `#9cb690`

The clay accent is a secondary functional colour. It should not dominate layouts. Primary actions use paper and ink rather than a bright brand colour.

## Typography

Editorial type: Georgia, Times New Roman, serif fallback.
Interface type: Inter, system sans serif fallback.

Use serif for:
- Page titles
- Artist names
- Project titles
- Collection titles
- Descriptive editorial copy

Use sans serif for:
- Navigation
- Buttons
- Filters
- Metadata
- Forms
- Notifications
- Management tools

Large serif headings use tight tracking and compact line height. Avoid large marketing slogans. Prefer direct page language such as Explore, Collections, Jobs, and artist names.

## Spacing

Public layouts use generous vertical pauses and asymmetric placement.

Small control gap: 5 to 10px
Standard control gap: 12 to 18px
Section gap: 34 to 56px
Editorial pause: 68 to 96px

Do not use dividers as the default grouping tool. Add whitespace first.

## Radius

Compact controls: 8 to 10px
Artwork and large surfaces: 11 to 15px
Large dialogs: 18 to 20px
Pills: only filters, tags, and compact status controls
Avatars: circular

Avoid making every surface rounded.

## Borders

Borders are low contrast and rare. Use them for:
- Section transitions
- Dense management lists
- Form focus
- Table like information where spacing is insufficient

Do not use decorative borders on artwork cards.

## Artwork layouts

Explore uses a 12 column irregular archive grid with changing spans and offsets.
Profiles use a separate curated portfolio grid with a featured work.
Collections use layered image boards with different compositions.
Following uses a chronological reading column.

Artwork should preserve its character. Avoid forced square cropping for general portfolio work. Editorial feature areas may crop previews when the full project is one click away.

## Interaction

Hover movement should be approximately 1 percent scale or a few pixels of translation.
Use opacity and tonal changes before adding motion.
No bouncing, glowing, pulsing, or looping decorative motion.
Respect reduced motion preferences.

## Public versus management surfaces

Public:
- Explore
- Project view
- Artist profiles
- Collections
- Following
- Jobs

These should feel loose, editorial, and image led.

Management:
- Publishing drawer
- Creator Studio
- Forms
- Applications
- Messages
- Notifications

These should be clearer and more structured, with denser information where useful, while retaining the same colour and typography system.

## Component rules

Buttons:
- Primary uses paper background and dark ink
- Quiet actions use subtle warm surfaces
- Destructive actions use muted red only when destructive

Cards:
- Do not create a card unless the boundary improves understanding
- Artwork itself usually acts as the visual container
- Avoid card nesting

Tags and filters:
- Compact pills are appropriate
- Active filter uses paper and ink

Metadata:
- Small sans serif
- Muted or faint colour
- Never compete with project or artist titles

## Responsive behaviour

Desktop can use deliberate asymmetry and offset columns.
Tablet reduces offsets before reducing artwork size.
Mobile uses a two column archive with occasional full width work.
Public artwork remains visually dominant on small screens.
Management surfaces may become full screen drawers on mobile.

## Design review checklist

Before merging a visual change, check:
- Does the artwork remain the strongest element?
- Did a border get added where spacing would work?
- Is this surface too card heavy?
- Is the radius consistent with its role?
- Is a pill being used only where a pill makes sense?
- Is serif reserved for authored content?
- Does the layout have enough breathing room?
- Does the page still feel intentional when all images are different sizes?
- Does mobile preserve the hierarchy rather than merely stack desktop?
- Is any decorative effect present only because it looks trendy?

If a change makes Margin feel more like generic SaaS, remove or simplify it.
