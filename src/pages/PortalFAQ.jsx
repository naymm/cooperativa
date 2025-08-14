import React, { useState } from "react";
import PortalLayout from "../components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Adicionado
import { HelpCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "Geral",
    questions: [
      { q: "O que é a CoopHabitat?", a: "A CoopHabitat é uma cooperativa habitacional dedicada a facilitar o acesso à moradia digna para seus cooperados, através de projetos coletivos e gestão transparente." },
      { q: "Como posso me tornar um cooperado?", a: "Para se tornar um cooperado, você geralmente precisa passar por um processo de inscrição, que pode incluir o envio de documentos, análise de crédito e pagamento de uma taxa de adesão. Verifique a seção de 'Como Participar' no nosso site principal ou contate-nos." },
      { q: "Quais são os benefícios de ser um cooperado?", a: "Os benefícios incluem custos potencialmente menores para aquisição de imóveis, participação nas decisões da cooperativa, acesso a projetos habitacionais de qualidade e um forte senso de comunidade." },
    ]
  },
  {
    category: "Pagamentos e Finanças",
    questions: [
      { q: "Como funcionam os pagamentos das mensalidades?", a: "As mensalidades são geralmente pagas em datas fixas e podem ser realizadas por transferência bancária, depósito ou outros métodos especificados pela cooperativa. Você pode ver seu histórico e próximos vencimentos na seção 'Financeiro' do portal." },
      { q: "O que acontece se eu atrasar um pagamento?", a: "Atrasos nos pagamentos podem incorrer em juros ou multas, conforme o regulamento da cooperativa. É importante comunicar qualquer dificuldade o quanto antes. Em casos de inadimplência prolongada, sua participação pode ser revista." },
      { q: "Posso antecipar pagamentos?", a: "Geralmente sim. Consulte a administração da cooperativa para saber sobre as condições e possíveis descontos para antecipação de pagamentos." },
    ]
  },
  {
    category: "Projetos Habitacionais",
    questions: [
      { q: "Como posso participar de um projeto habitacional?", a: "A participação em projetos geralmente requer que você seja um cooperado ativo e manifeste interesse. Os critérios de seleção podem variar por projeto. Fique atento aos comunicados e à seção 'Projetos' no portal." },
      { q: "Posso escolher a unidade habitacional?", a: "A forma de atribuição de unidades (sorteio, ordem de adesão, etc.) é definida no regulamento de cada projeto. Consulte a documentação específica." },
      { q: "Qual o prazo de entrega dos projetos?", a: "Os prazos de entrega são estimativas e podem variar devido a diversos fatores. A cooperativa se esforça para manter os cooperados informados sobre o cronograma na seção 'Projetos'." },
    ]
  },
  {
    category: "Portal do Cooperado",
    questions: [
      { q: "Como atualizo meus dados cadastrais?", a: "Você pode solicitar a atualização dos seus dados através da seção 'Meu Perfil'. Algumas alterações podem requerer o envio de nova documentação." },
      { q: "Esqueci minha senha de acesso ao portal. O que faço?", a: "Na tela de login do portal, procure pela opção 'Esqueci minha senha' e siga as instruções para redefini-la." },
      { q: "Onde encontro os documentos e normas da cooperativa?", a: "Uma seção de 'Documentos e Normas' deve estar disponível no portal, contendo regimentos, atas de assembleia e outros documentos importantes." },
    ]
  }
];

const FaqItem = ({ question, answer }) => {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="text-left hover:no-underline">
        <span className="font-medium text-slate-700">{question}</span>
      </AccordionTrigger>
      <AccordionContent className="text-slate-600 leading-relaxed pt-2 pb-4">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default function PortalFAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(faqData[0].category);

  const filteredFaqData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
              item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);
  
  const currentCategoryData = filteredFaqData.find(cat => cat.category === activeCategory) || (filteredFaqData.length > 0 ? filteredFaqData[0] : null);


  return (
    <PortalLayout currentPageName="PortalFAQ">
      <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-50 min-h-full">
        <div className="text-center mb-10">
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-800">Perguntas Frequentes (FAQ)</h1>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Encontre respostas rápidas para as dúvidas mais comuns sobre a CoopHabitat e sua participação.
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Pesquisar nas perguntas e respostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg rounded-full shadow-md"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <Card className="shadow-lg sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-700">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {(filteredFaqData.length > 0 ? filteredFaqData : faqData).map(cat => ( // Mostrar todas as categorias se a busca não retornar nada
                    <Button
                      key={cat.category}
                      variant={activeCategory === cat.category && currentCategoryData ? "secondary" : "ghost"}
                      className={`w-full justify-start px-3 py-2 text-left ${activeCategory === cat.category && currentCategoryData ? 'font-semibold' : ''}`}
                      onClick={() => setActiveCategory(cat.category)}
                    >
                      {cat.category} ({cat.questions.length})
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            {currentCategoryData && currentCategoryData.questions.length > 0 ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-700">{currentCategoryData.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {currentCategoryData.questions.map((item, index) => (
                      <FaqItem key={index} question={item.q} answer={item.a} />
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-10 text-center text-slate-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-slate-700">Nenhuma pergunta encontrada.</h3>
                  <p className="mt-1">Tente um termo de busca diferente ou selecione outra categoria.</p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </PortalLayout>
  );
}