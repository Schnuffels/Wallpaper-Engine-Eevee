// 用户配置
var user_param = {
    float_num : 15,
    float_size : 70,
    float_width: 800,
    float_height: 800,
    float_img : 'img/float_element.png',
    speed : 10,
    fps : 60,
    switch : true,
};


var float_anim_stop = false;
// 启动动画并指定参数
function startAnimating(fps, callback) {
    let fpsInterval = 1000 / fps;
    let then = Date.now();
    let startTime = then;
    animate(callback, fpsInterval, then, startTime);
}

// 动画以指定帧数播放
function animate(callback, fpsInterval, then, startTime) {
    // request another frame
    if(!float_anim_stop){
        requestAnimationFrame(function(){
            animate(callback, fpsInterval, then, startTime);
        });
    }
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        // Put your drawing code here
        if(callback){callback();}
    }
}

// 生成随机数
function generRandom(min, max, decimal = false, remove_zero = true) {
    min = min < 0 ? (min - 1) : min;
    let random =  decimal ? Math.floor((Math.random() * (max - min + 1) + min) * 100) / 100: parseInt(Math.random() * (max - min + 1) + min);
    if(!remove_zero)
        if(random == 0)
            return generRandom(min, max, remove_zero);
    return random;
}

// 首次加载
var floatInit = false;
// 获取画布对象
var canvas_float = document.getElementById('canvas_float');
// 获取2d的画笔对象
var ctx = canvas_float.getContext('2d');
// 放置多个浮动对象
var ballArr = [];
// 设置画布尺寸为浏览器的尺寸
canvas_float.width = document.documentElement.clientWidth;
canvas_float.height = document.documentElement.clientHeight;


let float_element = new Image();
float_element.src = user_param.float_img;


function Ball(float_size, speed){
    // 圆心点(x,y)半径 样式
    this.x = Math.random() * canvas_float.width;
    this.y = Math.random() * canvas_float.height;
    this.r = float_size > 500 ? 500 : (float_size < 10 ? 10 : float_size);

    //设置元素运动的方向和速度
    speed = speed / 10;
    speed = speed > 10 ? 10 : (speed < -10 ? -10 : speed);
    this.dx = generRandom(-speed, speed, true, false);   //-speed - speed之间随机数
    this.dy = generRandom(-speed, speed, true, false);   //-speed - speed之间随机数

    ballArr.push(this);
}
// 更新小球中心点的位置
Ball.prototype.update = function(){
    this.x += this.dx;
    this.y += this.dy;
    // 触碰到画布的左边缘 或 右边缘
    if(this.x < 0 || this.x > canvas_float.width){
        this.dx = -this.dx;
    }
    if(this.y < 0 || this.y > canvas_float.height){
        this.dy = -this.dy;
    }
}

// 绘制浮动元素
Ball.prototype.render = function(float_width, float_height){
    ctx.beginPath();
    ctx.drawImage(float_element, 0, 0, float_width, float_height, this.x, this.y, this.r, this.r);
}
