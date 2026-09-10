import asyncio
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, Web!"}
@app.get("/hello/{name}")
def hello(name: str):
    return {"greeting": f"Hello {name}"}

@app.get("/add")
def add(a:int, b:int):
    return {"a": a, "b":b, "Sum": a+b}

@app.get("/slow")
async def slow_endpoint():
    await asyncio.sleep(1)
    return {"Message": "Dữ liệu đã được tải xong sau 1s"}

