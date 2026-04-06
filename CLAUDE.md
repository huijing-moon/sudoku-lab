# sudokuLab — CLAUDE.md

## 프로젝트 개요

React Native(0.84.1) 기반 스도쿠 게임 앱. iOS/Android 동시 지원.
로딩 → 난이도 선택(초급·중급·마스터·대결) → 게임 플레이 → 기록 저장 흐름으로 구성.

---

## 기술 스택

| 항목 | 버전 |
|---|---|
| React Native | 0.84.1 |
| React | 19.2.3 |
| TypeScript | ^5.8.3 |
| AsyncStorage | ^1.23.1 |
| Firebase (Firestore) | ^12.11.0 |
| Zustand | ^5.0.12 |
| react-native-safe-area-context | ^5.5.2 |
| react-native-svg | ^15.15.4 |

> React Navigation 미사용. 화면 전환은 `App.tsx`의 `useState`로 직접 관리.

---

## 폴더 구조

```
sudokuLab/
├── App.tsx                          # 루트: loading → home → game/stats 전환
├── index.js                         # 앱 엔트리포인트
├── app.json                         # 앱 이름: 스도쿠
├── manifest.json                    # PWA manifest
├── favicon.svg                      # 브라우저 파비콘
├── icons/                           # 앱 아이콘 원본 SVG
│   ├── app-icon.svg                 # 1024x1024
│   ├── app-icon-small.svg           # 180x180
│   └── splash-screen.svg            # 스플래시
├── scripts/
│   ├── generateIcons.js             # SVG → PNG 아이콘 변환 스크립트
│   └── bundlePuzzles.js             # 퍼즐 txt → JSON 번들 변환 스크립트
├── src/
│   ├── assets/
│   │   └── puzzles/                 # 번들된 퍼즐 JSON (각 2,000개)
│   │       ├── easy.json
│   │       ├── medium.json
│   │       ├── hard.json
│   │       └── diabolical.json
│   ├── screens/
│   │   ├── LoadingScreen.tsx        # 앱 시작 로딩 화면 (2초, 애니메이션)
│   │   ├── HomeScreen.tsx           # 난이도 선택 화면
│   │   ├── GameScreen.tsx           # 게임 화면 래퍼
│   │   └── StatsScreen.tsx          # 기록 화면 (난이도 뱃지, 날짜, 초기화)
│   ├── components/
│   │   ├── SudokuLogo.tsx           # 스도쿠 그리드 로고 (Animated)
│   │   ├── SudokuBoard.tsx          # 핵심 게임 로직 (퍼즐·타이머·메모·고스트)
│   │   ├── Cell.tsx                 # 개별 셀 (일반값 / 메모 3×3 그리드)
│   │   ├── NumberPad.tsx            # 숫자 입력패드 + 메모 토글
│   │   └── GhostProgressBar.tsx     # 대결 모드 나 vs 고스트 진행 바
│   └── utils/
│       ├── firebase.ts              # Firebase 초기화 (프로젝트: hye-sudokulab)
│       ├── ghostService.ts          # Firestore 고스트 기록 업로드/조회
│       └── puzzleGenerator.ts       # 퍼즐 생성 (셔플·난이도별 제거)
├── android/
└── ios/
```

---

## 화면 흐름

```
App.tsx (screen: 'loading' | 'home' | 'game' | 'stats')
 ├─ loading  → LoadingScreen (2초 후 home으로 자동 전환)
 ├─ home     → HomeScreen (난이도 선택 / 기록 보기)
 ├─ game     → GameScreen → SudokuBoard
 │                           └─ 완료/시간초과 → 홈으로 버튼
 └─ stats    → StatsScreen (← 뒤로 버튼)
```

---

## 핵심 컴포넌트

### `HomeScreen.tsx`
- Props: `onSelect(difficulty: Difficulty) => void`, `onStats: () => void`
- `Difficulty` 타입: `'초급' | '중급' | '마스터' | '대결'`
- 색상: 초급 #6B8F71 / 중급 #4A6FA5 / 마스터 #7D5A50 / 대결 #4A4063

### `SudokuBoard.tsx`
- Props: `difficulty: Difficulty`, `onBack: () => void`
- 퍼즐 생성: `puzzleGenerator.ts`의 `generateGame(difficulty)` 사용
  - 번들된 JSON에서 랜덤 1개 선택 (유일해 보장)
  - 초급 → easy.json / 중급 → medium.json / 마스터 → diabolical.json / 대결 → hard.json
- 메모 상태: `memos: number[][][]` (9×9, 각 칸에 후보 숫자 목록)
- 기록 저장: AsyncStorage `records` 키에 `{ time, difficulty, puzzleId, date }` 누적
- 대결 모드 완료 시: Firestore `ghosts` 컬렉션에 스냅샷 업로드

### `GhostProgressBar.tsx`
- Props: `playerFilled`, `ghostFilled`, `total`
- 대결 모드에서 나 vs 고스트 진행 바 표시
- 고스트가 앞서면 경고 텍스트 표시

### `ghostService.ts`
- `uploadGhostRecord`: 게임 완료 시 Firestore 업로드
- `fetchGhostRecord`: 같은 난이도 상위 10개 중 랜덤 1개 조회
- 스냅샷 구조: `{ time: number, filled: number }[]` (5초마다 기록)

---

## 개발 명령어

```bash
# 의존성 설치
npm install

# iOS pod 설치 (ios 디렉토리에서)
cd ios && pod install

# iOS 실행 (Metro 별도 실행 중일 때)
npm run ios -- --no-packager

# Android 실행
npm run android

# Metro 번들러
npm start

# 타입 검사
npx tsc --noEmit

# 아이콘 PNG 생성 (icons/*.svg → iOS/Android 각 사이즈)
node scripts/generateIcons.js

# 퍼즐 JSON 재생성 (원본 txt 파일: puzzles-src/, git 제외 대용량)
# easy.txt / medium.txt / hard.txt / diabolical.txt → src/assets/puzzles/*.json
node scripts/bundlePuzzles.js
```

---

## 주요 상태 구조 (SudokuBoard)

```typescript
board: CellType[][]        // 9×9, { value, isFixed, isError }
memos: number[][][]        // 9×9, 각 칸의 메모 숫자 목록
selected: { row, col } | null
isMemoMode: boolean
time: number               // 경과 시간(초)
isComplete: boolean
isTimeUp: boolean          // 대결 모드 전용
ghost: GhostRecord | null  // 대결 모드 고스트 데이터
ghostFilled: number        // 현재 시간 기준 고스트가 채운 칸 수
```

---

## Firebase

- 프로젝트 ID: `hye-sudokulab`
- 사용 서비스: Firestore Database
- 컬렉션: `ghosts` (고스트 기록), `test` (연결 테스트용, 삭제 가능)
- 인덱스: `difficulty ASC + totalTime ASC` (복합 인덱스, 콘솔에서 생성 완료)
- 현재 규칙: `allow read, write: if true` → **배포 전 반드시 강화 필요**

---

## 알려진 미완성 사항 / 할 일

### 필수
- [ ] 실제 기기(아이폰)에서 테스트
- [ ] 대결 모드 완료 → Firestore 고스트 데이터 적재 확인
- [ ] Firestore 보안 규칙 강화 (현재 완전 개방, 30일 후 자동 차단)

### 게임 완성도
- [x] 퍼즐 유일해답 검증 (번들 JSON 방식으로 전환, 유일해 보장)
- [ ] 오답 횟수 제한 (예: 3번 틀리면 게임 오버)
- [ ] 기록 화면 난이도별 필터링 / 최고 기록 하이라이트

### 배포 준비
- [ ] Apple Developer Program 가입 ($99/년)
- [ ] App Store 스크린샷 촬영 (6.7인치, 6.1인치 등)
- [ ] 개인정보 처리방침 페이지 작성
- [ ] Xcode에서 AppIcon PNG 정상 적용 확인

### 선택
- [ ] 햅틱 피드백 (숫자 입력 시 진동)
- [ ] 다크 모드 지원
- [ ] Zustand 활용 (설치만 되고 현재 미사용)
