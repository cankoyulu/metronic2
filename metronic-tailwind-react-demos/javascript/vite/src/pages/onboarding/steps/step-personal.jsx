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

export function StepPersonal({ form }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* T.C. Kimlik No */}
        <FormField
          control={form.control}
          name="tcKimlik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>T.C. Kimlik Numarası</FormLabel>
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
            </FormItem>
          )}
        />

        {/* Ad */}
        <FormField
          control={form.control}
          name="ad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Adınız" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Soyad */}
        <FormField
          control={form.control}
          name="soyad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyad</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Soyadınız" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cinsiyet */}
        <FormField
          control={form.control}
          name="cinsiyet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cinsiyet</FormLabel>
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
            </FormItem>
          )}
        />

        {/* Doğum Tarihi */}
        <FormField
          control={form.control}
          name="dogumTarihi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doğum Tarihi</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Doğum Yeri */}
        <FormField
          control={form.control}
          name="dogumYeri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doğum Yeri</FormLabel>
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
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
