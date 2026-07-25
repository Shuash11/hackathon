from django.db import migrations


def seed_categories(apps, schema_editor):
    category = apps.get_model("catalog", "Category")
    for name, slug in [
        ("Male", "male"),
        ("Female", "female"),
        ("Summer", "summer"),
        ("Winter", "winter"),
    ]:
        category.objects.get_or_create(slug=slug, defaults={"name": name})


class Migration(migrations.Migration):
    dependencies = [("catalog", "0001_initial")]

    operations = [migrations.RunPython(seed_categories, migrations.RunPython.noop)]
