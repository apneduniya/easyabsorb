from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import user
import uploadPdf
import category



app = FastAPI()

# Set the allowed origins, methods, headers, and other CORS options
# origins = [
#     "http://localhost",
#     "http://localhost:3000",
#     "http://127.0.0.1:5500/"
# ]

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/user")
app.include_router(uploadPdf.router, prefix="/upload")
app.include_router(category.router, prefix="/category")


@app.on_event("startup")
async def startup_event():
    # Perform startup tasks, such as connecting to the database or initializing services

    print("\nS E R V E R   S T A R T I N G . . . . . . . . . .\n")


@app.on_event("shutdown")
async def shutdown_event():
    # Perform cleanup tasks, such as closing database connections or releasing resources
    
    print("\nS E R V E R   S H U T D O W N . . . . . . . . . .\n")





if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
