import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.scss';
import s from './Layout.module.scss';

import Sidebar      from './components/Sidebar/Sidebar';
import Navbar       from './components/Navbar/Navbar';
import Dashboard    from './components/Dashboard/Dashboard';
import Abrigos      from './components/Abrigos/Abrigos';
import Voluntarios  from './components/Voluntarios/Voluntarios';
import Desabrigados from './components/Desabrigados/Desabrigados';
import Login        from './components/Login/Login';

const PAGES = {
  dashboard:    Dashboard,
  abrigos:      Abrigos,
  voluntarios:  Voluntarios,
  desabrigados: Desabrigados,
};

function AppInner() {
  const { logado, logout } = useAuth();
  const [page,      setPage]      = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [search,    setSearch]    = useState('');

  if (!logado) return <Login />;

  const Page = PAGES[page] || Dashboard;

  return (
    <div className={s.layout}>
      {}
      <Sidebar
        active={page}
        onNavigate={(p) => { setPage(p); setSearch(''); }}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        onLogout={logout}
      />
      <main className={`${s.main} ${collapsed ? s.collapsed : ''}`}>
        {}
        <Navbar page={page} search={search} onSearch={setSearch} />
        <div className={s.content}>
          <Page search={search} />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}