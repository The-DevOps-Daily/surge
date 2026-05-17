import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Default seed credentials. The kit is meant to be run locally first, so we
  // keep them memorable. Change before deploying to anything public.
  const SEED_EMAIL = "admin@admin.com";
  const SEED_PASSWORD = "password";

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: SEED_EMAIL },
    update: { role: "admin" },
    create: {
      email: SEED_EMAIL,
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`Created seed user: ${user.email} (password: ${SEED_PASSWORD})`);
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
