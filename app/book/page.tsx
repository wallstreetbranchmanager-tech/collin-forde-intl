import { BookingForm } from "../forms";

export default function BookPage() {
  return (
    <main>
      <section>
        <div className="wrap grid g2">
          <div>
            <div className="kicker">Appointments</div>
            <h1>Book a viewing</h1>
            <p className="muted" style={{ marginTop: 12 }}>
              Pick a date and Eastern time. This is a request until Collin confirms it on Google
              Calendar. If two people grab the same hour, first confirmed wins.
            </p>
          </div>
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
