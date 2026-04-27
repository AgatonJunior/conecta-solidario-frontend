import { useState } from 'react';
import { useAbrigos } from '../../hooks';
import s from './Abrigos.module.scss';

const FILTERS = ['Todos', 'Ativos', 'Inativos', 'Urgentes'];

function getStatus(a) {
  const pct = ((a.capacidade - a.vagas_livres) / a.capacidade) * 100;
  if (!a.ativo)  return { label: 'Inativo', cls: 'inactive' };
  if (pct >= 90) return { label: '🔥 Urgente', cls: 'urgent' };
  return               { label: '● Ativo',  cls: 'active'  };
}

function pct(a) {
  return Math.min(100, Math.round(((a.capacidade - a.vagas_livres) / a.capacidade) * 100));
}

function Skeleton() {
  return (
    <div className={s.tableWrap} style={{ padding: 24 }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          height: 56, borderRadius: 8, marginBottom: 8,
          background: 'linear-gradient(90deg, #e8dcc8 25%, #f0e8d8 50%, #e8dcc8 75%)',
          backgroundSize: '200% 100%',
          animation: `shimmer 1.5s ease-in-out ${i * 0.1}s infinite`,
          opacity: 1 - i * 0.12,
        }} />
      ))}
    </div>
  );
}

export default function Abrigos() {
  const { abrigos, loading, erro, deletar } = useAbrigos();
  const [filter,    setFilter]    = useState('Todos');
  const [deletando, setDeletando] = useState(null);

  const handleDeletar = async (id) => {
    if (!confirm('Excluir este abrigo?')) return;
    setDeletando(id);
    const r = await deletar(id);
    if (!r.sucesso) alert('Erro: ' + r.erro);
    setDeletando(null);
  };

  const filtrados = abrigos.filter(a => {
    if (filter === 'Ativos')   return a.ativo;
    if (filter === 'Inativos') return !a.ativo;
    if (filter === 'Urgentes') return pct(a) >= 90;
    return true;
  });

  return (
    <div className={s.page}>
      <div className={s.topBar}>
        <h2 className={s.pageTitle}>Abrigos <span>cadastrados</span></h2>
        <button className={s.btnPrimary}>＋ Novo abrigo</button>
      </div>

      <div className={s.filterBar}>
        {FILTERS.map(f => (
          <button key={f} className={`${s.chip} ${filter === f ? s.active : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {erro && <div style={{ color: '#dc2626', marginBottom: 16 }}>⚠ {erro}</div>}
      {loading ? <Skeleton /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Abrigo</th>
                <th>Capacidade</th>
                <th>Ocupação</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((a, i) => {
                const st = getStatus(a);
                const p  = pct(a);
                return (
                  <tr key={a.id} className={`delay-${Math.min(i + 1, 7)}`}>
                    <td>
                      <div className={s.abrigoNome}>{a.nome}</div>
                      <div className={s.abrigoCidade}>📍 {a.cidade}</div>
                    </td>
                    <td>{a.capacidade} vagas</td>
                    <td className={s.progCell}>
                      <div className={s.progBar}>
                        <div className={`${s.progFill} ${p >= 90 ? s.full : p >= 75 ? s.high : ''}`} style={{ width: `${p}%` }} />
                      </div>
                      <div className={s.progMeta}>
                        <span>{p}% ocupado</span>
                        <span>{a.vagas_livres} livres</span>
                      </div>
                    </td>
                    <td><span className={`${s.badge} ${s[st.cls]}`}>{st.label}</span></td>
                    <td>
                      <div className={s.rowActions}>
                        <button className={`${s.iconBtn} ${s.edit}`}>✏️</button>
                        <button className={`${s.iconBtn} ${s.delete}`} disabled={deletando === a.id} onClick={() => handleDeletar(a.id)}>
                          {deletando === a.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtrados.length && <tr><td colSpan={5} className={s.empty}>Nenhum abrigo encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
