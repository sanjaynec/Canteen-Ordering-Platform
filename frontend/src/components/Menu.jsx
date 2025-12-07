import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useCart } from '../context/CartContext';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filter, setFilter] = useState({ type: 'All', dietary: 'All', meal_time: 'All' });
    const { addToCart } = useCart();

    useEffect(() => {
        axios.get(`${API_URL}/menu`).then(res => {
            setItems(res.data);
            setFilteredItems(res.data);
        });
    }, []);

    useEffect(() => {
        let result = items;
        if (filter.type !== 'All') result = result.filter(i => i.type === filter.type);
        if (filter.dietary !== 'All') result = result.filter(i => i.dietary === filter.dietary);
        if (filter.meal_time !== 'All') result = result.filter(i => i.meal_time === filter.meal_time || i.meal_time === 'All');
        setFilteredItems(result);
    }, [filter, items]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="glass-card" style={{ margin: '2rem', padding: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>Type:</strong>
                    {['All', 'Food', 'Drink'].map(t => (
                        <button key={t} onClick={() => setFilter({ ...filter, type: t })}
                            className={`btn ${filter.type === t ? 'btn-primary' : ''}`}
                            style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem', background: filter.type === t ? '' : '#eee' }}>
                            {t}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>Dietary:</strong>
                    {['All', 'Veg', 'Non-Veg'].map(d => (
                        <button key={d} onClick={() => setFilter({ ...filter, dietary: d })}
                            className={`btn ${filter.dietary === d ? 'btn-primary' : ''}`}
                            style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem', background: filter.dietary === d ? '' : '#eee' }}>
                            {d}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>Meal:</strong>
                    {['All', 'Breakfast', 'Lunch'].map(m => (
                        <button key={m} onClick={() => setFilter({ ...filter, meal_time: m })}
                            className={`btn ${filter.meal_time === m ? 'btn-primary' : ''}`}
                            style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem', background: filter.meal_time === m ? '' : '#eee' }}>
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid-container">
                {filteredItems.map(item => (
                    <div key={item.id} className="product-card">
                        <img src={item.image_url || 'https://placehold.co/300x200'} alt={item.name} />
                        <div className="product-info">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <div className="price">₹{item.price}</div>
                            <button onClick={() => addToCart(item)} className="btn btn-primary">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
