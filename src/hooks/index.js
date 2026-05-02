import { useState, useEffect, useCallback, useRef } from 'react';
import { abrigosService } from '../services/abrigosService';
import { voluntariosService } from '../services/voluntariosService';
import { desabrigadosService } from '../services/desabrigadosService';
import { dashboardService } from '../services/dashboardService';


export function useAbrigos() {
  const [abrigos, setAbrigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const buscar = useCallback(async () => {
    setLoading(true); setErro(null);
    try { setAbrigos(await abrigosService.listar()); }
    catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { buscar(); }, [buscar]);

  const criar = async (a) => { try { const c = await abrigosService.criar(a); setAbrigos(p => [...p, c]); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };
  const atualizar = async (id, a) => { try { const u = await abrigosService.atualizar(id, a); setAbrigos(p => p.map(x => x.id === id ? u : x)); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };
  const deletar = async (id) => { try { await abrigosService.deletar(id); setAbrigos(p => p.filter(x => x.id !== id)); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };

  return { abrigos, loading, erro, buscar, criar, atualizar, deletar };
}


export function useVoluntarios() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const buscar = useCallback(async () => {
    setLoading(true); setErro(null);
    try { setVoluntarios(await voluntariosService.listar()); }
    catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { buscar(); }, [buscar]);

  const criar = async (v) => { try { const c = await voluntariosService.criar(v); setVoluntarios(p => [...p, c]); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };
  const atualizar = async (id, v) => { try { const u = await voluntariosService.atualizar(id, v); setVoluntarios(p => p.map(x => x.id === id ? u : x)); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };
  const alterarDisponibilidade = async (id, disp) => { try { const u = await voluntariosService.alterarDisponibilidade(id, disp); setVoluntarios(p => p.map(x => x.id === id ? u : x)); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };
  const deletar = async (id) => { try { await voluntariosService.deletar(id); setVoluntarios(p => p.filter(x => x.id !== id)); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };

  return { voluntarios, loading, erro, buscar, criar, atualizar, alterarDisponibilidade, deletar };
}


export function useDesabrigados() {
  const [desabrigados, setDesabrigados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const buscar = useCallback(async () => {
    setLoading(true); setErro(null);
    try { setDesabrigados(await desabrigadosService.listar()); }
    catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { buscar(); }, [buscar]);

  const registrarEntrada = async (d) => { try { const n = await desabrigadosService.registrarEntrada(d); setDesabrigados(p => [n, ...p]); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };
  const registrarSaida = async (id) => { try { await desabrigadosService.registrarSaida(id); setDesabrigados(p => p.filter(x => x.id !== id)); return { sucesso: true }; } catch (e) { return { sucesso: false, erro: e.message }; } };

  return { desabrigados, loading, erro, buscar, registrarEntrada, registrarSaida };
}


export function useDashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const buscar = useCallback(async () => {
    setLoading(true); setErro(null);
    try { setKpis(await dashboardService.obterKpis()); }
    catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    buscar();
    const intervalRef = { current: null };
    intervalRef.current = setInterval(buscar, 30000);
    return () => clearInterval(intervalRef.current);
  }, [buscar]);

  return { kpis, loading, erro, buscar };
}