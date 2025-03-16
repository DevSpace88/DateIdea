// Basis-URL für API-Anfragen (ändere diese für die Produktion)
const API_BASE_URL = '/api';

// Daten für die Date-Ideen
const dateData = {
    activities: [
        // Klassische Aktivitäten
        { name: "Picknick machen", weight: 10, emoji: "🧺", categories: ["park", "garden"] },
        { name: "spazieren gehen", weight: 10, emoji: "🚶", categories: ["park", "garden", "nature"] },
        { name: "fotografieren", weight: 6, emoji: "📸", categories: ["landmark", "park", "museum"] },
        { name: "Filme schauen", weight: 8, emoji: "🍿", categories: ["cinema", "entertainment"] },
        { name: "kochen", weight: 9, emoji: "👨‍🍳", categories: ["home", "cooking_school"] },
        { name: "Brettspiele spielen", weight: 8, emoji: "🎲", categories: ["cafe", "bar", "game_cafe"] },
        { name: "Sterne beobachten", weight: 5, emoji: "✨", categories: ["park", "nature", "viewpoint"] },
        { name: "Kunst betrachten", weight: 5, emoji: "🎨", categories: ["museum", "gallery", "art"] },
        { name: "Radfahren", weight: 6, emoji: "🚲", categories: ["park", "nature", "cycling"] },
        { name: "tanzen", weight: 4, emoji: "💃", categories: ["bar", "club", "dance"] },
        { name: "in Büchern stöbern", weight: 5, emoji: "📖", categories: ["library", "bookstore"] },
        { name: "Karaoke singen", weight: 3, emoji: "🎵", categories: ["karaoke", "bar"] },
        { name: "Kaffee trinken", weight: 9, emoji: "☕", categories: ["cafe", "bakery"] },
        { name: "essen gehen", weight: 10, emoji: "🍽️", categories: ["restaurant", "food"] },
        { name: "einen Wein genießen", weight: 7, emoji: "🍷", categories: ["wine_bar", "restaurant"] },
        { name: "Cocktails probieren", weight: 6, emoji: "🍹", categories: ["bar", "restaurant"] },
        { name: "ein Konzert besuchen", weight: 5, emoji: "🎵", categories: ["music_venue", "bar"] },
        { name: "eine Ausstellung besuchen", weight: 6, emoji: "🖼️", categories: ["museum", "gallery", "exhibition"] },
        { name: "Minigolf spielen", weight: 6, emoji: "⛳", categories: ["minigolf", "entertainment"] },
        { name: "Bowling spielen", weight: 6, emoji: "🎳", categories: ["bowling", "entertainment"] },
        { name: "Eis essen", weight: 8, emoji: "🍦", categories: ["ice_cream", "cafe"] },
        { name: "einen Kurs besuchen", weight: 4, emoji: "📝", categories: ["education", "cooking_school", "dance"] },
        { name: "shoppen gehen", weight: 7, emoji: "🛍️", categories: ["shopping_mall", "shop", "market"] },
        { name: "ein Theaterstück anschauen", weight: 5, emoji: "🎭", categories: ["theater", "entertainment"] },
        { name: "eine Auszeit in der Sauna", weight: 3, emoji: "🧖", categories: ["spa", "wellness"] },
        { name: "eine Massage genießen", weight: 3, emoji: "💆", categories: ["spa", "wellness"] },
        { name: "Kajak fahren", weight: 4, emoji: "🛶", categories: ["water", "boat_rental"] },
        { name: "eine Bootstour machen", weight: 5, emoji: "⛵", categories: ["water", "boat_rental"] },
        { name: "einen Stadtbummel machen", weight: 7, emoji: "🏙️", categories: ["landmark", "old_town"] },
        { name: "Frühstücken", weight: 8, emoji: "🥐", categories: ["cafe", "restaurant", "bakery"] }
    ],
    twists: [
        // Klassische und witzige Twists
        { name: "bei Sonnenuntergang", weight: 7, emoji: "🌅" },
        { name: "bei Kerzenschein", weight: 6, emoji: "🕯️" },
        { name: "mit Überraschungsmenü", weight: 5, emoji: "🎁" },
        { name: "mit Blindverkostung", weight: 4, emoji: "👁️" },
        { name: "unter dem Sternenhimmel", weight: 6, emoji: "🌟" },
        { name: "im Vintage-Stil", weight: 4, emoji: "👒" },
        { name: "ohne zu reden für 30 Minuten", weight: 3, emoji: "🤐" },
        { name: "mit verbundenen Augen", weight: 3, emoji: "🙈" },
        { name: "in elegantem Outfit", weight: 5, emoji: "👔" },
        { name: "mit selbstgemachten Geschenken", weight: 4, emoji: "🎁" },
        { name: "mit eurer Lieblingsmusik", weight: 5, emoji: "🎵" },
        { name: "spontan ohne Planung", weight: 8, emoji: "⚡" },
        { name: "mit Fotochallenge", weight: 5, emoji: "📸" },
        { name: "", weight: 15, emoji: "" }, // Chance auf keine Besonderheit
        { name: "als Überraschung für den anderen", weight: 5, emoji: "🎉" },
        { name: "in 90er-Jahre-Outfits", weight: 3, emoji: "👕" },
        { name: "mit Punktesystem für lustige Aufgaben", weight: 3, emoji: "🎯" },
        { name: "im Partnerlook", weight: 2, emoji: "👫" },
        { name: "mit einem Zeitlimit von 2 Stunden", weight: 3, emoji: "⏱️" },
        { name: "mit Rollentausch", weight: 3, emoji: "🔄" },
        { name: "mit historischen Fakten-Quiz", weight: 2, emoji: "📜" },
        { name: "mit Regen-Backup-Plan", weight: 4, emoji: "☔" },
        { name: "mit falschen Akzenten", weight: 2, emoji: "🗣️" },
        { name: "und dabei 3 neue Dinge lernen", weight: 3, emoji: "🧠" },
        { name: "ohne Technologie", weight: 4, emoji: "📵" },
        { name: "früh am Morgen", weight: 3, emoji: "🌄" },
        { name: "mit einem Budget-Challenge", weight: 4, emoji: "💰" },
        { name: "nach dem Motto 'wie beim ersten Date'", weight: 3, emoji: "💘" },
        { name: "mit einem lustigen Hut", weight: 2, emoji: "🎩" }
    ],
    // Fallback-Locations, falls API keine Ergebnisse liefert
    fallbackLocations: [
        { name: "im Park", weight: 10, emoji: "🌳", category: "park" },
        { name: "im Café", weight: 10, emoji: "☕", category: "cafe" },
        { name: "im Restaurant", weight: 10, emoji: "🍽️", category: "restaurant" },
        { name: "im Kino", weight: 8, emoji: "🎬", category: "cinema" },
        { name: "im Museum", weight: 6, emoji: "🏛️", category: "museum" },
        { name: "zu Hause", weight: 10, emoji: "🏠", category: "home" },
        { name: "in der Bibliothek", weight: 4, emoji: "📚", category: "library" },
        { name: "am Fluss", weight: 5, emoji: "🌊", category: "water" },
        { name: "in der Altstadt", weight: 7, emoji: "🏰", category: "old_town" },
        { name: "im Einkaufszentrum", weight: 6, emoji: "🛒", category: "shopping_mall" }
    ]
};

// Speicher für geladene Orte
let cityLocations = {};
let loadedCity = "";
let loadingCity = false;

// Element-Referenzen
const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const resultContainer = document.getElementById('result-container');
const dateIdeaElement = document.getElementById('date-idea');
const dateEmojiElement = document.getElementById('date-emoji');
const locationContainer = document.getElementById('location-container');
const cityInput = document.getElementById('city-input');
const apiStatus = document.getElementById('api-status');
const cityForm = document.getElementById('city-form');

// Farben für das Rad
const colors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#6B5B95', '#88D8B0',
    '#F6AE2D', '#86BBD8', '#F26419', '#5DD39E', '#F4A259',
    '#F25F5C', '#247BA0', '#70C1B3', '#B2DBBF', '#FF1654'
];

// Erstelle die Abschnitte des Rads
const sections = 15;
const anglePerSection = 360 / sections;

for (let i = 0; i < sections; i++) {
    const section = document.createElement('div');
    section.classList.add('wheel-section');
    section.style.backgroundColor = colors[i % colors.length];
    section.style.transform = `rotate(${i * anglePerSection}deg)`;
    wheel.appendChild(section);
}

// Funktion zum Laden der Orte über die Backend-API
async function loadLocations(city) {
    if (!city) {
        apiStatus.textContent = "Bitte gib eine Stadt ein";
        return false;
    }

    // Prüfe, ob wir bereits Daten für diese Stadt haben
    if (city === loadedCity && Object.keys(cityLocations).length > 0) {
        apiStatus.textContent = `Orte in ${city} bereits geladen`;
        return true;
    }

    // Verhindere parallele Anfragen für dieselbe Stadt
    if (loadingCity) {
        apiStatus.textContent = "Orte werden bereits geladen...";
        return false;
    }

    loadingCity = true;
    apiStatus.innerHTML = `Lade Orte in ${city}... <div class="loading"></div>`;

    // Kategorien, die wir laden wollen
    const categoriesToLoad = [
        "restaurant", "cafe", "park", "museum", "bar", "cinema",
        "theater", "gallery", "library", "shopping_mall", "bakery"
    ];

    try {
        // Für jede Kategorie die API aufrufen
        let totalLocationsLoaded = 0;
        cityLocations = {}; // Zurücksetzen

        const loadPromises = categoriesToLoad.map(async (category) => {
            try {
                const response = await fetch(`${API_BASE_URL}/locations?city=${encodeURIComponent(city)}&category=${category}`);
                const data = await response.json();

                if (data && data.length > 0) {
                    if (!cityLocations[category]) {
                        cityLocations[category] = [];
                    }

                    // Füge die API-Ergebnisse hinzu
                    for (const location of data) {
                        cityLocations[category].push({
                            name: `bei ${location.name}`,
                            weight: 5,
                            emoji: getCategoryEmoji(category),
                            category: category,
                            details: location
                        });
                    }

                    totalLocationsLoaded += data.length;
                }
            } catch (error) {
                console.error(`Fehler beim Laden der Kategorie ${category}:`, error);
                // Bei Fehler weitermachen mit anderen Kategorien
            }
        });

        // Paralleles Laden aller Kategorien für schnelleres Ergebnis
        await Promise.all(loadPromises);

        if (totalLocationsLoaded === 0) {
            // Wenn keine echten Orte gefunden wurden, verwende Fallback
            generateFallbackLocations(city);
            apiStatus.textContent = `Keine realen Orte in ${city} gefunden, verwende simulierte Daten`;
        } else {
            loadedCity = city;
            apiStatus.textContent = `${totalLocationsLoaded} Orte in ${city} geladen`;
        }

        loadingCity = false;
        return true;
    } catch (error) {
        console.error('Fehler beim Laden der Orte:', error);
        apiStatus.textContent = `Fehler beim Laden: ${error.message}. Verwende Fallback-Daten.`;

        // Bei Fehler Fallback-Orte generieren
        generateFallbackLocations(city);
        loadingCity = false;
        return true;
    }
}

// Fallback-Orte generieren
function generateFallbackLocations(city) {
    // Für jede mögliche Kategorie einige Fallback-Orte generieren
    const categoriesToGenerate = [
        "restaurant", "cafe", "park", "museum", "bar", "cinema",
        "library", "shopping_mall", "bakery"
    ];

    // Seed für zufällige, aber konsistente Generierung
    const citySeed = stringToSeed(city);

    for (const category of categoriesToGenerate) {
        if (!cityLocations[category]) {
            cityLocations[category] = [];
        }

        // 3-6 Orte pro Kategorie generieren
        const numLocations = Math.floor(pseudoRandom(citySeed + category) * 4) + 3;

        for (let i = 0; i < numLocations; i++) {
            const nameSeed = citySeed + category + i;
            const name = generatePlaceName(category, nameSeed, city);
            const address = generateAddress(nameSeed, city);
            const rating = (3 + pseudoRandom(nameSeed) * 2).toFixed(1);

            cityLocations[category].push({
                name: `bei ${name}`,
                weight: 5,
                emoji: getCategoryEmoji(category),
                category: category,
                details: {
                    name: name,
                    address: address,
                    rating: rating,
                    isFallback: true
                }
            });
        }
    }

    loadedCity = city;
}

// Hilfsfunktionen für Fallback-Daten
function stringToSeed(str) {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
        seed = ((seed << 5) - seed) + str.charCodeAt(i);
        seed = seed & seed; // Konvertiere zu 32bit Integer
    }
    return seed;
}

function pseudoRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generatePlaceName(category, seed, city) {
    const prefixes = {
        "restaurant": ["Ristorante ", "Trattoria ", "Restaurant ", "Bistro ", "Gasthaus ", "Brasserie ", "", ""],
        "cafe": ["Café ", "Kaffeehaus ", "Coffee & ", "", ""],
        "park": ["", "Stadtpark ", "Park ", "Garten ", ""],
        "museum": ["Museum für ", "Stadtmuseum ", "Kunstmuseum ", "Museum ", ""],
        "bar": ["Bar ", "Taverne ", "Lounge ", "", ""],
        "cinema": ["Kino ", "Filmpalast ", "Lichtspiel ", "Cinema ", ""],
        "library": ["Stadtbibliothek ", "Bücherei ", "Leseraum ", ""],
        "shopping_mall": ["Einkaufszentrum ", "Mall ", "Galerie ", "Passage ", "Center "],
        "bakery": ["Bäckerei ", "Konditorei ", "Backhaus ", "", ""]
    };

    const names = {
        "restaurant": ["Roma", "Milano", "Bella Italia", "Zur Eiche", "Goldener Löwe", "Zum Hirschen", "La Perla", "Piccola", "Sonne", "Krone"],
        "cafe": ["Bohne", "Auszeit", "Genuss", "Pause", "Treff", "Klatsch", "Central", "Serenity"],
        "park": ["Stadtpark", "Rosengarten", "Schlossgarten", "Bürgerpark", "Volkspark", "Botanischer Garten"],
        "museum": ["Kunst", "Geschichte", "Moderne", "Altertum", "Natur", "Technik", "Zeitgenössische Kunst"],
        "bar": ["Blue", "Red", "Mondschein", "Skyline", "Underground", "Luft", "Hafenbar"],
        "cinema": ["Metropolis", "Capitol", "Royal", "Gloria", "Eden", "Olympia", "Central"],
        "library": ["Stadt", "Zentral", "Historische", "Moderne", "Universitäts"],
        "shopping_mall": ["City", "Plaza", "Avenue", "Palast", "Galerie", "Arkaden"],
        "bakery": ["Hofbäckerei", "Stadtbäcker", "Meisterbäckerei", "Traditions", "Handwerks"]
    };

    // Standardnamen für fehlende Kategorien
    const defaultNames = ["Central", "City", "Stadtperle", "Am Markt", "Zentrum"];

    const prefix = prefixes[category] ? prefixes[category][Math.floor(pseudoRandom(seed) * prefixes[category].length)] : "";

    let name;
    if (names[category]) {
        name = names[category][Math.floor(pseudoRandom(seed + 2) * names[category].length)];
    } else {
        name = defaultNames[Math.floor(pseudoRandom(seed + 2) * defaultNames.length)];
    }

    // Manchmal den Stadtnamen einbauen
    if (pseudoRandom(seed + 3) < 0.3) {
        name = city + "er " + name;
    }

    return prefix + name;
}

function generateAddress(seed, city) {
    const streets = ["Hauptstraße", "Bahnhofstraße", "Kirchstraße", "Schulstraße", "Gartenstraße",
        "Bergstraße", "Waldstraße", "Dorfstraße", "Lindenstraße", "Schillerstraße",
        "Goethestraße", "Mozartstraße", "Beethovenstraße", "Rathausplatz", "Marktplatz"];

    const street = streets[Math.floor(pseudoRandom(seed) * streets.length)];
    const number = Math.floor(pseudoRandom(seed + 1) * 120) + 1;

    return `${street} ${number}, ${city}`;
}

// Funktion zum Abrufen des passenden Emojis für eine Kategorie
function getCategoryEmoji(category) {
    const emojiMap = {
        "restaurant": "🍽️",
        "cafe": "☕",
        "bar": "🍸",
        "pub": "🍺",
        "food": "🍴",
        "fast_food": "🍔",
        "park": "🌳",
        "cinema": "🎬",
        "theater": "🎭",
        "museum": "🏛️",
        "gallery": "🖼️",
        "night_club": "🪩",
        "art": "🎨",
        "bakery": "🥐",
        "shopping_mall": "🛍️",
        "library": "📚",
        "zoo": "🦁",
        "amusement_park": "🎡",
        "aquarium": "🐠",
        "spa": "💆",
        "gym": "🏋️",
        "bowling": "🎳",
        "garden": "🌷",
        "nature": "🌿",
        "beach": "🏖️",
        "landmark": "🗿",
        "bookstore": "📖",
        "ice_cream": "🍦",
        "wine_bar": "🍷",
        "viewpoint": "🌄",
        "water": "💦",
        "old_town": "🏰"
    };

    return emojiMap[category] || "📍";
}

// Funktion zum Wählen eines zufälligen Elements basierend auf Gewichtung
function getWeightedRandom(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
        random -= items[i].weight;
        if (random < 0) {
            return items[i];
        }
    }
    return items[0]; // Fallback
}

// Finde passende Locations für eine Aktivität
function findMatchingLocations(activity) {
    // Wenn keine Locations geladen sind, verwende Fallback
    if (Object.keys(cityLocations).length === 0) {
        return dateData.fallbackLocations;
    }

    // Finde alle Kategorien, die zu dieser Aktivität passen
    const matchingCategories = activity.categories || [];

    // Sammle alle passenden Locations
    let matchingLocations = [];

    for (const category of matchingCategories) {
        if (cityLocations[category]) {
            matchingLocations = matchingLocations.concat(cityLocations[category]);
        }
    }

    // Wenn keine passenden Locations gefunden wurden, verwende Fallback
    if (matchingLocations.length === 0) {
        return dateData.fallbackLocations;
    }

    return matchingLocations;
}

// Generiere eine neue Date-Idee
function generateDateIdea() {
    const city = cityInput.value.trim() || "Berlin";
    const activityItem = getWeightedRandom(dateData.activities);
    const locationItem = getWeightedRandom(findMatchingLocations(activityItem));
    const twistItem = getWeightedRandom(dateData.twists);

    // Emoji-Kombination
    let emojis = activityItem.emoji + " " + locationItem.emoji;
    if (twistItem.emoji) {
        emojis += " " + twistItem.emoji;
    }

    // Passe die Date-Idee zusammen
    const dateIdea = `${activityItem.name} ${locationItem.name}${twistItem.name ? ' ' + twistItem.name : ''}`;

    return {
        idea: dateIdea,
        emojis: emojis,
        locationDetails: locationItem.details || null,
        city: city
    };
}

// Zeige die Date-Idee an
function showDateIdea(result) {
    dateIdeaElement.textContent = result.idea;
    dateEmojiElement.textContent = result.emojis;

    // Location Details anzeigen, wenn vorhanden
    locationContainer.innerHTML = '';

    if (result.locationDetails) {
        const loc = result.locationDetails;

        // Badge für Fallback-Locations
        let fallbackBadge = '';
        if (loc.isFallback) {
            fallbackBadge = '<span class="fallback-badge">Simulierter Ort</span>';
        }

        // Map-Link - für echte Locations direkt zu OSM, für Fallback-Locations Suche
        let mapLink = '';
        if (loc.latitude && loc.longitude) {
            mapLink = `<a href="https://www.openstreetmap.org/?mlat=${loc.latitude}&mlon=${loc.longitude}&zoom=18" target="_blank" class="map-link">Auf OpenStreetMap anzeigen</a>`;
        } else {
            // Verwende die aktuelle Stadt aus dem Formular
            const city = result.city || cityInput.value.trim() || "Berlin";
            mapLink = `<a href="https://www.openstreetmap.org/search?query=${encodeURIComponent(loc.name + ' ' + city)}" target="_blank" class="map-link">Auf OpenStreetMap suchen</a>`;
        }

        const locationHTML = `
            <div class="location-details">
                <div class="location-name">${loc.name} ${fallbackBadge}</div>
                <div class="location-address">${loc.address}</div>
                <div>Bewertung: ${'★'.repeat(Math.round(loc.rating))}${'☆'.repeat(5-Math.round(loc.rating))} (${loc.rating})</div>
                ${mapLink}
            </div>
        `;
        locationContainer.innerHTML = locationHTML;
    }

    resultContainer.classList.add('show');
}

// Event-Listener für Stadtänderung (Submit des Formulars)
cityForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Verhindere Seiten-Reload
    const city = cityInput.value.trim();

    // Lade Orte wenn Stadt geändert wurde
    if (city !== loadedCity) {
        // Bestehende Locations zurücksetzen
        cityLocations = {};
        loadedCity = "";

        try {
            await loadLocations(city);
        } catch (error) {
            console.error('Fehler beim Laden der Stadt:', error);
            // Fallback verwenden
            generateFallbackLocations(city);
        }
    }
});

// Event-Listener für Änderungen im Eingabefeld
cityInput.addEventListener('change', async () => {
    const city = cityInput.value.trim();

    // Lade Orte wenn Stadt geändert wurde
    if (city !== loadedCity) {
        // Bestehende Locations zurücksetzen
        cityLocations = {};
        loadedCity = "";

        try {
            await loadLocations(city);
        } catch (error) {
            console.error('Fehler beim Laden der Stadt:', error);
            // Fallback verwenden
            generateFallbackLocations(city);
        }
    }
});

// Drehe das Rad
let spinning = false;
spinButton.addEventListener('click', async () => {
    if (spinning) return;

    // Stadt aktualisieren falls nötig
    const city = cityInput.value.trim();

    // Wenn eine neue Stadt eingegeben wurde oder keine Orte geladen sind,
    // lade die Orte für die aktuelle Stadt
    if (city !== loadedCity || Object.keys(cityLocations).length === 0) {
        // Bestehende Locations zurücksetzen
        cityLocations = {};

        try {
            await loadLocations(city);
        } catch (error) {
            console.error('Fehler beim Laden der Stadt:', error);
            // Fallback verwenden
            generateFallbackLocations(city);
        }
    }

    spinning = true;
    spinButton.disabled = true;
    resultContainer.classList.remove('show');

    // Zufällige Anzahl an Umdrehungen + zusätzlicher Winkel
    const rotations = 5 + Math.random() * 3; // 5-8 Umdrehungen
    const extraAngle = Math.random() * 360;
    const totalRotation = rotations * 360 + extraAngle;

    wheel.style.transform = `rotate(${totalRotation}deg)`;

    // Generiere die Date-Idee
    const result = generateDateIdea();

    // Zeige das Ergebnis nach der Animation
    setTimeout(() => {
        showDateIdea(result);
        spinning = false;
        spinButton.disabled = false;
    }, 5000);
});

// Initial Orte für die Standardstadt laden
window.addEventListener('DOMContentLoaded', async () => {
    const city = cityInput.value.trim() || "Berlin";
    try {
        await loadLocations(city);
    } catch (error) {
        console.error('Fehler beim initialen Laden:', error);
        // Fallback verwenden
        generateFallbackLocations(city);
    }
});