-- 테이블 생성
CREATE TYPE user_role AS ENUM ('OWNER', 'STAFF');

CREATE TABLE stores (
    id BIGSERIAL PRIMARY KEY,
    store_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role user_role NOT NULL,
    store_id BIGINT NOT NULL REFERENCES stores(id)
);

CREATE TABLE schedules (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    work_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    barcode VARCHAR(13) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    price INTEGER NOT NULL
);

-- 점포
INSERT INTO stores (store_code, name) VALUES
    ('E24-001', '이마트24 스파로스점'),
    ('E24-002', '이마트24 역삼점');

-- 사용자 (비밀번호: owner1234 / staff1234)
-- id 1~3: 스파로스점, id 4~6: 역삼점
INSERT INTO users (employee_id, password, name, role, store_id) VALUES
    ('OWN-2024-001', '$2b$12$50toJ70J9zq3nrm1a8ytxu2kRf2t9jAZpexzYPAFr8eCQrRbl2n0G', '김점장', 'OWNER', 1),
    ('STF-2024-001', '$2b$12$U4mTf8yQJMj2tfHDyg18bOvM4B0oPk4cr/DicQ5VajAsUWijiSoye', '이직원', 'STAFF', 1),
    ('STF-2024-002', '$2b$12$U4mTf8yQJMj2tfHDyg18bOvM4B0oPk4cr/DicQ5VajAsUWijiSoye', '박직원', 'STAFF', 1),
    ('OWN-2024-002', '$2b$12$50toJ70J9zq3nrm1a8ytxu2kRf2t9jAZpexzYPAFr8eCQrRbl2n0G', '최점장', 'OWNER', 2),
    ('STF-2024-003', '$2b$12$U4mTf8yQJMj2tfHDyg18bOvM4B0oPk4cr/DicQ5VajAsUWijiSoye', '정직원', 'STAFF', 2),
    ('STF-2024-004', '$2b$12$U4mTf8yQJMj2tfHDyg18bOvM4B0oPk4cr/DicQ5VajAsUWijiSoye', '한직원', 'STAFF', 2);

-- 근무 스케줄 (스파로스점 10/12~10/18 일주일, 24시간 3교대)
-- 오전 07~15 / 오후 15~23 / 야간 23~07
-- 김점장(1), 이직원(2), 박직원(3) 로테이션
INSERT INTO schedules (user_id, work_date, start_time, end_time) VALUES
    -- 10/12 (월)
    (2, '2026-10-12', '07:00', '15:00'),
    (1, '2026-10-12', '15:00', '23:00'),
    (3, '2026-10-12', '23:00', '07:00'),
    -- 10/13 (화)
    (3, '2026-10-13', '07:00', '15:00'),
    (1, '2026-10-13', '15:00', '23:00'),
    (2, '2026-10-13', '23:00', '07:00'),
    -- 10/14 (수)
    (2, '2026-10-14', '07:00', '15:00'),
    (3, '2026-10-14', '15:00', '23:00'),
    (1, '2026-10-14', '23:00', '07:00'),
    -- 10/15 (목)
    (1, '2026-10-15', '07:00', '15:00'),
    (2, '2026-10-15', '15:00', '23:00'),
    (3, '2026-10-15', '23:00', '07:00'),
    -- 10/16 (금)
    (3, '2026-10-16', '07:00', '15:00'),
    (1, '2026-10-16', '15:00', '23:00'),
    (2, '2026-10-16', '23:00', '07:00'),
    -- 10/17 (토)
    (2, '2026-10-17', '07:00', '15:00'),
    (3, '2026-10-17', '15:00', '23:00'),
    (1, '2026-10-17', '23:00', '07:00'),
    -- 10/18 (일)
    (3, '2026-10-18', '07:00', '15:00'),
    (1, '2026-10-18', '15:00', '23:00'),
    (2, '2026-10-18', '23:00', '07:00');

-- 상품
INSERT INTO products (barcode, name, price) VALUES
    ('8801234560010', '신라면 컵',         1500),
    ('8801234560027', '삼각김밥 참치마요',  1200),
    ('8801234560034', '스팸 클래식 200g',   5980),
    ('8801234560041', '서울우유 1L',        2800),
    ('8801234560058', '코카콜라 500ml',     1800),
    ('8801234560065', '허쉬 초코바',        1500),
    ('8801234560072', '도시락 김치찌개',    4500),
    ('8801234560089', '샌드위치 햄치즈',    3200),
    ('8801234560096', '바나나우유 240ml',   1500),
    ('8801234560102', '핫바 오리지널',      2000);
