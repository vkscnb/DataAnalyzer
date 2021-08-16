from django.db import models


class Customers(models.Model):
    CustomerID = models.CharField(max_length=20, )
    CompanyName = models.CharField(max_length=100, )
    ContactName = models.CharField(max_length=100, )
    ContactTitle = models.CharField(max_length=100, )

class Orders(models.Model):
    CustomerID = models.CharField(max_length=20, )
    EmployeeID = models.CharField(max_length=20, )
    Freight =  models.CharField(max_length=20, )
    OrderDate = models.CharField(max_length=20, )
    OrderID = models.CharField(max_length=20, )
    RequiredDate = models.CharField(max_length=20, )  
    ShipVia = models.CharField(max_length=20, )
    ShippedDate = models.CharField(max_length=20, )


