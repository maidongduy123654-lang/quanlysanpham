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

const API_URL = 'http://localhost:3000';

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
        alert(`Login Failed: ${data.message || 'Invalid credentials'}`);
      }
    } catch {
      alert('Could not reach backend.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2>Sign In</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px' }} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px' }} required />
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Login</button>
        </form>
        <p style={{ marginTop: '15px' }}>Don't have an account? <Link to="/register">Register</Link></p>
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
        alert('Registered successfully!');
        navigate('/login');
      } else {
        alert(`Error: ${Array.isArray(data.message) ? data.message.join(', ') : data.message}`);
      }
    } catch {
      alert('Registration failed.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2>Register</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '10px' }} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px' }} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px' }} required />
          <button type="submit" style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>Register</button>
        </form>
        <p style={{ marginTop: '15px' }}>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '240px', background: '#fff', borderRight: '1px solid #ddd', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3>Dashboard</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/products" style={{ fontWeight: location.pathname === '/products' ? 'bold' : 'normal', textDecoration: 'none', color: '#333' }}>📦 Products</Link>
            <Link to="/analytics" style={{ fontWeight: location.pathname === '/analytics' ? 'bold' : 'normal', textDecoration: 'none', color: '#333' }}>📊 Analytics</Link>
          </nav>
        </div>
        <button onClick={() => { localStorage.removeItem('access_token'); navigate('/login'); }} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer' }}>Logout</button>
      </aside>
      <main style={{ flex: 1, padding: '30px', background: '#f8f9fa' }}>{children}</main>
    </div>
  );
}

function Analytics(): React.JSX.Element {
  return <Layout><h2>Analytics Overview</h2><p>System metrics monitor active.</p></Layout>;

}
// ============================================================================
// CONTINUATION OF APP.TSX (PRODUCTS WORKSPACE)
// ============================================================================
function ProductsManager(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>({ name: '', description: '', price: 0, stock: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination Configuration State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    void fetchProducts();
  }, []);

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
        alert(isEditing ? 'Updated successfully!' : 'Added successfully!');
      } else {
        alert('Validation error matching backend schema constraints.');
      }
    } catch {
      alert('Network transmission error.');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Delete this record?')) {
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
  };

  // Pagination Window Index Computations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsSlice = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPagesCount = Math.ceil(products.length / itemsPerPage) || 1;

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Left Side: Form */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', width: '280px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
            <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: '8px' }} required />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: '8px' }} />
            <input type="number" placeholder="Price" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} style={{ padding: '8px' }} required />
            <input type="number" placeholder="Stock" value={form.stock || ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} style={{ padding: '8px' }} required />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '8px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Save</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: 0, stock: 0 }); }} style={{ padding: '8px', background: '#6c757d', color: '#fff', border: 'none' }}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* Right Side: Data Grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <table border={1} cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItemsSlice.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No items found.</td></tr>
              ) : (
                currentItemsSlice.map((p: Product) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.description || 'N/A'}</td>
                    <td>{Number(p.price).toLocaleString()} VND</td>
                    <td>{p.stock} units</td>
                    <td>
                      <button onClick={() => handleEditClick(p)} style={{ marginRight: '5px', background: '#ffc107', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => void handleDelete(p.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls Wrapper */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#555' }}>
              Showing {products.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, products.length)} of {products.length} entries
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px 10px', cursor: 'pointer' }}>Prev</button>
              {Array.from({ length: totalPagesCount }, (_, idx) => idx + 1).map(num => (
                <button key={num} onClick={() => setCurrentPage(num)} style={{ padding: '6px 12px', background: currentPage === num ? '#007bff' : '#fff', color: currentPage === num ? '#fff' : '#333', border: '1px solid #ccc', cursor: 'pointer', fontWeight: currentPage === num ? 'bold' : 'normal' }}>{num}</button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesCount))} disabled={currentPage === totalPagesCount} style={{ padding: '6px 10px', cursor: 'pointer' }}>Next</button>
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
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
