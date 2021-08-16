from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import mysql.connector
import json
import csv
from root_config import main_root
import pandas as pd

from main import Transform_join, Transform_sort

mysql_connection = main_root()


def show_databases_tables(request):
    if request.method == 'GET':
        try:
            connection, databasename = mysql_connection.connection_databases()

            cursor = connection.cursor()

            cursor.execute("show databases")
            databases_name = cursor.fetchall()
            all_databases = [databases[0] for databases in databases_name]

            cursor.execute("show tables")
            tables_name = cursor.fetchall()
            all_tables = [tables[0] for tables in tables_name]

            cursor.execute("show columns from customers")
            column_name = cursor.fetchall()

            customers_columns = [columns[0] for columns in column_name]

            cursor.execute("show columns from orders")
            column_name = cursor.fetchall()

            orders_columns = [columns[0] for columns in column_name]

            print(customers_columns, orders_columns)
            connection.close()
            return JsonResponse({
                'status': True,
                "databases": all_databases,
                "tables": {databasename: all_tables},
                "customers_columns": customers_columns,
                "orders_columns": orders_columns,
                "msg": "Table created"
            })

        except Exception as e:
            print(e)
            return JsonResponse({'status': False, "msg": "Database not connected"})


@csrf_exempt
@api_view(['POST'])
def connection_table(request):

    if request.method == 'POST':

        conn_data = eval(request.body)

        try:

            connection = mysql_connection.root_config(conn_data)
            try:
                cur = connection.cursor()
                cur.execute("create database "+conn_data["database"])
                connection.close()
            except:
                return JsonResponse({"status": False, "msg": "Database already exist"})

            connect_data, _ = mysql_connection.connection_databases()
            cur = connect_data.cursor()
            cur.execute(
                '''create table customers(
                    CustomerID varchar(20),
                    CompanyName varchar(50),
                    ContactName varchar(50),
                    ContactTitle varchar(50)
                )'''
            )

            cus_path = "/opt/dataanalyzer/DataAnalyzer/customers.csv"
            cus_list = []
            with open(cus_path) as cus_file:
                cus_csv = csv.DictReader(cus_file)
                for i in cus_csv:
                    cus_list.append(i)
            cus_list = eval(json.dumps(cus_list))

            cus_query = '''INSERT INTO customers (
                            CustomerID,
                            CompanyName,
                            ContactName,
                            ContactTitle
                        ) VALUES (%s,%s,%s,%s)'''

            for data in cus_list:
                val = (data["CustomerID"], data["CompanyName"],
                       data["ContactName"], data["ContactTitle"])
                cur.execute(cus_query, val)
                connect_data.commit()

            cur.execute(
                '''create table orders(
                    CustomerID varchar(255), 
                    EmployeeID varchar(255), 
                    Freight varchar(255), 
                    OrderDate varchar(255), 
                    OrderID varchar(255), 
                    RequiredDate varchar(255), 
                    ShipVia varchar(255), 
                    ShippedDate varchar(255)
                )'''
            )

            # cur.execute(
            #     '''LOAD DATA INFILE '"/home/vkscnb/Desktop/DataAnalyzer/customers.csv"'
            #         INTO TABLE customers
            #         FIELDS TERMINATED BY ','
            #         ENCLOSED BY '"'
            #         LINES TERMINATED BY '\n'
            #         IGNORE 1 ROWS
            #         (CustomerID,CompanyName,ContactName,ContactTitle)
            #     '''
            # )

            # cur.execute(
            #     '''LOAD DATA INFILE 'cus_csv'
            #         INTO TABLE orders
            #         FIELDS TERMINATED BY ','
            #         ENCLOSED BY '"'
            #         LINES TERMINATED BY '\n'
            #         IGNORE 1 ROWS
            #     '''
            # )

            ord_path = "/opt/dataanalyzer/DataAnalyzer/orders.csv"
            ord_list = []
            with open(ord_path) as csv_file:
                ord_csv = csv.DictReader(csv_file)
                for i in ord_csv:
                    ord_list.append(i)
            ord_list = eval(json.dumps(ord_list))

            ord_query = '''INSERT INTO orders (
                            CustomerID,
                            EmployeeID,
                            Freight,
                            OrderDate,
                            OrderID,
                            RequiredDate,
                            ShipVia,
                            ShippedDate
                        ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)'''

            for data in ord_list:
                val1 = (data["CustomerID"],
                        data["EmployeeID"],
                        data["Freight"],
                        data["OrderDate"],
                        data["OrderID"],
                        data["RequiredDate"],
                        data["ShipVia"],
                        data["ShippedDate"]
                        )
                cur.execute(ord_query, val1)
                connect_data.commit()

            return JsonResponse({'status': True, "msg": "DataBase is connected"})
        except Exception as e:
            return JsonResponse({'status': False, "msg": "DataBase is not connected"})


@csrf_exempt
def join_tables(request):
    if request.method == 'POST':

        joining_data = eval(request.body)

        try:

            connection, _ = mysql_connection.connection_databases()
            cursor = connection.cursor()

            cursor.execute("select * from customers")
            row_headers = [x[0] for x in cursor.description]
            data = cursor.fetchall()
            json_data = []
            for result in data:
                json_data.append(dict(zip(row_headers, result)))
            table1 = eval(json.dumps(json_data))

            df_a = pd.DataFrame(table1)

            cursor.execute("select * from orders")
            row_headers = [x[0] for x in cursor.description]
            data = cursor.fetchall()
            json_data = []
            for result in data:
                json_data.append(dict(zip(row_headers, result)))
            table2 = eval(json.dumps(json_data))

            df_b = pd.DataFrame(table2)

            df_c = Transform_join(
                df_a, df_b, joining_data['columnName'], 'inner')

            join_data = eval(json.dumps(df_c.to_dict(orient='records')))
            return JsonResponse({"status": True, "msg": "table join", "join_data": join_data})

            connection.close()

        except Exception as e:
            return JsonResponse({"status": False, "msg": "table not join"})


@csrf_exempt
def transform_data(request):
    if request.method == "POST":
        try:

            transform_data = eval(request.body)

            df_b = pd.DataFrame(transform_data['data'])
            order = True if transform_data["orderby"] == "asce" else False
            df_d = Transform_sort(df_b, transform_data["selectid"], order)
            transform_data = eval(json.dumps(df_d.to_dict(orient='records')))

            return JsonResponse({"status": True, "msg": "transform data", "transform_data": transform_data})

        except Exception as e:
            return JsonResponse({"status": True, "msg": "not transform data"})

# @csrf_exempt
# def show_data(request):
#     if request.method == "POST":
#         try:

#             return JsonResponse({"status":True, "msg":"show data"})

#         except Exception as e:
#             return JsonResponse({"status":True, "msg":"not data created"})
