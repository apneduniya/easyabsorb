import firebase_admin
import pyrebase
import json
from fastapi import Request, APIRouter

from firebase_admin import credentials, auth
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    password: str
    username: str

# class UserResponse(UserBase):
#     email: EmailStr
#     uid: str

class UserCreate(UserBase):
    email: EmailStr
    password: str
    username: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


router = APIRouter()

if not firebase_admin._apps:
    cred = credentials.Certificate('easyabsorb-3305f-firebase-adminsdk-dniwu-f283d737a6.json')
    firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('firebase_config.json')))


# signup endpoint
@router.post("/register")
async def register(data: UserCreate):
#    req = await request.json()
#    email = req['email']
#    password = req['password']
   email = data.email
   password = data.password
   username = data.username
   if email is None or password is None:
       return HTTPException(detail={'message': 'Error! Missing Email or Password'}, status_code=400)
   try:
       user = auth.create_user(
           email=email,
           password=password,
       )
       return JSONResponse(content={'message': f'Successfully! {username} has created account with uid: {user.uid} and email: {email}', "email": email, "password": password}, status_code=200)    
   except Exception as e:
       print(e)
       return HTTPException(detail={'message': 'Error Creating User'}, status_code=400)
   

@router.post("/login")
async def login(data: UserLogin):
   email = data.email
   password = data.password
   try:
       user = pb.auth().sign_in_with_email_and_password(email, password)
       print(user)
       jwt = user['idToken']
       return JSONResponse(content={'token': jwt, 'message': "success", "email": email, "password": password}, status_code=200)
   except:
       return HTTPException(detail={'message': 'There was an error logging in'}, status_code=400)


# ping endpoint
# @router.post("/ping", include_in_schema=False)
# async def validate(request: Request):
#    headers = request.headers
#    jwt = headers.get('authorization')
#    print(f"jwt:{jwt}")
#    user = auth.verify_id_token(jwt)
#    return user["uid"]

