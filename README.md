# Das verrückte Date-Rad

Eine interaktive Web-App, die zufällige und kreative Date-Ideen generiert, inklusive echter Orte aus deiner Stadt mit Hilfe der OpenStreetMap API.

## Features

- Glücksrad-Animation für zufällige Date-Ideen
- Verbindung mit OpenStreetMap, um echte Orte in deiner Stadt zu finden
- Intelligente Zuordnung von Aktivitäten zu passenden Orten
- Fallback-System für eine zuverlässige Funktionalität ohne Internetverbindung
- Links zu OpenStreetMap für jeden vorgeschlagenen Ort
- Responsive Design für alle Geräte

## Installation

### Voraussetzungen

- Node.js (Version 14 oder höher)
- npm (wird mit Node.js installiert)

### Schritte

1. **Repository klonen oder Dateien herunterladen**

2. **Ins Verzeichnis wechseln**
   ```
   cd date-wheel-app
   ```

3. **Abhängigkeiten installieren**
   ```
   npm install
   ```

4. **Server starten**
   ```
   npm start
   ```

5. **App im Browser öffnen**
   Die App läuft nun unter [http://localhost:3000](http://localhost:3000)

## Projektstruktur

- `server.js` - Node.js/Express-Backend, das die OpenStreetMap-API anspricht und CORS-Probleme umgeht
- `public/` - Verzeichnis für Frontend-Dateien
    - `index.html` - Die Hauptseite
    - `styles.css` - Styling der App
    - `app.js` - Frontend-Logik und API-Kommunikation

## Verwendung

1. Gib deine Stadt ein (Standard ist "Berlin")
2. Klicke auf "Orte laden", um Orte aus deiner Stadt zu laden
3. Drehe das Rad mit "Rad drehen" oder generiere direkt eine neue Idee mit "Neue Idee"
4. Die generierte Date-Idee wird mit einem passenden Ort aus deiner Stadt angezeigt
5. Klicke auf den Link "Auf OpenStreetMap anzeigen", um den Ort auf einer Karte zu sehen

## Anpassung

Du kannst die App leicht anpassen, indem du die folgenden Dateien bearbeitest:

- `app.js`: Füge neue Aktivitäten oder "Twists" zum `dateData`-Objekt hinzu
- `styles.css`: Ändere das Design nach deinen Wünschen
- `server.js`: Passe die API-Logik an oder füge weitere Datenquellen hinzu

## Technische Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js mit Express
- **APIs**: OpenStreetMap (Nominatim und Overpass API)
- **Caching**: Server-seitiges Caching von API-Ergebnissen für bessere Performance
- **Fallback-System**: Generiert plausible Daten, wenn die API nicht erreichbar ist

## Hinweise

- Die Overpass-API hat Ratenlimits - bei zu vielen Anfragen könnte die App auf Fallback-Daten zurückgreifen müssen
- Nominatim begrenzt Anfragen auf 1 pro Sekunde, daher kann das initiale Laden etwas Zeit in Anspruch nehmen