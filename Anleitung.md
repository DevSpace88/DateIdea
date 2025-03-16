# Date-Rad Installationsanleitung

Diese Anleitung hilft dir dabei, das Date-Rad auf deinem eigenen Server zu installieren und zu verwenden.

## Voraussetzungen

- Node.js (Version 14 oder höher)
- npm (wird mit Node.js installiert)
- Basis-Kenntnisse in JavaScript/Node.js

## Installation

### 1. Projektstruktur erstellen

Erstelle folgende Ordnerstruktur:

```
date-wheel/
├── server.js
├── package.json
├── .gitignore
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

### 2. Abhängigkeiten installieren

Kopiere den Inhalt der `package.json`-Datei in deine Datei und führe dann aus:

```bash
npm install
```

Dies installiert alle benötigten Abhängigkeiten:
- express (Web-Server)
- cors (Cross-Origin-Anfragen)
- axios (HTTP-Client für API-Anfragen)
- express-rate-limit (Schutz vor zu vielen Anfragen)
- express-slow-down (Verlangsamung bei zu vielen Anfragen)

### 3. Dateien kopieren

Kopiere den Code aus den Dateien:
- `server.js` in die Hauptverzeichnis-Datei
- `public/index.html` in die entsprechende Datei im public-Ordner
- `public/styles.css` in die entsprechende Datei im public-Ordner
- `public/app.js` in die entsprechende Datei im public-Ordner
- `.gitignore` in die entsprechende Datei im Hauptverzeichnis

### 4. Server starten

Führe den folgenden Befehl aus, um den Server zu starten:

```bash
npm start
```

Der Server sollte jetzt auf Port 3000 laufen. Öffne einen Browser und gehe zu:
http://localhost:3000

## Anpassungen

### API-Rate-Limits anpassen

Wenn du nicht so viele API-Anfragen benötigst oder Kosten reduzieren möchtest, kannst du die folgenden Werte in `server.js` anpassen:

```javascript
// Tägliches API-Anfragenlimit
const DAILY_API_LIMIT = 1000; // Auf eine niedrigere Zahl setzen, z.B. 500

// Cache-Dauer
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 Stunden
```

### Frontend-Anpassungen

Du kannst das Design in `styles.css` nach deinen Wünschen anpassen. Die wichtigsten Abschnitte sind:

- Farbschema: Suche nach `#e91e63` (Pink) und ändere es zu deiner Lieblingsfarbe
- Rad-Größe: Suche nach `.wheel-container` und passe die Werte an
- Schriftarten: Ändere `font-family` im `body`-Selector

### Eigene Aktivitäten und Twists hinzufügen

In `app.js` kannst du die Arrays `activities` und `twists` um eigene Ideen erweitern:

```javascript
// Füge neue Aktivitäten hinzu
{ name: "Deine neue Aktivität", weight: 5, emoji: "🎯", categories: ["restaurant", "cafe"] },

// Füge neue Twists hinzu
{ name: "mit deinem besonderen Twist", weight: 4, emoji: "🎭" },
```

## Hosting-Tipps

### Kostenlose Hosting-Optionen

Du kannst das Date-Rad kostenlos hosten mit:

1. **Render**: Bietet kostenloses Node.js-Hosting
2. **Vercel**: Einfache Bereitstellung von Node.js-Anwendungen
3. **Netlify**: Funktionen-Support für das Backend

### Rate-Limiting für Produktionsumgebungen

Passe die Rate-Limits für Produktionsserver an:

```javascript
// Rate Limiter für Produktionsumgebung
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 50, // Limit auf 50 Anfragen pro 15 Minuten
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte versuche es später erneut.' }
});
```

## Fehlerbehandlung

### Häufige Probleme und Lösungen

1. **"Cannot find module" Fehler**:
    - Führe `npm install` erneut aus
    - Überprüfe, ob alle Abhängigkeiten in package.json vorhanden sind

2. **API-Fehler mit OpenStreetMap**:
    - Die App nutzt automatisch Fallback-Daten, wenn die API-Anfragen fehlschlagen
    - Du kannst mit den Dev-Tools (F12) im Browser in der Konsole nach Fehlern suchen

3. **Keine Orte werden gefunden**:
    - Überprüfe die Schreibweise der Stadt
    - Einige Städte benötigen das Land als Zusatz (z.B. "Paris, France")

## Weitere Entwicklung

Hier sind einige Ideen für zukünftige Erweiterungen:

1. Bilder für Orte hinzufügen (z.B. über Unsplash API)
2. Benutzerdefinierte Listen von Aktivitäten ermöglichen
3. Möglichkeit, Favoriten zu speichern
4. Zeitbasierte Vorschläge (Wochenende vs. Wochentag, Tageszeit)
5. Wetter-API integrieren für wetterabhängige Vorschläge