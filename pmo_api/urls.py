# pmo_api/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# --- ADICIONADO: Importações para o drf-spectacular ---
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- ADICIONADO: Endpoints da Documentação da API ---
    # Rota que gera o arquivo schema.yml (o "manual" da API)
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Rota para a interface interativa do Swagger UI
    path('api/v1/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # (Opcional) Rota para a interface de documentação alternativa do ReDoc
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


    # --- SUAS ROTAS EXISTENTES (mantidas) ---
    # Nossas URLs da API da aplicação 'form_pmo'
    path('api/v1/', include('form_pmo.urls')),

    # Endpoints de autenticação JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Mantemos o 'api-auth' para o login/logout na API Navegável durante o desenvolvimento
    path('api-auth/', include('rest_framework.urls')),
]