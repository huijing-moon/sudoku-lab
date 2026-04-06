import { Difficulty } from '../screens/HomeScreen';

import easyPuzzles from '../assets/puzzles/easy.json';
import mediumPuzzles from '../assets/puzzles/medium.json';
import hardPuzzles from '../assets/puzzles/hard.json';
import diabolicalPuzzles from '../assets/puzzles/diabolical.json';

type Board = number[][];
type Puzzle = (number | null)[][];

export type GameData = {
    solution: Board;
    puzzle: Puzzle;
    puzzleId: string;
};

type PuzzleEntry = { id: string; puzzle: string; solution: string };

const PUZZLE_MAP: Record<Difficulty, PuzzleEntry[]> = {
    '초급': easyPuzzles as PuzzleEntry[],
    '중급': mediumPuzzles as PuzzleEntry[],
    '마스터': diabolicalPuzzles as PuzzleEntry[],
    '대결': hardPuzzles as PuzzleEntry[],
};

function parseBoard(str: string): number[][] {
    const board: number[][] = [];
    for (let r = 0; r < 9; r++) {
        board.push(str.slice(r * 9, r * 9 + 9).split('').map(Number));
    }
    return board;
}

function parsePuzzle(str: string): Puzzle {
    const puzzle: Puzzle = [];
    for (let r = 0; r < 9; r++) {
        puzzle.push(
            str.slice(r * 9, r * 9 + 9).split('').map(ch => (ch === '0' ? null : Number(ch)))
        );
    }
    return puzzle;
}

export const generateGame = (difficulty: Difficulty): GameData => {
    const pool = PUZZLE_MAP[difficulty];
    const entry = pool[Math.floor(Math.random() * pool.length)];

    return {
        solution: parseBoard(entry.solution),
        puzzle: parsePuzzle(entry.puzzle),
        puzzleId: entry.id,
    };
};
