from rest_framework import serializers


class GoogleCredentialSerializer(serializers.Serializer):
    credential = serializers.CharField(trim_whitespace=True)


class SupabaseCredentialSerializer(serializers.Serializer):
    access_token = serializers.CharField(trim_whitespace=True)
    credential = serializers.CharField(trim_whitespace=True, required=False)
