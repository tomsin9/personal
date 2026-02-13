from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func
from typing import List, Dict, Any

from app.api.deps import get_current_user, get_current_user_optional
from app.db.session import get_session
from app.models.blog import Blog

router = APIRouter()

# Read all Blog Posts (only published for anonymous; admin sees all including drafts)
@router.get("/", response_model=Dict[str, Any])
def read_posts(
        *,
        session: Session = Depends(get_session),
        current_user: str | None = Depends(get_current_user_optional),
        page: int = Query(1, ge=1),      # Which page, default 1
        size: int = Query(12, ge=1, le=100) # How many records per page, default 12
    ):
    # 1. Anonymous only sees published posts; admin sees all
    list_statement = select(Blog).order_by(Blog.created_at.desc())
    if not current_user:
        list_statement = list_statement.where(Blog.is_published == True)

    # 2. Total count for pagination (same filter)
    total_statement = select(func.count()).select_from(Blog)
    if not current_user:
        total_statement = total_statement.where(Blog.is_published == True)
    total = session.exec(total_statement).one()

    # 3. Current page of items
    offset = (page - 1) * size
    list_statement = list_statement.offset(offset).limit(size)
    results = session.exec(list_statement).all()

    return {
        "items": results,
        "total": total,
        "page": page,
        "size": size
    }


# Read a specific Blog Post (drafts only visible to authenticated admin)
@router.get("/{blog_id}", response_model=Blog)
def read_post(
    blog_id: int,
    session: Session = Depends(get_session),
    current_user: str | None = Depends(get_current_user_optional),
):
    blog = session.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Post not found")
    if not blog.is_published and not current_user:
        raise HTTPException(status_code=404, detail="Post not found")
    return blog


# Create a new Blog Post
@router.post("/", response_model=Blog)
def create_post(
        blog_input: Blog, 
        session: Session = Depends(get_session), 
        username: str = Depends(get_current_user)
    ):
    """
    Receive JSON data and store it in the PostgreSQL
    """
    
    # Create a new blog object, ensure id is created from database
    db_blog = Blog.model_validate(blog_input)
    
    # Store the blog data in the session (temporary storage)
    session.add(db_blog)
    
    # Commit the changes to the database (save to the database)
    session.commit()
    
    # Refresh the blog object from the database (get the id or timestamp of the blog)
    session.refresh(db_blog)
    
    return db_blog


@router.patch("/{blog_id}", response_model=Blog)
def update_post(
        blog_id: int,
        blog_in: Blog,
        session: Session = Depends(get_session),
        username: str = Depends(get_current_user)
    ):
    db_blog = session.get(Blog, blog_id)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Exclude id from being updated, update the rest of the fields dynamically
    blog_data = blog_in.model_dump(exclude_unset=True)
    for key, value in blog_data.items():
        if key != "id":
            setattr(db_blog, key, value)

    db_blog.updated_at = datetime.now(timezone.utc)
    session.add(db_blog)
    session.commit()
    session.refresh(db_blog)
    return db_blog


@router.delete("/{blog_id}")
def delete_post(
        blog_id: int,
        session: Session = Depends(get_session),
        username: str = Depends(get_current_user)
    ):
    db_blog = session.get(Blog, blog_id)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Post not found")
    
    session.delete(db_blog)
    session.commit()
    return {"ok": True}