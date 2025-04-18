const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
// Rate Limiter Imports
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiter: Begrenzt Anfragen auf 100 pro Stunde pro IP
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Stunde
    max: 100, // Limit auf 100 Anfragen pro Fenster
    standardHeaders: true, // "RateLimit-*" Header in Antworten senden
    legacyHeaders: false, // "X-RateLimit-*" Header deaktivieren
    message: {
        error: 'Zu viele Anfragen. Bitte versuche es später erneut.'
    },
    skip: (req) => {
        // Überspringe für lokale Entwicklung
        return req.ip === '127.0.0.1' || req.ip === '::1';
    }
});

// Speed Limiter: Verlangsamt Anfragen nach einem bestimmten Punkt
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    delayAfter: 30, // Verlangsame nach 30 Anfragen
    delayMs: (hits) => hits * 100, // 100ms * Anzahl der Anfragen über dem Limit
    skip: (req) => {
        // Gleiche Ausnahmen wie oben
        return req.ip === '127.0.0.1' || req.ip === '::1';
    }
});

// Nur auf API-Routen anwenden
app.use('/api/', apiLimiter);
app.use('/api/', speedLimiter);

// Tägliches API-Anfragenlimit
const DAILY_API_LIMIT = 1000; // Maximale Anzahl an Overpass-API-Anfragen pro Tag
let dailyApiCounter = 0;
let lastCounterReset = Date.now();

// Counter für API-Anfragen zurücksetzen
function resetApiCounter() {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (now - lastCounterReset >= oneDayMs) {
        dailyApiCounter = 0;
        lastCounterReset = now;
        console.log('Daily API counter reset');
    }
}

// Prüfen, ob wir API-Anfragen machen dürfen
function canMakeApiRequest() {
    resetApiCounter();
    return dailyApiCounter < DAILY_API_LIMIT;
}

// API-Anfrage zählen
function trackApiRequest() {
    dailyApiCounter++;
    console.log(`API request count: ${dailyApiCounter}/${DAILY_API_LIMIT}`);
}

// Cache für API-Anfragen (24 Stunden gültig)
const locationCache = {};
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 Stunden in Millisekunden
const CACHE_CLEANUP_INTERVAL = 60 * 60 * 1000; // Stündlich aufräumen

// Cache-Cleanup-Funktion, um Speicherlecks zu verhindern
function setupCacheCleanup() {
    setInterval(() => {
        const now = Date.now();
        const expiredKeys = [];

        // Finde abgelaufene Cache-Einträge
        for (const key in locationCache) {
            if (locationCache[key].expiry <= now) {
                expiredKeys.push(key);
            }
        }

        // Entferne abgelaufene Einträge
        expiredKeys.forEach(key => {
            delete locationCache[key];
        });

        if (expiredKeys.length > 0) {
            console.log(`Cache cleanup: Removed ${expiredKeys.length} expired entries`);
        }
    }, CACHE_CLEANUP_INTERVAL);
}

// Cache-Funktionen
function getCachedData(key) {
    const cacheEntry = locationCache[key];
    if (cacheEntry && cacheEntry.expiry > Date.now()) {
        return cacheEntry.data;
    }
    return null;
}

function setCachedData(key, data) {
    locationCache[key] = {
        data,
        expiry: Date.now() + CACHE_EXPIRATION
    };
}

// Starte das Cache-Cleanup beim Serverstart
setupCacheCleanup();

// Statische Dateien erst nach den Limitern laden
app.use(express.static(path.join(__dirname, 'public')));

// API zur Suche nach Orten über OpenStreetMap
app.get('/api/locations', async (req, res) => {
    try {
        const { city, category } = req.query;

        if (!city || !category) {
            return res.status(400).json({ error: 'Stadt und Kategorie müssen angegeben werden' });
        }

        // Cache-Key erstellen
        const cacheKey = `${city.toLowerCase()}-${category}`;

        // Prüfe, ob Ergebnis im Cache vorhanden
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            console.log(`Using cached data for ${cacheKey}`);
            return res.json(cachedData);
        }

        // Prüfe, ob wir das API-Limit erreicht haben
        if (!canMakeApiRequest()) {
            console.log(`API limit reached (${DAILY_API_LIMIT}). Using fallback data.`);
            const fallbackData = generateFallbackLocations(city, category, 10); // Mehr Fallback-Daten
            return res.json(fallbackData);
        }

        // Zähle die API-Anfrage
        trackApiRequest();

        console.log(`Fetching data for ${city}, category: ${category}`);

        // Bei internationalen Städten (besonders asiatischen) müssen wir andere Strategien anwenden
        // Zunächst versuchen wir den englischen Namen + Land-Code
        let cityData = null;
        let citySearches = [
            { q: city }, // Normaler Name
            { q: `${city}, Japan` }, // Name + Land (für Tokyo, Osaka, etc.)
            { q: `${city}, China` }, // Name + Land (für Beijing, Shanghai, etc.)
            { q: `${city}, South Korea` }, // Name + Land (für Seoul, Busan, etc.)
            { q: `${city}, Thailand` }, // Name + Land (für Bangkok, etc.)
            { q: `${city}, India` }, // Name + Land (für Mumbai, Delhi, etc.)
            // Bekannte Übersetzungen für internationale Städte
            { q: 'Tokyo', namedetails: 1 },
            { q: 'Tokio', namedetails: 1 },
            { q: 'Beijing', namedetails: 1 },
            { q: 'Peking', namedetails: 1 },
            { q: 'Seoul', namedetails: 1 },
            { q: 'Bangkok', namedetails: 1 }
        ];

        // Versuche nacheinander verschiedene Suchanfragen, bis eine funktioniert
        for (const searchParams of citySearches) {
            if (cityData) break; // Wenn wir bereits Daten haben, breche die Schleife ab

            try {
                // Baue die URL mit allen Parametern
                const params = new URLSearchParams({ format: 'json', ...searchParams });
                const nominatimUrl = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

                const nominatimResponse = await axios.get(nominatimUrl, {
                    headers: { 'User-Agent': 'Date-Wheel-App/1.0' }
                });

                if (nominatimResponse.data && nominatimResponse.data.length > 0) {
                    cityData = nominatimResponse.data[0];
                    console.log(`Found city data using query: ${JSON.stringify(searchParams)}`);
                }
            } catch (error) {
                console.log(`Search failed for ${JSON.stringify(searchParams)}: ${error.message}`);
                // Weiter zum nächsten Versuch
            }

            // Kurze Pause zwischen Anfragen (wegen Rate-Limit)
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        if (!cityData) {
            console.log(`City not found after multiple attempts: ${city}`);
            const fallbackLocations = generateFallbackLocations(city, category, 8);
            setCachedData(cacheKey, fallbackLocations);
            return res.json(fallbackLocations);
        }

        // OSM-Tags basierend auf Kategorie ermitteln
        const osmTags = mapCategoryToOsmTags(category);
        if (!osmTags || osmTags.length === 0) {
            const fallbackLocations = generateFallbackLocations(city, category, 5);
            setCachedData(cacheKey, fallbackLocations);
            return res.json(fallbackLocations);
        }

        // Alle Orte von allen passenden Tags sammeln
        let allLocations = [];

        // Koordinaten- oder Bounding-Box-basierte Suche, je nach verfügbaren Daten
        if (cityData.boundingbox) {
            // Bounding-Box-basierte Suche
            const [south, north, west, east] = cityData.boundingbox;

            // Für jedes Tag eine Abfrage erstellen und kombinieren
            for (const osmTag of osmTags) {
                const [key, value] = osmTag.split('=');

                // Overpass-Abfrage mit Bounding-Box
                const tagQuery = `
          [out:json];
          (
            node["${key}"="${value}"](${south},${west},${north},${east});
            way["${key}"="${value}"](${south},${west},${north},${east});
            relation["${key}"="${value}"](${south},${west},${north},${east});
          );
          out center 15;
        `;

                try {
                    const overpassResponse = await axios.post('https://overpass-api.de/api/interpreter',
                        tagQuery,
                        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                    );

                    // Orte verarbeiten und zur Gesamtliste hinzufügen
                    const locations = await processOverpassData(overpassResponse.data, city);
                    allLocations = [...allLocations, ...locations];

                    // Kurze Pause zwischen Anfragen (wegen Rate-Limit)
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`Error with tag ${osmTag}:`, error.message);
                }
            }
        } else {
            // Radius-basierte Suche um die Stadtkoordinaten
            const lat = cityData.lat;
            const lon = cityData.lon;
            const radius = 5000; // 5km Radius (anpassbar je nach Stadtgröße)

            // Für jedes Tag eine Abfrage erstellen und kombinieren
            for (const osmTag of osmTags) {
                const [key, value] = osmTag.split('=');

                // Overpass-Abfrage mit Radius
                const tagQuery = `
          [out:json];
          (
            node["${key}"="${value}"](around:${radius},${lat},${lon});
            way["${key}"="${value}"](around:${radius},${lat},${lon});
            relation["${key}"="${value}"](around:${radius},${lat},${lon});
          );
          out center 15;
        `;

                try {
                    const overpassResponse = await axios.post('https://overpass-api.de/api/interpreter',
                        tagQuery,
                        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                    );

                    // Orte verarbeiten und zur Gesamtliste hinzufügen
                    const locations = await processOverpassData(overpassResponse.data, city);
                    allLocations = [...allLocations, ...locations];

                    // Kurze Pause zwischen Anfragen (wegen Rate-Limit)
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`Error with tag ${osmTag}:`, error.message);
                }
            }
        }

        // Wenn keine oder zu wenige Orte gefunden wurden, ergänze mit Fallback-Daten
        if (allLocations.length < 3) {
            const fallbackCount = 5 - allLocations.length;
            if (fallbackCount > 0) {
                const fallbackLocations = generateFallbackLocations(city, category, fallbackCount);
                allLocations = [...allLocations, ...fallbackLocations];
            }
        }

        // Speichere Ergebnis im Cache (24 Stunden gültig)
        setCachedData(cacheKey, allLocations);

        console.log(`Returning ${allLocations.length} locations for ${city}, category: ${category}`);
        res.json(allLocations);
    } catch (error) {
        console.error('API Error:', error.message);

        // Generiere Fallback-Daten bei jedem Fehler
        const fallbackData = generateFallbackLocations(req.query.city, req.query.category, 8);

        res.json(fallbackData);
    }
});

// Hilfsfunktion: Kategorie zu OSM-Tags
function mapCategoryToOsmTags(category) {
    const mappings = {
        'restaurant': ['amenity=restaurant', 'cuisine=japanese', 'cuisine=chinese', 'cuisine=italian', 'cuisine=sushi'],
        'cafe': ['amenity=cafe', 'shop=coffee', 'cuisine=coffee_shop', 'amenity=food_court'],
        'park': ['leisure=park', 'leisure=garden', 'tourism=viewpoint', 'leisure=playground'],
        'museum': ['tourism=museum', 'tourism=gallery', 'tourism=attraction', 'historic=monument'],
        'bar': ['amenity=bar', 'amenity=pub', 'amenity=biergarten', 'amenity=nightclub'],
        'cinema': ['amenity=cinema', 'leisure=entertainment_centre', 'leisure=amusement_arcade'],
        'theater': ['amenity=theatre', 'amenity=arts_centre', 'leisure=dance'],
        'gallery': ['tourism=gallery', 'tourism=artwork', 'shop=art'],
        'library': ['amenity=library', 'amenity=public_bookcase', 'shop=books'],
        'shopping_mall': ['shop=mall', 'shop=department_store', 'shop=supermarket'],
        'bakery': ['shop=bakery', 'shop=confectionery', 'shop=pastry', 'shop=coffee'],
        'zoo': ['tourism=zoo', 'tourism=aquarium', 'tourism=safari_park'],
        'viewpoint': ['tourism=viewpoint', 'natural=peak', 'tourism=information']
    };

    // Füge zusätzliche generische Kategorien für bessere Abdeckung hinzu
    const genericMappings = {
        'restaurant': ['amenity=fast_food', 'amenity=food_court'],
        'cafe': ['amenity=ice_cream', 'shop=tea'],
        'park': ['natural=park', 'tourism=picnic_site'],
        'museum': ['historic=castle', 'historic=ruins'],
        'shopping_mall': ['shop=convenience', 'shop=clothes'],
        'bakery': ['shop=deli', 'amenity=marketplace']
    };

    // Kombiniere spezifische und generische Mappings
    let tags = mappings[category] || [];

    if (genericMappings[category]) {
        tags = [...tags, ...genericMappings[category]];
    }

    return tags;
}

// Hilfsfunktion: Verarbeite Overpass-API-Daten
async function processOverpassData(data, city) {
    const locations = [];

    if (!data.elements || data.elements.length === 0) {
        console.log(`No locations found for the query in ${city}`);
        return locations;
    }

    // Vermeide Duplikate durch Tracking von Namen
    const processedNames = new Set();

    // Maximal 15 Ergebnisse, um API-Anfragen zu reduzieren
    const elementsToProcess = data.elements.slice(0, 15);

    // Batch-Verarbeitung für Adresssuchen
    const batchSize = 5;
    for (let i = 0; i < elementsToProcess.length; i += batchSize) {
        const batch = elementsToProcess.slice(i, i + batchSize);

        for (const element of batch) {
            // Extrahiere Name und Position
            const name = element.tags && element.tags.name ? element.tags.name : getDefaultName(element, city);

            // Überspringe Duplikate
            if (processedNames.has(name)) continue;
            processedNames.add(name);

            let latitude, longitude;

            if (element.center) {
                latitude = element.center.lat;
                longitude = element.center.lon;
            } else {
                latitude = element.lat;
                longitude = element.lon;
            }

            // Baue eine vereinfachte Adresse
            let address = "";

            if (element.tags) {
                // Versuche verschiedene Adressformate
                if (element.tags.addr_street && element.tags.addr_housenumber) {
                    address = `${element.tags.addr_street} ${element.tags.addr_housenumber}, ${city}`;
                } else if (element.tags['addr:street'] && element.tags['addr:housenumber']) {
                    address = `${element.tags['addr:street']} ${element.tags['addr:housenumber']}, ${city}`;
                } else if (element.tags.street && element.tags.housenumber) {
                    address = `${element.tags.street} ${element.tags.housenumber}, ${city}`;
                } else if (element.tags['addr:street']) {
                    address = `${element.tags['addr:street']}, ${city}`;
                } else if (element.tags.street) {
                    address = `${element.tags.street}, ${city}`;
                }
            }

            // Fallback, wenn keine Adressdetails vorhanden sind
            if (!address) {
                address = `${city}`;
            }

            // Generiere eine realistische Bewertung
            let rating = 3.0;
            if (element.tags && element.tags.stars) {
                // Versuche, Sterne aus den Tags zu extrahieren
                rating = parseFloat(element.tags.stars);
            } else {
                // Generiere eine zufällige Bewertung, etwas gewichtet in Richtung positiv
                rating = (3.5 + Math.random() * 1.5).toFixed(1);
            }

            // Füge Ort zur Liste hinzu
            locations.push({
                name: name,
                address: address,
                rating: rating,
                url: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=19`,
                latitude,
                longitude
            });
        }

        // Kurze Pause zwischen Batches, um Rate-Limits zu vermeiden
        if (i + batchSize < elementsToProcess.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    return locations;
}

// Hilfsfunktion für den Fallback-Namen
function getDefaultName(element, city) {
    const types = {
        'amenity=restaurant': 'Restaurant',
        'amenity=cafe': 'Café',
        'shop=coffee': 'Coffee Shop',
        'leisure=park': 'Park',
        'amenity=bar': 'Bar',
        'amenity=cinema': 'Kino',
        'shop=mall': 'Shopping Mall'
    };

    let defaultName = 'Ort';

    // Versuche, einen Typ zu identifizieren
    if (element.tags) {
        for (const [tag, typeName] of Object.entries(types)) {
            const [key, value] = tag.split('=');
            if (element.tags[key] === value) {
                defaultName = typeName;
                break;
            }
        }
    }

    return `${defaultName} in ${city}`;
}

// Hilfsfunktion: Generiere Fallback-Orte, falls API fehlschlägt
function generateFallbackLocations(city, category, count = 5) {
    if (!city) city = "Berlin";

    const seed = stringToSeed(city + category);
    const locations = [];

    // Anzahl der zu generierenden Orte
    const locationsCount = count || Math.floor(pseudoRandom(seed) * 4) + 3;

    for (let i = 0; i < locationsCount; i++) {
        const nameSeed = seed + i;
        const name = generatePlaceName(category, nameSeed, city);
        const address = generateAddress(nameSeed, city);

        locations.push({
            name: name,
            address: address,
            rating: (3 + pseudoRandom(nameSeed + 100) * 2).toFixed(1),
            isFallback: true
        });
    }

    return locations;
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
    // Vereinfachte Version für Fallback-Daten
    const prefixes = {
        'restaurant': ['Restaurant ', 'Gasthaus ', ''],
        'cafe': ['Café ', 'Kaffeehaus ', ''],
        'park': ['', 'Stadtpark ', 'Park '],
        'museum': ['Museum für ', 'Stadtmuseum ', ''],
        'cinema': ['Kino ', 'Filmpalast ', ''],
        'library': ['Stadtbibliothek ', 'Bücherei ', '']
    };

    const names = {
        'restaurant': ['Zum Goldenen Löwen', 'Zur Sonne', 'Bella Italia'],
        'cafe': ['Central', 'Zum Klatsch', 'Genuss'],
        'park': ['Volkspark', 'Rosengarten', 'Bürgerpark'],
        'museum': ['Kunst und Kultur', 'Geschichte', 'Moderne Kunst'],
        'cinema': ['Capitol', 'Metropolis', 'Central'],
        'library': ['Zentral', 'Stadt', 'Historische']
    };

    // Standardwerte für nicht definierte Kategorien
    const prefix = prefixes[category] ?
        prefixes[category][Math.floor(pseudoRandom(seed) * prefixes[category].length)] : '';

    let name;
    if (names[category]) {
        name = names[category][Math.floor(pseudoRandom(seed + 1) * names[category].length)];
    } else {
        name = `${city}-Center`;
    }

    // Manchmal Stadtname einfügen
    if (pseudoRandom(seed + 2) < 0.3) {
        return `${prefix}${city}er ${name}`;
    }

    return prefix + name;
}

function generateAddress(seed, city) {
    const streets = [
        'Hauptstraße', 'Bahnhofstraße', 'Schulstraße', 'Kirchstraße',
        'Gartenstraße', 'Marktplatz', 'Schillerstraße'
    ];

    const street = streets[Math.floor(pseudoRandom(seed) * streets.length)];
    const number = Math.floor(pseudoRandom(seed + 1) * 120) + 1;

    return `${street} ${number}, ${city}`;
}

// Startet den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
    console.log(`App verfügbar unter http://localhost:${PORT}`);
});