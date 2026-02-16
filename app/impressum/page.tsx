export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Impressum</h1>
      <p className="mt-6 text-slate-600">
        Angaben gemäß § 5 TMG
      </p>
      <div className="mt-8 space-y-4 text-slate-600">
        <p>
          <strong>[Firmenname]</strong><br />
          [Straße und Hausnummer]<br />
          [PLZ und Ort]
        </p>
        <p>
          <strong>Vertreten durch:</strong><br />
          [Name des Geschäftsführers/Inhabers]
        </p>
        <p>
          <strong>Kontakt:</strong><br />
          Telefon: [Telefonnummer]<br />
          E-Mail: [E-Mail-Adresse]
        </p>
        <p>
          <strong>Registereintrag:</strong><br />
          Eintragung im Handelsregister.<br />
          Registergericht: [Amtsgericht]<br />
          Registernummer: [HRB-Nummer]
        </p>
        <p>
          <strong>Umsatzsteuer-ID:</strong><br />
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          [USt-IdNr.]
        </p>
      </div>
      <p className="mt-8 text-sm text-slate-500">
        Bitte ersetzen Sie die Platzhalter durch Ihre tatsächlichen Angaben.
      </p>
    </div>
  )
}
