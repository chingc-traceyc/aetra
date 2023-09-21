-- Use the 'aetra' database
\c aetra;

-- Create the 'products' table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) UNIQUE,
    description TEXT,
    price NUMERIC,
    weight SMALLINT,
    image_url TEXT
);

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    email VARCHAR(250) UNIQUE
);

-- Create the 'carts' table
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    cookie_id INTEGER
);

-- Create the 'cart_items' table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id),
    product_id INTEGER REFERENCES products(id),
    quantity SMALLINT DEFAULT 1
);

-- -- Create the 'orders' table
-- CREATE TABLE IF NOT EXISTS orders (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id),
--     date TIMESTAMP,
--     amount INTEGER,
--     total NUMERIC
-- );

-- -- Create the 'order_items' table
-- CREATE TABLE IF NOT EXISTS orders_items (
--     id SERIAL PRIMARY KEY,
--     order_id INTEGER REFERENCES orders(id),
--     product_id INTEGER REFERENCES products(id),
--     quantity SMALLINT DEFAULT 1
-- );
