import React from 'react';
import { View, StyleSheet } from 'react-native';
import SudokuBoard from '../components/SudokuBoard';
import { Difficulty } from './HomeScreen';

type Props = {
    difficulty: Difficulty;
    onBack: () => void;
};

export default function GameScreen({ difficulty, onBack }: Props) {
    return (
        <View style={styles.container}>
            <SudokuBoard difficulty={difficulty} onBack={onBack} />
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
