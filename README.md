### Setup Step:
This is a Guide for setup for this application.

1. Installing Git

        $ sudo apt install git

2. Create directory "/opt/dataanalyzer" and give full permission.

        $ sudo mkdir /opt/dataanalyzer
        $ sudo chmod a+rwx /opt/dataanalyzer
        
3. Install and Setup virtualenv (Also includes setup for workon)

        First we need to install python-pip in order to be able to use pip
       
        $ sudo apt install python3-pip
        
        Once done, we can now install virtualenv
        
        $ sudo pip3 install virtualenv
        $ sudo pip3 install virtualenvwrapper
        

        $ vi ~/.bashrc
        
        Add these lines end of file:
        
            export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
            export VIRTUALENVWRAPPER_VIRTUALENV=/usr/local/bin/virtualenv
            export WORKON_HOME=/opt/dataanalyzer/DataAnalyzer/venv
            export PROJECT_HOME=/home/cpsln/projects
            source /usr/local/bin/virtualenvwrapper.sh

        > Restart the terminal to get the changes

4. Mysql installation and user creation:

       
        $ sudo apt-get install mysql-server
        $ sudo mysql
        

        Create user for ALL GRANT

        
        mysql> CREATE USER 'root'@'%' IDENTIFIED BY 'root';
        mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
        mysql> FLUSH PRIVILEGES;
       

5. Go to "/opt/dataanalyzer/" and Clone Repository:

        $ git clone https://gitlab.com/cpsln/DataAnalyzer.git 

6. Create a new virtualenv for "DataAnalyzer"

       $ mkvirtualenv data
        
7. Go to the cloned directory ,Location of this is supposed to be "/opt/dataanalyzer/DataAnalyzer"

        $ cd frontend
        $ npm i
        $ npm run build
        
8. Go to "/opt/dataanalyzer/DataAnalyzer/backend"

        $ pip install -r requirments.txt
        $ python manage.py runserver