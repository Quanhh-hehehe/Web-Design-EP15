
// Function declaration- equivalent to Python's def
function square(x) {
    return x * x;
}

// Arrow function- equivalent to a Python lambda
const double = (x) => x * 2;
console.log(double(5)); // Output: 10

// ==========================================
// Khởi tạo dữ liệu (Model a list of prediction samples)
// ==========================================
const predictionSamples = [
    { id: 1, name: "Quang Anh", result: 75 },
    { id: 2, name: "Thế Hợp ", result: 92 },
    { id: 3, name: "Hiển", result: 88 },
    { id: 4, name: "Hiếu", result: 60 },
    { id: 5, name: "Được", result: 95 }
];

console.log("--- DỮ LIỆU BAN ĐẦU ---");
console.log(predictionSamples);

// Yêu cầu 1: Vòng lặp for để lọc mảng theo điều kiện
// (Ví dụ: Lọc các mẫu có result > 80)
const highResultSamples = [];

for (let i = 0; i < predictionSamples.length; i++) {
    if (predictionSamples[i].result > 80) {
        highResultSamples.push(predictionSamples[i]);
    }
}

console.log("\n--- YÊU CẦU 1: Lọc kết quả (result > 80) ---");
console.log(highResultSamples);

// Yêu cầu 2 & Bonus: Hàm tính tổng (Chuyển thành Arrow Function)
// (Tính tổng trường 'result' của tất cả các object)
const sumResults = (samples) => {
    let total = 0;
    for (let sample of samples) {
        total += sample.result;
    }
    return total;
};

console.log("\n--- YÊU CẦU 2 & BONUS: Tính tổng bằng Arrow Function ---");
console.log("Tổng tất cả các result:", sumResults(predictionSamples));

// Yêu cầu 3: Hàm tìm object có giá trị lớn nhất dùng vòng lặp for
function findMaxResultSample(samples) {
    if (samples.length === 0) return null;
    let maxSample = samples[0]; 
    
    // Bắt đầu lặp từ phần tử thứ 2 (index 1) để so sánh
    for (let i = 1; i < samples.length; i++) {
        if (samples[i].result > maxSample.result) {
            maxSample = samples[i];  
        }
    }
    return maxSample;
}

console.log("\n--- YÊU CẦU 3: Tìm object có result lớn nhất ---");
console.log("Mẫu có kết quả cao nhất là:", findMaxResultSample(predictionSamples));

