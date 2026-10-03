import { z } from 'zod';

/**
 * T.C. Kimlik No doğrulama algoritması.
 * 1. 11 haneli, sadece rakam
 * 2. İlk hane 0 olamaz
 * 3. 10. hane: (tek haneler toplamı * 7 - çift haneler toplamı) mod 10
 * 4. 11. hane: ilk 10 hane toplamı mod 10
 */
function validateTC(tc) {
  if (!/^\d{11}$/.test(tc)) return false;
  if (tc[0] === '0') return false;

  const digits = tc.split('').map(Number);
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const tenth = (oddSum * 7 - evenSum) % 10;
  if (tenth !== digits[9]) return false;

  const firstTenSum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const eleventh = firstTenSum % 10;
  return eleventh === digits[10];
}

export const onboardingSchema = z.object({
  // Adım 1: Kişisel Bilgiler
  tcKimlik: z
    .string()
    .min(1, 'T.C. Kimlik No zorunludur')
    .refine(validateTC, 'Geçersiz T.C. Kimlik Numarası'),
  ad: z.string().min(1, 'Ad zorunludur').max(50, 'Ad çok uzun'),
  soyad: z.string().min(1, 'Soyad zorunludur').max(50, 'Soyad çok uzun'),
  cinsiyet: z.enum(['Erkek', 'Kadın', 'Belirtmek İstemiyorum'], {
    errorMapIssue: undefined,
  }),
  dogumTarihi: z.string().min(1, 'Doğum tarihi zorunludur'),
  dogumYeri: z.string().min(1, 'Doğum yeri zorunludur'),

  // Adım 2: İletişim ve Adres
  email: z.string().min(1, 'E-posta zorunludur').email('Geçerli bir e-posta giriniz'),
  ulkeKodu: z.string().default('+90'),
  telefon: z
    .string()
    .min(1, 'Telefon zorunludur')
    .regex(/^\d{10}$/, '10 haneli telefon numarası giriniz (5XX XXX XX XX)'),
  ikametIl: z.string().min(1, 'İkametgah ili zorunludur'),
  ikametIlce: z.string().min(1, 'İkametgah ilçesi zorunludur'),

  // Adım 3: Eğitim
  egitimDuzeyi: z.enum(['Lise', 'Üniversite'], {
    errorMapIssue: undefined,
  }),
  egitimIl: z.string().min(1, 'Eğitim ili zorunludur'),
  egitimIlce: z.string().min(1, 'Eğitim ilçesi zorunludur'),
  egitimKurumu: z.string().min(1, 'Eğitim kurumu zorunludur'),
  girisYili: z.string().min(1, 'Giriş yılı zorunludur'),

  // Adım 4: Fotoğraf ve Onay
  foto: z.any().optional(),
  kvkkOnay: z.boolean().refine((v) => v === true, 'KVKK onayı zorunludur'),
});

// Alan gruplarına göre adım doğrulama
export const stepFields = {
  1: ['tcKimlik', 'ad', 'soyad', 'cinsiyet', 'dogumTarihi', 'dogumYeri'],
  2: ['email', 'ulkeKodu', 'telefon', 'ikametIl', 'ikametIlce'],
  3: ['egitimDuzeyi', 'egitimIl', 'egitimIlce', 'egitimKurumu', 'girisYili'],
  4: ['kvkkOnay'],
};

export const defaultValues = {
  tcKimlik: '',
  ad: '',
  soyad: '',
  cinsiyet: undefined,
  dogumTarihi: '',
  dogumYeri: '',
  email: '',
  ulkeKodu: '+90',
  telefon: '',
  ikametIl: '',
  ikametIlce: '',
  egitimDuzeyi: undefined,
  egitimIl: '',
  egitimIlce: '',
  egitimKurumu: '',
  girisYili: '',
  foto: undefined,
  kvkkOnay: false,
};
