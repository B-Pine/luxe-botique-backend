export interface Seller {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  gallery_urls: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_notes?: string;
  total_amount: number;
  payment_proof_url?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  courier_company?: string;
  courier_tracking?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}
