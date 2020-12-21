import { Link } from 'react-router-dom';
import './index.css';

export default function NotFoundPage() {
  return (
    <div className="NotFoundPage">
      <h2 className="NotFoundPage-heading">Not Found</h2>
      <p className="NotFoundPage-text">
        Try refreshing the page, or <Link to="/">go to the home page</Link>.
      </p>
    </div>
  );
}
