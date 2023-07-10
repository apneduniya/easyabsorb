import firebase_admin
import pyrebase
import json
from fastapi import APIRouter, File, UploadFile, Depends, Form
from typing import Annotated

from firebase_admin import credentials, auth, storage
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, EmailStr
from firebase_admin import firestore
import string
import random



router = APIRouter()

if not firebase_admin._apps:
    cred = credentials.Certificate('easyabsorb-3305f-firebase-adminsdk-dniwu-f283d737a6.json')
    firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('firebase_config.json')))


class UploadPDF(BaseModel):
    # file: UploadFile = File(...)
    fileDesc: str
    categoryName:str
    userEmail: str
    password: str


@router.post("/upload")
async def upload_pdf(fileDesc: Annotated[str, Form()], categoryName: Annotated[str, Form()], userEmail: Annotated[str, Form()], password: Annotated[str, Form()], file: UploadFile = File(...)):

    print("test................................................................")

    try:
       pb.auth().sign_in_with_email_and_password(userEmail, password)
    except:
       return HTTPException(detail={'message': 'Something went wrong!'}, status_code=400)

    # file = file
    fileId = ''.join(random.choices(string.ascii_uppercase +
                             string.digits+ string.ascii_lowercase, k=16))
    fileContents = await file.read()
    
    # Save the PDF file to a local directory
    with open(f"{fileId}.pdf", "wb") as f:
        f.write(fileContents)

    # Upload the PDF file to Firebase Storage
    # bucket = storage.bucket(name="files")
    # blob = bucket.blob(fileId)
    # blob.upload_from_string(fileContents, content_type=file.content_type)   
    
    # Store additional details in Firebase Firestore
    db = firestore.client()
    doc_ref = db.collection("uploadFilesDetails").document(fileId)
    doc_ref.set({
        "fileName": file.filename,
        "fileDesc": fileDesc,
        "fileid": fileId,
        "categoryName": categoryName,
        "userEmail": userEmail
        # Add other custom fields as needed
    })
    
    return {"message": "PDF file uploaded and saved successfully."}