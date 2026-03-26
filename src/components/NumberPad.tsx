import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
    onPressNumber: (num: number) => void;
    onErase: () => void;
};

export default function NumberPad({ onPressNumber, onErase }: Props) {
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

            <TouchableOpacity style={styles.erase} onPress={onErase}>
                <Text style={styles.eraseText}>Erase</Text>
            </TouchableOpacity>
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
    erase: {
        marginTop: 10,
    },
    eraseText: {
        color: 'red',
    },
});