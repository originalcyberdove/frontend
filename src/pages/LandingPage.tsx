import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const gridPattern = {
  backgroundImage: `
    linear-gradient(to right, #162018 1px, transparent 1px),
    linear-gradient(to bottom, #162018 1px, transparent 1px)
  `,
  backgroundSize: "40px 40px",
  backgroundPosition: "center center",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none"
        style={gridPattern}
      />

      {/* Radial fade for the grid */}
      <div className="absolute inset-0 z-0 bg-radial-vignette pointer-events-none" />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-24 pt-12">
        
        {/* Left Column (Hero Text) */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-1 lg:col-span-7 flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 self-start border border-green/30 bg-green/5 text-green text-xs font-mono px-3 py-1.5 rounded-full uppercase tracking-widest leading-none">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            System Online • v2.0.4
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05] drop-shadow-lg">
            Neutralize <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green to-dim">
              The Threat
            </span>
            <br /> Before It Lands
          </h1>
          
          <p className="text-lg md:text-xl text-dim font-mono max-w-xl leading-relaxed mt-2 border-l-2 border-green/50 pl-4 py-1">
            Advanced message sandboxing, deep-link scanning, and real-time behavioral analysis. 
            Protect your communications via zero-trust execution.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Link
              to="/detect"
              className="relative overflow-hidden group inline-flex items-center justify-center gap-3 px-8 py-4 bg-green text-bg font-bold uppercase tracking-wider hover:bg-[#00e65f] transition-all rounded-none border border-green hover:shadow-[0_0_24px_rgba(0,200,83,0.4)]"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPgo8cmVjdCB3aWR0aD0nNCcgaGVpZ2h0PSc0JyBmaWxsPSd0cmFuc3BhcmVudCcvPgo8cmVjdCB3aWR0aD0nMScgaGVpZ2h0PScxJyBmaWxsPSdyZ2JhKDAsMCwwLDAuMSknLz4KPC9zdmc+')] opacity-50 mix-blend-overlay group-hover:opacity-100 transition-opacity" />
              <span>Analyze a Message</span>
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              to="/report"
              className="px-8 py-4 bg-transparent border border-border text-white hover:border-dim hover:bg-surface2 transition-all font-mono uppercase text-sm tracking-wider"
            >
              View Reports
            </Link>
          </div>
        </motion.div>

        {/* Right Column (Visual / Bento) */}
        <div className="col-span-1 lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, rotateY: 15, z: -100 }}
            animate={{ opacity: 1, rotateY: 0, z: 0 }}
            transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
            className="grid grid-cols-2 gap-4 relative perspective-[1000px]"
          >
            {/* Top Right Decorative Element */}
            <div className="absolute -top-12 -right-12 text-border font-mono text-[10rem] font-bold leading-none opacity-20 pointer-events-none select-none z-0">
              01
            </div>

            {/* Bento Box 1 */}
            <div className="col-span-2 p-6 border border-border bg-surface/80 backdrop-blur-sm relative overflow-hidden group hover:border-green/50 transition-colors z-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 border border-border bg-bg flex items-center justify-center text-green">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-mono text-dim tracking-widest uppercase">Sys.Secure</span>
              </div>
              <h3 className="font-bold text-lg mb-1 uppercase tracking-wide">Threat Sandboxing</h3>
              <p className="text-sm font-mono text-dim">Isolate suspicious links and attachments in a headless environment.</p>
            </div>

            {/* Bento Box 2 */}
            <div className="col-span-1 p-6 border border-border bg-surface/80 backdrop-blur-sm relative overflow-hidden group hover:border-gold/50 transition-colors z-10">
              <div className="mb-6 w-8 h-8 flex items-center justify-center text-gold border border-gold/20 bg-gold/5 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-base uppercase">Real-Time</h3>
              <p className="text-xs font-mono text-dim mt-2">Millisecond API response.</p>
            </div>

            {/* Bento Box 3 */}
            <div className="col-span-1 p-6 border border-border bg-surface/80 backdrop-blur-sm relative overflow-hidden group hover:border-danger/50 transition-colors z-10">
              <div className="mb-6 w-8 h-8 flex items-center justify-center text-danger border border-danger/20 bg-danger/5 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-base uppercase">Heuristics</h3>
              <p className="text-xs font-mono text-dim mt-2">Zero-day pattern matching.</p>
            </div>
            
          </motion.div>
        </div>
      </div>
      
      {/* Decorative footer line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green/20 to-transparent" />
    </div>
  );
}
