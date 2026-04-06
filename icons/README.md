# 스도쿠 앱 아이콘 및 이미지 가이드

## 📱 생성된 파일 목록

### 앱 아이콘
- **app-icon.svg** (1024x1024) - App Store 및 고해상도 디스플레이용 메인 아이콘
- **app-icon-small.svg** (180x180) - iPhone 홈 화면용 아이콘
- **favicon.svg** (32x32) - 웹 브라우저 파비콘

### 스플래시 스크린
- **splash-screen.svg** (1170x2532) - iPhone Pro Max 스플래시 화면

## 🎨 디자인 특징

### 컬러 팔레트
- **메인 그라데이션**: #667eea → #764ba2
- **액센트 컬러**: #f093fb
- **텍스트**: 흰색 (다양한 투명도)

### iOS 디자인 규격
- 아이콘 모서리 반경: 22% (iOS 표준)
- 그리드: 9x9 스도쿠 격자
- 3x3 섹션 구분선 강조
- 샘플 숫자 배치로 시각적 흥미 유발

## 📐 사용 가이드

### 웹 앱에서 사용
```html
<!-- favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/icons/app-icon-small.svg">

<!-- PWA manifest -->
<link rel="manifest" href="/manifest.json">
```

### manifest.json 예시
```json
{
  "name": "스도쿠",
  "short_name": "스도쿨",
  "icons": [
    {
      "src": "/icons/app-icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    },
    {
      "src": "/icons/app-icon-small.svg",
      "sizes": "180x180",
      "type": "image/svg+xml"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#764ba2"
}
```

## 🔄 PNG 변환이 필요한 경우

iOS 앱 스토어 제출을 위해서는 PNG 형식이 필요합니다:

### 필요한 사이즈
- 1024x1024 (App Store)
- 180x180 (iPhone @3x)
- 167x167 (iPad Pro)
- 152x152 (iPad @2x)
- 120x120 (iPhone @2x/3x)
- 76x76 (iPad)

### 변환 도구
- [Figma](https://figma.com) - SVG 업로드 후 PNG로 export
- [ImageMagick](https://imagemagick.org) - CLI 변환
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - 온라인 최적화

## 📝 라이센스
이 아이콘들은 스도쿠 앱 프로젝트를 위해 제작되었습니다.
