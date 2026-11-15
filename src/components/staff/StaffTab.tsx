import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StaffMember, StaffRole, StaffSection } from '../../types';
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  Shield,
  Mail,
  Phone,
  Check,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Key,
  ShoppingBag,
  Package,
  Layers,
  Star,
  Globe,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  CheckSquare,
  Square,
  Sparkles,
  Settings
} from 'lucide-react';

interface RoleDefinition {
  id: StaffRole | 'custom';
  title: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
  desc: string;
  defaultPermissions: string[];
}

const AVAILABLE_ROLES: RoleDefinition[] = [
  {
    id: 'orders_manager',
    title: 'مسؤول تأكيد الطلبات',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgColor: 'hover:border-emerald-500 bg-emerald-50/40',
    borderColor: 'border-emerald-500',
    desc: 'الاتصال بالزبائن، تغيير حالات الطلبات، تسجيل محاولات الاتصال، وطباعة بوليصات الشحن',
    defaultPermissions: ['orders.view', 'orders.edit', 'orders.call_attempt', 'orders.export'],
  },
  {
    id: 'inventory_manager',
    title: 'مسؤول المخزون والمنتجات',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    bgColor: 'hover:border-blue-500 bg-blue-50/40',
    borderColor: 'border-blue-500',
    desc: 'إضافة وتعديل المنتجات، ضبط أسعار الشراء والبيع، إدارة كميات المخزن والتصنيفات',
    defaultPermissions: ['products.view', 'products.create', 'products.edit', 'categories.manage'],
  },
  {
    id: 'marketer',
    title: 'مسؤول التسويق والإعلانات',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    bgColor: 'hover:border-amber-500 bg-amber-50/40',
    borderColor: 'border-amber-500',
    desc: 'إنشاء وإدارة صفحات الهبوط، ربط بكسلات فيسبوك وتيك توك، وإنشاء كوبونات الخصم',
    defaultPermissions: ['landing_pages.manage', 'marketing.pixels', 'promos.manage', 'analytics.view'],
  },
  {
    id: 'support',
    title: 'خدمة العملاء والمراجعات',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    bgColor: 'hover:border-purple-500 bg-purple-50/40',
    borderColor: 'border-purple-500',
    desc: 'مراجعة وتقييمات العملاء، اعتماد المراجعات، ومتابعة شكاوى الزبائن',
    defaultPermissions: ['reviews.view', 'reviews.moderate', 'orders.view'],
  },
  {
    id: 'super_admin',
    title: 'مدير عام (Super Admin)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    bgColor: 'hover:border-rose-500 bg-rose-50/40',
    borderColor: 'border-rose-500',
    desc: 'صلاحيات كاملة وغير مقيدة على كافة تفاصيل وأموال وإعدادات وفريق عمل المتجر',
    defaultPermissions: ['all'],
  },
];

interface PermissionGroup {
  category: string;
  icon: React.ElementType;
  items: { key: string; label: string; description: string }[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'إدارة الطلبات والمبيعات',
    icon: ShoppingBag,
    items: [
      { key: 'orders.view', label: 'عرض قائمة الطلبات', description: 'الاطلاع على كافة طلبات الزبائن وتفاصيلها' },
      { key: 'orders.edit', label: 'تعديل حالات وتفاصيل الطلب', description: 'تحديث حالة الطلب (مؤكدة، جاهزة، ملغاة، إلخ)' },
      { key: 'orders.call_attempt', label: 'تسجيل محاولات الاتصال', description: 'تسجيل محاولات عدم الرد والاتصال بالزبون' },
      { key: 'orders.delete', label: 'حذف الطلبات', description: 'إمكانية مسح الطلبات غير المرغوب فيها' },
      { key: 'orders.export', label: 'تصدير الطلبات (Excel/CSV)', description: 'تحميل ملفات البيانات والبوليصات' },
    ],
  },
  {
    category: 'المنتجات والتصنيفات',
    icon: Package,
    items: [
      { key: 'products.view', label: 'عرض المنتجات', description: 'الاطلاع على كتالوج المنتجات وتفاصيل المخزون' },
      { key: 'products.create', label: 'إضافة منتجات جديدة', description: 'إنشاء بطاقات المنتجات وتحديد الأسعار والصور' },
      { key: 'products.edit', label: 'تعديل وحذف المنتجات', description: 'تحديث الأسعار، المخزون، والوصف' },
      { key: 'categories.manage', label: 'إدارة التصنيفات', description: 'إضافة وتعديل وحذف تصنيفات المتجر' },
    ],
  },
  {
    category: 'التسويق وصفحات الهبوط',
    icon: Layers,
    items: [
      { key: 'landing_pages.manage', label: 'صفحات الهبوط المخصصة', description: 'إنشاء وتعديل ونشر صفحات الهبوط الترويجية' },
      { key: 'marketing.pixels', label: 'بكسلات التتبع الإعلاني', description: 'ربط بكسلات Facebook, TikTok, Snap' },
      { key: 'promos.manage', label: 'قسائم وكوبونات الخصم', description: 'إنشاء رموز الخصم ونسب التخفيض' },
    ],
  },
  {
    category: 'التقارير وخدمة العملاء والحماية',
    icon: BarChart3,
    items: [
      { key: 'analytics.view', label: 'الإحصائيات والتقارير المالية', description: 'الاطلاع على حجم المبيعات والأرباح ومعدل التحويل' },
      { key: 'reviews.moderate', label: 'إدارة واعتماد تقييمات العملاء', description: 'قبول أو رفض مراجعات الزوار' },
      { key: 'blacklist.manage', label: 'القوائم المحظورة والحماية', description: 'حظر الأرقام المشبوهة والمتلاعبين' },
      { key: 'settings.manage', label: 'تخصيص المتجر والإعدادات', description: 'تعديل الشعار، القالب، وطرق الدفع والشحن' },
    ],
  },
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export const StaffTab: React.FC = () => {
  const {
    staff,
    addStaff,
    updateStaff,
    toggleStaffStatus,
    deleteStaff,
    staffSection,
    setStaffSection,
    setViewMode,
    showNotification,
  } = useStore();

  // Search & Filter in "All" view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Form State for Add / Edit
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<StaffRole>('orders_manager');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'orders.view',
    'orders.edit',
    'orders.call_attempt',
    'orders.export',
  ]);
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);

  // Handle Role Selection (Auto-applies preset permissions)
  const handleRoleSelect = (roleKey: StaffRole) => {
    setSelectedRole(roleKey);
    const roleDef = AVAILABLE_ROLES.find((r) => r.id === roleKey);
    if (roleDef) {
      setSelectedPermissions(roleDef.defaultPermissions);
    }
  };

  // Toggle individual permission
  const togglePermission = (permKey: string) => {
    if (selectedRole === 'super_admin') {
      return; // Super admin has all permissions
    }
    setSelectedPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  // Select all / Deselect all permissions
  const selectAllPermissions = () => {
    const allKeys = PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.key));
    setSelectedPermissions(allKeys);
  };

  const deselectAllPermissions = () => {
    setSelectedPermissions([]);
  };

  // Switch to Add Form
  const handleGoToAdd = () => {
    setEditingStaffId(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('MatjariStaff@2026');
    setSelectedRole('orders_manager');
    setSelectedPermissions([
      'orders.view',
      'orders.edit',
      'orders.call_attempt',
      'orders.export',
    ]);
    setAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setStaffSection('add');
  };

  // Switch to Edit Mode
  const handleStartEdit = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setFullName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setPassword('');
    setSelectedRole(member.role);
    setSelectedPermissions(member.permissions || []);
    setAvatar(member.avatar || PRESET_AVATARS[0]);
    setStaffSection('add');
  };

  // Submit Handler
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    const payload: Partial<StaffMember> & { name: string; email: string; phone: string; role: StaffRole; permissions: string[]; isActive: boolean; avatar: string } = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: selectedRole,
      permissions: selectedRole === 'super_admin' ? ['all'] : selectedPermissions,
      isActive: true,
      avatar,
      ...(password.trim() ? { password: password.trim() } : {}),
    };

    if (editingStaffId) {
      updateStaff(editingStaffId, payload);
      showNotification(`تم تحديث بيانات الموظف ${payload.name} بنجاح`, 'success');
    } else {
      addStaff(payload);
      showNotification(`تمت إضافة الموظف ${payload.name} إلى فريق العمل بنجاح`, 'success');
    }

    setEditingStaffId(null);
    setStaffSection('all');
  };

  // Filtered staff list
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    const matchesRole = selectedRoleFilter === 'all' || member.role === selectedRoleFilter;
    const matchesStatus =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'active' && member.isActive) ||
      (selectedStatusFilter === 'inactive' && !member.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const superAdminsCount = staff.filter((s) => s.role === 'super_admin').length;
  const ordersManagersCount = staff.filter((s) => s.role === 'orders_manager').length;
  const inventoryManagersCount = staff.filter((s) => s.role === 'inventory_manager').length;
  const activeCount = staff.filter((s) => s.isActive).length;

  return (
    <div id="staff-management-tab" className="space-y-6">
      {/* Header Banner & Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-600">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                إدارة عُمّال وموظفي المتجر (Staff Management)
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              إدارة صلاحيات فريق العمل، إضافة وتعيين مسؤولي تأكيد وشحن الطلبات، مسؤولي المخزون والتسويق مع تحديد أذونات الوصول للوحة التحكم بدقة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              id="staff-open-login-screen-btn"
              onClick={() => setViewMode('staff_login')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-2xl text-xs font-bold transition-all"
              title="الانتقال إلى واجهة تسجيل الدخول المخصصة للعُمال"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>صفحة تسجيل دخول العُمال</span>
            </button>

            {staffSection === 'all' ? (
              <button
                id="staff-add-new-btn"
                onClick={handleGoToAdd}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة عامل جديد</span>
              </button>
            ) : (
              <button
                id="staff-back-to-all-btn"
                onClick={() => {
                  setEditingStaffId(null);
                  setStaffSection('all');
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة لقائمة العُمال ({staff.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
          <button
            id="tab-btn-staff-all"
            onClick={() => {
              setEditingStaffId(null);
              setStaffSection('all');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              staffSection === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>الكل (قائمة العُمال)</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                staffSection === 'all' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {staff.length}
            </span>
          </button>

          <button
            id="tab-btn-staff-add"
            onClick={handleGoToAdd}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              staffSection === 'add'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{editingStaffId ? 'تعديل بيانات العامل' : 'إضافة عامل'}</span>
            {!editingStaffId && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md font-bold">
                جديد
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: ALL STAFF MEMBERS (الكل) */}
      {/* ========================================================================= */}
      {staffSection === 'all' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">إجمالي الموظفين</p>
                <p className="text-lg font-black text-slate-900">{staff.length} عمال</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">العمال النشطين</p>
                <p className="text-lg font-black text-emerald-600">{activeCount} نشط</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">مسؤولو الطلبات</p>
                <p className="text-lg font-black text-blue-600">{ordersManagersCount} موظف</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">المدراء العامون</p>
                <p className="text-lg font-black text-rose-600">{superAdminsCount} مدير</p>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="staff-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم، البريد أو الهاتف..."
                className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">الدور:</span>
              </div>
              <select
                id="staff-role-filter"
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">جميع الأدوار ({staff.length})</option>
                <option value="orders_manager">مسؤول الطلبات</option>
                <option value="inventory_manager">مسؤول المخزون</option>
                <option value="marketer">مسؤول التسويق</option>
                <option value="support">خدمة العملاء</option>
                <option value="super_admin">مدير عام</option>
              </select>

              <select
                id="staff-status-filter"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">كافة الحالات</option>
                <option value="active">نشط فقط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>

          {/* Staff Members Grid */}
          {filteredStaff.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm">لم يتم العثور على أي موظف</h4>
                <p className="text-xs text-slate-500 mt-1">
                  لا توجد نتائج تطابق معايير البحث أو التصفية الحالية.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRoleFilter('all');
                  setSelectedStatusFilter('all');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStaff.map((member) => {
                const roleDef = AVAILABLE_ROLES.find((r) => r.id === member.role) || AVAILABLE_ROLES[0];
                const isSuperAdmin = member.role === 'super_admin';

                return (
                  <div
                    key={member.id}
                    id={`staff-card-${member.id}`}
                    className={`bg-white rounded-3xl border transition-all p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                      member.isActive
                        ? 'border-slate-200/80 hover:border-slate-300'
                        : 'border-slate-200/60 opacity-75 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      {/* Top Row: Avatar + Name + Status Switch */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={member.avatar || PRESET_AVATARS[0]}
                              alt={member.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shadow-xs"
                            />
                            <span
                              className={`absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                member.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                              title={member.isActive ? 'نشط' : 'معطل'}
                            />
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-slate-900 leading-tight">
                              {member.name}
                            </h4>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border mt-1.5 ${roleDef.badgeColor}`}
                            >
                              {isSuperAdmin && <Shield className="w-3 h-3" />}
                              <span>{roleDef.title}</span>
                            </span>
                          </div>
                        </div>

                        {/* Active Toggle Switch */}
                        <div className="flex flex-col items-end">
                          <button
                            type="button"
                            onClick={() => toggleStaffStatus(member.id)}
                            title={member.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                              member.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                member.isActive ? '-translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span className="text-[9px] font-bold text-slate-400 mt-1">
                            {member.isActive ? 'نشط' : 'معطل'}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px] truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px]">{member.phone}</span>
                        </div>
                      </div>

                      {/* Role Description */}
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-2xl mt-3 leading-relaxed border border-slate-100">
                        {roleDef.desc}
                      </p>

                      {/* Permissions Tags */}
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                          الصلاحيات الممنوحة:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {isSuperAdmin || member.permissions?.includes('all') ? (
                            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Shield className="w-2.5 h-2.5" />
                              <span>صلاحيات كاملة وغير مقيدة</span>
                            </span>
                          ) : (
                            member.permissions?.slice(0, 3).map((perm, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                              >
                                {perm}
                              </span>
                            ))
                          )}
                          {!isSuperAdmin && member.permissions && member.permissions.length > 3 && (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                              +{member.permissions.length - 3} أخرى
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        آخر ظهور: {member.lastLogin}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(member)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                          title="تعديل بيانات وصلاحيات الموظف"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>

                        {!isSuperAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف الموظف "${member.name}" من المتجر؟`)) {
                                deleteStaff(member.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="إزالة الموظف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ADD / EDIT STAFF FORM (إضافة عامل) */}
      {/* ========================================================================= */}
      {staffSection === 'add' && (
        <form onSubmit={handleSubmitForm} className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span>{editingStaffId ? 'تعديل بيانات وصلاحيات العامل' : 'إضافة عامل جديد إلى المتجر'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  يرجى تحديد البيانات الشخصية، وسيلة الاتصال، والدور الوظيفي وصلاحيات الوصول للوحة التحكم.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingStaffId(null);
                  setStaffSection('all');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                إلغاء والعودة
              </button>
            </div>

            {/* 1. Personal & Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>1. البيانات الشخصية ومعلومات الاتصال</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الاسم الكامل للعامل <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="staff-fullname-input"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: محمد بن علي"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    البريد الإلكتروني للولوج <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="staff-email-input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="worker@matjari.dz"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف للاتصال والواتساب <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="staff-phone-input"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0550 12 34 56"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  الصورة الرمزية / الأفاتار
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {PRESET_AVATARS.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(imgUrl)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        avatar === imgUrl ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Avatar ${idx}`} className="w-12 h-12 object-cover" />
                      {avatar === imgUrl && (
                        <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Role Selector (Presets) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>2. الدور الوظيفي الأساسي (Job Role Preset)</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  اختيار الدور يضبط الصلاحيات الموصى بها تلقائياً
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AVAILABLE_ROLES.map((roleDef) => {
                  const isSelected = selectedRole === roleDef.id;

                  return (
                    <div
                      key={roleDef.id}
                      onClick={() => handleRoleSelect(roleDef.id as StaffRole)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all relative flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? `border-2 ${roleDef.borderColor} bg-white shadow-sm`
                          : 'border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                            {roleDef.id === 'super_admin' && <Shield className="w-3.5 h-3.5 text-rose-600" />}
                            <span>{roleDef.title}</span>
                          </h5>
                          <span
                            className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 border ${roleDef.badgeColor}`}
                          >
                            {roleDef.defaultPermissions.length === 1 && roleDef.defaultPermissions[0] === 'all'
                              ? 'صلاحيات كاملة'
                              : `${roleDef.defaultPermissions.length} صلاحيات جاهزة`}
                          </span>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {roleDef.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Detailed Permissions Checklist */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>3. صلاحيات الوصول المخصصة للوحة التحكم (Permissions)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    قم بتفعيل أو تعطيل أي صلاحية بدقة للتحكم فيما يمكن لهذا الموظف رؤيته أو تعديله.
                  </p>
                </div>

                {selectedRole !== 'super_admin' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      تحديد الكل
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllPermissions}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      إلغاء التحديد
                    </button>
                  </div>
                )}
              </div>

              {selectedRole === 'super_admin' ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-rose-600 shrink-0" />
                  <div className="text-xs text-rose-800 leading-relaxed">
                    <strong>تنبيه المدير العام (Super Admin):</strong> يمتلك هذا الحساب كافة الصلاحيات بدون أي قيود (إدارة الأموال، حذف الطلبات، الوصول للمبيعات وتعديل إعدادات الدومينات وفريق العمل).
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PERMISSION_GROUPS.map((group, groupIdx) => {
                    const GroupIcon = group.icon;

                    return (
                      <div
                        key={groupIdx}
                        className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3"
                      >
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-900 border-b border-slate-200/60 pb-2">
                          <GroupIcon className="w-4 h-4 text-emerald-600" />
                          <span>{group.category}</span>
                        </div>

                        <div className="space-y-2">
                          {group.items.map((item) => {
                            const isChecked = selectedPermissions.includes(item.key);

                            return (
                              <label
                                key={item.key}
                                onClick={() => togglePermission(item.key)}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer border transition-all ${
                                  isChecked
                                    ? 'bg-white border-emerald-500/50 shadow-2xs'
                                    : 'bg-white/60 border-transparent hover:bg-white'
                                }`}
                              >
                                <div className="pt-0.5">
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300" />
                                  )}
                                </div>
                                <div>
                                  <span className="block font-bold text-xs text-slate-800 leading-tight">
                                    {item.label}
                                  </span>
                                  <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">
                                    {item.description}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingStaffId(null);
                  setStaffSection('all');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                إلغاء التغييرات
              </button>

              <button
                type="submit"
                id="save-staff-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                <span>{editingStaffId ? 'تحديث وحفظ بيانات الموظف' : 'حفظ وإضافة العامل فوراً'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
