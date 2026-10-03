import { useRef, useState } from 'react';
import { Upload, X, FileImage, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function StepPhoto({ form }) {
  const foto = form.watch('foto');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const allValues = form.watch();

  const handleFile = (file) => {
    setError('');
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Sadece .jpg, .jpeg, .png formatları kabul edilir.');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('Dosya boyutu 5MB\'ı geçemez.');
      return;
    }

    form.setValue('foto', file, { shouldValidate: true });
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removeFile = () => {
    form.setValue('foto', undefined, { shouldValidate: true });
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const summaryRows = [
    { label: 'T.C. Kimlik No', value: allValues.tcKimlik },
    { label: 'Ad Soyad', value: `${allValues.ad || ''} ${allValues.soyad || ''}`.trim() },
    { label: 'Cinsiyet', value: allValues.cinsiyet },
    { label: 'Doğum Tarihi', value: allValues.dogumTarihi },
    { label: 'Doğum Yeri', value: allValues.dogumYeri },
    { label: 'E-posta', value: allValues.email },
    { label: 'Telefon', value: allValues.telefon ? `${allValues.ulkeKodu} ${allValues.telefon}` : '' },
    { label: 'İkametgah', value: allValues.ikametIl && allValues.ikametIlce ? `${allValues.ikametIlce} / ${allValues.ikametIl}` : '' },
    { label: 'Eğitim Düzeyi', value: allValues.egitimDuzeyi },
    { label: 'Eğitim Kurumu', value: allValues.egitimKurumu },
    { label: 'Eğitim Yeri', value: allValues.egitimIl && allValues.egitimIlce ? `${allValues.egitimIlce} / ${allValues.egitimIl}` : '' },
    { label: 'Giriş Yılı', value: allValues.girisYili },
  ];

  return (
    <div className="space-y-6">
      {/* Fotoğraf Yükleme */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Vesikalık Fotoğraf
        </label>
        {preview ? (
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Önizleme"
              className="w-28 h-36 object-cover rounded-lg border border-gray-200"
            />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{foto?.name}</p>
              <p className="text-xs text-gray-400">
                {(foto?.size / 1024).toFixed(0)} KB
              </p>
              <Button type="button" variant="outline" size="sm" onClick={removeFile}>
                <X className="size-4" />
                Sil ve Tekrar Yükle
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <Upload className="size-10 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700">
              Sürükle-bırak veya tıklayarak dosya seç
            </p>
            <p className="text-xs text-gray-400 mt-1">
              .jpg, .jpeg, .png · Maks. 5 MB
            </p>
          </div>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {/* Ön Kayıt Özeti */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Ön Kayıt Özeti
        </h3>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {summaryRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-2.5 px-4 font-medium text-gray-600 w-1/3">
                    {row.label}
                  </td>
                  <td className="py-2.5 px-4 text-gray-900">
                    {row.value || <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KVKK Onayı */}
      <FormField
        control={form.control}
        name="kvkkOnay"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start gap-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal cursor-pointer">
                <span className="text-red-500">*</span> KVKK Aydılatma Metni ve
                Açık Rıza Onayı'nı okudum, anladım ve onaylıyorum.
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
