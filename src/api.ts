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

export const fetchCoinHistory = async (coinId: string | undefined) => {
  // const endData = Math.floor(Date.now() / 1000);
  // const startDate = endData - 60 * 60 * 24 * 7;
  return fetch(
    `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
  ).then((response) => response.json());
};
