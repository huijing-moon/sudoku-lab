import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PlayRecord = {
    time: number;
    difficulty: string;
    date: string;
};

type Props = {
    onBack: () => void;
};

const DIFFICULTY_COLORS: Record<string, string> = {
    '초급': '#4CAF50',
    '중급': '#2196F3',
    '마스터': '#FF5722',
    '대결': '#9C27B0',
};

function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function StatsScreen({ onBack }: Props) {
    const [records, setRecords] = useState<PlayRecord[]>([]);

    useEffect(() => {
        AsyncStorage.getItem('records').then(data => {
            if (data) setRecords(JSON.parse(data).reverse());
        });
    }, []);

    const clearRecords = async () => {
        await AsyncStorage.removeItem('records');
        setRecords([]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>← 뒤로</Text>
                </TouchableOpacity>
                <Text style={styles.title}>📊 기록</Text>
                <TouchableOpacity onPress={clearRecords} style={styles.clearButton}>
                    <Text style={styles.clearText}>초기화</Text>
                </TouchableOpacity>
            </View>

            {records.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>아직 기록이 없어요</Text>
                    <Text style={styles.emptySubText}>게임을 완료하면 여기에 기록됩니다</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.list}>
                    {records.map((r, i) => (
                        <View key={i} style={styles.card}>
                            <View style={styles.cardLeft}>
                                <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLORS[r.difficulty] ?? '#999' }]}>
                                    <Text style={styles.badgeText}>{r.difficulty ?? '알 수 없음'}</Text>
                                </View>
                                <Text style={styles.date}>{formatDate(r.date)}</Text>
                            </View>
                            <Text style={styles.time}>{formatTime(r.time)}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    backText: {
        fontSize: 16,
        color: '#555',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    clearButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    clearText: {
        fontSize: 14,
        color: '#E53935',
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    date: {
        fontSize: 13,
        color: '#888',
    },
    time: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#BBB',
    },
});
