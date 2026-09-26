import { TR_PROVINCES, getDistricts } from '@/data/tr-locations';
import { field } from '../field-styles';

// "0XXX XXX XX XX" biçimine dönüştürür.
export function formatPhone(raw) {
  const digits = String(raw).replace(/\D/g, '').slice(0, 11);
  let out = '';
  if (digits.length > 0) out = digits.slice(0, 4);
  if (digits.length > 4) out += ' ' + digits.slice(4, 7);
  if (digits.length > 7) out += ' ' + digits.slice(7, 9);
  if (digits.length > 9) out += ' ' + digits.slice(9, 11);
  return out;
}

export function StepContact({ data, onChange, errors }) {
  const districts = getDistricts(data.il);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">İletişim Bilgileriniz</h2>

      <div>
        <label className={field.label}>E-posta Adresi</label>
        <input
          type="email"
          placeholder="ornek@eposta.com"
          className={field.input}
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        {errors.email && <p className={field.error}>{errors.email}</p>}
      </div>

      <div>
        <label className={field.label}>Telefon Numarası</label>
        <input
          inputMode="numeric"
          placeholder="0XXX XXX XX XX"
          className={field.input}
          value={data.telefon}
          onChange={(e) => onChange('telefon', formatPhone(e.target.value))}
        />
        {errors.telefon && <p className={field.error}>{errors.telefon}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={field.label}>İkametgah İl</label>
          <select
            className={field.select}
            value={data.il}
            onChange={(e) => {
              onChange('il', e.target.value);
              onChange('ilce', '');
            }}
          >
            <option value="">İl seçiniz</option>
            {TR_PROVINCES.map((p) => (
              <option key={p.plaka} value={p.il}>
                {p.il}
              </option>
            ))}
          </select>
          {errors.il && <p className={field.error}>{errors.il}</p>}
        </div>

        <div>
          <label className={field.label}>İkametgah İlçe</label>
          <select
            className={field.select}
            disabled={!data.il}
            value={data.ilce}
            onChange={(e) => onChange('ilce', e.target.value)}
          >
            <option value="">{data.il ? 'İlçe seçiniz' : 'Önce il seçiniz'}</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.ilce && <p className={field.error}>{errors.ilce}</p>}
        </div>
      </div>
    </div>
  );
}
