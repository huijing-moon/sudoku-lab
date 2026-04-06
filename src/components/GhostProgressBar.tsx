import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    playerFilled: number;
    ghostFilled: number;
    total: number; // 빈 칸 총 개수
};

export default function GhostProgressBar({ playerFilled, ghostFilled, total }: Props) {
    const playerRatio = Math.min(playerFilled / total, 1);
    const ghostRatio = Math.min(ghostFilled / total, 1);
    const playerAhead = playerFilled >= ghostFilled;

    return (
        <View style={styles.container}>
            {/* 나 */}
            <View style={styles.row}>
                <Text style={styles.label}>나</Text>
                <View style={styles.barBg}>
                    <View style={[styles.bar, styles.playerBar, { width: `${playerRatio * 100}%` }]} />
                </View>
                <Text style={[styles.count, playerAhead && styles.ahead]}>{playerFilled}</Text>
            </View>

            {/* 고스트 */}
            <View style={styles.row}>
                <Text style={styles.label}>👻</Text>
                <View style={styles.barBg}>
                    <View style={[styles.bar, styles.ghostBar, { width: `${ghostRatio * 100}%` }]} />
                </View>
                <Text style={[styles.count, !playerAhead && styles.ahead]}>{ghostFilled}</Text>
            </View>

            {!playerAhead && (
                <Text style={styles.warning}>고스트가 앞서고 있어요!</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        marginBottom: 8,
        gap: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    label: {
        width: 24,
        fontSize: 13,
        color: '#555',
    },
    barBg: {
        flex: 1,
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 5,
    },
    playerBar: {
        backgroundColor: '#4A4063',
    },
    ghostBar: {
        backgroundColor: '#BDBDBD',
    },
    count: {
        width: 22,
        fontSize: 12,
        textAlign: 'right',
        color: '#888',
    },
    ahead: {
        color: '#9C27B0',
        fontWeight: 'bold',
    },
    warning: {
        fontSize: 11,
        color: '#FF5722',
        textAlign: 'center',
        marginTop: 2,
    },
});
