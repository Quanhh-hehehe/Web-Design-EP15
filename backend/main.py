import asyncio
import time
from fastapi import Request
from fastapi import Header, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, Web!"}

@app.get("/add")
def add(a:int, b:int):
    return {"a": a, "b":b, "Sum": a+b}

@app.get("/slow")
async def slow_endpoint():
    await asyncio.sleep(1)
    return {"Message": "Dữ liệu đã được tải xong sau 1s"}

@app.get("/items/me")
def read_me():
    return ("Welcome")
@app.get("/suit/{item_id}")
def hello(item_id: int):
    return {"item_id": f"Hello {item_id}"}

@app.get("/items")
def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(0, ge=1, le=100),
    q: str | None = Query(None, min_length=2),
):
    return {"skip": skip, "limit": limit, "q": q}
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

items = []

@app.post("/items")
def create_item(item: Item):
    items.append(item)
    return {
        "message": "Thêm item thành công!",
        "item": item
    }
#--Lab 1--#    
class Item(BaseModel):
    id: int
    name: str
    price: float

items_list = []
@app.get("/items")
def get_all_items():
    return items_list

@app.get("/items/{item_id}")
def get_item(item_id: int):
    for item in items_list:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Không tìm thấy Item")

@app.post("/items")
def create_item(new_item: Item):
    items_list.append(new_item)
    return {"message": "Đã thêm thành công", "item": new_item}

@app.put("/items/{item_id}")
def update_item(item_id: int, updated_item: Item):
    for index, item in enumerate(items_list):
        if item.id == item_id:
            items_list[index] = updated_item
            return {"message": "Đã cập nhật thành công"}
    raise HTTPException(status_code=404, detail="Không tìm thấy Item để cập nhật")

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    for index, item in enumerate(items_list):
        if item.id == item_id:
            items_list.pop(index)
            return {"message": "Đã xóa thành công"}
    raise HTTPException(status_code=404, detail="Không tìm thấy Item để xóa")

#--Lab 2--
current_id = 1 
class ItemCreate(BaseModel):
    name: str
    price: float

@app.get("/items")
def get_all_items(
    skip: int = Query(0, ge=0),          
    limit: int = Query(10, ge=1, le=100) 
):
    return items_list[skip : skip + limit]

@app.post("/items", status_code=201)
def create_item(item_in: ItemCreate):
    global current_id
    new_item = {"id": current_id, "name": item_in.name, "price": item_in.price}
    items_list.append(new_item)
    current_id += 1
    return new_item

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    for index, item in enumerate(items_list):
        if item["id"] == item_id:
            items_list.pop(index)
            return
    raise HTTPException(status_code=404, detail="Không tìm thấy")

#--Lab 3--#
@app.get("/api/items")
def get_items():
    return [{"id": 1, "name": "Bàn phím cơ", "price": 1000}]
app.mount("/app", StaticFiles(directory="../frontend", html=True), name="frontend")

class ItemCreate(BaseModel):
    name: str
    price: float

class ItemPublic(BaseModel):
    id: int
    name: str
    price: float

class ItemUpdate(BaseModel):
    name: str | None = None
    price: float | None = None

# Part D: Model bao bọc dữ liệu trả về 
class ItemListResponse(BaseModel):
    items: List[ItemPublic]
    total: int
    skip: int
    limit: int

items_db = []
current_id = 1 

# Part C: Hàm hỗ trợ kiểm tra trùng tên 
def check_duplicate_name(new_name: str, ignore_id: int = None):
    for item in items_db:
        # Nếu tên giống nhau VÀ không phải là chính item đang được sửa
        if item["name"].lower() == new_name.lower() and item["id"] != ignore_id:
            raise HTTPException(status_code=409, detail="Item with this name already exists")

# Lấy danh sách (GET /items) 
@app.get("/items", response_model=ItemListResponse)
def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    min_price: float | None = None,
    max_price: float | None = None,
    q: str | None = Query(None, min_length=2),
    sort_by: str = Query("id", pattern="^(id|name|price)$"),
    order: str = Query("asc", pattern="^(asc|desc)$")
):
    # Bước 1: Lọc dữ liệu (Filtering)
    filtered_items = []
    for item in items_db:
        if min_price is not None and item["price"] < min_price:
            continue
        if max_price is not None and item["price"] > max_price:
            continue
        if q is not None and q.lower() not in item["name"].lower():
            continue
        filtered_items.append(item)

    total_count = len(filtered_items)

    is_reverse = True if order == "desc" else False
    filtered_items.sort(key=lambda x: x[sort_by], reverse=is_reverse)
    final_items = filtered_items[skip : skip + limit]
    return {
        "items": final_items,
        "total": total_count,
        "skip": skip,
        "limit": limit
    }


# Lấy 1 phần tử (GET /items/{id}) 
@app.get("/items/{item_id}", response_model=ItemPublic)
def get_item(item_id: int):
    for item in items_db:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item không tồn tại")


# Thêm mới (POST /items)
@app.post("/items", response_model=ItemPublic, status_code=201)
def create_item(item_in: ItemCreate):
    global current_id
    check_duplicate_name(item_in.name)
    new_item = {
        "id": current_id,
        "name": item_in.name,
        "price": item_in.price
    }
    items_db.append(new_item)
    current_id += 1
    
    return new_item

@app.put("/items/{item_id}", response_model=ItemPublic)
def update_item(item_id: int, item_in: ItemCreate):
    for index, item in enumerate(items_db):
        if item["id"] == item_id:
            check_duplicate_name(item_in.name, ignore_id=item_id)
            
            items_db[index]["name"] = item_in.name
            items_db[index]["price"] = item_in.price
            return items_db[index]
            
    raise HTTPException(status_code=404, detail="Item không tồn tại")

@app.patch("/items/{item_id}", response_model=ItemPublic)
def patch_item(item_id: int, item_in: ItemUpdate):
    for index, item in enumerate(items_db):
        if item["id"] == item_id:
            update_data = item_in.model_dump(exclude_unset=True)

            if "name" in update_data:
                check_duplicate_name(update_data["name"], ignore_id=item_id)
            for key, value in update_data.items():
                items_db[index][key] = value
                
            return items_db[index]
            
    raise HTTPException(status_code=404, detail="Item không tồn tại")

# API 6: Xóa (DELETE /items/{id}) 
@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    for index, item in enumerate(items_db):
        if item["id"] == item_id:
            items_db.pop(index)
            return
    raise HTTPException(status_code=404, detail="Item không tồn tại")
app.mount("/app", StaticFiles(directory="../frontend", html=True), name="frontend")

# Week 8:
def verify_api_key(x_api_key: str =Header(...)):
    if x_api_key != "expected-secret":
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

@app.get("/secure-data", dependencies=[Depends(verify_api_key)])
def secure_data():
     return {"ok": True}

 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://127.0.0.1:5500"] ,
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"] ,
)
@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start =time.perf_counter()
    response=await call_next(request)
    response.headers["X-Process-Time"] = str(time.perf_counter()- start)
    return response

@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        print(f"Unhandled error on {request.url.path}: {exc}")
        return JSONResponse(status_code=500,
                            content={"detail": "Internal server error"})

_cart = []
@app.post("/cart/add")
def add_cart_item(item: str):
    _cart.append(item)
    return item 

@app.get("/cart")
def get_cart():
    return _cart

