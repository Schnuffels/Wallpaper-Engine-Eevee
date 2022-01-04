/**
 * 压缩分割 1
 */
var currentScene = 'line';
var btnClickLock = false;
var eeveeSwitchLock = false;
var wallpaperEeventListenerInit = false;
var toast = document.getElementById('toast');
var danceImg = document.getElementById('dance');
var dance2Img = document.getElementById('dance2');
var btn_scene = document.getElementsByClassName('btn_scene')[0];
var btn_line = document.getElementsByClassName('btn_line')[0];
var stageDom = document.getElementsByClassName('stage')[0];
var stageLights3ArrDom = document.getElementsByClassName('stage_lights3');

// 外部扩展库扫描
var extend_bg_init = false;
var extend_mp3_init = false;
var extend_panel = document.getElementById('extend_panel');
var extend_close = document.getElementsByClassName('extend_close')[0];
var extend_bg_box = document.getElementsByClassName('extend_bg')[0];
var extend_mp3_box = document.getElementsByClassName('extend_mp3')[0];
var extend_bg = [];
var extend_mp3 = [];
var extend_bg_play_list = [];
var extend_mp3_play_list = [];

/**
 * 压缩分割 2
 */

// 关闭扩展库确认窗口
extend_close.addEventListener('click', function(){
    extend_panel.style.display = 'none';
    localStorage.setItem('cue', 1);
});

// 按钮：场景
btn_scene.addEventListener('click', function(){
    if(!btnClickLock){
        if(sceneList.length <= 0){
            toastMsg('当前场景库无场景');
            return;
        }
        scene.render();
        switchScene('scene');
        clearInterval(startSceneTimer);
        clearInterval(closeSceneTimer);
        //自动触发场景
        if(userMediaParam.autoScene){
            closeSceneTimer = closeSceneFun();
        }
    } else {
        toastMsg('操作失败，按键处于冷却状态');
    }
});

// 按钮：线条
btn_line.addEventListener('click', function(){
    if(!btnClickLock){
        switchScene('line');
    } else {
        toastMsg('操作失败，按键处于冷却状态');
    }
});

/**
 * 压缩分割 3
 */

// 长时间未完成壁纸库初始化
setTimeout(() => {
    if(!wallpaperEeventListenerInit){
        // 默认场景壁纸与音效加载
        defaultWallpaper();
        // 执行场景定时器
        startSceneTimer = startSceneFun();
        toastMsg('长时间未完成初始化，已切换回内部壁纸库', 3000);
    }
}, 10000);

// 显示按钮
defaultShowBtn();

// 默认显示按钮
function defaultShowBtn(){
    btn_line.classList.add('btn_line_click');
    setTimeout(() => {
        btn_line.classList.add('active');
        btn_line.classList.remove('btn_line_click');
    }, 2000);
}

//切换场景
function switchScene(type, callback = null){
    btnClickLock = true;    //锁定按钮
    setTimeout(() => { btnClickLock = false; }, 2000);  //2秒后解锁
    switch(type){
        case 'scene':
            btn_scene.classList.add('active');
            btn_line.classList.remove('active');
            btn_line.classList.remove('btn_line_click');
            setTimeout(() => {
                danceCcene.classList.remove('fadeOut');
                danceCcene.classList.add('fadeIn');
                mediaPlayer.play();
            }, 1000);
            danceImg.classList.add('imgFadeOut');
            danceImg.classList.remove('imgFadeIn');
            dance2Img.classList.add('imgFadeIn');
            dance2Img.classList.remove('imgFadeOut');
            canvas_clock.style.display = 'none';
            currentScene = 'scene';
            break;
        case 'line':
            btn_line.classList.add('active');
            btn_scene.classList.remove('active');
            btn_scene.classList.remove('btn_scene_click');
            setTimeout(() => {
                danceImg.classList.add('imgFadeIn');
                danceImg.classList.remove('imgFadeOut');
                dance2Img.classList.add('imgFadeOut');
                dance2Img.classList.remove('imgFadeIn');
                mediaPlayer.pause();
            }, 2000);
            danceCcene.classList.add('fadeOut');
            danceCcene.classList.remove('fadeIn');
            canvas_clock.style.display = 'block';
            currentScene = 'line';
            break;
    }
    if(callback){callback();}
}

// 打开跳舞的伊布
function openDancer(type){
    switch(type){
        case 'scene':
            danceCcene.classList.add('fadeOut');
            danceCcene.classList.remove('fadeIn');
            setTimeout(() => {
                danceImg.style.display = 'block';
                dance2Img.style.display = 'block';
            }, 1000);
            setTimeout(() => {
                danceCcene.classList.add('fadeIn');
                danceCcene.classList.remove('fadeOut');
            }, 2000);
            break;
        case 'line':
            danceImg.style.display = 'block';
            dance2Img.style.display = 'block';
            danceCcene.classList.remove('fadeOut');
            danceCcene.classList.remove('fadeIn');
            break;
    }
}

// 关闭跳舞伊布
function closeDancer(){
    danceImg.style.display = 'none';
    dance2Img.style.display = 'none';
}

// 弹窗提示
function toastMsg(msg, timer = 1000){
    toast.innerHTML = msg;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
        toast.innerHTML = '';
    }, timer);
}

// 提取路径中的文件名
function extractFilenameInPath(src, type){
    let file_name_arr = src.split("/");
    let file_name = file_name_arr[file_name_arr.length-1];
    let upper_path = file_name_arr[file_name_arr.length-2];
    let ext_arr = file_name.split(".");
    let name = '';
    let ext = '';
    if(ext_arr.length > 2){
        for(let i = 0; i < ext_arr.length - 1; i++){
            name += ext_arr[i] + '.';
        }
        
        name = name.substr(0, name.length-1);
        ext = ext_arr[ext_arr.length - 1];
    } else {
        name = ext_arr[0];
        ext = ext_arr[1];
    }

    switch(type){
        case 'upper_path':
            return upper_path;
            break;
        case 'upper_path_complete':
            return upper_path + ' / ' + name + '.' + ext;
            break;
        case 'complete':
            return name + '.' + ext;
            break;
        case 'name':
            return name;
            break;
        case 'ext':
            return ext;
            break;
    }
    return '';
}

// 默认壁纸库
function defaultWallpaper(index = null, data = null){
    let wallpaper_data = [
        {'img' : 'img/bg1.jpg', 'audio' : 'mp3/bg1.mp3'},
        {'img' : 'img/bg2.jpg', 'audio' : 'mp3/bg2.mp3'},
    ];

    if(index != null && data != null && index != '' && data != ''){
        wallpaper_data[index] = data;
    }

    scene.clear();

    for(let i = 0; i < wallpaper_data.length; i++){
        scene.add(wallpaper_data[i].img, wallpaper_data[i].audio);
    }
}

/**
 * 压缩分割 4
 */

// 舞台特效
var stageTimer;
var startStageCount = 0;
function stageEffects(){
    stageDom.style.display = 'block';
    stageTimer = setInterval(() => {
        if(startStageCount < 6){
            for(let i = 0; i < stageLights3ArrDom.length; i++){
                if(stageLights3ArrDom[i].style.display == 'none'){
                    stageLights3ArrDom[i].style.display = 'block'
                } else {
                    stageLights3ArrDom[i].style.display = 'none';
                }
            }
            startStageCount++;
        } else {
            
            for(let i = 0; i < stageLights3ArrDom.length; i++){
                stageLights3ArrDom[i].style.display = 'block';
            }
            clearInterval(stageTimer);

            setTimeout(() => {
                for(let i = 0; i < stageLights3ArrDom.length; i++){
                    stageLights3ArrDom[i].style.display = 'block';
                }
                stageDom.style.display = 'none';
                startStageCount = 0;
            }, 1000);
        }
    }, 100);
}

/**
 * 压缩分割 5
 */

//监听是否启动浮动元素
window.wallpaperPropertyListener = {
    userDirectoryFilesAddedOrChanged: function(propertyName, changedFiles) {

        if(propertyName == 'media_extend_bg'){
            // 扫描
            extend_bg = changedFiles;


            // 初始化
            if(extend_bg_init){
                return;
            }

            // 弹框提示
            if(localStorage.getItem('cue') != '1'){
                extend_panel.style.display = 'block';
                extend_bg_box.innerHTML = '';
            }

            for(let i = 0; i < extend_bg.length; i++){
                //处理 壁纸 列表
                let bg_li = document.createElement('li')
                bg_li.innerText = extractFilenameInPath(extend_bg[i], 'upper_path_complete');

                //格式限制
                let ext = extractFilenameInPath(extend_bg[i], 'ext');
                if(ext == 'jpeg' || ext == 'jpg' || ext == 'gif'){
                    extend_bg_box.appendChild(bg_li);
                    // 只提取壁纸
                    extend_bg_play_list.push(extend_bg[i]);
                }
            }

            extend_bg_init = true;
        }
    
        if(propertyName == 'media_extend_mp3'){
            
            // 扫描
            extend_mp3 = changedFiles;

            // 初始化
            if(extend_mp3_init){
                return;
            }

            // 弹框提示
            if(localStorage.getItem('cue') != '1'){
                extend_panel.style.display = 'block';
                extend_mp3_box.innerHTML = '';
            }

            for(let i = 0; i < extend_mp3.length; i++){
                //处理 壁纸 列表
                let mp3_li = document.createElement('li')
                mp3_li.innerText = extractFilenameInPath(extend_mp3[i], 'upper_path_complete') + '→ MP3';

                //格式限制
                let ext = extractFilenameInPath(extend_mp3[i], 'ext');
                if(ext == 'png'){
                    extend_mp3_box.appendChild(mp3_li);
                    // 只提取音频
                    extend_mp3_play_list.push(extend_mp3[i]);
                }
            }

            extend_mp3_init = true;
        }
    },
    userDirectoryFilesRemoved: function(propertyName, removedFiles) {
        localStorage.setItem('cue', 0);
    },
    applyUserProperties: function(properties) {
        //主题颜色
        if(properties.schemecolor){
            let themeColor = properties.schemecolor.value.split(' ');
            themeColor = themeColor.map(function(c) {
                return Math.ceil(c * 255);
            });
            let themeColorAsCSS = 'rgb(' + themeColor + ')';

            //删除旧样式
            let oldStyle = document.getElementsByTagName('style')[0];
            oldStyle.remove();
            //追加样式
            let head = document.getElementsByTagName('head')[0];
            let styleNode = document.createElement('style');
            styleNode.innerHTML = `
                .btn_box { border: 5px solid ${themeColorAsCSS}; }
                .btn_box button.active { background-color: ${themeColorAsCSS}; }
            `;
            head.appendChild(styleNode);
        }

        // 背景图像扩展
        if (properties.media_extend_bg) {
            if (properties.media_extend_bg.value == null || properties.media_extend_bg.value == ''){
                // 默认场景壁纸与音效加载
                defaultWallpaper();
            } else {
                let extend_bg_src = 'file:\/\/\/' + properties.media_extend_bg.value;
                let extend_bg_mp3 = 'file:\/\/\/' + properties.media_extend_mp3.value;
                setTimeout(() => {
                    for(let i = 0; i < extend_bg_play_list.length; i++){
                        let bg_name = extractFilenameInPath(extend_bg_play_list[i], 'name');
                        let bg_ext = extractFilenameInPath(extend_bg_play_list[i], 'ext');
                        //执行音频
                        let mp3_name = '';
                        let mp3_ext = '';
                        if(i < extend_mp3_play_list.length){
                            mp3_name = extractFilenameInPath(extend_mp3_play_list[i], 'name');
                            mp3_ext = extractFilenameInPath(extend_mp3_play_list[i], 'ext');
                        }
                        scene.add(extend_bg_src + '/' + bg_name + '.' + bg_ext, extend_bg_mp3 + '/' + mp3_name + '.' + mp3_ext);
                    }
                }, 1000);
                localStorage.setItem('cue', 0);
            }
        }
        // 自动触发场景
        if (properties.scene_auto) {
            userMediaParam.autoScene = properties.scene_auto.value;
            if(userMediaParam.autoScene){
                // 执行场景定时器
                startSceneTimer = startSceneFun();
                toastMsg('已启用自动场景');
            } else {
                clearInterval(startSceneTimer);
                toastMsg('已关闭自动场景');
            }
        }

        // 跳舞的伊布
        if (properties.dance_eevee) {
            userMediaParam.dance_eevee = properties.dance_eevee.value;
            if(userMediaParam.dance_eevee){
                if(eeveeSwitchLock) {
                    toastMsg('操作失败，按键处于冷却状态');
                    return;
                }
                eeveeSwitchLock = true;    //锁定按钮
                setTimeout(() => { eeveeSwitchLock = false; }, 3000);  //3秒后解锁
                currentScene == 'scene' ? openDancer('scene') : openDancer('line');
                toastMsg('已开启跳舞的伊布');
            } else {
                closeDancer();
                toastMsg('已关闭跳舞的伊布');
            }
        }
        // 音量调节
        if (properties.media_volume) {
            audio.volume = properties.media_volume.value / 100;
        }
        // 间歇时间
        if (properties.media_intermission_time) {
            userMediaParam.startSceneCountDown = properties.media_intermission_time.value;
            toastMsg('已设置场景间歇时间：' + userMediaParam.startSceneCountDown, 2000);
            if(userMediaParam.startSceneCountDown < 5){
                userMediaParam.startSceneCountDown = 5;
                toastMsg('间歇时间不得小于5');
            }
        }
        // 启用浮动元素
        if (properties.float_switch) {
            //绘制浮动元素
            if(properties.float_switch.value){
                toastMsg('已启用浮动元素');
                setTimeout(() => {
                    // 结束上一次的监听，阻止继续回调
                    float_anim_stop = false;

                    //生成浮动元素
                    var float_num = user_param.float_num > 100 ? 100 : user_param.float_num;
                    for(let i = 0; i < float_num; i++){
                        var p1 = new Ball(user_param.float_size, user_param.speed);
                    }

                    //启动动画
                    startAnimating(user_param.fps, function(){
                        ctx.clearRect(0, 0, canvas_float.width, canvas_float.height);
                        for(let j = 0; j < ballArr.length; j++){
                            ballArr[j].update();
                            ballArr[j].render(user_param.float_width, user_param.float_height);
                        }
                    });

                    // 初始化完成
                    floatInit = true;
                }, 1000);
            } else{
                toastMsg('已关闭浮动元素');
                // 1.清除屏幕
                ctx.clearRect(0, 0, canvas_float.width, canvas_float.height);
                // 2.清空对象
                ballArr = [];
                // 3.结束自我回调
                float_anim_stop = true;
            }
        }

        // Text
        if (properties.float_num) {
            user_param.float_num = properties.float_num.value;
            toastMsg('浮动元素个数：' + user_param.float_num + '，重新开启生效', 2000);
        }

        if (properties.float_size) {
            user_param.float_size = properties.float_size.value;
            toastMsg('浮动元素大小：' + user_param.float_size + '，重新开启生效', 2000);
        }

        if (properties.float_img_width) {
            user_param.float_width = properties.float_img_width.value;
        }

        if (properties.float_img_height) {
            user_param.float_height = properties.float_img_height.value;
        }

        if (properties.float_speed) {
            user_param.speed = properties.float_speed.value;
            toastMsg('浮动元素速度：' + user_param.speed + '，重新开启生效', 2000);
        }

        if (properties.float_fps) {
            user_param.fps = properties.float_fps.value;
            toastMsg('浮动元素帧数：' + user_param.fps + '，重新开启生效', 2000);
        }

        if (properties.float_element_img) {
            if (properties.float_element_img.value != null && properties.float_element_img.value != ''){
                user_param.float_img = 'file:\/\/\/' + properties.float_element_img.value;
            }
        }

        if(!wallpaperEeventListenerInit){
            if (properties.media_extend_bg) {
                if (properties.media_extend_bg.value == null || properties.media_extend_bg.value == ''){
                    toastMsg('壁纸准备中，本次使用内部壁纸', 3000);
                } else {
                    toastMsg('壁纸准备中，本次使用自定义壁纸', 3000);
                }
            }
            wallpaperEeventListenerInit = true;
        }
    },
};