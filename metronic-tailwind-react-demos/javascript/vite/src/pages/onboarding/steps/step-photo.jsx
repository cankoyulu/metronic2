import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const FIELD_ROW = 'flex items-baseline flex-wrap lg:flex-nowrap gap-2.5';
const FIELD_LABEL = 'flex w-full max-w-56';

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
    <div className="grid gap-5">
      {/* Fotoğraf Yükleme */}
      <div className={FIELD_ROW}>
        <FormLabel className={FIELD_LABEL}>Vesikalık Fotoğraf</FormLabel>
        <div className="grow">
          {preview ? (
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Önizleme"
                className="w-28 h-36 object-cover rounded-lg border border-border"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium text-secondary-foreground">
                  {foto?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(foto?.size / 1024).toFixed(0)} KB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="size-4" />
                  Sil ve Tekrar Yükle
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'relative rounded-lg border border-dashed p-8 text-center transition-colors cursor-pointer',
                dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50',
              )}
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
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-full',
                    dragging ? 'bg-primary/10' : 'bg-muted',
                  )}
                >
                  <Upload
                    className={cn(
                      'h-6',
                      dragging ? 'text-primary' : 'text-muted-foreground',
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Sürükle-bırak veya tıklayarak dosya seç
                  </p>
                  <p className="text-xs text-muted-foreground">
                    .jpg, .jpeg, .png · Maks. 5 MB
                  </p>
                </div>
              </div>
            </div>
          )}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      </div>

      {/* Ön Kayıt Özeti */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Ön Kayıt Özeti
        </h3>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableBody>
              {summaryRows.map((row, idx) => (
                <TableRow key={idx} className={idx % 2 === 0 ? 'bg-muted/40' : ''}>
                  <TableCell className="py-2.5 px-4 font-medium text-muted-foreground w-1/3">
                    {row.label}
                  </TableCell>
                  <TableCell className="py-2.5 px-4 text-foreground">
                    {row.value || <span className="text-muted-foreground/40">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                <span className="text-destructive">*</span> KVKK Aydınlatma Metni
                ve Açık Rıza Onayı'nı okudum, anladım ve onaylıyorum.
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
