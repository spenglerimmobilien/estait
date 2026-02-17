# ESTAIT online schalten – Anleitung

## Übersicht

Dein Projekt wird auf **Vercel** gehostet mit einer **Neon** PostgreSQL-Datenbank. Beide haben einen kostenlosen Tarif.

**Hinweis:** Das Projekt nutzt jetzt PostgreSQL statt SQLite. Für lokale Entwicklung brauchst du ebenfalls eine Neon-Datenbank (kostenlos). Starte mit Schritt 1.

---

## Schritt 1: Neon-Datenbank erstellen

1. Gehe zu [neon.tech](https://neon.tech) und melde dich an (kostenlos mit GitHub).
2. **New Project** → Name z.B. `estait`.
3. Region wählen (z.B. Frankfurt).
4. Nach dem Erstellen: **Connection string** kopieren (Format: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).

---

## Schritt 2: NEXTAUTH_SECRET erzeugen

Im Terminal ausführen:

```bash
openssl rand -base64 32
```

Den ausgegebenen String kopieren – das ist dein `NEXTAUTH_SECRET`.

---

## Schritt 3: Vercel-Projekt anlegen

1. Gehe zu [vercel.com](https://vercel.com) und melde dich an (mit GitHub).
2. **Add New** → **Project**.
3. Repository **spenglerimmobilien/estait** auswählen.
4. **Import** klicken.

---

## Schritt 4: Umgebungsvariablen in Vercel setzen

Unter **Environment Variables** diese Werte eintragen:

| Variable | Wert | Hinweis |
|----------|------|---------|
| `DATABASE_URL` | Deine Neon-Connection-URL | Aus Schritt 1 |
| `NEXTAUTH_URL` | `https://estait.vercel.app` | Oder deine spätere Domain |
| `NEXTAUTH_SECRET` | Dein generierter Secret | Aus Schritt 2 |
| `ADMIN_EMAIL` | Deine Admin-E-Mail | z.B. info@spengler-immobilien.de |
| `ADMIN_PASSWORD` | Dein Admin-Passwort | Sicheres Passwort wählen |

Für alle Variablen: **Production**, **Preview** und **Development** aktivieren.

---

## Schritt 5: Deploy starten

1. **Deploy** klicken.
2. Warten, bis der Build durchgelaufen ist (ca. 2–3 Minuten).
3. Bei Fehlern: Build-Logs prüfen.

---

## Schritt 6: Datenbank initialisieren

Die Tabellen werden beim Build automatisch mit `prisma db push` angelegt.

**Optional – Testdaten einspielen:** Wenn du die Demo-Makler aus dem Seed haben möchtest, führe einmal lokal aus (mit der Neon-URL in `.env`):

```bash
npx prisma db seed
```

**Hinweis:** Der Seed löscht alle bestehenden Makler und Leads. Nur für leere Datenbank oder Testumgebung nutzen.

---

## Schritt 7: NEXTAUTH_URL anpassen

Nach dem Deploy zeigt Vercel die URL an (z.B. `estait-xxx.vercel.app`).

1. In Vercel: **Settings** → **Environment Variables**.
2. `NEXTAUTH_URL` auf die tatsächliche URL setzen, z.B.:
   `https://estait-xxx.vercel.app`
3. Optional: **Redeploy** auslösen.

---

## Lokale Entwicklung mit PostgreSQL

Für lokales Arbeiten mit derselben Datenbank:

1. `.env` mit der Neon-URL füllen (wie in Schritt 6).
2. `npx prisma generate` ausführen.
3. `npm run dev` starten.

---

## Eigene Domain (optional)

1. In Vercel: **Settings** → **Domains**.
2. Domain hinzufügen (z.B. `estait.de`).
3. DNS-Einträge beim Domain-Anbieter wie von Vercel angegeben setzen.
4. `NEXTAUTH_URL` auf die neue Domain aktualisieren.
