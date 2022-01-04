var userClockParam = {

};

// 获取画布对象
var canvas_clock = document.getElementById('canvas_clock');
// 获取 2d 的画笔对象
var ctx_clock = canvas_clock.getContext('2d');

function Clock(){
    let w = canvas_clock.width / 2;
    let h = canvas_clock.height / 2;
    ctx_clock.clearRect(0,0,canvas_clock.width,canvas_clock.height);
    ctx_clock.save();
    ctx_clock.translate(w, h);
    // 需要返回末端添加圆形线帽
    ctx_clock.lineCap = 'round';

    
    // 定义好时间
    var date = new Date();
    var hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    hour = hour >= 12 ? hour - 12 : hour;

    // 绘制表盘外圈
    ctx_clock.beginPath();    //开始一条新的路径
    ctx_clock.arc(0,0,100,0,360 * (Math.PI / 180, true));  //绘制外表盘
    ctx_clock.moveTo(0,0);                                //笔触位置移动回中心，再开始新的绘制
    ctx_clock.arc(0,0,5,0,360 * (Math.PI / 180, true));    //绘制中心点
    ctx_clock.lineWidth = 7;                              //线框
    ctx_clock.strokeStyle = '#c28648';    //颜色
    ctx_clock.stroke();   //描边

    // 绘制分钟的刻度
    // 360度  60度   60 * (Math.PI / 180) = Math.PI / 30
    ctx_clock.save();
    for(let k = 0; k < 60; k++){
        ctx_clock.beginPath();
        ctx_clock.rotate(Math.PI / 30);   //旋转
        ctx_clock.arc(80, 0, 3, 0, 360 * (Math.PI / 180));
        ctx_clock.fillStyle = 'orange';
        ctx_clock.fill();
    }
    ctx_clock.restore();

    //绘制12小时的刻度
    //旋转（一个小时对应的弧度为）
    // 360度 - 1个 30度 -> 1个 小时对应 30 * (Math.PI / 180) = Math.PI / 6
    ctx_clock.save();
    for(let i = 0; i < 12; i++){
        ctx_clock.beginPath();
        ctx_clock.rotate(Math.PI / 6);   //旋转
        ctx_clock.moveTo(75, 0);
        ctx_clock.lineTo(85, 0);
        ctx_clock.lineWidth = 6;
        ctx_clock.stroke();
        ctx_clock.closePath();
    }

    ctx_clock.restore();

    //绘制秒针
    ctx_clock.save();
    ctx_clock.lineWidth = 2;
    ctx_clock.beginPath();
    ctx_clock.rotate(sec * Math.PI / 30);
    ctx_clock.moveTo(0, 0);
    ctx_clock.lineTo(0,-70);
    ctx_clock.stroke();
    ctx_clock.restore();

    //分针
    ctx_clock.save();
    ctx_clock.lineWidth = 4;
    ctx_clock.beginPath();
    ctx_clock.rotate(min * Math.PI / 30);
    ctx_clock.moveTo(0, 0);
    ctx_clock.lineTo(0,-50);
    ctx_clock.stroke();
    ctx_clock.restore();

    //时针
    ctx_clock.save();
    ctx_clock.lineWidth = 6;
    ctx_clock.beginPath();
    ctx_clock.rotate(hour * Math.PI / 6 + min * (Math.PI / 360) + sec * Math.PI / 21600);
    // 1个小时对应的弧度： Math.PI / 6
    // 60分钟是一个小时：Math.PI / 6
    // 1分钟就显示一个小时： Math.PI / (6*60)
    // min * (Math.PI / 360)
    // 秒针对应时针弧度：
    // 1秒钟对应时针所走的弧度：Math.PI / (6*60*60)
    ctx_clock.moveTo(0, 0);
    ctx_clock.lineTo(0,-35);
    ctx_clock.stroke();
    ctx_clock.restore();

    ctx_clock.restore();      //对画布位移之前的状态进行恢复
    requestAnimationFrame(Clock);

}
// Clock();

requestAnimationFrame(Clock);