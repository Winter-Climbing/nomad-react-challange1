import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinTickers } from "../api";

interface ChartProps {
  coinId: string;
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

const MaxMountain = styled.div`
  font-size: x-large;
`;

export default function Price() {
  const { coinId } = useOutletContext<ChartProps>();
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<PriceData.RootObject>(
      ["tickers", coinId],
      () => fetchCoinTickers(coinId),
      {
        refetchInterval: 5000,
      }
    );

  return (
    <div>
      {tickersLoading ? (
        "loading price"
      ) : (
        <div>
          <MaxMountain>
            고점: ${tickersData?.quotes?.USD?.ath_price?.toFixed(3)}
          </MaxMountain>
          <p>할머니: 얘야 저기에도 사람이 산단다</p>
          <p>손자: 할머니 그런 무서운 소리하지 마세요 ㅠㅠ</p>
        </div>
      )}
    </div>
  );
}
