// Orbital data (scaled)
const planets = {
    mercury: { a: 60, e: 0.205, period: 88, size: 8, distSun: 35980000, distEarth: 56974100 },
    venus:   { a: 90, e: 0.007, period: 225, size: 12, distSun: 67240000, distEarth: 25700000 },
    earth:   { a: 120, e: 0.017, period: 365, size: 14, distSun: 92960000, distEarth: 0 },
    mars:    { a: 150, e: 0.093, period: 687, size: 10, distSun: 141600000, distEarth: 33900000 },
    jupiter: { a: 200, e: 0.048, period: 4331, size: 28, distSun: 483800000, distEarth: 365000000 },
    saturn:  { a: 250, e: 0.056, period: 10747, size: 24, distSun: 890800000, distEarth: 746000000 },
    uranus:  { a: 300, e: 0.046, period: 30589, size: 18, distSun: 1784000000, distEarth: 1600000000 },
    neptune: { a: 350, e: 0.010, period: 59800, size: 18, distSun: 2793000000, distEarth: 2700000000 },
    pluto:   { a: 390, e: 0.249, period: 90560, size: 6, distSun: 3670000000, distEarth: 3100000000 }
};

// DOM references
const solar = document.getElementById("solar-system");
const infoBox = document.getElementById("info-box");
const nameEl = document.getElementById("planet-name");
const sunEl = document.getElementById("dist-sun");
const earthEl = document.getElementById("dist-earth");

// Camera controls
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let lastX = 0;
let lastY = 0;

// Zoom
window.addEventListener("wheel", e => {
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.3, scale), 3);
});

// Drag to pan
window.addEventListener("mousedown", e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});
window.addEventListener("mouseup", () => dragging = false);
window.addEventListener("mousemove", e => {
    if (dragging) {
        offsetX += e.clientX - lastX;
        offsetY += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

// Hover info
document.querySelectorAll(".planet").forEach(p => {
    p.addEventListener("mouseenter", () => {
        const id = p.id;
        const data = planets[id];
        nameEl.textContent = id.toUpperCase();
        sunEl.textContent = data.distSun.toLocaleString();
        earthEl.textContent = data.distEarth.toLocaleString();
        infoBox.style.display = "block";
    });
    p.addEventListener("mouseleave", () => infoBox.style.display = "none");
});

// Animation loop
let t = 0;
function animate() {
    t += 0.5; // global speed multiplier

    for (const id in planets) {
        const p = planets[id];
        const elem = document.getElementById(id);

        const a = p.a;
        const b = a * Math.sqrt(1 - p.e * p.e);
        const angle = (t / p.period) * 2 * Math.PI;

        const x = a * Math.cos(angle);
        const y = b * Math.sin(angle);

        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
    }

    // Moon orbiting Earth
    const earth = planets.earth;
    const earthElem = document.getElementById("earth");
    const moon = document.getElementById("moon");

    const ex = parseFloat(earthElem.style.left);
    const ey = parseFloat(earthElem.style.top);

    const moonAngle = t * 0.1;
    const mx = ex + 20 * Math.cos(moonAngle);
    const my = ey + 20 * Math.sin(moonAngle);

    moon.style.left = `${mx}px`;
    moon.style.top = `${my}px`;

    // Apply camera transform
    solar.style.transform =
        `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

    requestAnimationFrame(animate);
}

animate();
