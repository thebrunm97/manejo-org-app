# form_pmo/urls.py (CRIE ESTE NOVO ARQUIVO)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PMOViewSet # <-- Linha corrigida
from . import views

# Cria um roteador padrão do DRF para registrar o ViewSet
router = DefaultRouter()
router.register(r'pmos', PMOViewSet, basename='pmo')

urlpatterns = [
# Nova rota para a nossa página de teste
    path('test-interface/', views.pmo_test_page, name='pmo_test_page'),
    
    # Suas rotas da API DRF continuam aqui
    path('', include(router.urls)),
]