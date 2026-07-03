// Generates static route geometry files (assets/routes/<slug>.json) for the
// journey maps. Road/train segments are routed via OSRM (train uses road
// waypoints along the rail corridor as a close visual approximation); boat
// segments are smooth arcs over water.
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "assets", "routes");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function osrm(points) {
  const coords = points.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=simplified&geometries=geojson`;
  const res = await fetch(url, { headers: { "User-Agent": "hurutta.github.io journey-map generator" } });
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) throw new Error(`OSRM failed: ${data.code} for ${coords}`);
  const km = data.routes[0].distance / 1000;
  // geojson is [lng,lat] — flip to [lat,lng] for Leaflet
  const line = data.routes[0].geometry.coordinates.map(([lng, lat]) => [round(lat), round(lng)]);
  return { line, km };
}

const round = (n) => Math.round(n * 1e5) / 1e5;

// Quadratic bezier arc between two points, bowing to the right of travel direction
function boatArc(a, b, curvature = 0.12, samples = 40) {
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const d = [b[0] - a[0], b[1] - a[1]];
  const ctrl = [mid[0] - d[1] * curvature, mid[1] + d[0] * curvature];
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lat = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t ** 2 * b[0];
    const lng = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t ** 2 * b[1];
    pts.push([round(lat), round(lng)]);
  }
  return pts;
}

// Catmull-Rom spline through waypoints — smooth valley-following curve for
// corridors OSRM's car profile can't route (the upper Marsyangdi jeep track)
function spline(waypoints, per = 8) {
  const pts = [];
  const P = (i) => waypoints[Math.max(0, Math.min(waypoints.length - 1, i))];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [p0, p1, p2, p3] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
    for (let j = 0; j < per; j++) {
      const t = j / per, t2 = t * t, t3 = t2 * t;
      pts.push([
        round(0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)),
        round(0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)),
      ]);
    }
  }
  pts.push([round(waypoints.at(-1)[0]), round(waypoints.at(-1)[1])]);
  return pts;
}

const haversineKm = (a, b) => {
  const R = 6371, toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

// Stops (must match the coordinates in the posts' journey blocks)
const P = {
  bangkok: [13.7563, 100.5018], krabi: [8.0863, 98.9063], aonang: [8.0327, 98.8177],
  railay: [8.0119, 98.8372], phiphi: [7.7407, 98.7784], phuketOldTown: [7.885, 98.3875],
  colombo: [6.9271, 79.8612], kandy: [7.2906, 80.6337], ella: [6.8667, 81.0462],
  mirissa: [5.9483, 80.4589], ahangama: [5.9739, 80.3623], unawatuna: [6.0174, 80.2489],
  galle: [6.0328, 80.217],
  kathmandu: [27.7172, 85.324], mugling: [27.856, 84.563], besisahar: [28.2306, 84.3782],
  humde: [28.6417, 84.0889], manang: [28.6667, 84.0167], pokhara: [28.2096, 83.9856],
  // rail-corridor waypoints Kandy → Ella (roads paralleling the Main Line railway)
  gampola: [7.1647, 80.5767], nawalapitiya: [7.0439, 80.5353], hatton: [6.8916, 80.5955],
  nanuoya: [6.9497, 80.7442], haputale: [6.7676, 80.9511], bandarawela: [6.8291, 80.988],
  // Marsyangdi valley villages along the Besisahar–Manang jeep track
  bhulbhule: [28.3, 84.36], jagat: [28.4, 84.395], tal: [28.47, 84.375],
  dharapani: [28.5228, 84.35], chame: [28.5548, 84.2427], pisang: [28.6152, 84.1548],
  braga: [28.65, 84.045],
};

const MARSYANGDI_UP = [P.besisahar, P.bhulbhule, P.jagat, P.tal, P.dharapani, P.chame, P.pisang, P.humde];
const MARSYANGDI_DOWN = [P.manang, P.braga, P.humde, P.pisang, P.chame, P.dharapani, P.tal, P.jagat, P.bhulbhule, P.besisahar];

const TRIPS = {
  "thailand-2026": [
    { mode: "bus", via: [P.bangkok, P.krabi] },
    { mode: "bus", via: [P.krabi, P.aonang] },
    { mode: "boat", arc: [P.aonang, P.railay] },
    { mode: "boat", arc: [P.railay, P.phiphi] },
    { mode: "boat", arc: [P.phiphi, P.phuketOldTown] },
    { mode: "bus", via: [P.phuketOldTown, P.bangkok] },
  ],
  "srilanka-2025": [
    { mode: "bus", via: [P.colombo, P.kandy] },
    { mode: "train", via: [P.kandy, P.gampola, P.nawalapitiya, P.hatton, P.nanuoya, P.haputale, P.bandarawela, P.ella] },
    { mode: "bus", via: [P.ella, P.mirissa] },
    { mode: "bus", via: [P.mirissa, P.ahangama] },
    { mode: "bus", via: [P.ahangama, P.unawatuna] },
    { mode: "bus", via: [P.unawatuna, P.galle] },
    { mode: "bus", via: [P.galle, P.colombo] },
  ],
  "nepal-2025": [
    { mode: "bus", via: [P.kathmandu, P.mugling] },
    { mode: "bus", via: [P.mugling, P.besisahar] },
    { mode: "bus", manual: MARSYANGDI_UP },
    { mode: "bus", manual: [P.humde, P.braga, P.manang] },
    { mode: "bus", manual: MARSYANGDI_DOWN },
    { mode: "bus", via: [P.besisahar, P.pokhara] },
    { mode: "bus", via: [P.pokhara, P.kathmandu] },
  ],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [slug, segs] of Object.entries(TRIPS)) {
    const segments = [];
    for (const seg of segs) {
      if (seg.arc) {
        const [a, b] = seg.arc;
        segments.push({ mode: seg.mode, coords: boatArc(a, b) });
        console.log(`${slug}  ${seg.mode.padEnd(5)} arc   ${haversineKm(a, b).toFixed(0)} km (straight)`);
      } else if (seg.manual) {
        const coords = spline(seg.manual);
        segments.push({ mode: seg.mode, coords });
        console.log(`${slug}  ${seg.mode.padEnd(5)} manual spline ${seg.manual.length} waypoints → ${coords.length} pts`);
      } else {
        const { line, km } = await osrm(seg.via);
        const direct = haversineKm(seg.via[0], seg.via.at(-1));
        segments.push({ mode: seg.mode, coords: line });
        console.log(`${slug}  ${seg.mode.padEnd(5)} osrm  ${km.toFixed(0)} km routed (${direct.toFixed(0)} km direct, ${line.length} pts)`);
        if (km > direct * 4 + 50) console.log(`  !! suspicious detour on ${slug} segment`);
        await sleep(600);
      }
    }
    const file = path.join(OUT, `${slug}.json`);
    fs.writeFileSync(file, JSON.stringify({ segments }));
    console.log(`wrote ${file} (${(fs.statSync(file).size / 1024).toFixed(1)} KB)\n`);
  }
})();
