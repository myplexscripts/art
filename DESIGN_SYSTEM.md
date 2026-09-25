# Tomb Atlas Design System

Tomb Atlas is an informational Tomb Raider fan reference. The interface should feel modern, calm, durable, and easy to navigate, with restrained adventure and archival cues rather than a themed game UI.

The product priority is reference depth: games, walkthroughs, secrets, characters, artifacts, films, television, books, comics, galleries, soundtracks, technical notes, and related media. Social material is secondary and should only add useful context to the reference content.

## Product principles

1. Information comes first.
2. Every game or media entry uses the same predictable page structure.
3. Tomb Raider character comes from colour, imagery, language, iconography, and material tone, not fake stone, distressed textures, or novelty game UI.
4. Mobile is designed intentionally rather than created by stacking desktop.
5. Search must remain prominent and useful.
6. Avoid card-on-card clutter.
7. Avoid decorative coloured borders and edge accents.
8. Blur is limited to navigation and selected overlays.
9. Controls should be obvious and have generous tap targets.
10. Nothing visible is smaller than 14px.
11. Community content belongs beside the reference material it clarifies, not in a feed that competes with the archive.
12. The design should remain useful when the archive grows from dozens to thousands of pages.

## Brand

Name: Tomb Atlas

Positioning: independent Tomb Raider reference and archive.

The name is short, functional, and suggests navigation, geography, exploration, and a structured body of knowledge.

The brand mark uses a Lucide compass. Do not create a pseudo-official Tomb Raider logo.

## Typography

Body font:
DM Sans

Display font:
Instrument Sans

Both are sans serif.

Minimum visible type size:
14px

Never shrink metadata, timestamps, badges, captions, navigation, helper text, or mobile labels below 14px. Remove information or change the layout instead.

Display titles use Instrument Sans with tight tracking. Body and UI text use DM Sans.

## Colour

Background:
#111310

Elevated background:
#151814

Primary surface:
#1a1e19

Secondary surface:
#20251f

Raised surface:
#292f27

Warm surface:
#242019

Primary text:
#f2f0e9

Secondary text:
#c6c7bf

Muted text:
#92988e

Faint text:
#6f776d

Bronze accent:
#c99556

Light bronze:
#e1b577

Moss:
#72866a

Bronze should feel like aged expedition hardware, not luxury gold branding.

## Radius system

Concentric radii are mandatory.

Shell:
30px

Panel:
24px

Card:
18px

Control:
14px

Small nested element:
10px

Nested surfaces reduce radius in proportion to their inset. Do not mix arbitrary rounded values.

Circular geometry is reserved for semantic circles such as status dots. Pills are allowed for short metadata.

## Surfaces

Prefer separation in this order:

1. whitespace
2. tonal change
3. subtle shadow
4. low contrast border only when necessary

Avoid fake stone textures, noisy grunge, strong gradients, glowing edges, bevels, decorative top borders, and nested cards that exist only for decoration.

Large hero photography may carry more atmosphere than utility surfaces.

## Icons

Use Lucide only.

Default stroke:
1.8px

Typical sizes:
16 to 18px in controls
20 to 26px in reference tiles

Never use emoji as interface icons.

## Global navigation

Desktop:

- Tomb Atlas brand
- Archive
- Games
- Screen
- Print
- Guides
- Search

Mobile:

- Archive
- Games
- Screen
- Guides

Print remains available through Archive and search on mobile. The mobile navigation stays intentionally small.

The header may use restrained blur. It must remain readable over every page.

## Archive home

The archive home is an index, not a marketing page or social feed.

It includes:

- a concise archive statement
- quick index to the major media groups
- archive counts
- featured entries across eras
- reference categories
- explanation of the archive-first model

Avoid oversized empty hero areas. The hero must immediately provide navigation.

## Hub pages

Games, Screen, and Print are category hubs.

Each hub includes:

- page title and concise description
- total entry count
- horizontal filter control
- consistent entry cards
- responsive grid on desktop
- compact list-like cards on mobile

Filters remain at least 14px and use the same 14px control radius.

## Entry page template

Every individual game, film, series, comic, or novel uses the same page skeleton.

1. Hero
2. Overview
3. Progression or content structure
4. Reference index
5. Characters or cast
6. Archive note
7. Sticky fact rail on larger screens

The hero contains:

- back link
- type
- year
- title
- short summary
- era
- creator or developer
- platform or format

Game reference index:

- walkthrough
- secrets and collectibles
- characters
- weapons and gear
- outfits
- controls
- cheats
- achievements and trophies
- gallery
- soundtrack
- downloads and saves
- patches and bugs

Screen and print reference index:

- cast and characters
- episodes or chapters
- production
- locations
- artifacts and mythology
- gallery
- soundtrack
- editions and releases

This consistency is more important than giving every entry a unique visual treatment.

## Guides

Guides are practical reference surfaces.

Core guide systems:

- walkthroughs
- secrets and collectibles
- controls and moves
- cheats and useful tricks
- achievements and trophies
- save files
- patches and known issues
- galleries

Guide pages should eventually support game, platform, release, and remaster context.

## Search

Search stays in the global header on desktop and mobile.

It should search:

- titles
- years
- characters
- locations
- artifacts
- creators and developers
- platforms
- guide categories
- level and chapter names

The slash key may focus search on desktop.

Search results use the same entry cards as the archive rather than introducing another component family.

## Community material

There is no primary social feed.

Useful fan context may appear as:

- editor notes
- community corrections
- technical discoveries
- version-specific observations
- references to discussions

Community content should never displace verified reference information.

Future discussion features should attach to a specific archive entry or guide.

## Motion

Motion is quiet.

Allowed:

- short card lift
- subtle image scale
- opacity transitions
- small sheet transitions

Avoid:

- looping decorative motion
- bouncing
- pulsing
- particle effects
- glowing controls

Respect reduced motion.

## Responsive system

Desktop and large screens:

- maximum content width 1540px
- multi-column archive grids
- sticky entry side rail
- full header navigation
- large photographic entry heroes

Tablet:

- two or three column grids depending on width
- side rail collapses below content when necessary
- desktop navigation may collapse

Mobile:

- minimum 320px width
- no horizontal page overflow
- four destination bottom navigation
- full-width search beneath the brand
- entry grids become compact list cards
- entry side rail becomes a single column
- article sections use reduced but consistent radii
- all controls remain touch-friendly
- no visible text below 14px

## Accessibility

- visible keyboard focus
- semantic headings
- descriptive navigation labels
- text remains readable over photography
- minimum 14px visible text
- large tap targets
- reduced motion support
- decorative images use empty alt text
- meaningful imagery requires descriptive alt text when added

## Review checklist

Before merging a UI change:

- Is every visible text size at least 14px?
- Are icons exclusively Lucide?
- Are nested radii concentric?
- Did spacing or tone solve the problem before a border was added?
- Is there unnecessary card nesting?
- Does the page still feel informational first?
- Does Tomb Raider atmosphere come through without cosplay UI?
- Does the component behave intentionally on mobile?
- Does search still make the content discoverable?
- Does this page follow the same entry structure as comparable pages?
- Is social material secondary to reference content?
- Will the pattern still work when the archive becomes much larger?

If a change feels like generic SaaS, a game launcher, a social network, or a 2000s fan forum, simplify it and return to the archive model.
