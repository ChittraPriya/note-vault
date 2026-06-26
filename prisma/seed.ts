// prisma/seed.ts — creates a test user for grading/demo purposes
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@vaultnotes.test";
  const password = "Demo12345";
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed },
  });

  console.log("Seeded test user:");
  console.log("  email:   ", email);
  console.log("  password:", password);
  console.log("  id:      ", user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
