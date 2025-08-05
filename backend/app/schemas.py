from pydantic import BaseModel, EmailStr

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
