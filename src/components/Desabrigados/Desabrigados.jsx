import { useState } from 'react';
import { useDesabrigados } from '../../hooks';
import s from './Desabrigados.module.scss';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('pt-BR');
}

const FORM_VAZIO = { nome: '', telefone: '', num_pessoas: '', abrigo_id: '' };

function ModalEntrada({ onSalvar, onFechar, salvando }) {
  const [form, setForm] = useState(FORM_VAZIO);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = e => { e.preventDefault(); onSalvar(form); };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg, #fff)', borderRadius: 16, padding: 32,
        width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.18)'
      }}>
        <h3 style={{ margin: '0 0 20px' }}>Registrar entrada</h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'nome',        label: 'Nome completo',   type: 'text'   },
            { name: 'telefone',    label: 'Telefone',        type: 'text'   },
            { name: 'num_pessoas', label: 'Nº de pessoas',   type: 'number' },
            { name: 'abrigo_id',   label: 'ID do abrigo',    type: 'number' },
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
            <button type="button" onClick={onFechar}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer', background: 'none' }}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              {salvando ? 'Salvando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalConfirm({ nome, onConfirmar, onCancelar }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg, #fff)', borderRadius: 16, padding: 32,
        width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', textAlign: 'center'
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🚪</div>
        <h3 style={{ margin: '0 0 8px' }}>Registrar saída</h3>
        <p style={{ color: '#666', marginBottom: 24 }}>Confirmar saída de <strong>{nome}</strong>?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancelar}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer', background: 'none' }}>
            Cancelar
          </button>
          <button onClick={onConfirmar}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            Confirmar saída
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Desabrigados({ search = '' }) {
  const { desabrigados, loading, erro, registrarEntrada, registrarSaida } = useDesabrigados();
  const [saindo,        setSaindo]        = useState(null);
  const [confirmando,   setConfirmando]   = useState(null);   
  const [modalEntrada,  setModalEntrada]  = useState(false);
  const [salvando,      setSalvando]      = useState(false);
  const [erroAcao,      setErroAcao]      = useState(null);

  const handleEntrada = async (form) => {
    setSalvando(true);
    const payload = { ...form, num_pessoas: Number(form.num_pessoas), abrigo_id: Number(form.abrigo_id) };
    const r = await registrarEntrada(payload);
    setSalvando(false);
    if (!r.sucesso) { setErroAcao('Erro ao registrar entrada: ' + r.erro); return; }
    setModalEntrada(false);
  };

  const handleSaida = async () => {
    if (!confirmando) return;
    setSaindo(confirmando.id);
    setConfirmando(null);
    const r = await registrarSaida(confirmando.id);
    if (!r.sucesso) setErroAcao('Erro ao registrar saída: ' + r.erro);
    setSaindo(null);
  };
  const filtrados = desabrigados.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.nome.toLowerCase().includes(q) || (d.abrigo_nome || '').toLowerCase().includes(q);
  });

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
      {modalEntrada && (
        <ModalEntrada
          onSalvar={handleEntrada}
          onFechar={() => setModalEntrada(false)}
          salvando={salvando}
        />
      )}
      {confirmando && (
        <ModalConfirm
          nome={confirmando.nome}
          onConfirmar={handleSaida}
          onCancelar={() => setConfirmando(null)}
        />
      )}

      <div className={s.topBar}>
        <h2 className={s.pageTitle}>Desabrigados <span>em abrigo</span></h2>
        {}
        <button className={s.btnPrimary} onClick={() => setModalEntrada(true)}>＋ Registrar entrada</button>
      </div>

      {(erro || erroAcao) && (
        <div style={{ color: '#dc2626', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span>⚠ {erro || erroAcao}</span>
          <button onClick={() => setErroAcao(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

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
            {filtrados.map((d, i) => (
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
                  {}
                  <button
                    className={s.saidaBtn}
                    disabled={saindo === d.id}
                    onClick={() => setConfirmando(d)}
                  >
                    {saindo === d.id ? 'Registrando...' : 'Registrar saída →'}
                  </button>
                </td>
              </tr>
            ))}
            {!filtrados.length && (
              <tr><td colSpan={5} className={s.empty}>Nenhum desabrigado registrado no momento</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}