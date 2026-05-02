import s from './Navbar.module.scss';

const TITLES = {
  dashboard:    'Dashboard',
  abrigos:      'Abrigos',
  desabrigados: 'Desabrigados',
  voluntarios:  'Voluntários',
  relatorios:   'Relatórios',
};

export default function Navbar({ page, search, onSearch }) {
  return (
    <header className={s.navbar}>
      <div className={s.left}>
        <h1 className={s.pageTitle}>{TITLES[page] || 'Dashboard'}</h1>
      </div>
      <div className={s.right}>
        <div className={s.searchBar}>
          <span>🔍</span>
          <input
            placeholder="Buscar..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <button className={s.notifBtn}>
          🔔<span className={s.dot} />
        </button>
        <div className={s.userChip}>
          <div className={s.chipAvatar}>AD</div>
          <span className={s.chipName}>Admin</span>
        </div>
      </div>
    </header>
  );
}