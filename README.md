## 5.4 Route States

- useLocation은 라우터에 있는 훅으로 현재 위치의 객체를 반환한다.
- 현재 위치가 변경될 때마다 부수적인 효과를 수행하려 할 때 유용하다.

```typescript
react-router-dom 6.0.0버전 이상 사용하시는 분들
Link의 to 프롭에 모든 정보를 담지 않고
<Link to={} state={} > 처럼 사용하도록 바뀌었습니다.

---------------------------------
react-router-dom v6 이전 버전

interface RouterState {
name: string;
}

const {state} = useLocation<RouterState>()

react-router-dom v6 부터 제네릭을 지원하지 않습니다.

interface RouterState {
name: string;
}

const location = useLocation();
const name = location.state as RouterState;

-----------------------------------

// Coins.tsx
// state에 집중
<Link to={`/${coin.id}`} state={{ state: coin.name }}>
  <Img
    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
    alt={coin.name}
  />
  {coin.name} &rarr;
</Link>

// Coin.tsx
export default function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<test>();
  const location = useLocation();
  const { name } = location.state as RouterState;

  return (
    <Container>
      <Header>
        <Title>{name || "Loading"}</Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : null}
    </Container>
  );
}

해당 코드의 경우 그 전의 Coins 컴포넌트에서 Link 태그의 state를 참조하기 때문에 Coins 컴포넌트를 경유하여 들어오지 않으면 Location에 값이 없을 수 있다. 따라서 Title에 값에 따라 다른 값을 반환하도록 코드를 작성했다.
```

<br>

## 5.5 Coin Data

```typescript
// 이 코드를
const response = await fetch("https://api.coinpaprika.com/v1/coins");
const json = await response.json();
// 이렇게 축약해서 표현할 수 있다.
const infoData = await(
  await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
).json();
```

<br>

## 5.6 Data Types

- 어.. 음.. 포스트맨과 json 타입 변환 사이트를 적극적으로 사용하자. 그래그래!

<br>

## 5.7 Nested Routes part One

```typescript
// Router.tsx
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      { index: true, element: <Coins /> },
      {
        path: "/:coinId",
        element: <Coin />,
        // 하위 페이지에 또 다른 하위 경로(Outlet)를 만들 떄
        children: [
          { path: "chart", element: <Chart /> },
          { path: "price", element: <Price /> },
        ],
      },
    ],
  },
```

<br>

## 5.8 Nested Routes part Two

- react-router 6버전에서는 useRouteMatch()가 사라지고 useMatch() 를 이용해야하네요.
- useMatch는 현재 위치를 기준으로 지정된 경로의 경로에 대한 일치 데이터를 반환한다.

```typescript
const priceMatch = useMatch("/:coinId/price");
console.log(priceMatch);

// console.log의 결과물
// 지정된 /:coinId/price 경로에 들어왔을 때 밑의 내용물들을 뱉는다. (coinId = btc-bitcoin)
Object
  params:{coinId: 'btc-bitcoin'}
  pathname:"/btc-bitcoin/price"
  pathnameBase:"/btc-bitcoin/price"
  pattern:{path: '/:coinId/price', caseSensitive: false, end: true}

// 실제 코드 적용

  const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  // isActive의 bool값에 따라(경로의 이동에 따라) 다른 스타일이 적용되도록 만들었다.
  <Tabs>
    <Tab isActive={chartMatch !== null}>
      <Link to={`/${coinId}/chart`}>Chart</Link>
    </Tab>
    <Tab isActive={priceMatch !== null}>
      <Link to={`/${coinId}/price`}>Price</Link>
    </Tab>
  </Tabs>
```

<br>

## 5.9 React Query part One

- 갓갓 리액트 쿼리를 쓴다! 오예~~ (텅스택 쿼리는 이름이 좀..)
- 리액트 쿼리의 장점, 추상화 된 api를 통해 간단하게 data, isLoading, error, isFetching 등을 가져올 수 있다.
- 캐시 자동 생성! (갓갓!)
- 데브툴! (console.log에서 해방!, 심지어 이뻐!)

```typescript
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);

  ------------------------------------------
  // 위의 코드를 밑에처럼 줄일 수 있다. 갓갓갓!
  // fetchCoins는 api 파일에서 import!
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);

  // data가 ICoin[] | undefined이기 때문에 옵셔널 ?를 붙였따.
  data?.slice(0, 100).map((coin) => ..... 중략
```

## 5.10 React Query part Two

- 야! react-router-dom v6부터는 제네릭이 적용 안 된다고! 그냥 타입 추론 맡겨라

```typescript
// api.tsx
const BASE_URL = "https://api.coinpaprika.com/v1";

export const fetchCoins = async () => {
  return fetch(`${BASE_URL}/coins`).then((response) => response.json());
};

export const fetchCoinInfo = async (coinId: string | undefined) => {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
    response.json()
  );
};

export const fetchCoinTickers = async (coinId: string | undefined) => {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
    response.json()
  );
};

-------------------------------------------------------

const [loading, setLoading] = useState(true);
const [info, setInfo] = useState<InfoData.RootObject>();
const [priceInfo, setPriceInfo] = useState<PriceData.RootObject>();

useEffect(() => {
  (async () => {
    const infoData = await (
      await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
    ).json();

    const priceData = await (
      await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
    ).json();

    setInfo(infoData);
    setPriceInfo(priceData);
    setLoading(false);
  })();
}, [coinId]);

-------------------------------------------------------

// 위의 코드가 아래의 모습으로 변했다.
const { isLoading: infoLoading, data: infoData } =
  useQuery<InfoData.RootObject>(["info", coinId], () =>
    fetchCoinInfo(coinId)
  );
const { isLoading: tickersLoading, data: tickersData } =
  useQuery<PriceData.RootObject>(["tickers", coinId], () =>
    fetchCoinTickers(coinId)
  );

const loading = infoLoading || tickersLoading;

```

<br>

## 5.12 Price Chart

- Outlet에 props를 전달하고 싶다면 useOutletContext를 import하면 된다.

```typescript
// 공식문서 사용 예시다

function Parent() {
  const [count, setCount] = React.useState(0);
  return <Outlet context={[count, setCount]} />;
}
import { useOutletContext } from "react-router-dom";

function Child() {
  const [count, setCount] = useOutletContext();
  const increment = () => setCount((c) => c + 1);
  return <button onClick={increment}>{count}</button>;
}
```

## 5-13 Price Chart part Two

> https://apexcharts.com/

- DOCS 참고

```typescript
import ApexChart from "react-apexcharts";

<div>
  {isLoading ? (
    "loading chart..."
  ) : (
    <ApexChart
      type="line"
      series={[
        {
          name: "Price",
          data: data?.map((price) => price.close) as unknown as number[],
        },
      ]}
      options={{
        theme: {
          mode: "dark",
        },
        chart: {
          height: 500,
          width: 500,
          toolbar: {
            show: false,
          },
          background: "transparent",
        },
        grid: { show: false },
        stroke: {
          curve: "smooth",
          width: 5,
        },
        yaxis: {
          show: false,
        },
        xaxis: {
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            show: false,
          },
        },
      }}
    />
  )}
</div>;
```

<br>

## 5-15 Final Touches (react-helmet)

- npm i react-helmet-async
- npm i --save-dev @types/react-helmet

- 웹페이지 타이틀을 해당 페이지에 따라 유동적으로 변모시킬 수 있다.
- 정확히 이야기하면 html의 head 안에 들어 가는 tag들에 접근할 수 있다.

```typescript
import { Helmet, HelmetProvider } from "react-helmet-async";

<HelmetProvider>
  <Helmet>
    <title>
      // 이 부분이 타이틀로 들어간다.
      {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
    </title>
  </Helmet>
</HelmetProvider>;
```
