"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";

export default function SportsPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch(() => setMatches([]));
  }, []);

  return (
    <>
      <Header />
      <main className="container page-shell">
        <div className="section-header">
          <h2>Betting Odds</h2>
          <button className="btn btn-secondary">Filter</button>
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
      </main>
    </>
  );
}
