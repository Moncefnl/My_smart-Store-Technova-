import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Shield,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Smartphone,
  ChevronRight,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WILAYAS_LIST } from '../../data/mockData';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSessionManager?: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenSessionManager,
}) => {
  const {
    currentUser,
    setCurrentUser,
    orders,
    logoutUser,
    activeSessions,
    showNotification,
    setViewMode,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editWilaya, setEditWilaya] = useState(currentUser.wilaya || '16 - الجزائر');
  const [editCommune, setEditCommune] = useState(currentUser.commune || 'سيدي امحمد');
  const [editAddress, setEditAddress] = useState(currentUser.address || 'شارع ديدوش مراد');

  if (!isOpen) return null;

  // Find customer's orders
  const customerOrders = orders.filter((o) => {
    const curPhone = currentUser.phone?.replace(/\s+/g, '');
    const ordPhone = o.phone?.replace(/\s+/g, '');
    return (
      (curPhone && ordPhone && curPhone === ordPhone) ||
      o.customerName.includes(currentUser.name) ||
      currentUser.name.includes(o.customerName)
    );
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: editName,
      phone: editPhone,
      wilaya: editWilaya,
      commune: editCommune,
      address: editAddress,
    });
    setIsEditingProfile(false);
    showNotification('تم تحديث بيانات الحساب والعنوان بنجاح ✨', 'success');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">تم التوصيل بنجاح</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">قيد الشحن والتوزيع</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">مؤكد وجاهز للتجهيز</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">ملغي</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">قيد المعالجة</span>;
    }
  };

  return (
    <div
      id="customer-account-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        id="customer-account-modal-content"
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            id="close-customer-account-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/30 border border-indigo-400/30 overflow-hidden flex items-center justify-center text-white text-lg font-black shadow-inner">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">{currentUser.name}</h2>
                {currentUser.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    حساب موثق
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {currentUser.phone ? `📱 ${currentUser.phone}` : `✉️ ${currentUser.email}`} •{' '}
                {currentUser.accountType === 'merchant' ? 'تاجر / متجر' : 'زبون متجر'}
              </p>
            </div>

            <button
              onClick={() => {
                logoutUser();
                onClose();
              }}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-400/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="تسجيل الخروج"
              id="customer-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>

          {/* Navigation tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-2xl mt-5 border border-slate-700">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="tab-customer-orders-btn"
            >
              <Package className="w-3.5 h-3.5" />
              <span>طلباتي ({customerOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="tab-customer-profile-btn"
            >
              <User className="w-3.5 h-3.5" />
              <span>بياناتي والعنوان</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="tab-customer-security-btn"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>الجلسات والأمان</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800">سجل مشترياتي وطلباتي</h3>
                <span className="text-xs text-slate-500">إجمالي الطلبات: {customerOrders.length}</span>
              </div>

              {customerOrders.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">لم تقم بإجراء أي طلبات حتى الآن</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    يمكنك تصفح المنتجات في المتجر وإضافة مشترياتك إلى السلة وتأكيد الطلب فوراً وبكل سهولة.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
                  >
                    تصفح منتجات المتجر الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-indigo-700">#{order.id}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{order.createdAt}</span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                            <span>
                              {item.productName} <span className="text-slate-400">× {item.quantity}</span>
                            </span>
                            <span className="font-bold">{item.unitPrice * item.quantity} دج</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold">
                        <div className="text-slate-500">
                          التوصيل إلى: <span className="text-slate-800">{order.wilaya}</span>
                        </div>
                        <div className="text-emerald-700 text-sm">
                          المجموع: {order.totalAmount} دج
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile & Address Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800">بيانات الحساب وعناوين التوصيل</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {isEditingProfile ? 'إلغاء التعديل' : 'تعديل البيانات'}
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف:</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الولاية:</label>
                    <select
                      value={editWilaya}
                      onChange={(e) => setEditWilaya(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {WILAYAS_LIST.map((w) => (
                        <option key={w.code} value={w.nameAr}>
                          {w.nameAr} ({w.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">البلدية:</label>
                      <input
                        type="text"
                        value={editCommune}
                        onChange={(e) => setEditCommune(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">العنوان التفصيلي:</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    حفظ التغييرات
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">الاسم</span>
                    <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">رقم الهاتف</span>
                    <p className="text-xs font-bold text-slate-800" dir="ltr">
                      {currentUser.phone || 'غير مسجل'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">البريد الإلكتروني</span>
                    <p className="text-xs font-bold text-slate-800" dir="ltr">
                      {currentUser.email || 'غير مسجل'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">عنوان التوصيل المعتمد</span>
                    <p className="text-xs font-bold text-slate-800">
                      {currentUser.address ? `${currentUser.address}، ${currentUser.commune || ''} (${currentUser.wilaya || ''})` : 'الجزائر العاصمة'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800">أمان الحساب والجلسات النشطة</h3>
                {onOpenSessionManager && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSessionManager();
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>إدارة الجلسات الكاملة</span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                )}
              </div>

              {/* Status card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم تفعيل الحساب وتأكيده بنجاح عبر رمز التحقق (OTP)</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  حسابك مؤمن ولا يمكن الولوج إليه إلا عبر إدخال رمز التحقق السري المؤقت المرسل إلى هاتفك أو بريدك.
                </p>
              </div>

              {/* Active session mini list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600">الجلسات المفتوحة حالياً:</span>
                {activeSessions.slice(0, 2).map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        {s.device.includes('Mobile') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{s.device}</div>
                        <div className="text-[10px] text-slate-400">{s.browser} • {s.location}</div>
                      </div>
                    </div>
                    {s.isCurrent ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        الجلسة الحالية
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">{s.lastActiveAt}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
