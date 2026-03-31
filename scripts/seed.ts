import { PrismaClient } from "@prisma/client";

import { seedDraws } from "../src/lib/data/seed-draws";

const prisma = new PrismaClient();

async function main() {
  for (const draw of seedDraws) {
    await prisma.draw.upsert({
      where: { round: draw.round },
      update: {
        drawDate: new Date(draw.drawDate),
        n1: draw.numbers[0],
        n2: draw.numbers[1],
        n3: draw.numbers[2],
        n4: draw.numbers[3],
        n5: draw.numbers[4],
        n6: draw.numbers[5],
        bonus: draw.bonus,
        totalPrize: BigInt(draw.totalPrize ?? 0),
        firstPrize: BigInt(draw.firstPrize ?? 0),
        winnerCount: draw.winnerCount ?? 0
      },
      create: {
        round: draw.round,
        drawDate: new Date(draw.drawDate),
        n1: draw.numbers[0],
        n2: draw.numbers[1],
        n3: draw.numbers[2],
        n4: draw.numbers[3],
        n5: draw.numbers[4],
        n6: draw.numbers[5],
        bonus: draw.bonus,
        totalPrize: BigInt(draw.totalPrize ?? 0),
        firstPrize: BigInt(draw.firstPrize ?? 0),
        winnerCount: draw.winnerCount ?? 0
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
