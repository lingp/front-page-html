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

    w.component.carousel = 	function (arr){
        //布局
        var carouselWrap = document.querySelector(".carousel-wrap");
        if(carouselWrap){
            var pointslength = arr.length;

            //无缝
            var needCarousel = carouselWrap.getAttribute("needCarousel");
            needCarousel = needCarousel == null?false:true;
            if(needCarousel){
                arr=arr.concat(arr);
            }


            var ulNode = document.createElement("ul");
            var styleNode = document.createElement("style");
            ulNode.classList.add("list");
            for(var i=0;i<arr.length;i++){
                ulNode.innerHTML+='<li><a href="javascript:;"><img src="'+arr[i]+'"/></a></li>';
            }
            styleNode.innerHTML=".carousel-wrap > .list > li{width: "+(1/arr.length*100)+"%;}.carousel-wrap > .list{width: "+arr.length+"00%}";
            carouselWrap.appendChild(ulNode);
            document.head.appendChild(styleNode);

            var imgNodes = document.querySelector(".carousel-wrap > .list > li > a >img");
            setTimeout(function(){
                carouselWrap.style.height=imgNodes.offsetHeight+"px";
            },100)

            var pointsWrap = document.querySelector(".carousel-wrap > .points-wrap");
            if(pointsWrap){
                for(var i=0;i<pointslength;i++){
                    if(i==0){
                        pointsWrap.innerHTML+='<span class="active"></span>';
                    }else{
                        pointsWrap.innerHTML+='<span></span>';
                    }
                }
                var pointsSpan = document.querySelectorAll(".carousel-wrap > .points-wrap > span");
            }



            /*滑屏
             * 	1.拿到元素一开始的位置
             * 	2.拿到手指一开始点击的位置
             * 	3.拿到手指move的实时距离
             * 	4.将手指移动的距离加给元素
             * */
            /*
             * 防抖动
             *
             * 1.判断用户首次滑屏的方向
             * 2.如果是x轴
             * 		以后不管用户怎么滑都会抖动
             * 3.如果是y轴
             * 		以后不管用户怎么滑都不会抖动
             * */
            var index =0;
            //手指一开始的位置
            var startX = 0;
            var startY = 0;
            //元素一开始的位置
            var elementX = 0;
            var elementY = 0;
            //var translateX =0;

            //首次滑屏的方向
            var isX = true;
            var isFirst = true;

            carouselWrap.addEventListener("touchstart",function(ev){
                ev=ev||event;
                var TouchC = ev.changedTouches[0];
                ulNode.style.transition="none";

                //无缝
                if(needCarousel){
                    var index = component.toTransform(ulNode,"translateX")/document.documentElement.clientWidth;
                    if(-index === 0){
                        index = -pointslength;
                    }else if(-index ==(arr.length-1)){
                        index = -(pointslength-1)
                    }
                    component.toTransform(ulNode,"translateX",index*document.documentElement.clientWidth)
                }

                startX=TouchC.clientX;
                startY=TouchC.clientY;
                elementX=component.toTransform(ulNode,"translateX");
                elementY=component.toTransform(ulNode,"translateY");

                //清楚定时器
                clearInterval(timer);

                isX = true;
                isFirst = true;
            })
            carouselWrap.addEventListener("touchmove",function(ev){
                //看门狗  二次以后的防抖动
                if(!isX){
                    //咬住
                    return;
                }
                ev=ev||event;
                var TouchC = ev.changedTouches[0];
                var nowX = TouchC.clientX;
                var nowY = TouchC.clientY;
                var disX = nowX - startX;
                var disY = nowY - startY;

                //首次判断用户的华东方向
                if(isFirst){
                    isFirst = false;
                    //判断用户的滑动方向
                    //x ---> 放行
                    //y ---> 首次狠狠的咬住，并且告诉兄弟 下次也给我咬住
                    if(Math.abs(disY)>Math.abs(disX)){
                        //y轴上滑
                        isX = false;
                        //首次防抖动
                        return;
                    }
                }

                component.toTransform(ulNode,"translateX",elementX+disX);
            })
            carouselWrap.addEventListener("touchend",function(ev){
                ev=ev||event;
                index = component.toTransform(ulNode,"translateX")/document.documentElement.clientWidth;
                index = Math.round(index);

                if(index>0){
                    index=0;
                }else if(index<1-arr.length){
                    index=1-arr.length;
                }

                xiaoyuandian(index);

                ulNode.style.transition=".5s transform";
                component.toTransform(ulNode,"translateX",index*(document.documentElement.clientWidth));

                if(needAuto){
                    auto();
                }
            })

            //自动轮播
            var timer =0;
            var needAuto = carouselWrap.getAttribute("needAuto");
            needAuto = needAuto == null?false:true;
            if(needAuto){
                auto();
            }
            function auto(){
                clearInterval(timer);
                timer=setInterval(function(){
                    if(index == 1-arr.length){
                        ulNode.style.transition="none";
                        index = 1-arr.length/2;
                        component.toTransform(ulNode,"translateX",index*document.documentElement.clientWidth);
                    }

                    setTimeout(function(){
                        console.log(index)
                        index--;
                        ulNode.style.transition="1s transform";
                        xiaoyuandian(index);
                        component.toTransform(ulNode,"translateX",index*document.documentElement.clientWidth);
                    },50)
                },2000)
            }

            function xiaoyuandian(index){
                if(!pointsWrap){
                    return;
                }
                for(var i=0;i<pointsSpan.length;i++){
                    pointsSpan[i].classList.remove("active");
                }
                pointsSpan[-index%pointslength].classList.add("active");
            }
        }
    }


})(window);