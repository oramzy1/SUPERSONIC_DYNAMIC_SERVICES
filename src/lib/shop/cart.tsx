import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Address, CartItem, Order, SavedItem, Transaction } from "./types";
import { VAT_RATE, computeLineTotal } from "./format";

const CART_KEY = "sds-cart-v1";
const SAVED_KEY = "sds-saved-v1";
const ORDERS_KEY = "sds-orders-v1";
const ADDR_KEY = "sds-addresses-v1";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  vat: number;
  total: number;
  itemCount: number;
}

interface CartContextValue {
  items: CartItem[];
  saved: SavedItem[];
  orders: Order[];
  addresses: Address[];
  promo: string | null;
  shippingMethod: "standard" | "express" | "pickup";
  hydrated: boolean;
  setShippingMethod: (m: "standard" | "express" | "pickup") => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  updateDuration: (id: string, days: number) => void;
  clearCart: () => void;
  toggleSaved: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  totals: CartTotals;
  placeOrder: (input: {
    address: Address;
    email: string;
    shippingMethod: string;
    paymentMethod: string;
  }) => Order;
  saveAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const PROMOS: Record<string, number> = {
  WELCOME10: 0.1,
  ECO5: 0.05,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [promo, setPromo] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "pickup">(
    "standard",
  );

  useEffect(() => {
    setItems(readLS<CartItem[]>(CART_KEY, []));
    setSaved(readLS<SavedItem[]>(SAVED_KEY, []));
    setOrders(readLS<Order[]>(ORDERS_KEY, []));
    setAddresses(readLS<Address[]>(ADDR_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeLS(CART_KEY, items);
  }, [items, hydrated]);
  useEffect(() => {
    if (hydrated) writeLS(SAVED_KEY, saved);
  }, [saved, hydrated]);
  useEffect(() => {
    if (hydrated) writeLS(ORDERS_KEY, orders);
  }, [orders, hydrated]);
  useEffect(() => {
    if (hydrated) writeLS(ADDR_KEY, addresses);
  }, [addresses, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, q: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, q) } : i)));
  }, []);

  const updateDuration = useCallback((id: string, days: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, durationDays: Math.max(1, days) } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleSaved = useCallback((slug: string) => {
    setSaved((prev) =>
      prev.find((s) => s.slug === slug)
        ? prev.filter((s) => s.slug !== slug)
        : [...prev, { slug, addedAt: new Date().toISOString() }],
    );
  }, []);

  const isSaved = useCallback((slug: string) => saved.some((s) => s.slug === slug), [saved]);

  const applyPromo = useCallback((code: string) => {
    const key = code.trim().toUpperCase();
    if (!key) return { ok: false, message: "Enter a promo code" };
    if (!(key in PROMOS)) return { ok: false, message: "That promo code isn't valid" };
    setPromo(key);
    return { ok: true, message: `${key} applied - ${PROMOS[key] * 100}% off` };
  }, []);

  const clearPromo = useCallback(() => setPromo(null), []);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = items.reduce((sum, i) => sum + computeLineTotal(i), 0);
    const promoRate = promo ? (PROMOS[promo] ?? 0) : 0;
    const discount = +(subtotal * promoRate).toFixed(2);
    const afterDiscount = subtotal - discount;
    const shipping =
      shippingMethod === "pickup"
        ? 0
        : shippingMethod === "express"
          ? 19.95
          : afterDiscount >= 75 || items.length === 0
            ? 0
            : 7.95;
    const vat = +((afterDiscount + shipping) * VAT_RATE).toFixed(2);
    const total = +(afterDiscount + shipping + vat).toFixed(2);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    return { subtotal, discount, shipping, vat, total, itemCount };
  }, [items, promo, shippingMethod]);

  const placeOrder = useCallback(
    (input: {
      address: Address;
      email: string;
      shippingMethod: string;
      paymentMethod: string;
    }): Order => {
      const id = crypto.randomUUID();
      const order: Order = {
        id,
        number: `SDS-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        items: [...items],
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        discount: totals.discount,
        vat: totals.vat,
        total: totals.total,
        status: "confirmed",
        paymentStatus: "paid",
        shippingMethod: input.shippingMethod,
        paymentMethod: input.paymentMethod,
        address: input.address,
        email: input.email,
      };
      setOrders((prev) => [order, ...prev]);
      setItems([]);
      setPromo(null);
      return order;
    },
    [items, totals],
  );

  const saveAddress = useCallback((a: Address) => {
    setAddresses((prev) => {
      const exists = prev.find((x) => x.id === a.id);
      let next = exists ? prev.map((x) => (x.id === a.id ? a : x)) : [...prev, a];
      if (a.isDefault) {
        next = next.map((x) => ({ ...x, isDefault: x.id === a.id }));
      } else if (!next.some((x) => x.isDefault)) {
        next = next.map((x, i) => (i === 0 ? { ...x, isDefault: true } : x));
      }
      return next;
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const value: CartContextValue = {
    items,
    saved,
    orders,
    addresses,
    promo,
    shippingMethod,
    hydrated,
    setShippingMethod,
    applyPromo,
    clearPromo,
    addItem,
    removeItem,
    updateQuantity,
    updateDuration,
    clearCart,
    toggleSaved,
    isSaved,
    totals,
    placeOrder,
    saveAddress,
    removeAddress,
    setDefaultAddress,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function deriveTransactions(orders: Order[]): Transaction[] {
  return orders.flatMap((o) => [
    {
      id: `${o.id}-pay`,
      orderId: o.id,
      orderNumber: o.number,
      date: o.createdAt,
      type: "payment" as const,
      amount: o.total,
      method: o.paymentMethod,
      status: "succeeded" as const,
    },
    {
      id: `${o.id}-inv`,
      orderId: o.id,
      orderNumber: o.number,
      date: o.createdAt,
      type: "invoice" as const,
      amount: o.total,
      method: "VAT invoice",
      status: "succeeded" as const,
    },
  ]);
}
