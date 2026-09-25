# Tomb Atlas Design System

Tomb Atlas is an informational Tomb Raider archive. Its visual system is editorial first, with restrained expedition cues. The interface should feel deliberately designed, not like a dashboard, social network, game launcher, or collection of generic rounded cards.

## Foundation

The whole site uses one shared layout system.

- Maximum content width: 1440px
- Responsive side gutter: 16px to 38px
- Desktop header height: 64px
- Body font: Inter
- Display font: Inter Tight
- Minimum visible type size: 14px
- Lucide icons only
- Dark neutral canvas with one restrained bronze accent
- Rules, spacing, and alignment create hierarchy before surfaces do

## Core visual rule

Do not make a card unless the content genuinely needs to behave like an isolated object.

Most content should use:

- whitespace
- horizontal rules
- vertical alignment
- typographic hierarchy
- image crops
- consistent columns

Avoid the old pattern of putting every section, statistic, filter, navigation item, and content group inside a rounded dark rectangle.

## Colour

Canvas: #0d0f0d  
Canvas secondary: #111410  
Surface: #151914  
Surface raised: #1a1f19  
Primary text: #f1efe9  
Secondary text: #c6c7bf  
Muted text: #92978e  
Faint text: #6f756d  
Bronze accent: #c18a4b  
Focus accent: #e3b778

Bronze is used for small accents, icons, section labels, and selected emphasis. It is not used for decorative borders or large branded gradients.

## Radius system

Radii remain concentric but deliberately restrained.

- Large image or major container: 22px
- Large component: 16px
- Control: 12px
- Small control: 8px

Do not round plain editorial sections, tables, metadata rows, or lists.

## Typography

### Display

Inter Tight, 500 to 700 weight.

Used for:

- page titles
- entry titles
- section titles
- archive row titles

Tracking is tight on large display text.

### Body and UI

Inter, 400 to 700 weight.

Used for:

- body copy
- metadata
- navigation
- controls
- labels
- technical reference

Nothing may render below 14px.

## Global header

Desktop contains:

- Tomb Atlas identity
- Archive
- Games
- Screen
- Print
- Guides
- global search

Desktop navigation uses quiet text buttons rather than large pills.

Search is a single 40px control aligned to the right.

On tablet the primary navigation collapses before the search becomes cramped.

On mobile:

- identity remains at the top
- search moves to its own full-width row
- four destination bottom navigation appears

## Archive home

The home page uses a two-column editorial masthead.

Left:

- archive descriptor
- large title
- concise explanation
- primary actions

Right:

- one large atmospheric image
- minimal archival metadata

Below the masthead is a four-part archive index separated by rules, not cards.

Featured entries use the universal archive row pattern.

## Universal archive row

Games, films, books, search results, and featured entries all use the same row.

Structure:

1. image
2. type / year / era metadata
3. title
4. description
5. restrained directional affordance

Rows are separated by horizontal rules.

Desktop rows are spacious and image-led.

Mobile rows become compact image-and-title records. Descriptions and secondary affordances can disappear before type size is reduced.

## Category pages

Games, Screen, and Print share the same skeleton.

1. category masthead
2. count
3. filter row
4. archive rows
5. global footer

Filters use one shared segmented pattern with the same spacing, radius, and selected state everywhere.

No page gets a unique visual treatment just because it is a different media type.

## Entry pages

Every game and media entry shares the same page architecture.

### Entry masthead

Two-column layout:

- title, type, year, summary, creator, era, platform
- one large image

The image is not used as a full-page background.

### Body

Desktop:

- main editorial column
- narrow sticky reference rail

Mobile:

- reference rail collapses above the article
- on-page navigation disappears
- content becomes one column

### Main sections

- overview
- progression or structure
- reference index
- characters or cast
- archive note

Sections are separated by rules and spacing, not independent cards.

## Reference data patterns

Overview data uses a two-column ruled grid.

Progression uses numbered rows.

Reference categories use a two-column ruled index.

Characters use table-like rows.

Archive notes use a simple bronze left rule.

These patterns should be reused rather than redesigned per page.

## Guides

Guide categories use the same ruled-row language as the archive.

No large icon tiles or dashboard-style cards.

Guide categories must connect back to games and releases rather than becoming a separate design system.

## Search

Search results reuse universal archive rows.

Search does not introduce special result cards.

Search should match:

- titles
- years
- characters
- locations
- artifacts
- developers
- studios
- platforms
- levels
- guide categories

## Tomb Raider character

The site should feel slightly Tomb Raider through:

- dark natural tones
- aged bronze accent
- archaeological and landscape imagery
- expedition-oriented wording
- compass and map-adjacent iconography
- editorial archive language

Do not use:

- fake stone textures
- grunge overlays
- faux parchment
- glowing game UI
- gold luxury styling
- random adventure symbols
- oversized themed ornamentation

## Responsive rules

### Large screens

- full desktop navigation
- two-column mastheads
- sticky entry rail
- generous whitespace
- 1440px maximum page width

### Tablet

- top navigation collapses before layouts become crowded
- mastheads may remain two-column until roughly 820px
- entry sidebar remains until it stops being useful

### Mobile

- 14px minimum visible text
- no horizontal overflow
- bottom navigation
- full-width search
- one-column article flow
- compact archive rows
- no unnecessary card stacking
- touch targets remain comfortable

## Consistency test

Before merging a visual change, check:

- Does it use an existing pattern before inventing a new one?
- Does it align to the same page grid?
- Does it use the same spacing rhythm?
- Does it rely on typography and rules before adding another surface?
- Are the radii appropriate and concentric?
- Is every visible text size at least 14px?
- Are all icons Lucide?
- Does the mobile layout feel intentionally redesigned?
- Would the component still make sense on another media page?
- Does it feel like an archive rather than a dashboard?
- Does the Tomb Raider influence remain restrained?

If a component needs a new visual language to work, the component is probably wrong.
