import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.lead.deleteMany()
  await prisma.makler.deleteMany()

  const makler = [
    { name: 'Immobilien Schmidt Köln', firmenname: 'Immobilien Schmidt Köln', plz: '50667', city: 'Köln', address: 'Domplatz 5', email: 'info@schmidt-immobilien.de', phone: '0221 123456', website: 'https://schmidt-immobilien.de', status: 'premium' },
    { name: 'Haus & Grund Düsseldorf', firmenname: 'Haus & Grund Düsseldorf', plz: '40213', city: 'Düsseldorf', address: 'Schadowstraße 12', email: 'info@hausundgrund-duesseldorf.de', phone: '0211 234567', website: 'https://hausundgrund-duesseldorf.de', status: 'starter' },
    { name: 'Ruhr Immobilien Dortmund', firmenname: 'Ruhr Immobilien Dortmund', plz: '44135', city: 'Dortmund', address: 'Westenhellweg 8', email: 'info@ruhr-immobilien.de', phone: '0231 345678', status: 'partner' },
    { name: 'Wohnraum Essen', firmenname: 'Wohnraum Essen', plz: '45127', city: 'Essen', address: 'Kettwiger Straße 20', email: 'info@wohnraum-essen.de', phone: '0201 456789', status: 'standard' },
    { name: 'Rheinland Properties Bonn', firmenname: 'Rheinland Properties Bonn', plz: '53111', city: 'Bonn', address: 'Remigiusstraße 3', email: 'info@rheinland-properties.de', phone: '0228 567890', status: 'premium' },
    { name: 'Bergisch Immobilien Wuppertal', firmenname: 'Bergisch Immobilien Wuppertal', plz: '42103', city: 'Wuppertal', address: 'Elberfelder Straße 15', email: 'info@bergisch-immobilien.de', status: 'standard' },
    { name: 'Münster Wohnen', firmenname: 'Münster Wohnen', plz: '48143', city: 'Münster', address: 'Ludgeristraße 7', email: 'info@muenster-wohnen.de', phone: '0251 678901', status: 'starter' },
    { name: 'Aachener Haus', firmenname: 'Aachener Haus', plz: '52062', city: 'Aachen', address: 'Buchkremerstraße 1', email: 'info@aachener-haus.de', phone: '0241 789012', status: 'standard' },
    { name: 'Bochum Immobilien', firmenname: 'Bochum Immobilien', plz: '44787', city: 'Bochum', address: 'Kortumstraße 25', email: 'info@bochum-immobilien.de', status: 'pending' },
    { name: 'Leverkusen Wohn & Grund', firmenname: 'Leverkusen Wohn & Grund', plz: '51373', city: 'Leverkusen', address: 'Wiesdorfer Platz 2', email: 'info@leverkusen-wohn.de', phone: '0214 890123', status: 'standard' },
    { name: 'Spengler Immobilien', firmenname: 'Spengler Immobilien', plz: '45894', city: 'Gelsenkirchen', address: 'De-La-Chevallerie-Str. 26', email: 'info@spengler-immobilien.de', phone: '+49 157 3735 9200', website: 'https://www.spengler-immobilien.de', ansprechpartner: 'Lukas Spengler', status: 'partner' },
  ]

  const defaultPassword = await hash('makler123', 10)

  for (const m of makler) {
    const data = { ...m }
    if (m.email?.includes('schmidt')) {
      ;(data as { passwordHash?: string }).passwordHash = defaultPassword
    }
    await prisma.makler.create({ data })
  }

  console.log('Seed completed:', makler.length, 'Makler angelegt')
  console.log('Test-Login Makler: info@schmidt-immobilien.de / makler123')
  console.log('11 Makler: 10 in NRW + Spengler Immobilien (Gelsenkirchen)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
