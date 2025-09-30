
# 🌳 HearDay - Frontend

## 📌 프로젝트 소개

**HearDay**는 매일 일어나는 다양한 소식을 귀로 들을 수 있는 **AI 기반 뉴스 리스닝 & 지식 성장 플랫폼**입니다. 

본 레포지토리는 **프론트엔드 개발을 담당하는 저장소**입니다.

---

## 🚀 기술 스택

- **App Framework:** `React Native`
- **Language:** `TypeScript`
- **Routing:** `expo-router`
- **Styling:** `NativeWind + TailwindCSS`
- **State Management:** `Recoil` or `Zustand`
- **API Communication:** `Axios`

---

## 📂 디렉토리 구조

.
├── app/                          # expo-router 라우팅 폴더 (자동 라우팅)
│   ├── (tabs)/                   # 탭 네비게이션 그룹
│   │   ├── index.tsx             # 홈 탭
│   │   ├── wishlist.tsx
│   │   ├── shopping.tsx
│   │   └── mypage.tsx
│   ├── login.tsx
│   ├── modal.tsx                 # 모달 라우트 예시
│   └── _layout.tsx               # 공통 레이아웃
│
├── assets/                       # 이미지, 아이콘, 폰트
│   ├── images/
│   └── fonts/
│
├── components/                   # 공용 컴포넌트 (Atomic Design optional)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── common/
│
├── hooks/                        # 커스텀 훅
├── services/                     # API 요청 모듈 (axios 인스턴스 포함)
├── store/                        # 상태관리 (Recoil 또는 Zustand)
│   ├── recoil/
│   └── zustand/
├── types/                        # 전역 타입 정의
├── utils/                        # 유틸 함수
├── styles/                       # 색 팔레트, 테마 토큰 등
│
├── App.tsx                       # Expo 진입 파일 (global.css import, <Slot/>)
├── global.css                    # Tailwind 전역 스타일
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json

---

## 🌱 Git Flow 브랜치 전략

| 브랜치 | 설명 |
| --- | --- |
| main | 서비스 배포 브랜치 |
| develop | 개발 통합 브랜치 |
| fix | 버그 수정 브랜치 |
| feat | 기능 개발 브랜치 |
| chore | 설정, 의존성, yml 등 작업 브랜치 |
| refactor | 리팩토링 브랜치 |
| hotfix | 긴급 수정 브랜치 |

### 📂 브랜치 예시

- `feat/login`
- `feat/home`

---

## 🤝 PR 규칙

### 📌 PR 제목

`[커밋 유형] 작업 내용 요약`

- 예시: `[Feat] 로그인 기능 구현`

### 📌 PR 세부 규칙

- merge 대상: `develop`
- 최소 1명 이상의 코드 리뷰 승인 필요

### 📌 PR 템플릿

```
## 🪺 Summary
(변경한 내용을 간단히 작성)

## 🌱 Issue Number
- #

## 🙏 To Reviewers
(리뷰어에게 전달하고 싶은 말)
```

---

## ✅ Issue Template

```
---
name: 이슈 생성 템플릿
about: 이슈를 생성해주세요.
title: ''
labels: ''
assignees: ''
---

## 📌 Description
이슈 설명

## ✅ Changes
- [ ] 세부 사항 1
- [ ] 세부 사항 2

## 🚀 API
| URL | Method | Usage | Authorization |
| --- | ------ | ----- | ------------- |
| api 경로 | POST | API 설명 | 필요 여부 |

## 💬 Additional Context
추가 내용
```

---

## 📝 Commit Message Convention

| 커밋 유형 | 설명 |
| --- | --- |
| Feat | 새로운 기능 추가 |
| Fix | 버그 수정 |
| Docs | 문서 수정 |
| Style | 코드 포맷팅 |
| Refactor | 코드 리팩토링 |
| Test | 테스트 코드 추가 |
| Chore | 설정 파일 수정 |
| Design | UI/CSS 디자인 수정 |
| Comment | 주석 추가 |
| Rename | 파일/폴더명 수정 |
| Remove | 파일 삭제 |
| !HOTFIX | 긴급 수정 |

### 📌 Commit 작성 예시

```
Feat: 로그인 기능 구현 (#5)

- 로그인 UI 구현
- 회원가입 페이지 연결
- 로그인 실패 시 에러 처리 추가
```

---

## 👩‍💻 팀원 역할

| 이름 | 담당 |
| --- | --- |
| 서진 | Login, SignUp, FindID/ChangePW, Home, AI 토론(음성), AI 토론(채팅), Profile |
| 병훈 | NewsPlaying, NewsArticle, AI 토론 메인, Dictionary, WordBook, SavedNews |

