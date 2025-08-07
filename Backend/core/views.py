from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
import requests as python_requests
from .models import Transaction
from .serializers import TransactionSerializer

User = get_user_model()


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return transactions only for the authenticated user
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically set the user to the authenticated user
        serializer.save(user=self.request.user)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"
    client_class = OAuth2Client
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            # Handle both id_token and access_token formats
            id_token_str = request.data.get('id_token')
            access_token = request.data.get('access_token')

            if id_token_str:
                # If we have an ID token, convert it to access_token format
                try:
                    # Verify the ID token
                    google_request = requests.Request()
                    id_info = id_token.verify_oauth2_token(
                        id_token_str, google_request,
                        "456527559253-4utvgg85fj5gskq42asvlr6pqje53uuf.apps.googleusercontent.com"
                    )

                    # Get user info from Google using the ID token
                    google_user_info_url = f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={id_token_str}"

                    # For ID tokens, we need to extract user info differently
                    email = id_info.get('email')
                    name = id_info.get('name', '')
                    google_id = id_info.get('sub')

                    # Create or get user
                    user, created = User.objects.get_or_create(
                        email=email,
                        defaults={
                            'username': email,
                            'first_name': name.split(' ')[0] if name else '',
                            'last_name': ' '.join(name.split(' ')[1:]) if len(name.split(' ')) > 1 else '',
                        }
                    )

                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)

                    return Response({
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                        }
                    }, status=status.HTTP_200_OK)

                except Exception as e:
                    print(f"ID token verification failed: {e}")
                    return Response(
                        {'error': 'Invalid ID token', 'details': str(e)},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            elif access_token:
                # Use the original dj-rest-auth flow
                return super().post(request, *args, **kwargs)

            else:
                return Response(
                    {'error': 'Either id_token or access_token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print(f"Google login error: {e}")
            return Response(
                {'error': 'Google authentication failed', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )