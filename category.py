import firebase_admin
import pyrebase
import json
from fastapi import APIRouter, File, UploadFile, Depends

from firebase_admin import credentials, auth, storage
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, EmailStr
from typing import List
from firebase_admin import firestore
import string
import random



router = APIRouter()

if not firebase_admin._apps:
    cred = credentials.Certificate('easyabsorb-3305f-firebase-adminsdk-dniwu-f283d737a6.json')
    firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('firebase_config.json')))


class Category(BaseModel):
    data: List[str] = []

class AddCategory(BaseModel):
    category: str
    email: str
    password: str

class GetCategory(BaseModel):
    email: str
    password: str

@router.post("/add")
async def add_categories(data: AddCategory):
    try:
       pb.auth().sign_in_with_email_and_password(data.email, data.password)
    except:
       return HTTPException(detail={'message': 'Something went wrong!'}, status_code=400)
    # Store additional details in Firebase Firestore
    db = firestore.client()
    doc_ref = db.collection("category").document(f"{data.email}")
    existing_category = doc_ref.get().to_dict()
    if existing_category is not None:
        existing_category: list = existing_category["categories"]
        existing_category.append(data.category)
    else:
        existing_category = [data.category]
    doc_ref.set({
        "categories": existing_category,
        # Add other custom fields as needed
    })
    
    # return {"message": f"{data.category} as category saved successfully."}
    return {"message": existing_category}


@router.post("/get")
async def get_categories(data: GetCategory):
    try:
       pb.auth().sign_in_with_email_and_password(data.email, data.password)
    except:
       return HTTPException(detail={'message': 'Something went wrong!'}, status_code=400)
    # Store additional details in Firebase Firestore
    db = firestore.client()
    doc_ref = db.collection("category").document(f"{data.email}")
    existing_category = doc_ref.get().to_dict()
    if existing_category is not None:
        existing_category: list = existing_category["categories"]
    else:
        return {"message": "null"}
    
    # return {"message": f"{data.category} as category saved successfully."}
    return {"message": existing_category}


