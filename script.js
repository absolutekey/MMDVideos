let allVideos = [];
let isDragging = false;
let startX;
let scrollLeft;

// Ngăn kéo văn bản
document.addEventListener('selectstart', (e) => e.preventDefault());

// Ngăn nhấp chuột phải (nếu cần)
document.addEventListener('contextmenu', (e) => e.preventDefault());

const thumbnailContainer = document.getElementById('videoContainer');

// Khi bắt đầu kéo
thumbnailContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    thumbnailContainer.classList.add('active'); // Thêm lớp hiệu ứng kéo
    startX = e.pageX - thumbnailContainer.offsetLeft; // Xác định vị trí bắt đầu
    scrollLeft = thumbnailContainer.scrollLeft; // Lưu vị trí thanh cuộn
});

thumbnailContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    thumbnailContainer.classList.remove('active');
});

thumbnailContainer.addEventListener('mouseup', () => {
    isDragging = false;
    thumbnailContainer.classList.remove('active');
});

// Xử lý kéo
thumbnailContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return; // Nếu không kéo thì thoát
    e.preventDefault(); // Ngăn hành vi mặc định
    const x = e.pageX - thumbnailContainer.offsetLeft; // Vị trí hiện tại
    const walk = (x - startX) * 1.5; // Tốc độ kéo
    thumbnailContainer.scrollLeft = scrollLeft - walk; // Cuộn thanh
});

// Function to load videos from a JSON file
async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        if (!response.ok) throw new Error('Failed to load videos');
        
        const videos = await response.json();
        allVideos = videos; // Save all videos for searching

        displayVideos(videos);
    } catch (error) {
        console.error(error);
        alert("There was an error loading the videos. Please try again later.");
    }
}

// Function to display videos in the container
function displayVideos(videos) {
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = ""; // Clear the container before adding new items

    videos.forEach(video => {
        // Tạo phần tử nút để chứa hình thu nhỏ và tiêu đề
        const button = document.createElement("button");
        button.style.border = "none";
        button.style.background = "none";
        button.style.textAlign = "center"; // Căn giữa nội dung trong nút
        button.style.margin = "10px"; // Tạo khoảng cách giữa các nút

        // Tạo hình thu nhỏ
        const img = document.createElement("img");
        img.src = `https://drive.google.com/thumbnail?id=${video.id}`;
        img.alt = video.name;
        img.classList.add("thumbnail");

        // Xử lý lỗi khi tải ảnh
        img.onerror = function() {
            img.src = 'placeholderx.png'; // Đường dẫn tới hình ảnh placeholder
            img.classList.add("placeholder");
        };

        // Tạo tiêu đề video
        const title = document.createElement("div");
        title.textContent = video.name;
        title.style.marginTop = "5px";
        title.style.fontSize = "14px";
        title.style.color = "#333";

        // Thêm hình thu nhỏ và tiêu đề vào nút
        button.appendChild(img);
        button.appendChild(title);

        // Thêm sự kiện khi nhấn vào nút
        button.onclick = () => updateVideo(video.id, button);

        // Thêm nút vào container
        videoContainer.appendChild(button);
    });
}

// Function to update the iframe source and highlight selected video
function updateVideo(videoId, button) {
    const iframe = document.getElementById("videoFrame");
    iframe.src = `https://drive.google.com/file/d/${videoId}/preview`;

    // Highlight the selected video
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(btn => btn.querySelector("img").classList.remove("selected"));

    button.querySelector("img").classList.add("selected");
}

// Function to filter videos based on search term
function filterVideos() {
    const searchTerm = document.getElementById("searchBox").value.toLowerCase();
    const filteredVideos = allVideos.filter(video => {
        return video.name.toLowerCase().includes(searchTerm) || 
                video.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });
    displayVideos(filteredVideos);
}

// Load videos on page load
window.onload = () => {
    loadVideos();
};