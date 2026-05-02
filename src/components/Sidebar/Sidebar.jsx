import s from './Sidebar.module.scss';

const NAV = [
  { section: 'Principal' },
  { id: 'dashboard',    icon: '📊', label: 'Dashboard' },
  { section: 'Gestão' },
  { id: 'abrigos',      icon: '🏠', label: 'Abrigos' },
  { id: 'desabrigados', icon: '👥', label: 'Desabrigados' },
  { id: 'voluntarios',  icon: '🙋', label: 'Voluntários' },
  { section: 'Sistema' },
  { id: 'relatorios',   icon: '📄', label: 'Relatórios' },
];


export default function Sidebar({ active, onNavigate, collapsed, onToggle, onLogout, totalDesabrigados }) {
  return (
    <aside className={`${s.sidebar} ${collapsed ? s.collapsed : ''}`}>
      <div className={s.logo} onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }}>
        <div className={s.logoIcon}>🤝</div>
        <div className={s.logoText}>Conecta<span>Sol.</span></div>
      </div>

      <nav className={s.nav}>
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} className={s.sectionTitle}>{item.section}</div>
          ) : (
            <div
              key={item.id}
              className={`${s.item} ${active === item.id ? s.active : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className={s.icon}>{item.icon}</span>
              <span className={s.label}>{item.label}</span>
              {}
              {item.id === 'desabrigados' && totalDesabrigados > 0 && (
                <span className={s.badge}>{totalDesabrigados}</span>
              )}
            </div>
          )
        )}
      </nav>

      <div className={s.footer}>
        <div className={s.userCard}>
          <div className={s.avatar}>AD</div>
          <div className={s.userInfo}>
            <h5>Administrador</h5>
            <p>admin@sistema.com</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {}
            <button className={s.logoutBtn} onClick={onToggle} title="Recolher menu">
              {collapsed ? '→' : '←'}
            </button>
            <button className={s.logoutBtn} onClick={onLogout} title="Sair do sistema" style={{ fontSize: 14 }}>
            ⏻
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}