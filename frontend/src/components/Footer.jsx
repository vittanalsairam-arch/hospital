import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Github, ExternalLink, ShieldCheck, Heart, PhoneCall, Smartphone, MapPin } from 'lucide-react';
import { usePWA } from '../context/PWAContext';

export default function Footer() {
  const { openModal } = usePWA();
  const githubRepoUrl = "https://github.com/vittanalsairam-arch/op-tickets";

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 backdrop-blur-md text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/20">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Medi<span className="text-cyan-400">OP</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                All 29 States of India
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              National Outpatient (OP) Booking and Healthcare Directory Portal connecting patients with 1,170+ hospitals and 4,680+ specialist doctors across India.
            </p>

            {/* GitHub Repo Showcase Badge */}
            <div className="pt-2">
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white transition-all shadow-md group"
              >
                <Github className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[11px] text-slate-400 font-medium">Open Source on GitHub</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    vittanalsairam-arch/op-tickets
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">Home Portal</Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-cyan-400 transition-colors">Hospital Directory (29 States)</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-cyan-400 transition-colors">Specialist Doctors</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">My OP Tickets & ABHA Card</Link>
              </li>
              <li>
                <button onClick={openModal} className="hover:text-cyan-400 transition-colors text-left flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-cyan-400" /> Download App / Install PWA
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Repository */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Repository & Help</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" /> 24/7 National Emergency
                </div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">Dial 108 / 102</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MediOP National Healthcare Network. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a 
              href={githubRepoUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub: vittanalsairam-arch/op-tickets</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
