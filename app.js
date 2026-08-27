// Lớp bảo vệ: Đợi HTML tải xong 100% rồi mới chạy JavaScript
document.addEventListener("DOMContentLoaded", function() {
    
    const form = document.getElementById("house-price-form");
    const messageContainer = document.getElementById("message-container");

    // Nếu không tìm thấy form, báo lỗi ra Console để chúng ta biết
    if (!form) {
        console.error("Lỗi: Không tìm thấy form có id 'house-price-form'!");
        return; 
    }

    // Bắt sự kiện bấm nút Xác nhận
    form.addEventListener("submit", function(event) {
        
        // 1. CHẶN LOAD LẠI TRANG
        event.preventDefault();

        // 2. Xóa thông báo cũ
        messageContainer.innerHTML = ""; 

        // 3. Lấy dữ liệu
        const addressValue = document.getElementById("address").value.trim();
        const bedroomsValue = document.getElementById("bedrooms").value;
        const bedroomsNumber = Number(bedroomsValue);

        let errorMessage = "";

        // 4. Kiểm tra điều kiện
        if (addressValue === "" || bedroomsValue === "") {
            errorMessage = "Lỗi: Vui lòng nhập đầy đủ các trường bắt buộc!";
        } else if (bedroomsNumber <= 0) {
            errorMessage = "Lỗi: Số phòng ngủ phải là một số dương!";
        }

        // 5. In thông báo
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
});