import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen, { Difficulty } from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import StatsScreen from './src/screens/StatsScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';

type Screen = 'loading' | 'home' | 'game' | 'stats';

export default function App() {
    const [screen, setScreen] = useState<Screen>('loading');
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setScreen('home'), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (screen === 'loading') {
        return <LoadingScreen />;
    }

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
