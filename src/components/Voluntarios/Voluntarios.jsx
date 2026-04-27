import { useVoluntarios } from '../../hooks';
import s from './Voluntarios.module.scss';

const COLORS = ['c0', 'c1', 'c2', 'c3'];

export default function Voluntarios() {
  const { voluntarios, loading, erro, alterarDisponibilidade } = useVoluntarios();

  const handleToggle = async (v) => {
    await alterarDisponibilidade(v.id, !v.disponivel);
  };

  if (loading) return (
    <div className={s.page}>
      <div className={s.grid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            height: 200, borderRadius: 16,
            background: 'linear-gradient(90deg, #e8dcc8 25%, #f0e8d8 50%, #e8dcc8 75%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.5s ease-in-out ${i * 0.1}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={s.page}>
      <div className={s.topBar}>
        <h2 className={s.pageTitle}>Voluntários <span>ativos</span></h2>
        <button className={s.btnPrimary}>＋ Novo voluntário</button>
      </div>

      {erro && <div style={{ color: '#dc2626', marginBottom: 16 }}>⚠ {erro}</div>}

      <div className={s.grid}>
        {voluntarios.map((v, i) => (
          <div key={v.id} className={s.card} style={{ animationDelay: `${i * 65}ms` }}>
            <div className={s.cardTop}>
              <div className={`${s.avatar} ${s[COLORS[i % 4]]}`}>
                {v.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span className={`${s.availBadge} ${v.disponivel ? s.yes : s.no}`}>
                {v.disponivel ? '● Disponível' : '○ Indisponível'}
              </span>
            </div>

            <div className={s.name}>{v.nome}</div>
            <div className={s.meta}>📍 {v.cidade}</div>

            {v.habilidades?.length > 0 && (
              <div className={s.skills}>
                {v.habilidades.map((h, j) => <span key={j} className={s.skill}>{h}</span>)}
              </div>
            )}

            <div className={s.cardFooter}>
              <span className={s.contact}>✉ {v.email}</span>
              <button
                className={`${s.toggleBtn} ${v.disponivel ? s.disponivel : s.indisponivel}`}
                onClick={() => handleToggle(v)}
              >
                {v.disponivel ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
