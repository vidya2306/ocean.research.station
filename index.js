// your code goes here
/* =========================================================
   POLARIS
   Autonomous Marine Observation Network

   Frontend prototype
   ========================================================= */


/* =========================================================
   1. AUTHENTICATION
   ========================================================= */

const USERS = [
    {
        id: "POLARIS-ADMIN",
        password: "POLARIS@2026",
        role: "ADMINISTRATOR",
        name: "POLARIS Administrator"
    },
    {
        id: "POLARIS-OPS01",
        password: "OCEAN@2026",
        role: "RESEARCH OPERATOR",
        name: "Ocean Operations 01"
    },
    {
        id: "POLARIS-OPS02",
        password: "ATLANTIS@2026",
        role: "RESEARCH OPERATOR",
        name: "Ocean Operations 02"
    },
    {
        id: "POLARIS-OBS01",
        password: "OBSERVE@2026",
        role: "OBSERVER",
        name: "Observation Desk"
    },
    {
        id: "POLARIS-LAB01",
        password: "LAB@2026",
        role: "LABORATORY",
        name: "POLARIS Laboratory"
    }
];


/* =========================================================
   2. PARAMETERS
   ========================================================= */

const PARAMETERS = {

    waterTemperature: {
        label: "Water Temperature",
        unit: "°C",
        decimals: 2,
        description: "Sea-water temperature"
    },

    airTemperature: {
        label: "Air Temperature",
        unit: "°C",
        decimals: 2,
        description: "Ambient air temperature"
    },

    pressure: {
        label: "Atmospheric Pressure",
        unit: "hPa",
        decimals: 1,
        description: "Atmospheric pressure"
    },

    humidity: {
        label: "Relative Humidity",
        unit: "%",
        decimals: 1,
        description: "Relative atmospheric humidity"
    },

    windSpeed: {
        label: "Wind Speed",
        unit: "m/s",
        decimals: 1,
        description: "Surface wind speed"
    },

    seaLevel: {
        label: "Sea Level",
        unit: "m",
        decimals: 2,
        description: "Measured sea level"
    }
};


/* =========================================================
   3. STATION DEFINITIONS
   ========================================================= */

const STATION_DEFINITIONS = [

    {
        id: "POL-SI01",
        name: "Southern Indian Array 01",
        region: "Southern Indian Ocean",
        latitude: -52.00,
        longitude: 68.00,
        status: "active",
        battery: 91,
        signal: 88
    },

    {
        id: "POL-SI02",
        name: "Southern Indian Array 02",
        region: "Southern Indian Ocean",
        latitude: -58.00,
        longitude: 88.00,
        status: "active",
        battery: 83,
        signal: 76
    },

    {
        id: "POL-SA01",
        name: "South Atlantic Array 01",
        region: "South Atlantic Ocean",
        latitude: -55.00,
        longitude: -35.00,
        status: "active",
        battery: 87,
        signal: 81
    },

    {
        id: "POL-SA02",
        name: "South Atlantic Array 02",
        region: "South Atlantic Ocean",
        latitude: -62.00,
        longitude: -48.00,
        status: "offline",
        battery: 43,
        signal: 19
    },

    {
        id: "POL-SP01",
        name: "Southern Pacific Array 01",
        region: "Southern Pacific Ocean",
        latitude: -55.00,
        longitude: -125.00,
        status: "active",
        battery: 94,
        signal: 91
    },

    {
        id: "POL-SP02",
        name: "Southern Pacific Array 02",
        region: "Southern Pacific Ocean",
        latitude: -62.00,
        longitude: -155.00,
        status: "active",
        battery: 79,
        signal: 73
    },

    {
        id: "POL-SO01",
        name: "Southern Ocean Array 01",
        region: "Southern Ocean",
        latitude: -65.00,
        longitude: 15.00,
        status: "active",
        battery: 89,
        signal: 84
    },

    {
        id: "POL-SO02",
        name: "Southern Ocean Array 02",
        region: "Southern Ocean",
        latitude: -68.00,
        longitude: 95.00,
        status: "active",
        battery: 72,
        signal: 67
    },

    {
        id: "POL-SO03",
        name: "Southern Ocean Array 03",
        region: "Southern Ocean",
        latitude: -64.00,
        longitude: -145.00,
        status: "active",
        battery: 86,
        signal: 78
    }
];


/* =========================================================
   4. CREATE HISTORICAL DATA
   ========================================================= */

function createHistoricalReadings(station, count = 432) {

    const readings = [];

    const now = new Date();

    const seed =
        station.latitude * 3 +
        station.longitude * 2;

    for (let i = count - 1; i >= 0; i--) {

        const timestamp = new Date(
            now.getTime() - i * 10 * 60 * 1000
        );

        const hoursFromNow = i / 6;

        const dailyCycle =
            Math.sin(
                ((hoursFromNow % 24) / 24) *
                Math.PI * 2
            );

        const slowCycle =
            Math.sin(
                (hoursFromNow / 24) *
                Math.PI * 2
            );

        const noise =
            Math.sin(
                i * 1.37 +
                seed
            ) * 0.35;

        const waterTemperature =
            -1.4 +
            dailyCycle * 0.55 +
            slowCycle * 0.30 +
            noise +
            (station.latitude + 60) * 0.015;

        const airTemperature =
            -3.8 +
            dailyCycle * 1.8 +
            slowCycle * 0.8 +
            noise * 1.4 +
            (station.latitude + 60) * 0.03;

        const pressure =
            1004 +
            Math.sin(i / 20 + seed) * 9 +
            Math.sin(i / 63) * 5;

        const humidity =
            77 +
            Math.sin(i / 14 + seed) * 9 +
            Math.sin(i / 55) * 5;

        const windSpeed =
            Math.max(
                1,
                9 +
                Math.sin(i / 9 + seed) * 3.5 +
                Math.sin(i / 25) * 2
            );

        const seaLevel =
            0.42 +
            Math.sin(i / 18 + seed) * 0.07 +
            Math.sin(i / 42) * 0.04;

        readings.push({

            timestamp: timestamp.toISOString(),

            waterTemperature:
                Number(waterTemperature.toFixed(2)),

            airTemperature:
                Number(airTemperature.toFixed(2)),

            pressure:
                Number(pressure.toFixed(1)),

            humidity:
                Number(
                    Math.max(
                        45,
                        Math.min(100, humidity)
                    ).toFixed(1)
                ),

            windSpeed:
                Number(windSpeed.toFixed(1)),

            seaLevel:
                Number(seaLevel.toFixed(2))
        });
    }

    return readings;
}


/* =========================================================
   5. BUILD STATIONS
   ========================================================= */

const stations = STATION_DEFINITIONS.map(station => ({

    ...station,

    readings: createHistoricalReadings(station),

    lastUpdate: null
}));

stations.forEach(station => {

    station.lastUpdate =
        station.readings[
            station.readings.length - 1
        ].timestamp;
});


/* =========================================================
   6. APPLICATION STATE
   ========================================================= */

const state = {

    loggedIn: false,

    user: null,

    selectedStation: stations[0],

    parameter: "waterTemperature",

    timeRange: "24H",

    theme: "light",

    search: "",

    filter: "all"
};


/* =========================================================
   7. DOM
   ========================================================= */

const app = document.getElementById("app");


/* =========================================================
   8. UTILITIES
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatNumber(value, decimals = 2) {

    return Number(value).toFixed(decimals);
}


function formatCoordinates(latitude, longitude) {

    const lat =
        Math.abs(latitude).toFixed(2) +
        "° " +
        (latitude >= 0 ? "N" : "S");

    const lon =
        Math.abs(longitude).toFixed(2) +
        "° " +
        (longitude >= 0 ? "E" : "W");

    return `${lat}, ${lon}`;
}


function formatDateTime(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleString("en-IN", {

        year: "numeric",
        month: "short",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: false,

        timeZone: "UTC"
    }) + " UTC";
}


function formatShortTime(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleString("en-IN", {

        day: "2-digit",
        month: "short",

        hour: "2-digit",
        minute: "2-digit",

        hour12: false,

        timeZone: "UTC"
    });
}


function getRangeHours(range) {

    switch (range) {

        case "6H":
            return 6;

        case "24H":
            return 24;

        case "7D":
            return 24 * 7;

        case "30D":
            return 24 * 30;

        default:
            return 24;
    }
}


function getFilteredReadings(station) {

    const hours =
        getRangeHours(state.timeRange);

    const cutoff =
        Date.now() -
        hours * 60 * 60 * 1000;

    return station.readings.filter(
        reading =>
            new Date(reading.timestamp).getTime()
            >= cutoff
    );
}


/* =========================================================
   9. LOGIN SCREEN
   ========================================================= */

function renderLogin() {

    app.innerHTML = `

        <main class="login-screen">

            <section class="login-card">

                <div class="login-brand">

                    <h1>POLARIS</h1>

                    <p>
                        Autonomous Marine Observation Network
                    </p>

                </div>


                <form
                    class="login-form"
                    id="loginForm"
                >

                    <div>

                        <label for="operatorId">
                            Operator ID
                        </label>

                        <input
                            id="operatorId"
                            type="text"
                            placeholder="POLARIS-OPS01"
                            autocomplete="username"
                            required
                        >

                    </div>


                    <div>

                        <label for="operatorPassword">
                            Access Key
                        </label>

                        <input
                            id="operatorPassword"
                            type="password"
                            placeholder="Enter access key"
                            autocomplete="current-password"
                            required
                        >

                    </div>


                    <div
                        id="loginError"
                        class="login-error"
                    >
                        Invalid operator credentials.
                    </div>


                    <button
                        class="login-submit"
                        type="submit"
                    >
                        Authenticate
                    </button>

                </form>


                <div class="login-footer">

                    POLARIS MARINE INTELLIGENCE SYSTEM<br>

                    Secure observation console · Prototype Environment

                </div>

            </section>

        </main>
    `;


    document
        .getElementById("loginForm")
        .addEventListener(
            "submit",
            handleLogin
        );
}


/* =========================================================
   10. LOGIN HANDLER
   ========================================================= */

function handleLogin(event) {

    event.preventDefault();

    const id =
        document
            .getElementById("operatorId")
            .value
            .trim()
            .toUpperCase();

    const password =
        document
            .getElementById("operatorPassword")
            .value;

    const user =
        USERS.find(
            account =>
                account.id === id &&
                account.password === password
        );


    if (!user) {

        document
            .getElementById("loginError")
            .classList
            .add("show");

        return;
    }


    state.loggedIn = true;

    state.user = user;

    state.theme = "light";

    document.body.classList.remove(
        "dark-mode"
    );

    renderConsole();
}


/* =========================================================
   11. CONSOLE
   ========================================================= */

function renderConsole() {

    app.innerHTML = `

        <main class="console">


            <!-- TOPBAR -->

            <header class="console-topbar">

                <div class="console-brand">

                    <h1>POLARIS</h1>

                    <span>
                        Marine Observation Network
                    </span>

                </div>


                <div class="network-status">

                    <span class="status-dot"></span>

                    NETWORK ONLINE

                </div>


                <div class="console-user">

                    <div class="console-user-info">

                        <div class="console-user-name">
                            ${escapeHTML(state.user.name)}
                        </div>

                        <div class="console-user-role">
                            ${escapeHTML(state.user.role)}
                        </div>

                    </div>


                    <button
                        class="theme-toggle"
                        id="themeToggle"
                    >
                        ${state.theme === "light"
                            ? "☾ NIGHT"
                            : "☀ DAY"}
                    </button>


                    <button
                        class="ghost-btn"
                        id="logoutButton"
                    >
                        Logout
                    </button>

                </div>

            </header>


            <!-- BODY -->

            <div class="console-body">


                <!-- SIDEBAR -->

                <aside class="console-sidebar">


                    <div class="sidebar-header">

                        <div class="sidebar-title">

                            <h2>
                                Observation Stations
                            </h2>

                            <span
                                class="sidebar-count"
                                id="stationCount"
                            >
                                ${stations.length}
                            </span>

                        </div>


                        <div class="sidebar-search">

                            <input
                                id="stationSearch"
                                type="text"
                                placeholder="Search station..."
                                autocomplete="off"
                            >

                        </div>

                    </div>


                    <div class="status-filters">

                        <button
                            class="status-filter active"
                            data-filter="all"
                        >
                            All
                        </button>

                        <button
                            class="status-filter"
                            data-filter="active"
                        >
                            Active
                        </button>

                        <button
                            class="status-filter"
                            data-filter="offline"
                        >
                            Offline
                        </button>

                    </div>


                    <div
                        class="station-list"
                        id="stationList"
                    ></div>


                    <div class="upload-block">

                        <h3>
                            Import Observation Data
                        </h3>

                        <p>
                            Upload CSV or JSON observation
                            data for laboratory testing.
                        </p>

                        <input
                            id="dataUpload"
                            type="file"
                            accept=".csv,.json"
                        >

                    </div>

                </aside>


                <!-- DETAIL -->

                <section
                    class="console-detail"
                    id="consoleDetail"
                ></section>


            </div>

        </main>
    `;


    bindConsoleEvents();

    renderStationList();

    renderStationDetail();
}


/* =========================================================
   12. EVENTS
   ========================================================= */

function bindConsoleEvents() {

    document
        .getElementById("logoutButton")
        .addEventListener(
            "click",
            logout
        );


    document
        .getElementById("themeToggle")
        .addEventListener(
            "click",
            toggleTheme
        );


    document
        .getElementById("stationSearch")
        .addEventListener(
            "input",
            event => {

                state.search =
                    event.target.value
                        .toLowerCase()
                        .trim();

                renderStationList();
            }
        );


    document
        .querySelectorAll(".status-filter")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.filter =
                        button.dataset.filter;

                    document
                        .querySelectorAll(
                            ".status-filter"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add("active");

                    renderStationList();
                }
            );
        });


    document
        .getElementById("dataUpload")
        .addEventListener(
            "change",
            handleFileUpload
        );
}


/* =========================================================
   13. LOGOUT
   ========================================================= */

function logout() {

    state.loggedIn = false;

    state.user = null;

    renderLogin();
}


/* =========================================================
   14. THEME
   ========================================================= */

function toggleTheme() {

    state.theme =
        state.theme === "light"
            ? "dark"
            : "light";

    document.body.classList.toggle(
        "dark-mode",
        state.theme === "dark"
    );

    const button =
        document.getElementById(
            "themeToggle"
        );

    if (button) {

        button.textContent =
            state.theme === "light"
                ? "☾ NIGHT"
                : "☀ DAY";
    }
}


/* =========================================================
   15. STATION LIST
   ========================================================= */

function renderStationList() {

    const container =
        document.getElementById(
            "stationList"
        );

    if (!container) return;


    const filtered =
        stations.filter(station => {

            const matchesSearch =

                station.id
                    .toLowerCase()
                    .includes(state.search)

                ||

                station.name
                    .toLowerCase()
                    .includes(state.search)

                ||

                station.region
                    .toLowerCase()
                    .includes(state.search);


            const matchesFilter =

                state.filter === "all"

                ||

                station.status ===
                    state.filter;


            return (
                matchesSearch &&
                matchesFilter
            );
        });


    document
        .getElementById("stationCount")
        .textContent = filtered.length;


    if (!filtered.length) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No stations found
                </h3>

                <p>
                    Try another search or filter.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        filtered
            .map(station => `

                <article
                    class="
                        station-item
                        ${
                            station.id ===
                            state.selectedStation.id
                                ? "active"
                                : ""
                        }
                    "
                    data-station-id="${station.id}"
                >

                    <div class="station-top">

                        <span class="station-id">
                            ${station.id}
                        </span>

                        <span class="station-status">

                            <span
                                class="
                                    status-dot
                                    ${
                                        station.status ===
                                        "offline"
                                            ? "offline"
                                            : ""
                                    }
                                "
                            ></span>

                            ${station.status}

                        </span>

                    </div>


                    <div class="station-name">

                        ${station.name}

                    </div>


                    <div class="station-region">

                        ${station.region}

                    </div>

                </article>

            `)
            .join("");


    container
        .querySelectorAll(".station-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const station =
                        stations.find(
                            itemStation =>
                                itemStation.id ===
                                item.dataset.stationId
                        );

                    if (!station) return;

                    state.selectedStation =
                        station;

                    renderStationList();

                    renderStationDetail();
                }
            );
        });
}


/* =========================================================
   16. STATION DETAIL
   ========================================================= */

function renderStationDetail() {

    const station =
        state.selectedStation;

    const container =
        document.getElementById(
            "consoleDetail"
        );

    if (!container) return;


    const latest =
        station.readings[
            station.readings.length - 1
        ];


    const parameter =
        PARAMETERS[state.parameter];


    const selectedReadings =
        getFilteredReadings(station);


    const values =
        selectedReadings.map(
            reading =>
                reading[state.parameter]
        );


    const min =
        Math.min(...values);

    const max =
        Math.max(...values);

    const current =
        latest[state.parameter];


    container.innerHTML = `


        <!-- HEADER -->

        <section class="detail-header">

            <div class="detail-title">

                <div class="eyebrow">
                    Station ${station.id}
                </div>

                <h1>
                    ${station.name}
                </h1>

                <p>
                    ${station.region}
                    ·
                    ${formatCoordinates(
                        station.latitude,
                        station.longitude
                    )}
                    ·
                    Last transmission:
                    ${formatDateTime(
                        station.lastUpdate
                    )}
                </p>

            </div>


            <div
                class="
                    status-pill
                    ${
                        station.status === "offline"
                            ? "offline"
                            : ""
                    }
                "
            >

                <span
                    class="
                        status-dot
                        ${
                            station.status ===
                            "offline"
                                ? "offline"
                                : ""
                        }
                    "
                ></span>

                ${station.status}

            </div>

        </section>


        <!-- STATUS -->

        <section class="status-strip">

            <div class="status-item">

                <div class="status-item-label">
                    Battery
                </div>

                <div class="status-item-value">
                    ${station.battery}%
                </div>

            </div>


            <div class="status-item">

                <div class="status-item-label">
                    Signal
                </div>

                <div class="status-item-value">
                    ${station.signal}%
                </div>

            </div>


            <div class="status-item">

                <div class="status-item-label">
                    Latitude
                </div>

                <div class="status-item-value">
                    ${station.latitude.toFixed(2)}°
                </div>

            </div>


            <div class="status-item">

                <div class="status-item-label">
                    Longitude
                </div>

                <div class="status-item-value">
                    ${station.longitude.toFixed(2)}°
                </div>

            </div>

        </section>


        <!-- GRAPH -->

        <section class="graph-card">

            <div class="graph-toolbar">

                <div class="graph-heading">

                    <h2>
                        ${parameter.label}
                    </h2>

                    <p>
                        ${parameter.description}
                        ·
                        ${selectedReadings.length}
                        observations
                    </p>

                </div>


                <div class="graph-controls">

                    <select id="parameterSelect">

                        ${Object.entries(PARAMETERS)
                            .map(
                                ([key, value]) => `

                                    <option
                                        value="${key}"
                                        ${
                                            key ===
                                            state.parameter
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${value.label}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>


                    ${["6H","24H","7D","30D"]
                        .map(
                            range => `

                                <button
                                    class="
                                        range-btn
                                        ${
                                            state.timeRange ===
                                            range
                                                ? "active"
                                                : ""
                                        }
                                    "
                                    data-range="${range}"
                                >
                                    ${range}
                                </button>

                            `
                        )
                        .join("")}

                </div>

            </div>


            <div class="graph-wrap">

                <div
                    id="graphTooltip"
                    class="graph-tooltip"
                ></div>

                ${createGraph(
                    selectedReadings,
                    state.parameter,
                    station
                )}

            </div>


            <div class="graph-legend">

                <div class="graph-legend-left">

                    <span class="legend-dot"></span>

                    <span class="graph-legend-text">
                        ${parameter.label}
                        ·
                        ${parameter.unit}
                    </span>

                </div>


                <div class="graph-current">

                    Current:
                    ${formatNumber(
                        current,
                        parameter.decimals
                    )}
                    ${parameter.unit}

                </div>

            </div>


            <div class="graph-help">

                <div class="graph-help-title">
                    How to read this graph
                </div>

                <p>
                    The horizontal axis represents
                    UTC observation time. The vertical
                    axis represents
                    ${parameter.label.toLowerCase()}
                    measured at
                    ${station.id}.
                    Hover over any point to see the
                    exact timestamp and sensor reading.
                    Use 6H, 24H, 7D or 30D to change
                    the observation window.
                </p>

            </div>

        </section>


        <!-- METRICS -->

        <section class="metric-grid">

            ${createMetricCard(
                "Current",
                current,
                parameter.unit,
                parameter.decimals,
                "Latest observation"
            )}

            ${createMetricCard(
                "Minimum",
                min,
                parameter.unit,
                parameter.decimals,
                `${state.timeRange} window`
            )}

            ${createMetricCard(
                "Maximum",
                max,
                parameter.unit,
                parameter.decimals,
                `${state.timeRange} window`
            )}

            ${createMetricCard(
                "Observations",
                selectedReadings.length,
                "",
                0,
                "Timestamped readings"
            )}

        </section>


        <!-- TABLE -->

        <section class="table-card">

            <div class="table-header">

                <h2>
                    Observation Timeline
                </h2>

                <span>
                    ${station.id}
                    ·
                    ${state.timeRange}
                </span>

            </div>


            <div class="table-scroll">

                ${createReadingsTable(
                    selectedReadings,
                    station
                )}

            </div>

        </section>

    `;


    bindDetailEvents();
}


/* =========================================================
   17. METRIC CARD
   ========================================================= */

function createMetricCard(
    label,
    value,
    unit,
    decimals,
    sub
) {

    return `

        <article class="metric-card">

            <div class="metric-label">
                ${label}
            </div>

            <div class="metric-value">

                ${formatNumber(
                    value,
                    decimals
                )}

                ${
                    unit
                        ? `
                            <span class="metric-unit">
                                ${unit}
                            </span>
                          `
                        : ""
                }

            </div>

            <div class="metric-sub">
                ${sub}
            </div>

        </article>
    `;
}


/* =========================================================
   18. GRAPH CREATOR
   ========================================================= */

function createGraph(
    readings,
    parameterKey,
    station
) {

    if (!readings.length) {

        return `
            <div class="empty-state">
                <h3>No observation data</h3>
                <p>
                    There are no readings for this
                    time range.
                </p>
            </div>
        `;
    }


    const parameter =
        PARAMETERS[parameterKey];


    /*
       To keep the SVG readable, downsample
       larger datasets.
    */

    const maxPoints = 120;

    let points = readings;

    if (readings.length > maxPoints) {

        const step =
            readings.length /
            maxPoints;

        points = [];

        for (
            let i = 0;
            i < readings.length;
            i += step
        ) {

            points.push(
                readings[
                    Math.floor(i)
                ]
            );
        }
    }


    const values =
        points.map(
            reading =>
                reading[parameterKey]
        );


    let minValue =
        Math.min(...values);

    let maxValue =
        Math.max(...values);


    if (minValue === maxValue) {

        minValue -= 1;
        maxValue += 1;
    }


    const padding =
        (maxValue - minValue) * 0.15;


    minValue -= padding;
    maxValue += padding;


    const width = 1000;
    const height = 300;

    const left = 65;
    const right = 25;

    const top = 25;
    const bottom = 48;

    const chartWidth =
        width - left - right;

    const chartHeight =
        height - top - bottom;


    const coords =
        points.map(
            (reading, index) => {

                const x =
                    left +
                    (
                        index /
                        Math.max(
                            points.length - 1,
                            1
                        )
                    ) *
                    chartWidth;


                const y =
                    top +
                    (
                        1 -
                        (
                            (
                                reading[
                                    parameterKey
                                ] -
                                minValue
                            ) /
                            (
                                maxValue -
                                minValue
                            )
                        )
                    ) *
                    chartHeight;


                return {
                    x,
                    y,
                    reading
                };
            }
        );


    const linePath =
        coords
            .map(
                (point,index) =>
                    `${
                        index === 0
                            ? "M"
                            : "L"
                    } ${point.x.toFixed(2)}
                      ${point.y.toFixed(2)}`
            )
            .join(" ");


    const areaPath =

        `M ${coords[0].x}
           ${height - bottom}

         ${coords
             .map(
                 point =>
                     `L ${point.x}
                         ${point.y}`
             )
             .join(" ")}

         L ${coords[
             coords.length - 1
         ].x}
           ${height - bottom}

         Z`;


    /*
       Grid lines
    */

    let grid = "";

    const gridCount = 5;

    for (
        let i = 0;
        i <= gridCount;
        i++
    ) {

        const y =
            top +
            (
                i /
                gridCount
            ) *
            chartHeight;


        const value =
            maxValue -
            (
                i /
                gridCount
            ) *
            (
                maxValue -
                minValue
            );


        grid += `

            <line
                class="graph-grid"
                x1="${left}"
                y1="${y}"
                x2="${width - right}"
                y2="${y}"
            />

            <text
                class="graph-axis-text"
                x="${left - 10}"
                y="${y + 3}"
                text-anchor="end"
            >
                ${formatNumber(
                    value,
                    parameter.decimals
                )}
            </text>
        `;
    }


    /*
       X axis labels
    */

    const labelIndexes = [
        0,
        Math.floor(
            points.length * 0.25
        ),
        Math.floor(
            points.length * 0.50
        ),
        Math.floor(
            points.length * 0.75
        ),
        points.length - 1
    ];


    let xLabels = "";

    [
        ...new Set(labelIndexes)
    ].forEach(index => {

        const point =
            coords[index];

        xLabels += `

            <text
                class="graph-axis-text"
                x="${point.x}"
                y="${height - 15}"
                text-anchor="middle"
            >
                ${formatShortTime(
                    point.reading.timestamp
                )}
            </text>
        `;
    });


    /*
       Invisible hover areas
       with data attributes.
    */

    const hoverPoints =
        coords
            .map(
                (point,index) => `

                    <circle
                        class="graph-hover-point"
                        cx="${point.x}"
                        cy="${point.y}"
                        r="10"
                        fill="transparent"
                        data-index="${index}"
                        data-reading-index="${
                            readings.indexOf(
                                point.reading
                            )
                        }"
                    />
                `
            )
            .join("");


    /*
       Visible points
    */

    const visiblePoints =
        coords
            .filter(
                (_,index) => {

                    if (
                        points.length <= 60
                    ) {
                        return true;
                    }

                    return (
                        index ===
                            points.length - 1
                        ||
                        index % 8 === 0
                    );
                }
            )
            .map(
                point => `

                    <circle
                        class="graph-point"
                        cx="${point.x}"
                        cy="${point.y}"
                        r="2.8"
                    />

                `
            )
            .join("");


    return `

        <svg
            viewBox="
                0 0
                ${width}
                ${height}
            "
            preserveAspectRatio="none"
            data-station="${station.id}"
        >

            ${grid}


            <path
                class="graph-area"
                d="${areaPath}"
            />


            <path
                class="graph-line"
                d="${linePath}"
            />


            ${visiblePoints}

            ${hoverPoints}

            ${xLabels}


            <text
                class="graph-axis-text"
                x="15"
                y="${height / 2}"
                transform="
                    rotate(
                        -90
                        15
                        ${height / 2}
                    )
                "
                text-anchor="middle"
            >
                ${parameter.unit}
            </text>

        </svg>
    `;
}


/* =========================================================
   19. DETAIL EVENTS
   ========================================================= */

function bindDetailEvents() {

    const parameterSelect =
        document.getElementById(
            "parameterSelect"
        );


    if (parameterSelect) {

        parameterSelect.addEventListener(
            "change",
            event => {

                state.parameter =
                    event.target.value;

                renderStationDetail();
            }
        );
    }


    document
        .querySelectorAll(".range-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.timeRange =
                        button.dataset.range;

                    renderStationDetail();
                }
            );
        });


    setupGraphHover();
}


/* =========================================================
   20. GRAPH HOVER
   ========================================================= */

function setupGraphHover() {

    const svg =
        document.querySelector(
            ".graph-wrap svg"
        );

    const tooltip =
        document.getElementById(
            "graphTooltip"
        );


    if (!svg || !tooltip) return;


    const station =
        state.selectedStation;

    const readings =
        getFilteredReadings(
            station
        );


    const hoverPoints =
        svg.querySelectorAll(
            ".graph-hover-point"
        );


    hoverPoints.forEach(point => {

        point.addEventListener(
            "mouseenter",
            () => {

                const readingIndex =
                    Number(
                        point.dataset
                            .readingIndex
                    );


                const reading =
                    readings[
                        readingIndex
                    ];


                if (!reading) return;


                const parameter =
                    PARAMETERS[
                        state.parameter
                    ];


                tooltip.innerHTML = `

                    <div class="tooltip-station">

                        ${station.id}

                    </div>


                    <div class="tooltip-time">

                        ${formatDateTime(
                            reading.timestamp
                        )}

                    </div>


                    <div class="tooltip-value">

                        ${formatNumber(
                            reading[
                                state.parameter
                            ],
                            parameter.decimals
                        )}

                        ${parameter.unit}

                    </div>
                `;


                tooltip.classList.add(
                    "show"
                );
            }
        );


        point.addEventListener(
            "mousemove",
            event => {

                const rect =
                    svg.getBoundingClientRect();

                const wrap =
                    svg.parentElement
                        .getBoundingClientRect();


                let left =
                    event.clientX -
                    wrap.left +
                    12;


                let top =
                    event.clientY -
                    wrap.top -
                    85;


                if (
                    left + 200 >
                    wrap.width
                ) {

                    left -= 220;
                }


                if (top < 10) {
                    top = 10;
                }


                tooltip.style.left =
                    `${left}px`;

                tooltip.style.top =
                    `${top}px`;
            }
        );


        point.addEventListener(
            "mouseleave",
            () => {

                tooltip.classList.remove(
                    "show"
                );
            }
        );
    });
}


/* =========================================================
   21. READINGS TABLE
   ========================================================= */

function createReadingsTable(
    readings,
    station
) {

    const rows =
        [...readings]
            .reverse()
            .slice(0, 50);


    if (!rows.length) {

        return `
            <div class="empty-state">
                <h3>No observations</h3>
                <p>
                    No data available for this
                    station and time range.
                </p>
            </div>
        `;
    }


    return `

        <table class="readings-table">

            <thead>

                <tr>

                    <th>
                        Timestamp
                    </th>

                    <th>
                        Station
                    </th>

                    <th>
                        Water Temp
                    </th>

                    <th>
                        Air Temp
                    </th>

                    <th>
                        Pressure
                    </th>

                    <th>
                        Humidity
                    </th>

                    <th>
                        Wind
                    </th>

                    <th>
                        Sea Level
                    </th>

                </tr>

            </thead>


            <tbody>

                ${rows
                    .map(
                        (reading,index) => `

                            <tr
                                class="
                                    ${
                                        index === 0
                                            ? "current-reading"
                                            : ""
                                    }
                                "
                            >

                                <td>
                                    ${formatDateTime(
                                        reading.timestamp
                                    )}
                                </td>

                                <td>
                                    ${station.id}
                                </td>

                                <td>
                                    ${formatNumber(
                                        reading.waterTemperature,
                                        2
                                    )}
                                    °C
                                </td>

                                <td>
                                    ${formatNumber(
                                        reading.airTemperature,
                                        2
                                    )}
                                    °C
                                </td>

                                <td>
                                    ${formatNumber(
                                        reading.pressure,
                                        1
                                    )}
                                    hPa
                                </td>

                                <td>
                                    ${formatNumber(
                                        reading.humidity,
                                        1
                                    )}
                                    %
                                </td>

                                <td>
                                    ${formatNumber(
                                        reading.windSpeed,
                                        1
                                    )}
                                    m/s
                                </td>

                                <td>
                                    ${formatNumber(
                                        reading.seaLevel,
                                        2
                                    )}
                                    m
                                </td>

                            </tr>

                        `
                    )
                    .join("")}

            </tbody>

        </table>
    `;
}


/* =========================================================
   22. FILE IMPORT
   ========================================================= */

function handleFileUpload(event) {

    const file =
        event.target.files[0];

    if (!file) return;


    const reader =
        new FileReader();


    reader.onload = function () {

        try {

            const content =
                reader.result;


            if (
                file.name
                    .toLowerCase()
                    .endsWith(".json")
            ) {

                const data =
                    JSON.parse(content);

                processImportedData(data);

            } else {

                const data =
                    parseCSV(content);

                processImportedData(data);
            }

        } catch (error) {

            showToast(
                "Unable to read the observation file."
            );
        }
    };


    reader.readAsText(file);
}


/* =========================================================
   23. CSV PARSER
   ========================================================= */

function parseCSV(text) {

    const lines =
        text
            .trim()
            .split(/\r?\n/);


    if (lines.length < 2) {
        return [];
    }


    const headers =
        lines[0]
            .split(",")
            .map(
                header =>
                    header
                        .trim()
                        .replace(/^"|"$/g,"")
            );


    return lines
        .slice(1)
        .map(line => {

            const values =
                line
                    .split(",")
                    .map(
                        value =>
                            value
                                .trim()
                                .replace(
                                    /^"|"$/g,
                                    ""
                                )
                    );


            const row = {};

            headers.forEach(
                (header,index) => {

                    row[header] =
                        values[index];
                }
            );

            return row;
        });
}


/* =========================================================
   24. IMPORT DATA
   ========================================================= */

function processImportedData(data) {

    let count = 0;


    if (Array.isArray(data)) {

        count = data.length;

    } else if (
        data &&
        Array.isArray(data.readings)
    ) {

        count =
            data.readings.length;
    }


    showToast(
        `Imported ${count} observation records for laboratory testing.`
    );
}


/* =========================================================
   25. TOAST
   ========================================================= */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".toast"
        );

    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className = "toast";

    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        3500
    );
}


/* =========================================================
   26. START APPLICATION
   ========================================================= */

renderLogin();
