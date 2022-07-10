import markdown from 'markdown-it';
import underline from 'markdown-it-underline';
import hightlightjs from 'highlight.js';
import 'highlight.js/styles/androidstudio.css';

export default function configureMarkdownIt() {
    return new markdown({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang && hightlightjs.getLanguage(lang)) {
                try {
                    return (
                        `<pre class="hljs ${lang ? `language-${lang}` : null}"><code>` +
                        hightlightjs.highlightAuto(str).value +
                        `</code></pre>`
                    );
                } catch (ex) {
                    console.debug(ex);
                }
            }
            return '<pre class="hljs"><code>' + markdown().utils.escapeHtml(str) + '</code></pre>';
        },
    }).use(underline);
}
