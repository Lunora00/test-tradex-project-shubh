const express = require("express");
const axios = require("axios");
const router = express.Router();

const cache = {
  ticker: { data: null, timestamp: 0 },
  charts: {},
};
const CACHE_TTL = 30 * 1000;

const COIN_IDS = "bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,cardano,avalanche-2";

const SYMBOL_MAP = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  binancecoin: "BNB",
  ripple: "XRP",
  dogecoin: "DOGE",
  cardano: "ADA",
  "avalanche-2": "AVAX",
};

// GET /api/market/ticker
router.get("/ticker", async (req, res) => {
  try {
    const now = Date.now();
    if (cache.ticker.data && now - cache.ticker.timestamp < CACHE_TTL) {
      return res.json(cache.ticker.data);
    }

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: COIN_IDS,
          vs_currencies: "usd",
          include_24hr_change: true,
        },
        timeout: 8000,
      }
    );

    // id field MUST be the coingecko id so chart route works
    const cryptoData = Object.entries(response.data).map(([id, val]) => ({
      id,                              // e.g. "bitcoin"
      symbol: SYMBOL_MAP[id] || id.toUpperCase(),  // e.g. "BTC"
      price: val.usd,
      change: val.usd_24h_change ?? 0,
    }));

    cache.ticker.data = cryptoData;
    cache.ticker.timestamp = now;
    res.json(cryptoData);
  } catch (err) {
    console.error("Ticker error:", err.message);
    if (cache.ticker.data) return res.json(cache.ticker.data);
    res.status(500).json({ error: "Failed to fetch ticker" });
  }
});

// GET /api/market/chart/:coinId
router.get("/chart/:coinId", async (req, res) => {
  const { coinId } = req.params;
  try {
    const now = Date.now();
    if (cache.charts[coinId] && now - cache.charts[coinId].timestamp < CACHE_TTL) {
      return res.json(cache.charts[coinId].data);
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: { vs_currency: "usd", days: 1, interval: "hourly" },
        timeout: 8000,
      }
    );

    const prices = response.data?.prices || [];
    const formatted = prices.map(([time, price]) => ({
      time,
      price: parseFloat(price.toFixed(2)),
    }));

    const vals = formatted.map((p) => p.price);
    const high24h = vals.length ? Math.max(...vals) : 0;
    const low24h  = vals.length ? Math.min(...vals) : 0;

    const result = { prices: formatted, high24h, low24h };
    cache.charts[coinId] = { data: result, timestamp: now };
    res.json(result);
  } catch (err) {
    console.error(`Chart error for ${coinId}:`, err.message);
    if (cache.charts[coinId]) return res.json(cache.charts[coinId].data);
    res.status(500).json({ error: "Failed to fetch chart" });
  }
});

module.exports = router;