import { createFileRoute } from '@tanstack/react-router';
import { MaterialStudySection } from '../components/atelier/MaterialStudySection';
import { AtelierPrinciples } from '../components/atelier/AtelierPrinciples';
import { FaqAccordion } from '../components/atelier/FaqAccordion';

export const Route = createFileRoute('/atelier')({
  component: AtelierPage,
});

function AtelierPage() {
  return (
    <div className="w-full flex flex-col">
      <MaterialStudySection />
      <AtelierPrinciples />
      <FaqAccordion />
    </div>
  );
}
