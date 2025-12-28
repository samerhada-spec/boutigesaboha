
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  createdAt: number;
  isNew?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviews: Review[];
  colors?: string[];
}

export type Category = 'الكل' | 'عناية بالبشرة' | 'مكياج' | 'عطور' | 'عناية بالشعر' | 'أدوات تجميل';

export interface Review {
  id: string;
  user: string;
  comment?: string;
  rating: number;
  date: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface HeroSettings {
  welcomeText: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  layout: 'background' | 'split';
  textAlignment: 'right' | 'center' | 'left';
  overlayOpacity: number;
}

export interface PromoSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  promoImage?: string;
  productId?: string;
}

export interface AppearanceSettings {
  siteBackground: string;
  featuredSectionBg: string;
  shopPageBg: string;
  glassOpacity: number;
  enableAnimatedBg: boolean;
  siteLogo?: string; // الشعار المرفوع
  siteName: string;
}

export interface ContactSettings {
  address: string;
  phone: string;
  facebook: string;
  instagram: string;
  email: string;
}
