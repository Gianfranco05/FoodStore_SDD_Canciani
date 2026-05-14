"""Create foodstore database in MySQL"""
from sqlalchemy import create_engine, text

# Use the same settings as the rest of the app
try:
    from config import get_settings
    settings = get_settings()
    # Strip the database name to connect without specifying a DB
    db_url = settings.DATABASE_URL.rsplit("/", 1)[0]
except Exception:
    # Fallback: try without database name, no password
    db_url = "mysql+mysqlconnector://root@localhost:3306"

print(f"Connecting to MySQL at {db_url}...")
print("(to create 'foodstore' database)")
try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        conn.execute(text("CREATE DATABASE IF NOT EXISTS foodstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
        print("[OK] Database 'foodstore' created successfully!")
        
        # Verify
        result = conn.execute(text("SHOW DATABASES LIKE 'foodstore'"))
        if result.fetchone():
            print("[OK] Verified: 'foodstore' database exists")
        
except Exception as e:
    print(f"[ERROR] Error: {e}")
    print("\n💡 Tips:")
    print("   1. Asegurate de tener MySQL corriendo (net start MySQL)")
    print("   2. Revisá tu usuario/contraseña en backend/.env")
    print("   3. Si tu root no tiene password, cambialo en .env:")
    print("      DATABASE_URL=mysql+mysqlconnector://root@localhost:3306/foodstore")
finally:
    engine.dispose()
