# 스타일 가이드

## 개요
이 문서는 pkt-todolist 프로젝트의 UI/UX 및 코드 스타일 가이드입니다.

## 프로젝트 구조

### GitHub 저장소 구조
```
pkt-todolist/
├── .claude/          # Claude AI 설정
├── .gemini/          # Gemini AI 설정
├── .github/          # GitHub 설정
├── .qwen/            # Qwen 설정
├── backend/          # 백엔드 소스
├── database/         # 데이터베이스 스크립트
├── docs/             # 문서
├── frontend/         # 프론트엔드 소스
├── mockup/           # 디자인 목업
└── swagger/          # API 문서
```

### 폴더별 역할
- **.claude/**: Claude AI 관련 설정 파일 및 명령어
- **.gemini/**: Gemini AI 관련 설정
- **.github/**: GitHub Actions, 워크플로우 설정
- **.qwen/**: Qwen AI 관련 설정
- **backend/**: 서버 사이드 애플리케이션 코드
- **database/**: 데이터베이스 마이그레이션, 스키마, 시드 데이터
- **docs/**: 프로젝트 문서 및 가이드
- **frontend/**: 클라이언트 사이드 애플리케이션 코드
- **mockup/**: UI/UX 디자인 목업 파일
- **swagger/**: API 명세서 및 문서

## 코딩 컨벤션

### 명명 규칙
- **변수/함수**: camelCase (예: `getUserData`, `userName`)
- **클래스/컴포넌트**: PascalCase (예: `UserProfile`, `TodoList`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_LENGTH`, `API_URL`)
- **데이터베이스**: snake_case (예: `user_id`, `created_at`)
- **파일명**: kebab-case (예: `user-profile.tsx`, `api-client.ts`)

### 파일 조직
- 기능별로 폴더 구분
- 관심사의 분리 (프론트엔드, 백엔드, 데이터베이스)
- 문서화를 위한 별도 docs 폴더
- AI 도구별 설정 파일 분리

## 버전 관리

### GitHub 사용
- **저장소**: zecool/pkt-todolist
- **가시성**: Public 저장소
- **브랜치**: main 브랜치 기준

### 커밋 메시지
- 간결하고 명확한 메시지 작성
- 영어 또는 한국어 일관성 유지
- 예: "update", "add feature", "fix bug"

## 문서화

### 필수 문서 위치
- **README.md**: 프로젝트 루트
- **API 문서**: swagger/ 폴더
- **프로젝트 가이드**: docs/ 폴더
- **디자인 목업**: mockup/ 폴더

### 문서 작성 원칙
- 복잡한 내용만 문서화
- 자명한 내용은 생략 (오버엔지니어링 금지)
- 모든 문서는 한국어로 작성

## AI 도구 통합

### 지원 AI 도구
- **Claude**: .claude/ 폴더에 설정
- **Gemini**: .gemini/ 폴더에 설정
- **Qwen**: .qwen/ 폴더에 설정

### AI 설정 관리
- 각 AI 도구별 별도 폴더 유지
- 설정 파일과 명령어를 도구별로 격리
- 일관된 디렉토리 구조 유지

## API 문서화

### Swagger 사용
- API 명세는 swagger/ 폴더에 관리
- OpenAPI 표준 준수
- 엔드포인트, 요청/응답 스키마 명시

## 프로젝트 원칙

1. **간결성**: 불필요한 복잡성 배제
2. **일관성**: 명명 규칙 및 구조 일관성 유지
3. **가독성**: 코드와 문서의 가독성 최우선
4. **분리**: 관심사의 명확한 분리 (프론트엔드/백엔드/데이터베이스)
5. **한국어 우선**: 모든 문서 및 커뮤니케이션은 한국어로 작성
6. **오픈소스**: Public 저장소로 투명하게 관리
