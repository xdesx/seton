import sqlite3
import random
import string
import os

def create_initial_db_and_populate(db_name):
    # Connect to SQLite database
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE notes (
        dateCreated DATETIME,
        dateUpdated DATETIME,
        title TEXT,
        content TEXT,
        tag TEXT
    )
    ''')
    
    for _ in range(10000):
        title = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        content = ''.join(random.choices(string.ascii_uppercase + string.digits, k=50))
        tag = ''.join(random.choices(string.ascii_uppercase, k=5))
        cursor.execute('''
        INSERT INTO notes (dateCreated, dateUpdated, title, content, tag)
        VALUES (datetime('now'), datetime('now'), ?, ?, ?)
        ''', (title, content, tag))
    
    conn.commit()
    conn.close()

def execute_sql_script(db_name, script_path):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    with open(script_path, 'r') as f:
        script = f.read()
        print(script_path)
        cursor.executescript(script)
    conn.commit()
    conn.close()

def main():
    db_name = 'test.db'
    
    create_initial_db_and_populate(db_name)
    
    sql_scripts = [
        '01.sql',
        '02.sql',
        '03.sql',
        '04.sql'
    ]
    for script in sql_scripts:
        if os.path.exists(script):
            execute_sql_script(db_name, script)
        else:
            print(f"Script {script} not found!")
    
    print("Database setup and migration complete.")

if __name__ == "__main__":
    main()
