import { useState } from 'react';
import { useDesabrigados } from '../../hooks';
import s from './Desabrigados.module.scss';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('pt-BR');
}

export default function Desabrigados() {
  const { desabrigados, loading, erro, registrarSaida } = useDesabrigados();
  const [saindo, setSaindo] = useState(null);

  const handleSaida = async (id) => {
    if (!confirm('Registrar saída desta pessoa?')) return;
    setSaindo(id);
    const r = await registrarSaida(id);
    if (!r.sucesso) alert('Erro: ' + r.erro);
    setSaindo(null);
  };

  if (loading) return (
    <div className={s.page}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            height: 64, borderRadius: 10,
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
        <h2 className={s.pageTitle}>Desabrigados <span>em abrigo</span></h2>
        <button className={s.btnPrimary}>＋ Registrar entrada</button>
      </div>

      {erro && <div style={{ color: '#dc2626', marginBottom: 16 }}>⚠ {erro}</div>}

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Nome / Contato</th>
              <th>Pessoas</th>
              <th>Abrigo</th>
              <th>Entrada</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {desabrigados.map((d, i) => (
              <tr key={d.id} className={`delay-${Math.min(i + 1, 7)}`}>
                <td>
                  <div className={s.nome}>{d.nome}</div>
                  <div className={s.tel}>📞 {d.telefone}</div>
                </td>
                <td>
                  <div className={s.pessoas}>
                    <span>{d.num_pessoas}</span>
                    <small>{d.num_pessoas === 1 ? 'pessoa' : 'pessoas'}</small>
                  </div>
                </td>
                <td>
                  <span className={s.abrigoBadge}>🏠 {d.abrigo_nome || `Abrigo #${d.abrigo_id}`}</span>
                </td>
                <td className={s.data}>{fmtDate(d.entrada_em)}</td>
                <td>
                  <button
                    className={s.saidaBtn}
                    disabled={saindo === d.id}
                    onClick={() => handleSaida(d.id)}
                  >
                    {saindo === d.id ? 'Registrando...' : 'Registrar saída →'}
                  </button>
                </td>
              </tr>
            ))}
            {!desabrigados.length && (
              <tr><td colSpan={5} className={s.empty}>Nenhum desabrigado registrado no momento</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
