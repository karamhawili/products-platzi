const BASE_URL = "https://fakestoreapi.com";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`HTTP Error: Status ${res.status}`);
  return res.json() as Promise<T>;
}

// specific method for getting all products
export function getProducts() {
  return request<Product[]>("/products");
}
