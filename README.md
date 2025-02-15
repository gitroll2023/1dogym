# 1도GYM

1도GYM의 공식 웹사이트입니다. Next.js 13을 사용하여 개발되었습니다.

## 기능

- 회원 신청 폼
- 관리자 페이지
  - 신청자 목록 관리
  - 신청자 정보 복사
  - Excel 다운로드
  - 검색 및 필터링
- 카카오톡 미리보기

## 기술 스택

- Next.js 13
- TypeScript
- Tailwind CSS
- SQLite (Prisma)

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
```

## 라이선스

All rights reserved.
