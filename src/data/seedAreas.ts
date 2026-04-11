import { AreaDto } from '../services';

const areaCovers: Record<string, { coverUrl: string; subtitle: string; tags: string[] }> = {
  'Đống Đa': {
    coverUrl:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=60',
    subtitle: 'Nhiều quán ăn ngon, dễ hẹn sau giờ làm',
    tags: ['Phố xá', 'Đông vui', 'Nhiều lựa chọn'],
  },
  'Cầu Giấy': {
    coverUrl:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=60',
    subtitle: 'Hợp team “ăn-no-nê” và khám phá quán mới',
    tags: ['Trẻ', 'Nhiều quán', 'Dễ đi'],
  },
  'Hoàn Kiếm': {
    coverUrl:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=60',
    subtitle: 'Đi dạo phố cổ rồi ghé cafe/dessert',
    tags: ['Phố cổ', 'Chill', 'Đi bộ'],
  },
  'Tây Hồ': {
    coverUrl:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=60',
    subtitle: 'View hồ, hoàng hôn, hợp date lãng mạn',
    tags: ['View đẹp', 'Lãng mạn', 'Cuối tuần'],
  },
  'Hai Bà Trưng': {
    coverUrl:
      'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1200&q=60',
    subtitle: 'Trung tâm, tiện đi lại, nhiều lựa chọn ăn uống',
    tags: ['Trung tâm', 'Tiện', 'Đa dạng'],
  },
  'Ba Đình': {
    coverUrl:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=60',
    subtitle: 'Không gian yên tĩnh, hợp ăn tối nhẹ nhàng',
    tags: ['Yên tĩnh', 'Tối', 'Nhẹ nhàng'],
  },
};

export function getAreaPresentation(name: string): {
  coverUrl: string;
  subtitle: string;
  tags: string[];
} {
  const fallback = {
    coverUrl:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=60',
    subtitle: 'Khám phá những địa điểm đáng thử cùng nhau',
    tags: ['Gợi ý', 'Khám phá', 'Hẹn hò'],
  };

  return areaCovers[name] ?? fallback;
}

export function getSeedAreas(coupleId: number): AreaDto[] {
  const now = new Date().toISOString();

  const names = ['Đống Đa', 'Cầu Giấy', 'Hoàn Kiếm', 'Tây Hồ', 'Hai Bà Trưng', 'Ba Đình'];

  return names.map((name, index) => ({
    id: 1000 + index,
    coupleId,
    name,
    createdAt: now,
  }));
}
