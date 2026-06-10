import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Edit3, X, Plus, Save, Info, Layers, Sparkles, Trash2 } from "lucide-react";

// Local Asset fallbacks if bundler paths resolve asynchronously
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

const INITIAL_SERVICES: ServiceDetail[] = [
  {
    slug: "student-moving",
    image: student,
    heroTitle: "Student Moving & Micro Moving With Supersonic",
    title: "Student & Micro Moving (Local & Short Distance)",
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
    title: "Residential Moving (Local & Long-Distance)",
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
    title: "Enterprise & Commercial Moving (Local & Long-Distance)",
    intro:
      "SUPERSONIC DYNAMIC SERVICES, is a trusted partner for small, medium, large-scale enterprise and commercial relocations across the Netherlands.",
    body: [
      "We specialize in delivering structured, high-performance moving solutions for corporate enterprises, educational institutions, healthcare facilities, logistics operators, retail chains, industrial sites, and large event infrastructures. We understand that enterprise relocation is a strategic operation - where precision, compliance, risk management, and operational continuity are non-negotiable. Our approach combines advanced planning, experienced project leadership, and technology-driven execution to ensure minimal disruption and maximum efficiency.",
      "From multi-site corporate headquarters and warehouse consolidations to nursing home transfers, supermarket chains, and institutional relocations, we deploy scalable teams and specialized equipment to manage even the most demanding projects while adhering to safety standards, compliance regulations, professional best practices and your operational objectives.",
    ],
    expertise:
      "Corporate hub transitions, Multi-floor workplace relocations, Document file management compliance mapping",
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
    title: "SMART STORAGE SOLUTIONS (Secure, Flexible & Hassle-Free)",
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
    title: "SUSTAINABLE WASTE REMOVAL SERVICES (Fast, Responsible & Efficient)",
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
      "Suitable for small pickups to large-scale clearances.",
      "Transparent pricing with no hidden fees.",
      "Eco-friendly operations aligned with Dutch regulations.",
    ],
  },
];

export function RouteComponent() {
  const [services, setServices] = useState<ServiceDetail[]>(INITIAL_SERVICES);
  const [editingService, setEditingService] = useState<ServiceDetail | null>(null);
  const [isNewService, setIsNewService] = useState<boolean>(false);

  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({
    "student-moving": true,
    "residential-moving": true,
    "enterprise-moving": true,
    "smart-storage": true,
    "waste-removal": true,
  });

  const handleToggle = (slug: string) => {
    setActiveToggles((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const openCustomizer = (service: ServiceDetail) => {
    setIsNewService(false);
    setEditingService(JSON.parse(JSON.stringify(service)));
  };

  const openNewServiceModal = () => {
    setIsNewService(true);
    setEditingService({
      slug: "",
      image: "",
      heroTitle: "",
      title: "",
      intro: "",
      body: [""],
      expertise: "",
      tags: [""],
      benefits: [""],
    });
  };

  const closeCustomizer = () => {
    setEditingService(null);
  };

  const handleInputChange = (field: keyof ServiceDetail, value: any) => {
    if (!editingService) return;

    setEditingService((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };

      if (isNewService && field === "title") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  const handleArrayChange = (field: "body" | "tags" | "benefits", index: number, value: string) => {
    if (!editingService) return;
    const updatedArray = [...editingService[field]];
    updatedArray[index] = value;
    handleInputChange(field, updatedArray);
  };

  const addArrayItem = (field: "body" | "tags" | "benefits") => {
    if (!editingService) return;
    handleInputChange(field, [...editingService[field], ""]);
  };

  const removeArrayItem = (field: "body" | "tags" | "benefits", index: number) => {
    if (!editingService) return;
    handleInputChange(
      field,
      editingService[field].filter((_, i) => i !== index),
    );
  };

  const saveServiceModifications = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (isNewService) {
      if (services.some((s) => s.slug === editingService.slug)) {
        alert("A service configuration card with this slug identifier already exists.");
        return;
      }
      setServices((prev) => [...prev, editingService]);
      setActiveToggles((prev) => ({ ...prev, [editingService.slug]: true }));
    } else {
      setServices((prev) => prev.map((s) => (s.slug === editingService.slug ? editingService : s)));
    }

    closeCustomizer();
    console.log("POST Matrix Stream updated successfully for element:", editingService.slug);
  };

  return (
    <div className="w-full text-slate-200 select-none pb-12 font-sans antialiased">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Service Modules</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage available logistics services, configure pricing parameters, and control
            operational status across all regions.
          </p>
        </div>

        <button
          onClick={openNewServiceModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#d4963b] transition duration-200 self-start md:self-auto"
        >
          <span className="text-base font-normal leading-none">+</span> New Service
        </button>
      </div>

      {/* DYNAMIC CARDS MATRIX HUB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {services.map((service) => {
          const isActive = activeToggles[service.slug] ?? false;
          return (
            <div
              key={service.slug}
              className="bg-[#111315] border border-slate-800/60 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-800 transition duration-200"
            >
              <div className="h-48 w-full overflow-hidden relative bg-slate-900/60">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/40 border-b border-slate-900 text-slate-600">
                    <Layers className="w-8 h-8 stroke-1 mb-1" />
                    <span className="text-[10px] uppercase tracking-widest font-mono">
                      No Image Attached
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#111315] to-transparent opacity-90" />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                    {service.title || "Untitled Service module"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {service.intro || "No current summary description payload provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/40">
                  <div
                    onClick={() => handleToggle(service.slug)}
                    className={`w-11 h-6 rounded-full p-0.5 cursor-pointer flex items-center transition-colors duration-200 ${
                      isActive
                        ? "bg-[#E2A54A]/20 border border-[#E2A54A]/30"
                        : "bg-slate-800 border border-slate-700/50"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isActive ? "translate-x-5 bg-[#E2A54A]" : "translate-x-0 bg-slate-500"
                      }`}
                    >
                      {isActive && (
                        <span className="text-[9px] font-extrabold text-slate-950 select-none">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openCustomizer(service)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-[#E2A54A]/40 hover:border-[#E2A54A] rounded-md text-[10px] font-bold text-[#E2A54A] uppercase tracking-wider transition-all duration-150"
                  >
                    <Edit3 className="w-3 h-3" /> Configure
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* META FEEDBACK INFO LAYOUT FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/40 pt-6">
        <div className="bg-[#111315]/40 border border-slate-800/40 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#E2A54A] mt-0.5" />
          <div>
            <span className="text-xs font-bold text-white tracking-tight">
              Active Edge-Caching Node Sync
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Content updates transmitted using custom hooks trigger instant invalidation across
              client edge routers.
            </p>
          </div>
        </div>
        <div className="bg-[#111315]/40 border border-slate-800/40 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-white tracking-tight">
              Eco-Centric Logistics Metric Flag
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              All updated service records automatically inherit Dutch corporate environmental
              standard tags.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG OVERLAY PANEL */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-[#070809]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111315] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl transition duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#14171a]/40">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#E2A54A]" />
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {isNewService ? "Create New Logistics Service" : "Customize Service Properties"}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {isNewService
                      ? "Target Routing Key: auto-assigned"
                      : `slug: ${editingService.slug}`}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCustomizer}
                className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={saveServiceModifications}
              className="flex-1 overflow-y-auto p-6 space-y-5 text-xs"
            >
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Card & Display Title
                </label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Commercial Moving Support"
                  className="bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E2A54A]/60 font-medium transition"
                  required
                />
              </div>

              {isNewService && (
                <div className="flex flex-col gap-1.5 opacity-75">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Generated URL Key Route
                  </label>
                  <input
                    type="text"
                    value={editingService.slug}
                    readOnly
                    placeholder="auto-generated-from-title"
                    className="bg-[#090b0c] border border-slate-900 rounded-lg p-2.5 text-[#E2A54A] font-mono focus:outline-none"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Hero Title Segment
                </label>
                <input
                  type="text"
                  value={editingService.heroTitle}
                  onChange={(e) => handleInputChange("heroTitle", e.target.value)}
                  placeholder="High-impact hero layout banner statement"
                  className="bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E2A54A]/60 font-medium transition"
                  required
                />
              </div>

              {isNewService && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Image Asset Category Preset
                  </label>
                  <select
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    className="bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-[#E2A54A]/60 font-medium transition"
                    required
                  >
                    <option value="">Select illustrative archetype wrapper...</option>
                    <option value={student}>Student & Micro Moving Base Graphic</option>
                    <option value={residential}>Residential Moving Long Distance Graphic</option>
                    <option value={enterprise}>Enterprise Commercial Fleet Graphic</option>
                    <option value={storage}>Smart Vault Storage Graphic</option>
                    <option value={waste}>Sustainable Disposal & Cleansing Fleet Graphic</option>
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Intro Text Blocks
                </label>
                <textarea
                  rows={3}
                  value={editingService.intro}
                  onChange={(e) => handleInputChange("intro", e.target.value)}
                  placeholder="Brief paragraph summary displayed inside catalog indexes..."
                  className="bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E2A54A]/60 font-medium leading-relaxed resize-none transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Expertise Scope Matrix
                </label>
                <textarea
                  rows={2}
                  value={editingService.expertise}
                  onChange={(e) => handleInputChange("expertise", e.target.value)}
                  placeholder="Target niche qualifications, separated by commas..."
                  className="bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E2A54A]/60 font-medium leading-relaxed resize-none transition"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Detailed Body Paragraph Blocks
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("body")}
                    className="text-[10px] text-[#E2A54A] flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Paragraph
                  </button>
                </div>
                {editingService.body.map((paragraph, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <textarea
                      rows={3}
                      value={paragraph}
                      onChange={(e) => handleArrayChange("body", index, e.target.value)}
                      placeholder="Comprehensive operational details context chunk..."
                      className="flex-1 bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E2A54A]/60 font-medium leading-relaxed resize-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("body", index)}
                      className="p-2.5 text-slate-500 hover:text-rose-400 transition mt-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Classification Tags
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("tags")}
                    className="text-[10px] text-[#E2A54A] flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Tag
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {editingService.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tag}
                        placeholder="e.g., Ultra-Secure"
                        onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                        className="flex-1 bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E2A54A]/60 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("tags", index)}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Service Value Benefits & Deliverables
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("benefits")}
                    className="text-[10px] text-[#E2A54A] flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Benefit Line
                  </button>
                </div>
                {editingService.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={benefit}
                      placeholder="e.g., 24/7 client dispatch pipeline transparency"
                      onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
                      className="flex-1 bg-[#0d0f11] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E2A54A]/60 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("benefits", index)}
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCustomizer}
                  className="px-4 py-2 rounded-lg bg-transparent border border-slate-800 text-slate-400 font-semibold hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-bold rounded-lg hover:bg-[#d4963b] transition"
                >
                  <Save className="w-3.5 h-3.5" />{" "}
                  {isNewService ? "Deploy & Post Service" : "Save Changes & Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REGISTER ROUTE AT THE BOTTOM TO PREVENT HOISTING UNDEFINED PROBLEMS ───
export const Route = createFileRoute("/_auth/adminservices")({
  component: RouteComponent,
});