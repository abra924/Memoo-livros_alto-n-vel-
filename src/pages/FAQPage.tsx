import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Mail } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{question}</span>
        <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'text-on-surface-variant'}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pb-6 text-on-surface-variant leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Geral",
      items: [
        {
          question: "O que é a Memoo Livros?",
          answer: "A Memoo Livros é uma plataforma de curadoria digital focada em acelerar a tua aprendizagem através de resumos de livros, audiobooks e ferramentas digitais selecionadas."
        },
        {
          question: "Como posso aceder aos conteúdos?",
          answer: "Basta criares uma conta gratuita e iniciares sessão. Alguns conteúdos são gratuitos, enquanto outros requerem uma subscrição ou compra individual."
        }
      ]
    },
    {
      category: "Pagamentos e Subscrições",
      items: [
        {
          question: "Quais os métodos de pagamento aceites?",
          answer: "Aceitamos cartões de crédito (Visa, Mastercard), PayPal e referências Multibanco para utilizadores em Portugal."
        },
        {
          question: "Posso cancelar a minha subscrição a qualquer momento?",
          answer: "Sim, podes cancelar a tua subscrição nas definições da tua conta a qualquer momento, sem taxas de cancelamento."
        }
      ]
    },
    {
      category: "Técnico",
      items: [
        {
          question: "Posso ler offline?",
          answer: "Sim, através da nossa aplicação móvel podes descarregar os teus livros e audiobooks favoritos para ouvir ou ler sem ligação à internet."
        },
        {
          question: "Em que dispositivos posso usar a Memoo?",
          answer: "A Memoo está disponível via web em qualquer browser moderno, e também através das nossas apps para iOS e Android."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Section */}
      <section className="py-20 px-6 lg:px-12 max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8"
        >
          <HelpCircle size={40} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-6xl font-headline font-extrabold text-on-surface"
        >
          Como podemos <span className="text-primary">ajudar</span>?
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-xl mx-auto"
        >
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Procura por uma pergunta ou tema..." 
            className="w-full bg-surface-container-low border border-white/5 rounded-full py-5 pl-14 pr-6 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none"
          />
        </motion.div>
      </section>

      {/* FAQ Content */}
      <section className="pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="space-y-16">
          {faqs.map((category, idx) => (
            <motion.div 
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest px-2">{category.category}</h2>
              <div className="bg-surface-container-low rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
                {category.items.map((item, i) => (
                  <FAQItem key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-extrabold text-on-surface">Ainda tens dúvidas?</h2>
            <p className="text-on-surface-variant">A nossa equipa de suporte está pronta para te ajudar 24/7.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col items-center space-y-4 hover:border-secondary/30 transition-colors">
              <div className="p-4 bg-secondary/10 text-secondary rounded-2xl">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-on-surface">Chat ao Vivo</h3>
              <p className="text-sm text-on-surface-variant">Tempo médio de resposta: 5 minutos</p>
              <button className="text-secondary font-bold hover:underline">Iniciar Chat</button>
            </div>
            
            <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col items-center space-y-4 hover:border-primary/30 transition-colors">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-on-surface">E-mail</h3>
              <p className="text-sm text-on-surface-variant">Respondemos em menos de 24 horas</p>
              <button className="text-primary font-bold hover:underline">Enviar E-mail</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
