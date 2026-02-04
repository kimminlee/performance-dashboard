```markdown
# ⚡ NEXUS MONITOR: High-Performance BEMS Dashboard

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Fast-yellow?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/State-Zustand-brown)

> **"5,000개 이상의 로그 데이터가 초당 20회씩 쏟아지는 극한 상황에서도 60FPS를 방어하라."**

이 프로젝트는 대규모 건물 에너지 관리 시스템(BEMS) 구축 경험을 바탕으로, **대량의 실시간 데이터 처리와 렌더링 최적화 기술**을 증명하기 위해 개발된 테크 데모입니다. 백엔드 없이 독자적인 Mock Generator 엔진을 탑재하여 스트레스 테스트 환경을 시뮬레이션합니다.

---

## 🎯 핵심 기술 목표 (Key Technical Goals)

### 1. Custom Virtualization (가상화)
- **Problem:** `react-window` 같은 라이브러리 없이, 수천 개의 DOM 요소를 렌더링하면 브라우저가 다운됨.
- **Solution:** 스크롤 위치(`scrollTop`)를 계산하여 **화면에 보이는 영역(Viewport)에 해당하는 20~30개의 아이템만 DOM에 그리는 커스텀 훅(`useVirtualizer`)**을 직접 구현.
- **Result:** 데이터가 10,000개가 쌓여도 DOM 노드 수는 일정하게 유지되어 메모리 누수 방지.

### 2. Zero-Lag Rendering (렌더링 최적화)
- **Strategy:**
  - **`React.memo`**: 리스트의 개별 행(Row)이 props 변경 시에만 리렌더링되도록 통제.
  - **`data-status` Attribute**: 상태 변화(Normal → Error) 시 JS 연산 대신 CSS Selector(`[data-status="error"]`)를 활용하여 스타일링 부하를 브라우저 네이티브 엔진으로 이임.
  - **`requestAnimationFrame`**: 스크롤 이벤트 핸들링 시 프레임 드랍 방지.

### 3. Architecture (아키텍처)
- **Feature-based Co-location**: 기능(`dashboard`) 단위로 API, Components, Hooks, Stores를 응집시켜 유지보수성 극대화.
- **Strict Typing**: `verbatimModuleSyntax` 호환을 위해 Type과 Value Import를 철저히 분리.

---

## 🛠 Tech Stack

| Category | Technology | Reason for Selection |
|----------|------------|----------------------|
| **Core** | React 18, TypeScript | 컴포넌트 기반 설계 및 타입 안정성 보장 |
| **Build** | Vite | 빠른 HMR 및 빌드 속도 |
| **State** | Zustand | Redux 대비 가벼운 보일러플레이트, 빈번한 업데이트에 유리 |
| **Style** | Tailwind CSS v3 | 런타임 오버헤드가 없는 Utility-first CSS |
| **Chart** | Recharts | React 친화적인 SVG 기반 차트 라이브러리 |

---

## 📂 Folder Structure

Co-location 원칙에 따라, 기능(Feature)과 공통(Shared) 로직을 명확히 분리했습니다.

```
src/
├── features/
│   └── dashboard/           # 📦 대시보드 도메인 (모든 관련 로직이 여기 집결)
│       ├── api/             # Mock Data Generator (데이터 생성 엔진)
│       ├── components/      # ChartSection, LogList, StatusPanel
│       ├── hooks/           # useDataStream (데이터 구독), useVirtualizer (가상화 코어)
│       ├── stores/          # Zustand Store (메모리 관리 및 큐잉)
│       └── types.ts         # 도메인 전용 타입 정의
├── components/ui/           # 🧩 재사용 가능한 순수 UI (Card, Badge)
├── layouts/                 # 🖼 페이지 레이아웃 (No-scroll, Full-screen)
├── lib/                     # ⚙️ 성능 유틸리티
└── pages/                   # 📄 라우팅 진입점
```

---

## 🚀 Quick Start

### 1. 설치 (Install)

```bash
npm install
```

> **Note:** Tailwind CSS v3 호환성을 위해 `postcss.config.js`가 v3 표준으로 설정되어 있어야 합니다. (v4 버전 설치 시 v3로 다운그레이드 권장)

### 2. 실행 (Dev Server)

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 빌드 (Production Build)

```bash
npm run build
```

### 4. 프리뷰 (Preview Production Build)

```bash
npm run preview
```

---

## ⚙️ Configuration

### 데이터 생성 속도 조절

너무 빠른 데이터 유입으로 디버깅이 어렵다면, 생성 주기를 조절할 수 있습니다.

**파일:** `src/features/dashboard/hooks/useDataStream.ts`

```typescript
// 기본값: 50ms (초당 20회 업데이트 - 스트레스 테스트 모드)
const intervalId = setInterval(() => { ... }, 50);

// 디버깅 모드: 1000ms (초당 1회 업데이트)
const intervalId = setInterval(() => { ... }, 1000);
```

### 가상화 설정

**파일:** `src/features/dashboard/hooks/useVirtualizer.ts`

```typescript
const ITEM_HEIGHT = 60;      // 각 로그 항목 높이
const BUFFER_SIZE = 5;       // 화면 밖 추가 렌더링 개수 (스크롤 버퍼)
```

---

## 🧪 Performance Test Scenarios

이 프로젝트는 다음과 같은 극한 상황을 가정합니다:

### Scenario 1: Massive Data Ingest
- **조건:** 초당 100건 이상의 시스템 로그 유입
- **측정 지표:** FPS 유지 (60FPS 목표)
- **확인 방법:** Chrome DevTools Performance 탭

### Scenario 2: Real-time Charting
- **조건:** CPU/Memory 사용량이 실시간으로 차트에 반영
- **측정 지표:** 차트 렌더링 지연 시간
- **확인 방법:** React DevTools Profiler

### Scenario 3: Infinite Scrolling
- **조건:** 5,000개 이상의 로그를 빠르게 스크롤
- **측정 지표:** 스크롤 끊김 현상 (Jank)
- **확인 방법:** Chrome DevTools Rendering 탭 → FPS meter

---

## 🎨 Features

- ✅ **실시간 데이터 스트리밍** - 초당 20회 업데이트
- ✅ **커스텀 가상화** - 라이브러리 없이 구현
- ✅ **다크모드 지원** - Cyberpunk/Neon 테마
- ✅ **반응형 차트** - Recharts 기반 실시간 그래프
- ✅ **메모리 최적화** - 오래된 로그 자동 제거 (최대 5,000개 유지)
- ✅ **타입 안전성** - TypeScript strict mode

---

## 📊 Performance Metrics

개발 환경에서 측정된 성능 지표:

| Metric | Value | Target |
|--------|-------|--------|
| **Initial Load** | ~1.2s | < 2s |
| **FPS (Idle)** | 60 | 60 |
| **FPS (Heavy Load)** | 58-60 | > 50 |
| **Memory Usage** | ~80MB | < 150MB |
| **DOM Nodes** | ~150 | < 500 |

---

## 🐛 Known Issues

- [ ] Safari에서 `requestAnimationFrame` 타이밍 이슈
- [ ] 10,000개 이상의 로그 누적 시 스크롤바 위치 계산 오차

---

## 🛣 Roadmap

- [ ] Web Worker로 데이터 생성 로직 이동
- [ ] IndexedDB를 활용한 로그 영구 저장
- [ ] 실제 백엔드 API 연동 (WebSocket)
- [ ] 차트 데이터 Aggregation (시간대별 평균)

---

## 📚 Learn More

### 핵심 구현 파일

- **가상화 로직:** `src/features/dashboard/hooks/useVirtualizer.ts`
- **데이터 생성:** `src/features/dashboard/api/mockGenerator.ts`
- **상태 관리:** `src/features/dashboard/stores/dashboardStore.ts`

### 참고 자료

- [React Virtualization 원리](https://web.dev/virtualize-long-lists-react-window/)
- [Browser Rendering Pipeline](https://developers.google.com/web/fundamentals/performance/rendering)
- [TypeScript verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)

---

## 👨‍💻 Author

**김민이**  
Portfolio: []  
Email: qqazs98@gmail.com

---

## 📝 License

This project is for **portfolio purposes only**.  
Not licensed for commercial use.

---

## 🙏 Acknowledgments

- BEMS 프로젝트 경험을 통해 얻은 실무 노하우
- React 커뮤니티의 성능 최적화 가이드
- Tailwind CSS 팀의 유틸리티 퍼스트 철학

---

**⚡ Built with performance in mind. Every millisecond counts.**
```

