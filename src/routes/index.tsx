import { createFileRoute } from '@tanstack/react-router';
import { EditorialHero } from '../components/hero/EditorialHero';
import { ProductSection } from '../components/products/ProductSection';
import { LookbookSection } from '../components/lookbook/LookbookSection';

export const Route = createFileRoute('/')({
    component: IndexPage,
});

function IndexPage() {
    return (
        <div className="w-full flex flex-col">
            {/* 1. Top Editorial Campaign Hero (Matching reference top landscape) */}
            <EditorialHero />

            {/* 2. Main Product Catalog & 3-Column Grid (Matching reference middle grid) */}
            <ProductSection />

            {/* 3. Secondary Atmospheric Lookbook Campaign (Matching reference bottom banner) */}
            <LookbookSection />
        </div>
    );
}