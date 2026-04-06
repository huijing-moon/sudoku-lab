import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import Cell from './Cell';
import NumberPad from './NumberPad';
import GhostProgressBar from './GhostProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from '../screens/HomeScreen';
import { generateGame } from '../utils/puzzleGenerator';
import { uploadGhostRecord, fetchGhostRecord, GhostRecord, GhostSnapshot } from '../utils/ghostService';

type CellType = {
    value: number | null;
    isFixed: boolean;
    isError: boolean;
};

type Props = {
    difficulty: Difficulty;
    onBack: () => void;
};

const BATTLE_TIME_LIMIT = 300; // 5분

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
    '초급': '#6B8F71',
    '중급': '#4A6FA5',
    '마스터': '#7D5A50',
    '대결': '#4A4063',
};

// 올바르게 채운 칸 수 계산
const countFilled = (board: CellType[][]): number =>
    board.flat().filter(c => c.value !== null && !c.isError && !c.isFixed).length;

// 고스트 스냅샷에서 현재 시간에 해당하는 채운 칸 수 보간
const getGhostFilled = (snapshots: GhostSnapshot[], currentTime: number): number => {
    if (snapshots.length === 0) return 0;
    for (let i = snapshots.length - 1; i >= 0; i--) {
        if (snapshots[i].time <= currentTime) return snapshots[i].filled;
    }
    return 0;
};

export default function SudokuBoard({ difficulty, onBack }: Props) {
    const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [time, setTime] = useState(0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isMemoMode, setIsMemoMode] = useState(false);
    const [memos, setMemos] = useState<number[][][]>(
        Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
    );
    const isBattle = difficulty === '대결';

    // 고스트 관련 상태
    const [ghost, setGhost] = useState<GhostRecord | null>(null);
    const [ghostFilled, setGhostFilled] = useState(0);
    const snapshotsRef = useRef<GhostSnapshot[]>([]); // 내 플레이 스냅샷 (5초마다 기록)

    const [{ puzzle: initialPuzzle, solution, puzzleId }] = useState(() => generateGame(difficulty));

    // 빈 칸 총 개수 (진행도 계산용)
    const totalEmpty = initialPuzzle.flat().filter(v => v === null).length;

    const [board, setBoard] = useState<CellType[][]>(() =>
        initialPuzzle.map(row =>
            row.map(cell => ({
                value: cell,
                isFixed: cell !== null,
                isError: false,
            }))
        )
    );

    // 대결 모드: 시작 시 고스트 데이터 로드
    useEffect(() => {
        if (!isBattle) return;
        fetchGhostRecord(difficulty).then(record => {
            if (record) setGhost(record);
        });
    }, [isBattle, difficulty]);

    // 타이머 + 고스트 페이스 + 스냅샷 기록
    useEffect(() => {
        if (isComplete || isTimeUp) return;

        const timer = setInterval(() => {
            setTime(prev => {
                const next = prev + 1;

                if (isBattle && next >= BATTLE_TIME_LIMIT) {
                    setIsTimeUp(true);
                }

                // 5초마다 내 스냅샷 기록
                if (isBattle && next % 5 === 0) {
                    setBoard(currentBoard => {
                        const filled = countFilled(currentBoard);
                        snapshotsRef.current.push({ time: next, filled });
                        return currentBoard;
                    });
                }

                // 고스트 페이스 업데이트
                if (ghost) {
                    setGhostFilled(getGhostFilled(ghost.snapshots, next));
                }

                return next;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isComplete, isTimeUp, isBattle, ghost]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const remainingTime = isBattle ? Math.max(0, BATTLE_TIME_LIMIT - time) : null;

    const handleNumberPress = (num: number) => {
        if (!selected || isComplete || isTimeUp) return;

        const { row, col } = selected;
        if (board[row][col].isFixed) return;

        if (isMemoMode) {
            if (board[row][col].value !== null) return;
            const newMemos = memos.map(r => r.map(c => [...c]));
            const current = newMemos[row][col];
            const idx = current.indexOf(num);
            if (idx >= 0) current.splice(idx, 1);
            else current.push(num);
            setMemos(newMemos);
            return;
        }

        const newBoard = board.map(r => r.map(c => ({ ...c })));
        const isCorrect = solution[row][col] === num;
        newBoard[row][col].value = num;
        newBoard[row][col].isError = !isCorrect;

        const newMemos = memos.map(r => r.map(c => [...c]));
        newMemos[row][col] = [];
        setMemos(newMemos);
        setBoard(newBoard);

        if (checkComplete(newBoard)) {
            setIsComplete(true);
            saveRecord(time, difficulty, newBoard);
        }
    };

    const handleErase = () => {
        if (!selected || isComplete || isTimeUp) return;

        const { row, col } = selected;
        if (board[row][col].isFixed) return;

        const newBoard = board.map(r => r.map(c => ({ ...c })));
        newBoard[row][col].value = null;
        newBoard[row][col].isError = false;
        setBoard(newBoard);

        const newMemos = memos.map(r => r.map(c => [...c]));
        newMemos[row][col] = [];
        setMemos(newMemos);
    };

    const checkComplete = (b: CellType[][]): boolean =>
        b.flat().every(c => c.value !== null && !c.isError);

    const resetGame = () => {
        Alert.alert('Reset Game', '정말 다시 시작할까요?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reset',
                onPress: () => {
                    setBoard(initialPuzzle.map(row =>
                        row.map(cell => ({
                            value: cell,
                            isFixed: cell !== null,
                            isError: false,
                        }))
                    ));
                    setMemos(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));
                    snapshotsRef.current = [];
                    setIsComplete(false);
                    setIsTimeUp(false);
                    setSelected(null);
                    setTime(0);
                    setIsMemoMode(false);
                    setGhostFilled(0);
                },
            },
        ]);
    };

    const saveRecord = async (t: number, diff: Difficulty, finalBoard: CellType[][]) => {
        try {
            // 로컬 기록 저장
            const prev = await AsyncStorage.getItem('records');
            const records = prev ? JSON.parse(prev) : [];
            records.push({ time: t, difficulty: diff, puzzleId, date: new Date().toISOString() });
            await AsyncStorage.setItem('records', JSON.stringify(records));

            // 대결 모드: 고스트 기록 Firestore 업로드
            if (diff === '대결') {
                const finalFilled = countFilled(finalBoard);
                snapshotsRef.current.push({ time: t, filled: finalFilled });
                await uploadGhostRecord({
                    difficulty: diff,
                    totalTime: t,
                    snapshots: snapshotsRef.current,
                    date: new Date().toISOString(),
                });
            }
        } catch (e) {
            console.log('저장 실패', e);
        }
    };

    const playerFilled = countFilled(board);
    const color = DIFFICULTY_COLORS[difficulty];

    return (
        <View style={styles.wrapper}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>← 뒤로</Text>
                </TouchableOpacity>
                <View style={[styles.badge, { backgroundColor: color }]}>
                    <Text style={styles.badgeText}>{difficulty}</Text>
                </View>
            </View>

            {/* 타이머 */}
            <Text style={[styles.timer, isBattle && remainingTime! <= 60 && styles.timerWarning]}>
                {isBattle
                    ? `⏰ 남은 시간: ${formatTime(remainingTime!)}`
                    : `⏱ ${formatTime(time)}`}
            </Text>

            {/* 고스트 진행 바 (대결 모드 + 고스트 있을 때만) */}
            {isBattle && ghost && (
                <GhostProgressBar
                    playerFilled={playerFilled}
                    ghostFilled={ghostFilled}
                    total={totalEmpty}
                />
            )}
            {isBattle && !ghost && (
                <Text style={styles.noGhost}>👻 고스트 데이터 없음 (첫 플레이어!)</Text>
            )}

            {/* 보드 */}
            <View style={styles.board}>
                {board.map((row, i) => (
                    <View key={i} style={styles.row}>
                        {row.map((_, j) => {
                            const isSelected = selected?.row === i && selected?.col === j;
                            const isHighlight = selected && (selected.row === i || selected.col === j);
                            return (
                                <Cell
                                    key={j}
                                    value={board[i][j].value}
                                    memos={memos[i][j]}
                                    isFixed={board[i][j].isFixed}
                                    isError={board[i][j].isError}
                                    isSelected={isSelected}
                                    isHighlight={!!isHighlight && !isSelected}
                                    onPress={() => setSelected({ row: i, col: j })}
                                />
                            );
                        })}
                    </View>
                ))}
            </View>

            <NumberPad
                onPressNumber={handleNumberPress}
                onErase={handleErase}
                isMemoMode={isMemoMode}
                onToggleMemo={() => setIsMemoMode(prev => !prev)}
            />

            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>

            {isComplete && (
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>🎉 Clear!</Text>
                    <Text style={styles.overlayTime}>기록: {formatTime(time)}</Text>
                    {isBattle && ghost && (
                        <Text style={styles.overlayGhost}>
                            {time <= ghost.totalTime ? '👻 고스트 이겼어요!' : '👻 고스트한테 졌어요...'}
                        </Text>
                    )}
                    <TouchableOpacity style={styles.overlayButton} onPress={onBack}>
                        <Text style={styles.overlayButtonText}>홈으로</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isTimeUp && !isComplete && (
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>⏰ 시간 초과!</Text>
                    <TouchableOpacity style={styles.overlayButton} onPress={resetGame}>
                        <Text style={styles.overlayButtonText}>다시 도전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.overlayButton, { backgroundColor: '#999', marginTop: 8 }]} onPress={onBack}>
                        <Text style={styles.overlayButtonText}>홈으로</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 300,
        marginBottom: 8,
    },
    backButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    backText: {
        fontSize: 16,
        color: '#555',
    },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    timer: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    timerWarning: {
        color: '#FF5722',
        fontWeight: 'bold',
    },
    noGhost: {
        fontSize: 12,
        color: '#999',
        marginBottom: 6,
    },
    board: {
        width: 300,
        height: 300,
        borderWidth: 2,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    resetButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#EAEAEA',
    },
    resetText: {
        fontSize: 16,
    },
    overlay: {
        position: 'absolute',
        top: '35%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 14,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        alignItems: 'center',
    },
    overlayText: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    overlayTime: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    overlayGhost: {
        fontSize: 14,
        color: '#9C27B0',
        marginBottom: 16,
    },
    overlayButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
    },
    overlayButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
