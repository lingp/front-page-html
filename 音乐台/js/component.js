+(function (w) {
    w.component = {};
    /**
     * 设置节点transform，用于位置变换
     * @param node
     * @param type
     * @param val
     * @returns {number}
     */
    w.component.toTransform = function(node, type, val) {
        if (typeof node == 'object' && typeof node['transform'] === 'undefined') {
            node['transform'] = {};
        }

        if (arguments.length === 3) {
            let tValue = '';
            node['transform'][type] = val;
            for (item in node['transform']) {
                if (node['transform'].hasOwnProperty(item)) {
                    switch (item) {
                        case "translateX":
                        case "translateY":
                            tValue +=  item+"("+node["transform"][item]+"px)";
                            break;
                        case "scale":
                            tValue +=  item+"("+node["transform"][item]+")";
                            break;
                        case "rotate":
                            tValue +=  item+"("+node["transform"][item]+"deg)";
                            break;
                    }
                }
            }
            node.style.transform = node.style.webkitTransform = tValue;
        } else if (arguments.length === 2) {
            //读取
            val =node["transform"][type];
            if(typeof val === "undefined"){
                switch (type){
                    case "translateX":
                    case "translateY":
                    case "rotate":
                        val =0;
                        break;
                    case "scale":
                        val =1;
                        break;
                }
            }
            return val;
        }
    }


})(window);