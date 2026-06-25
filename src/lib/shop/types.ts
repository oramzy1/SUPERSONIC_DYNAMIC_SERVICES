export type ProductBadge =
  | "eco"
  | "best-seller"
  | "rental"
  | "new"
  | "discount";

export type ProductCategory = "crates" | "packaging" | "accessories";

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFAQ {
  q: string;
  a: string;
}

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  /** Per-unit price in EUR. For rentals: per crate/day. */
  price: number;
  /** Optional bulk price (e.g. crates ≥ 20). */
  bulkPrice?: number;
  bulkThreshold?: number;
  /** Display unit, e.g. "/ crate / day", "/ roll" */
  unit: string;
  rental: boolean;
  /** Rental presets (days) */
  rentalDurations?: number[];
  colors?: ProductColor[];
  images: string[];
  badges: ProductBadge[];
  stock: number;
  specs: ProductSpec[];
  features: string[];
  sustainability: string[];
  shipping: string[];
  pickupAvailable: boolean;
  faqs: ProductFAQ[];
}

export interface CartItem {
  id: string; // composite: slug|color|duration
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  bulkPrice?: number;
  bulkThreshold?: number;
  unit: string;
  quantity: number;
  rental: boolean;
  durationDays?: number;
  color?: ProductColor;
}

export interface SavedItem {
  slug: string;
  addedAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "completed";

export type PaymentStatus = "pending" | "paid" | "refunded";

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  vat: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingMethod: string;
  paymentMethod: string;
  address: Address;
  email: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  orderNumber: string;
  date: string;
  type: "payment" | "refund" | "invoice";
  amount: number;
  method: string;
  status: "succeeded" | "pending" | "failed";
}