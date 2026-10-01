import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <div className="yb-404">
    <span className="yb-404-code">404</span>
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
