export interface productCategory {
  //　表示ラベル
  label: string;
  // 設定値
  value: string;
  // 表示区分
  disabled: boolean;
}

export const selectCategory:productCategory[] = [
  { label: '食品', value: 'food', disabled: false },
  { label: '薬品', value: 'chemicals', disabled: false },
  { label: '武器', value: 'weapon', disabled: false },
  { label: '防具', value: 'armor', disabled: false },
];

export const selectQuantity:productCategory[] = [
  { label: '1個', value: '1', disabled: false },
  { label: '2個', value: '2', disabled: false },
  { label: '3個', value: '3', disabled: false },
  { label: '4個', value: '4', disabled: false },
  { label: '5個', value: '5', disabled: false },
  { label: '6個', value: '6', disabled: false },
  { label: '7個', value: '7', disabled: false },
  { label: '8個', value: '8', disabled: false },
  { label: '9個', value: '9', disabled: false },
  { label: '10個', value: '10', disabled: false }
]
