
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Features from './components/Features';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import AdminDashboard from './components/AdminDashboard';
import OffersSection from './components/OffersSection'; 
import PromoBanner from './components/PromoBanner';
import Cart from './components/Cart';
import { CATEGORIES, INITIAL_HERO_SETTINGS, INITIAL_APPEARANCE, PRODUCTS as DEFAULT_PRODUCTS, CONTACT_INFO } from './constants';
import { Product, HeroSettings, PromoSettings, AppearanceSettings, CartItem, Review, ContactSettings } from './types';
import { dbService } from './services/api';
import { Loader2, ChevronRight, Quote, Heart, ShoppingBag } from 'lucide-react';
import { Button } from './components/ui/Button';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(INITIAL_HERO_SETTINGS);
  const [appearance, setAppearance] = useState<AppearanceSettings>(INITIAL_APPEARANCE);
  const [contact, setContact] = useState<ContactSettings>(CONTACT_INFO);
  const [promoSettings, setPromoSettings] = useState<PromoSettings>({
    enabled: true, title: 'سر الجمال القادم', subtitle: 'اكتشاف جديد قريباً', description: 'ترقبي منتجاً فريداً من نوعه.', badge: 'قريباً', promoImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isManagementMode, setIsManagementMode] = useState(false);

  useEffect(() => {
    // التحقق من وضع الإدارة عبر الرابط بشكل متوافق مع الاستضافات السحابية
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('manage') === 'true') {
      setIsManagementMode(true);
    }

    const init = async () => {
      setIsLoading(true);
      try {
        const [p, h, a, c] = await Promise.all([
          dbService.getProducts(),
          dbService.getHeroSettings(),
          dbService.getAppearance(),
          dbService.getContact()
        ]);
        
        if (!p || p.length === 0) {
          setProducts(DEFAULT_PRODUCTS);
          await dbService.saveProducts(DEFAULT_PRODUCTS);
        } else {
          setProducts(p);
        }

        setHeroSettings(h || INITIAL_HERO_SETTINGS);
        setAppearance(a || INITIAL_APPEARANCE);
        setContact(c || CONTACT_INFO);
        
        const storedPromo = localStorage.getItem('sabouha_promo_v1');
        if (storedPromo) setPromoSettings(JSON.parse(storedPromo));

        const storedCart = localStorage.getItem('sabouha_cart_v1');
        if (storedCart) setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Initial load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('sabouha_cart_v1', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + quantity } : item);
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === productId ? { ...item, cartQuantity: Math.max(1, quantity) } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const totalReviewsCount = useMemo(() => products.reduce((sum, p) => sum + (p.reviews?.length || 0), 0), [products]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.cartQuantity, 0), [cart]);

  const handleUpdateAppearance = async (newA: AppearanceSettings) => {
    setAppearance(prev => ({ ...prev, ...newA }));
    await dbService.saveAppearance({ ...appearance, ...newA });
  };

  const handleUpdateHero = async (newH: HeroSettings) => {
    setHeroSettings(prev => ({ ...prev, ...newH }));
    await dbService.saveHeroSettings({ ...heroSettings, ...newH });
  };

  const handleUpdateContact = async (newC: ContactSettings) => {
    setContact(newC);
    await dbService.saveContact(newC);
  };

  const isOffer = (p: Product) => p.originalPrice ? p.originalPrice > p.price : false;

  const catalogProducts = useMemo(() => {
    let result = products.filter(p => !isOffer(p));
    if (selectedCategory !== 'الكل') result = result.filter(p => p.category === selectedCategory);
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return result;
  }, [selectedCategory, searchQuery, products]);

  const discountedProducts = useMemo(() => {
    return products.filter(p => isOffer(p));
  }, [products]);

  const homeFeaturedProducts = useMemo(() => {
    const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
    return products.filter(p => !isOffer(p)).filter(p => {
      const isNew = (Date.now() - p.createdAt) < FIVE_DAYS;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
      return (isNew || p.isFeatured) && matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fdf2f4]">
      <Loader2 className="animate-spin text-rose-800" size={40} />
    </div>
  );

  if (isManagementMode) {
    return (
      <AdminDashboard 
        products={products} 
        heroSettings={heroSettings}
        promoSettings={promoSettings}
        appearanceSettings={appearance}
        contactSettings={contact}
        onUpdateProducts={async (p) => { setProducts([...p]); await dbService.saveProducts(p); }}
        onUpdateHero={handleUpdateHero}
        onUpdatePromo={(pr) => { setPromoSettings(pr); localStorage.setItem('sabouha_promo_v1', JSON.stringify(pr)); }}
        onUpdateAppearance={handleUpdateAppearance}
        onUpdateContact={handleUpdateContact}
        onClose={() => {
          setIsManagementMode(false);
          // العودة للرئيسية وتصفية الرابط بشكل آمن لمتصفحات GitHub
          navigate('/');
          window.history.replaceState({}, document.title, window.location.pathname);
        }} 
      />
    );
  }

  const PageTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-right mb-12 animate-in fade-in slide-in-from-right duration-700">
      <h1 className="text-5xl font-bold luxury-font text-rose-950 mb-2">{title}</h1>
      {subtitle && <p className="text-stone-500 font-bold text-sm tracking-widest">{subtitle}</p>}
    </div>
  );

  const ProductDetailWrapper = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === id);
    if (!product) return <div className="p-20 text-center">المنتج غير موجود</div>;
    return (
      <ProductDetail 
        product={product} 
        onBack={() => navigate(-1)}
        isWishlisted={wishlist.some(w => w.id === id)}
        onToggleWishlist={(p) => setWishlist(prev => prev.some(w => w.id === p.id) ? prev.filter(w => w.id !== p.id) : [...prev, p])}
        onAddToCart={addToCart}
        onAddReview={async (r) => {
          const updated = products.map(p => p.id === id ? { ...p, reviews: [r, ...(p.reviews || [])] } : p);
          setProducts(updated); await dbService.saveProducts(updated);
        }}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-1000" style={{ backgroundColor: appearance.siteBackground }}>
      <Header 
        onSearch={(term) => { setSearchQuery(term); navigate('/shop'); }} 
        onNavigate={(p) => navigate(p === 'home' ? '/' : `/${p}`)} 
        wishlistCount={wishlist.length} 
        cartCount={cartCount}
        totalReviewsCount={totalReviewsCount}
        siteLogo={appearance.siteLogo}
        siteName={appearance.siteName}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <div className="space-y-0 text-right">
              <Hero settings={heroSettings} onBrowse={() => navigate('/shop')} />
              <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="signature-glass p-8 md:p-16" style={{ backgroundColor: appearance.featuredSectionBg }}>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-2">
                      <h2 className="text-4xl md:text-5xl font-bold luxury-font text-rose-950">كولكشن صبوحة المتميز</h2>
                      <p className="text-stone-600 text-xs font-bold">أحدث المنتجات المختارة بكل حب</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-stone-900 text-white' : 'bg-white/40 border border-white/50 text-stone-700'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {homeFeaturedProducts.length > 0 ? (
                      homeFeaturedProducts.slice(0, 8).map(p => (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          onView={(id) => navigate(`/product/${id}`)} 
                          onAddToCart={addToCart}
                          isWishlisted={wishlist.some(w => w.id === p.id)} 
                          onToggleWishlist={(prod) => setWishlist(prev => prev.some(w => w.id === prod.id) ? prev.filter(w => w.id !== prod.id) : [...prev, prod])} 
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center">
                         <p className="text-stone-400 italic">لا توجد منتجات في هذا القسم حالياً.</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-16 text-center">
                     <Button onClick={() => navigate('/shop')}>مشاهدة الكتالوج كاملاً</Button>
                  </div>
                </div>
              </section>
              <PromoBanner promo={promoSettings} />
              <section className="relative py-32 overflow-hidden group">
                 <div className="absolute inset-0 z-0">
                   <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600" className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110" />
                   <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"></div>
                 </div>
                 <div className="max-w-5_xl mx-auto px-6 relative z-10 text-center">
                    <div className="signature-glass p-10 md:p-20 space-y-10" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <Quote size={60} className="mx-auto text-rose-300/50 mb-4 rotate-180" />
                      <h2 className="text-4xl md:text-6xl font-bold luxury-font leading-[1.3] text-white">"جمالكِ ليس مجرد مظهر، بل هو انعكاس لثقتكِ بنفسكِ."</h2>
                      <p className="text-rose-300 font-bold luxury-font text-3xl italic">— صبوحة —</p>
                    </div>
                 </div>
              </section>
              <Features />
              <OffersSection products={products} onViewProduct={(id) => navigate(`/product/${id}`)} />
            </div>
          } />

          <Route path="/shop" element={
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-12 text-right">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-700 font-bold bg-white/40 px-6 py-3 rounded-full flex-row-reverse transition-transform hover:-translate-x-2">
                <ChevronRight size={20} className="rotate-180" /><span>العودة للرئيسية</span>
              </button>
              <div className="signature-glass p-10 md:p-16" style={{ backgroundColor: appearance.shopPageBg }}>
                <PageTitle title="كتالوج صبوحة" subtitle="Sabouha Full Catalog" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {catalogProducts.length > 0 ? catalogProducts.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onView={(id) => navigate(`/product/${id}`)} 
                      onAddToCart={addToCart}
                      isWishlisted={wishlist.some(w => w.id === p.id)} 
                      onToggleWishlist={(prod) => setWishlist(prev => prev.some(w => w.id === prod.id) ? prev.filter(w => w.id !== prod.id) : [...prev, prod])} 
                    />
                  )) : (
                     <div className="col-span-full py-20 text-center space-y-4">
                       <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto"><ShoppingBag className="text-stone-300" size={32} /></div>
                       <p className="text-stone-400 font-bold">عذراً، لم نجد منتجات تطابق بحثكِ.</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          } />

          <Route path="/offers" element={
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-12 text-right">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-700 font-bold bg-white/40 px-6 py-3 rounded-full flex-row-reverse transition-transform hover:-translate-x-2">
                <ChevronRight size={20} className="rotate-180" /><span>العودة للرئيسية</span>
              </button>
              <div className="signature-glass p-10 md:p-16" style={{ backgroundColor: appearance.shopPageBg }}>
                <PageTitle title="عروض حصرية" subtitle="Exclusive Luxury Deals" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {discountedProducts.length > 0 ? discountedProducts.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onView={(id) => navigate(`/product/${id}`)} 
                      onAddToCart={addToCart}
                      isWishlisted={wishlist.some(w => w.id === p.id)} 
                      onToggleWishlist={(prod) => setWishlist(prev => prev.some(w => w.id === prod.id) ? prev.filter(w => w.id !== prod.id) : [...prev, prod])} 
                    />
                  )) : (
                    <div className="col-span-full py-32 text-center bg-white/30 rounded-[3rem] border border-dashed border-stone-200">
                      <p className="text-stone-500 font-bold text-xl">لا توجد عروض نشطة حالياً. ترقبينا قريباً!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          } />

          <Route path="/wishlist" element={
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-12 text-right">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-700 font-bold bg-white/40 px-6 py-3 rounded-full flex-row-reverse transition-transform hover:-translate-x-2">
                <ChevronRight size={20} className="rotate-180" /><span>العودة للرئيسية</span>
              </button>
              <div className="signature-glass p-10 md:p-16" style={{ backgroundColor: appearance.shopPageBg }}>
                <PageTitle title="قائمة أمنياتكِ" subtitle="Your Luxury Wishlist" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {wishlist.length > 0 ? wishlist.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onView={(id) => navigate(`/product/${id}`)} 
                      onAddToCart={addToCart}
                      isWishlisted={true} 
                      onToggleWishlist={(prod) => setWishlist(prev => prev.filter(w => w.id !== prod.id))} 
                    />
                  )) : (
                    <div className="col-span-full py-32 text-center bg-white/30 rounded-[3rem] border border-dashed border-stone-200 space-y-6">
                      <Heart className="mx-auto text-rose-200" size={60} />
                      <p className="text-stone-500 font-bold text-xl">قائمتكِ فارغة، ابدأي بإضافة المنتجات التي تحبينها!</p>
                      <Button onClick={() => navigate('/shop')}>الذهاب للمتجر</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          } />

          <Route path="/cart" element={
            <Cart 
              items={cart} 
              onUpdateQuantity={updateCartQuantity} 
              onRemove={removeFromCart} 
              onCheckout={() => {
                const message = `مرحباً بوتيك صبوحة، أريد تأكيد طلبي:\n\n` + 
                  cart.map(item => `* ${item.name} (الكمية: ${item.cartQuantity}, السعر: ${item.price} ₪)`).join('\n') +
                  `\n\n*الإجمالي:* ${cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0)} ₪`;
                window.open(`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
              }}
            />
          } />

          <Route path="/product/:id" element={<ProductDetailWrapper />} />
        </Routes>
      </main>

      <Footer contact={contact} siteLogo={appearance.siteLogo} siteName={appearance.siteName} />
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
