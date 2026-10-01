import { Link } from "react-router-dom";
import "./Categories.css";

const categories = [
  { name: "Leather Suits", img: "https://picsum.photos/seed/cat-suits/700/500", desc: "One-piece and two-piece racing and touring leathers." },
  { name: "Jackets", img: "https://picsum.photos/seed/cat-jackets/700/500", desc: "Leather and textile jackets for every season." },
  { name: "Pants", img: "https://picsum.photos/seed/cat-pants/700/500", desc: "Leather and reinforced denim riding pants." },
  { name: "Helmets", img: "https://picsum.photos/seed/cat-helmets/700/500", desc: "Full-face, modular and open-face helmets." },
  { name: "Gloves", img: "https://picsum.photos/seed/cat-gloves/700/500", desc: "Racing, urban and winter riding gloves." },
  { name: "Boots", img: "https://picsum.photos/seed/cat-boots/700/500", desc: "Full-length and short-cut riding boots." },
  { name: "Protective Gear", img: "https://picsum.photos/seed/cat-protective/700/500", desc: "Back protectors, armor and impact padding." },
  { name: "Accessories", img: "https://picsum.photos/seed/cat-accessories/700/500", desc: "Belts, rain covers and other riding essentials." },
];

const Categories = () => (
  <div className="container yb-categories-page">
    <div className="section-head">
      <h1>Categories</h1>
      <p>Browse the full Yes Bike range by category.</p>
    </div>
    <div className="grid grid-3">
      {categories.map((cat) => (
        <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="card yb-cat-tile">
          <img src={cat.img} alt={cat.name} />
          <div className="yb-cat-tile-body">
            <h3>{cat.name}</h3>
            <p>{cat.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default Categories;
