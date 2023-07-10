import requests, json
 
def signup(email: str, password: str):
   body = {
       "email": email,
       "password": password,
       "username": "Adarsh"
   }
   response = requests.post(url="http://127.0.0.1:8000/user/register", json=body)
   return response.text

def login(email: str, password: str):
   body = {
       "email": email,
       "password": password
   }
   response = requests.post(url="http://127.0.0.1:8000/user/login", json=body)
   return json.loads(response.text)["token"]
#    return json.loads(response.text)

# token = login("abcd@abcd.com", "password")
 
# def ping(token: str):
#    headers = {
#        'Authorization': token
#    }
#    response = requests.post(url="http://127.0.0.1:8000/user/ping", headers=headers)
#    return(response.text)

 
print(login("abcd@abcd.com", "password"))
# print(ping(token))