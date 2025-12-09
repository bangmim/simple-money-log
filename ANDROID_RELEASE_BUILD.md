# Android 릴리즈 빌드 가이드

Google Play Store에 앱을 출시하기 위해서는 릴리즈 모드로 서명된 APK 또는 Android App Bundle (AAB)이 필요합니다.

## 1단계: 릴리즈 키스토어 생성

터미널에서 다음 명령어를 실행하여 릴리즈 키스토어를 생성합니다:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

명령어 실행 시 다음 정보를 입력하도록 요청됩니다:
- **키스토어 비밀번호**: 안전한 비밀번호를 입력하고 기억해두세요
- **키 비밀번호**: 키스토어 비밀번호와 동일하게 설정하거나 별도로 설정할 수 있습니다
- **이름, 조직 단위, 조직, 도시, 주, 국가 코드**: 앱 정보에 맞게 입력

⚠️ **중요**: 키스토어 파일과 비밀번호를 안전하게 보관하세요. 이 파일을 잃어버리면 앱 업데이트가 불가능합니다!

## 2단계: keystore.properties 파일 생성

`android/keystore.properties.example` 파일을 참고하여 `android/keystore.properties` 파일을 생성합니다:

```bash
cd android
cp keystore.properties.example keystore.properties
```

그리고 `keystore.properties` 파일을 열어 실제 값으로 수정합니다:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

⚠️ **보안**: `keystore.properties` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. 안전하게 보관하세요.

## 3단계: 릴리즈 빌드 생성

### APK 빌드

```bash
cd android
./gradlew assembleRelease
```

빌드된 APK는 `android/app/build/outputs/apk/release/app-release.apk`에 생성됩니다.

### Android App Bundle (AAB) 빌드 (권장)

Google Play Store에 업로드할 때는 AAB 형식을 권장합니다:

```bash
cd android
./gradlew bundleRelease
```

빌드된 AAB는 `android/app/build/outputs/bundle/release/app-release.aab`에 생성됩니다.

## 4단계: Google Play Console에 업로드

1. [Google Play Console](https://play.google.com/console)에 로그인
2. 앱 선택 또는 새 앱 생성
3. **프로덕션** 또는 **내부 테스트** 트랙 선택
4. **새 버전 만들기** 클릭
5. 생성된 AAB 파일 업로드
6. 버전 정보 입력 및 검토 후 제출

## 문제 해결

### "keystore.properties 파일을 찾을 수 없습니다" 경고

- `android/keystore.properties` 파일이 올바른 위치에 있는지 확인
- 파일 경로와 이름이 정확한지 확인

### "키스토어 비밀번호가 잘못되었습니다" 오류

- `keystore.properties` 파일의 비밀번호가 키스토어 생성 시 입력한 비밀번호와 일치하는지 확인

### 키스토어 파일을 잃어버린 경우

- 기존 키스토어 없이는 앱을 업로드할 수 없습니다
- 새 키스토어를 생성하면 새로운 앱으로 등록해야 합니다
- 키스토어 파일과 비밀번호를 안전하게 백업하세요

## 추가 참고사항

- 키스토어 파일은 `android/app/` 디렉토리에 저장하는 것을 권장합니다
- 키스토어 파일과 비밀번호는 절대 공유하거나 Git에 커밋하지 마세요
- 프로덕션 환경에서는 ProGuard를 활성화하여 코드 난독화를 고려하세요 (`build.gradle`의 `enableProguardInReleaseBuilds = true`)

