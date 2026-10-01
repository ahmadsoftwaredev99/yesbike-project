import { FiStar } from "react-icons/fi";

// Renders a 5-star rating readout; not interactive/clickable by design
const StarRating = ({ rating = 0, count }) => {
  const rounded = Math.round(rating);
  return (
    <div className="yb-star-rating" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar key={n} className={n <= rounded ? "yb-star-filled" : "yb-star-empty"} />
      ))}
      {typeof count === "number" && <span className="yb-star-count">({count})</span>}
    </div>
  );
};

export default StarRating;
