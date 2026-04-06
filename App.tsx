import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen, { Difficulty } from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import StatsScreen from './src/screens/StatsScreen';

type Screen = 'home' | 'game' | 'stats';

export default function App() {
    const [screen, setScreen] = useState<Screen>('home');
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {screen === 'home' && (
                <HomeScreen
                    onSelect={(d) => { setDifficulty(d); setScreen('game'); }}
                    onStats={() => setScreen('stats')}
                />
            )}
            {screen === 'game' && difficulty && (
                <GameScreen difficulty={difficulty} onBack={() => setScreen('home')} />
            )}
            {screen === 'stats' && (
                <StatsScreen onBack={() => setScreen('home')} />
            )}
        </SafeAreaView>
    );
}
