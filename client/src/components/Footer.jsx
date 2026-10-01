import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => (
  <footer className="yb-footer">
    <div className="container yb-footer-grid">
      <div>
        <div className="yb-brand yb-footer-brand">
          <span>YES</span>
          <span className="yb-brand-mark-accent">BIKE</span>
        </div>
        <p>
          Motorcycle leather suits, jackets, helmets, gloves and boots for riders who take
          protection seriously.
        </p>
        <div className="yb-social">
          <a href="#" aria-label="Facebook"><FiFacebook /></a>
          <a href="#" aria-label="Instagram"><FiInstagram /></a>
        </div>
      </div>

      <div>
        <h4>Quick Links</h4>
        <ul className="yb-footer-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>

      <div>
        <h4>Customer</h4>
        <ul className="yb-footer-list">
          <li><Link to="/profile">My Account</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/wishlist">Wishlist</Link></li>
          <li><Link to="/cart">Cart</Link></li>
        </ul>
      </div>

      <div>
        <h4>Contact</h4>
        <ul className="yb-footer-list yb-footer-contact">
          <li>R Khan</li>
          <li><a href="tel:0825351244"><FiPhone /> 082 535 1244</a></li>
          <li><a href="tel:0832966806"><FiPhone /> 083 296 6806</a></li>
          <li><a href="mailto:ar_leather@telkomsa.net"><FiMail /> ar_leather@telkomsa.net</a></li>
        </ul>
      </div>

      <div>
        <h4>Locations</h4>
        <ul className="yb-footer-list yb-footer-contact">
          <li><FiMapPin /> Panorama I-20 - I-22</li>
          <li><FiMapPin /> Boksburg C29 - C56</li>
          <li><FiMapPin /> A95 - A96 - B17</li>
          <li><FiMapPin /> Montana D23 - D24</li>
        </ul>
      </div>
    </div>

    <div className="yb-footer-bottom">
      <div className="container yb-footer-bottom-inner">
        <span>© {new Date().getFullYear()} Yes Bike. All rights reserved.</span>
        <span>Built for riders, by riders.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
