
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ThreatAnalyzer from './components/ThreatAnalyzer';
import SecurityChat from './components/SecurityChat';
import AdminDashboard from './components/AdminDashboard';
import { db } from './services/dbService';
import { 
  Shield, 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  Activity,
  UserCircle,
  ShieldCheck,
  LogOut,
  Users,
  Lock,
  Key,
  ChevronRight,
  AlertCircle,
  Fingerprint,
  Info,
  Filter,
  Download,
  Clock,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  UserPlus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Radio
} from 'lucide-react';
import { Role, AnalysisResult, SOSAlert, UserProfile } from './types';

// --- CONSOLIDATED COMPONENTS FOR PORTABILITY ---

const ActivityAudits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  useEffect(() => {
    setAnalyses(db.getAnalyses());
    setSosAlerts(db.getSOSAlerts());
  }, []);

  const filteredAnalyses = analyses.filter(a => 
    a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSeverityStyle = (score: number) => {
    if (score > 75) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    if (score > 40) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">System Activity Audits</h1>
          <p className="text-slate-400 mt-1">Full immutable ledger of all security investigations and alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl md:col-span-3">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by analyst, tag, or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-sm font-medium hover:text-white hover:border-slate-700 transition-all">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="pb-4 px-4">Timestamp</th>
                  <th className="pb-4 px-4">Analyst</th>
                  <th className="pb-4 px-4">Investigation Summary</th>
                  <th className="pb-4 px-4 text-center">Risk</th>
                  <th className="pb-4 px-4 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredAnalyses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-500 italic">No audit records found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredAnalyses.map((audit) => (
                    <tr key={audit.id} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{new Date(audit.timestamp).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{new Date(audit.timestamp).toLocaleTimeString()}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-emerald-400 border border-slate-700">
                            {audit.userName.charAt(0)}
                          </div>
                          {audit.userName}
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-sm text-slate-300 truncate font-medium">{audit.summary}</p>
                        <div className="flex gap-1 mt-1">
                          {audit.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] text-slate-500">#{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded border ${getSeverityStyle(audit.riskScore)}`}>
                          {audit.riskScore}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="p-2 text-slate-600 hover:text-emerald-400 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border-rose-500/20">
            <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4" /> SOS Alert History
            </h3>
            <div className="space-y-4">
              {sosAlerts.length === 0 ? (
                <p className="text-xs text-slate-600 italic text-center py-4">No emergency signals logged.</p>
              ) : (
                sosAlerts.slice(0, 5).map(sos => (
                  <div key={sos.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 group hover:border-rose-500/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-slate-500">{sos.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${sos.status === 'ACTIVE' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {sos.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">{sos.userName}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(sos.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl border-emerald-500/20">
            <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4" /> Audit Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Ledger Integrity</span>
                <span className="text-xs font-bold text-emerald-400">VERIFIED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Entries Sync</span>
                <span className="text-xs font-bold text-white">100%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[100%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Personnel Management</h1>
          <p className="text-slate-400 mt-1">Directory of all authorized SOC analysts and administrators.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all">
          <UserPlus className="w-4 h-4" /> Onboard New Analyst
        </button>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name or access level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <div key={u.id} className="p-6 bg-slate-900/50 border border-slate-800 rounded-[2rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${u.role === 'ADMIN' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                  {u.role === 'ADMIN' ? <ShieldCheck className="w-8 h-8" /> : <UserCircle className="w-8 h-8" />}
                </div>
                <button className="p-2 text-slate-600 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 relative z-10">
                <h3 className="text-xl font-bold text-white">{u.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  ID: {u.id} <span className="w-1 h-1 bg-slate-700 rounded-full"></span> {u.role === 'ADMIN' ? 'L5 CLEARANCE' : 'L3 ACCESS'}
                </p>
              </div>

              <div className="mt-8 space-y-3 relative z-10">
                <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-slate-400 font-medium">Status</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-indigo-400" />
                    <span className="text-xs text-slate-400 font-medium">MFA</span>
                  </div>
                  <span className="text-xs font-bold text-white">ENABLED</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[10px] relative z-10">
                <div className="text-slate-500 font-bold uppercase tracking-wider">Last Sync: {new Date(u.lastLogin).toLocaleDateString()}</div>
                <button className="flex items-center gap-1 text-emerald-400 font-black uppercase hover:text-emerald-300 transition-colors">
                  <Key className="w-3 h-3" /> Reset Access
                </button>
              </div>
            </div>
          ))}

          <div className="p-6 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <UserPlus className="w-6 h-6 text-slate-500 group-hover:text-white" />
            </div>
            <p className="text-sm font-bold text-slate-400 group-hover:text-emerald-400 transition-all">Invite Analyst</p>
            <p className="text-[10px] text-slate-600 mt-1 uppercase font-black tracking-widest">Global Ops Dir</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AUTHENTICATION & CORE APP LOGIC ---

interface RoleContextType {
  role: Role | null;
  isAuthenticated: boolean;
  login: (role: Role, identifier: string, password: string) => boolean;
  logout: () => void;
  user: { id: string, name: string };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useAuth must be used within a RoleProvider");
  return context;
};

const Sidebar = () => {
  const location = useLocation();
  const { role, user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`w-64 h-screen glass-card sticky top-0 flex flex-col p-4 z-20 border-r ${role === 'ADMIN' ? 'border-emerald-500/20' : 'border-indigo-500/20'}`}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className={`p-2 rounded-lg shadow-lg ${role === 'ADMIN' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Sentinel<span className={role === 'ADMIN' ? 'text-emerald-400' : 'text-indigo-400'}>Safe</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {role === 'USER' ? (
          <>
            <NavItem to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="User Dashboard" active={isActive('/dashboard')} />
            <NavItem to="/analyzer" icon={<Search className="w-5 h-5" />} label="Threat Analyzer" active={isActive('/analyzer')} />
            <NavItem to="/chat" icon={<MessageSquare className="w-5 h-5" />} label="Security AI" active={isActive('/chat')} />
          </>
        ) : (
          <>
            <NavItem to="/admin" icon={<ShieldCheck className="w-5 h-5" />} label="System Overview" active={isActive('/admin')} />
            <NavItem to="/admin/audits" icon={<Activity className="w-5 h-5" />} label="Activity Audits" active={isActive('/admin/audits')} />
            <NavItem to="/admin/users" icon={<Users className="w-5 h-5" />} label="User Management" active={isActive('/admin/users')} />
          </>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
        <div className="px-4 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <UserCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Terminated Session</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => {
  const { role } = useAuth();
  const activeClass = role === 'ADMIN' 
    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' 
    : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20';

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? `${activeClass} shadow-lg` 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const AuthPortal = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    const success = login(selectedRole, formData.identifier, formData.password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className={`p-4 rounded-3xl shadow-2xl transition-all duration-500 ${
            selectedRole === 'ADMIN' ? 'bg-emerald-600 shadow-emerald-500/20 scale-110' : 'bg-indigo-600 shadow-indigo-500/20'
          }`}>
            <Fingerprint className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mt-6">Sentinel<span className={selectedRole === 'ADMIN' ? 'text-emerald-400' : 'text-indigo-400'}>Safe</span></h1>
          <p className="text-slate-500 mt-2 font-medium tracking-widest uppercase text-[10px]">Security Clearance Portal</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden border-slate-800 shadow-2xl">
          {error && (
            <div className="absolute top-0 left-0 right-0 py-2 bg-rose-600 text-white text-[10px] font-bold text-center uppercase tracking-widest animate-in slide-in-from-top duration-300 z-50">
              Access Refused: Identification Failure
            </div>
          )}

          {!selectedRole ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedRole('USER')}
                className="w-full group flex items-center justify-between p-6 bg-slate-900/50 hover:bg-indigo-600/5 border border-slate-800 hover:border-indigo-500/40 rounded-3xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                    <UserCircle className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">Personnel</p>
                    <p className="text-xs text-slate-500 font-medium">Standard Ops Terminal</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => setSelectedRole('ADMIN')}
                className="w-full group flex items-center justify-between p-6 bg-slate-900/50 hover:bg-emerald-600/5 border border-slate-800 hover:border-emerald-500/40 rounded-3xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-white">Administrator</p>
                    <p className="text-xs text-slate-500 font-medium">L5 Global Command</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="animate-in slide-in-from-right duration-500 space-y-5">
              <button 
                type="button"
                onClick={() => { setSelectedRole(null); setFormData({ identifier: '', password: '' }); }}
                className="text-[10px] text-slate-500 hover:text-white mb-2 flex items-center gap-2 font-black tracking-widest uppercase transition-colors"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> Change Access Level
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${selectedRole === 'ADMIN' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}>
                  {selectedRole === 'ADMIN' ? <ShieldCheck className="w-6 h-6" /> : <UserCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white leading-none uppercase">{selectedRole} HUB</h2>
                  <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">Biometric Verification Required</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative group">
                  <UserCircle className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${formData.identifier ? (selectedRole === 'ADMIN' ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-600'}`} />
                  <input 
                    name="identifier"
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={handleInputChange}
                    placeholder="Email or Security Number"
                    className={`w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 ${selectedRole === 'ADMIN' ? 'focus:ring-emerald-500/50' : 'focus:ring-indigo-500/50'} transition-all placeholder:text-slate-600`}
                  />
                </div>

                <div className="relative group">
                  <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${formData.password ? (selectedRole === 'ADMIN' ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-600'}`} />
                  <input 
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Access Token (Password)"
                    className={`w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 ${selectedRole === 'ADMIN' ? 'focus:ring-emerald-500/50' : 'focus:ring-indigo-500/50'} transition-all placeholder:text-slate-600`}
                  />
                </div>

                <div className="mt-6 p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    <Info className="w-3 h-3" /> Entry Credentials
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-[10px] text-slate-400">
                      <span className="text-slate-600 block mb-1">Identifier:</span>
                      <code className="text-indigo-400/80 font-mono">{selectedRole === 'ADMIN' ? 'admin@sentinel.ai' : 'user@sentinel.ai'}</code>
                      <span className="block text-slate-600 text-[8px] mt-1">OR: {selectedRole === 'ADMIN' ? '0987654321' : '1234567890'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span className="text-slate-600 block mb-1">Password:</span>
                      <code className="text-indigo-400/80 font-mono">{selectedRole === 'ADMIN' ? 'admin123' : 'user123'}</code>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className={`w-full py-5 mt-4 ${selectedRole === 'ADMIN' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'} text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl transition-all active:scale-[0.97]`}
                >
                  Verify Access
                </button>
              </div>

              <div className="mt-8 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex gap-3 items-start">
                <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider">
                  Warning: Unauthorized access attempts are monitored and logged to the neural defense link.
                </p>
              </div>
            </form>
          )}
        </div>
        
        <p className="text-center mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
          &copy; 2024 SentinelSafe Global Defense
        </p>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AuthPortal />;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/dashboard" element={role === 'USER' ? <Dashboard /> : <Navigate to="/admin" />} />
            <Route path="/analyzer" element={role === 'USER' ? <ThreatAnalyzer /> : <Navigate to="/admin" />} />
            <Route path="/chat" element={role === 'USER' ? <SecurityChat /> : <Navigate to="/admin" />} />
            
            <Route path="/admin" element={role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
            <Route path="/admin/audits" element={role === 'ADMIN' ? <ActivityAudits /> : <Navigate to="/dashboard" />} />
            <Route path="/admin/users" element={role === 'ADMIN' ? <UserManagement /> : <Navigate to="/dashboard" />} />
            
            <Route path="/" element={<Navigate to={role === 'USER' ? "/dashboard" : "/admin"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (r: Role, identifier: string, password: string) => {
    const valid = db.verifyCredentials(r, identifier, password);
    if (valid) {
      setRole(r);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
  };

  const user = role === 'ADMIN' ? { id: 'u2', name: 'Bob SOC-Lead' } : { id: 'u1', name: 'Alice Analyst' };

  return (
    <RoleContext.Provider value={{ role, isAuthenticated, login, logout, user }}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </RoleContext.Provider>
  );
};

export default App;
