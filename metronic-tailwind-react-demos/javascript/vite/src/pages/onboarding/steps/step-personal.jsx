import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TR_CITIES } from '@/data/tr-cities';

const FIELD_ROW = 'flex items-baseline flex-wrap lg:flex-nowrap gap-2.5';
const FIELD_LABEL = 'flex w-full max-w-56';

export function StepPersonal({ form }) {
  return (
    <div className="grid gap-5">
      {/* T.C. Kimlik No */}
      <FormField
        control={form.control}
        name="tcKimlik"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>T.C. Kimlik Numarası</FormLabel>
            <div className="grow">
              <FormControl>
                <Input
                  {...field}
                  placeholder="11 haneli kimlik no"
                  maxLength={11}
                  inputMode="numeric"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Ad */}
      <FormField
        control={form.control}
        name="ad"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Ad</FormLabel>
            <div className="grow">
              <FormControl>
                <Input {...field} placeholder="Adınız" />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Soyad */}
      <FormField
        control={form.control}
        name="soyad"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Soyad</FormLabel>
            <div className="grow">
              <FormControl>
                <Input {...field} placeholder="Soyadınız" />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Cinsiyet */}
      <FormField
        control={form.control}
        name="cinsiyet"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Cinsiyet</FormLabel>
            <div className="grow">
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-4 pt-2"
                >
                  {['Erkek', 'Kadın', 'Belirtmek İstemiyorum'].map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <RadioGroupItem value={opt} id={`gender-${opt}`} />
                      <Label htmlFor={`gender-${opt}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Doğum Tarihi */}
      <FormField
        control={form.control}
        name="dogumTarihi"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Doğum Tarihi</FormLabel>
            <div className="grow">
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Doğum Yeri */}
      <FormField
        control={form.control}
        name="dogumYeri"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Doğum Yeri</FormLabel>
            <div className="grow">
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="İl seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TR_CITIES.map((city) => (
                    <SelectItem key={city.plate} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
