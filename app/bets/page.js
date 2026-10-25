"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";

export default function BetsPage() {
  const [bets, setBets] = useState([]);
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

    fetch(`http://localhost:5000/api/bets/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBets(data))
      .catch(() => setBets([]));
  }, [token, user]);

  return (
    <>
      <Header />
      <main className="container page-shell">
        <div className="section-header">
          <h2>My Bets</h2>
          <button className="btn btn-secondary">Export</button>
        </div>

        <div className="table-wrap">
          <table className="odds-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Match</th>
                <th>Odd</th>
                <th>Stake</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet) => (
                <tr key={bet.id}>
                  <td>#{bet.id}</td>
                  <td>{bet.match_name}</td>
                  <td>{bet.odd.toFixed(2)}</td>
                  <td>${bet.stake}</td>
                  <td>
                    <span className={`status ${bet.status.toLowerCase()}`}>{bet.status}</span>
                  </td>
                  <td>{new Date(bet.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
