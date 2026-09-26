import { field } from '../field-styles';

function InfoIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 inline-block ml-1.5 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
}

export function StepIdentity({ data, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <h3 className="text-base font-semibold text-gray-800">
          Kimlik Bilgileriniz
          <InfoIcon />
        </h3>
      </div>

      <div>
        <label className={field.label}>T.C. Kimlik Numarası</label>
        <input
          inputMode="numeric"
          maxLength={11}
          placeholder="11 haneli T.C. kimlik numaranız"
          className={field.input}
          value={data.tcKimlik}
          onChange={(e) =>
            onChange('tcKimlik', e.target.value.replace(/\D/g, '').slice(0, 11))
          }
        />
        {errors.tcKimlik && <p className={field.error}>{errors.tcKimlik}</p>}
        <p className={field.hint}>{data.tcKimlik.length}/11 hane</p>
      </div>

      <div>
        <label className={field.label}>Ad ve Soyad</label>
        <input
          placeholder="Ad ve soyadınız"
          className={field.input}
          value={data.adSoyad}
          onChange={(e) => onChange('adSoyad', e.target.value.toLocaleUpperCase('tr'))}
        />
        {errors.adSoyad && <p className={field.error}>{errors.adSoyad}</p>}
      </div>

      <div>
        <label className={field.label}>Doğum Tarihi</label>
        <input
          type="date"
          max={new Date().toISOString().split('T')[0]}
          className={field.input}
          value={data.dogumTarihi}
          onChange={(e) => onChange('dogumTarihi', e.target.value)}
        />
        {errors.dogumTarihi && <p className={field.error}>{errors.dogumTarihi}</p>}
      </div>

      <div>
        <label className={field.label}>Cinsiyet</label>
        <div className="flex gap-3">
          {['erkek', 'kadın'].map((c) => {
            const active = data.cinsiyet === c;
            return (
              <button
                type="button"
                key={c}
                onClick={() => onChange('cinsiyet', c)}
                className={`${field.optionBtn} capitalize ${
                  active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-dashed border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {errors.cinsiyet && <p className={field.error}>{errors.cinsiyet}</p>}
      </div>
    </div>
  );
}
