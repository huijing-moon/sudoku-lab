import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type Props = {
    value: number | null;
    memos: number[];
    isSelected: boolean;
    isHighlight: boolean;
    onPress: () => void;
    isFixed: boolean;
    isError: boolean;
};

export default function Cell({ value, memos, isSelected, isHighlight, onPress, isFixed, isError }: Props) {
    return (
        <TouchableOpacity
            style={[
                styles.cell,
                isSelected && styles.selected,
                isHighlight && styles.highlight,
                isFixed && styles.fixed,
                isError && styles.error,
            ]}
            onPress={onPress}
        >
            {value !== null ? (
                <Text style={[styles.text, isFixed && styles.fixedText]}>{value}</Text>
            ) : memos.length > 0 ? (
                <View style={styles.memoGrid}>
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                        <Text key={n} style={styles.memoText}>
                            {memos.includes(n) ? n : ' '}
                        </Text>
                    ))}
                </View>
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    selected: {
        backgroundColor: '#CB997E',
    },
    highlight: {
        backgroundColor: '#F5E6DA',
    },
    fixed: {
        backgroundColor: '#EAEAEA',
    },
    error: {
        backgroundColor: '#FFCDD2',
    },
    text: {
        fontSize: 18,
    },
    fixedText: {
        fontWeight: 'bold',
        color: '#333',
    },
    memoGrid: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 1,
    },
    memoText: {
        width: '33.33%',
        height: '33.33%',
        fontSize: 7,
        textAlign: 'center',
        color: '#5c6bc0',
    },
});
