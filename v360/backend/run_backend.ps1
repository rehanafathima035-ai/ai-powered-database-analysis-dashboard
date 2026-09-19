Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
$env:PYTHONPATH = "."
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
