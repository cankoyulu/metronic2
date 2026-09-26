import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/context/auth-context';
import { saveOnboardingRecord, setOnboardingComplete } from '@/lib/onboarding-db';
import { StepIdentity } from './steps/step-identity';
import { StepContact } from './steps/step-contact';
import { StepPhoto } from './steps/step-photo';

const STEPS = [
  { key: 'identity', label: 'Kimlik Bilgileriniz' },
  { key: 'contact', label: 'İletişim Bilgileriniz' },
  { key: 'photo', label: 'Fotoğraf Bilgileriniz' },
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden">
        {/* İlerleme takibi */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/70 p-6">
          <h1 className="text-base font-semibold text-gray-900 mb-1">Ön Kayıt</h1>
          <p className="text-xs text-gray-500 mb-6">Bilgileriniz güvenle saklanır.</p>

          <ol className="space-y-1">
            {STEPS.map((s, i) => {
              const completed = i < step;
              const active = i === step;
              return (
                <li key={s.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex w-8 h-8 items-center justify-center rounded-full text-sm font-semibold ${
                        completed
                          ? 'bg-blue-50 text-blue-600'
                          : active
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {completed ? (
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : active ? (
                        <span className="block w-3 h-0.5 bg-white rounded" />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-300 rounded" />
                      )}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className="w-px flex-1 my-1 border-l border-dashed border-gray-300" style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <span
                    className={`pt-1.5 text-sm ${active ? 'font-semibold text-gray-900' : completed ? 'text-gray-600' : 'text-gray-400'}`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Form alanı */}
        <section className="flex-1 p-6 sm:p-8 flex flex-col">
          <div className="flex-1">
            {step === 0 && <StepIdentity data={data} onChange={update} errors={errors} />}
            {step === 1 && <StepContact data={data} onChange={update} errors={errors} />}
            {step === 2 && <StepPhoto data={data} onChange={update} errors={errors} />}
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Kullanıcı ID: {user?.id || '—'} · Başvuru ID: {basvuruId}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 0}
              className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Önceki
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Sonraki →
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Kaydediliyor…' : 'Başvurumu Tamamla'}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
