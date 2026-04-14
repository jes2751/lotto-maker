const fs = require('fs');
const content = fs.readFileSync('src/lib/data/local-draws.ts', 'utf8');

const draw1219 = {
  id: 1219,
  round: 1219,
  drawDate: '2026-04-11',
  numbers: [1, 2, 15, 28, 39, 45],
  bonus: 31,
  totalPrize: 120945801000,
  firstPrize: 2508354782,
  winnerCount: 12
};

const lines = content.split('\n');
const insertIndex = lines.findIndex(l => l.includes('export const localDraws: Draw[] = ['));

if (insertIndex !== -1) {
  const drawString = `  {
    "id": ${draw1219.id},
    "round": ${draw1219.round},
    "drawDate": "${draw1219.drawDate}",
    "numbers": [
      ${draw1219.numbers.join(',\n      ')}
    ],
    "bonus": ${draw1219.bonus},
    "totalPrize": ${draw1219.totalPrize},
    "firstPrize": ${draw1219.firstPrize},
    "winnerCount": ${draw1219.winnerCount}
  },`;

  lines.splice(insertIndex + 1, 0, drawString);
  fs.writeFileSync('src/lib/data/local-draws.ts', lines.join('\n'), 'utf8');
  console.log('Successfully added round 1219 to local-draws.ts!');
} else {
  console.error('Could not find insert position');
}
