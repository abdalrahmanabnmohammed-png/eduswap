import React, { useState } from 'react';
import { 
  Search, Plus, MessageCircle, Book, User, MapPin, 
  Camera, X, Send, ArrowRight, Filter, 
  CheckCircle2, Sparkles, GraduationCap, Bot, Loader2, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Gemini API Configuration ---
const apiKey = ""; // ضع مفتاح الـ API الخاص بك هنا

const callGemini = async (prompt, systemInstruction = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أستطع معالجة الطلب.";
  } catch (err) {
    return "خطأ في الاتصال بالذكاء الاصطناعي.";
  }
};

export default function App() {
  const [view, setView] = useState('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiChat, setAiChat] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  
  const [books, setBooks] = useState([
    { id: 1, title: "كيمياء عامة 101", university: "الجامعة الأردنية", price: "5", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600", seller: "أحمد", description: "كتاب نظيف جداً." },
    { id: 2, title: "فيزياء طبية - دوسية", university: "جامعة العلوم والتكنولوجيا", price: "0", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600", seller: "سارة", description: "للمبادلة بكتاب كيمياء." }
  ]);

  const [form, setForm] = useState({ title: '', description: '', price: '', university: 'الجامعة الأردنية' });

  const handleAiImprove = async () => {
    if (!form.title) return;
    setIsAiLoading(true);
    const res = await callGemini(`حسن وصف هذا الكتاب لبيعه للطلاب الجامعيين: ${form.title}. الوصف الحالي: ${form.description}`, "رد بالعربية فقط.");
    setForm({ ...form, description: res });
    setIsAiLoading(false);
  };

  const handleAiChat = async () => {
    if (!userQuery) return;
    const history = [...aiChat, { role: 'user', text: userQuery }];
    setAiChat(history);
    setUserQuery("");
    setIsAiLoading(true);
    const res = await callGemini(userQuery, "أنت مساعد ذكي لمنصة تبادل كتب جامعية. ساعد الطلاب بالعربية بأسلوب ودود.");
    setAiChat([...history, { role: 'ai', text: res }]);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">EduSwap</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setAiAssistantOpen(true)} className="text-blue-600 bg-blue-50 p-2 rounded-xl hover:bg-blue-100 transition">
            <Bot size={24} />
          </button>
          <button onClick={() => setView('add')} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition">
            بيع كتاب +
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 pb-24">
        {view === 'home' && (
          <div className="space-y-10">
            <div className="text-right space-y-2 py-6">
              <h2 className="text-3xl font-black text-slate-900">سوق الكتب الجامعي الذكي 🎓</h2>
              <p className="text-slate-500">منصة الطلاب الأولى لتبادل المراجع والدوسيات.</p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="ابحث عن مادة، جامعة، أو تخصص..." 
                className="w-full bg-white pr-12 pl-4 py-4 rounded-3xl shadow-sm border-none outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-blue-50/50" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.filter(b => b.title.includes(searchQuery)).map(book => (
                <motion.div whileHover={{ y: -8 }} key={book.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 p-4 transition-all hover:shadow-xl group">
                  <div className="relative mb-4 overflow-hidden rounded-2xl">
                    <img src={book.image} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">{book.university}</div>
                  </div>
                  <h3 className="text-lg font-bold truncate text-slate-800">{book.title}</h3>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold">السعر</span>
                      <span className="text-xl font-black text-blue-600">{book.price === "0" ? "مجاني" : `${book.price} JOD`}</span>
                    </div>
                    <button className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition shadow-lg" onClick={() => setView('chat')}>
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {view === 'add' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white space-y-6">
            <h2 className="text-3xl font-black text-slate-900">نشر عرض جديد ✨</h2>
            <div className="space-y-4">
              <input type="text" placeholder="اسم الكتاب أو الدوسية" className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <div className="flex justify-between items-center px-2">
                <label className="text-xs font-black text-slate-400 uppercase">الوصف</label>
                <button 
                  onClick={handleAiImprove} 
                  className="text-xs text-blue-600 font-black flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
                  disabled={isAiLoading}
                >
                  {isAiLoading ? <Loader2 className="animate-spin" size={14}/> : <Wand2 size={14}/>} تحسين بالذكاء الاصطناعي
                </button>
              </div>
              <textarea rows="4" className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition resize-none" placeholder="اكتب تفاصيل عن الكتاب وحالته..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="السعر" className="bg-slate-50 p-4 rounded-2xl outline-none" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                <select className="bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-600 appearance-none">
                  <option>الجامعة الأردنية</option>
                  <option>جامعة العلوم والتكنولوجيا</option>
                  <option>جامعة اليرموك</option>
                </select>
              </div>
              <button onClick={() => { setBooks([{...form, id: Date.now(), image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", seller: "أنا"}, ...books]); setView('home'); }} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition">نشر الآن</button>
            </div>
          </motion.div>
        )}
      </main>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl h-[550px] flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                <span className="font-black flex items-center gap-2 text-lg"><Bot /> إديو-بوت الذكي ✨</span>
                <button onClick={() => setAiAssistantOpen(false)} className="hover:rotate-90 transition-transform"><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {aiChat.length === 0 && (
                  <div className="text-center py-10 opacity-30">
                    <Sparkles size={48} className="mx-auto mb-2 text-blue-400" />
                    <p className="font-bold">أهلاً بك! اسألني أي شيء عن الكتب أو نصائح دراسية.</p>
                  </div>
                )}
                {aiChat.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm ${m.role === 'ai' ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100' : 'bg-blue-600 text-white rounded-tl-none'}`}>{m.text}</div>
                  </div>
                ))}
                {isAiLoading && <div className="text-xs text-blue-500 font-black animate-pulse">جاري التفكير...</div>}
              </div>
              <div className="p-4 bg-white border-t flex gap-2">
                <input type="text" className="flex-1 bg-slate-100 p-4 rounded-2xl outline-none text-sm" value={userQuery} onChange={e => setUserQuery(e.target.value)} placeholder="اسألني أي شيء..." onKeyPress={e => e.key === 'Enter' && handleAiChat()} />
                <button onClick={handleAiChat} className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 transition active:scale-95"><Send size={20} className="rotate-180" /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Mobile */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl text-white rounded-[2rem] p-4 flex justify-around shadow-2xl z-50">
        <button onClick={() => setView('home')} className={view === 'home' ? 'text-blue-400' : 'text-slate-400'}><Search size={22} /></button>
        <button onClick={() => setView('add')} className={view === 'add' ? 'text-blue-400' : 'text-slate-400'}><Plus size={22} /></button>
        <button onClick={() => setAiAssistantOpen(true)} className="text-blue-400 animate-pulse"><Bot size={22} /></button>
      </div>
    </div>
  );
}
