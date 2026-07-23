
-- คำสั่งลบฐานข้อมูลผู้ใช้ ก่อนสร้างฐานข้อมูลใหม่
DROP TABLE carts;
DROP TABLE users;
DROP TABLE products;



CREATE TYPE user_role AS ENUM('Customer', 'Admin', 'Employee');

-- สร้างฐานข้อมูลผู้ใช้
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  accname VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'Customer',
  startdate DATE NOT NULL,
  createddate DATE NOT NULL,
  createdtime TIME NOT NULL
);


-- การทำระบบ login ใช้ token ในการยืนยันตัวใช้ระบบ
-- Access Token ใช้งานได้แค่ 15 นาที แล้วต้องขอใหม่ ถ้า Refresh Token gdH[ 7 วัน
-- ถ้าครบ 7 วันจะบังคับเข้าสู่ระบบใหม่
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (1,  'wadwadawd', '2026-07-22 11:12:00');



CREATE TYPE product_status AS ENUM('เต็ม', 'มีของ', 'หมด', 'รอการขนส่ง', 'กำลังสั่งซื้อ');

-- สร้างฐานข้อมูล
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  status product_status NOT NULL DEFAULT 'มีของ',
  createdAt TIMESTAMP DEFAULT NOW()
);


-- ตัวอย่างรายการอาหาร
INSERT INTO products ("name", "quantity", "price") VALUES
  ('ขนมปังโฮลวีท', 30, 45.00),
  ('ครัวซองต์เนย', 25, 55.00),
  ('ขนมปังปอนด์', 40, 35.00),
  ('บาแกตต์ฝรั่งเศส', 20, 65.00),
  ('ขนมปังโชกุปัง', 35, 60.00),
  ('เดนิชไส้ครีม', 20, 50.00),
  ('ขนมปังไส้กรอก', 45, 30.00),
  ('ขนมปังเนยสด', 50, 25.00),
  ('เบเกิลงาดำ', 25, 40.00),
  ('ขนมปังชาบาต้า', 20, 48.00),
  ('ขนมปังหน้าหมูหยอง', 30, 35.00),
  ('ขนมปังกระเทียม', 40, 28.00);



TRUNCATE TABLE carts;

-- รายการตะกร้าของผู้ใช้  ชั่วคราว
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW()
);

INSERT INTO carts (userId) VALUES (1);



-- รายการสินค้าในตะกร้าของผู้ใช้  ชั่วคราว
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cardId INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  productId INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE (cardId, productId) -- สินค้าเดียวกันซ้ำใน cart ไม่ได้ ถ้าเพิ่มอีกให้ update quantity แทน
);

-- รายการคำสั่งซื้อของผู้ใช้ (กดสั่งแล้ว)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  /*
    status สถานะคำสั่งซื้อ
    1.pending = กดสั่งแล้วรอชำระเงิน
    2.paid = ชำระเงินแล้ว
    3.packing = รอ
    4.shipped = ส่งเรียบร้อย
    5.complete = เสร็จสิ้น
  */
  totalPrice NUMERIC(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- รายการสินค้าของคำสั่งซื้อ
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  orderId INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  productId INT NOT NULL REFERENCES products(id),
  productName VARCHAR(255) NOT NULL, -- เก็บชื่อไว้ ณ ตอนที่สั่งของเผื่อมีการอัพเดตชื่อแล้วชื่อจะไม่เปลี่ยน
  priceAtOrder NUMERIC(10, 2) NOT NULL, -- อิงราคาตอนสั่งของ เผื่อราคาเพิ่มขึ้นตอนลูกค้าสั่งไปแล้ว เผื่่อส่วนลดต่างๆ
  quantity INT NOT NULL CHECK (quantity > 0)
);