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
    await injectJs('https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js');
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

    $(async function () {
      const { isBug, isTask } = checkUrl();
      if (!isBug && !isTask) return

      const id = $('#mainMenu .page-title .label.label-id').text();
      const text = $('#mainMenu .page-title .text').attr('title');
      const message = `${isBug ? 'fix' : isTask ? 'feat' : ''}(#${id}): ${text}`;
      const dom = `
      <span id="copyCommitMsg" class="btn btn-sm btn-primary">复制commit message</span>
    `;
      $('#mainMenu .page-title').append(dom);

      new ClipboardJS('#copyCommitMsg', {
        text: function () {
          return message
        }
      });
    });
  }

  main();

})();
