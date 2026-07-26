---
name: se-figcrop
description: 시험지 캡쳐 jpg에서 그림/도식 영역만 잘라 02_text 마크다운에 첨부한다. 호출 예시 — "Q16 도형 crop", "수학 Q3 그래프 잘라줘", "/se-figcrop Q16 수학 좌표평면". 입력이 시험 문제 그림 영역과 관련되면 트리거. 사용자가 좌표를 명시하지 않으면 Claude가 페이지 레이아웃을 보고 추정한 후 결과를 시각 확인하여 미세조정한다.
---

# se-figcrop — 시험지 그림 영역 crop & embed

## 환경
- Python 3.14 + Pillow 12.1 (확인됨)
- 작업 루트: `C:/Kids/70_HighSchool/exam_track/26_High_1-1/`
- 폴더 규약: `<과목>-중간/01_capture/` 원본 jpg, `<과목>-중간/01_capture/figs/` crop 결과, `<과목>-중간/02_text/` 그룹 .md (정본)

## 인자 형태
```
/se-figcrop                              # 인터랙티브 (Nick에게 정보 요청)
/se-figcrop Q16 수학                      # 좌표는 Claude가 추정
/se-figcrop Q16 수학 좌표평면              # + 짧은 설명
/se-figcrop Q16 수학 좌표평면 100,400,800,1100  # + 정확한 좌표 (x1,y1,x2,y2)
```

## 절차

### 1. 정보 수집
필요한 항목:
- **과목** (수학/영어/국어/과학/한국사) → 디렉토리명 매핑
  - 수학 → `공통수학1-중간`, 영어 → `공통영어1-중간`, 국어 → `공통국어1-중간`, 과학 → `공통과학1-중간`, 한국사 → `한국사1-중간`
- **문제 번호** (예: Q16)
- **원본 jpg 페이지** — 02_text 그룹 .md를 Read하여 어느 페이지에 Q<번호>가 있는지 확인
- **crop 영역** — 좌표 또는 자동 추정
- **짧은 설명** (예: 좌표평면, DNA구조, 이온결합)

부족한 항목은 Nick에게 한 번에 모아 질문. 추론 가능하면 묻지 않음.

### 2. 원본 확인 + 이미지 크기
```bash
python -c "from PIL import Image; im=Image.open(r'<src.jpg>'); print(im.size)"
```
원본 jpg를 Read 도구로 읽어 시각 확인.

### 3. 좌표 추정 (자동)
좌표 미명시 시:
- 시험지는 보통 2단 → 좌단/우단 결정
- 문제 번호 위치로 상하 영역 결정
- 이미지 크기 기준 비율 → 픽셀 환산

추정 결과를 Nick에게 보여주기:
> Q16 그림은 우단 중간으로 보임. 좌표 (W*0.50, H*0.30) ~ (W*0.95, H*0.70). 결과 보고 미세조정 가능.

### 4. Crop 실행
```bash
mkdir -p "<시험dir>/<과목dir>/01_capture/figs"
python -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(r'<src.jpg>'))
im.crop((x1, y1, x2, y2)).save(r'<out.jpg>', quality=92)
print('saved', '<out.jpg>')
"
```

저장 경로: `01_capture/figs/Q<번호>_<설명>.jpg` (공백은 `_`로).

### 5. 결과 확인
저장된 jpg를 Read로 읽어 시각 확인 → Nick OK 받기. 미세조정 시 좌표 변경하여 재실행 (덮어쓰기).

### 6. .md 자동 삽입
해당 02_text 그룹 .md를 Edit:

```markdown
### Q16
... 문제 본문 ...

![Q16 좌표평면](../01_capture/figs/Q16_좌표평면.jpg)

[FIG: 좌표평면 ...]   ← 기존 ASCII/플레이스홀더 보존
```

이미지 링크는 `[FIG:` 라인 **위**에 추가.

### 7. issue.md 업데이트
해당 그림 OCR 항목 closed 마킹:
```markdown
- [x] **Q16 그림 정확도** — figs/Q16_좌표평면.jpg 첨부 완료. → (Claude YYYY-MM-DD)
```

### 8. 보고
한 줄 요약:
> Q16 좌표평면 → `01_capture/figs/Q16_좌표평면.jpg` 저장, `Q15-16_p4.md`에 삽입. issue.md 항목 closed.

## 작업 규약
- 원본 `01_capture/*.jpg`는 절대 수정하지 않음. crop은 `figs/` 하위에만.
- 좌표 자동 추정 후에는 반드시 결과를 시각 확인.
- crop 결과 >500KB면 `quality=85` 또는 `im.thumbnail()` 검토.
- Nick이 수동 crop 파일을 이미 두었으면 덮어쓰지 말고 그대로 사용.

## 한계
- 픽셀 좌표 시각 추정 정확도 ±10% — 정밀 작업은 좌표 직접 지정 권장.
- EXIF 회전된 jpg 대응: `ImageOps.exif_transpose()` 적용 (위 명령에 포함).
