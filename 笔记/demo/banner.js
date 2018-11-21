function banner(obj){
    this.box = obj.box;
    this.time = obj.time || 1000;
    this.top = obj.top || 0;
    this.left = obj.left || 0;
    this.transtionTime = obj.transtionTime || 500;
    this.itemClick = obj.itemClick || function(){};
    this.itemOver = obj.itemOver || function(){};
    this.itemOut = obj.itemOut || function(){};
    this.intervalTime = undefined;
    this.moveInterval = undefined;
    // this.changeHeight = undefined;
}
banner.prototype = Object.assign(banner.prototype,{
    init: function(){
       
    },
    start: function(){
        var that = this;
        clearInterval(this.intervalTime)
        this.intervalTime = undefined;
        this.intervalTime = setInterval(function(){
            var top = -that.box.firstElementChild.offsetHeight;
            that.move({
                top: top,
                left: 0,
            },function(){
                that.box.appendChild(that.box.firstElementChild);
                that.setStyle({
                    top: 0,
                })
            })
        },this.time);
        this.bindEvent();
    },
    setStyle: function(obj){
        for(var i in obj)
        {
            this.box.style[i]=obj[i];
        }
    },
    move: function(end,fn){
        var that = this;
        var moveLeft = end.left - this.left;
        var moveTop = end.top - this.top;
        var left = moveLeft / this.transtionTime * 10;
        var top = moveTop / this.transtionTime * 10;
        var currentLeft = this.left;
        var currentTop = this.top;
        this.moveInterval = setInterval(function(){
            if(( moveLeft >= 0 && currentLeft >= moveLeft && moveTop >= 0 && currentTop >= moveTop ) || ( moveLeft <= 0 && currentLeft <= moveLeft && moveTop <= 0 && currentTop <= moveTop ) || ( moveLeft >= 0 && currentLeft >= moveLeft && moveTop <= 0 && currentTop <= moveTop ) || ( moveLeft <= 0 && currentLeft <= moveLeft && moveTop >= 0 && currentTop >= moveTop )){
                clearInterval(that.moveInterval);
                that.moveInterval = undefined;
                if(fn && typeof fn === 'function'){
                    fn();
                }
                return;
            }
            currentLeft += left;
            currentTop += top;
            that.setStyle({
                left: currentLeft + 'px',
                top: currentTop + 'px'
            })
        },10)
    },
    pause: function(){
        clearInterval(this.intervalTime);
        this.intervalTime = undefined;
        clearInterval(this.moveInterval);
        this.moveInterval = undefined;
        this.setStyle({
            top: this.top,
            left: this.left,
        })
    },
    play: function(){
        this.start();
    },
    stop: function(){
        this.pause();
    },
    bindEvent: function(){
        var that = this;
        var childs = this.box.childNodes;
        for(var i=0;i<childs.length;i++){
            if(childs[i] && childs[i].nodeType === 1){
                childs[i].onmouseover = that.itemOver;
                childs[i].onmouseout = that.itemOut;
                childs[i].onclick = that.itemClick;
            }
        }
        document.addEventListener('visibilitychange',function(){ //浏览器切换事件
            console.log('visibilitychange',document.visibilityState)
            if(document.visibilityState=='hidden') { //状态判断
                that.pause();
            }else {
                that.play();
            }
        });
    }
});

// 使用方式：
// new banner({
//     box: 轮播元素,
//     top: 初始位置的top值,
//     left: 初始位置的left值,
//     time: 动画时间,
//     transtionTime: 过度时间,
//     itemClick: 元素点击事件,
//     itemOver: 元素鼠标移入事件,
//     itemOut: 元素鼠标移出事件
// }).start()

// ***目前只支持播放,鼠标进入暂停，鼠标离开播放
// ***目前无分页器控制