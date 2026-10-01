import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowRight, FiShield, FiTruck, FiTag, FiStar } from "react-icons/fi";
import ProductCard from "../components/ProductCard.jsx";
import {
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchBestSellers,
} from "../redux/slices/productSlice.js";
import "./Home.css";

const categories = [
  { name: "Leather Suits", img: "https://picsum.photos/seed/cat-suits/500/600" },
  { name: "Jackets", img: "https://picsum.photos/seed/cat-jackets/500/600" },
  { name: "Pants", img: "https://picsum.photos/seed/cat-pants/500/600" },
  { name: "Helmets", img: "https://picsum.photos/seed/cat-helmets/500/600" },
  { name: "Gloves", img: "https://picsum.photos/seed/cat-gloves/500/600" },
  { name: "Boots", img: "https://picsum.photos/seed/cat-boots/500/600" },
  { name: "Protective Gear", img: "https://picsum.photos/seed/cat-protective/500/600" },
];

const testimonials = [
  {
    name: "Werner P.",
    quote:
      "The riding suit fits exactly like it was made for me. You can tell the stitching is built to take a hit.",
  },
  {
    name: "Naledi M.",
    quote: "Staff helped me find boots that actually fit my calf. No pressure, just good advice.",
  },
  {
    name: "Sipho D.",
    quote: "Ordered a helmet online, arrived quickly and the fit guide was spot on.",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const { featured, newArrivals, bestSellers } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchNewArrivals());
    dispatch(fetchBestSellers());
  }, [dispatch]);

  return (
    <div>
      <section className="yb-hero">
        <div className="container yb-hero-inner">
          <div className="yb-hero-copy">
            <span className="badge badge-ember">Motorcycle Leather &amp; Riding Gear</span>
            <h1 className="yb-hero-title">Ride With Confidence</h1>
            <p className="yb-hero-sub">
              Leather suits, jackets, helmets, gloves and boots built for riders who need real
              protection, not just a look. Fitted, tested, and ready for the road.
            </p>
            <div className="yb-hero-actions">
              <Link to="/shop" className="btn btn-primary">Shop Now <FiArrowRight /></Link>
              <Link to="/categories" className="btn btn-outline">Explore Gear</Link>
            </div>
          </div>
          <div className="yb-hero-media">
            <img src="https://picsum.photos/seed/yesbike-hero/900/1000" alt="Rider in full leather gear" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Shop by Category</h2>
            <p>Everything you need, head to toe.</p>
          </div>
          <div className="yb-category-scroll">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="yb-category-card"
              >
                <img src={cat.img} alt={cat.name} />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="section-head">
              <h2>Featured Gear</h2>
              <Link to="/shop" className="btn btn-dark btn-sm">View All <FiArrowRight /></Link>
            </div>
            <div className="grid grid-4">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="yb-promo">
        <div className="container yb-promo-inner">
          <FiTag className="yb-promo-icon" />
          <div>
            <h2>Free Shipping Over R1,500</h2>
            <p>Spend R1,500 or more and shipping is on us, anywhere the courier network reaches.</p>
          </div>
          <Link to="/shop" className="btn btn-primary">Shop the Range</Link>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="section-head">
              <h2>New Arrivals</h2>
              <Link to="/shop?isNew=true" className="btn btn-dark btn-sm">View All <FiArrowRight /></Link>
            </div>
            <div className="grid grid-4">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="section-head">
              <h2>Best Sellers</h2>
              <Link to="/shop?isBestSeller=true" className="btn btn-dark btn-sm">View All <FiArrowRight /></Link>
            </div>
            <div className="grid grid-4">
              {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Why Choose Yes Bike</h2>
            <p>Gear selected for real riding, not just display.</p>
          </div>
          <div className="grid grid-3 yb-why-grid">
            <div className="card yb-why-card">
              <FiShield />
              <h3>Protection First</h3>
              <p>Every piece is chosen for genuine on-road protection, not just appearance.</p>
            </div>
            <div className="card yb-why-card">
              <FiTruck />
              <h3>Reliable Fitting</h3>
              <p>We help you find gear that actually fits your body and your bike.</p>
            </div>
            <div className="card yb-why-card">
              <FiStar />
              <h3>Riders Who Know Gear</h3>
              <p>Straightforward advice from people who understand what riders need.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <h2>What Riders Say</h2>
          </div>
          <div className="grid grid-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card yb-testimonial">
                <p>&ldquo;{t.quote}&rdquo;</p>
                <span className="yb-testimonial-name">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="yb-newsletter">
        <div className="container yb-newsletter-inner">
          <div>
            <h2>Stay in the Loop</h2>
            <p>New arrivals, restocks and promotions, straight to your inbox.</p>
          </div>
          <form
            className="yb-newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" required placeholder="Your email address" className="form-control" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
