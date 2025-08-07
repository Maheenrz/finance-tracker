from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Transaction(models.Model):
    TRANSACTION_TYPE = (
    ("INCOME", "Income"),
    ("EXPENSE", "Expense"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    transaction_type = models.CharField(max_length=100, choices=TRANSACTION_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.transaction_type} - {self.amount}"

