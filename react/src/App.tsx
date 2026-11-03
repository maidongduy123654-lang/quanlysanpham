import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ProtectedRoute({ children }: { children: React.ReactNode }): React.JSX.Element {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      } else {
        alert(`Đăng nhập thất bại: ${data.message || 'Thông tin đăng nhập không hợp lệ'}`);
      }
    } catch {
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(15,23,42,0.08)', width: '340px' }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#0f172a', fontWeight: '700' }}>Đăng nhập</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} required />
          <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Đăng nhập</button>
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <button type="submit" style={{ padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Đăng ký</button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>Đã có tài khoản? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Đăng nhập</Link></p>
      </div>
    </div>
  );
}

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
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
        <div>
          <div style={{ padding: '0 12px', marginBottom: '28px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.025em' }}>Bảng điều khiển</h3>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ padding: '0 12px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>📦 Quản lý sản phẩm</span>
            <Link to="/products" style={getLinkStyle('/products')}><span>📋</span> Danh sách sản phẩm</Link>
            <Link to="/products/add" style={getLinkStyle('/products/add')}><span>➕</span> Thêm sản phẩm</Link>
            <Link to="/products/edit" style={getLinkStyle('/products/edit')}><span>✏️</span> Sửa sản phẩm</Link>
            <Link to="/products/remove" style={getLinkStyle('/products/remove')}><span>❌</span> Xóa sản phẩm</Link>
          </nav>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('access_token'); navigate('/login'); }} 
          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          Đăng xuất
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

export function ProductsManager(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>({ name: '', description: '', price: 0, stock: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    void fetchProducts();
  }, []);

  useEffect(() => {
    if (location.pathname !== '/products/add' && editingId !== null) {
      setEditingId(null);
      setForm({ name: '', description: '', price: 0, stock: 0 });
    }
  }, [location.pathname]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProducts = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/products`, { headers: getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
      }
      const data = (await res.json()) as Product[];
      setProducts(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: '', description: '', price: 0, stock: 0 });
        setEditingId(null);
        void fetchProducts(); 
        alert(isEditing ? 'Cập nhật thành công!' : 'Thêm thành công!');
        navigate('/products');
      } else {
        alert('Lỗi xác thực dữ liệu theo ràng buộc của máy chủ.');
      }
    } catch {
      alert('Lỗi truyền tải mạng.');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Xóa bản ghi này?')) {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok) {
          const totalItemsAfterDelete = products.length - 1;
          const maxRemainingPages = Math.ceil(totalItemsAfterDelete / itemsPerPage) || 1;
          if (currentPage > maxRemainingPages) {
            setCurrentPage(maxRemainingPages);
          }
          void fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEditClick = (product: Product): void => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      stock: product.stock,
    });
    navigate('/products/add');
  };

  // Pagination Window Index Computations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsSlice = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPagesCount = Math.ceil(products.length / itemsPerPage) || 1;

  // Determine active route state context
  const isAddRoute = location.pathname === '/products/add';
  const isEditRoute = location.pathname === '/products/edit';
  const isRemoveRoute = location.pathname === '/products/remove';

  const renderContent = () => {
    if (isAddRoute) {
      return (
        <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '520px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
              {editingId ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm'}
            </h3>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Tên</label>
              <input type="text" placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Mô tả</label>
              <textarea placeholder="Mô tả sản phẩm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Giá (VND)</label>
              <input type="number" placeholder="0" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Số lượng tồn kho</label>
              <input type="number" placeholder="0" value={form.stock || ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }} required />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Lưu</button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: 0, stock: 0 }); navigate('/products'); }} style={{ padding: '12px 20px', background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Hủy</button>
              )}
            </div>
          </form>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
          {isEditRoute ? '✏️ Chọn sản phẩm để sửa' : isRemoveRoute ? '❌ Chọn sản phẩm để xóa' : '📋 Danh sách tồn kho sản phẩm'}
        </h3>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>ID</th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Tên</th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Mô tả</th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Giá</th>
                <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Tồn kho</th>
                {(!isAddRoute) && <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {currentItemsSlice.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Không tìm thấy mục nào.</td></tr>
              ) : (
                currentItemsSlice.map((p: Product) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#64748b' }}>#{p.id}</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{p.name}</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#475569' }}>{p.description || '—'}</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{Number(p.price).toLocaleString()} VND</td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', color: '#475569' }}>{p.stock} đơn vị</td>
                    {(!isAddRoute) && (
                      <td style={{ padding: '14px 18px' }}>
                        {isEditRoute && (
                          <button onClick={() => handleEditClick(p)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Sửa</button>
                        )}
                        {isRemoveRoute && (
                          <button onClick={() => void handleDelete(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Xóa</button>
                        )}
                        {!isEditRoute && !isRemoveRoute && (
                          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Chỉ xem</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Hiển thị {products.length === 0 ? 0 : indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, products.length)} trong tổng số {products.length} mục
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', color: '#334155', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Trước</button>
              {Array.from({ length: totalPagesCount }, (_, idx) => idx + 1).map(num => (
                <button 
                  key={num} 
                  onClick={() => setCurrentPage(num)} 
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    background: currentPage === num ? '#2563eb' : '#fff', 
                    color: currentPage === num ? '#fff' : '#334155', 
                    border: '1px solid ' + (currentPage === num ? '#2563eb' : '#e2e8f0'), 
                    cursor: 'pointer', 
                    fontSize: '13px', 
                    fontWeight: '600' 
                  }}
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesCount))} 
                disabled={currentPage === totalPagesCount} 
                style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', color: '#334155', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <Layout>{renderContent()}</Layout>;
}
export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
        <Route path="/products/add" element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
        <Route path="/products/edit" element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
        <Route path="/products/remove" element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
