# form_pmo/serializers.py

import datetime
from rest_framework import serializers
from .models import PMO # Supondo que o modelo se chama PMO em models.py

# =============================================================================
# Bloco de Lego: Serializers para Itens de Lista (os menores blocos)
# =============================================================================

class ProdutoPrimariaVegetalItemSerializer(serializers.Serializer):
    produto = serializers.CharField(required=True)
    talhoes_canteiros = serializers.CharField(required=True)
    area_plantada = serializers.FloatField(required=True)
    producao_esperada_ano = serializers.FloatField(required=True)

class AnimalPrimariaAnimalItemSerializer(serializers.Serializer):
    especie = serializers.CharField(required=True)
    n_de_animais = serializers.IntegerField(required=True)
    area_externa = serializers.FloatField(required=True)
    area_interna_instalacoes = serializers.FloatField(required=True)
    exploracao = serializers.CharField(required=True)
    estagio_de_vida = serializers.CharField(required=True)
    media_de_peso_vivo = serializers.FloatField(required=True)
    producao_esperada_ano = serializers.CharField(required=True)

class ProdutoProcessamentoItemSerializer(serializers.Serializer):
    produto = serializers.CharField(required=True)
    frequencia_producao = serializers.CharField(required=True)
    epoca_producao = serializers.CharField(required=True)
    producao_esperada_ano = serializers.CharField(required=True)

class ProdutoPrimariaVegetalNaoOrganicaItemSerializer(serializers.Serializer):
    produto = serializers.CharField(required=True)
    talhoes_canteiros = serializers.CharField(required=True)
    area_plantada = serializers.FloatField(required=True)
    producao_esperada_ano = serializers.FloatField(required=True)

class AnimalPrimariaAnimalNaoOrganicaItemSerializer(serializers.Serializer):
    especie = serializers.CharField(required=True)
    n_de_animais = serializers.IntegerField(required=True)
    area_externa = serializers.FloatField(required=True)
    area_interna_instalacoes = serializers.FloatField(required=True)
    exploracao = serializers.CharField(required=True)
    estagio_de_vida = serializers.CharField(required=True)
    media_de_peso_vivo = serializers.FloatField(required=True)
    producao_esperada_ano = serializers.CharField(required=True)

class ProdutoProcessamentoNaoOrganicoItemSerializer(serializers.Serializer):
    produto = serializers.CharField(required=True)
    frequencia_producao = serializers.CharField(required=True)
    epoca_producao = serializers.CharField(required=True)
    producao_esperada_ano = serializers.CharField(required=True)

class ProdutoTerceirizadoItemSerializer(serializers.Serializer):
    fornecedor = serializers.CharField(required=True)
    localidade = serializers.CharField(required=True)
    produto = serializers.CharField(required=True)
    quantidade_ano = serializers.FloatField(required=True)
    processamento = serializers.BooleanField(required=True)

class InsumoFertilidadeItemSerializer(serializers.Serializer):
    produto_ou_manejo = serializers.CharField(required=True)
    onde_cultura = serializers.CharField(required=True)
    quando = serializers.CharField(required=True)
    procedencia = serializers.CharField(required=True)
    composicao = serializers.CharField(required=True)
    marca = serializers.CharField(required=False, allow_blank=True)
    dosagem = serializers.CharField(required=True)

class SementeMudaOrganicaItemSerializer(serializers.Serializer):
    especies_cultivares = serializers.CharField(required=True)
    origem_sementes_mudas = serializers.CharField(required=True)
    quantidade = serializers.FloatField(required=True)
    sistema_organico_producao = serializers.BooleanField(required=True)
    data_compra = serializers.DateField(required=True)

class SementeMudaNaoOrganicaItemSerializer(serializers.Serializer):
    especies_cultivares = serializers.CharField(required=True)
    origem_sementes_mudas = serializers.CharField(required=True)
    quantidade = serializers.FloatField(required=True)

class ControlePragaDoencaItemSerializer(serializers.Serializer):
    produto_ou_manejo = serializers.CharField(required=True)
    onde_cultura = serializers.CharField(required=True)
    qual_praga_doenca = serializers.CharField(required=True)
    quando = serializers.CharField(required=True)
    procedencia = serializers.CharField(required=True)
    composicao = serializers.CharField(required=True)
    marca = serializers.CharField(required=False, allow_blank=True)
    dosagem = serializers.CharField(required=True)

class EvolucaoPlantelItemSerializer(serializers.Serializer):
    tipo_animal = serializers.CharField(required=True)
    numero_animais_atual = serializers.IntegerField(required=True)
    numero_animais_1_ano = serializers.IntegerField(required=True)
    numero_animais_3_anos = serializers.IntegerField(required=True)
    numero_animais_5_anos = serializers.IntegerField(required=True)

class NutricaoAnimalItemSerializer(serializers.Serializer):
    animal = serializers.CharField(required=True)
    ingrediente_materia_prima_composicao = serializers.CharField(required=True)
    origem_transgenica = serializers.CharField(required=True)
    descricao_producao_ingrediente = serializers.CharField(required=True)
    procedencia_ingrediente = serializers.CharField(required=True)
    frequencia_utilizacao = serializers.CharField(required=True)
    quantidade = serializers.CharField(required=True)

class PlanoAnualAlimentacaoItemSerializer(serializers.Serializer):
    alimento = serializers.CharField(required=True)
    jan = serializers.BooleanField(required=False)
    fev = serializers.BooleanField(required=False)
    mar = serializers.BooleanField(required=False)
    abr = serializers.BooleanField(required=False)
    mai = serializers.BooleanField(required=False)
    jun = serializers.BooleanField(required=False)
    jul = serializers.BooleanField(required=False)
    ago = serializers.BooleanField(required=False)
    set = serializers.BooleanField(required=False)
    out = serializers.BooleanField(required=False)
    nov = serializers.BooleanField(required=False)
    dez = serializers.BooleanField(required=False)

class TratamentoAnimalDoenteItemSerializer(serializers.Serializer):
    animal = serializers.CharField(required=True)
    doenca_parasitas = serializers.CharField(required=True)
    produto_tratamento = serializers.CharField(required=True)
    dosagem = serializers.CharField(required=True)
    frequencia_periodo_tratamento = serializers.CharField(required=True)
    periodo_carencia = serializers.CharField(required=True)

class AnexoItemSerializer(serializers.Serializer):
    nome_documento = serializers.CharField(required=True)

# =============================================================================
# Bloco de Lego: Serializers para Subseções
# =============================================================================

# --- Seção 1: Descrição da Propriedade ---
class DadosCadastraisSerializer(serializers.Serializer):
    nome_produtor = serializers.CharField(required=True)
    cpf = serializers.CharField(required=True)
    identidade = serializers.CharField(required=False, allow_blank=True)
    dap = serializers.CharField(required=False, allow_blank=True)
    nome_representante_legal = serializers.CharField(required=False, allow_blank=True)
    endereco_propriedade_base_fisica_produtiva = serializers.CharField(required=True)
    endereco_correspondencia = serializers.CharField(required=False, allow_blank=True)
    telefone = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    responsavel_preenchimento = serializers.CharField(required=True)
    data_preenchimento = serializers.DateField(required=True)

class RoteiroAcessoPropriedadeSerializer(serializers.Serializer):
    roteiro_acesso = serializers.CharField(style={'base_template': 'textarea.html'}, required=True)

class MapaPropriedadeCroquiSerializer(serializers.Serializer):
    mapa_croqui = serializers.CharField(style={'base_template': 'textarea.html'}, required=True)

class CoordenadasGeograficasSerializer(serializers.Serializer):
    latitude = serializers.CharField(required=True)
    longitude = serializers.CharField(required=True)

class AreaPropriedadeSerializer(serializers.Serializer):
    area_producao_organica_hectares = serializers.FloatField(required=False)
    area_producao_nao_organica_hectares = serializers.FloatField(required=False)
    area_producao_em_conversao_hectares = serializers.FloatField(required=False)
    areas_protegidas_hectares = serializers.FloatField(required=False)
    area_ocupada_instalacoes_benfeitorias_hectares = serializers.FloatField(required=False)
    area_total_propriedade_hectares = serializers.FloatField(required=True)

class HistoricoPropriedadeProducaoOrganicaSerializer(serializers.Serializer):
    historico_propriedade_producao_organica = serializers.CharField(style={'base_template': 'textarea.html'}, required=True)

class SituacaoPropriedadeRelacaoProducaoOrganicaSerializer(serializers.Serializer):
    situacao_propriedade_producao_organica = serializers.CharField(required=True)

class SeparacaoAreasProducaoParalelaSerializer(serializers.Serializer):
    descricao_separacao_areas_producao_paralela = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

# --- Seção 2: Atividades Produtivas Orgânicas ---
class ProducaoPrimariaVegetalSerializer(serializers.Serializer):
    registro_auditoria_ppv = serializers.BooleanField(required=True)
    produtos_primaria_vegetal = serializers.ListField(child=ProdutoPrimariaVegetalItemSerializer(), required=True)

class ProducaoPrimariaAnimalSerializer(serializers.Serializer):
    animais_primaria_animal = serializers.ListField(child=AnimalPrimariaAnimalItemSerializer(), required=False)

class ProcessamentoProdutosOrigemVegetalSerializer(serializers.Serializer):
    produtos_processamento_vegetal = serializers.ListField(child=ProdutoProcessamentoItemSerializer(), required=False)

class ProcessamentoProdutosOrigemAnimalSerializer(serializers.Serializer):
    produtos_processamento_animal = serializers.ListField(child=ProdutoProcessamentoItemSerializer(), required=False)

# --- Seção 3: Atividades Produtivas Não Orgânicas ---
class ProducaoPrimariaVegetalNaoOrganicaSerializer(serializers.Serializer):
    produtos_primaria_vegetal_nao_organica = serializers.ListField(child=ProdutoPrimariaVegetalNaoOrganicaItemSerializer(), required=False)

class ProducaoPrimariaAnimalNaoOrganicaSerializer(serializers.Serializer):
    animais_primaria_animal_nao_organica = serializers.ListField(child=AnimalPrimariaAnimalNaoOrganicaItemSerializer(), required=False)

class ProcessamentoProdutosOrigemVegetalNaoOrganicoSerializer(serializers.Serializer):
    produtos_processamento_vegetal_nao_organico = serializers.ListField(child=ProdutoProcessamentoNaoOrganicoItemSerializer(), required=False)
    
class ProcessamentoProdutosOrigemAnimalNaoOrganicoSerializer(serializers.Serializer):
    produtos_processamento_animal_nao_organico = serializers.ListField(child=ProdutoProcessamentoNaoOrganicoItemSerializer(), required=False)

# =======================================================================
# SEÇÃO 4: ANIMAIS DE SERVIÇO, SUBSISTÊNCIA, ETC. (VERSÃO ATUALIZADA)
# =======================================================================

# --- Item para a lista de Animais de Serviço ---
class AnimalServicoItemSerializer(serializers.Serializer):
    especie = serializers.CharField(required=True)
    quantidade = serializers.IntegerField(required=True)
    manejo = serializers.CharField(required=True, style={'base_template': 'textarea.html'})
    insumos = serializers.CharField(required=True, style={'base_template': 'textarea.html'})
    tratamento_dejetos = serializers.CharField(required=True, style={'base_template': 'textarea.html'})

# --- Item para a lista de Animais de Subsistência/Companhia ---
class AnimalSubsistenciaItemSerializer(serializers.Serializer):
    especie = serializers.CharField(required=True)
    quantidade = serializers.IntegerField(required=True)
    insumos = serializers.CharField(required=True, style={'base_template': 'textarea.html'})
    tratamento_dejetos = serializers.CharField(required=True, style={'base_template': 'textarea.html'})
    circulacao_area_organica = serializers.CharField(required=True, style={'base_template': 'textarea.html'})

# --- Serializers principais da Subseção ---

class HaAnimaisServicoSubsistenciaCompanhiaSerializer(serializers.Serializer):
    ha_animais_servico_subsistencia_companhia = serializers.BooleanField(required=True)

class AnimaisServicoSerializer(serializers.Serializer):
    # Agora espera uma lista de animais de serviço
    lista_animais_servico = serializers.ListField(
        child=AnimalServicoItemSerializer(), required=False
    )

class AnimaisSubsistenciaCompanhiaOrnamentaisSerializer(serializers.Serializer):
    # Agora espera uma lista de animais de subsistência
    lista_animais_subsistencia = serializers.ListField(
        child=AnimalSubsistenciaItemSerializer(), required=False
    )

# --- Seção 5: Produção Terceirizada ---
class AquisicaoProdutosTerceirosSerializer(serializers.Serializer):
    produtos_terceirizados = serializers.ListField(child=ProdutoTerceirizadoItemSerializer(), required=False)

# --- Seção 6: Aspectos Ambientais ---
# --- Sub-serializers para a Seção 6 ---

class PromocaoBiodiversidadeSerializer(serializers.Serializer):
    medidas_promocao_biodiversidade = serializers.CharField(required=True, allow_blank=True)

class FonteAguaSerializer(serializers.Serializer):
    fonte_agua = serializers.CharField(required=True, allow_blank=True)
    
class ControleUsoAguaSerializer(serializers.Serializer):
    controle_uso_agua = serializers.CharField(required=True, allow_blank=True)
    
class RiscoContaminacaoAguaSerializer(serializers.Serializer):
    ha_risco_contaminacao_agua = serializers.BooleanField(required=True)
    qual_risco_contaminacao_agua = serializers.CharField(required=False, allow_blank=True)

class RiscosContaminacaoUnidadeProducaoSerializer(serializers.Serializer):
    riscos_contaminacao_unidade_producao = serializers.CharField(required=True, allow_blank=True)

class MedidasMinimizarRiscosContaminacaoSerializer(serializers.Serializer):
    medidas_minimizar_riscos_contaminacao = serializers.CharField(required=True, allow_blank=True)

class PraticasManejoResiduosOrganicosSerializer(serializers.Serializer):
    praticas_manejo_residuos_organicos = serializers.CharField(required=True, allow_blank=True)

class CompostagemSerializer(serializers.Serializer):
    descricao_compostagem = serializers.CharField(required=False, allow_blank=True)

class TratamentoLixoSerializer(serializers.Serializer):
    tratamento_lixo = serializers.CharField(required=True, allow_blank=True)

# --- Serializer Principal da Seção 6 ---

class Secao6AspectosAmbientaisSerializer(serializers.Serializer):
    promocao_biodiversidade = serializers.CharField(required=False, allow_blank=True)
    fonte_agua = serializers.CharField(required=False, allow_blank=True)
    controle_uso_agua = serializers.CharField(required=False, allow_blank=True)
    
    ha_risco_contaminacao_agua = serializers.BooleanField(required=False, allow_null=True)
    qual_risco_contaminacao_agua = serializers.CharField(required=False, allow_blank=True)
    
    riscos_contaminacao_unidade_producao = serializers.CharField(required=False, allow_blank=True)
    medidas_minimizar_riscos_contaminacao = serializers.CharField(required=False, allow_blank=True)
    praticas_manejo_residuos_organicos = serializers.CharField(required=False, allow_blank=True)
    compostagem = serializers.CharField(required=False, allow_blank=True)
    tratamento_lixo = serializers.CharField(required=False, allow_blank=True)

# --- Seção 7: Aspectos Sociais ---
class MembrosFamiliaProducaoSerializer(serializers.Serializer):
    membros_familia_producao = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    
class MaoDeObraNaoFamiliarSerializer(serializers.Serializer):
    ha_mao_de_obra_nao_familiar = serializers.BooleanField(required=True)
    quantidade_mao_de_obra = serializers.IntegerField(required=False)
    relacao_trabalhista = serializers.CharField(required=False, allow_blank=True)

class IncentivoAtividadesEducativasSerializer(serializers.Serializer):
    incentiva_atividades_educativas = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

class RelacionamentoOutrosProdutoresSerializer(serializers.Serializer):
    relacionamento_outros_produtores = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    
# --- Seção 8: Insumos/Equipamentos ---
class InsumosMelhorarFertilidadeSerializer(serializers.Serializer):
    insumos_melhorar_fertilidade = serializers.ListField(child=InsumoFertilidadeItemSerializer(), required=True)
    
class InsumosProducaoNaoOrganicaSerializer(serializers.Serializer):
    insumos_producao_nao_organica = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    
class ControleInsumosProducaoParalelaSerializer(serializers.Serializer):
    controle_insumos_producao_paralela = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    
# --- Seção 9: Propagação Vegetal ---
class OrigemSementesMudasOrganicasSerializer(serializers.Serializer):
    sementes_mudas_organicas = serializers.ListField(child=SementeMudaOrganicaItemSerializer(), required=True)

class TratamentoSementesMudasSerializer(serializers.Serializer):
    tratamento_sementes_mudas = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    
class ManejoProducaoPropriaSerializer(serializers.Serializer):
    manejo_producao_propria = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class OrigemSementesMudasNaoOrganicasSerializer(serializers.Serializer):
    sementes_mudas_nao_organicas = serializers.ListField(child=SementeMudaNaoOrganicaItemSerializer(), required=False)

class PosturaUsoMateriaisTransgenicosOrganicaSerializer(serializers.Serializer):
    postura_uso_materiais_transgenicos_organica = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    
class CuidadosUsoMateriaisTransgenicosNaoOrganicaSerializer(serializers.Serializer):
    cuidados_uso_materiais_transgenicos_nao_organica = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

# --- Seção 10: Fitossanidade ---
class ControlePragasDoencasSerializer(serializers.Serializer):
    controle_pragas_doencas = serializers.ListField(child=ControlePragaDoencaItemSerializer(), required=True)
    
class ManejoPlantasDaninhasSerializer(serializers.Serializer):
    manejo_plantas_daninhas = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

# --- Seção 11: Colheita ---
class ControleColheitaOrganicosSerializer(serializers.Serializer):
    controle_colheita_organicos = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True  )

class ControleColheitaNaoOrganicosSerializer(serializers.Serializer):
    controle_colheita_nao_organicos = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

# --- Seção 12: Pós-Colheita ---
class HigienizacaoProdutosOrganicosSerializer(serializers.Serializer):
    higienizacao_produtos_organicos = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    
class ProcessamentoProducaoOrganicaSerializer(serializers.Serializer):
    ha_processamento_producao_organica = serializers.BooleanField(required=True)
    descricao_processamento_producao_organica = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class ProcessamentoProducaoParalelaSerializer(serializers.Serializer):
    ha_processamento_producao_paralela = serializers.BooleanField(required=True)
    descricao_processamento_producao_paralela = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class HigienizacaoEquipamentosInstalacoesSerializer(serializers.Serializer):
    higienizacao_equipamentos_instalacoes = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

class AcondicionamentoProdutosSerializer(serializers.Serializer):
    embalados_envasados_produtos = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    embalados_envasados_descricao = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    granel_produtos = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    granel_descricao = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    
class RotulagemProdutosSerializer(serializers.Serializer):
    produtos_sao_rotulados = serializers.BooleanField(required=True)
    descricao_rotulagem = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    
class ProcedimentosArmazenamentoSerializer(serializers.Serializer):
    procedimentos_armazenamento = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

class ControlePragasInstalacoesSerializer(serializers.Serializer):
    controle_pragas_instalacoes = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

class TransporteProdutosOrganicosSerializer(serializers.Serializer):
    transporte_produtos_organicos = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    
# --- Seção 13: Produção Animal ---
class TecnicasMelhoriaPastosSerializer(serializers.Serializer):
    tecnicas_melhoria_pastos = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class ReproducaoAnimaisSerializer(serializers.Serializer):
    metodos_reproducao_animais = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class AquisicaoAnimaisSerializer(serializers.Serializer):
    sistema_producao_aquisicao_animais = serializers.CharField(required=False, allow_blank=True)
    especificacao_aquisicao_animais = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class EvolucaoPlantelSerializer(serializers.Serializer):
    evolucao_plantel = serializers.ListField(child=EvolucaoPlantelItemSerializer(), required=False)

class NutricaoAnimalSerializer(serializers.Serializer):
    nutricao_animal = serializers.ListField(child=NutricaoAnimalItemSerializer(), required=False)

class PlanoAnualAlimentacaoAnimalSerializer(serializers.Serializer):
    plano_anual_alimentacao_animal = serializers.ListField(child=PlanoAnualAlimentacaoItemSerializer(), required=False)

class AlimentacaoMamiferosJovensSerializer(serializers.Serializer):
    alimentacao_mamiferos_jovens = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class BemEstarAnimaisSerializer(serializers.Serializer):
    promocao_bem_estar_animais = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    
class PromocaoSaudeAnimalSerializer(serializers.Serializer):
    promocao_saude_animal = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class ControleVermesParasitasSerializer(serializers.Serializer):
    controle_vermes_parasitas = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class TratamentoAnimaisDoentesSerializer(serializers.Serializer):
    tratamento_animais_doentes = serializers.ListField(child=TratamentoAnimalDoenteItemSerializer(), required=False)

class CastracaoAnimaisSerializer(serializers.Serializer):
    castracao_animais = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class CorteChifresMochamentoMarcacoesSerializer(serializers.Serializer):
    corte_chifres_mochamento_marcacoes = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class VacinacaoAnimaisSerializer(serializers.Serializer):
    vacinacao_animais = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class ManejoSanitarioAnimalSerializer(serializers.Serializer):
    promocao_saude_animal = PromocaoSaudeAnimalSerializer(required=False)
    controle_vermes_parasitas = ControleVermesParasitasSerializer(required=False)
    tratamento_animais_doentes = TratamentoAnimaisDoentesSerializer(required=False)
    castracao_animais = CastracaoAnimaisSerializer(required=False)
    corte_chifres_mochamento_marcacoes = CorteChifresMochamentoMarcacoesSerializer(required=False)
    vacinacao_animais = VacinacaoAnimaisSerializer(required=False)

# --- Seção 14: Comercialização ---
class CanaisComercializacaoSerializer(serializers.Serializer):
    canais_comercializacao = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

# --- Seção 15: Rastreabilidade ---
class RegistrosRastreabilidadeSerializer(serializers.Serializer):
    registros_rastreabilidade = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

class FrequenciaRegistrosSerializer(serializers.Serializer):
    frequencia_registros_anotacoes = serializers.CharField(required=True, allow_blank=True)

# --- Seção 16: SAC ---
class FormasReclamacoesSerializer(serializers.Serializer):
    formas_reclamacoes_criticas = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    
class TratamentoReclamacoesSerializer(serializers.Serializer):
    tratamento_reclamacoes_criticas = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)

# --- Seção 17: Opinião ---
class PrincipaisProblemasSerializer(serializers.Serializer):
    principais_problemas_producao_organica = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class PrincipaisVantagensSerializer(serializers.Serializer):
    principais_vantagens_producao_organica = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    
class OutrasInformacoesSerializer(serializers.Serializer):
    outras_informacoes_necessarias = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

# --- Seção 18: Anexos ---
class ListaAnexosSerializer(serializers.Serializer):
    lista_anexos = serializers.ListField(child=AnexoItemSerializer(), required=False)
    
# --- Seção Avaliação ---
class EspacoOacSerializer(serializers.Serializer):
    data_recebimento_plano_manejo = serializers.DateField(required=False, allow_null=True)

class RiscosPotenciaisSerializer(serializers.Serializer):
    riscos_potenciais_unidade_produtiva = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class ConclusaoAnaliseSerializer(serializers.Serializer):
    conclusao_analise = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)

class StatusDocumentoSerializer(serializers.Serializer):
    status_documento = serializers.CharField(required=False, allow_blank=True)
    responsavel_analise_conclusao = serializers.CharField(required=False, allow_blank=True)
    assinatura_responsavel = serializers.CharField(required=False, allow_blank=True)
    data_analise = serializers.DateField(required=False, allow_null=True) # Note: allow_null=True permite que o campo seja nulo

# =============================================================================
# Bloco de Lego: Serializers para Seções Principais
# =============================================================================

class Secao1DescricaoPropriedadeSerializer(serializers.Serializer):
    dados_cadastrais = DadosCadastraisSerializer(required=True)
    roteiro_acesso_propriedade = RoteiroAcessoPropriedadeSerializer(required=True)
    mapa_propriedade_croqui = MapaPropriedadeCroquiSerializer(required=True)
    coordenadas_geograficas = CoordenadasGeograficasSerializer(required=True)
    area_propriedade = AreaPropriedadeSerializer(required=True)
    historico_propriedade_producao_organica = HistoricoPropriedadeProducaoOrganicaSerializer(required=True)
    situacao_propriedade_relacao_producao_organica = SituacaoPropriedadeRelacaoProducaoOrganicaSerializer(required=True)
    separacao_areas_producao_paralela = SeparacaoAreasProducaoParalelaSerializer(required=False)

class Secao2AtividadesProdutivasOrganicasSerializer(serializers.Serializer):
    produtos_certificados = serializers.CharField(style={'base_template': 'textarea.html'}, required=True, allow_blank=True)
    producao_primaria_vegetal = ProducaoPrimariaVegetalSerializer(required=True)
    producao_primaria_animal = ProducaoPrimariaAnimalSerializer(required=False)
    processamento_produtos_origem_vegetal = ProcessamentoProdutosOrigemVegetalSerializer(required=False)
    processamento_produtos_origem_animal = ProcessamentoProdutosOrigemAnimalSerializer(required=False)

class Secao3AtividadesProdutivasNaoOrganicasSerializer(serializers.Serializer):
    produtos_nao_certificados = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    producao_primaria_vegetal_nao_organica = ProducaoPrimariaVegetalNaoOrganicaSerializer(required=False)
    producao_primaria_animal_nao_organica = ProducaoPrimariaAnimalNaoOrganicaSerializer(required=False)
    processamento_produtos_origem_vegetal_nao_organico = ProcessamentoProdutosOrigemVegetalNaoOrganicoSerializer(required=False)
    processamento_produtos_origem_animal_nao_organico = ProcessamentoProdutosOrigemAnimalNaoOrganicoSerializer(required=False)

class Secao4AnimaisServicoSubsistenciaCompanhiaSerializer(serializers.Serializer):
    ha_animais_servico_subsistencia_companhia = HaAnimaisServicoSubsistenciaCompanhiaSerializer(required=True)
    animais_servico = AnimaisServicoSerializer(required=False)
    animais_subsistencia_companhia_ornamentais = AnimaisSubsistenciaCompanhiaOrnamentaisSerializer(required=False)

# --- Serializer Principal da Seção 5 ---
class Secao5ProducaoTerceirizadaSerializer(serializers.Serializer):
    produtos_terceirizados = serializers.ListField(
        child=ProdutoTerceirizadoItemSerializer(), required=False
    )
    
class Secao6AspectosAmbientaisSerializer(serializers.Serializer):
    # Cada campo agora é um CharField ou BooleanField simples. Sem aninhamento.
    promocao_biodiversidade = serializers.CharField(required=False, allow_blank=True)
    fonte_agua = serializers.CharField(required=False, allow_blank=True)
    fonte_agua_subterranea_especificacao = serializers.CharField(required=False, allow_blank=True)
    controle_uso_agua = serializers.CharField(required=False, allow_blank=True)
    
    ha_risco_contaminacao_agua = serializers.BooleanField(required=False)
    qual_risco_contaminacao_agua = serializers.CharField(required=False, allow_blank=True)
    
    riscos_contaminacao_unidade_producao = serializers.CharField(required=False, allow_blank=True)
    medidas_minimizar_riscos_contaminacao = serializers.CharField(required=False, allow_blank=True)
    praticas_manejo_residuos_organicos = serializers.CharField(required=False, allow_blank=True)
    compostagem = serializers.CharField(required=False, allow_blank=True)
    tratamento_lixo = serializers.CharField(required=False, allow_blank=True)

class Secao7AspectosSociaisSerializer(serializers.Serializer):
    membros_familia_producao = MembrosFamiliaProducaoSerializer(required=True)
    mao_de_obra_nao_familiar = MaoDeObraNaoFamiliarSerializer(required=True)
    incentivo_atividades_educativas = IncentivoAtividadesEducativasSerializer(required=True)
    relacionamento_outros_produtores = RelacionamentoOutrosProdutoresSerializer(required=True)

class Secao8InsumosEquipamentosSerializer(serializers.Serializer):
    insumos_melhorar_fertilidade = InsumosMelhorarFertilidadeSerializer(required=True)
    insumos_producao_nao_organica = InsumosProducaoNaoOrganicaSerializer(required=False)
    controle_insumos_producao_paralela = ControleInsumosProducaoParalelaSerializer(required=False)
    
class Secao9PropagacaoVegetalSerializer(serializers.Serializer):
    origem_sementes_mudas_organicas = OrigemSementesMudasOrganicasSerializer(required=True)
    tratamento_sementes_mudas = TratamentoSementesMudasSerializer(required=True)
    manejo_producao_propria = ManejoProducaoPropriaSerializer(required=False)
    origem_sementes_mudas_nao_organicas = OrigemSementesMudasNaoOrganicasSerializer(required=False)
    postura_uso_materiais_transgenicos_organica = PosturaUsoMateriaisTransgenicosOrganicaSerializer(required=True)
    cuidados_uso_materiais_transgenicos_nao_organica = CuidadosUsoMateriaisTransgenicosNaoOrganicaSerializer(required=False)

class Secao10FitossanidadeSerializer(serializers.Serializer):
    controle_pragas_doencas = ControlePragasDoencasSerializer(required=True)
    manejo_plantas_daninhas = ManejoPlantasDaninhasSerializer(required=True)
    
class Secao11ColheitaSerializer(serializers.Serializer):
    controle_colheita_organicos = ControleColheitaOrganicosSerializer(required=True)
    controle_colheita_nao_organicos = ControleColheitaNaoOrganicosSerializer(required=False)

class Secao12PosColheitaSerializer(serializers.Serializer):
    higienizacao_produtos_organicos = HigienizacaoProdutosOrganicosSerializer(required=True)
    processamento_producao_organica = ProcessamentoProducaoOrganicaSerializer(required=True)
    processamento_producao_paralela = ProcessamentoProducaoParalelaSerializer(required=True)
    higienizacao_equipamentos_instalacoes = HigienizacaoEquipamentosInstalacoesSerializer(required=True)
    acondicionamento_produtos = AcondicionamentoProdutosSerializer(required=False)
    rotulagem_produtos = RotulagemProdutosSerializer(required=True)
    procedimentos_armazenamento = ProcedimentosArmazenamentoSerializer(required=True)
    controle_pragas_instalacoes = ControlePragasInstalacoesSerializer(required=True)
    transporte_produtos_organicos = TransporteProdutosOrganicosSerializer(required=True)
    
class Secao13ProducaoAnimalSerializer(serializers.Serializer):
    tecnicas_melhoria_pastos = TecnicasMelhoriaPastosSerializer(required=False)
    reproducao_animais = ReproducaoAnimaisSerializer(required=False)
    aquisicao_animais = AquisicaoAnimaisSerializer(required=False)
    evolucao_plantel = EvolucaoPlantelSerializer(required=False)
    nutricao_animal = NutricaoAnimalSerializer(required=False)
    plano_anual_alimentacao_animal = PlanoAnualAlimentacaoAnimalSerializer(required=False)
    alimentacao_mamiferos_jovens = AlimentacaoMamiferosJovensSerializer(required=False)
    bem_estar_animais = BemEstarAnimaisSerializer(required=False)
    manejo_sanitario_animal = ManejoSanitarioAnimalSerializer(required=False)
    
class Secao14ComercializacaoSerializer(serializers.Serializer):
    canais_comercializacao = CanaisComercializacaoSerializer(required=True)
    
class Secao15RastreabilidadeSerializer(serializers.Serializer):
    registros_rastreabilidade = RegistrosRastreabilidadeSerializer(required=True)
    frequencia_registros = FrequenciaRegistrosSerializer(required=True)

class Secao16SacSerializer(serializers.Serializer):
    formas_reclamacoes = FormasReclamacoesSerializer(required=True)
    tratamento_reclamacoes = TratamentoReclamacoesSerializer(required=True)

class Secao17OpiniaoSerializer(serializers.Serializer):
    principais_problemas = PrincipaisProblemasSerializer(required=False)
    principais_vantagens = PrincipaisVantagensSerializer(required=False)
    outras_informacoes = OutrasInformacoesSerializer(required=False)
    
class Secao18AnexosSerializer(serializers.Serializer):
    lista_anexos = ListaAnexosSerializer(required=False)
    
class SecaoAvaliacaoPlanoManejoSerializer(serializers.Serializer):
    espaco_oac = EspacoOacSerializer(required=False)
    riscos_potenciais = RiscosPotenciaisSerializer(required=False)
    conclusao_analise = ConclusaoAnaliseSerializer(required=False)
    status_documento = StatusDocumentoSerializer(required=False)

# =============================================================================
# Serializer de Nível Superior para o Formulário Completo
# =============================================================================

class FormularioPMOSerializer(serializers.Serializer):
    secao_1_descricao_propriedade = Secao1DescricaoPropriedadeSerializer(required=True)
    secao_2_atividades_produtivas_organicas = Secao2AtividadesProdutivasOrganicasSerializer(required=True)
    secao_3_atividades_produtivas_nao_organicas = Secao3AtividadesProdutivasNaoOrganicasSerializer(required=False)
    secao_4_animais_servico_subsistencia_companhia = Secao4AnimaisServicoSubsistenciaCompanhiaSerializer(required=False)
    secao_5_producao_terceirizada = Secao5ProducaoTerceirizadaSerializer(required=False)
    secao_6_aspectos_ambientais = Secao6AspectosAmbientaisSerializer(required=False)
    secao_7_aspectos_sociais = Secao7AspectosSociaisSerializer(required=False)
    secao_8_insumos_equipamentos = Secao8InsumosEquipamentosSerializer(required=False)
    secao_9_propagacao_vegetal = Secao9PropagacaoVegetalSerializer(required=False)
    secao_10_fitossanidade = Secao10FitossanidadeSerializer(required=False)
    secao_11_colheita = Secao11ColheitaSerializer(required=False)
    secao_12_pos_colheita = Secao12PosColheitaSerializer(required=False)
    secao_13_producao_animal = Secao13ProducaoAnimalSerializer(required=False)
    secao_14_comercializacao = Secao14ComercializacaoSerializer(required=False)
    secao_15_rastreabilidade = Secao15RastreabilidadeSerializer(required=False)
    secao_16_sac = Secao16SacSerializer(required=False)
    secao_17_opiniao = Secao17OpiniaoSerializer(required=False)
    secao_18_anexos = Secao18AnexosSerializer(required=False)
    secao_avaliacao_plano_manejo = SecaoAvaliacaoPlanoManejoSerializer(required=False)

# =============================================================================
# Serializer Principal do Modelo PMO (VERSÃO ATUALIZADA)
# =============================================================================

class PMOSerializer(serializers.ModelSerializer):
    # O campo form_data usará nosso serializer aninhado para validação
    form_data = FormularioPMOSerializer()
    # Adicionamos um campo extra (apenas para leitura) para mostrar o username
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = PMO
        fields = [
            'id',
            'owner',
            'owner_username',
            'nome_identificador', 
            'status',
            'version',
            'form_data',
            'created_at',
            'updated_at'
        ]
        # Campos que são apenas para leitura e não podem ser enviados pelo cliente
        read_only_fields = [
            'id',
            'owner',
            'owner_username',
            'created_at',
            'updated_at'
        ]

    def _convert_dates_to_iso(self, data):
        """
        Navega recursivamente na estrutura de dados e converte objetos 
        datetime.date para strings no formato ISO 8601.
        """
        if data is None: # Se o dado for None, retorna None
            return None
        if isinstance(data, dict):
            return {key: self._convert_dates_to_iso(value) for key, value in data.items()}
        elif isinstance(data, list):
            return [self._convert_dates_to_iso(element) for element in data]
        elif isinstance(data, datetime.date):
            return data.isoformat()
        else:
            return data
        
    def _parse_date_or_none(self, date_string):
        """
        Função auxiliar para converter uma string de data para um objeto date ou None.
        Retorna None se a string for vazia ou 'null'.
        """
        if date_string in ['', None, 'null']: # Handle empty string or 'null' string
            return None
        try:
            return datetime.date.fromisoformat(date_string)
        except (ValueError, TypeError):
            # Se o formato for inválido, podemos levantar um erro de validação
            # ou retornar None/original string dependendo do comportamento desejado.
            # Neste caso, para ser tolerante com campos opcionais, retornamos None.
            return None 

    def create(self, validated_data):
        """
        Cria uma nova instância do Plano de Manejo Orgânico.
        O 'owner' é adicionado na View (perform_create).
        """
        form_data = validated_data.pop('form_data')
        form_data_serializable = self._convert_dates_to_iso(form_data)
        
        instance = PMO.objects.create(
            form_data=form_data_serializable,
            **validated_data
        )
        return instance

    def update(self, instance, validated_data):
        
        form_data = validated_data.pop('form_data', None)
        
        # Converte strings vazias/null para None para os campos de data relevantes durante o update
        if form_data and 'secao_avaliacao_plano_manejo' in form_data:
            if 'espaco_oac' in form_data['secao_avaliacao_plano_manejo']:
                form_data['secao_avaliacao_plano_manejo']['espaco_oac']['data_recebimento_plano_manejo'] = \
                    self._parse_date_or_none(form_data['secao_avaliacao_plano_manejo']['espaco_oac'].get('data_recebimento_plano_manejo'))
            if 'status_documento' in form_data['secao_avaliacao_plano_manejo']:
                form_data['secao_avaliacao_plano_manejo']['status_documento']['data_analise'] = \
                    self._parse_date_or_none(form_data['secao_avaliacao_plano_manejo']['status_documento'].get('data_analise'))
                
        # Atualiza os campos do modelo principal que podem ser alterados
        instance.nome_identificador = validated_data.get('nome_identificador', instance.nome_identificador) # <-- LÓGICA ADICIONADA
        instance.status = validated_data.get('status', instance.status)
        instance.version = validated_data.get('version', instance.version)
        
        if form_data:
            form_data_serializable = self._convert_dates_to_iso(form_data)
            instance.form_data = form_data_serializable
            
        instance.save()
        return instance