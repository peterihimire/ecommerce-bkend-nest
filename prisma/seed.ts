// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
// import fs from 'fs';
import CATEGORIES from './data/categories';
import ROLES from './data/roles';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  for (const item of CATEGORIES) {
    // Perform the upsert operation using Prisma
    const upsertedCat = await prisma.category.upsert({
      where: { title: item.title }, // Define your unique identifier here
      create: item, // Data to create if it doesn't exist
      update: item, // Data to update if it already exists
    });

    console.log('Upserted cat:', upsertedCat);
  }

  for (const item of ROLES) {
    // Perform the upsert operation using Prisma
    const upsertedRole = await prisma.role.upsert({
      where: { name: item.name },
      create: item,
      update: item,
    });

    console.log('Upserted role:', upsertedRole);
  }
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
