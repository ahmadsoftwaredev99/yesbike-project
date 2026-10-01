import { Link } from "react-router-dom";
import "./About.css";

const About = () => (
  <div>
    <section className="yb-about-hero">
      <div className="container">
        <span className="badge badge-ember">About Yes Bike</span>
        <h1>Gear for Riders, By People Who Understand Riding</h1>
        <p>
          Yes Bike is a motorcycle leather and riding gear supplier, working with R Khan and the
          team to fit riders with the protection they need for the road.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container yb-about-grid">
        <div>
          <h2>Who We Are</h2>
          <p>
            Yes Bike supplies motorcycle leather suits, jackets, pants, helmets, gloves and boots to
            riders who want gear that is fitted properly and built to protect. The business is run
            by R Khan, with several locations for customers to visit and be fitted in person.
          </p>
        </div>
        <div>
          <h2>What We Offer</h2>
          <p>
            The range covers one-piece and two-piece leather suits, riding jackets and pants,
            full-face and modular helmets, gloves for racing and everyday riding, and boots built
            for both track and street use. Protective gear like back protectors and armor sets round
            out the range.
          </p>
        </div>
        <div>
          <h2>Quality &amp; Protection</h2>
          <p>
            Every product is selected with rider protection in mind first, so gear is chosen for its
            construction and fit rather than looks alone. Where sizing matters, such as suits, pants,
            and boots, getting the right fit is treated as part of the service.
          </p>
        </div>
        <div>
          <h2>Why Riders Choose Us</h2>
          <p>
            Riders come to Yes Bike for straightforward advice on what gear suits their riding style,
            body, and budget, and for a range that covers the essentials from head to toe in one
            place.
          </p>
        </div>
      </div>

      <div className="yb-about-cta">
        <Link to="/shop" className="btn btn-primary">Shop the Range</Link>
        <Link to="/contact" className="btn btn-outline">Get in Touch</Link>
      </div>
    </section>
  </div>
);

export default About;
