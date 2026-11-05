import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router';
import {
  LayoutDashboard, Package, Plus, Pencil, Trash2, LogOut,
  Search, AlertTriangle, DollarSign, Boxes, X, Check, Loader2,
  ListFilter, History, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, Minus, Tag
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
    variants?: any[];

}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface Stats {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
}

interface InventoryLog {
  id: number;
  action: 'IMPORT' | 'EXPORT';
  quantity: number;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ==================== AUTH ====================
function ProtectedRoute({ children }: { children: React.ReactNode }): React.JSX.Element {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        navigate('/products');
      } else alert(`Đăng nhập thất bại: ${data.message || 'Thông tin đăng nhập không hợp lệ'}`);
    } catch {
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(15,23,42,0.08)', width: '340px' }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#0f172a', fontWeight: '700' }}>Đăng nhập</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} required />
          <button type="submit" disabled={loading} style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? <Loader2 size={18} /> : <Check size={18} />} {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>Chưa có tài khoản? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>Đăng ký</Link></p>
      </div>
    </div>
  );
}

function Register(): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Đăng ký thành công!');
        navigate('/login');
      } else {
        alert(`Lỗi: ${Array.isArray(data.message) ? data.message.join(', ') : data.message}`);
      }
    } catch {
      alert('Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(15,23,42,0.08)', width: '340px' }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#0f172a', fontWeight: '700' }}>Đăng ký</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} required />
          <button type="submit" disabled={loading} style={{ padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? <Loader2 size={18} /> : <Check size={18} />} {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>Đã có tài khoản? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Đăng nhập</Link></p>
      </div>
    </div>
  );
}

// ==================== LAYOUT ====================
function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: isActive ? '600' : '500',
      textDecoration: 'none',
      color: isActive ? '#0f172a' : '#64748b',
      background: isActive ? '#f1f5f9' : 'transparent',
      transition: 'all 0.2s ease',
    } as React.CSSProperties;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
        <div>
          <div style={{ padding: '0 12px', marginBottom: '28px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard size={20} /> Bảng điều khiển
            </h3>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ padding: '0 12px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Quản lý sản phẩm</span>
            <Link to="/products" style={getLinkStyle('/products')}><Package size={18} /> Danh sách sản phẩm</Link>
            <Link to="/products/add" style={getLinkStyle('/products/add')}><Plus size={18} /> Thêm sản phẩm</Link>
          </nav>
        </div>
        <button
          onClick={() => { localStorage.removeItem('access_token'); navigate('/login'); }}
          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </aside>
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

// ==================== PRODUCTS MANAGER ====================
export function ProductsManager(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [form, setForm] = useState<ProductForm>({ name: '', description: '', price: 0, stock: 0, category: 'Khác' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 5;

  const [historyModal, setHistoryModal] = useState<{ productId: number; logs: InventoryLog[] } | null>(null);
  const [variantModal, setVariantModal] = useState<{ productId: number; variants: any[] } | null>(null);
  const [variantForm, setVariantForm] = useState({ name: '', stock: 0, priceAdjustment: 0 });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search, category, minPrice, maxPrice,
        lowStock: lowStock.toString(),
        sortBy, sortOrder,
        page: currentPage.toString(), limit: itemsPerPage.toString(),
      });
      const res = await fetch(`${API_URL}/products?${params.toString()}`, { headers: getAuthHeaders() });
      if (res.status === 401) { localStorage.removeItem('access_token'); window.location.href = '/login'; return; }
      const data = await res.json();
      if (data.data) {
        setProducts(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        setProducts(data);
        setTotalPages(1);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, category, minPrice, maxPrice, lowStock, sortBy, sortOrder, currentPage]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/products/stats`, { headers: getAuthHeaders() });
      if (res.ok) setStats(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const timer = setTimeout(() => { void fetchProducts(); void fetchStats(); }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    if (location.pathname !== '/products/add' && editingId !== null) {
      setEditingId(null);
      setForm({ name: '', description: '', price: 0, stock: 0, category: 'Khác' });
    }
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
    const method = isEditing ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(form) });
      if (res.ok) {
        setForm({ name: '', description: '', price: 0, stock: 0, category: 'Khác' });
        setEditingId(null);
        void fetchProducts(); void fetchStats();
        showToast(isEditing ? 'Cập nhật thành công!' : 'Thêm thành công!');
        navigate('/products');
      } else showToast('Lỗi xác thực dữ liệu', 'error');
    } catch { showToast('Lỗi mạng', 'error'); }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Xóa bản ghi này?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) { showToast('Đã xóa'); setActiveRowId(null); void fetchProducts(); void fetchStats(); }
    } catch (e) { console.error(e); }
  };

  const handleUpdateStock = async (id: number, amount: number) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}/stock`, {
        method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error();
      showToast('Cập nhật kho thành công!'); void fetchProducts(); void fetchStats();
    } catch { showToast('Lỗi cập nhật kho', 'error'); }
  };

  const handleViewHistory = async (productId: number) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}/logs`, { headers: getAuthHeaders() });
      if (res.ok) {
        const logs = await res.json();
        setHistoryModal({ productId, logs });
      }
    } catch { showToast('Lỗi tải lịch sử', 'error'); }
  };

  const handleEditClick = (product: Product): void => {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description || '', price: Number(product.price), stock: product.stock, category: product.category || 'Khác' });
    navigate('/products/add');
  };

  const handleSort = (key: string) => {
    if (sortBy === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortOrder('asc'); }
  };

  const isAddRoute = location.pathname === '/products/add';

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };
    const handleViewVariants = async (productId: number) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setVariantModal({ productId, variants: data.variants || [] });
      }
    } catch { showToast('Lỗi tải biến thể', 'error'); }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantModal) return;
    try {
      const res = await fetch(`${API_URL}/products/${variantModal.productId}/variants`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(variantForm)
      });
      if (res.ok) {
        showToast('Thêm biến thể thành công!');
        setVariantForm({ name: '', stock: 0, priceAdjustment: 0 });
        // Tải lại danh sách biến thể
        handleViewVariants(variantModal.productId);
      } else {
        showToast('Lỗi thêm biến thể', 'error');
      }
    } catch { showToast('Lỗi mạng', 'error'); }
  };

  // ===== FORM =====
  if (isAddRoute) {
    return (
      <Layout>
       <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
    <thead>
      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('id')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>ID <SortIcon column="id" /></div>
        </th>
        <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('name')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Tên <SortIcon column="name" /></div>
        </th>
        <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Mô tả</th>
        <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Danh mục</th>
        <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('price')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Giá <SortIcon column="price" /></div>
        </th>
        <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('stock')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Tồn kho <SortIcon column="stock" /></div>
        </th>
        <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', textAlign: 'right', whiteSpace: 'nowrap' }}>Thao tác</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /></td></tr>
      ) : products.length === 0 ? (
        <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy mục nào.</td></tr>
      ) : (
        products.map((p) => (
          <tr
            key={p.id}
            onClick={(e) => { e.stopPropagation(); setActiveRowId(activeRowId === p.id ? null : p.id); }}
            style={{
              borderBottom: '1px solid #f1f5f9',
              cursor: 'pointer',
              background: activeRowId === p.id ? '#eff6ff' : '#fff',
              transition: 'background 0.15s',
            }}
          >
            <td style={{ padding: '14px 18px', fontSize: '14px', color: '#64748b' }}>#{p.id}</td>
            <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{p.name}</td>
            <td style={{ padding: '14px 18px', fontSize: '14px', color: '#475569', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.description || '—'}
            </td>
            <td style={{ padding: '14px 18px', fontSize: '14px', color: '#475569' }}>{p.category || '—'}</td>
            <td style={{ padding: '14px 18px', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{Number(p.price).toLocaleString()} VND</td>
            <td style={{ padding: '14px 18px' }}>
              <span style={{
                padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
                backgroundColor: p.stock < 20 ? '#fee2e2' : '#dcfce7',
                color: p.stock < 20 ? '#dc2626' : '#16a34a',
                display: 'inline-flex', alignItems: 'center', gap: '4px'
              }}>
                {p.stock < 20 && <AlertTriangle size={14} />}{p.stock} đơn vị
              </span>
            </td>
            <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
              {activeRowId === p.id ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleUpdateStock(p.id, -1); }} disabled={p.stock === 0} style={{ padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: p.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleUpdateStock(p.id, 1); }} style={{ padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleViewHistory(p.id); }} title="Lịch sử kho" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><History size={18} color="#64748b" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleViewVariants(p.id); }} title="Xem biến thể" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Tag size={18} color="#64748b" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleEditClick(p); }} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Pencil size={14} /> Sửa</button>
                  <button onClick={(e) => { e.stopPropagation(); void handleDelete(p.id); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={14} /> Xóa</button>
                </div>
              ) : (
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Nhấn để thao tác</span>
              )}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>

  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
    <span style={{ fontSize: '13px', color: '#64748b' }}>
      Trang {currentPage} / {totalPages}
    </span>
    <div style={{ display: 'flex', gap: '6px' }}>
      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', color: '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><ChevronLeft size={16} /> Trước</button>
      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', color: '#334155', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>Sau <ChevronRight size={16} /></button>
    </div>
  </div>
</div>
      </Layout>
    );
  }

  // ===== LIST =====
  return (
    <Layout>
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', padding: '12px 20px',
          backgroundColor: toast.type === 'success' ? '#16a34a' : '#dc2626',
          color: 'white', borderRadius: '8px', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />} {toast.message}
        </div>
      )}

      {historyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setHistoryModal(null)}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '480px', maxHeight: '70vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={20} /> Lịch sử kho (SP #{historyModal.productId})
              </h3>
              <button onClick={() => setHistoryModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {historyModal.logs.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Chưa có lịch sử</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {historyModal.logs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: log.action === 'IMPORT' ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {log.action === 'IMPORT' ? <ArrowDown size={16} /> : <ArrowUp size={16} />} {log.quantity}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{new Date(log.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
            {variantModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setVariantModal(null)}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '500px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={20} /> Biến thể (SP #{variantModal.productId})
              </h3>
              <button onClick={() => setVariantModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Form thêm biến thể */}
            <form onSubmit={handleAddVariant} style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
              <input placeholder="Tên (VD: Size M)" value={variantForm.name} onChange={e => setVariantForm({ ...variantForm, name: e.target.value })} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
              <input type="number" placeholder="SL" value={variantForm.stock || ''} onChange={e => setVariantForm({ ...variantForm, stock: Number(e.target.value) })} style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              <input type="number" placeholder="Giá cộng thêm" value={variantForm.priceAdjustment || ''} onChange={e => setVariantForm({ ...variantForm, priceAdjustment: Number(e.target.value) })} style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Thêm</button>
            </form>

            {/* Danh sách biến thể */}
            {variantModal.variants.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Chưa có biến thể</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {variantModal.variants.map((v: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600' }}>{v.name}</span>
                    <span style={{ color: '#64748b' }}>SL: {v.stock} | +{Number(v.priceAdjustment).toLocaleString()} đ</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={22} /> Danh sách tồn kho sản phẩm
        </h3>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '10px', display: 'flex' }}><Boxes size={22} color="#2563eb" /></div>
              <div><div style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>Tổng sản phẩm</div><div style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>{stats.totalProducts}</div></div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '10px', display: 'flex' }}><DollarSign size={22} color="#16a34a" /></div>
              <div><div style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>Tổng giá trị kho</div><div style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>{stats.totalValue.toLocaleString('vi-VN')} đ</div></div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '10px', display: 'flex' }}><AlertTriangle size={22} color="#dc2626" /></div>
              <div><div style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>Sắp hết hàng (&lt;20)</div><div style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>{stats.lowStockCount}</div></div>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input placeholder="Tìm theo tên..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <ListFilter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <select value={category} onChange={e => { setCategory(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}>
              <option value="">Tất cả danh mục</option>
              <option value="Điện thoại">Điện thoại</option>
              <option value="Laptop">Laptop</option>
              <option value="Phụ kiện">Phụ kiện</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <input type="number" placeholder="Giá từ..." value={minPrice} onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '110px' }} />
          <input type="number" placeholder="Đến..." value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '110px' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', background: lowStock ? '#fee2e2' : '#f8fafc' }}>
            <input type="checkbox" checked={lowStock} onChange={e => { setLowStock(e.target.checked); setCurrentPage(1); }} />
            <AlertTriangle size={16} color={lowStock ? '#dc2626' : '#94a3b8'} /> Sắp hết
          </label>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>ID <SortIcon column="id" /></div>
                </th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Tên <SortIcon column="name" /></div>
                </th>
                
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Mô tả</th>

                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Danh mục</th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('price')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Giá <SortIcon column="price" /></div>
                </th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }} onClick={() => handleSort('stock')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Tồn kho <SortIcon column="stock" /></div>
                </th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /></td></tr>
              ) : products.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy mục nào.</td></tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setActiveRowId(activeRowId === p.id ? null : p.id)}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      background: activeRowId === p.id ? '#eff6ff' : '#fff',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#64748b' }}>#{p.id}</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{p.name}</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#475569', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
  {p.description || '—'}
</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#475569' }}>{p.category || '—'}</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{Number(p.price).toLocaleString()} VND</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
                        backgroundColor: p.stock < 20 ? '#fee2e2' : '#dcfce7',
                        color: p.stock < 20 ? '#dc2626' : '#16a34a',
                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                        {p.stock < 20 && <AlertTriangle size={14} />}{p.stock} đơn vị
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {activeRowId === p.id ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button onClick={(e) => { e.stopPropagation(); handleUpdateStock(p.id, -1); }} disabled={p.stock === 0} style={{ padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: p.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={16} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleUpdateStock(p.id, 1); }} style={{ padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleViewHistory(p.id); }} title="Lịch sử kho" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><History size={18} color="#64748b" /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleEditClick(p); }} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Pencil size={14} /> Sửa</button>
                          <button onClick={(e) => { e.stopPropagation(); void handleDelete(p.id); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={14} /> Xóa</button>
                          <button onClick={(e) => { e.stopPropagation(); handleViewVariants(p.id); }} title="Xem biến thể" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Tag size={18} color="#64748b" /></button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Nhấn để thao tác</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Trang {currentPage} / {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', color: '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><ChevronLeft size={16} /> Trước</button>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', color: '#334155', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>Sau <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
        <Route path="/products/add" element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
