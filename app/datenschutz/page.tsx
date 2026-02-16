export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Datenschutzerklärung</h1>
      <p className="mt-6 text-slate-600">
        Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
      </p>
      <p className="mt-4 text-slate-600">
        [Firmenname]<br />
        [Adresse]<br />
        [E-Mail]
      </p>

      <h2 className="mt-10 text-xl font-semibold text-slate-900">1. Erhebung und Speicherung personenbezogener Daten</h2>
      <p className="mt-4 text-slate-600">
        Beim Besuch unserer Website werden automatisch Informationen wie IP-Adresse, Browsertyp und Zugriffszeitpunkt erfasst. 
        Bei Nutzung des Immobilienwert-Rechners und des Beratungsformulars werden die von Ihnen eingegebenen Daten (Name, E-Mail, Telefon, PLZ) gespeichert.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-slate-900">2. Zweck der Verarbeitung</h2>
      <p className="mt-4 text-slate-600">
        Ihre Daten werden verwendet, um Ihre Anfrage zu bearbeiten und Sie mit qualifizierten Immobilienmaklern in Verbindung zu bringen. 
        Die Weitergabe an Makler erfolgt nur mit Ihrer ausdrücklichen Einwilligung.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-slate-900">3. Ihre Rechte</h2>
      <p className="mt-4 text-slate-600">
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. 
        Wenden Sie sich dazu an die oben genannte Kontaktadresse.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-slate-900">4. Cookies</h2>
      <p className="mt-4 text-slate-600">
        Diese Website verwendet technisch notwendige Cookies für die Anmeldung im Makler- und Admin-Bereich.
      </p>

      <p className="mt-10 text-sm text-slate-500">
        Bitte ergänzen Sie diese Datenschutzerklärung um Ihre spezifischen Angaben und lassen Sie sie rechtlich prüfen.
      </p>
    </div>
  )
}
