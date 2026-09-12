# Formulierungsbausteine VT — Installation

Installierbare Web-App (PWA) für Fallkonzeption und Bericht an die Gutachterin
oder den Gutachter nach PTV 3. Läuft nach dem ersten Aufruf vollständig offline,
ohne Serverkontakt und ohne Datenübertragung.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Die vollständige App, eine Datei, keine externen Abhängigkeiten |
| `manifest.webmanifest` | Name, Icons, Startverhalten |
| `sw.js` | Service Worker, lädt die App-Shell in den Cache |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Icons für Android und Desktop |
| `apple-touch-icon.png` | Icon für iOS-Homebildschirm |

Alle Dateien gehören in **dasselbe Verzeichnis**. Pfade sind relativ, ein
Unterverzeichnis auf GitHub Pages funktioniert also ebenso wie die Wurzel.

## Veröffentlichen über GitHub Pages

1. Dateien in das Repository legen, etwa nach `/bausteine-vt/`.
2. In den Repository-Einstellungen unter Pages die Quelle auf den Branch stellen.
3. Seite über `https://<name>.github.io/<repo>/bausteine-vt/` aufrufen.

HTTPS ist Voraussetzung; GitHub Pages liefert das von sich aus. Über
`file://` geöffnet läuft die App zwar, der Service Worker wird dann aber nicht
registriert und es gibt keine Installation.

## Installieren

- **iOS, Safari:** Teilen-Symbol, dann „Zum Home-Bildschirm“.
- **Android, Chrome:** Menü, dann „App installieren“.
- **Desktop, Chrome oder Edge:** Installationssymbol in der Adressleiste.

## Aktualisieren

Der Service Worker liefert die zwischengespeicherte Fassung sofort aus und lädt
im Hintergrund die neue. Nach einer inhaltlichen Änderung in `sw.js` die Zeile
`var VERSION = "v1";` hochzählen, sonst bleibt bei manchen Geräten die alte
Fassung aktiv. Ein Neustart der App übernimmt dann die neue Version.

## Daten

Gespeichert wird nur im Browser des Geräts, nichts verlässt es:

- Sammlung und Genus-Einstellung dauerhaft im lokalen Speicher,
- Fallwerte nur, wenn der Haken „Auf diesem Gerät speichern“ gesetzt ist.

Fallwerte können Patientendaten enthalten. Nur pseudonymisiert eintragen, und
auf gemeinsam genutzten Geräten den Haken nicht setzen. Zum Löschen die
Schaltfläche „Leeren“ in der Fallwerte-Maske verwenden.
