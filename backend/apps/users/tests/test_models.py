import pytest

from apps.users.models import User


@pytest.mark.django_db
def test_user_manager_normalizes_email_and_sets_unusable_password():
    user = User.objects.create_user("Person@EXAMPLE.com")

    assert user.email == "Person@example.com"
    assert not user.has_usable_password()


@pytest.mark.django_db
def test_user_manager_requires_email():
    with pytest.raises(ValueError):
        User.objects.create_user("")
