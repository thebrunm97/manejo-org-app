// src/components/PmoForm/Secao18.jsx (versão com bug do botão 'Remover' corrigido)

import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

function Secao18({ data, onSectionChange }) {
  const safeData = data || {};
  const anexos = Array.isArray(safeData.lista_anexos) ? safeData.lista_anexos : [];

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [pendingAnexo, setPendingAnexo] = useState(null);
  const { user } = useAuth();

  const handleFileUpload = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        // Esta verificação agora só deve ser acionada se o usuário cancelar o seletor de arquivos.
        throw new Error('Você precisa selecionar um arquivo para fazer o upload.');
      }
      if (!user) throw new Error('Você precisa estar logado para fazer o upload.');

      setUploading(true);
      setError('');
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage.from('anexos-pmos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('anexos-pmos').getPublicUrl(filePath);

      setPendingAnexo({
        nome_documento: '',
        url_arquivo: urlData.publicUrl,
        path_arquivo: filePath,
      });

    } catch (error) {
      setError(error.message);
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
      event.target.value = null;
    }
  };

  const handleConfirmarAnexo = () => {
    if (!pendingAnexo || !pendingAnexo.nome_documento) {
        setError('Por favor, adicione uma descrição ao documento antes de confirmar.');
        return;
    }
    const novosAnexos = [...anexos, pendingAnexo];
    onSectionChange({ ...safeData, lista_anexos: novosAnexos });
    setPendingAnexo(null);
    setError('');
  };

  const removerAnexoDaLista = async (index, path_arquivo) => {
    try {
      const { error: deleteError } = await supabase.storage.from('anexos-pmos').remove([path_arquivo]);
      if (deleteError){
          throw deleteError;
      }
      const novosAnexos = anexos.filter((_, i) => i !== index);
      onSectionChange({ ...safeData, lista_anexos: novosAnexos });
    } catch (err) {
      setError('Falha ao remover o anexo: ' + err.message);
      console.error('Erro ao remover anexo:', err);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>18. ANEXOS</h3>
      </div>
      <div className="card-body">
        <h5 className="card-title">18.1. Há anexos a serem inseridos no documento?</h5>
        <p className="form-text">Os anexos são parte integrante do Plano de Manejo; relacione-os adequadamente. Aceitamos .pdf, .jpg e .png.</p>

        <div className="mb-3">
            <label htmlFor="file-upload" className="btn btn-primary">
                {uploading ? 'Enviando...' : '+ Adicionar Arquivo'}
            </label>
            <input type="file" id="file-upload" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }}/>
        </div>

        {error && <p className="text-danger mt-2">{error}</p>}

        {pendingAnexo && (
            <div className="card bg-light p-3 my-3">
                <h6>Confirmar Novo Anexo</h6>
                <p>Arquivo enviado: <a href={pendingAnexo.url_arquivo} target="_blank" rel="noopener noreferrer">Ver Arquivo</a></p>
                <div className="input-group">
                     <input type="text" className="form-control" placeholder="Indique o nome ou descrição do documento" value={pendingAnexo.nome_documento} onChange={(e) => setPendingAnexo({...pendingAnexo, nome_documento: e.target.value})} />
                    <button className="btn btn-success" onClick={handleConfirmarAnexo}>✔ Adicionar à Lista</button>
                </div>
            </div>
        )}

        {anexos.length > 0 && <h6>Anexos Adicionados:</h6>}
        {anexos.map((anexo, index) => (
          <div key={index} className="input-group mb-2">
            <input type="text" className="form-control" value={anexo.nome_documento} readOnly />
            <a href={anexo.url_arquivo} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">Ver</a>
            {/* CORREÇÃO: Adicionado e.stopPropagation() para prevenir bugs de clique */}
            <button className="btn btn-outline-danger" onClick={(e) => { e.stopPropagation(); removerAnexoDaLista(index, anexo.path_arquivo); }}>Remover</button>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default Secao18;