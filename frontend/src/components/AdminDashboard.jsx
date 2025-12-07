import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function AdminDashboard() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image_url: '', type: 'Food', dietary: 'Veg', meal_time: 'All' });

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchItems();
        fetchOrders(); // Fetch orders on load
    }, []);

    const fetchItems = () => {
        axios.get(`${API_URL}/menu`).then(res => setItems(res.data));
    };

    const fetchOrders = () => {
        axios.get(`${API_URL}/orders`).then(res => setOrders(res.data));
    };

    const handleStatusUpdate = async (id, status) => {
        await axios.put(`${API_URL}/orders/${id}`, { status });
        fetchOrders();
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/menu/${id}`);
        fetchItems();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/menu`, form);
        setForm({ name: '', description: '', price: '', category: '', image_url: '', type: 'Food', dietary: 'Veg', meal_time: 'All' });
        fetchItems();
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h2>Orders</h2>
                {orders.length === 0 ? <p>No orders yet.</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left' }}>
                                <th style={{ padding: '0.5rem' }}>ID</th>
                                <th style={{ padding: '0.5rem' }}>User</th>
                                <th style={{ padding: '0.5rem' }}>Items</th>
                                <th style={{ padding: '0.5rem' }}>Total</th>
                                <th style={{ padding: '0.5rem' }}>Status</th>
                                <th style={{ padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(o => o.status !== 'completed').map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '0.5rem' }}>#{order.id}</td>
                                    <td style={{ padding: '0.5rem' }}>{order.username || 'Guest'}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {order.items?.map(i => (
                                            <div key={i.name} style={{ fontSize: '0.9rem' }}>{i.quantity} x {i.name}</div>
                                        ))}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>₹{order.total_price}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            background: order.status === 'completed' ? '#2ed573' : '#ffa502',
                                            color: 'white',
                                            fontSize: '0.8rem'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {order.status !== 'completed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                className="btn"
                                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: '#2ed573', color: 'white' }}
                                            >
                                                Done
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="Food">Food</option>
                            <option value="Drink">Drink</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Dietary</label>
                        <select value={form.dietary} onChange={e => setForm({ ...form, dietary: e.target.value })}>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Meal Time</label>
                        <select value={form.meal_time} onChange={e => setForm({ ...form, meal_time: e.target.value })}>
                            <option value="All">All Day</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Item</button>
                </form>
            </div>

            <h2>Manage Menu</h2>
            <div className="grid-container">
                {items.map(item => (
                    <div key={item.id} className="product-card">
                        <div className="product-info">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <div className="price">₹{item.price}</div>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
