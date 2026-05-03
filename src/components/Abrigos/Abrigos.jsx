import { useState } from 'react';
import { useAbrigos } from '../../hooks';
import s from './Abrigos.module.scss';

const FILTERS = ['Todos', 'Ativos', 'Inativos', 'Urgentes'];

function getStatus(a) {
  const p = pct(a);
  if (!a.ativo)  return { label: 'Inativo',    cls: 'inactive' };
  if (p >= 90)   return { label: '🔥 Urgente', cls: 'urgent'   };
  return               { label: '● Ativo',    cls: 'active'   };
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

const FORM_VAZIO = { nome: '', endereco: '', cidade: '', telefone: '', capacidade: '', vagas_livres: '' };

function Modal({ inicial, onSalvar, onFechar, salvando }) {
  const [form, setForm] = useState(inicial || FORM_VAZIO);
  const editando = Boolean(inicial?.id);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = e => { e.preventDefault(); onSalvar(form); };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg, #fff)', borderRadius: 16, padding: 32,
        width: '100%', maxWidth: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.18)'
      }}>
        <h3 style={{ margin: '0 0 20px' }}>{editando ? 'Editar abrigo' : 'Novo abrigo'}</h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'nome',        label: 'Nome',         type: 'text'   },
            { name: 'endereco',    label: 'Endereço',     type: 'text'   },
            { name: 'cidade',      label: 'Cidade',       type: 'text'   },
            { name: 'telefone',    label: 'Telefone',     type: 'number'   },
            { name: 'capacidade',  label: 'Capacidade',   type: 'number' },
            { name: 'vagas_livres',label: 'Vagas livres', type: 'number' },
          ].map(f => (
            <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 500 }}>{f.label}</label>
              <input
                name={f.name} type={f.type} value={form[f.name]}
                onChange={handle} required
                style={{
                  border: '1px solid #ddd', borderRadius: 8,
                  padding: '8px 12px', fontSize: 14
                }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              type="button" onClick={onFechar}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer', background: 'none' }}
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={salvando}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >
              {salvando ? 'Salvando...' : editando ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function Abrigos({ search = '' }) {
  const { abrigos, loading, erro, criar, atualizar, deletar } = useAbrigos();
  const [filter,    setFilter]    = useState('Todos');
  const [deletando, setDeletando] = useState(null);
  const [modal,     setModal]     = useState(null);
  const [salvando,  setSalvando]  = useState(false);

  const handleDeletar = async (id) => {
    if (!confirm('Excluir este abrigo?')) return;
    setDeletando(id);
    const r = await deletar(id);
    if (!r.sucesso) alert('Erro: ' + r.erro);
    setDeletando(null);
  };

  const handleSalvar = async (form) => {
    setSalvando(true);
    const payload = {
      ...form,
      capacidade:   Number(form.capacidade),
      vagas_livres: Number(form.vagas_livres),
    };
    const r = modal?.id
      ? await atualizar(modal.id, payload)
      : await criar(payload);
    setSalvando(false);
    if (!r.sucesso) { alert('Erro: ' + r.erro); return; }
    setModal(null);
  };

  const filtrados = abrigos
    .filter(a => {
      if (filter === 'Ativos')   return a.ativo;
      if (filter === 'Inativos') return !a.ativo;
      if (filter === 'Urgentes') return pct(a) >= 90;
      return true;
    }).filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return a.nome.toLowerCase().includes(q) || a.cidade.toLowerCase().includes(q);
    });

  return (
    <div className={s.page}>
      {modal !== null && (
        <Modal
          inicial={modal === 'novo' ? null : modal}
          onSalvar={handleSalvar}
          onFechar={() => setModal(null)}
          salvando={salvando}
        />
      )}
      <div className={s.topBar}>
        <h2 className={s.pageTitle}>Abrigos <span>cadastrados</span></h2>
        {}
        <button className={s.btnPrimary} onClick={() => setModal('novo')}>＋ Novo abrigo</button>
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
                        {}
                        <button className={`${s.iconBtn} ${s.edit}`} onClick={() => setModal(a)}>✏️</button>
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