from rest_framework import serializers


class GoogleCredentialSerializer(serializers.Serializer):
    credential = serializers.CharField(trim_whitespace=True)
