# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - img [ref=e6]
    - heading "할일을 쉽게 관리하세요" [level=2] [ref=e9]
    - paragraph [ref=e10]: 계정에 로그인하세요
  - generic [ref=e11]:
    - generic [ref=e12]:
      - generic [ref=e14]:
        - generic [ref=e15]: 이메일
        - textbox "이메일" [ref=e17]:
          - /placeholder: 이메일을 입력하세요
      - generic [ref=e19]:
        - generic [ref=e20]: 비밀번호
        - generic [ref=e21]:
          - textbox "비밀번호" [ref=e22]:
            - /placeholder: 비밀번호를 입력하세요
          - button "Show password" [ref=e23] [cursor=pointer]:
            - img [ref=e24]
    - button "로그인 하기" [ref=e28] [cursor=pointer]
  - generic [ref=e29]:
    - text: 계정이 없으신가요?
    - link "회원가입" [ref=e30] [cursor=pointer]:
      - /url: /register
```