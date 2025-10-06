# form_pmo/views.py

from django.shortcuts import render  # Import necessário para renderizar a página HTML
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import PMO
from .serializers import PMOSerializer

class PMOViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que os PMOs sejam visualizados ou editados.

    Este ViewSet fornece as ações de CRUD completas e suporta filtragem,
    busca e ordenação dos resultados. A segurança garante que os usuários
    só possam interagir com seus próprios PMOs.
    """
    serializer_class = PMOSerializer
    permission_classes = [permissions.IsAuthenticated]

    # --- ADIÇÕES PARA FILTRAGEM, BUSCA E ORDENAÇÃO ---

    # 1. Define quais "plugins" de filtro a view irá usar.
    filter_backends = [
        DjangoFilterBackend,      # Para filtros exatos (ex: ?status=APROVADO)
        filters.SearchFilter,     # Para busca textual (ex: ?search=produtor)
        filters.OrderingFilter    # Para ordenação (ex: ?ordering=status)
    ]

    # 2. Define os campos para o DjangoFilterBackend (filtros exatos)
    filterset_fields = ['status', 'version']

    # 3. Define os campos para o SearchFilter (busca textual)
    #    Note a notação com duplo underscore para buscar dentro do JSONField!
    search_fields = ['form_data__secao_1_descricao_propriedade__dados_cadastrais__nome_produtor']

    # 4. Define os campos permitidos para o OrderingFilter
    ordering_fields = ['status', 'version', 'updated_at', 'created_at']
    
    # 5. Define a ordenação padrão para todas as listagens
    ordering = ['-updated_at']


    def get_queryset(self):
        """
        Esta view deve retornar uma lista de todos os PMOs
        para o usuário atualmente autenticado. A ordenação padrão é
        controlada pelo atributo 'ordering' da classe.
        """
        # self.request.user está disponível aqui graças ao IsAuthenticated
        # O .order_by() não é mais necessário aqui, pois o OrderingFilter cuida disso.
        return PMO.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        Define o usuário logado como o 'owner' do novo PMO ao criá-lo.
        """
        # O DRF passa o serializer validado para este método.
        # Nós apenas adicionamos o 'owner' antes de salvar.
        serializer.save(owner=self.request.user)

        from django.shortcuts import render

def pmo_test_page(request):
    """
    Renderiza a página HTML de teste para interagir com a API.
    """
    return render(request, 'form_pmo/test_page.html')