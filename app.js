const entries = [
  {
    id: "tr1",
    type: "Game",
    category: "games",
    title: "Tomb Raider",
    year: 1996,
    era: "Classic",
    developer: "Core Design",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation, Sega Saturn",
    location: "Peru, Greece, Egypt, Atlantis",
    hero: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1800&q=88",
    blurb: "The original expedition established the series around isolation, acrobatic traversal, puzzle spaces, ancient mythology, and Lara Croft's hunt for the Scion.",
    levels: ["Croft Manor", "Caves", "City of Vilcabamba", "Lost Valley", "Tomb of Qualopec", "St. Francis' Folly", "Colosseum", "Palace Midas", "Cistern", "Tomb of Tihocan", "City of Khamoon", "Obelisk of Khamoon", "Sanctuary of the Scion", "Natla's Mines", "Atlantis", "The Great Pyramid"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Jacqueline Natla", "Natla Technologies founder"], ["Larson Conway", "Mercenary"], ["Pierre DuPont", "Rival adventurer"], ["Qualopec", "Atlantean ruler"], ["Tihocan", "Atlantean ruler"]],
    artifact: "Scion of Atlantis",
    note: "A strong reference page for this game needs to treat the original release and modern remasters separately where controls, achievements, visuals, or platform behaviour differ."
  },
  {
    id: "tr2",
    type: "Game",
    category: "games",
    title: "Tomb Raider II",
    year: 1997,
    era: "Classic",
    developer: "Core Design",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation",
    location: "China, Venice, offshore rig, Tibet",
    hero: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=88",
    blurb: "A larger globe-spanning sequel built around the Dagger of Xian, vehicles, broader combat encounters, and some of the most memorable locations of the classic era.",
    levels: ["Croft Manor", "The Great Wall", "Venice", "Bartoli's Hideout", "Opera House", "Offshore Rig", "Diving Area", "40 Fathoms", "Wreck of the Maria Doria", "Living Quarters", "The Deck", "Tibetan Foothills", "Barkhang Monastery", "Catacombs of the Talion", "Ice Palace", "Temple of Xian", "Floating Islands", "The Dragon's Lair", "Home Sweet Home"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Marco Bartoli", "Cult leader"], ["Brother Chan", "Barkhang monk"]],
    artifact: "Dagger of Xian",
    note: "Secrets, enemy placements, pickups, and vehicle sections make level-by-level navigation especially useful here."
  },
  {
    id: "tr3",
    type: "Game",
    category: "games",
    title: "Tomb Raider III",
    year: 1998,
    era: "Classic",
    developer: "Core Design",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation",
    location: "India, South Pacific, London, Nevada, Antarctica",
    hero: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=88",
    blurb: "A more open and difficult classic adventure with route choices, expanded movement, vehicles, and a worldwide search for four meteorite artifacts.",
    levels: ["Croft Manor", "Jungle", "Temple Ruins", "The River Ganges", "Caves of Kaliya", "Coastal Village", "Crash Site", "Madubu Gorge", "Temple of Puna", "Thames Wharf", "Aldwych", "Lud's Gate", "City", "Nevada Desert", "High Security Compound", "Area 51", "Antarctica", "RX-Tech Mines", "Lost City of Tinnos", "Meteorite Cavern"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Dr. Willard", "RX Technologies scientist"], ["Sophia Leigh", "Cosmetics executive"]],
    artifact: "Meteorite artifacts",
    note: "Route order and platform differences should be obvious on this page because they affect how a player uses a walkthrough."
  },
  {
    id: "tr4",
    type: "Game",
    category: "games",
    title: "The Last Revelation",
    year: 1999,
    era: "Classic",
    developer: "Core Design",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation, Dreamcast",
    location: "Egypt",
    hero: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1800&q=88",
    blurb: "A dense Egyptian expedition with interconnected hubs, long-form puzzle chains, and a story centred on the accidental release of Set.",
    levels: ["Angkor Wat", "Race for the Iris", "Tomb of Seth", "Burial Chambers", "Valley of the Kings", "Karnak", "Sacred Lake", "Tomb of Semerkhet", "Alexandria", "Coastal Ruins", "Catacombs", "Temple of Poseidon", "Cairo", "City of the Dead", "Citadel", "Giza", "Temple of Horus"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Werner Von Croy", "Lara's former mentor"], ["Jean-Yves", "Archaeologist and ally"]],
    artifact: "Amulet of Horus",
    note: "Hub connections and return paths deserve their own map layer rather than being buried inside a single long walkthrough."
  },
  {
    id: "tr5",
    type: "Game",
    category: "games",
    title: "Tomb Raider Chronicles",
    year: 2000,
    era: "Classic",
    developer: "Core Design",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation, Dreamcast",
    location: "Rome, Russia, Ireland, VCI headquarters",
    hero: "https://images.unsplash.com/photo-1549893074-4bc6d59afdf8?auto=format&fit=crop&w=1800&q=88",
    blurb: "Four stories from Lara's past, framed as recollections after the events of The Last Revelation.",
    levels: ["Streets of Rome", "Trajan's Markets", "The Colosseum", "The Base", "The Submarine", "Deepsea Dive", "Sinking Submarine", "Gallows Tree", "Labyrinth", "Old Mill", "13th Floor", "Escape with the Iris", "Red Alert!"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Werner Von Croy", "Recurring rival and mentor"], ["Winston Smith", "Croft family butler"]],
    artifact: "Philosopher's Stone and Iris",
    note: "Because the game is divided into four distinct stories, navigation should preserve those story groups instead of treating the level list as one flat sequence."
  },
  {
    id: "aod",
    type: "Game",
    category: "games",
    title: "The Angel of Darkness",
    year: 2003,
    era: "Classic",
    developer: "Core Design",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation 2",
    location: "Paris, Prague",
    hero: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=88",
    blurb: "A darker urban chapter built around a murder investigation, the Cabal, the Obscura paintings, and a second playable character.",
    levels: ["Parisian Back Streets", "Derelict Apartment Block", "Industrial Rooftops", "Margot Carvier's Apartment", "Parisian Ghetto", "The Serpent Rouge", "Louvre Galleries", "Tomb of Ancients", "Hall of Seasons", "The Monstrum Crime Scene", "The Strahov Fortress", "Bio-Research Facility", "The Sanitarium", "Maximum Containment Area", "Vault of Trophies", "Eckhardt's Lab"],
    characters: [["Lara Croft", "Archaeologist and fugitive"], ["Kurtis Trent", "Lux Veritatis operative"], ["Pieter Van Eckhardt", "The Black Alchemist"], ["Werner Von Croy", "Lara's former mentor"]],
    artifact: "Obscura Paintings",
    note: "Modern compatibility, community patches, control fixes, and known bugs are unusually important reference material for this release."
  },
  {
    id: "legend",
    type: "Game",
    category: "games",
    title: "Tomb Raider: Legend",
    year: 2006,
    era: "Legend",
    developer: "Crystal Dynamics",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation 2, Xbox, Xbox 360, PSP, GameCube",
    location: "Bolivia, Peru, Japan, Ghana, Kazakhstan, England, Nepal",
    hero: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=88",
    blurb: "A streamlined reboot that reintroduced Lara through a fast global adventure centred on Excalibur and the disappearance of her mother.",
    levels: ["Bolivia", "Peru", "Japan", "Ghana", "Kazakhstan", "England", "Nepal", "Bolivia Redux", "Croft Manor"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Amanda Evert", "Former friend and rival"], ["Zip", "Technical support"], ["Alister Fletcher", "Research assistant"], ["Winston Smith", "Croft family butler"]],
    artifact: "Excalibur",
    note: "Time trials, rewards, outfits, Croft Manor puzzles, and platform-specific editions should be visible beside the main story guide."
  },
  {
    id: "anniversary",
    type: "Game",
    category: "games",
    title: "Tomb Raider: Anniversary",
    year: 2007,
    era: "Legend",
    developer: "Crystal Dynamics",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation 2, PSP, Xbox 360, Wii",
    location: "Peru, Greece, Egypt, Atlantis",
    hero: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=88",
    blurb: "A reimagining of Lara's first adventure using the Legend-era movement system while preserving the Scion, Natla, and the original four-location structure.",
    levels: ["Mountain Caves", "City of Vilcabamba", "The Lost Valley", "Tomb of Qualopec", "St. Francis Folly", "The Coliseum", "Midas's Palace", "Tomb of Tihocan", "Temple of Khamoon", "Obelisk of Khamoon", "Sanctuary of the Scion", "Natla's Mines", "The Great Pyramid", "Final Conflict", "Croft Manor"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Jacqueline Natla", "Atlantean ruler"], ["Larson Conway", "Mercenary"], ["Pierre DuPont", "Rival adventurer"]],
    artifact: "Scion of Atlantis",
    note: "The site should make it easy to move between this page and the 1996 original without implying that the two games are interchangeable."
  },
  {
    id: "underworld",
    type: "Game",
    category: "games",
    title: "Tomb Raider: Underworld",
    year: 2008,
    era: "Legend",
    developer: "Crystal Dynamics",
    publisher: "Eidos Interactive",
    platforms: "PC, PlayStation 3, Xbox 360, Wii",
    location: "Mediterranean, Thailand, Mexico, Arctic",
    hero: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=88",
    blurb: "A mythology-heavy finale to the Legend trilogy with large traversal spaces, Norse artifacts, and a search for Helheim.",
    levels: ["No Illusions", "The Path to Avalon", "Niflheim", "The Norse Connection", "Remnants", "Bhogavati", "The Ancient World", "Puppet No Longer", "The Unnamed Days", "Xibalba", "Land of the Dead", "Gate of the Dead", "Valhalla", "Rituals Old", "Helheim", "Yggdrasil", "Out of Time"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Amanda Evert", "Rival"], ["Jacqueline Natla", "Atlantean ruler"], ["Doppelganger", "Natla's creation"]],
    artifact: "Mjolnir",
    note: "DLC is platform-specific and belongs in a clearly separated edition section, not mixed into the base campaign."
  },
  {
    id: "tr2013",
    type: "Game",
    category: "games",
    title: "Tomb Raider",
    year: 2013,
    era: "Survivor",
    developer: "Crystal Dynamics",
    publisher: "Square Enix",
    platforms: "PC, PlayStation 3, Xbox 360, PlayStation 4, Xbox One",
    location: "Yamatai",
    hero: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1800&q=88",
    blurb: "A second reboot that follows a younger Lara through the shipwreck of the Endurance and her fight to survive the island of Yamatai.",
    levels: ["Force of Will", "Signs of Life", "Woman Versus Wild", "Just Keep Moving", "At an Impasse", "Mountain Rendezvous", "Cry for Help", "A Road Less Travelled", "Guilty Conscience", "Another Fine Mess", "A Friend in Need", "Open Wounds", "Highway to Hell", "Liberator", "No One Left Behind", "Into the Fire", "Some Time Alone", "The Fast Way Down", "A Pirate's Life", "Gone Missing", "Storm Chaser"],
    characters: [["Lara Croft", "Junior archaeologist"], ["Conrad Roth", "Expedition leader"], ["Samantha Nishimura", "Lara's friend"], ["Dr. James Whitman", "Archaeologist"], ["Mathias", "Solarii leader"]],
    artifact: "Yamatai relic collection",
    note: "Collectibles, challenge tombs, documents, relics, GPS caches, challenges, skills, and weapon upgrades need a strong completion layer."
  },
  {
    id: "rise",
    type: "Game",
    category: "games",
    title: "Rise of the Tomb Raider",
    year: 2015,
    era: "Survivor",
    developer: "Crystal Dynamics",
    publisher: "Square Enix",
    platforms: "Xbox 360, Xbox One, PC, PlayStation 4",
    location: "Syria, Siberia",
    hero: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1800&q=88",
    blurb: "Lara pursues the Divine Source through Syria and Siberia while Trinity closes in on the lost city of Kitezh.",
    levels: ["Mountain Peak", "Siberian Wilderness", "Glacial Cavern", "Soviet Installation", "Abandoned Mines", "Geothermal Valley", "Acropolis", "Flooded Archives", "Research Base", "The Orrery", "Path of the Deathless", "Lost City"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Jonah Maiava", "Friend and ally"], ["Jacob", "Remnant leader"], ["Sofia", "Remnant fighter"], ["Konstantin", "Trinity commander"], ["Ana", "Trinity operative"]],
    artifact: "Divine Source",
    note: "Challenge tombs, crypts, missions, survival caches, documents, relics, murals, strongboxes, and DLC modes should all be indexable."
  },
  {
    id: "shadow",
    type: "Game",
    category: "games",
    title: "Shadow of the Tomb Raider",
    year: 2018,
    era: "Survivor",
    developer: "Eidos-Montreal",
    publisher: "Square Enix",
    platforms: "PC, PlayStation 4, Xbox One",
    location: "Mexico, Peru",
    hero: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=88",
    blurb: "The Survivor trilogy finale sends Lara through the Peruvian jungle and Paititi as she tries to stop a Maya apocalypse she set in motion.",
    levels: ["Cozumel", "Peruvian Jungle", "Kuwaq Yaku", "Trial of the Eagle", "The Hidden City", "Cenote", "Mission of San Juan", "Porvenir Oil Fields"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Jonah Maiava", "Friend and ally"], ["Dominguez", "Trinity leader"], ["Unuratu", "Paititi rebel leader"], ["Etzli", "Unuratu's son"]],
    artifact: "Key of Chak Chel",
    note: "Difficulty settings can be adjusted independently for exploration, combat, and puzzles, so guide language should account for those differences."
  },
  {
    id: "remastered123",
    type: "Game",
    category: "games",
    title: "Tomb Raider I-III Remastered",
    year: 2024,
    era: "Remastered",
    developer: "Aspyr and Saber Interactive",
    publisher: "Aspyr",
    platforms: "PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series, Switch",
    location: "Remastered campaigns from Tomb Raider I, II, and III",
    hero: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=88",
    blurb: "The first three classic adventures and their expansions return with remastered visuals, optional modern controls, photo mode, achievements, and the original graphics available at a button press.",
    levels: ["Tomb Raider I", "Unfinished Business", "Tomb Raider II", "The Golden Mask", "Tomb Raider III", "The Lost Artifact"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Classic cast", "Characters from the original trilogy"]],
    artifact: "Classic trilogy artifacts",
    note: "This page should link directly into the original game pages while preserving remaster-specific controls, trophies, fixes, photo mode, and visual differences."
  },
  {
    id: "remastered456",
    type: "Game",
    category: "games",
    title: "Tomb Raider IV-VI Remastered",
    year: 2025,
    era: "Remastered",
    developer: "Aspyr and Saber Interactive",
    publisher: "Aspyr",
    platforms: "PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series, Switch",
    location: "Remastered campaigns from The Last Revelation, Chronicles, and The Angel of Darkness",
    hero: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=88",
    blurb: "The second classic remaster collection brings The Last Revelation, Chronicles, and The Angel of Darkness together with modern presentation and quality-of-life changes.",
    levels: ["The Last Revelation", "Tomb Raider Chronicles", "The Angel of Darkness"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Classic era cast", "Returning characters from games four through six"]],
    artifact: "Classic era archive",
    note: "The Angel of Darkness changes make comparison links between the original and remastered versions particularly valuable."
  },
  {
    id: "movie2001",
    type: "Film",
    category: "screen",
    title: "Lara Croft: Tomb Raider",
    year: 2001,
    era: "Screen",
    developer: "Paramount Pictures",
    publisher: "Directed by Simon West",
    platforms: "Feature film",
    location: "Croft Manor, Cambodia, Siberia",
    hero: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=88",
    blurb: "The first live-action Tomb Raider film stars Angelina Jolie as Lara Croft in a race to recover the pieces of an ancient artifact before the Illuminati.",
    levels: ["Opening at Croft Manor", "The planetary alignment", "Cambodia", "Venice", "Siberia"],
    characters: [["Lara Croft", "Angelina Jolie"], ["Manfred Powell", "Iain Glen"], ["Alex West", "Daniel Craig"], ["Hillary", "Chris Barrie"], ["Bryce", "Noah Taylor"]],
    artifact: "Triangle of Light",
    note: "Screen pages use the same archive template but replace gameplay sections with cast, production, releases, locations, soundtrack, and gallery material."
  },
  {
    id: "movie2003",
    type: "Film",
    category: "screen",
    title: "The Cradle of Life",
    year: 2003,
    era: "Screen",
    developer: "Paramount Pictures",
    publisher: "Directed by Jan de Bont",
    platforms: "Feature film",
    location: "Greece, China, Africa",
    hero: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1800&q=88",
    blurb: "Angelina Jolie returns as Lara in a search for Pandora's Box and the mythical Cradle of Life.",
    levels: ["Santorini", "London", "China", "Africa", "The Cradle of Life"],
    characters: [["Lara Croft", "Angelina Jolie"], ["Terry Sheridan", "Gerard Butler"], ["Jonathan Reiss", "Ciaran Hinds"], ["Hillary", "Chris Barrie"]],
    artifact: "Pandora's Box",
    note: "This page should connect its locations and artifacts to related mythology entries without presenting the film continuity as game canon."
  },
  {
    id: "movie2018",
    type: "Film",
    category: "screen",
    title: "Tomb Raider",
    year: 2018,
    era: "Screen",
    developer: "Warner Bros. and MGM",
    publisher: "Directed by Roar Uthaug",
    platforms: "Feature film",
    location: "London, Hong Kong, Yamatai",
    hero: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=88",
    blurb: "Alicia Vikander stars as Lara in a film adaptation drawing heavily from the 2013 game and its Yamatai setting.",
    levels: ["London", "Hong Kong", "Yamatai", "Himiko's tomb"],
    characters: [["Lara Croft", "Alicia Vikander"], ["Richard Croft", "Dominic West"], ["Mathias Vogel", "Walton Goggins"], ["Lu Ren", "Daniel Wu"]],
    artifact: "Himiko's tomb",
    note: "Cross-links can show which ideas originate in the Survivor games while keeping the film's altered characters and plot distinct."
  },
  {
    id: "revisioned",
    type: "Animation",
    category: "screen",
    title: "ReVisioned: Tomb Raider",
    year: 2007,
    era: "Screen",
    developer: "GameTap",
    publisher: "Animated anthology",
    platforms: "Web animation",
    location: "Multiple continuities and styles",
    hero: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=88",
    blurb: "An animated anthology in which different writers and artists reinterpreted Lara Croft through short standalone stories.",
    levels: ["Keys to the Kingdom", "Revenge of the Aztec Mummy", "Angel Spit", "Lara Croft: Legacy", "Pre-Teen Raider", "Raising Thaumopolis"],
    characters: [["Lara Croft", "Reinterpreted across multiple shorts"]],
    artifact: "Anthology",
    note: "Anthologies benefit from episode-level credits and a clear statement that individual shorts may not share one continuity."
  },
  {
    id: "netflix",
    type: "Series",
    category: "screen",
    title: "The Legend of Lara Croft",
    year: 2024,
    era: "Screen",
    developer: "Legendary Television",
    publisher: "Netflix animated series",
    platforms: "Streaming series",
    location: "Global",
    hero: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=88",
    blurb: "An animated series following Lara after the Survivor trilogy, with Hayley Atwell voicing Lara Croft.",
    levels: ["Season 1", "Season 2"],
    characters: [["Lara Croft", "Voiced by Hayley Atwell"], ["Jonah Maiava", "Lara's friend and ally"], ["Zip", "Technical ally"]],
    artifact: "Animated continuation",
    note: "Episode pages should support cast, writers, directors, release dates, locations, artifacts, and continuity links."
  },
  {
    id: "topcow",
    type: "Comics",
    category: "print",
    title: "Tomb Raider Comics",
    year: 1999,
    era: "Print",
    developer: "Top Cow Productions",
    publisher: "Comic series",
    platforms: "Single issues and collected editions",
    location: "Multiple expeditions",
    hero: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1800&q=88",
    blurb: "The long-running Top Cow era expanded Lara into an extensive comic continuity with original adventures, supporting characters, and crossovers.",
    levels: ["Tomb Raider #1-50", "Journeys", "One-shots", "Crossovers", "Collected editions"],
    characters: [["Lara Croft", "Adventurer"], ["Chase Carver", "Recurring ally"], ["Madeline Hovan", "Recurring ally"]],
    artifact: "Top Cow continuity",
    note: "Print pages should prioritize issue order, story arcs, creators, collected editions, and continuity rather than trying to imitate a game guide."
  },
  {
    id: "beginning",
    type: "Comics",
    category: "print",
    title: "Tomb Raider: The Beginning",
    year: 2013,
    era: "Print",
    developer: "Dark Horse Comics",
    publisher: "Graphic novel",
    platforms: "Print and digital",
    location: "Before the Endurance expedition",
    hero: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1800&q=88",
    blurb: "A prequel graphic novel tied to the 2013 reboot, focusing on the Endurance crew before the events on Yamatai.",
    levels: ["The Beginning"],
    characters: [["Lara Croft", "Junior archaeologist"], ["Samantha Nishimura", "Lara's friend"], ["Conrad Roth", "Expedition leader"]],
    artifact: "Survivor prequel",
    note: "Tie-in pages should state their relationship to a game clearly and link back to the relevant game page."
  },
  {
    id: "immortals",
    type: "Novel",
    category: "print",
    title: "The Ten Thousand Immortals",
    year: 2014,
    era: "Print",
    developer: "Dan Abnett and Nik Vincent",
    publisher: "Novel",
    platforms: "Print and ebook",
    location: "After Yamatai",
    hero: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1800&q=88",
    blurb: "A Survivor-era novel following Lara after Yamatai as she searches for an artifact that might help Samantha Nishimura.",
    levels: ["Novel"],
    characters: [["Lara Croft", "Archaeologist"], ["Samantha Nishimura", "Lara's friend"]],
    artifact: "Golden Fleece",
    note: "Novel pages need publication details, authors, synopsis, continuity placement, editions, and related media links."
  },
  {
    id: "apocalypse",
    type: "Novel",
    category: "print",
    title: "Path of the Apocalypse",
    year: 2018,
    era: "Print",
    developer: "S. D. Perry",
    publisher: "Novel",
    platforms: "Print and ebook",
    location: "Survivor continuity",
    hero: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1800&q=88",
    blurb: "A tie-in novel positioned around the events leading into Shadow of the Tomb Raider.",
    levels: ["Novel"],
    characters: [["Lara Croft", "Archaeologist"], ["Jonah Maiava", "Lara's friend and ally"]],
    artifact: "Survivor tie-in",
    note: "The archive should make reading order and continuity placement easy to understand without forcing print material into game-style chapter structures."
  }
];

const gameResourceLabels = [
  ["map", "Walkthrough", "Level-by-level navigation"],
  ["key-round", "Secrets & collectibles", "Pickups, rewards, relics, and hidden areas"],
  ["user-round", "Characters", "Biographies and appearances"],
  ["crosshair", "Weapons & gear", "Weapons, tools, ammo, and upgrades"],
  ["shirt", "Outfits", "Unlocks, variants, and edition differences"],
  ["gamepad-2", "Controls", "Platform controls and movement notes"],
  ["terminal", "Cheats", "Codes, shortcuts, and useful tricks"],
  ["trophy", "Achievements", "Trophies, achievements, and completion"],
  ["image", "Gallery", "Screenshots, concept art, covers, and wallpapers"],
  ["music-2", "Soundtrack", "Composers, albums, and track information"],
  ["download", "Downloads & saves", "Save files, demos, utilities, and extras"],
  ["wrench", "Patches & bugs", "Compatibility, fixes, and known issues"]
];

const mediaResourceLabels = [
  ["users", "Cast & characters", "Cast, voice cast, and character guide"],
  ["list-video", "Episodes / chapters", "Episode, issue, or chapter order"],
  ["clapperboard", "Production", "Creators, studios, and production notes"],
  ["map-pin", "Locations", "Settings and related archive entries"],
  ["gem", "Artifacts & mythology", "Objects, legends, and historical references"],
  ["image", "Gallery", "Promotional art, stills, covers, and posters"],
  ["music-2", "Soundtrack", "Score and music information"],
  ["layers-3", "Editions & releases", "Formats, regions, collections, and reissues"]
];

const guideTypes = [
  ["map", "Walkthroughs", "Step-by-step level navigation organised by game and chapter."],
  ["key-round", "Secrets & collectibles", "Secret areas, relics, rewards, pickups, challenges, and 100% checklists."],
  ["gamepad-2", "Controls & moves", "Movement, combat, traversal, inventory, and platform-specific control references."],
  ["terminal", "Cheats & useful tricks", "Cheat codes, shortcuts, useful bugs, and classic game techniques."],
  ["trophy", "Achievements & trophies", "Completion requirements for modern releases and remasters."],
  ["save", "Save files", "A home for compatible save files, instructions, and version warnings."],
  ["wrench", "Patches & known issues", "Compatibility notes, fan patches, fixes, glitches, and platform differences."],
  ["image", "Galleries", "Screenshots, concept art, box covers, renders, promotional material, and wallpapers."]
];

const categoryInfo = {
  games: {
    title: "Games",
    eyebrow: "Interactive archive",
    intro: "Mainline games, remasters, reboots, and the pages that connect each release to walkthroughs, characters, artifacts, media, and technical reference."
  },
  screen: {
    title: "Screen",
    eyebrow: "Film & television",
    intro: "Live-action films, animation, series, cast, production information, continuity notes, locations, artifacts, and related releases."
  },
  print: {
    title: "Print",
    eyebrow: "Books & comics",
    intro: "Comics, novels, graphic novels, creators, reading order, collected editions, continuity placement, and related media."
  }
};

const main = document.querySelector("#main");
const searchInput = document.querySelector("#site-search");
let activeFilter = "All";
let liveSearch = "";

function icon(name, size) {
  var s = size || 18;
  return '<i data-lucide="' + name + '" style="width:' + s + 'px;height:' + s + 'px" aria-hidden="true"></i>';
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function footer() {
  return '<footer class="site-footer">' +
    '<div><strong>Tomb Atlas</strong><p>An independent fan-made Tomb Raider reference concept. Tomb Raider and Lara Croft are trademarks of their respective owners.</p></div>' +
    '<p>Designed as a structured archive first, with community material kept secondary to reference content.</p>' +
  '</footer>';
}

function parseRoute() {
  var raw = (location.hash || "#archive").slice(1);
  var parts = raw.split("/");
  if (parts[0] === "entry" && parts[1]) {
    return { route: "entry", id: decodeURIComponent(parts.slice(1).join("/")) };
  }
  if (parts[0] === "search") {
    return { route: "search", query: decodeURIComponent(parts.slice(1).join("/")) };
  }
  if (["archive", "games", "screen", "print", "guides"].indexOf(parts[0]) !== -1) {
    return { route: parts[0] };
  }
  return { route: "archive" };
}

function syncNavigation(route) {
  var active = route === "entry" ? null : route;
  document.querySelectorAll("[data-nav]").forEach(function(link) {
    link.classList.toggle("is-active", link.dataset.nav === active);
  });
  document.querySelectorAll("[data-mobile-nav]").forEach(function(link) {
    link.classList.toggle("is-active", link.dataset.mobileNav === active);
  });
}

function entryById(id) {
  return entries.find(function(item) { return item.id === id; });
}

function entriesByCategory(category) {
  return entries.filter(function(item) { return item.category === category; });
}

function searchableText(entry) {
  return [
    entry.title,
    entry.type,
    entry.category,
    entry.year,
    entry.era,
    entry.developer,
    entry.publisher,
    entry.platforms,
    entry.location,
    entry.blurb,
    entry.artifact,
    entry.levels.join(" "),
    entry.characters.map(function(character) { return character.join(" "); }).join(" "),
    (entry.category === "games" ? gameResourceLabels : mediaResourceLabels).map(function(resource) { return resource.join(" "); }).join(" ")
  ].join(" ").toLowerCase();
}

function entryCard(entry) {
  return '<a class="entry-card card" href="#entry/' + entry.id + '">' +
    '<div class="entry-card-image">' +
      '<img src="' + entry.hero + '" alt="" loading="lazy">' +
      '<span class="entry-card-type">' + escapeHTML(entry.type) + '</span>' +
    '</div>' +
    '<div class="entry-card-body">' +
      '<h3>' + escapeHTML(entry.title) + '</h3>' +
      '<div class="entry-card-meta">' + entry.year + ' · ' + escapeHTML(entry.era) + '</div>' +
      '<p>' + escapeHTML(entry.blurb) + '</p>' +
    '</div>' +
  '</a>';
}

function quickIndexItem(iconName, title, count, href) {
  return '<a href="' + href + '">' +
    '<span class="quick-icon">' + icon(iconName, 18) + '</span>' +
    '<span><strong>' + title + '</strong><small>' + count + ' entries</small></span>' +
    icon("chevron-right", 17) +
  '</button>';
}

function renderArchive() {
  var games = entriesByCategory("games");
  var screen = entriesByCategory("screen");
  var print = entriesByCategory("print");
  var featured = ["tr1", "legend", "tr2013", "remastered123"].map(entryById);

  main.innerHTML = '<div class="page-shell">' +
    '<section class="archive-hero panel">' +
      '<div class="archive-hero-copy">' +
        '<span class="eyebrow">Tomb Raider reference</span>' +
        '<h1>Every expedition, in one place.</h1>' +
        '<p>Games, films, series, comics, novels, walkthroughs, characters, artifacts, galleries, technical notes, and the connective tissue between them.</p>' +
        '<div class="hero-actions">' +
          '<a class="primary-button" href="#games">' + icon("gamepad-2", 17) + '<span>Browse games</span></a>' +
          '<a class="secondary-button" href="#guides">' + icon("map", 17) + '<span>Open guides</span></a>' +
        '</div>' +
      '</div>' +
      '<aside class="archive-hero-side">' +
        '<span class="eyebrow">Quick index</span>' +
        '<h2>Explore the archive</h2>' +
        '<div class="quick-index">' +
          quickIndexItem("gamepad-2", "Games", games.length, "#games") +
          quickIndexItem("clapperboard", "Screen", screen.length, "#screen") +
          quickIndexItem("book-open", "Print", print.length, "#print") +
          quickIndexItem("map", "Guides", guideTypes.length, "#guides") +
        '</div>' +
      '</aside>' +
    '</section>' +

    '<section class="section">' +
      '<div class="stat-strip">' +
        '<div><strong>' + games.length + '</strong><span>game and remaster pages</span></div>' +
        '<div><strong>' + screen.length + '</strong><span>film, series, and animation pages</span></div>' +
        '<div><strong>' + print.length + '</strong><span>comic and novel pages</span></div>' +
        '<div><strong>12</strong><span>reference sections per game</span></div>' +
      '</div>' +
    '</section>' +

    '<section class="section">' +
      '<div class="section-head"><div><span class="eyebrow">Start here</span><h2>Across the eras</h2><p>Each title now has a dedicated page with a consistent structure instead of being treated as a social post or collection card.</p></div><a class="text-link" href="#games">All games ' + icon("arrow-right", 16) + '</a></div>' +
      '<div class="media-grid">' + featured.map(entryCard).join("") + '</div>' +
    '</section>' +

    '<section class="section">' +
      '<div class="section-head"><div><span class="eyebrow">Reference structure</span><h2>Built for finding things</h2><p>The archive is organised around the material fans repeatedly need when they return to a game or piece of media.</p></div></div>' +
      '<div class="category-row">' +
        '<a class="category-tile" href="#guides">' + icon("map", 25) + '<div><strong>Walkthroughs</strong><span>Levels, puzzles, bosses</span></div></a>' +
        '<a class="category-tile" href="#guides">' + icon("key-round", 25) + '<div><strong>Secrets</strong><span>Collectibles, rewards, 100%</span></div></a>' +
        '<a class="category-tile" href="#games">' + icon("users", 25) + '<div><strong>Characters</strong><span>Biographies and appearances</span></div></a>' +
        '<a class="category-tile" href="#games">' + icon("gem", 25) + '<div><strong>Artifacts</strong><span>Objects, myths, locations</span></div></a>' +
        '<a class="category-tile" href="#guides">' + icon("wrench", 25) + '<div><strong>Technical</strong><span>Controls, saves, fixes, bugs</span></div></a>' +
      '</div>' +
    '</section>' +

    '<section class="section archive-callout panel">' +
      '<div class="archive-callout-art"></div>' +
      '<div class="archive-callout-copy">' +
        '<span class="eyebrow">Why the archive changed</span>' +
        '<h2>Less feed. More reference.</h2>' +
        '<p>The social layer is intentionally small now. Community observations can still live alongside an entry, but the primary job of Tomb Atlas is to answer a question, help with a game, or let someone explore the franchise without digging through a feed.</p>' +
      '</div>' +
    '</section>' +
    footer() +
  '</div>';

  refreshIcons();
}

function filtersFor(category) {
  if (category === "games") return ["All", "Classic", "Legend", "Survivor", "Remastered"];
  if (category === "screen") return ["All", "Film", "Series", "Animation"];
  if (category === "print") return ["All", "Comics", "Novel"];
  return ["All"];
}

function matchesFilter(entry, filter) {
  if (filter === "All") return true;
  if (entry.category === "games") return entry.era === filter;
  return entry.type === filter;
}

function renderHub(category) {
  var info = categoryInfo[category];
  var all = entriesByCategory(category);
  var filters = filtersFor(category);
  if (filters.indexOf(activeFilter) === -1) activeFilter = "All";
  var filtered = all.filter(function(entry) { return matchesFilter(entry, activeFilter); });

  main.innerHTML = '<div class="page-shell">' +
    '<header class="hub-header">' +
      '<div><span class="eyebrow">' + info.eyebrow + '</span><h1 class="page-heading">' + info.title + '</h1><p class="page-intro">' + info.intro + '</p></div>' +
      '<div class="hub-count"><strong>' + all.length + '</strong><span>entries currently structured</span></div>' +
    '</header>' +

    '<div class="filter-bar" role="group" aria-label="' + info.title + ' filters">' +
      filters.map(function(filter) {
        return '<button class="' + (filter === activeFilter ? "is-active" : "") + '" data-filter="' + filter + '">' + filter + '</button>';
      }).join("") +
    '</div>' +

    '<section class="media-grid">' + filtered.map(entryCard).join("") + '</section>' +
    footer() +
  '</div>';

  document.querySelectorAll("[data-filter]").forEach(function(button) {
    button.addEventListener("click", function() {
      activeFilter = button.dataset.filter;
      renderHub(category);
    });
  });

  refreshIcons();
}

function resourceItem(resource) {
  return '<button class="resource-item" type="button" data-scroll-target="reference">' +
    '<span class="resource-icon">' + icon(resource[0], 20) + '</span>' +
    '<span><strong>' + escapeHTML(resource[1]) + '</strong><span>' + escapeHTML(resource[2]) + '</span></span>' +
    icon("chevron-right", 17) +
  '</a>';
}

function infoTile(iconName, title, detail) {
  return '<div class="info-tile">' + icon(iconName, 23) + '<strong>' + escapeHTML(title) + '</strong><span>' + escapeHTML(detail) + '</span></div>';
}

function renderEntry(entry) {
  if (!entry) {
    renderNotFound();
    return;
  }

  var isGame = entry.category === "games";
  var backHref = "#" + entry.category;
  var backLabel = categoryInfo[entry.category].title;
  var resources = isGame ? gameResourceLabels : mediaResourceLabels;
  var sectionLabel = isGame ? "Levels & chapters" : (entry.type === "Series" || entry.type === "Animation" ? "Episodes & parts" : "Contents & structure");

  main.innerHTML = '<div class="page-shell">' +
    '<section class="entry-hero panel">' +
      '<div class="entry-hero-bg"><img src="' + entry.hero + '" alt=""></div>' +
      '<div class="entry-hero-content">' +
        '<a class="entry-back" href="' + backHref + '">' + icon("arrow-left", 16) + '<span>Back to ' + backLabel + '</span></a>' +
        '<span class="eyebrow">' + escapeHTML(entry.type) + ' · ' + entry.year + '</span>' +
        '<h1>' + escapeHTML(entry.title) + '</h1>' +
        '<p>' + escapeHTML(entry.blurb) + '</p>' +
        '<div class="entry-facts"><span>' + escapeHTML(entry.era) + '</span><span>' + escapeHTML(entry.developer) + '</span><span>' + escapeHTML(entry.platforms) + '</span></div>' +
      '</div>' +
    '</section>' +

    '<div class="entry-layout">' +
      '<article class="entry-main">' +
        '<section class="article-section panel" id="overview">' +
          '<span class="eyebrow">Overview</span>' +
          '<h2>' + escapeHTML(entry.title) + '</h2>' +
          '<p>' + escapeHTML(entry.blurb) + '</p>' +
          '<div class="info-grid">' +
            infoTile("calendar-days", "Released", String(entry.year)) +
            infoTile("building-2", isGame ? "Developer" : "Creator / studio", entry.developer) +
            infoTile("map-pin", "Primary setting", entry.location) +
            infoTile("gem", "Key artifact / focus", entry.artifact) +
            infoTile(isGame ? "gamepad-2" : "layers-3", isGame ? "Platforms" : "Format", entry.platforms) +
            infoTile("landmark", "Archive era", entry.era) +
          '</div>' +
        '</section>' +

        '<section class="article-section panel" id="levels">' +
          '<span class="eyebrow">' + sectionLabel + '</span>' +
          '<h2>' + (isGame ? "Progression" : "Structure") + '</h2>' +
          '<p>' + (isGame ? "A scannable route through the game. Each row can later expand into its own walkthrough, secrets, pickups, screenshots, and notes." : "A structured contents list that can expand into episode, issue, chapter, or story-level pages.") + '</p>' +
          '<div class="level-list">' +
            entry.levels.map(function(level, index) {
              return '<div class="level-row"><span class="level-number">' + String(index + 1).padStart(2, "0") + '</span><strong>' + escapeHTML(level) + '</strong><span class="pill">' + (isGame ? "Guide" : "Reference") + '</span></div>';
            }).join("") +
          '</div>' +
        '</section>' +

        '<section class="article-section panel" id="reference">' +
          '<span class="eyebrow">Reference index</span>' +
          '<h2>' + (isGame ? "Everything tied to this game" : "Everything tied to this release") + '</h2>' +
          '<p>The same categories stay in the same place on every entry page, so the site remains predictable as the archive grows.</p>' +
          '<div class="resource-list">' + resources.map(resourceItem).join("") + '</div>' +
        '</section>' +

        '<section class="article-section panel" id="characters">' +
          '<span class="eyebrow">People</span>' +
          '<h2>' + (isGame ? "Characters" : "Cast & characters") + '</h2>' +
          '<div class="character-grid">' +
            entry.characters.map(function(character) {
              return '<div class="character-card"><strong>' + escapeHTML(character[0]) + '</strong><span>' + escapeHTML(character[1]) + '</span></div>';
            }).join("") +
          '</div>' +
        '</section>' +

        '<section class="article-section panel" id="notes">' +
          '<span class="eyebrow">Archive note</span>' +
          '<h2>Community context, kept secondary</h2>' +
          '<p>Useful fan observations belong beside the reference material they clarify, not in a separate attention-driven feed.</p>' +
          '<div class="note-card"><strong>' + icon("message-square-text", 17) + '<span>Editor note</span></strong><p>' + escapeHTML(entry.note) + '</p></div>' +
        '</section>' +
      '</article>' +

      '<aside class="entry-sidebar">' +
        '<div class="entry-sidebar-inner">' +
          '<section class="fact-panel panel">' +
            '<h3>At a glance</h3>' +
            '<div class="fact-list">' +
              '<div><span>Type</span><strong>' + escapeHTML(entry.type) + '</strong></div>' +
              '<div><span>Year</span><strong>' + entry.year + '</strong></div>' +
              '<div><span>' + (isGame ? "Publisher" : "Release") + '</span><strong>' + escapeHTML(entry.publisher) + '</strong></div>' +
              '<div><span>Setting</span><strong>' + escapeHTML(entry.location) + '</strong></div>' +
              '<div><span>Archive sections</span><strong>' + resources.length + '</strong></div>' +
            '</div>' +
          '</section>' +
          '<section class="on-this-page panel">' +
            '<h3>On this page</h3>' +
            '<nav aria-label="Entry sections">' +
              '<button type="button" data-scroll-target="overview">Overview</button>' +
              '<button type="button" data-scroll-target="levels">' + sectionLabel + '</button>' +
              '<button type="button" data-scroll-target="reference">Reference index</button>' +
              '<button type="button" data-scroll-target="characters">' + (isGame ? "Characters" : "Cast & characters") + '</button>' +
              '<button type="button" data-scroll-target="notes">Archive note</button>' +
            '</nav>' +
          '</section>' +
        '</div>' +
      '</aside>' +
    '</div>' +
    footer() +
  '</div>';

  document.querySelectorAll("[data-scroll-target]").forEach(function(control) {
    control.addEventListener("click", function() {
      var target = document.getElementById(control.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  refreshIcons();
}

function renderGuides() {
  main.innerHTML = '<div class="page-shell">' +
    '<header class="hub-header">' +
      '<div><span class="eyebrow">Player reference</span><h1 class="page-heading">Guides</h1><p class="page-intro">The practical side of the archive: getting unstuck, finding what you missed, understanding a platform difference, or making an older release work properly.</p></div>' +
      '<div class="hub-count"><strong>' + guideTypes.length + '</strong><span>guide systems in the design</span></div>' +
    '</header>' +

    '<section class="section">' +
      '<div class="guide-grid">' +
        guideTypes.map(function(guide) {
          return '<a class="guide-card" href="#games">' +
            '<span class="guide-card-icon">' + icon(guide[0], 22) + '</span>' +
            '<div><h3>' + escapeHTML(guide[1]) + '</h3><p>' + escapeHTML(guide[2]) + '</p></div>' +
            '<small>Browse by game</small>' +
          '</a>';
        }).join("") +
      '</div>' +
    '</section>' +

    '<section class="section archive-callout panel">' +
      '<div class="archive-callout-art"></div>' +
      '<div class="archive-callout-copy">' +
        '<span class="eyebrow">Guide philosophy</span>' +
        '<h2>Useful before exhaustive.</h2>' +
        '<p>Game pages are structured so a player can eventually jump straight from a level to its secrets, screenshots, pickups, achievements, save files, and known bugs. The system is ready for depth without requiring every guide to be written at once.</p>' +
      '</div>' +
    '</section>' +
    footer() +
  '</div>';

  refreshIcons();
}

function renderSearch(query) {
  var q = (query || "").trim().toLowerCase();
  var found = q ? entries.filter(function(entry) { return searchableText(entry).indexOf(q) !== -1; }) : [];

  main.innerHTML = '<div class="page-shell">' +
    '<header class="search-head">' +
      '<span class="eyebrow">Search</span>' +
      '<h1 class="page-heading">' + (q ? 'Results for <span class="search-query">"' + escapeHTML(query) + '"</span>' : "Search the archive") + '</h1>' +
      '<p class="page-intro">' + (q ? found.length + " matching archive entries across games, screen, and print." : "Search titles, years, locations, characters, artifacts, guide categories, studios, and platforms.") + '</p>' +
    '</header>' +
    (q && found.length ? '<section class="section"><div class="media-grid">' + found.map(entryCard).join("") + '</div></section>' : "") +
    (q && !found.length ? '<section class="section empty-state panel">' + icon("search-x", 34) + '<strong>No matching entries</strong><span>Try a title, character, location, artifact, platform, or guide category.</span></section>' : "") +
    footer() +
  '</div>';

  refreshIcons();
}

function renderNotFound() {
  main.innerHTML = '<div class="page-shell"><section class="empty-state panel">' +
    icon("map-pinned", 34) +
    '<strong>That archive page is missing.</strong>' +
    '<span>The route does not match an entry in Tomb Atlas.</span>' +
    '<a class="primary-button" href="#archive">Return to archive</a>' +
  '</section>' + footer() + '</div>';
  refreshIcons();
}

function renderRoute() {
  var parsed = parseRoute();
  liveSearch = "";
  searchInput.value = "";
  syncNavigation(parsed.route);

  if (parsed.route === "archive") renderArchive();
  else if (parsed.route === "games" || parsed.route === "screen" || parsed.route === "print") {
    activeFilter = "All";
    renderHub(parsed.route);
  }
  else if (parsed.route === "guides") renderGuides();
  else if (parsed.route === "entry") renderEntry(entryById(parsed.id));
  else if (parsed.route === "search") {
    searchInput.value = parsed.query || "";
    renderSearch(parsed.query || "");
  }
  else renderNotFound();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

searchInput.addEventListener("input", function(event) {
  liveSearch = event.target.value;
  if (!liveSearch.trim()) {
    renderRoute();
    return;
  }
  syncNavigation("search");
  renderSearch(liveSearch);
});

searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && searchInput.value.trim()) {
    event.preventDefault();
    location.hash = "#search/" + encodeURIComponent(searchInput.value.trim());
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

window.addEventListener("hashchange", renderRoute);

renderRoute();
refreshIcons();
