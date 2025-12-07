import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // Grouped items logic could go here, but context handles simple list. 
    // We'll just display the list.

    const handlePlaceOrder = async () => {
        if (!user) {
            alert('Please login to place order');
            navigate('/login');
            return;
        }

        try {
            await axios.post(`${API_URL}/orders`, {
                user_id: user.id,
                items: cart
            });
            alert('Order placed successfully!');
            clearCart();
            navigate('/');
        } catch (e) {
            alert('Failed to place order');
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Your cart is empty 🍔</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Menu</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h1>Your Cart</h1>
            <div className="glass-card">
                {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
                        <div>
                            <h3>{item.name}</h3>
                            <p>₹{item.price} x {item.quantity}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button className="btn" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateQuantity(item.id, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button className="btn" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>Remove</button>
                        </div>
                    </div>
                ))}
                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Total: ₹{total}</h2>
                    <button onClick={handlePlaceOrder} className="btn btn-primary" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Place Order</button>
                </div>
            </div>
        </div>
    );
}
