import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
    onPressNumber: (num: number) => void;
    onErase: () => void;
    isMemoMode: boolean;
    onToggleMemo: () => void;
};

export default function NumberPad({ onPressNumber, onErase, isMemoMode, onToggleMemo }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {[1,2,3,4,5,6,7,8,9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.button}
                        onPress={() => onPressNumber(num)}
                    >
                        <Text style={styles.text}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.eraseButton} onPress={onErase}>
                    <Text style={styles.eraseText}>지우기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.memoButton, isMemoMode && styles.memoButtonActive]}
                    onPress={onToggleMemo}
                >
                    <Text style={[styles.memoText, isMemoMode && styles.memoTextActive]}>
                        ✏️ 메모 {isMemoMode ? 'ON' : 'OFF'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 300,
    },
    button: {
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 12,
    },
    eraseButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#FFEBEE',
    },
    eraseText: {
        color: '#E53935',
        fontSize: 15,
        fontWeight: '600',
    },
    memoButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#EEE',
    },
    memoButtonActive: {
        backgroundColor: '#5c6bc0',
    },
    memoText: {
        fontSize: 15,
        color: '#555',
        fontWeight: '600',
    },
    memoTextActive: {
        color: '#fff',
    },
});
