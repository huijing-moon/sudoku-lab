import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import Cell from './Cell';
import NumberPad from './NumberPad';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CellType = {
    value: number | null;
    isFixed: boolean;
    isError: boolean;
};


export default function SudokuBoard() {
    const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (isComplete) return;

        const timer = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isComplete]);


    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;

        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    const initialPuzzle = [
        [5,3,null,null,7,null,null,null,null],
        [6,null,null,1,9,5,null,null,null],
        [null,9,8,null,null,null,null,6,null],

        [8,null,null,null,6,null,null,null,3],
        [4,null,null,8,null,3,null,null,1],
        [7,null,null,null,2,null,null,null,6],

        [null,6,null,null,null,null,2,8,null],
        [null,null,null,4,1,9,null,null,5],
        [null,null,null,null,8,null,null,7,9],
    ];

    const solution = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],

        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],

        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9],
    ];

    const [board, setBoard] = useState(
        initialPuzzle.map((row, i) =>
            row.map((cell, j) => ({
                value: cell,
                isFixed: cell !== null,
                isError: false,
            }))
        )
    );
    const handleNumberPress = (num: number) => {
        if (!selected) return;

        const { row, col } = selected;

        if (board[row][col].isFixed) return;

        const newBoard = board.map(r => r.map(c => ({ ...c })));

        const isCorrect = solution[row][col] === num;

        newBoard[row][col].value = num;
        newBoard[row][col].isError = !isCorrect;

        setBoard(newBoard);

        if (checkComplete(newBoard)) {
            setIsComplete(true);
            saveRecord(time);
        }
    };
    const handleErase = () => {
        if (!selected) return;

        const { row, col } = selected;

        if (board[row][col].isFixed) return;

        const newBoard = board.map(r => r.map(c => ({ ...c })));

        newBoard[row][col].value = null;
        newBoard[row][col].isError = false;

        setBoard(newBoard);
    };

    const checkComplete = (board: any) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = board[i][j];

                if (cell.value === null) return false;
                if (cell.isError) return false;
            }
        }
        return true;
    };



    const resetGame = () => {
        Alert.alert(
            'Reset Game',
            '정말 다시 시작할까요?',
            [
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
                        setIsComplete(false);
                        setSelected(null);
                    },
                },
            ]
        );
    };

    const saveRecord = async (time: number) => {
        try {
            const prev = await AsyncStorage.getItem('records');
            const records = prev ? JSON.parse(prev) : [];

            const newRecord = {
                time,
                date: new Date().toISOString(),
            };

            records.push(newRecord);

            await AsyncStorage.setItem('records', JSON.stringify(records));
        } catch (e) {
            console.log('저장 실패', e);
        }
    };
    return (
        <View>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>
                ⏱ {formatTime(time)}
            </Text>
            <View style={styles.board}>
                {board.map((row, i) => (
                    <View key={i} style={styles.row}>
                        {row.map((_, j) => {
                            const isSelected = selected?.row === i && selected?.col === j;

                            const isHighlight =
                                selected &&
                                (selected.row === i || selected.col === j);

                            return (
                                <Cell
                                    key={j}
                                    value={board[i][j].value}
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
            />
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            {isComplete && (
                <View style={styles.clearContainer}>
                    <Text style={styles.clearText}>🎉 Clear!</Text>
                </View>
            )}
        </View>


    );
}

const styles = StyleSheet.create({
    board: {
        width: 300,
        height: 300,
        borderWidth: 2,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    clearContainer: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    clearText: {
        fontSize: 24,
        fontWeight: 'bold',
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
});
