import React from 'react';
import { View, StyleSheet } from 'react-native';
import SudokuBoard from '../components/SudokuBoard';

export default function GameScreen() {
    return (
        <View style={styles.container}>
            <SudokuBoard />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});