import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { Difficulty } from '../screens/HomeScreen';

export type GhostSnapshot = {
    time: number;   // 경과 시간 (초)
    filled: number; // 올바르게 채운 칸 수
};

export type GhostRecord = {
    id?: string;
    difficulty: Difficulty;
    totalTime: number;
    snapshots: GhostSnapshot[];
    date: string;
};

const COLLECTION = 'ghosts';

// 고스트 기록 업로드 (게임 완료 시)
export const uploadGhostRecord = async (record: Omit<GhostRecord, 'id'>): Promise<void> => {
    try {
        await addDoc(collection(db, COLLECTION), record);
    } catch (e) {
        console.warn('고스트 업로드 실패:', e);
    }
};

// 같은 난이도의 고스트 기록 가져오기 (상위 10개 중 랜덤 1개)
export const fetchGhostRecord = async (difficulty: Difficulty): Promise<GhostRecord | null> => {
    try {
        const q = query(
            collection(db, COLLECTION),
            where('difficulty', '==', difficulty),
            orderBy('totalTime', 'asc'),
            limit(10),
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<GhostRecord, 'id'>) }));
        // 상위 10개 중 랜덤 선택 (항상 1등만 나오지 않도록)
        return docs[Math.floor(Math.random() * docs.length)];
    } catch (e) {
        console.warn('고스트 불러오기 실패:', e);
        return null;
    }
};
