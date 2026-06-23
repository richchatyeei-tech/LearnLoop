  // ===== 内容域常量（对齐 06-MVP 内容域定义） =====
  const KP_LIST=[
    {id:'KP-LF-01',short:'函数概念',name:'函数与一次函数的概念'},
    {id:'KP-LF-02',short:'图像与 k/b',name:'一次函数图像与 k、b 的几何意义'},
    {id:'KP-LF-03',short:'看图判断增减',name:'根据图像判断增减性'},
    {id:'KP-LF-04',short:'求解析式',name:'求一次函数解析式（待定系数法）'},
    {id:'KP-LF-05',short:'图像平移',name:'一次函数图像的平移'},
    {id:'KP-LF-06',short:'求交点',name:'求直线与坐标轴交点'},
    {id:'KP-LF-07',short:'围成面积',name:'直线与坐标轴围成图形面积'},
    {id:'KP-LF-08',short:'与方程结合',name:'一次函数与方程综合'},
    {id:'KP-LF-09',short:'与不等式结合',name:'一次函数与不等式综合'}
  ];
  const CAUSE_CATS={
    'CAT-CONCEPT':{name:'概念性',cls:'concept'},
    'CAT-READING':{name:'审题',cls:'reading'},
    'CAT-METHOD':{name:'方法与步骤',cls:'method'},
    'CAT-CALC':{name:'计算',cls:'calc'},
    'CAT-EXPRESS':{name:'书写与表达',cls:'express'}
  };
  function causeLine(cat,desc){
    const c=CAUSE_CATS[cat]||{name:cat,cls:''};
    return '<span class="cause-cat '+c.cls+'">'+c.name+'</span><span class="cause-desc">'+desc+'</span>';
  }
  function kpShort(id){ return (KP_LIST.find(k=>k.id===id)||{}).short||id; }
  function populateKpSelect(){
    const sel=document.getElementById('bankKp'); if(!sel) return;
    sel.innerHTML='<option value="">全部知识点</option>'+KP_LIST.map(k=>'<option value="'+k.short+'">'+k.short+'</option>').join('');
  }

  function setView(v){
    document.getElementById('teacher').classList.toggle('active', v==='teacher');
    document.getElementById('student').classList.toggle('active', v==='student');
    document.getElementById('btnTeacher').classList.toggle('active', v==='teacher');
    document.getElementById('btnStudent').classList.toggle('active', v==='student');
    document.getElementById('classpick').style.display = v==='teacher' ? 'flex' : 'none';
    window.scrollTo({top:0,behavior:'smooth'});
  }
  // 班级切换：默认「全部班」聚合,切班时工作台整体联动过滤
  function filterClass(btn, key, label){
    document.querySelectorAll('#classpick .cp').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    document.querySelectorAll('#homeLoopList .rrow').forEach(r=>{
      r.style.display = (key==='all' || r.dataset.class===key) ? 'flex' : 'none';
    });
    const sl=document.getElementById('scopeLabel'); if(sl) sl.textContent=label;
    toast(key==='all' ? '已切回全部班聚合视图' : ('工作台已聚焦「'+label+'」'));
  }
  // teacher nav
  const SUB_PAGES=['collect','grade','review','recap'];   // 含「列表→详情」两段式的页面（四个阶段统一）
  const BANK_VIEWS=['list','detail','add','variant','vreview'];
  function tnav(page){
    ['home','assign','bank','collect','grade','review','recap','trace','parent','classes'].forEach(p=>{
      document.getElementById('page-'+p).classList.toggle('active', p===page);
      document.getElementById('nav-'+p).classList.toggle('active', p===page);
    });
    resetAllSub();                          // 侧边栏/聚合入口进入,默认回到列表
    if(page==='trace') traceScope('all');   // 进入学情溯源,默认回到「全部班级」概览
    if(page==='bank') resetBankView();      // 进入题库,默认回到列表
    document.querySelector('.tmain').scrollTo({top:0});
    window.scrollTo({top:0,behavior:'smooth'});
  }
  // 学情溯源：全部班级(L1) ↔ 单个班级(L2) ↔ 学生个人(L3) 三层下钻
  function traceScope(scope){
    const isAll = scope==='all';
    document.getElementById('trace-all').style.display = isAll ? 'block' : 'none';
    document.getElementById('trace-class').style.display = isAll ? 'none' : 'block';
    const stu=document.getElementById('trace-student'); if(stu) stu.style.display='none';
    // 复位学生面包屑
    const sa=document.getElementById('scopeStuArrow'), sc=document.getElementById('scopeStu');
    if(sa) sa.style.display='none'; if(sc){ sc.style.display='none'; sc.classList.remove('on'); }
    ['all','c1','c2','c3'].forEach(s=>{
      const t=document.getElementById('scopeTab-'+s); if(t) t.classList.toggle('on', s===scope);
    });
    const title=document.getElementById('traceTitle');
    if(isAll){
      if(title) title.textContent='这学期,我带的班到底学得怎么样';
    } else {
      const map={c1:'初二(1)班',c2:'初二(2)班',c3:'初二(3)班'};
      const nm=map[scope]||'初二(3)班';
      if(title) title.textContent=nm+' · 一直在错什么、根因在哪、讲评有没有用';
      if(scope!=='c3') toast('演示数据聚焦初二(3)班,'+nm+'为占位');
      document.querySelector('.tmain').scrollTo({top:0});
    }
  }
  // 下钻到学生个人画像(L3)
  function openTraceStudent(name){
    document.getElementById('trace-all').style.display='none';
    document.getElementById('trace-class').style.display='none';
    document.getElementById('trace-student').style.display='block';
    // 面包屑：班级层退为路径,学生层高亮
    ['all','c1','c2','c3'].forEach(s=>{
      const t=document.getElementById('scopeTab-'+s); if(t) t.classList.remove('on');
    });
    const sa=document.getElementById('scopeStuArrow'), sc=document.getElementById('scopeStu');
    if(sa) sa.style.display='inline'; if(sc){ sc.style.display='inline-block'; sc.classList.add('on'); sc.textContent=name||'张磊'; }
    const title=document.getElementById('traceTitle');
    if(title) title.textContent=(name||'张磊')+' · 个人作业数据画像';
    document.querySelector('.tmain').scrollTo({top:0});
    window.scrollTo({top:0,behavior:'smooth'});
  }
  // 列表 ↔ 详情：作业管理 / 智能批改 / 备课讲评 / 学情回收 四阶段通用
  function openSub(page){
    document.getElementById(page+'-list').classList.remove('active');
    document.getElementById(page+'-detail').classList.add('active');
    document.querySelector('.tmain').scrollTo({top:0});
  }
  function backSub(page){
    document.getElementById(page+'-detail').classList.remove('active');
    document.getElementById(page+'-list').classList.add('active');
    document.querySelector('.tmain').scrollTo({top:0});
  }
  function resetAllSub(){
    SUB_PAGES.forEach(p=>{
      const l=document.getElementById(p+'-list'), d=document.getElementById(p+'-detail');
      if(l&&d){ l.classList.add('active'); d.classList.remove('active'); }
    });
  }
  // 工作台某条具体 Loop → 深链接到对应详情(先切页再开详情)
  function gotoDetail(page){ tnav(page); openSub(page); }
  // 兼容旧调用名
  function openHomework(){ openSub('collect'); }
  function backToList(){ backSub('collect'); }
  // 作业布置：三入口切换
  function impEntry(which){
    ['bank','split','manual'].forEach(w=>{
      document.getElementById('entry-'+w).classList.toggle('active', w===which);
      document.getElementById('iseg-'+w).classList.toggle('on', w===which);
    });
  }
  // 发布设置：可编辑控件
  function togglePchip(el){ el.classList.toggle('on'); }
  function pickSeg(el){ el.parentElement.querySelectorAll('.pseg').forEach(s=>s.classList.remove('on')); el.classList.add('on'); }
  // 班级与学生：切换班级名册
  function pickCls(el, name){
    document.querySelectorAll('#page-classes .cls-card').forEach(c=>c.classList.remove('on'));
    el.classList.add('on');
    document.getElementById('clsRosterName').textContent=name;
    if(name!=='初二(3)班') toast('演示聚焦初二(3)班名册,'+name+'为占位数据');
  }
  function confirmSplit(btn){
    const item=btn.closest('.split-item');
    const st=item.querySelector('.si-st'); st.textContent='已确认'; st.className='si-st ok';
    btn.closest('.gbtns').remove();
    toast('已确认 Q7 · 已并入当前试卷');
  }
  // 上游主线流转：布置 → 管理 → 批改 → 讲评
  function publishAssign(){
    toast('已发布给初二(3)班 40 名学生 · 进入作业管理');
    setTimeout(()=>tnav('collect'), 1100);
  }
  function startGrade(){
    toast('已收齐 38 份作答 · AI 批改归因完成,已进入「待确认」列表');
    setTimeout(()=>tnav('grade'), 1100);
  }
  function gradeToggle(btn){
    btn.parentElement.querySelectorAll('.gbtn').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
  }
  // 智能批改：学生下钻
  const drillData={
    xm:{n:'小明 · 第1题作答', a:'k &gt; 0, b &gt; 0（错）', c:causeLine('CAT-CONCEPT','会根据公式计算，但未理解图像趋势与 k 正负的对应关系，把增减性判断反了。已记入 TA 的个人订正任务。')+' · 知识点「'+kpShort('KP-LF-03')+'」'},
    zl:{n:'张磊 · 第1、3题作答', a:'第1题 k&gt;0,b&gt;0（错）· 第3题未先求交点（错）', c:causeLine('CAT-READING','第3题漏看「先求交点」的过程要求，直接代入端点算面积。')+' · 另有 '+causeLine('CAT-CONCEPT','第1题图像增减性理解有误')},
    ln:{n:'李娜 · 第3题作答', a:'直接代入端点算面积（错）', c:causeLine('CAT-METHOD','知道要算面积，但未先令 x=0、y=0 求交点，步骤顺序错误。')+' · 知识点「'+kpShort('KP-LF-07')+'」'},
    cj:{n:'陈静 · 第2题作答', a:'y = 2x + 1（符号错）', c:causeLine('CAT-CALC','待定系数法步骤正确，但在解方程组时 b 的符号写错。放进个人订正即可，不必集体讲。')+' · 知识点「'+kpShort('KP-LF-04')+'」'}
  };
  function drillStudent(id){
    const d=drillData[id]; if(!d) return;
    document.getElementById('drill-name').textContent=d.n.replace(/&gt;/g,'>');
    document.getElementById('drill-ans').innerHTML=d.a;
    document.getElementById('drill-cause').innerHTML=d.c;
    document.getElementById('drill').classList.add('active');
    document.getElementById('drill').scrollIntoView({behavior:'smooth', block:'center'});
  }
  function confirmGrade(){
    toast('已确认批改 · 错题数据就绪,进入备课讲评');
    setTimeout(()=>gotoDetail('review'), 1100);
  }
  // 备课讲评：按需生成讲评建议
  function genReview(){
    document.getElementById('reviewEmpty').style.display='none';
    document.getElementById('reviewList').style.display='block';
    toast('已生成讲评建议 · 可逐条编辑');
  }
  function confirmReview(){
    toast('已布置订正给 38 名学生 · 各自收到针对自己错题的任务');
    setTimeout(()=>gotoDetail('recap'), 1100);
  }

  // ===== 题库中心 mock 数据 =====
  let bankQuestions=[
    {id:'q001',stem:'看图判断 y=kx+b 中 k、b 的符号',type:'选择题',diff:3,subject:'数学',kp:['看图判断增减'],kpIds:['KP-LF-03'],ans:'B',src:'manual',used:18,variants:2,parent:null,date:'2026-05-12',exp:'根据图像经过的象限判断 k 正负与 b 正负。'},
    {id:'q002',stem:'已知两点求一次函数解析式',type:'解答题',diff:2,subject:'数学',kp:['求解析式'],kpIds:['KP-LF-04'],ans:'y=2x-1',src:'manual',used:15,variants:1,parent:null,date:'2026-05-10',exp:'设 y=kx+b，代入两点列方程组。'},
    {id:'q003',stem:'直线与坐标轴围成三角形的面积',type:'解答题',diff:3,subject:'数学',kp:['围成面积'],kpIds:['KP-LF-07'],ans:'面积 = 4',src:'split',used:12,variants:0,parent:null,date:'2026-05-08',exp:'先求与 x、y 轴交点，再算面积。'},
    {id:'q004',stem:'根据图像判断一次函数的增减性',type:'选择题',diff:2,subject:'数学',kp:['看图判断增减'],kpIds:['KP-LF-03'],ans:'A',src:'manual',used:11,variants:0,parent:null,date:'2026-05-07',exp:'图像从左到右上升 → k>0。'},
    {id:'q005',stem:'求直线 y=2x-4 与 x 轴的交点坐标',type:'解答题',diff:2,subject:'数学',kp:['求交点'],kpIds:['KP-LF-06'],ans:'(2, 0)',src:'manual',used:9,variants:0,parent:null,date:'2026-05-06',exp:'令 y=0 求 x。'},
    {id:'q006',stem:'一次函数图像的平移与解析式变化',type:'选择题',diff:2,subject:'数学',kp:['图像平移'],kpIds:['KP-LF-05'],ans:'C',src:'manual',used:8,variants:0,parent:null,date:'2026-05-05',exp:'上下平移只改变 b，不改变 k。'},
    {id:'q007',stem:'一次函数 y=2x-3 与方程 2x-3=0 的关系',type:'选择题',diff:2,subject:'数学',kp:['与方程结合'],kpIds:['KP-LF-08'],ans:'B',src:'manual',used:7,variants:0,parent:null,date:'2026-05-04',exp:'方程的解对应图像与 x 轴交点的横坐标。'},
    {id:'q008',stem:'综合：求解析式并计算围成面积',type:'解答题',diff:3,subject:'数学',kp:['围成面积','求解析式'],kpIds:['KP-LF-07','KP-LF-04'],ans:'面积 = 6',src:'manual',used:6,variants:0,parent:null,date:'2026-05-03',exp:'先求解析式，再求交点，最后算面积。'},
    {id:'q009',stem:'比较两条一次函数图象的增减性',type:'选择题',diff:2,subject:'数学',kp:['看图判断增减'],kpIds:['KP-LF-03'],ans:'A',src:'variant',used:6,variants:0,parent:'q001',date:'2026-05-14',exp:'k>0 递增，k<0 递减。'},
    {id:'q010',stem:'已知 k<0，判断 y=kx+3 的图像经过哪些象限',type:'选择题',diff:3,subject:'数学',kp:['看图判断增减','图像与 k/b'],kpIds:['KP-LF-03','KP-LF-02'],ans:'D',src:'variant',used:8,variants:0,parent:'q001',date:'2026-05-14',exp:'k 负 b 正，过一、二、四象限。'},
    {id:'q011',stem:'求直线 y=-x+2 与坐标轴围成的三角形面积',type:'解答题',diff:3,subject:'数学',kp:['围成面积'],kpIds:['KP-LF-07'],ans:'面积 = 2',src:'variant',used:5,variants:0,parent:'q003',date:'2026-05-15',exp:'x 截距 2，y 截距 2。'},
    {id:'q012',stem:'已知 y=kx+b 经过 (0,1) 和 (2,5)，求 k 与 b',type:'解答题',diff:2,subject:'数学',kp:['求解析式'],kpIds:['KP-LF-04'],ans:'k=2, b=1',src:'manual',used:10,variants:2,parent:null,date:'2026-05-01',exp:'代入 (0,1) 得 b=1，再求 k。'}
  ];
  let varSourceId='q001', generatedVariants=[], vreviewSelected=new Set();

  function resetBankView(){
    BANK_VIEWS.forEach(v=>{
      const el=document.getElementById('bank-'+v); if(el) el.classList.toggle('active', v==='list');
    });
    renderBankList();
  }
  function openBankView(view, id){
    BANK_VIEWS.forEach(v=>{
      const el=document.getElementById('bank-'+v); if(el) el.classList.remove('active');
    });
    const t=document.getElementById('bank-'+view); if(t) t.classList.add('active');
    if(view==='detail'&&id) renderBankDetail(id);
    if(view==='variant'){ renderVarPickList(); if(id) selectVarSource(id); }
    if(view==='list') renderBankList();
    document.querySelector('.tmain').scrollTo({top:0});
  }
  function openBankDetail(id){ openBankView('detail', id); }
  function openBankVariantFromDetail(){
    const id=document.getElementById('bank-detail').dataset.qid;
    openBankView('variant', id||'q001');
  }
  function stars(n){ return '★'.repeat(n)+'☆'.repeat(Math.max(0,4-n)); }
  function srcLabel(s){ return {manual:'手动录入',split:'上传拆题',variant:'AI 变式'}[s]||s; }
  function updateBankCounts(){
    const n=bankQuestions.length;
    const b=document.getElementById('bankCountBadge'); if(b) b.textContent=n+' 题';
    const a=document.getElementById('assignBankCount'); if(a) a.textContent=n;
    const p=document.getElementById('bankPagerInfo'); if(p) p.textContent='第 1 / 1 页 · 共 '+n+' 题';
  }
  function filterBankList(){ renderBankList(); }
  function renderBankList(){
    const q=(document.getElementById('bankSearch')?.value||'').trim().toLowerCase();
    const sub=document.getElementById('bankSubject')?.value||'';
    const kpF=document.getElementById('bankKp')?.value||'';
    const tbody=document.getElementById('bankTableBody');
    const empty=document.getElementById('bankEmpty');
    if(!tbody) return;
    const list=bankQuestions.filter(item=>{
      if(sub&&item.subject!==sub) return false;
      if(kpF&&!item.kp.some(k=>k.includes(kpF))) return false;
      if(q){ const hay=(item.stem+' '+item.kp.join(' ')).toLowerCase(); if(!hay.includes(q)) return false; }
      return true;
    });
    tbody.innerHTML=list.map(item=>`
      <tr onclick="openBankDetail('${item.id}')">
        <td><div class="qstem">${item.stem}</div></td>
        <td>${item.type}</td>
        <td><div class="kp-mini">${item.kp.map(k=>'<span class="ktag">'+k+'</span>').join('')}</div></td>
        <td><span class="stars">${stars(item.diff)}</span></td>
        <td><span class="src">${srcLabel(item.src)}</span></td>
        <td><span class="used">${item.used} 次</span></td>
        <td class="arr">查看 →</td>
      </tr>`).join('');
    if(empty) empty.style.display=list.length?'none':'block';
    tbody.style.display=list.length?'':'none';
    updateBankCounts();
  }
  function renderBankDetail(id){
    const q=bankQuestions.find(x=>x.id===id); if(!q) return;
    document.getElementById('bank-detail').dataset.qid=id;
    document.getElementById('bankDetailStem').textContent=q.stem;
    document.getElementById('bankDetailMeta').innerHTML=q.type+' · '+stars(q.diff)+' · '+srcLabel(q.src)+' · 入库 '+q.date;
    document.getElementById('bankDetailBody').textContent=q.stem+(q.exp?('\n\n解析:'+q.exp):'');
    document.getElementById('bankDetailAns').textContent=q.ans;
    document.getElementById('bankDetailTags').innerHTML=q.kp.map(k=>'<span class="ktag">'+k+'</span>').join('');
    document.getElementById('bankDetailUsed').innerHTML=q.used;
    document.getElementById('bankDetailVar').innerHTML=q.variants;
    const vars=bankQuestions.filter(x=>x.parent===id);
    const ve=document.getElementById('bankDetailVariants');
    ve.innerHTML=vars.length?vars.map(v=>'<div class="vreview-link">· '+v.stem+' <span class="hint">('+srcLabel(v.src)+')</span></div>').join(''):'<div class="hint">暂无衍生变式 · 可一键生成</div>';
  }
  function toggleKpChip(el){ el.classList.toggle('on'); }
  function saveNewQuestion(){
    const stem=(document.getElementById('addStem')?.textContent||'').trim();
    const ans=(document.getElementById('addAns')?.textContent||'').trim();
    if(!stem||!ans){ toast('请填写题干与标准答案'); return; }
    const kp=[...document.querySelectorAll('#addKpChips .fchip.on')].map(c=>c.textContent);
    if(!kp.length){ toast('请至少选择一个知识点'); return; }
    const diffMap={'★':1,'★★':2,'★★★':3,'★★★★':4};
    const diff=diffMap[document.getElementById('addDiff')?.value]||2;
    const id='q'+(100+bankQuestions.length+1);
    const kpIds=kp.map(s=>(KP_LIST.find(k=>k.short===s)||{}).id).filter(Boolean);
    bankQuestions.unshift({id,stem,type:document.getElementById('addType')?.value||'解答题',diff,subject:'数学',kp,kpIds,ans,src:'manual',used:0,variants:0,parent:null,date:'2026-06-23',exp:''});
    toast('已入库 1 道新题 · 可在作业布置中选用');
    openBankView('list');
  }
  function setVarTab(which){
    document.getElementById('vtab-pick').classList.toggle('on', which==='pick');
    document.getElementById('vtab-quick').classList.toggle('on', which==='quick');
    document.getElementById('varPanel-pick').style.display=which==='pick'?'block':'none';
    document.getElementById('varPanel-quick').style.display=which==='quick'?'block':'none';
  }
  function renderVarPickList(){
    const q=(document.getElementById('varSearch')?.value||'').trim().toLowerCase();
    const box=document.getElementById('varPickList'); if(!box) return;
    const list=bankQuestions.filter(x=>!x.parent&&(q?x.stem.toLowerCase().includes(q):true)).slice(0,8);
    box.innerHTML=list.length?list.map(item=>`
      <div class="var-pick ${item.id===varSourceId?'on':''}" onclick="selectVarSource('${item.id}')">
        <span class="vr"></span>
        <div><b>${item.stem}</b><p>${item.type} · ${stars(item.diff)} · ${item.kp.slice(0,2).join(' · ')}</p></div>
      </div>`).join(''):'<div class="bank-empty" style="padding:28px;"><b>未找到题目</b><p>换个关键字试试</p></div>';
    const src=bankQuestions.find(x=>x.id===varSourceId);
    const card=document.getElementById('varSourceCard');
    if(src&&card){
      card.style.display='block';
      document.getElementById('varSourceStem').textContent=src.stem;
      document.getElementById('varSourceTags').innerHTML=src.kp.map(k=>'<span class="ktag">'+k+'</span>').join('');
    }
  }
  function selectVarSource(id){
    varSourceId=id; renderVarPickList();
  }
  function toggleDim(cb){ cb.closest('.dim').classList.toggle('on', cb.checked); }
  function genVariants(){
    const src=bankQuestions.find(x=>x.id===varSourceId);
    if(!src){ toast('请先选择源题'); return; }
    const dims=[...document.querySelectorAll('.dim input:checked')].map((_,i)=>['等价变式','难度变式','拓展变式'][i]).filter(Boolean);
    if(!dims.length){ toast('请至少选择一个变式维度'); return; }
    const n=Math.min(8, Math.max(1, +(document.getElementById('varCount')?.value||3)));
    const pool=[
      {type:'等价变式',stem:'图像经过第二、三、四象限，判断 y=kx+b 中 k、b 的符号',ans:'k<0, b<0',kp:['看图判断增减'],kpIds:['KP-LF-03']},
      {type:'等价变式',stem:'直线 y=-x+2 与坐标轴围成三角形的面积是多少',ans:'面积 = 2',kp:['围成面积'],kpIds:['KP-LF-07']},
      {type:'难度变式',stem:'已知 y=kx+b 经过 (1,4) 和 (3,10)，求解析式',ans:'y=3x+1',kp:['求解析式'],kpIds:['KP-LF-04']},
      {type:'拓展变式',stem:'直线 y=2x-4 与 x 轴、y 轴围成三角形面积为 6，验证是否成立',ans:'成立',kp:['围成面积'],kpIds:['KP-LF-07']},
      {type:'等价变式',stem:'根据图像判断 y=kx+b 中 k 的正负（图像从左到右下降）',ans:'k<0',kp:['看图判断增减'],kpIds:['KP-LF-03']},
      {type:'难度变式',stem:'将 y=2x+1 的图像向下平移 3 个单位，求新解析式',ans:'y=2x-2',kp:['图像平移'],kpIds:['KP-LF-05']}
    ];
    generatedVariants=pool.slice(0,n).map((v,i)=>({id:'gv'+i,...v,sel:true}));
    vreviewSelected=new Set(generatedVariants.map((_,i)=>i));
    document.getElementById('vreviewSource').textContent=src.stem;
    renderVreview();
    openBankView('vreview');
    toast('已生成 '+n+' 道变式 · 请审阅后入库');
  }
  function renderVreview(){
    const box=document.getElementById('vreviewList'); if(!box) return;
    box.innerHTML=generatedVariants.map((v,i)=>`
      <div class="vreview-card ${vreviewSelected.has(i)?'sel':''}" onclick="toggleVreview(${i})">
        <span class="vck">${vreviewSelected.has(i)?'✓':''}</span>
        <div class="vbody">
          <div class="vtype">${v.type}</div>
          <div class="vstem">${v.stem}</div>
          <div class="vans">标准答案 <b>${v.ans}</b></div>
          <div class="bank-tags">${v.kp.map(k=>'<span class="ktag">'+k+'</span>').join('')}</div>
        </div>
      </div>`).join('');
    document.getElementById('vreviewSel').textContent=vreviewSelected.size;
  }
  function toggleVreview(i){
    if(vreviewSelected.has(i)) vreviewSelected.delete(i); else vreviewSelected.add(i);
    renderVreview();
  }
  function saveVariants(){
    if(!vreviewSelected.size){ toast('请至少勾选 1 道变式'); return; }
    const src=bankQuestions.find(x=>x.id===varSourceId);
    let added=0;
    vreviewSelected.forEach(i=>{
      const v=generatedVariants[i]; if(!v) return;
      const id='q'+(100+bankQuestions.length+added+1);
      bankQuestions.unshift({id,stem:v.stem,type:'解答题',diff:src?.diff||2,subject:'数学',kp:v.kp,kpIds:v.kpIds||[],ans:v.ans,src:'variant',used:0,variants:0,parent:varSourceId,date:'2026-06-23',exp:''});
      added++;
    });
    if(src) src.variants=(src.variants||0)+added;
    toast('已入库 '+added+' 道变式 · 题库共 '+bankQuestions.length+' 题');
    openBankView('list');
  }
  (function initBank(){ populateKpSelect(); renderBankList(); })();

  let tmr;
  function toast(msg){
    const t=document.getElementById('toast'); document.getElementById('toastMsg').textContent=msg;
    t.classList.add('show'); clearTimeout(tmr); tmr=setTimeout(()=>t.classList.remove('show'),2600);
  }
  (function(){
    const m=document.getElementById('matrix'); if(!m) return;
    const cells=[...Array(30).fill('g'),...Array(6).fill('a'),...Array(2).fill('r')];
    for(let i=cells.length;i<40;i++) cells.push('e');
    cells.forEach(c=>{ const d=document.createElement('div');
      if(c==='e'){ d.className='cell'; d.style.background='var(--card-2)'; d.style.border='1px solid var(--line)'; }
      else d.className='cell '+c; m.appendChild(d);
    });
  })();
  // 提交网格：初二(2)班 39 人(38 已交 / 1 未交)
  (function(){
    const g=document.getElementById('subgrid'); if(!g) return;
    for(let i=1;i<=39;i++){ const d=document.createElement('div');
      const submitted = i<=38;
      d.className='scell '+(submitted?'in':'out');
      d.textContent = submitted ? '✓' : '·';
      d.title = (submitted?'已提交':'未提交')+' · 学号 '+i;
      g.appendChild(d);
    }
  })();

  // student
  function padTab(t){
    document.getElementById('ps-do').classList.toggle('active', t==='do');
    document.getElementById('ps-task').classList.toggle('active', t==='task');
    document.getElementById('ps-book').classList.toggle('active', t==='book');
    document.getElementById('ps-quest').classList.remove('active');
    document.getElementById('tab-do').classList.toggle('active', t==='do');
    document.getElementById('tab-task').classList.toggle('active', t==='task');
    document.getElementById('tab-book').classList.toggle('active', t==='book');
  }
  function submitHomework(){
    toast('作业已交给老师 · 等老师讲评后,这里会出现要弄懂的题');
    setTimeout(()=>padTab('task'), 1200);
  }
  function startQuest(){
    document.getElementById('ps-task').classList.remove('active');
    document.getElementById('ps-book').classList.remove('active');
    document.getElementById('ps-quest').classList.add('active');
    step=0; answered=false; renderStep();
  }
  let step=0, answered=false;
  const labels=['我懂了,去改一遍 →','改完了,换道题试试 →','提交,看我学会没 →','太棒了,返回任务 →'];
  const ringLabs=['弄懂中 0/3','弄懂中 0/3','弄懂中 0/3','已学会 1/3'];
  const offs=[113,113,113,75];
  function renderStep(){
    document.querySelectorAll('#ps-quest .pstep').forEach(p=>p.classList.toggle('active', +p.dataset.s===step));
    document.querySelectorAll('#padSteps .st').forEach(s=>{ const i=+s.dataset.s; s.classList.toggle('curr',i===step); s.classList.toggle('done',i<step); });
    document.getElementById('ringLab').innerHTML='今天的题<b>'+(step===3?'1':'0')+'/3</b>';
    document.getElementById('ringArc').setAttribute('stroke-dashoffset',offs[step]);
    const next=document.getElementById('padNext'); next.textContent=labels[step]; next.classList.toggle('go', step===3);
    if(step===2 && !answered){ next.style.opacity=.45; next.style.pointerEvents='none'; }
    else { next.style.opacity=1; next.style.pointerEvents='auto'; }
  }
  function padNext(){ if(step<3){step++; renderStep();} else { padTab('task'); setView('teacher'); gotoDetail('recap'); toast('小明学会了!结果已回流到"学情回收"'); } }
  function padPrev(){ if(step>0){step--; renderStep();} else { padTab('task'); } }
  function pick(el,correct){
    document.querySelectorAll('#opts .opt').forEach(o=>o.classList.remove('right','wrong'));
    el.classList.add(correct?'right':'wrong'); answered=true; renderStep();
    if(correct) toast('答对了!换道图你也会 → 这题判定为"学会了"');
  }
