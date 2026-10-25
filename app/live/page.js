import Header from "../../components/Header";

const liveMatches = [
  { event: "Arsenal vs Chelsea", score: "2 : 1", minute: "67'", status: "Live" },
  { event: "Lakers vs Celtics", score: "102 : 101", minute: "Q4 4:20", status: "Live" },
  { event: "G2 vs OG", score: "1 : 2", minute: "Map 2", status: "Live" },
];

export default function LivePage() {
  return (
    <>
      <Header />
      <main className="container page-shell">
        <div className="section-header">
          <h2>Live Matches</h2>
        </div>

        <div className="live-grid">
          {liveMatches.map((match) => (
            <div className="live-card" key={match.event}>
              <div className="live-top">
                <span className="live-badge">{match.status}</span>
                <span>{match.minute}</span>
              </div>
              <h3>{match.event}</h3>
              <div className="score-large">{match.score}</div>
              <button className="btn btn-primary small">View Odds</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
