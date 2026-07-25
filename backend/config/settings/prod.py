from .base import *  # noqa: F403

from django.core.exceptions import ImproperlyConfigured

DEBUG = False
if SECRET_KEY == "unsafe-development-key-change-me":  # noqa: F405
    raise ImproperlyConfigured("SECRET_KEY must be set in production")
if DATABASES["default"]["ENGINE"] != "django.db.backends.postgresql":  # noqa: F405
    raise ImproperlyConfigured("DATABASE_URL must configure a PostgreSQL database in production")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
JWT_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
X_FRAME_OPTIONS = "DENY"
