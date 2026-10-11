import asyncio
from datetime import date, time

from sqlalchemy import select

from app.core.database import Base, engine, async_session
from app.modules.account.model import Store, User, Role
from app.modules.checklist.model import Schedule
from app.modules.inventory.model import Product
from app.security.auth import hash_password


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        existing = await session.execute(select(Store).limit(1))
        if existing.scalar():
            print("이미 시드 데이터가 존재합니다. 건너뜁니다.")
            return

        # 점포
        store = Store(store_code="E24-001", name="이마트24 스파로스점")
        session.add(store)
        await session.flush()

        # 사용자
        owner = User(
            employee_id="OWN-2024-001",
            password=hash_password("owner1234"),
            name="김점장",
            role=Role.OWNER,
            store_id=store.id,
        )
        staff1 = User(
            employee_id="STF-2024-001",
            password=hash_password("staff1234"),
            name="이직원",
            role=Role.STAFF,
            store_id=store.id,
        )
        staff2 = User(
            employee_id="STF-2024-002",
            password=hash_password("staff1234"),
            name="박직원",
            role=Role.STAFF,
            store_id=store.id,
        )
        session.add_all([owner, staff1, staff2])
        await session.flush()

        # 근무 스케줄 (이번 주)
        schedules = [
            Schedule(user_id=staff1.id, work_date=date(2026, 10, 12), start_time=time(7, 0), end_time=time(15, 0)),
            Schedule(user_id=staff1.id, work_date=date(2026, 10, 13), start_time=time(7, 0), end_time=time(15, 0)),
            Schedule(user_id=staff2.id, work_date=date(2026, 10, 12), start_time=time(15, 0), end_time=time(23, 0)),
            Schedule(user_id=staff2.id, work_date=date(2026, 10, 13), start_time=time(15, 0), end_time=time(23, 0)),
            Schedule(user_id=owner.id, work_date=date(2026, 10, 12), start_time=time(9, 0), end_time=time(18, 0)),
        ]
        session.add_all(schedules)

        # 상품
        products = [
            Product(barcode="8801234560010", name="신라면 컵", price=1500),
            Product(barcode="8801234560027", name="삼각김밥 참치마요", price=1200),
            Product(barcode="8801234560034", name="스팸 클래식 200g", price=5980),
            Product(barcode="8801234560041", name="서울우유 1L", price=2800),
            Product(barcode="8801234560058", name="코카콜라 500ml", price=1800),
            Product(barcode="8801234560065", name="허쉬 초코바", price=1500),
            Product(barcode="8801234560072", name="도시락 김치찌개", price=4500),
            Product(barcode="8801234560089", name="샌드위치 햄치즈", price=3200),
            Product(barcode="8801234560096", name="바나나우유 240ml", price=1500),
            Product(barcode="8801234560102", name="핫바 오리지널", price=2000),
        ]
        session.add_all(products)

        await session.commit()
        print("시드 데이터 생성 완료!")
        print(f"  점포: {store.name} ({store.store_code})")
        print(f"  사용자: {owner.name}(점장), {staff1.name}, {staff2.name}(직원)")
        print(f"  스케줄: {len(schedules)}건")
        print(f"  상품: {len(products)}건")


if __name__ == "__main__":
    asyncio.run(seed())
