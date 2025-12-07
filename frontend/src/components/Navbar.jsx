import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { cart } = useCart();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav>
            <Link to="/" className="logo">🍔 CollegeCanteen</Link>
            <div>
                <Link to="/">Menu</Link>
                {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
                {user?.role !== 'admin' && (
                    <Link to="/cart">Cart ({cartCount})</Link>
                )}

                {user ? (
                    <button onClick={handleLogout} className="btn" style={{ marginLeft: '1rem' }}>Logout ({user.username})</button>
                ) : (
                    <Link to="/login" className="btn btn-primary" style={{ marginLeft: '1rem' }}>Login</Link>
                )}
            </div>
        </nav>
    );
}
