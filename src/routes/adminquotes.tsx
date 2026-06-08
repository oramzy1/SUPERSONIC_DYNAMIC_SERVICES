import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardSidebar, AdminDashboardTopbar } from '@/components/admin/AdminDashboardSidebar'
import { 
  FileClock, 
  CheckSquare, 
  Banknote, 
  Search, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react'

export const Route = createFileRoute('/adminquotes')({
  component: RouteComponent,
})

// Metrics Cards Data Structure matching Design Exactly
const metrics = [
  {
    title: "TOTAL PENDING",
    value: "42",
    change: "+12%",
    subtext: "Requiring immediate review",
    icon: FileClock,
  },
  {
    title: "APPROVAL RATE",
    value: "78%",
    subtext: "avg",
    progress: 78,
    icon: CheckSquare,
  },
  {
    title: "EST. MONTHLY VALUE",
    value: "$1.2M",
    change: "+5%",
    subtext: "Based on approved quotes",
    icon: Banknote,
  },
]

// Quotes Table Rows Data (Matching the recurring pattern in the design)
const quotesData = Array(8).fill({
  id: "#Q-8942",
  customer: "Acme Corp",
  initials: "A",
  serviceType: "Enterprise",
  date: "Oct 24, 2023",
  value: "$45,000",
  status: "PENDING"
})

function RouteComponent() {
  return (
    /* OUTER LAYOUT WRAPPER */
    <div className="flex h-screen w-full bg-[#0d0f11] overflow-hidden font-sans antialiased text-slate-200 selection:bg-[#E2A54A]/30">
      
      {/* 1. LEFT SIDE PANEL */}
      <AdminDashboardSidebar />

      {/* RIGHT SIDE CONTENT CONTAINER */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* 2. TOP HEADER NAVIGATION BAR */}
        <AdminDashboardTopbar />

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 select-none">
          
          {/* HEADER ACTION ACTION PANEL */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Quotes Management</h1>
              <p className="text-sm text-slate-400 mt-1">Review, approve, and manage inbound logistics service requests.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Export CSV Utility Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#16191c] border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition duration-150">
                <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
              </button>
              
              {/* New Quote CTA Accent Button */}
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#d4963b] transition duration-200">
                <span className="text-base font-normal leading-none">+</span> New Quote
              </button>
            </div>
          </div>

          {/* METRICS ROW (3 Column Split layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {metrics.map((card, idx) => {
              const Icon = card.icon
              return (
                <div key={idx} className="bg-[#111315] border border-slate-800/60 rounded-xl p-5 flex flex-col justify-between h-36">
                  <div className="flex items-start justify-between w-full">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{card.title}</span>
                    <div className="p-1.5 bg-slate-900/40 rounded-lg border border-slate-800/40 text-[#E2A54A]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-white tracking-tight font-mono">{card.value}</h3>
                      {card.change && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded">
                          {card.change}
                        </span>
                      )}
                      {card.title === "APPROVAL RATE" && (
                        <span className="text-xs font-medium text-slate-500 ml-1">{card.subtext}</span>
                      )}
                    </div>
                    
                    {/* Render standard descriptive subtext OR approval progress bar conditional metrics */}
                    {card.progress ? (
                      <div className="w-full mt-3">
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#E2A54A] rounded-full" style={{ width: `${card.progress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-slate-500 mt-1">{card.subtext}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* QUOTES MANAGEMENT MASTER TABLE CONTAINER */}
          <div className="bg-[#111315] border border-slate-800/60 rounded-xl overflow-hidden flex flex-col">
            
            {/* TABLE FILTER OPTIONS AND SEARCH HUB BAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-slate-800/60">
              
              {/* Category Sorting Tabs Segment */}
              <div className="flex items-center gap-1.5 bg-[#0d0f11] p-1 rounded-lg border border-slate-800/60 text-xs font-medium text-slate-400 w-fit">
                <button className="px-3 py-1 bg-[#E2A54A]/10 text-[#E2A54A] rounded-md border border-[#E2A54A]/10 font-semibold">All Quotes</button>
                <button className="px-3 py-1 hover:text-slate-200 transition-colors">Pending</button>
                <button className="px-3 py-1 hover:text-slate-200 transition-colors">Approved</button>
                <button className="px-3 py-1 hover:text-slate-200 transition-colors">Rejected</button>
              </div>

              {/* Functional Row Context Searching & Filter Tools */}
              <div className="flex items-center gap-2">
                <div className="flex flex-1 sm:w-64 items-center gap-2 rounded-lg bg-[#16191c] px-3 py-1.5 border border-slate-800/60">
                  <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search ID or Customer..."
                    className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>
                <button className="grid h-8 w-8 place-items-center rounded-lg bg-[#16191c] border border-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CORE DATA SHEET TABULAR MATRIX */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/40 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    <th className="py-4 px-6">QUOTE ID</th>
                    <th className="py-4 px-6">CUSTOMER NAME</th>
                    <th className="py-4 px-6">SERVICE TYPE</th>
                    <th className="py-4 px-6">REQUEST DATE</th>
                    <th className="py-4 px-6">EST. VALUE</th>
                    <th className="py-4 px-6">STATUS</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/20">
                  {quotesData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10 transition duration-150 group">
                      {/* Quote unique identifier */}
                      <td className="py-3.5 px-6 font-mono font-bold text-[#E2A54A]/80 text-xs">
                        {row.id}
                      </td>

                      {/* Customer Token Representation */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-xs font-bold text-slate-400 font-sans shadow-sm">
                            {row.initials}
                          </div>
                          <span className="text-xs font-semibold text-slate-200">{row.customer}</span>
                        </div>
                      </td>

                      {/* Logistic Tier Classification */}
                      <td className="py-3.5 px-6 text-xs font-medium text-slate-400">
                        {row.serviceType}
                      </td>

                      {/* Processing Timestamp Date */}
                      <td className="py-3.5 px-6 text-xs font-medium text-slate-400">
                        {row.date}
                      </td>

                      {/* Financial Valuations */}
                      <td className="py-3.5 px-6 text-xs font-mono font-bold text-slate-200">
                        {row.value}
                      </td>

                      {/* Badge Operational Status Flag */}
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#E2A54A]/5 border border-[#E2A54A]/10 text-[#E2A54A] text-[9px] font-bold tracking-wider uppercase">
                          {row.status}
                        </span>
                      </td>

                      {/* Targeted Deep View Context trigger button */}
                      <td className="py-3.5 px-6 text-right">
                        <button className="px-3 py-1 bg-transparent border border-[#E2A54A]/20 hover:border-[#E2A54A] text-[#E2A54A] text-[10px] font-bold rounded-md tracking-wide uppercase transition duration-150">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION DATA METRIC CONTROLS FOOTER */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/60 bg-[#0e1012]/40">
              <span className="text-xs text-slate-500 font-medium">
                Showing <span className="text-slate-400 font-semibold">1 to 5</span> of <span className="text-slate-400 font-semibold">42</span> entries
              </span>

              {/* Interactive Multi-page triggers */}
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md border border-slate-800 text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 disabled:opacity-30 transition-colors" disabled>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="px-2.5 py-1 text-xs font-bold font-mono rounded bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/20">1</button>
                <button className="px-2.5 py-1 text-xs font-bold font-mono rounded border border-slate-800/60 text-slate-500 hover:text-slate-300 transition-colors">2</button>
                <button className="px-2.5 py-1 text-xs font-bold font-mono rounded border border-slate-800/60 text-slate-500 hover:text-slate-300 transition-colors">3</button>
                <span className="text-slate-600 text-xs px-1 font-bold">...</span>
                <button className="p-1.5 rounded-md border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  )
}