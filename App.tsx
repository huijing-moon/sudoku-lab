import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import GameScreen from './src/screens/GameScreen';

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GameScreen />
            <Button title="Stats" onPress={() => navigation.navigate('Stats')} />
        </SafeAreaView>
    );
}