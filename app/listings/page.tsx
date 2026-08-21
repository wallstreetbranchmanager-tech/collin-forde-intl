import { LISTINGS } from "@/lib/data";
import { InquiryForm } from "../forms";

export default function ListingsPage() {
  return (
    <main>
      <section>
        <div className="wrap">
          <div className="kicker">Inventory</div>
          <h1>Listings</h1>
          <p className="muted" style={{ margin: "0.8rem 0 1.6rem", maxWidth: 640 }}>
            Curated examples for Level 2. Live MLS/IDX is Level 3. Use the form if you want off-market
            or a specific street.
          </p>
          <div className="grid g2">
            {LISTINGS.map((l) => (
              <article className="card" key={l.id}>
                <img src={l.img} alt={l.title} />
                <div className="body">
                  <div className="muted">{l.city}</div>
                  <h3>{l.title}</h3>
                  <div className="price">{l.price}</div>
                  <p className="muted">
                    {l.beds} bd · {l.baths} ba · {l.sqft} sf
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 32, maxWidth: 560 }}>
            <InquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
