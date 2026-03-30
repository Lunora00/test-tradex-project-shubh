import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Target, Award, Activity, BarChart3, Zap, TrendingDown, ArrowRight, Sparkles, Rocket, Crown } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TrickerBar from "../components/TrickerBar"

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    { title: 'Active Strategies', value: '12', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', change: '+3 this week', link: '/' },
    { title: 'Total Profit', value: '+24.5%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10', change: '+5.2% this month', link: '/dashboard' },
    { title: 'Win Rate', value: '68%', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', change: '+2% vs last month', link: '/dashboard' },
    { title: 'Total Trades', value: '247', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-500/10', change: '18 today', link: '/dashboard' },
  ];

  // Performance data for chart - More realistic with volatility
  const performanceData = [
    { month: 'Jan', value: 10000, profit: 0, drawdown: 0 },
    { month: 'Feb', value: 10650, profit: 650, drawdown: -2.1 },
    { month: 'Mar', value: 11420, profit: 770, drawdown: -3.8 },
    { month: 'Apr', value: 10890, profit: -530, drawdown: -4.6 },
    { month: 'May', value: 12340, profit: 1450, drawdown: -2.2 },
    { month: 'Jun', value: 13680, profit: 1340, drawdown: -5.1 },
    { month: 'Jul', value: 12980, profit: -700, drawdown: -5.1 },
    { month: 'Aug', value: 15120, profit: 2140, drawdown: -3.4 },
    { month: 'Sep', value: 16890, profit: 1770, drawdown: -6.8 },
    { month: 'Oct', value: 15740, profit: -1150, drawdown: -6.8 },
    { month: 'Nov', value: 18920, profit: 3180, drawdown: -4.2 },
    { month: 'Dec', value: 21700, profit: 2780, drawdown: -3.1 },
  ];

  // Recent trades
  const recentTrades = [
    { id: 1, strategy: 'Breakout Momentum', pair: 'BTC/USDT', type: 'buy', profit: '+12.3%', time: '2 hours ago', status: 'active' },
    { id: 2, strategy: 'Mean Reversion RSI', pair: 'ETH/USDT', type: 'sell', profit: '+8.7%', time: '5 hours ago', status: 'closed' },
    { id: 3, strategy: 'Ichimoku Cloud', pair: 'SOL/USDT', type: 'buy', profit: '-2.1%', time: '1 day ago', status: 'active' },
    { id: 4, strategy: 'VWAP Scalper', pair: 'AAPL', type: 'sell', profit: '+15.4%', time: '1 day ago', status: 'closed' },
  ];

  // Top performing strategies
  const topStrategies = [
    { id: 10, name: 'Machine Learning Momentum', return: '+137%', winRate: 61, trades: 89, icon: Zap },
    { id: 2, name: 'Breakout Momentum Scanner', return: '+121%', winRate: 58, trades: 67, icon: TrendingUp },
    { id: 3, name: 'Turtle Trading System', return: '+72%', winRate: 42, trades: 124, icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
                    <TrickerBar />

      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* New Strategies Advertisement */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-1">
          <div className="bg-background rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                      2 New Strategies Daily
                    </span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-xs font-bold rounded-full animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Fresh, backtested strategies added every day • Never miss an opportunity
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/strategies')}
                className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-semibold shadow-lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Strategies
              </Button>
            </div>
            
            {/* Stats Bar */}
            <div className="mt-4 pt-4 border-t flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">730+</span> strategies/year
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">100%</span> tested & verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">24/7</span> market coverage
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's your trading overview</p>
        </div>



        {/* Hero Section with Trading Visual */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-700"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Trading Active</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">12 Strategies Running</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-2 flex items-center gap-2">
                <Rocket className="w-8 h-8" />
                Portfolio Performance
              </h2>
              <p className="text-white/90 mb-6 text-lg">Your strategies are crushing the market 🚀</p>
              <div className="flex items-baseline gap-6 mb-4">
                <div>
                  <p className="text-sm text-white/70 mb-1">Total Value</p>
                  <div className="text-6xl font-bold">$21,700</div>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-1">Year to Date</p>
                  <div className="flex items-center gap-2 text-green-300 text-3xl font-semibold">
                    <TrendingUp className="w-8 h-8" />
                    +117%
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/strategies')}
                className="bg-white text-blue-600 hover:bg-white/90 font-semibold"
              >
                View All Strategies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {/* Enhanced trading visual */}
            <div className="hidden lg:block">
              <div className="w-80 h-80 relative">
                {/* Glowing orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-yellow-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
                </div>
                
                {/* Chart visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full opacity-80">
                    <svg viewBox="0 0 240 240" className="w-full h-full">
                      <defs>
                        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Area chart */}
                      <path
                        d="M 20 180 L 30 160 L 50 170 L 70 140 L 90 150 L 110 120 L 130 130 L 150 100 L 170 110 L 190 80 L 210 90 L 220 60 L 220 200 L 20 200 Z"
                        fill="url(#heroGradient)"
                        className="animate-pulse"
                        style={{ animationDuration: '3s' }}
                      />
                      <path
                        d="M 20 180 L 30 160 L 50 170 L 70 140 L 90 150 L 110 120 L 130 130 L 150 100 L 170 110 L 190 80 L 210 90 L 220 60"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />
                      
                      {/* Candlesticks with glow */}
                      <g filter="url(#glow)">
                        <rect x="40" y="150" width="10" height="35" fill="rgba(34,197,94,1)" rx="2" />
                        <line x1="45" y1="145" x2="45" y2="185" stroke="rgba(34,197,94,1)" strokeWidth="2" />
                        
                        <rect x="85" y="135" width="10" height="45" fill="rgba(34,197,94,1)" rx="2" />
                        <line x1="90" y1="125" x2="90" y2="180" stroke="rgba(34,197,94,1)" strokeWidth="2" />
                        
                        <rect x="125" y="115" width="10" height="30" fill="rgba(239,68,68,1)" rx="2" />
                        <line x1="130" y1="110" x2="130" y2="145" stroke="rgba(239,68,68,1)" strokeWidth="2" />
                        
                        <rect x="165" y="95" width="10" height="40" fill="rgba(34,197,94,1)" rx="2" />
                        <line x1="170" y1="85" x2="170" y2="135" stroke="rgba(34,197,94,1)" strokeWidth="2" />
                        
                        <rect x="205" y="75" width="10" height="50" fill="rgba(34,197,94,1)" rx="2" />
                        <line x1="210" y1="65" x2="210" y2="125" stroke="rgba(34,197,94,1)" strokeWidth="2" />
                      </g>
                      
                      {/* Buy/Sell indicators */}
                      <circle cx="70" cy="140" r="8" fill="rgba(34,197,94,1)" stroke="white" strokeWidth="2" />
                      <text x="70" y="145" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">B</text>
                      
                      <circle cx="150" cy="100" r="8" fill="rgba(239,68,68,1)" stroke="white" strokeWidth="2" />
                      <text x="150" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card 
              key={stat.title} 
              className="relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(stat.link)}
            >
              <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stat.change}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Portfolio Growth
              </CardTitle>
              <CardDescription>Your equity curve over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(142, 76%, 36%)" 
                    strokeWidth={3}
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Performers
              </CardTitle>
              <CardDescription>Best strategies this year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStrategies.map((strategy, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg hover:bg-accent hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => navigate(`/strategy/${strategy.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`relative w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 
                          index === 1 ? 'bg-gradient-to-br from-blue-400 to-cyan-500' : 
                          'bg-gradient-to-br from-purple-400 to-pink-500'
                        } flex items-center justify-center shadow-lg`}>
                          {index === 0 && <Crown className="w-5 h-5 text-white" />}
                          {index !== 0 && <strategy.icon className="w-5 h-5 text-white" />}
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                              1
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{strategy.name}</h4>
                          <p className="text-xs text-muted-foreground">{strategy.trades} trades executed</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-500">{strategy.return}</span>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-semibold">{strategy.winRate}%</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-end text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Recent Trades
            </CardTitle>
            <CardDescription>Your latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`relative w-12 h-12 rounded-full ${
                      trade.type === 'buy' ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-rose-600'
                    } flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      {trade.type === 'buy' ? (
                        <TrendingUp className="w-6 h-6 text-white" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-white" />
                      )}
                      {trade.status === 'active' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{trade.strategy}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono font-semibold">{trade.pair}</span>
                        <span>•</span>
                        <span>{trade.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      trade.profit.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {trade.profit}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${
                      trade.status === 'active' 
                        ? 'bg-blue-500/10 text-blue-500' 
                        : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {trade.status === 'active' && <Activity className="w-3 h-3 animate-pulse" />}
                      {trade.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
