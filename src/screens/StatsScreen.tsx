import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatsScreen() {
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        const data = await AsyncStorage.getItem('records');
        if (data) setRecords(JSON.parse(data));
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20 }}>기록</Text>

            {records.map((r, i) => (
                <Text key={i}>
                    {i + 1}. {r.time}초
                </Text>
            ))}
        </View>
    );
}