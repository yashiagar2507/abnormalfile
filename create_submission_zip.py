import zipfile
import os

ZIP_NAME = "yashiagarwal_19990725.zip"
EXCLUDE_DIRS = {'venv', '__pycache__', 'node_modules', '.git', '.idea'}
EXCLUDE_FILES = {'.env.local', '.DS_Store'}

def should_include(file_path):
    return not any(part in EXCLUDE_DIRS for part in file_path.split(os.sep)) and \
           os.path.basename(file_path) not in EXCLUDE_FILES

with zipfile.ZipFile(ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for foldername, subfolders, filenames in os.walk('.'):
        for filename in filenames:
            file_path = os.path.join(foldername, filename)
            if should_include(file_path) and os.path.isfile(file_path):
                zipf.write(file_path, arcname=os.path.relpath(file_path, '.'))

print(f"✅ Created {ZIP_NAME}")
