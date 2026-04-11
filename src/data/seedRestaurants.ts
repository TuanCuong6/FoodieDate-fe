import { RestaurantDto, RestaurantStatus } from "../services";

const restaurantCovers: Array<{ keywords: string[]; coverUrl: string }> = [
  {
    keywords: ["phở", "bún", "mì", "việt"],
    coverUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60",
  },
  {
    keywords: ["bbq", "nướng", "grill"],
    coverUrl:
      "https://images.unsplash.com/photo-1555992336-cbf05214005b?auto=format&fit=crop&w=1200&q=60",
  },
  {
    keywords: ["sushi", "nhật"],
    coverUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=60",
  },
  {
    keywords: ["pizza"],
    coverUrl:
      "https://images.unsplash.com/photo-1548365328-8b849e6f1f8a?auto=format&fit=crop&w=1200&q=60",
  },
  {
    keywords: ["cafe", "cà phê", "coffee"],
    coverUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=60",
  },
  {
    keywords: ["dessert", "bánh", "sweet"],
    coverUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=60",
  },
  {
    keywords: ["lẩu", "hotpot"],
    coverUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60",
  },
];

const fallbackCoverUrl =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=60";

export function getRestaurantCoverUrl(name: string, notes?: string): string {
  const haystack = `${name} ${notes ?? ""}`.toLowerCase();
  const match = restaurantCovers.find((entry) =>
    entry.keywords.some((k) => haystack.includes(k)),
  );
  return match?.coverUrl ?? fallbackCoverUrl;
}

export function getSeedRestaurants(coupleId: number): RestaurantDto[] {
  const now = new Date().toISOString();

  const seedAreas = [
    { id: 1000, name: "Đống Đa" },
    { id: 1001, name: "Cầu Giấy" },
    { id: 1002, name: "Hoàn Kiếm" },
    { id: 1003, name: "Tây Hồ" },
    { id: 1004, name: "Hai Bà Trưng" },
    { id: 1005, name: "Ba Đình" },
  ];

  const pickArea = (index: number) => seedAreas[index % seedAreas.length];

  const items: Array<Omit<RestaurantDto, "id">> = [
    {
      coupleId,
      areaId: pickArea(2).id,
      areaName: pickArea(2).name,
      name: "Bún chả phố cổ",
      address: "Phố cổ, Hoàn Kiếm",
      phone: "024 0000 0000",
      source: "TikTok",
      sourceUrl: "https://tiktok.com",
      notes: "Đi tối, vừa dạo vừa ăn. Nên đến sớm để tránh đông.",
      status: RestaurantStatus.MuonAn,
      createdBy: 0,
      createdAt: now,
    },
    {
      coupleId,
      areaId: pickArea(3).id,
      areaName: pickArea(3).name,
      name: "Cafe view hồ hoàng hôn",
      address: "Ven hồ, Tây Hồ",
      phone: "024 0000 0001",
      source: "Instagram",
      sourceUrl: "https://instagram.com",
      notes: "Ngồi ngoài trời nếu thời tiết đẹp. Hợp nói chuyện, chill.",
      status: RestaurantStatus.MuonAn,
      createdBy: 0,
      createdAt: now,
    },
    {
      coupleId,
      areaId: pickArea(1).id,
      areaName: pickArea(1).name,
      name: "BBQ nướng Hàn Quốc",
      address: "Trung tâm Cầu Giấy",
      phone: "024 0000 0002",
      source: "Bạn bè giới thiệu",
      notes: "Đi nhóm 2 người gọi set couple. Nhớ đặt bàn cuối tuần.",
      status: RestaurantStatus.CanNhac,
      createdBy: 0,
      createdAt: now,
    },
    {
      coupleId,
      areaId: pickArea(0).id,
      areaName: pickArea(0).name,
      name: "Sushi Nhật Bản",
      address: "Thái Hà, Đống Đa",
      phone: "024 0000 0003",
      source: "Google Maps",
      notes: "Hợp kỷ niệm, đi tối. Ưu tiên ngồi quầy bar.",
      status: RestaurantStatus.DaAn,
      createdBy: 0,
      lastVisitDate: now,
      createdAt: now,
    },
    {
      coupleId,
      areaId: pickArea(4).id,
      areaName: pickArea(4).name,
      name: "Pizza lãng mạn",
      address: "Trung tâm, Hai Bà Trưng",
      phone: "024 0000 0004",
      source: "Facebook",
      sourceUrl: "https://facebook.com",
      notes: "Không gian đẹp, hợp date. Có chỗ ngồi riêng tư.",
      status: RestaurantStatus.MuonAn,
      createdBy: 0,
      createdAt: now,
    },
    {
      coupleId,
      areaId: pickArea(5).id,
      areaName: pickArea(5).name,
      name: "Lẩu tối cuối tuần",
      address: "Ba Đình",
      phone: "024 0000 0005",
      source: "YouTube",
      notes: "Trời mưa đi lẩu là chuẩn. Gọi thêm nấm + bò Mỹ.",
      status: RestaurantStatus.MuonAn,
      createdBy: 0,
      createdAt: now,
    },
  ];

  return items.map((item, index) => ({
    id: 2000 + index,
    ...item,
  }));
}
