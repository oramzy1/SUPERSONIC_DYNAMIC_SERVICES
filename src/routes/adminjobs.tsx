import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardSidebar, AdminDashboardTopbar } from '@/components/admin/AdminDashboardSidebar'
import { 
  Briefcase, 
  Truck, 
  AlertTriangle, 
  SlidersHorizontal,
  LayoutList,
  KanbanSquare,
  MoreVertical,
  Calendar,
  MapPin,
  UserPlus
} from 'lucide-react'

export const Route = createFileRoute('/adminjobs')({
  component: RouteComponent,
})

// High-Level Assignment Metrics Data
const summaryMetrics = [
  {
    title: "JOBS TODAY",
    value: "142",
    change: "12%",
    isPositive: true,
    icon: Briefcase,
  },
  {
    title: "ACTIVE FLEET CAPACITY",
    value: "86%",
    subtext: "Utilized",
    progress: 86,
    icon: Truck,
  },
  {
    title: "CRITICAL DELAYS",
    value: "3",
    subtext: "Requires attention",
    isAlert: true,
    icon: AlertTriangle,
  },
]

// Live Operations Operations/Assignment List Data
const activeJobs = [
  {
    id: "#JOB-A8942",
    status: "IN TRANSIT",
    statusType: "transit",
    client: "Global Tech Industries",
    timestamp: "Oct 24, 14:30 EST",
    origin: "SEATTLE, WA",
    originSub: "PORT 4A",
    dest: "DENVER, CO",
    destSub: "HUB DIST.",
    progressLabel: "Est. Arrival: 18:45",
    progressPercent: 60,
    hasTruckIcon: true,
    lineStyle: "solid-active",
    crewCount: 2
  },
  {
    id: "#JOB-B3102",
    status: "LOADING",
    statusType: "loading",
    client: "Apex Manufacturing",
    timestamp: "Oct 24, 15:00 EST",
    origin: "CHICAGO, IL",
    originSub: "WAREHOUSE B",
    dest: "AUSTIN, TX",
    destSub: "TECH PARK",
    progressLabel: "Loading Progress",
    progressPercent: 25,
    hasTruckIcon: false,
    lineStyle: "dashed",
    crewCount: 1
  },
  {
    id: "#JOB-C9011",
    status: "ASSIGNED",
    statusType: "assigned",
    client: "Nexus Distribution",
    timestamp: "Oct 25, 08:00 EST",
    origin: "MIAMI, FL",
    originSub: "DOCK 7",
    dest: "ATLANTA, GA",
    destSub: "MAIN HUB",
    progressLabel: "Pending Dispatch",
    progressPercent: 0,
    hasTruckIcon: false,
    lineStyle: "dotted-dim",
    crewCount: 0
  }
]

function RouteComponent() {
  return (
    /* MAIN INTERFACE GRID FRAMEWORK */
    <div className="flex h-screen w-full bg-[#0d0f11] overflow-hidden font-sans antialiased text-slate-200 selection:bg-[#E2A54A]/30">
      
      {/* 1. LEFT SIDE PANEL */}
      <AdminDashboardSidebar />

      {/* RIGHT SIDE WORKSPACE */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* 2. TOP BANNER STRIP */}
        <AdminDashboardTopbar />

        {/* 3. SCROLLABLE CANVAS CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 select-none">
          
          {/* HEADER CONTEXT & ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Active Assignments</h1>
              <p className="text-sm text-slate-400 mt-1">Manage and monitor live logistics operations across all fleets.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#16191c] border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition duration-150">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Filters
              </button>
              
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#d4963b] transition duration-200">
                <span className="text-base font-normal leading-none">+</span> New Assignment
              </button>
            </div>
          </div>

          {/* TOP METRICS ROW GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {summaryMetrics.map((card, idx) => {
              const Icon = card.icon
              return (
                <div key={idx} className="bg-[#111315] border border-slate-800/60 rounded-xl p-5 flex flex-col justify-between h-36 relative">
                  <div className="flex items-start justify-between w-full">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{card.title}</span>
                    <div className={`p-1.5 bg-slate-900/40 rounded-lg border border-slate-800/40 ${card.isAlert ? 'text-rose-400' : 'text-[#E2A54A]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col">
                    <div className="flex items-baseline gap-2.5">
                      <h3 className={`text-3xl font-bold tracking-tight font-mono ${card.isAlert ? 'text-rose-400' : 'text-white'}`}>{card.value}</h3>
                      {card.change && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded">
                          ↗ {card.change}
                        </span>
                      )}
                      {card.subtext && !card.progress && (
                        <span className="text-xs font-medium text-slate-500 ml-0.5">{card.subtext}</span>
                      )}
                    </div>
                    
                    {card.progress ? (
                      <div className="w-full mt-3">
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#E2A54A] rounded-full" style={{ width: `${card.progress}%` }} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 mt-1.5">{card.subtext}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>

          {/* LIVE OPERATIONS WORKSPACE COMPONENT */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white tracking-tight">Live Operations</h2>
              
              {/* View Layout Toggle Pill controls */}
              <div className="flex items-center bg-[#111315] p-1 rounded-lg border border-slate-800/80 text-[11px] font-medium">
                <button className="flex items-center gap-1 px-3 py-1 bg-[#16191c] text-white rounded-md border border-slate-800 font-semibold shadow-sm">
                  <LayoutList className="w-3.5 h-3.5 text-[#E2A54A]" /> List
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-slate-500 hover:text-slate-300">
                  <KanbanSquare className="w-3.5 h-3.5" /> Board
                </button>
              </div>
            </div>

            {/* ASSIGNMENTS LIST LOOP STACK */}
            <div className="flex flex-col gap-3">
              {activeJobs.map((job, idx) => (
                <div key={idx} className="bg-[#111315] border border-slate-800/50 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-800 transition duration-150">
                  
                  {/* Left Block: Client metadata */}
                  <div className="flex flex-col min-w-52.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#E2A54A]">{job.id}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                        job.statusType === 'transit' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' :
                        job.statusType === 'loading' ? 'bg-amber-500/10 text-[#E2A54A] border border-[#E2A54A]/10' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {job.statusType === 'transit' && <span className="w-1 h-1 bg-blue-400 rounded-full mr-1 animate-pulse" />}
                        {job.statusType === 'loading' && <span className="w-1 h-1 bg-[#E2A54A] rounded-full mr-1" />}
                        {job.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2 tracking-tight">{job.client}</h4>
                    <span className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-600" /> {job.timestamp}
                    </span>
                  </div>

                  {/* Middle Block: Route Line Vector Design */}
                  <div className="flex-1 flex items-center justify-center min-w-65 px-2">
                    <div className="flex items-center justify-between w-full relative">
                      
                      {/* Origin Node */}
                      <div className="flex flex-col items-center text-center z-10">
                        <div className={`w-5 h-5 rounded-full bg-[#111315] border-2 flex items-center justify-center ${job.statusType !== 'assigned' ? 'border-[#E2A54A]' : 'border-slate-700'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${job.statusType !== 'assigned' ? 'bg-[#E2A54A]' : 'bg-slate-700'}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2 tracking-wide">{job.origin}</span>
                        <span className="text-[9px] font-mono font-medium text-slate-600 mt-0.5">{job.originSub}</span>
                      </div>

                      {/* Connection Route Line vector tracking node */}
                      <div className="absolute left-0 right-0 top-2.5 h-px z-0 px-6">
                        <div className={`w-full h-full relative flex items-center justify-center ${
                          job.lineStyle === 'solid-active' ? 'border-t border-[#E2A54A]/60' :
                          job.lineStyle === 'dashed' ? 'border-t border-dashed border-slate-800' :
                          'border-t border-dotted border-slate-800/60'
                        }`}>
                          {job.hasTruckIcon && (
                            <div className="absolute left-[55%] -top-2.5 bg-[#111315] px-1 text-[#E2A54A]">
                              <Truck className="w-4 h-4 transform flip-x" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Destination Node */}
                      <div className="flex flex-col items-center text-center z-10">
                        <div className="w-5 h-5 rounded-full bg-[#111315] border-2 border-slate-800 flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-slate-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-2 tracking-wide">{job.dest}</span>
                        <span className="text-[9px] font-mono font-medium text-slate-600 mt-0.5">{job.destSub}</span>
                      </div>

                    </div>
                  </div>

                  {/* Right Block: Progress Status Metric Gauge and Crew Profile Tokens */}
                  <div className="flex items-center gap-6 justify-between lg:justify-end min-w-60">
                    <div className="flex flex-col flex-1 max-w-35">
                      {job.progressPercent > 0 ? (
                        <>
                          <div className="flex justify-between text-[10px] font-bold tracking-wide mb-1.5">
                            <span className="text-slate-400 font-medium">{job.progressLabel}</span>
                            <span className="text-white font-mono">{job.progressPercent}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#E2A54A] rounded-full" style={{ width: `${job.progressPercent}%` }} />
                          </div>
                        </>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-600 tracking-wide">{job.progressLabel}</span>
                      )}
                    </div>

                    {/* Crew Avatars Stack Container */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-1.5">
                        {job.crewCount > 0 ? (
                          Array(job.crewCount).fill(0).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border border-[#111315] flex items-center justify-center text-[9px] font-bold text-slate-400">
                              {i === 0 ? 'JD' : 'MS'}
                            </div>
                          ))
                        ) : (
                          <button className="w-6 h-6 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-400 transition-colors">
                            <UserPlus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <button className="text-slate-600 hover:text-slate-400"><MoreVertical className="w-4 h-4" /></button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* MEANINGFUL BOTTOM DATA CARD DETAIL BLOCK (Requested extension to look simple like design layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
            <div className="bg-[#111315]/40 border border-slate-800/40 rounded-xl p-4 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>System Fleet Health Sync Status: <span className="text-emerald-400 font-semibold ml-1">100% Calibrated</span></span>
              <span className="text-[11px] font-mono text-slate-600">Last run: Just now</span>
            </div>
            <div className="bg-[#111315]/40 border border-slate-800/40 rounded-xl p-4 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Active Drivers Dispatched: <span className="text-white font-mono font-bold ml-1">18 / 24 Available</span></span>
              <span className="text-xs text-[#E2A54A] hover:underline cursor-pointer">View Schedule</span>
            </div>
          </div>

        </main>
      </div>

    </div>
  )
}