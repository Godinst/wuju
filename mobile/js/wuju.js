var myApp=new LightSNS({
tapHold:true,
scrollTopOnNavbarClick:true,//返回顶部
swipeBackPage:false,
cache:false,
// pushState:true,
sortable:true,
ajaxLinks:'a.link',
modalTitle:'',
modalButtonOk:'确定',
modalButtonCancel:'取消',
onAjaxStart: function (xhr) {
myApp.showIndicator();
},
onAjaxComplete: function (xhr) {
if(xhr.status!=200){
console.log('请求失败，请重新尝试！(1000009)');
// layer.open({
// content: '请求失败，请重新尝试！(1000009)',
// btn: '确定',
// shadeClose: false,
// yes: function(){
// layer.closeAll();
// }
// });	
}
myApp.hideIndicator();
}
});
// var $$=wuju;


//强制登录
if(wuju.login_on_off&&!wuju.is_login){
myApp.loginScreen();
myApp.addView('#wuju-view-sns-0',{dynamicNavbar:true,domCache:true});
}else{

mobile_tab=$.parseJSON(wuju.mobile_tab);//获取移动端开启的页面类型

if(mobile_tab){
for (var i = 0; i < mobile_tab.length; i++) {
mobile_tab_type=mobile_tab[i].wuju_mobile_tab_type;
if(mobile_tab_type!='publish'){
if(mobile_tab_type=='custom'){
if(mobile_tab[i].wuju_mobile_tab_custom_type!='link'){
myApp.addView('#wuju-view-custom-'+i,{dynamicNavbar:true,domCache:true});
}
}else{
myApp.addView('#wuju-view-'+mobile_tab_type+'-'+i,{dynamicNavbar:true,domCache:true});	
}
}
}//for
}//if

}

//通过外链打开首页tab
if(wuju_get_para('tab')!=''){
myApp.showTab('#'+wuju_get_para('tab'));
// window.history.pushState(null,null,'/');
}


if(wuju.is_login&&wuju.phone_on_off&&!wuju.is_phone){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php?author_id='+wuju.user_id});
}
if(wuju.is_login&&wuju.email_on_off&&!wuju.is_email){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-email.php?author_id='+wuju.user_id});
}


//判断页面属性
if(wuju.is_single){
//window.history.pushState(null,null,'/');
if(wuju.is_bbs_post){
function a(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/post-bbs.php?post_id='+wuju.post_id+'&bbs_id='+wuju.bbs_id+'&url='+wuju.post_url+'&type=bbs'});
}setTimeout(a,500);   
}else if(wuju.wp_post_type=='goods'){
function b(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/post-goods.php?post_id='+wuju.post_id+'&url='+wuju.post_url+'&rand='+Math.random().toString(36).substr(2,5)});
}setTimeout(b,500);
}else if(wuju.post_type=='music'||wuju.post_type=='video'||wuju.post_type=='single'||wuju.post_type=='redbag'||wuju.post_type=='secret'){
function c(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/post-'+wuju.post_type+'.php?post_id='+wuju.post_id+'&url='+wuju.post_url});
}setTimeout(c,500);
}else{
function d(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/post-words.php?post_id='+wuju.post_id+'&url='+wuju.post_url});
}setTimeout(d,500);
}
}

if(wuju.is_page){
search_para=wuju_get_para('search');
window.history.pushState(null,null,'/');
function e(){
if(wuju.page_template=='page/select.php'){//筛选
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/post-page.php?post_id='+wuju.post_id+'&page_template='+wuju.page_template+'&url='+wuju.post_url+'&search='+search_para});
}else{
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/post-page.php?post_id='+wuju.post_id+'&page_template='+wuju.page_template+'&url='+wuju.post_url});
}	
}setTimeout(e,500);	
}

if(wuju.is_author){
window.history.pushState(null,null,'/');
if(wuju.user_id==wuju.author_id){
function f(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/member-mine.php?author_id='+wuju.author_id+'&url='+wuju.author_url});
}setTimeout(f,500);
}else{
function g(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/member-other.php?author_id='+wuju.author_id+'&url='+wuju.author_url});
}setTimeout(g,500);    
} 
}

if(wuju.is_category){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/bbs.php?bbs_id='+wuju.bbs_id+'&url='+wuju.bbs_url});
}

if(wuju.is_tag){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/topic.php?topic_id='+wuju.topic_id+'&url='+wuju.topic_url});
}

if(wuju.is_search){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/search.php?search_keywords='+wuju.search_keywords});
}

if(wuju.is_category_shop){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/shop/tax.php?term_id='+wuju.shop_term_id+'&name='+wuju.shop_term_name+'&url='+wuju.shop_term_url});
}












//音乐播放器
player = document.querySelector('#wuju-music-player');
progressBar = document.querySelector('.wuju-player-progress .progress-bar'); // 进度条外层div
progress = document.querySelector('.wuju-player-progress .progress');  // 进度条长度
progressBtn = document.querySelector('.wuju-player-progress .progress-btn'); // 进度条拖动按钮
recordPic = document.querySelector('.record-pic');


$('.wuju-player-record .record-bg').click(function() {
$('.wuju-player-record').fadeOut(100);
});
$('.wuju-player-lyrics').click(function() {
$('.wuju-player-record').fadeIn(100);
});



//播放音乐
$('.wuju-player-footer-btn .play').click(function() {
post_id=$(this).attr('post_id');
if(player.paused){
$('.wuju-player-footer-btn .play i').removeClass('wuju-bofang-').addClass('wuju-zanting1');
$('.wuju-music-voice-'+post_id).html('<i class="wuju-icon wuju-yuyin1 tiping"> </i> 播放中...');
$('.wuju-pop-music-player').show();
player.play();
}else{
$('.wuju-player-footer-btn .play i').removeClass('wuju-zanting1').addClass('wuju-bofang-');
$('.wuju-music-voice-'+post_id).html('<i class="wuju-icon wuju-yuyin1"> </i> 点击播放');
$('.wuju-music-voice.custom').html('<i class="wuju-icon wuju-yuyin1"> </i> 点击播放');
$('.wuju-pop-music-player').hide();
player.pause();
}
});

//打开评论页面
$('.wuju-player-footer-btn .comment').click(function() {
play_post_id=$('.wuju-player-footer-btn .play').attr('post_id');
if(play_post_id){
myApp.closeModal('.wuju-music-player');
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/comment-music-page.php?post_id='+play_post_id});	
}
});


var isLoading = false;
var progressTimer = setInterval(activeProgressBar,300);

// 激活进度条
function activeProgressBar(){
var percentNum = Math.floor((player.currentTime / player.duration) * 10000) / 100 + '%';
progress.style.width = percentNum;
progressBtn.style.left = percentNum;
if (percentNum == '100%') {
// isLoading = true;
player.play();
// wuju_play_music();
}
if (player.paused && recordPic.className != 'record-pic'){
recordPic.className = 'record-pic';
return;
}else if (recordPic.className != 'record-pic rotate' && !player.paused) {
recordPic.className = 'record-pic rotate';
}

}

// 进度条操作音乐播放进度，绑定事件
progressBtn.addEventListener('touchstart', function () {
clearInterval(progressTimer);
});
progressBtn.addEventListener('touchmove', function (e) {
var percentNum = (e.targetTouches[0].pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
if (percentNum > 1) {
percentNum = 1;
} else if (percentNum < 0) {
percentNum = 0;
}
this.style.left = percentNum * 100 + '%';
progress.style.width = percentNum * 100 + '%';
});
progressBtn.addEventListener('touchend', function (e) {
var percentNum = (e.changedTouches[0].pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
player.currentTime = player.duration * percentNum;
progressTimer = setInterval(activeProgressBar, 300);
});


function wuju_play_music(post_id,obj){
$('.wuju-player-footer-btn .like,.wuju-player-footer-btn .comment').show();
myApp.popup('.wuju-music-player');//打开播放器
play_post_id=$('.wuju-player-footer-btn .play').attr('post_id');//播放中的文章id
if(play_post_id==post_id&&!player.paused){//需要点击播放的文章id和正在播放的文章id一致
first=0;	
}else{
first=1;//需要点击播放的文章id和正在播放的文章id不一致，可能第一次打开播放器，也可能是切换音乐
}

//所有情况都先把播放语音条设置为正在播放中
$('.wuju-music-voice-'+post_id).html('<i class="wuju-icon wuju-yuyin1 tiping"> </i> 播放中...');

if(first){//第一次打开播放器或者切换音乐
$('.wuju-player-record,.wuju-pop-music-player').show();//播放器界面重置为显示唱碟、右侧栏显示播放旋转小图标
player.play();player.pause();//兼容苹果无法自动播放

if(play_post_id&&player.paused&&play_post_id!=post_id){//切换别的音乐的时候
$('.wuju-music-voice-'+play_post_id).html('<i class="wuju-icon wuju-yuyin1"> </i> 点击播放');//如果切换别的音乐，先将之前的音乐对应的语音条重置
}

}


//每次打开播放器都要请求ajax  用于同步喜欢数量和评论数量
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/music.php",
data: {post_id:post_id},
success: function(msg){

if(msg.is_like){//更新喜欢
$('.wuju-player-footer-btn .like i').removeClass('wuju-xihuan2').addClass('wuju-xihuan1');	
}else{
$('.wuju-player-footer-btn .like i').removeClass('wuju-xihuan1').addClass('wuju-xihuan2');		
}
$('.wuju-player-footer-btn .comment m').html(msg.comment_number);//更新评论

if(first){//第一次打开播放器或者切换音乐
player.onplaying = null;  //  清除audio标签绑定的事件
player.src = msg.music_url;//同步音乐
player.play();//播放音乐
$('.wuju-player-footer-btn .play i').removeClass('wuju-bofang-').addClass('wuju-zanting1');//改变播放图标
$('.wuju-player-footer-btn .play').attr('post_id',post_id);//记录当前播放的文章id
$('.wuju-player-lyrics').html(msg.content);//载入当前音乐所对应的内容
if(msg.title){//存在标题则写入标题
$('.wuju-player-lyrics').prepend('<div class="title">'+msg.title+'</div>');	
}



}

}
});


}

//播放音乐===附件插入音乐
function wuju_play_music_custom(url,obj){
$('.wuju-player-footer-btn .like,.wuju-player-footer-btn .comment').hide();
post_id=Math.round(Math.random()*100);
if($(obj).children('i').hasClass('tiping')){
$(obj).html('<i class="wuju-icon wuju-yuyin1"> </i> 点击播放');	
$('.wuju-player-record,.wuju-pop-music-player').hide();
player.pause();
}else{
$('.wuju-music-voice.custom').html('<i class="wuju-icon wuju-yuyin1"> </i> 点击播放');
$(obj).html('<i class="wuju-icon wuju-yuyin1 tiping"> </i> 播放中...');	
player.onplaying = null;  //  清除audio标签绑定的事件
player.src = url;//同步音乐
player.play();//播放音乐
$('.wuju-player-footer-btn .play i').removeClass('wuju-bofang-').addClass('wuju-zanting1');//改变播放图标
$('.wuju-player-footer-btn .play').attr('post_id',post_id);//记录当前播放的文章id
$('.wuju-player-record,.wuju-pop-music-player').show();//播放器界面重置为显示唱碟、右侧栏显示播放旋转小图标
}

}



//路由


//手机返回监听
//var i=0
window.addEventListener("popstate", function(e){
// i++;
// console.log(i);
// e.defaultPrevented;
// console.log(e);

// if($('.modal-in').length>0){
// console.log(1);
layer.closeAll()//关闭半弹窗
myApp.closeModal();//关闭弹窗 
// history.forward();	
// history.go(1);
// }else{
// console.log(2);
$.fancybox.close();//关闭灯箱 
if($(' .fancybox-bg').length<=0){//不存在灯箱才返回
myApp.getCurrentView().router.back();
}	
// }


// return false;

}, false);

if(navigator.userAgent.indexOf("Html5Plus")<0){//非app环境
$("body").on("click",".back", function(e){
history.back();
// console.log(3);
});
}

//history.pushState(null, null, document.URL);


document.addEventListener('plusready',function(){//APP环境
var webview = plus.webview.currentWebview();
plus.key.addEventListener('backbutton', function() {
webview.canBack(function(e) {
if($('.modal-overlay-visible').length>0||$('.login-screen.modal-in').length>0){//如果有弹窗，先关闭弹窗
myApp.closeModal('.login-screen');
myApp.closeModal();//关闭弹窗 
$('.popup-overlay').removeClass('class name')
}else if($('.fancybox-is-open').length>0){
$.fancybox.close();
}else{
if (e.canBack) {
webview.back();
}else{
main =  plus.android.runtimeMainActivity();
main && main.moveTaskToBack(false);  //后台
}
}

})
});

});



