import mimetypes
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.core.exceptions import SuspiciousOperation
from django.core.files.base import ContentFile
from django.core.files.storage import Storage


class SupabaseStorageError(IOError):
    pass


class SupabaseStorage(Storage):
    """Stores media files in a public Supabase Storage bucket over its REST API."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._base_url = settings.SUPABASE_URL.rstrip("/")
        self._bucket = settings.SUPABASE_STORAGE_BUCKET
        self._service_key = settings.SUPABASE_SERVICE_ROLE_KEY
        if not (self._base_url and self._service_key and self._bucket):
            raise ImproperlyConfiguredSupabaseStorage()

    class ImproperlyConfiguredSupabaseStorage(SupabaseStorageError):
        def __init__(self):
            super().__init__("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_STORAGE_BUCKET are required")

    def _headers(self, extra: dict | None = None) -> dict:
        headers = {"Authorization": f"Bearer {self._service_key}", "apikey": self._service_key}
        if extra:
            headers.update(extra)
        return headers

    def _object_url(self, name: str, prefix: str = "object") -> str:
        return f"{self._base_url}/storage/v1/{prefix}/{self._bucket}/{name}"

    def _open(self, name: str):
        response = requests.get(self._object_url(name), headers=self._headers(), timeout=30)
        if response.status_code == 404:
            raise FileNotFoundError(name)
        if response.status_code != 200:
            raise SupabaseStorageError(f"Could not read {name}: HTTP {response.status_code}")
        return ContentFile(response.content, name=name)

    def _save(self, name: str, content) -> str:
        content_type = getattr(content, "content_type", None) or mimetypes.guess_type(name)[0] or "application/octet-stream"
        payload = content.read()
        query = urlencode({"x-upsert": "true"})
        response = requests.post(
            f"{self._object_url(name)}?{query}",
            data=payload,
            headers=self._headers({
                "Content-Type": content_type,
                "x-upsert": "true",
                "Cache-Control": "3600",
            }),
            timeout=60,
        )
        if response.status_code not in (200, 201):
            raise SupabaseStorageError(f"Could not save {name}: HTTP {response.status_code} {response.text[:200]}")
        return name

    def exists(self, name: str) -> bool:
        response = requests.head(f"{self._base_url}/storage/v1/object/info/public/{self._bucket}/{name}", timeout=10)
        return response.status_code == 200

    def url(self, name: str) -> str:
        if not name:
            raise ValueError("Empty file name")
        if ".." in name or name.startswith("/"):
            raise SuspiciousOperation("Attempted access to invalid path")
        return f"{self._base_url}/storage/v1/object/public/{self._bucket}/{name}"

    def delete(self, name: str) -> None:
        response = requests.delete(self._object_url(name), headers=self._headers(), timeout=30)
        if response.status_code == 404:
            return
        if response.status_code != 200:
            raise SupabaseStorageError(f"Could not delete {name}: HTTP {response.status_code}")

    def size(self, name: str) -> int:
        response = requests.head(f"{self._base_url}/storage/v1/object/info/public/{self._bucket}/{name}", timeout=10)
        if response.status_code != 200:
            raise FileNotFoundError(name)
        return int(response.headers.get("Content-Length", 0))

    def listdir(self, path: str = ""):
        prefix = f"{path.strip('/')}/" if path else ""
        response = requests.get(
            f"{self._base_url}/storage/v1/object/list/{self._bucket}",
            json={"prefix": prefix},
            headers=self._headers(),
            timeout=30,
        )
        if response.status_code != 200:
            raise SupabaseStorageError(f"Could not list {path}: HTTP {response.status_code}")
        entries = response.json() or []
        directories, files = [], []
        for entry in entries:
            name = entry.get("name", "")
            full = f"{prefix}{name}"
            if entry.get("id") is None:
                directories.append(full.rstrip("/"))
            else:
                files.append(full)
        return directories, files

    def get_available_name(self, name: str, max_length: int | None = None) -> str:
        return name
