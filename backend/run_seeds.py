"""Script to run seeds - executed from backend directory"""
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from seeds import seed_roles, seed_estados_pedido, seed_formas_pago, run_all_seeds

if __name__ == "__main__":
    run_all_seeds()
