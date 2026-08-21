import { AGENT, LISTINGS, MARKETS } from "@/lib/data";
import { InquiryForm } from "./forms";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Florida · Caribbean · International</div>
          <h1>Buy and sell without the usual circus.</h1>
          <p>
            Collin Forde, ABR. Twenty years, Central and South Florida, plus Caribbean and
            international clients. One point of contact from first call to keys.
          </p>
          <div className="row">
            <a className="cta" href="/book">Book a viewing</a>
            <a className="ghost" href={`https://wa.me/1${AGENT.phone}`}>WhatsApp</a>
            <a className="ghost" href={`sms:+1${AGENT.phone}`}>Text</a>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="kicker">The agent</div>
          <h2>Seasoned. Not a brochure.</h2>
          <p className="muted" style={{ maxWidth: 680, margin: "1rem 0 1.5rem" }}>
            Accredited Buyer’s Representative. License {AGENT.license}. Brokerage {AGENT.brokerage}.
            He has worked Brevard to Broward and a pile of Caribbean buyers who do not want to get
            chewed up by a local process they do not understand.
          </p>
          <div className="grid g4">
            <div className="card"><div className="body"><div className="price">20+</div><p className="muted">Years in the business</p></div></div>
            <div className="card"><div className="body"><div className="price">37</div><p className="muted">Recorded sales on his public profile</p></div></div>
            <div className="card"><div className="body"><div className="price">ABR</div><p className="muted">Buyer representation, not just listing theater</p></div></div>
            <div className="card"><div className="body"><div className="price">Intl</div><p className="muted">New desk: {AGENT.email}</p></div></div>
          </div>
        </div>
      </section>

      <section id="markets">
        <div className="wrap">
          <div className="kicker">Markets</div>
          <h2>Where the work actually is.</h2>
          <div className="grid g4" style={{ marginTop: "1.5rem" }}>
            {MARKETS.map((m) => (
              <article className="card" key={m.name}>
                <img src={m.img} alt={m.name} />
                <div className="body">
                  <h3>{m.name}</h3>
                  <p className="muted">{m.blurb}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="kicker">Featured</div>
          <h2>Sample inventory until MLS is wired.</h2>
          <div className="grid g2" style={{ marginTop: "1.5rem" }}>
            {LISTINGS.map((l) => (
              <article className="card" key={l.id}>
                <img src={l.img} alt={l.title} />
                <div className="body">
                  <div className="muted">{l.city} · {l.status}</div>
                  <h3>{l.title}</h3>
                  <div className="price">{l.price}</div>
                  <p className="muted">{l.beds} bd · {l.baths} ba · {l.sqft} sf</p>
                  <a className="ghost" href={`/book?listing=${l.id}`} style={{ display: "inline-block", marginTop: 12 }}>Book a viewing</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="wrap grid g2">
          <div>
            <div className="kicker">Contact</div>
            <h2>Do not drip this into a black hole form.</h2>
            <p className="muted" style={{ margin: "1rem 0" }}>
              Phone {AGENT.phonePretty}. Office {AGENT.office}. Email hits the new international
              inbox. Wire-fraud rule: he will never change wiring instructions by email.
            </p>
            <p className="muted">
              {AGENT.address}
              <br />
              License {AGENT.license}
            </p>
          </div>
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
