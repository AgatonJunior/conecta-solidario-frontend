import { useState } from 'react';
import { useVoluntarios } from '../../hooks';
import s from './Voluntarios.module.scss';

const COLORS = ['c0', 'c1', 'c2', 'c3'];
const FORM_VAZIO = { nome: '', email: '', telefone: '', cidade: '', disponivel: true, habilidades_ids: [] };

function ModalVoluntario({ onSalvar, onFechar, salvando }) {
  const [form, setForm] = useState(FORM_VAZIO);
  const handle = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  };
  const submit = e => {
    e.preventDefault();
    onSalvar({ ...form, habilidades_ids: [] });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg, #fff)', borderRadius: 16, padding: 32,
        width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.18)'
      }}>
        <h3 style={{ margin: '0 0 20px' }}>Novo voluntário</h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'nome',     label: 'Nome completo', type: 'text'  },
            { name: 'email',    label: 'E-mail',         type: 'email' },
            { name: 'telefone', label: 'Telefone',       type: 'text'  },
            { name: 'cidade',   label: 'Cidade',         type: 'text'  },
          ].map(f => (
            <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 500 }}>{f.label}</label>
              <input name={f.name} type={f.type} value={form[f.name]}
                onChange={handle} required
                style={{ border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 14 }} />
            </div>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" name="disponivel" checked={form.disponivel} onChange={handle} />
            Disponível para atendimento
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="button" onClick={onFechar}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer', background: 'none' }}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Voluntarios({ search = '' }) {
  const { voluntarios, loading, erro, criar, alterarDisponibilidade } = useVoluntarios();
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando,    setSalvando]    = useState(false);
  const [erroAcao,    setErroAcao]    = useState(null);

  const handleToggle = async (v) => {
    const r = await alterarDisponibilidade(v.id, !v.disponivel);
    if (!r.sucesso) setErroAcao('Erro ao alterar disponibilidade: ' + r.erro);
  };

  const handleCriar = async (form) => {
    setSalvando(true);
    const r = await criar(form);
    setSalvando(false);
    if (!r.sucesso) { setErroAcao('Erro ao cadastrar: ' + r.erro); return; }
    setModalAberto(false);
  };

  const filtrados = voluntarios.filter(v => {
    if (!search) return true;
    const q = search.toLowerCase();
    return v.nome.toLowerCase().includes(q) || v.cidade.toLowerCase().includes(q);
  });

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
      {modalAberto && (
        <ModalVoluntario
          onSalvar={handleCriar}
          onFechar={() => setModalAberto(false)}
          salvando={salvando}
        />
      )}

      <div className={s.topBar}>
        <h2 className={s.pageTitle}>Voluntários <span>ativos</span></h2>
        {}
        <button className={s.btnPrimary} onClick={() => setModalAberto(true)}>＋ Novo voluntário</button>
      </div>

      {(erro || erroAcao) && (
        <div style={{ color: '#dc2626', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span>⚠ {erro || erroAcao}</span>
          <button onClick={() => setErroAcao(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div className={s.grid}>
        {filtrados.map((v, i) => (
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

            {}
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
        {!filtrados.length && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: 40 }}>
            Nenhum voluntário encontrado
          </div>
        )}
      </div>
    </div>
  );
}