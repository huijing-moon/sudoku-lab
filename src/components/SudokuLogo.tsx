import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const HIGHLIGHTED: [number, number][] = [
    [0, 4],
    [1, 3], [1, 4], [1, 5],
    [2, 2], [2, 6],
    [3, 1], [3, 7],
    [4, 0], [4, 4], [4, 8],
    [5, 1], [5, 7],
    [6, 2], [6, 6],
    [7, 3], [7, 4], [7, 5],
    [8, 4],
];

const NUMBERS: { row: number; col: number; num: string }[] = [
    { row: 1, col: 4, num: '9' },
    { row: 4, col: 0, num: '1' },
    { row: 4, col: 4, num: '5' },
    { row: 4, col: 8, num: '9' },
    { row: 7, col: 4, num: '9' },
];

const isHighlighted = (r: number, c: number) =>
    HIGHLIGHTED.some(([hr, hc]) => hr === r && hc === c);

const getNumber = (r: number, c: number) =>
    NUMBERS.find(n => n.row === r && n.col === c)?.num ?? null;

export function SudokuLogo({ size = 120 }: { size?: number }) {
    const cellSize = size / 9;
    const anims = useRef(HIGHLIGHTED.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const animations = HIGHLIGHTED.map((_, i) =>
            Animated.timing(anims[i], {
                toValue: 1,
                duration: 300,
                delay: i * 30,
                useNativeDriver: true,
            })
        );
        Animated.stagger(30, animations).start();
    }, []);

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.18 }]}>
            {Array.from({ length: 9 }).map((_, row) => (
                <View key={row} style={{ flexDirection: 'row' }}>
                    {Array.from({ length: 9 }).map((_, col) => {
                        const highlighted = isHighlighted(row, col);
                        const num = getNumber(row, col);
                        const idx = HIGHLIGHTED.findIndex(([r, c]) => r === row && c === col);
                        const thick = (n: number) => n % 3 === 0;

                        const cell = (
                            <View
                                style={[
                                    {
                                        width: cellSize,
                                        height: cellSize,
                                        borderTopWidth: thick(row) ? 1.5 : 0.4,
                                        borderLeftWidth: thick(col) ? 1.5 : 0.4,
                                        borderBottomWidth: row === 8 ? (thick(row + 1) ? 1.5 : 0.4) : 0,
                                        borderRightWidth: col === 8 ? (thick(col + 1) ? 1.5 : 0.4) : 0,
                                        borderColor: 'rgba(255,255,255,0.35)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    highlighted && styles.highlightedCell,
                                ]}
                            >
                                {num && (
                                    <Text style={[styles.num, { fontSize: cellSize * 0.52 }]}>
                                        {num}
                                    </Text>
                                )}
                            </View>
                        );

                        if (!highlighted) return <View key={col}>{cell}</View>;

                        return (
                            <Animated.View
                                key={col}
                                style={{ opacity: anims[idx], transform: [{ scale: anims[idx] }] }}
                            >
                                {cell}
                            </Animated.View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#764ba2',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
    highlightedCell: {
        backgroundColor: 'rgba(255,255,255,0.88)',
    },
    num: {
        color: '#5856D6',
        fontWeight: '600',
    },
});
