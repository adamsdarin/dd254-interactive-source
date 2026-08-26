const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const { pathToFileURL } = require('url');

const buildArg = process.argv[2];
if (!buildArg) {
  console.error('usage: node browser_smoke.js DD254_Interactive_vNNN.HTM');
  process.exit(2);
}
const build = path.resolve(buildArg);
if (!fs.existsSync(build)) throw new Error('build not found: ' + build);

const chromeCandidates = process.platform === 'win32' ? [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
] : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
const chrome = chromeCandidates.find(fs.existsSync);
if (!chrome) throw new Error('Chrome or Edge was not found');

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dd254-browser-'));
const child = cp.spawn(chrome, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', '--user-data-dir=' + profile,
  '--allow-file-access-from-files', pathToFileURL(build).href
], { stdio: ['ignore', 'ignore', 'pipe'] });

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(fn, ms, label) {
  const stop = Date.now() + ms;
  let last;
  while (Date.now() < stop) {
    try { const value = await fn(); if (value) return value; } catch (err) { last = err; }
    await pause(100);
  }
  throw new Error('timeout waiting for ' + label + (last ? ': ' + last.message : ''));
}

class CDP {
  constructor(url) {
    this.next = 1; this.pending = new Map(); this.events = [];
    this.opened = new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = resolve;
      this.ws.onerror = () => reject(new Error('DevTools WebSocket failed'));
      this.ws.onmessage = event => {
        const msg = JSON.parse(event.data);
        if (msg.id) {
          const p = this.pending.get(msg.id); if (!p) return;
          this.pending.delete(msg.id);
          if (msg.error) p.reject(new Error(msg.error.message)); else p.resolve(msg.result);
        } else this.events.push(msg);
      };
    });
  }
  async send(method, params = {}) {
    await this.opened;
    const id = this.next++;
    const answer = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.ws.send(JSON.stringify({ id, method, params }));
    return answer;
  }
  close() { this.ws.close(); }
}

(async () => {
  let cdp;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    const port = await waitFor(() => {
      if (!fs.existsSync(portFile)) return 0;
      return Number(fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]);
    }, 15000, 'Chrome DevTools port');
    const target = await waitFor(async () => {
      const list = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
      return list.find(x => x.type === 'page');
    }, 15000, 'DD-254 page target');
    cdp = new CDP(target.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    await waitFor(async () => {
      const r = await cdp.send('Runtime.evaluate', {
        expression: "document.readyState==='complete' && typeof settingsOpen==='function'",
        returnByValue: true
      });
      return r.result.value;
    }, 20000, 'DD-254 scripts');

    const expression = `(async function(){
      const byText=(root,rx)=>Array.from(root.querySelectorAll('button')).find(b=>rx.test(b.textContent));
      const manage=byText(document,/^Manage/); if(!manage) return {error:'Manage button missing'};
      manage.click();
      const settings=byText(document.getElementById('dashManageMenu'),/Settings/);
      if(!settings) return {error:'Settings menu item missing'}; settings.click();
      /* settingsOpen() is async and an inline onclick cannot await it, so the panel
         is still empty on the next synchronous line. Poll rather than assume. */
      for(let i=0;i<150&&!document.getElementById('settingsView').querySelector('button');i++) await new Promise(r=>setTimeout(r,20));
      let button=byText(document.getElementById('settingsView'),/Dark/); if(!button) return {error:'Dark setting missing'}; button.click();
      button=byText(document.getElementById('settingsView'),/One page/); if(!button) return {error:'One-page setting missing'}; button.click();
      button=byText(document.getElementById('settingsView'),/Sections per item/); if(!button) return {error:'Sections setting missing'}; button.click();
      const settingsOk=document.documentElement.getAttribute('data-theme')==='dark'
        && WIZ_VIEW==='scroll' && b13ViewGet()==='sections';
      byText(document.getElementById('settingsView'),/Back to dashboard/).click();

      const exportButtons=Array.from(document.querySelectorAll('button'));
      const exportUiOk=exportButtons.filter(b=>/Export Official DD-254/.test(b.textContent)).length===1
        && exportButtons.every(b=>!/Flattened PDF/.test(b.textContent));

      showFormView(); resetFormFields(); b13SelectionReset(); run();
      const item17Labels=Array.from(document.querySelectorAll('#step6 label .sub-ltr')).map(e=>e.textContent.trim());
      const signingUiOk=!document.getElementById('i17i')
        && !item17Labels.includes('17h') && !item17Labels.includes('17i')
        && /Items 17h Signature and 17i Date Signed are completed in the generated dynamic PDF/.test(document.getElementById('step6').textContent);
      const signingXml=DD254XFA.buildXfaDatasets(collect254Data());
      const signingBase=Uint8Array.from(atob(DD254_XFA_B64),ch=>ch.charCodeAt(0));
      const signingPdf=await DD254XFA.injectXfaDatasets(PDFLib,signingBase,signingXml);
      const signingExportOk=/<signedDate><\/signedDate>/.test(signingXml) && signingPdf.length>10000;
      window.__validationInjected=false;
      const phone=document.getElementById('i16e');
      phone.value='<img id="live-validation-injection-probe" src=x onerror="window.__validationInjected=true">1';
      run();
      const validationSafe=!document.getElementById('live-validation-injection-probe')
        && window.__validationInjected===false
        && document.getElementById('warnsPanel').textContent.includes('<img id="live-validation-injection-probe"');
      phone.value=''; run();
      const advisoryUiOk=!!document.getElementById('accessAdvisorBox')
        && !!document.getElementById('item11AdvisorBox')
        && !/ADVISORY PROTOTYPE/.test(document.body.textContent)
        && Object.keys(VALIDATION_ALERT_REFERENCES).every(function(id){
          const el=document.getElementById(id);
          return !!el && el.querySelectorAll('.alert-authority').length===1;
        });
      const tile=document.getElementById('cb10f'); tile.click();
      const box=document.getElementById('b13s_10f');
      if(!box) return {error:'10f section did not appear after tile click',settingsOk};
      box.value='LIVE SAP SENTINEL 174'; box.dispatchEvent(new Event('input',{bubbles:true}));
      const inserted=document.getElementById('item13').value.includes('LIVE SAP SENTINEL 174');
      tile.click();
      const removed=!document.getElementById('item13').value.includes('LIVE SAP SENTINEL 174');
      const undo=byText(document.getElementById('b13Undo'),/Put back/);
      const undoOffered=!!undo; if(undo) undo.click();
      const restored=document.getElementById('c10f').checked
        && document.getElementById('item13').value.includes('LIVE SAP SENTINEL 174');

      for(let i=0;i<100&&!window.TDB_READY;i++) await new Promise(r=>setTimeout(r,20));
      await tplSave(TPL_CSO,[{label:'Browser save baseline'}]);
      await dashTplEdit('cso');
      window.TPL_EDIT[0].label='Browser durable save 174'; dashTplTouch();
      const savePromise=dashTplSaveNow();
      const showedSaving=/Saving/.test(document.getElementById('tplSaveState').textContent);
      const saveOk=await savePromise;
      const durable=(TDB.db&&!TDB.useLS)?(await tdbGet(TPL_CSO)):lsTplRead(TPL_CSO);
      const stored=(durable||[])[0]||{};
      const templateSaveOk=showedSaving && saveOk && /Saved/.test(document.getElementById('tplSaveState').textContent)
        && stored.label==='Browser durable save 174';
      return {version:document.getElementById('toolVer').textContent,settingsOk,exportUiOk,signingUiOk,signingExportOk,validationSafe,
        advisoryUiOk,inserted,removed,undoOffered,restored,templateSaveOk};
    })()`;
    const result = await cdp.send('Runtime.evaluate', {
      expression, awaitPromise: true, returnByValue: true
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'browser evaluation failed');
    const value = result.result.value;

    /* Every other check above drives a tile with element.click() — a script
       call, not a real click, so it never touches a checkbox's own native
       default action. That default action is exactly what broke: a real
       mouse press landing on the small checkbox glyph inside a tile toggled
       it via the browser default AND via the tile's onclick handler reading
       .checked and flipping it, netting zero change with no feedback. This
       needs a genuinely trusted click, which only Input.dispatchMouseEvent
       (not .click() or dispatchEvent) produces, aimed at the checkbox's own
       screen coordinates. */
    await cdp.send('Runtime.evaluate', {
      expression: `(function(){
        wizSetView('scroll'); run();
        const cb=document.getElementById('c11h');
        cb.checked=false; document.getElementById('cb11h').classList.remove('on'); S.c['11h']=false;
        cb.scrollIntoView({block:'center'});
      })()`
    });
    const rectResult = await cdp.send('Runtime.evaluate', {
      expression: `(function(){ const r=document.getElementById('c11h').getBoundingClientRect();
        return {x:r.left+r.width/2, y:r.top+r.height/2, w:r.width, h:r.height}; })()`,
      returnByValue: true
    });
    const rect = rectResult.result.value;
    if (!rect || !(rect.w > 0 && rect.h > 0)) throw new Error('c11h checkbox has no visible box to click: ' + JSON.stringify(rect));
    await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: rect.x, y: rect.y, button: 'left', clickCount: 1 });
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: rect.x, y: rect.y, button: 'left', clickCount: 1 });
    const afterClick = await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('c11h').checked`, returnByValue: true
    });
    value.checkboxGlyphClickWorks = afterClick.result.value === true;

    const exceptions = cdp.events.filter(x => x.method === 'Runtime.exceptionThrown');
    const ok = value && /^Tool v\d+\.\d+$/.test(value.version || '') && value.settingsOk && value.exportUiOk
      && value.signingUiOk && value.signingExportOk && value.validationSafe && value.advisoryUiOk && value.inserted && value.removed && value.undoOffered
      && value.restored && value.templateSaveOk && value.checkboxGlyphClickWorks && exceptions.length === 0;
    if (!ok) throw new Error('live assertions failed: ' + JSON.stringify({ value, exceptions: exceptions.length }));
    console.log('LIVE BROWSER: PASS ' + JSON.stringify(value));
  } finally {
    if (cdp) cdp.close();
    child.kill();
    await pause(250);
    /* This is the exact mkdtemp result above, never a caller-provided path. */
    if (path.dirname(profile) === path.resolve(os.tmpdir()) && path.basename(profile).startsWith('dd254-browser-')) {
      fs.rmSync(profile, { recursive: true, force: true });
    }
  }
})().catch(err => { console.error('LIVE BROWSER: FAIL ' + err.stack); process.exit(1); });
