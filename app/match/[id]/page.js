import Link from "next/link";
import Header from "../../components/Header";

const matchDetails = {
  1: {
    title: "Arsenal vs Chelsea",
    league: "Premier League",
    status: "Live",
    score: "2 : 1",
    minute: "67'",
    markets: [
      { label: "Home Win", price: 1.92 },
      { label: "Draw", price: 3.4 },
      { label: "Away Win", price: 3.8 },
    ],
    summary: "Arsenal dominating possession in second half. Chelsea are pushing for equalizer.",
  },
  2: {
    title: "Real Madrid vs Barcelona",
    league: "La Liga",
    status: "Upcoming",
    score: "0 : 0",
    minute: "Kickoff in 1h 30m",
    markets: [
      { label: "Real Madrid", price: 2.15 },
      { label: "Draw", price: 3.2 },
      { label: "Barcelona", price: 3.25 },
    ],
    summary: "Classic El Clasico matchup with intense rivalry. Tactical battle expected.",
  },
};

export default function MatchDetailPage({ params }) {
  const match = matchDetails[params.id] || matchDetails[1];

  return (
    <>
      <Header />
      <main className="container page-shell">
        <Link href="/" className="back-link">← Back to Dashboard</Link>

        <div className="match-detail">
          <div className="match-hero">
            <div>
              <div className="badge">{match.status}</div>
              <h2>{match.title}</h2>
              <p>{match.league}</p>
            </div>

            <div className="score-box">
              <strong>{match.score}</strong>
              <span>{match.minute}</span>
            </div>
          </div>

          <div className="detail-grid">
            <div className="market-panel">
              <h3>Markets</h3>
              <div className="detail-odds">
                {match.markets.map((market) => (
                  <button className="detail-odd" key={market.label}>
                    <span>{market.label}</span>
                    <strong>{market.price.toFixed(2)}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="match-summary">
              <h3>Match Summary</h3>
              <p>{match.summary}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
