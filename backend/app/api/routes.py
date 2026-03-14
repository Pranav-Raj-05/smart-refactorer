from fastapi import APIRouter, UploadFile, File
from typing import List
from app.services.refactor_engine import process_code

router = APIRouter()


@router.post("/analyze")
async def analyze_files(files: List[UploadFile] = File(...)):

    results = []

    for file in files:

        code = await file.read()
        code = code.decode()

        result = process_code(code)

        results.append({
            "filename": file.filename,
            "result": result
        })

    return {"files": results}