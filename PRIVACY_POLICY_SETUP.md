# 개인정보처리방침 설정 가이드

## ✅ 직접 작성 가능합니다!

개인정보처리방침은 개발자가 직접 작성할 수 있습니다. 다만 법적 문서이므로 신중하게 작성하시기 바랍니다.

## 📝 작성 전 체크리스트

- [ ] 앱에서 수집하는 모든 정보 명시
- [ ] 각 권한의 사용 목적 명확히 설명
- [ ] 제3자 서비스 사용 시 해당 서비스 명시
- [ ] 사용자 권리 및 연락처 정보 포함
- [ ] 이메일 주소 등 연락처 정보를 실제 정보로 변경

## 🌐 웹에 호스팅하기

개인정보처리방침을 웹에 공개해야 합니다. 다음 방법 중 하나를 선택하세요:

### 방법 1: GitHub Pages (무료, 추천) ⭐

1. **GitHub 저장소 생성**

   - GitHub에 새 저장소 생성 (예: `privacy-policy` 또는 기존 저장소 사용)
   - 저장소를 Public으로 설정

2. **파일 업로드**

   - `PRIVACY_POLICY.md` 파일을 저장소에 업로드
   - 또는 Markdown을 HTML로 변환하여 `index.html`로 저장

3. **GitHub Pages 활성화**

   - 저장소 Settings > Pages
   - Source를 "main" 브랜치로 설정
   - Save 클릭

4. **URL 확인**
   - URL 형식: `https://[사용자명].github.io/[저장소명]/`
   - 예: `https://yourusername.github.io/privacy-policy/`

### 방법 2: Google Sites (무료)

1. Google Sites 접속: https://sites.google.com
2. 새 사이트 생성
3. `PRIVACY_POLICY.md` 내용을 복사하여 붙여넣기
4. "Share" > "Share to web" 활성화
5. 공개 URL을 개인정보처리방침 URL로 사용

### 방법 3: Notion (무료)

1. Notion 페이지 생성
2. `PRIVACY_POLICY.md` 내용을 복사하여 붙여넣기
3. "Share" > "Share to web" 활성화
4. 공개 URL을 개인정보처리방침 URL로 사용

### 방법 4: 기존 웹사이트

- 기존 웹사이트가 있다면 해당 사이트에 개인정보처리방침 페이지 생성
- 예: `https://yourwebsite.com/privacy-policy`

## 📱 Google Play Console에 등록

1. **Google Play Console 접속**

   - https://play.google.com/console

2. **앱 선택**

   - 출시하려는 앱 선택

3. **정책 메뉴로 이동**

   - 왼쪽 메뉴에서 **정책** > **앱 콘텐츠** 클릭

4. **개인정보처리방침 등록**
   - **개인정보 보호 및 보안** 섹션 찾기
   - **개인정보처리방침** 항목에서 URL 입력
   - 호스팅한 URL 입력 (예: `https://yourusername.github.io/privacy-policy/`)
   - 저장

## ⚠️ 중요 사항

- ✅ URL은 **공개적으로 접근 가능**해야 합니다
- ✅ **HTTPS**를 사용하는 것이 좋습니다
- ✅ 개인정보처리방침은 **한국어**로 작성되어야 합니다 (한국 사용자 대상)
- ✅ **이메일 주소**는 실제 연락 가능한 주소로 변경하세요
- ✅ 앱에서 사용하는 **모든 권한**에 대해 명시해야 합니다

## 📋 최종 체크리스트

- [ ] 개인정보처리방침 작성 완료
- [ ] 이메일 주소 등 연락처 정보 업데이트
- [ ] 웹에 호스팅 완료
- [ ] URL이 공개적으로 접근 가능한지 확인
- [ ] Google Play Console에 URL 등록
- [ ] 테스트: URL이 정상적으로 열리는지 확인

## 💡 팁

- 개인정보처리방침은 법적 문서이므로, 필요시 **법률 전문가의 검토**를 받는 것을 권장합니다
- 앱의 기능이 변경되면 개인정보처리방침도 함께 업데이트해야 합니다
- 사용자에게 변경사항을 알리는 것이 좋습니다

## 🚀 빠른 시작 (GitHub Pages)

```bash
# 1. GitHub에 새 저장소 생성 (예: privacy-policy)
# 2. PRIVACY_POLICY.md 파일 업로드
# 3. Settings > Pages에서 GitHub Pages 활성화
# 4. 생성된 URL을 Google Play Console에 등록
```

---

**참고**: 이 가이드는 기본적인 안내입니다. 법적 문제가 발생할 경우 법률 전문가에게 문의하시기 바랍니다.
