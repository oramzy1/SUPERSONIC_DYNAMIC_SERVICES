import student from "@/assets/images/service-student.jpg";
import residential from "@/assets/images/service-residential.jpg";
import enterprise from "@/assets/images/service-enterprise.jpg";
import storage from "@/assets/images/service-storage.jpg";
import waste from "@/assets/images/service-waste.jpg";

export type ServiceDetail = {
  slug: string;
  image: string;
  heroTitle: string;
  title: string;
  intro: string;
  body: string[];
  expertise: string;
  tags: string[];
  benefits: string[];
};

export const SERVICES: ServiceDetail[] = [
  {
    slug: "student-moving",
    image: student,
    heroTitle: "Student Moving & Micro Moving With Supersonic",
    title: "Student & Micro Moving with SUPERSONIC DYNAMIC SERVICES - Fast, Smart and Stress-Free.",
    intro:
      "At SUPERSONIC DYNAMIC SERVICES, we redefine student and micro-moving with a seamless, technology-driven and eco-responsible approach. Our mission is simple: to make your move smooth, efficient, and completely stress-free.",
    body: [
      "Whether you're relocating to a student room across town or moving into a new apartment in a different city, our professional movers handle every detail with precision and care - so you don't have to struggle with heavy lifting or logistics on your own. With extensive experience operating throughout the Netherlands, our team is fully prepared for every scenario - including challenging city-center moves, narrow streets, upper-floor apartments, and tight staircases. No location is too complex for our expertise.",
    ],
    expertise:
      "Private and family household relocations, Senior and elderly home transitions, Care home and assisted living moves, Full or partial house clearances.",
    tags: ["Tech Innovation", "Eco-Centric", "Global Scale"],
    benefits: [
      "Transparent pricing with no hidden costs",
      "Professional, trained and courteous movers.",
      "Secure handling of sensitive assets & equipment.",
      "Local and long-distance coverage across the Netherlands",
      "Fast booking & flexible schedule",
      "Eco-responsible moving solutions (electric vans & sustainable logistics).",
    ],
  },
  {
    slug: "residential-moving",
    image: residential,
    heroTitle: "Residential Moving Local & Long Distance",
    title:
      "Residential Moving (Local & Long-Distance) - Professional, Fast, Reliable & Stress-Free.",
    intro:
      "At SUPERSONIC DYNAMIC SERVICES, we provide comprehensive residential moving solutions across the Netherlands - designed for private individuals, family households, seniors, elderly relocations, care home transfers, and full house clearances.",
    body: [
      "We understand that moving a home is more than transporting furniture - it's relocating memories, valuables, and personal belongings that matter most. That's why our experienced team which are fully prepared for all scenarios delivers a seamless, technology-driven, and eco-responsible moving experience from start to finish. Whether you are moving locally within your city or relocating long-distance across the Netherlands, we manage every detail with precision, care, and professionalism. From spacious family homes to senior apartments and assisted living facilities, we handle each move with efficiency, reliability, and customer-focused service to ensure your move is smooth, fast, secure, and stress-free.",
    ],
    expertise:
      "Private and family household relocations, Senior and elderly home transitions, Care home and assisted living moves, Full or partial house clearances.",
    tags: ["Tech Innovation", "Eco-Centric", "Global Scale"],
    benefits: [
      "Transparent pricing with no hidden costs",
      "Professional, trained and courteous movers.",
      "Secure handling of sensitive assets & equipment.",
      "Local and long-distance coverage across the Netherlands",
      "Flexible scheduling tailored to your needs.",
      "Eco-responsible moving solutions (electric vans & sustainable logistics).",
    ],
  },
  {
    slug: "enterprise-moving",
    image: enterprise,
    heroTitle: "Enterprise & Commercial Moving",
    title:
      "Enterprise & Commercial Moving (Local & Long-Distance) - Efficient, Structured & Business-Focused.",
    intro:
      "SUPERSONIC DYNAMIC SERVICES, is a trusted partner for small, medium, large-scale enterprise and commercial relocations across the Netherlands.",
    body: [
      "We specialize in delivering structured, high-performance moving solutions for corporate enterprises, educational institutions, healthcare facilities, logistics operators, retail chains, industrial sites, and large event infrastructures. We understand that enterprise relocation is a strategic operation - where precision, compliance, risk management, and operational continuity are non-negotiable. Our approach combines advanced planning, experienced project leadership, and technology-driven execution to ensure minimal disruption and maximum efficiency.",
      "From multi-site corporate headquarters and warehouse consolidations to nursing home transfers, supermarket chains, and institutional relocations, we deploy scalable teams and specialized equipment to manage even the most demanding projects while adhering to safety standards, compliance regulations, professional best practices and your operational objectives.",
    ],
    expertise: "",
    tags: ["Tech Innovation", "Eco-Centric", "Global Scale"],
    benefits: [
      "Dedicated move Project managers and Professional, trained and courteous movers.",
      "Detailed pre-move audits & operational planning site visit.",
      "Local and long-distance coverage across the Netherlands.",
      "Secure handling of sensitive assets & equipment.",
      "After-hours & weekend execution capabilities.",
      "Eco-responsible moving solutions (electric vans and sustainable logistics).",
    ],
  },
  {
    slug: "smart-storage",
    image: storage,
    heroTitle: "SMART STORAGE SOLUTIONS Secure, Flexible & Hassle-Free",
    title: "SMART STORAGE SOLUTIONS - Secure, Flexible & Hassle-Free",
    intro:
      "At SUPERSONIC DYNAMIC SERVICES, we provide safe, flexible, and professionally managed storage solutions tailored for individuals, families, and businesses that need reliable short-term or long-term storage.",
    body: [
      "Whether you are in between moves, downsizing, renovating, or simply need extra space, we offer a secure environment where your belongings whether it's household furniture, personal belongings, business inventory, or sensitive items, are protected, organized, and easily accessible. Our storage service is designed to integrate seamlessly with your moving process, giving you a complete end-to-end solution. From careful packing and inventory management to secure transportation and storage placement, our experienced team ensures your belongings remain safe and in excellent condition.",
    ],
    expertise:
      "Short-term and long-term storage solutions for household goods, business and commercial goods, furniture and appliances, temporary storage during relocation or renovation.",
    tags: ["Tech Innovation", "Eco-Centric", "Global Scale"],
    benefits: [
      "Secure and monitored storage facilities",
      "Flexible storage durations to suit your needs",
      "Professional handling and packing.",
      "Easy access and retrieval options",
      "Integration with our moving services for a seamless experience.",
      "Transparent pricing with no hidden costs",
    ],
  },
  {
    slug: "waste-removal",
    image: waste,
    heroTitle: "SUSTAINABLE WASTE REMOVAL SERVICES Fast, Responsible & Efficient",
    title: "SUSTAINABLE WASTE REMOVAL SERVICES - Fast, Responsible & Efficient",
    intro:
      "AT SUPERSONIC DYNAMIC SERVICES, we provide fast, efficient, and eco-responsible waste removal services across our regions of operation - helping households and businesses clear unwanted items quickly and responsibly.",
    body: [
      "Whether you are moving, renovating, decluttering, or managing a property clean-out, we handle all types of non-hazardous waste. We understand that waste removal can be time-consuming and physically demanding which is why our trained team takes care of everything from collection to responsible disposal with professionalism and care.",
      "Our approach goes beyond simple removal. We focus on sustainability by sorting, recycling, and disposing of waste in compliance with environmental standards in the Netherlands as we aim to reduce landfill impact through recycling and reuse initiatives.",
    ],
    expertise:
      "Household waste removal, Furniture and bulky item disposal, Renovation and construction debris removal, Garden and outdoor waste removal, Office and commercial clean-outs, Full property and estate clearances.",
    tags: ["Tech Innovation", "Eco-Centric", "Global Scale"],
    benefits: [
      "Fast response and same-day or scheduled pickups.",
      "Responsible waste disposal and recycling practices.",
      "Responsible waste disposal and recycling practices.",
      "Suitable for small pickups to large-scale clearances.",
      "Transparent pricing with no hidden fees.",
      "Eco-friendly operations aligned with Dutch regulations.",
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
