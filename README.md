# Immobilienmakler-Verzeichnis

Eine moderne Webapp für Eigentümer und Immobilienmakler in Deutschland.

## Funktionen

- **Immobilienwert-Rechner** – Grobe Schätzung des Immobilienwerts nach PLZ, Fläche und weiteren Faktoren
- **Makler-Verzeichnis** – Suche nach Maklern per Postleitzahl, Premium/Gold-Makler hervorgehoben
- **Lead-System** – Eigentümer können Beratung anfragen, Leads werden an Premium-Makler weitergeleitet
- **Admin-Panel** – Zentrale Verwaltung von Maklern, Leads und Status (Standard/Premium/Gold)
- **Makler-Login** – Makler können sich anmelden, Leads einsehen und Marketing-Materialien herunterladen
- **Marketing-Paket** – Premium- und Gold-Makler erhalten digitale Siegel und Gütezeichen

## Schnellstart

```bash
# Abhängigkeiten installieren
npm install

# Datenbank initialisieren
npm run db:push
npm run db:seed

# Entwicklungsserver starten
npm run dev
```

Die App läuft unter [http://localhost:3000](http://localhost:3000).

## Fehlerbehebung: "This page isn't working"

1. **Port prüfen:** Der Server nutzt Port 3000. Wenn dieser belegt ist, weicht Next.js auf 3001, 3002 usw. aus. Achten Sie in der Terminal-Ausgabe auf die angezeigte URL (z.B. `Local: http://localhost:3002`).

2. **Alte Prozesse beenden:** Falls bereits ein Server läuft, beenden Sie alle Node-Prozesse und starten Sie neu:
   ```bash
   pkill -f "next dev"   # oder Prozesse manuell beenden
   npm run dev
   ```

3. **Datenbank prüfen:** Stellen Sie sicher, dass die Datenbank initialisiert wurde:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Browser-Konsole:** Öffnen Sie die Entwicklertools (F12) → Konsole. Bei Fehlern erscheinen dort Hinweise.

## Test-Zugänge

**Admin:**
- E-Mail: `admin@example.com`
- Passwort: `admin123`

**Makler:**
- E-Mail: `info@schmidt-immobilien.de`
- Passwort: `makler123`

## Umgebungsvariablen

Erstellen Sie eine `.env`-Datei (siehe `.env.example`):

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<generieren mit: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="<sicheres Passwort>"
```

## PLZ-Daten

Die PLZ-Preisdaten für den Rechner liegen in `data/plz-preise.json`. Ersetzen Sie diese Datei durch Ihre vollständigen Daten für alle deutschen PLZ.

## Marketing-Assets

Fügen Sie Ihre Siegel und Gütezeichen in folgende Ordner ein:
- `public/marketing/premium/` – für Premium-Makler
- `public/marketing/gold/` – für Gold-Makler

## Tech-Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- NextAuth.js
