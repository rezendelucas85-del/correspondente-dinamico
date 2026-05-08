import { Link } from 'react-router-dom'
import { Search, Plus, UserPlus, Scale, Shield, MessageSquare, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import DemandCard from '../components/DemandCard'
import { mockDemandas } from '../data/mock'

export default function HomePage() {
  const { setShowCadastro } = useAuth()

  const latestDemandas = mockDemandas.slice(0, 3)

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-red-100 rounded-full px-4 py-1.5 text-xs font-semibold text-[#8b1a1a] mb-8 shadow-sm">
            <Scale className="w-3.5 h-3.5" />
            MARKETPLACE JURIDICO NACIONAL
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Correspondencia juridica
          </h1>
          <h2 className="text-5xl font-bold italic text-[#8b1a1a] mb-6 leading-tight">
            inteligente e segura
          </h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Conectamos advogados contratantes a correspondentes e prepostos verificados em todo o Brasil — com pagamento garantido, chat interno e taxa transparente.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/demandas" className="btn-primary flex items-center gap-2">
              <Search className="w-4 h-4" />
              Ver Demandas
            </Link>
            <Link to="/publicar" className="btn-outline flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Publicar Demanda
            </Link>
            <button
              onClick={() => setShowCadastro(true)}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Criar Conta Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[
            { value: '1.200+', label: 'Executores cadastrados' },
            { value: '340+', label: 'Demandas publicadas' },
            { value: '98%', label: 'Taxa de conclusao' },
            { value: '4.9★', label: 'Avaliacao media' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Value proposition */}
      <section className="py-12 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <Scale className="w-8 h-8 text-[#8b1a1a] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Valorizando a Advocacia Correspondente</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                O profissional que atende sua demanda comparece pessoalmente ao ato judicial, representando seus clientes com{' '}
                <strong>eficiencia, comprometimento, dedicacao, boa apresentacao pessoal e cumprimento rigoroso de horario.</strong>
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                A qualidade do servico prestado esta diretamente relacionada ao valor ofertado.{' '}
                <strong>Quanto melhor a remuneracao, melhor a experiencia e o cuidado dedicados a sua demanda.</strong>{' '}
                Valorize o trabalho do profissional correspondente — ele e a extensao do seu escritorio em cada comarca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que usar a <span className="text-[#8b1a1a]">Audiencias Connect</span>?
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Pagamento Garantido',
                desc: 'A plataforma retém 10% como garantia. O executor recebe mesmo em caso de inadimplência do contratante.',
              },
              {
                icon: MessageSquare,
                title: 'Chat Interno',
                desc: 'Comunicação direta e segura entre contratante e executor dentro da plataforma.',
              },
              {
                icon: Star,
                title: 'Executores Verificados',
                desc: 'Todos os advogados e prepostos são verificados com OAB ativa e dados conferidos.',
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-[#8b1a1a]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest demands */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Ultimas <span className="text-[#8b1a1a]">Demandas</span>
            </h2>
            <Link to="/demandas" className="text-sm text-[#8b1a1a] font-medium hover:underline">
              Ver todas &rsaquo;
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {latestDemandas.map((d) => (
              <DemandCard key={d.id} demanda={d} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#8b1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para comecar?
          </h2>
          <p className="text-red-100 mb-8">
            Crie sua conta gratuitamente e acesse centenas de demandas em todo o Brasil.
          </p>
          <button
            onClick={() => setShowCadastro(true)}
            className="bg-white text-[#8b1a1a] px-8 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
          >
            Criar Conta Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#8b1a1a]" />
            <span className="text-sm font-medium text-white">Audiencias Connect</span>
          </div>
          <p className="text-xs">© 2025 Audiencias Connect. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
