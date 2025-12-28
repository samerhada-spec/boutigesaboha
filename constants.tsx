
import { Product, HeroSettings, AppearanceSettings } from './types';

export const BRAND_LOGO_SVG = (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="#a6314a" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="42" stroke="#a6314a" strokeWidth="0.5" opacity="0.5" />
    <path d="M48 30C48 30 52 22 58 25C64 28 62 35 58 38C54 41 50 45 50 50V70" stroke="#a6314a" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 35C53 35 56 38 56 42C56 46 53 50 50 50C47 50 44 46 44 42C44 38 47 35 50 35Z" stroke="#a6314a" strokeWidth="1" />
  </svg>
);

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'سيروم فيتامين سي المطور',
    description: 'سيروم مركز يحتوي على حمض الهيالورونيك وفيتامين سي لتفتيح البشرة ومحاربة علامات الشيخوخة وإعادة النضارة الفورية.',
    price: 180,
    originalPrice: 220,
    category: 'عناية بالبشرة',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800',
    createdAt: Date.now(),
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    reviews: []
  },
  {
    id: '2',
    name: 'أحمر شفاه كلاسيك - صبوحة',
    description: 'تركيبة تدوم طويلاً مع ترطيب عميق وألوان جذابة تناسب جميع المناسبات الرسمية واليومية.',
    price: 95,
    category: 'مكياج',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=800',
    createdAt: Date.now(),
    isNew: true,
    rating: 4.9,
    reviews: []
  },
  {
    id: '3',
    name: 'عطر الورد الدمشقي الفاخر',
    description: 'مزيج ساحر من أزهار الورد الطبيعية مع لمسة من المسك الأصيل وخشب الصندل لثبات يدوم طويلاً.',
    price: 250,
    originalPrice: 320,
    category: 'عطور',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    createdAt: Date.now(),
    isFeatured: true,
    rating: 5.0,
    reviews: []
  },
  {
    id: '4',
    name: 'ماسك الشعر بخلاصة الأرجان',
    description: 'علاج مكثف لإصلاح الشعر التالف وزيادة اللمعان والنعومة من الاستخدام الأول.',
    price: 120,
    category: 'عناية بالشعر',
    image: 'https://images.unsplash.com/photo-1527799822367-3188572f481b?q=80&w=800',
    createdAt: Date.now(),
    rating: 4.7,
    reviews: []
  },
  {
    id: '5',
    name: 'كريم العين المجدد للهالات',
    description: 'يقلل من ظهور الهالات السوداء والانتفاخات تحت العين بفضل الكافيين والشاي الأخضر.',
    price: 145,
    category: 'عناية بالبشرة',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800',
    createdAt: Date.now(),
    rating: 4.6,
    reviews: []
  }
];

export const INITIAL_HERO_SETTINGS: HeroSettings = {
  welcomeText: 'عالم صبوحة الوردي',
  title: 'إشراقة وردية دائمة',
  subtitle: 'Sabouha Signature Collection',
  description: 'اكتشفي سر الجمال الطبيعي مع مجموعتنا المختارة من أرقى منتجات العناية، المصممة خصيصاً لتناسب رقة بشرتكِ وتبرز أنوثتكِ.',
  // صورة زهرية فاخرة مطابقة لطلب المستخدم
  image: 'https://images.unsplash.com/photo-1596462502278-27bfad45f062?q=80&w=2000',
  layout: 'background',
  textAlignment: 'right',
  overlayOpacity: 0.5
};

export const INITIAL_APPEARANCE: AppearanceSettings = {
  siteBackground: '#fdf2f4',
  featuredSectionBg: 'rgba(255, 255, 255, 0.45)',
  shopPageBg: 'rgba(255, 255, 255, 0.5)',
  glassOpacity: 0.45,
  enableAnimatedBg: true,
  siteName: 'بوتيك صبوحة'
};

export const CATEGORIES = ['الكل', 'عناية بالبشرة', 'مكياج', 'عطور', 'عناية بالشعر', 'أدوات تجميل'];

export const THEME = {
  background: '#fdf2f4',
  primary: '#a6314a',
  secondary: '#d4af37',
  text: '#1a1a1a',
};

export const CONTACT_INFO = {
  address: 'فلسطين، قلقيلية - شارع نابلس الرئيسي',
  phone: '+970 599 766 630',
  facebook: 'https://www.facebook.com/people/%D8%A8%D9%88%D8%20%D8%AA%D9%8A%D9%83-%D8%B5%D8%A8%D9%88%D8%AD%D8%A9/100058747969334/',
  instagram: 'https://www.instagram.com/sabouha_boutique/',
  email: 'sabouha.boutique@gmail.com'
};
