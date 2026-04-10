const planets = {
    mercury: {
        name: "Mercury",
        distSun: 35980000,
        distEarth: 56974100
    },
    venus: {
        name: "Venus",
        distSun: 67240000,
        distEarth: 25700000
    },
    earth: {
        name: "Earth",
        distSun: 92960000,
        distEarth: 0
    },
    mars: {
        name: "Mars",
        distSun: 141600000,
        distEarth: 33900000
    },
    jupiter: {
        name: "Jupiter",
        distSun: 483800000,
        distEarth: 365000000
    },
    saturn: {
        name: "Saturn",
        distSun: 890800000,
        distEarth: 746000000
    },
    uranus: {
        name: "Uranus",
        distSun: 1784000000,
        distEarth: 1600000000
    },
    neptune: {
        name: "Neptune",
        distSun: 2793000000,
        distEarth: 2700000000
    }
};

const infoBox = document.getElementById("info-box");
const nameEl = document.getElementById("planet-name");
const sunEl = document.getElementById("dist-sun");
const earthEl = document.getElementById("dist-earth");

document.querySelectorAll(".planet").forEach(planet => {
    planet.addEventListener("mouseenter", () => {
        const id = planet.id;
        const data = planets[id];

        nameEl.textContent = data.name;
        sunEl.textContent = data.distSun.toLocaleString();
        earthEl.textContent = data.distEarth.toLocaleString();

        infoBox.style.display = "block";
    });

    planet.addEventListener("mouseleave", () => {
        infoBox.style.display = "none";
    });
});
