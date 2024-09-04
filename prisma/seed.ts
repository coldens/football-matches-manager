import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { email: 'test@mail.io' },
      update: {},
      create: {
        email: 'test@mail.io',
        name: 'Test User',
        apiKey: 'test-api-key',
      },
    });

    await tx.team.upsert({
      where: { name: 'Real Madrid' },
      create: {
        name: 'Real Madrid',
      },
      update: {},
    });
    await tx.team.upsert({
      where: { name: 'Barcelona' },
      create: {
        name: 'Barcelona',
      },
      update: {},
    });
    await tx.team.upsert({
      where: { name: 'Atletico Madrid' },
      create: {
        name: 'Atletico Madrid',
      },
      update: {},
    });
    await tx.team.upsert({
      where: { name: 'Valencia' },
      create: {
        name: 'Valencia',
      },
      update: {},
    });
    await tx.team.upsert({
      where: { name: 'Sevilla' },
      create: {
        name: 'Sevilla',
      },
      update: {},
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
