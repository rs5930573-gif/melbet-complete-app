"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

const defaultWallet = { balance: 0, bonus: 0, pending: 0 };

export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [wallet, setWallet] = useState(defaultWallet);
  const [betSlip, setBetSlip] = useState([]);
  const [stake, setStake] = useState(50);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));

    fetch("http://localhost:5000/api/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch(() => setMatches([]));

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      fetch(`http://localhost:5000/api/wallet/${parsedUser.id}`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => setWallet(data))
        .catch(() => setWallet(defaultWallet));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("betSlip", JSON.stringify(betSlip));
  }, [betSlip]);

  const totalStake = useMemo(
    () => betSlip.reduce((sum, item) => sum + Number(item.stake), 0),
    [betSlip]
  );

  const potentialWin = useMemo(
    () => betSlip.reduce((sum, item) => sum + Number(item.stake) * Number(item.odd), 0),
    [betSlip]
  );

  const addToBetSlip = (matchName, odd) => {
    const newItem = {
      id: Date.now(),
      name: matchName,
      odd: Number(odd),
      stake: Number(stake) || 10,
    };

    setBetSlip((prev) => [...prev, newItem]);
  };

  const removeSlip = (id) => {
    setBetSlip((prev) => prev.filter((item) => item.id !== id));
  };

  const placeBet = async () => {
    if (!betSlip.length || !user || !token) return;

    try {
      for (const item of betSlip) {
        await fetch("http://localhost:5000/api/bets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            matchName: item.name,
            odd: item.odd,
            stake: item.stake,
          }),
        });
      }

      const walletRes = await fetch(`http://localhost:5000/api/wallet/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const walletData = await walletRes.json();
      setWallet(walletData);
      setBetSlip([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />

      <main className="dashboard-shell">
        <div className="container dashboard-layout">
          <section className="main-panel">
            <div className="hero-banner">
              <div className="hero-copy">
                <span className="badge">VIP BONUS</span>
                <h1>Win More. Bet Smarter.</h1>
                <p>Live markets, premium odds, and instant cash-out opportunities.</p>

                <div className="hero-actions">
                  <Link href="/signup" className="btn btn-primary">Claim Bonus</Link>
                  <Link href="/sports" className="btn btn-secondary">See Markets</Link>
                </div>
              </div>

              <div className="wallet-card">
                <div className="wallet-top">
                  <span>Wallet</span>
                  <button className="mini-btn">Top up</button>
                </div>
                <div className="balance">${wallet.balance.toLocaleString()}</div>
                <div className="wallet-row">
                  <div>
                    <small>Available</small>
                    <strong>${wallet.balance.toLocaleString()}</strong>
                  </div>
                  <div>
                    <small>Bonus</small>
                    <strong>${wallet.bonus.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="markets-grid">
              {[
                { sport: "Football", title: "Champions League", tag: "+12%", odds: [1.75, 3.4, 4.9] },
                { sport: "Basketball", title: "NBA Night", tag: "+8%", odds: [1.92, 2.35, 2.8] },
                { sport: "Tennis", title: "ATP Masters", tag: "+15%", odds: [1.68, 2.15, 3.1] },
              ].map((market) => (
                <div className="market-card" key={market.title}>
                  <div className="market-header">
                    <span className="market-sport">{market.sport}</span>
                    <span className="market-tag">{market.tag}</span>
                  </div>

                  <h3>{market.title}</h3>

                  <div className="market-odds">
                    {market.odds.map((odd, idx) => (
                      <button
                        className="mini-odd"
                        key={`${market.title}-${idx}`}
                        onClick={() => addToBetSlip(market.title, odd)}
                      >
                        {odd.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="table-panel">
              <div className="panel-header">
                <h2>Live Odds</h2>
                <Link href="/sports" className="text-link">View all</Link>
              </div>

              <div className="table-wrap">
                <table className="odds-table">
                  <thead>
                    <tr>
                      <th>Sport</th>
                      <th>Match</th>
                      <th>Time</th>
                      <th>Home</th>
                      <th>Draw</th>
                      <th>Away</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((row) => (
                      <tr key={`${row.match}-${row.time}`}>
                        <td>{row.sport}</td>
                        <td>{row.match}</td>
                        <td>{row.time}</td>
                        <td>{row.home.toFixed(2)}</td>
                        <td>{row.draw.toFixed(2)}</td>
                        <td>{row.away.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="side-panel">
            <div className="bet-slip">
              <div className="panel-header">
                <h3>Bet Slip</h3>
                <span className="count-badge">{betSlip.length}</span>
              </div>

              <div className="bet-list">
                {betSlip.map((item) => (
                  <div className="bet-item" key={item.id}>
                    <div className="bet-topline">
                      <span>{item.name}</span>
                      <span>{item.odd.toFixed(2)}</span>
                    </div>
                    <div className="stake-line">
                      <span>Stake: ${item.stake}</span>
                      <button className="remove-btn" onClick={() => removeSlip(item.id)}>x</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="slip-summary">
                <div>
                  <span>Total stake</span>
                  <strong>${totalStake}</strong>
                </div>
                <div>
                  <span>Potential win</span>
                  <strong>${potentialWin.toFixed(2)}</strong>
                </div>
              </div>

              <div className="stake-box">
                <label>Stake</label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                />
              </div>

              <button className="btn btn-primary full" onClick={placeBet}>Place Bet</button>
            </div>

            <div className="quick-stats">
              <div className="stat-box">
                <span>Today</span>
                <strong>+$420</strong>
              </div>
              <div className="stat-box">
                <span>Profit</span>
                <strong>18.4%</strong>
              </div>
              <div className="stat-box">
                <span>Wagered</span>
                <strong>$890</strong>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
