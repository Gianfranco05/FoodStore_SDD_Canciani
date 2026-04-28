"""Test MySQL connection"""
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Test connection
db_url = "mysql+mysqlconnector://root@localhost:3306/foodstore"

print(f"Testing connection to: {db_url}")
print("(Using root user without password)")

try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        result = conn.execute("SELECT 1")
        print("✅ MySQL connection successful!")
        
        # Check if foodstore database exists
        from sqlalchemy import text
        try:
            conn.execute(text("USE foodstore"))
            print("✅ Database 'foodstore' exists")
        except:
            print("⚠️  Database 'foodstore' does not exist - will need to create it")
            
except OperationalError as e:
    print(f"❌ Connection failed: {e}")
    print("\nTroubleshooting:")
    print("1. Make sure MySQL is running")
    print("2. Check if you need a password (update the URL in config.py, database.py, alembic.ini)")
    print("3. Verify the database 'foodstore' exists")
except Exception as e:
    print(f"❌ Error: {e}")
