// PLANET DATA (scaled)
const planetData = {
    mercury: { a: 12, e: 0.205, inc: 7, period: 88, color: 0xaaaaaa, distSun: 35980000, distEarth: 56974100 },
    venus:   { a: 17, e: 0.007, inc: 3.4, period: 225, color: 0xd4a15a, distSun: 67240000, distEarth: 25700000 },
    earth:   { a: 22, e: 0.017, inc: 0, period: 365, color: 0x4a90e2, distSun: 92960000, distEarth: 0 },
    mars:    { a: 28, e: 0.093, inc: 1.8, period: 687, color: 0xb44, distSun: 141600000, distEarth: 33900000 },
    jupiter: { a: 40, e: 0.048, inc: 1.3, period: 4331, color: 0xc9a97f, distSun: 483800000, distEarth: 365000000 },
    saturn:  { a: 50, e: 0.056, inc: 2.5, period: 10747, color: 0xe3c27d, distSun: 890800000, distEarth: 746000000 },
    uranus:  { a: 60, e: 0.046, inc: 0.8, period: 30589, color: 0x7fd1d1, distSun: 1784000000, distEarth: 1600000000 },
    neptune: { a: 70, e: 0.010, inc: 1.8, period: 59800, color: 0x4169e1, distSun: 2793000000, distEarth: 2700000000 },
    pluto:   { a: 80, e: 0.249, inc: 17, period: 90560, color: 0xaaaaaa, distSun: 3670000000, distEarth: 3100000000 }
};

// THREE.JS SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.set(0, 120, 160);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ORBIT CONTROLS (orbit-locked)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 1.0;
controls.minDistance = 40;
controls.maxDistance = 400;

// GLOWING SUN
const sunGeo = new THREE.CircleGeometry(10, 64);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// SOFT GLOW
const glow = new THREE.PointLight(0xffaa33, 2, 300);
scene.add(glow);

// PLANETS + ORBITS
const planets = {};
const orbits = {};

for (const name in planetData) {
    const p = planetData[name];

    // Planet sprite
    const spriteMat = new THREE.SpriteMaterial({ color: p.color });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2, 2, 1);
    scene.add(sprite);
    planets[name] = sprite;

    // Dotted orbit
    const points = [];
    const a = p.a;
    const b = a * Math.sqrt(1 - p.e * p.e);

    for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = a * Math.cos(t);
        const y = b * Math.sin(t);
        points.push(new THREE.Vector3(x, 0, y));
    }

    const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMat = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 1,
        gapSize: 1
    });

    const orbit = new THREE.LineLoop(orbitGeo, orbitMat);
    orbit.computeLineDistances();
    orbit.rotation.x = THREE.MathUtils.degToRad(90 - p.inc);
    scene.add(orbit);
    orbits[name] = orbit;
}

// MOON
const moonMat = new THREE.SpriteMaterial({ color: 0xffffff });
const moon = new THREE.Sprite(moonMat);
moon.scale.set(1, 1, 1);
scene.add(moon);

// HOVER INFO
const infoBox = document.getElementById("info-box");
const nameEl = document.getElementById("planet-name");
const sunEl = document.getElementById("dist-sun");
const earthEl = document.getElementById("dist-earth");

function showInfo(name) {
    const p = planetData[name];
    nameEl.textContent = name.toUpperCase();
    sunEl.textContent = p.distSun.toLocaleString();
    earthEl.textContent = p.distEarth.toLocaleString();
    infoBox.style.display = "block";
}

window.addEventListener("mousemove", e => {
    const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const sprites = Object.values(planets);
    const hits = raycaster.intersectObjects(sprites);

    if (hits.length > 0) {
        const hit = hits[0].object;
        for (const name in planets) {
            if (planets[name] === hit) {
                showInfo(name);
            }
        }
    } else {
        infoBox.style.display = "none";
    }
});

// ANIMATION LOOP
let t = 0;
function animate() {
    t += 0.5;

    for (const name in planetData) {
        const p = planetData[name];
        const sprite = planets[name];

        const a = p.a;
        const b = a * Math.sqrt(1 - p.e * p.e);
        const angle = (t / p.period) * 2 * Math.PI;

        let x = a * Math.cos(angle);
        let z = b * Math.sin(angle);

        // Apply inclination
        const inc = THREE.MathUtils.degToRad(p.inc);
        const y = z * Math.sin(inc);
        z = z * Math.cos(inc);

        sprite.position.set(x, y, z);

        // Moon orbit
        if (name === "earth") {
            const mx = x + 4 * Math.cos(t * 0.1);
            const mz = z + 4 * Math.sin(t * 0.1);
            moon.position.set(mx, y, mz);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// RESIZE HANDLER
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
