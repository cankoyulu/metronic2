import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Form } from '@/components/ui/form';
import { defaultValues, onboardingSchema, stepFields } from './onboarding-schema';
import { StepPersonal } from './steps/step-personal';
import { StepContact } from './steps/step-contact';
import { StepEducation } from './steps/step-education';
import { StepPhoto } from './steps/step-photo';

const STEPS = [
  { title: 'Kişisel Bilgiler', description: 'Kimlik ve kişisel detaylar' },
  { title: 'İletişim & Adres', description: 'İletişim ve ikametgah' },
  { title: 'Eğitim Bilgileri', description: 'Eğitim ve kurum' },
  { title: 'Fotoğraf & Onay', description: 'Vesikalık ve sözleşme' },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
    mode: 'onChange',
  });

  const handleNext = async () => {
    const fields = stepFields[currentStep] || [];
    const valid = await form.trigger(fields);
    if (valid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    // Simulate API submission
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Ön kayıt başvurusu:', values);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="size-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Başvurunuz Alındı!
            </h2>
            <p className="text-gray-600">
              Ön kayıt başvurunuz başarıyla gönderilmiştir. Başvurunuz
              incelendikten sonra sizinle iletişime geçilecektir.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(1);
                form.reset(defaultValues);
              }}
              variant="outline"
            >
              Yeni Başvuru
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Ön Kayıt ve Başvuru Formu
          </h1>
          <p className="text-gray-500 mt-2">
            Lütfen tüm adımları eksiksiz doldurunuz.
          </p>
        </div>

        <Card className="bg-white">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
            <Stepper value={currentStep} onValueChange={setCurrentStep}>
              <StepperNav className="mb-8">
                {STEPS.map((step, idx) => (
                  <StepperItem
                    key={idx}
                    value={idx + 1}
                    className="flex-1"
                  >
                    <StepperTrigger asChild>
                      <button
                        type="button"
                        className="flex items-start gap-3 text-left"
                        disabled={idx + 1 > currentStep}
                      >
                        <StepperIndicator>
                          {idx + 1 < currentStep ? (
                            <Check className="size-4" />
                          ) : (
                            idx + 1
                          )}
                        </StepperIndicator>
                        <div className="hidden sm:block">
                          <StepperTitle>{step.title}</StepperTitle>
                          <StepperDescription>
                            {step.description}
                          </StepperDescription>
                        </div>
                      </button>
                    </StepperTrigger>
                    {idx < STEPS.length - 1 && <StepperSeparator />}
                  </StepperItem>
                ))}
              </StepperNav>

              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <StepperContent value={1}>
                  <StepPersonal form={form} />
                </StepperContent>
                <StepperContent value={2}>
                  <StepContact form={form} />
                </StepperContent>
                <StepperContent value={3}>
                  <StepEducation form={form} />
                </StepperContent>
                <StepperContent value={4}>
                  <StepPhoto form={form} />
                </StepperContent>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="size-4" />
                    Geri
                  </Button>

                  {currentStep < 4 ? (
                    <Button type="button" onClick={handleNext}>
                      İleri
                      <ChevronRight className="size-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        'Başvuruyu Gönder'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Stepper>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
