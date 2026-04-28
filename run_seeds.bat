@echo off
cd backend
call venv\Scripts\activate.bat
python ..\seed_database.py
pause
