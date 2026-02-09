from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.project import Project
from app.schemas.project import ProjectRead
from typing import List

router = APIRouter()

@router.get("/", response_model=List[ProjectRead])
def read_projects(session: Session = Depends(get_session)):
    statement = select(Project).order_by(Project.order, Project.updated_at.desc())
    return session.exec(statement).all()


@router.post("/", response_model=Project)
def create_project(
    *,
    session: Session = Depends(get_session),
    project_in: Project
):
    # db_project = Project.model_validate(project_in)
    
    session.add(project_in)
    session.commit()
    session.refresh(project_in)
    return project_in