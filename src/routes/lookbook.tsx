import { createFileRoute } from '@tanstack/react-router';
import { LookbookSection } from '../components/lookbook/LookbookSection';

export const Route = createFileRoute('/lookbook')({
  component: LookbookPage,
});

function LookbookPage() {
  return (
    <div className="w-full flex flex-col">
      <LookbookSection />
    </div>
  );
}
