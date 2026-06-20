const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('./models/Product');

const products = [
  // SKINCARE
  { name: 'Rose Hip Face Oil', category: 'Skincare', price: 38, stock: 50,
    description: 'A nourishing face oil rich in antioxidants. Repairs and brightens skin overnight.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Rosehip Oil', 'Vitamin E', 'Omega-6'] },
  { name: 'Vitamin C Brightening Serum', category: 'Skincare', price: 45, stock: 40,
    description: 'Powerful vitamin C serum that fades dark spots. Leaves skin glowing and even-toned.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Vitamin C', 'Niacinamide', 'Hyaluronic Acid'] },
  { name: 'Hydrating Moisturizer', category: 'Skincare', price: 32, stock: 60,
    description: 'Lightweight daily moisturizer with hyaluronic acid. Keeps skin plump all day.',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Hyaluronic Acid', 'Ceramides', 'Aloe Vera'] },
  { name: 'Gentle Foaming Cleanser', category: 'Skincare', price: 28, stock: 55,
    description: 'Soap-free cleanser that removes makeup and impurities. Leaves skin soft and clean.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Glycerin', 'Aloe Vera', 'Green Tea'] },
  { name: 'Retinol Night Cream', category: 'Skincare', price: 52, stock: 35,
    description: 'Anti-aging night cream with retinol and peptides. Reduces fine lines while you sleep.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Retinol', 'Peptides', 'Squalane'] },
  { name: 'SPF 50 Sunscreen', category: 'Skincare', price: 26, stock: 70,
    description: 'Lightweight broad spectrum SPF 50 sunscreen. Non-greasy formula for daily protection.',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Zinc Oxide', 'Vitamin E', 'Niacinamide'] },

  // HAIRCARE
  { name: 'Argan Hair Oil', category: 'Haircare', price: 42, stock: 40,
    description: 'Pure Moroccan argan oil for silky smooth hair. Tames frizz and adds brilliant shine.',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Argan Oil', 'Keratin', 'Vitamin E'] },
  { name: 'Deep Repair Hair Mask', category: 'Haircare', price: 35, stock: 50,
    description: 'Intensive repair mask for damaged hair. Restores moisture and strength in one use.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Keratin', 'Biotin', 'Coconut Oil'] },
  { name: 'Scalp Scrub', category: 'Haircare', price: 29, stock: 40,
    description: 'Exfoliating scalp scrub with sea salt and tea tree. Removes buildup for healthier hair.',
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Sea Salt', 'Tea Tree', 'Peppermint'] },
  { name: 'Curl Defining Cream', category: 'Haircare', price: 33, stock: 45,
    description: 'Defines and enhances natural curls without crunch. Keeps curls bouncy all day long.',
    image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Shea Butter', 'Coconut Oil', 'Flaxseed'] },
  { name: 'Volumizing Shampoo', category: 'Haircare', price: 24, stock: 65,
    description: 'Sulfate-free shampoo that adds body and lift. Perfect for fine or flat hair.',
    image: 'https://images.unsplash.com/photo-1493106641515-5cd81a0be6cf?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Biotin', 'Caffeine', 'Panthenol'] },
  { name: 'Heat Protect Spray', category: 'Haircare', price: 27, stock: 55,
    description: 'Protects hair from heat damage up to 450°F. Lightweight mist with no residue.',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Argan Oil', 'Silk Proteins', 'Vitamin B5'] },

  // MAKEUP
  { name: 'Matte Lipstick Set', category: 'Makeup', price: 36, stock: 60,
    description: 'Long-lasting matte lipstick with rich pigment. Comfortable wear that lasts 8 hours.',
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Jojoba Oil', 'Vitamin E', 'Beeswax'],
    shades: [
      { name: 'Deep Red', hex: '#8B0000' },
      { name: 'Cherry', hex: '#C41E3A' },
      { name: 'Coral Pink', hex: '#FF6B6B' },
      { name: 'Dusty Rose', hex: '#E8A0A0' },
      { name: 'Plum', hex: '#4A0020' },
      { name: 'Terracotta', hex: '#B5451B' },
      { name: 'Baby Pink', hex: '#FF9999' },
      { name: 'Crimson', hex: '#CC2244' }
    ]},
  { name: 'Foundation SPF 15', category: 'Makeup', price: 48, stock: 40,
    description: 'Buildable coverage foundation with SPF 15. Natural finish that lasts all day.',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Hyaluronic Acid', 'SPF 15', 'Niacinamide'],
    shades: [
      { name: 'Ivory', hex: '#FDDBB4' },
      { name: 'Porcelain', hex: '#F5C89A' },
      { name: 'Sand', hex: '#E8A87C' },
      { name: 'Honey', hex: '#D4956A' },
      { name: 'Caramel', hex: '#C47D50' },
      { name: 'Toffee', hex: '#A0623A' },
      { name: 'Espresso', hex: '#7A4530' },
      { name: 'Mahogany', hex: '#5C2E1A' }
    ]},
  { name: 'Eyeshadow Palette', category: 'Makeup', price: 55, stock: 35,
    description: 'Twelve stunning shades from matte to shimmer. Highly pigmented and blendable.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Mica', 'Vitamin E', 'Jojoba Oil'] },
  { name: 'Bronzer & Blush Duo', category: 'Makeup', price: 44, stock: 45,
    description: 'Silky bronzer and blush duo for a sun-kissed glow. Buildable color that looks natural.',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Mica', 'Vitamin C', 'Rose Extract'],
    shades: [
      { name: 'Sun Kiss', hex: '#E8A87C' },
      { name: 'Bronze Glow', hex: '#D4956A' },
      { name: 'Deep Tan', hex: '#C47D50' },
      { name: 'Golden', hex: '#F5C89A' },
      { name: 'Petal', hex: '#FFB6C1' },
      { name: 'Rose Flush', hex: '#FF9AA2' },
      { name: 'Berry Blush', hex: '#E88080' },
      { name: 'Deep Rose', hex: '#C96060' }
    ]},
  { name: 'Mascara Volume Plus', category: 'Makeup', price: 22, stock: 70,
    description: 'Volumizing mascara for dramatic lashes. Lengthens and lifts without clumping.',
    image: 'https://images.unsplash.com/photo-1631214524020-3c69b8b2f19a?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Biotin', 'Vitamin B5', 'Keratin'] },
  { name: 'Makeup Brush Set', category: 'Makeup', price: 38, stock: 50,
    description: 'Professional 12-piece brush set with soft synthetic bristles. Perfect for flawless blending.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Synthetic Bristles', 'Vegan', 'Cruelty-Free'] },

  // BODY CARE
  { name: 'Shea Body Butter', category: 'Body Care', price: 34, stock: 55,
    description: 'Rich whipped shea butter that melts into skin. Deeply moisturizes for 24 hours.',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Shea Butter', 'Cocoa Butter', 'Vitamin E'] },
  { name: 'Coffee Body Scrub', category: 'Body Care', price: 29, stock: 50,
    description: 'Energizing coffee scrub that exfoliates and firms. Leaves skin silky smooth.',
    image: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Coffee', 'Coconut Oil', 'Brown Sugar'] },
  { name: 'Lavender Bath Salts', category: 'Body Care', price: 24, stock: 65,
    description: 'Relaxing bath salts with pure lavender essential oil. Soothes muscles and calms the mind.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Lavender Oil', 'Epsom Salt', 'Dead Sea Salt'] },
  { name: 'Glow Body Oil', category: 'Body Care', price: 46, stock: 40,
    description: 'Fast-absorbing dry oil that leaves skin luminous. Lightweight formula hydrates without grease.',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Jojoba Oil', 'Rosehip', 'Gold Flakes'] },
  { name: 'Exfoliating Body Lotion', category: 'Body Care', price: 31, stock: 55,
    description: 'Daily exfoliating lotion with AHA and shea butter. Smooths and brightens skin texture.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80&auto=format&fit=crop',
    ingredients: ['AHA', 'Shea Butter', 'Glycerin'] },
  { name: 'Rose Body Mist', category: 'Body Care', price: 28, stock: 60,
    description: 'Delicate rose-scented body mist for all-day freshness. Light and feminine fragrance.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80&auto=format&fit=crop',
    ingredients: ['Rose Water', 'Hyaluronic Acid', 'Aloe Vera'] }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    await Product.deleteMany({});
    console.log('Existing products deleted');
    await Product.insertMany(products);
    console.log('Sample products inserted successfully');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
