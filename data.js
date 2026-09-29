// 1. Hàm tiện ích (Bắt buộc phải có để tránh lỗi)
function escapeHtml(text) {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 2. Dữ liệu truyện (Database giả lập - cập nhật theo yêu cầu)
    const database = [
    {
        id: 1,
        title: "One Piece",
        author: "Oda Eiichirō",
        category: "Huyền Huyễn",
        cover: "https://genk.mediacdn.vn/2020/1/30/1-15803727705401451611239.jpg",
        chapters: 1125,
        summary: "One Piece xoay quanh 1 nhóm cướp biển được gọi là Băng Hải tặc Mũ Rơm được thành lập và lãnh đạo bởi thuyền trưởng Monkey D. Luffy. Cậu bé Luffy có ước mơ tìm thấy kho báu vĩ đại nhất, One Piece, và trở thành Vua Hải Tặc đời kế tiếp. Luffy tình cờ ăn phải trái quỉ Gomu Gomu, nó cho cơ thể cậu khả năng co dãn như cao su nhưng đổi lại cậu sẽ không bao giờ biết bơi.",
        comments: "Truyện hay quá, hóng chương mới, tại sao cái thiện luôn thắng nhỉ?"
    },
    {
        id: 2,
        title: "Conan",
        author: "Gosho Aoyama",
        category: "Trinh Thám",
        cover: "https://i.ex-cdn.com/giadinhmoi.vn/files/content/2019/04/06/conan-08-2232.jpg",
        chapters: 1789,
        summary: "Xoay quanh Kudo Shinichi, một thám tử trung học bị đầu độc và thu nhỏ thành cậu bé lớp 1 với tên mới Edogawa Conan. Từ đó, Conan đồng hành cùng ông thám tử gà mờ Mouri Kogoro, phá giải hàng loạt vụ án bí ẩn.",
        comments: "Truyện hack não thật, tác giả đỉnh vãi, nghìn like luôn!"
    },
    {
        id: 3,
        title: "Doraemon",
        author: "Fujiko Fujio",
        category: "Thiếu Nhi",
        cover: "https://cafefcdn.com/thumb_w/640/203337114487263232/2025/1/18/avatar1737209731371-17372097317571353245757.jpg",
        chapters: "Nhiều",
        summary: "Từ anh chàng Nobita hậu đậu, cho đến chú mèo máy Doraemon vạn năng, Suneo mỏ nhọn... tất cả đã tạo nên một tuổi thơ đầy sắc màu. Cùng trở về với thế giới đầy nhiệm màu dưới ngòi bút tài hoa của cố họa sĩ Fujiko F.Fujio.",
        comments: "Tôi đã khóc, tuổi thơ là đây."
    },
    {
        id: 4,
        title: "Marigold",
        author: "Verbena",
        category: "Khoa Huyễn",
        cover: "https://p.sda1.dev/24/2b1de19925e928591bc978805f83203f/ughlcgsb.png",
        chapters: 354,
        summary: "Quý cô sa cơ Marigold, cho đến khi em hạnh phúc. Một câu chuyện ngọt ngào về hành trình tìm kiếm hạnh phúc của nữ chính.",
        comments: "Truyện hay quá, may quá nữ chính hạnh phúc. Huhu truyện quá ngọt, tôi đã tiểu đường."
    },
    {
        id: 5,
        title: "Naruto",
        author: "Masashi Kishimoto",
        category: "Tiên Hiệp",
        cover: "https://static.gamehub.vn/img/files/2017/05/09/GameHubVN-Tac-gia-vua-Naruto-xac-nhan-mot-nhan-vat-cuc-ky-quan-trong-se-chet-3.jpg",
        chapters: 1025,
        summary: "Naruto là một cậu bé có mơ ước trở thành hokage của làng Konoha, được phong ấn Cửu vĩ Hồ ly trong người. Vì muốn được thừa nhận nên cậu rất phá phách, sau đó cùng Sasuke và nhóm bạn trải qua nhiều thử thách để bảo vệ làng.",
        comments: "Tuổi thơ của tôi, truyện hay quá, phát triển đỉnh ghê."
    },
    {
        id: 6,
        title: "Tearmoon",
        author: "Mochitsuki",
        category: "Lịch Sử",
        cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK1bU6cNzDYICeJ7J3YVNwVvEwTjhYfniCuQ&s",
        chapters: 57,
        summary: "Mia Luna Tearmoon, Đại Công Chúa của Đế Quốc Tearmoon bị đưa lên giàn máy chém. Thế nhưng khi mở mắt ra, cô lại thấy mình quay về 8 năm trước khi vẫn còn là một đứa trẻ. Cầm cuốn nhật ký đẫm máu trên tay, cô quyết tâm thay đổi tương lai.",
        comments: "Truyện hay quá, hóng chương mới, tại sao cái thiện luôn thắng nhỉ?"
    },
    {
        id: 7,
        title: "Too Many Losing Heroines!",
        author: "Takibi Amamori",
        category: "Ngôn Tình",
        cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYyRfTRtpQLjlAeggairv85D6BrO-TvuiBrA&s",
        chapters: 197,
        summary: "Một chàng trai năm nhất cao trung sau 1 loạt biến cố nhận ra xung quanh mình toàn các cô gái thất bại trong chuyện tình cảm, được gọi là các nữ chính thua cuộc.",
        comments: "Truyện hay quá, hóng chương mới, truyện ngọt quá!"
    },
    {
        id: 8,
        title: "Stitches",
        author: "Teddy Geiger",
        category: "Kinh Dị",
        cover: "https://i5.walmartimages.com/seo/Junji-Ito-Stitches-Hardcover-9781974736560_25379800-a1b6-4a16-b99f-f43f7eca38a7.4cff43ad10c023b24f6c0a3ebed18c63.jpeg",
        chapters: 17,
        summary: "Những câu chuyện kinh dị rợn tóc gáy: Một khối u hình mặt người di chuyển khắp cơ thể, những quả cầu phát sáng trên biển, và một cô gái dự dạ hội với khuôn mặt trống rỗng không mắt không mũi.",
        comments: "Truyện ghê quá, không dám ngủ luôn!"
    },
    {
        id: 9,
        title: "Sasaki and Pii-chan",
        author: "Buncololi",
        category: "Đô Thị",
        cover: "https://static.wikia.nocookie.net/sasapii/images/c/ca/Vol2.png/revision/latest/scale-to-width-down/1200?cb=20240316030733&path-prefix=vi",
        chapters: 50,
        summary: "Sasaki mua một chú chim sẻ Java hóa ra lại là vị Hiền giả đến từ thế giới khác. Được ban ma pháp, anh lên kế hoạch buôn bán giữa hai thế giới nhưng lại bị cuốn vào cuộc chiến của các dị năng giả.",
        comments: "HAY QUÁ, TRUYỆN SÂU SẮC THẬT!"
    },
    {
        id: "ngay-ay-anh-yeu-em",
        title: "Ngày ấy anh yêu em",
        author: "Ẩn danh",
        category: "Ngôn Tình",
        cover: "https://hinhcute.net/wp-content/uploads/2025/06/anh-cap-doi-anime-chibi-cute-300x300.jpg",
        chapters: 0,
        summary: "Ngày đó, là ngày anh đã yêu em, anh sẽ không quên nó. Ngày em hi sinh tất cả để cứu lấy đời anh.",
        status: "Đang tiến hành",
        comments: "Câu chuyện tình yêu đầy cảm động và day dứt."
    },
    {
        id: "anh-bo-em-roi",
        title: "Anh bỏ em rồi",
        author: "Ẩn danh",
        category: "Ngôn Tình",
        cover: "https://blogradio.vn/uploads/cms/source/2021/36/yeuxong_(3).jpg",
        chapters: 0,
        summary: "Tại sao lại vậy, tại sao anh bỏ em, em đã làm gì sai, làm ơn, làm ơn. Đây chỉ là cơn ác mộng.",
        status: "Đã hoàn thành",
        comments: "Một câu chuyện về sự chia ly đau thương."
    }
];

    // Gán tác giả theo người đăng nhập cho các truyện chỉ định
    const dynamicAuthorIds = new Set(['ngay-ay-anh-yeu-em', 'anh-bo-em-roi']);
    function applyDynamicAuthors() {
        const currentUser = (typeof localStorage !== 'undefined') ? localStorage.getItem('currentUser') : null;
        if (!currentUser) return;
        database.forEach(novel => {
            if (dynamicAuthorIds.has(String(novel.id))) {
                novel.author = currentUser;
            }
        });
    }

    // 3. Hàm Render (Vẽ giao diện - Sử dụng đúng Class của HTML gốc)
    function renderNovels(list) {
        const container = document.getElementById('novel-list');
        if (!container) return;
        
        container.innerHTML = ''; // Xóa nội dung cũ

        if (list.length === 0) {
            container.innerHTML = '<p class="col-span-full text-center text-stone-500 py-10">Không tìm thấy truyện nào thuộc thể loại này.</p>';
            return;
        }

        list.forEach(novel => {
            // HTML Template giữ nguyên class gốc: bg-surface-dark, border-border-dark...
            const tagHtml = novel.tag ? `<div class="absolute top-2 left-2 bg-white border border-gray-200 text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded shadow">${novel.tag}</div>` : '';
            
            const html = `
                <div class="group flex flex-col gap-3 relative cursor-pointer fade-in">
                    <a href="detail.html?id=${novel.id}" class="block">
                        <div class="w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-surface-dark relative border border-border-dark">
                            <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style="background-image: url('${novel.cover}');"></div>
                            ${tagHtml}
                        </div>
                    </a>
                    <div>
                        <h4 class="text-stone-900 text-[15px] font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors font-serif">
                            <a href="detail.html?id=${novel.id}">${escapeHtml(novel.title)}</a>
                        </h4>
                        <p class="text-text-muted text-xs mt-1 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[12px]">person</span> ${escapeHtml(novel.author)}
                        </p>
                        <div class="flex items-center gap-1.5 mt-2">
                            <span class="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-stone-900 text-[10px] font-medium">${escapeHtml(novel.category)}</span>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    // 4. Xử lý sự kiện nút Lọc
    document.addEventListener('DOMContentLoaded', () => {
        applyDynamicAuthors();
        // Render lần đầu (tất cả truyện)
        renderNovels(database);

        // Bắt sự kiện click cho các nút lọc
        const genreBtns = document.querySelectorAll('.genre-btn');
        
        genreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const genre = this.getAttribute('data-genre'); // Lấy thể loại từ data-genre

                // 1. Đổi màu nút (Visual Feedback)
                genreBtns.forEach(b => {
                    const genre = b.getAttribute('data-genre');
                    // All button stays teal primary
                    if (genre === 'all') {
                        b.className = "genre-btn flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-6 transition-transform active:scale-95 shadow-md shadow-primary/20";
                        const span = b.querySelector('span');
                        if(span) {
                            span.className = "text-white text-sm font-bold";
                        }
                    } else {
                        // Other buttons: light gray + dark text
                        b.className = "genre-btn flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 px-6 hover:bg-gray-200 transition-colors border border-gray-300 text-gray-700 hover:text-gray-900";
                        const span = b.querySelector('span');
                        if(span) {
                            span.className = "text-sm font-medium";
                        }
                    }
                });

                // Active nút hiện tại (màu cam)
                this.className = "genre-btn flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-6 transition-transform active:scale-95 shadow-md shadow-primary/20";
                const activeSpan = this.querySelector('span');
                if(activeSpan) {
                    activeSpan.className = "text-white text-sm font-bold";
                }

                // 2. Lọc dữ liệu
                if (genre === 'all') {
                    renderNovels(database);
                } else {
                    // Chuẩn hóa chuỗi để so sánh (bỏ viết hoa, khoảng trắng)
                    const filtered = database.filter(n => 
                        n.category.toLowerCase().trim() === genre.toLowerCase().trim()
                    );
                    renderNovels(filtered);
                }
            });
    });
});