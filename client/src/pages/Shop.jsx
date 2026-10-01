import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiFilter, FiX } from "react-icons/fi";
import ProductCard from "../components/ProductCard.jsx";
import ProductGridSkeleton from "../components/ProductGridSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { fetchProducts } from "../redux/slices/productSlice.js";
import "./Shop.css";

const CATEGORIES = [
  "Leather Suits", "Jackets", "Pants", "Helmets", "Gloves", "Boots", "Protective Gear", "Accessories",
];
const SIZES = ["S", "M", "L", "XL", "XXL", "40", "41", "42", "43"];
const COLORS = ["Black", "Brown", "Grey", "White", "Blue"];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, loading, page, pages, total } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);

  const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  useEffect(() => {
    dispatch(fetchProducts(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === "" || value === null) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const activeFilterCount = ["category", "size", "color", "minPrice", "maxPrice", "rating"].filter(
    (k) => params[k]
  ).length;

  return (
    <div className="container yb-shop">
      <div className="yb-shop-header">
        <div>
          <h1>Shop All Gear</h1>
          <p>{loading ? "Loading products..." : `${total} product${total === 1 ? "" : "s"} found`}</p>
        </div>
        <button className="btn btn-dark yb-filter-toggle" onClick={() => setShowFilters((s) => !s)}>
          <FiFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="yb-shop-layout">
        <aside className={`yb-filters ${showFilters ? "yb-filters-open" : ""}`}>
          <div className="yb-filters-head">
            <h3>Filters</h3>
            <button className="yb-link-btn" onClick={() => setShowFilters(false)}><FiX /></button>
          </div>

          <div className="yb-filter-group">
            <h4>Category</h4>
            {CATEGORIES.map((c) => (
              <label key={c} className="yb-filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={params.category === c}
                  onChange={() => updateParam("category", c)}
                />
                {c}
              </label>
            ))}
          </div>

          <div className="yb-filter-group">
            <h4>Price Range</h4>
            <div className="yb-price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                defaultValue={params.minPrice || ""}
                onBlur={(e) => updateParam("minPrice", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                defaultValue={params.maxPrice || ""}
                onBlur={(e) => updateParam("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className="yb-filter-group">
            <h4>Size</h4>
            <div className="yb-chip-group">
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={`yb-chip ${params.size === s ? "yb-chip-active" : ""}`}
                  onClick={() => updateParam("size", params.size === s ? "" : s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="yb-filter-group">
            <h4>Color</h4>
            <div className="yb-chip-group">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`yb-chip ${params.color === c ? "yb-chip-active" : ""}`}
                  onClick={() => updateParam("color", params.color === c ? "" : c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="yb-filter-group">
            <h4>Minimum Rating</h4>
            {[4, 3, 2].map((r) => (
              <label key={r} className="yb-filter-option">
                <input
                  type="radio"
                  name="rating"
                  checked={params.rating === String(r)}
                  onChange={() => updateParam("rating", String(r))}
                />
                {r}+ stars
              </label>
            ))}
          </div>

          <button className="btn btn-outline btn-block" onClick={clearFilters}>Clear Filters</button>
        </aside>

        <div className="yb-shop-main">
          <div className="yb-shop-toolbar">
            <span>{total} result{total === 1 ? "" : "s"}</span>
            <select
              className="form-control yb-sort-select"
              value={params.sort || "newest"}
              onChange={(e) => updateParam("sort", e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : list.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try adjusting your filters or search term."
              action={<button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-4">
                {list.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="yb-pagination">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-dark"}`}
                      onClick={() => updateParam("page", String(i + 1))}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
