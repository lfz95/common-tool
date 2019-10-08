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
    addCssRule('.toast-message-container', 'font-size: 0.4rem;width: 4.5333rem;margin: 0.1333rem auto;padding: 0.1333rem;text-align: center;color: #ffffff;border-radius: 0.1867rem;background: rgba(0, 0, 0, 0.8);-webkit-box-shadow: 0 0.0533rem 0.2133rem #ccc;-moz-box-shadow: 0 0.0533rem 0.2133rem #ccc;box-shadow: 0 0.0533rem 0.2133rem #ccc;');

    function toast(msg) {
        var active = "toast-active";
        var div = document.createElement("div");
        div.classList.add("toast-container");
        div.innerHTML = '<div class="toast-message-container">' + msg + "</div>";
        div.addEventListener("webkitTransitionEnd", function() {
            div.classList.contains(active) || div.parentNode.removeChild(div);
        });
        document.body.appendChild(div);
        div.offsetHeight;
        div.classList.add(active);
        setTimeout(function() {
            div.classList.remove(active);
        }, 2000);
    }
    window.showToast = toast;
})()
