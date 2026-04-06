/**
 * 퍼즐 파일에서 샘플링해 앱 번들용 JSON 생성
 * 실행: node scripts/bundlePuzzles.js
 */
const fs = require('fs');
const path = require('path');

// 백트래킹 스도쿠 솔버
function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) continue;
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, r, c, num)) {
          board[r][c] = num;
          if (solve(board)) return true;
          board[r][c] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

function isValid(board, r, c, num) {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === num) return false;
    if (board[i][c] === num) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[br + i][bc + j] === num) return false;
  return true;
}

const SAMPLE_SIZE = 2000;
const SRC_DIR = path.join(__dirname, '../puzzles-src');

const FILES = [
  { name: 'easy',       src: path.join(SRC_DIR, 'easy.txt') },
  { name: 'medium',     src: path.join(SRC_DIR, 'medium.txt') },
  { name: 'hard',       src: path.join(SRC_DIR, 'hard.txt') },
  { name: 'diabolical', src: path.join(SRC_DIR, 'diabolical.txt') },
];

const outDir = path.join(__dirname, '../src/assets/puzzles');
fs.mkdirSync(outDir, { recursive: true });

for (const { name, src } of FILES) {
  console.log(`\n[${name}] 처리 중...`);
  const lines = fs.readFileSync(src, 'utf8').trim().split('\n').filter(Boolean);
  console.log(`  총 ${lines.length.toLocaleString()}개 중 ${SAMPLE_SIZE}개 샘플링`);

  // 무작위 샘플링
  const indices = new Set();
  while (indices.size < Math.min(SAMPLE_SIZE * 2, lines.length)) {
    indices.add(Math.floor(Math.random() * lines.length));
  }
  const sampled = [...indices].map(i => lines[i]);

  const puzzles = [];
  let skipped = 0;

  for (const line of sampled) {
    if (puzzles.length >= SAMPLE_SIZE) break;
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;
    const id = parts[0];
    const puzzleStr = parts[1];
    if (puzzleStr.length !== 81) continue;

    // 퍼즐 → 2D 배열로 변환
    const board = [];
    for (let r = 0; r < 9; r++) {
      board.push(puzzleStr.slice(r * 9, r * 9 + 9).split('').map(Number));
    }

    // 솔루션 계산
    const boardCopy = board.map(r => [...r]);
    if (!solve(boardCopy)) {
      skipped++;
      continue;
    }

    puzzles.push({
      id,
      puzzle: puzzleStr,
      solution: boardCopy.map(r => r.join('')).join(''),
    });
  }

  const outPath = path.join(outDir, `${name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(puzzles));
  console.log(`  완료: ${puzzles.length}개 저장 (스킵: ${skipped}개) → ${outPath}`);
}

console.log('\n✓ 모든 파일 생성 완료');
