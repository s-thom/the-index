import './index.css';

export default function LoadingPage() {
  return (
    <div className="LoadingPage">
      <div className="Loading">
        <span className="Loading-text">Loading</span>
        <span className="Loading-dot">.</span>
        <span className="Loading-dot">.</span>
        <span className="Loading-dot">.</span>
      </div>
    </div>
  );
}
