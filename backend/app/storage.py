import os
from pathlib import Path

UPLOAD_URL = "/api/uploads"
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", Path(__file__).resolve().parent.parent / "uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
