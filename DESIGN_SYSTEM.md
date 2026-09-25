# Margin Design System

Margin is an artwork-first community product. The interface should feel modern, calm, and useful enough to disappear behind the work.

## Product direction

The discovery experience borrows proven organizational patterns from current art-sharing platforms without copying their visual identity:

- strong global search
- clear discovery modes
- creative-field browsing
- curated featured work
- artist discovery
- dense image-led project feeds
- following, saves, collections, and jobs as adjacent product areas

The product should feel like an art platform, not a portfolio template or generic SaaS dashboard.

## Core principles

1. Artwork is always the strongest visual element.
2. Navigation is compact and functional.
3. Use density where browsing benefits from it.
4. Avoid oversized marketing-style hero sections inside the signed-in product.
5. Use hierarchy, spacing, and neutral surfaces before borders.
6. Public content should feel image-led. Management tools can be denser.
7. Interactions should be immediate and quiet.
8. Do not use decorative gradients, glowing accents, coloured card edges, glass cards, or nested cards without a functional reason.
9. Pills are reserved for filters and compact states.
10. Mobile should preserve browsing density rather than collapsing everything into oversized single cards.

## Colour

Background: `#f5f5f2`
Primary surface: `#ffffff`
Secondary surface: `#eeeeeb`
Raised neutral: `#e4e4df`
Primary text: `#181817`
Muted text: `#70706b`
Faint text: `#9b9b95`
Border: `#dfdfda`
Strong border: `#c9c9c3`
Accent: `#5b5ce2`
Accent surface: `#ececff`
Danger: `#c94a43`
Success: `#2f8a55`

The accent is functional. It should appear in selected states, notifications, links that need emphasis, and discovery labels. It should not wash entire pages in colour.

## Typography

Use the system sans stack throughout:

`Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Large titles use tight tracking and strong weight rather than serif typography.

Suggested roles:

- Product wordmark: 24px, heavy, tight tracking
- Page title: 36 to 64px depending on viewport
- Section heading: 17 to 20px
- Project title: 13 to 15px in feeds
- UI copy: 12 to 14px
- Metadata: 10 to 12px

Avoid interface text below 10px.

## Radius

Artwork thumbnails: 8 to 10px
Cards and larger surfaces: 12 to 14px
Controls: 8 to 9px
Dialogs: 16 to 18px
Pills: fully rounded only for filters, tags, and compact status controls
Avatars: circular

## Borders and surfaces

Borders should be low contrast.

Use borders for:
- navigation separation
- forms
- dense lists
- cards that need a clear interactive boundary
- modal and management structure

Do not put decorative borders around artwork.

Most feed cards should consist of artwork plus metadata, not a white card behind both.

## Global navigation

Desktop:
- wordmark
- large search field
- primary sections
- notifications
- messages
- Publish
- profile

Mobile:
- compact top bar
- expandable search
- five-item bottom navigation

Search should remain available from every screen.

## Explore

Desktop uses a left discovery rail with:
- Discover
- Recent
- Popular
- Following
- creative fields
- saved work
- jobs

The main content area can include:
- compact page introduction
- curated feature grid
- artist discovery cards
- project feed

The artwork feed supports three density levels.

Use natural artwork aspect ratios. Do not force a uniform card height.

On mobile, the left rail disappears and creative-field filters become horizontally scrollable chips.

## Artwork cards

Artwork cards contain:
- image
- project title
- artist
- field
- appreciation count

Save and appreciation actions appear on hover when hover exists.

Do not place persistent action bars on every card.

## Profiles

Profiles should feel like working artist pages, not dashboards.

Use:
- artist identity
- short biography
- availability
- featured work
- portfolio grid
- timeline
- about
- creator studio for the owner

Portfolio browsing should remain image dense.

## Projects

Project viewing uses a dark media stage with a light information column.

Information order:
1. artist
2. field and year
3. title
4. description
5. tools and project facts
6. tags
7. appreciate and save
8. collection, share, edit
9. rights
10. comments

Do not turn project information into a large settings table.

## Collections

Collection cards use a clean image collage rather than decorative stacked cards.

Collections should communicate:
- title
- item count
- privacy state
- visual sample of contents

## Following

Following is chronological and should not mix recommendations into the stream.

Use a readable single-column feed with strong imagery and minimal actions.

## Jobs

Jobs use structured list rows rather than decorative cards.

Always surface:
- company
- role
- discipline
- location
- work format
- compensation
- posting age

## Management surfaces

Publishing, Studio, messages, applications, notifications, and forms can be more structured than public discovery surfaces.

They must still use the same:
- colour tokens
- radius system
- typography
- control styles
- spacing rules

## Interaction

Hover:
- image scale no more than approximately 1 to 2 percent
- subtle surface changes
- actions may fade in

Avoid:
- bouncing
- glowing
- pulsing
- looping decorative animation

Respect reduced motion preferences.

## Responsive behaviour

Desktop prioritizes discovery density.

Tablet:
- hide left discovery rail
- reduce artwork feed to three columns
- preserve feature hierarchy

Mobile:
- two-column artwork feed
- horizontally scrollable feature cards
- horizontally scrollable artist discovery
- expandable global search
- bottom navigation

Project viewer becomes vertically stacked.

## Review checklist

Before merging a UI change, ask:

- Is the artwork still the strongest element?
- Does this look like an art-sharing product rather than generic SaaS?
- Is any card container unnecessary?
- Is any text too small?
- Is a pill being used for something that is not a filter or compact state?
- Is the page denser where browsing benefits from density?
- Is navigation immediately understandable?
- Does mobile retain useful browsing speed?
- Are actions hidden only when they remain discoverable?
- Did any decorative gradient, coloured edge, glass effect, or unnecessary flourish creep in?

If the UI begins competing with the artwork, simplify it.
