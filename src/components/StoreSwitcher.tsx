import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Store,
  ChevronDown,
  Plus,
  Check,
  ExternalLink,
  Globe,
  Settings,
  Search,
  Sparkles,
  ShoppingBag,
  Package
} from 'lucide-react';

export const StoreSwitcher: React.FC<{ variant?: 'header' | 'sidebar' }> = ({ variant = 'header' }) => {
  const {
    merchantStores,
    currentStore,
    currentStoreId,
    switchStore,
    setIsCreateStoreModalOpen,
    setCurrentTab,
    setViewMode,
    products,
    orders,
    settings,
    t
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStores = merchantStores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.domain && s.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.slogan && s.slogan.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectStore = (storeId: string) => {
    if (storeId !== currentStoreId) {
      switchStore(storeId);
    }
    setIsOpen(false);
  };

  const handleOpenCreateModal = () => {
    setIsOpen(false);
    setIsCreateStoreModalOpen(true);
  };

  if (variant === 'sidebar') {
    return (
      <div className="relative" ref={dropdownRef}>
        <div
          id="sidebar-store-switcher-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition-all text-right group"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {currentStore?.logoUrl ? (
              <img
                src={currentStore.logoUrl}
                alt={currentStore.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                style={{ backgroundColor: currentStore?.primaryColor || '#10b981' }}
              >
                <Store className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate max-w-[130px]">
                  {currentStore?.name || settings.storeName}
                </p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Globe className="w-2.5 h-2.5" />
                <span className="truncate">{currentStore?.domain || 'متجر نشط'}</span>
              </p>
            </div>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform shrink-0 ${
              isOpen ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            id="sidebar-store-dropdown"
            className="absolute right-0 bottom-full mb-2 w-72 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2.5 z-50 text-right space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
              <div className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">تبديل المتجر</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold">
                {merchantStores.length} متاجر
              </span>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto">
              {merchantStores.map((s) => {
                const isActive = s.id === currentStoreId;
                const prodCount = isActive ? products.length : s.totalProducts || 0;
                const ordCount = isActive ? orders.length : s.totalOrders || 0;

                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStore(s.id)}
                    className={`w-full text-right p-2 rounded-xl flex items-center gap-2.5 transition-all ${
                      isActive
                        ? 'bg-emerald-600/20 border border-emerald-500/30 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {s.logoUrl ? (
                      <img src={s.logoUrl} alt={s.name} className="w-7 h-7 rounded-lg object-cover" />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: s.primaryColor || '#10b981' }}
                      >
                        <Store className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-slate-200">{s.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {prodCount} منتج • {ordCount} طلب
                      </p>
                    </div>

                    {isActive && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleOpenCreateModal}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة متجر جديد</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default 'header' variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="header-store-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 transition-all text-right group"
        aria-label="تبديل المتجر"
      >
        {currentStore?.logoUrl ? (
          <img
            src={currentStore.logoUrl}
            alt={currentStore.name}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-slate-200 shrink-0"
          />
        ) : (
          <div
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
            style={{ backgroundColor: currentStore?.primaryColor || '#10b981' }}
          >
            <Store className="w-3.5 h-3.5" />
          </div>
        )}

        <div className="hidden sm:block text-right min-w-0 max-w-[130px] md:max-w-[160px]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 truncate leading-none">
              {currentStore?.name || settings.storeName}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
            {currentStore?.domain || 'متجر نشط'}
          </p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform shrink-0 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="header-store-dropdown"
          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 text-right space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header Info */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">متاجرك وتبديل الحساب</span>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
              {merchantStores.length} متاجر متاحة
            </span>
          </div>

          {/* Quick Search if more than 2 stores */}
          {merchantStores.length > 2 && (
            <div className="relative">
              <input
                type="text"
                placeholder="بحث في المتاجر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right placeholder-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          )}

          {/* Stores List */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {filteredStores.map((s) => {
              const isActive = s.id === currentStoreId;
              const prodCount = isActive ? products.length : s.totalProducts || 0;
              const ordCount = isActive ? orders.length : s.totalOrders || 0;

              return (
                <div
                  key={s.id}
                  id={`store-option-${s.id}`}
                  onClick={() => handleSelectStore(s.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {s.logoUrl ? (
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                      style={{ backgroundColor: s.primaryColor || '#10b981' }}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-800 truncate">{s.name}</p>
                      {isActive && (
                        <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                          الحالي
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5">
                      <span className="text-slate-400 font-mono">{s.domain || s.slug}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{s.currency}</span>
                      <span>•</span>
                      <span>{prodCount} منتج</span>
                    </p>
                  </div>

                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-[10px] text-slate-500 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-2 py-1 rounded-lg font-bold transition-colors shrink-0"
                    >
                      تبديل
                    </button>
                  )}
                </div>
              );
            })}

            {filteredStores.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-3">لا توجد متاجر تطابق البحث</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            <button
              id="switcher-create-new-store-btn"
              onClick={handleOpenCreateModal}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة متجر جديد (Create Store)</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentTab('store_customizer');
                }}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Settings className="w-3 h-3 text-slate-500" />
                <span>تخصيص المتجر</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setViewMode('storefront');
                }}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-emerald-600" />
                <span>معاينة الواجهة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
