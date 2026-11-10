// ============================================================================
// GLOBAL 3D DIGITAL TWIN & HERITAGE ATLAS — GEOSPATIAL & ARCHAEOLOGICAL DATA
// Grounded in UNESCO World Heritage, Survey of India, USGS, NASA, & OpenStreetMap
// ============================================================================

export const SUB_CONTINENT_CONFIG = {
  centerLat: 20.0,
  centerLon: 0.0,
  minLat: -85.0,
  maxLat: 85.0,
  minLon: -180.0,
  maxLon: 180.0,
  scaleX: 18.0,
  scaleZ: 18.0,
  terrainWidth: 540,
  terrainHeight: 540,
  terrainSegments: 160,
  maxElevationY: 42.0,
};

export function latLonToWorld(lat, lon, elevM = 0) {
  const x = (lon - 79.0) * (SUB_CONTINENT_CONFIG.scaleX / 1.0);
  const z = (22.5 - lat) * (SUB_CONTINENT_CONFIG.scaleZ / 1.0);
  const y = (elevM / 8848) * SUB_CONTINENT_CONFIG.maxElevationY;
  return { x, y, z };
}

export function worldToLatLon(x, z) {
  const lon = x / SUB_CONTINENT_CONFIG.scaleX + 79.0;
  const lat = 22.5 - z / SUB_CONTINENT_CONFIG.scaleZ;
  return { lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)) };
}

// Archaeoastronomy Solar Declinations for Planetary Earth
export const SOLAR_SEASONS = {
  equinox: {
    id: 'equinox',
    name: 'Equinox (Vishuva)',
    dates: 'March 21 & September 23',
    declination: 0.0,
    solarNoonAltAvg: 'Equal Day & Night globally',
    sunriseAz: '90.0° Due East',
    sunsetAz: '270.0° Due West',
    significance: 'Sun shines perpendicular to the Equator. Direct cardinal alignments at Giza, Konark, and Chichen Itza.'
  },
  summer: {
    id: 'summer',
    name: 'Northern Summer / Southern Winter Solstice',
    dates: 'June 21',
    declination: 23.44,
    solarNoonAltAvg: 'Overhead along Tropic of Cancer (23.44°N)',
    sunriseAz: '63.0° ENE',
    sunsetAz: '297.0° WNW',
    significance: 'Longest day in Northern Hemisphere. Stonehenge, Sanchi, and Udayagiri solar alignments.'
  },
  winter: {
    id: 'winter',
    name: 'Northern Winter / Southern Summer Solstice',
    dates: 'December 21',
    declination: -23.44,
    solarNoonAltAvg: 'Overhead along Tropic of Capricorn (23.44°S)',
    sunriseAz: '117.0° ESE',
    sunsetAz: '243.0° WSW',
    significance: 'Uttarayana transition; longest day in Southern Hemisphere. Machu Picchu Intihuatana alignments.'
  }
};

// Curated Global & Regional Exploration Tours
export const PAN_INDIA_SECTIONS = [
  {
    id: 'overview',
    num: 'I',
    shortTitle: 'Planet Earth 3D Globe',
    fullTitle: 'SECTION I • PLANET EARTH 3D DIGITAL TWIN (GLOBAL SATELLITE & TERRAIN)',
    heroTitle: 'From Space Orbit to Mountain Summits & Ancient Cities',
    heroDesc:
      'Seamlessly zoom from the <strong>3D rotating Planet Earth</strong> down to sub-meter resolution anywhere across the globe: the glaciated <strong>Himalayan & Karakoram summits (8,848m)</strong>, the vast continents of Asia, Europe, Africa, Americas, and Oceania with real 3D terrain elevation and architectural wonders.',
    camPos: [0.0, 360.0, 320.0],
    target: [0.0, 0.0, 0.0],
    season: 'equinox',
    hour: 16.5,
    center: [20.0, 10.0],
    zoom: 2.2,
    pitch: 45,
    bearing: 0,
    monumentId: null
  },
  {
    id: 'world_wonders',
    num: 'II',
    shortTitle: 'Seven Wonders of the World',
    fullTitle: 'SECTION II • MONUMENTAL WORLD WONDERS (PYRAMIDS, TAJ, COLOSSEUM & PETRA)',
    heroTitle: 'Ancient & Classical Wonders Across Continents',
    heroDesc:
      'Explore the architectural zenith of human civilization: from the <strong>Great Pyramids of Giza (c. 2560 BCE)</strong> in Egypt to the white marble symmetry of the <strong>Taj Mahal (1632 CE)</strong> in Agra, the rock-hewn treasury of <strong>Petra (300 BCE)</strong> in Jordan, and the Roman <strong>Colosseum (80 CE)</strong> in Italy.',
    center: [31.1342, 29.9792], // Giza
    zoom: 16.5,
    pitch: 70,
    bearing: 35,
    monumentId: 'pyramids_giza'
  },
  {
    id: 'northern_classical',
    num: 'III',
    shortTitle: 'India: Mughal & Ashokan Axis',
    fullTitle: 'SECTION III • NORTHERN IMPERIAL CORRIDOR (DELHI, AGRA & HIMALAYAS)',
    heroTitle: 'Taj Mahal White Marble Perfection & Qutb Minar Sandstone Spire',
    heroDesc:
      'Tracing the Yamuna river valley: the <strong>Taj Mahal (1632–1653 CE)</strong> stands upon an elevated riverside terrace with seismic outward-tilting minarets, while the <strong>Qutb Minar (1199 CE)</strong> in Delhi towers at 72.5m beside the 1,600-year-old rustless Chandragupta II Iron Pillar.',
    center: [78.0421, 27.1751],
    zoom: 16.8,
    pitch: 68,
    bearing: 25,
    monumentId: 'taj_mahal'
  },
  {
    id: 'sacred_east',
    num: 'IV',
    shortTitle: 'Sacred Ganga & Archaeoastronomy',
    fullTitle: 'SECTION IV • SACRED GANGA & ARCHAEOASTRONOMY (VARANASI & KONARK)',
    heroTitle: 'Dashashwamedh Sunrise Ghats & Konark 24-Wheel Solar Chariot',
    heroDesc:
      'From the continuous 3,000-year-old civilization of <strong>Varanasi’s 84 stone ghats</strong> along the sacred Ganga facing due East, to the 13th-century <strong>Konark Sun Temple</strong> on the Odisha coast where 24 colossal stone chariot wheels function as high-precision sundials accurate to single minutes.',
    center: [86.0945, 19.8876],
    zoom: 16.8,
    pitch: 65,
    bearing: 40,
    monumentId: 'konark_sun_temple'
  },
  {
    id: 'southern_granite',
    num: 'V',
    shortTitle: 'Dravidian Granite & Hampi',
    fullTitle: 'SECTION V • DRAVIDIAN GRANITE GIANTS & VIJAYANAGARA (SOUTH INDIA)',
    heroTitle: 'Brihadisvara 66m Monolithic Vimana & Hampi Stone Chariot',
    heroDesc:
      'The zenith of South Indian granite engineering: <strong>Brihadisvara Temple (1010 CE)</strong> in Thanjavur, crowned by an 80-tonne single granite capstone atop a 13-tier pyramid assembled with dry interlocking joints, and the boulder-strewn capital of the Vijayanagara Empire at <strong>Hampi (1336–1565 CE)</strong> with its monolithic Stone Chariot.',
    center: [76.4600, 15.3350],
    zoom: 16.5,
    pitch: 66,
    bearing: 15,
    monumentId: 'hampi_virupaksha'
  },
  {
    id: 'western_ancient',
    num: 'VI',
    shortTitle: 'Global Civilizations & Americas',
    fullTitle: 'SECTION VI • ANCIENT CITADELS & THE ANDES (MACHU PICCHU & EIFFEL)',
    heroTitle: 'Machu Picchu Cloud Citadel & Paris Modern Engineering',
    heroDesc:
      'Perched at 2,430 meters above the Urubamba canyon, the Inca sanctuary of <strong>Machu Picchu (1450 CE)</strong> showcases seismic ashlar dry-stone masonry, while the soaring wrought-iron lattice of the <strong>Eiffel Tower (1889 CE)</strong> in Paris rises 330m above the Seine River.',
    center: [-72.5450, -13.1631],
    zoom: 16.2,
    pitch: 70,
    bearing: -30,
    monumentId: 'machu_picchu'
  }
];

// Curated Global & Indian Wonders with High-Fidelity Details
export const CURATED_MONUMENTS = [
  {
    id: 'taj_mahal',
    index: 1,
    sectionId: 'northern_classical',
    name: 'Taj Mahal',
    fullName: 'Taj Mahal — Crown of the Palace & Charbagh Necropolis',
    country: 'India',
    state: 'Uttar Pradesh (Agra)',
    dynasty: 'Mughal Empire (Emperor Shah Jahan)',
    dating: '1632–1653 CE (17th Century)',
    unesco: 'UNESCO World Heritage Site No. 252 (1983)',
    lat: 27.1751,
    lon: 78.0421,
    elevM: 171,
    archivalImage: './renders/archival/taj_mahal.jpg',
    carouselImages: [
      { url: './renders/archival/taj_mahal.jpg', caption: 'Taj Mahal, Agra — View across reflecting pools. ASI Albumen Print (1868).' },
      { url: './renders/archival/taj_mahal.jpg', caption: 'Pietra Dura lapidary inlay & white Makrana marble geometry • ASI' }
    ],
    keyPoints: [
      'Commissioned in 1632 by Mughal Emperor Shah Jahan for Empress Mumtaz Mahal; designed by master architect Ustad Ahmad Lahori.',
      'Constructed on an elevated riverside terrace along the Yamuna River using translucent white Makrana marble from Rajasthan on deep masonry well foundations.',
      'The four 40-meter minarets were deliberately engineered with a 3° outward tilt so that in an earthquake, they collapse safely away from the dome.',
      'Mastery of strict bilateral symmetry and Persian Charbagh quadrilateral garden geometry, integrated with lapis lazuli and jade pietra dura.'
    ],
    masonry: 'Carved White Makrana Marble with Inlaid Semi-Precious Stones',
    orientation: 'North-facing onto the Yamuna; Central axis aligned True North-South',
    dimensions: 'Tomb base: 57m × 57m • Central Dome height: 73m'
  },
  {
    id: 'pyramids_giza',
    index: 2,
    sectionId: 'world_wonders',
    name: 'Pyramids of Giza & Sphinx',
    fullName: 'Great Pyramid of Khufu, Khafre, Menkaure & The Great Sphinx',
    country: 'Egypt',
    state: 'Giza Plateau (Cairo)',
    dynasty: 'Fourth Dynasty of Ancient Egypt (Old Kingdom)',
    dating: 'c. 2560 BCE (Over 4,580 Years Old)',
    unesco: 'UNESCO World Heritage Site No. 86 (1979)',
    lat: 29.9792,
    lon: 31.1342,
    elevM: 65,
    archivalImage: './renders/archival/pyramids_giza.jpg',
    carouselImages: [
      { url: './renders/archival/pyramids_giza.jpg', caption: 'The Great Pyramid of Giza & The Sphinx • 19th Century Historical Survey' }
    ],
    keyPoints: [
      'The oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact over 4,500 years.',
      'Constructed from roughly 2.3 million large limestone and granite blocks, weighing an average of 2.5 tonnes each.',
      'Originally stood at 146.6 meters (481 ft) and was the tallest man-made structure in the world for more than 3,800 years.',
      'Its four faces are oriented to the cardinal directions (North, South, East, West) with an astounding precision error of under 4 minutes of arc.'
    ],
    masonry: 'Nummulitic Limestone Core with Polished Tura Casing Stones',
    orientation: 'Strictly locked to True Cardinal North within 0.05 degrees',
    dimensions: 'Base: 230.3m (756 ft) • Height: 146.6m original (138.8m modern)'
  },
  {
    id: 'eiffel_tower',
    index: 3,
    sectionId: 'western_ancient',
    name: 'Eiffel Tower',
    fullName: 'Eiffel Tower (La Tour Eiffel) — Champ de Mars & Seine River',
    country: 'France',
    state: 'Paris (Île-de-France)',
    dynasty: 'French Third Republic (Gustave Eiffel)',
    dating: '1887–1889 CE (1889 World\'s Fair)',
    unesco: 'UNESCO World Heritage Site No. 600 (1991)',
    lat: 48.8584,
    lon: 2.2945,
    elevM: 33,
    archivalImage: './renders/archival/eiffel_tower.jpg',
    carouselImages: [
      { url: './renders/archival/eiffel_tower.jpg', caption: 'Eiffel Tower soaring 330m above the Seine River • Paris Historical Archives' }
    ],
    keyPoints: [
      'Designed by Maurice Koechlin and Émile Nouguier and built by Gustave Eiffel for the 1889 Exposition Universelle.',
      'Stands at 330 meters (1,083 ft) tall; was the world\'s tallest man-made structure for 41 years until the Chrysler Building was finished in 1930.',
      'Constructed using 18,038 pieces of puddle iron joined by 2.5 million rivets, designed mathematically to withstand aerodynamic wind loads.',
      'Thermal expansion causes the tower to grow by up to 15 cm (6 inches) during summer and tilt slightly away from the sun.'
    ],
    masonry: 'Puddle Wrought Iron Lattice Framework with Four Masonry Piers',
    orientation: 'Aligned along the Champ de Mars to the Trocadéro across the Seine',
    dimensions: 'Height: 330m • Weight: 10,100 tonnes • Base footprint: 125m × 125m'
  },
  {
    id: 'colosseum_rome',
    index: 4,
    sectionId: 'world_wonders',
    name: 'Colosseum (Flavian Amphitheatre)',
    fullName: 'Colosseum of Rome — Monumental Imperial Arena',
    country: 'Italy',
    state: 'Rome (Lazio)',
    dynasty: 'Flavian Dynasty (Emperors Vespasian & Titus)',
    dating: '70–80 CE (1st Century CE)',
    unesco: 'UNESCO World Heritage Site No. 91 (1980)',
    lat: 41.8902,
    lon: 12.4922,
    elevM: 22,
    archivalImage: './renders/archival/colosseum_rome.jpg',
    carouselImages: [
      { url: './renders/archival/colosseum_rome.jpg', caption: 'The Flavian Amphitheatre (Colosseum) • Rome Archaeological Survey' }
    ],
    keyPoints: [
      'The largest ancient amphitheatre ever built, capable of holding an estimated 50,000 to 80,000 spectators with 80 arched entrances.',
      'Built of travertine limestone, volcanic tuff, and brick-faced Roman concrete, founded upon a drained marsh valley between Rome\'s seven hills.',
      'Featured the Hypogeum: a complex two-level underground subterranean network of tunnels, cages, and mechanical lifts for gladiators and wild animals.',
      'The outer facade features four storeys demonstrating the classical Roman architectural orders: Doric, Ionic, and Corinthian.'
    ],
    masonry: 'Travertine Limestone, Volcanic Tuff, Roman Concrete & Mortar',
    orientation: 'Elliptical axis aligned East-West: 189m long by 156m wide',
    dimensions: 'Length: 189m • Width: 156m • Height: 48m (157 ft)'
  },
  {
    id: 'machu_picchu',
    index: 5,
    sectionId: 'western_ancient',
    name: 'Machu Picchu',
    fullName: 'Machu Picchu Historic Sanctuary — Sacred Inca Mountain Citadel',
    country: 'Peru',
    state: 'Cusco Region (Andes Mountains)',
    dynasty: 'Inca Empire (Emperor Pachacuti)',
    dating: 'c. 1450 CE (15th Century)',
    unesco: 'UNESCO World Heritage Site No. 274 (1983)',
    lat: -13.1631,
    lon: -72.5450,
    elevM: 2430,
    archivalImage: './renders/archival/machu_picchu.jpg',
    carouselImages: [
      { url: './renders/archival/machu_picchu.jpg', caption: 'Machu Picchu granite terraces and Huayna Picchu mountain peak' }
    ],
    keyPoints: [
      'Perched on an Andean mountain ridge at 2,430 meters (7,970 ft) above the Urubamba River canyon, built as a royal estate for Emperor Pachacuti.',
      'Constructed with classical Inca ashlar style: dry-stone granite walls polished and carved so tightly that a knife blade cannot fit between joints.',
      'Features the sacred Intihuatana stone ("Hitching Post of the Sun"), an astronomical solar clock aligned to the winter and summer solstices.',
      'Over 60% of the construction engineering was underground, featuring deep gravel drainage systems and retaining agricultural terraces that resist seismic earthquakes.'
    ],
    masonry: 'Fitted Mortarless White Granite Ashlar Blocks (Earthquake Resistant)',
    orientation: 'Terraces face celestial constellations and sacred mountain Apus',
    dimensions: 'Altitude: 2,430m • Complex includes over 200 religious and residential structures'
  },
  {
    id: 'great_wall_china',
    index: 6,
    sectionId: 'world_wonders',
    name: 'Great Wall of China',
    fullName: 'Great Wall of China (Mutianyu & Badaling) — Mountain Ridge Fortifications',
    country: 'China',
    state: 'Beijing / Northern China',
    dynasty: 'Qin & Ming Dynasties',
    dating: '3rd c. BCE – 17th c. CE (Peak Ming 1368–1644 CE)',
    unesco: 'UNESCO World Heritage Site No. 438 (1987)',
    lat: 40.4319,
    lon: 116.5704,
    elevM: 520,
    archivalImage: './renders/archival/great_wall.jpg',
    carouselImages: [
      { url: './renders/archival/great_wall.jpg', caption: 'The Great Wall undulating across rugged mountain ridges • Historical Survey' }
    ],
    keyPoints: [
      'The world\'s longest monumental defense architecture, stretching over 21,196 km (13,171 miles) across deserts, mountains, and grasslands.',
      'Features continuous crenellated ramparts, watchtowers, and beacon beacon-fire communication towers that transmitted smoke and flame signals across thousands of miles.',
      'Built using quarried granite slabs, fired bricks, and an innovative mortar infused with sticky rice amylopectin, which creates waterproof, durable bonds.',
      'Constructed to protect Chinese agricultural heartlands from nomadic raids along the Eurasian steppe border.'
    ],
    masonry: 'Dressed Granite, Fired Clay Bricks with Sticky-Rice Lime Mortar',
    orientation: 'Traverses East-West along high mountain ridgelines across northern China',
    dimensions: 'Total network span: 21,196 km • Wall width: 5–8m • Height: 7–8m'
  },
  {
    id: 'petra_jordan',
    index: 7,
    sectionId: 'world_wonders',
    name: 'Petra (Al-Khazneh)',
    fullName: 'Petra — The Rose-Red City & Rock-Cut Nabataean Treasury',
    country: 'Jordan',
    state: 'Ma\'an Governorate',
    dynasty: 'Nabataean Kingdom (King Aretas IV)',
    dating: '1st Century BCE – 1st Century CE',
    unesco: 'UNESCO World Heritage Site No. 326 (1985)',
    lat: 30.3285,
    lon: 35.4444,
    elevM: 810,
    archivalImage: './renders/archival/petra_jordan.jpg',
    carouselImages: [
      { url: './renders/archival/petra_jordan.jpg', caption: 'Al-Khazneh (The Treasury) carved into pink sandstone canyon cliff' }
    ],
    keyPoints: [
      'Carved directly into the vibrant pink and red sandstone cliffs of the Jabal Al-Madbah mountain gorge (the Siq).',
      'Capital of the Nabataean Arabs, who grew wealthy controlling caravan trade routes of frankincense, myrrh, and spices between Arabia, Egypt, and Rome.',
      'Mastery of hydraulic engineering: constructed intricate terracotta conduits, cisterns, dams, and ceramic piping that collected flash-flood water in the desert.',
      'The facade of Al-Khazneh rises 40 meters high with Hellenistic Corinthian columns, pediments, and an Amazon frieze carved top-down into solid cliff.'
    ],
    masonry: 'Subtractive Rock-Cut Architecture into Nubian Pink Sandstone',
    orientation: 'Faces east down the narrow 1.2km Siq canyon corridor',
    dimensions: 'Facade width: 25m • Height: 39m • Area: 264 km² archaeological park'
  },
  {
    id: 'mount_everest',
    index: 8,
    sectionId: 'overview',
    name: 'Mount Everest (Sagarmatha / Chomolungma)',
    fullName: 'Mount Everest — Earth\'s Highest Summit (8,848.86m)',
    country: 'Nepal / Tibet (China)',
    state: 'Mahalangur Himal (Himalayas)',
    dynasty: 'Geological Tectonic Uplift (India-Eurasia Collision)',
    dating: 'Formed ~50 Million Years Ago to Present',
    unesco: 'Sagarmatha National Park UNESCO Site 120',
    lat: 27.9881,
    lon: 86.9250,
    elevM: 8848,
    archivalImage: './renders/archival/mount_everest.jpg',
    carouselImages: [
      { url: './renders/archival/mount_everest.jpg', caption: 'Mount Everest (8,848m) with the Khumbu Glacier and North Face' }
    ],
    keyPoints: [
      'The highest mountain peak above sea level on Earth, officially measured at 8,848.86 meters (29,031.7 ft).',
      'Created by the tectonic collision of the Indian tectonic plate with the Eurasian continent, which continues to uplift the Himalayas by ~4mm per year.',
      'The summit pyramid consists of Ordovician marine limestone (Qomolangma Formation) containing fossilized shells of ancient ocean creatures that lived 450 million years ago.',
      'Flanked by the Khumbu Icefall, Western Cwm, South Col, and the famous Hillary Step leading to the knife-edge summit ridge.'
    ],
    masonry: 'Marine Pelagic Limestone, Yellow Band Marble & Pelitic Gneiss',
    orientation: 'Three distinct faces: South-West (Nepal), East (Kangshung), North (Tibet)',
    dimensions: 'Summit Elevation: 8,848.86m • Prominence: 8,848m (World Highest)'
  },
  {
    id: 'brihadisvara_temple',
    index: 9,
    sectionId: 'southern_granite',
    name: 'Brihadisvara Temple',
    fullName: 'Brihadisvara Temple (Peruvudaiyar Kovil) — Great Living Chola Temple',
    country: 'India',
    state: 'Tamil Nadu (Thanjavur)',
    dynasty: 'Chola Dynasty (Rajaraja Chola I)',
    dating: 'Completed 1010 CE (11th Century)',
    unesco: 'UNESCO World Heritage Site No. 250 (1987)',
    lat: 10.7828,
    lon: 79.1318,
    elevM: 59,
    archivalImage: './renders/archival/brihadisvara.jpg',
    carouselImages: [
      { url: './renders/archival/brihadisvara.jpg', caption: 'Plate 23. Brihadisvara Temple, Thanjavur — Vimana and Temple Complex (c. 1885). ASI.' }
    ],
    keyPoints: [
      'Built entirely of hard crystalline granite in a delta region with zero local stone; over 130,000 tonnes of granite were transported over 50 km.',
      'The soaring hollow Vimana rises 13 tiered storeys to a height of 66 meters (216 feet), making it one of the tallest architectural towers in the medieval world.',
      'The apex is crowned by a monolithic octagonal dome (Kumbam) weighing an estimated 80 tonnes, hoisted up an inclined earth ramp extending 4 miles.',
      'Assembled using dry interlocking precision joints without binding mortar, covered in extensive Old Tamil epigraphs.'
    ],
    masonry: 'Monolithic Crystalline Interlocking Granite (Zero Mortar)',
    orientation: 'True East-facing entrance oriented to Sunrise across the Kaveri Delta',
    dimensions: 'Height: 66m • Monolithic Cupola: 80 tonnes'
  },
  {
    id: 'hampi_virupaksha',
    index: 10,
    sectionId: 'southern_granite',
    name: 'Hampi & Stone Chariot',
    fullName: 'Group of Monuments at Hampi — Vijayanagara Imperial Capital',
    country: 'India',
    state: 'Karnataka (Vijayanagara)',
    dynasty: 'Vijayanagara Empire (Sangama & Tuluva Dynasties)',
    dating: '1336–1565 CE (Peak under Krishnadevaraya)',
    unesco: 'UNESCO World Heritage Site No. 241 (1986)',
    lat: 15.3350,
    lon: 76.4600,
    elevM: 467,
    archivalImage: './renders/archival/hampi.jpg',
    carouselImages: [
      { url: './renders/archival/hampi.jpg', caption: 'Hampi, Vijayanagar — Stone Chariot (Garuda Shrine) & Virupaksha Gopuram (1888). ASI.' }
    ],
    keyPoints: [
      'The magnificent capital of the Vijayanagara Empire, described by Portuguese chroniclers as larger than Renaissance Rome.',
      'The iconic Stone Chariot in the Vittala Temple courtyard is a dedicated shrine to Garuda, constructed with virtually invisible stone joints.',
      'Behind it stands the Ranga Mandapa with 56 musical monolithic granite pillars that resonate notes of the Sa-Re-Ga-Ma scale when struck.',
      'Virupaksha Temple features a pinhole camera optical effect in an inner sanctum chamber projecting an inverted shadow of the 50m gopuram.'
    ],
    masonry: 'Dressed Granite Blocks with Interlocking Balustrades',
    orientation: 'Virupaksha gopuram faces Due East overlooking the 739m bazaar colonnade',
    dimensions: 'Archaeological area covers 41.8 km² across the Tungabhadra River basin'
  },
  {
    id: 'konark_sun_temple',
    index: 11,
    sectionId: 'sacred_east',
    name: 'Konark Sun Temple',
    fullName: 'Konark Sun Temple — 13th Century Archaeoastronomical Chariot',
    country: 'India',
    state: 'Odisha (Puri Coast)',
    dynasty: 'Eastern Ganga Dynasty (King Narasimhadeva I)',
    dating: 'c. 1250 CE (13th Century)',
    unesco: 'UNESCO World Heritage Site No. 242 (1984)',
    lat: 19.8876,
    lon: 86.0945,
    elevM: 12,
    archivalImage: './renders/archival/konark.jpg',
    carouselImages: [
      { url: './renders/archival/konark.jpg', caption: 'Konarka: Sun Chariot Wheel (Southern Side). 13th Century. ASI Odisha.' }
    ],
    keyPoints: [
      'Conceived as a colossal celestial chariot of Surya (the Sun God), pulled by seven stone horses representing the days of the week.',
      'Flanked by 24 elaborately carved stone wheels (3m diameter) representing the 24 fortnights (Pakshas) of the solar year, functioning as sundials.',
      'The 8 major spokes on each wheel divide the day into eight 3-hour periods (Praharas); the shadow cast by the central axle tells time to the minute.',
      'Oriented East–West so that the first rays of the rising sun on equinox mornings illuminated the primary deity within the sanctum.'
    ],
    masonry: 'Ferruginous Khondalite Stone & Chlorite Slabs with Iron Cramps',
    orientation: 'Strictly East-facing: First dawn rays penetrate the Natamandira',
    dimensions: 'Platform: 120m × 80m • Reconstructed Jagamohana: 39m'
  },
  {
    id: 'varanasi_dashashwamedh',
    index: 12,
    sectionId: 'sacred_east',
    name: 'Varanasi Ghats',
    fullName: 'Varanasi Dashashwamedh Ghat & Sacred Ganga Riverfront',
    country: 'India',
    state: 'Uttar Pradesh (Kashi)',
    dynasty: 'Continuous 3,000-Year Civilization',
    dating: 'Over 3,000 Years Continuous Occupation',
    unesco: 'Tentative UNESCO World Heritage Site',
    lat: 25.3076,
    lon: 83.0107,
    elevM: 80,
    archivalImage: './renders/archival/varanasi.jpg',
    carouselImages: [
      { url: './renders/archival/varanasi.jpg', caption: 'Benares. Dashashwamedh Ghat. Morning scene on the Ganges. 1870. ASI.' }
    ],
    keyPoints: [
      'Regarded as one of the oldest continuously inhabited cities in human history (Mark Twain: "older than history, older than tradition").',
      'Dashashwamedh Ghat was reconstructed in 1748 by Peshwa Balaji Baji Rao of the Maratha Empire.',
      'The 84 stone ghats stretch along a 6.8-kilometer crescent curve where the Ganga flows uniquely northward, facing the rising sun.',
      'Daily Ganga Aarti ritual performed by priests with multi-tiered brass oil lamps, honoring the Sun and the waters of the Ganges.'
    ],
    masonry: 'Chunar Buff & Pink Sandstone Steps with Ashlar Retaining Walls',
    orientation: 'Curved Riverbank facing Due East across the flat floodplain',
    dimensions: 'Riverfront span: 6.8 km across 84 ghats'
  }
];

// Comprehensive Global Index of Countries, Major World Cities & All Indian States
export const INDIA_LOCATIONS_DATABASE = [
  // World Wonders & Landmarks
  { name: 'Taj Mahal', type: 'World Wonder', lat: 27.1751, lon: 78.0421, elevM: 171, region: 'Asia / India' },
  { name: 'Pyramids of Giza', type: 'Ancient Wonder', lat: 29.9792, lon: 31.1342, elevM: 65, region: 'Africa / Egypt' },
  { name: 'Eiffel Tower', type: 'Global Monument', lat: 48.8584, lon: 2.2945, elevM: 33, region: 'Europe / France' },
  { name: 'Colosseum', type: 'Ancient Amphitheatre', lat: 41.8902, lon: 12.4922, elevM: 22, region: 'Europe / Italy' },
  { name: 'Great Wall of China', type: 'World Wonder', lat: 40.4319, lon: 116.5704, elevM: 520, region: 'Asia / China' },
  { name: 'Machu Picchu', type: 'Inca Sanctuary', lat: -13.1631, lon: -72.5450, elevM: 2430, region: 'South America / Peru' },
  { name: 'Petra Al-Khazneh', type: 'Rock-Cut City', lat: 30.3285, lon: 35.4444, elevM: 810, region: 'Middle East / Jordan' },
  { name: 'Mount Everest', type: 'Highest Summit', lat: 27.9881, lon: 86.9250, elevM: 8848, region: 'Himalayas / Nepal' },
  { name: 'Burj Khalifa', type: 'Tallest Skyscraper', lat: 25.1972, lon: 55.2744, elevM: 828, region: 'Middle East / UAE' },
  { name: 'Statue of Liberty', type: 'Global Icon', lat: 40.6892, lon: -74.0445, elevM: 10, region: 'North America / USA' },
  { name: 'Sydney Opera House', type: 'Modern Wonder', lat: -33.8568, lon: 151.2153, elevM: 5, region: 'Oceania / Australia' },
  { name: 'Christ the Redeemer', type: 'Monument', lat: -22.9519, lon: -43.2105, elevM: 710, region: 'South America / Brazil' },
  { name: 'Angkor Wat', type: 'Temple City', lat: 13.4125, lon: 103.8670, elevM: 65, region: 'Asia / Cambodia' },
  { name: 'Grand Canyon', type: 'Natural Wonder', lat: 36.1069, lon: -112.1129, elevM: 2100, region: 'North America / USA' },
  { name: 'Mount Fuji', type: 'Volcanic Peak', lat: 35.3606, lon: 138.7274, elevM: 3776, region: 'Asia / Japan' },

  // Major World Metros & Capitals
  { name: 'Paris', type: 'Capital', lat: 48.8566, lon: 2.3522, elevM: 35, region: 'Europe' },
  { name: 'London', type: 'Capital', lat: 51.5074, lon: -0.1278, elevM: 11, region: 'Europe' },
  { name: 'New York City', type: 'Metropolis', lat: 40.7128, lon: -74.0060, elevM: 10, region: 'North America' },
  { name: 'Tokyo', type: 'Metropolis', lat: 35.6762, lon: 139.6503, elevM: 40, region: 'Asia' },
  { name: 'Dubai', type: 'Global City', lat: 25.2048, lon: 55.2708, elevM: 5, region: 'Middle East' },
  { name: 'Cairo', type: 'Historic Capital', lat: 30.0444, lon: 31.2357, elevM: 23, region: 'Africa' },
  { name: 'Rome', type: 'Historic Capital', lat: 41.9028, lon: 12.4964, elevM: 21, region: 'Europe' },
  { name: 'Sydney', type: 'Harbour City', lat: -33.8688, lon: 151.2093, elevM: 19, region: 'Oceania' },
  { name: 'Rio de Janeiro', type: 'Coastal City', lat: -22.9068, lon: -43.1729, elevM: 5, region: 'South America' },
  { name: 'Singapore', type: 'Island City-State', lat: 1.3521, lon: 103.8198, elevM: 15, region: 'Asia' },

  // Indian States & Major Metros
  { name: 'India', type: 'Country', lat: 20.5937, lon: 78.9629, elevM: 300, region: 'South Asia' },
  { name: 'Delhi NCR', type: 'National Capital', lat: 28.6139, lon: 77.2090, elevM: 216, region: 'North India' },
  { name: 'Mumbai', type: 'Commercial Capital', lat: 18.9220, lon: 72.8347, elevM: 14, region: 'West India' },
  { name: 'Bengaluru', type: 'Silicon Valley of India', lat: 12.9716, lon: 77.5946, elevM: 920, region: 'South India' },
  { name: 'Kolkata', type: 'Cultural Capital', lat: 22.5726, lon: 88.3639, elevM: 9, region: 'East India' },
  { name: 'Chennai', type: 'Gateway of South', lat: 13.0827, lon: 80.2707, elevM: 6, region: 'South India' },
  { name: 'Hyderabad', type: 'City of Pearls', lat: 17.3850, lon: 78.4867, elevM: 542, region: 'South India' },
  { name: 'Varanasi', type: 'Sacred City', lat: 25.3176, lon: 82.9739, elevM: 80, region: 'North India' },
  { name: 'Jaipur', type: 'Pink City', lat: 26.9124, lon: 75.7873, elevM: 431, region: 'West India' },
  { name: 'Ladakh', type: 'Trans-Himalayan Region', lat: 34.1526, lon: 77.5771, elevM: 3500, region: 'North India' },
  { name: 'Kashmir', type: 'Paradise Valley', lat: 34.0837, lon: 74.7973, elevM: 1585, region: 'North India' },
  { name: 'Kerala', type: 'God\'s Own Country', lat: 10.8505, lon: 76.2711, elevM: 300, region: 'South India' },
  { name: 'Kanyakumari', type: 'Cape Comorin (3 Seas)', lat: 8.0883, lon: 77.5385, elevM: 10, region: 'South India' }
];

export const HISTORICAL_ERAS = [
  { id: 'modern', name: 'Modern Earth (2026)', period: 'Present Day', description: 'Real-time satellite & geospatial view of 195 countries.' },
  { id: 'renaissance', name: 'Classical & Renaissance', period: '14th–18th c. CE', description: 'Mughal Taj Mahal, European Renaissance, Inca Machu Picchu.' },
  { id: 'medieval', name: 'Medieval Wonders', period: '8th–13th c. CE', description: 'Chola Brihadisvara, Angkor Wat, Konark Sun Temple.' },
  { id: 'ancient', name: 'Ancient Empires', period: '3000 BCE – 500 CE', description: 'Pyramids of Giza, Roman Colosseum, Great Wall, Ashokan Stupas.' }
];
