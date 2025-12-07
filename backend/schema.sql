
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' -- 'admin' or 'student'
);

CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Food', -- 'Food' or 'Drink'
    dietary TEXT NOT NULL DEFAULT 'Veg', -- 'Veg' or 'Non-Veg'
    meal_time TEXT NOT NULL DEFAULT 'All', -- 'Breakfast', 'Lunch', 'All'
    image_url TEXT,
    is_available BOOLEAN DEFAULT 1
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL, -- Price at time of order
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
);

-- Seed initial admin user (password: admin123)
-- In a real app, passwords should be hashed. For this MVP, we'll store plain or simple hash if using werkzeug.
-- Let's stick to simple plain text for this demo unless requested otherwise, or simple hash. 
-- Actually, let's use werkzeug.security generate_password_hash later in the app.
-- For the seed, I'll just leave it empty and create via app logic or just insert a placeholder.
INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
INSERT INTO users (username, password, role) VALUES ('student', 'student123', 'student');

-- Seed menu items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES 
('Burger', 'Cheesy veg burger', 50.0, 'Snacks', 'https://placehold.co/200x200?text=Burger'),
('Pizza', 'Small Margheritta', 120.0, 'Main', 'https://placehold.co/200x200?text=Pizza'),
('Coke', 'Chilled 250ml', 20.0, 'Beverage', 'https://placehold.co/200x200?text=Coke');
