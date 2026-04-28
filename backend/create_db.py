"""Create foodstore database in MySQL"""
from sqlalchemy import create_engine, text

# Connect without specifying database
db_url = "mysql+mysqlconnector://root@localhost:3306"

print("Connecting to MySQL to create 'foodstore' database...")
try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        # Create database if not exists
        conn.execute(text("CREATE DATABASE IF NOT EXISTS foodstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
        print("[OK] Database 'foodstore' created successfully!")
        
        # Verify
        result = conn.execute(text("SHOW DATABASES LIKE 'foodstore'"))
        if result.fetchone():
            print("[OK] Verified: 'foodstore' database exists")
        
except Exception as e:
    print(f"[ERROR] Error: {e}")
finally:
    engine.dispose()
