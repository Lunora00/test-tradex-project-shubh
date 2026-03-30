import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { LineChart, Line, Tooltip, ResponsiveContainer, YAxis } from "recharts";

interface TickerItem {
  id: string;
  symbol: string;
  price: number;
  change: number;
}

interface ChartData {
  prices: { time: number; price: number }[];
  high24h: number;
  low24h: number;
}

function formatPrice(price: number): string {
  if (!price && price !== 0) return "N/A";
  if (price >= 1000)
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function formatChange(change: number): string {
  if (typeof change !== "number") return "0.00%";
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
}

interface PopupProps {
  item: TickerItem;
  chart: ChartData | null;
  loading: boolean;
  // bottom edge of ticker bar in viewport px — popup opens BELOW this
  barBottom: number;
  chipCenterX: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Popup({ item, chart, loading, barBottom, chipCenterX, onMouseEnter, onMouseLeave }: PopupProps) {
  const W = 280;
  const left = Math.max(8, Math.min(chipCenterX - W / 2, window.innerWidth - W - 8));
  // Always open BELOW the bar — no space issues
  const top = barBottom + 8;

  const isPos = item.change >= 0;
  const lineColor = isPos ? "#3fb950" : "#f85149";

  return createPortal(
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        left,
        top,
        width: W,
        background: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: 10,
        padding: "14px 16px",
        zIndex: 999999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ color: "#e6edf3", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
            {item.symbol}
          </div>
          <div style={{ color: "#8b949e", fontSize: 11 }}>{item.symbol}/USD</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#e6edf3", fontWeight: 700, fontSize: 18 }}>
            ${formatPrice(item.price)}
          </div>
          <div style={{ color: lineColor, fontSize: 12 }}>
            {isPos ? "↗" : "↘"} {formatChange(item.change)} 24h
          </div>
        </div>
      </div>

      {/* ── Chart — fixed height, NO extra margins ── */}
      <div style={{ height: 80 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#8b949e", fontSize: 12 }}>
            Loading chart...
          </div>
        ) : chart && chart.prices.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.prices} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <YAxis domain={["auto", "auto"]} hide />
              <Tooltip
                contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 6, fontSize: 11 }}
                labelFormatter={() => ""}
                formatter={(val: number) => [`$${formatPrice(val)}`, ""]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#8b949e", fontSize: 12 }}>
            No chart data
          </div>
        )}
      </div>

      {/* ── 24h High / Low — marginTop: 8 only ── */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, borderTop: "1px solid #21262d", paddingTop: 8 }}>
        <div>
          <div style={{ color: "#8b949e", fontSize: 10, marginBottom: 2 }}>24h Low</div>
          <div style={{ color: "#f85149", fontSize: 12, fontWeight: 600 }}>
            {chart ? `$${formatPrice(chart.low24h)}` : "—"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#8b949e", fontSize: 10, marginBottom: 2 }}>24h High</div>
          <div style={{ color: "#3fb950", fontSize: 12, fontWeight: 600 }}>
            {chart ? `$${formatPrice(chart.high24h)}` : "—"}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TickerBar() {
  const [data, setData] = useState<TickerItem[]>([]);
  const [hoveredItem, setHoveredItem] = useState<TickerItem | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  // Store both the chip center X and the bar's bottom Y
  const [popupAnchor, setPopupAnchor] = useState({ chipX: 0, barBottom: 0 });

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chartCache = useRef<Record<string, ChartData>>({});
  const barRef = useRef<HTMLDivElement>(null);

  const fetchTicker = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/market/ticker");
      if (Array.isArray(res.data) && res.data.length > 0) setData(res.data);
    } catch (err) {
      console.error("[TickerBar] ticker failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchTicker();
    const iv = setInterval(fetchTicker, 30000);
    return () => clearInterval(iv);
  }, [fetchTicker]);

  const openPopup = useCallback(async (e: React.MouseEvent<HTMLDivElement>, item: TickerItem) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);

    const chipRect = e.currentTarget.getBoundingClientRect();
    // Get bar bottom from the bar ref — always accurate regardless of scroll
    const barBottom = barRef.current
      ? barRef.current.getBoundingClientRect().bottom
      : chipRect.bottom;

    setPopupAnchor({ chipX: chipRect.left + chipRect.width / 2, barBottom });
    setHoveredItem(item);

    if (chartCache.current[item.id]) {
      setChart(chartCache.current[item.id]);
      setChartLoading(false);
      return;
    }

    setChart(null);
    setChartLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/api/market/chart/${item.id}`);
      chartCache.current[item.id] = res.data;
      setChart(res.data);
    } catch (err) {
      console.error("[TickerBar] chart failed:", err);
    } finally {
      setChartLoading(false);
    }
  }, []);

  const scheduleClose = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      setHoveredItem(null);
      setChart(null);
    }, 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const items = data.length > 0 ? [...data, ...data] : [];

  return (
    <>
      {hoveredItem && (
        <Popup
          item={hoveredItem}
          chart={chart}
          loading={chartLoading}
          barBottom={popupAnchor.barBottom}
          chipCenterX={popupAnchor.chipX}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        />
      )}

      {/* Ticker bar */}
      <div
        ref={barRef}
        style={{
          width: "100%",
          background: "#010409",
          borderBottom: "1px solid #21262d",
          overflow: "hidden",
          height: 40,
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 50,
        }}
      >
        {/* Left fade */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 48,
          background: "linear-gradient(to right, #010409 50%, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />

        {items.length > 0 ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            animation: `tickerScroll ${data.length * 4}s linear infinite`,
          }}>
            {items.map((item, i) => {
              const isPos = item.change >= 0;
              return (
                <div
                  key={`${item.id}-${i}`}
                  onMouseEnter={(e) => openPopup(e, item)}
                  onMouseLeave={scheduleClose}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#161b22"; }}
                  onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginRight: 36,
                    padding: "0 8px",
                    height: 28,
                    borderRadius: 4,
                    cursor: "default",
                    flexShrink: 0,
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{ color: "#8b949e", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em" }}>
                    {item.symbol}
                  </span>
                  <span style={{ color: "#e6edf3", fontSize: 12, fontWeight: 600, fontFamily: "monospace" }}>
                    ${formatPrice(item.price)}
                  </span>
                  <span style={{ color: isPos ? "#3fb950" : "#f85149", fontSize: 11 }}>
                    {isPos ? "↗" : "↘"} {formatChange(item.change)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: "#8b949e", fontSize: 12, paddingLeft: 16 }}>
            Loading market data...
          </div>
        )}

        {/* Right fade */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 48,
          background: "linear-gradient(to left, #010409 50%, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
      </div>

      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}