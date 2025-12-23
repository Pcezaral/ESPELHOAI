import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Check, X } from 'lucide-react';

const plans = [
  {
    id: 2,
    name: 'Plano Essencial',
    credits: 40,
    price: 39.9,
    features: ['40 Créditos', 'Geração de 20 fotos', 'Acesso a todos os estilos', 'Suporte via E-mail'],
    isPopular: true,
  },
  {
    id: 3,
    name: 'Plano Premium',
    credits: 100,
    price: 69.9,
    features: ['100 Créditos', 'Geração de 50 fotos', 'Acesso a todos os estilos', 'Suporte Prioritário'],
    isPopular: false,
  },
];

const Planos: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Escolha o seu Plano
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600 dark:text-gray-400">
          Comece a gerar suas fotos profissionais hoje mesmo.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`w-full max-w-sm transition-all duration-300 ${
                plan.isPopular
                  ? 'border-2 border-blue-500 shadow-xl scale-105'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plan.credits} Créditos
                </p>
                {plan.isPopular && (
                  <div className="mt-2 inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    Mais Popular
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ul className="space-y-3 text-left mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700">
                  Adquirir Plano
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planos;
