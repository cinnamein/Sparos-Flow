export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryLabel: string;
  posStock: number;
  actualStock: number;
  confirmed: boolean;
  expiry?: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  currentStock: number;
  safetyStock: number;
  orderQty: number;
  selected: boolean;
  reason: string;
  reasonIcon: string;
  reasonColor: string;
  badge?: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  time?: string;
  assignee: string;
  completed: boolean;
  borderColor: string;
}

export interface DisposalItem {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  expiryLabel: string;
  timeRemaining: string;
  status: "urgent" | "partial" | "normal";
  icon: string;
  disposeQty: number;
  location?: string;
}

export interface SessionData {
  step1: { items: InventoryItem[]; completed: boolean };
  step2: { orders: OrderItem[]; completed: boolean };
  step3: { tasks: ChecklistTask[]; shift: string; worker: string; completed: boolean };
  step4: { disposals: DisposalItem[]; completed: boolean };
}
