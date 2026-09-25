# Tomb Atlas Design System

Tomb Atlas is an informational Tomb Raider fan archive. The design should feel like a polished modern product with restrained Tomb Raider character, not a generic dashboard, game launcher, social network, or themed 2000s fan site.

## Product hierarchy

The visual priority is:

1. Find a title or topic.
2. Understand where it sits in the franchise.
3. Open a predictable reference page.
4. Reach walkthroughs, secrets, characters, technical help, media, or related material.
5. Add community context only where it improves the reference.

## Global grid

- Maximum page width: 1360px
- Responsive page gutter: 14px to 32px
- Desktop header: 66px
- Main section spacing: 48px desktop, 36px mobile
- No horizontal overflow
- Mobile breakpoint: 620px for single-column content
- Tablet layout begins collapsing before controls become cramped

## Typography

Body and UI: Inter  
Display: Inter Tight

Visible text never goes below 14px.

Display hierarchy:

- Home title: 46px to 72px
- Page title: 42px to 72px
- Entry title: 42px to 68px
- Section title: 26px to 38px
- Card title: 18px to 19px
- UI and metadata: 14px minimum

Large headings are compact enough to leave room for useful content in the initial viewport.

## Colour

Canvas: #0c0f0d  
Surface: #131713  
Raised surface: #191e19  
High surface: #202620  
Primary text: #f4f2ec  
Secondary text: #c8cbc4  
Muted text: #969d94  
Faint text: #737b72  
Bronze: #c99558  
Light bronze: #e0b579

Bronze is used selectively for:

- brand mark
- section labels
- reference icons
- selected emphasis
- focus states

Do not use coloured card borders, glowing edges, or large decorative gold gradients.

## Radius system

The site uses a restrained concentric radius system.

- Shell: 28px
- Content card: 20px
- Control: 14px
- Small nested control: 10px

Do not round ordinary article sections, tables, or list rows.

## Surfaces

Cards are used only for content objects or self-contained controls.

Good uses:

- game or media card
- home index link
- guide category
- compact fact group
- entry metadata rail

Do not place cards inside cards unless the child is an actual interactive control.

Article sections use spacing and dividers instead of another rounded container.

## Images

Generic stock photography is not part of the visual language.

Use:

- official franchise artwork where a stable source is available
- a designed Tomb Atlas fallback treatment for entries without art

The fallback treatment is intentional and changes subtly by franchise branch:

- Classic
- Legend
- Survivor
- Remastered
- Lara Croft spin-offs
- Mobile
- Upcoming
- Screen
- Print

Official artwork and fallback art use the exact same image frame proportions.

## Home

The homepage has four clear layers.

### Hero

Two columns on desktop:

- useful archive introduction and actions
- Tomb Raider 30th anniversary artwork

The hero is a contained surface, not a full-screen marketing splash.

### Archive index

Four consistent destination controls:

- Games
- Screen
- Print
- Guides

### Current and upcoming

Uses the universal media-card component.

### Series map

Shows representative entries from major franchise branches using the same media-card component.

### Reference library

Explains the site's practical reference categories and links into guide search.

## Universal media card

Games, films, series, books, comics, search results, and featured items use one card system.

Structure:

1. artwork
2. type and year
3. title
4. short description
5. branch and directional affordance

Desktop:
- four columns at large sizes
- three columns before tablet
- two columns on smaller tablets

Mobile:
- one compact horizontal card
- image on the left
- description removed before text is reduced

## Category hubs

Games, Screen, and Print all use:

1. shared page heading
2. total count
3. one shared filter control
4. universal media-card grid
5. shared footer

Games filters currently support:

- All
- Classic
- Legend
- Survivor
- Lara Croft
- Mobile
- Remastered
- Upcoming

No category may invent its own card, filter, spacing, or title system.

## Entry page

Every game or media item uses one page template.

### Detail hero

Two columns:

- title, type, year, description, branch, creator, platform
- artwork or Tomb Atlas fallback art

### Sticky section navigation

The same control style as filters.

Sections:

- Overview
- Levels / Episodes / Contents
- Reference
- Characters / Cast
- Notes

### Main content

Flat article sections separated by subtle rules.

Overview:
- two-column fact grid

Progression:
- numbered rows

Reference:
- two-column reference grid

People:
- simple rows

Notes:
- restrained highlighted editor note

### Metadata rail

Desktop and tablet use a compact metadata rail.

On narrow screens it moves above the article and becomes a multi-column summary.

## Guides

Guide categories use one shared component.

Current guide families:

- Walkthroughs
- Secrets & collectibles
- Controls & moves
- Cheats & useful tricks
- Achievements & trophies
- Save files
- Patches & known issues
- Galleries

Every guide belongs to a game or release context. Guides should not become a parallel disconnected site.

## Search

Search stays visible in the global header on desktop and mobile.

Search matches:

- title
- year
- era
- platform
- developer or creator
- setting
- characters
- artifacts
- level names
- guide categories

Results use the universal media-card component.

## Mobile navigation

Mobile has four bottom destinations:

- Archive
- Games
- Screen
- Guides

Print remains reachable from the Archive index and search.

The bottom navigation uses Lucide icons and 14px labels.

## Iconography

Lucide only.

Default stroke: 1.8px.

Do not mix icon libraries and never use emoji as UI icons.

## Motion

Motion is quiet and functional.

Allowed:

- subtle card lift
- slight image scale
- hover state transitions
- smooth in-page navigation

Avoid:

- pulsing
- bouncing
- decorative particles
- constant movement
- glow animation

Respect reduced motion.

## Review checklist

Before merging:

- Is every visible text size at least 14px?
- Does the page use the 1360px grid?
- Is the spacing rhythm consistent?
- Are radii concentric?
- Are Lucide icons used everywhere?
- Are content objects using the universal card rather than a one-off design?
- Are article sections flat instead of nested in extra cards?
- Is real Tomb Raider artwork used instead of generic stock photography?
- Is the mobile version intentionally laid out?
- Does the page expose useful information in the initial viewport?
- Are reference categories in the same order as comparable pages?
- Is community material secondary to factual reference content?
- Does it feel modern without becoming sterile?
- Does it feel like Tomb Raider without costume UI?
