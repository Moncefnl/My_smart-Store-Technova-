import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SupportTicket } from '../../types';
import { SUPPORT_KNOWLEDGE_BASE } from '../../data/mockData';
import {
  X,
  Headphones,
  LifeBuoy,
  MessageSquare,
  Send,
  Sparkles,
  Search,
  BookOpen,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bot
} from 'lucide-react';

export const SupportTicketsModal: React.FC = () => {
  const {
    isSupportModalOpen,
    setIsSupportModalOpen,
    supportTickets,
    addSupportTicket,
    addSupportMessage,
    currentUser,
    showNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<'tickets' | 'new_ticket' | 'knowledge'>('tickets');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    supportTickets[0]?.id || null
  );

  // New ticket form
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('shipping');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('medium');
  const [newMessage, setNewMessage] = useState('');

  // Active chat reply
  const [replyText, setReplyText] = useState('');

  // Search knowledge base
  const [searchKb, setSearchKb] = useState('');

  if (!isSupportModalOpen) return null;

  const selectedTicket = supportTickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      showNotification('يرجى كتابة عنوان وتفاصيل التذكرة', 'error');
      return;
    }

    addSupportTicket(
      {
        subject: newSubject,
        category: newCategory,
        status: 'open',
        priority: newPriority,
      },
      newMessage
    );

    setNewSubject('');
    setNewMessage('');
    setActiveTab('tickets');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    const userText = replyText;
    addSupportMessage(selectedTicketId, userText, 'user');
    setReplyText('');

    // Simulate AI smart response
    setTimeout(() => {
      let smartReply = 'شكراً لتواصلك! تلقينا استفسارك وسيقوم فريق الدعم بمتابعة الحالة معك خلال دقائق.';
      if (userText.includes('ياليدين') || userText.includes('zr') || userText.includes('شحن')) {
        smartReply = '💡 إجابة ذكية سريعة بخصوص الشحن: يمكنك التأكد من إدخال الـ API Key في قسم الشحن والتوصيل، وستبدأ البوليصات بالتوليد التلقائي لطلباتك.';
      } else if (userText.includes('وهمي') || userText.includes('احتيال')) {
        smartReply = '🛡️ إجابة ذكية: نظام كشف الاحتيال يفحص أرقام الهواتف والقائمة السوداء تلقائياً، يمكنك حظر أي رقم بنقرة واحدة من تقرير الطلب.';
      }
      addSupportMessage(selectedTicketId, smartReply, 'ai_assistant');
    }, 1000);
  };

  const filteredKb = SUPPORT_KNOWLEDGE_BASE.filter(
    (k) =>
      k.title.toLowerCase().includes(searchKb.toLowerCase()) ||
      k.content.toLowerCase().includes(searchKb.toLowerCase()) ||
      k.category.toLowerCase().includes(searchKb.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 p-6 text-white relative">
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  مركز الدعم الفني والمساعدة 7/7
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  تذاكر الدعم والأسئلة الشائعة
                </h2>
              </div>
            </div>

            {/* Sub navigation buttons */}
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-md border border-white/10">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                تذاكري النشطة ({supportTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('new_ticket')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'new_ticket'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                + فتح تذكرة جديدة
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'knowledge'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                قاعدة المعرفة 📚
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex overflow-hidden bg-slate-50">
          {/* Tab 1: Ticket list & Chat */}
          {activeTab === 'tickets' && (
            <div className="flex-1 flex flex-col md:flex-row h-full">
              {/* Left sidebar: list */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-slate-200 bg-white overflow-y-auto divide-y divide-slate-100">
                {supportTickets.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Headphones className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold">لا توجد تذاكر حالياً</p>
                  </div>
                ) : (
                  supportTickets.map((ticket) => {
                    const isSelected = ticket.id === selectedTicketId;
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/80 border-r-4 border-emerald-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ticket.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ticket.status === 'open'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ticket.status === 'resolved' ? 'تم الحل ✅' : 'قيد المعالجة ⏳'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(ticket.updatedAt).toLocaleTimeString('ar-DZ', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate mb-1">
                          {ticket.subject}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {ticket.messages[ticket.messages.length - 1]?.text || 'لا توجد رسائل'}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right panel: Chat messages */}
              <div className="flex-1 flex flex-col h-full bg-slate-50">
                {selectedTicket ? (
                  <>
                    {/* Ticket bar */}
                    <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{selectedTicket.subject}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          تذكرة رقم <span className="font-mono">{selectedTicket.id}</span> • تصنيف:{' '}
                          <span className="font-semibold text-emerald-700">{selectedTicket.category}</span>
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {selectedTicket.status === 'resolved' ? 'محلولة' : 'نشطة'}
                      </span>
                    </div>

                    {/* Messages thread */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {selectedTicket.messages.map((msg) => {
                        const isUser = msg.sender === 'user';
                        const isAI = msg.sender === 'ai_assistant';

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                          >
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1 px-1">
                              {isAI && <Bot className="w-3 h-3 text-emerald-600" />}
                              <span>{msg.senderName}</span>
                              <span>•</span>
                              <span>{new Date(msg.timestamp).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div
                              className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                                isUser
                                  ? 'bg-slate-900 text-white rounded-tr-none'
                                  : isAI
                                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-tl-none font-medium'
                                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat input */}
                    <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="اكتب ردك هنا..."
                        className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                    <p className="text-xs">اختر تذكرة لعرض المحادثة أو افتح تذكرة جديدة</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: New Ticket Form */}
          {activeTab === 'new_ticket' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-2xl mx-auto w-full">
              <form onSubmit={handleCreateTicket} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  إنشاء تذكرة دعم فني جديدة
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الموضوع أو المشكلة</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="مثال: استفسار عن ربط شركة التوصيل ZR Express"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">القسم</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="shipping">الشحن وشركات التوصيل</option>
                      <option value="orders">إدارة الطلبات والـ COD</option>
                      <option value="technical">الدعم التقني والـ Pixels</option>
                      <option value="billing">الاشتراكات والفواتير</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الأولوية</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="low">عادية (Low)</option>
                      <option value="medium">متوسطة (Medium)</option>
                      <option value="high">عاجلة جداً (High)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الاستفسار</label>
                  <textarea
                    required
                    rows={5}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اشرح المشكلة بالتفصيل لنتمكن من مساعدتك بأسرع وقت ممكن..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  إرسال التذكرة لفريق الدعم
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Knowledge Base */}
          {activeTab === 'knowledge' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-w-3xl mx-auto w-full">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                <input
                  type="text"
                  value={searchKb}
                  onChange={(e) => setSearchKb(e.target.value)}
                  placeholder="ابحث في قاعدة المعرفة والأسئلة الشائعة..."
                  className="w-full pl-3 pr-9 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              <div className="space-y-3">
                {filteredKb.map((kb) => (
                  <div key={kb.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {kb.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{kb.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{kb.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
