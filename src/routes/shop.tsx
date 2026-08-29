import { createFileRoute } from '@tanstack/react-router';
import { ProductSection } from '../components/products/ProductSection';

export const Route = createFileRoute('/shop')({
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="w-full flex flex-col">
      <ProductSection />
    </div>
  );
}
