# NATFLIX


## v24 changes
- Removed the obvious logo and movie-night easter egg triggers
- Kept only the footer note, the `tasha` search note, and the `T` keyboard note
- Rebuilt the Tonight's Pick carousel to use a stable queue instead of reshuffling on every interaction
- Up next now follows the next items in the carousel properly
- Prev / next arrows now move cleanly through the same sequence


## v25 hero polish
- Added a real fade-out / fade-in transition when the featured film changes
- Locked the hero to a consistent size so long titles and descriptions do not resize the banner
- Clamped the featured title and description to keep the layout stable


## v26 hero refinements
- Removed the duplicate right-side Up next label
- Reduced the overall hero height and poster size
- Allowed the featured title more room with a smaller size and up to 3 lines
- Tightened the Up next cards so the whole banner feels less oversized


## v27 search mode
- Search now has its own clean mode under the nav
- When search is active, the hero and shelves are hidden
- Empty search shows: What’s the next watch?
- No-match search shows: No results for “...”
- Matching searches only show the matching cards
- Restored the right-hand featured poster to full size


## v28 search refinement
- Search now matches titles only
- Search mode has a cleaner dedicated layout
- Empty search shows a centered prompt
- No-result search shows a softer no-results state
- Result cards fade in more cleanly


## v29 search cleanup
- Removed the native clear X from the search field
- Collapsed the oversized gap between search and results
- Hid the footer while search mode is active


## v30 search spacing
- Removed the leftover vertical space above search results
- Search results now sit much closer to the nav when matches exist


## v31 stats and personal touches
- Added a watched stats section above the footer
- Shows total watch time, watched count, average watch time, and easter eggs found
- Added more small teasing lines from Alex to Tasha across the page
- Easter egg count now tracks the footer, `tasha` search, and `T` key note


## v32 average start time
- The average time stat now estimates when you actually started watching
- It uses: watched timestamp minus runtime
- Renamed the label to Average start time


## v33 compact search header
- Hides the extra brand copy while search results are visible
- Tightens the topbar padding in active search results mode
- Pulls the result grid closer to the top controls


## v34 nav clipping fix
- Added a cleaner separation between the sticky nav and search results
- Keeps the results close to the nav without letting them visually clip into it


## v35 rating + runtime filters
- Added a 1–10 rating slider to the watched flow
- Ratings are stored alongside the watched timestamp
- Watched films now show your saved rating in the detail view
- Added runtime filtering: Under 1 hour, Under 1 hour 30, Under 2 hours, and 2 hours+
- Tightened the header and made it feel more full-width and intentional


## v36 header refinement
- Restored a frosted-glass full-bleed header
- Removed the gap above the header so it sits flush to the top
- Reduced the header vertical padding
- Kept the runtime filter and watched-rating flow intact


## v37 premium polish
- Expanded the stats section with progress, most-watched genre, and average rating
- Added page fade-in, staggered card entrances, smoother button feedback, better focus states, modal motion, slider polish, section reveal animations, and watched-confirmation feedback
- Added more hidden notes and teasing messages across the site


## v38 splash fix
- Removed the global body fade that was suppressing the splash
- The splash now displays independently from the page content
- The page fades in underneath first, then the splash fades away cleanly
