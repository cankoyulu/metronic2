import { useEffect, useMemo, useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDistrictsByCityName, TR_CITIES } from '@/data/tr-cities';
import { TR_UNIVERSITIES } from '@/data/tr-universities';

const YEARS = Array.from({ length: 50 }, (_, i) => String(2025 - i));

const FIELD_ROW = 'flex items-baseline flex-wrap lg:flex-nowrap gap-2.5';
const FIELD_LABEL = 'flex w-full max-w-56';

export function StepEducation({ form }) {
  const egitimDuzeyi = form.watch('egitimDuzeyi');
  const egitimIl = form.watch('egitimIl');
  const [districts, setDistricts] = useState([]);
  const [uniSearch, setUniSearch] = useState('');
  const [showUniList, setShowUniList] = useState(false);

  useEffect(() => {
    if (egitimIl) {
      setDistricts(getDistrictsByCityName(egitimIl));
      form.setValue('egitimIlce', '');
    } else {
      setDistricts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [egitimIl]);

  const filteredUnis = useMemo(() => {
    if (!uniSearch) return TR_UNIVERSITIES.slice(0, 10);
    return TR_UNIVERSITIES.filter((u) =>
      u.toLowerCase().includes(uniSearch.toLowerCase()),
    ).slice(0, 20);
  }, [uniSearch]);

  return (
    <div className="grid gap-5">
      {/* Eğitim Düzeyi */}
      <FormField
        control={form.control}
        name="egitimDuzeyi"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Eğitim Düzeyi</FormLabel>
            <div className="grow">
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Lise">Lise</SelectItem>
                  <SelectItem value="Üniversite">Üniversite</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Giriş Yılı */}
      <FormField
        control={form.control}
        name="girisYili"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>Giriş Yılı</FormLabel>
            <div className="grow">
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Yıl seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Okuduğu İl */}
      <FormField
        control={form.control}
        name="egitimIl"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>
              Okuduğu / Mezun Olduğu İl
            </FormLabel>
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

      {/* Okuduğu İlçe */}
      <FormField
        control={form.control}
        name="egitimIlce"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>
              Okuduğu / Mezun Olduğu İlçe
            </FormLabel>
            <div className="grow">
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!egitimIl}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        egitimIl ? 'İlçe seçiniz' : 'Önce il seçiniz'
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

      {/* Eğitim Kurumu */}
      <FormField
        control={form.control}
        name="egitimKurumu"
        render={({ field }) => (
          <FormItem className={FIELD_ROW}>
            <FormLabel className={FIELD_LABEL}>
              {egitimDuzeyi === 'Üniversite'
                ? 'Üniversite'
                : 'Eğitim Kurumu'}
            </FormLabel>
            <div className="grow">
              <FormControl>
                {egitimDuzeyi === 'Üniversite' ? (
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Üniversite adı yazarak arayınız..."
                      value={uniSearch || field.value || ''}
                      onChange={(e) => {
                        setUniSearch(e.target.value);
                        setShowUniList(true);
                        field.onChange(e.target.value);
                      }}
                      onFocus={() => setShowUniList(true)}
                      onBlur={() => setTimeout(() => setShowUniList(false), 200)}
                    />
                    {showUniList && filteredUnis.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-border bg-popover shadow-lg">
                        {filteredUnis.map((u) => (
                          <button
                            key={u}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-popover-foreground"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              field.onChange(u);
                              setUniSearch(u);
                              setShowUniList(false);
                            }}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    {...field}
                    placeholder="Okul / kurum adı giriniz"
                  />
                )}
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
