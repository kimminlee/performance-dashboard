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
  - **`data-status` Attribute**: 상태 변화(Normal → Error) 시 JS 연산 대신 CSS Selector(`data-[status=error]`)를 활용하여 스타일링 부하를 브라우저 네이티브 엔진으로 이임.
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

```bash
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