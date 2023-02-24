import styled from "styled-components";
import {
  useParams,
  useLocation,
  Outlet,
  Link,
  useMatch,
  useOutletContext,
} from "react-router-dom";
import { useQuery } from "react-query";

import { Container, Header, Title, Loader } from "./Coins";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { HelmetProvider, Helmet } from "react-helmet-async";

interface RouteState {
  state: {
    name: string;
  };
}

declare module InfoData {
  export interface Tag {
    id: string;
    name: string;
    coin_counter: number;
    ico_counter: number;
  }

  export interface Team {
    id: string;
    name: string;
    position: string;
  }

  export interface Links {
    explorer: string[];
    facebook: string[];
    reddit: string[];
    source_code: string[];
    website: string[];
    youtube: string[];
  }

  export interface Stats {
    subscribers: number;
    contributors?: number;
    stars?: number;
    followers?: number;
  }

  export interface LinksExtended {
    url: string;
    type: string;
    stats: Stats;
  }

  export interface Whitepaper {
    link: string;
    thumbnail: string;
  }

  export interface RootObject {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    logo: string;
    tags: Tag[];
    team: Team[];
    description: string;
    message: string;
    open_source: boolean;
    started_at: Date;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    links: Links;
    links_extended: LinksExtended[];
    whitepaper: Whitepaper;
    first_data_at: Date;
    last_data_at: Date;
  }
}

declare module PriceData {
  export interface USD {
    price: number;
    volume_24h: number;
    volume_24h_change_24h: number;
    market_cap: number;
    market_cap_change_24h: number;
    percent_change_15m: number;
    percent_change_30m: number;
    percent_change_1h: number;
    percent_change_6h: number;
    percent_change_12h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    percent_change_1y: number;
    ath_price: number;
    ath_date: Date;
    percent_from_price_ath: number;
  }

  export interface Quotes {
    USD: USD;
  }

  export interface RootObject {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: Date;
    last_updated: Date;
    quotes: Quotes;
  }
}

interface ToggleDarkType {
  isDark: boolean;
}

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
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

export default function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as RouteState;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const { isDark } = useOutletContext<ToggleDarkType>();

  const { isLoading: infoLoading, data: infoData } =
    useQuery<InfoData.RootObject>(["info", coinId], () =>
      fetchCoinInfo(coinId)
    );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<PriceData.RootObject>(
      ["tickers", coinId],
      () => fetchCoinTickers(coinId),
      {
        refetchInterval: 5000,
      }
    );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <HelmetProvider>
        <Helmet>
          <title>
            {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
          </title>
        </Helmet>
      </HelmetProvider>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
        </>
      )}

      <Tabs>
        <Tab isActive={chartMatch !== null}>
          <Link to={`/${coinId}/chart`}>Chart</Link>
        </Tab>
        <Tab isActive={priceMatch !== null}>
          <Link to={`/${coinId}/price`}>Price</Link>
        </Tab>
      </Tabs>

      <Outlet context={{ coinId, isDark }} />
    </Container>
  );
}
