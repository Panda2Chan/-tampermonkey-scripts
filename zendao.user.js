// ==UserScript==
// @name         生成commit message
// @namespace    http://tampermonkey.net/
// @version      2024-12-10
// @description  自动从禅道生成commit message，当前支持bug和task页面
// @author       Xael
// @match        https://zentao.topluck999.com/zentao/bug-view-**.html
// @match        https://zentao.topluck999.com/zentao/task-view-**.html
// @match        https://zentao.topluck999.com/zentao/execution-storyView-**.html
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  async function injectJs(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    })
  }

  async function main() {
    await injectJs('https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.min.js');
    
    function checkUrl() {
      const url = window.location.href;
      let res = {};
      if (url.match(/\/zentao\/bug-view-\d+/)) {
        res.isBug = true;
      }
      if (url.match(/\/zentao\/task-view-\d+/)) {
        res.isTask = true;
      }
      if (url.match(/\/zentao\/execution-storyView-\d+/)) {
        res.isTask = true;
      }
      return res;
    }

    function setBtnOkStatus(btn, oldText) {
      let isProcessing = false;

      return () => {
        if (isProcessing) return;
        
        isProcessing = true;
        btn.textContent = '复制成功✅';
        
        setTimeout(() => {
          btn.textContent = oldText;
          isProcessing = false;
        }, 1000);
      }
    }

    const { isBug, isTask } = checkUrl();
    if (!isBug && !isTask) return;

    const id = document.querySelector('#mainMenu .page-title .label.label-id').textContent;
    const text = document.querySelector('#mainMenu .page-title .text').getAttribute('title');
    const message = `${isBug ? 'fix' : isTask ? 'feat' : ''}(#${id}): ${text}`;

    const btn = document.createElement('span');
    btn.id = 'copyCommitMsg';
    btn.className = 'btn btn-sm btn-primary';
    btn.textContent = '复制commit message';
    
    document.querySelector('#mainMenu .page-title').appendChild(btn);

    const setOk = setBtnOkStatus(btn, '复制commit message');
    new ClipboardJS('#copyCommitMsg', {
      text: function () {
        setOk();
        return message;
      }
    });
  }

  main();

})();
