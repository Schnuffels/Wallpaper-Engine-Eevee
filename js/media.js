var userMediaParam = {
    startSceneCountDown : 20,
    autoScene : true,
    dance_eevee : true
};

// 媒体播放
var mediaPlayer = new Music();
// 场景管理器
var scene = new Scene();


// 播放音乐
var audio = document.getElementById('player');

function Music(){
    
}

Music.prototype.setMusic = function(src){
    audio.setAttribute('src', src);
    return this;
};

Music.prototype.play = function(){
    audio.play();
};

Music.prototype.pause = function(){
    audio.pause();
};

Music.prototype.getCurrentTime = function(){
    return audio.currentTime;
};

Music.prototype.getDuration = function(){
    return audio.duration;
};

// 场景播放器
var danceCcene = document.getElementById('dance_scene');
var sceneList = [];
var scenePlayOrder = 0;
function Scene(){

}

Scene.prototype.add = function(src, mp3){
    sceneList.push({
        img : src,
        mp3 : mp3
    });
};

Scene.prototype.clear = function(){
    sceneList = [];
};

Scene.prototype.render = function(){
    danceCcene.style = 'background: url(' + sceneList[scenePlayOrder].img + ') no-repeat center center; background-size: cover; opacity: 0;';
    audio.setAttribute('src', sceneList[scenePlayOrder].mp3);
    // 顺序播放场景壁纸
    if(sceneList.length > 1){
        if(scenePlayOrder < sceneList.length - 1){
            scenePlayOrder++;
        } else {
            scenePlayOrder = 0;
        }
    }
};


var activationStage = false;
var activationStage2 = false;
var startSceneCount = 0;
var startSceneTimer;
var closeSceneTimer;
// 启动定时器
function  startSceneFun(){
    return setInterval(() => {
        startSceneCount++;
        if(startSceneCount > userMediaParam.startSceneCountDown){
            clearInterval(startSceneTimer);
            if(sceneList.length <= 0){
                toastMsg('当前场景库无场景，自动播放失败');
            }
            scene.render();
            switchScene('scene');
            //自动触发场景
            if(userMediaParam.autoScene){
                closeSceneTimer = closeSceneFun();
                activationStage = false;
                activationStage2 = false;
            }
        }
    }, 1000);
}

// 停止定时器
function closeSceneFun(){
    return setInterval(()=>{
        let currentTime = parseInt(mediaPlayer.getCurrentTime());
        let duration = parseInt(mediaPlayer.getDuration());
        if(currentTime >= duration){
            clearInterval(closeSceneTimer);
            switchScene('line');
            startSceneCount = 0;
            //自动触发场景
            if(userMediaParam.autoScene){
                startSceneTimer = startSceneFun()
            }
        }
        // 1/2 与 2/3 时触发舞台灯光
        if(currentTime > parseInt(duration / 2) && !activationStage){
            if(userMediaParam.dance_eevee){
                stageEffects();
            }
            activationStage = true;
        }

        if(currentTime > parseInt(duration / 3 * 2) && !activationStage2){
            if(userMediaParam.dance_eevee){
                stageEffects();
            }
            activationStage2 = true;
        }
    },1000);
}