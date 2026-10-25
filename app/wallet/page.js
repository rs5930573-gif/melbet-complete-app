"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";

export default function WalletPage() {
  const [wallet, setWallet] = useState({ balance: 0, bonus: 0, pending: 0 });
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!token || !user) return;

    fetch(`http://localhost:5000/api/wallet/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setWallet(data))
      .catch(() => setWallet({ balance: 0, bonus: 0, pending: 0 }));
  }, [token, user]);

  return (
    <>
      <Header />
      <main className="container page-shell">
        <div className="wallet-summary">
          <div className="wallet-big-card">
            <span>Available balance</span>
            <h2>${wallet.balance.toLocaleString()}</h2>
            <div className="balance-row">
              <div>
                <small>Bonus</small>
                <strong>${wallet.bonus.toLocaleString()}</strong>
              </div>
              <div>
                <small>Pending</small>
                <strong>${wallet.pending.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="action-stack">
            <button className="btn btn-primary full">Deposit</button>
            <button className="btn btn-secondary full">Withdraw</button>
          </div>
        </div>

        <div className="table-panel">
          <div className="panel-header">
            <h2>Transaction History</h2>
          </div>

          <div className="table-wrap">
            <table className="odds-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#1</td>
                  <td>Deposit</td>
                  <td className="positive">+$500</td>
                  <td>2026-10-20</td>
                  <td>Completed</td>
                </tr>
                <tr>
                  <td>#2</td>
                  <td>Bet Wager</td>
                  <td className="negative">-$50</td>
                  <td>2026-10-21</td>
                  <td>Completed</td>
                </tr>
                <tr>
                  <td>#3</td>
                  <td>Win</td>
                  <td className="positive">+$96</td>
                  <td>2026-10-22</td>
                  <td>Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
