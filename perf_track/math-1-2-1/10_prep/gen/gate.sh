#!/bin/sh
# gate.sh — math-1-2-1 게이트 일괄 실행 (10_prep/gen 에서 실행)
set -e
cd "$(dirname "$0")"
echo "[1/6] verify"; node variants.mjs verify
echo "[2/6] docs · bank · print"; node variants.mjs docs && node variants.mjs bank && node variants.mjs print
echo "[3/6] build (core 인라인)"; node variants.mjs build
echo "[4/6] 인라인 스크립트 node --check"
python - <<'PY'
import io,re,subprocess,sys,tempfile,os
s=io.open('../app/perf_circle_path.html',encoding='utf-8').read()
ok=True
for i,sc in enumerate(re.findall(r'<script>(.*?)</script>',s,re.S)):
    p=os.path.join(tempfile.gettempdir(),'_gate_%d.js'%i); io.open(p,'w',encoding='utf-8').write(sc)
    r=subprocess.run(['node','--check',p],capture_output=True,text=True)
    print('  script',i,'ok' if r.returncode==0 else 'FAIL'); ok=ok and r.returncode==0
    if r.returncode: print(r.stderr[:500])
for f in ['../app/perf_circle_path.html','../../90_output/print_pack.html']:
    t=io.open(f,encoding='utf-8').read()
    assert 'name="viewport"' in t, f+' viewport 없음'
    assert '@media' in t and 'max-width:640px' in t or 'print_pack' in f, f+' 모바일 미디어쿼리 없음'
print('  viewport + media-query ok')
sys.exit(0 if ok else 1)
PY
echo "[5/6] cdp smoke"; node cdp_smoke.mjs "${TMP:-/tmp}/mat2perf_shots"
echo "[6/6] 완료 — se-agent-app-reviewer 검토 후 배포"
