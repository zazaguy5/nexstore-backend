
-- คำสั่งลบฐานข้อมูลผู้ใช้ ก่อนสร้างฐานข้อมูลใหม่
DROP TABLE users;

-- สร้างฐานข้อมูลผู้ใช้
CREATE TABLE users (
  name VARCHAR(255) NOT NULL,
  accName VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  startDate DATE NOT NULL,
  createdDate DATE NOT NULL,
  createdTime DATE NOT NULL
);

-- สร้างฐานข้อมูล
CREATE TABLE products (
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price FLOAT NOT NULL
);


-- ตัวอย่างรายการอาหาร
INSERT INTO products ("name", "quantity", "price") VALUES
  ('ขนมปังโฮลวีท', 30, 45.00),
  ('ครัวซองต์เนย', 25, 55.00),type Product = {
  id: Number;
  name: String;
  quantity: number;
  price: number;
  [key: string]: any;
}

export function HomePage() {
  const [basket, setBasket] = useState(0);
  const [products, setProducts] = useState<Product>([]);
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <p className="text-lg font-bold">รายการอาหาร</p>
          <div className="w-[80px] flex items-center cursor-pointer">
            <p className="text-lg mr-2">ทั้งหมด</p>
            <img src="/images/down-arrow.png" className="w-[15px] h-[15px]"/>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-x-10 gap-y-4 pr-2 pl-2">
          { products.map((p, index) => productCard(p.title, p.price, p.quantity, () => setBasket(basket + 1))) }
        </div>

        <p className="text-lg font-bold">รายการในตะกร้า: {basket} ชิ้น</p>
      </div>
    </>
  );
}
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
