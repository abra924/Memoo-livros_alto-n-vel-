import { motion } from 'motion/react';
import { Zap, ShieldCheck, Clock, BookOpen } from 'lucide-react';

const benefits = [
  {
    icon: <Zap className="text-secondary" />,
    title: "Acesso Imediato",
    desc: "Comece a ler segundos após a compra."
  },
  {
    icon: <ShieldCheck className="text-primary" />,
    title: "Conteúdo Prático",
    desc: "Focado em resultados reais para o seu dia."
  },
  {
    icon: <Clock className="text-secondary" />,
    title: "Leitura Fácil",
    desc: "Formatos otimizados para qualquer ecrã."
  },
  {
    icon: <BookOpen className="text-primary" />,
    title: "Progresso Pessoal",
    desc: "Evolua a sua mente com curadoria de elite."
  }
];

export default function Benefits() {
  return (
    <section className="px-6 lg:px-12 max-w-7xl mx-auto py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-surface-container-low border border-border hover:border-primary/20 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold text-on-surface-heading mb-2">{benefit.title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{benefit.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
