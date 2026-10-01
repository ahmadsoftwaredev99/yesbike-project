import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

dotenv.config();

const users = [
  {
    name: "Yes Bike Admin",
    email: "admin@yesbike.co.za",
    password: "admin123",
    role: "admin",
    phone: "082 535 1244",
  },
];

// const products = [
//   {
//     name: "Biker Pro Leather Suit",
//     description: "Premium full-grain leather riding suit with CE armor and breathable mesh lining.",
//     price: 2499,
//     discountPrice: 2199,
//     category: "Leather Suits",
//     images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80"],
//     stock: 12,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Black", "Brown"],
//     rating: 4.8,
//     featured: true,
//     isNew: true,
//     isBestSeller: true,
//   },
//   {
//     name: "Urban Rider Jacket",
//     description: "Lightweight city jacket with abrasion-resistant fabric and impact protection.",
//     price: 1899,
//     discountPrice: 1699,
//     category: "Jackets",
//     images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80"],
//     stock: 18,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Black", "Navy"],
//     rating: 4.6,
//     featured: true,
//   },
//   {
//     name: "Trail Flex Pants",
//     description: "Durable riding pants with removable knee armor and stretch comfort zones.",
//     price: 1499,
//     category: "Pants",
//     images: ["https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80"],
//     stock: 15,
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     colors: ["Black", "Gray"],
//     rating: 4.5,
//   },
//   {
//     name: "Velocity Full Face Helmet",
//     description: "High-visibility helmet with aerodynamic shell and anti-scratch visor.",
//     price: 2199,
//     discountPrice: 1999,
//     category: "Helmets",
//     images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"],
//     stock: 10,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Matte Black", "White"],
//     rating: 4.9,
//     isBestSeller: true,
//   },
//   {
//     name: "Grip Pro Gloves",
//     description: "Ventilated motorcycle gloves with knuckle protection and secure grip panels.",
//     price: 799,
//     category: "Gloves",
//     images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"],
//     stock: 22,
//     sizes: ["XS", "S", "M", "L", "XL"],
//     colors: ["Black", "Red"],
//     rating: 4.4,
//   },
//   {
//     name: "Summit Touring Boots",
//     description: "Water-resistant riding boots with reinforced toe, ankle support, and slip-out sole.",
//     price: 2299,
//     category: "Boots",
//     images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"],
//     stock: 9,
//     sizes: ["6", "7", "8", "9", "10", "11"],
//     colors: ["Black", "Tan"],
//     rating: 4.7,
//     featured: true,
//   },
//   {
//     name: "AirGuard Chest Protector",
//     description: "Flexible impact armor for chest, ribs, and spine with mesh comfort backing.",
//     price: 1299,
//     category: "Protective Gear",
//     images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"],
//     stock: 14,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Black", "Gray"],
//     rating: 4.6,
//   },
//   {
//     name: "Moto Tool Kit",
//     description: "Essential roadside toolkit with tyre patches, spanner set, and compact carry pouch.",
//     price: 699,
//     category: "Accessories",
//     images: ["https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"],
//     stock: 28,
//     colors: ["Black"],
//     rating: 4.3,
//   },
//   {
//     name: "Circuit Race Suit",
//     description: "Race-inspired suit with stretch panels, ergonomic cut, and premium armor inserts.",
//     price: 2899,
//     category: "Leather Suits",
//     images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"],
//     stock: 8,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Black", "Red"],
//     rating: 4.8,
//     isNew: true,
//   },
//   {
//     name: "Harbor Mesh Jacket",
//     description: "Breathable summer jacket made for long rides and hot-weather comfort.",
//     price: 1699,
//     category: "Jackets",
//     images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80"],
//     stock: 20,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Blue", "Black"],
//     rating: 4.5,
//   },
//   {
//     name: "Ridge Adventure Pants",
//     description: "Adventure fit pants with water-resistant shell and reinforced knee protection.",
//     price: 1799,
//     category: "Pants",
//     images: ["https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80"],
//     stock: 17,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Olive", "Black"],
//     rating: 4.4,
//   },
//   {
//     name: "Apex Street Helmet",
//     description: "Comfort-fit street helmet with quick-release visor and modular ventilation.",
//     price: 1999,
//     category: "Helmets",
//     images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"],
//     stock: 13,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Silver", "Black"],
//     rating: 4.7,
//   },
//   {
//     name: "Torque Grip Gloves",
//     description: "All-weather gloves with extra-padded palms and controlled wrist closure.",
//     price: 899,
//     category: "Gloves",
//     images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"],
//     stock: 24,
//     sizes: ["XS", "S", "M", "L", "XL"],
//     colors: ["Black", "Blue"],
//     rating: 4.4,
//   },
//   {
//     name: "Ridgewalker Boots",
//     description: "Off-road boots with strong ankle support and anti-slip sole traction.",
//     price: 2399,
//     category: "Boots",
//     images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"],
//     stock: 11,
//     sizes: ["7", "8", "9", "10", "11"],
//     colors: ["Black", "Green"],
//     rating: 4.6,
//   },
//   {
//     name: "Impact Back Protector",
//     description: "Slim protective insert designed to reduce back impact during high-speed rides.",
//     price: 1099,
//     category: "Protective Gear",
//     images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"],
//     stock: 16,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Black", "White"],
//     rating: 4.5,
//   },
//   {
//     name: "Adventure Tank Bag",
//     description: "Waterproof tank bag with quick-release mount and weather-sealed zip.",
//     price: 1199,
//     category: "Accessories",
//     images: ["https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"],
//     stock: 18,
//     colors: ["Black", "Orange"],
//     rating: 4.6,
//   },
//   {
//     name: "Night Shift Helmet Visor",
//     description: "Tinted replacement visor designed for night riding and glare reduction.",
//     price: 549,
//     category: "Accessories",
//     images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"],
//     stock: 25,
//     colors: ["Smoke", "Clear"],
//     rating: 4.3,
//   },
//   {
//     name: "Crosswind Beanie",
//     description: "Comfortable thermal beanie that fits under helmets with low-bulk insulation.",
//     price: 399,
//     category: "Accessories",
//     images: ["https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"],
//     stock: 32,
//     colors: ["Black", "Gray"],
//     rating: 4.2,
//   },
//   {
//     name: "Daybreaker Riding Gloves",
//     description: "Lightweight gloves for commuting and city rides with secure palm grip.",
//     price: 749,
//     category: "Gloves",
//     images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"],
//     stock: 26,
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Black", "Yellow"],
//     rating: 4.3,
//   },
// ];

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    // const createdProducts = await Product.create(products);

    const adminUser = createdUsers.find((user) => user.role === "admin");
    // const normalUser = createdUsers.find((user) => user.role === "user");

    console.log(`Admin login -> email: ${adminUser.email}  password: admin123`);
    // console.log(`User login  -> email: ${normalUser.email}  password: rider123`);
    // console.log(`Seeded ${createdUsers.length} users and ${createdProducts.length} products.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed!");
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
