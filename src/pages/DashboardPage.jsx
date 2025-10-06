// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // MUDANÇA 1: Importa o Supabase
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { logout } = useAuth();
  const [pmos, setPmos] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Começa como true para mostrar o carregamento inicial
  const navigate = useNavigate();

  useEffect(() => {
    // MUDANÇA 2: A função de busca agora usa Supabase
    const handleListPmos = async () => {
      setIsLoading(true);
      setStatusMessage('Buscando seus Planos de Manejo...');
      
      try {
        // 'from('pmos')' -> seleciona a tabela 'pmos'
        // 'select('*')' -> seleciona todas as colunas
        const { data, error } = await supabase.from('pmos').select('*');

        if (error) {
          // Se o Supabase retornar um erro, nós o lançamos para o catch
          throw error;
        }

        setPmos(data);
        if (data.length > 0) {
            setStatusMessage(`Encontrado(s) ${data.length} PMO(s).`);
        } else {
            setStatusMessage('Nenhum PMO encontrado. Clique em "Criar Novo PMO" para começar!');
        }

      } catch (err) {
        setStatusMessage('Falha ao buscar os Planos de Manejo.');
        console.error("Erro ao buscar PMOs:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleListPmos();
  }, []);

  const handleCreateNew = () => {
    navigate('/pmo/novo');
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="5">Carregando...</td>
        </tr>
      );
    }

    if (pmos.length === 0) {
      return (
        <tr>
          <td colSpan="5">Nenhum PMO encontrado.</td>
        </tr>
      );
    }

    return pmos.map(pmo => (
      <tr key={pmo.id}>
        <td><strong>{pmo.nome_identificador}</strong></td>
        <td><span className={`badge bg-${pmo.status === 'APROVADO' ? 'success' : 'secondary'}`}>{pmo.status}</span></td>
        <td>{pmo.version}</td>
        {/* MUDANÇA 3: Usando 'created_at' que vem do Supabase por padrão */}
        <td>{new Date(pmo.created_at).toLocaleDateString('pt-BR')}</td>
        <td>
          <Link to={`/pmo/${pmo.id}`} className="btn btn-sm btn-info">Ver Detalhes</Link>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'green' }}>Painel de Controle</h1>
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </div>
      
      <p><i>{statusMessage}</i></p>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Meus Planos de Manejo</h3>
          <button onClick={handleCreateNew} className="btn btn-primary">Criar Novo PMO</button>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Nome do Plano</th>
                <th>Status</th>
                <th>Versão</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {renderTableContent()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;