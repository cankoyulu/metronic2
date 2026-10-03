import { useEffect, useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputGroup } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDistrictsByCityName, TR_CITIES } from '@/data/tr-cities';

const COUNTRY_CODES = [
  { code: '+90', label: '🇹🇷 Türkiye (+90)' },
  { code: '+1', label: '🇺🇸 ABD (+1)' },
  { code: '+44', label: '🇬🇧 İngiltere (+44)' },
  { code: '+49', label: '🇩🇪 Almanya (+49)' },
  { code: '+33', label: '🇫🇷 Fransa (+33)' },
  { code: '+31', label: '🇳🇱 Hollanda (+31)' },
  { code: '+7', label: '🇷🇺 Rusya (+7)' },
  { code: '+971', label: '🇦🇪 BAE (+971)' },
  { code: '+966', label: '🇸🇦 S. Arabistan (+966)' },
  { code: '+86', label: '🇨🇳 Çin (+86)' },
];

const FIELD_ROW = 'flex items-baseline flex-wrap lg:flex-nowrap gap-2.5';
const FIELD_LABEL = 'flex w-full max-w-56';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  let result = '(';
  result += digits.slice(0, 3);
  if (digits.length >= 3) result += ') ';
  result += digits.slice(3, 6);
  if (digits.length >= 6) result += ' ';
  result += digits.slice(6, 8);
  if (digits.length >= 8) result += ' ';
  result += digits.slice(8, 10);
  return result;
}

export function StepContact({ form }) {
  const ikametIl = form.watch('ikametIl');
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (ikametIl) {
      setDistricts(getDistrictsByCityName(ikametIl));
      form.setValue('ikametIlce', '');
    } else {
      setDistricts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ikametIl]);

  return (
    <div className="grid gap-5">
      {/* E-posta */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>E-posta Adresi</FormLabel>
            <div className="grow">
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="ornek@domain.com"
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Telefon */}
      <FormField
        control={form.control}
        name="telefon"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Telefon Numarası</FormLabel>
            <div className="grow">
              <InputGroup>
                <FormField
                  control={form.control}
                  name="ulkeKodu"
                  render={({ field: ccField }) => (
                    <Select
                      value={ccField.value}
                      onValueChange={ccField.onChange}
                    >
                      <SelectTrigger className="w-[180px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormControl>
                  <Input
                    {...field}
                    placeholder="(5XX) XXX XX XX"
                    inputMode="tel"
                    value={formatPhone(field.value || '')}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      field.onChange(digits);
                    }}
                  />
                </FormControl>
              </InputGroup>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* İkametgah İli */}
      <FormField
        control={form.control}
        name="ikametIl"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>İkametgah İli</FormLabel>
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

      {/* İkametgah İlçesi */}
      <FormField
        control={form.control}
        name="ikametIlce"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>İkametgah İlçesi</FormLabel>
            <div className="grow">
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!ikametIl}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        ikametIl ? 'İlçe seçiniz' : 'Önce il seçiniz'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
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
