import psycopg2
from psycopg2.extras import RealDictCursor
import sqlite3

def test_sqlite():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE test (id INTEGER)')
    conn.commit()
    print("SQLite OK")

test_sqlite()
