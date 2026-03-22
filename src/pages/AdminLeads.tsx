import { useState, useEffect } from 'react';
import { useLeads, type Lead } from '../hooks/useLeads';
import Layout from '../components/Layout';
import { Trash2, Clock, ExternalLink, Download, Lock, LogOut } from 'lucide-react';
import { siteConfig } from '../config/site';

const AdminLeads = () => {
  const { leads, deleteLead, updateLeadStatus, clearAllLeads } = useLeads();
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
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout variant="landing">
      <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-blue-900">لوحة تحكم الطلبات (Leads)</h1>
              <p className="text-gray-500">إدارة طلبات العملاء المحفوظة محلياً</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all"
              >
                <Download className="w-4 h-4" />
                تصدير Excel
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من حذف جميع الطلبات؟')) clearAllLeads();
                }}
                className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                حذف الكل
              </button>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-400">لا توجد طلبات حالياً</h2>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 font-bold text-gray-600">التاريخ</th>
                        <th className="px-6 py-4 font-bold text-gray-600">الاسم</th>
                        <th className="px-6 py-4 font-bold text-gray-600">الهاتف</th>
                        <th className="px-6 py-4 font-bold text-gray-600">الخدمة</th>
                        <th className="px-6 py-4 font-bold text-gray-600">السعر</th>
                        <th className="px-6 py-4 font-bold text-gray-600">الحالة</th>
                        <th className="px-6 py-4 font-bold text-gray-600">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(lead.timestamp).toLocaleString('ar-KW')}
                          </td>
                          <td className="px-6 py-4 font-bold text-blue-900">{lead.name}</td>
                          <td className="px-6 py-4">
                            <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                              {lead.phone}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded-lg">{lead.service}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-600">
                            {lead.price ? `${lead.price} د.ك` : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                              className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none ${getStatusColor(lead.status)}`}
                            >
                              <option value="new">جديد</option>
                              <option value="contacted">تم الاتصال</option>
                              <option value="completed">مكتمل</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => deleteLead(lead.id)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black text-blue-900">{lead.name}</h3>
                        <p className="text-xs text-gray-400">{new Date(lead.timestamp).toLocaleString('ar-KW')}</p>
                      </div>
                      <button 
                        onClick={() => deleteLead(lead.id)}
                        className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] text-gray-400 mb-1">الهاتف</p>
                        <a href={`tel:${lead.phone}`} className="text-blue-600 font-bold flex items-center gap-1 text-sm">
                          {lead.phone}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] text-gray-400 mb-1">الخدمة</p>
                        <span className="font-bold text-gray-700 text-sm">{lead.service}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] text-gray-400 mb-1">السعر</p>
                        <span className="font-bold text-emerald-600 text-sm">{lead.price ? `${lead.price} د.ك` : '-'}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] text-gray-400 mb-1">المصدر</p>
                        <span className="font-bold text-gray-500 text-sm">{lead.source}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                        className={`w-full text-center font-bold px-4 py-3 rounded-2xl border-none outline-none ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">جديد</option>
                        <option value="contacted">تم الاتصال</option>
                        <option value="completed">مكتمل</option>
                      </select>
                    </div>
                    
                    {lead.details && (
                      <div className="bg-blue-50/50 p-4 rounded-2xl text-xs text-blue-800 leading-relaxed">
                        <p className="font-bold mb-1">التفاصيل:</p>
                        {lead.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminLeads;
