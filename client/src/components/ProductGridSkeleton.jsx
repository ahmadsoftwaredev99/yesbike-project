const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card">
        <div className="skeleton" style={{ aspectRatio: "3/3.5" }} />
        <div style={{ padding: 16 }}>
          <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 16, width: "50%" }} />
        </div>
      </div>
    ))}
  </div>
);
export default ProductGridSkeleton;
