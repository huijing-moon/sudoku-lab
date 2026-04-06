import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { SudokuLogo } from '../components/SudokuLogo';

export function LoadingScreen() {
    const logoAnim   = useRef(new Animated.Value(0)).current;
    const titleAnim  = useRef(new Animated.Value(0)).current;
    const dotsAnim   = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
    const barAnim    = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        // 로고 페이드인
        Animated.timing(logoAnim, {
            toValue: 1, duration: 500, useNativeDriver: true,
        }).start();

        // 타이틀 슬라이드업
        Animated.timing(titleAnim, {
            toValue: 1, duration: 500, delay: 300, useNativeDriver: true,
        }).start();

        // 점 애니메이션 (무한 반복)
        const dotLoop = Animated.loop(
            Animated.stagger(200, dotsAnim.map(anim =>
                Animated.sequence([
                    Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0.4, duration: 400, useNativeDriver: true }),
                ])
            ))
        );
        setTimeout(() => dotLoop.start(), 600);

        // 하단 바 슬라이드 (무한 반복)
        const barLoop = Animated.loop(
            Animated.timing(barAnim, {
                toValue: 1, duration: 1500, useNativeDriver: true,
            })
        );
        setTimeout(() => barLoop.start(), 800);
    }, []);

    const logoScale = logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
    const titleY    = titleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
    const barX      = barAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-100%', '100%'] });

    return (
        <View style={styles.container}>
            {/* 로고 */}
            <Animated.View style={{ opacity: logoAnim, transform: [{ scale: logoScale }] }}>
                <SudokuLogo size={140} />
            </Animated.View>

            {/* 타이틀 */}
            <Animated.View style={{ opacity: titleAnim, transform: [{ translateY: titleY }], marginTop: 32 }}>
                <Text style={styles.title}>스도쿠</Text>
            </Animated.View>

            {/* 점 세 개 */}
            <View style={styles.dots}>
                {dotsAnim.map((anim, i) => (
                    <Animated.View
                        key={i}
                        style={[styles.dot, { opacity: anim, transform: [{ scale: anim }] }]}
                    />
                ))}
            </View>

            {/* 로딩 텍스트 */}
            <Text style={styles.loadingText}>로딩중...</Text>

            {/* 하단 슬라이딩 바 */}
            <View style={styles.barBg}>
                <Animated.View style={[styles.bar, { transform: [{ translateX: barX }] }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#764ba2',
    },
    title: {
        fontSize: 36,
        color: '#fff',
        letterSpacing: 2,
        fontWeight: '300',
    },
    dots: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 48,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13,
    },
    barBg: {
        position: 'absolute',
        bottom: 48,
        width: 128,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.25)',
        overflow: 'hidden',
    },
    bar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
});
