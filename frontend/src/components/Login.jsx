import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/login`, { username, password });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate(res.data.user.role === 'admin' ? '/admin' : '/');
            window.location.reload();
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
            </form>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Demo Creds: admin/admin123 or student/student123
            </p>
        </div>
    );
}
