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
  },
  {
    id: "guardian",
    type: "Game",
    category: "games",
    title: "Lara Croft and the Guardian of Light",
    year: 2010,
    era: "Lara Croft",
    developer: "Crystal Dynamics",
    publisher: "Crystal Dynamics",
    platforms: "PC, Xbox 360, PlayStation 3, Switch, iOS, Android",
    location: "Central America",
    hero: "",
    blurb: "An isometric action-adventure built around exploration, traps, score challenges, and cooperative puzzle solving with Lara and the guardian Totec.",
    levels: ["Campaign", "Challenge objectives", "Relics & artifacts", "Co-op puzzles"],
    characters: [["Lara Croft", "Adventurer"], ["Totec", "Guardian of Light"], ["Xolotl", "Keeper of Darkness"]],
    artifact: "Mirror of Smoke",
    note: "This branch of the franchise needs its own identity in the archive while remaining connected to the main Tomb Raider timeline."
  },
  {
    id: "osiris",
    type: "Game",
    category: "games",
    title: "Lara Croft and the Temple of Osiris",
    year: 2014,
    era: "Lara Croft",
    developer: "Crystal Dynamics",
    publisher: "Crystal Dynamics",
    platforms: "PC, PlayStation 4, Xbox One, Switch",
    location: "Egypt",
    hero: "",
    blurb: "A four-player cooperative action-adventure in which Lara, Carter Bell, Horus, and Isis work together to stop Set and restore Osiris.",
    levels: ["Campaign", "Tombs", "Challenge rooms", "Relics & rewards"],
    characters: [["Lara Croft", "Adventurer"], ["Carter Bell", "Treasure hunter"], ["Horus", "Egyptian god"], ["Isis", "Egyptian goddess"], ["Set", "Antagonist"]],
    artifact: "Fragments of Osiris",
    note: "Co-op mechanics, challenge tombs, score systems, and platform releases should be easy to distinguish from the mainline series."
  },
  {
    id: "relicrun",
    type: "Mobile Game",
    category: "games",
    title: "Lara Croft: Relic Run",
    year: 2015,
    era: "Mobile",
    developer: "Simutronics",
    publisher: "Square Enix",
    platforms: "iOS, Android",
    location: "Multiple expedition zones",
    hero: "",
    blurb: "A mobile action runner built around traversal, vehicles, combat, boss encounters, and relic collection.",
    levels: ["Expedition zones", "Relics", "Boss encounters", "Upgrades"],
    characters: [["Lara Croft", "Adventurer"]],
    artifact: "Ancient relics",
    note: "Mobile titles need version history and availability notes because storefront support can change over time."
  },
  {
    id: "laracroftgo",
    type: "Mobile Game",
    category: "games",
    title: "Lara Croft GO",
    year: 2016,
    era: "Mobile",
    developer: "Square Enix Montreal",
    publisher: "Crystal Dynamics",
    platforms: "iOS, Android, PC, PlayStation",
    location: "A long-forgotten civilization",
    hero: "",
    blurb: "A turn-based puzzle adventure that distills traversal, traps, enemies, relics, and exploration into carefully staged diorama-like levels.",
    levels: ["Main adventure", "Relic collections", "Bonus chapters", "Outfits"],
    characters: [["Lara Croft", "Adventurer"], ["Queen of Venom", "Mythic adversary"]],
    artifact: "Relic collections",
    note: "Puzzle solutions should be indexed by area and move sequence without overwhelming the clean presentation."
  },
  {
    id: "reloaded",
    type: "Mobile Game",
    category: "games",
    title: "Tomb Raider Reloaded",
    year: 2023,
    era: "Mobile",
    developer: "Emerald City Games",
    publisher: "CDE Entertainment",
    platforms: "iOS, Android",
    location: "Classic-inspired tombs and ruins",
    hero: "",
    blurb: "A stylized roguelike mobile game that reinterprets classic Tomb Raider enemies, relics, traps, and locations around repeatable runs and ability choices.",
    levels: ["Campaign chapters", "Relics", "Abilities", "Events"],
    characters: [["Lara Croft", "Adventurer"]],
    artifact: "Scion-inspired relic hunt",
    note: "Live-service and mobile entries need update history separated from evergreen game information."
  },
  {
    id: "legacy",
    type: "Game",
    category: "games",
    title: "Tomb Raider: Legacy of Atlantis",
    year: 2027,
    era: "Upcoming",
    developer: "Crystal Dynamics / Flying Wild Hog",
    publisher: "Amazon Games",
    platforms: "PlayStation 5, Xbox Series X|S, PC, Switch 2",
    location: "Peru, Greece, Egypt, Mediterranean",
    hero: "",
    blurb: "A modern reimagining of Lara Croft's 1996 adventure, rebuilding the search for the Scion with interconnected spaces, redesigned puzzles, and contemporary traversal.",
    levels: ["Peru", "Greece", "Egypt", "Atlantis"],
    characters: [["Lara Croft", "Archaeologist and adventurer"], ["Jacqueline Natla", "Atlantean ruler"]],
    artifact: "Scion of Atlantis",
    note: "Keep this page clearly separated from both the 1996 original and Anniversary while cross-linking shared locations, characters, and artifacts."
  },
  {
    id: "catalyst",
    type: "Game",
    category: "games",
    title: "Tomb Raider: Catalyst",
    year: 2027,
    era: "Upcoming",
    developer: "Crystal Dynamics",
    publisher: "Amazon Games",
    platforms: "PlayStation 5, Xbox Series X|S, PC",
    location: "Northern India",
    hero: "",
    blurb: "A new Lara Croft adventure set across Northern India after a mythical cataclysm exposes ancient secrets and draws rival treasure hunters into the region.",
    levels: ["Northern India", "Tombs", "Open exploration", "Adventure tech"],
    characters: [["Lara Croft", "Archaeologist and adventurer"]],
    artifact: "Unannounced",
    note: "Upcoming titles should preserve confirmed information and clearly distinguish it from speculation or fan interpretation."
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

const officialArt = {
  tr1: "https://images.ctfassets.net/x77ixfmkpoiv/7pTZciXENaSSnInYyFGDaU/b87e6aea3adb657bdf7bbaa88fc69ccd/TRI_Product_Image.jpg",
  legend: "https://images.ctfassets.net/x77ixfmkpoiv/1NSgtwUYhUwTEeBd0aPdPP/eb5e3b6b63f7687fecc4ef7ab175a1a2/Tomb-Raider-Legend-Box-Art-1x1-min.png",
  tr2013: "https://images.ctfassets.net/x77ixfmkpoiv/1kBTjEMTz260u9jP8y3rUb/94f34f188d522f685d5350231100b0ea/6WCniRsHGdHc6mJU7rOQ6yRu.webp",
  rise: "https://images.ctfassets.net/x77ixfmkpoiv/1kBTjEMTz260u9jP8y3rUb/94f34f188d522f685d5350231100b0ea/6WCniRsHGdHc6mJU7rOQ6yRu.webp",
  shadow: "https://images.ctfassets.net/x77ixfmkpoiv/1kBTjEMTz260u9jP8y3rUb/94f34f188d522f685d5350231100b0ea/6WCniRsHGdHc6mJU7rOQ6yRu.webp",
  remastered123: "https://images.ctfassets.net/x77ixfmkpoiv/7ErxLMbT9j12ay9gUrfiXp/451a3da53a3ce5462c74bed6a172a4b7/TR-Horizontal-Key-Art.png",
  remastered456: "https://images.ctfassets.net/x77ixfmkpoiv/4El0ojdohCP4m3syZSEYHl/0c3e724f0985ea69f1e4073e4039389d/TR4-6-Horizontal-Key-Art.jpg",
  legacy: "https://images.ctfassets.net/x77ixfmkpoiv/4RcCksagisTo2TKarz0S9w/d79f84520b5625adf7755fa7af9fb819/Tomb_Raider_-_Legacy_of_Atlantis_NoLogo_169_crop.png",
  catalyst: "https://images.ctfassets.net/x77ixfmkpoiv/6tHn0Q2ZyzuR0YMvmz23YM/f2caaf6ae151b325a0316f0a6f71ab72/TombRaider-Catalyst-Teaser-LaraCroft-Climb.png"
};

const anniversaryArt = "https://images.ctfassets.net/x77ixfmkpoiv/rr7mVtH3FEiqh8rXUtEeA/255f98ea62abc1af4195badfcc72d60d/Tomb_Raider_30th_Anniversary_Desktop_Wallpaper.png";

function shortTitle(title) {
  return title.replace(/^Lara Croft:?\s*/i, "").replace(/^Tomb Raider:?\s*/i, "").trim() || "Tomb Raider";
}

function visualClass(entry) {
  if (entry.era === "Classic") return "classic";
  if (entry.era === "Legend") return "legend";
  if (entry.era === "Survivor") return "survivor";
  if (entry.era === "Remastered") return "remastered";
  if (entry.era === "Upcoming") return "upcoming";
  if (entry.era === "Mobile" || entry.era === "Lara Croft") return "spinoff";
  if (entry.category === "screen") return "screen";
  return "print";
}

function entryVisual(entry, className) {
  var art = officialArt[entry.id];
  var cls = className || "media-art";
  if (art) {
    return '<div class="' + cls + '"><img src="' + art + '" alt="" loading="lazy"></div>';
  }
  return '<div class="' + cls + ' art-fallback art-' + visualClass(entry) + '">' +
    '<span class="art-icon">' + icon(entry.category === "games" ? "compass" : entry.category === "screen" ? "clapperboard" : "book-open", 24) + '</span>' +
    '<span class="art-year">' + entry.year + '</span>' +
    '<strong>' + escapeHTML(shortTitle(entry.title)) + '</strong>' +
  '</div>';
}

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
    '<div><strong>Tomb Atlas</strong><p>Independent Tomb Raider reference covering games, screen, print, guides, characters, artifacts, and technical material.</p></div>' +
    '<p>Tomb Raider and Lara Croft are trademarks of their respective owners. Tomb Atlas is an unofficial fan project.</p>' +
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
  return '<a class="archive-entry" href="#entry/' + entry.id + '">' +
    '<div class="archive-entry-image"><img src="' + entry.hero + '" alt="" loading="lazy"></div>' +
    '<div>' +
      '<div class="archive-entry-meta">' + escapeHTML(entry.type) + ' / ' + entry.year + ' / ' + escapeHTML(entry.era) + '</div>' +
      '<h3>' + escapeHTML(entry.title) + '</h3>' +
      '<p>' + escapeHTML(entry.blurb) + '</p>' +
    '</div>' +
    '<span class="archive-entry-arrow">' + icon("arrow-up-right", 18) + '</span>' +
  '</a>';
}

function quickIndexItem(iconName, title, count, href) {
  return '<a href="' + href + '">' +
    '<span class="archive-index-icon">' + icon(iconName, 20) + '</span>' +
    '<span><strong>' + title + '</strong><span>' + count + ' indexed entries</span></span>' +
    icon("arrow-right", 17) +
  '</a>';
}

function renderArchive() {
  var games = entriesByCategory("games");
  var screen = entriesByCategory("screen");
  var print = entriesByCategory("print");
  var featured = ["tr1", "legend", "tr2013", "remastered123"].map(entryById);

  main.innerHTML = '<div class="page-shell">' +
    '<section class="archive-masthead">' +
      '<div class="archive-copy">' +
        '<div class="archive-kicker"><span>Independent Tomb Raider index</span><span>1996 to present</span></div>' +
        '<h1>Tomb Raider, properly indexed.</h1>' +
        '<p>A clean reference for the games and the media around them: walkthroughs, levels, secrets, characters, artifacts, films, series, comics, novels, galleries, music, saves, patches, and platform notes.</p>' +
        '<div class="archive-actions">' +
          '<a class="primary-button" href="#games">' + icon("gamepad-2", 17) + '<span>Browse games</span></a>' +
          '<a class="secondary-button" href="#guides">' + icon("map", 17) + '<span>Open guides</span></a>' +
        '</div>' +
      '</div>' +
      '<div class="archive-visual">' +
        '<div class="archive-visual-frame"><img src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1600&q=88" alt=""></div>' +
        '<div class="archive-visual-meta"><span>Archive / 001</span><span>Expeditions, artifacts, places</span></div>' +
      '</div>' +
    '</section>' +

    '<nav class="archive-index" aria-label="Archive index">' +
      quickIndexItem("gamepad-2", "Games", games.length, "#games") +
      quickIndexItem("clapperboard", "Screen", screen.length, "#screen") +
      quickIndexItem("book-open", "Print", print.length, "#print") +
      quickIndexItem("map", "Guides", guideTypes.length, "#guides") +
    '</nav>' +

    '<section class="section">' +
      '<div class="section-head"><div><span class="eyebrow">Selected entries</span><h2>Across the series</h2><p>A cross-section of the archive showing how every title follows the same information structure.</p></div><a class="text-link" href="#games">View all games ' + icon("arrow-right", 16) + '</a></div>' +
      '<div class="archive-entry-list">' + featured.map(entryCard).join("") + '</div>' +
    '</section>' +

    '<section class="section">' +
      '<div class="section-head"><div><span class="eyebrow">Reference</span><h2>Find the thing you came for</h2><p>Reference categories stay stable from game to game instead of changing layout on every page.</p></div></div>' +
      '<div class="reference-columns">' +
        '<a class="reference-column" href="#guides">' + icon("map", 22) + '<div><strong>Walkthroughs</strong><span>Levels, puzzles, bosses</span></div></a>' +
        '<a class="reference-column" href="#guides">' + icon("key-round", 22) + '<div><strong>Secrets</strong><span>Collectibles, pickups, 100%</span></div></a>' +
        '<a class="reference-column" href="#games">' + icon("users", 22) + '<div><strong>Characters</strong><span>Biographies and appearances</span></div></a>' +
        '<a class="reference-column" href="#games">' + icon("gem", 22) + '<div><strong>Artifacts</strong><span>Objects, mythology, locations</span></div></a>' +
        '<a class="reference-column" href="#guides">' + icon("wrench", 22) + '<div><strong>Technical</strong><span>Controls, saves, bugs, patches</span></div></a>' +
      '</div>' +
    '</section>' +

    '<section class="section archive-note">' +
      '<div><span class="eyebrow">Editorial direction</span><h2>Reference first. Community second.</h2></div>' +
      '<p>Tomb Atlas is structured to answer questions and help people explore the franchise. Community discoveries can attach to the relevant page later, but they do not drive the layout or compete with the archive.</p>' +
    '</section>' +
    footer() +
  '</div>';

  refreshIcons();
}
function filtersFor(category) {
  if (category === "games") return ["All", "Classic", "Legend", "Survivor", "Lara Croft", "Mobile", "Remastered", "Upcoming"];
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
      '<div class="hub-summary"><strong>' + all.length + '</strong><span>indexed entries</span></div>' +
    '</header>' +
    '<div class="filter-bar" role="group" aria-label="' + info.title + ' filters">' +
      filters.map(function(filter) {
        return '<button class="' + (filter === activeFilter ? "is-active" : "") + '" data-filter="' + filter + '">' + filter + '</button>';
      }).join("") +
    '</div>' +
    '<section class="archive-entry-list">' + filtered.map(entryCard).join("") + '</section>' +
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
  return '<div class="resource-item">' +
    '<span class="resource-icon">' + icon(resource[0], 19) + '</span>' +
    '<span><strong>' + escapeHTML(resource[1]) + '</strong><span>' + escapeHTML(resource[2]) + '</span></span>' +
  '</div>';
}

function infoTile(iconName, title, detail) {
  return '<div class="info-row">' +
    icon(iconName, 19) +
    '<div><strong>' + escapeHTML(title) + '</strong><span>' + escapeHTML(detail) + '</span></div>' +
  '</div>';
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
    '<section class="entry-hero">' +
      '<div class="entry-hero-copy">' +
        '<a class="entry-back" href="' + backHref + '">' + icon("arrow-left", 16) + '<span>Back to ' + backLabel + '</span></a>' +
        '<span class="eyebrow">' + escapeHTML(entry.type) + ' / ' + entry.year + '</span>' +
        '<h1>' + escapeHTML(entry.title) + '</h1>' +
        '<p>' + escapeHTML(entry.blurb) + '</p>' +
        '<div class="entry-hero-meta"><span>' + escapeHTML(entry.era) + '</span><span>' + escapeHTML(entry.developer) + '</span><span>' + escapeHTML(entry.platforms) + '</span></div>' +
      '</div>' +
      '<div class="entry-hero-image"><img src="' + entry.hero + '" alt=""></div>' +
    '</section>' +

    '<div class="entry-body">' +
      '<article class="entry-main">' +
        '<section class="article-section" id="overview">' +
          '<span class="eyebrow">Overview</span>' +
          '<h2>At a glance</h2>' +
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

        '<section class="article-section" id="levels">' +
          '<span class="eyebrow">' + sectionLabel + '</span>' +
          '<h2>' + (isGame ? "Progression" : "Structure") + '</h2>' +
          '<p>' + (isGame ? "The complete route through the game, ready to connect each chapter to walkthroughs, secrets, pickups, screenshots, and completion notes." : "The release structure, ready to connect each part to credits, synopsis, continuity, and related reference material.") + '</p>' +
          '<div class="level-list">' +
            entry.levels.map(function(level, index) {
              return '<div class="level-row"><span class="level-number">' + String(index + 1).padStart(2, "0") + '</span><strong>' + escapeHTML(level) + '</strong><span>' + (isGame ? "Guide" : "Reference") + '</span></div>';
            }).join("") +
          '</div>' +
        '</section>' +

        '<section class="article-section" id="reference">' +
          '<span class="eyebrow">Reference index</span>' +
          '<h2>' + (isGame ? "Everything tied to this game" : "Everything tied to this release") + '</h2>' +
          '<p>Reference categories follow the same order across the archive so navigation stays predictable as the site grows.</p>' +
          '<div class="resource-list">' + resources.map(resourceItem).join("") + '</div>' +
        '</section>' +

        '<section class="article-section" id="characters">' +
          '<span class="eyebrow">People</span>' +
          '<h2>' + (isGame ? "Characters" : "Cast & characters") + '</h2>' +
          '<div class="character-list">' +
            entry.characters.map(function(character) {
              return '<div class="character-row"><strong>' + escapeHTML(character[0]) + '</strong><span>' + escapeHTML(character[1]) + '</span></div>';
            }).join("") +
          '</div>' +
        '</section>' +

        '<section class="article-section" id="notes">' +
          '<span class="eyebrow">Archive note</span>' +
          '<h2>Context that belongs here</h2>' +
          '<p>Useful fan knowledge should sit beside the information it improves instead of living in a separate feed.</p>' +
          '<div class="note-block"><strong>' + icon("message-square-text", 17) + '<span>Editor note</span></strong><p>' + escapeHTML(entry.note) + '</p></div>' +
        '</section>' +
      '</article>' +

      '<aside class="entry-sidebar">' +
        '<div class="entry-sidebar-inner">' +
          '<section class="sidebar-block">' +
            '<h3>Record</h3>' +
            '<div class="fact-list">' +
              '<div><span>Type</span><strong>' + escapeHTML(entry.type) + '</strong></div>' +
              '<div><span>Year</span><strong>' + entry.year + '</strong></div>' +
              '<div><span>' + (isGame ? "Publisher" : "Release") + '</span><strong>' + escapeHTML(entry.publisher) + '</strong></div>' +
              '<div><span>Setting</span><strong>' + escapeHTML(entry.location) + '</strong></div>' +
              '<div><span>Reference sections</span><strong>' + resources.length + '</strong></div>' +
            '</div>' +
          '</section>' +
          '<section class="sidebar-block on-this-page">' +
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
      '<div><span class="eyebrow">Player reference</span><h1 class="page-heading">Guides</h1><p class="page-intro">Practical reference for playing, finishing, fixing, and revisiting Tomb Raider across different releases and platforms.</p></div>' +
      '<div class="hub-summary"><strong>' + guideTypes.length + '</strong><span>guide categories</span></div>' +
    '</header>' +
    '<section class="section">' +
      '<div class="guide-list">' +
        guideTypes.map(function(guide) {
          return '<a class="guide-row" href="#search/' + encodeURIComponent(guide[1]) + '">' +
            '<span class="guide-row-icon">' + icon(guide[0], 20) + '</span>' +
            '<div><h3>' + escapeHTML(guide[1]) + '</h3><p>' + escapeHTML(guide[2]) + '</p></div>' +
            icon("arrow-up-right", 17) +
          '</a>';
        }).join("") +
      '</div>' +
    '</section>' +
    '<section class="section archive-note">' +
      '<div><span class="eyebrow">Guide structure</span><h2>One route into every kind of help.</h2></div>' +
      '<p>Walkthroughs, collectibles, save files, controls, patches, bugs, and achievements all connect back to the relevant game and release. No separate visual language, no duplicated navigation, and no buried utility pages.</p>' +
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
      '<p class="page-intro">' + (q ? found.length + " matching entries across the archive." : "Search titles, years, characters, locations, artifacts, studios, platforms, levels, and guide categories.") + '</p>' +
    '</header>' +
    (q && found.length ? '<section class="archive-entry-list">' + found.map(entryCard).join("") + '</section>' : "") +
    (q && !found.length ? '<section class="empty-state">' + icon("search-x", 34) + '<strong>No matching entries</strong><span>Try a title, character, location, artifact, platform, or guide category.</span></section>' : "") +
    footer() +
  '</div>';

  refreshIcons();
}

function renderNotFound() {
  main.innerHTML = '<div class="page-shell"><section class="empty-state">' +
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
