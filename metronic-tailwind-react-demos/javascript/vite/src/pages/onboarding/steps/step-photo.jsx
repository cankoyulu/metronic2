import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { field } from '../field-styles';

function CheckIcon({ ok }) {
  return (
    <span
      className={`inline-flex w-5 h-5 items-center justify-center rounded-full shrink-0 ${
        ok ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}
    >
      {ok ? (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

// Yüklenen vesikalık fotoğrafı tarayıcıda analiz eder.
async function analyzePhoto(file) {
  const checks = [];

  if (!file || !file.type.startsWith('image/')) {
    checks.push({ label: 'Görsel dosyası', ok: false, detail: 'Yalnızca görsel yükleyiniz.' });
    return { ok: false, checks };
  }
  checks.push({ label: 'Görsel dosyası', ok: true, detail: `${file.type} · ${(file.size / 1024).toFixed(0)} KB` });

  if (file.size > 5 * 1024 * 1024) {
    checks.push({ label: 'Dosya boyutu', ok: false, detail: 'En fazla 5 MB olmalı.' });
    return { ok: false, checks };
  }
  checks.push({ label: 'Dosya boyutu', ok: true, detail: 'Uygun.' });

  const img = await new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('Görsel okunamadı'));
    im.src = URL.createObjectURL(file);
  });

  const { width, height } = img;
  checks.push({
    label: 'Çözünürlük',
    ok: width >= 200 && height >= 260,
    detail: `${width}×${height} piksel ${width >= 200 && height >= 260 ? '· yeterli' : '· çok düşük'}`,
  });

  const ratio = height / width;
  checks.push({
    label: 'Vesikalık oranı',
    ok: ratio >= 1.2 && ratio <= 1.55,
    detail: `En/boy oranı ${ratio.toFixed(2)} ${ratio >= 1.2 && ratio <= 1.55 ? '· uygun' : '· vesikalık biçiminde değil'}`,
  });

  const cw = 120;
  const ch = Math.round((cw * height) / width);
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, cw, ch);
  const { data: pixels } = ctx.getImageData(0, 0, cw, ch);
  URL.revokeObjectURL(img.src);

  const luminance = (i) => 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];

  let sum = 0;
  const cornerLums = [];
  const sampleCorner = (x, y) => {
    let s = 0;
    let n = 0;
    for (let dy = 0; dy < 6; dy++) {
      for (let dx = 0; dx < 6; dx++) {
        const i = ((y + dy) * cw + (x + dx)) * 4;
        s += luminance(i);
        n++;
      }
    }
    return s / n;
  };
  cornerLums.push(sampleCorner(0, 0));
  cornerLums.push(sampleCorner(cw - 6, 0));
  cornerLums.push(sampleCorner(0, ch - 6));
  cornerLums.push(sampleCorner(cw - 6, ch - 6));
  const whiteCorners = cornerLums.filter((l) => l > 195).length;

  checks.push({
    label: 'Beyaz arka plan',
    ok: whiteCorners >= 3,
    detail: `${whiteCorners}/4 köşe beyaz ${whiteCorners >= 3 ? '· uygun' : '· arka plan beyaz değil'}`,
  });

  for (let i = 0; i < pixels.length; i += 4) sum += luminance(i);
  const avg = sum / (pixels.length / 4);
  let varSum = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    varSum += (luminance(i) - avg) ** 2;
  }
  const stddev = Math.sqrt(varSum / (pixels.length / 4));

  checks.push({
    label: 'Biyometrik okunabilirlik',
    ok: avg > 60 && stddev > 18,
    detail:
      avg > 60 && stddev > 18
        ? 'Parlaklık ve kontrast yeterli.'
        : 'Görüntü çok karanlık ya da düşük kontrastlı — yeniden çekim önerilir.',
  });

  return { ok: checks.every((c) => c.ok), checks };
}

export function StepPhoto({ data, onChange, errors }) {
  const inputRef = useRef(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzePhoto(file);
      setResult(res);
      if (res.ok) {
        const dataUrl = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
        });
        const username = String(Math.floor(100000 + Math.random() * 900000));
        onChange('foto', { name: file.name, size: file.size, type: file.type, dataUrl });
        onChange('username', username);
      } else {
        onChange('foto', null);
        onChange('username', '');
      }
    } catch (e) {
      setResult({ ok: false, checks: [{ label: 'İşlem', ok: false, detail: e.message }] });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-base font-semibold text-gray-800">Fotoğraf Bilgileriniz</h3>
      <p className="text-sm text-destructive">
        Yükleyeceğiniz vesikalık fotoğrafın son 30 gün içerisinde çekilmiş olması gerekmektedir.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center transition hover:border-primary hover:bg-primary/5"
      >
        <span className="mx-auto mb-3 flex w-14 h-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Upload className="w-6 h-6" />
        </span>
        <span className="block text-sm font-semibold text-gray-800">
          {analyzing ? 'Analiz ediliyor…' : 'Vesikalık fotoğrafınızı bu alana taşıyın ya da tıklayın'}
        </span>
        <span className="mt-1 block text-xs text-gray-500">En fazla 1 dosya yükleyebilirsiniz · JPG/PNG</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {result && (
        <ul className="space-y-2">
          {result.checks.map((c) => (
            <li key={c.label} className="flex items-start gap-2.5 text-sm">
              <CheckIcon ok={c.ok} />
              <span className={c.ok ? 'text-gray-700' : 'text-destructive'}>
                <span className="font-medium">{c.label}</span> — {c.detail}
              </span>
            </li>
          ))}
        </ul>
      )}

      {data.username && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-primary">Ön kayıt kullanıcı adınız:</p>
          <p className="mt-1 text-2xl font-bold tracking-widest text-primary">{data.username}</p>
          <p className="mt-1 text-xs text-primary/70">
            Bu numarayı not alınız; başvuru takibinde kullanacaksınız.
          </p>
        </div>
      )}

      {errors.foto && <p className={field.error}>{errors.foto}</p>}
    </div>
  );
}
