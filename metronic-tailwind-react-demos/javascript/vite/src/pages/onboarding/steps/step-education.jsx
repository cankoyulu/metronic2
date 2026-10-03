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
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Eğitim Düzeyi */}
        <FormField
          control={form.control}
          name="egitimDuzeyi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eğitim Düzeyi</FormLabel>
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
            </FormItem>
          )}
        />

        {/* Giriş Yılı */}
        <FormField
          control={form.control}
          name="girisYili"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eğitim Kurumuna Giriş Yılı</FormLabel>
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
            </FormItem>
          )}
        />

        {/* Okuduğu İl */}
        <FormField
          control={form.control}
          name="egitimIl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Okuduğu / Mezun Olduğu İl</FormLabel>
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

        {/* Okuduğu İlçe */}
        <FormField
          control={form.control}
          name="egitimIlce"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Okuduğu / Mezun Olduğu İlçe</FormLabel>
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
            </FormItem>
          )}
        />
      </div>

      {/* Eğitim Kurumu */}
      <FormField
        control={form.control}
        name="egitimKurumu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {egitimDuzeyi === 'Üniversite'
                ? 'Üniversite'
                : 'Eğitim Kurumu'}
            </FormLabel>
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
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                      {filteredUnis.map((u) => (
                        <button
                          key={u}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
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
          </FormItem>
        )}
      />
    </div>
  );
}
