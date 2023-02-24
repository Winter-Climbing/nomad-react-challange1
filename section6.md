## 6.0 Dark Mode part One

- 스타일을 이용하는 다크모드의 경우 결국 가장 중요한 것은 변수를 활용하여 바꿀 대상들을 일괄적으로 처리하는 것이다.
- 그것만 된다면 나머지는 bool값에 따른 toggle 버튼만 만들면 끝난다.

```typescript
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => setIsDark((current) => !current);
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <button onClick={toggleDark}>Toggle Button</button>
    </>
```

<br>

## 6.1 Dark Mode part two

- useOutletContext를 이용할 경우 props 드릴링과 마찬가지로
- Outlet 드릴링을 가져가야 일괄적인 상태공유가 가능하다.

```typescript
interface에서 함수 타입을 설정할 때는 아래와 같이 한다.
interface Test {
  toggleDark: () => void;
}

// App.tsx
// {{}} 으로 감싸야(객체 형태로만) 변수, 참조값을 넘길 수 있다.
<Outlet context={{ toggleDark, isDark }} />
```
