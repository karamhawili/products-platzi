import type { Product } from "../../api/platzi";
import "./ProductCard.css";

interface ProductCardprops {
  item: Product;
  onClick: () => void;
}

function ProductCard({ item, onClick }: ProductCardprops) {
  return (
    <div className="product-card" onClick={onClick}>
      <div className="image">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="meta">
        <div className="title">{item.title}</div>
        <div className="price">${item.price}</div>
      </div>
    </div>
  );
}

export default ProductCard;
