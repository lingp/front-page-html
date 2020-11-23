
window.onload=function () {
    // 禁止所有默认触摸事件，ps:PC的谷歌浏览器不支持，但真机可以
    document.addEventListener('touchstart', function(e){
        e = e || event;
        e.preventDefault();
    })

    // rem适配
    ;(function () {
        let styleNode = document.createElement("style");
        console.log("w");
        let w = document.documentElement.clientWidth/16;
        console.log(w);
        styleNode.innerHTML = "html{font-size:" + w + "px!important}";
        document.head.append(styleNode)
    })()
};