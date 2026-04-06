import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type Difficulty = '초급' | '중급' | '마스터' | '대결';

type Props = {
    onSelect: (difficulty: Difficulty) => void;
    onStats: () => void;
};

const difficulties: { label: Difficulty; color: string; description: string }[] = [
    { label: '초급', color: '#6B8F71', description: '쉬운 난이도 · 많은 힌트' },
    { label: '중급', color: '#4A6FA5', description: '보통 난이도 · 적당한 힌트' },
    { label: '마스터', color: '#7D5A50', description: '어려운 난이도 · 최소 힌트' },
    { label: '대결', color: '#4A4063', description: '제한 시간 안에 도전!' },
];

export default function HomeScreen({ onSelect, onStats }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>스도쿠 랩</Text>
            <Text style={styles.subtitle}>난이도를 선택하세요</Text>

            {difficulties.map(({ label, color, description }) => (
                <TouchableOpacity
                    key={label}
                    style={[styles.button, { backgroundColor: color }]}
                    onPress={() => onSelect(label)}
                >
                    <Text style={styles.buttonLabel}>{label}</Text>
                    <Text style={styles.buttonDesc}>{description}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.statsButton} onPress={onStats}>
                <Text style={styles.statsText}>📊 기록 보기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0EDE8',
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2C2C2C',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        marginBottom: 40,
        letterSpacing: 0.5,
    },
    button: {
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 12,
    },
    buttonLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 0.5,
    },
    buttonDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 4,
    },
    statsButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        backgroundColor: '#E2DDD8',
    },
    statsText: {
        fontSize: 15,
        color: '#5A5A5A',
        fontWeight: '500',
    },
});
