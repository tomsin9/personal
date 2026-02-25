import os, shutil, uuid, io

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from typing import List
from PIL import Image
from pathlib import Path

from app.api.deps import get_current_user
from app.db.session import get_session
from app.models.project import Project
from app.schemas.project import ProjectRead

router = APIRouter()

# ensure the upload directory exists
UPLOAD_DIR = "static/uploads/projects"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[ProjectRead])
def read_projects(session: Session = Depends(get_session)):
    statement = select(Project).order_by(Project.order, Project.updated_at.desc())
    return session.exec(statement).all()


@router.post("/", response_model=Project)
def create_project(
        *,
        session: Session = Depends(get_session),
        project_in: Project,
        username: str = Depends(get_current_user)
    ):
    # db_project = Project.model_validate(project_in)
    
    session.add(project_in)
    session.commit()
    session.refresh(project_in)
    return project_in


@router.patch("/{project_id}", response_model=Project)
def update_project(
        project_id: int, 
        project_in: Project, 
        session: Session = Depends(get_session),
        username: str = Depends(get_current_user)
    ):
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Exclude id from being updated, update the rest of the fields dynamically
    project_data = project_in.model_dump(exclude_unset=True)
    for key, value in project_data.items():
        if key != "id":
            setattr(db_project, key, value)
            
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


@router.delete("/{project_id}")
def delete_project(
        project_id: int, 
        session: Session = Depends(get_session), 
        username: str = Depends(get_current_user)
    ):
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete image file from disk if it's our uploaded file
    if db_project.image and "/static/uploads/projects/" in db_project.image:
        # Extract "uuid.webp" from "/static/uploads/projects/uuid.webp"
        file_name = db_project.image.split("/")[-1]
        
        base_dir = Path(UPLOAD_DIR).resolve() 
        file_path = base_dir / file_name
        
        print(f"DEBUG: 嘗試刪除檔案的路徑為: {file_path}")
        print(f"DEBUG: 該檔案是否存在: {file_path.exists()}")

        if file_path.exists():
            try:
                os.remove(str(file_path))
                print(f"SUCCESS: 檔案 {file_name} 已從硬碟刪除")
            except OSError as e:
                print(f"ERROR: 刪除檔案失敗: {e}")
        else:
            print(f"WARNING: 檔案不存在於 {file_path}，僅從數據庫移除紀錄")
    
    session.delete(db_project)
    session.commit()
    return {"ok": True}


@router.post("/upload")
async def upload_project_image(
        file: UploadFile = File(...),
        username: str = Depends(get_current_user)
    ):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only images are allowed")

    file_name = f"{uuid.uuid4()}.webp"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    try:
        # 2. 讀取並轉換格式
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        
        max_size = (800, 800)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
            
        image.save(file_path, "WEBP", quality=95)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {e}")

    return {"image_url": f"/static/uploads/projects/{file_name}"}