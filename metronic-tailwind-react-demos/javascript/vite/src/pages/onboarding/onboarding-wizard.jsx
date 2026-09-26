import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import { useAuth } from '@/auth/context/auth-context';
import { saveOnboardingRecord, setOnboardingComplete } from '@/lib/onboarding-db';
import {
  Stepper,
  StepperNav,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
} from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { StepIdentity } from './steps/step-identity';
import { StepContact } from './steps/step-contact';
import { StepPhoto } from './steps/step-photo';

const STEPS = [
  { key: 'identity', label: 'Kimlik Bilgileriniz', desc: 'T.C. kimlik ve kişisel bilgiler' },
  { key: 'contact', label: 'İletişim Bilgileriniz', desc: 'E-posta, telefon ve adres' },
  { key: 'photo', label: 'Fotoğraf Bilgileriniz', desc: 'Vesikalık fotoğraf yükleme' },
];

function validate(step, data) {
  const e = {};
  if (step === 0) {
    if (!/^\d{11}$/.test(data.tcKimlik)) e.tcKimlik = 'T.C. kimlik numarası 11 haneli olmalıdır.';
    if (data.adSoyad.trim().length < 3) e.adSoyad = 'Ad ve soyad zorunludur.';
    if (!data.dogumTarihi) e.dogumTarihi = 'Doğum tarihi zorunludur.';
    if (!data.cinsiyet) e.cinsiyet = 'Cinsiyet seçiniz.';
  }
  if (step === 1) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Geçerli bir e-posta giriniz.';
    const digits = data.telefon.replace(/\D/g, '');
    if (digits.length !== 11 || !digits.startsWith('0')) e.telefon = 'Telefon 0XXX XXX XX XX biçiminde olmalı.';
    if (!data.il) e.il = 'İl seçiniz.';
    if (!data.ilce) e.ilce = 'İlçe seçiniz.';
  }
  if (step === 2) {
    if (!data.foto || !data.username) e.foto = 'Vesikalık fotoğraf yükleyip analiz ettiriniz.';
  }
  return e;
}

export function OnboardingWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    tcKimlik: '',
    adSoyad: '',
    dogumTarihi: '',
    cinsiyet: '',
    email: '',
    telefon: '',
    il: '',
    ilce: '',
    foto: null,
    username: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sihirbaz her zaman beyaz (açık) temada görünür.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }, []);

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const goNext = () => {
    const e = validate(step, data);
    setErrors(e);
    if (Object.keys(e).length === 0 && step < STEPS.length - 1) setStep(step + 1);
  };

  const goPrev = () => {
    setErrors({});
    if (step > 0) setStep(step - 1);
  };

  const handleStepClick = (v) => {
    if (v - 1 < step) {
      setErrors({});
      setStep(v - 1);
    }
  };

  const finish = async () => {
    const e = validate(step, data);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    const userId = user?.id;
    saveOnboardingRecord({
      userId,
      username: data.username,
      tcKimlik: data.tcKimlik,
      adSoyad: data.adSoyad,
      dogumTarihi: data.dogumTarihi,
      cinsiyet: data.cinsiyet,
      email: data.email,
      telefon: data.telefon,
      il: data.il,
      ilce: data.ilce,
      foto: data.foto,
    });
    setOnboardingComplete(userId);
    navigate('/', { replace: true });
  };

  const basvuruId = `B${String(Math.floor(100000 + Math.random() * 900000))}`;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:py-10 sm:px-8">
      <div className="mx-auto w-full max-w-7xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Stepper — sol menü */}
          <aside className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/60 p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900">Ön Kayıt</h1>
              <p className="text-sm text-gray-500 mt-1">Bilgileriniz güvenle saklanır.</p>
            </div>

            <Stepper
              orientation="vertical"
              value={step + 1}
              onValueChange={handleStepClick}
              indicators={{
                completed: <Check className="size-4" />,
                active: <Minus className="size-4" />,
                inactive: <Minus className="size-4" />,
              }}
            >
              <StepperNav className="gap-0">
                {STEPS.map((s, i) => (
                  <StepperItem key={s.key} step={i + 1} disabled={i > step}>
                    <StepperTrigger className="rounded-lg px-2 py-1.5 data-[state=active]:bg-blue-50">
                      <StepperIndicator className="size-9 rounded-md text-sm font-semibold data-[state=inactive]:bg-accent data-[state=inactive]:text-primary/40" />
                      <div className="flex flex-col items-start gap-0.5">
                        <StepperTitle className="text-sm font-medium text-gray-900 data-[state=inactive]:text-muted-foreground">
                          {s.label}
                        </StepperTitle>
                        <span className={`text-xs ${i === step ? 'text-gray-500' : 'text-gray-400'}`}>
                          {s.desc}
                        </span>
                      </div>
                    </StepperTrigger>
                    {i < STEPS.length - 1 && (
                      <StepperSeparator className="my-1 ml-[1.625rem] h-10 w-0 border-l-2 border-dashed border-gray-300 data-[state=completed]:border-primary" />
                    )}
                  </StepperItem>
                ))}
              </StepperNav>
            </Stepper>
          </aside>

          {/* Form alanı — sağ */}
          <section className="lg:col-span-8 xl:col-span-9 p-6 sm:p-8 lg:p-10 flex flex-col">
            {/* Adım başlığı */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {STEPS[step].label}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{STEPS[step].desc}</p>
            </div>

            {/* Form içeriği */}
            <div className="flex-1">
              {step === 0 && <StepIdentity data={data} onChange={update} errors={errors} />}
              {step === 1 && <StepContact data={data} onChange={update} errors={errors} />}
              {step === 2 && <StepPhoto data={data} onChange={update} errors={errors} />}
            </div>

            {/* Alt bilgi */}
            <p className="mt-6 text-xs text-gray-400">
              Kullanıcı ID: {user?.id || '—'} · Başvuru ID: {basvuruId}
            </p>

            {/* Navigasyon butonları */}
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
              <Button
                type="button"
                size="lg"
                onClick={goPrev}
                disabled={step === 0}
                className="bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100"
              >
                ← Önceki
              </Button>

              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={goNext}
                >
                  Sonraki →
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={finish}
                  disabled={submitting}
                >
                  {submitting ? 'Kaydediliyor…' : 'Başvurumu Tamamla'}
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
