from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectRead(BaseModel):
    id: int
    title: str
    description: str
    category: str
    image: str
    tags: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    updated_at: datetime
    order: str

    class Config:
        from_attributes = True