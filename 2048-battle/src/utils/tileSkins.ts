export interface TileSkin {
  id: string;
  name: string;
  price: number;
  vipOnly: boolean;
  tiles: Record<number, { bg: string; text: string }>;
}

export const TILE_SKINS: TileSkin[] = [
  {
    id: 'classic', name: 'Classic', price: 0, vipOnly: false,
    tiles: {
      0: { bg: '#CDC1B4', text: '#776E65' }, 2: { bg: '#EEE4DA', text: '#776E65' },
      4: { bg: '#EDE0C8', text: '#776E65' }, 8: { bg: '#F2B179', text: '#FFFFFF' },
      16: { bg: '#F59563', text: '#FFFFFF' }, 32: { bg: '#F67C5F', text: '#FFFFFF' },
      64: { bg: '#F65E3B', text: '#FFFFFF' }, 128: { bg: '#EDCF72', text: '#FFFFFF' },
      256: { bg: '#EDCC61', text: '#FFFFFF' }, 512: { bg: '#EDC850', text: '#FFFFFF' },
      1024: { bg: '#9945FF', text: '#FFFFFF' }, 2048: { bg: '#14F195', text: '#FFFFFF' },
    },
  },
  {
    id: 'ocean', name: 'Ocean', price: 0.99, vipOnly: false,
    tiles: {
      0: { bg: '#B3D9E8', text: '#1A5276' }, 2: { bg: '#AED6F1', text: '#1A5276' },
      4: { bg: '#7FB3D3', text: '#FFFFFF' }, 8: { bg: '#5499C7', text: '#FFFFFF' },
      16: { bg: '#2E86C1', text: '#FFFFFF' }, 32: { bg: '#1A6FA6', text: '#FFFFFF' },
      64: { bg: '#155888', text: '#FFFFFF' }, 128: { bg: '#1A4B8C', text: '#FFFFFF' },
      256: { bg: '#1B3A6B', text: '#FFFFFF' }, 512: { bg: '#0E2952', text: '#FFFFFF' },
      1024: { bg: '#00CED1', text: '#FFFFFF' }, 2048: { bg: '#00FFFF', text: '#1A5276' },
    },
  },
  {
    id: 'forest', name: 'Forest', price: 0.99, vipOnly: false,
    tiles: {
      0: { bg: '#ABEBC6', text: '#1E8449' }, 2: { bg: '#A9DFBF', text: '#1E8449' },
      4: { bg: '#7DCEA0', text: '#FFFFFF' }, 8: { bg: '#52BE80', text: '#FFFFFF' },
      16: { bg: '#27AE60', text: '#FFFFFF' }, 32: { bg: '#1E8449', text: '#FFFFFF' },
      64: { bg: '#196F3D', text: '#FFFFFF' }, 128: { bg: '#B7950B', text: '#FFFFFF' },
      256: { bg: '#9A7D0A', text: '#FFFFFF' }, 512: { bg: '#7D6608', text: '#FFFFFF' },
      1024: { bg: '#6E2F0A', text: '#FFFFFF' }, 2048: { bg: '#ADFF2F', text: '#196F3D' },
    },
  },
  {
    id: 'fire', name: 'Fire', price: 1.99, vipOnly: false,
    tiles: {
      0: { bg: '#F9EBEA', text: '#922B21' }, 2: { bg: '#FADBD8', text: '#922B21' },
      4: { bg: '#F1948A', text: '#FFFFFF' }, 8: { bg: '#E74C3C', text: '#FFFFFF' },
      16: { bg: '#C0392B', text: '#FFFFFF' }, 32: { bg: '#A93226', text: '#FFFFFF' },
      64: { bg: '#922B21', text: '#FFFFFF' }, 128: { bg: '#FF8C00', text: '#FFFFFF' },
      256: { bg: '#FF6600', text: '#FFFFFF' }, 512: { bg: '#FF4500', text: '#FFFFFF' },
      1024: { bg: '#FFD700', text: '#922B21' }, 2048: { bg: '#FF0000', text: '#FFFFFF' },
    },
  },
  {
    id: 'galaxy', name: 'Galaxy', price: 1.99, vipOnly: false,
    tiles: {
      0: { bg: '#1A1A2E', text: '#7F8C8D' }, 2: { bg: '#16213E', text: '#A9CCE3' },
      4: { bg: '#0F3460', text: '#FFFFFF' }, 8: { bg: '#533483', text: '#FFFFFF' },
      16: { bg: '#6C3483', text: '#FFFFFF' }, 32: { bg: '#7D3C98', text: '#FFFFFF' },
      64: { bg: '#8E44AD', text: '#FFFFFF' }, 128: { bg: '#9B59B6', text: '#FFFFFF' },
      256: { bg: '#A569BD', text: '#FFFFFF' }, 512: { bg: '#BB8FCE', text: '#FFFFFF' },
      1024: { bg: '#E8DAEF', text: '#6C3483' }, 2048: { bg: '#FF00FF', text: '#FFFFFF' },
    },
  },
  {
    id: 'gold', name: 'Gold', price: 2.99, vipOnly: false,
    tiles: {
      0: { bg: '#FEF9E7', text: '#9A7D0A' }, 2: { bg: '#FCF3CF', text: '#9A7D0A' },
      4: { bg: '#F9E79F', text: '#7D6608' }, 8: { bg: '#F7DC6F', text: '#7D6608' },
      16: { bg: '#F4D03F', text: '#6E5E08' }, 32: { bg: '#F1C40F', text: '#FFFFFF' },
      64: { bg: '#D4AC0D', text: '#FFFFFF' }, 128: { bg: '#B7950B', text: '#FFFFFF' },
      256: { bg: '#9A7D0A', text: '#FFFFFF' }, 512: { bg: '#7D6608', text: '#FFFFFF' },
      1024: { bg: '#C0392B', text: '#FFFFFF' }, 2048: { bg: '#FFD700', text: '#7D6608' },
    },
  },
];

export const DEFAULT_SKIN = TILE_SKINS[0];
