const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com'; // Default admin email
  const password = 'admin123'; // Default admin password

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        name: 'Admin',
        password: hashedPassword,
      },
    });
    console.log(`Admin user created: ${user.email}`);
  } catch (e) {
    if (e.code === 'P2002') {
      console.log(`User with email ${email} already exists.`);
    } else {
      throw e;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
