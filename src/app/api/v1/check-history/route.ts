import { NextResponse } from "next/server";
import { drawRepository } from "@/lib/lotto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const numbers = body.numbers;

    if (!Array.isArray(numbers) || numbers.length !== 6) {
      return NextResponse.json(
        { success: false, error: { message: "올바른 번호 배열이 아닙니다." } },
        { status: 400 }
      );
    }

    const parsedNumbers = numbers.map(Number);
    if (parsedNumbers.some((n) => Number.isNaN(n) || n < 1 || n > 45)) {
      return NextResponse.json(
        { success: false, error: { message: "1부터 45 사이의 번호를 입력해야 합니다." } },
        { status: 400 }
      );
    }

    const draws = await drawRepository.getAll();
    const userSet = new Set(parsedNumbers);

    const matches = [];

    for (const draw of draws) {
      let matchCount = 0;
      for (const n of draw.numbers) {
        if (userSet.has(n)) {
          matchCount++;
        }
      }

      const bonusMatched = userSet.has(draw.bonus);

      if (matchCount >= 3) {
        let rank: 1 | 2 | 3 | 4 | 5 | null = null;

        if (matchCount === 6) rank = 1;
        else if (matchCount === 5 && bonusMatched) rank = 2;
        else if (matchCount === 5) rank = 3;
        else if (matchCount === 4) rank = 4;
        else if (matchCount === 3) rank = 5;

        if (rank !== null) {
          matches.push({
            round: draw.round,
            drawDate: draw.drawDate,
            rank,
            matchedNumbers: draw.numbers.filter((n) => userSet.has(n)),
            winningNumbers: draw.numbers,
            bonusMatched,
            bonusNumber: draw.bonus
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        matches: matches.sort((a, b) => b.round - a.round) // 최신 회차순 정렬
      }
    });
  } catch (error) {
    console.error("Check history api error:", error);
    return NextResponse.json(
      { success: false, error: { message: "데이터 처리 중 오류가 발생했습니다." } },
      { status: 500 }
    );
  }
}
