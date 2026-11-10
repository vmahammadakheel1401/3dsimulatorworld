import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Explicitly configure worker URL for Vite
maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');

import {
  CURATED_MONUMENTS,
  INDIA_LOCATIONS_DATABASE,
  PAN_INDIA_SECTIONS,
  SOLAR_SEASONS
} from './india_data.js';

// ============================================================================
// 1. APPLICATION STATE
// ============================================================================
const state = {
  mode: 'orbit', // 'orbit' | 'guided' | 'walk'
  activeSectionId: 'overview',
  activeMonumentId: 'taj_mahal',
  activeSeason: 'equinox',
  solarHour: 16.5,
  activeLayer: 'satellite', // 'satellite' | 'hybrid' | 'topo' | 'osm'
  pitchMode: 55, // 0 (2D) | 45 (3D) | 75 (ground)
  autoRotate: false,
  audioEnabled: false,
  hudVisible: true,
  activePhotoIndex: 0,
};

// ============================================================================
// 2. REAL 3D SUBCONTINENT MAP INITIALIZATION (MAPLIBRE GL + REAL 3D TERRAIN)
// ============================================================================
const mapContainer = document.getElementById('canvas-container');

// Map Styles with High-Resolution Satellite & 3D Terrain Elevation
const MAP_STYLES = {
  satellite: {
    version: 8,
    projection: {
      type: 'globe'
    },
    sources: {
      'world-imagery': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 18, // Clamped: stops MapLibre from requesting non-existent z>18 tiles that return 'Map data not yet available'
        attribution: 'Esri, Maxar, Earthstar Geographics'
      },
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],
        encoding: 'terrarium',
        tileSize: 256,
        minzoom: 0,
        maxzoom: 15
      }
    },
    layers: [
      {
        id: 'satellite-tiles',
        type: 'raster',
        source: 'world-imagery',
        minzoom: 0,
        maxzoom: 24, // WebGL dynamic oversampling for crisp sub-meter zoom
        paint: {
          'raster-resampling': 'linear',
          'raster-contrast': 0.12,
          'raster-saturation': 0.16,
          'raster-brightness-max': 0.98
        }
      }
    ],
    terrain: {
      source: 'terrain-dem',
      exaggeration: 1.5
    },
    sky: {
      'sky-color': '#1a2233',
      'sky-horizon-blend': 0.75,
      'horizon-color': '#f2c97a',
      'horizon-fog-blend': 0.5,
      'fog-color': '#111827',
      'fog-ground-blend': 0.75
    }
  },
  hybrid: {
    version: 8,
    projection: {
      type: 'globe'
    },
    sources: {
      'world-imagery': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 18
      },
      'world-boundaries': {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 18
      },
      'world-roads': {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 18
      },
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],
        encoding: 'terrarium',
        tileSize: 256,
        minzoom: 0,
        maxzoom: 15
      }
    },
    layers: [
      {
        id: 'satellite-tiles',
        type: 'raster',
        source: 'world-imagery',
        minzoom: 0,
        maxzoom: 24,
        paint: {
          'raster-resampling': 'linear',
          'raster-contrast': 0.12,
          'raster-saturation': 0.16
        }
      },
      { id: 'roads-tiles', type: 'raster', source: 'world-roads', minzoom: 0, maxzoom: 24 },
      { id: 'boundaries-tiles', type: 'raster', source: 'world-boundaries', minzoom: 0, maxzoom: 24 },
      // Vector-based overlay for cities and rivers
      {
        id: 'reference-labels',
        type: 'symbol',
        source: {
          type: 'vector',
          url: 'https://demotiles.maplibre.org/tiles/tiles.json'
        },
        'source-layer': 'place',
        filter: ['all', ['==', 'class', 'city'], ['>=', 'rank', 1]],
        layout: {
          'text-field': '{name}',
          'text-font': ['Open Sans Bold'],
          'text-size': 12,
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1.5
        }
      },
      {
        id: 'water-layer',
        type: 'line',
        source: {
          type: 'vector',
          url: 'https://demotiles.maplibre.org/tiles/tiles.json'
        },
        'source-layer': 'water',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#3399ff',
          'line-width': 1.5
        }
      }
    ],
    terrain: {
      source: 'terrain-dem',
      exaggeration: 1.5
    }
  },
  topo: {
    version: 8,
    projection: {
      type: 'globe'
    },
    sources: {
      'opentopo': {
        type: 'raster',
        tiles: [
          'https://tile.opentopomap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 17
      },
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],
        encoding: 'terrarium',
        tileSize: 256,
        minzoom: 0,
        maxzoom: 15
      }
    },
    layers: [
      { id: 'topo-tiles', type: 'raster', source: 'opentopo', minzoom: 0, maxzoom: 24 }
    ],
    terrain: {
      source: 'terrain-dem',
      exaggeration: 1.6
    }
  },
  osm: {
    version: 8,
    projection: {
      type: 'globe'
    },
    sources: {
      'osm-standard': {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 19,
        attribution: '© OpenStreetMap contributors'
      },
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],
        encoding: 'terrarium',
        tileSize: 256,
        minzoom: 0,
        maxzoom: 15
      }
    },
    layers: [
      { id: 'osm-tiles', type: 'raster', source: 'osm-standard', minzoom: 0, maxzoom: 24 }
    ],
    terrain: {
      source: 'terrain-dem',
      exaggeration: 1.4
    }
  }
};

const map = new maplibregl.Map({
  container: 'canvas-container',
  style: MAP_STYLES.satellite,
  center: [20.0, 15.0], // Global vantage point spanning continents & oceans
  zoom: 2.2, // Authentic 3D Space Orbit of Planet Earth
  pitch: 45, // 3D oblique perspective angle
  bearing: 0,
  minZoom: 1.0,
  maxZoom: 22.0,
  maxPitch: 85,
  attributionControl: false,
});

// Add 3D Navigation Controls
map.addControl(
  new maplibregl.NavigationControl({
    visualizePitch: true,
    showZoom: true,
    showCompass: true,
  }),
  'top-right'
);

// Map loaded handler
map.on('load', () => {
  // Dismiss loader overlay
  const loader = document.getElementById('loading-overlay');
  loader?.classList.add('fade-out');

  // Add 3D Heritage Markers
  addMonumentMarkersToMap();

  // Initialize UI components
  buildSectionPills();
  buildMonumentChips();
  initSearchDatabase();
  buildCompassTicks();
  updateCelestialSun('equinox', 16.5);
});

// Live Coordinates & Bearing update
map.on('move', () => {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const pitch = map.getPitch();
  const bearing = map.getBearing();

  // Toggle zoomout card visibility
  const zoomoutCard = document.getElementById('max-zoomout-area-card');
  if (zoomoutCard) {
    if (zoom < 6.0) {
      zoomoutCard.classList.remove('hidden');
    } else {
      zoomoutCard.classList.add('hidden');
    }
  }

  // Update Compass World Ring
  const compassRing = document.getElementById('compass-world-ring');
  if (compassRing) {
    compassRing.style.transform = `rotate(${-Math.round(bearing)}deg)`;
  }

  // Update Live HUD
  const latlonEl = document.getElementById('hud-latlon');
  const elevEl = document.getElementById('hud-elev');
  const regionEl = document.getElementById('hud-region');

  if (latlonEl) {
    const latDir = center.lat >= 0 ? 'N' : 'S';
    const lonDir = center.lng >= 0 ? 'E' : 'W';
    latlonEl.textContent = `${Math.abs(center.lat).toFixed(4)}°${latDir}, ${Math.abs(center.lng).toFixed(4)}°${lonDir}`;
  }
  if (elevEl) {
    elevEl.textContent = `Zoom: ${zoom.toFixed(1)}x • Tilt: ${Math.round(pitch)}°`;
  }
  if (regionEl) {
    regionEl.textContent = getRegionNameFromCoords(center.lat, center.lng);
    const mzoRegion = document.getElementById('mzo-continent');
    if (mzoRegion) mzoRegion.textContent = getRegionNameFromCoords(center.lat, center.lng);
  }
});

function getRegionNameFromCoords(lat, lon) {
  if (lat > 65.0) return 'Arctic & Polar North';
  if (lat < -60.0) return 'Antarctica & Southern Ocean';
  if (lat > 35.0 && lon > -15.0 && lon < 45.0) return 'European Continent';
  if (lat > 15.0 && lat < 55.0 && lon > 35.0 && lon < 60.0) return 'Middle East & Levant';
  if (lat > 8.0 && lat < 38.0 && lon > 68.0 && lon < 98.0) {
    if (lat > 30.0) return 'Himalayas & Karakoram, India';
    if (lat > 25.0) return 'Northern Plains & Ganges Basin, India';
    if (lat > 20.0) return 'Central Deccan & Thar, India';
    return 'Peninsular India & Indian Ocean';
  }
  if (lat > 15.0 && lat < 55.0 && lon > 98.0 && lon < 145.0) return 'East Asia (China / Japan / Korea)';
  if (lat > -10.0 && lat < 25.0 && lon > 95.0 && lon < 145.0) return 'Southeast Asia & Pacific Rim';
  if (lat > -35.0 && lat < 37.0 && lon > -20.0 && lon < 52.0) return 'African Continent';
  if (lat > 15.0 && lat < 72.0 && lon < -50.0 && lon > -170.0) return 'North America';
  if (lat <= 15.0 && lon < -35.0 && lon > -110.0) return 'South America & Andes';
  if (lat < -10.0 && lon > 110.0 && lon < 180.0) return 'Australasia & Oceania';
  return 'Planetary Earth 3D';
}

// Auto-rotate camera slowly when enabled
function autoRotateTick() {
  if (state.autoRotate) {
    if (map.getZoom() < 5) {
      // Rotate Earth on its polar axis
      const c = map.getCenter();
      const nextLng = c.lng + 0.12 > 180 ? c.lng + 0.12 - 360 : c.lng + 0.12;
      map.setCenter([nextLng, c.lat]);
    } else {
      map.setBearing((map.getBearing() + 0.25) % 360);
    }
  }
  requestAnimationFrame(autoRotateTick);
}
requestAnimationFrame(autoRotateTick);

// ============================================================================
// 3. 3D PITCH & PERSPECTIVE CONTROLS
// ============================================================================
export function set3DPitch(pitchAngle) {
  state.pitchMode = pitchAngle;
  map.easeTo({
    pitch: pitchAngle,
    duration: 1200
  });
}

// ============================================================================
// 4. 3D HERITAGE MONUMENT MARKERS & POPUPS
// ============================================================================
const activeMarkers = [];

function addMonumentMarkersToMap() {
  CURATED_MONUMENTS.forEach(mon => {
    // Create Custom Animated 3D Marker Element
    const el = document.createElement('div');
    el.className = 'monument-3d-marker';
    el.dataset.id = mon.id;
    el.innerHTML = `
      <div class="marker-beacon-glow"></div>
      <div class="marker-pin-head">
        <span class="marker-icon">🏛️</span>
      </div>
      <div class="marker-label">${mon.name}</div>
    `;

    // Click marker to zoom in 3D
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectMonument(mon.id, true);
    });

    // Hover tooltip
    el.addEventListener('mouseenter', (e) => {
      const hoverTag = document.getElementById('room-hover-tag');
      const hoverEyebrow = document.getElementById('hover-tag-eyebrow');
      const hoverTitle = document.getElementById('hover-tag-title');
      if (hoverTag && hoverEyebrow && hoverTitle) {
        hoverEyebrow.textContent = `${mon.state.toUpperCase()} • ${mon.dating.toUpperCase()}`;
        hoverTitle.textContent = mon.fullName;
        hoverTag.classList.remove('hidden');
        hoverTag.style.left = `${e.clientX + 14}px`;
        hoverTag.style.top = `${e.clientY - 28}px`;
      }
    });

    el.addEventListener('mouseleave', () => {
      document.getElementById('room-hover-tag')?.classList.add('hidden');
    });

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat([mon.lon, mon.lat])
      .addTo(map);

    activeMarkers.push(marker);
  });
}

// ============================================================================
// 5. MONUMENT SELECTION & 3D FLY-TO
// ============================================================================
const sideNote = document.getElementById('room-side-note');
const sideEyebrow = document.getElementById('room-side-eyebrow');
const sideTitle = document.getElementById('room-side-title');
const archivalImg = document.getElementById('rs-archival-img');
const archivalCaption = document.getElementById('rs-archival-caption');
const mediaCounter = document.getElementById('rs-media-counter');
const keypointsList = document.getElementById('room-side-keypoints');
const stopIndicator = document.getElementById('rs-stop-indicator');
const discoveryBadge = document.getElementById('discovery-counter-badge');

// Inspector Drawer elements
const infoTitle = document.getElementById('info-title');
const infoSubtitle = document.getElementById('info-subtitle');
const infoExcavator = document.getElementById('info-excavator');
const infoPhotoImg = document.getElementById('info-photo-img');
const infoMasonry = document.getElementById('info-masonry');
const infoDendro = document.getElementById('info-dendro');
const infoDimensions = document.getElementById('info-dimensions');
const infoArea = document.getElementById('info-area');
const infoSummary = document.getElementById('info-summary');
const infoArtifacts = document.getElementById('info-artifacts');

export function selectMonument(monumentId, smoothlyFly = true) {
  const mon = CURATED_MONUMENTS.find(m => m.id === monumentId);
  if (!mon) return;

  state.activeMonumentId = mon.id;
  state.activePhotoIndex = 0;

  playTempleBell();

  // Populate Side-Note Panel
  if (sideEyebrow) sideEyebrow.textContent = `${mon.dynasty.toUpperCase()} • ${mon.dating}`;
  if (sideTitle) sideTitle.textContent = `${mon.name} (${mon.state})`;
  if (archivalImg && mon.carouselImages.length > 0) {
    archivalImg.src = mon.carouselImages[0].url;
  }
  if (archivalCaption && mon.carouselImages.length > 0) {
    archivalCaption.textContent = mon.carouselImages[0].caption;
  }
  if (mediaCounter) {
    mediaCounter.textContent = `1 / ${mon.carouselImages.length}`;
  }

  if (keypointsList) {
    keypointsList.innerHTML = '';
    mon.keyPoints.forEach(pt => {
      const li = document.createElement('li');
      li.innerHTML = pt;
      keypointsList.appendChild(li);
    });
  }

  if (stopIndicator) stopIndicator.textContent = `${mon.index} / ${CURATED_MONUMENTS.length}`;
  if (discoveryBadge) discoveryBadge.textContent = `${mon.index} / ${CURATED_MONUMENTS.length}`;

  // Populate Right Inspector Drawer
  if (infoTitle) infoTitle.textContent = mon.fullName;
  if (infoSubtitle) infoSubtitle.textContent = `${mon.dynasty} • ${mon.dating}`;
  if (infoExcavator) infoExcavator.textContent = `${mon.unesco} • Coordinates: ${mon.lat}°N, ${mon.lon}°E`;
  if (infoPhotoImg && mon.carouselImages.length > 0) infoPhotoImg.src = mon.carouselImages[0].url;
  if (infoMasonry) infoMasonry.textContent = mon.masonry;
  if (infoDendro) infoDendro.textContent = mon.dating;
  if (infoDimensions) infoDimensions.textContent = mon.dimensions;
  if (infoArea) infoArea.textContent = mon.unesco;
  if (infoSummary) infoSummary.textContent = mon.keyPoints[0] + ' ' + mon.keyPoints[1];
  if (infoArtifacts) infoArtifacts.textContent = mon.keyPoints[2] + ' ' + mon.keyPoints[3];

  sideNote?.classList.remove('hidden');

  // Highlight active chips
  document.querySelectorAll('.discovery-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.id === mon.id);
  });

  // Highlight active 3D marker
  document.querySelectorAll('.monument-3d-marker').forEach(m => {
    m.classList.toggle('selected', m.dataset.id === mon.id);
  });

  // Swoop camera down into the REAL 3D place!
  if (smoothlyFly) {
    map.flyTo({
      center: [mon.lon, mon.lat],
      zoom: 16.8, // High-resolution real 3D building / place zoom!
      pitch: 68, // 3D ground perspective tilt
      bearing: (mon.index * 30) % 360,
      duration: 2800,
      essential: true
    });
  }
}

// Carousel Next / Prev
document.getElementById('btn-media-prev')?.addEventListener('click', () => {
  const mon = CURATED_MONUMENTS.find(m => m.id === state.activeMonumentId);
  if (!mon || mon.carouselImages.length <= 1) return;
  state.activePhotoIndex = (state.activePhotoIndex - 1 + mon.carouselImages.length) % mon.carouselImages.length;
  updateCarouselPhoto(mon);
});

document.getElementById('btn-media-next')?.addEventListener('click', () => {
  const mon = CURATED_MONUMENTS.find(m => m.id === state.activeMonumentId);
  if (!mon || mon.carouselImages.length <= 1) return;
  state.activePhotoIndex = (state.activePhotoIndex + 1) % mon.carouselImages.length;
  updateCarouselPhoto(mon);
});

function updateCarouselPhoto(mon) {
  const photo = mon.carouselImages[state.activePhotoIndex];
  if (archivalImg) archivalImg.src = photo.url;
  if (archivalCaption) archivalCaption.textContent = photo.caption;
  if (mediaCounter) mediaCounter.textContent = `${state.activePhotoIndex + 1} / ${mon.carouselImages.length}`;
}

// Close side-note and zoom out to overview
document.getElementById('btn-side-unfocus')?.addEventListener('click', () => {
  sideNote?.classList.add('hidden');
  resetToSubcontinentOverview();
});

// Prev / Next monument cycling
document.getElementById('btn-side-prev')?.addEventListener('click', () => cycleMonument(-1));
document.getElementById('btn-side-next')?.addEventListener('click', () => cycleMonument(1));
document.getElementById('btn-prev-area')?.addEventListener('click', () => cycleMonument(-1));
document.getElementById('btn-next-area-strip')?.addEventListener('click', () => cycleMonument(1));

function cycleMonument(delta) {
  const currIdx = CURATED_MONUMENTS.findIndex(m => m.id === state.activeMonumentId);
  const nextIdx = (currIdx + delta + CURATED_MONUMENTS.length) % CURATED_MONUMENTS.length;
  selectMonument(CURATED_MONUMENTS[nextIdx].id, true);
}

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === '[') cycleMonument(-1);
  if (e.key === ']') cycleMonument(1);
  if (e.key === 'Escape') sideNote?.classList.add('hidden');
  if (e.key.toLowerCase() === 'h') toggleHUD();
});

// ============================================================================
// 6. UNIVERSAL SEARCH ENGINE (ANY VILLAGE, CITY, MONUMENT OR COORDINATES)
// ============================================================================
const searchInput = document.getElementById('top-search-input');
const searchBtn = document.getElementById('btn-top-search');
const placesDatalist = document.getElementById('india-places-list');

function initSearchDatabase() {
  if (!placesDatalist) return;
  placesDatalist.innerHTML = '';

  CURATED_MONUMENTS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.name;
    opt.label = `${m.name} — ${m.state}`;
    placesDatalist.appendChild(opt);
  });

  INDIA_LOCATIONS_DATABASE.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc.name;
    opt.label = `${loc.name} — ${loc.type} (${loc.region})`;
    placesDatalist.appendChild(opt);
  });
}

async function executeLocationSearch(query) {
  if (!query) return;
  const q = query.trim();

  // 1. Direct Coordinates: e.g. "27.17, 78.04" or "-13.1631, -72.5450"
  const coordMatch = q.match(/^([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[2]);
    flyToCoordinates(lon, lat, 15.5, 65);
    return;
  }

  // 2. Curated 3D Heritage Monuments (World Wonders & Indian Heritage)
  const mon = CURATED_MONUMENTS.find(m =>
    m.name.toLowerCase().includes(q.toLowerCase()) ||
    m.fullName.toLowerCase().includes(q.toLowerCase()) ||
    m.state.toLowerCase().includes(q.toLowerCase()) ||
    (m.country && m.country.toLowerCase().includes(q.toLowerCase()))
  );
  if (mon) {
    selectMonument(mon.id, true);
    return;
  }

  // 3. Global Cities, Countries, Mountains & Indian States
  const loc = INDIA_LOCATIONS_DATABASE.find(l =>
    l.name.toLowerCase().includes(q.toLowerCase()) ||
    (l.region && l.region.toLowerCase().includes(q.toLowerCase()))
  );
  if (loc) {
    const zoomLevel = loc.type === 'Country' ? 4.8 : loc.type === 'State' ? 7.2 : loc.type === 'Summit' ? 14.8 : 13.5;
    flyToCoordinates(loc.lon, loc.lat, zoomLevel, 60);
    return;
  }

  // 4. Live Worldwide Geocoding Fallback via OpenStreetMap Nominatim
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      flyToCoordinates(lon, lat, 14.0, 60);
      return;
    }
  } catch (err) {
    console.warn('Live geocoding error:', err);
  }

  // Non-intrusive HUD notification banner
  const regionEl = document.getElementById('hud-region');
  if (regionEl) {
    const prevText = regionEl.textContent;
    regionEl.textContent = `⚠️ "${query}" not found. Try searching any country, city or landmark.`;
    setTimeout(() => {
      regionEl.textContent = prevText;
    }, 4000);
  }
}

function flyToCoordinates(lon, lat, zoom = 14.5, pitch = 60) {
  map.flyTo({
    center: [lon, lat],
    zoom: zoom,
    pitch: pitch,
    bearing: 0,
    duration: 2500,
    essential: true
  });
}

searchBtn?.addEventListener('click', () => {
  executeLocationSearch(searchInput?.value);
});

searchInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    executeLocationSearch(searchInput.value);
  }
});

document.getElementById('btn-room-search')?.addEventListener('click', () => {
  const input = document.getElementById('room-search-input');
  if (input) executeLocationSearch(input.value);
});

// 3D Globe vs Flat Projection Toggle
let isGlobeMode = true;
const globeToggleBtn = document.getElementById('btn-toggle-globe');
globeToggleBtn?.addEventListener('click', () => {
  isGlobeMode = !isGlobeMode;
  if (isGlobeMode) {
    map.setProjection({ type: 'globe' });
    globeToggleBtn.classList.add('active');
    globeToggleBtn.textContent = '🌐 3D Globe';
  } else {
    map.setProjection({ type: 'mercator' });
    globeToggleBtn.classList.remove('active');
    globeToggleBtn.textContent = '🗺️ Flat Map';
  }
});

// ============================================================================
// 7. LAYER SWITCHER (SATELLITE, HYBRID, TOPO, OSM)
// ============================================================================
document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const layerKey = btn.dataset.layer;
    if (MAP_STYLES[layerKey]) {
      state.activeLayer = layerKey;
      const currCenter = map.getCenter();
      const currZoom = map.getZoom();
      const currPitch = map.getPitch();
      const currBearing = map.getBearing();

      map.setStyle(MAP_STYLES[layerKey]);
      map.once('style.load', () => {
        map.setCenter(currCenter);
        map.setZoom(currZoom);
        map.setPitch(currPitch);
        map.setBearing(currBearing);
        addMonumentMarkersToMap();
      });
    }
  });
});

// ============================================================================
// 8. 3D VIEW MODES & GUIDED TOURS
// ============================================================================
export function resetToPlanetEarth() {
  map.flyTo({
    center: [20.0, 15.0],
    zoom: 2.2,
    pitch: 45,
    bearing: 0,
    duration: 2200,
    essential: true
  });
  document.getElementById('overview-hero-card')?.classList.remove('hidden');
}

export const resetToSubcontinentOverview = resetToPlanetEarth;

document.getElementById('btn-brand-home')?.addEventListener('click', resetToPlanetEarth);
document.getElementById('btn-reset-view')?.addEventListener('click', resetToPlanetEarth);

// Experience Modes Switcher
document.getElementById('btn-mode-orbit')?.addEventListener('click', () => {
  setMode('orbit');
  resetToSubcontinentOverview();
});

document.getElementById('btn-mode-guided')?.addEventListener('click', () => {
  setMode('guided');
  selectMonument('taj_mahal', true);
});

document.getElementById('btn-mode-walk')?.addEventListener('click', () => {
  setMode('walk');
  // Dive down into high-pitch 3D drone inspection
  map.easeTo({
    pitch: 78,
    zoom: Math.max(14.0, map.getZoom()),
    duration: 1500
  });
});

function setMode(modeKey) {
  state.mode = modeKey;
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === modeKey);
  });
}

function buildSectionPills() {
  const container = document.getElementById('sections-pills-container');
  if (!container) return;
  container.innerHTML = '';

  PAN_INDIA_SECTIONS.forEach((sec, idx) => {
    const btn = document.createElement('button');
    btn.className = `section-pill ${idx === 0 ? 'active' : ''}`;
    btn.dataset.section = sec.id;
    btn.innerHTML = `<span>${sec.num}</span> ${sec.shortTitle}`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.section-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSection(sec.id);
    });
    container.appendChild(btn);
  });
}

function buildMonumentChips() {
  const grid = document.getElementById('discovery-chips-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CURATED_MONUMENTS.forEach(mon => {
    const chip = document.createElement('div');
    chip.className = `discovery-chip ${mon.id === state.activeMonumentId ? 'active' : ''}`;
    chip.dataset.id = mon.id;
    chip.innerHTML = `
      <div class="chip-dot"></div>
      <div class="chip-text">
        <span class="chip-name">${mon.name}</span>
        <span class="chip-meta">${mon.state}</span>
      </div>
    `;
    chip.addEventListener('click', () => {
      selectMonument(mon.id, true);
    });
    grid.appendChild(chip);
  });
}

function loadSection(sectionId) {
  const sec = PAN_INDIA_SECTIONS.find(s => s.id === sectionId);
  if (!sec) return;

  state.activeSectionId = sec.id;
  const badge = document.getElementById('active-section-badge');
  if (badge) badge.textContent = `SECTION ${sec.num} • ${sec.shortTitle.toUpperCase()}`;

  const heroCard = document.getElementById('overview-hero-card');
  if (sec.id === 'overview') {
    heroCard?.classList.remove('hidden');
    resetToSubcontinentOverview();
  } else {
    heroCard?.classList.add('hidden');
    if (sec.monumentId) {
      selectMonument(sec.monumentId, true);
    }
  }
}

document.getElementById('btn-start-walkthrough')?.addEventListener('click', () => {
  document.getElementById('overview-hero-card')?.classList.add('hidden');
  selectMonument('pyramids_giza', true);
});

document.getElementById('btn-enter-freewalk')?.addEventListener('click', () => {
  document.getElementById('overview-hero-card')?.classList.add('hidden');
  map.flyTo({
    center: [31.1342, 29.9792], // Giza Plateau Pyramids 3D
    zoom: 15.5,
    pitch: 74,
    bearing: 45,
    duration: 2500
  });
});

// Auto-Guide Tour Play / Pause
let tourInterval = null;
const guideBtn = document.getElementById('btn-guided-walk');
guideBtn?.addEventListener('click', () => {
  if (tourInterval) {
    clearInterval(tourInterval);
    tourInterval = null;
    document.getElementById('guided-walk-icon').textContent = '▶';
    document.getElementById('guided-walk-label').textContent = 'Auto-Guide Tour';
  } else {
    document.getElementById('guided-walk-icon').textContent = '⏸';
    document.getElementById('guided-walk-label').textContent = 'Pause Tour';
    tourInterval = setInterval(() => {
      cycleMonument(1);
    }, 6500);
  }
});

// Auto-Rotate toggle
document.getElementById('btn-toggle-autorotate')?.addEventListener('click', (e) => {
  state.autoRotate = !state.autoRotate;
  e.currentTarget.classList.toggle('active', state.autoRotate);
});

// Fullscreen toggle
document.getElementById('btn-fullscreen-stage')?.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

// Clean HUD Toggle
function toggleHUD() {
  state.hudVisible = !state.hudVisible;
  const topBar = document.getElementById('top-bar');
  const sectionsBar = document.getElementById('sections-bar');
  const strip = document.getElementById('areas-strip-section');
  const compass = document.getElementById('celestial-compass');
  const coords = document.getElementById('live-coords-hud');

  [topBar, sectionsBar, strip, compass, coords, sideNote].forEach(el => {
    if (el) el.classList.toggle('hidden', !state.hudVisible);
  });
}

// 3D Pitch View Toggle Buttons (2D, 3D, Ground 3D)
document.getElementById('btn-pitch-2d')?.addEventListener('click', (e) => {
  document.querySelectorAll('.stage-pill-btn').forEach(b => b.classList.remove('active'));
  e.currentTarget.classList.add('active');
  set3DPitch(0);
});

document.getElementById('btn-pitch-3d')?.addEventListener('click', (e) => {
  document.querySelectorAll('.stage-pill-btn').forEach(b => b.classList.remove('active'));
  e.currentTarget.classList.add('active');
  set3DPitch(55);
});

document.getElementById('btn-pitch-ground')?.addEventListener('click', (e) => {
  document.querySelectorAll('.stage-pill-btn').forEach(b => b.classList.remove('active'));
  e.currentTarget.classList.add('active');
  set3DPitch(76);
});

// Close-up 3D inspection from Dossier drawer
document.getElementById('btn-walk-here')?.addEventListener('click', () => {
  const mon = CURATED_MONUMENTS.find(m => m.id === state.activeMonumentId);
  if (mon) {
    map.flyTo({
      center: [mon.lon, mon.lat],
      zoom: 17.5,
      pitch: 75,
      bearing: 30,
      duration: 2200
    });
  }
});

document.getElementById('btn-focus-selected')?.addEventListener('click', () => {
  const mon = CURATED_MONUMENTS.find(m => m.id === state.activeMonumentId);
  if (mon) {
    map.flyTo({
      center: [mon.lon, mon.lat],
      zoom: 16.2,
      pitch: 62,
      duration: 1800
    });
  }
});

// On-screen 3D Drone / Flight Movement Controls
document.querySelectorAll('.pad-btn').forEach(padBtn => {
  padBtn.addEventListener('click', () => {
    const action = padBtn.dataset.move;
    const center = map.getCenter();
    const bearing = map.getBearing();
    const rad = (bearing * Math.PI) / 180;
    const step = 0.003 * Math.pow(2, 16 - Math.min(16, map.getZoom()));

    if (action === 'forward') {
      map.panBy([0, -120]);
    } else if (action === 'backward') {
      map.panBy([0, 120]);
    } else if (action === 'left') {
      map.panBy([-120, 0]);
    } else if (action === 'right') {
      map.panBy([120, 0]);
    } else if (action === 'turnLeft') {
      map.easeTo({ bearing: bearing - 30, duration: 600 });
    } else if (action === 'turnRight') {
      map.easeTo({ bearing: bearing + 30, duration: 600 });
    }
  });
});

document.getElementById('btn-toggle-hud')?.addEventListener('click', toggleHUD);

// ============================================================================
// 9. WEB AUDIO TEMPLE BELL & TANPURA DRONE
// ============================================================================
let audioCtx = null;
let tanpuraGain = null;

function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
  tanpuraGain = masterGain;

  // Sa harmonic
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(138.59, audioCtx.currentTime);

  // Pa harmonic
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(207.65, audioCtx.currentTime);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(320, audioCtx.currentTime);
  filter.Q.setValueAtTime(3.5, audioCtx.currentTime);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(masterGain);

  osc1.start();
  osc2.start();
}

function playTempleBell() {
  if (!state.audioEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  const bellOsc = audioCtx.createOscillator();
  const bellGain = audioCtx.createGain();
  bellOsc.type = 'sine';
  bellOsc.frequency.setValueAtTime(528, now);

  bellGain.gain.setValueAtTime(0.35, now);
  bellGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

  bellOsc.connect(bellGain);
  bellGain.connect(audioCtx.destination);

  bellOsc.start(now);
  bellOsc.stop(now + 3.0);
}

document.getElementById('btn-audio-toggle')?.addEventListener('click', () => {
  state.audioEnabled = !state.audioEnabled;
  const btn = document.getElementById('btn-audio-toggle');
  const icon = document.getElementById('audio-icon');

  if (state.audioEnabled) {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (tanpuraGain) tanpuraGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    btn?.classList.remove('muted');
    if (icon) icon.textContent = '🔊';
  } else {
    if (tanpuraGain && audioCtx) tanpuraGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    btn?.classList.add('muted');
    if (icon) icon.textContent = '🔇';
  }
});

// ============================================================================
// 10. ARCHAEOASTRONOMY & CELESTIAL SUN OBSERVATORY
// ============================================================================
function updateCelestialSun(seasonKey, hour) {
  const season = SOLAR_SEASONS[seasonKey] || SOLAR_SEASONS.equinox;
  const sunOrb = document.getElementById('compass-sun-orb');
  const sunRay = document.getElementById('compass-celestial-ray');
  const readout = document.getElementById('compass-sun-readout');

  const cx = 60;
  const cy = 60;
  const r = 33;
  const hourRatio = (hour - 6.0) / 12.0;
  const angle = Math.PI * (1 - Math.max(0, Math.min(1, hourRatio)));
  const ox = cx + r * Math.cos(angle);
  const oy = cy + r * Math.sin(angle);

  if (sunOrb) sunOrb.setAttribute('transform', `translate(${ox.toFixed(2)}, ${oy.toFixed(2)})`);
  if (sunRay) {
    sunRay.setAttribute('x2', ox.toFixed(2));
    sunRay.setAttribute('y2', oy.toFixed(2));
  }
  if (readout) {
    const timeStr = `${Math.floor(hour).toString().padStart(2, '0')}:${Math.floor((hour % 1) * 60).toString().padStart(2, '0')}`;
    readout.textContent = `${timeStr} • ${season.name}`;
  }
}

function buildCompassTicks() {
  const tickGroup = document.getElementById('compass-ticks');
  if (!tickGroup) return;
  tickGroup.innerHTML = '';
  for (let d = 0; d < 360; d += 15) {
    const isMajor = d % 90 === 0;
    const rad = (d * Math.PI) / 180;
    const r1 = isMajor ? 48 : 50;
    const r2 = 53;
    const x1 = 60 + r1 * Math.sin(rad);
    const y1 = 60 - r1 * Math.cos(rad);
    const x2 = 60 + r2 * Math.sin(rad);
    const y2 = 60 - r2 * Math.cos(rad);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toFixed(2));
    line.setAttribute('y1', y1.toFixed(2));
    line.setAttribute('x2', x2.toFixed(2));
    line.setAttribute('y2', y2.toFixed(2));
    line.setAttribute('stroke', isMajor ? '#f8d040' : 'rgba(248, 208, 64, 0.3)');
    line.setAttribute('stroke-width', isMajor ? '1.4' : '0.8');
    tickGroup.appendChild(line);
  }
}

// Compass Popover Toggle
document.getElementById('compass-info-btn')?.addEventListener('click', () => {
  document.getElementById('compass-info-popover')?.classList.toggle('hidden');
});
document.getElementById('compass-info-close')?.addEventListener('click', () => {
  document.getElementById('compass-info-popover')?.classList.add('hidden');
});

// Atlas Modal Toggle
document.getElementById('btn-open-atlas')?.addEventListener('click', () => {
  document.getElementById('atlas-modal')?.classList.remove('hidden');
});
document.getElementById('btn-close-atlas')?.addEventListener('click', () => {
  document.getElementById('atlas-modal')?.classList.add('hidden');
});

// Modal Tabs
document.querySelectorAll('.atlas-tab-btn').forEach(tabBtn => {
  tabBtn.addEventListener('click', () => {
    document.querySelectorAll('.atlas-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.atlas-tab-content').forEach(c => c.classList.remove('active'));
    tabBtn.classList.add('active');
    document.getElementById(tabBtn.dataset.tab)?.classList.add('active');
  });
});

// ============================================================================
// 11. PLANETARY DOCK CONTROLS
// ============================================================================
// Jump buttons
document.querySelectorAll('.continent-jump-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const center = btn.dataset.center.split(',').map(Number);
    const zoom = parseFloat(btn.dataset.zoom);
    map.flyTo({ center, zoom, duration: 2500, essential: true });
  });
});

// Solar Simulator
const solarSlider = document.getElementById('solar-time-slider');
const timeDisplay = document.getElementById('tc-time-display');

function updateSolarTime(hour) {
  const h = parseFloat(hour);
  const timeStr = `${Math.floor(h).toString().padStart(2, '0')}:${Math.floor((h % 1) * 60).toString().padStart(2, '0')}`;
  timeDisplay.textContent = `${timeStr} • ${h > 6 && h < 18 ? 'Daylight' : 'Night'}`;
  // Add logic to actually update the map's lighting based on solar time if needed,
  // currently we'll just update the UI display.
}

solarSlider?.addEventListener('input', (e) => updateSolarTime(e.target.value));

document.querySelectorAll('.time-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const hour = btn.dataset.hour;
    if(solarSlider) solarSlider.value = hour;
    updateSolarTime(hour);
  });
});

// Random Wonder Fly
document.getElementById('btn-random-wonder')?.addEventListener('click', () => {
  const randomMon = CURATED_MONUMENTS[Math.floor(Math.random() * CURATED_MONUMENTS.length)];
  selectMonument(randomMon.id, true);
});

// Boundaries Toggle
let boundariesOn = true;
document.getElementById('btn-toggle-boundaries')?.addEventListener('click', (e) => {
  boundariesOn = !boundariesOn;
  const label = document.getElementById('boundaries-toggle-label');
  if(label) label.textContent = `Borders: ${boundariesOn ? 'ON' : 'OFF'}`;
  e.currentTarget.classList.toggle('active', boundariesOn);
  // Add logic to toggle border layer visibility if it exists
});
