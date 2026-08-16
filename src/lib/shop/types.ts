export type ProductBadge =
  | "eco"
  | "best-seller"
  | "rental"
  | "new"
  | "discount";

export type ProductCategory = "supplies" | "consumables";

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

export type PurchaseMode = "rent" | "buy";

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
  buyPrice?: number;         // set on rentable products to unlock "Buy" mode
  buyBulkPrice?: number;
  buyBulkThreshold?: number;
  buyUnit?: string;
  /** Rental presets (days) */
  rentalDurations?: number[];
  colors?: ProductColor[];
  images: string[];
  badges: ProductBadge[];
  stock: number;
  specs: ProductSpec[];
  features: string[];
  sustainability: string[];
  shipping: { text: string; modes?: PurchaseMode[] }[];
  pickupAvailable: boolean;
  faqs: { q: string; a: string; modes?: PurchaseMode[] }[];
}

export interface CartItem {
  id: string; // composite: slug|color|duration
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  mode: PurchaseMode;
  bulkPrice?: number;
  buyPrice?: number;
  buyBulkPrice?: number;
  buyBulkThreshold?: number;
  bulkThreshold?: number;
  unit: string;
  quantity: number;
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