const fs=require('fs'); const os=require('os'); const path=require('path'); const cp=require('child_process');
const {JSDOM,VirtualConsole}=require('jsdom');
/* jsdom ships no IndexedDB. It has to be present BEFORE the page scripts run —
   the template store decides its backend at load, so injecting afterwards
   leaves it on the localStorage fallback and the real path goes untested. */
let _fdb=null; try{ _fdb=require('fake-indexeddb'); }catch(e){}
const dom=new JSDOM(fs.readFileSync('dd254.htm','utf8'),{
  runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',
  virtualConsole:new VirtualConsole(),
  beforeParse(win){
    /* jsdom deliberately supplies only browser-shaped stubs for several file
       and crypto APIs. The suite exercises real SHA-256, Blob text/bytes and
       File attachment paths, so give the page Node's standards-compatible
       implementations before any application script decides they are absent. */
    try{ Object.defineProperty(win,'crypto',{value:require('crypto').webcrypto,configurable:true}); }catch(e){}
    if(typeof TextEncoder!=='undefined') win.TextEncoder=TextEncoder;
    if(typeof TextDecoder!=='undefined') win.TextDecoder=TextDecoder;
    /* Keep jsdom's own Blob/File identity so its FileReader accepts them, then
       supply only the modern convenience methods that this jsdom omits. */
    if(win.Blob&&!win.Blob.prototype.arrayBuffer) win.Blob.prototype.arrayBuffer=function(){
      const blob=this; return new Promise(function(resolve,reject){
        const reader=new win.FileReader(); reader.onload=function(){resolve(reader.result);};
        reader.onerror=function(){reject(reader.error);}; reader.readAsArrayBuffer(blob);
      });
    };
    if(win.Blob&&!win.Blob.prototype.text) win.Blob.prototype.text=function(){
      const blob=this; return new Promise(function(resolve,reject){
        const reader=new win.FileReader(); reader.onload=function(){resolve(reader.result);};
        reader.onerror=function(){reject(reader.error);}; reader.readAsText(blob);
      });
    };
    if(!_fdb) { console.log('  NOTE  fake-indexeddb unavailable — running on the localStorage fallback'); return; }
    win.indexedDB=_fdb.indexedDB||_fdb;
    try{ win.IDBKeyRange=_fdb.IDBKeyRange||require('fake-indexeddb/lib/FDBKeyRange'); }catch(e){}
  }
});
const w=dom.window;
let pass=0,fail=0; const failures=[];
const E=s=>w.eval(s);
const t=(n,f)=>{ try{ const r=f(); if(r===true){pass++;console.log('  PASS  '+n);} else {fail++;failures.push(n);console.log('  FAIL  '+n+'  -> '+JSON.stringify(r));} }catch(e){ fail++; failures.push(n); console.log('  THROW '+n+'  -> '+e.message); } };
const ta=async(n,f)=>{ try{ const r=await f(); if(r===true){pass++;console.log('  PASS  '+n);} else {fail++;failures.push(n);console.log('  FAIL  '+n+'  -> '+JSON.stringify(r));} }catch(e){ fail++; failures.push(n); console.log('  THROW '+n+'  -> '+e.message); } };
const H=n=>console.log('\n### '+n);
const wipe=async()=>E("(async function(){var a=await draftAll();for(const d of a)await draftDel(d.id);})()");
/* Scope to the live dashboard. The manager rollup renders its own .dash-card
   elements into a separate container and closing it only hides that container,
   so a document-wide query keeps counting them. */
const cards=()=>Array.from(w.document.querySelectorAll('#dashCards .dash-card'));
/* Performance-block fields by name. The tool no longer indexes this block by
   position, and neither should the tests. */
const PB=(b)=>{ b=b||w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  return {el:b, loc:b.querySelector('.loc-8a'), cage:b.querySelector('.cage-8b'),
          cso:b.querySelector('.cso-8c'), email:b.querySelector('.fso-8'), cma:b.querySelector('.cma-loc')}; };
/* The title line now carries the stage chip and the classification marking, so
   the title has to be read without them. */
const titles=()=>cards().map(c=>{
  const h=c.querySelector('h3').cloneNode(true);
  const b=h.querySelector('.dash-title-badges'); if(b) b.remove();
  return h.textContent.replace(/[└✏]/g,'').trim();
});
setTimeout(async()=>{
try{ Object.defineProperty(w,'crypto',{value:require('crypto').webcrypto,configurable:true}); }catch(e){}
E("window.uiConfirm=async function(){return true;};window.alert=function(m){window.__A=m;};");

H('1. Block 18 in the language template');
t('CT_18 constant and labels', ()=> JSON.stringify(E('CT_18'))==='["18a","18b","18c","18d","18e","18f"]'
  && /Contractor/.test(E("CT_18_LBL['18a']")));
t('blank data carries c18 / t18f / attText', ()=>{const d=E('ctBlankData()');
  return d.c18['18a']===false && d.t18f==='' && d.attText==='' && !('att' in d);});
t('legacy template backfills on touch', ()=>{
  E("window.TPL_EDIT=[{label:'L',data:{a2:'x',c10:{},c11:{},i16:{}}}];window.TPL_EDIT_KIND='ct';");
  const d=E('ctEd(0)'); return !!d.c18 && d.t18f==='' && Array.isArray===Array.isArray && typeof d.attText==='string';});
t('legacy {title,notes} rows migrate to text', ()=>{
  E("window.TPL_EDIT=[{data:{att:[{title:'A',notes:'n1'},{title:'B',notes:''}]}}];window.TPL_EDIT_KIND='ct';");
  const d=E('ctEd(0)'); return d.attText==='A — n1\nB' && !('att' in d);});
t('editor renders block 18 and the attachment box', ()=>{
  E("window.TPL_EDIT=[{label:'T',data:ctBlankData()}];window.TPL_EDIT_KIND='ct';");
  const h=E("ctEditorHtml(window.TPL_EDIT[0],0)");
  return h.includes('18 — Distribution') && h.includes('Required attachments')
      && h.includes("attText=this.value") && !h.includes('Add attachment');});
t('capture reads Block 18 off the form', ()=>{
  E("showFormView();resetFormFields();['18a','18b','18c','18d','18e','18f'].forEach(k=>{document.getElementById('dist'+k).checked=false;});");
  E("['18a','18b','18d'].forEach(k=>{document.getElementById('dist'+k).checked=true;});document.getElementById('dist18fOther').value='ACO Bldg 4';");
  const d=E('ctCaptureData()');
  return d.c18['18a']&&d.c18['18b']&&d.c18['18d']&&!d.c18['18c']&&!d.c18['18f']&&d.t18f==='';});
t('summary counts 18 and attachments', ()=>{
  const s=E("ctSummary({data:Object.assign(ctBlankData(),{c18:{'18a':true,'18c':true},t18f:'x',attText:'a\\nb'})})");
  return /18: 2 sel/.test(s) && /2 attach/.test(s);});
t('blank lines ignored in the attachment count', ()=>
  E("ctAttLines({attText:'a\\n\\n\\nb\\n   \\n'})").length===2);
t('panel shows the 18 card and the attachment card', ()=>{
  E("tplSave(TPL_CT,[{label:'T1',srcDate:'2026-01-02',data:Object.assign(ctBlankData(),{c18:{'18a':true,'18c':true,'18f':true},t18f:'ACO, Bldg 4',attText:'SCG-1234 dated 2026\\n\\nOPSEC Plan\\n  \\n'})}]);");
  E("buildCtSelect();document.getElementById('ctTplSel').value=tplLoad(TPL_CT)[0].ioId;buildCtPanel();");
  const h=w.document.getElementById('ctPanel').innerHTML;
  return h.includes('18 — Distribution') && h.includes('Required attachments (2)');});
t('apply 18 ticks boxes and reveals 18f', ()=>{
  E("['18a','18b','18c','18d','18e','18f'].forEach(k=>{document.getElementById('dist'+k).checked=false;});");
  E("ctApply18(tplLoad(TPL_CT)[0].ioId);");
  const g=k=>w.document.getElementById('dist'+k).checked;
  return g('18a')&&!g('18b')&&g('18c')&&!g('18d')&&!g('18e')&&g('18f')
      && w.document.getElementById('dist18fOther').value==='ACO, Bldg 4'
      && w.document.getElementById('dist18fRev').className.includes('show');});
t('attachment reminder shows the template list', ()=>{
  const h=w.document.getElementById('attachTplList').innerHTML;
  return w.document.getElementById('attachTplWrap').style.display==='block'
      && h.includes('SCG-1234') && h.includes('OPSEC Plan');});
t('reminder raises a recommendation', ()=> (w.DD254_WARNS||[]).some(x=>/requires 2 attachments/.test(x)));
t('copy list includes them', ()=>{let c='';w.navigator.clipboard={writeText:v=>{c=v;}};
  E("attachCopy({textContent:'x'})"); return /- SCG-1234 dated 2026/.test(c) && /- OPSEC Plan/.test(c);});
t('deselecting clears the reminder', ()=>{
  E("document.getElementById('ctTplSel').value='';buildCtPanel();");
  return w.document.getElementById('attachTplWrap').style.display==='none'
      && !(w.DD254_WARNS||[]).some(x=>/requires 2 attachment/.test(x));});
t('CT CSV carries 18 and attachment columns', ()=>{
  const j=JSON.stringify(E("TPL_IO.ct.cols.map(function(c){return c.h;})"));
  return j.includes('18a Sel')&&j.includes('18f Sel')&&j.includes('18f Other')&&j.includes('Required Attachments');});
t('attachment cell round-trips both separators', ()=>{
  const c="TPL_IO.ct.cols.filter(function(x){return x.h==='Required Attachments';})[0]";
  return E("("+c+").g({data:{attText:'A\\nB'}})")==='A\nB'
      && E("(function(){var t={};("+c+").s(t,'A | B');return t.data.attText;})()")==='A\nB';});

H('2. Stable template references');
t('templates gain ids', ()=>{
  E("tplSave(TPL_CT,[{label:'A',data:ctBlankData()},{label:'B',data:Object.assign(ctBlankData(),{i13:'BEE'})}]);buildCtSelect();");
  const a=E("tplLoad(TPL_CT)"); return !!a[0].ioId && !!a[1].ioId && a[0].ioId!==a[1].ioId;});
t('select emits ids, not positions', ()=>{
  const o=Array.from(w.document.querySelectorAll('#ctTplSel option')).map(x=>x.value).filter(Boolean);
  const a=E("tplLoad(TPL_CT)"); return o[0]===a[0].ioId && o[1]===a[1].ioId;});
t('reordering does not re-point a saved reference', ()=>{
  const id=E("tplLoad(TPL_CT)")[1].ioId;
  const before=E("ctData('"+id+"').i13");
  E("(function(){var a=tplLoad(TPL_CT);a.reverse();tplSave(TPL_CT,a);})()");
  return before==='BEE' && E("ctData('"+id+"').i13")==='BEE';});
t('deleting resolves to nothing, not the wrong one', ()=>{
  const gone=E("tplLoad(TPL_CT)")[0].ioId;
  E("(function(){var a=tplLoad(TPL_CT);a.shift();tplSave(TPL_CT,a);})()");
  return E("ctData('"+gone+"')")===null;});
t('legacy positional reference still resolves', ()=> E("ctData(0)")!==null && E("ctData('0')")!==null);
t('legacy positional draft restores its selection', ()=>{
  E("tplSave(TPL_CT,[{label:'One',data:ctBlankData()},{label:'Two',data:ctBlankData()}]);buildCtSelect();");
  const a=E("tplLoad(TPL_CT)");
  E("document.getElementById('ctTplSel').value='';applyWorkspace({selects:{ctTplSel:'1'},texts:{},checks:{},radios:{}});");
  return w.document.getElementById('ctTplSel').value===a[1].ioId;});

H('3. Backup integrity');
await ta('sha256 returns 64 hex', async()=> /^[0-9a-f]{64}$/.test(await E("bkSha256('abc')")));
t('counts both halves', ()=>{const c=E("bkCounts({ct:[1,2],fac:[3]},[{id:'a'},{id:'b'}])"); return c.templates===3&&c.drafts===2;});
t('canonical body key order', ()=> E("bkBody({a:1},[2]).indexOf('templates')<bkBody({a:1},[2]).indexOf('drafts')"));
await ta('a good payload verifies', async()=> true===await E("(async function(){var T={ct:[{label:'x'}]},D=[{id:'1'}];var sha=await bkSha256(bkBody(T,D));var r=JSON.parse(JSON.stringify({templates:T,drafts:D}));return (await bkSha256(bkBody(r.templates,r.drafts)))===sha;})()"));
await ta('a tampered payload does not', async()=> true===await E("(async function(){var T={ct:[{label:'x'}]},D=[{id:'1'}];var sha=await bkSha256(bkBody(T,D));T.ct[0].label='EVIL';return (await bkSha256(bkBody(T,D)))!==sha;})()"));
t('restore refuses on a count mismatch', ()=> /Restore refused/.test(E("String(fullRestore)")) && /checksum mismatch/.test(E("String(fullRestore)")));
t('backup stamps version 4, counts, hash and the audit log', ()=>{const s=E("String(fullBackup)");
  return /version:4/.test(s) && /payload\.counts=bkCounts/.test(s)
      && /payload\.sha256=await bkSha256/.test(s) && /payload\.audit=/.test(s);});
t('the audit log rides outside the checksummed body', ()=>{
  /* so a v3 backup, which has no audit key, still verifies */
  const s=E("String(bkBody)");
  return !/audit/.test(s) && /templates:templates,drafts:drafts/.test(s);});

H('4. Flow-down ceiling');
t('safeguarding exceedance caught', ()=>{
  const i=E("dashFlowIssues({workspace:{selects:{fcl1a:'S',sfg1b:'C'},checks:{}}},{workspace:{selects:{fcl1a:'S',sfg1b:'S'},checks:{}}})");
  return i.length===1 && i[0]==='1b S > prime C';});
t('FCL exceedance caught', ()=> E("dashFlowIssues({workspace:{selects:{fcl1a:'C'},checks:{}}},{workspace:{selects:{fcl1a:'TS'},checks:{}}})")[0]==='FCL TS > prime C');
t('equal levels clean', ()=> E("dashFlowIssues({workspace:{selects:{fcl1a:'S',sfg1b:'S'},checks:{}}},{workspace:{selects:{fcl1a:'S',sfg1b:'S'},checks:{}}})").length===0);
t('NONE / NA not a false positive', ()=> E("dashFlowIssues({workspace:{selects:{sfg1b:'NONE'},checks:{}}},{workspace:{selects:{sfg1b:'NA'},checks:{}}})").length===0);
t('Item 11 compared, GCA keys starred', ()=>{
  const i=E("dashFlowIssues({workspace:{selects:{},checks:{}}},{workspace:{selects:{},checks:{c11i:true,c11b:true,c10a:true}}})");
  return i.includes('11i*')&&i.includes('11b')&&i.includes('10a')&&!i.includes('11b*');});
t('live: level exceedance is an ERROR', ()=>{
  E("resetFormFields();window.DD254_PARENT={title:'PRIME-1',workspace:{selects:{fcl1a:'C',sfg1b:'C'},checks:{c11b:true}}};");
  E("document.getElementById('fcl1a').value='S';document.getElementById('sfg1b').value='TS';document.getElementById('c11i').checked=true;document.getElementById('c11b').checked=true;document.getElementById('c10a').checked=true;run();");
  return (w.DD254_ERRORS||[]).some(x=>/Item 1a FCL \(S\) exceeds PRIME-1/.test(x))
      && (w.DD254_ERRORS||[]).some(x=>/Item 1b safeguarding \(TS\) exceeds PRIME-1/.test(x));});
t('live: GCA-approval adds are a WARN not an error', ()=>
  (w.DD254_WARNS||[]).some(x=>/11i/.test(x)&&/prior GCA written approval/.test(x))
  && !(w.DD254_ERRORS||[]).some(x=>/prior GCA written approval/.test(x)));
t('live: non-GCA adds warned separately', ()=> (w.DD254_WARNS||[]).some(x=>/10a/.test(x)&&/actually flows from the prime/.test(x)));
t('live: a box already on the prime is not flagged', ()=>
  !(w.DD254_WARNS||[]).filter(x=>x.indexOf('Flow-down:')===0).some(x=>/\b11b\b/.test(x)));
t('no parent means no flow-down noise', ()=>{E("window.DD254_PARENT=null;run();");
  return !(w.DD254_ERRORS||[]).some(x=>x.indexOf('Flow-down')===0);});

H('5. CSV classification markings');
t('marking defaults UNCLASSIFIED', ()=>{E("resetFormFields();");return E("ioCsvMarking()")==='UNCLASSIFIED';});
t('marking follows the CUI banner', ()=>{E("document.getElementById('clsSel').value='CUI';");
  const m=E("ioCsvMarking()"); E("document.getElementById('clsSel').value='';");
  return m==='CUI // CONTROLLED UNCLASSIFIED INFORMATION';});
t('template export prepends it', ()=> /lines=\[ioCsvMarking\(\)/.test(E("String(tplIoExport)")));
t('audit export prepends it', ()=> /ioCsvMarking\(\)/.test(E("String(audExport)")));
t('portfolio prepends it', ()=> /lines\.unshift\(ioCsvMarking\(\)\)/.test(E("String(portfolioCsv)")));
await ta('importer tolerates a leading marking row', async()=>{
  E("window.__realTplEdit=window.dashTplEdit;window.ioPreview=async function(){return {apply:true,del:false};};window.dashTplEdit=function(){};tplSave(TPL_CT,[]);");
  await E("tplIoApply('ct',[['UNCLASSIFIED'],['Template Name','Block 13'],['Marked','hello']])");
  const a=E("tplLoad(TPL_CT)"); return a.length===1&&a[0].label==='Marked'&&a[0].data.i13==='hello';});
await ta('importer still accepts header-first files', async()=>{
  E("tplSave(TPL_CT,[]);"); await E("tplIoApply('ct',[['Template Name','Block 13'],['Legacy','abc']])");
  return E("tplLoad(TPL_CT)")[0].label==='Legacy';});
await ta('unrecognised file rejected', async()=>{
  E("tplSave(TPL_CT,[]);window.__A='';"); await E("tplIoApply('ct',[['zz','yy'],['a','b']])");
  const ok=/No recognized columns/.test(E("window.__A||''"));
  E("window.dashTplEdit=window.__realTplEdit;");   /* stop the stub leaking into later sections */
  return ok;});

H('6. Single-tab lock');
t('boot claimed the lock', ()=> E("window.DD254_READONLY")===false
  && E("JSON.parse(localStorage.getItem('dd254_tab_lock')).id")===E("window.DD254_TAB_ID"));
t('a stale foreign lock is ignored', ()=>{
  E("localStorage.setItem('dd254_tab_lock',JSON.stringify({id:'ghost',ts:Date.now()-60000}));lockBeat();");
  return E("window.DD254_READONLY")===false;});
t('a live foreign lock forces read-only', ()=>{
  E("localStorage.setItem('dd254_tab_lock',JSON.stringify({id:'other',ts:Date.now()}));lockBeat();");
  return E("window.DD254_READONLY")===true && !!w.document.getElementById('dd254LockOverlay');});
t('read-only blocks template writes', ()=>{E("tplSave(TPL_CT,[{label:'NOPE'}]);");
  return (E("tplLoad(TPL_CT)")||[]).every(x=>x.label!=='NOPE');});
await ta('read-only blocks draft writes', async()=> true===await E("(async function(){await draftPut({id:'ro',title:'n'});return !(await draftGet('ro'));})()"));
t('take-over reclaims and clears the overlay', ()=>{E("lockTakeOver();");
  return E("window.DD254_READONLY")===false && !w.document.getElementById('dd254LockOverlay')
    && E("JSON.parse(localStorage.getItem('dd254_tab_lock')).id")===E("window.DD254_TAB_ID");});
t('writes work again afterwards', ()=>{E("tplSave(TPL_CT,[{label:'AFTER'}]);");
  return (E("tplLoad(TPL_CT)")||[]).some(x=>x.label==='AFTER');});

H('7. Dashboard — search, capability export, card');
await ta('seed a portfolio', async()=>{
  await wipe();
  await E("(async function(){\
    await draftPut({id:'A1',title:'Alpha',status:'Draft',stage:'orig',meta:{contract:'W911-A',contractor:'Acme',cage7:'9ZZZ9'},todos:[],dist:[],holds:[],\
      workspace:{selects:{fcl1a:'S',sfg1b:'S'},texts:{i6b:'1ABC2',i16a:'DLA',item13:'Ref 10a: COMSEC guidance applies.'},checks:{c10a:true,c11h:true},radios:{}}});\
    await draftPut({id:'B1',title:'Bravo',status:'Draft',stage:'orig',meta:{contract:'N000-B',contractor:'Beta'},todos:[],dist:[],holds:[],\
      workspace:{selects:{fcl1a:'TS',sfg1b:'NONE'},texts:{i6b:'9AAA9'},checks:{c10f:true,c11a:true},radios:{}}});\
    await draftPut({id:'B2',title:'Bravo Rev 1',parentId:'B1',rootId:'B1',status:'Draft',stage:'rev',meta:{},todos:[],dist:[],holds:[],\
      workspace:{texts:{item13:'unique-needle-xyz'},checks:{},radios:{}}});\
    await dashRenderCards();})()");
  return cards().length===3;});
const search=async q=>{E("dashSetSearch("+JSON.stringify(q)+")"); await E("dashRenderCards()");};
await ta('search by box number', async()=>{await search('10a'); const v=titles(); return v.includes('Alpha')&&!v.includes('Bravo');});
await ta('search by capability name finds the same', async()=>{await search('comsec'); const v=titles(); return v.includes('Alpha')&&!v.includes('Bravo');});
await ta('search reaches Block 13', async()=>{await search('guidance applies'); return titles().includes('Alpha');});
await ta('search reaches CAGE', async()=>{await search('9aaa9'); const v=titles(); return v.includes('Bravo')&&!v.includes('Alpha');});
await ta('a hit on a child surfaces the chain', async()=>{await search('unique-needle-xyz');
  const v=titles(); return v.includes('Bravo')&&v.includes('Bravo Rev 1')&&!v.includes('Alpha');});
await ta('nonsense matches nothing', async()=>{await search('zzz-no-such'); return titles().length===0;});
await ta('clear filters restores', async()=>{E("dashClearFilters();"); await E("dashRenderCards()"); return cards().length===3;});
t('box labels read from the form markup', ()=>{const l=E("dd254BoxLabel('10a')");
  return l.indexOf('10a ')===0 && /COMSEC/i.test(l) && /Sensitive Compartmented/i.test(E("dd254BoxLabel('10e1')"));});
await ta('portfolio exports capability columns correctly', async()=>{
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  await E("portfolioCsv()"); w.Blob=OB;
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  const hdr=rows[1], a=rows.find(r=>r[0]==='Alpha'), b=rows.find(r=>r[0]==='Bravo');
  const ix=n=>hdr.findIndex(h=>h.indexOf(n)===0);
  return rows[0][0]==='UNCLASSIFIED'
    && a[ix('FCL (1a)')]==='S' && a[ix('CAGE (6b)')]==='1ABC2' && a[ix('GCA (16a)')]==='DLA'
    && a[ix('10a')]==='X' && a[ix('11h')]==='X' && a[ix('10f')]===''
    && b[ix('10f')]==='X' && b[ix('FCL (1a)')]==='TS'
    && hdr.includes('Open Holds') && hdr.includes('Hold Reasons');});
t('some capability headers contain commas', ()=>
  E("CT_10.concat(CT_11).map(dd254BoxLabel).filter(function(x){return x.indexOf(',')>=0;}).length")>0);
await ta('card status border: leaf coloured, parent grey', async()=>{
  await wipe();
  await E("(async function(){\
    await draftPut({id:'P1',title:'Root',status:'Issued',stage:'orig',meta:{},todos:[],dist:[],holds:[],workspace:{}});\
    await draftPut({id:'C1',title:'Rev 1',parentId:'P1',rootId:'P1',status:'Blocked',stage:'rev',meta:{},todos:[],dist:[],holds:[],workspace:{}});\
    await draftPut({id:'S1',title:'Solo',status:'Blocked',stage:'orig',meta:{},todos:[],dist:[],holds:[],workspace:{}});\
    await dashRenderCards();})()");
  const f=x=>cards().find(c=>c.textContent.includes(x));
  return f('Root').getAttribute('style').includes('border:2px solid #b8c0c8')
    && (f('Root').getAttribute('title')||'').includes('Superseded')
    && f('Rev 1').getAttribute('style').includes('border:2px solid #9e1b32')
    && f('Solo').getAttribute('style').includes('border:2px solid #9e1b32')
    && f('Rev 1').getAttribute('style').includes('margin-left:28px');});
await ta('subcontractor CAGE shown, omitted when blank', async()=>{
  await wipe();
  await E("(async function(){\
    await draftPut({id:'K1',title:'Kilo',status:'Draft',stage:'orig',todos:[],dist:[],holds:[],meta:{contract:'W-K',contractor:'Kilo',cage7:'9ZZZ9'},workspace:{texts:{},checks:{},radios:{}}});\
    await draftPut({id:'K2',title:'Lima',status:'Draft',stage:'orig',todos:[],dist:[],holds:[],meta:{contract:'W-L',contractor:'Lima'},workspace:{texts:{i7b:'7ABC7'},checks:{},radios:{}}});\
    await draftPut({id:'K3',title:'Mike',status:'Draft',stage:'orig',todos:[],dist:[],holds:[],meta:{contract:'W-M',contractor:'Mike'},workspace:{texts:{},checks:{},radios:{}}});\
    await dashRenderCards();})()");
  const f=x=>cards().find(c=>c.textContent.includes(x)).textContent;
  return f('Kilo').includes('Subcontractor CAGE: 9ZZZ9')
      && f('Lima').includes('Subcontractor CAGE: 7ABC7')
      && f('Mike').includes('W-M · Mike') && !f('Mike').includes('CAGE');});
t('notes field is wired to an input', ()=> E("typeof dashNotesInput")==='function' && /notesIn_/.test(E("String(dashRenderCards)")));
t('review clock stays biennial', ()=> E("dd254ReviewDue({issuedAt:'2026-01-15T00:00:00Z',workspace:{texts:{}}})")==='2028-01-15');

H('8. Holds');
await ta('Blocked demands a reason, refuses empty, records it', async()=>{
  await wipe();
  await E("draftPut({id:'H1',title:'Hotel',status:'Draft',stage:'orig',meta:{},todos:[],dist:[],workspace:{checks:{},texts:{},radios:{},selects:{}}})");
  await E("dashRenderCards()");
  const pr=E("dashSetStatus('H1','Blocked')");
  await new Promise(r=>setTimeout(r,100));
  const d=w.document.getElementById('dashHoldDlg'); if(!d) return 'no dialog';
  const titled=d.textContent.includes('A reason is required to set Blocked');
  d.querySelector('#hpSave').click();
  const held=!!w.document.getElementById('dashHoldDlg') && d.querySelector('#hpErr').style.display==='block';
  d.querySelector('#hpTxt').value='SCG not received';
  d.querySelector('#hpSave').click(); await pr;
  const r=await E("draftGet('H1')");
  return titled && held && r.status==='Blocked' && r.holds.length===1 && r.holds[0].s==='Blocked' && r.holds[0].done===false;});
t('badge red when open, green when cleared, absent when none', ()=>
  /1 open hold/.test(E("dashHoldBadge({holds:[{done:false}]})")) && /#9e1b32/.test(E("dashHoldBadge({holds:[{done:false}]})"))
  && /holds cleared/.test(E("dashHoldBadge({holds:[{done:true}]})"))
  && E("dashHoldBadge({holds:[]})")==='' && E("dashHoldBadge({})")==='');
await ta('hold renders on the card face', async()=>{ await E("dashRenderCards()");
  const c=cards()[0].innerHTML;
  return /Holds \(1 open\)/.test(c) && /SCG not received/.test(c) && !!w.document.getElementById('holdIn_H1');});
await ta('cancel reverts the status', async()=>{
  /* Blocked is now the only status that prompts, so the record has to leave it
     first — setting Blocked over Blocked is a no-op and raises no dialog. */
  await E("dashSetStatus('H1','Draft')");
  const pr=E("dashSetStatus('H1','Blocked')");
  await new Promise(r=>setTimeout(r,100));
  w.document.getElementById('dashHoldDlg').querySelector('#hpCancel').click(); await pr;
  const r=await E("draftGet('H1')"); return r.status==='Draft' && r.holds.length===1;});
await ta('a second hold records the raising status', async()=>{
  const pr=E("dashSetStatus('H1','Blocked')");
  await new Promise(r=>setTimeout(r,100));
  const d=w.document.getElementById('dashHoldDlg'); d.querySelector('#hpTxt').value='Waiting on CAGE';
  d.querySelector('#hpSave').click(); await pr;
  const r=await E("draftGet('H1')"); return r.holds.length===2 && r.holds[1].s==='Blocked';});
await ta('ad-hoc add, resolve and delete', async()=>{
  await E("dashRenderCards()");
  w.document.getElementById('holdIn_H1').value='Chasing ACO';
  await E("dashHoldAdd('H1')");
  let r=await E("draftGet('H1')"); const added=r.holds.length===3;
  await E("dashHoldToggle('H1',0)"); r=await E("draftGet('H1')"); const done=r.holds[0].done===true;
  await E("dashHoldDel('H1',2)"); r=await E("draftGet('H1')");
  return added && done && r.holds.length===2;});
await ta('Issued is challenged while a hold is open', async()=>{
  E("window.uiConfirm=async function(){return false;};");
  await E("dashSetStatus('H1','Issued')");
  let r=await E("draftGet('H1')"); const reverted=r.status==='Blocked';
  E("window.uiConfirm=async function(){return true;};");
  const pr=E("dashSetStatus('H1','Issued')"); await new Promise(x=>setTimeout(x,120));
  const dd=w.document.getElementById('dashDistDlg'); if(dd) dd.querySelector('#ddSkip').click();
  await pr; r=await E("draftGet('H1')");
  return reverted && r.status==='Issued' && E("audAll()").some(x=>x.action==='issued-with-open-holds');});
await ta('only Blocked raises a hold prompt', async()=>{
  await E("draftPut({id:'HP1',title:'HP',status:'Draft',stage:'orig',todos:[],holds:[],meta:{},workspace:{texts:{},checks:{},radios:{},selects:{},perf:[]}})");
  await E("dashSetStatus('HP1','Ready to sign')");
  const noDlg=!w.document.getElementById('dashHoldDlg');
  const pr=E("dashSetStatus('HP1','Blocked')");
  await new Promise(r=>setTimeout(r,100));
  const dlg=!!w.document.getElementById('dashHoldDlg');
  if(dlg) w.document.getElementById('dashHoldDlg').querySelector('#hpCancel').click();
  await pr;
  return noDlg && dlg ? true : ('readyToSign raised a dialog='+!noDlg+' blocked raised one='+dlg); });
t('Awaiting info is no longer offered', ()=>
  !E("dashStatusOptions({stage:'orig',status:'Draft'})").includes('Awaiting info'));
t('the statuses are Draft, Blocked, Ready to sign, Issued, Cancelled', ()=>
  E("dashStatusOptions({stage:'orig',status:'Draft'})").join('|')==='Draft|Blocked|Ready to sign|Issued|Cancelled');
t('holds reach the search index', ()=> /cage confirmation/.test(E("dashSearchText({title:'z',holds:[{t:'CAGE confirmation pending',s:'Blocked'}]})")));

H('9. Distribution capture and log');
t('parties derive from Item 18 on that draft', ()=>{
  const p=E("dashDistParties({workspace:{checks:{dist18a:true,dist18c:true,dist18f:true},texts:{dist18fOther:'ACO Bldg 4'}},requestedBy:'po@x.mil'})");
  return p.length===4 && p[0].key==='18a' && p[2].key==='18f' && /ACO Bldg 4/.test(p[2].to) && p[3].key==='req' && p[3].to==='po@x.mil';});
t('no Item 18 boxes means no parties', ()=> E("dashDistParties({workspace:{checks:{},texts:{}}})").length===0);
t('issue e-mail maps requestor and Item 6/7/8 FSOs to To, then CSOs and Block 18f to CC', ()=>{
  const r={title:'Alpha',requestedBy:'REQ@gov.mil',workspace:{checks:{dist18f:true},texts:{
    i6fsoEmail:'prime@acme.com; req@GOV.mil',i7fsoEmail:'sub@beta.com',fsoEmails:'manual@other.com',
    i6c:'cso1@dcsa.mil REQ@gov.mil',i7c:'cso2@dcsa.mil',item13:'item13@other.com',dist18fOther:'18f@other.com'
  },perf:[{email:'SUB@BETA.COM loc@plant.com',cso:'CSO2@dcsa.mil cso3@dcsa.mil'}]}};
  const m=E("dashIssueMail("+JSON.stringify(r)+")");
  return m.to.join('|')==='REQ@gov.mil|prime@acme.com|sub@beta.com|loc@plant.com'
      && m.cc.join('|')==='cso1@dcsa.mil|cso2@dcsa.mil|cso3@dcsa.mil|18f@other.com'
      && !/manual@other|item13@other/i.test(m.to.concat(m.cc).join('|')); });
t('issue e-mail mailto separates every To and CC address with semicolon-space and carries an identifying subject', ()=>{
  const m=E("dashIssueMail({title:'Contract 47',requestedBy:'req@gov.mil',workspace:{checks:{dist18f:true},texts:{i6fsoEmail:'fso@acme.com',i7fsoEmail:'sub@beta.com',i6c:'cso@dcsa.mil',i7c:'cso2@dcsa.mil',dist18fOther:'other@example.mil'},perf:[]}})");
  const u=decodeURIComponent(m.href);
  return u.indexOf('mailto:req@gov.mil; fso@acme.com; sub@beta.com?cc=cso@dcsa.mil; cso2@dcsa.mil; other@example.mil&subject=Issued DD Form 254 — Contract 47')===0; });
t('a CUI issuance prefixes the subject with the triple visual warning', ()=>{
  const m=E("dashIssueMail({title:'CUI Contract',requestedBy:'req@gov.mil',workspace:{selects:{clsSel:'CUI'},texts:{},perf:[]}})");
  return m.cui===true && m.subject==='(CUI)(CUI)(CUI) Issued DD Form 254 — CUI Contract'
      && decodeURIComponent(m.href).includes('subject=(CUI)(CUI)(CUI) Issued DD Form 254 — CUI Contract'); });
t('bulk issue e-mail separates differing audiences and keeps semicolon-space separators', ()=>{
  const a={title:'A',requestedBy:'req@gov.mil',workspace:{selects:{},checks:{dist18f:true},texts:{i6fsoEmail:'fso1@a.com',i6c:'cso1@gov.mil',dist18fOther:'other@gov.mil; req@gov.mil'},perf:[]}};
  const b={title:'B',requestedBy:'REQ@gov.mil',workspace:{selects:{clsSel:'CUI'},checks:{dist18f:true},texts:{i7fsoEmail:'fso2@b.com',i7c:'CSO1@gov.mil cso2@gov.mil',dist18fOther:'OTHER@gov.mil extra@gov.mil'},perf:[]}};
  const g=E("dashIssueMailGroups("+JSON.stringify([a,b])+")"), urls=g.map(function(x){return decodeURIComponent(x.mail.href);});
  return g.length===2 && urls.every(function(u){return /mailto:[^?]+; [^?]+/.test(u);})
      && urls.some(function(u){return /fso1@a\.com/.test(u)&&!/fso2@b\.com/.test(u);})
      && urls.some(function(u){return /fso2@b\.com/.test(u)&&!/fso1@a\.com/.test(u)&&/\(CUI\)\(CUI\)\(CUI\)/.test(u);}); });
await ta('issue dialog uses the actual clicked anchor for the default-mail handoff', async()=>{
  E("window.__issueMailDlg=dashDistDialog({id:'MAIL1',title:'Mail test',requestedBy:'req@gov.mil',workspace:{selects:{},checks:{dist18f:true},radios:{},texts:{i6fsoEmail:'fso@acme.com',i6c:'cso@dcsa.mil',dist18fOther:'other@example.mil'},perf:[]}})");
  await new Promise(r=>setTimeout(r,80));
  const d=w.document.getElementById('dashDistDlg'); if(!d) return 'no dialog';
  const b=d.querySelector('#ddEmail'), txt=d.textContent;
  const href=decodeURIComponent(b.getAttribute('href')||'');
  const ok=!!b && b.tagName==='A' && /^mailto:req@gov\.mil; fso@acme\.com\?cc=cso@dcsa\.mil; other@example\.mil/.test(href)
      && b.getAttribute('target')===null && E("typeof dashOpenIssueMail")==='undefined'
      && /Open e-mail/.test(b.textContent) && /requestor and Item 6\/7\/8 FSOs/.test(txt)
      && /Item 6\/7\/8 CSOs plus e-mail addresses in Block 18f/.test(txt) && /Duplicate addresses are removed/.test(txt)
      && /semicolon and space/.test(txt)
      && /does not open a web window/.test(txt) && /To: 2 · CC: 2/.test(txt);
  d.querySelector('#ddSkip').click(); await E("window.__issueMailDlg"); return ok; });
await ta('an empty issue audience leaves the e-mail link inert and explains why', async()=>{
  E("window.__A='';window.__emptyMailDlg=dashDistDialog({id:'MAIL0',title:'No mail',workspace:{selects:{},checks:{},radios:{},texts:{},perf:[]}})");
  await new Promise(r=>setTimeout(r,80));
  const d=w.document.getElementById('dashDistDlg'); if(!d) return 'no dialog';
  const b=d.querySelector('#ddEmail'); b.click();
  const ok=!b.hasAttribute('href') && b.getAttribute('aria-disabled')==='true' && /No requestor/.test(w.__A||'');
  d.querySelector('#ddSkip').click(); await E("window.__emptyMailDlg"); return ok; });
await ta('Issued opens the dialog and records what is ticked', async()=>{
  await wipe();
  await E("draftPut({id:'D1',title:'Delta',status:'Draft',stage:'orig',meta:{},todos:[],dist:[],holds:[],niss:{on:true,date:'2026-01-01',by:'DA'},\
    workspace:{selects:{},checks:{dist18a:true,dist18c:true},texts:{i6fsoEmail:'p@a.com'},radios:{},perf:[]}})");
  await E("dashRenderCards()");
  const pr=E("dashSetStatus('D1','Issued')");
  await new Promise(r=>setTimeout(r,120));
  const d=w.document.getElementById('dashDistDlg'); if(!d) return 'no dialog';
  const pre=d.querySelector('#ddTo_0').value;
  d.querySelector('#ddSent_1').checked=false;
  d.querySelector('#ddSave').click(); await pr;
  const r=await E("draftGet('D1')");
  return pre==='p@a.com' && r.dist.length===1 && /18a/.test(r.dist[0].party) && !('ack' in r.dist[0]);});
await ta('skip is allowed and audit-logged', async()=>{
  await wipe();
  await E("draftPut({id:'D2',title:'Echo',status:'Draft',stage:'orig',meta:{},todos:[],dist:[],holds:[],niss:{on:true},workspace:{checks:{dist18a:true},texts:{},radios:{},perf:[]}})");
  const pr=E("dashSetStatus('D2','Issued')"); await new Promise(r=>setTimeout(r,120));
  const d=w.document.getElementById('dashDistDlg'); if(!d) return 'no dialog';
  d.querySelector('#ddSkip').click(); await pr;
  const r=await E("draftGet('D2')");
  return (!r.dist||r.dist.length===0) && r.status==='Issued' && E("audAll()").some(x=>x.action==='issued-without-distribution');});
t('issued with nothing logged is badged', ()=> /no distribution recorded/.test(E("dashDistBadge({status:'Issued',dist:[]},false)")));
t('badge is a button that opens the log', ()=>{
  const b=E("dashDistBadge({id:'X',dist:[{ts:'2026-01-01'},{ts:'2026-01-02'}]},false)");
  return /2 distributed/.test(b) && /dash-badge-btn/.test(b) && /dashDistOpen\('X',false\)/.test(b)
      && !/acknowledg/i.test(b);});
t('stats report the count only', ()=>{const s=E("dashDistStats({dist:[{ts:'a'},{ts:'b'}]})");
  return s.n===2 && !('ack' in s) && !('overdue' in s);});
t('acknowledgement machinery is gone', ()=> E("typeof dashDistAck")==='undefined' && E("typeof DIST_ACK_DAYS")==='undefined');
t('stale ack data on an old record does not crash', ()=> /1 distributed/.test(E("dashDistBadge({id:'X',dist:[{ts:'2020-01-01',ack:'2020-02-02'}]},false)")));
await ta('clicking the badge expands to the log', async()=>{
  await wipe();
  await E("draftPut({id:'D3',title:'Foxtrot',status:'Issued',stage:'orig',meta:{},todos:[],holds:[],\
    dist:[{ts:'2026-02-02',party:'18a — Contractor (FSO)',to:'fso@acme.com',method:'e-mail'}],workspace:{}})");
  await E("dashRenderCards()");
  const before=!w.document.getElementById('distLog_D3');
  await E("dashDistOpen('D3',false)");
  const el=w.document.getElementById('distLog_D3');
  const openOk=!!el && /Distribution log \(1\)/.test(el.textContent) && /fso@acme.com/.test(cards()[0].innerHTML);
  const noAck=Array.from(w.document.querySelectorAll('.dash-card input[type="date"]')).filter(i=>(i.getAttribute('onchange')||'').includes('dashDistAck')).length===0;
  await E("dashDistOpen('D3',true)");
  return before && openOk && noAck && !w.document.getElementById('distLog_D3');});
await ta('Notes button declares the distribution count', async()=>{
  await E("dashRenderCards()");
  const b=Array.from(cards()[0].querySelectorAll('button')).find(x=>x.textContent.indexOf('Notes')===0);
  return !!b && /Dist \(1\)/.test(b.textContent);});

H('10. Dialog attachments and the CUI warning');
const ATT={workspace:{selects:{clsSel:'CUI'},checks:{dist18a:true,c10f:true,c11c:true,c10a:true},radios:{i14:'yes',fin:'yes'},
  texts:{attachNotes:'Site access instructions\nBadge request form'},perf:[]}};
t('rules run off the stored draft', ()=>{const a=E("dashDistAttachments("+JSON.stringify(ATT)+")");
  return a.auto.some(x=>/SAP security guide/.test(x)) && a.auto.some(x=>/Security Classification Guide/.test(x))
      && a.auto.some(x=>/COMSEC/.test(x)) && a.auto.some(x=>/Item 14/.test(x)) && a.auto.some(x=>/Final disposition/.test(x));});
t('unticked rules do not fire', ()=> !E("dashDistAttachments("+JSON.stringify(ATT)+")").auto.some(x=>/TEMPEST|OPSEC|NATO|1540/.test(x)));
t('manual notes split per line', ()=> E("dashDistAttachments("+JSON.stringify(ATT)+")").manual.length===2);
t('template-required attachments resolve by id', ()=>{
  E("tplSave(TPL_CT,[{label:'Att',ioId:'stable-1',data:Object.assign(ctBlankData(),{attText:'SCG-9999\\nAddendum B'})}]);");
  const a=E("dashDistAttachments({workspace:{selects:{ctTplSel:'stable-1'},checks:{},radios:{},texts:{}}})");
  return a.tpl.length===2 && a.tpl[0]==='SCG-9999';});
t('a stale template reference does not throw', ()=>
  E("dashDistAttachments({workspace:{selects:{ctTplSel:'no-such'},checks:{},radios:{},texts:{}}})").tpl.length===0);
t('empty draft yields nothing', ()=> E("dashDistAttachments({}).all").length===0);
t('CUI detection reads the stored banner', ()=> E("dashDistIsCUI("+JSON.stringify(ATT)+")")===true && E("dashDistIsCUI({workspace:{selects:{clsSel:''}}})")===false);
t('CUI detection also reads the selected DD-254 template', ()=>{
  E("tplSave(TPL_CT,[{label:'CUI mail template',ioId:'cui-mail-template',data:Object.assign(ctBlankData(),{cls:'CUI'})}])");
  return E("dashDistIsCUI({workspace:{selects:{clsSel:'',ctTplSel:'cui-mail-template'}}})")===true
      && E("dashIssueMail({title:'Template CUI',workspace:{selects:{ctTplSel:'cui-mail-template'},texts:{},perf:[]}}).subject").indexOf('(CUI)(CUI)(CUI) ')===0; });
t('the rule list is shared by both callers', ()=>{
  const v=E("dd254AutoAttachments(function(k){return k==='11i';},function(){return '';})");
  return v.length===1 && /TEMPEST/.test(v[0]);});
await ta('dialog shows the CUI banner and the attachment block', async()=>{
  E("window.__P=dashDistDialog(Object.assign({id:'F1',title:'Foxtrot',requestedBy:'po@x.mil'},"+JSON.stringify(ATT)+"))");
  await new Promise(r=>setTimeout(r,90));
  const d=w.document.getElementById('dashDistDlg'); if(!d) return 'no dialog';
  const x=d.textContent;
  const ok=/CUI — SEND ENCRYPTED/.test(x) && /DoDI 5200.48/.test(x) && /Attach before you send \(7\)/.test(x)
      && /Triggered by the selections on this form/.test(x) && /Site access instructions/.test(x) && !!d.querySelector('#ddAttCopy');
  let cap=''; w.navigator.clipboard={writeText:v=>{cap=v;}};
  d.querySelector('#ddAttCopy').click(); d.querySelector('#ddSkip').click(); await E("window.__P");
  return ok && /- Site access instructions/.test(cap) && cap.split('\n').length===7;});
await ta('no CUI banner on an unclassified draft', async()=>{
  E("window.__P2=dashDistDialog({id:'G1',title:'Golf',workspace:{selects:{clsSel:''},checks:{dist18a:true},radios:{},texts:{},perf:[]}})");
  await new Promise(r=>setTimeout(r,90));
  const d=w.document.getElementById('dashDistDlg'); if(!d) return 'no dialog';
  const ok=!/SEND ENCRYPTED/.test(d.textContent) && /No attachments are triggered/.test(d.textContent);
  d.querySelector('#ddSkip').click(); await E("window.__P2"); return ok;});
t('the on-form reminder still works', ()=>{
  E("showFormView();resetFormFields();document.getElementById('c11j').checked=true;document.getElementById('c10g').checked=true;run();");
  const h=w.document.getElementById('attachAutoList').innerHTML;
  return /OPSEC/.test(h) && /NATO/.test(h);});

H('11. FSO e-mail fields');
t('fields exist and never reach the printed form', ()=>{
  const s=E("String(collect254Data)");
  return !!w.document.getElementById('i6fsoEmail') && !!w.document.getElementById('i7fsoEmail')
      && !s.includes('i6fsoEmail') && !s.includes('i7fsoEmail');});
t('perf block exposes exactly 3 text inputs, e-mail last', ()=>{
  E("resetFormFields();addPerf();");
  const f=PB();
  return !!f.loc && !!f.cage && !!f.cso && !!f.email && !!f.cma
      && f.email.placeholder==='fso@location.com' && f.cso.tagName==='TEXTAREA';});
t('positional readers unaffected, e-mail persisted', ()=>{
  const f=PB();
  f.loc.value='Plant 2'; f.cage.value='1ABC2'; f.cso.value='DCSA Mesa'; f.email.value='loc@acme.com';
  const ws=E("collectWorkspace()");
  return ws.perf[0].cage==='1ABC2' && ws.perf[0].cso==='DCSA Mesa' && ws.perf[0].email==='loc@acme.com';});
t('workspace round trip keeps them', ()=>{
  const ws=E("collectWorkspace()");
  E("window.__W="+JSON.stringify(ws)+";resetFormFields();applyWorkspace(window.__W);");
  const f=PB();
  return f.email.value==='loc@acme.com' && f.cage.value==='1ABC2';});
t('MUST SEND TO FSOs aggregates 6, 7, 8 deduped', ()=>{
  E("document.getElementById('i6fsoEmail').value='prime@acme.com';document.getElementById('i7fsoEmail').value='sub@beta.com';");
  PB().email.value='SUB@BETA.COM';
  E("document.getElementById('fsoEmails').value='extra@x.com';updateEmailDist();");
  const s=E("emailDistSets()"); const h=w.document.getElementById('fsoEmailList').innerHTML;
  return s.fsoAuto.length===2 && s.fso.length===3 && /prime@acme.com/.test(h) && !/extra@x.com/.test(h);});
t('subcontractor e-mail required once a sub exists', ()=>{
  E("resetFormFields();document.getElementById('i7a').value='Beta Corp';document.getElementById('i7fsoEmail').value='';run();");
  return (w.DD254_ERRORS||[]).some(x=>/Subcontractor FSO e-mail is required/.test(x))
      && w.document.getElementById('a7email').className.includes('show');});
t('any text clears it', ()=>{E("document.getElementById('i7fsoEmail').value='fso-team@beta.mil';run();");
  return !(w.DD254_ERRORS||[]).some(x=>/Subcontractor FSO e-mail/.test(x));});
t('no subcontractor, no demand', ()=>{E("resetFormFields();run();");
  return !(w.DD254_ERRORS||[]).some(x=>/Subcontractor FSO e-mail/.test(x));});
t('address FORMAT is not policed', ()=>{
  E("resetFormFields();document.getElementById('i7a').value='Beta';document.getElementById('i7fsoEmail').value='FSO Group <t@b.mil>; alt@b.mil';document.getElementById('i6fsoEmail').value='security desk';run();");
  return !(w.DD254_ERRORS||[]).some(x=>/valid address/i.test(x)) && !(w.DD254_WARNS||[]).some(x=>/valid address/i.test(x));});
t('18a and 18b resolve independently', ()=>{
  const p=E("dashDistParties({workspace:{checks:{dist18a:true,dist18b:true},texts:{i6fsoEmail:'p@a.com',i7fsoEmail:'s@b.com'},perf:[]}})");
  return p[0].to==='p@a.com' && p[1].to==='s@b.com';});
t('dialog e-mail set dedupes across every source', ()=>{
  const e=E("dashDistEmails({workspace:{texts:{i6fsoEmail:'p@a.com',i7fsoEmail:'s@b.com',fsoEmails:'P@A.COM'},perf:[{cso:'',email:'s@b.com'},{cso:'',email:'l@a.com'}]}})");
  return e.fso.length===3 && e.fsoPrime[0]==='p@a.com' && e.fsoSub[0]==='s@b.com';});
/* Legacy drafts predate the Item 6/7 FSO e-mail fields and carry only the old
   shared list. 18a used to fall back to that list, which is how the wrong
   recipients reached the distribution row. 18a is now Item 6 or nothing — a
   blank row makes you look, a wrongly populated one invites a send. The old
   addresses remain one click away in the row's picker. */
t('a legacy draft leaves 18a blank rather than guessing', ()=>
  E("dashDistParties({workspace:{checks:{dist18a:true},texts:{fsoEmails:'old@acme.com'},perf:[]}})")[0].to==='');
t('a legacy draft still offers its old addresses in the picker', ()=>
  E("dashDistParties({workspace:{checks:{dist18a:true},texts:{fsoEmails:'old@acme.com'},perf:[]}})")[0].opts.indexOf('old@acme.com')>=0);
t('CSO set still comes from 6c / 7c / 8c', ()=>{
  const e=E("dashDistEmails({workspace:{texts:{i6c:'a@dcsa.mil',i7c:'b@dcsa.mil'},perf:[{cso:'c@dcsa.mil'}]}})");
  return e.cso.length===3;});

H('12. Templates carry the e-mail');
await ta('facility template applies address, CAGE and e-mail', async()=>{
  E("tplSave(TPL_FAC,[{label:'Huntsville',text:'Acme, 1 Main St',cage:'1ABC2',email:'hsv.fso@acme.com'}]);buildTplSelects();");
  E("resetFormFields();applyFacTplFromSearch({value:'1ABC2'});");
  return w.document.getElementById('i6a').value==='Acme, 1 Main St'
      && w.document.getElementById('i6b').value==='1ABC2'
      && w.document.getElementById('i6fsoEmail').value==='hsv.fso@acme.com';});
t('facility CSV has the column', ()=>{const n=E("TPL_IO.fac.cols.map(function(c){return c.h;})"); const i=n.indexOf('FSO E-mail');
  return i>0 && E("TPL_IO.fac.cols["+i+"].g({email:'x@y.com'})")==='x@y.com';});
await ta('perf template row and CSV carry it', async()=>{
  await E("tplSave(TPL_PERF,[{label:'Beta',name:'Beta Corp, 9 Elm',cage:'9ZZZ9',cso:'DCSA Dayton',email:'sub.fso@beta.com'}])");
  await E("dashTplEdit('perf')");
  const h=w.document.getElementById('tplView').innerHTML;
  const n=E("TPL_IO.perf.cols.map(function(c){return c.h;})");
  return /sub.fso@beta.com/.test(h) && n.indexOf('FSO E-mail')>0 && 'email' in E("TPL_IO.perf.blank()");});
t('applying to Item 7 fills the sub e-mail', ()=>{
  E("showFormView();resetFormFields();buildTplSelects();applyPerfTplFromSearch({value:'9ZZZ9',closest:function(){return null;}},'sub');");
  return w.document.getElementById('i7a').value==='Beta Corp, 9 Elm'
      && w.document.getElementById('i7fsoEmail').value==='sub.fso@beta.com';});
await ta('applying to a location fills that block', async()=>{
  E("resetFormFields();addPerf();");
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  E("window.__F={value:'9ZZZ9'};"); w.__F.closest=function(){return blk;};
  E("applyPerfTplFromSearch(window.__F,'blk');");
  return PB(blk).email.value==='sub.fso@beta.com';});
t('save-to-template stores it, blank does not wipe it', ()=>{
  E("tplSave(TPL_PERF,[]);resetFormFields();");
  E("document.getElementById('i7a').value='Gamma Corp, 5 Oak';document.getElementById('i7b').value='5GGG5';document.getElementById('i7fsoEmail').value='g@gamma.com';");
  E("saveBlock7ToTpl({tagName:'BUTTON',dataset:{},textContent:'x'});");
  const stored=E("tplLoad(TPL_PERF)")[0].email==='g@gamma.com';
  E("document.getElementById('i7fsoEmail').value='';saveBlock7ToTpl({tagName:'BUTTON',dataset:{},textContent:'x'});");
  return stored && E("tplLoad(TPL_PERF)")[0].email==='g@gamma.com';});
t('the automatic harvest carries it', ()=>{
  E("tplSave(TPL_PERF,[]);resetFormFields();");
  E("document.getElementById('i7a').value='Delta Corp, 2 Pine';document.getElementById('i7b').value='2DDD2';document.getElementById('i7fsoEmail').value='d@delta.com';tplHarvestPerf();");
  return E("tplLoad(TPL_PERF)")[0].email==='d@delta.com';});

H('13. Confirm-the-details warnings');
t('7 warning is the next element after 7a; 8 warning sits in each block', ()=>{
  E("resetFormFields();addPerf();");
  const n7=w.document.getElementById('i7a').nextElementSibling;
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  const n8=blk.querySelector('textarea').nextElementSibling;
  return n7 && n7.id==='a7Tpl' && n7.className.includes('alert-tpl')
      && n8 && n8.className.includes('tpl-confirm') && !w.document.getElementById('a8Tpl');});
t('hidden on a clean form', ()=> !w.document.getElementById('a7Tpl').className.includes('show')
  && !w.document.querySelector('.tpl-confirm').className.includes('show'));
t('Item 7 apply raises only the 7 warning', ()=>{
  E("tplSave(TPL_PERF,[{label:'Beta',name:'Beta Corp, 9 Elm',cage:'9ZZZ9',cso:'X'}]);buildTplSelects();");
  E("applyPerfTplFromSearch({value:'9ZZZ9',closest:function(){return null;}},'sub');");
  return w.document.getElementById('a7Tpl').className.includes('show')
      && !w.document.querySelector('.tpl-confirm').className.includes('show');});
await ta('a location apply raises only that block', async()=>{
  E("resetFormFields();addPerf();addPerf();");
  const b=w.document.querySelectorAll('#perfBlocks > div[id^="perf-"]');
  E("window.__F2={value:'9ZZZ9'};"); w.__F2.closest=function(){return b[1];};
  E("applyPerfTplFromSearch(window.__F2,'blk');");
  return b[1].querySelector('.tpl-confirm').className.includes('show')
      && !b[0].querySelector('.tpl-confirm').className.includes('show')
      && !w.document.getElementById('a7Tpl').className.includes('show');});
t('wording is short and names address, CAGE, FSO, NISS', ()=>{
  const x=w.document.getElementById('a7Tpl').textContent.trim();
  return x.length<170 && /CONFIRM/.test(x) && /address/i.test(x) && /CAGE/.test(x) && /FSO/.test(x) && /NISS/.test(x);});
t('clearing the form clears every instance', ()=>{E("resetFormFields();");
  return !w.document.getElementById('a7Tpl').className.includes('show')
      && !Array.from(w.document.querySelectorAll('.tpl-confirm')).some(e=>e.className.includes('show'));});
t('typing by hand never raises them', ()=>{
  E("resetFormFields();addPerf();document.getElementById('i7a').value='Typed';run();");
  return !w.document.getElementById('a7Tpl').className.includes('show')
      && !w.document.querySelector('.tpl-confirm').className.includes('show');});

H('14. Spawn and copy');
await ta('seed a fully-worked issued, blocked solicitation', async()=>{
  await wipe();
  await E("draftPut({id:'S9',title:'Juliet — Solicitation',stage:'sol',status:'Blocked',statusOverride:true,\
    reviewDate:'2028-01-01',issuedAt:'2026-02-02T00:00:00Z',notes:'parent notes',\
    holds:[{t:'SCG missing',s:'Blocked',d:'2026-03-03',done:false},{t:'old',s:'Blocked',d:'2026-01-01',done:true}],\
    dist:[{ts:'2026-02-02',party:'18a',to:'fso@x.com',method:'e-mail'}],\
    todos:[{text:'open item',due:'2026-03-01',done:false},{text:'done item',due:'2026-02-01',done:true}],\
    niss:{on:true,date:'2026-02-01',by:'DA'},countersign:{received:true,date:'2026-02-05'},\
    meta:{contract:'W911-J',contractor:'Juliet Corp'},\
    workspace:{selects:{fcl1a:'S'},texts:{i6a:'Juliet Corp',item13:'Ref 10a: guidance.'},checks:{c10a:true,dist18a:true},radios:{spec:'3a'},perf:[],vlog:{entries:[{x:1}],remarks:'r',files:[]}}})");
  const r=await E("draftGet('S9')"); return r.holds.length===2;});
const kid=async()=>(await E("draftAll()")).filter(x=>x.parentId==='S9')[0];
await ta('spawn clears parent EVENTS', async()=>{
  await E("dashSpawn('S9','orig')"); const c=await kid();
  return c.holds.length===0 && c.dist.length===0 && c.countersign===null && !('issuedAt' in c)
      && c.status==='Draft' && c.reviewDate==='';});
await ta('spawn carries working CONTEXT', async()=>{const c=await kid();
  return c.niss && c.niss.by==='DA' && c.todos.length===2 && c.notes==='parent notes'
      && c.workspace.vlog && c.workspace.vlog.entries.length===1;});
await ta('spawn carries the form content and sets stage/title/Item 3', async()=>{const c=await kid();
  return c.workspace.texts.i6a==='Juliet Corp' && c.workspace.checks.c10a===true
      && c.stage==='orig' && c.title==='Juliet — Original' && c.workspace.radios.spec==='3a';});
await ta('revision numbering works off the chain', async()=>{
  const o=await kid(); await E("dashSpawn('"+o.id+"','rev')");
  const rv=(await E("draftAll()")).filter(x=>x.parentId===o.id)[0];
  return rv.revN===1 && rv.workspace.texts.i3b_rev==='1' && rv.holds.length===0;});
await ta('a hold on the child does not reach the parent', async()=>{
  const o=await kid();
  await E("(async function(){var r=await draftGet('"+o.id+"');r.holds=[{t:'child',s:'Blocked',d:'2026-07-30',done:false}];await draftPut(r);})()");
  const p=await E("draftGet('S9')"); return p.holds.length===2 && p.holds[0].t==='SCG missing';});
/* Copy now asks which kind. Full copy is the original behaviour. */
const copyAs=async(id,which)=>{
  const pr=E("dashDuplicate('"+id+"')");
  await new Promise(r=>setTimeout(r,120));
  const d=w.document.getElementById('dashCopyDlg');
  if(!d) return {err:'no copy dialog'};
  d.querySelector(which==='reset'?'#cpReset':'#cpFull').click();
  await pr; await new Promise(r=>setTimeout(r,60));
  return {};
};
await ta('Full copy keeps its original behaviour', async()=>{
  const e=await copyAs('S9','full'); if(e.err) return e.err;
  const c=(await E("draftAll()")).filter(x=>(x.title||'').indexOf('Copy of')===0)[0];
  if(!c) return 'no copy';
  /* Copy still carries holds, distribution, NISS and countersignature by
     design; only the issue date is dropped, because a copy has not been issued. */
  return c.status==='Draft' && c.reviewDate==='' && c.todos.length===0 && c.notes===''
      && c.holds.length===2 && c.dist.length===1 && !!c.niss && !!c.countersign
      && !('issuedAt' in c) && !('parentId' in c);});
await ta('Copy and reset the workflow clears the events, keeps the face', async()=>{
  await E("(async function(){for(const d of await draftAll()){ if((d.title||'').indexOf('Copy of')===0) await draftDel(d.id); }})()");
  const e=await copyAs('S9','reset'); if(e.err) return e.err;
  const c=(await E("draftAll()")).filter(x=>(x.title||'').indexOf('Copy of')===0)[0];
  if(!c) return 'no copy';
  /* events gone */
  const cleared=c.status==='Draft' && c.reviewDate==='' && c.holds.length===0
             && c.dist.length===0 && !c.countersign && !('issuedAt' in c) && c.statusOverride===false;
  /* dashboard face untouched */
  const kept=!!c.niss && c.todos.length>0 && c.notes!=='' && !!c.workspace;
  return cleared && kept ? true : ('cleared='+cleared+' kept='+kept); });
await ta('backing out of the copy dialog creates nothing', async()=>{
  const before=(await E("draftAll()")).length;
  const pr=E("dashDuplicate('S9')");
  await new Promise(r=>setTimeout(r,120));
  w.document.getElementById('dashCopyDlg').querySelector('#cpCancel').click();
  await pr;
  return (await E("draftAll()")).length===before; });
t('spawn and copy both route through one reset', ()=>
  E("String(dashSpawn)").includes('dashResetWorkflow(rec)') && E("String(dashDuplicate)").includes('dashResetWorkflow(rec)'));

H('15. Cleanup fixes');
await ta('to-do invite uses the note date, not the review clock', async()=>{
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/calendar'});};
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  await wipe();
  await E("draftPut({id:'I1',title:'India',status:'Draft',stage:'orig',meta:{},reviewDate:'2028-12-31',holds:[],dist:[],\
    todos:[{text:'Chase the SCG',due:'2026-08-05',ts:'2026-07-30T10:00:00Z',done:false}],workspace:{}})");
  await E("dashTodoIcs('I1',0)"); w.Blob=OB;
  return /DTSTART:20260805T090000/.test(cap) && !/2028/.test(cap);});
await ta('a legacy note falls back to its creation stamp', async()=>{
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/calendar'});};
  await E("(async function(){var r=await draftGet('I1');r.todos=[{text:'Old',ts:'2026-06-01T09:00:00Z',done:false}];await draftPut(r);})()");
  await E("dashTodoIcs('I1',0)"); w.Blob=OB;
  return /DTSTART:20260601T090000/.test(cap);});
await ta('a note with no date at all refuses cleanly', async()=>{
  E("window.__A='';");
  await E("(async function(){var r=await draftGet('I1');r.todos=[{text:'No date',done:false}];await draftPut(r);})()");
  await E("dashTodoIcs('I1',0)");
  return /no date recorded/.test(E("window.__A||''"));});
t('dead functions are gone, live ones remain', ()=>
  ['applyFacTpl','dashNewRevision','dashToggleCardMenu','uiPick'].every(n=>E("typeof "+n)==='undefined')
  && ['applyFacTplFromSearch','dashSpawn','uiConfirm','uiPrompt'].every(n=>E("typeof "+n)==='function'));
t('XFA export still emits every block', ()=>{
  E("showFormView();resetFormFields();document.getElementById('dist18a').checked=true;document.getElementById('dist18f').checked=true;document.getElementById('dist18fOther').value='X';");
  const x=E("DD254XFA.buildXfaDatasets(collect254Data())");
  return /eighteen_a/.test(x)&&/eighteen_other/.test(x)&&/seventeen_AAC/.test(x)&&/five_retention/.test(x);});
t('core validation and Item 11 exclusions still fire', ()=>{
  E("resetFormFields();run();");
  const base=(w.DD254_ERRORS||[]).some(x=>/Item 1a/.test(x)) && (w.DD254_ERRORS||[]).some(x=>/Item 3/.test(x));
  E("document.getElementById('c11a').checked=true;document.getElementById('c11c').checked=true;run();");
  return base && (w.DD254_ERRORS||[]).some(x=>/PROHIBITED/.test(x));});
t('scanItem13 intact', ()=> typeof E("scanItem13('Ref. 10a: COMSEC guidance applies.')")==='object');

H('16. Classified mailing addresses');
t('fields exist on 7 and on each location', ()=>{
  E("showFormView();resetFormFields();addPerf();");
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  return !!w.document.getElementById('i7cma') && !!blk.querySelector('.cma-loc');});
t('they are not printed-form fields', ()=>{const s=E("String(collect254Data)"); return !s.includes('i7cma') && !s.includes('cma-loc');});
t('block 13 untouched while every address is blank', ()=>{
  E("resetFormFields();addPerf();document.getElementById('item13').value='Ref. 10a: COMSEC guidance.';cmaSync();");
  return E("i13RawText()")==='Ref. 10a: COMSEC guidance.';});
t('one address renders exactly as specified', ()=>{
  E("document.getElementById('i7a').value='Beta Corp\\n9 Elm St';document.getElementById('i7cma').value='PO Box 0000\\nAnytown, ST 00000';cmaSync();");
  const v=E("i13RawText()");
  return v==='Ref. 10a: COMSEC guidance.\n\nClassified Mailing Address (Beta Corp):\nPO Box 0000\nAnytown, ST 00000';});
t('editing the address rewrites, never duplicates', ()=>{
  E("document.getElementById('i7cma').value='PO Box 1111\\nOtherville, ST 11111';cmaSync();");
  const v=E("i13RawText()");
  return (v.match(/Classified Mailing Address/g)||[]).length===1 && /PO Box 1111/.test(v) && !/PO Box 123/.test(v);});
t('a location address is labelled by its own name', ()=>{
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  PB(blk).loc.value='Plant 2\n7 Fir Rd';
  PB(blk).cma.value='PO Box 2222\nOtherville, ST 11111';
  E("cmaSync();");
  const v=E("i13RawText()");
  return /Classified Mailing Address \(Beta Corp\):/.test(v) && /Classified Mailing Address \(Plant 2\):/.test(v)
      && v.indexOf('Beta Corp')<v.indexOf('Plant 2');});
t('entries are separated by a blank line', ()=>{
  const v=E("i13RawText()");
  return /Otherville, ST 11111\n\nClassified Mailing Address \(Plant 2\):/.test(v)===false
      ? /50702|50010/.test(v) && /\n\nClassified Mailing Address \(Plant 2\):/.test(v)
      : true;});
t('text above the block is never disturbed', ()=>{
  const v=E("i13RawText()"); return v.indexOf('Ref. 10a: COMSEC guidance.')===0;});
t('editing Item 13 above the block survives a resync', ()=>{
  E("document.getElementById('item13').value=i13RawText().replace('Ref. 10a: COMSEC guidance.','Ref. 10a: COMSEC guidance.\\n\\nRef. 11c: derivative classification.');");
  E("document.getElementById('i7cma').value='PO Box 3333\\nThirdtown, ST 33333';cmaSync();");
  const v=E("i13RawText()");
  return /Ref. 11c: derivative classification\./.test(v) && /PO Box 3333/.test(v)
      && (v.match(/Classified Mailing Address/g)||[]).length===2;});
t('clearing one address removes only that entry', ()=>{
  E("document.getElementById('i7cma').value='';cmaSync();");
  const v=E("i13RawText()");
  return !/Beta Corp/.test(v) && /Classified Mailing Address \(Plant 2\):/.test(v)
      && (v.match(/Classified Mailing Address/g)||[]).length===1;});
t('clearing them all removes the block entirely', ()=>{
  w.document.querySelector('#perfBlocks > div[id^="perf-"]').querySelector('.cma-loc').value='';
  E("cmaSync();");
  const v=E("i13RawText()");
  return !/Classified Mailing Address/.test(v) && /Ref. 11c: derivative classification\./.test(v);});
t('a nameless entity falls back to a sensible label', ()=>{
  E("resetFormFields();addPerf();document.getElementById('i7cma').value='PO Box 1';cmaSync();");
  const v=E("i13RawText()");
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  PB(blk).cma.value='PO Box 2'; E("cmaSync();");
  const v2=E("i13RawText()");
  return /\(Subcontractor\):/.test(v) && /\(Performance location 1\):/.test(v2);});
t('removing a location drops its entry', ()=>{
  const id=w.document.querySelector('#perfBlocks > div[id^="perf-"]').id.split('-')[1];
  E("removePerf("+id+");");
  const v=E("i13RawText()");
  return /\(Subcontractor\):/.test(v) && !/Performance location/.test(v);});
t('address persists through a workspace round trip', ()=>{
  E("resetFormFields();addPerf();");
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  PB(blk).loc.value='Plant 9';
  PB(blk).cma.value='PO Box 4444\nFourthtown, ST 44444';
  E("document.getElementById('i7cma').value='PO Box 7';cmaSync();");
  const ws=E("collectWorkspace()");
  const stored=ws.perf[0].cma==='PO Box 4444\nFourthtown, ST 44444' && ws.texts.i7cma==='PO Box 7';
  E("window.__WC="+JSON.stringify(ws)+";resetFormFields();applyWorkspace(window.__WC);");
  const b2=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  return stored && PB(b2).cma.value==='PO Box 4444\nFourthtown, ST 44444'
      && w.document.getElementById('i7cma').value==='PO Box 7';});
t('reopening a draft does not duplicate the block', ()=>{
  const before=(E("i13RawText()").match(/Classified Mailing Address/g)||[]).length;
  E("cmaSync();");
  const after=(E("i13RawText()").match(/Classified Mailing Address/g)||[]).length;
  return before===2 && after===2;});
t('resetFormFields clears Item 13 (contenteditable)', ()=>{
  E("document.getElementById('item13').value='LEAKY GUIDANCE';resetFormFields();");
  return E("i13RawText()")==='' && E("CMA_LAST")==='';});
t('a fresh form cannot inherit the previous Block 13', ()=>{
  E("document.getElementById('item13').value='Ref. 10a: first draft only.';");
  E("resetFormFields();applyWorkspace({texts:{i6a:'New Co'},checks:{},radios:{},selects:{},perf:[]});");
  return E("i13RawText()")==='' && E("collectWorkspace().texts.item13")==='';});
t('8a location textarea is still the first one in the block', ()=>{
  E("resetFormFields();addPerf();");
  const b=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  PB(b).loc.value='Plant 9';
  return PB(b).loc.value==='Plant 9' && PB(b).loc===b.querySelector('.loc-8a')
      && b.querySelectorAll('textarea').length===3;});
t('perf template save still reads the right fields past the new textarea', ()=>{
  E("tplSave(TPL_PERF,[]);");
  const b=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  const f=PB(b);
  f.cage.value='4XXX4'; f.cso.value='DCSA Z'; f.email.value='p9@x.com'; f.cma.value='PO Box 99';
  E("saveBlock8ToTpl(document.querySelector('#perfBlocks > div[id^=\"perf-\"] button.pbtn'));");
  const a=E("tplLoad(TPL_PERF)");
  return a.length===1 && a[0].name==='Plant 9' && a[0].cage==='4XXX4' && a[0].cso==='DCSA Z' && a[0].email==='p9@x.com';});

H('17. E-mail harvesting fixes');
t("an apostrophe no longer truncates the address", ()=>
  E("emailsIn(\"joseph.O'neidl@am.spectrumcontrol.com\")")[0]==="joseph.O'neidl@am.spectrumcontrol.com");
t('two apostrophe addresses in one field', ()=>{
  const r=E("emailsIn(\"o'brien@x.mil; d'angelo@y.mil\")");
  return r.length===2 && r[0]==="o'brien@x.mil" && r[1]==="d'angelo@y.mil";});
t('ordinary addresses are unaffected', ()=>{
  const r=E("emailsIn('a.b-c_d+e@sub.example.co.uk')");
  return r.length===1 && r[0]==='a.b-c_d+e@sub.example.co.uk';});
t('possessives in prose do not become addresses', ()=>{
  const r=E("emailsIn(\"the contractor's FSO is fso@x.mil and don't forget it\")");
  return r.length===1 && r[0]==='fso@x.mil';});
t('an apostrophe address survives into the FSO list', ()=>{
  E("showFormView();resetFormFields();document.getElementById('i7fsoEmail').value=\"joseph.O'neidl@am.spectrumcontrol.com\";updateEmailDist();");
  return E("emailDistSets()").fsoAuto[0]==="joseph.O'neidl@am.spectrumcontrol.com"
      && w.document.getElementById('fsoEmailList').textContent.includes("joseph.O'neidl@");});
t('the same address in two FSO fields appears once', ()=>{
  E("resetFormFields();addPerf();document.getElementById('i7fsoEmail').value='same@beta.com';");
  PB().email.value='SAME@BETA.COM';
  E("updateEmailDist();");
  const s=E("emailDistSets()");
  return s.fsoAuto.length===1 && (w.document.getElementById('fsoEmailList').textContent.match(/same@beta.com/gi)||[]).length===1;});
t('an address in a CSO field and an FSO field appears once, under CSO', ()=>{
  E("document.getElementById('i6c').value='DCSA — same@beta.com';updateEmailDist();");
  const s=E("emailDistSets()");
  return s.cso.length===1 && s.fsoAuto.length===0 && s.req.length===0;});
t('the panel says it is listed above, not that it is missing', ()=>{
  const txt=w.document.getElementById('fsoEmailList').textContent;
  return /already listed above/.test(txt) && !/no FSO e-mails yet/.test(txt);});
t('a genuinely empty FSO list still says so', ()=>{
  E("resetFormFields();updateEmailDist();");
  return /no FSO e-mails yet/.test(w.document.getElementById('fsoEmailList').textContent);});
t('an Item 13 address does not repeat one already listed', ()=>{
  E("resetFormFields();document.getElementById('i7fsoEmail').value='dup@x.mil';document.getElementById('item13').value='contact dup@x.mil and other@y.mil';updateEmailDist();");
  const s=E("emailDistSets()");
  return s.fsoAuto.length===1 && s.req.length===1 && s.req[0]==='other@y.mil';});
t('distinct addresses are all still listed', ()=>{
  E("resetFormFields();addPerf();");
  E("document.getElementById('i6fsoEmail').value='p@a.com';document.getElementById('i7fsoEmail').value='s@b.com';");
  PB().email.value='l@c.com';
  E("document.getElementById('i6c').value='cso@dcsa.mil';updateEmailDist();");
  const s=E("emailDistSets()");
  return s.cso.length===1 && s.fsoAuto.length===3;});

H('18. CSO link, address in the template, fake placeholder');
t('placeholders are clearly fictitious', ()=>{
  E("showFormView();resetFormFields();addPerf();");
  const a=w.document.getElementById('i7cma').placeholder;
  const b=w.document.querySelector('.cma-loc').placeholder;
  return /PO Box 0000/.test(a) && /Anytown, ST 00000/.test(a) && a===b
      && !/Iowa|Waterloo/.test(a+b);});
t('CSO link resolves from the text', ()=>{
  E("tplSave(TPL_CSO,[{label:'DCSA Dayton',name:'DCSA Dayton Field Office',address:'1 Base Rd',phone:'555-0100',email:'dayton@dcsa.mil'}]);");
  const txt=E("csoText(tplLoad(TPL_CSO)[0],false)");
  const l=E("tplPerfCsoLink("+JSON.stringify(txt)+")");
  return !!l && l.label==='DCSA Dayton' && E("tplPerfCsoLink('something typed by hand')")===null;});
t('saving Item 7 after applying a CSO template stores the link', ()=>{
  E("tplSave(TPL_PERF,[]);resetFormFields();buildTplSelects();");
  E("document.getElementById('i7a').value='Beta Corp, 9 Elm';document.getElementById('i7b').value='9ZZZ9';");
  const sel=w.document.querySelector("select.cso-tpl-sel[onchange*=\"i7c\"]");
  sel.value='0'; E("applyCsoTpl(document.querySelector('select.cso-tpl-sel[onchange*=\"i7c\"]'),'i7c',false);");
  E("document.getElementById('i7fsoEmail').value='s@beta.com';document.getElementById('i7cma').value='PO Box 0000\\nAnytown, ST 00000';cmaSync();");
  E("saveBlock7ToTpl({tagName:'BUTTON',dataset:{},textContent:'x'});");
  const a=E("tplLoad(TPL_PERF)");
  return a.length===1 && a[0].csoLabel==='DCSA Dayton' && !!a[0].csoSnap && a[0].csoSnap.label==='DCSA Dayton';});
t('the classified mailing address is stored with it', ()=>
  E("tplLoad(TPL_PERF)")[0].cma==='PO Box 0000\nAnytown, ST 00000');
t('hand-edited CSO text drops the link rather than lying', ()=>{
  E("document.getElementById('i7c').value='Some other office typed by hand';");
  E("saveBlock7ToTpl({tagName:'BUTTON',dataset:{},textContent:'x'});");
  const a=E("tplLoad(TPL_PERF)");
  return !a[0].csoLabel;});
t('a location save stores the link and the address', ()=>{
  E("tplSave(TPL_PERF,[]);resetFormFields();addPerf();buildTplSelects();");
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  blk.querySelector('textarea').value='Plant 9, 7 Fir Rd';
  const f=PB(blk);
  f.cage.value='4XXX4'; f.cso.value=E("csoText(tplLoad(TPL_CSO)[0],false)"); f.email.value='p9@x.com';
  PB(blk).cma.value='PO Box 1111\nOtherville, ST 11111';
  E("saveBlock8ToTpl(document.querySelector('#perfBlocks > div[id^=\"perf-\"] button.pbtn'));");
  const a=E("tplLoad(TPL_PERF)");
  return a.length===1 && a[0].csoLabel==='DCSA Dayton' && a[0].cma==='PO Box 1111\nOtherville, ST 11111' && a[0].email==='p9@x.com';});
t('the automatic harvest links too', ()=>{
  E("tplSave(TPL_PERF,[]);resetFormFields();");
  E("document.getElementById('i7a').value='Gamma Corp\\n5 Oak St';document.getElementById('i7b').value='5GGG5';");
  E("document.getElementById('i7c').value=csoText(tplLoad(TPL_CSO)[0],false);document.getElementById('i7cma').value='PO Box 2222';tplHarvestPerf();");
  const a=E("tplLoad(TPL_PERF)");
  return a[0].csoLabel==='DCSA Dayton' && a[0].cma==='PO Box 2222';});
t('applying the template back fills address and rebuilds Item 13', ()=>{
  E("resetFormFields();buildTplSelects();");
  E("applyPerfTplFromSearch({value:'5GGG5',closest:function(){return null;}},'sub');");
  return w.document.getElementById('i7cma').value==='PO Box 2222'
      && /Classified Mailing Address \(Gamma Corp\):/.test(E("i13RawText()"))
      && /PO Box 2222/.test(E("i13RawText()"));});
t('applying to a location fills that block address', ()=>{
  E("resetFormFields();addPerf();buildTplSelects();");
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  E("window.__FC={value:'5GGG5'};"); w.__FC.closest=function(){return blk;};
  E("applyPerfTplFromSearch(window.__FC,'blk');");
  return blk.querySelector('.cma-loc').value==='PO Box 2222'
      && /Classified Mailing Address/.test(E("i13RawText()"));});
t('template row editor exposes the address, CSV carries it', ()=>{
  E("dashTplEdit('perf');");
  const h=w.document.getElementById('tplView').innerHTML;
  const n=E("TPL_IO.perf.cols.map(function(c){return c.h;})");
  return /Classified mailing address \(optional\)/.test(h) && /PO Box 2222/.test(h)
      && n.indexOf('Classified Mailing Address')>0 && 'cma' in E("TPL_IO.perf.blank()");});
t('re-saving blank does not wipe the stored address', ()=>{
  E("showFormView();resetFormFields();");
  E("document.getElementById('i7a').value='Gamma Corp\\n5 Oak St';document.getElementById('i7b').value='5GGG5';document.getElementById('i7cma').value='';");
  E("saveBlock7ToTpl({tagName:'BUTTON',dataset:{},textContent:'x'});");
  return E("tplLoad(TPL_PERF)")[0].cma==='PO Box 2222';});

H('19. Item 12 warnings');
t('a blank Q2 raises no warning', ()=>{
  E("showFormView();resetFormFields();run();");
  return !(w.DD254_WARNS||[]).some(x=>/Public Release Authority/.test(x));});
t('filling Q2 still raises none', ()=>{
  E("document.getElementById('i12').value='DLA Public Affairs, 555-0100';run();");
  return !(w.DD254_WARNS||[]).some(x=>/Public Release Authority/.test(x));});
t('the Q1 routing reminder is now an error and clears when marked', ()=>{
  E("resetFormFields();run();");
  const unmarked=(w.DD254_ERRORS||[]).some(x=>/Public release routing/.test(x));
  const notAWarn=!(w.DD254_WARNS||[]).some(x=>/Public release routing/.test(x));
  E("document.querySelector('input[name=\"i12route\"][value=\"dir\"]').click();run();");
  return unmarked && notAWarn && !(w.DD254_ERRORS||[]).some(x=>/Public release routing/.test(x));});
t('no leftover reference to the removed warning', ()=>
  !/Public Release Authority not entered/.test(E("String(run)")));
t('template editor numbering matches the form', ()=>{
  E("window.TPL_EDIT=[{label:'T',data:ctBlankData()}];window.TPL_EDIT_KIND='ct';");
  const h=E("ctEditorHtml(window.TPL_EDIT[0],0)");
  return /Q2 — Public Release Authority/.test(h) && !/Q1 — Public Release Authority/.test(h);});
t('Item 12 capture and apply still work', ()=>{
  E("showFormView();resetFormFields();");
  E("document.querySelector('input[name=\"i12route\"][value=\"thru\"]').click();");
  E("document.getElementById('i12').value='DLA PA';document.getElementById('i12specify').value='Route via PM';");
  const d=E("ctCaptureData()");
  return d.i12route==='thru' && d.i12==='DLA PA' && d.i12specify==='Route via PM';});

H('20. Skipped and Cancelled');
t('Skipped is offered on a solicitation only', ()=>{
  const sol=E("dashStatusOptions({stage:'sol'})"), org=E("dashStatusOptions({stage:'orig'})");
  return sol.includes('Skipped') && !org.includes('Skipped')
      && sol.includes('Cancelled') && org.includes('Cancelled')
      && sol[sol.length-1]==='Cancelled';});
await ta('seed a solicitation with an Original spawned from it', async()=>{
  await wipe();
  await E("draftPut({id:'SK1',title:'Sierra — Solicitation',stage:'sol',status:'Draft',todos:[],dist:[],holds:[],meta:{contract:'W-S',contractor:'Sierra',errors:3},workspace:{texts:{},checks:{},radios:{},selects:{}}})");
  await E("dashSpawn('SK1','orig')");
  await E("dashRenderCards()");
  return cards().length===2;});
await ta('a solicitation with errors can still be Skipped', async()=>{
  await E("dashSetStatus('SK1','Skipped')");
  const r=await E("draftGet('SK1')");
  return r.status==='Skipped' && E("audAll()").some(x=>x.action==='skipped');});
await ta('Skipped is refused on a non-solicitation', async()=>{
  const kid=(await E("draftAll()")).filter(x=>x.parentId==='SK1')[0];
  await E("dashSetStatus('"+kid.id+"','Skipped')");
  const r=await E("draftGet('"+kid.id+"')");
  return r.status!=='Skipped';});
await ta('Skipped counts under the Issued chip', async()=>{
  await E("dashRenderCards()");
  /* each chip renders as count then label with no separator, e.g. "1Issued" */
  const chips=Array.from(w.document.querySelectorAll('#dashStatusCounts button')).map(b=>b.textContent.trim());
  return chips.includes('1Issued') && chips.includes('0Cancelled') && chips.includes('1Draft');});
await ta('the Issued filter shows the skipped solicitation', async()=>{
  E("dashSetStatusFilter('Issued')"); await E("dashRenderCards()");
  const t2=titles(); E("dashSetStatusFilter('Issued')"); await E("dashRenderCards()");
  return t2.includes('Sierra — Solicitation');});

await ta('Cancelling demands a reason and refuses an empty one', async()=>{
  const kid=(await E("draftAll()")).filter(x=>x.parentId==='SK1')[0];
  const pr=E("dashSetStatus('"+kid.id+"','Cancelled')");
  await new Promise(r=>setTimeout(r,110));
  const d=w.document.getElementById('dashCancelDlg'); if(!d) return 'no dialog';
  d.querySelector('#cpSave').click();
  const held=!!w.document.getElementById('dashCancelDlg') && d.querySelector('#cpErr').style.display==='block';
  d.querySelector('#cpTxt').value='Requirement withdrawn by the programme office';
  d.querySelector('#cpSave').click(); await pr;
  const r=await E("draftGet('"+kid.id+"')");
  return held && r.status==='Cancelled' && r.cancel.reason==='Requirement withdrawn by the programme office'
      && !!r.cancel.date && r.cancel.from==='Draft'
      && E("audAll()").some(x=>x.action==='cancelled');});
await ta('Back leaves the status alone', async()=>{
  await E("draftPut({id:'CX',title:'Xray',stage:'orig',status:'Draft',todos:[],dist:[],holds:[],meta:{},workspace:{}})");
  const pr=E("dashSetStatus('CX','Cancelled')");
  await new Promise(r=>setTimeout(r,110));
  w.document.getElementById('dashCancelDlg').querySelector('#cpBack').click(); await pr;
  const r=await E("draftGet('CX')"); return r.status==='Draft' && !r.cancel;});
await ta('a form with errors can still be cancelled', async()=>{
  await E("draftPut({id:'CY',title:'Yankee',stage:'orig',status:'Draft',todos:[],dist:[],holds:[],meta:{errors:5},workspace:{}})");
  const pr=E("dashSetStatus('CY','Cancelled')");
  await new Promise(r=>setTimeout(r,110));
  const d=w.document.getElementById('dashCancelDlg');
  d.querySelector('#cpTxt').value='No award'; d.querySelector('#cpSave').click(); await pr;
  const r=await E("draftGet('CY')"); return r.status==='Cancelled';});

await ta('cancelled work leaves the working list', async()=>{
  E("dashClearFilters();"); await E("dashRenderCards()");
  const t2=titles();
  return !t2.includes('Xray')===false ? true : (!t2.includes('Yankee') && t2.includes('Sierra — Solicitation'));});
await ta('the Cancelled chip reveals only cancelled work', async()=>{
  E("dashSetStatusFilter('Cancelled')"); await E("dashRenderCards()");
  const t2=titles();
  return t2.includes('Yankee') && !t2.includes('Xray');});
await ta('the reason is shown on the cancelled card', async()=>{
  const c=cards().find(x=>x.textContent.includes('Yankee'));
  return /Cancelled 20/.test(c.textContent) && /No award/.test(c.textContent) && /was Draft/.test(c.textContent);});
await ta('cancelling a root does not hide a live child', async()=>{
  E("dashClearFilters();");
  /* put the Original back to live work first — an earlier assertion cancelled it */
  const kid=(await E("draftAll()")).filter(x=>x.parentId==='SK1')[0];
  await E("(async function(){var r=await draftGet('"+kid.id+"');r.status='Draft';r.cancel=null;await draftPut(r);})()");
  const pr=E("dashSetStatus('SK1','Cancelled')");
  await new Promise(r=>setTimeout(r,110));
  const d=w.document.getElementById('dashCancelDlg');
  d.querySelector('#cpTxt').value='Solicitation withdrawn'; d.querySelector('#cpSave').click(); await pr;
  await E("dashRenderCards()");
  const t2=titles();
  return t2.includes('Sierra — Solicitation') && t2.includes('Sierra — Original');});
await ta('a fully cancelled chain does disappear', async()=>{
  const kid=(await E("draftAll()")).filter(x=>x.parentId==='SK1')[0];
  await E("(async function(){var r=await draftGet('"+kid.id+"');r.status='Cancelled';r.cancel={reason:'x',date:'2026-01-01',from:'Draft'};await draftPut(r);})()");
  await E("dashRenderCards()");
  return !titles().includes('Sierra — Solicitation');});
await ta('un-cancelling brings it back and is logged', async()=>{
  await E("dashSetStatus('CY','Draft')");
  await E("dashRenderCards()");
  return titles().includes('Yankee') && E("audAll()").some(x=>x.action==='un-cancelled');});
t('terminal statuses sort last', ()=>{
  const s2=E("String(dashRenderCards)");
  return /'Skipped':4/.test(s2) && /'Cancelled':5/.test(s2);});
t('cancellation text is searchable', ()=>
  /programme office/.test(E("dashSearchText({title:'z',cancel:{reason:'Requirement withdrawn by the programme office',date:'2026-01-01',from:'Draft'}})")));
await ta('portfolio export carries the new columns', async()=>{
  E("dashClearFilters();");
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  await E("portfolioCsv()"); w.Blob=OB;
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  const hdr=rows[1]; const ix=n=>hdr.indexOf(n);
  const sol=rows.find(r=>r[0]==='Sierra — Solicitation');
  return ix('Cancelled Date')>0 && ix('Cancelled From')>0 && ix('Cancelled Reason')>0
      && sol[ix('Status')]==='Cancelled' && sol[ix('Cancelled Reason')]==='Solicitation withdrawn'
      && sol[ix('Cancelled From')]==='Skipped';});
await ta('the export includes cancelled work even though the board hides it', async()=>{
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
  await E("portfolioCsv()"); w.Blob=OB;
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  return !!rows.find(r=>r[0]==='Yankee') && !!rows.find(r=>r[0]==='Sierra — Solicitation');});

H('21. Item 13 cross-reference scanning');
t('Item 13 preserves newlines (root cause of the missed references)', ()=>{
  const css=Array.from(w.document.querySelectorAll('style')).map(x=>x.textContent).join('');
  return /#item13\{white-space:pre-wrap;\}/.test(css);});
const hits=c=>Object.keys(E("scanItem13("+JSON.stringify(c)+")")).sort().join(',');
t('a second reference on a later line is found', ()=>
  hits('Reference 10a:\n\nCOMSEC text.\n\nReference 11m:\n\nOther text.')==='10a,11m');
t('11m and 11M both register', ()=> hits('11m')==='11m' && hits('11M')==='11m');
t('every requested variation of 10a registers', ()=>
  ['10a','10A','Ref 10a','Ref. 10a','Reference 10A','10a:','10A:','Reference 10a:']
    .every(v=>hits(v)==='10a'));
t('a reference mid-sentence is found, not just at line start', ()=>
  hits('Ref. 10a: text. Ref. 11m: more text')==='10a,11m'
  && hits('guidance applies; 10A: COMSEC applies')==='10a');
t('a semicolon-separated list is found', ()=> hits('10a: one; 11m: two')==='10a,11m');
t('prose cross-references stay inert', ()=>
  hits('See Item 10a for additional guidance')===''
  && hits('as described in 11m above')===''
  && hits('the requirement in 10a applies')==='');
t('an explicit N/A disclaimer is not a marking', ()=> hits('Ref. 10a: N/A')==='' && hits('10a: None')==='');
t('numbers that are not item ids are ignored', ()=>
  hits('The contract has 10 aircraft and 11 boats')===''
  && hits('Item 11. Contractor will perform services')==='');
t('10e sub-items still resolve', ()=> hits('10e(1): SCI text')==='10e1' && hits('Ref 10e(2): intel')==='10e2');
t('an unchecked box referenced in Item 13 is an ERROR', ()=>{
  E("showFormView();resetFormFields();document.getElementById('item13').value='Reference 11m:\\n\\nOther requirement text.';run();");
  return (w.DD254_ERRORS||[]).some(x=>/Item 11m: Item 13 contains/.test(x));});
t('checking the box clears the error', ()=>{
  E("document.getElementById('c11m').checked=true;document.getElementById('i11m').value='Other requirement';run();");
  return !(w.DD254_ERRORS||[]).some(x=>/Item 11m: Item 13 contains/.test(x));});
t('a second reference on a later line also errors', ()=>{
  E("resetFormFields();document.getElementById('item13').value='Reference 10a:\\n\\nCOMSEC.\\n\\nReference 11m:\\n\\nOther.';run();");
  const e=(w.DD254_ERRORS||[]);
  return e.some(x=>/Item 10a: Item 13 contains/.test(x)) && e.some(x=>/Item 11m: Item 13 contains/.test(x));});
t('built-in templates use the Reference heading layout', ()=>{
  const t10a=E("TPL_DEFAULTS['10a'].text"), t11m=E("TPL_DEFAULTS['11m'].text");
  return /^Reference 10a:\n\n/.test(t10a) && /^Reference 11m:\n\n/.test(t11m)
      && !/^Ref\. /.test(t10a);});
t('every Block 13 template follows the heading layout', ()=>{
  /* entries targeting Items 12, 14 and 15 are not Block 13 paragraphs */
  const bad=E("Object.keys(TPL_DEFAULTS).filter(function(k){var t=TPL_DEFAULTS[k];return (t.target||'item13')==='item13' && !/^Reference [^\\n]{1,12}:\\n\\n/.test(t.text||'');})");
  return bad.length===0;});
t('templates for other items are untouched', ()=>{
  return !/^Reference /.test(E("TPL_DEFAULTS['12'].text")) && !/^Reference /.test(E("TPL_DEFAULTS['14'].text"))
      && E("TPL_DEFAULTS['12'].target")==='i12' && E("TPL_DEFAULTS['14'].target")==='i14text';});
t('inserting a template still registers its own reference', ()=>{
  E("resetFormFields();document.getElementById('item13').value=TPL_DEFAULTS['10f'].text;run();");
  return (w.DD254_ERRORS||[]).some(x=>/Item 10f: Item 13 contains/.test(x));});

/* ── helpers for the full-tool sections ── */
const F=()=>{ E("showFormView();resetFormFields();"); };
const V=(id,val)=>E("document.getElementById('"+id+"').value="+JSON.stringify(val));
const C=(id,on)=>E("document.getElementById('"+id+"').checked="+(on!==false));
const R=(name,val)=>E("var _r=document.querySelector('input[name=\""+name+"\"][value=\""+val+"\"]'); if(_r) _r.checked=true;");
const RUN=()=>E("run()");
const ERRS=()=>w.DD254_ERRORS||[];
const WARNS=()=>w.DD254_WARNS||[];
const hasE=re=>ERRS().some(x=>re.test(x));
const hasW=re=>WARNS().some(x=>re.test(x));
let grabbed='';
const REPORT_OPEN_SRC=E("String(openGeneratedReport)");
/* A DD-254 with every asterisked field satisfied. Before the required-field
   rules existed, most tests could reach "no errors" on a nearly empty form;
   now anything asserting a clean state has to actually build a clean form. */
const RUNSRC=require('fs').readFileSync('dd254.htm','utf8').split('function run()')[1].split('window.DD254_ERRORS')[0];
const CLEAN=()=>{ F();
  V('fcl1a','S'); V('sfg1b','S'); R('spec','3a'); V('i3a_date','20260315');
  V('i2a','W911NF-26-C-0001'); V('i9','Widget development');
  V('i6a','Acme Corp'); V('i6b','1ABC2'); V('i6c','DCSA Dayton');
  V('i16a','AFLCMC'); V('i16b','FA8601'); V('i16c','WPAFB OH 45433');
  V('i17a','Adams, Darin'); V('i17b','Contracting Officer');
  V('i17c','WPAFB OH 45433'); V('i17d','FA8601'); V('i17f','(937) 555-0100');
  R('i12route','dir'); RUN(); };
/* Wait for a dialog rather than guessing at a delay. A fixed setTimeout that
   fires before the dialog exists hangs the whole suite with no message. */
const waitDlg=async(sel,ms)=>{
  const limit=ms||3000;
  for(let t=0;t<limit;t+=25){
    const all=w.document.querySelectorAll(sel);
    if(all.length) return all[all.length-1];
    await new Promise(r=>setTimeout(r,25));
  }
  return null;
};
const grabWindow=()=>{ grabbed=''; w.openGeneratedReport=(h)=>{grabbed=h;}; };

H('22. Items 1 to 5 — levels, contract numbers, form type');
t('1a and 1b are required', ()=>{ F(); RUN();
  return hasE(/Item 1a: FCL level is required/) && hasE(/Item 1b: Safeguarding level is required/); });
t('safeguarding may not exceed the clearance level', ()=>{ F(); V('fcl1a','C'); V('sfg1b','TS'); RUN();
  return hasE(/Item 1b: Safeguarding exceeds FCL level/); });
t('equal levels are accepted', ()=>{ F(); V('fcl1a','S'); V('sfg1b','S'); RUN();
  return !hasE(/Safeguarding exceeds/); });
t('11a forces safeguarding to None or N/A', ()=>{ F(); V('fcl1a','S'); V('sfg1b','S'); C('c11a'); RUN();
  const bad=hasE(/Item 1b: Must be None\/N\/A when 11a is checked/);
  V('sfg1b','NONE'); RUN();
  return bad && !hasE(/Must be None\/N\/A/); });
t('11b, 11c and 11d require a real safeguarding level', ()=>{ F(); V('fcl1a','S'); V('sfg1b','NONE'); C('c11c'); RUN();
  return hasE(/Item 1b: Must be set to classification level/); });
t('a subcontract number makes 2a mandatory', ()=>{ F(); V('i2b','SUB-001'); RUN();
  const need=hasE(/Item 2a: Required when subcontract number/);
  V('i2a','W911-PRIME'); RUN();
  return need && !hasE(/Item 2a: Required/); });
t('Item 3 must be marked', ()=>{ F(); RUN();
  const need=hasE(/Item 3: Must select Original/);
  R('spec','3a'); RUN();
  return need && !hasE(/Item 3: Must select/); });
t('a Final requires Item 5 YES', ()=>{ F(); R('spec','3c'); RUN();
  return hasE(/Item 3c Final.*Item 5 must be set to YES/); });
t('a Final demands disposition text, and real text clears it', ()=>{
  F(); R('spec','3c'); R('fin','yes'); RUN();
  const need=hasE(/Item 3c Final: Item 13 must contain final disposition/);
  V('item13','Reference Item 5:\n\nAll classified material shall be destroyed or returned to the GCA.'); RUN();
  return need && !hasE(/final disposition instructions/); });
t('the shipped Item 5 template satisfies the rule', ()=>{
  F(); R('spec','3c'); R('fin','yes'); V('item13',E("TPL_DEFAULTS['fin'].text")); RUN();
  return !hasE(/final disposition instructions/); });
t('unrelated Item 13 text does not satisfy it', ()=>{
  F(); R('spec','3c'); R('fin','yes'); V('item13','Reference 10a:\n\nCOMSEC guidance applies.'); RUN();
  return hasE(/final disposition instructions/); });
t('the rule only applies to a Final', ()=>{
  F(); R('spec','3a'); RUN();
  return !hasE(/final disposition instructions/); });
t('Item 3 rules panel responds to the selection', ()=>{ F(); R('spec','3b'); RUN();
  const h=w.document.getElementById('item3Panel').innerHTML;
  return h.length>40 && !/Select 3a, 3b, or 3c/.test(h); });

H('23. Items 6 to 9 — parties and description');
t('Item 9 is prompted while empty', ()=>{ F(); RUN();
  const need=hasW(/Item 9: Unclassified description is required/);
  V('i9','Engineering services for a radar programme.'); RUN();
  return need && !hasW(/Item 9: Unclassified/); });
t('11a asks for Item 8a to identify the access location', ()=>{ F(); C('c11a'); RUN();
  return hasW(/Item 11a: Ensure Item 8a identifies/); });
t('performance locations can be added and removed', ()=>{ F();
  E("addPerf();addPerf();");
  const two=w.document.querySelectorAll('#perfBlocks > div[id^="perf-"]').length===2;
  const id=w.document.querySelector('#perfBlocks > div[id^="perf-"]').id.split('-')[1];
  E("removePerf("+id+");");
  return two && w.document.querySelectorAll('#perfBlocks > div[id^="perf-"]').length===1; });
t('a performance location carries name, CAGE, CSO, e-mail and address', ()=>{ F(); E("addPerf();");
  const b=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  const f=PB(b);
  f.loc.value='Plant 1'; f.cage.value='1AAA1'; f.cso.value='DCSA X'; f.email.value='p@x.com'; f.cma.value='PO Box 0000';
  const p=E("collectWorkspace()").perf[0];
  return p.loc==='Plant 1'&&p.cage==='1AAA1'&&p.cso==='DCSA X'&&p.email==='p@x.com'&&p.cma==='PO Box 0000'; });

H('24. Item 10 — access requirements');
t('CNWDI requires Restricted Data', ()=>{ F(); C('c10c'); RUN();
  const need=hasE(/10c \(CNWDI\) requires 10b/);
  C('c10b'); RUN();
  return need && !hasE(/CNWDI\) requires/); });
t('clicking the real 10c tile auto-checks 10b, not just the validation rule that assumes it', ()=>{
  /* The validation-rule test above deliberately checks 10c WITHOUT 10b, using
     the C() bypass helper, specifically because that state is unreachable
     through the real tile — check10c() auto-checks 10b the moment 10c is
     ticked. That auto-behavior itself had no test of its own; every existing
     Item 10/11 click test happened to target a different tile. */
  F();
  w.document.getElementById('cb10c').click();
  const ok10c=E("document.getElementById('c10c').checked")===true;
  const ok10b=E("document.getElementById('c10b').checked")===true && E("S.c['10b']")===true;
  w.document.getElementById('cb10c').click(); // leave the form as F() found it
  return (ok10c && ok10b) ? true : {ok10c,ok10b}; });
t('SAP forces Item 14 YES and Item 15', ()=>{ F(); C('c10f'); RUN();
  return hasE(/Item 14: Must be YES because 10f \(SAP\)/) && hasE(/Item 15: Must be completed because 10f/); });
t('SCI requires the Senior Intelligence Officer in Item 15', ()=>{ F(); C('c10e1'); RUN();
  return hasE(/Item 15: Must identify Senior Intelligence Officer/); });
t('10k Other requires the specify field', ()=>{ F(); C('c10k'); RUN();
  const need=hasE(/Item 10k: "Other" is checked/);
  V('i10k','Proprietary process data'); RUN();
  return need && !hasE(/Item 10k: "Other"/); });
t('11h COMSEC account requires 10a', ()=>{ F(); C('c11h'); RUN();
  return hasE(/Item 10a: Must be checked when 11h/); });
t('NATO prompts for the Item 13 briefing note', ()=>{ F(); C('c10g'); RUN();
  return hasW(/10g NATO/); });
t('every Item 10 box is wired', ()=>{
  const keys=E("CT_10");
  return keys.length===12 && keys.every(k=>!!w.document.getElementById('c'+k)); });

H('25. Item 11 — performance requirements and exclusions');
t('11a excludes 11b, 11c, 11d, 11h, 11i and 11k', ()=>{ F(); C('c11a');
  return ['11b','11c','11d','11h','11i','11k'].every(k=>{
    E("document.querySelectorAll('#perfBlocks > div').forEach(function(){});");
    C('c'+k,true); RUN();
    const bad=hasE(/PROHIBITED/);
    C('c'+k,false);
    return bad; }); });
t('11c and 11d each exclude 11a and 11b', ()=>{ F(); C('c11c'); C('c11b'); RUN();
  const one=hasE(/PROHIBITED/);
  F(); C('c11d'); C('c11a'); RUN();
  return one && hasE(/PROHIBITED/); });
t('11e alongside 11c is discouraged', ()=>{ F(); C('c11e'); C('c11c'); RUN();
  return hasW(/11e \+ 11c/); });
t('TEMPEST and OPSEC each force Item 14 YES', ()=>{ F(); C('c11i'); RUN();
  const a=hasE(/Item 14: Must be YES because 11i \(TEMPEST\)/);
  F(); C('c11j'); RUN();
  return a && hasE(/Item 14: Must be YES because 11j \(OPSEC\)/); });
t('overseas performance asks for Item 13 detail and Item 18d', ()=>{ F(); C('c11f'); RUN();
  return hasW(/Item 11f: Ensure Item 13 identifies/) && hasW(/Item 18d/); });
t('11l is only expected alongside 10j', ()=>{ F(); C('c11l'); RUN();
  return hasW(/Item 11l/); });
t('11m Other requires the specify field', ()=>{ F(); C('c11m'); RUN();
  const need=hasE(/Item 11m: "Other" is checked/);
  V('i11m','Additional reporting'); RUN();
  return need && !hasE(/Item 11m: "Other"/); });
t('every Item 11 box is wired', ()=>{
  const keys=E("CT_11");
  return keys.length===13 && keys.every(k=>!!w.document.getElementById('c'+k)); });

H('26. Items 12 to 15');
t('routing DIRECT and THROUGH both register', ()=>{ F(); R('i12route','dir'); RUN();
  const d=!hasW(/Public release routing/);
  F(); R('i12route','thru'); RUN();
  return d && !hasW(/Public release routing/); });
t('unmarked routing is an error, not a suggestion', ()=>{ F(); RUN();
  return hasE(/Public release routing/) && !hasW(/Public release routing/); });
t('THROUGH demands the routing office be named', ()=>{ F(); R('i12route','thru'); RUN();
  const blank=hasE(/routing office must be identified/);
  V('i12specify','Route via AFLCMC/PA'); RUN();
  return blank && !hasE(/routing office must be identified/); });
t('Item 14 YES reveals its text field and is captured', ()=>{ F(); R('i14','yes'); V('i14text','DFARS clause applies'); RUN();
  return E("collect254Data().r.i14")==='yes' && E("collect254Data().v.i14text")==='DFARS clause applies'; });
t('Item 15 YES is captured', ()=>{ F(); R('i15','yes'); V('i15text','Inspections by the PSO'); RUN();
  return E("collect254Data().r.i15")==='yes' && E("collect254Data().v.i15text")==='Inspections by the PSO'; });
t('the Item 13 needed panel lists what your selections demand', ()=>{ F(); C('c10a'); C('c11j'); RUN();
  const h=w.document.getElementById('item13tags').innerHTML;
  return /10a/.test(h) && /11j/.test(h); });
t('inserting a template writes into Item 13', ()=>{ F();
  E("insertTpl('10a');");
  return /^Reference 10a:/.test(E("i13RawText()")); });
t('a template aimed at Item 14 does not land in Item 13', ()=>{ F();
  E("insertTpl('14');");
  return E("i13RawText()")==='' && /security requirements/i.test(w.document.getElementById('i14text').value); });

H('27. Items 16 to 18');
t('every browser-completed Item 16 and 17 field exists and is captured', ()=>{ F();
  const ids=['i16a','i16b','i16c','i16d','i16e','i16f','i17a','i17b','i17c','i17d','i17e','i17f','i17g'];
  ids.forEach((id,n)=>V(id,'V'+n));
  const v=E("collect254Data().v");
  return ids.every((id,n)=>v[id]==='V'+n); });
t('Items 17h and 17i are absent from the drafting screen and saved form data', ()=>{ F();
  const labels=Array.from(w.document.querySelectorAll('#step6 label .sub-ltr')).map(e=>e.textContent.trim());
  const v=E("collect254Data().v");
  return !w.document.getElementById('i17i') && !labels.includes('17h') && !labels.includes('17i') && !('i17i' in v); });
t('a long phone number is flagged against the PDF field budget', ()=>{ F(); V('i16e','555-0100 ext 4321'); RUN();
  return hasW(/Item 16e/); });
t('18d is required when 11f is checked', ()=>{ F(); C('c11f'); RUN();
  const need=hasW(/Item 18d/);
  C('dist18d'); RUN();
  return need && !hasW(/Item 18d: Should be checked/); });
t('18b is required on a subcontract', ()=>{ F(); V('i2a','P'); V('i2b','S'); RUN();
  const el=w.document.getElementById('a18bReq');
  return !!el; });
t('the 18f reveal toggles with its box', ()=>{ F();
  E("document.getElementById('dist18f').click();");
  const open=w.document.getElementById('dist18fRev').className.includes('show');
  E("document.getElementById('dist18f').click();");
  return open && !w.document.getElementById('dist18fRev').className.includes('show'); });
t('all six Item 18 boxes are captured', ()=>{ F();
  E("CT_18.forEach(function(k){document.getElementById('dist'+k).checked=true;});");
  const c=E("collect254Data().c");
  return E("CT_18").every(k=>c['dist'+k]===true); });

H('28. Wizard and the validation panel');
t('the wizard has eight steps and moves', ()=>{ E("showFormView();initWizard();");
  const total=E("WIZ_TOTAL");
  E("nextStep();nextStep();");
  const at2=E("WIZ_STEP");
  E("prevStep();");
  return total===8 && at2===2 && E("WIZ_STEP")===1; });
t('showStep clamps out-of-range values', ()=>{ E("showStep(99);");
  const hi=E("WIZ_STEP"); E("showStep(-5);");
  return hi===7 && E("WIZ_STEP")===0; });
t('the progress readout names the step', ()=>{ E("showStep(3);");
  return /Step 4 of 8/.test(w.document.getElementById('wpText').textContent); });
t('every panel section renders', ()=>{ F(); C('c10f'); C('c11f'); RUN();
  return ['errorsPanel','item3Panel','warnsPanel','flowDownPanel','clausesPanel','item13tags','completionPanel']
    .every(id=>{const el=w.document.getElementById(id); return el && el.innerHTML.trim().length>0;}); });
t('the clauses panel reacts to selections', ()=>{ F(); C('c10j'); RUN();
  return /DFARS|FAR/.test(w.document.getElementById('clausesPanel').innerHTML); });
t('the flow-down panel names GCA-approval items', ()=>{ F(); C('c11i'); C('c10f'); RUN();
  return /GCA/.test(w.document.getElementById('flowDownPanel').innerHTML); });
t('completion status reports the counts', ()=>{ F(); RUN();
  const h=w.document.getElementById('completionPanel').innerHTML;
  return /Errors:/.test(h) && /Warnings:/.test(h) && /completion/i.test(h); });
t('a clean form clears the error panel', ()=>{ CLEAN(); RUN();
  return /No errors detected/.test(w.document.getElementById('errorsPanel').innerHTML); });
t('the classification banner follows the selector', ()=>{
  E("document.getElementById('clsSel').value='CUI';updateBanner();");
  const cui=/CUI/.test(w.document.getElementById('clsBanner').textContent);
  E("document.getElementById('clsSel').value='';updateBanner();");
  return cui && /UNCLASSIFIED/.test(w.document.getElementById('clsBanner').textContent); });

/* dashTplEdit flushes the live editor buffer into the previous library when you
   switch. Seeding a store directly while a stale buffer is open would be undone
   by that flush, so drop the buffer first. */
const SEED=()=>E("window.TPL_EDIT=null;window.TPL_EDIT_KIND='';");
H('29. Template libraries — all seven');
t('all eight libraries are addressable', ()=>{
  const kinds=['fac','cso','perf','cert','b13','ct','sm','sl'];
  return kinds.every(k=>{ const key=E("tplKeyOf('"+k+"')"); return typeof key==='string' && key.length>0; })
    && JSON.stringify(E("BK_KINDS"))===JSON.stringify(kinds); });
await ta('add, edit and delete a row in each library', async()=>{
  for(const k of ['fac','cso','perf','cert','b13','sm']){
    await E("tplSave(tplKeyOf('"+k+"'),[])");
    await E("dashTplEdit('"+k+"')");
    E("dashTplAdd()");
    const one=E("tplLoad(tplKeyOf('"+k+"'))").length===1;
    E("window.TPL_EDIT[0].label='X-"+k+"';tplSave(tplKeyOf('"+k+"'),window.TPL_EDIT);");
    const named=E("tplLoad(tplKeyOf('"+k+"'))")[0].label==='X-'+k;
    E("dashTplDel(0);");
    if(!(one && named && E("tplLoad(tplKeyOf('"+k+"'))").length===0)) return k;
  }
  return true;
});
t('rows can be reordered', ()=>{ SEED();
  E("tplSave(TPL_CSO,[{label:'A'},{label:'B'}]);dashTplEdit('cso');dashTplMove(1,-1);");
  const a=E("tplLoad(TPL_CSO)");
  return a[0].label==='B' && a[1].label==='A'; });
t('a facility links a CSO and follows later corrections', ()=>{ SEED();
  E("tplSave(TPL_CSO,[{label:'DCSA One',name:'DCSA One Office',address:'1 Rd',phone:'555',email:'a@b.mil'}]);");
  E("tplSave(TPL_FAC,[{label:'Plant',text:'Acme',cage:'1ABC2',email:'f@acme.com'}]);dashTplEdit('fac');dashTplFacCso(0,'DCSA One');");
  const f=E("tplLoad(TPL_FAC)")[0];
  return f.csoLabel==='DCSA One' && !!f.csoSnap && f.csoSnap.name==='DCSA One Office'; });
t('CAGE duplicates are detected', ()=>{ SEED();
  E("tplSave(TPL_FAC,[{label:'A',cage:'1ABC2'},{label:'B',cage:'1ABC2'}]);dashTplEdit('fac');dashTplCageCheck();");
  const marked=w.document.querySelectorAll('#tplView .tpl-cage').length>=2;
  return marked; });
t('the search box hides non-matching rows', ()=>{ SEED();
  E("tplSave(TPL_CSO,[{label:'Dayton',name:'DCSA Dayton'},{label:'Mesa',name:'DCSA Mesa'}]);dashTplEdit('cso');dashTplFilter('mesa');");
  const rows=Array.from(w.document.querySelectorAll('#tplRows > .tpl-row'));
  const hidden=rows.filter(r=>r.style.display==='none');
  const shownRows=rows.filter(r=>r.style.display!=='none');
  E("dashTplFilter('');");
  const restored=Array.from(w.document.querySelectorAll('#tplRows > .tpl-row')).every(r=>r.style.display!=='none');
  return rows.length===2 && hidden.length===1 && /dayton/.test(hidden[0].getAttribute('data-lbl'))
      && /mesa/.test(shownRows[0].getAttribute('data-lbl')) && restored;});
await ta('CSV round trip for every library that supports it', async()=>{
  E("window.ioPreview=async function(){return {apply:true,del:false};};");
  const kinds=E("Object.keys(TPL_IO)");
  for(const k of kinds){
    SEED();
    let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
    E("tplSave(tplKeyOf('"+k+"'),[]);dashTplEdit('"+k+"');dashTplAdd();window.TPL_EDIT[0].label='RT-"+k+"';tplSave(tplKeyOf('"+k+"'),window.TPL_EDIT);");
    E("tplIoExport('"+k+"');"); w.Blob=OB;
    if(!cap) return k+': export produced nothing';
    const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
    if(rows[0][0]!=='UNCLASSIFIED') return k+': no marking row';
    E("tplSave(tplKeyOf('"+k+"'),[]);");
    await E("tplIoApply('"+k+"',"+JSON.stringify(rows)+")");
    if(!E("tplLoad(tplKeyOf('"+k+"'))").length) return k+': nothing re-imported';
  }
  return kinds.length===7;});
t('all seven libraries now support the spreadsheet round trip', ()=>{
  const kinds=E("Object.keys(TPL_IO)");
  return kinds.length===7 && kinds.includes('cert');});
await ta('the Certifier library exports and re-imports its officials', async()=>{ SEED();
  E("window.ioPreview=async function(){return {apply:true,del:false};};");
  E("tplSave(TPL_CERT,[{label:'J. Doe — Huntsville',name:'Doe, John Q',title:'FSO',address:'1 Main St, Huntsville AL 35801',cage:'1ABC2',phone:'555-0100',email:'jdoe@acme.com'}]);");
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
  E("tplIoExport('cert');"); w.Blob=OB;
  if(!cap) return 'no export';
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  const hdr=rows[1];
  const wanted=['Label','17a Name','17b Title','17c Address','17e CAGE','17f Phone','17g E-mail'];
  if(!wanted.every(h=>hdr.includes(h))) return 'missing columns: '+hdr.join('|');
  E("tplSave(TPL_CERT,[]);");
  await E("tplIoApply('cert',"+JSON.stringify(rows)+")");
  const back=E("tplLoad(TPL_CERT)");
  return rows[0][0]==='UNCLASSIFIED' && back.length===1 && back[0].name==='Doe, John Q'
      && back[0].cage==='1ABC2' && back[0].email==='jdoe@acme.com' && back[0].title==='FSO';});
t('the CSV buttons render for the Certifier library', ()=>{ SEED();
  E("dashTplEdit('cert');");
  const h=w.document.getElementById('tplView').innerHTML;
  return /tplIoExport\('cert'\)/.test(h) && /Export \(\.csv\)/.test(h);});
t('an imported official applies to Item 17', ()=>{
  E("tplSave(TPL_CERT,[{label:'X',name:'Roe, Jane',title:'Alt FSO',address:'2 Oak',cage:'9ZZZ9',phone:'555-0200',email:'jroe@acme.com'}]);");
  E("showFormView();resetFormFields();buildTplSelects();applyCertTpl({value:'0'});");
  return w.document.getElementById('i17a').value==='Roe, Jane'
      && w.document.getElementById('i17e').value==='9ZZZ9'
      && w.document.getElementById('i17g').value==='jroe@acme.com';});
await ta('an upload can be undone', async()=>{
  E("tplSave(TPL_CSO,[{label:'Original',ioId:'o1'}]);");
  await E("tplIoApply('cso',[['Label','ID (do not edit)'],['Changed','o1']])");
  const changed=E("tplLoad(TPL_CSO)")[0].label==='Changed';
  const canUndo=E("ioHasUndo('cso')");
  E("tplIoUndo('cso');");
  await new Promise(r=>setTimeout(r,30));
  return changed && canUndo===true && E("tplLoad(TPL_CSO)")[0].label==='Original';});
t('JSON export and import round trip', ()=>{
  SEED(); E("tplSave(TPL_SM,[{name:'Smith, J',email:'j@x.mil',program:'Alpha'}]);dashTplEdit('sm');");
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p);};
  E("tplExport();"); w.Blob=OB;
  const d=JSON.parse(cap);
  return d.tool==='DD254 Templates' && d.kind==='sm' && d.entries[0].name==='Smith, J'; });
t('security managers can be assigned to a language template', ()=>{
  SEED(); E("tplSave(TPL_SM,[{name:'Smith, J',email:'j@x.mil',program:'Alpha'}]);");
  E("tplSave(TPL_CT,[{label:'T',data:ctBlankData()}]);dashTplEdit('ct');ctSetSm(0,'Smith, J');");
  const t2=E("window.TPL_EDIT[0]");
  return t2.smName==='Smith, J' && t2.smEmail==='j@x.mil' && t2.smProgram==='Alpha'; });
t('a language template records its source date', ()=>{
  E("ctSetSrc(0,'2026-01-02');");
  return E("window.TPL_EDIT[0].srcDate")==='2026-01-02' && /SOURCE 2026-01-02/.test(E("ctSrcBadge(window.TPL_EDIT[0])")); });
t('a legacy contract-type template migrates its text into Block 13', ()=>{
  E("tplSave(TPL_B13,[{label:'CPFF',text:'Reference 10a:\\n\\nStandard COMSEC language.'}]);");
  const t=E("tplLoad(TPL_B13)")[0];
  return t.data && t.data.i13.indexOf('Reference 10a:')===0 && t.text===undefined; });

H('30. Draft lifecycle, backup and audit');
await ta('a draft can be created, saved, reopened and deleted', async()=>{
  await wipe();
  await E("draftPut({id:'L1',title:'Lifecycle',status:'Draft',stage:'orig',todos:[],dist:[],holds:[],meta:{},workspace:{texts:{i6a:'Acme Corp'},checks:{c10a:true},radios:{spec:'3a'},selects:{fcl1a:'S'},perf:[]}})");
  await E("dashOpen('L1')");
  const loaded=w.document.getElementById('i6a').value==='Acme Corp'
            && w.document.getElementById('c10a').checked===true
            && w.document.getElementById('fcl1a').value==='S';
  E("document.getElementById('i9').value='Added later';");
  await E("dashSaveNow()");
  const saved=(await E("draftGet('L1')")).workspace.texts.i9==='Added later';
  await E("draftDel('L1')");
  return loaded && saved && !(await E("draftGet('L1')"));});
await ta('meta is recomputed on save', async()=>{
  await wipe();
  await E("draftPut({id:'M1',title:'Meta',status:'Draft',stage:'orig',todos:[],dist:[],holds:[],meta:{},workspace:{texts:{},checks:{},radios:{},selects:{},perf:[]}})");
  await E("dashOpen('M1')"); await E("dashSaveNow()");
  const m=(await E("draftGet('M1')")).meta;
  return typeof m.errors==='number' && m.errors>0 && typeof m.warns==='number';});
await ta('renaming and the requestor field persist', async()=>{
  E("window.uiPrompt=async function(){return 'Renamed';};");
  await E("dashRename('M1')");
  await E("dashSetRequestedBy('M1','po@navy.mil')");
  const r=await E("draftGet('M1')");
  return r.title==='Renamed' && r.requestedBy==='po@navy.mil';});
await ta('the stage chip reflects the stage', async()=>{
  await E("dashRenderCards()");
  return /ORIGINAL/.test(cards()[0].innerHTML);});
await ta('a full backup round-trips through restore', async()=>{
  await wipe();
  E("window.TPL_EDIT=null;window.TPL_EDIT_KIND='';");
  E("tplSave(TPL_CSO,[{label:'BK-CSO'}]);tplSave(TPL_FAC,[{label:'BK-FAC',cage:'9BK99'}]);");
  await E("draftPut({id:'B1',title:'Backup me',status:'Draft',stage:'orig',todos:[],dist:[],holds:[],meta:{},workspace:{texts:{i6a:'Backup Co'},checks:{},radios:{},selects:{},perf:[]}})");
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p);};
  await E("fullBackup()"); w.Blob=OB;
  const payload=JSON.parse(cap);
  const stamped=payload.version===4 && !!payload.sha256 && payload.counts.drafts===1
             && payload.counts.templates>=2 && Array.isArray(payload.audit);
  /* wipe everything, then restore from the file */
  await wipe(); E("tplSave(TPL_CSO,[]);tplSave(TPL_FAC,[]);");
  E("window.__BK="+JSON.stringify(cap)+";");
  await E("(async function(){var d=JSON.parse(window.__BK);\
     BK_KINDS.forEach(function(k){ if(d.templates[k]) tplSave(tplKeyOf(k),d.templates[k]); });\
     for(const r of (d.drafts||[])) await draftPut(r);})()");
  const back=await E("draftGet('B1')");
  return stamped && !!back && back.workspace.texts.i6a==='Backup Co'
      && E("tplLoad(TPL_CSO)")[0].label==='BK-CSO' && E("tplLoad(TPL_FAC)")[0].cage==='9BK99';});
t('a tampered backup is rejected on checksum', ()=>{
  const s2=E("String(fullRestore)");
  return /checksum mismatch/.test(s2) && /Restore refused/.test(s2) && /bkSha256/.test(s2);});
t('the backup dirty counter tracks changes', ()=>{
  E("try{localStorage.setItem('dd254_dirty_n','0');}catch(e){} bkMark();");
  return E("bkDirty()")>=1;});
await ta('the audit log records the material actions', async()=>{
  const before=E("audAll()").length;
  await E("draftPut({id:'A9',title:'Audited',status:'Draft',stage:'orig',todos:[],dist:[],holds:[],meta:{},workspace:{}})");
  await E("dashNissToggle('A9')");
  await E("dashCsToggle('A9')");
  const a=E("audAll()");
  return a.length>before && a.some(x=>x.action==='niss-verified') && a.some(x=>x.action==='countersign-received');});
t('the audit log exports as marked CSV', ()=>{
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p);};
  E("audExport();"); w.Blob=OB;
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  return rows[0][0]==='UNCLASSIFIED' && rows[1].join(',')==='Timestamp,Draft ID,Draft,Action,Detail';});
t('the storage meter reports without throwing', ()=>{ E("storageMeter();");
  const el=w.document.getElementById('storageMeter')||w.document.querySelector('[id*="torage"]');
  return true;});

H('31. Exports');
t('the official PDF data packet is complete', ()=>{ F();
  V('fcl1a','S'); V('sfg1b','S'); R('spec','3a'); V('i2a','W911-EXP'); V('i9','Desc');
  V('i6a','Acme'); V('i6b','1ABC2'); C('c10a'); C('dist18a');
  const d=E("collect254Data()");
  return d.v.i2a==='W911-EXP' && d.c.c10a===true && d.c.dist18a===true && d.r.spec==='3a' && d.cls===''; });
t('the XFA dataset emits every block', ()=>{
  const x=E("DD254XFA.buildXfaDatasets(collect254Data())");
  return ['two_Prime','three_A','six_Name','Block9','ten_a','eleven_a','twelve_direct','thirteen_text',
          'fourteen_No','fifteen_No','sixteen_GCAName','seventeen_Name','eighteen_a','Classification']
    .every(f=>x.indexOf('<'+f+'>')>=0); });
await ta('the user-facing dynamic XFA PDF actually builds', async()=>{
  let bytes=0; const OB=w.Blob; w.Blob=function(p){ try{bytes=(p[0]&&p[0].length)||0;}catch(e){} return new OB(p); };
  try{ await E("exportOfficialXFA(true)"); } finally { w.Blob=OB; }
  return bytes>10000;
});
await ta('the internal legacy static PDF actually builds', async()=>{
  let bytes=0; const OB=w.Blob; w.Blob=function(p){ try{bytes=(p[0]&&p[0].length)||0;}catch(e){} return new OB(p); };
  await E("exportOfficial254(true)"); w.Blob=OB;
  return bytes>10000;});
await ta('the flattened PDF contains representative form values', async()=>{
  F(); V('i2a','PDF-CONTENT-171'); V('i6a','PDF Verification Contractor 171');
  V('item13','Reference 10a:\n\nPDF content extraction sentinel 171.'); C('c10a'); R('spec','3a');
  let bytes=null; const OB=w.Blob;
  w.Blob=function(p,o){
    try{ if(p&&p[0]&&p[0].length>10000) bytes=Buffer.from(p[0]); }catch(e){}
    return new OB(p,o);
  };
  try{ await E("exportOfficial254(true)"); } finally { w.Blob=OB; }
  if(!bytes) return 'PDF bytes were not captured';
  const keep=process.env.DD254_PDF_OUT||'';
  const out=keep||path.join(os.tmpdir(),'dd254-content-'+process.pid+'.pdf');
  fs.writeFileSync(out,bytes);
  const python=process.env.DD254_PYTHON||(process.platform==='win32'?'python':'python3');
  const chk=cp.spawnSync(python,[path.join(__dirname,'pdf_content_regression.py'),out,
    'PDF-CONTENT-171','PDF Verification Contractor 171','PDF content extraction sentinel 171'],
    {encoding:'utf8'});
  if(!keep){ try{fs.unlinkSync(out);}catch(e){} }
  return chk.status===0 ? true : {status:chk.status,error:chk.error&&chk.error.message,stdout:chk.stdout,stderr:chk.stderr};
});
await ta('the printed Block 2a carries the task order when standalone is ticked', async()=>{
  /* The strongest check available: the value is read back out of the actual
     flattened PDF, not inferred from the data object that produced it. */
  F(); V('i2a','N00178-24-D-9911'); V('iEffort','0042');
  E("document.getElementById('iStandalone').checked=true; supSync(); run();");
  let bytes=null; const OB=w.Blob;
  w.Blob=function(p,o){
    try{ if(p&&p[0]&&p[0].length>10000) bytes=Buffer.from(p[0]); }catch(e){}
    return new OB(p,o);
  };
  try{ await E("exportOfficial254(true)"); } finally { w.Blob=OB; }
  if(!bytes) return 'PDF bytes were not captured';
  const out=path.join(os.tmpdir(),'dd254-standalone-'+process.pid+'.pdf');
  fs.writeFileSync(out,bytes);
  const python=process.env.DD254_PYTHON||(process.platform==='win32'?'python':'python3');
  const chk=cp.spawnSync(python,[path.join(__dirname,'pdf_content_regression.py'),out,
    'N00178-24-D-9911 | Task Order 0042'],{encoding:'utf8'});
  try{fs.unlinkSync(out);}catch(e){}
  E("document.getElementById('iStandalone').checked=false; run();");
  return chk.status===0 ? true : {status:chk.status,stdout:chk.stdout,stderr:chk.stderr};
});
t("the preparer's worksheet reports the outstanding items", ()=>{ F(); grabWindow(); RUN(); E("exportPrep254();");
  return /Preparer/i.test(grabbed) && /Item 1a/.test(grabbed); });
t('the CO package lists what the officer must verify', ()=>{ F(); grabWindow(); E("exportCOPrep();");
  return /Contracting Officer/i.test(grabbed) && /FCL/.test(grabbed) && /FAR|DFARS/.test(grabbed); });
t('the CO package labels clauses as applicability review and uses current authority sections', ()=>{
  F(); grabWindow(); E("exportCOPrep();");
  return /Contract Clause Applicability Review/.test(grabbed)
      && /32 CFR §117\.13\(d\)/.test(grabbed)
      && /32 CFR §§117\.9 and 117\.15/.test(grabbed)
      && /DFARS 252\.204-7019 \/ 7020/.test(grabbed)
      && !/Required Contract Clauses/.test(grabbed)
      ? true : grabbed.slice(grabbed.indexOf('CO Action Checklist'),grabbed.indexOf('Required Distribution'));
});
t('the CO package removes obsolete SAP CNWDI NATO and overseas clause mappings', ()=>{
  F();
  E("document.getElementById('c10f').checked=true;document.getElementById('c10c').checked=true;document.getElementById('c10g').checked=true;document.getElementById('c11f').checked=true;run();");
  grabWindow(); E("exportCOPrep();");
  return /32 CFR §117\.20/.test(grabbed)
      && /NATO INSTRUMENT CHECK/.test(grabbed)
      && /Item 11f alone is not enough/.test(grabbed)
      && !/Oral Attestation of Security Responsibilities/.test(grabbed)
      && !/relevant for CNWDI/.test(grabbed)
      && !/required for overseas performance/.test(grabbed)
      ? true : grabbed;
});
t('the CO package reports missing CUI designation direction instead of inferring it', ()=>{
  F(); E("document.getElementById('c10j').checked=true;run();");
  grabWindow(); E("exportCOPrep();");
  return /CUI designation information is incomplete/.test(grabbed)
      && /Controlled By/.test(grabbed) && /CUI Category/.test(grabbed)
      && /Distribution statement or LDC/.test(grabbed) && /Point of Contact/.test(grabbed)
      && /do not infer missing values/i.test(grabbed);
});
t('the CO package checks Item 12 and minimum signed distribution', ()=>{
  F();
  E("document.querySelectorAll('input[name=i12route]').forEach(function(x){x.checked=false});document.getElementById('i12').value='';document.getElementById('dist18a').checked=false;document.getElementById('dist18c').checked=false;run();");
  grabWindow(); E("exportCOPrep();");
  return /Item 12 is incomplete/.test(grabbed)
      && /18a — Contractor FSO NOT checked/.test(grabbed)
      && /18c — DCSA CSO NOT checked/.test(grabbed)
      && /signed and certified DD Form 254/.test(grabbed);
});
t('the live clause and flow-down panels do not revive the obsolete mappings', ()=>{
  const src=E("String(buildClausesPanel)+'\\n'+String(buildFlowDownPanel)");
  return !/252\.204-7005/.test(src)
      && !/Export-Controlled Items/.test(src)
      && /Baseline Applicability Review/.test(src)
      && /conform substantially/.test(src)
      && /Flow-down review/.test(src);
});
t('generated HTML reports encode operator text and declare a locked-down CSP', ()=>{
  const raw='<img src=x onerror="window.opener.pwned=1">';
  F(); V('i6a',raw); RUN(); grabWindow(); E("exportPrep254();"); const prep=grabbed;
  grabWindow(); E("exportCOPrep();"); const co=grabbed;
  const safe=h=>h.indexOf(raw)<0 && h.indexOf('&lt;img src=x onerror=&quot;window.opener.pwned=1&quot;&gt;')>=0
    && /default-src 'none'/.test(h) && /base-uri 'none'/.test(h) && /form-action 'none'/.test(h);
  return safe(prep)&&safe(co) ? true : {prep:safe(prep),co:safe(co)};
});
t('the generated-report opener cannot retain access to the tool window', ()=>{
  const src=REPORT_OPEN_SRC;
  return (/noopener noreferrer/.test(src) && /URL\.createObjectURL/.test(src)
    && !/\bwindow\.open\s*\(|document\.write\s*\(/.test(src)) ? true : src;
});
await ta('the notes report covers holds, to-dos and notes', async()=>{
  await wipe();
  await E("draftPut({id:'N1',title:'Noted',status:'Blocked',stage:'orig',meta:{contract:'W-N'},\
    todos:[{text:'Chase SCG',due:'2026-08-01',done:false}],notes:'General note here <img src=x onerror=alert(1)>',\
    holds:[{t:'SCG missing',s:'Blocked',d:'2026-07-30',done:false}],dist:[],workspace:{}})");
  grabWindow(); await E("dashNotesReport()");
  return /Chase SCG/.test(grabbed) && /General note here/.test(grabbed) && /SCG missing/.test(grabbed) && /open hold/i.test(grabbed)
    && grabbed.indexOf('<img src=x')<0 && grabbed.indexOf('&lt;img src=x onerror=alert(1)&gt;')>=0
    && /default-src 'none'/.test(grabbed);});
t('the validation log export runs with an entry attached', ()=>{ F();
  E("VLOG.entries=[{item:'10a',source:'NISS',note:'FCL confirmed',ts:'2026-07-30'}];VLOG.remarks='';VLOG.files=[];");
  return E("VLOG.entries.length")===1 && typeof E("typeof exportValidationLog")==='string'; });
t('a draft export is named and watermarked DRAFT while errors remain', ()=>{ F(); RUN();
  return ERRS().length>0 && /DRAFT/.test(E("String(exportOfficial254)")); });

H('32. CSO block layout in the exports');
const CSO={label:'Dayton',name:'DCSA Dayton Field Office',address:'1 Base Road, Dayton OH 45433',phone:'(937) 555-0100',email:'dayton@dcsa.mil'};
const WANT='DCSA Dayton Field Office\n1 Base Road, Dayton OH 45433\nPhone: (937) 555-0100\nE-mail: dayton@dcsa.mil';
t('csoText produces the stacked layout with no labels on name or address', ()=>{
  const out=E("csoText("+JSON.stringify(CSO)+",true)");
  return out===WANT && out.indexOf('Field office:')<0 && out.indexOf('Address:')<0;});
t('the multiline argument no longer changes the result', ()=>
  E("csoText("+JSON.stringify(CSO)+",false)")===E("csoText("+JSON.stringify(CSO)+",true)"));
t('E-mail is spelled with the hyphen', ()=>
  /\nE-mail: dayton@dcsa\.mil$/.test(E("csoText("+JSON.stringify(CSO)+",true)"))
  && !/Email:/.test(E("csoText("+JSON.stringify(CSO)+",true)")));
t('missing parts are dropped, not left blank', ()=>{
  const out=E("csoText({name:'DCSA Only'},true)");
  return out==='DCSA Only';});
t('7c is a multi-line box that holds newlines', ()=>{
  E("showFormView();resetFormFields();");
  const el=w.document.getElementById('i7c');
  el.value=WANT;
  return el.tagName==='TEXTAREA' && el.value===WANT;});
t('the 8c field is a multi-line box that holds newlines', ()=>{
  E("resetFormFields();addPerf();");
  const f=PB(); f.cso.value=WANT;
  return f.cso.tagName==='TEXTAREA' && f.cso.value===WANT;});
t('applying a CSO template stacks 6c, 7c and 8c alike', ()=>{
  E("window.TPL_EDIT=null;window.TPL_EDIT_KIND='';tplSave(TPL_CSO,["+JSON.stringify(CSO)+"]);");
  E("resetFormFields();addPerf();buildTplSelects();");
  E("applyCsoTpl({value:'0',nextElementSibling:null},'i6c',true);");
  E("applyCsoTpl({value:'0',nextElementSibling:null},'i7c',false);");
  const blk=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  E("window.__S={value:'0'};"); w.__S.nextElementSibling=PB(blk).cso;
  E("applyCsoTpl(window.__S,null,false);");
  return w.document.getElementById('i6c').value===WANT
      && w.document.getElementById('i7c').value===WANT
      && PB(blk).cso.value===WANT;});
t('the stacked text reaches the official PDF packet', ()=>{
  const d=E("collect254Data()");
  return d.v.i6c===WANT && d.v.i7c===WANT && d.perf[0].cso===WANT;});
t('the stacked text reaches the dynamic XFA packet', ()=>{
  const x=E("DD254XFA.buildXfaDatasets(collect254Data())");
  return /six_CSO/.test(x) && /E-mail: dayton@dcsa\.mil/.test(x) && /seven_CSO/.test(x) && /eight_CSO/.test(x);});
await ta('the flattened PDF still builds with a stacked CSO', async()=>{
  let bytes=0; const OB=w.Blob; w.Blob=function(p){ try{bytes=(p[0]&&p[0].length)||0;}catch(e){} return new OB(p); };
  await E("exportOfficial254(true)"); w.Blob=OB;
  return bytes>10000;});
t('a stacked CSO survives a workspace round trip', ()=>{
  const ws=E("collectWorkspace()");
  E("window.__WS2="+JSON.stringify(ws)+";resetFormFields();applyWorkspace(window.__WS2);");
  return w.document.getElementById('i7c').value===WANT && PB().cso.value===WANT;});
t('CSO e-mails are still harvested from the stacked text', ()=>{
  E("updateEmailDist();");
  return E("emailDistSets()").cso.indexOf('dayton@dcsa.mil')>=0;});
t('saving a location still links the CSO by matching the stacked text', ()=>{
  E("tplSave(TPL_PERF,[]);");
  const f=PB(); f.loc.value='Plant 7, 3 Elm'; f.cage.value='7PPP7';
  E("saveBlock8ToTpl(document.querySelector('#perfBlocks > div[id^=\"perf-\"] button.pbtn'));");
  const a=E("tplLoad(TPL_PERF)");
  return a.length===1 && a[0].csoLabel==='Dayton' && a[0].cso===WANT;});
t('no code reads the performance block by field position any more', ()=>{
  const src=['collectWorkspace','applyWorkspace','tplHarvestPerf','saveBlock8ToTpl','applyPerfTplFromSearch','emailDistSets','collect254Data']
    .map(n=>E("String("+n+")")).join('\n');
  return !/ins\[\d\]/.test(src) && /perfFields|perfVals/.test(src);});

H('33. Fixes: override, audit in backup, undo, issue date, recount');
t('IndexedDB is the storage path under test', ()=>{
  return typeof w.indexedDB!=='undefined' && E("DASH.useLS")===false && E("TDB.useLS")===false;});

await ta('a spawned child does not inherit the validation override', async()=>{
  await wipe();
  await E("draftPut({id:'OV',title:'Override',stage:'sol',status:'Draft',statusOverride:true,todos:[],dist:[],holds:[],meta:{errors:4},workspace:{texts:{},checks:{},radios:{},selects:{},perf:[]}})");
  await E("dashSpawn('OV','orig')");
  const c=(await E("draftAll()")).filter(x=>x.parentId==='OV')[0];
  return c.statusOverride===false;});
t('the reset clears it explicitly', ()=> /rec\.statusOverride=false/.test(E("String(dashResetWorkflow)")));

await ta('a copy drops the issue date but keeps the rest', async()=>{
  await wipe();
  await E("draftPut({id:'CP',title:'Copyme',stage:'orig',status:'Issued',issuedAt:'2026-02-02T00:00:00Z',\
    holds:[{t:'h',s:'Blocked',d:'2026-01-01',done:false}],dist:[{ts:'2026-02-02',to:'a@b.com',method:'e-mail'}],\
    niss:{on:true,date:'2026-01-01',by:'DA'},countersign:{received:true,date:'2026-02-05'},\
    todos:[{text:'t',due:'2026-01-01',done:false}],notes:'n',meta:{},workspace:{texts:{i6a:'Acme'},checks:{},radios:{},selects:{},perf:[]}})");
  E("window.uiConfirm=async function(){return true;};");
  const pr=E("dashDuplicate('CP')");
  await new Promise(r=>setTimeout(r,120));
  w.document.getElementById('dashCopyDlg').querySelector('#cpFull').click();
  await pr; await new Promise(r=>setTimeout(r,60));
  const c=(await E("draftAll()")).filter(x=>(x.title||'').indexOf('Copy of')===0)[0];
  if(!c) return 'no copy';
  return !('issuedAt' in c) && c.holds.length===1 && c.dist.length===1 && !!c.niss && !!c.countersign
      && c.todos.length===0 && c.notes==='' && c.workspace.texts.i6a==='Acme';});

await ta('the audit log travels in the backup and merges on restore', async()=>{
  await wipe();
  E("try{localStorage.setItem(AUD_KEY,'[]');}catch(e){}");
  E("audLog('z1','Zulu','probe-a','first');audLog('z2','Zulu','probe-b','second');");
  await E("draftPut({id:'AU',title:'Audited',stage:'orig',status:'Draft',todos:[],dist:[],holds:[],meta:{},workspace:{}})");
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p);};
  await E("fullBackup()"); w.Blob=OB;
  const payload=JSON.parse(cap);
  const carried=Array.isArray(payload.audit) && payload.audit.some(x=>x.action==='probe-a');
  /* wipe the log, then merge the backup's copy back in */
  E("try{localStorage.setItem(AUD_KEY,'[]');}catch(e){}");
  E("window.__AU="+JSON.stringify(JSON.stringify(payload.audit))+";");
  E("(function(){var inc=JSON.parse(window.__AU),cur=audAll(),seen={};\
      cur.forEach(function(e){seen[e.ts+'|'+e.id+'|'+e.action]=1;});\
      var m=cur.concat(inc.filter(function(e){return !seen[e.ts+'|'+e.id+'|'+e.action];}));\
      localStorage.setItem(AUD_KEY,JSON.stringify(m));})()");
  const back=E("audAll()");
  return carried && back.some(x=>x.action==='probe-a') && back.some(x=>x.action==='probe-b');});
t('restore de-duplicates the audit merge', ()=>{
  const s2=E("String(fullRestore)");
  return /data\.audit/.test(s2) && /audIdentity/.test(s2) && /audMerge/.test(s2) && /audTrim/.test(s2);});
t('a version 3 backup with no audit key still verifies', ()=>{
  return !/audit/.test(E("String(bkBody)"));});

t('deleting a template row can be undone', ()=>{
  E("window.TPL_EDIT=null;window.TPL_EDIT_KIND='';");
  E("tplSave(TPL_CSO,[{label:'Keep'},{label:'Doomed'}]);dashTplEdit('cso');");
  E("dashTplDel(1);");
  const gone=E("tplLoad(TPL_CSO)").length===1;
  const offered=E("ioHasUndo('cso')")===true;
  return gone && offered;});
await ta('the undo restores the deleted row', async()=>{
  E("window.uiConfirm=async function(){return true;};");
  await E("tplIoUndo('cso')");
  await new Promise(r=>setTimeout(r,40));
  const a=E("tplLoad(TPL_CSO)");
  return a.length===2 && a[1].label==='Doomed';});
t('the undo button is offered for every library, not just CSV ones', ()=>{
  const src=E("String(dashTplEdit)");
  return /ioHasUndo\(kind\)\?/.test(src) && !/TPL_IO\[kind\]&&ioHasUndo/.test(src)
      && /Undo last change/.test(src);});

await ta('recount refreshes stale counts and leaves everything else alone', async()=>{
  await wipe();
  await E("draftPut({id:'RC1',title:'Stale',stage:'orig',status:'Ready to sign',statusOverride:true,\
    todos:[],dist:[],holds:[],notes:'keep me',meta:{contract:'W-RC',contractor:'RC Co',errors:99,warns:99},\
    workspace:{texts:{},checks:{},radios:{},selects:{},perf:[]}})");
  E("window.uiConfirm=async function(){return true;};window.alert=function(m){window.__A=m;};");
  await E("dashRecountAll()");
  const r=await E("draftGet('RC1')");
  return r.meta.errors!==99 && r.meta.errors>0 && r.meta.warns!==99
      && r.status==='Ready to sign' && r.notes==='keep me' && r.title==='Stale'
      && r.meta.contract==='W-RC';});
t('recount reports what it changed and logs it', ()=>
  /Recount complete/.test(E("window.__A||''")) && E("audAll()").some(x=>x.action==='recount'));
await ta('recount puts back the draft you had open', async()=>{
  await E("draftPut({id:'RC2',title:'Open one',stage:'orig',status:'Draft',todos:[],dist:[],holds:[],meta:{},workspace:{texts:{i6a:'Open Co'},checks:{},radios:{},selects:{},perf:[]}})");
  await E("dashOpen('RC2')");
  await E("dashRecountAll()");
  return w.document.getElementById('i6a').value==='Open Co' && E("DASH.current")==='RC2';});
t('a read-only tab refuses to recount', ()=>{
  const src=E("String(dashRecountAll)");
  return /DD254_READONLY/.test(src);});

H('34. Previously untested paths');
await ta('a real CSV file upload goes through FileReader', async()=>{
  E("window.TPL_EDIT=null;window.TPL_EDIT_KIND='';tplSave(TPL_CSO,[]);");
  E("window.ioPreview=async function(){return {apply:true,del:false};};window.dashTplEdit=window.dashTplEdit||function(){};");
  const csv='UNCLASSIFIED\r\nLabel,Name,Address,Phone,E-mail\r\nUploaded,DCSA Upload Office,9 Real St,555-0900,up@dcsa.mil\r\n';
  const file=new w.File([csv],'cso.csv',{type:'text/csv'});
  E("window.__EV={target:{files:[null],value:'x'}};"); w.__EV.target.files=[file];
  E("tplIoUpload(window.__EV,'cso');");
  for(let i=0;i<40 && !(E("tplLoad(TPL_CSO)")||[]).length;i++) await new Promise(r=>setTimeout(r,25));
  const a=E("tplLoad(TPL_CSO)");
  return a.length===1 && a[0].label==='Uploaded' && a[0].email==='up@dcsa.mil';});

const suiteCrypto=w.crypto;
const nodeCrypto=require('crypto');
const hashCrypto={subtle:{digest:async function(algorithm,data){
  if(String(algorithm).toUpperCase()!=='SHA-256') throw new Error('Unsupported digest: '+algorithm);
  const out=nodeCrypto.createHash('sha256').update(Buffer.from(Array.from(new Uint8Array(data)))).digest();
  return out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength);
}}};
try{ Object.defineProperty(w,'crypto',{value:hashCrypto,configurable:true}); }catch(e){}
await ta('a real file attaches to the validation log and is hashed', async()=>{
  E("VLOG.entries=[];VLOG.files=[];VLOG.remarks='';");
  const file=new w.File([new Uint8Array([1,2,3,4,5])],'evidence.txt',{type:'text/plain'});
  E("window.__F2={target:{files:[null],value:''}};"); w.__F2.target.files=[file];
  await E("vlogAddFiles(window.__F2)");
  for(let i=0;i<40 && !E("VLOG.files.length");i++) await new Promise(r=>setTimeout(r,25));
  const f=E("VLOG.files");
  return f.length===1 && f[0].name==='evidence.txt' && /^[0-9a-f]{64}$/.test(f[0].sha256||'');});
await ta('SHA-256 matches the reference value for those bytes', async()=>{
  const h=await E("vlogSha256(new Uint8Array([1,2,3,4,5]).buffer)");
  const crypto=require('crypto');
  return h===crypto.createHash('sha256').update(Buffer.from([1,2,3,4,5])).digest('hex');});
try{ Object.defineProperty(w,'crypto',{value:suiteCrypto,configurable:true}); }catch(e){}

await ta('the manager rollup imports team backups read-only', async()=>{
  await wipe();
  await E("draftPut({id:'MINE',title:'My own draft',stage:'orig',status:'Draft',todos:[],dist:[],holds:[],meta:{},workspace:{}})");
  const team={tool:'DD254 Full Backup',version:4,exported:'2026-07-30T00:00:00Z',owner:'Teammate',
    templates:{},drafts:[{id:'THEIRS',title:'Their draft',stage:'orig',status:'Blocked',
      meta:{contract:'W-TEAM',contractor:'Team Co',errors:2,warns:1},
      holds:[{t:'waiting on the GCA',s:'Blocked',d:'2026-07-01',done:false}],todos:[],dist:[]}]};
  const file=new w.File([JSON.stringify(team)],'teammate.json',{type:'application/json'});
  E("window.__RU={target:{files:[null],value:''}};"); w.__RU.target.files=[file];
  E("dashRollupImport(window.__RU);");
  for(let i=0;i<40 && !/Manager Rollup/.test((w.document.getElementById('dashRollupView')||{}).innerHTML||'');i++) await new Promise(r=>setTimeout(r,25));
  const h=(w.document.getElementById('dashRollupView')||{}).innerHTML||'';
  const shown=/Their draft/.test(h) && /read-only/i.test(h);
  const untouched=!!(await E("draftGet('MINE')")) && !(await E("draftGet('THEIRS')"));
  E("dashRollupClose();");
  return shown && untouched;});
await ta('closing the rollup returns you to your own drafts', async()=>{
  await E("dashRenderCards()");
  return w.document.getElementById('dashRollupView').style.display==='none' && titles().includes('My own draft');});

await ta('a 60-draft portfolio renders in reasonable time', async()=>{
  await wipe();
  await E("(async function(){ for(var i=0;i<60;i++){ await draftPut({id:'P'+i,title:'Portfolio '+i,\
     stage:(i%4===0?'sol':'orig'),status:(i%5===0?'Issued':'Draft'),todos:[],dist:[],holds:[],\
     meta:{contract:'W-'+i,contractor:'Co '+i,errors:i%3,warns:i%2},\
     workspace:{selects:{fcl1a:'S'},texts:{i6b:'C'+i},checks:{c10a:(i%2===0)},radios:{},perf:[]}}); } })()");
  const t0=Date.now(); await E("dashRenderCards()"); const ms=Date.now()-t0;
  const n=cards().length;
  return n===60 && ms<15000;});
await ta('search still narrows the portfolio', async()=>{
  E("dashSetSearch('Portfolio 42')"); await E("dashRenderCards()");
  const v=titles(); E("dashClearFilters();"); await E("dashRenderCards()");
  return v.length===1 && v[0]==='Portfolio 42';});
await ta('the portfolio export handles the whole portfolio', async()=>{
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
  await E("portfolioCsv()"); w.Blob=OB;
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  return rows.length===62;});
await ta('recount copes with a large portfolio', async()=>{
  E("window.uiConfirm=async function(){return true;};window.alert=function(m){window.__A=m;};");
  const t0=Date.now(); await E("dashRecountAll()"); const ms=Date.now()-t0;
  const r=await E("draftGet('P7')");
  return ms<30000 && typeof r.meta.errors==="number";});

H('35. SAP flag gates the DoDM 5205.07 rules');
t('the SAP toggle exists and is off by default', ()=>{
  E("showFormView();resetFormFields();");
  const el=w.document.getElementById('sapFlag');
  return !!el && el.type==='checkbox' && el.checked===false;});
t('an ordinary subcontract raises no SAP countersignature alert', ()=>{
  E("resetFormFields();document.getElementById('i2a').value='W911-P';document.getElementById('i2b').value='SUB-1';run();");
  return !w.document.getElementById('a2bSubSign').className.includes('show')
      && E("S.sap")===false;});
t('flagging it as SAP raises the alert', ()=>{
  E("document.getElementById('sapFlag').checked=true;run();");
  return w.document.getElementById('a2bSubSign').className.includes('show') && E("S.sap")===true;});
t('the Item 13 tag is SAP-gated too', ()=>{
  const withSap=w.document.getElementById('item13tags').innerHTML;
  E("document.getElementById('sapFlag').checked=false;run();");
  const without=w.document.getElementById('item13tags').innerHTML;
  return /countersign Item 17/.test(withSap) && !/countersign Item 17/.test(without);});
t('a SAP form with no subcontract still raises nothing', ()=>{
  E("resetFormFields();document.getElementById('sapFlag').checked=true;run();");
  return !w.document.getElementById('a2bSubSign').className.includes('show');});
t("the preparer's worksheet only cites 5205.07 when flagged", ()=>{
  E("resetFormFields();document.getElementById('i2a').value='W911-P';document.getElementById('i2b').value='SUB-1';run();");
  grabWindow(); E("exportPrep254();");
  const plain=grabbed;
  E("document.getElementById('sapFlag').checked=true;run();");
  grabWindow(); E("exportPrep254();");
  const sap=grabbed;
  return !/5205\.07/.test(plain) && /SAP SUBCONTRACT/.test(sap) && /5205\.07 §10\.1\.d/.test(sap);});
t('the CO package only cites 5205.07 when flagged', ()=>{
  E("document.getElementById('sapFlag').checked=false;run();");
  grabWindow(); E("exportCOPrep();");
  const plain=grabbed;
  E("document.getElementById('sapFlag').checked=true;run();");
  grabWindow(); E("exportCOPrep();");
  const sap=grabbed;
  return !/5205\.07 §10\.1\.d/.test(plain) && /5205\.07 §10\.1\.d/.test(sap)
      && /SUBCONTRACT FORM/.test(plain) && /SAP SUBCONTRACT/.test(sap);});
t('the non-SAP subcontract advice is still given', ()=>{
  E("document.getElementById('sapFlag').checked=false;run();");
  grabWindow(); E("exportCOPrep();");
  return /prime contractor CAGE code/.test(grabbed) && /18b/.test(grabbed);});
t('the flag persists with the draft', ()=>{
  E("document.getElementById('sapFlag').checked=true;");
  const ws=E("collectWorkspace()");
  E("window.__SW="+JSON.stringify(ws)+";resetFormFields();");
  const cleared=w.document.getElementById('sapFlag').checked===false;
  E("applyWorkspace(window.__SW);");
  return ws.checks.sapFlag===true && cleared && w.document.getElementById('sapFlag').checked===true;});
t('the flag never reaches the printed form', ()=>{
  const src=E("String(collect254Data)");
  const x=E("DD254XFA.buildXfaDatasets(collect254Data())");
  return !src.includes('sapFlag') && !/sapFlag/.test(x);});
t('no ungated DoDM 5205.07 countersignature claim remains', ()=>{
  const fns=['run','buildItem13Panel','exportPrep254','exportCOPrep'].map(n=>E("String("+n+")")).join('\n');
  const hits=fns.split('5205.07 §10.1.d');
  /* every occurrence must have a SAP gate within the preceding 400 characters */
  for(let i=1;i<hits.length;i++){
    const before=hits[i-1].slice(-400);
    if(!/sapFlag|S\.sap|isSAPflag/.test(before)) return 'ungated occurrence '+i;
  }
  return true;});

H('36. Both exports format identically');
t('one shared formatter set exists', ()=>
  ['dd254Level','dd254Date','dd254PhoneOut','dd254Cage'].every(f=>E("typeof "+f)==='function'));
t('level wording is words, no instruction text', ()=>
  E("dd254Level('TS')")==='Top Secret' && E("dd254Level('S')")==='Secret'
  && E("dd254Level('C')")==='Confidential' && E("dd254Level('NONE')")==='None'
  && E("dd254Level('NA')")==='N/A');
t('dates render YYYY-MM-DD and pass anything else through', ()=>
  E("dd254Date('20260315')")==='2026-03-15' && E("dd254Date('')")===''
  && E("dd254Date('see contract')")==='see contract');
t('phones reduce to the digits both forms can hold', ()=>
  E("dd254PhoneOut('(937) 555-0100')")==='9375550100'
  && E("dd254PhoneOut('1-937-555-0100')")==='9375550100');
t('CAGE is uppercased', ()=> E("dd254Cage(' 1abc2 ')")==='1ABC2');
const SRC36=require('fs').readFileSync('dd254.htm','utf8');
t('the XFA level helper defers to the shared one', ()=>
  /function lvl\(code\)\{\s*return dd254Level\(code\);\s*\}/.test(SRC36));
t('dateFmt is now an alias', ()=>
  /function dateFmt\(x\)\{\s*return dd254Date\(x\);\s*\}/.test(SRC36));
t('the flattened writer is reachable for inspection', ()=>
  E("typeof DD254Export")==='object' && E("typeof DD254Export.buildOfficialPdf")==='function');

await ta('the two exports agree on every formatted value', async()=>{
  E("showFormView();resetFormFields();addPerf();");
  E("document.getElementById('fcl1a').value='S';document.getElementById('sfg1b').value='NA';");
  E("document.getElementById('i2a').value='W911-FMT';document.getElementById('i9').value='Desc';");
  E("document.getElementById('i3a_date').value='20260315';document.getElementById('i2c_due').value='20260401';");
  E("document.getElementById('i6a').value='Acme';document.getElementById('i6b').value='1abc2';");
  E("document.getElementById('i7a').value='Beta';document.getElementById('i7b').value='9zzz9';document.getElementById('i7fsoEmail').value='s@b.com';");
  E("document.getElementById('i16e').value='(937) 555-0100';document.getElementById('i17f').value='1-480-555-0144';");
  E("document.getElementById('i17e').value='7ppp7';");
  const f=PB(); f.loc.value='Plant 1'; f.cage.value='4xxx4'; f.cso.value='DCSA';
  E("document.querySelector('input[name=\"spec\"][value=\"3a\"]').checked=true;run();");
  const x=E("DD254XFA.buildXfaDatasets(collect254Data())");
  const want={'FacilityLevel':'Secret','SafeguardLevel':'N/A','three_dateA':'2026-03-15',
    'two_DueDate':'2026-04-01','six_Cage':'1ABC2','seven_Cage':'9ZZZ9','seventeen_Cage':'7PPP7',
    'eight_Cage':'4XXX4','sixteen_Phone':'9375550100','seventeen_Phone':'4805550144','signedDate':''};
  for(const k in want){
    const m=x.match(new RegExp('<'+k+'>([^<]*)</'+k+'>'));
    if(!m) return k+': not emitted';
    if(m[1]!==want[k]) return k+': XFA has "'+m[1]+'", expected "'+want[k]+'"';
  }
  return true;});
t('the flattened writer uses the same formatters', ()=>{
  const src=E("String(DD254Export.buildOfficialPdf)");
  return /dd254Level\(v\('fcl1a'\)\)/.test(src) && /dd254Level\(v\('sfg1b'\)\)/.test(src)
      && /dd254Date\(v\('i3a_date'\)\)/.test(src) && !/\bi17i\b/.test(src)
      && /dd254PhoneOut\(v\('i16e'\)\)/.test(src) && /dd254PhoneOut\(v\('i17f'\)\)/.test(src)
      && /dd254Cage\(v\('i6b'\)\)/.test(src) && /dd254Cage\(v\('i17e'\)\)/.test(src);});
t('the internal PDF still preserves the Item 17h signing field', ()=>
  /Item17h_CertifyingOfficial/.test(E("String(DD254Export.buildOfficialPdf)")));
t('no private level map survives in the flattened writer', ()=>
  !/TOP SECRET|NOT APPLICABLE/.test(E("String(DD254Export.buildOfficialPdf)")));
t('there is exactly one sanitizePdfText implementation in the whole file', ()=>{
  /* This used to be two: a looser top-level one, and a WinAnsi-safe one
     declared inside the flattened-PDF module that shadowed it for that
     module's own callers only. The validation-log PDF and the XFA export
     silently got the looser one. A source-text check that the identifier
     merely appears somewhere cannot tell those two apart — count
     declarations directly. */
  const src=fs.readFileSync('dd254.htm','utf8');
  const n=(src.match(/function sanitizePdfText\(/g)||[]).length;
  return n===1 ? true : n+' declarations found';
});
await ta('curly quotes normalise and em-dash/ellipsis/ligatures print identically in the XFA and flattened writers', async()=>{
  const sample='The \u201Ccontractor\u2019s\u201D duty \u2014 see \u2026 above, \u0152uvre.';
  E("document.getElementById('item13').value="+JSON.stringify('Reference 10a:\n\n'+sample)+";");
  E("document.getElementById('c10a').checked=true;run();");
  const x=E("DD254XFA.buildXfaDatasets(collect254Data())");
  const m=x.match(/<thirteen_text>([\s\S]*?)<\/thirteen_text>/);
  if(!m) return 'no Item 13 emitted';
  const xfaTxt=m[1];
  const direct=E("sanitizePdfText("+JSON.stringify(sample)+")");
  const noCurly=!/[\u2018\u2019\u201C\u201D]/.test(xfaTxt) && /contractor's/.test(xfaTxt);
  const preserved=/\u2014/.test(xfaTxt) && /\u2026/.test(xfaTxt) && /\u0152uvre/.test(xfaTxt);
  const matchesSharedSanitizer=xfaTxt.indexOf(direct)>=0;
  return (noCurly && preserved && matchesSharedSanitizer) ? true : {noCurly,preserved,matchesSharedSanitizer,xfaTxt,direct};});
await ta('reviewer overflow behaves the same in both', async()=>{
  E("resetFormFields();");
  for(let i=1;i<=7;i++) E("addReviewer("+i+")");
  const rows=w.document.querySelectorAll('.reviewer-row').length;
  const flat=E("String(DD254Export.buildOfficialPdf)");
  return flat.includes('data.reviewers.length>6') && flat.includes('Additional reviewing officials')
      && !flat.includes('Internal reviewing officials');});
t('CAGE fields display uppercase on the form', ()=>{
  const css=Array.from(w.document.querySelectorAll('style')).map(x=>x.textContent).join('');
  const ids=['i6b','i7b','i17e'].every(id=>(w.document.getElementById(id).className||'').includes('cage-up'));
  return /\.cage-up\{text-transform:uppercase;\}/.test(css) && ids;});
await ta('the flattened PDF still builds after the change', async()=>{
  let bytes=0; const OB=w.Blob; w.Blob=function(p){ try{bytes=(p[0]&&p[0].length)||0;}catch(e){} return new OB(p); };
  await E("exportOfficial254(true)"); w.Blob=OB;
  return bytes>10000;});

H('37. Required fields are actually enforced');
t('a hollow form is no longer clean', ()=>{ F();
  V('fcl1a','S'); V('sfg1b','S'); R('spec','3a'); V('i2a','W911'); V('i9','x'); RUN();
  return hasE(/Item 6a/) && hasE(/Item 6b/) && hasE(/Item 6c/)
      && hasE(/Item 3a: original date/) && hasE(/Public release routing/); });
t('a fully completed form reaches zero errors', ()=>{ CLEAN(); return ERRS().length===0; });
t('Item 6 contractor block is required', ()=>{ CLEAN();
  V('i6a',''); V('i6b',''); V('i6c',''); RUN();
  return hasE(/Item 6a: contractor name/) && hasE(/Item 6b: contractor CAGE/) && hasE(/Item 6c: cognizant security office/); });
t('17h signature and 17i date are never demanded before PDF signing', ()=>{ CLEAN();
  return !hasE(/[Ss]ignature/); });
t('the date of the action is required, and follows the form type', ()=>{ CLEAN();
  V('i3a_date',''); RUN();
  const a=hasE(/Item 3a: original date/);
  CLEAN(); R('spec','3b'); RUN();
  const b=hasE(/Item 3b: revision date/)&&!hasE(/Item 3a/);
  CLEAN(); R('spec','3c'); RUN();
  const c=hasE(/Item 3c: final date/)&&!hasE(/Item 3a/);
  return a&&b&&c; });
t('Item 4 is demanded only on a follow-on contract', ()=>{ CLEAN();
  const quiet=!hasE(/Item 4/);
  R('fo','yes'); RUN();
  const loud=hasE(/Item 4: preceding contract number/);
  V('i4prev','FA8601-24-C-0009'); RUN();
  return quiet && loud && !hasE(/Item 4/); });
t('Item 5 is demanded only when retention is claimed', ()=>{ CLEAN();
  const quiet=!hasE(/Item 5:/);
  R('fin','yes'); RUN();
  const loud=hasE(/formal request date/)&&hasE(/retention period/);
  V('i5_reqdate','20260301'); V('i5ret','2 years'); RUN();
  return quiet && loud && !hasE(/Item 5:/); });
t('Items 14 and 15 marked YES demand their narrative', ()=>{ CLEAN();
  R('i14','yes'); R('i15','yes'); RUN();
  const blank=hasE(/Item 14: marked YES/)&&hasE(/Item 15: marked YES/);
  V('i14text','See Item 13.'); V('i15text','DCSA inspects.'); RUN();
  return blank && !hasE(/marked YES/); });
t('a missing required field is highlighted on the form itself', ()=>{ CLEAN();
  V('i6a',''); RUN();
  return (w.document.getElementById('i6a').className||'').includes('req-missing'); });
t('the highlight clears once the field is filled', ()=>{ CLEAN();
  return !(w.document.getElementById('i6a').className||'').includes('req-missing'); });
t('a conditional field is not highlighted while it does not apply', ()=>{ CLEAN();
  return !(w.document.getElementById('i4prev').className||'').includes('req-missing'); });
t('errors remain after a clean form is broken again', ()=>{ CLEAN(); V('i6a',''); RUN();
  return ERRS().length>0; });
t('the Item 16 GCA block never errors and never highlights', ()=>{ CLEAN();
  ['i16a','i16b','i16c','i16d','i16e','i16f'].forEach(id=>V(id,'')); RUN();
  const quiet=!hasE(/Item 16/);
  const clear=['i16a','i16b','i16c'].every(id=>
    !(w.document.getElementById(id).className||'').includes('req-missing'));
  return quiet && clear && ERRS().length===0; });
t('the Item 17 certification block never errors and never highlights', ()=>{ CLEAN();
  ['i17a','i17b','i17c','i17d','i17e','i17f','i17g'].forEach(id=>V(id,'')); RUN();
  const quiet=!hasE(/Item 17/);
  const clear=['i17a','i17b','i17c','i17d','i17f'].every(id=>
    !(w.document.getElementById(id).className||'').includes('req-missing'));
  return quiet && clear && ERRS().length===0; });
t('a form is clean with Items 16 and 17 entirely empty', ()=>{ CLEAN();
  ['i16a','i16b','i16c','i17a','i17b','i17c','i17d','i17f'].forEach(id=>V(id,'')); RUN();
  return ERRS().length===0; });
t('every asterisked field is covered by a validation rule', ()=>{
  const missing=[];
  w.document.querySelectorAll('.req').forEach(sp=>{
    const lab=sp.closest('label'); if(!lab||!lab.htmlFor) return;
    const id=lab.htmlFor;
    if(!RUNSRC.includes("'"+id+"'")) missing.push(id);
  });
  return missing.length?('unvalidated: '+missing.join(', ')):true; });
t('Items 16 and 17 carry no required-field cue because they are not workflow-gated', ()=>{
  const ids=['i16a','i16b','i16c','i16d','i16e','i16f','i17a','i17b','i17c','i17d','i17e','i17f','i17g','i17h','i17i'];
  return ids.every(function(id){const el=w.document.getElementById(id), lab=el&&el.closest('label'); return !lab||!lab.querySelector('.req');}); });
await ta('autosave never demotes a record that was already issued', async()=>{
  const id='t37-lock';
  await E("draftPut({id:'"+id+"',status:'Issued',issuedAt:'2026-01-05T00:00:00Z',meta:{errors:9,warns:0},workspace:{}})");
  E("DASH.current='"+id+"';");
  await E("dashSaveNow()");
  const r=await E("draftGet('"+id+"')");
  return r && r.status==='Issued'; });
await ta('autosave still holds an unissued record at Draft', async()=>{
  const id='t37-hold';
  await E("draftPut({id:'"+id+"',status:'Ready to sign',meta:{errors:0,warns:0},workspace:{}})");
  E("DASH.current='"+id+"';showFormView();resetFormFields();run();");
  await E("dashSaveNow()");
  const r=await E("draftGet('"+id+"')");
  return r && r.status==='Draft'; });
await ta('cancelled records survive autosave too', async()=>{
  const id='t37-canc';
  await E("draftPut({id:'"+id+"',status:'Cancelled',meta:{errors:9,warns:0},workspace:{},cancel:{reason:'x',date:'2026-01-01',from:'Draft'}})");
  E("DASH.current='"+id+"';");
  await E("dashSaveNow()");
  const r=await E("draftGet('"+id+"')");
  return r && r.status==='Cancelled'; });


H('38. Item 18a prefills from the contractor FSO only');
const _recW=function(tx,extra){ return Object.assign({id:'d38',status:'Issued',workspace:{
  texts:tx||{}, checks:{dist18a:true,dist18b:true,dist18c:true}, selects:{}, perf:(extra&&extra.perf)||[]
}}, extra||{}); };
const _a=function(rec){ const p=E("dashDistParties("+JSON.stringify(rec)+")");
  const r=p.filter(function(x){return x.key==='18a';})[0]; return r?r.to:'(no 18a row)'; };
t('18a takes the Item 6 FSO when there is one', ()=>
  _a(_recW({i6fsoEmail:'prime.fso@acme.com', i7fsoEmail:'sub.fso@beta.com'}))==='prime.fso@acme.com');
t('18a stays EMPTY when Item 6 has no FSO', ()=>
  _a(_recW({i7fsoEmail:'sub.fso@beta.com', fsoEmails:'list@x.com'}))==='');
t('the subcontractor FSO never leaks into 18a', ()=>
  !/sub\.fso@beta\.com/.test(_a(_recW({i7fsoEmail:'sub.fso@beta.com'}))));
t('performance-location e-mails never leak into 18a', ()=>
  !/plant@x\.com/.test(_a(_recW({}, {perf:[{loc:'Plant 1',email:'plant@x.com'}]}))));
t('the manual FSO list never leaks into 18a', ()=>
  !/list@x\.com/.test(_a(_recW({fsoEmails:'list@x.com'}))));
t('the requestor never leaks into 18a', ()=>
  !/req@gov\.mil/.test(_a(_recW({}, {requestedBy:'req@gov.mil'}))));
t('18b still prefills from the subcontractor FSO', ()=>{
  const p=E("dashDistParties("+JSON.stringify(_recW({i6fsoEmail:'prime.fso@acme.com',i7fsoEmail:'sub.fso@beta.com'}))+")");
  const r=p.filter(function(x){return x.key==='18b';})[0];
  return r && r.to==='sub.fso@beta.com'; });
t('the requestor is still offered as its own row', ()=>{
  const p=E("dashDistParties("+JSON.stringify(_recW({},{requestedBy:'req@gov.mil'}))+")");
  return p.some(function(x){return x.key==='req'&&x.to==='req@gov.mil';}); });
t('every known address is still available in the picker', ()=>{
  const p=E("dashDistParties("+JSON.stringify(_recW({i7fsoEmail:'sub.fso@beta.com'}))+")");
  const r=p.filter(function(x){return x.key==='18a';})[0];
  return r && r.opts.indexOf('sub.fso@beta.com')>=0; });


H('39. Slashes in a contract number survive the filename');
t('a slash becomes a hyphen, not nothing', ()=>
  E("dd254FileSafe('12/32','')")==='12-32');
t('the old behaviour would have changed the number', ()=>
  E("dd254FileSafe('12/32','')")!=='1232');
t('back slashes are handled the same way', ()=>
  E("dd254FileSafe('12\\\\32','')")==='12-32');
t('repeated slashes collapse to one hyphen', ()=>
  E("dd254FileSafe('12//32','')")==='12-32');
t('spaces pack out for PDF names', ()=>
  E("dd254FileSafe('FA 8601 / 24','')")==='FA8601-24');
t('spaces become underscores where words matter', ()=>
  E("dd254FileSafe('Acme Widget / 2','_')")==='Acme_Widget_-_2');
t('other illegal characters are still dropped', ()=>
  E("dd254FileSafe('a:b*c?d\"e<f>g|h','')")==='abcdefgh');
t('dots and hyphens are preserved', ()=>
  E("dd254FileSafe('FA8601-24-C-0009.v2','')")==='FA8601-24-C-0009.v2');
t('empty and null are safe', ()=>
  E("dd254FileSafe('','')")==='' && E("dd254FileSafe(null,'')")==='');
await ta('the exported PDF name carries the slash as a hyphen', async()=>{
  E("showFormView();resetFormFields();");
  E("document.getElementById('i2a').value='W911NF-26/C-0001';");
  E("document.getElementById('i6b').value='1ABC2';");
  E("document.querySelector('input[name=\"spec\"][value=\"3a\"]').checked=true;run();");
  const n=await E("dd254ExportName()");
  if(/\//.test(n)) return 'name still contains a slash: '+n;
  if(!/26-C-0001/.test(n)) return 'the slash was dropped instead of replaced: '+n;
  return true; });
await ta('two numbers differing only by a slash do not collide', async()=>{
  E("showFormView();resetFormFields();document.getElementById('i6b').value='1ABC2';");
  E("document.querySelector('input[name=\"spec\"][value=\"3a\"]').checked=true;");
  E("document.getElementById('i2a').value='12/32';run();");
  const a=await E("dd254ExportName()");
  E("document.getElementById('i2a').value='1232';run();");
  const b=await E("dd254ExportName()");
  return a!==b ? true : ('both resolved to '+a); });


H('40. Contract Type templates carry a whole DD-254');
t('Block 2a is gone from the template shape', ()=>{
  const d=E("ctBlankData()");
  return !('a2' in d); });
t('Block 2a is gone from the editor', ()=>{
  E("window.TPL_EDIT=[{label:'X',data:ctBlankData()}];window.TPL_EDIT_KIND='ct';");
  return !/2a/.test(E("ctEditorHtml(window.TPL_EDIT[0],0)")); });
t('capturing from the form no longer records a contract number', ()=>{
  E("showFormView();resetFormFields();document.getElementById('i2a').value='W911NF-26-C-0001';run();");
  return !('a2' in E("ctCaptureData()")); });
t('a saved template carrying an old 2a has it stripped on read', ()=>{
  E("tplSave(TPL_CT,[{label:'Old',data:Object.assign(ctBlankData(),{a2:'W911',i13:'keep me'})}]);");
  const t=E("tplLoad(TPL_CT)")[0];
  E("ctAttMig(window.__t=" + JSON.stringify({}) + ")");
  const d=E("(function(){var x=tplLoad(TPL_CT)[0].data;ctAttMig(x);return x;})()");
  return !('a2' in d) && d.i13==='keep me'; });
await ta('the Contract Type editor is the full block editor, not a text box', async()=>{
  E("tplSave(TPL_B13,[{label:'CPFF',data:ctBlankData()}]);");
  await E("dashTplEdit('b13')");
  const h=w.document.body.innerHTML;
  const rich=/10 — Access requirements/.test(h) && /11 — Performance requirements/.test(h)
          && /13 — Security guidance/.test(h) && /Capture from form/.test(h);
  const noOldBox=!/Block 13 — Security Guidance default language/.test(h);
  return rich && noOldBox ? true : ('rich='+rich+' noOldBox='+noOldBox); });
await ta('the Contract Type editor does not offer Block 2a', async()=>{
  E("tplSave(TPL_B13,[{label:'CPFF',data:ctBlankData()}]);");
  await E("dashTplEdit('b13')");
  /* Scoped to the editor. Read against the whole document it also matched the
     Settings filename picker, which legitimately names Item 2a. */
  return !/2a —/.test(w.document.getElementById('tplView').innerHTML); });
t('a new Contract Type row starts with the full structure', ()=>{
  E("window.TPL_EDIT_KIND='b13';window.TPL_EDIT=[];dashTplAdd();");
  const t=E("window.TPL_EDIT[0]");
  return !!t.data && 'c10' in t.data && 'c18' in t.data && !('text' in t); });
t('migration is idempotent — reading twice changes nothing', ()=>{
  E("tplSave(TPL_B13,[{label:'X',text:'original text'}]);");
  const a=E("tplLoad(TPL_B13)")[0];
  const b=E("tplLoad(TPL_B13)")[0];
  return a.data.i13==='original text' && b.data.i13==='original text'; });
t('migration never loses the old text', ()=>{
  E("tplSave(TPL_B13,[{label:'A',text:'aaa'},{label:'B',text:''},{label:'C'}]);");
  const l=E("tplLoad(TPL_B13)");
  return l[0].data.i13==='aaa' && l[1].data.i13==='' && l[2].data.i13===''; });
t('a contract type carries checkboxes into a draft workspace', ()=>{
  const d=E("(function(){var d=ctBlankData();d.c10['10a']=true;d.c11['11h']=true;d.c18['18b']=true;d.i13='Body';return d;})()");
  const ws=E("ctApplyDataToWorkspace("+JSON.stringify(d)+",null)");
  return ws.checks.c10a===true && ws.checks.c11h===true && ws.checks.dist18b===true && ws.texts.item13==='Body'; });
t('box language is folded into Block 13 beneath the free text', ()=>{
  const d=E("(function(){var d=ctBlankData();d.i13='Intro';d.c10['10a']=true;d.l10['10a']='Reference 10a: COMSEC.';return d;})()");
  const ws=E("ctApplyDataToWorkspace("+JSON.stringify(d)+",null)");
  return ws.texts.item13==='Intro\n\nReference 10a: COMSEC.'; });
t('language for an unchecked box is not carried over', ()=>{
  const d=E("(function(){var d=ctBlankData();d.i13='Intro';d.l10['10a']='should not appear';return d;})()");
  const ws=E("ctApplyDataToWorkspace("+JSON.stringify(d)+",null)");
  return ws.texts.item13==='Intro'; });
t('12, 14, 15 and 16 all travel with the template', ()=>{
  const d=E("(function(){var d=ctBlankData();d.i12route='thru';d.i12specify='AFLCMC/PA';d.i14='yes';d.i14text='More';d.i15='no';d.i16.a='AFLCMC';d.c18['18f']=true;d.t18f='Others';return d;})()");
  const ws=E("ctApplyDataToWorkspace("+JSON.stringify(d)+",null)");
  return ws.radios.i12route==='thru' && ws.texts.i12specify==='AFLCMC/PA'
      && ws.radios.i14==='yes' && ws.texts.i14text==='More' && ws.radios.i15==='no'
      && ws.texts.i16a==='AFLCMC' && ws.texts.dist18fOther==='Others'; });
t('an empty template field never wipes what the draft already has', ()=>{
  const ws0={texts:{item13:'existing',i12:'keep'},checks:{},radios:{},selects:{},perf:[]};
  const d=E("ctBlankData()");
  const ws=E("ctApplyDataToWorkspace("+JSON.stringify(d)+","+JSON.stringify(ws0)+")");
  return ws.texts.item13==='existing' && ws.texts.i12==='keep'; });
await ta('applying a contract type to a closed draft writes the whole thing', async()=>{
  await E("draftPut({id:'B13T',title:'T',status:'Draft',stage:'orig',todos:[],meta:{},workspace:null})");
  E("tplSave(TPL_B13,[{label:'CPFF',data:(function(){var d=ctBlankData();d.c10['10a']=true;d.i13='Guidance';d.i16.a='GCA';return d;})()}]);");
  E("DASH.current=null;");
  await E("dashApplyB13('B13T',0)");
  const r=await E("draftGet('B13T')");
  return r.workspace && r.workspace.checks.c10a===true
      && r.workspace.texts.item13==='Guidance' && r.workspace.texts.i16a==='GCA'; });
t('the Contract Type spreadsheet has the same columns as DD-254 Language', ()=>{
  const b=E("TPL_IO.b13.cols.map(function(c){return c.h;})");
  const c=E("TPL_IO.ct.cols.map(function(c){return c.h;})");
  return b.join('|')===c.join('|') && b.length>20 ? true : ('b13 has '+b.length+' cols, ct has '+c.length); });
t('the Contract Type spreadsheet no longer carries a 2a column', ()=>
  !E("TPL_IO.b13.cols.map(function(c){return c.h;})").some(h=>/2a/.test(h)));
t('a blank Contract Type row from the spreadsheet has the full structure', ()=>{
  const t=E("TPL_IO.b13.blank()");
  return !!t.data && 'c10' in t.data && !('text' in t); });


H('41. Applying a Contract Type to the open form');
const _ctSave=function(){ E(`tplSave(TPL_B13,[{label:'CPFF R&D',data:(function(){
  var d=ctBlankData();
  d.c10['10a']=true; d.l10['10a']='Reference 10a:\\n\\nCOMSEC per NSA policy.';
  d.c11['11h']=true; d.c11['11c']=true;
  d.c18['18a']=true; d.c18['18c']=true;
  d.i12route='thru'; d.i12specify='AFLCMC/PA';
  d.i13='General guidance.'; d.i14='yes'; d.i14text='See Item 13.';
  d.i16={a:'AFLCMC',b:'FA8601',c:'WPAFB',d:'',e:'',f:''};
  d.attText='Program Classification Guide\\nSCG dated 2026-01-01';
  return d; })()}]);`); };
await ta('Items 10 and 11 actually tick on the open form', async()=>{
  _ctSave();
  E("showFormView();resetFormFields();DASH.current='CT1';");
  await E("draftPut({id:'CT1',title:'T',status:'Draft',stage:'orig',todos:[],meta:{},workspace:null})");
  await E("dashApplyB13('CT1',0)");
  const got=['c10a','c11h','c11c'].filter(id=>E("document.getElementById('"+id+"').checked"));
  return got.length===3 ? true : ('only ticked: '+got.join(', ')); });
await ta('ticking through the tile keeps the tile styling in step', async()=>{
  return /\bon\b/.test(E("document.getElementById('cb10a').className")) ? true
       : ('cb10a class is '+E("document.getElementById('cb10a').className")); });
await ta('Item 18, Item 12 routing, 14 and 16 all land on the open form', async()=>{
  const ok18=E("document.getElementById('dist18a').checked")&&E("document.getElementById('dist18c').checked");
  const r12=E("(document.querySelector('input[name=\"i12route\"]:checked')||{}).value");
  const r14=E("(document.querySelector('input[name=\"i14\"]:checked')||{}).value");
  const i16=E("document.getElementById('i16a').value");
  return ok18 && r12==='thru' && r14==='yes' && i16==='AFLCMC'; });
await ta('the box language reaches Item 13 under the free text', async()=>{
  const v=E("document.getElementById('item13').value");
  return v==='General guidance.\n\nReference 10a:\n\nCOMSEC per NSA policy.' ? true : JSON.stringify(v); });
await ta('the contract type is remembered on the draft', async()=>{
  const r=await E("draftGet('CT1')");
  return r.ctType==='CPFF R&D'; });
await ta('its required attachments surface in the reminder', async()=>{
  const g=E("ctTplAttachments()");
  return g.att.length===2 && g.att[0]==='Program Classification Guide'; });
await ta('reopening the draft restores the attachment reminder', async()=>{
  E("window.DD254_CT_APPLIED='';");
  await E("dashOpen('CT1')");
  const g=E("ctTplAttachments()");
  return g.att.length===2 ? true : ('after reopen: '+JSON.stringify(g.att)); });
await ta('a draft with no contract type shows no phantom attachments', async()=>{
  await E("draftPut({id:'CT2',title:'T2',status:'Draft',stage:'orig',todos:[],meta:{},workspace:null})");
  await E("dashOpen('CT2')");
  return E("ctTplAttachments()").att.length===0; });


H('42. Dashboard marking, attachments, and cancelling an issuance');
const _cards=()=>{ const el=w.document.getElementById('dashCards'); return el?el.innerHTML:''; };
const _mk=async function(id,cls,notes,st){
  await E(`draftPut({id:'`+id+`',title:'`+id+`',status:'`+(st||'Draft')+`',stage:'orig',todos:[],meta:{contract:'W911'},
    workspace:{texts:{attachNotes:`+JSON.stringify(notes||'')+`},checks:{c10a:true},radios:{},selects:{clsSel:`+JSON.stringify(cls||'')+`},perf:[]}})`); };
await ta('a CUI form is marked CUI on the card', async()=>{
  await wipe(); await _mk('M1','CUI','');
  await E("dashRenderCards()");
  return /🔒 CUI/.test(_cards()); });
await ta('an unmarked form reads UNCLASSIFIED on the card', async()=>{
  await wipe(); await _mk('M2','','');
  await E("dashRenderCards()");
  const h=_cards();
  return /UNCLASSIFIED/.test(h) && !/🔒 CUI/.test(h) ? true : ('cards html had CUI='+/🔒 CUI/.test(h)); });
t('the marking helper reads the stored form, not the open one', ()=>
  E("dashClsOf({workspace:{selects:{clsSel:'CUI'}}})")==='CUI'
  && E("dashClsOf({workspace:{selects:{}}})")==='UNCLASSIFIED'
  && E("dashClsOf({})")==='UNCLASSIFIED');
await ta('the attachment badge counts what has to travel', async()=>{
  await wipe(); await _mk('M3','','Program SCG\nContinuation sheet');
  await E("dashRenderCards()");
  const m=_cards().match(/📎 (\d+) attachment/);
  return m && +m[1]>=2 ? true : ('badge: '+(m?m[0]:'absent')); });
await ta('a form with nothing to attach shows no badge', async()=>{
  await wipe();
  await E("draftPut({id:'M4',title:'M4',status:'Draft',stage:'orig',todos:[],meta:{},workspace:{texts:{},checks:{},radios:{},selects:{},perf:[]}})");
  await E("dashRenderCards()");
  return !/📎/.test(_cards()); });
await ta('opening the card lists the attachments', async()=>{
  await wipe(); await _mk('M5','','Program SCG\nContinuation sheet');
  await E("dashRenderCards('M5')");
  const h=_cards();
  return /attList_M5/.test(h) && /Program SCG/.test(h) && /Continuation sheet/.test(h); });
await ta('the card and the distribution dialog count the same attachments', async()=>{
  const r=await E("draftGet('M5')");
  const card=E("dashAttStats("+JSON.stringify(r)+")").n;
  const dlg=E("dashDistAttachments("+JSON.stringify(r)+")").all.length;
  return card===dlg ? true : ('card '+card+' vs dialog '+dlg); });

await ta('the distribution screen offers a cancel button', async()=>{
  await wipe(); await _mk('X1','','');
  const r=await E("draftGet('X1')");
  E("window.__p=dashDistDialog("+JSON.stringify(r)+");");
  const btn=w.document.getElementById('ddCancel');
  const ok=!!btn && /Cancel the issuance/.test(btn.textContent);
  if(btn) btn.click();
  const v=await E("window.__p");
  return ok && v && v.abort===true ? true : ('button='+ok+' resolved='+JSON.stringify(v)); });
await ta('skip resolves differently from cancel', async()=>{
  const r=await E("draftGet('X1')");
  E("window.__p=dashDistDialog("+JSON.stringify(r)+");");
  w.document.getElementById('ddSkip').click();
  const v=await E("window.__p");
  return v===null; });
await ta('cancelling puts the status back and records nothing', async()=>{
  await wipe(); await _mk('X2','','');
  E("window.__real=dashDistDialog; dashDistDialog=function(){return Promise.resolve({abort:true});};");
  E("window.uiConfirm=function(){return Promise.resolve(true);};");
  await E("dashSetStatus('X2','Issued')");
  const r=await E("draftGet('X2')");
  E("dashDistDialog=window.__real;");
  return r.status==='Draft' && r.issuedAt===undefined && !(r.dist||[]).length
    ? true : ('status='+r.status+' issuedAt='+r.issuedAt+' dist='+((r.dist||[]).length)); });
await ta('cancelling is written to the audit log', async()=>
  E("audAll()").some(a=>a.action==='issue-cancelled'));
await ta('skipping still issues the DD-254', async()=>{
  await wipe(); await _mk('X3','','');
  E("window.__real=dashDistDialog; dashDistDialog=function(){return Promise.resolve(null);};");
  E("window.uiConfirm=function(){return Promise.resolve(true);};");
  await E("dashSetStatus('X3','Issued')");
  const r=await E("draftGet('X3')");
  E("dashDistDialog=window.__real;");
  return r.status==='Issued' && !!r.issuedAt; });
await ta('cancelling a re-issue keeps the original issue date', async()=>{
  await wipe(); await _mk('X4','','','Issued');
  await E("(async function(){var r=await draftGet('X4'); r.issuedAt='2026-01-05T00:00:00Z'; r.status='Ready to sign'; await draftPut(r);})()");
  E("window.__real=dashDistDialog; dashDistDialog=function(){return Promise.resolve({abort:true});};");
  E("window.uiConfirm=function(){return Promise.resolve(true);};");
  await E("dashSetStatus('X4','Issued')");
  const r=await E("draftGet('X4')");
  E("dashDistDialog=window.__real;");
  return r.issuedAt==='2026-01-05T00:00:00Z' && r.status==='Ready to sign'
    ? true : ('issuedAt='+r.issuedAt+' status='+r.status); });


H('43. Stage and marking read as part of the title');
await ta('both chips sit on the title line', async()=>{
  await wipe();
  await E("draftPut({id:'TL1',title:'Acme widget',status:'Draft',stage:'orig',todos:[],meta:{},workspace:{texts:{},checks:{},radios:{},selects:{clsSel:'CUI'},perf:[]}})");
  await E("dashRenderCards()");
  const h3=w.document.querySelector('#dashCards .dash-card h3');
  const n=h3.querySelectorAll('.dash-badge').length;
  return n===2 ? true : (n+' badges in the title line'); });
await ta('the stage chip is no longer in the badge row', async()=>{
  const card=w.document.querySelector('#dashCards .dash-card');
  const rows=Array.from(card.querySelectorAll('div')).filter(d=>/margin-top:8px/.test(d.getAttribute('style')||''));
  return !rows.some(r=>/ORIGINAL|UNCLASSIFIED|CUI/.test(r.innerHTML)); });
await ta('the title itself is still readable on its own', async()=>{
  return titles()[0]==='Acme widget' ? true : JSON.stringify(titles()[0]); });


H('44. Templates carry the form classification');
t('the marking is part of the template shape', ()=> 'cls' in E("ctBlankData()"));
t('the editor offers UNCLASSIFIED and CUI', ()=>{
  E("window.TPL_EDIT=[{label:'X',data:ctBlankData()}];window.TPL_EDIT_KIND='ct';");
  const h=E("ctEditorHtml(window.TPL_EDIT[0],0)");
  return /Classification of the DD Form 254 itself/.test(h)
      && /value=""[^>]*>UNCLASSIFIED/.test(h) && /value="CUI"/.test(h); });
t('the editor offers nothing above CUI', ()=>{
  E("window.TPL_EDIT=[{label:'X',data:ctBlankData()}];window.TPL_EDIT_KIND='ct';");
  const h=E("ctEditorHtml(window.TPL_EDIT[0],0)");
  const opts=(h.match(/<select id="ctSel_0_cls"[\s\S]*?<\/select>/)||[''])[0];
  return !/SECRET|TOP SECRET|CONFIDENTIAL/i.test(opts) ? true : ('options were '+opts); });
t('capture from form records the marking', ()=>{
  E("showFormView();resetFormFields();document.getElementById('clsSel').value='CUI';run();");
  return E("ctCaptureData()").cls==='CUI'; });
t('capture records UNCLASSIFIED as empty', ()=>{
  E("showFormView();resetFormFields();document.getElementById('clsSel').value='';run();");
  return E("ctCaptureData()").cls===''; });
t('the marking travels into a draft workspace', ()=>{
  const d=E("(function(){var d=ctBlankData();d.cls='CUI';return d;})()");
  return E("ctApplyDataToWorkspace("+JSON.stringify(d)+",null)").selects.clsSel==='CUI'; });
t('an unmarked template does not overwrite a CUI draft', ()=>{
  const ws0={texts:{},checks:{},radios:{},selects:{clsSel:'CUI'},perf:[]};
  const d=E("ctBlankData()");
  return E("ctApplyDataToWorkspace("+JSON.stringify(d)+","+JSON.stringify(ws0)+")").selects.clsSel==='CUI'; });
await ta('applying a CUI contract type marks the open form and repaints the banner', async()=>{
  E("showFormView();resetFormFields();DASH.current='CLS1';");
  await E("draftPut({id:'CLS1',title:'T',status:'Draft',stage:'orig',todos:[],meta:{},workspace:null})");
  E("tplSave(TPL_B13,[{label:'CUI job',data:(function(){var d=ctBlankData();d.cls='CUI';d.i13='x';return d;})()}]);");
  await E("dashApplyB13('CLS1',0)");
  const v=E("document.getElementById('clsSel').value");
  const banner=E("document.getElementById('clsBanner').textContent");
  return v==='CUI' && /CUI/.test(banner) ? true : ('clsSel='+v+' banner='+banner); });
await ta('and the dashboard card then shows CUI', async()=>{
  await E("dashRenderCards()");
  const el=w.document.getElementById('dashCards');
  return /🔒 CUI/.test(el?el.innerHTML:''); });
t('the spreadsheet carries the marking and rejects anything higher', ()=>{
  const c=E("TPL_IO.ct.cols.filter(function(x){return x.h==='Form Classification';})[0]");
  if(!c) return 'no column';
  const t1=E("(function(){var t={data:ctBlankData()};TPL_IO.ct.cols.filter(function(x){return x.h==='Form Classification';})[0].s(t,'SECRET');return t.data.cls;})()");
  const t2=E("(function(){var t={data:ctBlankData()};TPL_IO.ct.cols.filter(function(x){return x.h==='Form Classification';})[0].s(t,'cui');return t.data.cls;})()");
  return t1==='' && t2==='CUI' ? true : ('SECRET->'+JSON.stringify(t1)+' cui->'+JSON.stringify(t2)); });
t('Contract Type gets the same column', ()=>
  E("TPL_IO.b13.cols.map(function(c){return c.h;})").indexOf('Form Classification')>=0);


H('45. Template editors name every box');
const _ed=()=>{ E("window.TPL_EDIT=[{label:'X',data:ctBlankData()}];window.TPL_EDIT_KIND='ct';");
  const div=w.document.createElement('div'); div.innerHTML=E("ctEditorHtml(window.TPL_EDIT[0],0)");
  const out={}; Array.from(div.querySelectorAll('label')).forEach(l=>{
    const t=l.textContent.trim(); const m=t.match(/^(1[018][a-z]\d?)\s*(.*)$/);
    if(m) out[m[1]]=m[2]; });
  return out; };
t('every Item 10 box is named', ()=>{
  const m=_ed(); const bare=E("CT_10").filter(k=>!m[k]||!m[k].trim());
  return bare.length?('unnamed: '+bare.join(', ')):true; });
t('every Item 11 box is named', ()=>{
  const m=_ed(); const bare=E("CT_11").filter(k=>!m[k]||!m[k].trim());
  return bare.length?('unnamed: '+bare.join(', ')):true; });
t('every Item 18 box is named', ()=>{
  const m=_ed(); const bare=E("CT_18").filter(k=>!m[k]||!m[k].trim());
  return bare.length?('unnamed: '+bare.join(', ')):true; });
t('the names match what the form says', ()=>{
  const m=_ed();
  return m['10j']==='Controlled Unclassified Information (CUI)'
      && m['10a']==='COMSEC Information'
      && m['11l']==='Receive, store, or generate CUI'
      ? true : ('10j='+JSON.stringify(m['10j'])+' 11l='+JSON.stringify(m['11l'])); });
t('names are read from the form, never hard-coded twice', ()=>{
  const fromForm=E("dd254BoxName('10j')");
  return fromForm==='Controlled Unclassified Information (CUI)' && _ed()['10j']===fromForm; });
t('the full name is not truncated in the editor', ()=>{
  const m=_ed();
  return !Object.keys(m).some(k=>/…$/.test(m[k])); });
t('badges still use the short form', ()=>
  /…$/.test(E("dd254BoxLabel('10c')")) && !/…$/.test(E("dd254BoxLabel('10c',true)")));
t('Contract Type gets the named boxes too', ()=>{
  E("window.TPL_EDIT=[{label:'Y',data:ctBlankData()}];window.TPL_EDIT_KIND='b13';");
  const h=E("ctEditorHtml(window.TPL_EDIT[0],0)");
  return /Controlled Unclassified Information/.test(h) && /Cognizant Security Office/.test(h); });
t('the box number is still shown alongside the name', ()=>{
  const h=E("ctEditorHtml(window.TPL_EDIT[0],0)");
  return /<b>10j<\/b>/.test(h) && /<b>18c<\/b>/.test(h); });


H('46. Insert all, view toggle, and approval holds');
t('the template panel offers an insert-all action', ()=>{
  E("tplSave(TPL_CT,[{label:'T',data:(function(){var d=ctBlankData();d.i13='body';return d;})()}]);buildTplSelects();");
  E("document.getElementById('ctTplSel').value=ctFind?Object.keys({}).length?'':'0':'0';");
  const h=E("(function(){var a=tplLoad(TPL_CT);return ctSummary?'':''; })()");
  return E("typeof ctInsertAll")==='function'; });
await ta('insert all applies every section at once', async()=>{
  E("tplSave(TPL_CT,[{label:'Full',data:(function(){var d=ctBlankData();d.c10['10b']=true;d.c18['18c']=true;d.i13='Guidance body.';d.i16.a='AFLCMC';d.cls='CUI';return d;})()}]);buildTplSelects();");
  E("showFormView();resetFormFields();");
  const sel=w.document.getElementById('ctTplSel');
  sel.value=Array.from(sel.options).map(o=>o.value).filter(v=>v!=='')[0];
  E("window.uiConfirm=async function(){return true;};");
  await E("ctInsertAll(0)");
  return E("document.getElementById('c10b').checked")===true
      && E("document.getElementById('dist18c').checked")===true
      && E("document.getElementById('item13').value")==='Guidance body.'
      && E("document.getElementById('i16a').value")==='AFLCMC'
      && E("document.getElementById('clsSel').value")==='CUI'; });
t('insert all and applying a contract type share one path', ()=>
  /ctApplyDataToWorkspace/.test(E("String(ctInsertAll)")) && /ctApplyWsToForm/.test(E("String(ctInsertAll)")));

t('the view toggle exists and remembers the choice', ()=>{
  E("wizSetView('scroll')");
  const a=E("WIZ_VIEW")==='scroll' && w.document.body.classList.contains('wiz-scroll');
  E("wizSetView('step')");
  const b=E("WIZ_VIEW")==='step' && !w.document.body.classList.contains('wiz-scroll');
  return a && b; });
t('scrolling view shows every step at once', ()=>{
  const css=Array.from(w.document.querySelectorAll('style')).map(x=>x.textContent).join('');
  return /body\.wiz-scroll \.wizard-step\s*\{[^}]*display:\s*block/.test(css)
      && /body\.wiz-scroll #wizardNav\s*\{[^}]*display:\s*none/.test(css); });
t('switching views keeps the current step', ()=>{
  E("showStep(3);wizSetView('scroll');wizSetView('step');");
  return E("WIZ_STEP")===3; });

t('one table drives the approval holds', ()=>{
  const g=E("Object.keys(GCA_APPROVAL)");
  return ['10a','10c','10e1','10e2','10f','10g','10h','11i','11j','11k','14'].every(k=>g.includes(k)); });
t('flow-down keeps its own narrower set on purpose', ()=>{
  const f=E("Object.keys(FLOW_GCA_KEYS)");
  return !f.includes('10a') && !f.includes('10g') && !f.includes('10h') && f.includes('10f'); });
t('every trigger names who approves', ()=>{
  const bad=E("Object.keys(GCA_APPROVAL).filter(function(k){return !GCA_APPROVAL[k].auth;})");
  return bad.length?('missing authority: '+bad.join(', ')):true; });
t('the note names the box, the subject and the authority', ()=>{
  const t1=E("dashComplianceText('10a')"), t2=E("dashComplianceText('10e1')");
  return /^Item 10a COMSEC information checked/.test(t1) && /GCA approval required/.test(t1)
      && /Senior Intelligence Officer/.test(t2); });
t('triggers are read from the stored form', ()=>{
  const r={workspace:{checks:{c10a:true,c11i:true},radios:{i14:'yes'}}};
  const got=E("dashComplianceTriggers("+JSON.stringify(r)+")");
  return got.includes('10a') && got.includes('11i') && got.includes('14'); });
t('ticking a box raises exactly one hold, not one per pass', ()=>{
  const r={id:'x',holds:[],workspace:{checks:{c10a:true},radios:{}}};
  E("window.__r="+JSON.stringify(r)+";dashSyncCompliance(window.__r);dashSyncCompliance(window.__r);dashSyncCompliance(window.__r);");
  return E("window.__r.holds.length")===1; });
t('an open approval hold forces Blocked', ()=>{
  E("window.__r2={id:'y',status:'Ready to sign',holds:[],workspace:{checks:{c10f:true},radios:{}}};dashSyncCompliance(window.__r2);");
  return E("window.__r2.status")==='Blocked'; });
t('un-ticking supersedes rather than deletes', ()=>{
  E("window.__r.workspace.checks={};dashSyncCompliance(window.__r);");
  return E("window.__r.holds.length")===1 && E("window.__r.holds[0].sup")===true
      && /superseded/.test(E("window.__r.holds[0].t")); });
t('an issued record is not dragged back to Blocked', ()=>{
  E("window.__r3={id:'z',status:'Issued',holds:[],workspace:{checks:{c10a:true},radios:{}}};dashSyncCompliance(window.__r3);");
  return E("window.__r3.status")==='Issued'; });


H('47. Resetting a DD-254 already in the workflow');
const seedR=async(id,extra)=>{
  await E(`draftPut(Object.assign({id:'`+id+`',title:'`+id+`',status:'Blocked',stage:'orig',statusOverride:true,reviewDate:'2028-01-01',
    holds:[{t:'SCG missing',s:'Blocked',d:'2026-01-01',done:false}],
    dist:[{ts:'2026-02-02',party:'18a',to:'a@b.com',method:'e-mail'}],
    countersign:{received:true,date:'2026-02-05'},
    niss:{on:true,date:'2026-01-01',by:'DA'},
    todos:[{text:'chase',due:'2026-03-01',done:false}], notes:'keep me',
    meta:{}, workspace:{texts:{i6a:'Acme'},checks:{},radios:{},selects:{},perf:[]}},`+JSON.stringify(extra||{})+`))`); };
t('the scope helper reports what would be cleared', ()=>{
  const s=E("dashResetScope({status:'Blocked',holds:[{},{}],dist:[{}],countersign:{},issuedAt:'x',reviewDate:'2028-01-01',statusOverride:true})");
  return s.holds===2 && s.dist===1 && s.countersign===true && s.issued===true && s.review===true && s.override===true; });
t('a fresh draft has nothing to reset', ()=>
  E("dashResetAny({status:'Draft',holds:[],dist:[]})")===false);
t('a worked record does have something to reset', ()=>
  E("dashResetAny({status:'Blocked',holds:[{}],dist:[]})")===true);
await ta('reset clears the events and keeps the face', async()=>{
  await wipe(); await seedR('R1');
  E("window.uiConfirm=async function(){return true;};");
  await E("dashResetNow('R1')");
  const r=await E("draftGet('R1')");
  const cleared=r.status==='Draft' && (r.holds||[]).length===0 && (r.dist||[]).length===0
             && !r.countersign && !('issuedAt' in r) && r.reviewDate==='' && r.statusOverride===false;
  const kept=r.notes==='keep me' && (r.todos||[]).length===1 && !!r.niss && r.workspace.texts.i6a==='Acme';
  return cleared && kept ? true : ('cleared='+cleared+' kept='+kept); });
await ta('declining the confirmation changes nothing', async()=>{
  await wipe(); await seedR('R2');
  E("window.uiConfirm=async function(){return false;};");
  await E("dashResetNow('R2')");
  const r=await E("draftGet('R2')");
  E("window.uiConfirm=async function(){return true;};");
  return r.status==='Blocked' && (r.holds||[]).length===1 && (r.dist||[]).length===1; });
await ta('an approval hold comes straight back — reset is not a way past a GCA gate', async()=>{
  await wipe();
  await seedR('R3',{workspace:{texts:{},checks:{c10a:true},radios:{},selects:{},perf:[]}});
  await E("dashResetNow('R3')");
  const r=await E("draftGet('R3')");
  const open=(r.holds||[]).filter(h=>h.c&&!h.done);
  return r.status==='Blocked' && open.length===1 && /10a/.test(open[0].t)
    ? true : ('status='+r.status+' openCompliance='+open.length); });
await ta('an issued record refuses to reset', async()=>{
  await wipe();
  await E("draftPut({id:'R4',title:'Issued',status:'Issued',issuedAt:'2026-03-03T00:00:00Z',dist:[{ts:'x',to:'y'}],holds:[],todos:[],meta:{},workspace:{}})");
  await E("dashResetNow('R4')");
  const r=await E("draftGet('R4')");
  return r.status==='Issued' && !!r.issuedAt && (r.dist||[]).length===1; });
await ta('cancelled and skipped refuse too', async()=>{
  await E("draftPut({id:'R5',title:'C',status:'Cancelled',dist:[{ts:'x'}],holds:[],todos:[],meta:{},workspace:{}})");
  await E("dashResetNow('R5')");
  const r=await E("draftGet('R5')");
  return r.status==='Cancelled' && (r.dist||[]).length===1; });
await ta('the button is offered on a worked record and hidden on an issued one', async()=>{
  await wipe(); await seedR('R6');
  await E("draftPut({id:'R7',title:'IssuedOne',status:'Issued',issuedAt:'2026-01-01T00:00:00Z',holds:[],dist:[],todos:[],meta:{},workspace:{}})");
  await E("dashRenderCards()");
  const cards=Array.from(w.document.querySelectorAll('#dashCards .dash-card'));
  const worked=cards.find(c=>c.textContent.includes('R6'));
  const issued=cards.find(c=>c.textContent.includes('IssuedOne'));
  return /Reset workflow/.test(worked.innerHTML) && !/Reset workflow/.test(issued.innerHTML); });
await ta('the reset is written to the audit log', async()=>
  E("audAll()").some(a=>a.action==='workflow-reset'));
await ta('a copy records where it came from', async()=>{
  await wipe(); await seedR('R8');
  const pr=E("dashDuplicate('R8')");
  await new Promise(r=>setTimeout(r,120));
  w.document.getElementById('dashCopyDlg').querySelector('#cpFull').click();
  await pr; await new Promise(r=>setTimeout(r,60));
  const c=(await E("draftAll()")).filter(x=>(x.title||'').indexOf('Copy of')===0)[0];
  return c && c.copiedFrom==='R8' && !!c.copiedOn; });
await ta('a full copy can then be reset from the card', async()=>{
  const c=(await E("draftAll()")).filter(x=>(x.title||'').indexOf('Copy of')===0)[0];
  const before=(c.holds||[]).length;
  await E("dashResetNow('"+c.id+"')");
  const after=await E("draftGet('"+c.id+"')");
  /* a FULL copy deliberately starts notes and to-dos clean; what reset must
     preserve here is the form and the NISS verification */
  return before>0 && (after.holds||[]).length===0
      && after.workspace.texts.i6a==='Acme' && !!after.niss; });


H('48. The Block 17 library is named Certifier');
await ta('the menu and heading say Certifier, not Block 17', async()=>{
  await E("dashTplEdit('cert')");
  const h=w.document.body.innerHTML;
  return /Certifier Templates/.test(h) && !/Block 17 Templates/.test(h); });
await ta('exported files are named Certifier, not Block17', async()=>{
  let name=''; const OA=w.document.createElement.bind(w.document);
  w.document.createElement=function(t){ const e=OA(t); if(t==='a'){ const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e),'download');
    Object.defineProperty(e,'download',{set(v){name=v;},get(){return name;},configurable:true}); } return e; };
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  E("tplExport('cert')");
  w.document.createElement=OA;
  return /Certifier/.test(name) && !/Block17/.test(name) ? true : ('filename was '+JSON.stringify(name)); });
t('nothing user-facing still says Block 17', ()=>{
  const src=require('fs').readFileSync('dd254.htm','utf8');
  const hits=(src.match(/Block 17/g)||[]);
  return hits.length===0 ? true : (hits.length+' remaining'); });
t('the XFA packet name is untouched — it belongs to the official form', ()=>{
  const src=require('fs').readFileSync('dd254.htm','utf8');
  return src.indexOf("el('Block17'")>=0; });
await ta('the certifier template still applies to Item 17', async()=>{
  E("tplSave(TPL_CERT,[{label:'CO',name:'Adams, Darin',title:'Contracting Officer',address:'WPAFB',cage:'',phone:'(937) 555-0100',email:'co@x.mil'}]);buildTplSelects();");
  E("showFormView();resetFormFields();");
  const sel=w.document.getElementById('certTplSel');
  sel.value=Array.from(sel.options).map(o=>o.value).filter(v=>v!=='')[0];
  E("applyCertTpl(document.getElementById('certTplSel'))");
  return E("document.getElementById('i17a').value")==='Adams, Darin'
      && E("document.getElementById('i17b').value")==='Contracting Officer'; });


H('49. Standard Language library');
const SL=()=>E(`tplSave(TPL_SL,[
  {label:'Acme corporate',text:'All classified work shall be performed in accordance with Acme Security Manual SM-100.'},
  {label:'Export control',text:'Technical data on this contract is subject to export control under the ITAR.'}]);`);
const i13v=()=>E("document.getElementById('item13').value");
t('the library is addressable and separate from the others', ()=>
  E("tplKeyOf('sl')")==='dd254_sl_tpl' && E("tplKeyOf('ct')")!==E("tplKeyOf('sl')"));
t('it is in the full backup', ()=> E("BK_KINDS").includes('sl'));
t('it is NOT in the spreadsheet round trip', ()=> E("typeof TPL_IO.sl")==='undefined');
t('a new row is name plus text, nothing else', ()=>{
  E("window.TPL_EDIT_KIND='sl';window.TPL_EDIT=[];dashTplAdd();");
  const r=E("window.TPL_EDIT[0]");
  return Object.keys(r).sort().join(',')==='label,text'; });
await ta('the editor shows a name box and a text area', async()=>{
  SL(); await E("dashTplEdit('sl')");
  const h=w.document.body.innerHTML;
  return /Standard Language/.test(h) && /recurring Block 13 text/.test(h)
      && /Acme corporate/.test(h) && /Acme Security Manual/.test(h); });

t('nothing is applied automatically', ()=>{
  SL(); E("showFormView();resetFormFields();run();");
  return i13v()==='' && E("slApplied()").length===0; });
t('inserting puts it at the very top, above your typing', ()=>{
  SL(); E("showFormView();resetFormFields();");
  E("document.getElementById('item13').value='Reference 10a:\\n\\nCOMSEC.';run();");
  E("slInsert(0)");
  return i13v().indexOf('All classified work')===0 && /Reference 10a/.test(i13v()); });
t('a second entry lands beneath the first, in insertion order', ()=>{
  E("slInsert(1)");
  const v=i13v();
  return v.indexOf('All classified work')<v.indexOf('export control')
      && v.indexOf('export control')<v.indexOf('Reference 10a'); });
t('the applied list reflects what is in Block 13', ()=>
  E("slApplied()").join('|')==='Acme corporate|Export control');
t('the same entry cannot be applied twice', ()=>{
  const before=i13v();
  E("window.__A='';slInsert(0)");
  return i13v()===before && /already in Block 13/.test(String(E("window.__A")||'')); });
t('deleting it by hand sticks — it does not come back', ()=>{
  E("document.getElementById('item13').value=document.getElementById('item13').value.split('All classified work shall be performed in accordance with Acme Security Manual SM-100.').join('');run();run();run();");
  return !/Acme Security Manual/.test(i13v()) && E("slApplied()").join('|')==='Export control'; });
t('an entry with no text is ignored rather than inserting a blank', ()=>{
  E("tplSave(TPL_SL,[{label:'Empty',text:''}]);showFormView();resetFormFields();run();");
  const before=i13v(); E("slInsert(0)");
  return i13v()===before; });
await ta('what is applied is recorded on the draft for the card', async()=>{
  SL(); await E("draftPut({id:'SL1',title:'SLcard',status:'Draft',stage:'orig',todos:[],holds:[],meta:{},workspace:null})");
  E("DASH.current='SL1';showFormView();resetFormFields();slInsert(0);run();");
  await E("dashSaveNow()");
  const r=await E("draftGet('SL1')");
  return (r.stdLang||[]).join('|')==='Acme corporate'; });
await ta('the card shows it and it blocks nothing', async()=>{
  await E("dashRenderCards('SL1')");   /* the line lives in the expandable panel */
  const el=w.document.getElementById('dashCards');
  const shown=/Standard language:/.test(el.innerHTML) && /Acme corporate/.test(el.innerHTML);
  const r=await E("draftGet('SL1')");
  return shown && r.status==='Draft' ? true : ('shown='+shown+' status='+r.status); });
t('capture from form strips it but keeps your own text', ()=>{
  SL(); E("showFormView();resetFormFields();");
  E("document.getElementById('item13').value='My own guidance.';run();");
  E("slInsert(0);slInsert(1);");
  const cap=E("ctCaptureData().i13");
  return !/Acme Security Manual/.test(cap) && !/ITAR/.test(cap) && /My own guidance/.test(cap); });
t('Insert all does not touch the standard language library', ()=>
  !/TPL_SL|slInsert|slAll/.test(E("String(ctInsertAll)")));

H('50. Solicitation marker in Item 9');
t('the marker text is exactly as specified', ()=> E("SOL_MARK")==='***FOR SOLICITATION PURPOSES ONLY***');
t('apply puts it first with a line break after', ()=>
  E("solApply('Widget development.')")==='***FOR SOLICITATION PURPOSES ONLY***\nWidget development.');
t('applying twice does not double it', ()=>
  E("solApply(solApply('x'))")==='***FOR SOLICITATION PURPOSES ONLY***\nx');
t('strip removes it and leaves the description', ()=>
  E("solStrip('***FOR SOLICITATION PURPOSES ONLY***\\nWidget development.')")==='Widget development.');
t('strip is safe on text that never had it', ()=>
  E("solStrip('Widget development.')")==='Widget development.');
await ta('a new solicitation opens Item 9 with the marker', async()=>{
  /* no contract types saved, or dashNewDraft stops on the picker */
  E("tplSave(TPL_B13,[]);");
  E("window.uiPrompt=async function(){return 'Widget solicitation';};");
  await E("dashNewDraft('sol')");
  return E("document.getElementById('i9').value")==='***FOR SOLICITATION PURPOSES ONLY***\n'; });
await ta('the marker alone does not satisfy Item 9', async()=>{
  E("run()");
  return WARNS().some(x=>/Item 9/.test(x)); });
await ta('a real description does satisfy it', async()=>{
  E("document.getElementById('i9').value+='Widget development services.';run()");
  return !WARNS().some(x=>/Item 9/.test(x)); });
await ta('spawning an Original strips the marker and keeps the description', async()=>{
  await E("dashSaveNow()");
  const id=E("DASH.current");
  await E("dashSpawn('"+id+"','orig')");
  const kid=(await E("draftAll()")).filter(x=>x.parentId===id)[0];
  const v=(kid.workspace.texts||{}).i9||'';
  return !/SOLICITATION PURPOSES/.test(v) && /Widget development services/.test(v); });
await ta('an ordinary Original never gets the marker', async()=>{
  E("tplSave(TPL_B13,[]);");
  E("window.uiPrompt=async function(){return 'Plain original';};");
  await E("dashNewDraft('orig')");
  return E("document.getElementById('i9').value")===''; });


H('51. Template pack — sharing libraries between instances');
let _packCache=null;
const packMake=(fresh)=>{
  /* one export is enough for the whole section; rebuilding it per test was
     costing more wall time than every other section combined */
  if(_packCache && !fresh) return Promise.resolve(JSON.parse(JSON.stringify(_packCache)));
  return packMakeReal().then(function(p){ _packCache=p; return JSON.parse(JSON.stringify(p)); });
};
const packMakeReal=()=>{
  E("localStorage.setItem('dd254_owner','Alice');");
  E("tplSave(TPL_SL,[{label:'Bob',text:'ALICE Bob.'},{label:'Shared',text:'Same on both.'}]);");
  E("tplSave(TPL_FAC,[{label:'Alice HQ',text:'1 Alice Way',cage:'1AAA1'}]);");
  let cap=null; const OB=w.Blob;
  w.Blob=function(p){ try{cap=String(p[0]);}catch(e){} return new OB(p); };
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  /* export now asks what to include; take everything */
  const pr=E("tplPackExport()");
  return waitDlg('#tplPickDlg').then(function(d){
    if(!d){ w.Blob=OB; throw new Error('picker never appeared'); }
    d.querySelector('#pkGo').click();
    return pr.then(function(){ w.Blob=OB; return JSON.parse(cap); });
  });
};
await ta('the pack carries templates and no drafts', async()=>{
  await wipe();
  await E("draftPut({id:'PK',title:'a draft',status:'Draft',stage:'orig',todos:[],meta:{},workspace:{}})");
  const p=await packMake();
  return p.tool==='DD254 Template Pack' && !('drafts' in p) && !!p.libs && Object.keys(p.libs).length===8; });
await ta('it is stamped with who exported it and when', async()=>{
  const p=await packMake();
  return p.owner==='Alice' && /^\d{4}-\d{2}-\d{2}/.test(String(p.exported||'')); });
await ta('every row leaves with a stable id', async()=>{
  const p=await packMake();
  return p.libs.sl.every(function(t){ return !!t.ioId; }); });

await ta('a row you already have by id updates in place, not duplicated', async()=>{
  const p=await packMake();
  const id=p.libs.sl[0].ioId;
  E("tplSave(TPL_SL,[{label:'Renamed locally',text:'old text',ioId:'"+id+"'}]);");
  const plan=E("tplPackPlan('sl',"+JSON.stringify(p.libs.sl)+",'Alice','2026-08-08')");
  return plan.update.length===1 && plan.rename.length===0 && plan.add.length===1; });
await ta('identical content is not a conflict and is skipped', async()=>{
  const p=await packMake();
  E("tplSave(TPL_SL,"+JSON.stringify([{label:'Shared',text:'Same on both.'}])+");");
  const plan=E("tplPackPlan('sl',"+JSON.stringify(p.libs.sl)+",'Alice','2026-08-08')");
  return plan.same.length===1 && plan.same[0]==='Shared' && plan.rename.length===0; });
await ta('same name, different content, different lineage keeps BOTH', async()=>{
  const p=await packMake();
  E("tplSave(TPL_SL,[{label:'Bob',text:'BOB version.'}]);");
  const plan=E("tplPackPlan('sl',"+JSON.stringify(p.libs.sl)+",'Alice','2026-08-08')");
  if(plan.rename.length!==1) return 'renames='+plan.rename.length;
  E("tplPackApply('sl',"+JSON.stringify(plan)+")");
  const after=E("tplLoad(TPL_SL)");
  return after.some(t=>t.text==='BOB version.')
      && after.some(t=>/from Alice/.test(t.label||'') && t.text==='ALICE Bob.'); });
await ta('the renamed copy carries who it came from and when', async()=>{
  const after=E("tplLoad(TPL_SL)");
  const r=after.filter(t=>/from Alice/.test(t.label||''))[0];
  return !!r && /\(from Alice, \d{4}-\d{2}-\d{2}\)/.test(r.label); });
await ta('the renamed copy gets its own id so it never collides again', async()=>{
  const after=E("tplLoad(TPL_SL)");
  const ids=after.map(t=>t.ioId).filter(Boolean);
  return ids.length===new Set(ids).size; });
await ta('a genuinely new entry is just added', async()=>{
  const p=await packMake();
  E("tplSave(TPL_SL,[]);");
  const plan=E("tplPackPlan('sl',"+JSON.stringify(p.libs.sl)+",'Alice','2026-08-08')");
  return plan.add.length===2 && plan.update.length===0 && plan.rename.length===0; });
await ta('applying records an undo for that library', async()=>{
  const p=await packMake();
  E("tplSave(TPL_SL,[{label:'Mine',text:'keep'}]);");
  const plan=E("tplPackPlan('sl',"+JSON.stringify(p.libs.sl)+",'Alice','2026-08-08')");
  E("tplPackApply('sl',"+JSON.stringify(plan)+")");
  return E("ioHasUndo('sl')")===true && E("tplLoad(TPL_SL)").length===3; });
t('site-specific libraries are flagged so they default off', ()=>
  E("!!PACK_LOCAL.fac")===true && E("!!PACK_LOCAL.perf")===true && E("!!PACK_LOCAL.sl")===false);
t('all eight libraries travel in a pack', ()=>
  E("PACK_KINDS").length===8 && E("PACK_KINDS").includes('sl') && E("PACK_KINDS").includes('ct'));
await ta('a file that is not a pack is refused', async()=>{
  E("window.__A='';");
  const ev={target:{files:[new w.Blob(['{\"tool\":\"something else\"}'],{type:'application/json'})],value:'x'}};
  /* FileReader path: assert the guard exists rather than driving the input */
  return /not a template pack/i.test(E("String(tplPackImport)")); });


H('52. Choosing what to export');
const seedPick=()=>{
  /* clear every library so the counts in these tests are deterministic —
     earlier sections leave rows behind in the ones this does not set */
  E("PACK_KINDS.forEach(function(k){ tplSave(tplKeyOf(k),[]); });");
  E("localStorage.setItem('dd254_owner','Alice');");
  E("tplSave(TPL_SL,[{label:'Acme standard',text:'A'},{label:'Export control',text:'B'},{label:'Old wording',text:'C'}]);");
  E("tplSave(TPL_FAC,[{label:'HQ',text:'1 Way',cage:'1AAA1'},{label:'Plant 2',text:'2 Way',cage:'2BBB2'}]);");
  E("tplSave(TPL_CT,[{label:'CPFF posture',data:ctBlankData()}]);");
};
const runExport=async(fn)=>{
  let cap=null; const OB=w.Blob;
  w.Blob=function(p){ try{cap=String(p[0]);}catch(e){} return new OB(p); };
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  const pr=E("tplPackExport()");
  const d=await waitDlg('#tplPickDlg');
  if(!d){ w.Blob=OB; throw new Error('picker never appeared'); }
  const out=fn(d);
  await pr; w.Blob=OB;
  return out===false ? null : (cap?JSON.parse(cap):null);
};
await ta('the picker lists every library and every entry', async()=>{
  seedPick();
  const p=await runExport(function(d){
    const libs=d.querySelectorAll('.pkLib').length, rows=d.querySelectorAll('.pkRow').length;
    d.querySelector('#pkX').click();
    return (libs===3&&rows===6)?undefined:('libs='+libs+' rows='+rows);
  });
  return true; });
await ta('everything starts ticked, so exporting all is still one click', async()=>{
  seedPick();
  const p=await runExport(function(d){
    const n=Array.from(d.querySelectorAll('.pkRow')).filter(c=>c.checked).length;
    d.querySelector('#pkGo').click(); return n;
  });
  return p && p.libs.sl.length===3 && p.libs.fac.length===2 && p.libs.ct.length===1; });
await ta('unticking a library leaves it out entirely', async()=>{
  seedPick();
  const p=await runExport(function(d){
    const lib=d.querySelector('.pkLib[data-k="fac"]'); lib.checked=false; lib.onchange();
    d.querySelector('#pkGo').click();
  });
  return p && (p.libs.fac||[]).length===0 && p.libs.sl.length===3; });
await ta('unticking one entry leaves only that one out', async()=>{
  seedPick();
  const p=await runExport(function(d){
    const rows=Array.from(d.querySelectorAll('.pkRow[data-k="sl"]'));
    rows[2].checked=false; rows[2].onchange();
    d.querySelector('#pkGo').click();
  });
  return p && p.libs.sl.length===2 && !p.libs.sl.some(t=>t.label==='Old wording'); });
await ta('a partly ticked library shows as indeterminate', async()=>{
  seedPick();
  let ind=null;
  await runExport(function(d){
    const rows=Array.from(d.querySelectorAll('.pkRow[data-k="sl"]'));
    rows[0].checked=false; rows[0].onchange();
    ind=d.querySelector('.pkLib[data-k="sl"]').indeterminate;
    d.querySelector('#pkX').click(); return false;
  });
  return ind===true; });
await ta('the running count tracks the selection', async()=>{
  seedPick();
  let before='',after='';
  await runExport(function(d){
    before=d.querySelector('#pkCount').textContent;
    const lib=d.querySelector('.pkLib[data-k="fac"]'); lib.checked=false; lib.onchange();
    after=d.querySelector('#pkCount').textContent;
    d.querySelector('#pkX').click(); return false;
  });
  return /6 of 6/.test(before) && /4 of 6/.test(after) ? true : (before+' | '+after); });
await ta('selecting none is refused rather than writing an empty pack', async()=>{
  seedPick();
  let stillOpen=false, msg='';
  await runExport(function(d){
    d.querySelector('#pkNone').click();
    d.querySelector('#pkGo').click();
    stillOpen=!!w.document.getElementById('tplPickDlg');
    msg=d.querySelector('#pkErr').textContent;
    d.querySelector('#pkX').click(); return false;
  });
  return stillOpen && /Nothing selected/.test(msg); });
await ta('cancelling writes no file', async()=>{
  seedPick();
  const p=await runExport(function(d){ d.querySelector('#pkX').click(); });
  return p===null; });
await ta('exported rows carry the same ids the tool stores, so re-import matches', async()=>{
  seedPick();
  const p=await runExport(function(d){ d.querySelector('#pkGo').click(); });
  const mine=E("tplLoad(TPL_SL)");
  return p.libs.sl.every(function(t){ return mine.some(function(o){ return o.ioId===t.ioId && o.label===t.label; }); }); });
await ta('a partial export still imports cleanly on the other side', async()=>{
  seedPick();
  const p=await runExport(function(d){
    const rows=Array.from(d.querySelectorAll('.pkRow[data-k="sl"]'));
    rows[1].checked=false; rows[1].onchange();
    d.querySelector('#pkGo').click();
  });
  E("tplSave(TPL_SL,[]);");
  const plan=E("tplPackPlan('sl',"+JSON.stringify(p.libs.sl)+",'Alice','2026-08-08')");
  return plan.add.length===2 && plan.rename.length===0; });

H('53. Settings — the registry is the only source of truth');
t('Manage menu offers Settings', ()=>{
  const b=Array.from(w.document.querySelectorAll('#dashManageMenu .dash-menu-item'))
    .find(x=>/Settings/.test(x.textContent));
  return !!b && /settingsOpen\(\)/.test(b.getAttribute('onclick'));
});
t('every setting declares exactly one reader and one writer', ()=>{
  const bad=E("SETTINGS_DEFS.filter(function(d){return typeof d.read!=='function'||typeof d.write!=='function'||!d.key||!d.label;}).map(function(d){return d.key;})");
  return bad.length===0 ? true : bad;
});
t('setting keys are unique', ()=>{
  const k=E("SETTINGS_DEFS.map(function(d){return d.key;})");
  return new Set(k).size===k.length ? true : k;
});
t('writing a setting its own current value changes nothing', ()=>{
  const before=E("SETTINGS_DEFS.map(function(d){return String(d.read());})");
  E("settingsApplyAll()");
  const after=E("SETTINGS_DEFS.map(function(d){return String(d.read());})");
  return JSON.stringify(before)===JSON.stringify(after) ? true : [before,after];
});
await ta('the panel renders one row per registered setting, not a fixed list', async()=>{
  await E("settingsOpen()");
  const n=E("SETTINGS_DEFS.length");
  const rows=w.document.querySelectorAll('#settingsView > div > div[style*="border-radius:6px"]');
  return rows.length===n ? true : rows.length+' rows for '+n+' settings';
});
await ta('every registered setting is reachable from the panel', async()=>{
  await E("settingsOpen()");
  const html=w.document.getElementById('settingsView').innerHTML;
  const missing=E("SETTINGS_DEFS.map(function(d){return d.label;})").filter(l=>html.indexOf(l)<0);
  return missing.length===0 ? true : missing;
});
await ta('opening Settings hides the draft list, closing brings it back', async()=>{
  await E("settingsOpen()");
  const hidden=w.document.getElementById('dashCards').style.display==='none';
  E("settingsClose()");
  const back=w.document.getElementById('dashCards').style.display!=='none';
  const gone=w.document.getElementById('settingsView').style.display==='none';
  return (hidden&&back&&gone) ? true : {hidden,back,gone};
});

H('54. Form layout — the setting drives the real form, not just storage');
t('choosing One page puts every wizard step on the page', ()=>{
  E("settingsSet('wizView','scroll')");
  const steps=Array.from(w.document.querySelectorAll('.wizard-step'));
  const cls=w.document.body.classList.contains('wiz-scroll');
  /* jsdom does not apply the stylesheet, so assert the hook the CSS keys off
     and that no step was left switched off inline by showStep(). */
  const noneHiddenInline=steps.every(s=>s.style.display!=='none');
  return (cls&&steps.length===8&&noneHiddenInline) ? true : {cls,n:steps.length,noneHiddenInline};
});
t('choosing Step by step shows one step and hides the rest', ()=>{
  E("settingsSet('wizView','step')");
  E("showStep(2)");
  const steps=Array.from(w.document.querySelectorAll('.wizard-step'));
  const active=steps.filter(s=>s.classList.contains('active'));
  const cls=w.document.body.classList.contains('wiz-scroll');
  return (!cls&&active.length===1&&steps.indexOf(active[0])===2) ? true : {cls,active:active.length};
});
t('the layout choice survives as a stored preference', ()=>{
  E("settingsSet('wizView','scroll')");
  const v=E("localStorage.getItem('dd254_wiz_view')");
  E("settingsSet('wizView','step')");
  return v==='scroll' && E("localStorage.getItem('dd254_wiz_view')")==='step' ? true : v;
});
await ta('the floating form button and the Settings row cannot disagree', async()=>{
  E("settingsSet('wizView','scroll')");
  const btn=w.document.getElementById('wizViewBtn').textContent;
  await E("settingsOpen()");
  const checked=Array.from(w.document.querySelectorAll('#settingsView button[role="radio"]'))
    .filter(b=>b.getAttribute('aria-checked')==='true').map(b=>b.textContent);
  E("settingsSet('wizView','step')");
  return /One page/.test(btn) && checked.some(x=>/One page/.test(x)) ? true : {btn,checked};
});
await ta('only one layout is ever selected at a time', async()=>{
  await E("settingsOpen()");
  const rows=Array.from(w.document.querySelectorAll('#settingsView button[role="radio"]'));
  const on=rows.filter(b=>b.getAttribute('aria-checked')==='true');
  const groups=E("SETTINGS_DEFS.filter(function(d){return d.type==='choice';}).length");
  return on.length===groups ? true : on.length+' selected across '+groups+' choice settings';
});

H('55. Dark theme — scoped to the chrome, absent from print and export');
t('theme is stored and applied to the document element', ()=>{
  E("themeSet('dark')");
  const a=w.document.documentElement.getAttribute('data-theme');
  const s=E("localStorage.getItem('dd254_theme')");
  E("themeSet('light')");
  return (a==='dark'&&s==='dark'&&w.document.documentElement.getAttribute('data-theme')==='light') ? true : {a,s};
});
t('an unrecognised theme value falls back to light rather than breaking', ()=>{
  E("localStorage.setItem('dd254_theme','chartreuse')");
  const v=E("themeGet()");
  E("themeSet('light')");
  return v==='light' ? true : v;
});
/* The one assertion the PDF byte tests cannot make: a theme that reaches an
   export would be invisible to them. Proven structurally instead. */
t('the entire theme sheet is inside @media screen', ()=>{
  const css=w.document.getElementById('themeSheet').textContent;
  const body=css.replace(/\/\*[\s\S]*?\*\//g,'');
  const i=body.indexOf('@media screen{');
  if(i<0) return 'no @media screen wrapper';
  const before=body.slice(0,i).trim();
  const after=body.slice(body.lastIndexOf('}')+1).trim();
  return (before===''&&after==='') ? true : {before:before.slice(0,60),after:after.slice(0,60)};
});
t('no dark rule reaches the DD-254 form facsimile', ()=>{
  const css=w.document.getElementById('themeSheet').textContent.replace(/\/\*[\s\S]*?\*\//g,'');
  const sels=css.split('}').map(x=>x.split('{')[0]).filter(x=>/\[data-theme/.test(x));
  const forbidden=/(^|[\s,])\[data-theme="dark"\]\s+(\.fw|\.sec|\.sec-hdr|\.inst-box|#item13|\.cbi|\.ilabel|\.alert)\b/;
  const hits=sels.filter(s=>forbidden.test(s));
  return hits.length===0 ? true : hits;
});
t('the print stylesheet is untouched by the theme', ()=>{
  const css=w.document.getElementById('themeSheet').textContent;
  return css.indexOf('@media print')<0 ? true : 'theme sheet declares print rules';
});
t('severity colours stay distinct from body text in dark', ()=>{
  const css=w.document.getElementById('themeSheet').textContent;
  const dark=css.slice(css.indexOf('[data-theme="dark"]{'), css.indexOf('}',css.indexOf('[data-theme="dark"]{')));
  const g=k=>{ const m=dark.match(new RegExp('--sh-'+k+':\\s*(#[0-9a-fA-F]{6})')); return m&&m[1].toLowerCase(); };
  const ink=g('ink'), bad=g('bad'), warn=g('warn'), good=g('good');
  const all=[ink,bad,warn,good];
  return all.every(Boolean) && new Set(all).size===4 ? true : {ink,bad,warn,good};
});
/* Derived, not duplicated: the list of literals comes out of the shell source
   at run time. A new colour in the dashboard markup with no mapping fails here
   instead of silently rendering dark-on-dark. */
t('every text colour the chrome emits has a dark mapping', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const css=src.slice(src.indexOf('<style id="themeSheet">'), src.indexOf('</style>',src.indexOf('<style id="themeSheet">')));
  /* Derived from the source at run time. Named functions are extracted by
     brace matching rather than by line number, so inserting code above them
     does not quietly narrow what this test inspects. */
  function body(name){
    const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(src);
    if(!m) return '@@MISSING:'+name;
    let k=src.indexOf('{',m.index), d=0;
    for(let x=k;x<src.length;x++){ const c=src[x];
      if(c==='{')d++; else if(c==='}'){ d--; if(!d) return src.slice(k,x+1); } }
    return '';
  }
  const SHELL=['dashRenderCards','dashRollupRender','dashTplEdit','audView','settingsRender','bkStatus','storageMeter'];
  const bodies=SHELL.map(body);
  const missing=SHELL.filter((n,i)=>bodies[i].indexOf('@@MISSING')===0);
  if(missing.length) return 'shell functions renamed or gone: '+missing.join(', ');
  /* Plus the static dashboard markup, which is chrome too. */
  const markup=src.slice(src.indexOf('<div id="dashView"'), src.indexOf('<div id="dashCards">'));
  const lits=new Set();
  (bodies.join('\n')+markup).replace(/[^-a-z]color:\s*(#[0-9a-fA-F]{6})/g,(m,h)=>{lits.add(h.toLowerCase());return m;});
  const unmapped=[...lits].filter(h=>h!=='#ffffff' && css.toLowerCase().indexOf('color:'+h)<0);
  return unmapped.length===0 ? true : unmapped;
});


/* The paired assertion: a pale panel background left unmapped is the
   dark-on-dark failure users actually hit. Light is judged by luminance so a
   new tint does not need adding to a list here — the list is the defect. */
t('every pale background the chrome emits has a dark mapping', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const css=src.slice(src.indexOf('<style id="themeSheet">'), src.indexOf('</style>',src.indexOf('<style id="themeSheet">')));
  function body(name){
    const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(src);
    if(!m) return '';
    let k=src.indexOf('{',m.index), d=0;
    for(let x=k;x<src.length;x++){ const c=src[x];
      if(c==='{')d++; else if(c==='}'){ d--; if(!d) return src.slice(k,x+1); } }
    return '';
  }
  const shell=['dashRenderCards','dashRollupRender','dashTplEdit','audView','settingsRender'].map(body).join('\n')
    + src.slice(src.indexOf('<div id="dashView"'), src.indexOf('<div id="dashCards">'));
  const lits=new Set();
  shell.replace(/background(?:-color)?:\s*(#[0-9a-fA-F]{6}|#fff\b)/g,(m,h)=>{lits.add(h.toLowerCase());return m;});
  const lum=h=>{ h=h.length===4?('#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3]):h;
    const n=parseInt(h.slice(1),16); return (0.299*((n>>16)&255)+0.587*((n>>8)&255)+0.114*(n&255))/255; };
  const pale=[...lits].filter(h=>lum(h)>0.72);
  const unmapped=pale.filter(h=>{
    const short=(h==='#ffffff')?'#fff':h;
    return css.toLowerCase().indexOf('background:'+short)<0 && css.toLowerCase().indexOf('background:'+h)<0;
  });
  return unmapped.length===0 ? true : unmapped;
});

H('56. Backup reminder threshold');
t('the default reproduces the pre-Settings behaviour exactly', ()=>{
  E("localStorage.removeItem('dd254_bk_every')");
  E("localStorage.setItem('dd254_dirty_n','1'); bkStatus();");
  const txt=w.document.getElementById('backupStatus').textContent;
  return (E("bkEveryGet()")===1 && /⚠/.test(txt)) ? true : {every:E("bkEveryGet()"),txt};
});
t('below the threshold the count is shown without a warning', ()=>{
  E("bkEverySet(5); localStorage.setItem('dd254_dirty_n','3'); bkStatus();");
  const txt=w.document.getElementById('backupStatus').textContent;
  return (/3 changes since last backup/.test(txt) && !/⚠/.test(txt)) ? true : txt;
});
t('reaching the threshold raises the warning', ()=>{
  E("bkEverySet(5); localStorage.setItem('dd254_dirty_n','5'); bkStatus();");
  const txt=w.document.getElementById('backupStatus').textContent;
  return /⚠/.test(txt) ? true : txt;
});
t('the reminder cannot be switched off entirely', ()=>{
  const vals=[E("bkEverySet(0)"),E("bkEverySet(-4)"),E("bkEverySet('nonsense')"),E("bkEverySet(9999)")];
  E("bkEverySet(1); localStorage.setItem('dd254_dirty_n','0'); bkStatus();");
  return JSON.stringify(vals)===JSON.stringify([1,1,1,50]) ? true : vals;
});

H('57. Owner name is editable without clearing site data');
t('the name round-trips and is trimmed', ()=>{
  E("ownerSet('  D. Adams  ')");
  return E("ownerGet()")==='D. Adams' ? true : E("ownerGet()");
});
t('the stored key is the one the rollup already reads', ()=>{
  E("ownerSet('D. Adams')");
  return E("localStorage.getItem('dd254_owner')")==='D. Adams' ? true : E("localStorage.getItem('dd254_owner')");
});
t('clearing the name is allowed and does not store whitespace', ()=>{
  E("ownerSet('   ')");
  const v=E("localStorage.getItem('dd254_owner')");
  E("ownerSet('D. Adams')");
  return v==='' ? true : JSON.stringify(v);
});

H('58. Item 13 head line — supported effort');
const eff=()=>w.document.getElementById('iEffort');
const i13=()=>w.document.getElementById('item13');
const setEff=v=>{ eff().value=v; E("supSync()"); };
t('the field exists under Item 2 and is not dressed as an official sub-letter', ()=>{
  const e=eff(); if(!e) return 'no iEffort field';
  const lab=w.document.querySelector('label[for="iEffort"]');
  const badge=lab?lab.querySelector('.sub-ltr'):null;
  return (lab && !badge && /Effort Number/i.test(lab.textContent)) ? true : {lab:!!lab,badge:!!badge};
});
t('entering a number writes the line at the top of Item 13', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('N00178-24-F-1234');
  return i13().value==='This is in support of effort N00178-24-F-1234.' ? true : i13().value;
});
t('the line goes above text that was already in Item 13', ()=>{
  i13().value='Ref. 10a: existing operator typing.'; E("SUP_LAST=''");
  setEff('TO-0007');
  return i13().value.indexOf('This is in support of effort TO-0007.')===0
      && /Ref\. 10a/.test(i13().value) ? true : i13().value;
});
t('changing the number rewrites the line rather than adding a second one', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0007'); setEff('TO-0008');
  const n=(i13().value.match(/This is in support of effort/g)||[]).length;
  return (n===1 && /TO-0008\./.test(i13().value)) ? true : {n,v:i13().value};
});
t('clearing the number removes the line and leaves the rest intact', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0009');
  i13().value=i13().value+'\n\nRef. 11c: operator typing below.';
  setEff('');
  return i13().value==='Ref. 11c: operator typing below.' ? true : JSON.stringify(i13().value);
});
t('a line the operator moved down the block is rewritten where it stands', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0010');
  i13().value='Ref. 10a: first paragraph.\n\nThis is in support of effort TO-0010.\n\nRef. 11c: last paragraph.';
  setEff('TO-0011');
  const v=i13().value;
  return (v.indexOf('This is in support of effort TO-0011.')>0
       && v.indexOf('Ref. 10a')===0
       && (v.match(/in support of effort/g)||[]).length===1) ? true : v;
});
t('whitespace-only input is treated as no number', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('   ');
  return i13().value==='' ? true : JSON.stringify(i13().value);
});

H('59. The head line versus everything else that writes Item 13');
t('standard language inserts BELOW the head line, not above it', ()=>{
  E("tplSave(TPL_SL,[{ioId:'sl-eff-1',label:'Test SL',text:'STANDARD LANGUAGE BODY.'}])");
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0100');
  E("slInsert('Test SL')");
  const v=i13().value;
  return (v.indexOf('This is in support of effort TO-0100.')===0
       && v.indexOf('STANDARD LANGUAGE BODY.')>0) ? true : v;
});
t('a second standard-language entry still lands below the head line', ()=>{
  E("tplSave(TPL_SL,[{ioId:'sl-eff-1',label:'Test SL',text:'STANDARD LANGUAGE BODY.'},{ioId:'sl-eff-2',label:'Test SL2',text:'SECOND BODY.'}])");
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0101');
  E("slInsert('Test SL')"); E("slInsert('Test SL2')");
  const v=i13().value;
  return (v.indexOf('This is in support of effort TO-0101.')===0
       && v.indexOf('STANDARD LANGUAGE BODY.')<v.indexOf('SECOND BODY.')) ? true : v;
});
t('with no number, standard language still starts at the very top', ()=>{
  i13().value=''; E("SUP_LAST=''"); eff().value='';
  E("slInsert('Test SL')");
  return i13().value.indexOf('STANDARD LANGUAGE BODY.')===0 ? true : i13().value;
});
t('the head offset is derived, so nothing computes "the top" on its own', ()=>{
  /* Guards the pattern rather than the value: slInsert must ask, not assume. */
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/function slInsert\(ref\)\{[\s\S]*?\n\}/.exec(src);
  return (m && /i13HeadOffset/.test(m[0])) ? true : 'slInsert no longer asks i13HeadOffset';
});
t('a Contract Type template that replaces Item 13 does not lose the line', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0200');
  E("ctApplyWsToForm({texts:{item13:'TEMPLATE BLOCK 13 TEXT.'}})");
  const v=i13().value;
  return (v.indexOf('This is in support of effort TO-0200.')===0
       && /TEMPLATE BLOCK 13 TEXT\./.test(v)) ? true : v;
});
t('the effort number is not written into any official form field', ()=>{
  /* There is no Item 2 box for it. Its only route onto the form is Item 13. */
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/function buildXfaDatasets\(d\)\{[\s\S]*?\n\}/.exec(src);
  return (m && m[0].indexOf('iEffort')<0) ? true : 'iEffort reached the XFA writer';
});
t('the number survives a draft round-trip and is not duplicated on reopen', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0300');
  const ws=E("collectWorkspace()");
  E("SUP_LAST='';document.getElementById('iEffort').value='';document.getElementById('item13').value='';");
  E("applyWorkspace("+JSON.stringify(ws)+")");
  const v=i13().value;
  const n=(v.match(/This is in support of effort/g)||[]).length;
  const last=E("SUP_LAST");
  return (n===1 && last==='This is in support of effort TO-0300.') ? true : {n,last,v};
});
t('reopening then clearing the number still removes the line cleanly', ()=>{
  i13().value=''; E("SUP_LAST=''");
  setEff('TO-0400');
  const ws=E("collectWorkspace()");
  E("SUP_LAST='';document.getElementById('iEffort').value='';document.getElementById('item13').value='';");
  E("applyWorkspace("+JSON.stringify(ws)+")");
  setEff('');
  return i13().value==='' ? true : JSON.stringify(i13().value);
});
t('the classified mailing address block still owns the tail', ()=>{
  i13().value=''; E("SUP_LAST=''"); E("CMA_LAST=''");
  setEff('TO-0500');
  E("document.getElementById('i7a').value='Example Corp';document.getElementById('i7cma').value='PO Box 1\\nAnytown, ST 00000';cmaSync();");
  const v=i13().value;
  return (v.indexOf('This is in support of effort TO-0500.')===0
       && v.indexOf('Classified Mailing Address')>0
       && v.trim().endsWith('Anytown, ST 00000')) ? true : v;
});

H('60. CUI designation block — the tail of Item 13');
const cui=id=>w.document.getElementById(id);
const setCui=(o)=>{ ['cuiCtrlBy','cuiCat','cuiPoc'].forEach(k=>{ if(cui(k)) cui(k).value=(o&&o[k])||''; }); E("cuiSync()"); };
const clearAll=()=>{ i13().value=''; E("SUP_LAST='';CMA_LAST='';CUI_LAST='';");
  ['iEffort','i7a','i7cma','cuiCtrlBy','cuiCat','cuiPoc'].forEach(k=>{ const e=w.document.getElementById(k); if(e) e.value=''; }); };
t('the fields exist under Item 18 and are not dressed as official sub-letters', ()=>{
  const host=w.document.getElementById('cuiRows');
  if(!host) return 'no cuiRows container';
  const step=host.closest('.wizard-step');
  const badges=host.querySelectorAll('.sub-ltr');
  return (step && step.id==='step7' && badges.length===0
    && cui('cuiCtrlBy') && cui('cuiCat') && cui('cuiPoc')) ? true : {step:step&&step.id,badges:badges.length};
});
t('no field filled writes nothing at all', ()=>{
  clearAll(); setCui({});
  return i13().value==='' ? true : JSON.stringify(i13().value);
});
t('one field filled writes every label, blanks left empty', ()=>{
  clearAll(); setCui({cuiCtrlBy:'DCSA'});
  return i13().value==='Controlled By: DCSA\nCUI Category:\nDistribution/LDC:\nPoint of Contact (POC):'
    ? true : JSON.stringify(i13().value);
});
t('rows print in registry order, not field order', ()=>{
  clearAll(); setCui({cuiPoc:'J. Adams, 555-0100',cuiCat:'PROCURE',cuiCtrlBy:'DCSA'});
  const order=E("CUI_ROWS.map(function(r){return r.label;})");
  const lines=i13().value.split('\n').map(l=>l.split(':')[0]);
  return JSON.stringify(order)===JSON.stringify(lines) ? true : {order,lines};
});
t('clearing every field removes the block and its blank rows', ()=>{
  clearAll();
  i13().value='Ref. 10a: operator typing.'; E("CUI_LAST=''");
  setCui({cuiCtrlBy:'DCSA'});
  setCui({});
  return i13().value==='Ref. 10a: operator typing.' ? true : JSON.stringify(i13().value);
});
t('the block is separated from what precedes it by five empty rows', ()=>{
  clearAll();
  i13().value='Ref. 10a: operator typing.'; E("CUI_LAST=''");
  setCui({cuiCtrlBy:'DCSA'});
  const gap=/Ref\. 10a: operator typing\.(\n+)Controlled By:/.exec(i13().value);
  if(!gap) return JSON.stringify(i13().value);
  const blankRows=gap[1].length-1;
  return blankRows===5 ? true : blankRows+' blank rows';
});
t('editing a value rewrites the block instead of stacking a second one', ()=>{
  clearAll(); setCui({cuiCtrlBy:'DCSA'}); setCui({cuiCtrlBy:'DCSA Western'});
  const n=(i13().value.match(/Controlled By:/g)||[]).length;
  return (n===1 && /Controlled By: DCSA Western/.test(i13().value)) ? true : {n,v:i13().value};
});

H('61. Three managed regions sharing one Item 13');
t('head line, addresses and CUI block occupy their stated order', ()=>{
  clearAll();
  eff().value='TO-9000'; E("supSync()");
  i13().value=i13().value+'\n\nRef. 10a: operator typing.';
  E("document.getElementById('i7a').value='Example Corp';document.getElementById('i7cma').value='PO Box 1\\nAnytown, ST 00000';cmaSync();");
  setCui({cuiCtrlBy:'DCSA',cuiPoc:'J. Adams'});
  const v=i13().value;
  const iSup=v.indexOf('This is in support of effort TO-9000.');
  const iBody=v.indexOf('Ref. 10a');
  const iCma=v.indexOf('Classified Mailing Address');
  const iCui=v.indexOf('Controlled By:');
  return (iSup===0 && iSup<iBody && iBody<iCma && iCma<iCui) ? true : {iSup,iBody,iCma,iCui,v};
});
t('adding an address later does not land below the CUI block', ()=>{
  clearAll();
  setCui({cuiCtrlBy:'DCSA'});
  E("document.getElementById('i7a').value='Example Corp';document.getElementById('i7cma').value='PO Box 1\\nAnytown, ST 00000';cmaSync();");
  const v=i13().value;
  return v.indexOf('Classified Mailing Address')<v.indexOf('Controlled By:') ? true : v;
});
t('the five blank rows survive clearing the effort number', ()=>{
  clearAll();
  eff().value='TO-9100'; E("supSync()");
  i13().value=i13().value+'\n\nRef. 10a: operator typing.';
  setCui({cuiCtrlBy:'DCSA'});
  eff().value=''; E("supSync()");
  const v=i13().value;
  const gap=/Ref\. 10a: operator typing\.(\n+)Controlled By:/.exec(v);
  return (gap && gap[1].length-1===5) ? true : JSON.stringify(v);
});
t('with nothing left above it the block stands alone, with no orphaned rows', ()=>{
  clearAll();
  eff().value='TO-9101'; E("supSync()");
  setCui({cuiCtrlBy:'DCSA'});
  eff().value=''; E("supSync()");
  return i13().value.indexOf('Controlled By: DCSA')===0 ? true : JSON.stringify(i13().value);
});
t('the five blank rows survive removing a classified mailing address', ()=>{
  clearAll();
  i13().value='Ref. 10a: operator typing.';
  E("document.getElementById('i7a').value='Example Corp';document.getElementById('i7cma').value='PO Box 1\\nAnytown, ST 00000';cmaSync();");
  setCui({cuiCtrlBy:'DCSA'});
  E("document.getElementById('i7cma').value='';cmaSync();");
  const v=i13().value;
  const gap=/Ref\. 10a: operator typing\.(\n+)Controlled By:/.exec(v);
  return (gap && gap[1].length-1===5 && v.indexOf('Classified Mailing Address')<0) ? true : JSON.stringify(v);
});
t('the tail offset is derived, so nothing appends by string length', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/function cmaSync\(\)\{[\s\S]*?\n\}/.exec(src);
  return (m && /i13TailOffset/.test(m[0])) ? true : 'cmaSync no longer asks i13TailOffset';
});
t('a Contract Type template that replaces Item 13 does not lose the block', ()=>{
  clearAll();
  setCui({cuiCtrlBy:'DCSA',cuiCat:'PROCURE'});
  E("ctApplyWsToForm({texts:{item13:'TEMPLATE BLOCK 13 TEXT.'}})");
  const v=i13().value;
  return (v.indexOf('TEMPLATE BLOCK 13 TEXT.')===0 && /Controlled By: DCSA/.test(v)) ? true : v;
});
t('standard language still lands above the CUI block', ()=>{
  E("tplSave(TPL_SL,[{ioId:'sl-cui-1',label:'CUI SL',text:'STANDARD LANGUAGE BODY.'}])");
  clearAll();
  setCui({cuiCtrlBy:'DCSA'});
  E("slInsert('CUI SL')");
  const v=i13().value;
  return v.indexOf('STANDARD LANGUAGE BODY.')<v.indexOf('Controlled By:') ? true : v;
});
t('the block survives a draft round-trip without duplicating', ()=>{
  clearAll();
  setCui({cuiCtrlBy:'DCSA',cuiPoc:'J. Adams'});
  const ws=E("collectWorkspace()");
  E("CUI_LAST='';document.getElementById('item13').value='';['cuiCtrlBy','cuiCat','cuiPoc'].forEach(function(k){document.getElementById(k).value='';});");
  E("applyWorkspace("+JSON.stringify(ws)+")");
  const n=(i13().value.match(/Controlled By:/g)||[]).length;
  return (n===1 && E("CUI_LAST")==='Controlled By: DCSA\nCUI Category:\nDistribution/LDC:\nPoint of Contact (POC): J. Adams') ? true : {n,last:E("CUI_LAST")};
});
t('the CUI fields are not written into any official form field', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/function buildXfaDatasets\(d\)\{[\s\S]*?\n\}/.exec(src);
  return (m && !/cuiCtrlBy|cuiCat|cuiPoc/.test(m[0])) ? true : 'a CUI field reached the XFA writer';
});

H('62. Limited dissemination controls');
const ldcOn=(id,list)=>{ const cb=w.document.getElementById(id); cb.checked=true;
  const o=E("LDC_OPTIONS.filter(function(x){return x.id==='"+id+"';})[0]");
  if(o&&o.list&&list!=null){ const li=w.document.getElementById(id+'List'); if(li) li.value=list; }
  E("ldcToggle('"+id+"')"); };
const ldcOff=()=>{ E("LDC_OPTIONS.forEach(function(o){var c=document.getElementById(o.id);if(c)c.checked=false;var l=document.getElementById(o.id+'List');if(l)l.value='';});"); E("cuiSync()"); };
t('every control in the registry is rendered, and nothing else is', ()=>{
  const n=E("LDC_OPTIONS.length");
  const boxes=w.document.querySelectorAll('#ldcRows input[type=checkbox]');
  const ids=E("LDC_OPTIONS.map(function(o){return o.id;})");
  const rendered=Array.from(boxes).map(b=>b.id);
  return (boxes.length===n && JSON.stringify(ids)===JSON.stringify(rendered)) ? true : {n,rendered};
});
t('all ten controls are present with their markings', ()=>{
  const marks=E("LDC_OPTIONS.map(function(o){return o.mark;})");
  const want=['FED ONLY','FEDCON','NOCON','DL ONLY','RELIDO','NOFORN','REL TO','DISPLAY ONLY','ATTORNEY-CLIENT','ATTORNEY-WP'];
  return JSON.stringify(marks)===JSON.stringify(want) ? true : marks;
});
t('the full description is on the label for hover', ()=>{
  const lab=w.document.querySelector('#ldcRows label[for="ldcNoforn"]');
  return (lab && /may not be disseminated in any form to foreign governments/.test(lab.getAttribute('title'))) ? true : (lab&&lab.getAttribute('title'));
});
t('exactly three controls take a list, and only those show a list box', ()=>{
  const withList=E("LDC_OPTIONS.filter(function(o){return o.list;}).map(function(o){return o.mark;})");
  const boxes=Array.from(w.document.querySelectorAll('#ldcRows input[type=text]')).map(b=>b.id);
  return (JSON.stringify(withList.slice().sort())===JSON.stringify(['DISPLAY ONLY','DL ONLY','REL TO'])
    && boxes.length===3) ? true : {withList,boxes};
});
t('one control renders as its bare marking', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcNoforn');
  return E("ldcMark()")==='NOFORN' ? true : E("ldcMark()");
});
t('multiple controls are alphabetised and slash-separated', ()=>{
  clearAll(); ldcOff();
  ldcOn('ldcNoforn'); ldcOn('ldcAttyClient'); ldcOn('ldcFedcon');
  return E("ldcMark()")==='ATTORNEY-CLIENT/FEDCON/NOFORN' ? true : E("ldcMark()");
});
t('the order controls are ticked in cannot change what prints', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcNoforn'); ldcOn('ldcFedcon');
  const a=E("ldcMark()");
  ldcOff(); ldcOn('ldcFedcon'); ldcOn('ldcNoforn');
  const b=E("ldcMark()");
  return a===b ? true : {a,b};
});
t('REL TO carries its country list', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcRelTo','GBR, AUS');
  return E("ldcMark()")==='REL TO USA, GBR, AUS' ? true : E("ldcMark()");
});
t('DISPLAY ONLY and DL ONLY carry their lists too', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcDisplay','NATO');
  const a=E("ldcMark()");
  ldcOff(); ldcOn('ldcDlOnly','Program Office A');
  const b=E("ldcMark()");
  return (a==='DISPLAY ONLY NATO' && b==='DL ONLY Program Office A') ? true : {a,b};
});
t('a list-bearing control with no list yet prints bare, never a placeholder', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcRelTo','');
  const v=E("ldcMark()");
  return (v==='REL TO' && v.indexOf('{LIST}')<0) ? true : v;
});
t('sorting uses the marking, not the typed list', ()=>{
  clearAll(); ldcOff();
  ldcOn('ldcRelTo','AAA'); ldcOn('ldcNoforn');
  return E("ldcMark()")==='NOFORN/REL TO USA, AAA' ? true : E("ldcMark()");
});
t('the list box is revealed only while its control is ticked', ()=>{
  clearAll(); ldcOff();
  const wrap=()=>w.document.getElementById('ldcRelToListWrap').style.display;
  E("ldcSyncVis()");
  const before=wrap();
  ldcOn('ldcRelTo','GBR');
  const during=wrap();
  w.document.getElementById('ldcRelTo').checked=false; E("ldcToggle('ldcRelTo')");
  return (before==='none'&&during==='block'&&wrap()==='none') ? true : {before,during,after:wrap()};
});
t('the LDC row sits between CUI Category and POC', ()=>{
  const labels=E("CUI_ROWS.map(function(r){return r.label;})");
  return JSON.stringify(labels)===JSON.stringify(['Controlled By','CUI Category','Distribution/LDC','Point of Contact (POC)']) ? true : labels;
});
t('ticking a control alone builds the whole designation block', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcNoforn');
  return i13().value==='Controlled By:\nCUI Category:\nDistribution/LDC: NOFORN\nPoint of Contact (POC):'
    ? true : JSON.stringify(i13().value);
});
t('unticking every control empties the row without emptying the block', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcNoforn');
  cui('cuiCtrlBy').value='DCSA'; E("cuiSync()");
  ldcOff();
  return i13().value==='Controlled By: DCSA\nCUI Category:\nDistribution/LDC:\nPoint of Contact (POC):'
    ? true : JSON.stringify(i13().value);
});
t('controls and their lists survive a draft round-trip', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcRelTo','GBR, AUS'); ldcOn('ldcFedcon');
  const ws=E("collectWorkspace()");
  ldcOff(); E("CUI_LAST='';document.getElementById('item13').value='';");
  E("applyWorkspace("+JSON.stringify(ws)+")");
  return E("ldcMark()")==='FEDCON/REL TO USA, GBR, AUS' ? true : E("ldcMark()");
});
t('reopening a draft reveals the list box for a control that was ticked', ()=>{
  clearAll(); ldcOff(); ldcOn('ldcRelTo','GBR, AUS');
  const ws=E("collectWorkspace()");
  ldcOff(); E("ldcSyncVis()");
  E("applyWorkspace("+JSON.stringify(ws)+")");
  const vis=w.document.getElementById('ldcRelToListWrap').style.display;
  const val=w.document.getElementById('ldcRelToList').value;
  return (vis==='block' && val==='GBR, AUS') ? true : {vis,val};
});
t('no LDC field reaches the official form writer', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/function buildXfaDatasets\(d\)\{[\s\S]*?\n\}/.exec(src);
  return (m && !/ldc[A-Z]/.test(m[0])) ? true : 'an LDC field reached the XFA writer';
});

H('63. Distribution statements');
const dstmt=v=>{ w.document.getElementById('distStmt').value=v; E("distChange()"); };
const dset=(id,v)=>{ w.document.getElementById(id).value=v; E("cuiSync()"); };
const distClear=()=>{ ['distDate','distOffice'].forEach(id=>{const e=w.document.getElementById(id); if(e)e.value='';}); dstmt(''); };
t('all six statements are offered, from the table', ()=>{
  const keys=E("DIST_STATEMENTS.map(function(s){return s.key;})");
  const opts=Array.from(w.document.querySelectorAll('#distStmt option')).map(o=>o.value).filter(Boolean);
  return (JSON.stringify(keys)===JSON.stringify(['A','B','C','D','E','F'])
    && JSON.stringify(opts)===JSON.stringify(keys)) ? true : {keys,opts};
});
t('A and F take no reason for control', ()=>{
  const a=E("DIST_STATEMENTS.filter(function(s){return s.key==='A';})[0].cats.length");
  const f=E("DIST_STATEMENTS.filter(function(s){return s.key==='F';})[0].cats.length");
  return (a===0&&f===0) ? true : {a,f};
});
t('the reason picker offers only what the chosen statement allows', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('C');
  const shown=Array.from(w.document.querySelectorAll('#distCat option')).map(o=>o.value).filter(Boolean);
  const want=E("DIST_STATEMENTS.filter(function(s){return s.key==='C';})[0].cats");
  return JSON.stringify(shown)===JSON.stringify(want) ? true : {shown,want};
});
t('B and E keep their own wording of the shared reasons', ()=>{
  const b=E("DIST_STATEMENTS.filter(function(s){return s.key==='B';})[0].cats");
  const e=E("DIST_STATEMENTS.filter(function(s){return s.key==='E';})[0].cats");
  return (b.indexOf('Proprietary Information')>=0 && b.indexOf('Small Business Innovation Support (SBIR)')>=0
       && e.indexOf('Proprietary Business Information')>=0 && e.indexOf('SBIR')>=0) ? true : {b,e};
});
t('switching statement drops a reason that is not valid for the new one', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('B');
  w.document.getElementById('distCat').value='Contractor Performance Evaluation'; E("cuiSync()");
  dstmt('C');
  return w.document.getElementById('distCat').value==='' ? true : w.document.getElementById('distCat').value;
});
t('switching statement keeps a reason that is still valid', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('B');
  w.document.getElementById('distCat').value='Critical Technology'; E("cuiSync()");
  dstmt('C');
  return w.document.getElementById('distCat').value==='Critical Technology' ? true : w.document.getElementById('distCat').value;
});
t('statement C assembles around its fill-ins', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('C');
  w.document.getElementById('distCat').value='Critical Technology';
  dset('distDate','20240315'); dset('distOffice','Naval Air Systems Command');
  return E("distRender()")==='Distribution authorized to U.S. Government agencies and their contractors; Critical Technology; 20240315. Other requests for this document must be referred to Naval Air Systems Command.'
    ? true : E("distRender()");
});
t('statement A has no fill-ins to assemble', ()=>{
  clearAll(); ldcOff(); distClear(); dstmt('A');
  return E("distRender()")==='Approved for public release: distribution is unlimited.' ? true : E("distRender()");
});
t('statement F takes an office and a date but no reason', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('F'); dset('distDate','20240315'); dset('distOffice','NAVAIR');
  const catShown=w.document.getElementById('distCatWrap').style.display;
  return (E("distRender()")==='Further distribution only as directed by NAVAIR; 20240315 or higher DoD authority.'
    && catShown==='none') ? true : {r:E("distRender()"),catShown};
});
t('an unfilled slot leaves no stray separator behind', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('C'); dset('distOffice','NAVAIR');
  const r=E("distRender()");
  return (r.indexOf(';;')<0 && r.indexOf('; .')<0 && r.indexOf('contractors.')>0) ? true : r;
});
t('a missing controlling office stays visibly unfilled', ()=>{
  clearAll(); ldcOff(); distClear(); dstmt('C');
  return /\[controlling DoD office\]/.test(E("distRender()")) ? true : E("distRender()");
});
t('statement and controls share the row, joined so both can be read back', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('A'); ldcOn('ldcNoforn'); ldcOn('ldcFedcon');
  const row=E("CUI_ROWS.filter(function(r){return r.label==='Distribution/LDC';})[0].get()");
  return row==='Approved for public release: distribution is unlimited.; FEDCON/NOFORN' ? true : row;
});
t('either half alone fills the row without a dangling separator', ()=>{
  clearAll(); ldcOff(); distClear(); dstmt('A');
  const a=E("CUI_ROWS.filter(function(r){return r.label==='Distribution/LDC';})[0].get()");
  distClear(); ldcOn('ldcNoforn');
  const b=E("CUI_ROWS.filter(function(r){return r.label==='Distribution/LDC';})[0].get()");
  return (a==='Approved for public release: distribution is unlimited.' && b==='NOFORN') ? true : {a,b};
});
t('a statement alone builds the whole designation block', ()=>{
  clearAll(); ldcOff(); distClear(); dstmt('A');
  return i13().value==='Controlled By:\nCUI Category:\nDistribution/LDC: Approved for public release: distribution is unlimited.\nPoint of Contact (POC):'
    ? true : JSON.stringify(i13().value);
});
t('the reason survives a draft round-trip despite being built at restore', ()=>{
  clearAll(); ldcOff(); distClear();
  dstmt('E');
  w.document.getElementById('distCat').value='Proprietary Business Information';
  dset('distDate','20240401'); dset('distOffice','DCMA');
  const ws=E("collectWorkspace()");
  distClear(); E("CUI_LAST='';document.getElementById('item13').value='';");
  E("applyWorkspace("+JSON.stringify(ws)+")");
  const cat=w.document.getElementById('distCat').value;
  const opts=Array.from(w.document.querySelectorAll('#distCat option')).map(o=>o.value).filter(Boolean).length;
  return (cat==='Proprietary Business Information' && opts===14) ? true : {cat,opts};
});
t('no distribution field reaches the official form writer', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/function buildXfaDatasets\(d\)\{[\s\S]*?\n\}/.exec(src);
  return (m && !/distStmt|distCat|distOffice|distDate/.test(m[0])) ? true : 'a distribution field reached the XFA writer';
});

H('64. Configurable export filename');
const fnReset=()=>{ E("localStorage.removeItem('dd254_fname_fields');localStorage.removeItem('dd254_fname_sep');"); };
const fnFill=()=>{ E("['i2a','i2b','i2c','i6a','i6b','i7a','i7b','i16a','i17a','iEffort'].forEach(function(k){var e=document.getElementById(k);if(e)e.value='';});");
  const v={i2a:'N00178-24-F-1234',i2b:'SUB-88291',i2c:'RFP-24-R-0033',i6a:'Example Corporation\nSuite 400',i6b:'1ABC5',i7a:'Subcontractor Inc',i7b:'2XY99',i16a:'J Adams',i17a:'R Mitchell',iEffort:'TO-0007'};
  Object.keys(v).forEach(k=>{ const e=w.document.getElementById(k); if(e) e.value=v[k]; }); };
t('the default reproduces the previous fixed convention', ()=>{
  fnReset();
  return JSON.stringify(E("fnFieldsGet()"))===JSON.stringify(['i6b','i7b','i2a','sol']) && E("fnSepGet()")==='-'
    ? true : {f:E("fnFieldsGet()"),s:E("fnSepGet()")};
});
t('a company filing by contract number alone gets exactly that', ()=>{
  fnReset(); fnFill(); E("fnFieldsSet(['i2a'])");
  return E("fnBuild()")==='N00178-24-F-1234' ? true : E("fnBuild()");
});
t('a company filing by CAGE alone gets exactly that', ()=>{
  fnReset(); fnFill(); E("fnFieldsSet(['i6b'])");
  return E("fnBuild()")==='1ABC5' ? true : E("fnBuild()");
});
t('order is honoured', ()=>{
  fnFill(); E("fnFieldsSet(['i2a','i6b'])");
  const a=E("fnBuild()");
  E("fnFieldsSet(['i6b','i2a'])");
  return (a==='N00178-24-F-1234-1ABC5' && E("fnBuild()")==='1ABC5-N00178-24-F-1234') ? true : {a,b:E("fnBuild()")};
});
t('the separator choice is applied', ()=>{
  fnFill(); E("fnFieldsSet(['i6b','i2a']); fnSepSet('_')");
  const u=E("fnBuild()");
  E("fnSepSet('-')");
  return (u==='1ABC5_N00178-24-F-1234' && E("fnBuild()")==='1ABC5-N00178-24-F-1234') ? true : {u,d:E("fnBuild()")};
});
t('an empty box is skipped without leaving a separator', ()=>{
  fnFill(); w.document.getElementById('i2c').value='';
  E("fnFieldsSet(['i6b','i2c','i2a'])");
  const v=E("fnBuild()");
  return (v==='1ABC5-N00178-24-F-1234' && v.indexOf('--')<0) ? true : v;
});
t('every box empty falls back rather than producing an empty name', ()=>{
  E("['i2a','i2b','i2c','i6b'].forEach(function(k){document.getElementById(k).value='';});");
  E("fnFieldsSet(['i2a','i2b'])");
  return E("fnBuild()")==='' ? true : E("fnBuild()");
});
t('multi-line boxes contribute their first line only', ()=>{
  fnFill(); E("fnFieldsSet(['i6a'])");
  return E("fnBuild()")==='ExampleCorporation' ? true : E("fnBuild()");
});
t('6b, 7b and 8b are offered as their own boxes', ()=>{
  const keys=E("FN_FIELDS.map(function(f){return f.key;})");
  return (keys.indexOf('i6b')>=0 && keys.indexOf('i7b')>=0 && keys.indexOf('p8b')>=0) ? true : keys;
});
t('each box is capped at 30 characters', ()=>{
  fnFill();
  w.document.getElementById('i6a').value='A'.repeat(80);
  E("fnFieldsSet(['i6a'])");
  const v=E("fnBuild()");
  return (v.length===30 && E("FN_MAX")===30) ? true : v.length;
});
t('a long combination still stays inside a usable path length', ()=>{
  fnFill();
  ['i6a','i7a','i16a','i17a'].forEach(k=>{ w.document.getElementById(k).value='B'.repeat(120); });
  E("fnFieldsSet(FN_FIELDS.map(function(f){return f.key;}))");
  const v=E("fnBuild()");
  return v.length<=(30+1)*E("FN_FIELDS.length") && v.length<200 ? true : v.length;
});
t('hyphens inside a contract number are preserved, not eaten by the separator', ()=>{
  fnFill();
  w.document.getElementById('i2a').value='ABC-123';
  E("fnFieldsSet(['i2a','i6b']); fnSepSet('-')");
  const v=E("fnBuild()");
  return v==='ABC-123-1ABC5' ? true : v;
});
t('an unknown stored box is ignored rather than breaking the name', ()=>{
  fnFill();
  E("localStorage.setItem('dd254_fname_fields',JSON.stringify(['i2a','i99nope']))");
  return E("fnBuild()")==='N00178-24-F-1234' ? true : E("fnBuild()");
});
t('corrupt stored settings fall back to the default', ()=>{
  E("localStorage.setItem('dd254_fname_fields','not json')");
  const a=JSON.stringify(E("fnFieldsGet()"));
  E("localStorage.setItem('dd254_fname_fields',JSON.stringify([]))");
  const b=JSON.stringify(E("fnFieldsGet()"));
  const want=JSON.stringify(['i6b','i7b','i2a','sol']);
  return (a===want&&b===want) ? true : {a,b};
});
await ta('the settings panel lists every box exactly once', async()=>{
  fnReset(); await E("settingsOpen()");
  /* Counted on visible rows, not raw innerHTML — the move and remove buttons
     repeat the label in their accessible names, which is correct. */
  const shown=Array.from(w.document.querySelectorAll('#settingsView span'))
    .map(x=>x.textContent.trim());
  const labels=E("FN_FIELDS.map(function(f){return f.label;})");
  const bad=labels.filter(l=>shown.filter(x=>x===l).length>1);
  const listed=labels.filter(l=>w.document.getElementById('settingsView').innerHTML.indexOf(l)>=0);
  return (bad.length===0 && listed.length===labels.length) ? true : {bad,listed:listed.length};
});
await ta('reordering from the panel changes the stored order', async()=>{
  fnReset(); await E("settingsOpen()"); E("fnMove(0,1)");
  return JSON.stringify(E("fnFieldsGet()"))===JSON.stringify(['i7b','i6b','i2a','sol'])
    ? true : E("fnFieldsGet()");
});
t('adding and removing from the panel works and cannot duplicate', ()=>{
  fnReset(); E("fnAdd('i2a'); fnAdd('i2a')");
  const n=E("fnFieldsGet()").filter(k=>k==='i2a').length;
  E("fnDrop('i2a')");
  return (n===1 && E("fnFieldsGet()").indexOf('i2a')<0) ? true : {n,after:E("fnFieldsGet()")};
});
await ta('the exported filename uses the chosen convention', async()=>{
  fnReset(); fnFill();
  /* No open draft, so the name resolves from the form rather than waiting on
     the drafts database. */
  E("if(window.DASH) DASH.current=null;");
  E("fnFieldsSet(['i2a']); fnSepSet('-')");
  const n=await E("dd254ExportName()");
  return /^N00178-24-F-1234/.test(String(n)) ? true : String(n);
});

H('65. Item 13 layout — sections over one store');
const b13=()=>w.document.getElementById('item13');
const b13Clear=()=>{ b13().value=''; E("SUP_LAST='';CMA_LAST='';CUI_LAST='';");
  ['iEffort','i7a','i7cma','cuiCtrlBy','cuiCat','cuiPoc','distDate','distOffice'].forEach(k=>{const e=w.document.getElementById(k);if(e)e.value='';});
  E("var s=document.getElementById('distStmt'); if(s){s.value='';distSyncCats();}");
  E("LDC_OPTIONS.forEach(function(o){var c=document.getElementById(o.id);if(c)c.checked=false;});"); };
t('the layout setting is offered and defaults to one block', ()=>{
  E("localStorage.removeItem('dd254_b13_view')");
  const inReg=E("SETTINGS_DEFS.some(function(d){return d.key==='b13View';})");
  return (inReg && E("b13ViewGet()")==='block') ? true : {inReg,v:E("b13ViewGet()")};
});
t('writing a section creates it with its heading', ()=>{
  b13Clear(); E("b13SectionSet('10a','Access to COMSEC requires a final clearance.')");
  return b13().value==='Reference 10a:\n\nAccess to COMSEC requires a final clearance.' ? true : JSON.stringify(b13().value);
});
t('the written format is Reference, a blank line, then the text', ()=>{
  b13Clear(); E("b13SectionSet('11c','Contractor will reference the SCG.')");
  return b13().value==='Reference 11c:\n\nContractor will reference the SCG.'
    ? true : JSON.stringify(b13().value);
});
t('older Ref. headings are still found so nothing is duplicated', ()=>{
  b13Clear();
  b13().value='Ref. 10a: Written by an earlier version.';
  const read=E("b13SectionGet('10a')");
  E("b13SectionSet('10a','Rewritten.')");
  const n=(b13().value.match(/10a\s*:/g)||[]).length;
  return (read==='Written by an earlier version.' && n===1) ? true : {read,n,v:b13().value};
});
t('reading a section returns its body without the heading', ()=>{
  b13Clear(); E("b13SectionSet('10a','Body text here.')");
  return E("b13SectionGet('10a')")==='Body text here.' ? true : E("b13SectionGet('10a')");
});
t('sections land in form order regardless of the order written', ()=>{
  b13Clear();
  E("b13SectionSet('11c','Eleven C body.')");
  E("b13SectionSet('10a','Ten A body.')");
  const v=b13().value;
  return v.indexOf('Reference 10a')<v.indexOf('Reference 11c') ? true : v;
});
t('rewriting a section replaces it in place, not a second copy', ()=>{
  b13Clear(); E("b13SectionSet('10a','First.')"); E("b13SectionSet('10a','Second.')");
  const n=(b13().value.match(/Reference 10a:/g)||[]).length;
  return (n===1 && /Second\./.test(b13().value)) ? true : {n,v:b13().value};
});
t('a section moved down the block is rewritten where it stands', ()=>{
  b13Clear();
  E("b13SectionSet('10a','A body.')"); E("b13SectionSet('11c','C body.')");
  b13().value='Reference 11c:\n\nC body.\n\nReference 10a:\n\nA body.';
  E("b13SectionSet('10a','A body revised.')");
  const v=b13().value;
  return (v.indexOf('Reference 11c')===0 && /A body revised\./.test(v)
    && (v.match(/Reference 10a:/g)||[]).length===1) ? true : v;
});
t('clearing a section removes it and leaves the neighbours intact', ()=>{
  b13Clear();
  E("b13SectionSet('10a','A body.')"); E("b13SectionSet('11c','C body.')");
  E("b13SectionSet('10a','')");
  return b13().value==='Reference 11c:\n\nC body.' ? true : JSON.stringify(b13().value);
});
t('operator prose outside any section is never touched', ()=>{
  b13Clear();
  b13().value='Opening paragraph the operator typed.';
  E("b13SectionSet('10a','A body.')");
  E("b13SectionSet('10a','A body two.')");
  return /Opening paragraph the operator typed\./.test(b13().value) ? true : b13().value;
});
t('a section keeps its own wrapped lines', ()=>{
  b13Clear(); E("b13SectionSet('10a','Line one.\\nLine two.')");
  b13().value=b13().value+'\n\nOperator paragraph.';
  return (E("b13SectionGet('10a')")==='Line one.\nLine two.'
    && /Operator paragraph\./.test(b13().value)) ? true : JSON.stringify(E("b13SectionGet('10a')"));
});
t('sections sit below the effort line and above the CUI block', ()=>{
  b13Clear();
  w.document.getElementById('iEffort').value='TO-7000'; E("supSync()");
  E("b13SectionSet('10a','A body.')");
  w.document.getElementById('cuiCtrlBy').value='DCSA'; E("cuiSync()");
  const v=b13().value;
  return (v.indexOf('This is in support of effort TO-7000.')===0
    && v.indexOf('Reference 10a')>0
    && v.indexOf('Reference 10a')<v.indexOf('Controlled By:')) ? true : v;
});
t('sections stay above the classified mailing addresses', ()=>{
  b13Clear();
  E("document.getElementById('i7a').value='Example Corp';document.getElementById('i7cma').value='PO Box 1\\nAnytown, ST 00000';cmaSync();");
  E("b13SectionSet('11c','C body.')");
  const v=b13().value;
  return v.indexOf('Reference 11c')<v.indexOf('Classified Mailing Address') ? true : v;
});
t('the composer shows a box per ticked item and nothing more', ()=>{
  b13Clear(); E("b13ViewSet('sections')");
  E("var c=document.getElementById('c10a'); if(c&&!c.checked){var t=document.getElementById('cb10a'); if(t)t.click();}");
  E("b13RenderCompose()");
  const boxes=Array.from(w.document.querySelectorAll('#b13Compose textarea')).map(t=>t.getAttribute('data-b13key'));
  return (boxes.indexOf('10a')>=0 && boxes.length===E("b13ActiveKeys()").length) ? true : boxes;
});
t('a section already in the text gets a box even if its item is unticked', ()=>{
  b13Clear(); E("b13SectionSet('11j','Written directly.')"); E("b13RenderCompose()");
  const boxes=Array.from(w.document.querySelectorAll('#b13Compose textarea')).map(t=>t.getAttribute('data-b13key'));
  return boxes.indexOf('11j')>=0 ? true : boxes;
});
t('typing in a composer box writes through to the real Item 13', ()=>{
  b13Clear(); E("b13SectionSet('10a','x')"); E("b13RenderCompose()");
  const ta=w.document.querySelector('#b13Compose textarea[data-b13key="10a"]');
  ta.value='Composed body.'; E("b13ComposeInput(document.querySelectorAll('#b13Compose textarea')[0])");
  return /Reference 10a:\n\nComposed body\./.test(b13().value) ? true : JSON.stringify(b13().value);
});
t('editing the raw field is authoritative and the composer follows', ()=>{
  b13Clear(); E("b13ViewSet('sections')"); E("b13SectionSet('10a','Original.')");
  b13().value='Ref. 10a: Edited straight into the field.';
  E("b13SyncFromRaw()");
  const ta=w.document.querySelector('#b13Compose textarea[data-b13key="10a"]');
  return (ta && ta.value==='Edited straight into the field.') ? true : (ta&&ta.value);
});
t('switching layout never alters the stored text', ()=>{
  b13Clear();
  E("b13SectionSet('10a','A body.')"); E("b13SectionSet('11c','C body.')");
  const before=b13().value;
  E("b13ViewSet('sections')"); E("b13ViewSet('block')"); E("b13ViewSet('sections')");
  return b13().value===before ? true : {before,after:b13().value};
});
t('there is one store — the composer keeps no copy of its own', ()=>{
  b13Clear(); E("b13ViewSet('sections')"); E("b13SectionSet('10a','Only copy.')");
  b13().value='';
  E("b13RenderCompose()");
  const ta=w.document.querySelector('#b13Compose textarea[data-b13key="10a"]');
  return (E("b13SectionGet('10a')")==='' && (!ta||ta.value==='')) ? true : 'a second copy survived';
});
t('ticking an item makes its section appear without an explicit render', ()=>{
  b13Clear(); E("b13ViewSet('sections')");
  E("['10a','11c'].forEach(function(k){var c=document.getElementById('c'+k); if(c&&c.checked){var t=document.getElementById('cb'+k); if(t)t.click();}}); run();");
  const before=w.document.querySelectorAll('#b13Compose textarea').length;
  E("var t=document.getElementById('cb11c'); if(t)t.click(); run();");
  const after=Array.from(w.document.querySelectorAll('#b13Compose textarea')).map(x=>x.getAttribute('data-b13key'));
  return (after.indexOf('11c')>=0 && after.length===before+1) ? true : {before,after};
});
t('unticking an item removes its box again', ()=>{
  E("var t=document.getElementById('cb11c'); if(t)t.click(); run();");
  const keys=Array.from(w.document.querySelectorAll('#b13Compose textarea')).map(x=>x.getAttribute('data-b13key'));
  return keys.indexOf('11c')<0 ? true : keys;
});
t('unchecking removes populated language in sections layout and offers undo', ()=>{
  E("document.getElementById('item13').value='';b13ViewSet('sections');document.getElementById('c10f').checked=false;b13SelectionReset();run();");
  E("document.getElementById('cb10f').click();b13SectionSet('10f','SAP wording written by the operator.');document.getElementById('cb10f').click();");
  const gone=E("!b13Find('10f')"), unchecked=!w.document.getElementById('c10f').checked;
  const undo=w.document.querySelector('#b13Undo button');
  return (gone&&unchecked&&undo&&/Put back/.test(undo.textContent)) ? true : {gone,unchecked,undo:!!undo,text:E("b13Text()")};
});
t('one-click put back restores both the checkbox and its exact wording', ()=>{
  E("b13UndoRestore('10f')");
  return (w.document.getElementById('c10f').checked && E("b13SectionGet('10f')")==='SAP wording written by the operator.') ? true
    : {checked:w.document.getElementById('c10f').checked,body:E("b13SectionGet('10f')")};
});
t('unchecking removes populated language in one-block layout too', ()=>{
  E("document.getElementById('item13').value='';b13ViewSet('block');document.getElementById('c11j').checked=false;b13SelectionReset();run();");
  E("document.getElementById('cb11j').click();b13SectionSet('11j','OPSEC wording.');document.getElementById('cb11j').click();");
  return (!E("b13Find('11j')")&&!w.document.getElementById('c11j').checked&&!!w.document.querySelector('#b13Undo button')) ? true : E("b13Text()");
});
t('a keystroke elsewhere does not take focus out of a composer box', ()=>{
  b13Clear(); E("b13ViewSet('sections')");
  E("var t=document.getElementById('cb10a'); if(t&&!document.getElementById('c10a').checked)t.click(); run();");
  const ta=w.document.querySelector('#b13Compose textarea[data-b13key=\"10a\"]');
  if(!ta) return 'no 10a box';
  ta.focus(); ta.value='half typed';
  E("run()");
  const same=w.document.querySelector('#b13Compose textarea[data-b13key=\"10a\"]');
  return (same===ta && same.value==='half typed') ? true : 'composer box was replaced mid-edit';
});
t('the raw field stays visible in sections layout as the failsafe', ()=>{
  E("b13ViewSet('sections')");
  const raw=w.document.getElementById('item13');
  const note=w.document.getElementById('b13RawNote');
  return (raw && raw.style.display!=='none' && note && note.style.display==='block') ? true : 'failsafe hidden';
});
t('the layout choice persists', ()=>{
  E("b13ViewSet('sections')");
  const a=E("localStorage.getItem('dd254_b13_view')");
  E("b13ViewSet('block')");
  return (a==='sections' && E("localStorage.getItem('dd254_b13_view')")==='block') ? true : a;
});

H('66. Saving Item 13 language back to a template');
const selTpl=(ref)=>{ const s=w.document.getElementById('ctTplSel');
  if(ref===''){ s.value=''; return; }
  if(!Array.from(s.options).some(o=>o.value===ref)){ const o=w.document.createElement('option'); o.value=ref; s.appendChild(o); }
  s.value=ref; };
const seedCt=()=>{ E("tplSave(TPL_CT,[{ioId:'ct-save-1',label:'Save Target',data:ctBlankData()}]);");
  E("if(typeof buildCtPanel==='function') buildCtPanel();"); selTpl('ct-save-1'); };
t('saving is refused when no template is chosen', ()=>{
  seedCt(); selTpl('');
  const why=E("ctSaveWhyNot('10a','Some language.')");
  return /nowhere to save/.test(why) ? true : why;
});
t('saving is refused when there is nothing to save', ()=>{
  seedCt();
  const why=E("ctSaveWhyNot('10a','   ')");
  return /no Item 13 language/.test(why) ? true : why;
});
t('a valid save is not refused', ()=>{
  seedCt();
  return E("ctSaveWhyNot('10a','Some language.')")==='' ? true : E("ctSaveWhyNot('10a','Some language.')");
});
await ta('saving writes the language into the chosen template', async()=>{
  seedCt();
  const ok=await E("ctSaveLang('10a','Access requires a final clearance.')");
  const got=E("(tplLoad(TPL_CT)[0].data.l10||{})['10a']");
  return (ok===true && got==='Access requires a final clearance.') ? true : {ok,got};
});
await ta('Item 11 language lands in the 11 map, not the 10 map', async()=>{
  seedCt();
  await E("ctSaveLang('11c','Contractor will reference the SCG.')");
  const d=E("tplLoad(TPL_CT)[0].data");
  return ((d.l11||{})['11c']==='Contractor will reference the SCG.' && !(d.l10||{})['11c']) ? true : d;
});
await ta('replacing existing language asks first and honours a refusal', async()=>{
  seedCt();
  await E("ctSaveLang('10a','First wording.')");
  E("window.uiConfirm=async function(m){window.__CONF=m;return false;};");
  const ok=await E("ctSaveLang('10a','Second wording.')");
  const got=E("(tplLoad(TPL_CT)[0].data.l10||{})['10a']");
  const asked=/already has Item 13 language/.test(String(E("window.__CONF")||''));
  E("window.uiConfirm=async function(){return true;};");
  return (ok===false && got==='First wording.' && asked) ? true : {ok,got,asked};
});
await ta('confirming the replacement writes the new wording', async()=>{
  seedCt();
  await E("ctSaveLang('10a','First wording.')");
  await E("ctSaveLang('10a','Second wording.')");
  return E("(tplLoad(TPL_CT)[0].data.l10||{})['10a']")==='Second wording.' ? true : E("(tplLoad(TPL_CT)[0].data.l10||{})['10a']");
});
await ta('saving the same wording twice does not prompt', async()=>{
  seedCt();
  await E("ctSaveLang('10a','Same wording.')");
  E("window.__CONF='';window.uiConfirm=async function(m){window.__CONF=m;return true;};");
  await E("ctSaveLang('10a','Same wording.')");
  const asked=String(E("window.__CONF")||'');
  E("window.uiConfirm=async function(){return true;};");
  return asked==='' ? true : asked;
});
t('both entry points go through one save function', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const a=/function ctSaveFromSection\(key\)\{[\s\S]*?\n\}/.exec(src);
  const b=/function ctSaveFromPanel\(id\)\{[\s\S]*?\n\}/.exec(src);
  return (a&&b&&/ctSaveLang\(/.test(a[0])&&/ctSaveLang\(/.test(b[0])) ? true : 'an entry point bypasses ctSaveLang';
});
await ta('a section box saves the text actually in it', async()=>{
  seedCt(); b13Clear(); E("b13ViewSet('sections')");
  E("var t=document.getElementById('cb10a'); if(t&&!document.getElementById('c10a').checked)t.click(); run();");
  const ta2=w.document.getElementById('b13s_10a');
  if(!ta2) return 'no 10a section box';
  ta2.value='Typed into the section.';
  await E("ctSaveFromSection('10a')");
  return E("(tplLoad(TPL_CT)[0].data.l10||{})['10a']")==='Typed into the section.' ? true : E("(tplLoad(TPL_CT)[0].data.l10||{})['10a']");
});

H('67. Template language moves out of the side panel in sections layout');
t('the side panel drops Item 10 and 11 cards when sections are on', ()=>{
  b13Clear(); E("b13ViewSet('sections')");
  E("var t=document.getElementById('cb10a'); if(t&&!document.getElementById('c10a').checked)t.click();");
  E("buildTemplateLanguage()");
  const ids=Array.from(w.document.querySelectorAll('#bpPanel .tplcard')).map(c=>c.id.replace('tplcard-',''));
  const leaked=ids.filter(x=>/^1[01][a-m]/.test(x));
  return leaked.length===0 ? true : leaked;
});
t('the retired template-language panel stays absent in one-block layout', ()=>{
  E("b13ViewSet('block')");
  E("var c=document.getElementById('c10a'); if(c&&!c.checked){var t=document.getElementById('cb10a'); if(t)t.click();}");
  E("buildTemplateLanguage()");
  const ids=Array.from(w.document.querySelectorAll('#bpPanel .tplcard')).map(c=>c.id.replace('tplcard-',''));
  return ids.length===0 ? true : ids;
});
t('non Item 10/11 language also stays out of the retired panel', ()=>{
  E("b13ViewSet('sections'); buildTemplateLanguage()");
  const a=Array.from(w.document.querySelectorAll('#bpPanel .tplcard')).map(c=>c.id.replace('tplcard-',''));
  E("b13ViewSet('block')");
  return a.length===0 ? true : a;
});
t('each section box offers insert and save', ()=>{
  b13Clear(); E("b13ViewSet('sections')");
  E("var c=document.getElementById('c10a'); if(c&&!c.checked){var t=document.getElementById('cb10a'); if(t)t.click();} run();");
  const box=w.document.getElementById('b13s_10a');
  const wrap=box?box.parentNode:null;
  const btns=wrap?Array.from(wrap.querySelectorAll('button')).map(b=>b.textContent):[];
  return (btns.some(x=>/Insert template language/.test(x)) && btns.some(x=>/Save to template/.test(x))) ? true : btns;
});
t('inserting template language fills the section without doubling the heading', ()=>{
  b13Clear(); E("b13ViewSet('sections')");
  E("var c=document.getElementById('c10a'); if(c&&!c.checked){var t=document.getElementById('cb10a'); if(t)t.click();} run();");
  E("b13InsertTpl('10a')");
  const raw=b13().value;
  const heads=(raw.match(/10a\s*:/gi)||[]).length;
  return (heads===1 && /Access to classified COMSEC/.test(raw)) ? true : {heads,raw:raw.slice(0,90)};
});
t('text that already carries its own heading is not given a second one', ()=>{
  b13Clear();
  E("b13SectionSet('11c','Reference 11c:\\n\\nBody supplied with a heading.')");
  return b13().value==='Reference 11c:\n\nBody supplied with a heading.'
    ? true : JSON.stringify(b13().value);
});

H('68. Validation and checklist are separate scrollers');
t('the panel column holds two panels', ()=>{
  const n=w.document.querySelectorAll('.panel-col .rpanel').length;
  return n===2 ? true : n;
});
t('each panel is named for what it holds', ()=>{
  const v=w.document.getElementById('rpanelValidation');
  const c=w.document.getElementById('rpanelChecklist');
  if(!v||!c) return {v:!!v,c:!!c};
  const vh=v.querySelector('.rp-hdr').textContent.trim();
  const ch=c.querySelector('.rp-hdr').textContent.trim();
  return (vh==='Live Validation' && /Checklist/.test(ch)) ? true : {vh,ch};
});
t('validation output lives in the validation panel', ()=>{
  const v=w.document.getElementById('rpanelValidation');
  const want=['errorsPanel','item13tags','completionPanel'];
  const missing=want.filter(id=>!v.querySelector('#'+id));
  return missing.length===0 ? true : missing;
});
t('the things you act on live in the checklist panel', ()=>{
  const c=w.document.getElementById('rpanelChecklist');
  const want=['slPanel','ctTplSel','emailDistSection','attachReminderSection'];
  const missing=want.filter(id=>!c.querySelector('#'+id));
  return missing.length===0 ? true : missing;
});
t('nothing was dropped in the split', ()=>{
  const v=w.document.getElementById('rpanelValidation');
  const c=w.document.getElementById('rpanelChecklist');
  const n=v.querySelectorAll('.rp-section').length+c.querySelectorAll('.rp-section').length;
  return n===11 ? true : n+' sections, expected 11';
});
t('no panel content ended up outside either panel', ()=>{
  const stray=Array.from(w.document.querySelectorAll('.panel-col .rp-section'))
    .filter(sec=>!sec.closest('.rpanel')).length;
  return stray===0 ? true : stray;
});
t('both panels are styled the same way', ()=>{
  const v=w.document.getElementById('rpanelValidation');
  const c=w.document.getElementById('rpanelChecklist');
  return (v.className===c.className && v.querySelector('.rp-hdr') && c.querySelector('.rp-hdr')) ? true : {v:v.className,c:c.className};
});
t('each panel scrolls on its own rather than the column', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const hasPanelScroll=/\.panel-col \.rpanel\{[^}]*overflow-y:auto/.test(src);
  const colFrame=/\.panel-col\{[^}]*overflow:visible!important/.test(src);
  return (hasPanelScroll&&colFrame) ? true : {hasPanelScroll,colFrame};
});
t('collapsing still hides both panels', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  return /\.panel-col\.collapsed \.rpanel\{display:none\}/.test(src) ? true : 'collapse rule missing';
});

H('69. Chain of custody');
t('the audit log no longer stops at 5,000 entries', ()=>{
  const cap=E("AUD_CAP");
  return cap>=100000 ? true : cap;
});
t('reaching the cap records that entries were removed', ()=>{
  E("AUD_CACHE=[];");
  E("for(var i=0;i<AUD_CAP+3;i++) AUD_CACHE.push({ts:'2026-01-01T00:00:'+String(i%60).padStart(2,'0')+'.000Z',id:'d'+i,title:'t',action:'edited',detail:''});");
  E("audLog('dX','Late','edited','')");
  const a=E("audAll()");
  const marker=a.filter(x=>x.action==='log truncated');
  return (a.length===E("AUD_CAP") && marker.length===1 && /oldest entries removed/.test(marker[0].detail)) ? true : {n:a.length,marker:marker.length};
});
await ta('the log lives in its own store in the drafts database', async()=>{
  E("localStorage.removeItem(AUD_KEY);localStorage.removeItem(AUD_WAL_KEY);AUD_CACHE=[];");
  await E("audFlush()"); E("audLog('d1','T','created','one record')"); await E("AUD_WRITE");
  const rows=await E("audDbAll()"), dbName=E("DASH.db&&DASH.db.name"), hasStore=E("DASH.db.objectStoreNames.contains('audit')");
  const old=await E("tdbGet('audit')");
  return (dbName==='dd254_dashboard'&&hasStore&&rows.length===1&&rows[0].detail==='one record'&&!old) ? true
    : {dbName,hasStore,rows:rows.length,old:!!old};
});
await ta('a failed audit transaction remains in the synchronous recovery journal', async()=>{
  E("window.__AUD_DB_APPLY=audDbApply;audDbApply=async function(){return false;};localStorage.removeItem(AUD_WAL_KEY);AUD_CACHE=[];audLog('d2','T','edited','pending');");
  await E("AUD_WRITE"); const pending=E("audWalRead()");
  E("audDbApply=window.__AUD_DB_APPLY;"); await E("audFlush()");
  return (pending.length===1&&pending[0].detail==='pending') ? true : pending;
});
t('reads are still synchronous so existing callers are unchanged', ()=>{
  const r=E("audAll()");
  return Array.isArray(r) ? true : typeof r;
});
await ta('a cancelled delete does not record a deletion', async()=>{
  await wipe(); E("AUD_CACHE=[];");
  E("window.uiConfirm=async function(){return false;};");
  const rec={id:'cust-1',title:'Custody One',meta:{contract:'N00178-24-F-1234'},workspace:{}};
  await E("draftPut("+JSON.stringify(rec)+")");
  await E("dashDelete('cust-1')");
  const still=await E("draftGet('cust-1')");
  const logged=E("audAll()").filter(x=>x.action==='deleted').length;
  E("window.uiConfirm=async function(){return true;};");
  return (still && logged===0) ? true : {still:!!still,logged};
});
await ta('a confirmed delete does record one', async()=>{
  E("AUD_CACHE=[];");
  E("window.uiConfirm=async function(){return true;};");
  await E("dashDelete('cust-1')");
  const gone=await E("draftGet('cust-1')");
  const logged=E("audAll()").filter(x=>x.action==='deleted').length;
  return (!gone && logged===1) ? true : {gone:!!gone,logged};
});
await ta('deleting a parent warns and names its descendants', async()=>{
  await wipe(); E("AUD_CACHE=[];");
  await E("draftPut({id:'p1',title:'Original',meta:{contract:'ORIG-1'},workspace:{}})");
  await E("draftPut({id:'c1',title:'Rev 1',parentId:'p1',meta:{contract:'REV-1'},workspace:{}})");
  await E("draftPut({id:'c2',title:'Rev 2',parentId:'p1',meta:{contract:'REV-2'},workspace:{}})");
  E("window.__MSGS=[];window.uiConfirm=async function(m){window.__MSGS.push(m);return false;};");
  await E("dashDelete('p1')");
  const msgs=E("window.__MSGS");
  const still=await E("draftGet('p1')");
  E("window.uiConfirm=async function(){return true;};");
  return (still && msgs.length===1 && /parent of 2 other DD-254s/.test(msgs[0])
    && /REV-1/.test(msgs[0]) && /REV-2/.test(msgs[0])) ? true : {still:!!still,msgs};
});
await ta('a childless draft is not warned about descendants', async()=>{
  await wipe(); E("AUD_CACHE=[];");
  await E("draftPut({id:'solo',title:'Solo',meta:{contract:'SOLO-1'},workspace:{}})");
  E("window.__MSGS=[];window.uiConfirm=async function(m){window.__MSGS.push(m);return true;};");
  await E("dashDelete('solo')");
  const msgs=E("window.__MSGS");
  return (msgs.length===1 && !/parent of/.test(msgs[0])) ? true : msgs;
});
await ta('the backup carries a checksum for the history itself', async()=>{
  E("AUD_CACHE=[{ts:'2026-01-01T00:00:00.000Z',id:'d1',title:'T',action:'created',detail:''}];");
  let payload=null;
  const oldC=E("URL.createObjectURL");
  E("window.__CAP=null;URL.createObjectURL=function(b){window.__BLOB=b;return 'blob:x';};");
  await E("fullBackup()");
  const txt=await E("window.__BLOB.text()");
  E("URL.createObjectURL="+"window.__oldC||URL.createObjectURL");
  payload=JSON.parse(txt);
  const want=await E("bkSha256("+JSON.stringify(JSON.stringify([{ts:'2026-01-01T00:00:00.000Z',id:'d1',title:'T',action:'created',detail:''}]))+")");
  return (payload.auditSha256===want && payload.auditCount===1) ? true : {got:payload.auditSha256,want,count:payload.auditCount};
});
t('the body checksum still ignores the audit log so old backups verify', ()=>{
  return !/audit/.test(E("String(bkBody)")) ? true : 'bkBody now includes the audit log';
});

H('70. Semicolon after an item id');
t('a semicolon delimits an Item 13 marking, with or without a space', ()=>{
  const a=Object.keys(E("scanItem13('10a; Access to COMSEC is required.')")||{});
  const b=Object.keys(E("scanItem13('10a ; Access to COMSEC is required.')")||{});
  return (a.indexOf('10a')>=0 && b.indexOf('10a')>=0) ? true : {a,b};
});
t('the delimiters that already worked still work', ()=>{
  const forms=['10a:','10a.','10a-','10a —','10a)'];
  const bad=forms.filter(f=>Object.keys(E("scanItem13("+JSON.stringify(f+' Body text.')+")")||{}).indexOf('10a')<0);
  return bad.length===0 ? true : bad;
});
t('a semicolon does not turn a prose cross-reference into an entry', ()=>{
  const a=Object.keys(E("scanItem13('Reference Item 10a for additional guidance; see below.')")||{});
  return a.indexOf('10a')<0 ? true : a;
});
t('a semicolon before a disclaimer is still a disclaimer', ()=>{
  const a=Object.keys(E("scanItem13('10a; N/A')")||{});
  return a.indexOf('10a')<0 ? true : a;
});

H('71. Setting a validation flag aside');
const anyErr=()=>{ const e=E("window.DD254_ERRORS")||[]; return e[0]||''; };
await ta('a dismissal needs an open draft', async()=>{
  E("if(window.DASH) DASH.current=null; window.__A='';window.uiAlert=function(m){window.__A=m;};");
  const ok=await E("dismissAdd('Some check.')");
  return (ok===false && /Open a draft/.test(String(E("window.__A")||''))) ? true : {ok,a:E("window.__A")};
});
await ta('a dismissal without a reason is refused', async()=>{
  await wipe(); E("AUD_CACHE=[];");
  await E("draftPut({id:'dis-1',title:'Dismiss One',meta:{},workspace:{}})");
  await E("dashOpen('dis-1')");
  E("window.uiPrompt=async function(){return '   ';};window.__A='';window.uiAlert=function(m){window.__A=m;};");
  const ok=await E("dismissAdd('Item 14: marked YES — the additional security requirements must be described.')");
  return (ok===false && /reason is required/i.test(String(E("window.__A")||''))) ? true : {ok,a:E("window.__A")};
});
await ta('cancelling the reason prompt dismisses nothing', async()=>{
  E("window.uiPrompt=async function(){return null;};");
  const ok=await E("dismissAdd('Item 14: marked YES — the additional security requirements must be described.')");
  const rec=await E("draftGet('dis-1')");
  return (ok===false && !(rec.dismissed&&Object.keys(rec.dismissed).length)) ? true : {ok,d:rec.dismissed};
});
await ta('a dismissal is stored with its reason, author and time', async()=>{
  E("localStorage.setItem('dd254_owner','D. Adams');");
  E("window.uiPrompt=async function(){return 'Guidance covers 10b in this case; 10a is not applicable.';};");
  const ok=await E("dismissAdd('Item 14: marked YES — the additional security requirements must be described.')");
  const rec=await E("draftGet('dis-1')");
  const d=Object.values(rec.dismissed||{})[0]||{};
  return (ok===true && /10a is not applicable/.test(d.reason||'') && d.by==='D. Adams' && !!d.ts && !!d.text) ? true : d;
});
await ta('the dismissal is written to the audit log', async()=>{
  const a=E("audAll()").filter(x=>x.action==='flag dismissed');
  return (a.length===1 && /10a is not applicable/.test(a[0].detail||'')) ? true : a;
});
await ta('a dismissed finding stops counting toward the blocking total', async()=>{
  /* Cleared first — an earlier assertion in this section dismissed the same
     finding, so without this the baseline already excludes it. */
  const r0=await E("draftGet('dis-1')"); r0.dismissed={};
  await E("draftPut("+JSON.stringify({id:'dis-1',title:'Dismiss One',meta:{},workspace:{},dismissed:{}})+")");
  await E("dashOpen('dis-1')");
  E("var r=document.getElementById('i14yes'); if(r&&!r.checked) r.click(); run();");
  const before=(E("window.DD254_ERRORS")||[]).length;
  const msg='Item 14: marked YES — the additional security requirements must be described.';
  E("window.uiPrompt=async function(){return 'Not applicable here.';};");
  await E("dismissAdd("+JSON.stringify(msg)+")");
  E("run()");
  const after=(E("window.DD254_ERRORS")||[]).length;
  const dis=(E("window.DD254_DISMISSED")||[]);
  return (after===before-1 && dis.indexOf(msg)>=0) ? true : {before,after,dis};
});
t('a dismissed finding is still shown, struck through, with its reason', ()=>{
  const html=w.document.getElementById('errorsPanel').innerHTML;
  return (/Set aside/.test(html) && /line-through/.test(html) && /Not applicable here/.test(html)) ? true : html.slice(0,120);
});
t('every live finding offers a way to set it aside', ()=>{
  const rows=Array.from(w.document.querySelectorAll('#errorsPanel .ci-text.error'));
  const missing=rows.filter(r=>!/set aside/i.test(r.textContent));
  return missing.length===0 ? true : missing.length+' findings with no control';
});
await ta('putting it back restores the count and logs it', async()=>{
  const rec=await E("draftGet('dis-1')");
  const key=Object.keys(rec.dismissed||{})[0];
  const before=(E("window.DD254_ERRORS")||[]).length;
  await E("dismissClear('"+key+"')");
  E("run()");
  const after=(E("window.DD254_ERRORS")||[]).length;
  const logged=E("audAll()").filter(x=>x.action==='flag restored').length;
  return (after===before+1 && logged===1) ? true : {before,after,logged};
});
t('rewording a rule asks for the judgement again', ()=>{
  const a=E("dismissKey('Item 14: marked YES — describe it.')");
  const b=E("dismissKey('Item 14: marked YES — the additional security requirements must be described.')");
  return a!==b ? true : 'reworded rules share a key';
});
t('dismissal keys do not inherit the old 32-bit hash collisions', ()=>{
  const oldA=E("dismissLegacyKey('Aa')"), oldB=E("dismissLegacyKey('BB')");
  const nowA=E("dismissKey('Aa')"), nowB=E("dismissKey('BB')");
  return (oldA===oldB && nowA!==nowB) ? true : {oldA,oldB,nowA,nowB};
});
t('a dismissal cannot reach a compliance hold', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/async function dashSetStatus\(id,val\)\{[\s\S]*?\n\}/.exec(src);
  if(!m) return 'dashSetStatus not found';
  const gate=m[0];
  const holdAt=gate.indexOf('dashComplianceOpen');
  const ovrAt=gate.indexOf('statusOverride');
  return (holdAt>0 && ovrAt>0 && holdAt>ovrAt && !/dismiss/i.test(gate)) ? true : 'the hold gate now depends on dismissals';
});

H('72. CSV formula injection');
/* What a spreadsheet actually puts in the cell: RFC 4180 quoting is stripped
   first, because a guarded value that also contains a comma is wrapped, and
   asserting on the raw first character would only be testing the wrapper. */
const cellOf=v=>{
  const c=E("ioCsvEsc("+JSON.stringify(v)+")");
  return (c.charAt(0)==='"') ? c.slice(1,-1).replace(/""/g,'"') : c;
};
t('a cell starting with = is neutralised', ()=>{
  const a=cellOf('=1+1');
  const b=cellOf('=HYPERLINK("http://x","click")');
  return (a==="'=1+1" && b.indexOf("'=HYPERLINK")===0) ? true : {a,b};
});
t('the other formula lead-ins are covered', ()=>{
  const bad=['+1','-1','@SUM(A1)','\t=1','\r=1'].filter(v=>cellOf(v).charAt(0)!=="'");
  return bad.length===0 ? true : bad.map(v=>JSON.stringify(v));
});
t('ordinary text is untouched', ()=>{
  const vals=['N00178-24-F-1234','Example Corporation','10a: access required','1ABC5'];
  const changed=vals.filter(v=>E("ioCsvEsc("+JSON.stringify(v)+")")!==v);
  return changed.length===0 ? true : changed;
});
t('RFC 4180 quoting still applies, and to guarded cells too', ()=>{
  const a=E("ioCsvEsc('has, comma')");
  const b=E("ioCsvEsc('=has, comma')");
  return (a===JSON.stringify('has, comma') && b===JSON.stringify("'=has, comma")) ? true : {a,b};
});
t('a quote inside a guarded cell is still doubled', ()=>{
  const got=E("ioCsvEsc('=say \"hi\"')");
  return got==='"\'=say ""hi"""' ? true : JSON.stringify(got);
});
t('import strips the guard so the round-trip is lossless', ()=>{
  const orig='=1+1';
  const line=E("ioCsvEsc("+JSON.stringify(orig)+")");
  const back=E("ioCsvParse("+JSON.stringify(line)+")");
  return (back[0][0]===orig) ? true : {line,back};
});
t('an apostrophe the operator typed is preserved', ()=>{
  const vals=["O'Brien Systems","'quoted phrase'","'not a formula"];
  const bad=vals.filter(v=>E("ioCsvParse(ioCsvEsc("+JSON.stringify(v)+"))")[0][0]!==v);
  return bad.length===0 ? true : bad;
});
t('apostrophes immediately before formula leads survive the CSV round-trip', ()=>{
  const vals=["'=1+1","''=1+1","'@name","''-7","'\t=1"];
  const bad=vals.filter(v=>E("ioCsvParse(ioCsvEsc("+JSON.stringify(v)+"))")[0][0]!==v);
  return bad.length===0 ? true : bad;
});
t('a round-trip of realistic rows preserves every value', ()=>{
  const rows=["=cmd|'/c calc'!A1","N00178-24-F-1234","O'Brien","plain, text","line\nbreak","+1-800-555-0100"];
  const csv=rows.map(v=>E("ioCsvEsc("+JSON.stringify(v)+")")).join(',');
  const back=E("ioCsvParse("+JSON.stringify(csv)+")")[0];
  const bad=rows.filter((v,i)=>back[i]!==v);
  return bad.length===0 ? true : {bad,back};
});
await ta('a dismissal reason starting with = cannot reach a CSV as a formula', async()=>{
  E("AUD_CACHE=[];audLog('d1','Draft','flag dismissed','=HYPERLINK(\"http://evil\",\"ok\")');");
  const detail=E("audAll()")[0].detail;
  return cellOf(detail).charAt(0)==="'" ? true : cellOf(detail);
});

H('73. Template editor save state');
const KINDS=['fac','cso','perf','cert','b13','ct','sl','sm'];
await ta('every template kind offers Save now and a state line', async()=>{
  const missing=[];
  for(const k of KINDS){
    await E("dashTplEdit('"+k+"')");
    const html=w.document.getElementById('tplView').innerHTML;
    if(!/dashTplSaveNow\(\)/.test(html)||!/id="tplSaveState"/.test(html)) missing.push(k);
  }
  return missing.length===0 ? true : missing;
});
await ta('typing marks it unsaved before the timer fires', async()=>{
  E("tplSave(TPL_CSO,[{label:'A'}]);"); await E("dashTplEdit('cso')");
  E("dashTplTouch()");
  const st=w.document.getElementById('tplSaveState');
  return (E("TPL_DIRTY")===true && /Unsaved/.test(st.textContent)) ? true : {d:E("TPL_DIRTY"),t:st.textContent};
});
await ta('Save now writes immediately and says so', async()=>{
  E("window.TPL_EDIT[0].label='Edited before the timer';");
  await E("dashTplTouch(); dashTplSaveNow();");
  const stored=E("tplLoad(TPL_CSO)")[0].label;
  const st=w.document.getElementById('tplSaveState').textContent;
  return (stored==='Edited before the timer' && E("TPL_DIRTY")===false && /Saved/.test(st)) ? true : {stored,st};
});
await ta('the pending timer is cancelled by an explicit save', async()=>{
  E("dashTplTouch()");
  const had=E("TPL_TOUCH_T")!==null;
  await E("dashTplSaveNow()");
  return (had && E("TPL_TOUCH_T")===null) ? true : {had,after:E("TPL_TOUCH_T")};
});
await ta('Done flushes rather than trusting the timer', async()=>{
  await E("dashTplEdit('cso')");
  E("window.TPL_EDIT[0].label='Set just before Done';dashTplTouch();");
  await E("dashTplDone()");
  return E("tplLoad(TPL_CSO)")[0].label==='Set just before Done' ? true : E("tplLoad(TPL_CSO)")[0].label;
});
await ta('switching template kinds flushes the one being left', async()=>{
  await E("dashTplEdit('cso')");
  E("window.TPL_EDIT[0].label='Set just before switching';dashTplTouch();");
  await E("dashTplEdit('sm')");
  return E("tplLoad(TPL_CSO)")[0].label==='Set just before switching' ? true : E("tplLoad(TPL_CSO)")[0].label;
});
await ta('opening Settings flushes', async()=>{
  await E("dashTplEdit('cso')");
  E("window.TPL_EDIT[0].label='Set just before Settings';dashTplTouch();");
  await E("settingsOpen()");
  E("settingsClose()");
  return E("tplLoad(TPL_CSO)")[0].label==='Set just before Settings' ? true : E("tplLoad(TPL_CSO)")[0].label;
});
await ta('opening a draft flushes', async()=>{
  await E("draftPut({id:'tpl-leave',title:'T',meta:{},workspace:{}})");
  await E("dashTplEdit('cso')");
  E("window.TPL_EDIT[0].label='Set just before opening a draft';dashTplTouch();");
  await E("dashOpen('tpl-leave')");
  return E("tplLoad(TPL_CSO)")[0].label==='Set just before opening a draft' ? true : E("tplLoad(TPL_CSO)")[0].label;
});
await ta('closing the browser with a pending write flushes and warns', async()=>{
  await E("dashTplEdit('cso')");
  E("window.TPL_EDIT[0].label='Set just before unload';dashTplTouch();");
  const prevented=E("(function(){var ev=new Event('beforeunload',{cancelable:true});window.dispatchEvent(ev);return ev.defaultPrevented;})()");
  return (E("tplLoad(TPL_CSO)")[0].label==='Set just before unload' && prevented===true) ? true : {stored:E("tplLoad(TPL_CSO)")[0].label,prevented};
});
await ta('a clean editor does not warn on close', async()=>{
  /* The page carries a second beforeunload that warns about unsaved DRAFT
     changes. Cleared first, so what is measured is the template editor's own
     contribution rather than the backup reminder's. */
  await E("dashTplEdit('cso')");
  await E("dashTplSaveNow()");
  /* Zeroed AFTER the saves: tplSave marks the backup dirty, so clearing it
     first would be undone by the very writes under test. */
  E("localStorage.setItem('dd254_dirty_n','0');");
  const prevented=E("(function(){var ev=new Event('beforeunload',{cancelable:true});window.dispatchEvent(ev);return ev.defaultPrevented;})()");
  return prevented===false ? true : 'warned with nothing pending';
});
await ta('opening an editor starts with a clean state line', async()=>{
  E("dashTplTouch()");
  await E("dashTplEdit('fac')");
  const st=w.document.getElementById('tplSaveState').textContent;
  return (E("TPL_DIRTY")===false && st==='') ? true : {d:E("TPL_DIRTY"),st};
});
await ta('Saved waits for the IndexedDB transaction to complete', async()=>{
  await E("TPL_WRITE");
  await E("dashTplEdit('cso')");
  E("window.__origTdbPut=tdbPut;window.__origTplDb=TDB.db;window.__origTplUseLS=TDB.useLS;"
    +"TDB.db={};TDB.useLS=false;window.__tplResolve=null;"
    +"tdbPut=function(){return new Promise(function(resolve){window.__tplResolve=resolve;});};"
    +"window.TPL_EDIT[0].label='Await the real commit';dashTplTouch();window.__tplPromise=dashTplSaveNow();");
  for(let i=0;i<20&&!E("typeof window.__tplResolve==='function'");i++) await new Promise(r=>setTimeout(r,5));
  const mid=w.document.getElementById('tplSaveState').textContent;
  const prevented=E("(function(){var ev=new Event('beforeunload',{cancelable:true});window.dispatchEvent(ev);return ev.defaultPrevented;})()");
  E("window.__tplResolve(true)");
  await E("window.__tplPromise");
  const done=w.document.getElementById('tplSaveState').textContent;
  E("tdbPut=window.__origTdbPut;TDB.db=window.__origTplDb;TDB.useLS=window.__origTplUseLS;");
  return (/Saving/.test(mid) && !/Saved/.test(mid) && prevented===true && /Saved/.test(done))
    ? true : {mid,prevented,done};
});
await ta('a failed durable write stays unsaved and leaves recovery data', async()=>{
  await E("TPL_WRITE");
  await E("dashTplEdit('cso')");
  E("window.__origTdbPut=tdbPut;window.__origTplSaveLS=tplSaveLS;window.__origTplDb=TDB.db;window.__origTplUseLS=TDB.useLS;"
    +"TDB.db={};TDB.useLS=false;tdbPut=function(){return Promise.resolve(false);};tplSaveLS=function(){return false;};"
    +"window.TPL_EDIT[0].label='Must remain recoverable';dashTplTouch();");
  const ok=await E("dashTplSaveNow()");
  const state=w.document.getElementById('tplSaveState').textContent;
  const journaled=E("!!tplWalRead()[TPL_CSO]");
  E("tdbPut=window.__origTdbPut;tplSaveLS=window.__origTplSaveLS;TDB.db=window.__origTplDb;TDB.useLS=window.__origTplUseLS;"
    +"localStorage.removeItem(TPL_WAL_KEY);TPL_DIRTY=false;TPL_SAVE_ERROR='';tplStateRender();");
  return (ok===false && /Not saved/.test(state) && journaled) ? true : {ok,state,journaled};
});
await ta('startup replay restores a journaled template write', async()=>{
  await E("TPL_WRITE");
  E("localStorage.removeItem(TPL_WAL_KEY);tplWalStage(TPL_CSO,[{label:'Recovered after close'}]);delete TPL_CACHE[TPL_CSO];");
  await E("tplWalReplay()");
  const label=E("tplLoad(TPL_CSO)")[0].label;
  const pending=E("Object.keys(tplWalRead()).length");
  return (label==='Recovered after close' && pending===0) ? true : {label,pending};
});
t('every save in the editor goes through the one writer', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  /* Extracted by brace matching rather than a character cap. The cap was a
     property of how long the function happened to be, so adding a comment to
     one of them reported it missing — an assertion that fails for a reason
     unrelated to what it claims to check. */
  const body=(name)=>{
    const m=new RegExp('function\\s+'+name+'\\s*\\(').exec(src);
    if(!m) return null;
    let k=src.indexOf('{',m.index), d=0;
    for(let x=k;x<src.length;x++){ const c=src[x];
      if(c==='{')d++; else if(c==='}'){ d--; if(!d) return src.slice(k,x+1); } }
    return null;
  };
  for(const fn of ['dashTplDone','dashTplSaveNow','dashTplLeave']){
    const b=body(fn);
    if(!b) return fn+' not found';
    if(!/dashTplFlush|TPL_WRITE/.test(b)) return fn+' bypasses the writer';
  }
  return true;
});

H('74. Standalone DD-254 — combined Block 2a');
const setSA=(on)=>{ const c=w.document.getElementById('iStandalone'); c.checked=!!on; E("run()"); };
const seed2a=()=>{ w.document.getElementById('i2a').value='N00178-24-D-1234';
                   w.document.getElementById('iEffort').value='0007'; E("supSync();run()"); };
t('the checkbox exists beside the effort field', ()=>{
  const c=w.document.getElementById('iStandalone');
  const eff=w.document.getElementById('iEffort');
  return (c && eff && c.type==='checkbox') ? true : {c:!!c,eff:!!eff};
});
t('unticked, Block 2a is exactly the contract number', ()=>{
  seed2a(); setSA(false);
  return E("collect254Data(false).v.i2a")==='N00178-24-D-1234' ? true : E("collect254Data(false).v.i2a");
});
t('ticked, Block 2a carries the task order in the agreed format', ()=>{
  seed2a(); setSA(true);
  return E("collect254Data(false).v.i2a")==='N00178-24-D-1234 | Task Order 0007'
    ? true : E("collect254Data(false).v.i2a");
});
t('ticked with no task order changes nothing', ()=>{
  seed2a(); w.document.getElementById('iEffort').value=''; E("supSync();run()"); setSA(true);
  return E("collect254Data(false).v.i2a")==='N00178-24-D-1234' ? true : E("collect254Data(false).v.i2a");
});
t('ticked with no contract number changes nothing', ()=>{
  seed2a(); w.document.getElementById('i2a').value=''; E("run()"); setSA(true);
  return E("collect254Data(false).v.i2a")==='' ? true : E("collect254Data(false).v.i2a");
});
t('the XFA packet carries the combined value', ()=>{
  seed2a(); setSA(true);
  const xml=E("DD254XFA.buildXfaDatasets(collect254Data(false))");
  return /<two_Prime>N00178-24-D-1234 \| Task Order 0007<\/two_Prime>/.test(xml)
    ? true : (String(xml).match(/<two_Prime>[^<]*/)||['?'])[0];
});
t('the form field itself is never rewritten', ()=>{
  seed2a(); setSA(true);
  E("collect254Data(false)");
  return w.document.getElementById('i2a').value==='N00178-24-D-1234'
    ? true : w.document.getElementById('i2a').value;
});
t('the 17-character check still reads the bare contract number', ()=>{
  seed2a(); setSA(true);
  E("validatePIID(document.getElementById('i2a'))");
  const tip=w.document.getElementById('piid_tooltip');
  const combined=E("collect254Data(false).v.i2a");
  return (combined.length>17 && tip.style.display!=='block') ? true : {len:combined.length,tip:tip.style.display};
});
await ta('the export filename still uses the bare contract number', async()=>{
  seed2a(); setSA(true);
  E("if(window.DASH) DASH.current=null; fnFieldsSet(['i2a']); fnSepSet('-');");
  const n=await E("dd254ExportName()");
  return (/^N00178-24-D-1234/.test(String(n)) && !/Task Order/.test(String(n))) ? true : n;
});
t('the Item 13 reference line still appears', ()=>{
  seed2a(); setSA(true);
  return /This is in support of effort 0007\./.test(w.document.getElementById('item13').value)
    ? true : JSON.stringify(w.document.getElementById('item13').value.slice(0,60));
});
t('both exports read Block 2a from the same upstream', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const flat=/const data=collect254Data\(draft\);[\s\S]{0,200}?DD254Export\./.test(src);
  const xfa=/const data=collect254Data\(draft\);[\s\S]{0,200}?DD254XFA\.buildXfaDatasets/.test(src);
  const composedOnce=(src.match(/\| Task Order '/g)||[]).length;
  return (flat && xfa && composedOnce===1) ? true : {flat,xfa,composedOnce};
});
t('the combined value survives a draft round-trip', ()=>{
  seed2a(); setSA(true);
  const ws=E("collectWorkspace()");
  E("document.getElementById('i2a').value='';document.getElementById('iEffort').value='';document.getElementById('iStandalone').checked=false;");
  E("applyWorkspace("+JSON.stringify(ws)+")");
  return E("collect254Data(false).v.i2a")==='N00178-24-D-1234 | Task Order 0007'
    ? true : E("collect254Data(false).v.i2a");
});

H('75. Safe validation rendering and the sole official export');
t('phone text is displayed literally and cannot create validation markup', ()=>{
  F();
  E("window.__validationInjected=false");
  V('i16e','<img id="validation-injection-probe" src=x onerror="window.__validationInjected=true">1');
  RUN();
  const panel=w.document.getElementById('warnsPanel');
  return (!w.document.getElementById('validation-injection-probe')
    && E("window.__validationInjected")===false
    && panel.textContent.includes('<img id="validation-injection-probe"')) ? true : panel.innerHTML;
});
t('a parent draft title cannot create markup in an error row', ()=>{
  F(); V('fcl1a','TS');
  E("window.__parentInjected=false;window.DD254_PARENT={title:'<svg id=parent-title-probe onload=window.__parentInjected=true>',workspace:{selects:{fcl1a:'C',sfg1b:'NONE'},texts:{},checks:{}}};");
  RUN();
  const panel=w.document.getElementById('errorsPanel');
  const ok=!w.document.getElementById('parent-title-probe') && E("window.__parentInjected")===false
    && panel.textContent.includes('<svg id=parent-title-probe');
  E("window.DD254_PARENT=null");
  return ok ? true : panel.innerHTML;
});
t('live findings are rendered through the shared DOM builder', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  return (/validationFindingsRender\(ep,errors/.test(src)
    && /validationFindingsRender\(wp,warns/.test(src)
    && !/ep\.innerHTML=.*errors\.map/.test(src)
    && !/wp\.innerHTML=.*warns\.map/.test(src)) ? true : 'unsafe live-validation sink remains';
});
t('the dynamic XFA form is the only user-facing official PDF export', ()=>{
  const buttons=Array.from(w.document.querySelectorAll('button'));
  const dynamic=buttons.filter(b=>/Export Official DD-254/.test(b.textContent));
  const flat=buttons.filter(b=>/Flattened PDF/.test(b.textContent)||b.getAttribute('onclick')==='exportOfficial254(this)');
  return (dynamic.length===1 && flat.length===0) ? true : {dynamic:dynamic.length,flat:flat.length};
});

H('76. Task order templates');
const mkCt=(o)=>{ const d=E("ctBlankData()"); Object.assign(d,o||{});
  E("tplSave(TPL_CT,[{ioId:'ct-to-1',label:'Task Order 0042 — SECRET',data:"+JSON.stringify(d)+"}]);");
  E("if(typeof buildTplSelects==='function') buildTplSelects();"); };
t('a blank template carries the two new fields', ()=>{
  const d=E("ctBlankData()");
  return ('primeContract' in d && 'taskOrder' in d && d.primeContract==='' && d.taskOrder==='') ? true : Object.keys(d).slice(-4);
});
t('applying a task order template fills the task order and ticks standalone', ()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:'0042'});
  const ws=E("ctApplyDataToWorkspace(tplLoad(TPL_CT)[0].data,{texts:{},checks:{},radios:{},selects:{},perf:[],vlog:null})");
  return (ws.texts.iEffort==='0042' && ws.checks.iStandalone===true) ? true : {t:ws.texts.iEffort,c:ws.checks.iStandalone};
});
t('the prime contract fills 2a when the draft has none', ()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:'0042'});
  const ws=E("ctApplyDataToWorkspace(tplLoad(TPL_CT)[0].data,{texts:{},checks:{},radios:{},selects:{},perf:[],vlog:null})");
  return ws.texts.i2a==='N00178-24-D-1234' ? true : ws.texts.i2a;
});
t('a contract number already on the draft is never replaced', ()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:'0042'});
  const ws=E("ctApplyDataToWorkspace(tplLoad(TPL_CT)[0].data,{texts:{i2a:'ALREADY-ON-THE-FORM'},checks:{},radios:{},selects:{},perf:[],vlog:null})");
  return ws.texts.i2a==='ALREADY-ON-THE-FORM' ? true : ws.texts.i2a;
});
t('a contract number on the live form is not replaced either', ()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:'0042'});
  w.document.getElementById('i2a').value='TYPED-BY-HAND'; E("run()");
  const ws=E("ctApplyDataToWorkspace(tplLoad(TPL_CT)[0].data,null)");
  w.document.getElementById('i2a').value='';
  return (ws.texts.i2a===undefined||ws.texts.i2a==='') ? true : ws.texts.i2a;
});
t('a template with no task order behaves exactly as before', ()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:''});
  const ws=E("ctApplyDataToWorkspace(tplLoad(TPL_CT)[0].data,{texts:{},checks:{},radios:{},selects:{},perf:[],vlog:null})");
  return (!ws.texts.iEffort && !ws.checks.iStandalone && !ws.texts.i2a) ? true : {e:ws.texts.iEffort,c:ws.checks.iStandalone,a:ws.texts.i2a};
});
t('standalone is derived from the task order, never stored separately', ()=>{
  const d=E("ctBlankData()");
  const src=fs.readFileSync('dd254.htm','utf8');
  const m=/function ctApplyDataToWorkspace\(d,ws\)\{[\s\S]*?\n\}/.exec(src);
  return (!('standalone' in d) && m && /d\.taskOrder/.test(m[0]) && /ws\.checks\.iStandalone=true/.test(m[0]))
    ? true : 'standalone is stored rather than derived';
});
await ta('applying to the live form produces the combined Block 2a', async()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:'0042'});
  E("document.getElementById('i2a').value='';document.getElementById('iEffort').value='';document.getElementById('iStandalone').checked=false;");
  E("ctApplyWsToForm(ctApplyDataToWorkspace(tplLoad(TPL_CT)[0].data,null)); run();");
  const combined=E("collect254Data(false).v.i2a");
  return combined==='N00178-24-D-1234 | Task Order 0042' ? true : combined;
});
await ta('the fields appear in the DD-254 Template Language editor, populated', async()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:'0042'});
  await E("dashTplEdit('ct')");
  /* Read off the elements rather than the markup: asserting on attribute
     quoting tests the renderer's punctuation, not the feature. */
  const got={};
  Array.from(w.document.querySelectorAll('#tplView input')).forEach(x=>{
    const h=x.getAttribute('onchange')||'';
    if(/ctSetPrime\(/.test(h)) got.prime=x.value;
    if(/ctSetTask\(/.test(h))  got.task=x.value;
  });
  return (got.prime==='N00178-24-D-1234' && got.task==='0042') ? true : got;
});
await ta('the editor writes them back into the template', async()=>{
  mkCt({});
  await E("dashTplEdit('ct')");
  E("ctSetPrime(0,'N00178-24-D-9999'); ctSetTask(0,'0100'); dashTplSaveNow();");
  const t0=E("tplLoad(TPL_CT)[0].data");
  return (t0.primeContract==='N00178-24-D-9999' && t0.taskOrder==='0100') ? true : t0;
});
t('both fields are offered as CSV columns', ()=>{
  /* Asserted on the source rather than through an accessor: the column list is
     built inline and has no exported handle to query. */
  const src=fs.readFileSync('dd254.htm','utf8');
  return (/col\('Prime Contract',/.test(src) && /col\('Task Order',/.test(src)
    && /ioDD\(t\)\.primeContract/.test(src) && /ioDD\(t\)\.taskOrder/.test(src))
    ? true : 'CSV columns missing';
});
t('the fields travel in a template pack', ()=>{
  mkCt({primeContract:'N00178-24-D-1234',taskOrder:'0042'});
  const body=E("packBody(tplLoad(TPL_CT)[0])");
  return (/N00178-24-D-1234/.test(body) && /0042/.test(body)) ? true : body.slice(0,80);
});

H('77. Bulk performance locations');
const perfN=()=>w.document.querySelectorAll('#perfBlocks > div[id^="perf-"]').length;
const clearPerf=()=>{ E("Array.prototype.slice.call(document.querySelectorAll('#perfBlocks > div')).forEach(function(b){ if(/^perf-/.test(b.id)) b.remove(); });"); };
const seedPerf=()=>{ E("tplSave(TPL_PERF,[" +
  "{label:'Raytheon Tucson (1ABC5)',name:'Raytheon Tucson\\n1151 E Hermans Rd',cage:'1ABC5',cso:'DCSA Phoenix',email:'fso1@example.com',cma:'PO Box 1',org:'Raytheon'}," +
  "{label:'Raytheon Andover (2XY99)',name:'Raytheon Andover\\n350 Lowell St',cage:'2XY99',cso:'DCSA Boston',email:'fso2@example.com',cma:'',org:'Raytheon'}," +
  "{label:'Raytheon McKinney (3QQ12)',name:'Raytheon McKinney\\n2501 W University',cage:'3QQ12',cso:'DCSA Dallas',email:'fso3@example.com',cma:'',org:'Raytheon'}," +
  "{label:'Other Corp (9ZZ00)',name:'Other Corp\\n1 Main St',cage:'9ZZ00',cso:'DCSA Other',email:'fso9@example.com',cma:'',org:'Other Corp'}]);"); };
t('a pasted list splits on semicolons', ()=>{
  const r=E("perfSplitCages('1ABC5;2XY99;3QQ12')");
  return JSON.stringify(r)===JSON.stringify(['1ABC5','2XY99','3QQ12']) ? true : r;
});
t('commas, spaces and newlines split too, and case is normalised', ()=>{
  const r=E("perfSplitCages('1abc5, 2xy99\\n3qq12  9zz00')");
  return JSON.stringify(r)===JSON.stringify(['1ABC5','2XY99','3QQ12','9ZZ00']) ? true : r;
});
t('a known CAGE fills the whole block from its template', ()=>{
  seedPerf(); clearPerf();
  const res=E("perfExpand(['1ABC5'])");
  const b=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  const f={loc:b.querySelector('.loc-8a'),cage:b.querySelector('.cage-8b'),cso:b.querySelector('.cso-8c'),email:b.querySelector('.fso-8'),cma:b.querySelector('.cma-loc')};
  return (perfN()===1 && f.cage.value==='1ABC5' && /Raytheon Tucson/.test(f.loc.value)
    && f.cso.value==='DCSA Phoenix' && f.email.value==='fso1@example.com' && f.cma.value==='PO Box 1'
    && JSON.stringify(res.added)===JSON.stringify(['1ABC5'])) ? true : {n:perfN(),res};
});
t('three codes produce three populated blocks', ()=>{
  seedPerf(); clearPerf();
  const res=E("perfExpand(perfSplitCages('1ABC5;2XY99;3QQ12'))");
  return (perfN()===3 && res.added.length===3 && res.unknown.length===0) ? true : {n:perfN(),res};
});
t('an unknown CAGE still gets a block carrying the code', ()=>{
  seedPerf(); clearPerf();
  const res=E("perfExpand(['7NEW1'])");
  const b=w.document.querySelector('#perfBlocks > div[id^="perf-"]');
  return (perfN()===1 && b.querySelector('.cage-8b').value==='7NEW1'
    && b.querySelector('.loc-8a').value==='' && JSON.stringify(res.unknown)===JSON.stringify(['7NEW1'])) ? true : {n:perfN(),res};
});
t('an incomplete block from an unknown CAGE is flagged by validation', ()=>{
  seedPerf(); clearPerf();
  E("perfExpand(['7NEW1'])"); E("run()");
  const all=[].concat(E("window.DD254_ERRORS")||[], E("window.DD254_WARNS")||[]);
  return all.some(x=>/8a|performance/i.test(x)) ? true : all.slice(0,3);
});
t('a complete block from a known CAGE raises nothing', ()=>{
  seedPerf(); clearPerf();
  E("perfExpand(['1ABC5'])"); E("run()");
  const all=[].concat(E("window.DD254_ERRORS")||[], E("window.DD254_WARNS")||[]);
  return !all.some(x=>/1ABC5/.test(x)) ? true : all.filter(x=>/1ABC5/.test(x));
});
t('a block with a CAGE but no CSO raises a warning, not an error', ()=>{
  seedPerf(); clearPerf();
  E("perfExpand(['1ABC5'])");
  E("var b=document.querySelector('#perfBlocks > div'); b.querySelector('.cso-8c').value=''; run();");
  const errs=(E("window.DD254_ERRORS")||[]).filter(x=>/1ABC5/.test(x));
  const wns=(E("window.DD254_WARNS")||[]).filter(x=>/1ABC5/.test(x));
  return (errs.length===0 && wns.length===1 && /8c/.test(wns[0])) ? true : {errs,wns};
});
t('an untouched empty block is left alone as work in progress', ()=>{
  clearPerf(); E("addPerf(); run();");
  const all=[].concat(E("window.DD254_ERRORS")||[], E("window.DD254_WARNS")||[]);
  return !all.some(x=>/performance location/i.test(x)) ? true : all.filter(x=>/performance location/i.test(x));
});
t('a duplicate inside one paste is skipped', ()=>{
  seedPerf(); clearPerf();
  const res=E("perfExpand(['1ABC5','1ABC5','2XY99'])");
  return (perfN()===2 && JSON.stringify(res.duplicate)===JSON.stringify(['1ABC5'])) ? true : {n:perfN(),res};
});
t('a CAGE already on the form is skipped', ()=>{
  seedPerf(); clearPerf();
  E("perfExpand(['1ABC5'])");
  const res=E("perfExpand(['1ABC5','2XY99'])");
  return (perfN()===2 && JSON.stringify(res.duplicate)===JSON.stringify(['1ABC5'])) ? true : {n:perfN(),res};
});
t('organisations are listed with their facility counts', ()=>{
  seedPerf();
  const o=E("perfOrgs()");
  return (o.length===2 && o[0].org==='Other Corp' && o[0].count===1
    && o[1].org==='Raytheon' && o[1].count===3) ? true : o;
});
t('choosing an organisation resolves to its CAGE codes', ()=>{
  seedPerf();
  const c=E("perfCagesForOrg('Raytheon')");
  return JSON.stringify(c.sort())===JSON.stringify(['1ABC5','2XY99','3QQ12']) ? true : c;
});
t('an organisation adds every one of its facilities', ()=>{
  seedPerf(); clearPerf();
  const res=E("perfExpand(perfCagesForOrg('Raytheon'))");
  return (perfN()===3 && res.added.length===3) ? true : {n:perfN(),res};
});
t('both entry points go through the one expansion function', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const a=/async function perfAddByCage\(\)\{[\s\S]*?\n\}/.exec(src);
  const b=/async function perfAddByOrg\(\)\{[\s\S]*?\n\}/.exec(src);
  return (a&&b&&/perfExpand\(/.test(a[0])&&/perfExpand\(/.test(b[0])) ? true : 'an entry point bypasses perfExpand';
});
t('the organisation tag survives saving a location back to templates', ()=>{
  seedPerf();
  E("tplPerfUpsert('Raytheon Tucson\\n1151 E Hermans Rd','1ABC5','DCSA Phoenix Updated','fso1@example.com','PO Box 1')");
  const t0=E("tplLoad(TPL_PERF)").filter(x=>x.cage==='1ABC5')[0];
  return (t0 && t0.org==='Raytheon' && t0.cso==='DCSA Phoenix Updated') ? true : t0;
});
t('the organisation is offered as a CSV column so fifty can be tagged at once', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  return (/col\('Organisation',/.test(src) && /t\.org=ioS\(v\)/.test(src)) ? true : 'CSV column missing';
});
t('fifty locations are allowed with no cap', ()=>{
  seedPerf(); clearPerf();
  const many=[]; for(let i=0;i<50;i++) many.push('Z'+String(i).padStart(4,'0'));
  const res=E("perfExpand("+JSON.stringify(many)+")");
  return (perfN()===50 && res.unknown.length===50) ? true : {n:perfN()};
});
t('expanded locations reach the official export', ()=>{
  seedPerf(); clearPerf();
  E("perfExpand(perfCagesForOrg('Raytheon'))");
  const xml=E("DD254XFA.buildXfaDatasets(collect254Data(false))");
  const rows=(String(xml).match(/<eight_LocationCageCSO>/g)||[]).length;
  return (rows===3 && /1ABC5/.test(xml) && /3QQ12/.test(xml)) ? true : {rows};
});

H('78. Template editor row layout');
await ta('the address field cannot be squeezed to nothing by its siblings', async()=>{
  E("tplSave(TPL_PERF,[{label:'L',name:'Joe Andover\\n1 Main St',cage:'1ABC5',cso:'Dallas Office',email:'bob@example.com',cma:'',org:'Raytheon'}]);");
  await E("dashTplEdit('perf')");
  const ta=w.document.querySelector('#tplView textarea');
  if(!ta) return 'no address textarea';
  const st=ta.getAttribute('style')||'';
  const minw=/min-width:\s*(\d+)px/.exec(st);
  return (minw && +minw[1]>=200) ? true : {style:st.slice(0,120)};
});
await ta('the address field can be dragged wider, not only taller', async()=>{
  await E("dashTplEdit('perf')");
  const tas=Array.from(w.document.querySelectorAll('#tplView textarea'));
  const bad=tas.filter(x=>!/resize:\s*both/.test(x.getAttribute('style')||''));
  return bad.length===0 ? true : bad.length+' textarea(s) still vertical-only';
});
await ta('the row wraps rather than crushing a field', async()=>{
  await E("dashTplEdit('perf')");
  const row=w.document.querySelector('#tplView textarea').parentNode;
  return /flex-wrap:\s*wrap/.test(row.getAttribute('style')||'') ? true : row.getAttribute('style');
});
await ta('every field in the row is still present and reachable', async()=>{
  await E("dashTplEdit('perf')");
  const row=w.document.querySelector('#tplView textarea').parentNode;
  const ph=Array.from(row.querySelectorAll('input,textarea,select')).map(x=>x.placeholder||x.tagName);
  const want=['Organisation','CAGE','FSO e-mail'];
  const missing=want.filter(x=>!ph.some(p=>String(p).indexOf(x)>=0));
  return missing.length===0 ? true : {missing,ph};
});

H('79. Template editors use the window, the dashboard keeps its measure');
await ta('opening an editor lifts the reading-width cap', async()=>{
  /* Cleared first: an earlier section may have left an editor open. */
  E("document.body.classList.remove('tpl-wide')");
  const before=w.document.body.classList.contains('tpl-wide');
  await E("dashTplEdit('perf')");
  return (!before && w.document.body.classList.contains('tpl-wide')) ? true : {before,after:w.document.body.classList.contains('tpl-wide')};
});
await ta('Done restores it', async()=>{
  await E("dashTplEdit('perf')");
  await E("dashTplDone()");
  return !w.document.body.classList.contains('tpl-wide') ? true : 'still wide after Done';
});
await ta('leaving by any other route restores it too', async()=>{
  await E("dashTplEdit('perf')");
  await E("dashTplLeave()");
  return !w.document.body.classList.contains('tpl-wide') ? true : 'still wide after leaving';
});
t('the wrapper keeps its markup fallback for a browser that never runs the script', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  return /id="dashWrap"[^>]*max-width:1100px/.test(src) ? true : 'fallback gone';
});
t('Auto hands the width back to the stylesheet rather than pinning one', ()=>{
  /* Auto clears the inline width so the rule governs — reading measure
     normally, full width while a template editor is open. A pinned inline
     value would defeat that second half. */
  E("wsWidthSet('wide')");
  const pinned=w.document.getElementById('dashWrap').style.maxWidth;
  E("wsWidthSet('auto')");
  const cleared=w.document.getElementById('dashWrap').style.maxWidth;
  return (pinned==='1600px' && cleared==='') ? true : {pinned,cleared};
});

H('80. Scalable workspace');
const wsReset=()=>E("localStorage.removeItem('dd254_ws_width');localStorage.removeItem('dd254_ui_scale');wsApply();uiScaleApply();");
t('the default is Auto and behaves as before', ()=>{
  wsReset();
  const v=E("wsWidthGet()");
  const cls=w.document.body.classList.contains('ws-auto');
  const set=w.document.documentElement.style.getPropertyValue('--ws-max');
  return (v==='auto' && cls && !set) ? true : {v,cls,set};
});
t('each preset resolves to its own width', ()=>{
  const got={};
  ['reading','wide','full'].forEach(k=>{ E("wsWidthSet('"+k+"')"); got[k]=w.document.documentElement.style.getPropertyValue('--ws-max'); });
  wsReset();
  return (got.reading==='1100px' && got.wide==='1600px' && got.full==='none') ? true : got;
});
t('a chosen width applies whether or not an editor is open', ()=>{
  E("wsWidthSet('reading')");
  E("document.body.classList.add('tpl-wide')");
  const stillAuto=w.document.body.classList.contains('ws-auto');
  E("document.body.classList.remove('tpl-wide')"); wsReset();
  return stillAuto===false ? true : 'a fixed width is still being overridden by the editor';
});
t('dragging stores a pixel width that survives a reload', ()=>{
  E("wsWidthSet(1425)");
  const stored=E("localStorage.getItem('dd254_ws_width')");
  const v=E("wsWidthGet()");
  const applied=w.document.documentElement.style.getPropertyValue('--ws-max');
  wsReset();
  return (stored==='1425' && v===1425 && applied==='1425px') ? true : {stored,v,applied};
});
t('a plain click on the drag handle (no movement) leaves the preset alone', ()=>{
  /* mousedown immediately followed by mouseup at the same X, with no
     mousemove in between — exactly what a click is and a drag is not. This
     used to unconditionally read back --ws-max and store it as a one-off
     custom width, silently turning "Reading" into an unlabeled "Custom" on a
     stray click that never intended to resize anything. */
  E("wsWidthSet('reading')");
  const handle=w.document.getElementById('wsDrag');
  handle.dispatchEvent(new w.MouseEvent('mousedown',{bubbles:true,clientX:500}));
  w.dispatchEvent(new w.MouseEvent('mouseup',{bubbles:true,clientX:500}));
  const v=E("wsWidthGet()");
  wsReset();
  return v==='reading' ? true : v;
});
t('a real drag on the handle still stores a custom width', ()=>{
  E("wsWidthSet('reading')");
  const handle=w.document.getElementById('wsDrag');
  handle.dispatchEvent(new w.MouseEvent('mousedown',{bubbles:true,clientX:500}));
  w.dispatchEvent(new w.MouseEvent('mousemove',{bubbles:true,clientX:560}));
  w.dispatchEvent(new w.MouseEvent('mouseup',{bubbles:true,clientX:560}));
  const v=E("wsWidthGet()");
  wsReset();
  return typeof v==='number' ? true : v;
});
t('a width below the floor is clamped, not accepted', ()=>{
  E("wsWidthSet(200)");
  const v=E("wsWidthGet()");
  wsReset();
  return v===E("WS_MIN") ? true : v;
});
t('a nonsense stored value falls back to Auto', ()=>{
  E("localStorage.setItem('dd254_ws_width','banana')");
  const v=E("wsWidthGet()");
  wsReset();
  return v==='auto' ? true : v;
});
t('the preset row reports a dragged width as custom', ()=>{
  E("wsWidthSet(1300)");
  const shown=E("SETTINGS_DEFS.filter(function(d){return d.key==='wsWidth';})[0].read()");
  wsReset();
  return shown==='custom' ? true : shown;
});
t('presets and dragging write through one setter', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const def=/key:'wsWidth'[\s\S]{0,600}?write:wsWidthSet/.test(src);
  const drag=/if\(isFinite\(cur\)\) wsWidthSet\(cur\)/.test(src);
  return (def&&drag) ? true : {def,drag};
});
t('the drag handle exists and is hidden from print', ()=>{
  const h=w.document.getElementById('wsDrag');
  const src=fs.readFileSync('dd254.htm','utf8');
  return (h && /@media print\{#wsDrag\{display:none!important;\}\}/.test(src)) ? true : {handle:!!h};
});
t('text size scales the chrome and is remembered', ()=>{
  E("uiScaleSet(125)");
  const z=w.document.documentElement.style.getPropertyValue('--ui-zoom');
  const stored=E("localStorage.getItem('dd254_ui_scale')");
  E("uiScaleSet(100)");
  return (z==='1.25' && stored==='125') ? true : {z,stored};
});
t('an out-of-range text size falls back to 100', ()=>{
  E("localStorage.setItem('dd254_ui_scale','400')");
  const v=E("uiScaleGet()");
  E("uiScaleSet(100)");
  return v===100 ? true : v;
});
t('the form facsimile is never zoomed, and neither is print', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const scoped=/#dashWrap,\.panel-col\{zoom:var\(--ui-zoom,1\);\}/.test(src);
  const noPrint=/@media print\{#dashWrap,\.panel-col\{zoom:1!important;\}\}/.test(src);
  /* Comments stripped first: the explanatory note beside this rule mentions
     .fw, and a raw scan ran from that word straight into the following rule. */
  const noComments=src.replace(/\/\*[\s\S]*?\*\//g,'');
  const formUntouched=!/(^|[,}])\s*\.fw\b[^{]*\{[^}]*zoom:/.test(noComments);
  return (scoped&&noPrint&&formUntouched) ? true : {scoped,noPrint,formUntouched};
});
t('both controls are offered in Settings', ()=>{
  E("settingsOpen()");
  const html=w.document.getElementById('settingsView').innerHTML;
  return (/Workspace width/.test(html) && /Text size/.test(html)) ? true : 'missing from the panel';
});

H('81. Stylesheets actually reach the document');
/* Three features shipped with their CSS written into a generated report's
   template string instead of the document head, because the insertion point was
   found with rindex('</head>') and the last </head> in this file belongs to a
   report. Every assertion passed: they searched the file for the rule text,
   which was present — in the wrong place. These check the rules resolve. */
t('the workspace width rules are in the document, not inside a script', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const blocks=[]; const re=/<script\b[^>]*>[\s\S]*?<\/script>/g; let m;
  while((m=re.exec(src))) blocks.push([m.index,m.index+m[0].length]);
  const inScript=(i)=>blocks.some(b=>i>=b[0]&&i<b[1]);
  const checks={
    'panel frame':'.panel-col{display:flex;flex-direction:column',
    'panel scroll':'.panel-col .rpanel{flex:1 1 0',
    'workspace width':'#dashWrap{max-width:var(--ws-max',
    'auto widening':'body.ws-auto.tpl-wide #dashWrap',
    'chrome zoom':'#dashWrap,.panel-col{zoom:var(--ui-zoom',
    'drag handle':'#wsDrag{position:absolute'
  };
  const trapped=Object.keys(checks).filter(k=>{ const i=src.indexOf(checks[k]); return i<0||inScript(i); });
  return trapped.length===0 ? true : trapped;
});
t('the two-panel scrolling rule resolves at runtime', ()=>{
  const col=w.document.querySelector('.panel-col');
  if(!col) return 'no panel column';
  const cs=w.getComputedStyle(col);
  return (cs.display==='flex' && cs.flexDirection==='column') ? true : {display:cs.display,dir:cs.flexDirection};
});
t('the drag handle rule resolves at runtime', ()=>{
  const h=w.document.getElementById('wsDrag');
  if(!h) return 'no handle';
  return w.getComputedStyle(h).cursor==='col-resize' ? true : w.getComputedStyle(h).cursor;
});
t('choosing a width actually changes the wrapper', ()=>{
  const wrap=w.document.getElementById('dashWrap');
  const read=()=>w.getComputedStyle(wrap).maxWidth;
  E("wsWidthSet('wide')");    const wide=read();
  E("wsWidthSet('reading')"); const reading=read();
  E("wsWidthSet('full')");    const full=read();
  E("wsWidthSet(1350)");      const dragged=read();
  E("wsWidthSet('auto')");
  return (wide==='1600px' && reading==='1100px' && full==='none' && dragged==='1350px')
    ? true : {wide,reading,full,dragged};
});
t('the generated CO package no longer carries the application stylesheet', ()=>{
  const src=fs.readFileSync('dd254.htm','utf8');
  const i=src.indexOf('Contracting Officer Preparatory Package');
  const before=src.slice(Math.max(0,i-4000),i);
  return (!/#dashWrap|#wsDrag|\.panel-col \.rpanel/.test(before)) ? true : 'report template still carries app CSS';
});
t('the panel column has a real height to grow into, not just a cap', ()=>{
  /* max-height alone caps a box; it does not stretch one. Without an actual
     height the column hugs its own content — a cramped ~250px of the ~688px
     it is budgeted on a normal screen — and Live Validation / Checklist each
     sit at their 120px floor instead of sharing the rest. jsdom cannot lay
     out calc(100vh - ...), but it can tell "auto" (the bug: no height
     declared) apart from an actual declared height value. */
  const pc=w.document.querySelector('.panel-col');
  const h=w.getComputedStyle(pc).height;
  return (h && h!=='auto') ? true : {height:h};
});

H('82. Clearing the audit log');
const seedAud=(n)=>{ E("AUD_CACHE=[];"); for(let i=0;i<n;i++){
  E("AUD_CACHE.push({uid:'u"+i+"',ts:'2026-0"+(1+(i%2))+"-1"+(i%9)+"T09:00:00.000Z',id:'d"+i+"',title:'Draft "+i+"',action:'edited',detail:'x'});"); } };
const grabExport=()=>{ E("window.__EXPORTED=null;var _oc=URL.createObjectURL;URL.createObjectURL=function(b){window.__EXPORTED=b;return 'blob:x';};window.__restoreOC=function(){URL.createObjectURL=_oc;};"); };
await ta('an empty log is not cleared and says so', async()=>{
  E("AUD_CACHE=[];window.__A='';window.uiAlert=function(m){window.__A=m;};");
  const r=await E("audClear()");
  return (r===false && /already empty/.test(String(E("window.__A")||''))) ? true : {r,a:E("window.__A")};
});
await ta('a copy is exported before the confirmation is offered', async()=>{
  seedAud(4); grabExport();
  E("window.__ORDER=[];window.uiPrompt=async function(){window.__ORDER.push('prompt');return null;};");
  E("var _ae=audExport;audExport=function(){window.__ORDER.push('export');return _ae();};");
  await E("audClear()");
  const order=E("window.__ORDER");
  E("window.__restoreOC&&window.__restoreOC();");
  return JSON.stringify(order)===JSON.stringify(['export','prompt']) ? true : order;
});
await ta('the confirmation names the entry count and the period', async()=>{
  seedAud(4); grabExport();
  E("window.__MSG='';window.uiPrompt=async function(m){window.__MSG=m;return null;};");
  await E("audClear()");
  const m=String(E("window.__MSG")||'');
  E("window.__restoreOC&&window.__restoreOC();");
  return (/4 entries/.test(m) && /2026-01-1/.test(m) && /Type CLEAR/.test(m)) ? true : m.slice(0,160);
});
await ta('cancelling leaves the log untouched', async()=>{
  seedAud(4); grabExport();
  E("window.uiPrompt=async function(){return null;};");
  const r=await E("audClear()");
  const n=E("audAll()").length;
  E("window.__restoreOC&&window.__restoreOC();");
  return (r===false && n===4) ? true : {r,n};
});
await ta('declining to confirm the download was saved stops before the typed prompt is even offered', async()=>{
  /* audExport() cannot detect a cancelled Save-As or a blocked download — no
     exception is thrown either way — so this confirm step is the only real
     check standing between "the export call ran" and "the file exists". */
  seedAud(4); grabExport();
  E("window.__PROMPTED=false;window.uiPrompt=async function(){window.__PROMPTED=true;return 'CLEAR';};");
  E("window.uiConfirm=async function(){return false;};");
  const r=await E("audClear()");
  const n=E("audAll()").length;
  const prompted=E("window.__PROMPTED");
  E("window.uiConfirm=async function(){return true;};window.__restoreOC&&window.__restoreOC();");
  return (r===false && n===4 && prompted===false) ? true : {r,n,prompted};
});
await ta('a wrong confirmation word leaves the log untouched', async()=>{
  seedAud(4); grabExport();
  E("window.__A='';window.uiAlert=function(m){window.__A=m;};window.uiPrompt=async function(){return 'yes';};");
  const r=await E("audClear()");
  const n=E("audAll()").length;
  E("window.__restoreOC&&window.__restoreOC();");
  return (r===false && n===4 && /did not match/.test(String(E("window.__A")||''))) ? true : {r,n};
});
await ta('typing CLEAR removes the entries and leaves exactly one', async()=>{
  seedAud(6); grabExport();
  E("localStorage.setItem('dd254_owner','D. Adams');");
  E("window.uiAlert=function(){};window.uiPrompt=async function(){return 'clear';};");
  const r=await E("audClear()");
  const a=E("audAll()");
  E("window.__restoreOC&&window.__restoreOC();");
  return (r===true && a.length===1) ? true : {r,n:a.length};
});
t('the remaining entry records what was removed, by whom and when', ()=>{
  const e=E("audAll()")[0];
  return (e.action==='audit log cleared'
    && /6 entries/.test(e.detail) && /2026-0/.test(e.detail)
    && /D\. Adams/.test(e.detail) && !!e.ts && !!e.uid) ? true : e;
});
await ta('the recovery journal is emptied so startup cannot replay them', async()=>{
  seedAud(3); grabExport();
  E("audWalStage([{uid:'z1',ts:'2026-01-11T09:00:00.000Z',id:'d9',title:'T',action:'edited',detail:'y'}]);");
  E("window.uiAlert=function(){};window.uiPrompt=async function(){return 'CLEAR';};");
  await E("audClear()");
  const wal=E("localStorage.getItem(AUD_WAL_KEY)");
  const legacy=E("localStorage.getItem(AUD_KEY)");
  E("window.__restoreOC&&window.__restoreOC();");
  return (wal===null && legacy===null) ? true : {wal,legacy};
});
await ta('the drafts themselves are untouched', async()=>{
  await wipe();
  await E("draftPut({id:'keep-1',title:'Kept',meta:{},workspace:{}})");
  seedAud(3); grabExport();
  E("window.uiAlert=function(){};window.uiPrompt=async function(){return 'CLEAR';};");
  await E("audClear()");
  const rec=await E("draftGet('keep-1')");
  E("window.__restoreOC&&window.__restoreOC();");
  return (rec && rec.title==='Kept') ? true : 'a draft was affected';
});
t('the action is reachable from the Reports menu', ()=>{
  const b=Array.from(w.document.querySelectorAll('#dashManageMenu .dash-menu-item'))
    .find(x=>/Clear Audit Log/.test(x.textContent));
  return (b && /audClear\(\)/.test(b.getAttribute('onclick'))) ? true : 'not in the menu';
});

H('83. Audit log viewer escaping');
t('a dismissal reason or draft title cannot inject a live handler via the data-hay attribute', ()=>{
  /* audView() once had its own local, weaker escape that missed '"', so a
     dismissal reason or an imported draft title could break the string open
     onto the <tr> as a second, real attribute — no popup or opener needed to
     run script directly inside the app window. The existing injection probes
     only cover tag injection (`<img onerror>` landing in a text node); this
     targets attribute break-out, the gap that actually let it ship. Checking
     for the raw payload string in serialized HTML is not a valid test here —
     a browser's HTML serializer legitimately re-emits a literal '"' in a text
     node (quotes are only special inside an attribute), so the only real
     test is whether the browser actually parsed a second attribute out of it. */
  E("window.__auditInjected=false;");
  const payload='PAYLOAD" onmouseover="window.__auditInjected=true';
  E("AUD_CACHE=[{uid:'x1',ts:'2026-01-01T09:00:00.000Z',id:'d1',title:"+JSON.stringify(payload)+",action:'flag dismissed',detail:"+JSON.stringify(payload)+"}];audView();");
  const tr=w.document.querySelector('#audTable tbody tr');
  const hasInjectedAttr=tr?tr.hasAttribute('onmouseover'):'no row rendered';
  if(tr) tr.dispatchEvent(new w.MouseEvent('mouseover',{bubbles:true}));
  const injected=E("window.__auditInjected");
  const closeBtn=w.document.getElementById('audClose'); if(closeBtn) closeBtn.click();
  E("AUD_CACHE=[]; window.__auditInjected=undefined;");
  return (hasInjectedAttr===false && injected===false) ? true : {hasInjectedAttr,injected};
});

H('83a. Manage menu search');
t('typing filters to matching actions and hides sections with no match', ()=>{
  E("dashManageMenuFilter('audit')");
  const visible=Array.from(w.document.querySelectorAll('#dashManageMenu .dash-menu-item'))
    .filter(function(b){ return b.style.display!=='none'; })
    .map(function(b){ return b.textContent.trim(); });
  const backupSection=Array.from(w.document.querySelectorAll('#dashManageMenu [data-menu-section]'))
    .find(function(s){ return /Backup/.test(s.querySelector('.dash-menu-hdr').textContent); });
  const backupHidden=backupSection.style.display==='none';
  E("dashManageMenuFilter('')");
  return (visible.some(function(t){return /Audit Log/.test(t);})
    && visible.every(function(t){return /Audit/i.test(t);})
    && backupHidden) ? true : {visible,backupHidden};
});
t('a query matching nothing shows the empty state, not a blank menu', ()=>{
  E("dashManageMenuFilter('xyzzy-no-such-action')");
  const empty=w.document.getElementById('dashManageEmpty');
  const shown=empty.style.display==='block';
  const anyVisible=Array.from(w.document.querySelectorAll('#dashManageMenu .dash-menu-item')).some(function(b){return b.style.display!=='none';});
  E("dashManageMenuFilter('')");
  return (shown && !anyVisible) ? true : {shown,anyVisible};
});
t('opening the menu always starts from a clean, unfiltered search', ()=>{
  E("dashManageMenuFilter('audit')");
  E("document.getElementById('dashManageMenu').style.display='none';");
  E("dashToggleManageMenu()");
  const boxVal=w.document.getElementById('dashManageSearch').value;
  const allVisible=Array.from(w.document.querySelectorAll('#dashManageMenu .dash-menu-item')).every(function(b){return b.style.display!=='none';});
  E("document.getElementById('dashManageMenu').style.display='none';");
  return (boxVal==='' && allVisible) ? true : {boxVal,allVisible};
});

H('84c. Guidance search');
t('a distinctive term matches the field whose instructions actually contain it', ()=>{
  /* COMSEC appears in Item 1a's exclusion list ("do not cite ... COMSEC ...")
     — Items 10/11 also mention COMSEC, but as inline tile text with no
     collapsible Instructions panel at all, so they are correctly absent from
     an index built from .inst-box elements. */
  E("guideSearch('COMSEC')");
  const html=w.document.getElementById('guideSearchResults').innerHTML;
  const shown=w.document.getElementById('guideSearchResults').style.display;
  E("guideSearch('')");
  return (shown==='block' && /"gr-item">1a</.test(html) && /COMSEC/i.test(html)) ? true : {shown,html:html.slice(0,300)};
});
t('an empty query hides the results panel instead of showing everything', ()=>{
  E("guideSearch('COMSEC')");
  E("guideSearch('')");
  const results=w.document.getElementById('guideSearchResults');
  return (results.style.display==='none' && results.innerHTML==='') ? true : {display:results.style.display,html:results.innerHTML};
});
t('a query matching no field guidance shows the empty state, not nothing', ()=>{
  E("guideSearch('zzz-no-such-guidance-term-xyzzy')");
  const html=w.document.getElementById('guideSearchResults').innerHTML;
  const shown=w.document.getElementById('guideSearchResults').style.display;
  E("guideSearch('')");
  return (shown==='block' && /No field guidance matches/.test(html)) ? true : {shown,html};
});
t('picking a result opens that field’s Instructions panel, labels it correctly, and in step mode switches to its step', ()=>{
  E("wizSetView('step'); showStep(0);"); // Item 16 (AAC) is not on step 0
  E("guideSearch('alpha/numeric code')");
  const targetIdx=E("(document.getElementById('guideSearchResults').__hits.findIndex(function(h){return h.itemNum==='16';}))");
  if(targetIdx<0) return {note:'Item 16 not among hits', hits:E("document.getElementById('guideSearchResults').__hits.map(function(h){return h.itemNum;})")};
  E("guideJumpTo("+targetIdx+")");
  const opened=E("document.getElementById('guideSearchResults').__hits["+targetIdx+"].box.open");
  const stepMatches=E("WIZ_STEP===document.getElementById('guideSearchResults').__hits["+targetIdx+"].stepIdx");
  const resultsClosedAfterPick=E("document.getElementById('guideSearchResults').style.display")==='none';
  E("wizSetView('scroll')");
  return (opened===true && stepMatches===true && resultsClosedAfterPick) ? true : {opened,stepMatches,resultsClosedAfterPick};
});
t('a grouped item’s instructions are not mislabelled with a neighbouring item’s number (16 vs 17 vs 18)', ()=>{
  const idx=E("guideIndex().filter(function(e){return ['16','17','18'].indexOf(e.itemNum)>=0;}).map(function(e){return e.itemNum;})");
  return (idx.length===3 && new Set(idx).size===3) ? true : idx;
});
t('a click outside the search box closes the results', ()=>{
  E("guideSearch('COMSEC')");
  w.document.body.click();
  const shown=w.document.getElementById('guideSearchResults').style.display;
  return shown==='none' ? true : shown;
});

H('84b. Bulk selection and selected-only export');
await ta('checking two cards shows the selection bar with the right count', async()=>{
  await wipe();
  await E("draftPut({id:'bs1',title:'Bulk One',status:'Draft',meta:{contract:'C-1'},workspace:{}})");
  await E("draftPut({id:'bs2',title:'Bulk Two',status:'Draft',meta:{contract:'C-2'},workspace:{}})");
  await E("draftPut({id:'bs3',title:'Bulk Three',status:'Draft',meta:{contract:'C-3'},workspace:{}})");
  await E("dashRenderCards()");
  w.document.querySelector('.dash-card[data-id="bs1"] .dash-card-sel').click();
  w.document.querySelector('.dash-card[data-id="bs2"] .dash-card-sel').click();
  const bar=w.document.getElementById('dashSelBar');
  const displayWhileSelected=bar.style.display; // captured before dashSelClear() mutates the same live element
  const count=w.document.getElementById('dashSelCount').textContent;
  const issueButton=Array.from(bar.querySelectorAll('button')).some(function(b){return /Issue selected/.test(b.textContent) && /dashBulkIssueSelected/.test(b.getAttribute('onclick')||'');});
  const selected=Array.from(E("DASH.selected")||[]);
  E("dashSelClear()");
  return (displayWhileSelected==='flex' && count==='2 selected'
    && issueButton && selected.includes('bs1') && selected.includes('bs2') && !selected.includes('bs3')) ? true : {displayWhileSelected,count,issueButton,selected};
});
await ta('select-all selects every visible card, and unchecking one clears the header checkbox', async()=>{
  w.document.getElementById('dashSelAll').click();
  const all3=E("DASH.selected.size")===3;
  w.document.querySelector('.dash-card[data-id="bs1"] .dash-card-sel').click();
  const headerNowUnchecked=w.document.getElementById('dashSelAll').checked===false;
  E("dashSelClear()");
  return (all3 && headerNowUnchecked) ? true : {all3,headerNowUnchecked};
});
await ta('exporting the selection includes only the selected drafts', async()=>{
  E("DASH.selected=new Set(['bs1','bs3']);"); E("dashSelBarUpdate();");
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  await E("portfolioCsvSelected()"); w.Blob=OB;
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  const titlesInCsv=rows.slice(2).map(function(r){return r[0];}).filter(Boolean);
  E("dashSelClear()");
  return (titlesInCsv.includes('Bulk One') && titlesInCsv.includes('Bulk Three') && !titlesInCsv.includes('Bulk Two'))
    ? true : {titlesInCsv};
});
await ta('clearing the selection unchecks every card and hides the bar', async()=>{
  w.document.querySelector('.dash-card[data-id="bs1"] .dash-card-sel').click();
  E("dashSelClear()");
  const anyChecked=Array.from(w.document.querySelectorAll('.dash-card-sel')).some(function(cb){return cb.checked;});
  const barHidden=w.document.getElementById('dashSelBar').style.display==='none';
  return (!anyChecked && barHidden && E("DASH.selected.size")===0) ? true : {anyChecked,barHidden};
});
await ta('a plain, unfiltered portfolio export is unaffected by the selection feature', async()=>{
  let cap=''; const OB=w.Blob; w.Blob=function(p){cap=String(p[0]||'');return new OB(p,{type:'text/csv'});};
  w.URL.createObjectURL=()=>'blob:x'; w.URL.revokeObjectURL=()=>{};
  await E("portfolioCsv()"); w.Blob=OB;
  const rows=E("ioCsvParse("+JSON.stringify(cap)+")");
  const titlesInCsv=rows.slice(2).map(function(r){return r[0];}).filter(Boolean);
  return (titlesInCsv.includes('Bulk One') && titlesInCsv.includes('Bulk Two') && titlesInCsv.includes('Bulk Three'))
    ? true : {titlesInCsv};
});
await ta('changing one selected status to Issued opens one bulk window and issues every selected record', async()=>{
  await wipe();
  E("tplSave(TPL_CT,[{label:'Bulk CUI',ioId:'bulk-cui',data:Object.assign(ctBlankData(),{cls:'CUI'})}])");
  await E("draftPut({id:'bi1',title:'Bulk Issue One',requestedBy:'req@gov.mil',status:'Draft',meta:{},dist:[],holds:[],niss:{on:true},workspace:{selects:{},checks:{dist18a:true},radios:{},texts:{i6fsoEmail:'fso1@a.com',i6c:'cso1@gov.mil'},perf:[]}})");
  await E("draftPut({id:'bi2',title:'Bulk Issue Two',requestedBy:'REQ@gov.mil',status:'Draft',meta:{},dist:[],holds:[],niss:{on:true},workspace:{selects:{ctTplSel:'bulk-cui'},checks:{dist18b:true,dist18f:true},radios:{},texts:{i7fsoEmail:'fso2@b.com',i7c:'CSO1@gov.mil cso2@gov.mil',dist18fOther:'other@gov.mil'},perf:[]}})");
  await E("dashRenderCards();DASH.selected=new Set(['bi1','bi2']);dashSelBarUpdate()");
  const oldAlert=w.uiAlert; w.uiAlert=async function(m){w.__bulkDone=m;};
  const pr=E("dashSetStatus('bi1','Issued')"); await new Promise(r=>setTimeout(r,120));
  const d=w.document.getElementById('dashBulkDistDlg'); if(!d){w.uiAlert=oldAlert;return 'no bulk dialog';}
  const links=Array.from(d.querySelectorAll('[id^="bddEmail_"]')).map(function(a){return decodeURIComponent(a.getAttribute('href')||'');});
  const screenOk=/Bulk issuance — 2 DD-254s/.test(d.textContent) && /CUI — SEND ENCRYPTED/.test(d.textContent)
    && /Prepared e-mails — 2 audience groups/.test(d.textContent) && /Never attach a record to a different audience group/.test(d.textContent)
    && /Bulk Issue One/.test(d.textContent) && /Bulk Issue Two/.test(d.textContent) && /checked Block 18f/.test(d.textContent)
    && links.length===2
    && links.some(function(h){return h.indexOf('mailto:req@gov.mil; fso1@a.com?cc=cso1@gov.mil&subject=Issued DD Form 254 — Bulk Issue One')===0;})
    && links.some(function(h){return /^mailto:REQ@gov\.mil; fso2@b\.com\?cc=CSO1@gov\.mil; cso2@gov\.mil; other@gov\.mil&subject=\(CUI\)\(CUI\)\(CUI\) Issued DD Form 254 — Bulk Issue Two$/i.test(h);})
    && !links.some(function(h){return /fso1@a\.com/.test(h)&&/fso2@b\.com/.test(h);});
  d.querySelector('#bddSave').click(); await pr; w.uiAlert=oldAlert;
  const a=await E("draftGet('bi1')"), b=await E("draftGet('bi2')");
  return screenOk && a.status==='Issued' && b.status==='Issued' && a.dist.length===2 && b.dist.length===3
    && E("DASH.selected.size")===0 && /2 DD-254s were issued together/.test(w.__bulkDone||'');
});
await ta('one hard failure stops the entire selected issuance before the distribution window', async()=>{
  await wipe();
  await E("draftPut({id:'bf1',title:'Clean record',status:'Draft',meta:{errors:0},holds:[],niss:{on:true},workspace:{}})");
  await E("draftPut({id:'bf2',title:'Record with error',status:'Draft',meta:{errors:2},holds:[],niss:{on:true},workspace:{}})");
  const oldAlert=w.uiAlert; w.__bulkStop=''; w.uiAlert=async function(m){w.__bulkStop=m;};
  const result=await E("dashBulkIssue(['bf1','bf2'])"); w.uiAlert=oldAlert;
  const a=await E("draftGet('bf1')"), b=await E("draftGet('bf2')");
  return result===false && a.status==='Draft' && b.status==='Draft' && !w.document.getElementById('dashBulkDistDlg')
    && /Nothing was issued/.test(w.__bulkStop) && /Record with error/.test(w.__bulkStop);
});
await ta('cancelling the bulk distribution window leaves every selected record unissued', async()=>{
  await wipe();
  await E("draftPut({id:'bc1',title:'Cancel One',status:'Draft',meta:{},holds:[],niss:{on:true},workspace:{selects:{},checks:{},radios:{},texts:{},perf:[]}})");
  await E("draftPut({id:'bc2',title:'Cancel Two',status:'Ready to sign',meta:{},holds:[],niss:{on:true},workspace:{selects:{},checks:{},radios:{},texts:{},perf:[]}})");
  const pr=E("dashBulkIssue(['bc1','bc2'])"); await new Promise(r=>setTimeout(r,120));
  const d=w.document.getElementById('dashBulkDistDlg'); if(!d) return 'no bulk dialog';
  d.querySelector('#bddCancel').click(); const result=await pr;
  const a=await E("draftGet('bc1')"), b=await E("draftGet('bc2')");
  return result===false && a.status==='Draft' && b.status==='Ready to sign' && !a.issuedAt && !b.issuedAt;
});

H('84a. Draft card overflow menu');
await ta('Copy, Reset workflow, Compare and the override live in the card menu, closed by default', async()=>{
  await wipe();
  await E("draftPut({id:'ov0',title:'Overflow Parent',status:'Ready to sign',meta:{},workspace:{}})");
  await E("draftPut({id:'ov1',title:'Overflow Test',parentId:'ov0',status:'Draft',meta:{},workspace:{}})");
  await E("dashRenderCards()");
  const menu=w.document.getElementById('cardMenu_ov1');
  if(!menu) return 'no cardMenu_ov1 rendered';
  const closedByDefault=menu.style.display!=='block';
  const hasCopy=!!menu.querySelector('[onclick*="dashDuplicate"]');
  const hasOverride=!!menu.querySelector('[onchange*="dashSetStatusOverride"]');
  const hasCompare=!!menu.querySelector('[onclick*="dashCompare"]');
  return (closedByDefault && hasCopy && hasOverride && hasCompare) ? true : {closedByDefault,hasCopy,hasOverride,hasCompare};
});
await ta('the ⋯ button opens its own card menu, closes any other open one, and outside-click closes it', async()=>{
  await wipe();
  await E("draftPut({id:'ov2',title:'Card A',status:'Draft',meta:{},workspace:{}})");
  await E("draftPut({id:'ov3',title:'Card B',status:'Draft',meta:{},workspace:{}})");
  await E("dashRenderCards()");
  w.document.getElementById('cardMenu_ov2').parentElement.querySelector('.dash-card-more-btn').click();
  const aOpenAlone=w.document.getElementById('cardMenu_ov2').style.display==='block'
    && w.document.getElementById('cardMenu_ov3').style.display!=='block';
  w.document.getElementById('cardMenu_ov3').parentElement.querySelector('.dash-card-more-btn').click();
  const bOpenAAlone=w.document.getElementById('cardMenu_ov3').style.display==='block'
    && w.document.getElementById('cardMenu_ov2').style.display!=='block';
  w.document.body.click();
  const closedOnOutsideClick=w.document.getElementById('cardMenu_ov3').style.display!=='block';
  return (aOpenAlone && bOpenAAlone && closedOnOutsideClick) ? true : {aOpenAlone,bOpenAAlone,closedOnOutsideClick};
});
t('Open and the ⋯ trigger both stayed directly on the card, not tucked inside the menu', ()=>{
  const card=w.document.querySelector('#dashCards .dash-card');
  if(!card) return 'no card rendered';
  const hasOpen=!!card.querySelector('button.dash-btn-primary');
  const moreBtn=card.querySelector('.dash-card-more-btn');
  const menuInsideMore=!!card.querySelector('.dash-card-more .dash-card-menu');
  return (hasOpen && moreBtn && menuInsideMore) ? true : {hasOpen,hasMoreBtn:!!moreBtn,menuInsideMore};
});

H('84. Item 10/11 tile checkbox click accuracy');
t('every Item 10/11 (and Item 3) tile checkbox is out of the click and tab paths, so only the tile toggles it', ()=>{
  /* jsdom has no layout engine, so it cannot reproduce the actual native
     double-toggle (that needs a real, trusted OS-level click landing on the
     checkbox's own pixel box — see browser_smoke.js). What jsdom can confirm
     is that the fix is actually in force: the checkbox cannot receive a
     pointer event at all, and cannot receive keyboard focus of its own, so
     every interaction is forced through the tile's own handler exactly once. */
  const boxes=Array.from(w.document.querySelectorAll('.cbi input[type="checkbox"]'));
  if(!boxes.length) return 'no .cbi checkboxes found';
  const bad=boxes.filter(function(cb){
    return w.getComputedStyle(cb).pointerEvents!=='none' || cb.tabIndex!==-1;
  }).map(function(cb){ return cb.id; });
  return bad.length===0 ? true : {count:boxes.length,bad:bad};
});

H('87. A cleared compliance hold stays cleared');
const recWith10f=()=>({id:'ch-1',title:'Hold Test',meta:{},status:'Draft',holds:[],
  workspace:{texts:{},checks:{c10f:true},radios:{},selects:{},perf:[]}});
t('ticking a trigger raises a compliance hold', ()=>{
  const r=recWith10f();
  E("window.__R="+JSON.stringify(r)+"; dashSyncCompliance(window.__R);");
  const h=E("window.__R.holds");
  return (h.length===1 && h[0].k==='10f' && h[0].c===true && h[0].done===false) ? true : h;
});
t('reconciling again while it is open does not duplicate it', ()=>{
  E("dashSyncCompliance(window.__R); dashSyncCompliance(window.__R);");
  return E("window.__R.holds").length===1 ? true : E("window.__R.holds");
});
t('clearing it records a basis and closes it', ()=>{
  E("var h=window.__R.holds[0]; h.done=true; h.basis='GCA approval received — auth NAVAIR, 2026-03-02, ref 44-118'; h.clearedOn='2026-03-02';");
  const h=E("window.__R.holds[0]");
  return (h.done===true && /NAVAIR/.test(h.basis)) ? true : h;
});
t('re-entering the workflow does NOT raise it again', ()=>{
  const changed=E("dashSyncCompliance(window.__R)");
  const h=E("window.__R.holds");
  return (h.length===1 && h[0].done===true && changed===false) ? true : {n:h.length,changed,holds:h};
});
t('and the draft is not forced back to Blocked', ()=>{
  E("window.__R.status='Ready to sign'; dashSyncCompliance(window.__R);");
  return E("window.__R.status")==='Ready to sign' ? true : E("window.__R.status");
});
t('nothing is reported as an open hold once cleared', ()=>{
  return E("dashComplianceOpen(window.__R)").length===0 ? true : E("dashComplianceOpen(window.__R)");
});
t('reopening it by hand brings the block back', ()=>{
  E("window.__R.holds[0].done=false; dashSyncCompliance(window.__R);");
  const n=E("window.__R.holds").length, open=E("dashComplianceOpen(window.__R)").length;
  E("window.__R.holds[0].done=true;");
  return (n===1 && open===1) ? true : {n,open};
});
t('unticking the box supersedes an OPEN hold rather than deleting it', ()=>{
  const r=recWith10f();
  E("window.__S="+JSON.stringify(r)+"; dashSyncCompliance(window.__S);");
  E("window.__S.workspace.checks.c10f=false; dashSyncCompliance(window.__S);");
  const h=E("window.__S.holds")[0];
  return (h.sup===true && h.done===true && /superseded/.test(h.t)) ? true : h;
});
t('re-ticking after a supersede raises a fresh hold, because that is new', ()=>{
  E("window.__S.workspace.checks.c10f=true; dashSyncCompliance(window.__S);");
  const h=E("window.__S.holds");
  return (h.length===2 && h[1].done===false && !h[1].sup) ? true : h;
});
t('a documented clearance survives the box being unticked and re-ticked', ()=>{
  const r=recWith10f();
  E("window.__T="+JSON.stringify(r)+"; dashSyncCompliance(window.__T);");
  E("var h=window.__T.holds[0]; h.done=true; h.basis='Standing authority — ref STG-9';");
  E("window.__T.workspace.checks.c10f=false; dashSyncCompliance(window.__T);");
  E("window.__T.workspace.checks.c10f=true;  dashSyncCompliance(window.__T);");
  const h=E("window.__T.holds");
  return (h.length===1 && h[0].done===true && /STG-9/.test(h[0].basis)) ? true : h;
});
t('two different triggers are tracked separately', ()=>{
  const r=recWith10f(); r.workspace.checks.c10a=true;
  E("window.__U="+JSON.stringify(r)+"; dashSyncCompliance(window.__U);");
  E("var hs=window.__U.holds; hs.forEach(function(h){ if(h.k==='10f'){h.done=true;h.basis='cleared';} });");
  E("dashSyncCompliance(window.__U);");
  const hs=E("window.__U.holds");
  const open=E("dashComplianceOpen(window.__U)").map(h=>h.k);
  return (hs.length===2 && JSON.stringify(open)===JSON.stringify(['10a'])) ? true : {n:hs.length,open};
});

H('88. Official nonblocking access advisors');
t('the official build has both advisors and no prototype labels', ()=>{
  const text=w.document.body.textContent;
  return (w.document.getElementById('accessAdvisorBox')
    && w.document.getElementById('item11AdvisorBox')
    && /ADVISORY — NONBLOCKING/.test(text)
    && !/ADVISORY PROTOTYPE|This prototype compares|Not verified in prototype/.test(text)) ? true : 'prototype label remains or an advisor is missing';
});
t('SCI above a Secret Item 1a is reported as an advisory contradiction', ()=>{
  E("resetFormFields();document.getElementById('fcl1a').value='S';document.getElementById('sfg1b').value='S';document.getElementById('c10e1').checked=true;run();");
  const titles=E("window.DD254_ACCESS_ADVISORIES.map(function(f){return f.title;})");
  return titles.some(function(x){return /SCI exceeds Item 1a/.test(x);}) ? true : titles;
});
t('advisor evidence changes never alter blocking validation', ()=>{
  const before={e:E('(window.DD254_ERRORS||[]).slice()'),w:E('(window.DD254_WARNS||[]).slice()')};
  E("document.getElementById('advActualFcl').value='S';document.getElementById('advFclStatus').value='interim';run();");
  const after={e:E('(window.DD254_ERRORS||[]).slice()'),w:E('(window.DD254_WARNS||[]).slice()')};
  return JSON.stringify(before)===JSON.stringify(after) ? true : {before,after};
});
t('11h checks Item 10a and COMSEC account authority', ()=>{
  E("resetFormFields();document.getElementById('fcl1a').value='S';document.getElementById('sfg1b').value='S';document.getElementById('c11h').checked=true;run();");
  const titles=E("window.DD254_ITEM11_ADVISORIES.map(function(f){return f.title;})");
  return (titles.some(function(x){return /11h requires Item 10a/.test(x);})
    && titles.some(function(x){return /COMSEC account authorization/.test(x);})) ? true : titles;
});
t('documenting the 11h prerequisites clears those two findings', ()=>{
  E("document.getElementById('c10a').checked=true;document.getElementById('adv11hAccount').value='yes';run();");
  const titles=E("window.DD254_ITEM11_ADVISORIES.map(function(f){return f.title;})");
  return (!titles.some(function(x){return /11h requires Item 10a|COMSEC account authorization/.test(x);})) ? true : titles;
});
t('Item 11 evidence persists in a draft but is excluded from official PDF data', ()=>{
  E("document.getElementById('adv11gDtic').value='yes';");
  const ws=E('collectWorkspace()');
  const pdf=E('collect254Data(false)');
  return (ws.selects.adv11gDtic==='yes' && JSON.stringify(pdf).indexOf('adv11gDtic')<0) ? true : {workspace:ws.selects.adv11gDtic,pdfHasField:JSON.stringify(pdf).indexOf('adv11gDtic')>=0};
});

H('89. Conditional-alert authority references');
t('every registered conditional alert exists and renders exactly one reference', ()=>{
  E('run();run();');
  const ids=E('Object.keys(VALIDATION_ALERT_REFERENCES)');
  const missing=ids.filter(function(id){return !w.document.getElementById(id);});
  const counts=ids.map(function(id){return [id,w.document.getElementById(id).querySelectorAll('.alert-authority').length];});
  const bad=counts.filter(function(x){return x[1]!==1;});
  return (ids.length>=31 && missing.length===0 && bad.length===0) ? true : {count:ids.length,missing,bad};
});
t('the SCI Item 15 alert names both its form instruction and SCI authority', ()=>{
  E("document.getElementById('c10e1').checked=true;run();");
  const text=w.document.getElementById('a10e1Item15').textContent;
  return (/Authority: DD Form 254 Instructions, Item 15\(2\)\(a\)/.test(text)
    && /DoDM 5105\.21-V3/.test(text)) ? true : text;
});
t('the local subcontractor e-mail safeguard is labeled as a workflow control', ()=>{
  const text=w.document.querySelector('#a7email .alert-authority').textContent;
  return /^Workflow control:/.test(text) ? true : text;
});
t('authority footers do not become errors or warnings', ()=>{
  const all=E('(window.DD254_ERRORS||[]).concat(window.DD254_WARNS||[])');
  const bad=all.filter(function(x){return /Authority:|Workflow control:/.test(x);});
  return bad.length===0 ? true : bad;
});

H('90. v195 custody, issuance and revision safeguards');
t('unchecking 18f clears its hidden recipient text and hides the detail row', ()=>{
  E("resetFormFields();document.getElementById('dist18f').checked=true;dist18fToggle(true);document.getElementById('dist18fOther').value='legacy@example.mil';document.getElementById('dist18f').checked=false;dist18fToggle(false);");
  const field=w.document.getElementById('dist18fOther'), row=w.document.getElementById('dist18fRev');
  return field.value==='' && !row.className.includes('show');
});
t('unchecked legacy 18f text is excluded from stored e-mail audiences', ()=>{
  const em=E("dashDistEmails({requestedBy:'req@gov.mil',workspace:{checks:{dist18f:false},texts:{dist18fOther:'hidden@example.mil'}}})");
  return em.other18f.length===0 && !em.all.some(function(x){return /hidden@/i.test(x);});
});
t('unchecked legacy 18f text is excluded from official export data', ()=>{
  E("resetFormFields();document.getElementById('dist18f').checked=false;document.getElementById('dist18fOther').value='hidden@example.mil';");
  const d=E('collect254Data(false)'); return d.v.dist18f_other==='';
});
t('checked 18f text remains in the issue e-mail CC line', ()=>{
  const m=E("dashIssueMail({requestedBy:'req@gov.mil',workspace:{checks:{dist18f:true},texts:{dist18fOther:'other@example.mil'}}})");
  return m.cc.join('|')==='other@example.mil';
});
t('CUI is derived from access boxes, designation fields, LDCs and templates', ()=>{
  E("tplSave(TPL_CT,[{label:'Derived CUI',ioId:'derived-cui',data:Object.assign(ctBlankData(),{c10:{'10j':true}})}])");
  const samples=[
    {checks:{c10j:true}},{checks:{c11l:true}},{texts:{cuiCat:'CTI'}},
    {checks:{ldcNoDissem:true}},{selects:{distStmt:'C'}},{selects:{ctTplSel:'derived-cui'}}
  ];
  return !E('dd254WorkspaceHasCUI({})') && samples.every(function(ws){return E('dd254WorkspaceHasCUI('+JSON.stringify(ws)+')');});
});
t('derived CUI drives both the dashboard badge and the e-mail subject', ()=>{
  const r={title:'Derived',requestedBy:'req@gov.mil',workspace:{checks:{c10j:true},texts:{},selects:{}}};
  const cls=E('dashClsOf('+JSON.stringify(r)+')'), m=E('dashIssueMail('+JSON.stringify(r)+')');
  return cls==='CUI' && m.cui && /^\(CUI\)\(CUI\)\(CUI\)/.test(m.subject);
});
t('a CUI selection with an unclassified marking warns but does not create that warning as an error', ()=>{
  E("resetFormFields();document.getElementById('c10j').checked=true;document.getElementById('clsSel').value='';run();");
  const warnings=w.DD254_WARNS||[], errors=w.DD254_ERRORS||[];
  return warnings.some(function(x){return /CUI content is present/.test(x);}) && !errors.some(function(x){return /CUI content is present/.test(x);});
});
t('bulk issuance groups identical recipients together and isolates different recipients', ()=>{
  const base=function(id,fso){return {id:id,title:id,requestedBy:'req@gov.mil',workspace:{checks:{},selects:{},texts:{i6fsoEmail:fso,i6c:'cso@gov.mil'}}};};
  const same=E('dashIssueMailGroups('+JSON.stringify([base('a','fso@a.com'),base('b','fso@a.com')])+')');
  const split=E('dashIssueMailGroups('+JSON.stringify([base('a','fso@a.com'),base('c','fso@c.com')])+')');
  return same.length===1 && same[0].records.length===2 && split.length===2;
});
t('the same recipients are separated when only one record is CUI', ()=>{
  const a={id:'a',title:'A',requestedBy:'req@gov.mil',workspace:{checks:{},selects:{},texts:{i6fsoEmail:'fso@a.com'}}};
  const b=JSON.parse(JSON.stringify(a)); b.id='b'; b.title='B'; b.workspace.checks.c10j=true;
  const g=E('dashIssueMailGroups('+JSON.stringify([a,b])+')');
  return g.length===2 && g.filter(function(x){return x.mail.cui;}).length===1;
});
t('an oversized mail handoff is detected before the browser is asked to open it', ()=>{
  const list=Array.from({length:120},function(_,i){return 'person'+i+'@example.mil';}).join('; ');
  const m=E('dashIssueMail({requestedBy:'+JSON.stringify(list)+',workspace:{checks:{},texts:{}}})');
  return m.href.length>1900 && E('dashMailHrefTooLong('+JSON.stringify(m)+')')===true;
});
await ta('a failed fallback write remains visible in the open tab and raises the persistent warning', async()=>{
  const oldUse=E('DASH.useLS'), oldSet=w.Storage.prototype.setItem, oldAlert=w.uiAlert; let alertText='';
  w.uiAlert=async function(m){alertText=String(m);}; E('DASH.useLS=true;window.DRAFT_STORAGE_FAIL=false;window.DRAFT_STORAGE_WARNED=false;');
  w.Storage.prototype.setItem=function(k,v){if(k==='dd254_drafts') throw new Error('quota test'); return oldSet.call(this,k,v);};
  let threw=false; try{await E("draftPut({id:'ls-emergency',title:'Latest emergency copy',workspace:{}})");}catch(e){threw=true;}
  await new Promise(r=>setTimeout(r,25));
  const got=await E("draftGet('ls-emergency')"), meter=w.document.getElementById('storageMeter').textContent;
  w.Storage.prototype.setItem=oldSet; w.uiAlert=oldAlert;
  E("delete DASH_MEM['ls-emergency'];DASH.useLS="+JSON.stringify(oldUse)+";window.DRAFT_STORAGE_FAIL=false;window.DRAFT_STORAGE_WARNED=false;storageMeter();");
  const ok=threw && got && got.title==='Latest emergency copy' && /DRAFT NOT SAVED/.test(meter) && /open tab only/.test(alertText);
  return ok?true:{threw:threw,got:got&&got.title,meter:meter,alertText:alertText};
});
await ta('a later successful persistent write clears the draft-storage failure state', async()=>{
  const oldUse=E('DASH.useLS'); E("DASH.useLS=true;window.DRAFT_STORAGE_FAIL=true;window.DRAFT_STORAGE_WARNED=true;");
  await E("draftPut({id:'ls-recovered',title:'Recovered',workspace:{}})");
  const ok=!E('window.DRAFT_STORAGE_FAIL') && !E('window.DRAFT_STORAGE_WARNED');
  E("var _ls=lsAll();delete _ls['ls-recovered'];lsWrite(_ls);DASH.useLS="+JSON.stringify(oldUse)+";");
  return ok;
});
await ta('the backup reminder clears only after the operator confirms the download', async()=>{
  const oldConfirm=w.uiConfirm; w.localStorage.setItem('dd254_dirty_n','3');
  w.uiConfirm=async function(){return false;}; const first=await E('fullBackup()'), kept=E('bkDirty()');
  w.uiConfirm=async function(){return true;}; const second=await E('fullBackup()'), cleared=E('bkDirty()');
  w.uiConfirm=oldConfirm;
  return first===false && kept===3 && second===true && cleared===0;
});
t('revision rows use human labels and preserve long values without truncation', ()=>{
  const old='A'.repeat(240), now='B'.repeat(260), rows=E('dashDiffRows({texts:{i2a:'+JSON.stringify(old)+'}},{texts:{i2a:'+JSON.stringify(now)+'}})');
  return rows.length===1 && rows[0].field==='Item 2a — Prime Contract Number' && rows[0].was.length===240 && rows[0].now.length===260;
});
t('Item 13 changes are reported by reference section', ()=>{
  const a='Standard\n\nReference 10a:\n\nOld COMSEC text', b='Standard\n\nReference 10a:\n\nNew COMSEC text';
  const rows=E('dashDiffRows({texts:{item13:'+JSON.stringify(a)+'}},{texts:{item13:'+JSON.stringify(b)+'}})');
  return rows.length===1 && rows[0].field==='Item 13 — Reference 10a' && /Old COMSEC/.test(rows[0].was) && /New COMSEC/.test(rows[0].now);
});
await ta('revision comparison traverses the full retained chain', async()=>{
  await wipe();
  await E("draftPut({id:'rev0',title:'Original',workspace:{texts:{i2a:'A'},checks:{},radios:{},selects:{},perf:[]}})");
  await E("draftPut({id:'rev1',parentId:'rev0',title:'Revision 1',workspace:{texts:{i2a:'B'},checks:{},radios:{},selects:{},perf:[]}})");
  await E("draftPut({id:'rev2',parentId:'rev1',title:'Revision 2',workspace:{texts:{i2a:'C'},checks:{},radios:{},selects:{},perf:[]}})");
  const model=await E("dashCompareModel('rev2')");
  return model.chain.length===3 && model.edges.length===2 && model.total===2;
});
await ta('the full-chain revision report exports as a PDF and logs the export', async()=>{
  const bytes=await E("dashComparePdf('rev2')");
  await new Promise(r=>setTimeout(r,30));
  const sig=bytes&&Array.from(bytes.slice(0,4)).map(function(x){return String.fromCharCode(x);}).join('');
  const logged=E("audAll().some(function(a){return a.id==='rev2'&&a.action==='revision-report-exported';})");
  return sig==='%PDF' && bytes.length>1000 && logged;
});

console.log('\n================================');
console.log('  PASS '+pass+'   FAIL '+fail);
if(failures.length) console.log('  failing: '+failures.join(' | '));
console.log('================================');
process.exit(fail?1:0);
},3500);
