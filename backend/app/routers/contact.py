from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/contact", status_code=status.HTTP_201_CREATED)
def create_contact(contact: schemas.ContactMessage, db: Session = Depends(get_db)):
    try:
        db_contact = models.Contact(
            name=contact.name,
            email=contact.email,
            subject=contact.subject,
            message=contact.message
        )
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return {"message": "Contact message received", "id": db_contact.id}
    except Exception as e:
        # Log the error as needed here
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save contact message"
        )
