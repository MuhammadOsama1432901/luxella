export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  sale: boolean;
  image: string;
  category?: string;
  description?: string;
  shortDescription?: string;
  slug?: string;
  brand?: string;
  gallery?: string[];
  reviewCount?: number;
  featured?: boolean;
  newArrival?: boolean;
  stock?: number;
  sku?: string;
  material?: string;
  color?: string;
  weight?: string;
  size?: string;
  tags?: string[];
  virtualTryOn?: boolean;
  specifications?: Record<string, any>;
  variants?: Record<string, any>;
}