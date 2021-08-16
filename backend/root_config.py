import mysql.connector


class main_root():
    def __init__(self):
        self.connection = ''
        self.host = ''
        self.username = ''
        self.password = ''
        self.database = ''

    def root_config(self, data):
        self.host = data['host']
        self.username = data['username']
        self.password = data['password']
        self.database = data['database']

        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.username,
                passwd=self.password
            )
            if self.connection.is_connected():
                return self.connection

        except:
            return

    def connection_databases(self):
        self.connection = mysql.connector.connect(
            host=self.host,
            database=self.database,
            user=self.username,
            password=self.password
        )

        if self.connection.is_connected():
            return self.connection, self.database
        return
