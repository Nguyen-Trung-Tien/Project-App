import "./SkeletonCard.scss";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
