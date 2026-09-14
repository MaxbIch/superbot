export type PlaceSocial = {
    label: string;
    url: string;
};

export type Place = {
    id: string;
    title: string;
    image: string;
    short: string;
    description: string;
    images: string[];
    maps: string;
    address: string;
    highlights: string[];
    socials?: PlaceSocial[];
};

const map = (query: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const places: Record<string, Place[]> = {
    food: [
        {
            id: "alpaca",
            title: "Alpaca Homestyle Cafe",
            image: "https://media-cdn.nangtrip.com/media/thumb_chemex-1753518088363_opt.webp",
            short: "Уютное кафе с европейской кухней.",
            description:
                "Небольшое homestyle-кафе в центре Нячанга с европейской кухней, завтраками, вегетарианскими блюдами и спокойной атмосферой.",
            images: [
                "https://media-cdn.nangtrip.com/media/thumb_chemex-1753518088363_opt.webp",
            ],
            maps: map("Alpaca Homestyle Cafe, 10/1B Nguyen Thien Thuat, Nha Trang"),
            address: "10/1B Nguyễn Thiện Thuật",
            highlights: ["Европейская и healthy-кухня", "Завтраки", "Wi‑Fi", "Уютный интерьер"],
            socials: [
                { label: "Facebook", url: "https://www.facebook.com/alpacanhatrang" },
                { label: "Instagram", url: "https://www.instagram.com/alpaca_nhatrang/" },
            ],
        },
        {
            id: "an-cafe",
            title: "AN Cafe",
            image: "https://blog.kakaocdn.net/dna/bGK0YH/btsbP1fQuRg/AAAAAAAAAAAAAAAAAAAAALuvtok5tEMYBGpgeUi_8SJhzWt5ATyprFWjJkjoXGST/img.jpg",
            short: "Винтажное кафе среди зелени.",
            description:
                "Атмосферное кафе с деревом, растениями, небольшим садом и прудами. Подходит для завтрака, работы и спокойной встречи.",
            images: [
                "https://blog.kakaocdn.net/dna/bGK0YH/btsbP1fQuRg/AAAAAAAAAAAAAAAAAAAAALuvtok5tEMYBGpgeUi_8SJhzWt5ATyprFWjJkjoXGST/img.jpg",
            ],
            maps: map("AN Cafe, 40 Le Dai Hanh, Nha Trang"),
            address: "40 Lê Đại Hành",
            highlights: ["Винтажный стиль", "Много зелени", "Кофе и завтраки", "Спокойная атмосфера"],
            socials: [{ label: "Facebook", url: "https://www.facebook.com/ancafenhatrang/" }],
        },
        {
            id: "jungle-coffee",
            title: "Jungle Coffee Nha Trang",
            image: "https://ak-d.tripcdn.com/images/1mi4x224x93jhkugkF90B.jpg?proc=source%2Ftrip",
            short: "Зелёное кафе с необычным интерьером.",
            description:
                "Кафе в тропическом стиле с большим количеством растений, винтажным декором, кофе, завтраками и местами для работы.",
            images: [
                "https://ak-d.tripcdn.com/images/1mi4x224x93jhkugkF90B.jpg?proc=source%2Ftrip",
                "https://media2.gody.vn/public/images/destination/1/56/jungle-coffee/pl61b4588135858-1639209089.jpeg",
                "https://ak-d.tripcdn.com/images/1mi4g224x8w6fpy0g84CA.jpg?proc=source%2Ftrip",
            ],
            maps: map("Jungle Coffee Nha Trang, 8 Le Quy Don"),
            address: "8 Lê Quý Đôn",
            highlights: ["Тропический интерьер", "Acoustic-вечера", "Кофе и смузи", "Подходит для работы"],
            socials: [{ label: "Facebook", url: "https://www.facebook.com/junglecoffeenhatrang/" }],
        },
    ],

    sport: [
        {
            id: "vietnam-active",
            title: "Vietnam Active",
            image: "https://vietnamactive.com/vietnamactive-cover.jpg",
            short: "Дайвинг и снорклинг в заливе Нячанга.",
            description:
                "PADI 5 Star дайв-центр с погружениями, снорклингом и обучением. Работает с новичками и сертифицированными дайверами.",
            images: ["https://vietnamactive.com/vietnamactive-cover.jpg"],
            maps: map("Vietnam Active, 14B Nguyen Trung Truc, Nha Trang"),
            address: "14B Nguyễn Trung Trực",
            highlights: ["PADI 5 Star", "Дайвинг", "Снорклинг", "Обучение PADI"],
            socials: [
                { label: "Website", url: "https://vietnamactive.com/" },
                { label: "Facebook", url: "https://www.facebook.com/VietnamActiveVA" },
                { label: "Instagram", url: "https://www.instagram.com/vietnamactive_dc/" },
            ],
        },
        {
            id: "rainbow-divers",
            title: "Rainbow Divers",
            image: "https://dimg04.c-ctrip.com/images/0HJ6t12000h013cc6F8CC.jpg",
            short: "Дайвинг-центр с большой историей во Вьетнаме.",
            description:
                "Один из старейших PADI-центров Вьетнама. Организует ежедневные погружения, снорклинг и курсы для разных уровней подготовки.",
            images: [
                "https://dimg04.c-ctrip.com/images/0HJ6t12000h013cc6F8CC.jpg",
                "https://image.jimcdn.com/app/cms/image/transf/dimension%3D1920x400%3Aformat%3Djpg/path/s3515be331ac42a3d/image/i95808d67cec04eb3/version/1778479238/padi-instructor-development-course-idc-in-vietnam-2026-idc-ie-happy-divers-pool-training-nha-trang-vietnam.jpg",
            ],
            maps: map("Rainbow Divers, 132 Nguyen Thien Thuat, Nha Trang"),
            address: "132 Nguyễn Thiện Thuật",
            highlights: ["PADI 5 Star IDC", "Daily dive trips", "Snorkeling", "Курсы PADI"],
            socials: [{ label: "Website", url: "https://www.divevietnam.com/dive-centres/nha-trang/" }],
        },
        {
            id: "sailing-club-divers",
            title: "Sailing Club Divers",
            image: "https://d2p1cf6997m1ir.cloudfront.net/media/shop/9/b/e/9be81bc76210e104c7648904cafabee9.jpeg",
            short: "Дайвинг и снорклинг прямо у Тран Фу.",
            description:
                "PADI 5 Star дайв-центр на первой линии. Проводит ежедневные boat dives, снорклинг и курсы PADI в Нячанге.",
            images: ["https://d2p1cf6997m1ir.cloudfront.net/media/shop/9/b/e/9be81bc76210e104c7648904cafabee9.jpeg"],
            maps: map("Sailing Club Divers, 72-74 Tran Phu, Nha Trang"),
            address: "72–74 Trần Phú",
            highlights: ["PADI 5 Star", "Boat dives", "Snorkeling", "Курсы PADI"],
            socials: [{ label: "Website", url: "https://sailingclubdivers.com/" }],
        },
    ],

    beaches: [
        {
            id: "tran-phu",
            title: "Пляж Тран Фу",
            image: "https://seayoutravel.vn/wp-content/uploads/2025/11/best-time-of-year-to-visit-nha-trang%E2%80%8B.webp",
            short: "Главный городской пляж Нячанга.",
            description:
                "Центральный семикилометровый пляж вдоль Тран Фу. Рядом находятся отели, кафе, бары и водные активности.",
            images: [
                "https://seayoutravel.vn/wp-content/uploads/2025/11/best-time-of-year-to-visit-nha-trang%E2%80%8B.webp",
                "https://vpt-en.b-cdn.net/wp-content/uploads/n/55/nha-trang-tran-phu.jpg.webp",
            ],
            maps: map("Tran Phu Beach, Nha Trang"),
            address: "Trần Phú, Nha Trang",
            highlights: ["Центр города", "7 км пляжа", "Водные активности", "Закаты и рассветы"],
        },
        {
            id: "bai-dai",
            title: "Бай Дай",
            image: "https://statics.vinpearl.com/%EB%B0%94%EC%9D%B4%EB%8B%A4%EC%9D%B4-%EB%82%98%ED%8A%B8%EB%9E%91-5_1675159886.jpg",
            short: "Длинный спокойный пляж южнее города.",
            description:
                "Более спокойный пляж примерно в 25 км к югу от Нячанга. Длинная береговая линия, светлый песок и пологий вход в воду.",
            images: [
                "https://statics.vinpearl.com/%EB%B0%94%EC%9D%B4%EB%8B%A4%EC%9D%B4-%EB%82%98%ED%8A%B8%EB%9E%91-5_1675159886.jpg",
                "https://cdn3130.cdn4s6.io.vn/media/anh-blog/plages-vietnam/plage-bai-dai-nha-trang.jpg",
            ],
            maps: map("Bai Dai Beach, Cam Ranh, Khanh Hoa"),
            address: "Bãi Dài, Cam Ranh, Khánh Hòa",
            highlights: ["Меньше городской суеты", "Светлый песок", "Пологий вход", "Рестораны у моря"],
        },
        {
            id: "nhu-tien",
            title: "Нху Тьен",
            image: "https://d3rftsiup4wf15.cloudfront.net/uploads/2025/03/15/Nhu-Tien-Beach-Nha-Trang.webp",
            short: "Уединённый пляж среди зелёных холмов.",
            description:
                "Тихая бухта примерно в 10 км от Нячанга, окружённая горами и зеленью. Подходит для спокойного пляжного дня.",
            images: [
                "https://d3rftsiup4wf15.cloudfront.net/uploads/2025/03/15/Nhu-Tien-Beach-Nha-Trang.webp",
                "https://cdn.vietreader.com/uploads/posts/2021-09/falling-in-love-with-the-wild-beauty-of-nha-trangs-nhu-tien-beach-7.jpg",
            ],
            maps: map("Nhu Tien Beach, Nha Trang"),
            address: "Nhu Tien Beach, Nha Trang",
            highlights: ["Уединённая бухта", "Белый песок", "Горы вокруг", "Спокойное море"],
        },
    ],

    hiking: [
        {
            id: "ba-ho-hiking",
            title: "Ба Хо",
            image: "https://statics.vinpearl.com/ba-ho-waterfalls-4_1692889024.jpg",
            short: "Треккинг к трём природным озёрам.",
            description:
                "Природный комплекс примерно в 25 км к северу от Нячанга. Маршрут проходит вдоль ручья, камней, водопадов и трёх естественных бассейнов.",
            images: [
                "https://statics.vinpearl.com/ba-ho-waterfalls-4_1692889024.jpg",
                "https://cms.enjourney.ru/upload/country/article/512x512/535_1.png",
            ],
            maps: map("Ba Ho Waterfalls, Ninh Hoa, Khanh Hoa"),
            address: "Ba Ho, Ninh Hòa, Khánh Hòa",
            highlights: ["3 природных озера", "Треккинг", "Водопады", "Купание при безопасных условиях"],
        },
        {
            id: "co-tien",
            title: "Гора Кô Тьен",
            image: "https://www.vietfuntravel.com.vn/image/data/Blog/DiaDiem/Nui-Co-Tien/Nui-Co-Tien-4.png",
            short: "Популярный хайкинг с видом на весь залив.",
            description:
                "Известный маршрут на севере Нячанга с тремя вершинами и панорамным видом на город и залив. Тропа крутая и почти без тени.",
            images: [
                "https://www.vietfuntravel.com.vn/image/data/Blog/DiaDiem/Nui-Co-Tien/Nui-Co-Tien-4.png",
                "https://vnn-imgs-f.vgcloud.vn/2019/07/09/15/nui-co-tien-o-khanh-hoa-co-den-17-du-an-khong-phu-hop-quy-hoach.jpg?s=Tn6RONwVkBXmV_JthGfxBg&width=0",
            ],
            maps: map("Nui Co Tien, Nha Trang"),
            address: "Ngô Văn Sở / Bắc Nha Trang",
            highlights: ["3 вершины", "Панорама Нячанга", "Рассветы и закаты", "Свободный маршрут"],
        },
        {
            id: "suoi-tien",
            title: "Суой Тьен",
            image: "https://statics.vinpearl.com/suoi-tien-nha-trang-8_1633450348.png",
            short: "Горный ручей, водопады и природные бассейны.",
            description:
                "Экологическая локация примерно в 25 км от центра. Здесь можно гулять вдоль ручья, устраивать пикник и исследовать каскады воды и каменные участки.",
            images: [
                "https://statics.vinpearl.com/suoi-tien-nha-trang-8_1633450348.png",
                "https://reviewdulichviet.com.vn/wp-content/uploads/2025/02/Picnic-khu-du-lich-suoi-tien-dien-khanh.jpg",
            ],
            maps: map("Suoi Tien Nha Trang, Dien Khanh, Khanh Hoa"),
            address: "Suối Tiên, Diên Khánh, Khánh Hòa",
            highlights: ["Горный ручей", "Небольшие водопады", "Пикник", "Прогулки по природе"],
        },
    ],

    clubs: [
        {
            id: "sailing-club",
            title: "Sailing Club Nha Trang",
            image: "https://travelinsighter.com/wp-content/uploads/2025/02/Vietnam-Nha-Trang-Things-to-Do-Sailing-Club-Nha-Trang-Sailing-Club-Nha-Trang-1.jpg.webp",
            short: "Пляжный клуб, ресторан и ночная жизнь.",
            description:
                "Легендарный пляжный клуб на Тран Фу с рестораном, барами, музыкой, DJ-сетами и вечеринками прямо у моря.",
            images: [
                "https://travelinsighter.com/wp-content/uploads/2025/02/Vietnam-Nha-Trang-Things-to-Do-Sailing-Club-Nha-Trang-Sailing-Club-Nha-Trang-1.jpg.webp",
                "https://ak-d.tripcdn.com/images/1mi1q224x8yafhd1w4D6C.jpg?proc=source%2Ftrip",
                "https://ak-d.tripcdn.com/images/0351b12000jmjg370C04A_Z_500_0_Q80.webp?proc=resize%2Fm_z%2Cw_1000%3Bcrop%2Fm_c%2Cw_1000%2Ch_1000%2Cx_0%2Cy_0%2CDD72",
            ],
            maps: map("Sailing Club Nha Trang, 72-74 Tran Phu"),
            address: "72–74 Trần Phú",
            highlights: ["Пляж прямо у клуба", "DJ и вечеринки", "Ресторан и бары", "Fire shows"],
            socials: [
                { label: "Website", url: "https://sailingclubnhatrang.com/" },
                { label: "Facebook", url: "https://www.facebook.com/sailingclubnhatrang" },
                { label: "Instagram", url: "https://www.instagram.com/sailingclubnhatrang/" },
            ],
        },
        {
            id: "skylight",
            title: "Skylight Nha Trang",
            image: "https://thumb.tidesquare.com/tour/public/product/PRV3001762019/PRD3005945453/origin/f7c9cfa5cb8d1510b1243614e3efe773.jpg_3.jpg",
            short: "Rooftop-клуб с панорамой Нячанга.",
            description:
                "Rooftop beach club на верхних этажах Havana Nha Trang Hotel с 360° видами, коктейлями, музыкой и ночными мероприятиями.",
            images: [
                "https://thumb.tidesquare.com/tour/public/product/PRV3001762019/PRD3005945453/origin/f7c9cfa5cb8d1510b1243614e3efe773.jpg_3.jpg",
                "https://thumb.tidesquare.com/raw/https%3A%2F%2Fimage.hanatour.com%2Fusr%2Fcms%2Fresize%2F1000_0%2F2019%2F04%2F23%2F10000%2F5de82b11-1bdf-4e5c-9138-9c69375b07aa.jpg",
            ],
            maps: map("Skylight Nha Trang, 38 Tran Phu"),
            address: "38 Trần Phú, Havana Nha Trang Hotel",
            highlights: ["360° панорама", "Rooftop", "DJ и мероприятия", "Коктейли"],
            socials: [
                { label: "Website", url: "https://skylightnhatrang.com/" },
                { label: "Facebook", url: "https://www.facebook.com/skylightnhatrang" },
                { label: "Instagram", url: "https://www.instagram.com/skylightnhatrang/" },
                { label: "TikTok", url: "https://www.tiktok.com/@skylightnhatrang" },
            ],
        },
        {
            id: "star-night",
            title: "Star Night",
            image: "https://gmi.vietjet.net/uploads/2026/03/regalia-gold-hotel.webp",
            short: "Rooftop на 40-м этаже Regalia Gold.",
            description:
                "Rooftop bar, кафе и ресторан на 40-м этаже Regalia Gold с видом на город и залив, коктейлями и DJ-вечерами.",
            images: ["https://gmi.vietjet.net/uploads/2026/03/regalia-gold-hotel.webp"],
            maps: map("Star Night Nha Trang, 39-41 Nguyen Thi Minh Khai"),
            address: "39–41 Nguyễn Thị Minh Khai, Regalia Gold",
            highlights: ["40-й этаж", "Вид на город и море", "DJ каждый вечер", "Rooftop"],
            socials: [{ label: "Website", url: "https://starnightnhatrang.com/" }],
        },
    ],
};
