# Start backend server with correct environment
$backendPath = "C:\Users\Usuario\Documents\Gestion\FoodStore\RepositorioBaseFoodStore-SDD\backend"
$venvActivate = "$backendPath\venv\Scripts\Activate.ps1"
$env:PYTHONPATH = "C:\Users\Usuario\Documents\Gestion\FoodStore\RepositorioBaseFoodStore-SDD"

# Start uvicorn
& $venvActivate
cd $backendPath
python -m uvicorn backend.main:app --reload --port 8000
