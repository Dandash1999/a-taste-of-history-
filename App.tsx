
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Menu, X, Map, Info, Book, User, ArrowUp, Loader2, Sparkles, Globe } from 'lucide-react';

// --- TYPES ---
interface FoodSection {
  id: string;
  title: string;
  country: string;
  image: string;
  didYouKnow?: string;
  history: string[];
  significance: string[];
  variations?: {
    title: string;
    content: string[];
  };
  captions: string[];
}

interface BookContent {
  title: string;
  subtitle: string;
  author: string;
  introduction: string[];
  sections: FoodSection[];
  aboutBook: string;
  aboutAuthor: string;
}

// --- FULL BOOK CONTENT ---
const BOOK_DATA: BookContent = {
  title: "A TASTE OF HISTORY",
  subtitle: "The Stories Behind Famous Foods",
  author: "Maryam M. Mahmoud",
  introduction: [
    "Food is more than nourishment; it is a reflection of history, culture, and identity. This book explores the origins and cultural significance of traditional foods from different countries around the world.",
    "The objective of this book is to educate readers about the historical background and cultural importance of well-known dishes, while encouraging a deeper appreciation of global food traditions.",
    "Each section focuses on a specific country and its traditional food, providing information about its origin, historical development, cultural role, and global influence."
  ],
  sections: [
    {
      id: "um-ali",
      title: "UM ALI",
      country: "EGYPT",
      image: "Professional documentary photography of an Egyptian cook presenting a steaming bowl of Om Ali in a traditional terracotta pot, served with coconut, raisins, and nuts.",
      didYouKnow: "Many traditional foods, including Um Ali, do not have a single documented inventor. Their histories are passed down through generations.",
      history: [
        "Um Ali is a very famous traditional Egyptian dessert resembling a bread pudding. The dessert's name translates to 'Mother of Ali' in Arabic.",
        "The popularity behind it is associated with the Mamluk dynasty of the 13th century. It is linked to Um Ali, the first wife of Sultan Izz al-Din Aybak, in celebration of the death of Shajar al-Durr.",
        "This dish remains a great representation of how food and history are closely linked through oral tradition."
      ],
      significance: [
        "Um Ali is a very important part of Egyptian culture, strongly connected to celebrations like Ramadan.",
        "It is linked to hospitality and is usually prepared warm for family gatherings where food represents generosity."
      ],
      captions: ["An Egyptian cook presents a steaming bowl of Om Ali in a traditional terracotta pot."]
    },
    {
      id: "pizza-margherita",
      title: "PIZZA MARGHERITA",
      country: "ITALY",
      image: "Cinematic close-up of a steaming hot Margherita pizza fresh from a traditional wood-fired brick oven, bright red tomato sauce, white mozzarella, and green basil.",
      history: [
        "Pizza Margherita originated in Naples, Italy and is one of the oldest, most popular types of pizza.",
        "In 1889, a pizza maker called Raffaele Esposito prepared a pizza in honor of Queen Margherita, representing the colors of the Italian flag: red, white, and green.",
        "It helped build pizza as a cultural symbol in Italy and eventually around the world."
      ],
      significance: [
        "UNESCO recognized Neapolitan Pizza Making as part of the intangible cultural heritage in 2017.",
        "It represents simplicity, quality ingredients, and traditional methods passed down through many generations."
      ],
      variations: {
        title: "Regional Variations",
        content: [
          "Neapolitan-style is soft and tender, focusing on regional ingredients like buffalo mozzarella.",
          "Roman-style pizza is generally thinner and crispier, often sold by the slice."
        ]
      },
      captions: ["A steaming hot Margherita pizza fresh from the traditional wood-fired brick oven."]
    },
    {
      id: "croissant",
      title: "CROISSANT",
      country: "FRANCE",
      image: "Professional chef serving a steaming, flaky golden-brown croissant in a Paris bistro, warm morning light.",
      history: [
        "The croissant is a light, flaky pastry made through lamination. While connected to France, it originates from the Austrian 'kipferl'.",
        "French bakers refined the recipe in the 18th century using advanced techniques and high-quality butter.",
        "By the 20th century, it became the quintessential symbol of French bakery culture."
      ],
      significance: [
        "Croissants are an essential part of French daily life, typically paired with morning coffee.",
        "The preparation requires immense precision and skill, highlighting the standards of French cuisine."
      ],
      captions: ["A chef serves a steaming croissant in a classic Paris bistro."]
    },
    {
      id: "sushi",
      title: "SUSHI",
      country: "JAPAN",
      image: "Japanese woman in a traditional kimono offering a ceramic platter of assorted fresh sushi, soft natural lighting.",
      history: [
        "Sushi began as 'narezushi', a method of preserving fish with fermented rice in Southeast Asia.",
        "In the 19th century, 'Edomae sushi' was created in Tokyo as a quick fast food item for urban workers.",
        "It evolved from a preservation technique into a highly refined culinary art form."
      ],
      significance: [
        "Sushi represents Japanese values: simplicity, balance, and respect for seasonal ingredients.",
        "Sushi masters (Shokunin) spend years training to master fish selection and rice seasoning."
      ],
      variations: {
        title: "Modern Challenges",
        content: [
          "Global popularity has led to concerns about overfishing, specifically for certain tuna stocks.",
          "Sustainability guidebooks now help consumers choose options that support healthy ecosystems."
        ]
      },
      captions: ["A platter of masterfully prepared sushi represents the balance of Japanese cuisine."]
    },
    {
      id: "couscous",
      title: "COUSCOUS",
      country: "MOROCCO",
      image: "Moroccan women gathering in a traditional kitchen to prepare a large platter of steaming couscous.",
      history: [
        "Couscous is a North African staple made from semolina, traditionally steamed multiple times for a fluffy texture.",
        "Its history is tied to the Berber (Amazigh) people, with roots dating back to at least the 9th century.",
        "It has transformed from a local product to a national symbol of Moroccan identity."
      ],
      significance: [
        "Traditionally eaten on Fridays after midday prayers, it symbolizes family and community bonds.",
        "UNESCO recognized couscous in 2020 as part of the Intangible Cultural Heritage of Humanity."
      ],
      variations: {
        title: "Communal Traditions",
        content: [
          "Preparation is often a communal effort involving multiple family members working together.",
          "Serving couscous is a primary sign of hospitality and generosity in Moroccan culture."
        ]
      },
      captions: ["Moroccan women prepare a communal platter of traditional couscous."]
    },
    {
      id: "biryani",
      title: "BIRYANI",
      country: "INDIA",
      image: "A woman in traditional Indian attire preparing a large copper pot of aromatic biryani with steam and spices.",
      history: [
        "Biryani consists of layers of fragrant basmati rice and meat, slow-cooked to combine flavors.",
        "It evolved from Persian rice dishes brought to India by the Mughal Empire in the 16th century.",
        "Traditionally prepared in royal kitchens, it remains associated with status and celebration."
      ],
      significance: [
        "Biryani is the centerpiece of Indian weddings, festivals, and major family events.",
        "Diverse regional styles exist, such as the spicy Hyderabadi and aromatic Lucknowi versions."
      ],
      variations: {
        title: "The Mughal Influence",
        content: [
          "The 'dum' (slow-steaming) method is a hallmark of authentic Mughal-style biryani.",
          "Regional communities adopted these methods, blending them with local spices and ingredients."
        ]
      },
      captions: ["A home kitchen scene showing the aromatic final touches of a traditional biryani."]
    },
    {
      id: "hummus",
      title: "HUMMUS",
      country: "LEBANON",
      image: "Close-up of a traditional bowl of Lebanese Hummus with olive oil, chickpeas, and pine nuts.",
      history: [
        "Hummus is a Middle Eastern dip made of chickpeas, tahini, lemon, and garlic.",
        "While its origins are ancient, Lebanon is widely recognized for its deep cultural connection to the dish.",
        "It is mentioned in medieval Arabic sources, showing its centuries-long presence in the region."
      ],
      significance: [
        "It is an essential part of 'mezze', a style of dining focused on social interaction and sharing.",
        "Offering hummus is a gesture of warmth and welcome in Lebanese culture."
      ],
      captions: ["A traditional bowl of Lebanese hummus prepared for a communal meal."]
    },
    {
      id: "paella",
      title: "PAELLA",
      country: "SPAIN",
      image: "Large seafood paella in a traditional wide pan, Valencian countryside background, steam rising.",
      history: [
        "Paella originated in the fields of Valencia, cooked outdoors by farmers over open fires.",
        "The name comes from 'patella', the Latin word for a shallow pan.",
        "Saffron is the key ingredient that provides its iconic golden color and earthy aroma."
      ],
      significance: [
        "It is the ultimate communal meal in Spain, traditionally enjoyed with family on weekends.",
        "It represents regional pride and has become a global icon of Spanish cuisine."
      ],
      captions: ["A traditional Valencian seafood paella represents the heart of Spanish shared dining."]
    },
    {
      id: "tacos",
      title: "TACOS",
      country: "MEXICO",
      image: "Mexican chef grilling meat for tacos in a vibrant street market, fresh tortillas and salsa.",
      history: [
        "Tacos originated in ancient Mexico; native peoples used corn tortillas as wraps long before colonization.",
        "The word 'taco' originally referred to explosives used in 18th-century silver mines.",
        "It is one of the oldest and most versatile food traditions in North America."
      ],
      significance: [
        "Tacos are central to Mexican identity, enjoyed by everyone from street stalls to high-end tables.",
        "They reflect geographic diversity through regional fillings like fish (Baja) or pork (Central)."
      ],
      captions: ["An authentic street food scene showing the artisanal preparation of Mexican tacos."]
    },
    {
      id: "dumplings",
      title: "DUMPLINGS (JIAOZI)",
      country: "CHINA",
      image: "Chinese chefs hand-folding fresh jiaozi dumplings in a traditional kitchen with bamboo baskets.",
      history: [
        "Jiaozi are wheat-dough dumplings that have been part of Chinese cuisine for at least 1,800 years.",
        "Legend attributes them to Zhang Zhongjing, a doctor who created them to cure frostbite.",
        "They are traditionally shaped like ancient silver ingots to symbolize wealth."
      ],
      significance: [
        "Making dumplings is a core family activity during the Chinese New Year, symbolizing unity.",
        "The act of folding them together is as important as the meal itself for passing down traditions."
      ],
      captions: ["Skilled hands folding jiaozi dumplings, a tradition spanning nearly two millennia."]
    }
  ],
  aboutBook: "This book explores the history and cultural significance of traditional foods from around the world. It shows how food reflects identity, tradition, and historical influence across different cultures.",
  aboutAuthor: "Maryam Mohamed is an IB MYP 5 student with a strong interest in history and culture. This book is the result of her passion for exploring global traditions through food."
};

// --- COMPONENTS ---

const GenerativeImage: React.FC<{ prompt: string; alt: string; className?: string }> = ({ prompt, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        const apiKey = (window as any).process?.env?.API_KEY;
        if (!apiKey) throw new Error("API Key Missing");

        const ai = new GoogleGenAI({ apiKey });
        const enhancedPrompt = `A high-definition documentary-style photograph for a travel book. ${prompt}. Soft natural lighting, 4k resolution.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: enhancedPrompt }] },
        });

        if (isMounted) {
          const parts = response.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData) {
              setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [prompt]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-stone-200 animate-pulse rounded-lg ${className}`}>
        <Loader2 className="w-8 h-8 text-amber-700 animate-spin mb-2" />
        <p className="text-[10px] font-cinzel text-amber-800/40 uppercase tracking-widest">Consulting Archives...</p>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-stone-300 text-stone-500 rounded-lg ${className}`}>
        <Info size={24} className="mb-2 opacity-30" />
        <span className="text-[10px] italic font-serif opacity-50 text-center px-4">Visual archive unavailable (API Key Required)</span>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-xl">
      <img src={imageUrl} alt={alt} className={`${className} object-cover`} />
    </div>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cover');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      const scrollY = mainRef.current.scrollTop;
      const sections = ['cover', 'intro', ...BOOK_DATA.sections.map(s => s.id), 'about'];
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom >= 300) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    const container = mainRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#1c1917] overflow-hidden font-serif">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 border-r border-amber-900/10 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0 md:relative md:shrink-0 flex flex-col`}>
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-xl font-cinzel font-bold text-amber-500 uppercase tracking-widest mb-8">
            Taste of History
          </h2>
          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
            <button onClick={() => scrollTo('cover')} className={`w-full text-left px-4 py-2 rounded text-xs font-cinzel uppercase tracking-widest ${activeSection === 'cover' ? 'text-amber-200 bg-amber-900/20' : 'text-stone-500 hover:text-stone-300'}`}>Cover</button>
            <button onClick={() => scrollTo('intro')} className={`w-full text-left px-4 py-2 rounded text-xs font-cinzel uppercase tracking-widest ${activeSection === 'intro' ? 'text-amber-200 bg-amber-900/20' : 'text-stone-500 hover:text-stone-300'}`}>Preface</button>
            <div className="py-4 text-[10px] font-cinzel text-stone-600 uppercase tracking-[0.3em] pl-4">Chapters</div>
            {BOOK_DATA.sections.map((s, i) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className={`w-full text-left px-4 py-2 rounded text-sm ${activeSection === s.id ? 'text-amber-100 bg-amber-900/20' : 'text-stone-400 hover:text-stone-200'}`}>
                {String(i+1).padStart(2, '0')}. {s.title}
              </button>
            ))}
            <button onClick={() => scrollTo('about')} className={`w-full text-left px-4 py-2 rounded text-xs font-cinzel uppercase tracking-widest mt-4 ${activeSection === 'about' ? 'text-amber-200 bg-amber-900/20' : 'text-stone-500 hover:text-stone-300'}`}>Author</button>
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden fixed top-4 right-4 z-[60] bg-amber-900 p-3 rounded-full text-amber-100 shadow-2xl transition-transform active:scale-90">
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto paper-bg relative">
        
        {/* COVER SECTION */}
        <section id="cover" className="min-h-screen leather-bg flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-[#f4e4bc] border-[12px] border-amber-950 p-10 md:p-20 text-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative">
            <div className="absolute inset-4 border border-amber-900/10"></div>
            <h1 className="text-4xl md:text-7xl font-cinzel font-black text-amber-950 mb-4">{BOOK_DATA.title}</h1>
            <p className="text-lg md:text-2xl italic text-amber-800 mb-12">{BOOK_DATA.subtitle}</p>
            <GenerativeImage prompt="A spice-colored global map made of grains and spices, classical oil painting style." alt="Cover" className="w-full aspect-[4/3] max-w-sm mx-auto mb-12" />
            <p className="text-xs font-cinzel text-amber-900 tracking-[0.4em] uppercase mb-1">Authored By</p>
            <p className="text-xl md:text-3xl font-cinzel text-amber-950 font-bold uppercase">{BOOK_DATA.author}</p>
          </div>
        </section>

        {/* PREFACE SECTION */}
        <section id="intro" className="min-h-screen flex items-center justify-center p-8 md:p-32 bg-[#fffcf5]">
          <div className="max-w-xl">
            <h2 className="text-4xl font-cinzel text-amber-950 mb-12 border-b-2 border-amber-900/10 pb-4">Preface</h2>
            <div className="space-y-8 text-xl leading-relaxed text-stone-800">
              {BOOK_DATA.introduction.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* CHAPTER SECTIONS */}
        {BOOK_DATA.sections.map((food, i) => (
          <section key={food.id} id={food.id} className="min-h-screen py-24 px-6 md:px-20 border-b border-stone-200">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-xs font-cinzel text-amber-700 tracking-[0.5em] uppercase font-bold">Chapter {i+1} &bull; {food.country}</span>
                <h2 className="text-4xl md:text-8xl font-cinzel text-amber-950 uppercase mt-2 drop-shadow-sm">{food.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-16 items-start">
                <div className="space-y-8">
                  <GenerativeImage prompt={food.image} alt={food.title} className="w-full aspect-[4/3]" />
                  <p className="text-sm italic text-stone-500 border-l-2 border-amber-200 pl-4">{food.captions[0]}</p>
                  {food.didYouKnow && (
                    <div className="bg-amber-50/80 p-6 rounded-sm border border-amber-100 shadow-sm">
                      <h4 className="font-cinzel text-xs font-black text-amber-900 mb-3 uppercase tracking-widest">Did you know?</h4>
                      <p className="text-stone-700 italic leading-relaxed">"{food.didYouKnow}"</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-cinzel text-amber-900 uppercase tracking-widest flex items-center gap-3">
                      <Book size={20}/> The Origin
                    </h3>
                    <div className="text-stone-700 leading-loose space-y-4 text-lg">
                      {food.history.map((p, j) => <p key={j}>{p}</p>)}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-2xl font-cinzel text-amber-900 uppercase tracking-widest flex items-center gap-3">
                      <Globe size={20}/> Heritage
                    </h3>
                    <div className="text-stone-700 leading-loose space-y-4 text-lg">
                      {food.significance.map((p, j) => <p key={j}>{p}</p>)}
                    </div>
                  </div>
                </div>
              </div>

              {food.variations && (
                <div className="mt-20 p-8 md:p-16 bg-stone-900 text-stone-100 rounded-lg shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Map size={200} />
                  </div>
                  <h3 className="text-3xl font-cinzel text-amber-400 mb-8 uppercase tracking-widest border-b border-stone-800 pb-4">{food.variations.title}</h3>
                  <div className="grid md:grid-cols-2 gap-10 text-stone-300 text-lg leading-relaxed">
                    {food.variations.content.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}

        {/* AUTHOR SECTION */}
        <section id="about" className="min-h-screen py-32 px-6 leather-bg text-stone-100 flex items-center justify-center">
          <div className="max-w-2xl text-center space-y-10">
            <h2 className="text-3xl font-cinzel text-amber-500 uppercase tracking-[0.4em]">The Author</h2>
            <div className="w-20 h-px bg-amber-500/30 mx-auto"></div>
            <p className="text-4xl md:text-6xl font-cinzel text-amber-100 uppercase tracking-widest leading-tight">{BOOK_DATA.author}</p>
            <p className="text-2xl leading-relaxed text-stone-300 italic font-serif">"{BOOK_DATA.aboutAuthor}"</p>
            <div className="pt-20 text-[10px] font-cinzel text-stone-600 uppercase tracking-[0.6em] opacity-50">
              First Digital Edition &bull; 2026
            </div>
          </div>
        </section>

      </main>

      {/* Back to Top */}
      <button 
        onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-amber-950/80 text-amber-100 p-4 rounded-full shadow-2xl backdrop-blur-md hover:bg-amber-900 transition-all hidden md:block border border-amber-500/20"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default App;
