import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

interface DiscoverySectionProps {
  title: string;
  subtitle: string | React.ReactNode;
  icon: React.ReactNode;
  products: any[];
  viewAllPath?: string;
}

export default function DiscoverySection({ title, subtitle, icon, products, viewAllPath = "/livros" }: DiscoverySectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="pl-6 lg:pl-12 py-12">
      <div className="max-w-7xl mx-auto pr-6 lg:pr-12">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-bold text-on-surface-heading flex items-center gap-3">
              <span className="text-secondary">{icon}</span>
              {title}
            </h2>
            <p className="text-on-surface-variant font-medium">{subtitle}</p>
          </div>
          <Link 
            to={viewAllPath}
            className="text-primary hover:text-on-surface font-bold flex items-center gap-1 group transition-colors"
          >
            {viewAllPath === '/livros' ? 'Ver Livros' : 'Ver Tudo'} 
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x">
          {products.map((product) => (
            <ProductCard key={product.id || product.title} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
