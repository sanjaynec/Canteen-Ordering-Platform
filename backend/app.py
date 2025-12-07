import sqlite3
from flask import Flask, jsonify, request, g
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all domains for development

# Ensure database is always created in the backend directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'canteen.db')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        # Open schema.sql relative to this file
        schema_path = os.path.join(BASE_DIR, 'schema.sql')
        with open(schema_path, mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()
        print("Initialized database.")

@app.route('/')
def home():
    return jsonify({"message": "Canteen API is running"})

# --- Menu Routes ---
@app.route('/api/menu', methods=['GET'])
def get_menu():
    db = get_db()
    cursor = db.execute('SELECT * FROM menu_items')
    items = [dict(row) for row in cursor.fetchall()]
    return jsonify(items)

@app.route('/api/menu', methods=['POST'])
def add_menu_item():
    # TODO: Add Admin check
    data = request.json
    db = get_db()
    db.execute('INSERT INTO menu_items (name, description, price, category, type, dietary, meal_time, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
               (data.get('name'), data.get('description'), data.get('price'), data.get('category'), 
                data.get('type', 'Food'), data.get('dietary', 'Veg'), data.get('meal_time', 'All'), data.get('image_url')))
    db.commit()
    return jsonify({"message": "Item added"}), 201

@app.route('/api/menu/<int:id>', methods=['DELETE'])
def delete_menu_item(id):
    # TODO: Add Admin check
    db = get_db()
    db.execute('DELETE FROM menu_items WHERE id = ?', (id,))
    db.commit()
    return jsonify({"message": "Item deleted"}), 200

# --- Order Routes ---
@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.json
    user_id = data.get('user_id') # Can be None for guest
    items = data.get('items') # List of {id, quantity, price}
    
    if not items:
        return jsonify({"error": "No items"}), 400

    total_price = sum(item['price'] * item['quantity'] for item in items)
    
    db = get_db()
    cursor = db.execute('INSERT INTO orders (user_id, total_price) VALUES (?, ?)', (user_id, total_price))
    order_id = cursor.lastrowid
    
    for item in items:
        db.execute('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                   (order_id, item['id'], item['quantity'], item['price']))
    
    db.commit()
    return jsonify({"message": "Order placed", "order_id": order_id}), 201

@app.route('/api/orders', methods=['GET'])
def get_orders():
    # TODO: Add Admin check
    db = get_db()
    cursor = db.execute('''
        SELECT o.id, o.total_price, o.status, o.created_at, u.username 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    ''')
    orders = [dict(row) for row in cursor.fetchall()]
    
    for order in orders:
        items_cursor = db.execute('''
            SELECT m.name, oi.quantity, oi.price
            FROM order_items oi
            JOIN menu_items m ON oi.menu_item_id = m.id
            WHERE oi.order_id = ?
        ''', (order['id'],))
        order['items'] = [dict(row) for row in items_cursor.fetchall()]
        
    return jsonify(orders)

@app.route('/api/orders/<int:id>', methods=['PUT'])
def update_order_status(id):
    data = request.json
    status = data.get('status')
    db = get_db()
    db.execute('UPDATE orders SET status = ? WHERE id = ?', (status, id))
    db.commit()
    return jsonify({"message": "Order updated"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    
    if user and user['password'] == password: # Plain text for demo
        return jsonify({"message": "Login successful", "user": {"id": user["id"], "username": user["username"], "role": user["role"]}})
    
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        init_db()
    app.run(debug=True, port=5000)
