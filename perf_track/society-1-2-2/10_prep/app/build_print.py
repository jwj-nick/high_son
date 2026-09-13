# -*- coding: utf-8 -*-
"""프린트 팩 조립 — 90_output/step1_card.html + reading_sheet.html + STEP2~8 낱장 → 90_output/print_pack.html
실행: python build_print.py   (10_prep/app 에서)
"""
import io, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', '90_output'))

def body_of(path):
    s = io.open(path, encoding='utf-8').read()
    m = re.search(r'<body>(.*)</body>', s, re.S)
    b = m.group(1)
    b = re.sub(r'<div class="noprint".*?</div>\s*', '', b, count=1, flags=re.S)
    return b

CSS = '''
@page{size:A4;margin:12mm}
*{box-sizing:border-box}
body{font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;color:#111;margin:0;padding:14px;line-height:1.5;font-size:12px;max-width:820px}
h1{font-size:18px;margin:0 0 2px}
h2{font-size:14px;margin:12px 0 6px;border-bottom:2px solid #1e40af;padding-bottom:2px}
h3{font-size:13px;margin:10px 0 4px}
.sub{font-size:11px;color:#555;margin-bottom:8px}
.pb{page-break-before:always}
.warn{border:2px solid #b91c1c;background:#fef2f2;border-radius:8px;padding:6px 10px;font-size:11.5px;margin-bottom:10px}
table{width:100%;border-collapse:collapse;font-size:11.5px;margin-bottom:8px}
th,td{border:1px solid #999;padding:4px 6px;vertical-align:top;text-align:left}
th{background:#e0f2fe}
.blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #333;color:#b91c1c;font-weight:700}
.para{word-break:keep-all;line-height:1.65}
.chk{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;font-size:11px;margin:4px 0 0}
.chk div::before{content:"☐ ";}
.box{border:1px solid #bbb;border-radius:8px;padding:6px 10px;margin-top:8px;font-size:11px;page-break-inside:avoid}
.box > b:first-child{display:block;margin-bottom:2px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.memo{width:34%}.memo::after{content:"";display:block;height:34px}
.tier1 td:first-child{background:#fef3c7;font-weight:700}.tier2 td:first-child{background:#ecfccb;font-weight:700}.tier3 td:first-child{background:#f1f5f9}
.marks{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:4px}
.marks div{border:1px dashed #999;border-radius:6px;padding:5px 8px}.marks b{font-size:16px;display:block}
.q{margin:0;padding-left:18px}.q li{margin-bottom:8px}
.line{border-bottom:1px solid #aaa;height:20px}
.lines{border:1px solid #999;border-radius:6px;padding:4px 8px;background:repeating-linear-gradient(#fff 0 21px,#ddd 21px 22px);min-height:66px}
.lines.tall{min-height:110px}.lines.xl{min-height:154px}
.tip{border:1px solid #93c5fd;background:#eff6ff;border-radius:8px;padding:6px 10px;font-size:11px;margin:6px 0}
.small{font-size:10.5px;color:#555}
.pill{display:inline-block;font-size:10px;font-weight:800;padding:1px 7px;border-radius:20px;background:#dbeafe;color:#1e40af;margin-right:4px}
ul{margin:2px 0 4px 18px;padding:0}li{margin-bottom:2px}
@media print{.noprint{display:none}}
.s1 th{width:86px;white-space:nowrap}
'''

STEP2 = '''
<h1>STEP 2 · 인상 깊은 문장 · 인권 이슈 탐구 — 카드</h1>
<div class="sub">2차시(9/16 수) · "문장 2개 + 이유 + 오늘날 인권 문제와의 연결" · 도서 이해 6점 묶음의 핵심</div>
<div class="warn">문장은 <b>책에서 그대로</b>(장·쪽 표시). 이유는 <b>내 말</b>로. 선생님 예시(『논어』)의 문장 구조("예전에는 ~라고만 생각했다. 그런데…")를 따라 쓰지 않는다.</div>
<div class="two">
<div class="box"><b>만점 조건</b>
· 문장 선정 기준 4가지 중 하나: 기존 생각을 바꾼 / 새로운 관점·통찰 / 문제의식·감정 / 해결 방안·행동<br>
· 이유에 넣을 것(두세 개 골라 구체적으로): 기존 생각과의 대비 · 개인 경험·주변 일 · 사회 현상·뉴스 · 감정과 그 이유 · 새로운 깨달음<br>
· ⭐ <b>[오늘날 우리 사회의 인권 문제와의 연결]</b> 문단 필수 — 헌법 조항이나 제도·사례 이름을 붙인다<br>
· 두 문장은 서로 <b>다른 인권 문제</b>로 (예: 하나는 낙인, 하나는 평등)</div>
<div class="box"><b>흔한 실수</b>
· "감동적이었다"에서 끝남 → 왜·무엇이·어떻게가 없음<br>
· 연결 문단이 "인권은 소중하다"로 뭉뚱그려짐 → 조항·제도·사례 이름이 없음<br>
· 두 문장이 같은 이야기(둘 다 인종차별)<br>
· 책 속 인물 평가에서 끝나고 지금 우리 사회로 안 나감</div>
</div>
<h2>연결 재료 — 헌법 조문 (그대로 인용 가능)</h2>
<table>
<tr><th style="width:110px">조문</th><th>내용</th><th style="width:150px">쓸 곳</th></tr>
<tr><td>제10조</td><td>모든 국민은 인간으로서의 존엄과 가치를 가지며, 행복을 추구할 권리를 가진다. 국가는 개인이 가지는 불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다.</td><td>존엄 · 역지사지 · 낙인</td></tr>
<tr><td>제11조①</td><td>모든 국민은 법 앞에 평등하다. 누구든지 성별·종교 또는 사회적 신분에 의하여 정치적·경제적·사회적·문화적 생활의 모든 영역에 있어서 차별을 받지 아니한다.</td><td>차별 · 법정의 평등</td></tr>
<tr><td>제12조①·④</td><td>모든 국민은 신체의 자유를 가진다. (…) 누구든지 체포 또는 구속을 당한 때에는 즉시 변호인의 조력을 받을 권리를 가진다.</td><td>변호받을 권리 · 린치</td></tr>
<tr><td>제27조①·④</td><td>모든 국민은 헌법과 법률이 정한 법관에 의하여 법률에 의한 재판을 받을 권리를 가진다. (…) 형사피고인은 유죄의 판결이 확정될 때까지는 무죄로 추정된다.</td><td>공정한 재판 · 무죄추정</td></tr>
<tr><td>제21조①·④</td><td>모든 국민은 언론·출판의 자유와 집회·결사의 자유를 가진다. (…) 언론·출판은 타인의 명예나 권리 또는 공중도덕이나 사회윤리를 침해하여서는 아니된다.</td><td>혐오 표현 vs 표현의 자유</td></tr>
<tr><td>제17조</td><td>모든 국민은 사생활의 비밀과 자유를 침해받지 아니한다.</td><td>부 래들리 · 신상 공개</td></tr>
</table>
<div class="tip"><b>책의 문제 → 오늘날:</b> 편견에 기댄 재판 → 국민참여재판·여론재판 / 인종·계층 차별 → 이주노동자·장애인 차별, 국가인권위원회법 제2조(차별 사유) / 낙인·혐오 표현 → 온라인 혐오 댓글 / 다수의 폭력 → 신상 털기·집단 괴롭힘 / 은둔자 낙인 → 정신질환 보도 준칙·은둔 청년 / 여성 배심원 배제 → 배심원 자격(만 20세 이상 국민)</div>
<div class="pb"></div>
<h2>STEP 2 초안 양식 (수업 전 손으로 뼈대만)</h2>
<table>
<tr><th style="width:70px">문장 ①</th><td>(&nbsp;&nbsp;장 &nbsp;&nbsp;쪽) <div class="lines"></div></td></tr>
<tr><th>이유</th><td><div class="lines tall"></div><b>[오늘날의 인권 문제와의 연결]</b><div class="lines tall"></div></td></tr>
<tr><th>문장 ②</th><td>(&nbsp;&nbsp;장 &nbsp;&nbsp;쪽) <div class="lines"></div></td></tr>
<tr><th>이유</th><td><div class="lines tall"></div><b>[오늘날의 인권 문제와의 연결]</b><div class="lines tall"></div></td></tr>
</table>
'''

STEP345 = '''
<h1>STEP 3~5 · 토론 질문 → 점검 → 논제 정하기 — 카드</h1>
<div class="sub">3차시(9/21 월) · 논제 선정·용어 정의 4점 + 도서 이해 6점 묶음의 "토론 질문·점검"</div>
<div class="warn">예시 질문은 <b>재료</b>다. 내 STEP2 문장·인권 이슈에서 출발해 <b>내 말로</b> 다시 만든다. 논제·정의 문장도 마찬가지.</div>
<h2>STEP 3 · 5패턴 질문</h2>
<table>
<tr><th style="width:60px">유형</th><th style="width:90px">패턴</th><th style="width:150px">질문 틀</th><th>나의 질문 (책과 연결)</th></tr>
<tr><td>기본형</td><td>가치 평가형</td><td>~은 정당한가? / ~은 옳은가?</td><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><td></td><td>책임·귀속형</td><td>~는 누구의 책임인가?</td><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><td>가치 충돌형</td><td>우선순위 비교형</td><td>~와 ~ 중 무엇이 더 우선되어야 하는가?</td><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><td></td><td>한계·허용형</td><td>~는 어디까지 허용되어야 하는가?</td><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><td>정책·확장형</td><td>정책·대안 제시형</td><td>~를 도입(실시)해야 하는가?</td><td><div class="lines" style="min-height:44px"></div></td></tr>
</table>
<div class="tip"><b>재료(방향만):</b> 다수가 유죄라고 믿는 사건에서 배심원 재판은 정당한가 · 억울한 유죄 판결은 누구의 책임인가 · 공동체의 다수 의견 vs 한 사람의 공정한 재판받을 권리 · 특정 집단을 향한 혐오 표현은 어디까지 · 국민참여재판을 확대해야 하는가 — <b>답이 뻔한 질문("인권은 소중한가")·너무 좁은 질문("주인공은 나쁜 사람인가")·책 안에만 갇힌 질문은 ✗</b></div>
<h2>STEP 4 · 6기준 점검 — 나의 질문: <span class="blank" style="min-width:380px"></span></h2>
<table>
<tr><th style="width:24px">#</th><th style="width:80px">기준</th><th>세부 내용</th><th style="width:44px">판정</th></tr>
<tr><td>1</td><td>논쟁적</td><td>찬성과 반대 양쪽 모두 합리적인 근거를 댈 수 있는가?</td><td></td></tr>
<tr><td>2</td><td>가치 충돌</td><td>두 가지 이상의 가치가 서로 충돌하는가? ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↔ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</td><td></td></tr>
<tr><td>3</td><td>구체성</td><td>단순 '예/아니오'가 아니라 논거가 필요한 질문인가?</td><td></td></tr>
<tr><td>4</td><td>시의성</td><td>현재 우리 사회에서 실제로 중요하게 다루어지는 문제인가?</td><td></td></tr>
<tr><td>5</td><td>복합성</td><td>법·윤리·경제 등 다양한 관점에서 접근할 수 있는가?</td><td></td></tr>
<tr><td>6</td><td>현실 연결성</td><td>책 속 내용에 머무르지 않고 지금 우리 사회의 문제로 연결하여 근거를 만들 수 있는가?</td><td></td></tr>
</table>
<div class="small">O/△/X. △·X가 2개 이상이면 질문을 고치거나 다시 만든다. "현실 연결성"은 특히 꼼꼼히.</div>
<div class="pb"></div>
<h2>STEP 5 · 논제 · 용어 정의 · 함께 생각해 봐야 하는 까닭</h2>
<div class="two">
<div class="box"><b>만점 조건</b>
· 논제 = 찬반 토론이 가능한 <b>평서문</b> "~해야 한다." (질문 ✗, "~에 대해" ✗)<br>
· 핵심 용어 정의: 논쟁의 여지가 있는 용어일수록 세밀하게 + <b>왜 이 구분이 필요한지</b> 한 줄<br>
· 까닭 3요소: ① 현재 상황과 쟁점(통계·사실 + 출처) ② 찬반 양쪽 논점을 <b>균형 있게</b> ③ 토론의 필요성</div>
<div class="box"><b>재료 A — 국민참여재판 확대 (출처 확인됨)</b>
· 근거법 「국민의 형사재판 참여에 관한 법률」(2008.1 시행). 피고인 신청 → 만 20세 이상 국민 배심원. 평결은 법원을 기속하지 않음(제46조⑤)<br>
· 실시 건수: 2013년 345건(최다) → 2024년 91건 → 2025년 109건. 2008~2025년 1심 누적 3,189건<br>
· 배심원 평결·판사 판결 일치율 93.9% / 무죄율 13.8%(일반 형사합의 1심의 2.5배)<br>
· 출처: 한국경제, 「배심원과 판사 판결 94% 일치…무죄율은 국민참여재판이 더 높아」, 2026.6.23. (법원행정처 통계) https://www.hankyung.com/article/202606232756i<br>
· 헌법 제27조① "법관에 의한 재판" → 평결에 구속력을 주는 방향은 헌법 해석 문제가 따라옴</div>
</div>
<div class="tip"><b>"확대"의 뜻을 먼저 못 박기:</b> (가) 대상 사건 확대 (나) 법원의 배제 결정 제한 (다) 평결에 구속력 부여 — 어디까지를 "확대"로 볼지에 따라 찬반 논거가 달라진다. 예비 논제(차별금지법 제정 / 혐오 표현 규제)는 앱 STEP5 재료 참조.</div>
<table>
<tr><th style="width:90px">토론 논제</th><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><th>용어의<br>개념적 정의</th><td>용어 1: <div class="lines"></div>용어 2: <div class="lines"></div>이 구분이 필요한 이유: <div class="lines" style="min-height:44px"></div></td></tr>
<tr><th>함께 생각해<br>봐야 하는 까닭</th><td>① 현재 상황과 쟁점 (통계·사실 + 출처)<div class="lines tall"></div>② 찬반 양쪽의 논점<div class="lines tall"></div>③ 토론의 필요성<div class="lines"></div></td></tr>
</table>
'''

STEP67 = '''
<h1>STEP 6~7 · AI 챗봇과 토론 · 팩트체크 — 카드</h1>
<div class="sub">4~5차시(9/23 수 · 9/28 월?) · 입장·주장·근거 5점 + AI 반대 입장 기록·출처 확인 2점</div>
<div class="warn">AI는 <b>반대편 토론 상대</b>로만. AI 답변은 붙여넣기 허용이지만 <b>그대로 믿지 않는다</b>. 내 이유·근거는 내 말로. <b>쟁점 1과 2의 출처는 서로 다른 것</b>으로.</div>
<div class="two">
<div class="box"><b>만점 조건</b>
· 나의 입장 명확 + 쟁점 2개 × (이유 · 구체적 근거 · 신뢰 출처)<br>
· 이유: 주장과 <b>직접</b> 연결 + 인권·정의·평등·자유 같은 보편 가치와 연결<br>
· 근거: 책 속 사례 · 현실 사례 · 전문가 의견 · 객관적 데이터 · 상세한 설명(나열 ✗)<br>
· 개인 블로그·출처 없는 게시물·광고성 글 ✗</div>
<div class="box"><b>출처 형식 (안내문 그대로)</b>
· 법령: 법령명 제○조 (국가법령정보센터) + URL<br>
· 신문·뉴스: 언론사, 「기사 제목」, 발행일자 + URL<br>
· 연구논문: 저자, 「논문 제목」, 학술지명 권(호), 발행연도 + URL<br>
· 도서: 저자, 『책 제목』, 출판사, 출판연도<br>
· 쟁점1 = 법 조문, 쟁점2 = 통계·뉴스 또는 논문 — 이렇게 종류를 나누면 안전</div>
</div>
<h2>STEP 6 양식</h2>
<table>
<tr><th style="width:60px">논제</th><td colspan="2"><div class="lines" style="min-height:24px"></div></td></tr>
<tr><th>구분</th><th style="width:45%">나의 입장 ( 찬성 / 반대 )</th><th>AI의 입장 — 챗봇 답변을 보고 옮겨 적기</th></tr>
<tr><th colspan="3" style="background:#fce7f3">쟁점 1 | <span class="blank" style="min-width:300px"></span></th></tr>
<tr><th>이유</th><td><div class="lines" style="min-height:44px"></div></td><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><th>근거</th><td><div class="lines tall"></div></td><td><div class="lines tall"></div></td></tr>
<tr><th>출처</th><td><div class="lines" style="min-height:44px"></div></td><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><th colspan="3" style="background:#fce7f3">쟁점 2 | <span class="blank" style="min-width:300px"></span></th></tr>
<tr><th>이유</th><td><div class="lines" style="min-height:44px"></div></td><td><div class="lines" style="min-height:44px"></div></td></tr>
<tr><th>근거</th><td><div class="lines tall"></div></td><td><div class="lines tall"></div></td></tr>
<tr><th>출처</th><td><div class="lines" style="min-height:44px"></div></td><td><div class="lines" style="min-height:44px"></div></td></tr>
</table>
<div class="pb"></div>
<h2>리허설 — 논제 A(국민참여재판 확대)에서 AI가 낼 법한 반론과 재반박 재료</h2>
<div class="small">내가 <b>찬성</b>일 때 AI(반대)의 반론 → 재반박 재료. (내가 반대면 앱 STEP6 리허설에서 반대편 카드를 본다.) 재료를 외우지 말고 <b>내 말로</b> 다시 말한다.</div>
<table>
<tr><th style="width:44%">AI(반대)의 반론</th><th>재반박 재료</th></tr>
<tr><td>배심원은 법을 모르는 사람이라 여론과 감정에 휘둘린다. 책 속 메이콤 배심원단이 바로 그 증거 아닌가?</td><td>배심원 선정 때 기피 절차가 있고 판사가 법을 설명한다. 판사와 배심원의 결론이 93.9% 일치한다는 통계는 배심원 판단이 판사와 크게 다르지 않다는 뜻. 메이콤의 문제는 "배심원"이 아니라 흑인·여성을 아예 배제한 "구성"이었다 → 오히려 다양한 시민이 들어와야 한다는 근거.</td></tr>
<tr><td>시간과 비용이 많이 들고, 시민에게 부담을 준다.</td><td>민주적 정당성에는 비용이 든다. 대상 사건을 한정하고 하루 안에 끝내는 현행 방식이면 부담이 크지 않다. 연 100건 안팎으로 줄어든 지금은 비용이 아니라 제도가 사라지는 게 문제.</td></tr>
<tr><td>평결은 법원을 기속하지 않으니(제46조⑤) 확대해도 실효성이 없다.</td><td>기속력이 없어도 판사가 배심원 의견을 거의 그대로 따른다는 일치율이 있다. 확대 논의는 구속력 부여가 아니라 더 많은 사건에서 시민이 판단에 참여하게 하자는 것.</td></tr>
<tr><td>피고인이 신청해야 열리는 제도인데, 확대·의무화는 피고인의 선택권을 빼앗는다.</td><td>확대 = 의무화가 아니다. 대상 사건을 넓히고 법원의 배제 결정을 줄여 "원하는 피고인이 실제로 받을 수 있게" 하자는 것.</td></tr>
</table>
<h2>STEP 7 · AI 반박 팩트체크 (AI가 준 출처마다)</h2>
<table>
<tr><th>확인 항목</th><th style="width:60px">출처 1</th><th style="width:60px">출처 2</th><th style="width:40%">확인한 내용 메모 (실제 제목·날짜·발행 주체, 다르면 무엇이 달랐는지)</th></tr>
<tr><td>① 실제로 열리는가 — 주소를 검색창에 넣어 열리는지. 안 열리면 <b>그 사실을 적는다</b></td><td></td><td></td><td></td></tr>
<tr><td>② 제목·날짜가 같은가 — AI가 말한 것과 실제 자료 대조. 다르면 <b>실제 기준으로 고쳐 적는다</b></td><td></td><td></td><td></td></tr>
<tr><td>③ 내용이 뒷받침하는가 — 원문을 읽고. 숫자가 맞아도 <b>의미와 기준</b>까지</td><td></td><td></td><td></td></tr>
<tr><td>④ 믿을 만한 곳인가 — 언론사·정부·공공기관·학술지. 블로그·출처 없는 글·광고 ✗</td><td></td><td></td><td></td></tr>
</table>
<div class="tip"><b>신뢰도 빠른 판별:</b> go.kr / or.kr / re.kr → 정부·공공·연구 ✔ · 언론사 도메인 ✔(칼럼·사설은 "의견") · kci.go.kr / dbpia / riss → 학술 ✔ · blog · tistory · 카페 · 위키 · 지식iN → ✗ (원 출처를 찾아 대신 적는다). <b>X가 나와도 감점이 아니다 — X라는 사실을 적는 것이 채점 대상.</b></div>
'''

STEP8 = '''
<h1>STEP 8 · 다름과 공존하기 — 카드</h1>
<div class="sub">6차시(9/30 수?) · 의견 조정 및 대응 방안 3점 · <b>AI 금지, 전부 스스로</b></div>
<div class="warn">이 카드는 빈칸과 질문만 준다. 상대(AI)의 주장 중 <b>타당한 부분을 인정</b>하고, 내 생각의 <b>부족한 점</b>도 돌아보는 게 이 STEP의 뜻이다. 이기는 글이 아니다.</div>
<div class="two">
<div class="box"><b>칸마다 무엇을 쓰나</b>
· <b>의견이 다른 부분</b>: 토론에서 확인된 주요 쟁점을 정확히. 양쪽이 끝내 일치하지 않는 핵심 지점<br>
· <b>양보할 수 있는 부분</b>: 상대 주장 중 객관적으로 인정할 수 있는 것 / 어떤 조건이면 받아들일 수 있나 / 급진적 변화보다 단계적 개선 / 양쪽이 공통으로 중요하게 여기는 가치<br>
· <b>모두가 만족할 대안</b>: [절충] 양쪽 입장 부분 반영 / [보완] 부작용을 줄이는 장치 / [새로운 방식] 제3의 대안<br>
· <b>실천 행동 2가지</b>: 일상에서 바로 할 수 있는 구체적 행동 / 인식·태도 변화 / 학습·경험을 통한 역량 강화</div>
<div class="box"><b>실천 행동 쓰는 법</b>
· 한 문단 안에 <b>누가·언제·어디서·무엇을·어떻게·왜</b>가 자연스럽게 들어가게<br>
· <b>괄호 라벨 "(누가)(언제)…"를 그대로 적지 않는다</b> — 그건 선생님이 보여 주려고 붙인 표시일 뿐<br>
· 모양 예: "이번 학기 중 한 달에 한 번 이상, ○○포털로 신청해 ○○에서 ○○을 한다. ○○을 몸으로 이해하기 위해서다." (내용은 내 논제에 맞게)<br>
· 하나는 "나가서 하는 것", 하나는 "찾아보고 이야기하는 것"으로 종류를 나누면 구체적이 된다</div>
</div>
<table>
<tr><th style="width:80px">구분</th><th style="width:45%">나의 입장 ( 찬성 / 반대 )</th><th>AI의 입장</th></tr>
<tr><th>의견이<br>다른 부분</th><td><div class="lines"></div></td><td><div class="lines"></div></td></tr>
<tr><th>양보할 수<br>있는 부분</th><td><div class="lines" style="min-height:88px"></div></td><td><div class="lines" style="min-height:88px"></div></td></tr>
<tr><th>모두가<br>만족할 대안</th><td colspan="2">[절충]<div class="lines" style="min-height:44px"></div>[보완]<div class="lines" style="min-height:44px"></div>[새로운 방식]<div class="lines" style="min-height:44px"></div></td></tr>
<tr><th>지금 할 수<br>있는 행동 ①</th><td colspan="2"><div class="lines"></div></td></tr>
<tr><th>지금 할 수<br>있는 행동 ②</th><td colspan="2"><div class="lines"></div></td></tr>
</table>
<div class="small">점검: 의견 차이·양보·대안·행동 2가지가 <b>모두</b> 있는가 / 양보에 "조건"이 있는가 / 행동에 언제·어디서·왜가 보이는가 / 라벨 괄호가 남아 있지 않은가.</div>
'''

BOOKREF = '''
<h1>책 지도 요약 — 인물 · 명문장 위치 · 사실 점검</h1>
<div class="sub">『앵무새 죽이기』 하퍼 리 · 열린책들 김욱동 옮김 · 1부 1~11장 / 2부 12~31장 · 명문장은 "뜻"이며 인용은 책의 실제 문장으로</div>
<div class="two">
<div class="box"><b>인물</b>
스카웃(화자, 6→9세) · 젬(오빠) · 애티커스(아버지, 변호사) · 캘퍼니아(흑인 가정부) · 딜(여름 친구) · 톰 로빈슨(누명 쓴 흑인 청년, 왼팔 불구) · 메이엘라 유얼(19세 고발자) · 밥 유얼(그 아버지, 왼손잡이) · 부 래들리(은둔한 이웃) · 모디 앳킨슨(이웃 아주머니) · 알렉산드라 고모 · 헥 테이트(보안관) · 테일러 판사 · 길머(검사) · 돌퍼스 레이먼드 · 사익스 목사 · 언더우드(신문 발행인) · 링크 디스(톰의 고용주) · 커닝햄 집안 · 듀보스 부인 · 게이츠 선생</div>
<div class="box"><b>사실 점검</b>
· 죄명 = 성폭행 누명. 메이엘라가 먼저 접근, 밥 유얼이 보고 딸을 때린 정황<br>
· 다친 곳 = 오른쪽 얼굴 → 왼손잡이 → 밥 유얼 / 톰은 왼팔 불구<br>
· 유죄 평결 → 항소 준비 중 탈출 시도하다 사살(24장, 17발)<br>
· 배심원 = 백인 남성만. 여성은 배심원 불가(23장)<br>
· 밥 유얼은 할로윈 밤 아이들 습격하다 사망(28장) → 보안관 "자기 칼 위에 넘어졌다"(30장)<br>
· 1960년 출간 · 1961년 퓰리처상 · 'mockingbird' = 흉내지빠귀</div>
</div>
<table>
<tr><th style="width:36px">#</th><th style="width:36px">장</th><th style="width:80px">누가</th><th>뜻 (인용 아님)</th><th style="width:120px">STEP2 적합도</th></tr>
<tr><td>Q1</td><td>3</td><td>애티커스</td><td>상대의 입장에서 생각해 보기 전에는, 그의 피부 속에 들어가 걸어 보기 전에는 그 사람을 정말 이해할 수 없다</td><td>★★★ 유명하나 흔함</td></tr>
<tr><td>Q2</td><td>9</td><td>애티커스</td><td>이 사건을 맡지 않으면 마을에서 고개를 들 수 없고, 아이들에게 뭘 하라고 말할 수도 없다</td><td>★★ 시민의 책임</td></tr>
<tr><td>Q3</td><td>10</td><td>모디/애티커스</td><td>앵무새는 해를 끼치지 않고 노래만 불러 주니, 앵무새를 죽이는 건 죄다</td><td>★★★ 제목의 뜻</td></tr>
<tr><td>Q5</td><td>15</td><td>스카웃</td><td>(커닝햄 씨에게) 월터 이야기, 안부 — 군중이 한 사람 한 사람이 됨</td><td>★★ 장면형</td></tr>
<tr><td>Q6</td><td>19</td><td>톰 로빈슨</td><td>그녀가 안됐다고 느꼈다</td><td>★★★ 낙인의 구조</td></tr>
<tr><td>Q7</td><td>20</td><td>애티커스</td><td>모든 인간이 평등하게 창조되었다는 말이 진짜인 곳이 하나 있다면 그건 법정이다; 법정은 위대한 평등 장치다</td><td>★★★ 평등권 직결</td></tr>
<tr><td>Q8</td><td>20</td><td>애티커스</td><td>법정도 사람으로 이루어져 있으니 사람만큼만 건전하다; 배심원 여러분이 편견 없이 판단해 달라</td><td>★★ 배심원 논제</td></tr>
<tr><td>Q9</td><td>21</td><td>사익스 목사</td><td>(스카웃에게) 일어서라, 네 아버지가 지나가신다</td><td>★★ 감정</td></tr>
<tr><td>Q10</td><td>22</td><td>모디</td><td>우리는 한 걸음 내디딘 것이다, 아기 걸음이지만</td><td>★★ 변화의 속도</td></tr>
<tr><td>Q11</td><td>23</td><td>스카웃</td><td>사람은 한 종류뿐이다, 그냥 사람</td><td>★★★ 짧고 강함</td></tr>
<tr><td>Q12</td><td>23</td><td>젬</td><td>부 래들리는 나오지 못하는 게 아니라 나오고 싶지 않은 거다</td><td>★★ 은둔·배제</td></tr>
<tr><td>Q13</td><td>25</td><td>언더우드 사설</td><td>불구자를 죽이는 건 죄다 — 노래하는 새를 학살하는 것과 같다</td><td>★★ 제목과 연결</td></tr>
<tr><td>Q14</td><td>30</td><td>스카웃</td><td>(부를 드러내는 건) 앵무새를 죽이는 것과 같다</td><td>★★ 제목의 두 번째 뜻</td></tr>
<tr><td>Q15</td><td>31</td><td>스카웃</td><td>그의 신발을 신고 서 보기 전에는 사람을 알 수 없다 — 현관에 서 보니 알겠다</td><td>★★ Q1의 완성</td></tr>
</table>
<div class="tip"><b>STEP2 추천 조합</b>(내가 표시한 문장이 우선): Q6 + Q7 — 둘 다 재판 장면이지만 하나는 낙인, 하나는 평등이라 오늘날 연결이 서로 달라진다. 또는 Q3 + Q11.</div>
'''

def build():
    step1 = body_of(os.path.join(OUT, 'step1_card.html'))
    reading = body_of(os.path.join(OUT, 'reading_sheet.html'))
    toc = ('<div class="noprint" style="background:#fdf1e0;padding:8px 12px;border-radius:8px;margin-bottom:12px;font-size:11px">'
           '🖨️ Ctrl+P → A4 → "배경 그래픽" 켜기. <b>그날 STEP 쪽만 골라 인쇄</b>해도 된다. 순서: ① STEP1 카드(1쪽) → ② 읽기 워크시트(2쪽) → ③ STEP2 카드(2쪽: 재료 / 양식) → ④ STEP3~5 카드(2쪽) → ⑤ STEP6~7 카드(2쪽) → ⑥ STEP8 카드(1쪽) → ⑦ 책 지도 요약(1쪽)</div>')
    parts = [toc, '<div class="s1">'+step1+'</div>', '<div class="pb"></div>', reading, '<div class="pb"></div>', STEP2, '<div class="pb"></div>', STEP345, '<div class="pb"></div>', STEP67, '<div class="pb"></div>', STEP8, '<div class="pb"></div>', BOOKREF]
    html = ('<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>독서연계 인권토론 — 프린트 팩 (앵무새 죽이기)</title><style>' + CSS + '</style></head><body>' + '\n'.join(parts) + '</body></html>')
    io.open(os.path.join(OUT, 'print_pack.html'), 'w', encoding='utf-8').write(html)
    print('written', os.path.join(OUT, 'print_pack.html'), len(html))

if __name__ == '__main__':
    build()
