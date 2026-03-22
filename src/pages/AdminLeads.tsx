import { useState, useEffect } from 'react';
import { useLeads, type Lead } from '../hooks/useLeads';
import Layout from '../components/Layout';
import { Trash2, Clock, ExternalLink, Download, Lock, LogOut } from 'lucide-react';
import { siteConfig } from '../config/site';
import { cn } from '@/lib/utils';

const AdminLeads = () => {
  const { leads, deleteLead, updateLeadStatus, loading } = useLeads();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if already authenticated in this session
  useEffect(() => {
    const authStatus = sessionStorage.getItem('forty_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === siteConfig.admin.accessPassword) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('forty_admin_auth', 'true');
    } else {
      setError('كلمة المرور غير صحيحة!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('forty_admin_auth');
  };

  if (!isAuthenticated) {
    return (
      <Layout variant="landing">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-md">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-center text-blue-900 mb-2">منطقة المدير</h1>
            <p className="text-gray-500 text-center mb-8">يرجى إدخال كلمة المرور للوصول للطلبات</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-center text-lg font-bold"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-center text-sm font-bold">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200 active:scale-[0.98]"
              >
                دخول النظام
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Name', 'Phone', 'Service', 'Price', 'Source', 'Status', 'Date'];
    const rows = leads.map(l => [
      l.name,
      l.phone,
      l.service,
      l.price || '',
      l.source,
      l.status,
      new Date(l.timestamp).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `forty_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Layout variant="landing">
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Admin Header */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-blue-900">إدارة الطلبات</h1>
                <p className="text-gray-500 font-bold">إجمالي الطلبات: {leads.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Download className="w-5 h-5" />
                تصدير Excel
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all"
              >
                <LogOut className="w-5 h-5" />
                خروج
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold">جاري تحميل الطلبات...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-20 text-center text-gray-400">
                <ExternalLink className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-bold">لا يوجد طلبات حالياً</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-blue-900 font-black">العميل</th>
                      <th className="px-8 py-6 text-blue-900 font-black">الخدمة والسعر</th>
                      <th className="px-8 py-6 text-blue-900 font-black">التفاصيل</th>
                      <th className="px-8 py-6 text-blue-900 font-black">الحالة</th>
                      <th className="px-8 py-6 text-blue-900 font-black">التاريخ</th>
                      <th className="px-8 py-6 text-blue-900 font-black">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-black text-blue-900">{lead.name}</div>
                          <a 
                            href={`tel:${lead.phone}`}
                            className="text-blue-600 font-bold hover:underline flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {lead.phone}
                          </a>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-bold text-gray-700">{lead.service === 'cleaning' ? 'نظافة' : 'مكافحة'}</span>
                          {lead.price && (
                            <div className="text-emerald-600 font-black">{lead.price} د.ك</div>
                          )}
                        </td>
                        <td className="px-8 py-6 max-w-xs">
                          <p className="text-gray-500 text-sm font-bold line-clamp-2" title={lead.details}>
                            {lead.details || '-'}
                          </p>
                          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-400 uppercase font-black mt-2 inline-block">
                            {lead.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                            className={cn(
                              "px-4 py-2 rounded-xl font-black text-xs border outline-none transition-all cursor-pointer",
                              getStatusColor(lead.status)
                            )}
                          >
                            <option value="new">طلب جديد</option>
                            <option value="contacted">تم التواصل</option>
                            <option value="completed">تم التنفيذ</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-gray-400 text-sm font-bold">
                          {new Date(lead.timestamp).toLocaleDateString('ar-KW')}
                          <div className="text-[10px]">
                            {new Date(lead.timestamp).toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <button
                            onClick={() => {
                              if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                                deleteLead(lead.id);
                              }
                            }}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLeads;
