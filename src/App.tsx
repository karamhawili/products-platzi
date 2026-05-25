import { useEffect, useState } from "react";
import { getProducts, type Product } from "./api/platzi";
import "./App.css";
import { useFetch } from "./hooks/useFetch";
import ProductCard from "./components/product-card/ProductCard";

function App() {
  const { loading, error, data } = useFetch(getProducts);
  const [openModal, setOpenModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(data));
  }, [data]);

  const onCardClick = (item: Product) => {
    setOpenModal(true);
    setActiveItem(item);
  };

  const handleCloseClick = () => {
    setOpenModal(false);
    setActiveItem(null);
  };

  return (
    <>
      <div className="main">
        <div className="header">Platzi Products</div>
        {loading && (
          <div className="loading-container">
            <div className="loader"></div> Fetching Products...
          </div>
        )}
        {error && <div className="error-container">{error}</div>}
        {data && (
          <div className="product-grid">
            {data.map((item) => (
              <ProductCard item={item} onClick={() => onCardClick(item)} />
            ))}
          </div>
        )}
      </div>
      {openModal && (
        <div className="backdrop" onClick={handleCloseClick}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="left">
              <div className="image">
                <img src={activeItem?.image} alt={activeItem?.title} />
              </div>
            </div>
            <div className="right">
              <div className="meta">
                <div className="tag">{activeItem?.category.toUpperCase()}</div>
                <div className="title">{activeItem?.title}</div>
                <div className="price">${activeItem?.price}</div>
              </div>
              <div className="description">{activeItem?.description}</div>
              <div className="footer">
                <button className="close-btn" onClick={handleCloseClick}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
