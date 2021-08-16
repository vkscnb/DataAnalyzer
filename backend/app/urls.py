from django.conf.urls import url
from . import views 

urlpatterns = [
        url('show-database-tables', views.show_databases_tables),
        # url('show-columns-name',views.show_columns_name),
        url("join-table",views.join_tables),
        url("transform-data",views.transform_data),
        url("connection",views.connection_table)
]