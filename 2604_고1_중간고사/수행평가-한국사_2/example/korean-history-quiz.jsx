import { useState, useCallback, useEffect } from "react";

// ────────────────────────────────────────────────
// DATA: Ⅲ-01 통상수교 거부정책과 양요 ~ Ⅲ-02 갑신정변과 열강의 대립
// ────────────────────────────────────────────────
const TERMS = [
  {
    id: 1,
    term: "흥선대원군",
    definition: "고종의 아버지로, 고종 즉위 후 섭정을 맡아 통상수교 거부정책을 주도하고 왕권 강화를 추진한 인물",
    hint: "고종의 아버지, 섭정",
    quiz: "고종이 즉위한 후 섭정을 맡아 통상수교 거부정책을 주도하며 왕권 강화를 추진한 인물은 ( )이다.",
    category: "Ⅲ-01",
  },
  {
    id: 2,
    term: "통상수교 거부정책",
    definition: "서양 열강과의 교역·외교 관계를 전면 거부한 조선의 대외 정책. 흥선대원군 집권기에 강화됨",
    hint: "서양과의 교역·외교 전면 거부",
    quiz: "흥선대원군은 서양 열강의 침략에 맞서 ( )을 강화하여 문호 개방을 거부하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 3,
    term: "척화비",
    definition: "1871년 신미양요 이후 흥선대원군이 '서양과 화친하는 자는 나라를 파는 것'이라는 내용을 새겨 전국에 세운 비석",
    hint: "서양과 화친을 경계하는 비석 (1871)",
    quiz: "신미양요 이후 흥선대원군은 서양과의 화친을 경계하기 위해 전국에 ( )를 세웠다.",
    category: "Ⅲ-01",
  },
  {
    id: 4,
    term: "병인양요",
    definition: "1866년 병인박해를 구실로 프랑스 함대가 강화도를 침략한 사건. 한성근·양헌수 부대가 격퇴함",
    hint: "1866년 프랑스 침략",
    quiz: "1866년 프랑스 함대가 병인박해를 구실로 강화도를 침략한 사건을 ( )라고 한다.",
    category: "Ⅲ-01",
  },
  {
    id: 5,
    term: "병인박해",
    definition: "1866년 흥선대원군이 천주교 선교사와 신자 수천 명을 처형한 사건. 병인양요의 직접적 원인",
    hint: "1866년 천주교 탄압",
    quiz: "흥선대원군이 1866년 천주교 선교사와 신자들을 처형한 ( )는 병인양요의 원인이 되었다.",
    category: "Ⅲ-01",
  },
  {
    id: 6,
    term: "제너럴셔먼호 사건",
    definition: "1866년 미국 상선 제너럴셔먼호가 대동강에서 통상을 요구하다 관민에게 격퇴되어 불태워진 사건. 신미양요의 원인",
    hint: "1866년 미국 상선 대동강 격퇴",
    quiz: "1866년 미국 상선이 대동강에서 통상을 요구하다 불태워진 ( )은 신미양요의 원인이 되었다.",
    category: "Ⅲ-01",
  },
  {
    id: 7,
    term: "신미양요",
    definition: "1871년 미국이 제너럴셔먼호 사건을 빌미로 강화도를 침략한 사건. 어재연 부대가 광성보에서 항전함",
    hint: "1871년 미국 침략",
    quiz: "1871년 미국이 강화도를 침략한 ( )에서 어재연 부대는 광성보에서 항전하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 8,
    term: "어재연",
    definition: "신미양요 때 광성보를 수비한 조선 장수. 중과부적으로 전사하였으나 항전의 상징으로 기억됨",
    hint: "신미양요 광성보 수비 장수",
    quiz: "신미양요 당시 광성보에서 미군에 맞서 항전하다 전사한 조선 장수는 ( )이다.",
    category: "Ⅲ-01",
  },
  {
    id: 9,
    term: "운요호 사건",
    definition: "1875년 일본 군함 운요호가 강화도에 불법 침입하여 조선 수비대를 공격한 사건. 강화도 조약의 빌미가 됨",
    hint: "1875년 일본 군함 강화도 침입",
    quiz: "1875년 일본 군함이 강화도에 불법 침입한 ( )을 빌미로 일본은 조선에 개항을 강요하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 10,
    term: "강화도 조약",
    definition: "1876년 조선이 일본과 체결한 최초의 근대적 조약. 조일수호조규라고도 하며, 치외법권·해안 측량권 등 불평등 조항을 담고 있음",
    hint: "1876년 조선-일본 최초 근대 조약 (조일수호조규)",
    quiz: "1876년 조선이 일본과 체결한 최초의 근대적 조약으로, 치외법권 등 불평등 조항을 담은 ( )이 체결되었다.",
    category: "Ⅲ-01",
  },
  {
    id: 11,
    term: "수신사",
    definition: "강화도 조약 체결 이후 일본에 파견한 외교 사절단. 일본의 근대화 실상을 시찰함",
    hint: "강화도 조약 후 일본 파견 사절단",
    quiz: "강화도 조약 이후 조선은 일본에 ( )를 파견하여 근대화 실상을 시찰하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 12,
    term: "조사시찰단",
    definition: "1881년 일본에 파견한 시찰단(신사유람단). 일본의 근대 제도·산업을 시찰하고 개화 정책에 활용함",
    hint: "1881년 일본 파견 시찰단 (신사유람단)",
    quiz: "1881년 조선 정부는 일본의 근대 제도를 시찰하기 위해 ( )(신사유람단)을 파견하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 13,
    term: "영선사",
    definition: "1881년 청에 파견한 사절단. 텐진 기기국에서 근대 무기 제조 기술을 습득하고 귀국 후 기기창 설립에 기여함",
    hint: "1881년 청 파견, 무기 기술 습득",
    quiz: "1881년 조선은 청에 ( )를 파견하여 근대 무기 제조 기술을 배우게 하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 14,
    term: "별기군",
    definition: "1881년 창설된 신식 군대. 일본인 교관에게 훈련을 받았으며, 구식 군대와의 차별 대우가 임오군란의 원인이 됨",
    hint: "1881년 신식 군대, 임오군란 원인",
    quiz: "1881년 창설된 ( )은 일본인 교관에게 훈련받은 신식 군대로, 구식 군인과의 차별이 임오군란을 유발하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 15,
    term: "임오군란",
    definition: "1882년 구식 군인들이 차별 대우와 급료 미지급에 반발하여 일으킨 반란. 흥선대원군이 재집권하였으나 청의 개입으로 진압됨",
    hint: "1882년 구식 군인 반란",
    quiz: "1882년 구식 군인들이 별기군과의 차별 대우에 반발하여 ( )을 일으켰다.",
    category: "Ⅲ-01",
  },
  {
    id: 16,
    term: "제물포 조약",
    definition: "임오군란 이후 1882년 조선이 일본과 체결한 조약. 일본 공사관 경비병 주둔 허용·배상금 지급 등의 내용을 담음",
    hint: "임오군란 후 조선-일본 조약 (1882)",
    quiz: "임오군란 이후 조선은 일본과 ( )를 체결하여 배상금 지급과 일본군 주둔을 허용하였다.",
    category: "Ⅲ-01",
  },
  {
    id: 17,
    term: "조청상민수륙무역장정",
    definition: "임오군란 이후 1882년 조선과 청이 체결한 협정. 청 상인의 내륙 통상권을 허용하고 청의 조선 내정 간섭을 강화함",
    hint: "임오군란 후 조선-청 협정 (1882)",
    quiz: "임오군란 후 체결된 ( )으로 청 상인은 내륙 통상권을 얻었고 청의 내정 간섭이 강화되었다.",
    category: "Ⅲ-01",
  },
  {
    id: 18,
    term: "온건개화파",
    definition: "동도서기론을 바탕으로 조선의 전통을 유지하면서 서양 기술만 도입하자는 점진적 개화를 추구한 세력. 김홍집·어윤중 등",
    hint: "동도서기론, 점진적 개화 (김홍집·어윤중)",
    quiz: "( )은 동도서기론을 내세우며 전통을 유지한 채 서양 기술만 받아들이자는 점진적 개화를 추진하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 19,
    term: "급진개화파",
    definition: "일본의 메이지 유신을 모델로 삼아 빠른 근대화와 청으로부터의 독립을 추구한 세력. 김옥균·박영효 등. 갑신정변 주도",
    hint: "문명개화론, 빠른 개화 (김옥균·박영효)",
    quiz: "( )는 일본 메이지 유신을 모델로 삼아 빠른 근대화를 추구하였으며, 갑신정변을 주도하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 20,
    term: "동도서기론",
    definition: "조선의 유교적 전통(동도)은 지키면서 서양의 과학기술(서기)만 받아들이자는 온건개화파의 논리",
    hint: "전통 유지 + 서양 기술 도입 (온건개화파)",
    quiz: "온건개화파는 전통적 가치를 지키면서 서양 기술만 도입하자는 ( )을 주장하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 21,
    term: "갑신정변",
    definition: "1884년 김옥균·박영효 등 급진개화파가 우정국 개국 축하연을 이용해 일으킨 정변. 14개조 개혁 정강을 발표하였으나 청군 개입으로 3일 만에 실패함",
    hint: "1884년 급진개화파 정변, 3일 천하",
    quiz: "1884년 김옥균 등 급진개화파가 일으킨 ( )은 청군의 개입으로 3일 만에 실패하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 22,
    term: "김옥균",
    definition: "갑신정변을 주도한 급진개화파의 핵심 인물. 정변 실패 후 일본으로 망명하였으며, 이후 상하이에서 자객에게 암살됨",
    hint: "갑신정변 주도자",
    quiz: "급진개화파의 핵심 인물로 갑신정변을 주도한 ( )은 정변 실패 후 일본으로 망명하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 23,
    term: "한성조약",
    definition: "갑신정변 이후 1884년 조선이 일본과 체결한 조약. 배상금 지급·공사관 신축 비용 부담 등의 내용을 담음",
    hint: "갑신정변 후 조선-일본 조약 (1884)",
    quiz: "갑신정변 이후 조선은 일본과 ( )를 체결하여 배상금을 지급하고 공사관 신축 비용을 부담하게 되었다.",
    category: "Ⅲ-02",
  },
  {
    id: 24,
    term: "텐진 조약",
    definition: "갑신정변 이후 1885년 청과 일본이 체결한 조약. 양국 군대의 조선 철수와 향후 파병 시 상호 통보 의무를 규정함",
    hint: "갑신정변 후 청-일본 조약, 파병 상호 통보 (1885)",
    quiz: "갑신정변 이후 청과 일본은 ( )를 체결하여 조선 파병 시 상호 통보하도록 합의하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 25,
    term: "거문도 사건",
    definition: "1885~1887년 러시아의 남하를 견제한다는 명목으로 영국이 거문도를 불법 점령한 사건",
    hint: "1885~1887년 영국의 거문도 점령",
    quiz: "1885년 영국은 러시아의 남하를 견제한다는 명목으로 ( )을 일으켜 거문도를 불법 점령하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 26,
    term: "14개조 개혁 정강",
    definition: "갑신정변 직후 급진개화파가 발표한 개혁안. 청으로부터의 독립, 문벌 폐지, 인민 평등권, 재정 일원화 등을 주요 내용으로 함",
    hint: "갑신정변 때 발표된 급진개화파 개혁안",
    quiz: "갑신정변 때 급진개화파는 ( )을 발표하여 청으로부터의 독립과 신분제 폐지 등을 주장하였다.",
    category: "Ⅲ-02",
  },
  {
    id: 27,
    term: "기기창",
    definition: "1883년 설립된 근대적 무기 제조 공장. 영선사 귀국 후 청의 기술 지원으로 설립됨",
    hint: "1883년 근대 무기 공장 (영선사 귀국 후)",
    quiz: "영선사가 청에서 습득한 무기 제조 기술을 바탕으로 1883년에 ( )이 설립되었다.",
    category: "Ⅲ-01",
  },
  {
    id: 28,
    term: "우정국",
    definition: "1884년 설립된 조선 최초의 근대적 우편 기관. 개국 축하연이 갑신정변의 거사 장소로 이용됨",
    hint: "1884년 근대 우편 기관, 갑신정변 거사 장소",
    quiz: "1884년 설립된 ( )의 개국 축하연은 갑신정변의 거사 장소로 이용되었다.",
    category: "Ⅲ-02",
  },
];

// ────────────────────────────────────────────────
// UTILS
// ────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalize(s) {
  return s.trim().replace(/\s+/g, " ");
}

// ────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────

function Badge({ label, color }) {
  const colors = {
    "Ⅲ-01": "#4E6E81",
    "Ⅲ-02": "#7C5C8A",
  };
  return (
    <span
      style={{
        background: colors[color] || "#555",
        color: "#fff",
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 20,
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      {label}
    </span>
  );
}

// ── FLASHCARD ──────────────────────────────────
function Flashcard({ term, onNext, onPrev, current, total }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => setFlipped(false), [term.id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* progress */}
      <div style={{ color: "#888", fontSize: 13 }}>{current} / {total}</div>

      {/* card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          width: "100%",
          maxWidth: 500,
          minHeight: 220,
          background: flipped ? "#1e2a3a" : "#111827",
          border: `2px solid ${flipped ? "#4E6E81" : "#2d3748"}`,
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "32px 28px",
          cursor: "pointer",
          transition: "all 0.25s ease",
          textAlign: "center",
          gap: 12,
          boxShadow: flipped ? "0 0 24px rgba(78,110,129,0.3)" : "none",
        }}
      >
        <Badge label={term.category} color={term.category} />
        {flipped ? (
          <>
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>정의</div>
            <div style={{ color: "#e2e8f0", fontSize: 17, lineHeight: 1.7 }}>{term.definition}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>힌트: {term.hint}</div>
          </>
        ) : (
          <>
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>용어</div>
            <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700 }}>{term.term}</div>
            <div style={{ color: "#475569", fontSize: 13, marginTop: 8 }}>탭하여 정의 보기</div>
          </>
        )}
      </div>

      {/* nav */}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button onClick={onPrev} style={navBtn}>◀ 이전</button>
        <button onClick={onNext} style={{ ...navBtn, background: "#4E6E81", color: "#fff" }}>다음 ▶</button>
      </div>
    </div>
  );
}

// ── QUIZ ──────────────────────────────────────
function Quiz({ terms }) {
  const [q, setQ] = useState(null);
  const [pool, setPool] = useState([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState(false);
  const [history, setHistory] = useState([]);

  const nextQuestion = useCallback((currentPool) => {
    const p = currentPool.length > 0 ? currentPool : shuffle(terms);
    setPool(p.slice(1));
    setQ(p[0]);
    setInput("");
    setResult(null);
    setShowHint(false);
  }, [terms]);

  useEffect(() => { nextQuestion([]); }, [terms]);

  const check = () => {
    if (!input.trim() || !q) return;
    const correct = normalize(input) === normalize(q.term);
    setResult(correct ? "correct" : "wrong");
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setHistory(h => [{ term: q.term, input, correct }, ...h.slice(0, 9)]);
  };

  if (!q) return null;

  const quizText = q.quiz.replace(`( )`, "___");
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* score bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: 13 }}>
          ✅ {score.correct} / {score.total} ({accuracy}%)
        </div>
        <Badge label={q.category} color={q.category} />
      </div>

      {/* question */}
      <div style={{
        background: "#111827",
        border: "1px solid #2d3748",
        borderRadius: 12,
        padding: "24px 20px",
        color: "#e2e8f0",
        fontSize: 16,
        lineHeight: 1.8,
      }}>
        {quizText}
      </div>

      {/* hint */}
      {showHint && (
        <div style={{ color: "#94a3b8", fontSize: 13, padding: "8px 12px", background: "#1e293b", borderRadius: 8 }}>
          💡 힌트: {q.hint}
        </div>
      )}

      {/* input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && result === null) check(); else if (e.key === "Enter" && result !== null) nextQuestion(pool); }}
          disabled={result !== null}
          placeholder="용어 입력 (맞춤법 주의)"
          style={{
            flex: 1,
            background: "#1e293b",
            border: `1.5px solid ${result === "correct" ? "#22c55e" : result === "wrong" ? "#ef4444" : "#374151"}`,
            borderRadius: 8,
            color: "#f1f5f9",
            padding: "10px 14px",
            fontSize: 15,
            outline: "none",
          }}
          autoFocus
        />
        {result === null ? (
          <button onClick={check} style={{ ...navBtn, background: "#4E6E81", color: "#fff", minWidth: 64 }}>확인</button>
        ) : (
          <button onClick={() => nextQuestion(pool)} style={{ ...navBtn, background: "#374151", color: "#fff", minWidth: 64 }}>다음</button>
        )}
      </div>

      {/* result feedback */}
      {result === "correct" && (
        <div style={{ color: "#22c55e", fontSize: 15, padding: "10px 14px", background: "#052e16", borderRadius: 8 }}>
          ✅ 정답! <strong>{q.term}</strong>
        </div>
      )}
      {result === "wrong" && (
        <div style={{ color: "#ef4444", fontSize: 15, padding: "10px 14px", background: "#1c0f0f", borderRadius: 8 }}>
          ❌ 오답. 정답: <strong style={{ color: "#fca5a5" }}>{q.term}</strong>
        </div>
      )}

      {/* hint button */}
      {result === null && !showHint && (
        <button onClick={() => setShowHint(true)} style={{ ...navBtn, fontSize: 12, color: "#64748b" }}>
          힌트 보기
        </button>
      )}

      {/* recent history */}
      {history.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ color: "#475569", fontSize: 11, marginBottom: 6 }}>최근 기록</div>
          {history.slice(0, 5).map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: h.correct ? "#4ade80" : "#f87171", padding: "3px 0" }}>
              <span>{h.correct ? "✅" : "❌"}</span>
              <span style={{ color: "#94a3b8" }}>{h.term}</span>
              {!h.correct && <span>← 입력: {h.input}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────
const navBtn = {
  background: "#1e293b",
  border: "1px solid #374151",
  borderRadius: 8,
  color: "#94a3b8",
  padding: "9px 18px",
  cursor: "pointer",
  fontSize: 13,
};

export default function App() {
  const [mode, setMode] = useState("home"); // home | flash | quiz
  const [filter, setFilter] = useState("all");
  const [flashIdx, setFlashIdx] = useState(0);
  const [shuffledTerms, setShuffledTerms] = useState([]);

  const filteredTerms = filter === "all" ? TERMS : TERMS.filter(t => t.category === filter);

  const startFlash = () => {
    setShuffledTerms(shuffle(filteredTerms));
    setFlashIdx(0);
    setMode("flash");
  };

  const startQuiz = () => {
    setMode("quiz");
  };

  const tabStyle = (active) => ({
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    background: active ? "#4E6E81" : "#1e293b",
    color: active ? "#fff" : "#64748b",
  });

  const modeBtn = (label, icon, onClick) => (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: "#111827",
        border: "1.5px solid #2d3748",
        borderRadius: 14,
        padding: "28px 16px",
        cursor: "pointer",
        color: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 32 }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 15 }}>{label}</span>
    </button>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1a",
      color: "#f1f5f9",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      padding: "0 0 40px",
    }}>
      {/* header */}
      <div style={{
        background: "#0f172a",
        borderBottom: "1px solid #1e293b",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>한국사1 수행평가</div>
          <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>Ⅲ-01~Ⅲ-02 · {TERMS.length}개 용어</div>
        </div>
        {mode !== "home" && (
          <button onClick={() => setMode("home")} style={{ ...navBtn, fontSize: 12 }}>← 홈</button>
        )}
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px" }}>

        {mode === "home" && (
          <>
            {/* filter tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["all", "Ⅲ-01", "Ⅲ-02"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={tabStyle(filter === f)}>
                  {f === "all" ? `전체 (${TERMS.length})` : `${f} (${TERMS.filter(t => t.category === f).length})`}
                </button>
              ))}
            </div>

            {/* mode select */}
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              {modeBtn("플래시카드", "🃏", startFlash)}
              {modeBtn("빈칸 퀴즈", "✏️", startQuiz)}
            </div>

            {/* term list */}
            <div style={{ color: "#475569", fontSize: 12, marginBottom: 10 }}>용어 목록 미리보기</div>
            {filteredTerms.map(t => (
              <div key={t.id} style={{
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 8,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}>
                <Badge label={t.category} color={t.category} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.term}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{t.hint}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {mode === "flash" && shuffledTerms.length > 0 && (
          <Flashcard
            term={shuffledTerms[flashIdx]}
            current={flashIdx + 1}
            total={shuffledTerms.length}
            onNext={() => {
              if (flashIdx < shuffledTerms.length - 1) setFlashIdx(i => i + 1);
              else { setShuffledTerms(shuffle(filteredTerms)); setFlashIdx(0); }
            }}
            onPrev={() => setFlashIdx(i => Math.max(0, i - 1))}
          />
        )}

        {mode === "quiz" && (
          <Quiz terms={filteredTerms} />
        )}
      </div>
    </div>
  );
}
