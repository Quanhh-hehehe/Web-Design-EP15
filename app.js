// ==========================================
// Khởi tạo dữ liệu (Model a list of prediction samples)
// ==========================================
// Đổi tên biến để khắc phục lỗi "has already been declared"
const predictionSamplesList = [
    { id: 1, name: "Mô hình Alpha", result: 75 },
    { id: 2, name: "Mô hình Beta", result: 92 },
    { id: 3, name: "Mô hình Gamma", result: 88 },
    { id: 4, name: "Mô hình Delta", result: 60 },
    { id: 5, name: "Mô hình Epsilon", result: 95 }
];

console.log("--- DỮ LIỆU BAN ĐẦU ---");
console.log(predictionSamplesList);

// ==========================================
// Yêu cầu 1: Vòng lặp for để lọc mảng theo điều kiện
// (Ví dụ: Lọc các mẫu có result > 80)
// ==========================================
const highResultSamples = [];

for (let i = 0; i < predictionSamplesList.length; i++) {
    if (predictionSamplesList[i].result > 80) {
        highResultSamples.push(predictionSamplesList[i]);
    }
}

console.log("\n--- YÊU CẦU 1: Lọc kết quả (result > 80) ---");
console.log(highResultSamples);

// ==========================================
// Yêu cầu 2 & Bonus: Hàm tính tổng (Chuyển thành Arrow Function)
// (Tính tổng trường 'result' của tất cả các object)
// ==========================================
const sumResults = (samples) => {
    let total = 0;
    for (let sample of samples) {
        total += sample.result;
    }
    return total;
};

console.log("\n--- YÊU CẦU 2 & BONUS: Tính tổng bằng Arrow Function ---");
console.log("Tổng tất cả các result:", sumResults(predictionSamplesList));

// ==========================================
// Yêu cầu 3: Hàm tìm object có giá trị lớn nhất dùng vòng lặp for
// (Tìm mẫu dự đoán có result cao nhất)
// ==========================================
function findMaxResultSample(samples) {
    if (samples.length === 0) return null;

    let maxSample = samples[0]; 
    
    for (let i = 1; i < samples.length; i++) {
        if (samples[i].result > maxSample.result) {
            maxSample = samples[i]; 
        }
    }
    return maxSample;
}

console.log("\n--- YÊU CẦU 3: Tìm object có result lớn nhất ---");
console.log("Mẫu có kết quả cao nhất là:", findMaxResultSample(predictionSamplesList));

// Lớp bảo vệ: Đợi HTML tải xong 100% rồi mới chạy JavaScript
document.addEventListener("DOMContentLoaded", function() {
    
    const form = document.getElementById("house-price-form");
    const messageContainer = document.getElementById("message-container");

    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            messageContainer.innerHTML = ""; 
            const addressValue = document.getElementById("address").value.trim();
            const bedroomsValue = document.getElementById("bedrooms").value;
            const bedroomsNumber = Number(bedroomsValue);

            let errorMessage = "";

            if (addressValue === "" || bedroomsValue === "") {
                errorMessage = "Lỗi: Vui lòng nhập đầy đủ các trường bắt buộc!";
            } else if (bedroomsNumber <= 0) {
                errorMessage = "Lỗi: Số phòng ngủ phải là một số dương!";
            }

            if (errorMessage !== "") {
                const errorElement = document.createElement("p");
                errorElement.textContent = errorMessage;
                errorElement.style.color = "red";
                messageContainer.appendChild(errorElement);
            } else {
                const successElement = document.createElement("p");
                successElement.textContent = "Ready to submit"; 
                successElement.style.color = "green";
                messageContainer.appendChild(successElement);
            }
        });
    }

    // Đưa 2 hàm này vào trong lớp bảo vệ để tránh lỗi Cannot set properties of null
    callWithAsyncAwait();
    renderPostCards();
});

//Week 4
fetch("https://jsonplaceholder.typicode.com/users")
    .then(function (response){ 
        return response.json ();
    })
    .then(function (data) { 
        console.log(data);
    })
    .catch(function (error){ 
        console.error('Something went wrong:' , error);
    });

async function fetchUsers() {
    return "Hello";
}

// Week 4 Lab 1 
function simulateNetworkDelay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout (() => {
            resolve(`Dữ liệu đã được tải về sau ${ms}ms`);
        }, ms);
    });
}

function callWiththen (){
    console.log(" Đang gọi API bằng. then()...");
    simulateNetworkDelay(2000)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
        });
}

callWiththen();

async function callWithAsyncAwait() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json(); 
    
    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return; // Bảo vệ thêm nếu trang HTML không có thẻ này

    let rowsHtml = "";
    
    data.forEach(user => {
      rowsHtml += `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.address.suite}, ${user.address.street}, ${user.address.city}</td>
        </tr>
      `;
    });
    tableBody.innerHTML = rowsHtml;
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

// Week 4 Lab 2: Fetching Real Data (Posts)
// ==========================================
async function renderPostCards() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
        const posts = await response.json();
        
        const container = document.getElementById("post-container");
        if (!container) return; 
        
        container.innerHTML = "";
        
        let htmlContent = "";
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            htmlContent += `
                <div class="card">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </div>
            `;
        }
        container.innerHTML = htmlContent;
        
    } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
    }
}