;
(function() {
    var addCssRule = function() {
        // 创建一个 style， 返回其 stylesheet 对象
        function createStyleSheet() {
            var style = document.createElement('style');
            style.type = 'text/css';
            document.head.appendChild(style);
            return style.sheet;
        }

        // 创建 stylesheet 对象
        var sheet = createStyleSheet();

        // 返回接口函数
        return function(selector, rules, index) {
            index = index || 0;
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
    }();
    addCssRule('.toast-container', 'position: fixed;z-index: 9999;top: 40%;width: 100%;-webkit-transition: opacity .8s;transition: opacity .8s;opacity: 0');
    addCssRule('.toast-container.toast-active', 'opacity: 1;');
    addCssRule('.toast-message-container', 'font-size: 16px;width: 200px;margin: 4px auto;padding: 4px;text-align: center;color: #ffffff;border-radius: 4;background: rgba(0, 0, 0, 0.8);-webkit-box-shadow: 0 2px 8px #ccc;-moz-box-shadow: 0 2px 8px #ccc;box-shadow: 0 2px 8px #ccc;');

    function toast(msg) {
        var active = 'toast-active';
        var div = document.createElement("div");
        // div.classList.add("toast-container");
        div.className += ' toast-container';
        div.innerHTML = '<div class="toast-message-container">' + msg + "</div>";
        div.addEventListener("webkitTransitionEnd", function() {
            div.classList.contains(active) || div.parentNode.removeChild(div);
        });
        document.body.appendChild(div);
        div.offsetHeight;
        // div.classList.add(active);
        div.className += ' ' + active;
        setTimeout(function() {
            // div.classList.remove(active);
            div.className.replace(active, '');
            div.parentNode.removeChild(div);
        }, 2000);
    }
    window.showToast = toast;
})();
