import type {
  SessionData,
  InventoryItem,
  OrderItem,
  ChecklistTask,
  DisposalItem,
} from "./types";

const SESSION_KEY = "sparos-flow-data";

const defaultInventoryItems: InventoryItem[] = [];

const defaultOrderItems: OrderItem[] = [
  {
    id: "order-1",
    name: "신라면 큰사발",
    currentStock: 3,
    safetyStock: 15,
    orderQty: 0,
    selected: true,
    reason: "비 예보 수요 +30% 예상",
    reasonIcon: "trending_up",
    reasonColor: "text-[var(--color-secondary)]",
  },
  {
    id: "order-2",
    name: "참치마요 삼각김밥",
    currentStock: 0,
    safetyStock: 1,
    orderQty: 0,
    selected: true,
    reason: "1단계 재고 확인 결품 보정",
    reasonIcon: "bolt",
    reasonColor: "text-[var(--color-status-active)]",
  },
  {
    id: "order-3",
    name: "제주 삼다수 500ml",
    currentStock: 8,
    safetyStock: 20,
    orderQty: 0,
    selected: true,
    reason: "상시 베스트셀러 자동 보충",
    reasonIcon: "shield",
    reasonColor: "text-[var(--color-text-muted)]",
  },
  {
    id: "order-4",
    name: "바나나맛 우유 240ml",
    currentStock: 7,
    safetyStock: 20,
    orderQty: 0,
    selected: true,
    reason: "로스 발생 보정 및 기본 안전재고 확보",
    reasonIcon: "verified",
    reasonColor: "text-[var(--color-text-muted)]",
  },
  {
    id: "order-5",
    name: "포카칩 오리지널 66g",
    currentStock: 4,
    safetyStock: 15,
    orderQty: 0,
    selected: true,
    reason: "주말 대비 주전부리 판매 회전율 상승",
    reasonIcon: "trending_up",
    reasonColor: "text-[var(--color-secondary)]",
    badge: "오후 스낵 수요",
  },
];

const defaultChecklistTasks: ChecklistTask[] = [
  {
    id: "task-1",
    title: "매장 온·습도 및 냉장 쇼케이스 온도 기록",
    time: "09:30",
    assignee: "김알바 (오전)",
    completed: false,
    borderColor: "border-l-[var(--color-secondary-container)]",
  },
  {
    id: "task-2",
    title: "1차 물류 배송 입고 검수 및 진열",
    time: "11:00",
    assignee: "김알바 & 점장 (공동)",
    completed: false,
    borderColor: "border-l-[var(--color-text-primary)]",
  },
  {
    id: "task-3",
    title: "출입구 매트 정돈 및 테라스 테이블 청결 점검",
    assignee: "박근무 (오후)",
    completed: false,
    borderColor: "",
  },
];

const defaultDisposalItems: DisposalItem[] = [
  {
    id: "disp-1",
    name: "듬뿍 햄에그 샌드위치",
    barcode: "8801043009211",
    stock: 1,
    expiryLabel: "14:00 만료",
    timeRemaining: "잔여 1시간 40분",
    status: "urgent",
    icon: "lunch_dining",
    disposeQty: 1,
  },
  {
    id: "disp-2",
    name: "전주비빔 삼각김밥",
    barcode: "8801043004810",
    stock: 2,
    expiryLabel: "14:00 폐기",
    timeRemaining: "수량 2개 중 부분 폐기 가능",
    status: "partial",
    icon: "fastfood",
    disposeQty: 1,
    location: "F-01",
  },
  {
    id: "disp-3",
    name: "서울우유 500ml",
    barcode: "8801019302018",
    stock: 6,
    expiryLabel: "24시간 이내",
    timeRemaining: "정상 진열 유지",
    status: "normal",
    icon: "local_cafe",
    disposeQty: 0,
  },
];

function getDefaultData(): SessionData {
  return {
    step1: { items: defaultInventoryItems, completed: false },
    step2: { orders: defaultOrderItems, completed: false },
    step3: {
      tasks: defaultChecklistTasks,
      shift: "09:00 ~ 15:00 (오전)",
      worker: "김알바",
      completed: false,
    },
    step4: { disposals: defaultDisposalItems, completed: false },
  };
}

export function getSessionData(): SessionData {
  if (typeof window === "undefined") return getDefaultData();
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    const defaults = getDefaultData();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(raw);
}

export function saveSessionData(data: SessionData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function updateStep1(
  items: InventoryItem[],
  completed?: boolean,
): void {
  const data = getSessionData();
  data.step1.items = items;
  if (completed !== undefined) data.step1.completed = completed;
  saveSessionData(data);
}

export function updateStep2(orders: OrderItem[], completed?: boolean): void {
  const data = getSessionData();
  data.step2.orders = orders;
  if (completed !== undefined) data.step2.completed = completed;
  saveSessionData(data);
}

export function updateStep3(
  tasks: ChecklistTask[],
  shift?: string,
  worker?: string,
  completed?: boolean,
): void {
  const data = getSessionData();
  data.step3.tasks = tasks;
  if (shift !== undefined) data.step3.shift = shift;
  if (worker !== undefined) data.step3.worker = worker;
  if (completed !== undefined) data.step3.completed = completed;
  saveSessionData(data);
}

export function updateStep4(
  disposals: DisposalItem[],
  completed?: boolean,
): void {
  const data = getSessionData();
  data.step4.disposals = disposals;
  if (completed !== undefined) data.step4.completed = completed;
  saveSessionData(data);
}
