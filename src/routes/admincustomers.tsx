import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardSidebar, AdminDashboardTopbar } from '@/components/admin/AdminDashboardSidebar'
import { 
  Users, 
  Building2, 
  UserCheck, 
  Download, 
  UserPlus, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react'

export const Route = createFileRoute('/admincustomers')({
  component: RouteComponent,
})

// Metrics Row Mapping Structure matching the design verbatim
const customerMetrics = [
  {
    title: "TOTAL ACTIVE CUSTOMERS",
    value: "1,248",
    change: "12%",
    icon: Users,
  },
  {
    title: "CORPORATE ACCOUNTS",
    value: "412",
    subtext: "accounts",
    icon: Building2,
  },
  {
    title: "PENDING APPROVALS",
    value: "18",
    subtext: "Requires attention",
    isAlert: true,
    icon: UserCheck,
  },
]

// Customer Directory Content Items
const customerRecords = [
  {
    name: "Global Freight Logistics",
    email: "sarah.j@globalfreight.com",
    avatarType: "initials",
    avatarText: "GF",
    totalJobs: "1,402",
    lastActive: "Today, 09:41 AM",
    accountType: "Corporate",
  },
  {
    name: "Marcus Thorne",
    email: "m.thorne@independent.com",
    avatarType: "image",
    avatarText: "MT",
    // In production, swap with real image asset url. Fallback uses a styled avatar slot
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    totalJobs: "45",
    lastActive: "Yesterday, 14:20 PM",
    accountType: "Individual",
  },
  {
    name: "Nexus Supply Chain",
    email: "operations@nexus.co",
    avatarType: "initials",
    avatarText: "NS",
    totalJobs: "892",
    lastActive: "Oct 24, 2023",
    accountType: "Corporate",
  },
]

function RouteComponent() {
  return (
    /* LAYOUT BASELINE FRAMEWORK */
    <div className="flex h-screen w-full bg-[#0d0f11] overflow-hidden font-sans antialiased text-slate-200 selection:bg-[#E2A54A]/30">
      
      {/* 1. LEFT SIDE NAVIGATION */}
      <AdminDashboardSidebar />

      {/* RIGHT SIDE CORE CONTENT CANVAS */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* 2. TOP BANNER STRIP BAR */}
        <AdminDashboardTopbar />

        {/* 3. WORKING VIEW WRAPPER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 select-none">
          
          {/* CONTENT SECTION TITLE AND UTILITY HOOKS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Customer Management</h1>
              <p className="text-sm text-slate-400 mt-1">Manage and monitor all enterprise and individual accounts.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Export Data Secondary Action */}
              <button className="flex items-center gap-2 px-3.5 py-2 bg-[#16191c] border border-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-800/60 transition duration-150">
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export Data
              </button>
              
              {/* Add Customer Main Action CTA */}
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-lg hover:bg-[#d4963b] transition duration-200">
                <span className="text-sm font-normal leading-none">+</span> Add Customer
              </button>
            </div>
          </div>

          {/* SYSTEM SUMMARY CARD MATRIX CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {customerMetrics.map((card, idx) => {
              const Icon = card.icon
              return (
                <div key={idx} className="bg-[#111315] border border-slate-800/60 rounded-xl p-5 flex flex-col justify-between h-32">
                  <div className="flex items-start justify-between w-full">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{card.title}</span>
                    <div className="text-slate-600">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className={`text-3xl font-bold tracking-tight font-mono ${card.isAlert ? 'text-rose-400' : 'text-white'}`}>
                      {card.value}
                    </h3>
                    {card.change && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded ml-0.5">
                        ↗ {card.change}
                      </span>
                    )}
                    {card.subtext && (
                      <span className={`text-xs font-medium ml-0.5 ${card.isAlert ? 'text-rose-400/70' : 'text-slate-500'}`}>
                        {card.subtext}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* MAIN DATASHEET INTERFACE WRAPPER */}
          <div className="bg-[#111315] border border-slate-800/60 rounded-xl overflow-hidden flex flex-col mb-6">
            
            {/* DATA VIEW FILTERS HUB BAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-slate-800/60">
              
              {/* Segmentation Sorting Segment Pills */}
              <div className="flex items-center bg-[#0d0f11] p-1 rounded-lg border border-slate-800/60 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-fit">
                <button className="px-3 py-1 bg-[#E2A54A]/10 text-[#E2A54A] rounded-md border border-[#E2A54A]/10">All</button>
                <button className="px-3 py-1 hover:text-slate-200 transition-colors">Corporate</button>
                <button className="px-3 py-1 hover:text-slate-200 transition-colors">Individual</button>
              </div>

              {/* Layout Dropdown Sequencer */}
              <div className="flex items-center justify-end">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111315] border border-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" /> Sort by: Last Active
                </button>
              </div>
            </div>

            {/* CORE TABLE MATRIX ENGINE */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-212.5 text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/40 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    <th className="py-4 px-6">CUSTOMER</th>
                    <th className="py-4 px-6">CONTACT</th>
                    <th className="py-4 px-6">TOTAL JOBS</th>
                    <th className="py-4 px-6">LAST ACTIVE</th>
                    <th className="py-4 px-6 text-right">TYPE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/20">
                  {customerRecords.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10 transition duration-150">
                      
                      {/* Name Label and Node Mark */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {row.avatarType === 'image' ? (
                            <img 
                              src={row.imageUrl} 
                              alt={row.name} 
                              className="w-7 h-7 rounded-full object-cover border border-slate-700/40 shadow-inner"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-[11px] font-bold text-slate-400 font-sans">
                              {row.avatarText}
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-200 tracking-tight">{row.name}</span>
                        </div>
                      </td>

                      {/* Contact Communications Route Channels */}
                      <td className="py-4 px-6 text-xs font-mono font-medium text-slate-400">
                        {row.email}
                      </td>

                      {/* Activity Density Track Metrics */}
                      <td className="py-4 px-6 text-xs font-mono font-bold text-slate-300">
                        {row.totalJobs}
                      </td>

                      {/* Chronological Active Timestamps */}
                      <td className="py-4 px-6 text-xs font-medium text-slate-400">
                        {row.lastActive}
                      </td>

                      {/* Functional Account Tier Badging */}
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide ${
                          row.accountType === 'Corporate' 
                            ? 'bg-blue-500/5 border border-blue-500/10 text-blue-400/90' 
                            : 'bg-slate-800/40 border border-slate-700/60 text-slate-400'
                        }`}>
                          {row.accountType}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DIRECTORY PAGINATION DATA ENGINE FOOTER */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/60 bg-[#0e1012]/20">
              <span className="text-xs text-slate-500 font-medium">
                Showing <span className="text-slate-400 font-semibold">1 to 10</span> of <span className="text-slate-400 font-semibold">1,248</span> entries
              </span>

              {/* Data controls indexes layout */}
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md border border-slate-800/80 text-slate-600 hover:text-slate-400 disabled:opacity-20 transition-colors" disabled>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="px-2.5 py-1 text-xs font-bold font-mono rounded bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/20">1</button>
                <button className="px-2.5 py-1 text-xs font-bold font-mono rounded border border-slate-800/60 text-slate-500 hover:text-slate-300 transition-colors">2</button>
                <button className="px-2.5 py-1 text-xs font-bold font-mono rounded border border-slate-800/60 text-slate-500 hover:text-slate-300 transition-colors">3</button>
                <span className="text-slate-600 text-xs px-1 font-bold">...</span>
                <button className="p-1.5 rounded-md border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* SYSTEM EXTENSION: MEANINGFUL SUB-TABLE SUMMARY WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            
            <div className="bg-[#111315]/40 border border-slate-800/40 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 bg-emerald-500/5 text-emerald-400 rounded-lg border border-emerald-500/10">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-tight">VIP Client Velocity Boost</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Top 3 Corporate accounts expanded operational volume by 14% this week.</p>
              </div>
            </div>

            <div className="bg-[#111315]/40 border border-slate-800/40 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 bg-rose-500/5 text-rose-400 rounded-lg border border-rose-500/10">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-tight">Verification Check Required</span>
                <p className="text-[11px] text-slate-500 mt-0.5">18 individual accounts are pending business credential matching verification.</p>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  )
}