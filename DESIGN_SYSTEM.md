# Tombbound Design System

Tombbound is a modern social home for Tomb Raider fans. The interface should feel polished, tactile, and familiar in the way a high-quality Apple app feels, while still carrying warmth, archaeology, adventure, stone, brass, forest, and expedition cues.

It must never feel like a themed fan forum from the 2000s, a game launcher, or generic dark SaaS.

## Core product principles

1. Content and community come first.
2. The interface should feel native and calm, not decorative.
3. Tomb Raider theming comes from material, colour, imagery, language, and iconography, not novelty textures.
4. Every control should have an obvious purpose.
5. Public surfaces can breathe. Management and composer surfaces can be denser.
6. No card-on-card clutter.
7. Avoid decorative borders and coloured edge accents.
8. Never use glass effects everywhere. Blur is reserved for navigation, sheets, and selected hero treatments.
9. Avoid huge empty marketing areas inside the signed-in product.
10. Mobile is designed intentionally rather than produced by simply stacking desktop.

## Typography

Primary body font:
`Manrope`

Display font:
`Space Grotesk`

Both are sans serif.

### Minimum size

Nothing in the product may render below **14px**.

This includes:
- captions
- metadata
- form labels
- navigation
- button labels
- timestamps
- badges
- helper copy
- mobile navigation labels

If information feels too dense at 14px, reduce the amount of information rather than shrinking the type.

### Hierarchy

Display titles:
- Space Grotesk
- tight letter spacing
- strong but not excessively heavy

Body:
- Manrope
- 14 to 17px
- relaxed line height

UI:
- Manrope
- 14px minimum
- medium to bold weight depending on action importance

## Colour

Background: `#101411`
Soft background: `#151a16`
Primary surface: `#191f1a`
Secondary surface: `#202720`
Raised surface: `#2a3229`
Primary text: `#f4f5ef`
Muted text: `#b4baaf`
Faint text: `#7e877d`
Bronze: `#c89252`
Light bronze: `#e0b578`
Moss: `#6f8f67`
Success: `#80b98a`
Danger: `#e2766c`

Bronze is the primary thematic accent.

It should feel like aged hardware, artifact metal, and expedition equipment, not gold luxury branding.

## Concentric radii

Concentric radius relationships are mandatory.

Base tokens:

- Outer shell: 28px
- Panel: 22px
- Card: 18px
- Control: 14px
- Small nested element: 10px

When a child is inset inside a rounded parent, reduce the child radius in proportion to the inset.

Example:

- Panel: 28px
- 6px inner inset: approximately 22px child
- 4px additional inset: approximately 18px nested card

Do not arbitrarily mix unrelated radii.

Circular elements are limited to:
- avatars
- notification dots
- progress indicators where circular geometry is semantically appropriate

## Surfaces

Surfaces should use tonal separation before visible borders.

Preferred order:

1. spacing
2. tonal change
3. subtle shadow
4. low-contrast border only if needed

Avoid:
- heavy outlines
- coloured top borders
- glowing edges
- bevelled game UI
- fake stone textures
- excessive gradients
- nested cards where whitespace can separate content

## Icons

Use **Lucide icons only** for interface iconography.

Do not mix icon libraries.

Recommended stroke:
- 1.8px

Typical icon sizes:
- 16 to 18px in controls
- 20 to 26px in feature tiles
- larger only for intentional empty or artifact states

Never substitute emoji for UI icons.

## Navigation

Desktop header includes:

- Tombbound brand
- Home
- Games
- Lore
- Community
- Collections
- Search
- Notifications
- XP
- Post
- Profile

The header uses restrained blur and must remain readable over all content.

Mobile uses five bottom destinations:

- Home
- Games
- Post
- Community
- Profile

The central Post action can be visually elevated but should not become oversized.

## Home

Home is a personalized social destination, not a marketing landing page.

It contains:

- current expedition
- community feed
- challenge progress
- trending discussions
- game discovery
- people to follow

The hero can use franchise-adjacent archaeological imagery, but the content must remain functional.

## Games

Game pages are tracking surfaces.

Users can:

- browse by era
- mark games completed
- add games to current play
- view community participation
- open related lore
- open community discussion

Game cards should not imitate box art shelves.

## Lore

Lore is a community reference layer.

Entries include:

- artifacts
- places
- mythology
- recurring locations
- associated games
- community notes

Artifact presentation can be more atmospheric than ordinary UI, but must still follow the same radius and spacing system.

## Community

The social system supports:

- discoveries
- discussions
- collections
- likes
- replies
- saves
- following
- member profiles
- XP rewards
- challenges

Community posts should feel more like thoughtful expedition notes than short-form social media status updates.

## Expedition XP

XP rewards participation, not popularity alone.

Example actions:

- publish useful post
- reply to discussion
- complete a game
- join a challenge
- participate in community activity

XP should not become a gambling mechanic or manipulate users into compulsive engagement.

Levels are a lightweight identity layer.

## Collections

Collections combine:

- games
- posts
- lore entries
- favourite locations
- replay lists

Preview cards use image collages rather than fake stacked paper effects.

## Profile

Profiles show:

- identity
- XP
- level
- completion history
- badges
- posts
- followed members

Profiles should feel personal but not like a dashboard overloaded with metrics.

## Forms and composers

Forms use:

- 14px minimum text
- 14px control radius
- tonal input backgrounds
- strong focus states
- generous tap targets

Do not use tiny labels or placeholder-only forms.

## Motion

Motion is quiet.

Allowed:
- short image scale on hover
- subtle sheet transitions
- opacity changes
- gentle progress updates

Avoid:
- bouncing
- pulsing
- glowing
- looping particles
- constant decorative motion

Respect reduced motion.

## Mobile

Mobile requirements:

- 14px minimum text
- no horizontal page overflow
- bottom navigation
- large tap targets
- card radii remain concentric
- social posts collapse gracefully
- game cards switch to vertical layout
- side rails move below primary content
- modals use most of the viewport without touching screen edges unless necessary

## Design review checklist

Before merging a UI change:

- Is every visible text size at least 14px?
- Are all icons Lucide?
- Are nested radii concentric?
- Did a border get added where spacing or tone could do the job?
- Is there unnecessary card nesting?
- Does this still feel like Tomb Raider without relying on gimmicks?
- Does the product feel modern rather than game-launcher themed?
- Are buttons large enough for touch?
- Is the hierarchy obvious without explanation?
- Does mobile feel intentionally designed?
- Are accent colours restrained?
- Is any decorative effect competing with the content?
- Is the interface consistent with the rest of Tombbound?

If a change feels like generic SaaS or cosplay UI, simplify it.
