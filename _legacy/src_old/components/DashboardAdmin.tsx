import React, { useState } from 'react';
import { Booking, Category, ServiceProvider } from '../types';
import { ShieldCheck, Star, AlertTriangle } from 'lucide-react';

interface DashboardAdminProps {
  categoriesList: Category[];
  providersList: ServiceProvider[];
  bookingsList: Booking[];
  onAddNewCategory: (cat: Category) => void;
  onModerateFeatured: (providerId: string) => void;
  onApproveVerifyRequest: (providerId: string, itemType: string) => void;
  onResolveDisputeEscrow: (bookingId: string, action: 'refund' | 'release') => void;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({
  categoriesList,
  providersList,
  bookingsList,
  onAddNewCategory,
  onModerateFeatured,
  onApproveVerifyRequest,
  onResolveDisputeEscrow,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'cats' | 'disputes' | 'platform'>('users');
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    onAddNewCategory({
      id: `cat_${Date.now()}`,
      name: newCatName,
      iconName: newCatIcon,
      description: newCatDesc,
      isCustom: true,
    });

    setNewCatName('');
    setNewCatDesc('');
    alert(`Custom Category "${newCatName}" appended to core global categories schema successfully!`);
  };

  // Stats calculation
  const totalEscrowTransit = bookingsList.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalVerifiedProviders = providersList.filter(p => Object.values(p.verification).every(v => v === 'verified')).length;
  const activeDisputes = bookingsList.filter(b => b.status === 'disputed');

  return (
    <div className="space-y-6">
      
      {/* Sub tabs Menu */}
      <div className="flex border-b border-[#2a2a2a] gap-1.5 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'users'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          Verify Creators ({providersList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('cats')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'cats'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          Configure Categories ({categoriesList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('disputes')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'disputes'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          Disputes Board ({activeDisputes.length})
        </button>

        <button
          onClick={() => setActiveSubTab('platform')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'platform'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          System Health
        </button>
      </div>

      {/* Workspace Area */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#131313] rounded-lg border border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Active Platform Providers Moderator</h3>
              <p className="text-[11px] text-neutral-400">Toggle featured slots, audited verifications, or credential status manually.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 font-mono uppercase block">Fully Audited</span>
              <span className="text-xs font-bold text-primary font-mono">{totalVerifiedProviders} / {providersList.length} Accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {providersList.map((prov) => {
              const pendingVerificationType = Object.entries(prov.verification).find(([k, v]) => v === 'pending')?.[0];
              
              return (
                <div key={prov.id} className="p-4 bg-[#1c1b1b] border border-[#2a2a2a] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow hover:border-primary/15 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={prov.avatarUrl} alt={prov.name} className="w-10 h-10 rounded-full object-cover border border-[#2a2a2a]" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{prov.name}</span>
                        <span className="text-[9px] bg-[#131313] font-mono py-0.5 px-2 rounded font-semibold text-neutral-400 border border-[#2a2a2a]">
                          {prov.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#cdbdff] font-mono uppercase">{prov.title}</p>
                    </div>
                  </div>

                  {/* Verification stats blocks / Action */}
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    
                    {pendingVerificationType ? (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-xs font-semibold text-neutral-300">
                          Pending: <span className="text-primary font-mono font-bold uppercase">{pendingVerificationType}</span>
                        </span>
                        <button
                          onClick={() => {
                            onApproveVerifyRequest(prov.id, pendingVerificationType);
                          }}
                          className="px-2.5 py-1 bg-gradient-to-r from-primary to-emerald-400 text-[#003920] text-[11px] font-bold font-mono uppercase rounded shadow hover:from-emerald-300 transition-colors"
                        >
                          Approve Check
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-mono tracking-wide">
                        Fully verified ✓
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {/* Toggle Featured */}
                      <button
                        onClick={() => {
                          onModerateFeatured(prov.id);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all uppercase ${
                          prov.isFeatured 
                            ? 'bg-primary/10 border-primary/30 text-primary font-bold shadow-[0_0_8px_rgba(0,255,163,0.15)]' 
                            : 'border-[#2a2a2a] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {prov.isFeatured ? '★ Featured' : '☆ Feature'}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {activeSubTab === 'cats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Create category workspace */}
          <div className="p-6 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl relative shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase font-mono mb-4 tracking-wider">Deploy Custom Service Category</h3>
            <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">Category name</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="E.g., Language Assistants, Luxury Experiences"
                  className="w-full bg-[#131313] border border-[#2a2a2a] text-xs px-3 py-2.5 rounded-lg text-white outline-none focus:border-primary placeholder-neutral-600 font-sans"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">Vector icon placeholder name</label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2a2a2a] text-xs px-3 py-2.5 rounded-lg text-neutral-300 outline-none focus:border-primary font-mono"
                >
                  <option value="Sparkles">Sparkles Icon</option>
                  <option value="Compass">Compass Icon</option>
                  <option value="Award">Award Icon</option>
                  <option value="TrendingUp">TrendingUp Icon</option>
                  <option value="Briefcase">Business Briefcase Icon</option>
                  <option value="Activity">Wellness Activity Icon</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">Description pitch</label>
                <textarea 
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Elite presentation, styling, language translation, or companion guides..."
                  className="w-full h-20 bg-[#131313] border border-[#2a2a2a] text-xs p-3 text-white outline-none focus:border-primary placeholder-neutral-600 leading-relaxed font-sans"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-primary to-emerald-400 text-neutral-950 font-bold font-mono text-xs rounded-lg shadow uppercase tracking-wider glow-primary-sm"
              >
                Add Category Schema
              </button>
            </form>
          </div>

          {/* List of currently installed categories */}
          <div className="p-6 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4">Core Installed Categories</h3>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {categoriesList.map((cat) => (
                  <div key={cat.id} className="p-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] flex items-center justify-between text-xs gap-3">
                    <div>
                      <span className="font-bold text-neutral-200">{cat.name}</span>
                      {cat.isCustom && (
                        <span className="ml-1.5 text-[9px] bg-[#7c4dff]/15 border border-[#7c4dff]/25 text-[#cdbdff] font-mono py-px px-1.5 rounded uppercase font-bold">
                          Custom
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono select-none">ID: {cat.id}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[10px] text-neutral-500 font-medium italic mt-2">
              ✨ Config database operates as client-authoritative JSON schema definitions.
            </p>
          </div>

        </div>
      )}

      {activeSubTab === 'disputes' && (
        <div className="space-y-4">
          
          {activeDisputes.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-6 space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#849588] mx-auto" />
              <p className="text-xs font-bold text-neutral-300">Perfect Record: Zero disputes active</p>
              <p className="text-[11px] text-[#849588] max-w-sm mx-auto leading-relaxed uppercase font-mono">
                Platform transaction safety operates cleanly. Mutual escrow protect prevents fraudulent payment disputes automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDisputes.map((dis) => (
                <div key={dis.id} className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Escrow Dispute Ref: {dis.id}
                      </span>
                      <span className="text-xs text-primary font-mono">Secured: ${dis.totalAmount}</span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-sans">
                      Client <span className="text-[#cdbdff] font-bold font-mono">{dis.customerName}</span> raised structural dispute regarding scheduled service with provider <span className="text-[#cdbdff] font-bold font-mono">{dis.providerName}</span>.
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-[#2a2a2a]">
                    <button
                      onClick={() => {
                        onResolveDisputeEscrow(dis.id, 'refund');
                      }}
                      className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-500/20 text-xs font-bold rounded-lg transition-colors font-mono uppercase tracking-wider"
                    >
                      Client Refund (100%)
                    </button>
                    
                    <button
                      onClick={() => {
                        onResolveDisputeEscrow(dis.id, 'release');
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-primary to-emerald-400 text-neutral-950 font-bold font-mono text-xs rounded-lg transition-colors shadow active:scale-95 uppercase tracking-wider glow-primary-sm"
                    >
                      Release to Provider
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {activeSubTab === 'platform' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono block">Secured Escrow Volume</span>
            <p className="text-2xl font-bold font-mono text-primary">${totalEscrowTransit}</p>
            <p className="text-[11px] text-neutral-450 leading-relaxed mt-1">Total values currently deposited on behalf of marketplace client-creators.</p>
          </div>

          <div className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono block">Integrative Fraud Score</span>
            <p className="text-2xl font-extrabold text-[#cdbdff] font-mono tracking-tight">0.05% <span className="text-xs font-medium text-neutral-500 font-sans">Risk Index</span></p>
            <p className="text-[11px] text-neutral-450 leading-relaxed mt-1">Excellent trust safety score monitored by automated profile matching.</p>
          </div>

          <div className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-bold text-[#849588] font-mono block">Core Microservices</span>
            <p className="text-xs font-mono text-primary uppercase flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
              <span>ACTIVE & SECURED</span>
            </p>
            <p className="text-[11px] text-neutral-450 leading-relaxed mt-1">Escrow vaults, messaging buffers, Verification check APIs running optimally.</p>
          </div>

        </div>
      )}

    </div>
  );
};
export default DashboardAdmin;
