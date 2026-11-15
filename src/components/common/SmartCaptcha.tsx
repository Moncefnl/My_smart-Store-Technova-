import React, { useState, useEffect, useId } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  RotateCw,
  CheckCircle2,
  Lock,
  Sparkles,
  Bot,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SmartCaptchaProps {
  onVerify: (verified: boolean) => void;
  isVerified: boolean;
  onBotDetected?: (reason: string, details?: any) => void;
  pageContext: 'cart_checkout' | 'quick_order' | 'landing_page';
  customerName?: string;
  phone?: string;
  className?: string;
}

type CaptchaMode = 'math' | 'interactive_checkbox';

export const SmartCaptcha: React.FC<SmartCaptchaProps> = ({
  onVerify,
  isVerified,
  onBotDetected,
  pageContext,
  customerName,
  phone,
  className = '',
}) => {
  const { language, t, logBlockedBotAttempt } = useStore();
  const captchaId = useId();

  // Mode: Math puzzle or Smart 1-click verification
  const [mode, setMode] = useState<CaptchaMode>('math');
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [operator, setOperator] = useState<'+' | '-'>('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [mountTime] = useState<number>(Date.now());

  // Honeypot field state (invisible to humans)
  const [honeypotValue, setHoneypotValue] = useState('');

  // Generate a random math challenge
  const generateNewChallenge = () => {
    const isPlus = Math.random() > 0.3;
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;

    if (isPlus) {
      setNum1(n1);
      setNum2(n2);
      setOperator('+');
    } else {
      // Ensure positive result for subtraction
      const larger = Math.max(n1, n2);
      const smaller = Math.min(n1, n2);
      setNum1(larger + 2);
      setNum2(smaller);
      setOperator('-');
    }
    setUserAnswer('');
    setErrorMsg(null);
  };

  useEffect(() => {
    generateNewChallenge();
  }, []);

  const expectedAnswer = operator === '+' ? num1 + num2 : num1 - num2;

  // Handle Math Challenge Check
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);
    setErrorMsg(null);

    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed === expectedAnswer) {
      // Check for honeypot bot trap
      if (honeypotValue.trim() !== '') {
        const reason = 'honeypot_triggered';
        logBlockedBotAttempt({
          reason,
          reasonLabel: 'محاولة ملء حقل الفخ الخفي (Honeypot Trap)',
          customerName,
          phone,
          page: pageContext,
          preventedLoss: 850,
        });
        onBotDetected?.(reason);
        setErrorMsg(language === 'ar' ? 'تم اكتشاف نشاط غير مصرح به' : 'Unauthorized activity detected');
        onVerify(false);
        return;
      }

      // Check for super-human speed (< 300ms since mount)
      const elapsedMs = Date.now() - mountTime;
      if (elapsedMs < 350) {
        const reason = 'rate_limit';
        logBlockedBotAttempt({
          reason,
          reasonLabel: 'إرسال آلي فائق السرعة عبر برنامج نصي (Bot Script)',
          customerName,
          phone,
          page: pageContext,
          preventedLoss: 850,
        });
        onBotDetected?.(reason);
      }

      onVerify(true);
      setErrorMsg(null);
    } else if (val.trim().length > 0 && !isNaN(parsed) && parsed !== expectedAnswer) {
      if (val.trim().length >= String(expectedAnswer).length) {
        setErrorMsg(language === 'ar' ? 'الإجابة غير صحيحة، حاول مجدداً' : 'Incorrect answer, please try again');
        setFailedAttempts((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            logBlockedBotAttempt({
              reason: 'failed_captcha',
              reasonLabel: 'تكرار إدخال إجابات خاطئة لاختبار الكابتشا',
              customerName,
              phone,
              page: pageContext,
              preventedLoss: 850,
            });
            onBotDetected?.('failed_captcha');
          }
          return next;
        });
        onVerify(false);
      }
    } else {
      onVerify(false);
    }
  };

  // Handle Smart One-Click Checkbox Verification
  const handleSmartCheckboxClick = () => {
    if (isVerified) return;

    // Check honeypot trap
    if (honeypotValue.trim() !== '') {
      const reason = 'honeypot_triggered';
      logBlockedBotAttempt({
        reason,
        reasonLabel: 'محاولة ملء حقل الفخ الخفي (Honeypot Trap)',
        customerName,
        phone,
        page: pageContext,
        preventedLoss: 850,
      });
      onBotDetected?.(reason);
      setErrorMsg(language === 'ar' ? 'تم حظر الطلب كنشاط آلي' : 'Request blocked as automated bot activity');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerify(true);
      setErrorMsg(null);
    }, 600);
  };

  return (
    <div
      id={`smart-captcha-${captchaId}`}
      className={`rounded-2xl border transition-all duration-300 ${
        isVerified
          ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
          : errorMsg
          ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-500/10'
          : 'bg-slate-50 border-slate-200/90 hover:border-slate-300'
      } p-3.5 sm:p-4 text-xs ${className}`}
    >
      {/* Honeypot Trap field - invisible to human visitors */}
      <div className="opacity-0 absolute -z-50 select-none pointer-events-none h-0 w-0 overflow-hidden" tabIndex={-1} aria-hidden="true">
        <label htmlFor={`hp_token_${captchaId}`}>Do not fill this field</label>
        <input
          type="text"
          id={`hp_token_${captchaId}`}
          name="store_anti_spam_trap"
          autoComplete="off"
          value={honeypotValue}
          onChange={(e) => setHoneypotValue(e.target.value)}
          tabIndex={-1}
        />
      </div>

      {/* Header bar of the Anti-Bot Protection */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
              isVerified
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {isVerified ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <span>
                {language === 'ar'
                  ? 'حماية ضد الطلبات الوهمية والروبوتات'
                  : 'Anti-Bot & Spam Verification'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-700">
                {language === 'ar' ? 'آمن 100%' : 'Secure'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              {language === 'ar'
                ? 'التحقق البشري لضمان جدية الطلب وحجز المنتجات لك'
                : 'Human check to guarantee your order booking'}
            </p>
          </div>
        </div>

        {/* Refresh / Switch Mode */}
        {!isVerified && (
          <button
            type="button"
            onClick={generateNewChallenge}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-all"
            title={language === 'ar' ? 'تحديث اللغز' : 'Refresh Challenge'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Verified State View */}
      {isVerified ? (
        <div className="flex items-center justify-between bg-white/80 rounded-xl p-2.5 border border-emerald-200 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5 text-emerald-700">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs block">
                {language === 'ar' ? 'تم التحقق بنجاح! أنت مستخدم حقيقي ✓' : 'Verified! You are a human visitor ✓'}
              </span>
              <span className="text-[10px] text-emerald-600 block">
                {language === 'ar' ? 'يمكنك الآن الضغط على زر تأكيد الطلب بالأسفل' : 'You can now submit your order below'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono">
            <span>CAPTCHA-PASS</span>
          </div>
        </div>
      ) : (
        /* Unverified Challenge State */
        <div className="space-y-2.5">
          {mode === 'math' ? (
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Question visual badge */}
              <div className="flex items-center gap-2.5">
                <div className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-mono font-black text-sm tracking-wider flex items-center gap-2 select-none shadow-xs">
                  <span>{num1}</span>
                  <span className="text-amber-400">{operator}</span>
                  <span>{num2}</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-emerald-400">?</span>
                </div>
                <div className="text-[11px] font-bold text-slate-700">
                  {language === 'ar' ? 'كم ناتج العملية الحسابية؟' : 'What is the sum?'}
                </div>
              </div>

              {/* Answer Input */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={language === 'ar' ? 'اكتب الناتج هنا' : 'Answer'}
                  value={userAnswer}
                  onChange={handleAnswerChange}
                  className={`w-28 sm:w-32 px-3 py-1.5 rounded-xl border text-center font-black font-mono text-sm focus:outline-none transition-all ${
                    errorMsg
                      ? 'border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20'
                      : 'border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                  }`}
                  aria-label="Captcha Answer"
                />

                <button
                  type="button"
                  onClick={generateNewChallenge}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تغيير' : 'Change'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Smart 1-click Checkbox Mode */
            <div
              onClick={handleSmartCheckboxClick}
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all select-none"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isVerifying
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {isVerifying && (
                    <RotateCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  )}
                </div>
                <span className="font-bold text-slate-800 text-xs">
                  {language === 'ar'
                    ? 'أنا لست برنامج روبوت (التحقق البشري)'
                    : "I'm not a robot (Human Verification)"}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-[9px] text-slate-400 font-mono">reCAPTCHA DZ</span>
              </div>
            </div>
          )}

          {/* Error Message if wrong answer */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px] bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick instructions */}
          <p className="text-[10px] text-slate-500 leading-normal">
            {language === 'ar'
              ? '🔒 لن يتم إرسال الطلب قبل حل عملية التحقق لمنع هجمات البريد العشوائي والروبوتات.'
              : '🔒 Order submission is locked until the verification is solved to protect against spam bots.'}
          </p>
        </div>
      )}
    </div>
  );
};
