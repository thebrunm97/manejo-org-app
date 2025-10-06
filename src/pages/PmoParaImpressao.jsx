import React from 'react';

// Este componente é apenas um template visual.
const PmoParaImpressao = ({ pmoData }) => {
  if (!pmoData) return null; // Não renderiza nada se não houver dados.

  const dadosCadastrais = pmoData.form_data?.secao_1_descricao_propriedade?.dados_cadastrais || {};

  return (
    // Adicionamos a classe 'only-print' para controlar sua visibilidade com CSS.
    <div className="only-print">
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Plano de Manejo Orgânico</h1>
        <h2>{pmoData.nome_identificador}</h2>
      </header>
      <section>
        <h3>1. Descrição da Propriedade</h3>
        <hr />
        <h4>1.1 Dados Cadastrais</h4>
        <p><strong>Nome do Produtor:</strong> {dadosCadastrais.nome_produtor}</p>
        <p><strong>CPF:</strong> {dadosCadastrais.cpf}</p>
        <p><strong>Endereço:</strong> {dadosCadastrais.endereco_propriedade_base_fisica_produtiva}</p>
      </section>
      <footer style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', fontSize: '12px' }}>
        <p>Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
      </footer>
    </div>
  );
};

export default PmoParaImpressao;