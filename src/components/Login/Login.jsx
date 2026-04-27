import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import s from './Login.module.scss';

export default function Login() {
  const { login, loading, erro } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async e => { e.preventDefault(); await login(form.email, form.senha); };

  return (
    <div className={s.page}>

      <div className={s.left}>
        <div className={s.leftInner}>
          <div className={s.logoMark}>
            <div className={s.logoIcon}>🤝</div>
            <div className={s.logoText}>Conecta<span>Solidário</span></div>
          </div>
          <h1 className={s.heroTitle}>Gestão humanitária<br /><em>em tempo real</em></h1>
          <p className={s.heroSub}>
            Plataforma de controle de abrigos, desabrigados e voluntários para situações de emergência social.
          </p>
          <div className={s.stats}>
            <div className={s.stat}><h4>24</h4><p>Abrigos</p></div>
            <div className={s.stat}><h4>312</h4><p>Assistidos</p></div>
            <div className={s.stat}><h4>89</h4><p>Voluntários</p></div>
          </div>
        </div>
      </div>

      <div className={s.right}>
        <form className={s.formWrap} onSubmit={submit}>
          <h2 className={s.formTitle}>Entrar no sistema</h2>
          <p className={s.formSub}>Acesso restrito a administradores</p>

          {erro && <div className={s.erroBox}>⚠ {erro}</div>}

          <div className={s.formGroup}>
            <label>E-mail</label>
            <input className={s.input} type="email" name="email"
              placeholder="admin@email.com" value={form.email}
              onChange={handle} required disabled={loading} />
          </div>
          <div className={s.formGroup}>
            <label>Senha</label>
            <input className={s.input} type="password" name="senha"
              placeholder="••••••••" value={form.senha}
              onChange={handle} required disabled={loading} />
          </div>

          <button className={s.submit} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
          <div className={s.divider}>acesso administrativo</div>
        </form>
      </div>
    </div>
  );
}
