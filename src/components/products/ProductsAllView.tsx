import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Tag,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Filter,
  Warehouse,
  Boxes,
  Copy,
  Sparkles,
  LayoutGrid,
  List
} from 'lucide-react';

interface ProductsAllViewProps {
  onEditProduct: (product: Product) => void;
  onNavigateToAdd: () => void;
  onNavigateToInventory: () => void;
}

export const ProductsAllView: React.FC<ProductsAllViewProps> = ({
  onEditProduct,
  onNavigateToAdd,
  onNavigateToInventory
}) => {
  const {
    products,
    categories,
    updateProduct,
    deleteProduct,
    addProduct,
    settings,
    showNotification,
    setViewMode,
    setSelectedProductForDetail,
    t,
    language
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'published' | 'hidden'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_high' | 'price_low' | 'stock_high' | 'stock_low' | 'name'>('newest');
  const [viewModeLayout, setViewModeLayout] = useState<'grid' | 'table'>('table');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Statistics
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.isPublished).length;
  const hiddenProducts = products.filter((p) => !p.isPublished).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock || 0) * (p.price || 0), 0);

  // Filtered & Sorted Products
  const filteredProducts = products.filter((p) => {
    // Search query
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.badge && p.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Category filter
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

    // Visibility filter
    if (visibilityFilter === 'published' && !p.isPublished) return false;
    if (visibilityFilter === 'hidden' && p.isPublished) return false;

    // Stock filter
    if (stockFilter === 'in_stock' && p.stock <= 0) return false;
    if (stockFilter === 'low_stock' && (p.stock <= 0 || p.stock > 10)) return false;
    if (stockFilter === 'out_of_stock' && p.stock > 0) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'stock_high') return b.stock - a.stock;
    if (sortBy === 'stock_low') return a.stock - b.stock;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Toggle Publish / Hide Status
  const handleTogglePublish = (p: Product) => {
    const updatedStatus = !p.isPublished;
    updateProduct(p.id, { isPublished: updatedStatus });
    showNotification(
      language === 'ar'
        ? updatedStatus
          ? `تم إظهار المنتج "${p.name}" في المتجر للزوار`
          : `تم إخفاء المنتج "${p.name}" وتحويله كمسودة`
        : updatedStatus
        ? `Product "${p.name}" is now visible in storefront`
        : `Product "${p.name}" is now hidden from storefront`,
      'success'
    );
  };

  // Toggle Featured status
  const handleToggleFeatured = (p: Product) => {
    const nextFeatured = !p.isFeatured;
    updateProduct(p.id, { isFeatured: nextFeatured });
    showNotification(
      language === 'ar'
        ? nextFeatured
          ? `تم تمييز المنتج "${p.name}" في الصفحة الرئيسية`
          : `تمت إزالة تمييز المنتج "${p.name}"`
        : nextFeatured
        ? `Product "${p.name}" marked as featured on homepage`
        : `Product "${p.name}" unfeatured`,
      'info'
    );
  };

  // Duplicate / Clone Product
  const handleDuplicateProduct = (p: Product) => {
    const clonedProduct = {
      name: `${p.name} (نسخة)`,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      costPrice: p.costPrice,
      stock: p.stock,
      sku: `${p.sku}-COPY`,
      images: [...p.images],
      description: p.description,
      features: [...p.features],
      variants: p.variants ? [...p.variants] : undefined,
      badge: p.badge,
      isFeatured: false,
      isPublished: true,
    };
    addProduct(clonedProduct);
    showNotification(
      language === 'ar'
        ? `تم نسخ المنتج "${p.name}" بنجاح!`
        : `Product "${p.name}" duplicated successfully!`,
      'success'
    );
  };

  // Delete product confirmed
  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    showNotification(
      language === 'ar' ? 'تم حذف المنتج بنجاح من المتجر' : 'Product deleted successfully',
      'info'
    );
  };

  // Preview Product in Storefront
  const handlePreviewInStore = (p: Product) => {
    setSelectedProductForDetail(p);
    setViewMode('storefront');
  };

  return (
    <div id="products-all-view" className="space-y-6">
      {/* 1. Top Statistics & KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 border border-blue-100">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              {language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
            </span>
            <span className="text-base font-black text-slate-900 font-mono">
              {totalProducts} {language === 'ar' ? 'منتج' : 'Items'}
            </span>
          </div>
        </div>

        {/* Visible / Published */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-100">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              {language === 'ar' ? 'المنتجات الظاهرة' : 'Published / Live'}
            </span>
            <span className="text-base font-black text-emerald-600 font-mono">
              {publishedProducts} {language === 'ar' ? 'معروض للزبائن' : 'Active'}
            </span>
          </div>
        </div>

        {/* Hidden / Drafts */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm shrink-0 border border-slate-200">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              {language === 'ar' ? 'المخفية / المسودات' : 'Hidden / Drafts'}
            </span>
            <span className="text-base font-black text-slate-700 font-mono">
              {hiddenProducts} {language === 'ar' ? 'غير معروض' : 'Hidden'}
            </span>
          </div>
        </div>

        {/* Low / Out of Stock */}
        <div
          onClick={onNavigateToInventory}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              {language === 'ar' ? 'تنبيهات المخزون' : 'Stock Alerts'}
            </span>
            <span className="text-base font-black text-amber-600 font-mono">
              {outOfStockProducts + lowStockProducts} {language === 'ar' ? 'تتطلب تموين' : 'Low/Out'}
            </span>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm shrink-0 border border-purple-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="truncate">
            <span className="text-[11px] text-slate-500 font-medium block">
              {language === 'ar' ? 'قيمة المخزون الإجمالية' : 'Inventory Value'}
            </span>
            <span className="text-sm sm:text-base font-black text-purple-700 font-mono truncate block">
              {totalInventoryValue.toLocaleString()} {settings.currency}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Control Bar: Advanced Filters, Search, Sorting, Layout Switcher */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'بحث سريع بالاسم، الرمز (SKU)، الشارة، أو الوصف...'
                  : 'Search by product name, SKU, badge, description...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-2xl py-3 pr-11 pl-4 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-4" />
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-2">
            {/* View Inventory Shortcut */}
            <button
              onClick={onNavigateToInventory}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Warehouse className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">{language === 'ar' ? 'مدير المخزون' : 'Stock Manager'}</span>
            </button>

            {/* Add Product Button */}
            <button
              onClick={onNavigateToAdd}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</span>
            </button>

            {/* Layout Toggle (Grid / Table) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setViewModeLayout('table')}
                className={`p-2 rounded-xl transition-all ${
                  viewModeLayout === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                title={language === 'ar' ? 'عرض كجدول' : 'Table View'}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewModeLayout('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewModeLayout === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                title={language === 'ar' ? 'عرض كبطاقات' : 'Grid View'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              {language === 'ar' ? 'التصنيف والقسم:' : 'Category:'}
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">{language === 'ar' ? 'كافة التصنيفات' : 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              {language === 'ar' ? 'حالة الظهور:' : 'Visibility:'}
            </label>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">{language === 'ar' ? 'الكل (ظاهر ومخفي)' : 'All Statuses'}</option>
              <option value="published">{language === 'ar' ? 'ظاهر فقط في المتجر' : 'Published Only'}</option>
              <option value="hidden">{language === 'ar' ? 'مخفي / مسودة فقط' : 'Hidden Only'}</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              {language === 'ar' ? 'حالة المخزون:' : 'Stock Status:'}
            </label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">{language === 'ar' ? 'كافة حالات المخزون' : 'All Stock Statuses'}</option>
              <option value="in_stock">{language === 'ar' ? 'متوفر بالمخزن (> 0)' : 'In Stock (> 0)'}</option>
              <option value="low_stock">{language === 'ar' ? 'مخزون منخفض (1-10 قطع)' : 'Low Stock (1-10)'}</option>
              <option value="out_of_stock">{language === 'ar' ? 'نفد من المخزون (0)' : 'Out of Stock (0)'}</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              {language === 'ar' ? 'ترتيب حسب:' : 'Sort By:'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="newest">{language === 'ar' ? 'الأحدث إضافة' : 'Newest'}</option>
              <option value="price_high">{language === 'ar' ? 'السعر: من الأعلى للأدنى' : 'Price: High to Low'}</option>
              <option value="price_low">{language === 'ar' ? 'السعر: من الأدنى للأعلى' : 'Price: Low to High'}</option>
              <option value="stock_high">{language === 'ar' ? 'المخزون: الأكثر وفرة' : 'Stock: High to Low'}</option>
              <option value="stock_low">{language === 'ar' ? 'المخزون: الأقل توفراً' : 'Stock: Low to High'}</option>
              <option value="name">{language === 'ar' ? 'الاسم أبجدياً' : 'Product Name'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Products List View (Table Mode vs. Grid Mode) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-sm">
            {language === 'ar' ? 'لا توجد منتجات مطابقة لخيارات البحث' : 'No products matched your criteria'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {language === 'ar'
              ? 'جرب تغيير كلمة البحث أو إعادة تعيين الفلاتر لعرض كافة المنتجات.'
              : 'Try clearing your search terms or reset active filters.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setVisibilityFilter('all');
              setStockFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : viewModeLayout === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4 text-right">{language === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th className="p-4 text-right">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                  <th className="p-4 text-right">{language === 'ar' ? 'سعر البيع' : 'Selling Price'}</th>
                  <th className="p-4 text-right">{language === 'ar' ? 'التكلفة وهامش الربح' : 'Cost & Margin'}</th>
                  <th className="p-4 text-center">{language === 'ar' ? 'المخزون' : 'Stock'}</th>
                  <th className="p-4 text-center">{language === 'ar' ? 'الظهور' : 'Status'}</th>
                  <th className="p-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const profit = p.price - (p.costPrice || 0);
                  const marginPercent = p.price > 0 ? Math.round((profit / p.price) * 100) : 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Product Image & Title */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/70 overflow-hidden shrink-0 relative">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                            {p.badge && (
                              <span className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] font-black px-1 rounded-bl-lg">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-black text-slate-900 text-xs hover:text-emerald-600 transition-colors line-clamp-1">
                                {p.name}
                              </h5>
                              {p.isFeatured && (
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              SKU: {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200/50">
                          {p.category}
                        </span>
                      </td>

                      {/* Selling Price & Compare Price */}
                      <td className="p-4">
                        <div className="font-black text-slate-900 font-mono text-xs">
                          {p.price.toLocaleString()} {settings.currency}
                        </div>
                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                          <span className="text-[10px] text-slate-400 line-through font-mono block">
                            {p.compareAtPrice.toLocaleString()} {settings.currency}
                          </span>
                        )}
                      </td>

                      {/* Cost & Profit Margin */}
                      <td className="p-4">
                        <div className="text-[11px] font-mono text-slate-600">
                          {language === 'ar' ? 'ربح:' : 'Profit:'}{' '}
                          <span className="font-black text-emerald-600">
                            +{profit.toLocaleString()} {settings.currency}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({marginPercent}% {language === 'ar' ? 'هامش' : 'Margin'})
                        </span>
                      </td>

                      {/* Stock Quantity Badge */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black font-mono ${
                            p.stock === 0
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : p.stock <= 10
                              ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <span>{p.stock}</span>
                          <span>{language === 'ar' ? 'قطعة' : 'pcs'}</span>
                        </span>
                      </td>

                      {/* Visibility Toggle Switch */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                            p.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title={
                            p.isPublished
                              ? language === 'ar'
                                ? 'اضغط للإخفاء وتحويله لمسودة'
                                : 'Click to hide'
                              : language === 'ar'
                              ? 'اضغط للنشر في المتجر'
                              : 'Click to publish'
                          }
                        >
                          {p.isPublished
                            ? language === 'ar'
                              ? 'ظاهر للزبائن'
                              : 'Published'
                            : language === 'ar'
                            ? 'مسودة مخفية'
                            : 'Hidden'}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Preview in Storefront */}
                          <button
                            onClick={() => handlePreviewInStore(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title={language === 'ar' ? 'معاينة في المتجر' : 'Preview in Store'}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Featured toggle */}
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              p.isFeatured
                                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                            }`}
                            title={language === 'ar' ? 'تمييز في الرئيسية' : 'Feature Product'}
                          >
                            <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicateProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={language === 'ar' ? 'نسخ المنتج' : 'Duplicate Product'}
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title={language === 'ar' ? 'تعديل المنتج' : 'Edit Product'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title={language === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const profit = p.price - (p.costPrice || 0);

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="w-full aspect-square rounded-2xl bg-slate-100 overflow-hidden relative mb-3 border border-slate-100">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {p.badge && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                        {p.badge}
                      </span>
                    )}

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-xl backdrop-blur-xs transition-colors shadow-xs ${
                          p.isFeatured
                            ? 'bg-amber-400/90 text-white'
                            : 'bg-white/80 text-slate-400 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Stock status tag */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-md font-mono backdrop-blur-xs shadow-xs ${
                          p.stock === 0
                            ? 'bg-rose-500/90 text-white'
                            : p.stock <= 10
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-emerald-600/90 text-white'
                        }`}
                      >
                        {p.stock} {language === 'ar' ? 'قطعة بالمخزن' : 'pcs'}
                      </span>
                    </div>
                  </div>

                  {/* Title & SKU */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400">{p.category}</span>
                      <span className="text-[10px] font-mono text-slate-400">{p.sku}</span>
                    </div>
                    <h5 className="font-black text-slate-900 text-xs line-clamp-1">{p.name}</h5>
                  </div>

                  {/* Pricing & Profit */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-black text-slate-900 font-mono text-sm block">
                        {p.price.toLocaleString()} {settings.currency}
                      </span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="text-[10px] text-slate-400 line-through font-mono block">
                          {p.compareAtPrice.toLocaleString()} {settings.currency}
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 block font-semibold">
                        {language === 'ar' ? 'هامش الربح' : 'Profit'}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600 font-mono">
                        +{profit.toLocaleString()} {settings.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => handleTogglePublish(p)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 ${
                      p.isPublished
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{p.isPublished ? (language === 'ar' ? 'معروض' : 'Live') : (language === 'ar' ? 'مخفي' : 'Draft')}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePreviewInStore(p)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                      title={language === 'ar' ? 'معاينة في المتجر' : 'Preview'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditProduct(p)}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold"
                      title={language === 'ar' ? 'تعديل' : 'Edit'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                      title={language === 'ar' ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-black text-slate-900 text-base">
                {language === 'ar' ? 'تأكيد حذف المنتج؟' : 'Delete Product?'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'ar'
                  ? 'هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟ لا يمكن التراجع عن هذه الخطوة.'
                  : 'Are you sure you want to permanently delete this product? This action cannot be undone.'}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black transition-colors shadow-sm"
              >
                {language === 'ar' ? 'نعم، حذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
