// cdp_smoke.mjs — 헤드리스 Chrome을 CDP로 조작해 앱의 상호작용을 스모크 테스트한다 (게이트 보조)
//   node cdp_smoke.mjs [스크린샷 출력 폴더]
// 검사: 탭 전환 · 펼치기 단계 4 · 함정 토글 · 드릴 생성→정답 입력→채점 전부 ✓ · 오답→복습함 · 빈칸 퀴즈 · 프린트 탭 렌더링 · 콘솔 에러 0
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const APP = 'file:///' + path.resolve(here, '..', 'app', 'perf_circle_path.html').replace(/\\/g, '/');
const OUT = process.argv[2] || path.join(here, '_shots');
fs.mkdirSync(OUT, { recursive: true });
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--remote-debugging-port=' + PORT, '--window-size=520,1400', '--user-data-dir=' + path.join(OUT, '_prof'), 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pending = new Map(); const errors = [];
async function connect() {
  for (let i = 0; i < 40; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) break; } catch (e) { } await sleep(250); }
  const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${APP}`, { method: 'PUT' })).json();
  ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.text + ' ' + (d.params.exceptionDetails.exception?.description || '')); if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map(a => a.value).join(' ')); };
  await send('Runtime.enable'); await send('Page.enable');
}
function send(method, params = {}) { return new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); }); }
async function ev(expr) { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return r.result.result.value; }
async function shot(name) { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.result.data, 'base64')); }
const results = [];
function check(name, ok, info) { results.push([ok ? '✓' : '✗', name, info || '']); }

try {
  await connect(); await sleep(1200);
  check('로드', await ev('typeof VG === "object" && !!document.querySelector("#tan-svg circle")'));
  // 펼치기: 단계 4 + 함정
  await ev('document.querySelector(\'[data-t="unf"]\').click()'); await sleep(200);
  await ev('document.querySelector(\'[data-step="4"]\').click()'); await sleep(900);
  const r4 = await ev('document.querySelector("#unf-read").textContent');
  check('펼치기 단계4 판독', /13 − 2 − 2 = 9/.test(r4), r4.split('\n').pop());
  await shot('unf_step4');
  await ev('document.querySelector("#unf-wrong").click()'); await sleep(200);
  const rw = await ev('document.querySelector("#unf-read").textContent');
  check('함정 토글 문구', /반대로 대칭/.test(rw) && /같지 않다/.test(rw));
  await shot('unf_wrong');
  await ev('document.querySelector(\'[data-unf="v10"]\').click()'); await sleep(200);
  await ev('document.querySelector(\'[data-step="4"]\').click()'); await sleep(900);
  check('V10 고정점 단계4', /5 − 0 − 1 = 4/.test(await ev('document.querySelector("#unf-read").textContent')));
  // 접선 실험: 프리셋 V2
  await ev('document.querySelector(\'[data-t="tan"]\').click(); document.querySelector(\'[data-tan="v2"]\').click()'); await sleep(200);
  const rt = await ev('document.querySelector("#tan-read").textContent');
  check('접선 V2 판독', /m = ±ℓ\/r = ±4\/3/.test(rt), rt.split('\n')[2]);
  await shot('tan_v2');
  // 답안 틀 빈칸 퀴즈
  await ev('document.querySelector(\'[data-t="tpl"]\').click()'); await sleep(200);
  await ev(`(function(){var v=['3/4','-3/4','13/4','1/5','17/5','4','40','8','-2','-4','3','13','9'];document.querySelectorAll('#blank input').forEach(function(i,k){i.value=v[k];});document.querySelector('#blank-check').click();})()`);
  check('빈칸 퀴즈 13/13', (await ev('document.querySelector("#blank-res").textContent')) === '13 / 13');
  await shot('tpl');
  // 드릴: 1번형 정답 채점
  await ev('document.querySelector(\'[data-t="drill"]\').click(); document.querySelector(\'[data-new="1"]\').click()'); await sleep(200);
  await ev(`(function(){var m=document.querySelector('#drill-prob').textContent; window.__p=m;})()`);
  // 정답을 앱 내부 상태에서 읽어 입력 (drill 객체는 클로저라 DOM에서 역산: 풀이 전부 보기 → brief 없음). 대신 VG로 같은 문제를 재계산할 수 없으니, 예시문항으로 교체해 검사.
  await ev('document.querySelector("#drill-sample").click()'); await sleep(200);
  const isT1 = await ev('!!document.querySelector(\'#drill-in input[data-k="m1"]\')');
  if (isT1) await ev(`(function(){var v={m1:'3/4',m2:'-3/4',px:'1/5',py:'17/5',l:'4',real:'40'};document.querySelectorAll('#drill-in input').forEach(function(i){i.value=v[i.dataset.k];});})()`);
  else await ev(`(function(){var v={c1x:'8',c1y:'-2',c2x:'-4',c2y:'3',D:'13',ans:'9'};document.querySelectorAll('#drill-in input').forEach(function(i){i.value=v[i.dataset.k];});})()`);
  await ev('document.querySelector("#drill-check").click()'); await sleep(100);
  check('예시문항 드릴 전부 정답', /전부 정답/.test(await ev('document.querySelector("#drill-res").textContent')), isT1 ? 'T1' : 'T2');
  // 오답 → 복습함
  await ev('document.querySelector(\'[data-new="2"]\').click()'); await sleep(200);
  await ev(`document.querySelectorAll('#drill-in input').forEach(function(i){i.value='0';}); document.querySelector('#drill-check').click()`); await sleep(100);
  check('오답 → 복습함 1건', /\(1\)/.test(await ev('document.querySelector("#rev-n").textContent')));
  await ev('document.querySelector("#drill-sol").click(); document.querySelector("#drill-all").click()'); await sleep(100);
  check('풀이 전부 보기', (await ev('document.querySelectorAll("#drill-steps .pp-step").length')) >= 6);
  await shot('drill');
  // 무작위 드릴 50회 생성 (예외 없어야 함)
  const gen = await ev(`(function(){var n=0;for(var i=0;i<50;i++){document.querySelector('[data-new="'+(i%2+1)+'"]').click();n++;}return n;})()`);
  check('무작위 드릴 50회 생성', gen === 50);
  // 프린트 탭
  await ev('document.querySelector(\'[data-t="print"]\').click()'); await sleep(400);
  const ppN = await ev('document.querySelectorAll("#pp-wrap .pp-page").length');
  check('프린트 팩 렌더링(페이지 수)', ppN >= 10, String(ppN));
  await shot('print');
  // 전날 점검·시작
  await ev('document.querySelector(\'[data-t="chk"]\').click()'); await sleep(100); await shot('chk');
  await ev('document.querySelector(\'[data-t="start"]\').click()'); await sleep(100); await shot('start');
  check('콘솔 에러 0', errors.length === 0, errors.slice(0, 3).join(' | '));
} catch (e) { check('예외', false, String(e).slice(0, 300)); }
for (const r of results) console.log(r.join('  '));
const bad = results.filter(r => r[0] === '✗').length;
console.log(bad ? `실패 ${bad}건` : '스모크 전부 통과');
try { ws && ws.close(); } catch (e) { }
chrome.kill();
process.exit(bad ? 1 : 0);
