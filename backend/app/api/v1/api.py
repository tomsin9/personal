from fastapi import APIRouter
from app.api.v1.endpoints import blog, projects

api_router = APIRouter()

api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])