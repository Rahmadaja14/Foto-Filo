import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Sparkles,
  ShoppingBag,
  Star,
  Check,
  Award,
  ChevronRight,
  ShieldCheck,
  Utensils,
  Volume2,
  VolumeX,
  Laptop,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Heart,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SauceJarCanvas from './components/SauceJarCanvas';

// Realistic culinary collage image URLs with fallback styles
const COLLAGE_PHOTOS = [
  {
    title: 'Simmering Charcoal Pot',
    tag: 'SLOW COOKED 12 HRS',
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    desc: 'Whole crushed spices bloomed in grass-fed ghee with sweet vine-ripened tomatoes.'
  },
  {
    title: 'Clay Oven Chicken Skewers',
    tag: 'SMOKED CHAR',
    img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    desc: 'Crispy edges dripping with spiced marinade and fresh chopped cilantro.'
  },
  {
    title: 'Cast Iron Garlic Naan Dip',
    tag: 'VELVETY TEXTURE',
    img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    desc: 'Lush fenugreek cream sauce scooping effortlessly with blistering naan bread.'
  },
  {
    title: 'Street-Side Kadai Fire',
    tag: 'FRESH CHILIS',
    img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    desc: 'Vibrant Kashmiri chilis ground coarsely to release crimson hue and fruity punch.'
  }
];

const RECIPES = [
  {
    id: 'chicken',
    name: 'Classic Smoky Butter Tikka',
    time: '20 mins',
    difficulty: 'Easy',
    servings: '3-4',
    highlight: 'Tender chicken thighs simmered in 1 jar of Bold Tikka Masala with charred onions.',
    tag: 'BESTSELLER'
  },
  {
    id: 'paneer',
    name: 'Charred Paneer & Peppers Kadai',
    time: '15 mins',
    difficulty: 'Super Fast',
    servings: '2-3',
    highlight: 'Golden crisped paneer cubes tossed in rich velvety sauce with blistered peppers.',
    tag: 'VEGETARIAN STAR'
  },
  {
    id: 'wings',
    name: 'Crispy Tikka Glazed Wings',
    time: '30 mins',
    difficulty: 'Party Prep',
    servings: '4-6',
    highlight: 'Air-fried crispy wings tossed directly in warm sauce with toasted sesame and lime.',
    tag: 'CROWD PLEASER'
  },
  {
    id: 'dip',
    name: 'Warm Tikka Fondue / Dip Platter',
    time: '10 mins',
    difficulty: 'Snack',
    servings: '2',
    highlight: 'Sauce warmed with cream cheese and topped with cilantro oil, served with garlic naan fries.',
    tag: 'PARTY HIT'
  }
];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('chicken');
  const [heatLevel, setHeatLevel] = useState(3);
  const [cartCount, setCartCount] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMacView, setIsMacView] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState('pack-3');
  const scrollContainerRef = useRef(null);

  // Synthesize tactile trackpad click / beat sound using Web Audio API
  const playTrackpadClick = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Scroll listener that handles both window scroll and the inner macbook container scroll
  useEffect(() => {
    const handleScroll = () => {
      let currentProgress = 0;
      if (isMacView && scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;
        currentProgress = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        currentProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      }
      setScrollProgress(currentProgress);
    };

    const target = isMacView ? scrollContainerRef.current : window;
    if (target) {
      target.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (target) target.removeEventListener('scroll', handleScroll);
    };
  }, [isMacView]);

  const handleOrder = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4500', '#FF8C00', '#FFD700', '#FFFFFF']
    });
    setIsCartOpen(true);
    playTrackpadClick();
  };

  const PageContent = () => (
    <div className="relative text-slate-900 bg-amber-50/20 selection:bg-orange-500 selection:text-white min-h-screen">
      {/* FIXED 3D BACKGROUND STAGE */}
      {isMacView ? (
        <div className="sticky top-0 left-0 w-full h-[620px] -mb-[620px] pointer-events-none z-10 overflow-hidden">
          <SauceJarCanvas scrollProgress={scrollProgress} isMacView={isMacView} />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          <SauceJarCanvas scrollProgress={scrollProgress} isMacView={false} />
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-orange-600/95 backdrop-blur-md text-white border-b border-orange-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="p-1.5 sm:p-2 bg-yellow-400 text-orange-950 rounded-xl font-black text-lg sm:text-xl tracking-tighter flex items-center shadow-md">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 mr-1 fill-orange-900" /> BOLD
            </span>
            <span className="hidden xl:inline font-extrabold tracking-widest text-xs uppercase text-orange-200">
              Craft Masala Co.
            </span>
          </div>

          <nav className="hidden 2xl:flex items-center space-x-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-100">
            <a href="#flavor" className="hover:text-yellow-300 transition-colors">Flavor Notes</a>
            <a href="#ingredients" className="hover:text-yellow-300 transition-colors">Ingredients</a>
            <a href="#gallery" className="hover:text-yellow-300 transition-colors">Collage</a>
            <a href="#recipes" className="hover:text-yellow-300 transition-colors">Recipes</a>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playTrackpadClick();
              }}
              title="Toggle tactile sound feedback"
              className="p-2.5 rounded-full bg-orange-700 hover:bg-orange-800 text-yellow-300 transition border border-orange-500/50 shadow-inner"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-70" />}
            </button>

            {/* Toggle MacBook View mode */}
            <button
              onClick={() => {
                setIsMacView(!isMacView);
                playTrackpadClick();
              }}
              className="px-3.5 py-2 rounded-full bg-orange-900/80 hover:bg-black text-xs font-black tracking-wider uppercase flex items-center gap-2 border border-orange-500/30 transition shadow-sm"
              title="Switch between fullscreen & MacBook desk recreation"
            >
              <Laptop className="w-4 h-4 text-yellow-400" />
              <span className="hidden sm:inline">{isMacView ? 'Full Screen' : 'MacBook View'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                playTrackpadClick();
              }}
              className="relative px-5 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-orange-950 font-black text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CART ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center z-20 px-4 sm:px-6 max-w-7xl mx-auto py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 font-extrabold text-xs uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              Small Batch Craft Simmer Sauce
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-orange-950 tracking-tight leading-[0.95] uppercase">
              BOLD FLAVOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-amber-500">
                TIKKA MASALA
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-700 max-w-xl font-medium leading-relaxed">
              Real Kashmiri chilis, velvety grass-fed cream, and aromatic roasted fenugreek leaves slow-simmered to culinary perfection. Restaurant quality right in your home pan.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleOrder}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-lg tracking-wide uppercase shadow-2xl hover:shadow-orange-500/40 transform hover:-translate-y-1 transition duration-200 flex items-center gap-3 cursor-pointer"
              >
                <span>Taste The Fire</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <a
                href="#flavor"
                onClick={playTrackpadClick}
                className="px-6 py-4 rounded-2xl bg-white/80 hover:bg-white text-orange-950 font-bold text-base border-2 border-orange-200 shadow-sm hover:shadow transition flex items-center gap-2"
              >
                <span>Explore 3D Profile</span>
              </a>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-3 pt-6 max-w-lg border-t border-orange-200/60">
              <div className="bg-white/80 p-3 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-2xl font-black text-orange-600">100%</div>
                <div className="text-xs font-bold text-stone-500 uppercase">Natural Pure Ghee</div>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-2xl font-black text-orange-600">15 MIN</div>
                <div className="text-xs font-bold text-stone-500 uppercase">Ready Meal Prep</div>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-2xl font-black text-orange-600">4.9 ★</div>
                <div className="text-xs font-bold text-stone-500 uppercase">Over 3,400+ Reviews</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-[380px] lg:h-[550px] relative pointer-events-none flex items-center justify-center">
            {/* Visual spacer where the 3D jar sits in the hero */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-auto">
              <div className="self-end bg-black/75 backdrop-blur-md text-white p-3.5 rounded-2xl text-xs space-y-1 border border-white/20 shadow-xl max-w-[200px]">
                <div className="flex items-center gap-1.5 text-yellow-400 font-black">
                  <Flame className="w-4 h-4 fill-yellow-400" />
                  <span>3D INTERACTIVE</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-tight">
                  Scroll or drag trackpad to rotate and inspect the spicy jar recipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FLAVOR ARCHITECTURE & 3D ROTATION HIGHLIGHT */}
      <section id="flavor" className="relative z-20 py-24 bg-gradient-to-b from-transparent via-amber-100/60 to-orange-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left empty space for 3D jar which swings left on scroll */}
            <div className="lg:col-span-6 h-[400px] lg:h-[500px] relative">
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-orange-200 max-w-xs pointer-events-auto">
                <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">Signature Marinade</span>
                <h4 className="font-black text-slate-900 text-lg">Fire-Roasted Kashmiri Chili</h4>
                <p className="text-xs text-stone-600 mt-1">
                  We use whole pod Kashmiri chilis known worldwide for giving brilliant ruby color with a pleasant warmth and zero harsh acidity.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-600 text-white font-bold text-xs uppercase tracking-widest">
                Flavor Mastery
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight uppercase">
                A Symphony of Sweet Cream, Acidic Plum Tomatoes, and Smoked Spice.
              </h2>

              <p className="text-stone-700 text-lg font-medium leading-relaxed">
                Most store-bought sauces taste flat, overly sweet, and pasty. Ours is cooked in heavy open cauldrons just like Delhi street masters—letting the cumin seeds crackle, ginger puree caramelize, and whole pods infuse each drop.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-white rounded-2xl border border-orange-200/80 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black mb-3">
                    01
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">Kasuri Methi (Fenugreek)</h4>
                  <p className="text-xs text-stone-600 mt-1">Crushed dried fenugreek leaves provide that unmistakable warm herbaceous butter aroma.</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-orange-200/80 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black mb-3">
                    02
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">Small-Batch Grass-Fed Ghee</h4>
                  <p className="text-xs text-stone-600 mt-1">Clarified butter creates a velvety mouthfeel that clings delightfully to meats and breads.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE HEAT METER & INGREDIENT EXPLORER */}
      <section id="ingredients" className="relative z-20 py-24 bg-white border-y border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3 py-1 bg-yellow-400 text-orange-950 font-black rounded-lg text-xs uppercase tracking-widest">
              Interactive Heat Matrix
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase">
              Balanced For Intense Flavor, Not Just Scorching Heat.
            </h2>
            <p className="text-stone-600 font-medium">
              Adjust our spice level slider to see how different aromatic layers balance out the capsaicin punch.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-stone-900 text-white p-8 rounded-3xl shadow-2xl border border-stone-800 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Dialed Heat Level</span>
                <h3 className="text-2xl font-black text-yellow-400">
                  {heatLevel === 1 && 'Level 1: Mild & Golden Velvety'}
                  {heatLevel === 2 && 'Level 2: Medium Hearth Glow'}
                  {heatLevel === 3 && 'Level 3: Bold Original Tikka Masala ★'}
                  {heatLevel === 4 && 'Level 4: Extra Fiery Red Ghost'}
                  {heatLevel === 5 && 'Level 5: Reaper Intensity'}
                </h3>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <Flame
                    key={lvl}
                    className={`w-6 h-6 transition ${
                      lvl <= heatLevel ? 'text-orange-500 fill-orange-500 scale-110' : 'text-stone-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              value={heatLevel}
              onChange={(e) => {
                setHeatLevel(Number(e.target.value));
                playTrackpadClick();
              }}
              className="w-full h-3 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />

            <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 text-sm text-stone-300">
              {heatLevel <= 2 && "Perfect for delicate palates who crave rich cream, roasted garlic, and sweet cumin notes without sweat."}
              {heatLevel === 3 && "Our signature formula. Starts with sweet caramelized tomato and velvety cream, followed by a surging, satisfying spice resonance."}
              {heatLevel >= 4 && "For certified heat-heads! Infused with smoked habanero and crushed pepper flakes for a bold forehead glow."}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PHOTOGRAPHIC COLLAGE GRID (Vibrant visual feast) */}
      <section id="gallery" className="relative z-20 py-24 bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-400">Sensory Feast</span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase text-white mt-2 leading-none">
                Culinary Collage.
              </h2>
            </div>
            <p className="text-stone-400 max-w-md font-medium text-sm">
              From blistered tandoori skewers to thick dips with fresh baked naan. Every drop unlocks a restaurant culinary experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLAGE_PHOTOS.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-orange-500/60 transition-all duration-300 flex flex-col justify-end min-h-[380px] shadow-2xl"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <div className="relative p-6 space-y-2 z-10">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-orange-600 text-[10px] font-black uppercase tracking-wider text-white">
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RECIPE & PAIRING STUDIO */}
      <section id="recipes" className="relative z-20 py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 bg-orange-600 text-white rounded-md text-xs font-black uppercase tracking-widest">
              Quick Kitchen Magic
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mt-3 uppercase">
              1 Jar. Endless Delicacies.
            </h2>
            <p className="text-stone-600 mt-2 font-medium">
              Pick your protein or favorite veggie and let the sauce do all the heavy lifting.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {RECIPES.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => {
                  setActiveTab(recipe.id);
                  playTrackpadClick();
                }}
                className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-wider transition ${
                  activeTab === recipe.id
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-orange-200'
                }`}
              >
                {recipe.name.split(' ')[0]} {recipe.name.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Active Recipe Card */}
          {(() => {
            const current = RECIPES.find((r) => r.id === activeTab);
            return (
              <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border-2 border-orange-200 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="px-3 py-1 bg-yellow-400 text-orange-950 font-black text-xs rounded-md uppercase">
                    {current.tag}
                  </span>
                  <div className="flex items-center gap-4 text-xs font-bold text-stone-600 uppercase">
                    <span>⏱ {current.time}</span>
                    <span>🍽 {current.servings}</span>
                    <span>🔥 {current.difficulty}</span>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-slate-900">{current.name}</h3>
                <p className="text-stone-700 text-base leading-relaxed">{current.highlight}</p>

                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 uppercase font-bold">Quick Instruction</span>
                    <p className="text-sm font-bold text-orange-950">Sear protein 4 mins → Pour whole jar → Simmer 10 mins → Garnish cilantro.</p>
                  </div>
                  <button
                    onClick={handleOrder}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase rounded-xl transition shrink-0"
                  >
                    Grab Jars
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 6. MARKETING CALLOUTS & PRESS REVIEWS */}
      <section className="relative z-20 py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-orange-700/60 border border-orange-500/40 space-y-4">
              <div className="flex text-yellow-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-300" />
                ))}
              </div>
              <p className="text-lg font-bold italic leading-relaxed">
                "Literally rivals the $28 butter chicken plate at my favorite Michelin-guide spot in Manhattan."
              </p>
              <div className="text-xs font-black uppercase tracking-wider text-orange-200">
                — Food & Wine Daily
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-orange-700/60 border border-orange-500/40 space-y-4">
              <div className="flex text-yellow-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-300" />
                ))}
              </div>
              <p className="text-lg font-bold italic leading-relaxed">
                "The 3D presentation alone caught my eye, but the actual aromatic fenugreek fragrance won our entire dinner table."
              </p>
              <div className="text-xs font-black uppercase tracking-wider text-orange-200">
                — Epicurean Digest
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-orange-700/60 border border-orange-500/40 space-y-4">
              <div className="flex text-yellow-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-300" />
                ))}
              </div>
              <p className="text-lg font-bold italic leading-relaxed">
                "Clean label, no added cornstarch, no cheap fillers. Just real spices bloomed properly in grass-fed ghee."
              </p>
              <div className="text-xs font-black uppercase tracking-wider text-orange-200">
                — Craft Pantry Awards (Gold Winner)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PURCHASE & BUNDLE BUILDER */}
      <section id="buy" className="relative z-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 bg-yellow-400 text-orange-950 font-black rounded-lg text-xs uppercase tracking-widest">
              Direct From The Kitchen
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mt-2 uppercase">
              Stock Your Pantry With Fire.
            </h2>
            <p className="text-stone-600 font-medium">Free express insulated shipping on 3+ jars.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 1 Jar */}
            <div
              onClick={() => setSelectedBundle('pack-1')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition ${
                selectedBundle === 'pack-1'
                  ? 'border-orange-600 bg-orange-50/50 shadow-xl'
                  : 'border-stone-200 bg-white hover:border-orange-300'
              }`}
            >
              <span className="text-xs font-bold uppercase text-stone-500">Curious Taster</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Single Jar (375mL)</h3>
              <div className="text-3xl font-black text-orange-600 my-4">$11.99</div>
              <p className="text-xs text-stone-600 mb-6">Enough for 1 large family dinner or meal prep.</p>
              <button
                onClick={handleOrder}
                className="w-full py-3 rounded-xl font-black text-xs uppercase bg-stone-900 hover:bg-orange-600 text-white transition"
              >
                Add To Cart
              </button>
            </div>

            {/* 3 Jars (POPULAR) */}
            <div
              onClick={() => setSelectedBundle('pack-3')}
              className={`p-6 rounded-3xl border-2 relative cursor-pointer transition ${
                selectedBundle === 'pack-3'
                  ? 'border-orange-600 bg-orange-50 shadow-2xl scale-105'
                  : 'border-stone-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                ★ MOST POPULAR (SAVE 15%)
              </div>
              <span className="text-xs font-bold uppercase text-stone-500">Flavor Lover</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Trio Pack (3 Jars)</h3>
              <div className="text-3xl font-black text-orange-600 my-4">
                $29.99 <span className="text-stone-400 line-through text-lg font-normal">$35.97</span>
              </div>
              <p className="text-xs text-stone-600 mb-6">Includes Free Shipping & complimentary recipe booklet.</p>
              <button
                onClick={handleOrder}
                className="w-full py-3 rounded-xl font-black text-xs uppercase bg-orange-600 hover:bg-orange-700 text-white transition shadow-lg"
              >
                Order Trio Pack
              </button>
            </div>

            {/* 6 Jars */}
            <div
              onClick={() => setSelectedBundle('pack-6')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition ${
                selectedBundle === 'pack-6'
                  ? 'border-orange-600 bg-orange-50/50 shadow-xl'
                  : 'border-stone-200 bg-white hover:border-orange-300'
              }`}
            >
              <span className="text-xs font-bold uppercase text-stone-500">Pantry Master</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Chef Case (6 Jars)</h3>
              <div className="text-3xl font-black text-orange-600 my-4">
                $52.99 <span className="text-stone-400 line-through text-lg font-normal">$71.94</span>
              </div>
              <p className="text-xs text-stone-600 mb-6">Best value for weekly curry lovers. Save 25% + Free shipping.</p>
              <button
                onClick={handleOrder}
                className="w-full py-3 rounded-xl font-black text-xs uppercase bg-stone-900 hover:bg-orange-600 text-white transition"
              >
                Stock Up Case
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-orange-500 font-black text-xl">🌶️ BOLD FLAVOR TIKKA MASALA</span>
          </div>
          <p className="text-xs text-stone-500">
            Crafted with passion • Made with Claude Code • 100% Guaranteed Satisfaction
          </p>
          <div className="flex space-x-4 text-xs font-bold uppercase">
            <a href="#" className="hover:text-white">Shipping</a>
            <a href="#" className="hover:text-white">Ingredients</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>

      {/* SLIDE-OVER CART MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 bg-orange-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <h3 className="text-lg font-black uppercase">Your Spicy Cart</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-white hover:text-stone-200 text-xl font-black p-1"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100 items-center">
                  <div className="w-16 h-16 rounded-xl bg-orange-200 flex items-center justify-center text-3xl">
                    🌶️
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-sm">BOLD FLAVOR TIKKA MASALA</h4>
                    <p className="text-xs text-stone-500">Selected: {selectedBundle.toUpperCase()}</p>
                    <div className="font-black text-orange-600 text-sm mt-1">
                      {selectedBundle === 'pack-1' ? '$11.99' : selectedBundle === 'pack-3' ? '$29.99' : '$52.99'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCartCount(Math.max(1, cartCount - 1))}
                      className="p-1 rounded bg-white border border-stone-300 text-stone-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-sm">{cartCount}</span>
                    <button
                      onClick={() => setCartCount(cartCount + 1)}
                      className="p-1 rounded bg-white border border-stone-300 text-stone-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Satisfaction Guarantee
                  </p>
                  <p className="text-amber-800/80">Don't love the sauce? We will refund every penny, no returns needed.</p>
                </div>
              </div>

              <div className="p-6 border-t border-stone-200 space-y-4">
                <div className="flex justify-between font-black text-base text-slate-900">
                  <span>Subtotal</span>
                  <span>
                    $
                    {(
                      (selectedBundle === 'pack-1' ? 11.99 : selectedBundle === 'pack-3' ? 29.99 : 52.99) *
                      cartCount
                    ).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
                    alert('Order confirmed! Simmering your batch right away.');
                    setIsCartOpen(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-base shadow-xl transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // If "MacBook View" is active, render the exact sequence environment:
  // "Maintain a vertical 9:16 high-angle shot focused on a silver MacBook Pro set on a dark desk against a dimly lit room.
  // Overhead text states 'Made with Claude Code.' in white sans-serif lettering.
  // The laptop screen brightly illuminates the foreground, displaying a vivid orange web layout..."
  if (isMacView) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden relative selection:bg-orange-500">
        {/* Overhead text */}
        <div className="mb-4 text-center z-20">
          <span className="text-white/90 text-sm sm:text-base font-sans tracking-wide font-normal">
            Made with Claude Code.
          </span>
        </div>

        {/* 9:16 High Angle Studio Mockup Frame */}
        <div className="relative w-full max-w-[620px] h-[86vh] bg-[#141416] rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-between p-4 sm:p-6">
          {/* Dim ambient room backdrop with high-angle lighting */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c20] via-[#111114] to-[#08080a] pointer-events-none" />

          {/* Laptop Screen Glow onto dark desk */}
          <div className="absolute top-1/4 w-[420px] h-[420px] bg-orange-600/30 blur-[120px] pointer-events-none" />

          {/* Silver MacBook Pro Frame */}
          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center max-h-[88%]">
            {/* Display Bezel */}
            <div className="w-full h-full bg-[#121214] rounded-t-2xl p-2.5 pb-1 border border-stone-600/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col">
              {/* WebCam Notch */}
              <div className="w-2.5 h-2.5 bg-black rounded-full mx-auto mb-1.5 border border-stone-700 flex items-center justify-center shrink-0">
                <div className="w-1 h-1 bg-blue-900 rounded-full" />
              </div>

              {/* The Laptop Screen Container (Scrollable viewport) */}
              <div
                ref={scrollContainerRef}
                className="w-full flex-1 bg-white rounded-lg overflow-y-auto overflow-x-hidden relative shadow-inner scrollbar-thin"
              >
                <PageContent />
              </div>
            </div>

            {/* Silver MacBook Base & Trackpad */}
            <div className="w-[104%] bg-gradient-to-b from-[#d8dce2] via-[#bfc5ce] to-[#9aa1ac] h-24 rounded-b-xl border-t border-stone-300 shadow-2xl relative flex flex-col items-center justify-center px-6 shrink-0">
              {/* Top notch hinge */}
              <div className="w-20 h-1.5 bg-stone-500/70 rounded-full -mt-2 mb-2" />

              {/* MacBook Trackpad */}
              <div
                onClick={playTrackpadClick}
                className="w-36 h-14 bg-gradient-to-b from-[#f0f2f5] to-[#d6dadf] rounded-lg border border-stone-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer active:scale-[0.98] transition group"
                title="Simulate trackpad tactile click"
              >
                <span className="text-[10px] text-stone-600 font-mono tracking-tighter opacity-80 group-hover:opacity-100 flex items-center gap-1">
                  Trackpad (Scroll / Click)
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="relative z-30 mt-3 flex items-center gap-3">
            <button
              onClick={() => setIsMacView(false)}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider backdrop-blur-md border border-white/20 flex items-center gap-2 transition"
            >
              <Minimize2 className="w-4 h-4 text-yellow-400" />
              <span>Full Screen View</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen Web experience
  return <PageContent />;
}
