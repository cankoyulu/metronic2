import { Helmet } from 'react-helmet-async';
import { OnboardingWizard } from './onboarding-wizard';

export function OnboardingPage() {
  return (
    <>
      <Helmet>
        <title>Ön Kayıt ve Başvuru Formu</title>
      </Helmet>
      <OnboardingWizard />
    </>
  );
}
