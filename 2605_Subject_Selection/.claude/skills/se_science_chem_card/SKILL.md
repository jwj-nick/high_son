# SKILL: /se_science_chem_card [substance_id | atom_element]

## 목적
통합과학1 화학결합·원자모형 학습 카드를 생성한다.
- **화학결합 카드**: `수행평가-과학/chem_bond_app.html` substances 배열에 추가
- **원자모형 카드**: `수행평가-과학/atom_model_app.html` elements 배열에 추가

---

## 입력 형식

```
/se_science_chem_card nacl          ← 화학결합 물질 카드
/se_science_chem_card h2
/se_science_chem_card all           ← 22종 전체 화학결합 앱 재생성
/se_science_chem_card atom:na       ← 원자모형 카드 (원소 기호)
/se_science_chem_card atom:all      ← 10종 전체 원자모형 앱 재생성
```

---

## [A] 화학결합 카드 필수 항목

| 항목 | 설명 |
|---|---|
| `id` | 영문 소문자 식별자 (nacl, mgo, h2 ...) |
| `name` | 한국어 이름 |
| `commonName` | 생활 속 이름 (소금, 제설제 등) — 없으면 null |
| `formula` | 화학식 (유니코드 아래첨자 사용: H₂, CO₂ ...) |
| `bondType` | `'ionic'` / `'covalent'` / `'mixed'` |
| `bondName` | 결합 상세 (단일/이중/삼중, 이온+공유 등) |
| `formation` | 결합 형성 단계 배열 (문자열 3~4개) |
| `lewisText` | Lewis 구조 텍스트 표현 (H─H, O═C═O, Na⁺+Cl⁻ 등) |
| `svgType` | SVG 렌더러 유형 (아래 표 참조) |
| `svgParams` | SVG 렌더러에 넘길 파라미터 |
| `properties` | 상태, 녹는점, 용해도, 전기전도 |
| `drawingPoints` | 시험에서 그림 그릴 때 체크리스트 (3~5개) |
| `examHook` | 한 줄 암기 포인트 |

### 화학결합 SVG 렌더러 유형

| svgType | 적용 물질 | 설명 |
|---|---|---|
| `dia` | H₂, O₂, N₂, HCl | 이원자 분자 (단일/이중/삼중 선) |
| `cen` | NH₃, CH₄, CO₂ | 중심 원자 + 주변 원자 |
| `chain` | H₂O₂ | 사슬형 분자 |
| `ionic` | NaCl, MgO, Fe₂O₃, KCl, CaCl₂ | 전자 이동 다이어그램 |
| `mix` | NaOH, Mg(OH)₂, CaCO₃, NaHCO₃ | 이온+공유 혼합 표시 |
| `txt` | 설탕, 포도당, 아스피린, 에탄올, 아세트산 | 복잡한 유기분자 → 텍스트 |

---

## [B] 원자모형 카드 필수 항목

| 항목 | 설명 |
|---|---|
| `id` | 원소 기호 소문자 (h, c, n, o, na, mg, cl, k, ca, fe) |
| `symbol` | 원소 기호 대문자 (H, C, N, O, Na, Mg, Cl, K, Ca, Fe) |
| `name` | 한국어 원소명 |
| `Z` | 원자번호 |
| `mass` | 원자량 (정수 근사) |
| `type` | `'metal'` / `'nonmetal'` |
| `shells` | 원자 전자 배치 배열 [K, L, M, N] (예: Na = [2,8,1]) |
| `valence` | 원자가 전자 수 |
| `ionSymbol` | 이온 기호 (Na⁺, Cl⁻ 등) — null이면 이온 없음 |
| `ionCharge` | 이온 전하 정수 (+1, -2 등) — null이면 이온 없음 |
| `ionShells` | 이온 전자 배치 배열 — null이면 이온 없음 |
| `ionProcess` | 이온화 설명 문자열 (전자 n개 잃음/얻음) |
| `drawingPoints` | 시험 그림 체크리스트 (3~5개) |
| `examHook` | 한 줄 암기 포인트 |

### 원자모형 SVG 렌더러 유형

| svgType | 설명 |
|---|---|
| `bohr` | Bohr 모델: 동심원 껍질 + 전자 점 (원자가 전자 노란색 강조) |

### bohr svgParams 형식

```javascript
{
  shells: [2, 8, 1],       // 원자 전자 배치 [K,L,M,N]
  valence: 1,              // 원자가 전자 수 (최외각 강조)
  symbol: 'Na',            // 원자핵 표시용
  Z: 11,                   // 양성자 수
  ionShells: [2, 8],       // 이온 전자 배치 (null이면 이온 없음)
  ionCharge: +1            // 이온 전하
}
```

---

## 검증 체크리스트

### 화학결합 카드
- [ ] 화학식 정확 (아래첨자 유니코드 올바름)
- [ ] 결합 유형 정확 (금속+비금속=이온, 비금속+비금속=공유)
- [ ] 이온 전하 및 비율 정확 (Fe₂O₃: Fe³⁺ 2개 + O²⁻ 3개)
- [ ] 원자가 전자 수 정확 (H=1, C=4, N=5, O=6, Na=1, Cl=7, Mg=2, Ca=2, K=1)
- [ ] 결합 형성 단계 논리적 순서
- [ ] SVG 구조가 Lewis 전자점식 원칙 준수

### 원자모형 카드
- [ ] 원자번호 = 양성자 수 = 전자 수 (중성 원자)
- [ ] 전자 배치 합계 = 원자번호 (shells 배열 합산)
- [ ] 최대 수용 전자 수 준수 (K≤2, L≤8, M≤18, N≤32)
- [ ] 원자가 전자 = shells 배열 마지막 값
- [ ] 이온 전자 배치 합계 = 원자번호 ± |전하|
- [ ] 이온화 과정 설명 논리적

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `수행평가-과학/02_화학결합.md` | 물질별 상세 참고 데이터 |
| `수행평가-과학/chem_bond_app.html` | 화학결합 통합 앱 |
| `수행평가-과학/atom_model_app.html` | 원자모형 통합 앱 |
| `수행평가-과학/00_수행평가_과학.md` | 시험 범위·평가 기준 |
