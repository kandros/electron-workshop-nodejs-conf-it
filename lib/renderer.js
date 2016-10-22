const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const $markdownView = $('.raw-markdown');
const $htmlView = $('.rendered-html');
const $openFileButton = $('#open-file');
const $saveFileButton = $('#save-file');
const $copyHtmlButton = $('#copy-html');
const marked = require('marked');
const {remote} = electron;
const mainProcess = remote.require('./main');
const clipboard = remote.clipboard;

ipc.on('file-opened', (event, file, content) => {
    $markdownView.val(content);
    renderMarkdownToHtml(content);
});

$markdownView.on('keyup', (event) => {
    const content = $(event.target).val();
    renderMarkdownToHtml(content);
});

$openFileButton.on('click', () => {
    mainProcess.openFile();
});

$copyHtmlButton.on('click', () => {
    const html = $htmlView.html();
    clipboard.writeText(html);
});

function renderMarkdownToHtml(markdown) {
    const html = marked(markdown);
    $htmlView.html(html);
}