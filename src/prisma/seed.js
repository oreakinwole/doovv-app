const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password', 12);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      password: hashedPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
    },
  });

  const washer = await prisma.user.upsert({
    where: { email: 'washer@test.com' },
    update: {},
    create: {
      email: 'washer@test.com',
      password: hashedPassword,
      name: 'Test Washer',
      role: 'WASHER',
    },
  });

  console.log({ customer, washer });
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
