# form_pmo/tests.py

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import PMO

class PMOAPITests(APITestCase):
    """
    Suíte de testes completa para a API de Planos de Manejo Orgânico (PMO).
    """

    def setUp(self):
        """
        Configura o ambiente para cada teste, criando usuários e dados iniciais.
        """
        self.user = User.objects.create_user(username='produtor_a', password='password123')
        self.other_user = User.objects.create_user(username='produtor_b', password='password123')
        self.list_create_url = '/api/v1/pmos/'

        self.valid_form_data = {
            "secao_1_descricao_propriedade": { "dados_cadastrais": {"nome_produtor": "Produtor de Teste", "cpf": "111.111.111-11", "endereco_propriedade_base_fisica_produtiva": "Fazenda de Teste", "telefone": "999999999", "email": "teste@teste.com", "responsavel_preenchimento": "Responsável Teste", "data_preenchimento": "2025-01-01"}, "roteiro_acesso_propriedade": {"roteiro_acesso": "acesso de teste"}, "mapa_propriedade_croqui": {"mapa_croqui": "mapa de teste"}, "coordenadas_geograficas": {"latitude": "0", "longitude": "0"}, "area_propriedade": {"area_total_propriedade_hectares": 10}, "historico_propriedade_producao_organica": {"historico_propriedade_producao_organica": "histórico de teste"}, "situacao_propriedade_relacao_producao_organica": {"situacao_propriedade_producao_organica": "Em conversão"}},
            "secao_2_atividades_produtivas_organicas": {"produtos_certificados": "Teste", "producao_primaria_vegetal": {"registro_auditoria_ppv": True, "produtos_primaria_vegetal": []}},
            "secao_4_animais_servico_subsistencia_companhia": {"ha_animais_servico_subsistencia_companhia": {"ha_animais_servico_subsistencia_companhia": False}},
            "secao_6_aspectos_ambientais": {"promocao_biodiversidade": {"medidas_promocao_biodiversidade": "teste"}, "fonte_agua": {"fonte_agua": "teste"}, "controle_uso_agua": {"controle_uso_agua": "teste"}, "risco_contaminacao_agua": {"ha_risco_contaminacao_agua": False}, "riscos_contaminacao_unidade_producao": {"riscos_contaminacao_unidade_producao": "teste"}, "medidas_minimizar_riscos_contaminacao": {"medidas_minimizar_riscos_contaminacao": "teste"}, "praticas_manejo_residuos_organicos": {"praticas_manejo_residuos_organicos": "teste"}, "tratamento_lixo": {"tratamento_lixo": "teste"}},
            "secao_7_aspectos_sociais": {"membros_familia_producao": {"membros_familia_producao": "teste"}, "mao_de_obra_nao_familiar": {"ha_mao_de_obra_nao_familiar": False}, "incentivo_atividades_educativas": {"incentiva_atividades_educativas": "teste"}, "relacionamento_outros_produtores": {"relacionamento_outros_produtores": "teste"}},
            "secao_8_insumos_equipamentos": {"insumos_melhorar_fertilidade": {"insumos_melhorar_fertilidade": []}},
            "secao_9_propagacao_vegetal": {"origem_sementes_mudas_organicas": {"sementes_mudas_organicas": []}, "tratamento_sementes_mudas": {"tratamento_sementes_mudas": "teste"}, "postura_uso_materiais_transgenicos_organica": {"postura_uso_materiais_transgenicos_organica": "teste"}},
            "secao_10_fitossanidade": {"controle_pragas_doencas": {"controle_pragas_doencas": []}, "manejo_plantas_daninhas": {"manejo_plantas_daninhas": "teste"}},
            "secao_11_colheita": {"controle_colheita_organicos": {"controle_colheita_organicos": "teste"}},
            "secao_12_pos_colheita": {"higienizacao_produtos_organicos": {"higienizacao_produtos_organicos": "teste"}, "processamento_producao_organica": {"ha_processamento_producao_organica": False}, "processamento_producao_paralela": {"ha_processamento_producao_paralela": False}, "higienizacao_equipamentos_instalacoes": {"higienizacao_equipamentos_instalacoes": "teste"}, "rotulagem_produtos": {"produtos_sao_rotulados": False}, "procedimentos_armazenamento": {"procedimentos_armazenamento": "teste"}, "controle_pragas_instalacoes": {"controle_pragas_instalacoes": "teste"}, "transporte_produtos_organicos": {"transporte_produtos_organicos": "teste"}},
            "secao_14_comercializacao": {"canais_comercializacao": {"canais_comercializacao": "teste"}},
            "secao_15_rastreabilidade": {"registros_rastreabilidade": {"registros_rastreabilidade": "teste"}, "frequencia_registros": {"frequencia_registros_anotacoes": "teste"}},
            "secao_16_sac": {"formas_reclamacoes": {"formas_reclamacoes_criticas": "teste"}, "tratamento_reclamacoes": {"tratamento_reclamacoes_criticas": "teste"}}
        }

        # Criamos objetos específicos para os testes de update e delete
        self.pmo_user_a = PMO.objects.create(owner=self.user, status='RASCUNHO', form_data=self.valid_form_data)
        self.pmo_user_b = PMO.objects.create(owner=self.other_user, status='APROVADO', form_data=self.valid_form_data)

    def test_create_pmo_unauthenticated_user(self):
        """Garante que um usuário NÃO AUTENTICADO NÃO PODE criar um PMO."""
        post_payload = {"status": "RASCUNHO", "version": 1, "form_data": self.valid_form_data}
        response = self.client.post(self.list_create_url, post_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_pmos_returns_only_owned_pmos(self):
        """Garante que a listagem de PMOs retorna apenas os do usuário logado."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['owner_username'], self.user.username)

    def test_filter_pmo_by_status(self):
        """Garante que a API pode filtrar PMOs pelo campo 'status'."""
        PMO.objects.create(owner=self.user, status='APROVADO', form_data=self.valid_form_data)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_create_url, {'status': 'APROVADO'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['status'], 'APROVADO')

    # --- NOVOS TESTES ADICIONADOS ---

    def test_partial_update_pmo_by_owner(self):
        """
        Garante que o dono de um PMO PODE atualizá-lo parcialmente (PATCH).
        """
        self.client.force_authenticate(user=self.user)
        update_payload = {'status': 'SUBMETIDO'}
        detail_url = f'/api/v1/pmos/{self.pmo_user_a.id}/'
        
        response = self.client.patch(detail_url, update_payload, format='json')
        
        # Verifica se a atualização foi bem-sucedida
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Recarrega o objeto do banco de dados para garantir que a mudança foi salva
        self.pmo_user_a.refresh_from_db()
        # Verifica se o campo foi realmente alterado
        self.assertEqual(self.pmo_user_a.status, 'SUBMETIDO')

    def test_update_pmo_forbidden_for_non_owner(self):
        """
        Garante que um usuário NÃO PODE atualizar um PMO de outra pessoa.
        """
        self.client.force_authenticate(user=self.user) # Autenticado como user A
        update_payload = {'status': 'RASCUNHO'}
        detail_url_other_user = f'/api/v1/pmos/{self.pmo_user_b.id}/' # Tentando alterar o PMO do user B
        
        response = self.client.patch(detail_url_other_user, update_payload, format='json')
        
        # A resposta DEVE ser 404 Not Found, pois o queryset da view não encontra este objeto para este usuário.
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_pmo_by_owner(self):
        """
        Garante que o dono de um PMO PODE deletá-lo.
        """
        self.client.force_authenticate(user=self.user)
        pmo_count_before = PMO.objects.count()
        detail_url = f'/api/v1/pmos/{self.pmo_user_a.id}/'
        
        response = self.client.delete(detail_url)
        
        # Verifica se a deleção foi bem-sucedida
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Verifica se o número de objetos no banco diminuiu em 1
        self.assertEqual(PMO.objects.count(), pmo_count_before - 1)

    def test_delete_pmo_forbidden_for_non_owner(self):
        """
        Garante que um usuário NÃO PODE deletar um PMO de outra pessoa.
        """
        self.client.force_authenticate(user=self.user) # Autenticado como user A
        pmo_count_before = PMO.objects.count()
        detail_url_other_user = f'/api/v1/pmos/{self.pmo_user_b.id}/' # Tentando deletar o PMO do user B
        
        response = self.client.delete(detail_url_other_user)
        
        # A resposta DEVE ser 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Verifica se o número de objetos no banco NÃO mudou
        self.assertEqual(PMO.objects.count(), pmo_count_before)