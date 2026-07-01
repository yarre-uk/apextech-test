import 'dotenv/config';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../lib/generated/prisma/client';
import path from 'path';
import { env } from '@/lib/env';

const dbUrl = env.DATABASE_URL.replace(/^file:/, '');
const dbPath = path.resolve(process.cwd(), dbUrl);
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const member = await prisma.member.upsert({
    where: { email: 'james.whitfield@exclusiveresorts.com' },
    update: {},
    create: {
      name: 'James Whitfield',
      email: 'james.whitfield@exclusiveresorts.com',
    },
  });

  await prisma.reservation.upsert({
    where: { id: 'seed-reservation-villa-punta-mita' },
    update: {},
    create: {
      id: 'seed-reservation-villa-punta-mita',
      memberId: member.id,
      destination: 'Punta Mita, Mexico',
      villa: 'Villa Punta Mita',
      arrivalDate: new Date('2026-03-15'),
      departureDate: new Date('2026-03-22'),
    },
  });

  console.log('Seeded: James Whitfield + Villa Punta Mita reservation');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
