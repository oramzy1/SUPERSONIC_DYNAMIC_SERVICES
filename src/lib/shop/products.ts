import type { Product } from "./types";
import alcCrates from "@/assets/shop/movingcrate.webp";
import crateGrey from "@/assets/shop/movingcrate2.webp";
import cratesLifestyle from "@/assets/shop/movingcreate1.webp";
import bubbleWrap from "@/assets/shop/bubble-wrap.jpg";
import bubbleWrapSmall from "@/assets/shop/bubble-wrap-small.jpg";

export const CATEGORIES: { id: Product["category"]; label: string }[] = [
  { id: "crates", label: "Crates & Containers" },
  { id: "packaging", label: "Packaging" },
  { id: "accessories", label: "Accessories" },
];

export const PRODUCTS: Product[] = [
  {
    slug: "alc-recyclable-moving-crate",
    name: "ALC Recyclable Moving Crate",
    category: "crates",
    categoryLabel: "Crates & Containers",
    shortDescription:
      "Rentable, stackable, 100% recyclable moving crate. Replaces 6+ cardboard boxes.",
    description:
      "Our flagship ALC crate is engineered for professional moving operations. Heavy-duty recycled polypropylene, ergonomic handles, and a secure interlocking lid make packing, stacking, and transporting effortless - without single-use cardboard waste.",
    price: 2,
    bulkPrice: 1,
    bulkThreshold: 20,
    unit: "/ crate / day",
    rental: true,
    rentalDurations: [1, 3, 7, 14, 30],
    // colors: [
    //   { id: "grey", name: "Grey", hex: "#9CA3AF" },
    //   { id: "blue", name: "Blue", hex: "#2563EB" },
    //   { id: "red", name: "Red", hex: "#DC2626" },
    //   { id: "green", name: "Green", hex: "#16A34A" },
    //   { id: "yellow", name: "Yellow", hex: "#EAB308" },
    // ],
    images: [alcCrates, crateGrey, cratesLifestyle],
    badges: ["eco", "best-seller", "rental", "discount"],
    stock: 980,
    specs: [
      { label: "External dimensions", value: "60 × 40 × 32 cm" },
      { label: "Internal capacity", value: "65 litres" },
      { label: "Max load", value: "35 kg" },
      { label: "Material", value: "Recycled HDPE / PP" },
      { label: "Stackable", value: "Up to 10 units" },
    ],
    features: [
      "Replaces ~6 cardboard boxes per crate",
      "Interlocking lid with secure seal",
      "Ergonomic dual handles",
      "Stackable empty or loaded",
      "Color-coded for room sorting",
    ],
    sustainability: [
      "Made from 100% recycled plastics",
      "Reusable for 400+ moves",
      "Avoids single-use cardboard & tape",
      "Closed-loop pickup & sanitisation",
    ],
    shipping: [
      "Delivery withing 1-3 working days",
      // "Next-day delivery available",
      "Free pickup at end of rental",
    ],
    pickupAvailable: true,
    faqs: [
      {
        q: "How does the rental work?",
        a: "Select your crate count and rental days at checkout. We deliver clean, sanitised crates to your address and collect them when you're done.",
      },
      {
        q: "Do I get a discount for bulk orders?",
        a: "Yes - 20 crates or more drops the price to €1 per crate per day, automatically applied in your cart.",
      },
      {
        q: "What happens if a crate is damaged?",
        a: "Normal wear is included. Significant damage is charged at the original cost of the crate.",
      },
    ],
  },
  {
    slug: "bubble-wrap-cushion-roll-large",
    name: "Bubble Wrap Cushion Roll - 1m × 10m",
    category: "packaging",
    categoryLabel: "Packaging",
    shortDescription:
      "Large protective cushion roll for furniture, art, and oversized fragile items.",
    description:
      "Premium bubble cushion film optimised for shock absorption during long-haul moves. Lightweight, transparent for easy item identification, and made with recycled-content polyethylene.",
    price: 11.3,
    unit: "/ roll",
    rental: false,
    images: [bubbleWrap, bubbleWrapSmall],
    badges: ["eco", "best-seller"],
    stock: 240,
    specs: [
      { label: "Dimensions", value: "1.0 m × 10 m" },
      { label: "Bubble size", value: "10 mm" },
      { label: "Weight", value: "1.2 kg" },
      { label: "Material", value: "Recycled-content LDPE" },
    ],
    features: [
      "Excellent shock absorption",
      "Easy tear perforations every 50 cm",
      "Anti-static surface",
      "Reusable across multiple moves",
    ],
    sustainability: [
      "Made with ≥ 30% recycled content",
      "Fully recyclable in PE waste streams",
      "We collect unused rolls for the next mover",
    ],
    shipping: [
      "Ships within 24h from NL warehouse",
      "Dlivery to all our locations",
      "Pickup available at our depot",
    ],
    pickupAvailable: true,
    faqs: [
      {
        q: "Is this roll suitable for art and glass?",
        a: "Yes - the 10 mm bubble profile is ideal for framed art, mirrors, and glassware. For very heavy items pair with our moving blankets.",
      },
    ],
  },
  {
    slug: "bubble-wrap-cushion-roll-small",
    name: "Bubble Wrap Cushion Roll - 0.5m × 5m",
    category: "packaging",
    categoryLabel: "Packaging",
    shortDescription: "Compact cushion roll for kitchenware, electronics, and small fragile items.",
    description:
      "The same high-quality recycled-content bubble film in a compact roll, sized for top-ups and small moves. Easy to store and re-use.",
    price: 2.8,
    unit: "/ roll",
    rental: false,
    images: [bubbleWrapSmall, bubbleWrap],
    badges: ["eco", "new"],
    stock: 360,
    specs: [
      { label: "Dimensions", value: "0.5 m × 5 m" },
      { label: "Bubble size", value: "10 mm" },
      { label: "Weight", value: "0.3 kg" },
      { label: "Material", value: "Recycled-content LDPE" },
    ],
    features: ["Perfect top-up size", "Anti-static surface", "Tear perforations", "Reusable"],
    sustainability: ["Made with ≥ 30% recycled content", "Fully recyclable in PE waste streams"],
    shipping: ["Ships within 24h from NL warehouse", "Delivery to all our locations"],
    pickupAvailable: true,
    faqs: [
      {
        q: "Can I combine with the large roll?",
        a: "Absolutely. Most customers pair the 0.5m roll for kitchenware with the 1m roll for furniture.",
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const BADGE_META: Record<string, { label: string; className: string }> = {
  eco: {
    label: "Eco-Friendly",
    className: "bg-[#16A34A]/15 text-[#79FF5B] border-[#79FF5B]/30",
  },
  "best-seller": {
    label: "Best Seller",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  rental: {
    label: "Rental",
    className: "bg-cyan/15 text-cyan border-cyan/30",
  },
  new: {
    label: "New Arrival",
    className: "bg-secondary/40 text-foreground border-white/20",
  },
  discount: {
    label: "Bulk Discount",
    className: "bg-[#DC2626]/15 text-[#FCA5A5] border-[#FCA5A5]/30",
  },
};
