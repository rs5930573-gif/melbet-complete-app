import Header from "../../components/Header";

const offers = [
  { title: "100% Welcome Bonus", text: "Deposit bonus on your first payment." },
  { title: "Cashback Up to 10%", text: "Get cashback on selected live matches." },
  { title: "VIP Rewards", text: "Exclusive perks for loyal players." },
];

export default function PromoPage() {
  return (
    <>
      <Header />
      <main className="container page-shell">
        <div className="section-header">
          <h2>Promotions</h2>
        </div>

        <div className="promo-grid">
          {offers.map((offer) => (
            <div className="promo-card" key={offer.title}>
              <span className="badge">Offer</span>
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
              <button className="btn btn-primary small">Claim</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
