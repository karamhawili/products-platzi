import { useEffect, useRef, useState } from "react";
import { getProducts, type Product } from "./api/platzi";
import "./App.css";
import { useFetch } from "./hooks/useFetch";

function App() {
  const { loading, error, data } = useFetch(getProducts);
  const [openModal, setOpenModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Product | null>(null);
  const [orderedData, setOrderedData] = useState<Product[] | null>(null);

  const dragItem = useRef<string | null>(null);
  const dragOver = useRef<string | null>(null);

  useEffect(() => {
    if (!data) return;

    const localData = localStorage.getItem("products");

    if (!localData) {
      setOrderedData(data);
      return;
    }

    setOrderedData(JSON.parse(localData));
  }, [data]);

  useEffect(() => {
    if (!orderedData) return;

    localStorage.setItem("products", JSON.stringify(orderedData));
  }, [orderedData]);

  const onCardClick = (item: Product) => {
    setOpenModal(true);
    setActiveItem(item);
  };

  const handleCloseClick = () => {
    setOpenModal(false);
    setActiveItem(null);
  };

  const handleDragStart = (id: string) => {
    dragItem.current = id;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    dragOver.current = (e.target as HTMLDivElement).id;
  };

  const handleDragEnd = () => {
    const dataArr = [...(orderedData || [])];
    const draggedItemIndex = dataArr?.findIndex(
      (item) => `${item.id}` === `${dragItem.current}`,
    );
    const dragOverItemIndex = dataArr?.findIndex(
      (item) => `${item.id}` === `${dragOver.current}`,
    );

    const ordered = dataArr?.map((val, i) => {
      if (i === draggedItemIndex) return dataArr[dragOverItemIndex];
      if (i === dragOverItemIndex) return dataArr[draggedItemIndex];
      return val;
    });

    setOrderedData(ordered);
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
        {orderedData && (
          <div className="product-grid">
            {orderedData.map((item) => (
              <div
                className="product-card"
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                onClick={() => onCardClick(item)}
                key={item.id}
                id={item.id}
              >
                <div className="interactive" id={item.id}></div>
                <div className="image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="meta">
                  <div className="title">{item.title}</div>
                  <div className="price">${item.price}</div>
                </div>
              </div>
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
