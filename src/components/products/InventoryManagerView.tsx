import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import {
  Warehouse,
  Package,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Edit3,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Filter,
  Save,
  Boxes
} from 'lucide-react';

interface InventoryManagerViewProps {
  onEditProduct: (product: Product) => void;
  onNavigateToAdd: () => void;
}

export const InventoryManagerView: React.FC<InventoryManagerViewProps> = ({
  onEditProduct,
  onNavigateToAdd,
}) => {
  const {
    products,
    updateProduct,
    categories,
    settings,
    showNotification,
    language
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [editingStockMap, setEditingStockMap] = useState<Record<string, number>>({});

  // Summary KPIs
  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const healthyStockCount = products.filter((p) => p.stock > 10).length;

  const totalCostValue = products.reduce(
    (acc, p) => acc + (p.stock || 0) * (p.costPrice || 0),
    0
  );
  const totalRetailValue = products.reduce(
    (acc, p) => acc + (p.stock || 0) * (p.price || 0),
    0
  );

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

    if (stockStatusFilter === 'in_stock' && p.stock <= 0) return false;
    if (stockStatusFilter === 'low_stock' && (p.stock <= 0 || p.stock > 10)) return false;
    if (stockStatusFilter === 'out_of_stock' && p.stock > 0) return false;

    return true;
  });

  // Handle local stock adjustment
  const handleStockChange = (productId: string, newQty: number) => {
    const safeQty = Math.max(0, newQty);
    setEditingStockMap((prev) => ({ ...prev, [productId]: safeQty }));
  };

  // Save specific product stock
  const handleSaveStock = (p: Product) => {
    const currentEdited = editingStockMap[p.id];
    if (currentEdited === undefined) return;

    updateProduct(p.id, { stock: currentEdited });
    setEditingStockMap((prev) => {
      const copy = { ...prev };
      delete copy[p.id];
      return copy;
    });

    showNotification(
      language === 'ar'
        ? `تم تحديث مخزون "${p.name}" إلى ${currentEdited} قطعة بنجاح!`
        : `Stock for "${p.name}" updated to ${currentEdited} pcs!`,
      'success'
    );
  };

  // Quick increment / decrement
  const handleQuickStep = (p: Product, delta: number) => {
    const currentQty = editingStockMap[p.id] ?? p.stock;
    const newQty = Math.max(0, currentQty + delta);
    updateProduct(p.id, { stock: newQty });
    setEditingStockMap((prev) => {
      const copy = { ...prev };
      delete copy[p.id];
      return copy;
    });
    showNotification(
      language === 'ar'
        ? `تم تعديل مخزون "${p.name}": ${newQty} قطعة`
        : `Stock updated for "${p.name}": ${newQty} pcs`,
      'info'
    );
  };

  // Toggle Out-of-Stock (0 stock) vs In-Stock (restock to 20)
  const handleToggleStockStatus = (p: Product) => {
    const targetStock = p.stock === 0 ? 20 : 0;
    updateProduct(p.id, { stock: targetStock });
    showNotification(
      language === 'ar'
        ? targetStock === 0
          ? `تم تحديد المنتج "${p.name}" كنافد من المخزون (0 قطعة)`
          : `تم إعادة تفعيل مخزون "${p.name}" بـ ${targetStock} قطعة`
        : `Stock updated for "${p.name}"`,
      'success'
    );
  };

  return (
    <div id="inventory-manager-view" className="space-y-6">
      {/* 1. Header & Overview KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Stock Units */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 border border-blue-100">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">
              {language === 'ar' ? 'إجمالي القطع بالمخزن' : 'Total Inventory Units'}
            </span>
            <span className="text-xl font-black text-slate-900 font-mono block">
              {totalUnits.toLocaleString()} {language === 'ar' ? 'قطعة' : 'pcs'}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {products.length} {language === 'ar' ? 'منتج مختلف' : 'products'}
            </span>
          </div>
        </div>

        {/* Healthy Stock */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">
              {language === 'ar' ? 'متوفر بحالة آمنة' : 'In Stock (Safe)'}
            </span>
            <span className="text-xl font-black text-emerald-600 font-mono block">
              {healthyStockCount} {language === 'ar' ? 'منتج' : 'items'}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {language === 'ar' ? 'أكثر من 10 قطع' : '> 10 units'}
            </span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setStockStatusFilter('low_stock')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm shrink-0 border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">
              {language === 'ar' ? 'مخزون منخفض (تنبيه)' : 'Low Stock Alert'}
            </span>
            <span className="text-xl font-black text-amber-600 font-mono block">
              {lowStockCount} {language === 'ar' ? 'منتج' : 'items'}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">
              {language === 'ar' ? 'أقل من 10 قطع' : '< 10 units left'}
            </span>
          </div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setStockStatusFilter('out_of_stock')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-rose-400 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-sm shrink-0 border border-rose-100">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">
              {language === 'ar' ? 'نفد من المخزون' : 'Out of Stock'}
            </span>
            <span className="text-xl font-black text-rose-600 font-mono block">
              {outOfStockCount} {language === 'ar' ? 'منتج' : 'items'}
            </span>
            <span className="text-[10px] text-rose-700 font-semibold">
              {language === 'ar' ? 'يتطلب إعادة تموين' : 'Requires Restock'}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Valuation Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm">
              {language === 'ar' ? 'التقييم المالي الشامل للمخزون' : 'Total Inventory Valuation'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'مقارنة بين رأس المال المستثمر في التكلفة وإجمالي المبيعات المتوقعة'
                : 'Comparison between total invested cost and expected gross revenue'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-700/60 pt-3 sm:pt-0">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">
              {language === 'ar' ? 'رأس مال التكلفة:' : 'Cost Capital:'}
            </span>
            <span className="text-sm sm:text-base font-black text-slate-200">
              {totalCostValue.toLocaleString()} {settings.currency}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 block font-sans font-bold">
              {language === 'ar' ? 'قيمة البيع المتوقعة:' : 'Gross Retail Value:'}
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-400">
              {totalRetailValue.toLocaleString()} {settings.currency}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filters & Action Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'بحث سريع في المخزون بالاسم، SKU أو القسم...'
                  : 'Search inventory by name, SKU, or category...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-2xl py-3 pr-11 pl-4 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-4" />
          </div>

          <div className="flex items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{language === 'ar' ? 'كافة التصنيفات' : 'All Categories'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Add Product Shortcut */}
            <button
              onClick={onNavigateToAdd}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة منتج' : 'Add Product'}</span>
            </button>
          </div>
        </div>

        {/* Stock Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 ml-1">
            {language === 'ar' ? 'تصفية المخزون:' : 'Filter:'}
          </span>
          <button
            onClick={() => setStockStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              stockStatusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'ar' ? `الكل (${products.length})` : `All (${products.length})`}
          </button>
          <button
            onClick={() => setStockStatusFilter('in_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              stockStatusFilter === 'in_stock'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {language === 'ar' ? `متوفر بالمخزن (${healthyStockCount})` : `In Stock (${healthyStockCount})`}
          </button>
          <button
            onClick={() => setStockStatusFilter('low_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              stockStatusFilter === 'low_stock'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {language === 'ar' ? `مخزون منخفض (${lowStockCount})` : `Low Stock (${lowStockCount})`}
          </button>
          <button
            onClick={() => setStockStatusFilter('out_of_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              stockStatusFilter === 'out_of_stock'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            {language === 'ar' ? `نفد من المخزون (${outOfStockCount})` : `Out of Stock (${outOfStockCount})`}
          </button>
        </div>
      </div>

      {/* 3. Interactive Inventory Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 text-right">{language === 'ar' ? 'المنتج' : 'Product'}</th>
                <th className="p-4 text-right">{language === 'ar' ? 'التصنيف وSKU' : 'Category & SKU'}</th>
                <th className="p-4 text-right">{language === 'ar' ? 'التسعير' : 'Prices'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'حالة المخزون' : 'Status'}</th>
                <th className="p-4 text-center min-w-[220px]">{language === 'ar' ? 'تعديل الكمية الفوري' : 'Live Quantity Adjuster'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'إعادة التموين السريع' : 'Quick Restock'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const currentEditing = editingStockMap[p.id];
                const activeQty = currentEditing !== undefined ? currentEditing : p.stock;
                const isModified = currentEditing !== undefined && currentEditing !== p.stock;

                const isOutOfStock = activeQty === 0;
                const isLowStock = activeQty > 0 && activeQty <= 10;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 text-xs line-clamp-1">{p.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category & SKU */}
                    <td className="p-4">
                      <div className="font-bold text-slate-700 text-xs">{p.category}</div>
                      <span className="text-[10px] font-mono text-slate-400">SKU: {p.sku}</span>
                    </td>

                    {/* Price & Cost */}
                    <td className="p-4">
                      <div className="font-black text-slate-900 font-mono text-xs">
                        {p.price.toLocaleString()} {settings.currency}
                      </div>
                      {p.costPrice ? (
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {language === 'ar' ? 'التكلفة:' : 'Cost:'} {p.costPrice.toLocaleString()} {settings.currency}
                        </span>
                      ) : null}
                    </td>

                    {/* Stock Status Badge */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStockStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                        }`}
                        title={language === 'ar' ? 'اضغط لتغيير الحالة السريعة' : 'Toggle status'}
                      >
                        {isOutOfStock ? (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>{language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}</span>
                          </>
                        ) : isLowStock ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>{language === 'ar' ? 'مخزون منخفض' : 'Low Stock'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{language === 'ar' ? 'متوفر بالمخزن' : 'In Stock'}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Live Quantity Adjuster Stepper */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickStep(p, -1)}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={activeQty}
                          onChange={(e) =>
                            handleStockChange(
                              p.id,
                              e.target.value === '' ? 0 : Number(e.target.value)
                            )
                          }
                          className={`w-16 py-1.5 text-center font-black font-mono text-xs rounded-xl border focus:outline-none transition-all ${
                            isModified
                              ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                              : isOutOfStock
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => handleQuickStep(p, 1)}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        {isModified && (
                          <button
                            type="button"
                            onClick={() => handleSaveStock(p)}
                            className="p-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                            title={language === 'ar' ? 'حفظ الكمية' : 'Save'}
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Quick Restock Batch buttons */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleQuickStep(p, 10)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-mono font-bold transition-colors"
                          title="إضافة 10 قطع"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickStep(p, 25)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-mono font-bold transition-colors"
                          title="إضافة 25 قطعة"
                        >
                          +25
                        </button>
                        <button
                          onClick={() => handleQuickStep(p, 50)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-mono font-bold transition-colors"
                          title="إضافة 50 قطعة"
                        >
                          +50
                        </button>
                      </div>
                    </td>

                    {/* Edit Full Product */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                        title={language === 'ar' ? 'تعديل كامل المنتج' : 'Edit Product'}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
