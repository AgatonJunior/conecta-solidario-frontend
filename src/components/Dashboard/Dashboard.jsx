import { useDashboard } from '../../hooks';
import s from './Dashboard.module.scss';

const BARS = [
  { h: '42%', c: 'barAlt',  l: 'Jan' },
  { h: '65%', c: 'barMain', l: 'Fev' },
  { h: '38%', c: 'barAlt',  l: 'Mar' },
  { h: '80%', c: 'barMain', l: 'Abr' },
  { h: '55%', c: 'barAlt',  l: 'Mai' },
  { h: '92%', c: 'barWarn', l: 'Jun' },
];

const ACTIVITY = [
  { text: 'Novo abrigo cadastrado — Casa da Graça SP', time: '2min',  color: 'green'  },
  { text: 'Família de 4 pessoas registrada — Abrigo 7', time: '15min', color: 'orange' },
  { text: 'Voluntário Carlos marcado como disponível',  time: '1h',   color: 'green'  },
  { text: 'Meta de vagas atingida — Setor Norte',       time: '3h',   color: 'green'  },
  { text: 'Saída registrada — João Silva, 2 pessoas',   time: '5h',   color: 'orange' },
];

function SkeletonKpi() {
  return (
    <div className={s.kpiGrid}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`${s.kpiCard} ${s.green}`} style={{
          background: 'linear-gradient(90deg, #e8dcc8 25%, #f0e8d8 50%, #e8dcc8 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
          minHeight: 120,
        }} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { kpis, loading, erro, buscar } = useDashboard();

  const KPIS = kpis ? [
    { icon: '🏠', label: 'Abrigos Ativos',      value: kpis.total_abrigos_ativos,          delta: '↑ ativo',  trend: 'up',  color: 'green'  },
    { icon: '👥', label: 'Desabrigados Atual',   value: kpis.total_desabrigados_atual,       delta: '↑ hoje',   trend: 'up',  color: 'orange' },
    { icon: '🙋', label: 'Voluntários Disp.',    value: kpis.total_voluntarios_disponiveis,  delta: 'disponíveis', trend: 'neu', color: 'teal'   },
    { icon: '🛏️', label: 'Vagas Livres',         value: kpis.total_vagas_livres,             delta: '↑ vagas',  trend: 'up',  color: 'purple' },
  ] : [];

  return (
    <div className={s.page}>
      {erro && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 20px', borderRadius: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <span>⚠ {erro}</span>
          <button onClick={buscar} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer' }}>Tentar novamente</button>
        </div>
      )}

      {loading ? <SkeletonKpi /> : (
        <div className={s.kpiGrid}>
          {KPIS.map((k, i) => (
            <div key={i} className={`${s.kpiCard} ${s[k.color]} delay-${i + 1}`}>
              <div className={s.kpiTop}>
                <div className={s.kpiIcon}>{k.icon}</div>
                <span className={`${s.kpiDelta} ${s[k.trend]}`}>{k.delta}</span>
              </div>
              <div className={s.kpiValue}>{k.value ?? '—'}</div>
              <div className={s.kpiLabel}>{k.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className={s.grid2}>
        <div className={`${s.widget} delay-5`}>
          <div className={s.widgetHeader}>
            <h3>Desabrigados por mês</h3>
            <span className={s.wBadge}>2025</span>
          </div>
          <div className={s.chartWrap}>
            {BARS.map((b, i) => (
              <div key={i} className={`${s.bar} ${s[b.c]}`} style={{ height: b.h }} />
            ))}
          </div>
          <div className={s.chartLabels}>
            {BARS.map((b, i) => <span key={i}>{b.l}</span>)}
          </div>
        </div>

        <div className={`${s.widget} delay-6`}>
          <div className={s.widgetHeader}><h3>Atividade recente</h3></div>
          <div className={s.actList}>
            {ACTIVITY.map((a, i) => (
              <div key={i} className={s.actItem}>
                <span className={`${s.actDot} ${s[a.color]}`} />
                <div className={s.actText}><p>{a.text}</p></div>
                <span className={s.actTime}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
