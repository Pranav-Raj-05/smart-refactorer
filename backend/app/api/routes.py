from fastapi import APIRouter, UploadFile, File
from typing import List
from app.services.refactor_engine import process_code

router = APIRouter()

@router.post("/analyze")
async def analyze(files: List[UploadFile] = File(...)):

    results = []

    for file in files:
        code = (await file.read()).decode()

        print("Processing:", file.filename)

        result = process_code(code)

        results.append({
            "filename": file.filename,
            "result": result
        })

    return {"files": results}