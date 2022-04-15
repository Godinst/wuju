

//---------------------------内容详情页面-----------------
myApp.onPageBeforeInit('post-single',function(page){
post_id=page.query['post_id'];
if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?p='+post_id+'#'+Math.random().toString(36).substr(2,5));	
}

if($('.wuju-video-playing').length>0){
current_post_id=$('.wuju-video-playing').attr('post_id');
window['video_'+current_post_id].pause();
}

wuju_lightbox();//灯箱

//音乐模块
play_post_id=$('.wuju-player-footer-btn .play').attr('post_id');
if(play_post_id==post_id&&!player.paused){//正在播放的文章id和点击查看的文章id是一致，并且播放器是在播放的状态
$('.wuju-music-voice-'+post_id).html('<i class="wuju-icon wuju-yuyin1 tiping"> </i> 播放中...');	
}

//加载更多评论
comment_loading = false;
comment_page = 2;
comment_list=$('.wuju-single-comment-list-'+post_id);
$('.wuju-page-single-content-'+post_id+'.infinite-scroll').on('infinite',function(){
if(comment_loading) return;
type=comment_list.attr('type');
bbs_id=comment_list.attr('bbs_id');
comment_loading = true;
comment_list.after(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/comment.php",
data: {page:comment_page,post_id:post_id,type:type,bbs_id:bbs_id},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
comment_loading = true; 
}else{
comment_list.append(msg);
comment_page++;
comment_loading = false;  
} 
wuju_lightbox();//灯箱
}
});
});


});




//---------------------------案例页面-----------------
myApp.onPageBeforeInit('case',function(page){
post_id=page.query['post_id'];
if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?p='+post_id+'#'+Math.random().toString(11).substr(5,8));	
}
$('.wuju-home-menu.case li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$(this).parents('.navbar').next().children('.page-on-center').find('ul').eq($(this).index()).show().siblings().hide();
});
});


//---------------------------动态评论-----------------
myApp.onPageAfterAnimation('comment-post',function(page){
post_id=page.query['post_id'];
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
name=page.query['name'];
//$('#wuju-comment-content-'+post_id).focus();
if(name!='undefined'){
$('#wuju-comment-content-'+post_id).val('@'+name+' ');
}

if($('#comment-1').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('comment-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_comment(post_id,res.ticket,res.randstr);}
});
}

$('.wuju-comment-content-main .smile').click(function(){
layer.open({
type: 1,
content: $(this).next().html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;height:65vw;border:none;'
});
});


document.querySelector('#file').addEventListener('change',function(){
var that = this;
var number=that.files.length;
var words_images_max=6;	

if(number>words_images_max||$('#wuju-publish-images-list li').length>=words_images_max){
layer.open({content:'最多只能上传'+words_images_max+'张图片！',skin:'msg',time:2});
return false;
}

a=0;//计时器
for(i = 0; i< number; i ++) {
$('.wuju-publish-words-form .add i').hide();//显示加载loading
$('.wuju-publish-words-form .add span').css('display','inline-block');//显示加载loading
info=that.files[i];
if(info.type!='image/gif'){
lrz(info)
.then(function (rst) {
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/words-base64.php",
data:{base64:rst.base64},
success: function(msg){
img_count=$('#wuju-publish-images-list li').length;//获取已经上传的图片数量
if(img_count>=words_images_max-1){//如果已经上传了9张
$('.wuju-publish-words-form .add').hide();//隐藏添加按钮
}
if(img_count<words_images_max){//如果上传的超过了9张就不载入容器
if(msg.code==1){
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.url+'" data-fancybox="gallery-publish"><img src="'+msg.url+'"></a></li>');
wuju_lightbox();//渲染灯箱
a++;

if(a==number){//如果照片已经上传完成就关闭
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画	
}

}
});
});

}else{//gif图片上传
if(info.size/(1024*1024)<wuju.mobile_gif_size_max){
var reader = new FileReader();
reader.onload = function (evt) {
image=evt.target.result;
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/words-base64.php",
data:{base64:image},
success: function(msg){
img_count=$('#wuju-publish-images-list li').length;//获取已经上传的图片数量
if(img_count>=words_images_max-1){//如果已经上传了9张
$('.wuju-publish-words-form .add').hide();//隐藏添加按钮
}
if(img_count<words_images_max){//如果上传的超过了9张就不载入容器
if(msg.code==1){
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.url+'" data-fancybox="gallery-publish"><img src="'+msg.url+'"></a></li>');
wuju_lightbox();//渲染灯箱
a++;

if(a==number){//如果照片已经上传完成就关闭
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画	
}

}
});


}
reader.readAsDataURL(info);
}else{
layer.open({content:'上传的动图不能超过'+wuju.mobile_gif_size_max+'MB！',skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}



}

}
});

//图片拖动排序
var el = document.getElementById('wuju-publish-images-list');
var sortable = Sortable.create(el);




});



//---------------------------帖子楼层页面-----------------
myApp.onPageBeforeInit('comment-bbs-floor-page',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------音乐评论列表页面-----------------
myApp.onPageBeforeInit('comment-list-music',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//--------------------------- 一级回帖-----------------
myApp.onPageAfterAnimation('comment-bbs-post',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
post_id=page.query['post_id'];
bbs_id=page.query['bbs_id'];

if($('#comment-2').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('comment-2'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_bbs_comment(post_id,bbs_id,res.ticket,res.randstr);}
});
}

$('.wuju-comment-content-main .smile').click(function(){
layer.open({
type: 1,
content: $(this).next().html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;height:65vw;border:none;'
});
});

document.querySelector('#file').addEventListener('change',function(){
var that = this;
var number=that.files.length;
var words_images_max=6;	

if(number>words_images_max||$('#wuju-publish-images-list li').length>=words_images_max){
layer.open({content:'最多只能上传'+words_images_max+'张图片！',skin:'msg',time:2});
return false;
}

a=0;//计时器
for(i = 0; i< number; i ++) {
$('.wuju-publish-words-form .add i').hide();//显示加载loading
$('.wuju-publish-words-form .add span').css('display','inline-block');//显示加载loading
info=that.files[i];
if(info.type!='image/gif'){
lrz(info)
.then(function (rst) {
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/words-base64.php",
data:{base64:rst.base64},
success: function(msg){
img_count=$('#wuju-publish-images-list li').length;//获取已经上传的图片数量
if(img_count>=words_images_max-1){//如果已经上传了9张
$('.wuju-publish-words-form .add').hide();//隐藏添加按钮
}
if(img_count<words_images_max){//如果上传的超过了9张就不载入容器
if(msg.code==1){
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.url+'" data-fancybox="gallery-publish"><img src="'+msg.url+'"></a></li>');
wuju_lightbox();//渲染灯箱
a++;

if(a==number){//如果照片已经上传完成就关闭
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画	
}

}
});
});

}else{//gif图片上传
if(info.size/(1024*1024)<wuju.mobile_gif_size_max){
var reader = new FileReader();
reader.onload = function (evt) {
image=evt.target.result;
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/words-base64.php",
data:{base64:image},
success: function(msg){
img_count=$('#wuju-publish-images-list li').length;//获取已经上传的图片数量
if(img_count>=words_images_max-1){//如果已经上传了9张
$('.wuju-publish-words-form .add').hide();//隐藏添加按钮
}
if(img_count<words_images_max){//如果上传的超过了9张就不载入容器
if(msg.code==1){
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.url+'" data-fancybox="gallery-publish"><img src="'+msg.url+'"></a></li>');
wuju_lightbox();//渲染灯箱
a++;

if(a==number){//如果照片已经上传完成就关闭
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画	
}

}
});


}
reader.readAsDataURL(info);
}else{
layer.open({content:'上传的动图不能超过'+wuju.mobile_gif_size_max+'MB！',skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}



}

}
});

//图片拖动排序
var el = document.getElementById('wuju-publish-images-list');
var sortable = Sortable.create(el);

});

//--------------------------- 二级回帖-----------------
myApp.onPageAfterAnimation('comment-bbs-post-floor',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
post_id=page.query['post_id'];
bbs_id=page.query['bbs_id'];
comment_id=page.query['comment_id'];
name=page.query['name'];
//$('#wuju-comment-content-'+post_id).focus();
if(name!='undefined'){
$('#wuju-comment-content-'+post_id).val('@'+name+' ');
}

if($('#comment-3').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('comment-3'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_bbs_comment_floor(comment_id,post_id,bbs_id,res.ticket,res.randstr);}
});
}

$('.wuju-comment-content-main .smile').click(function(){
layer.open({
type: 1,
content: $(this).next().html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;height:65vw;border:none;'
});
});

});

//---------------------------搜索页面-----------------
myApp.onPageBeforeInit('search-mobile',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
myApp.onPageBeforeInit('search-mobile',function(page){
search_keywords=page.query['search_keywords'];
if(search_keywords){
wuju_search(search_keywords);	
}

$('#wuju-search').focus();

$('#wuju-search-form').submit(function (event) {
//动作：阻止表单的默认行为
event.preventDefault();
value=$('#wuju-search').val();
wuju_search(value);
})






});
//---------------------------论坛大厅-----------------
myApp.onPageBeforeInit('bbs-show',function(page){

post_id=page.query['post_id'];
if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?p='+post_id+'#'+Math.random().toString(11).substr(5,8));	
}

$('#wuju-bbs-slider').owlCarousel({
items: 1,
margin:15,
autoplay:true,
autoplayTimeout:5000,
loop: true,
});

$('.wuju-bbs-tab-post-header>li').click(function(event){
$(this).addClass('on').siblings().removeClass('on').parent().next().children().eq($(this).index()).show().siblings().hide();
});
});

//---------------------------话题中心-----------------
myApp.onPageBeforeInit('topic-show',function(page){
post_id=page.query['post_id'];
if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?p='+post_id+'#'+Math.random().toString(36).substr(2,5));	
}

navbar_height=parseInt($('.navbar').height());
w_height=parseInt($(window).height());
$('.wuju-topic-show-form').height(w_height-navbar_height);
$('.wuju-topic-show-form .left>li').click(function(event){
$(this).addClass('on').siblings().removeClass('on').parent().next().children().eq($(this).index()).show().siblings().hide();
});
});

//--------------------------发表动态-----------------
myApp.onPageBeforeInit('publish',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});


//--------------------------赠送礼物-----------------
myApp.onPageBeforeInit('send-gift',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//--------------------------sns默认页面-----------------
myApp.onPageBeforeInit('sns',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));

//if(wuju.mobile_sns_slider){//首页幻灯片
$('#wuju-sns-slider').owlCarousel({
items: 1,
margin:15,
autoplay:true,
autoplayTimeout:5000,
loop: true,
});
//}

wuju_index_sns_js_load();

});


//--------------------------实时动态-----------------
myApp.onPageBeforeInit('now',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));

now_loading = false;
now_page=2;
now_list=$('.wuju-now-content .wuju-chat-user-list');
$('.wuju-now-content.infinite-scroll').on('infinite',function(){
if (now_loading) return;
now_loading = true;
now_list.append(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/now.php",
data: {page:now_page},
success: function(msg){
if(msg!=0){
now_list.append(msg);
now_loading = false; 
now_page++;
}else{
now_loading = true; 
}
$('.wuju-load-post').remove();
}
});
}); 


});

//--------------------------我的礼物-----------------
myApp.onPageBeforeInit('my-gift',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//--------------------------礼物记录-----------------
myApp.onPageBeforeInit('gift-note',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------附近的人-----------------
myApp.onPageBeforeInit('nearby-people',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------话题排行榜-----------------
myApp.onPageBeforeInit('topic-rank',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------打赏页面-----------------
myApp.onPageBeforeInit('reward',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------购买付费内容页面-----------------
myApp.onPageBeforeInit('post-buy',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------充值金币页面-----------------
myApp.onPageBeforeInit('recharge-credit',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
//---------------------------充值会员页面-----------------
myApp.onPageBeforeInit('recharge-vip',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------卡密兑换页面-----------------
myApp.onPageBeforeInit('key-recharge',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------提现-----------------
myApp.onPageBeforeInit('cash',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
$('.wuju-cash-form-content .type>m').click(function(){
$(this).addClass('on').siblings().removeClass('on');
if($(this).attr('type')=='alipay'){
$('.wuju-cash-form-content .alipay-phone').show();
$('.wuju-cash-form-content .wechat-phone').hide();
}else{
$('.wuju-cash-form-content .alipay-phone').hide();
$('.wuju-cash-form-content .wechat-phone').show();	
}
});
$("#wuju-cash-number").bind("input propertychange",function(){
number=Math.floor($(this).val()/page.query['ratio']);
$('.wuju-cash-form-content .number n').text(number+'元');
});
});

//---------------------------提现记录-----------------
myApp.onPageBeforeInit('cash-note',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------提现记录详情-----------------
myApp.onPageBeforeInit('cash-note-more',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//---------------------------经验记录页面-----------------
myApp.onPageBeforeInit('exp-note',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//签到
myApp.onPageBeforeInit('sign', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));

if($('#sign-1').length>0){
new TencentCaptcha(document.getElementById('sign-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_sign(document.getElementById('sign-1'),res.ticket,res.randstr);}
});
}


var hadsign = new Array(); //已签到的数组
hadsign[0] = "765189111";
sign_str=$('#wuju-sign-data-hide').text();
if(sign_str){
sign_arr=new Array();
sign_arr=sign_str.split(",");
for(i=0;i<sign_arr.length;i++){
hadsign[i+1]=sign_arr[i];
}
}

var cale = new Calendar("wuju-sign-body", {
qdDay: hadsign,
});

});
//签到排行榜
myApp.onPageBeforeInit('sign-rank', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//我的钱包
myApp.onPageBeforeInit('mywallet', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//活跃用户
myApp.onPageBeforeInit('online', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//会员中心
myApp.onPageBeforeInit('vip', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//活动报名表单
myApp.onPageBeforeInit('activity-form', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//排行榜
myApp.onPageBeforeInit('leaderboard', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
//小黑屋
myApp.onPageBeforeInit('black-house', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//转发
myApp.onPageBeforeInit('reprint', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//抢红包
myApp.onPageBeforeInit('get-redbag', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
//马甲
myApp.onPageBeforeInit('majia', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
//设置语言
myApp.onPageBeforeInit('setting-language', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});



//发布红包
myApp.onPageBeforeInit('publish-redbag', function (page) {
$('.wuju-publish-redbag-form .type li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-publish-redbag-form .tips').html($(this).attr('title'));
});
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//幸运抽奖
myApp.onPageBeforeInit('luck-draw', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));

//列表tab切换
$('.wuju-luck-draw-list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children().eq($(this).index()).show().siblings().hide();
});
});


//消息
myApp.onPageBeforeInit('notice', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
$('.wuju-mine-page li.notice .item-after').empty();//移除红点
wuju_index_notice_js_load();
$('.wuju-chat-notice li').click(function(event){
$(this).children('.tips').remove();
});
});

//---------------------------视频专题-----------------
myApp.onPageBeforeInit('video-special',function(page){

post_id=page.query['post_id'];
if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?p='+post_id+'#'+Math.random().toString(11).substr(5,8));	
}

var video_list=$('.wuju-video-special-list');
var video_loading = false;
var video_page = 2;
number=video_list.attr('number');
$('.wuju-video-page-content.infinite-scroll').on('infinite',function(){
if (video_loading) return;
video_loading = true;
video_list.after(wuju.loading_post);
topic=$('.wuju-video-special-menu li.on').attr('data');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/video-special.php",
data: {topic:topic,page:video_page,number:number,type:'more'},
success: function(msg){
if(msg==0){
video_list.append('<div class="wuju-empty-page">没有更多内容</div>'); 
video_loading = true; 
}else{
video_list.append(msg);
video_page++;
video_loading = false;  
}
$('.wuju-load-post').remove();
}
});
}); 
});

//---------------------------上传头像页面-----------------
myApp.onPageBeforeInit('upload-avatar',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
var avatar = new Mavatar({el: '#wuju-avatar-demo',backgroundColor:'#fff',width:'250px',height:'250px', fileOnchange: function (e) {
}});
margintop=($('body').width()-250)/2;
$('#wuju-avatar-demo').css('margin-top',margintop+'px');
$('#wuju-clip-avatar').click(function(event) {
myApp.showIndicator();
avatar.imageClipper(function (data) {
$.ajax({
type:"POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/avatar-base64.php",
data:{base64:data,user_id:post_id=page.query['user_id']},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
$('.wuju-setting-box .avatarimg img.avatar').attr('src',msg.url);
if(msg.self){//如果是自己操作
$('.wuju-mine-user-info img.avatar,.wuju-setting-box .avatarimg img.avatar,.wuju-home-navbar img.avatar').attr('src',msg.url);
}
history.back(-1);//返回上一页
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
avatar.resetImage();
}
}
});	
})
});


// function reset() {
// avatar.resetImage();
// }
// //获取上传前信息
// function getInfo() {
// var fileInfo = avatar.getfileInfo();
// console.log(fileInfo);
// }
// //获取base64
// function getdata() {
// var urldata = avatar.getDataUrl();
// console.log(urldata);
// }

});

//---------------------------设置页面-----------------
myApp.onPageInit('setting', function (page) {
window.history.pushState(null,null,'/?'+page.name+'#'+Math.random().toString(36).substr(2,5));

$('.wuju-setting-box li.vip-time').change(function(event) {//设置VIP到期时间
vip_time=$(this).children('input').val();
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile-admin.php",
data:{value:vip_time,author_id:author_id,type:'vip_time'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
this_dom.find('.value').html(vip_time);
}
}
});

});

$('.wuju-setting-box li.blacklist').change(function(event) {//设置黑名单
blacklist=$(this).children('input').val();
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile-admin.php",
data:{value:blacklist,author_id:author_id,type:'blacklist_time'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
this_dom.find('.value').html(blacklist);
}
}
});

});


$('.wuju-setting-box li.verify select').change(function(event){//设置认证类型
verify=$(this).val();
verify_text=$(this).children('option:selected').attr('data');
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile-admin.php",
data:{value:verify,author_id:author_id,type:'verify'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
this_dom.siblings('.value').html(verify_text);
}
}
});
});

$('.wuju-setting-box li.user_power select').change(function(event){//设置认证类型
user_power=$(this).val();
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile-admin.php",
data:{value:user_power,author_id:author_id,type:'user_power'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
if(user_power==1){
this_dom.siblings('.value').html('正常用户');
}else if(user_power==2){
this_dom.siblings('.value').html('网站管理');
}else if(user_power==3){
this_dom.siblings('.value').html('黑名单');
}else if(user_power==4){
this_dom.siblings('.value').html('风险账户');
}
}
}
});
});

});
//---------------------------更多设置页面-----------------
myApp.onPageInit('setting-more', function (page) {
window.history.pushState(null,null,'/?'+page.name+'#'+Math.random().toString(36).substr(2,5));

$('.wuju-setting-box li.gender select').change(function(event) {//设置性别
gender=$(this).val();
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile.php",
data:{value:gender,author_id:author_id,type:'gender'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
this_dom.siblings('.value').html(gender);
// if(msg.self){
// if(gender=='保密'){
// $('.wuju-mine-page .wuju-girl,.wuju-mine-page .wuju-boy').remove();	
// }
// }
}
}
});
});

$('.wuju-setting-box li.birthday').change(function(event) {//设置生日
birthday=$(this).children('input').val();
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile.php",
data:{value:birthday,author_id:author_id,type:'birthday'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
this_dom.find('.value').html(birthday);
}
}
});

// $(this).find('.value').html($(this).children('input').val());
});

});


//---------------------------更多个人说明页面-----------------
myApp.onPageAfterAnimation('setting-desc', function (page) {
window.history.pushState(null,null,'/?'+page.name+'#'+Math.random().toString(36).substr(2,5));
t=$('#wuju-setting-desc').val(); 
$('#wuju-setting-desc').val("").focus().val(t); 
});

//---------------------------更多头衔设置页面-----------------
myApp.onPageAfterAnimation('setting-honor', function (page) {
window.history.pushState(null,null,'/?'+page.name+'#'+Math.random().toString(36).substr(2,5));
$('.wuju-user_honor-select-form .list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});

});


//---------------------------设置-修改手机号-----------------
myApp.onPageAfterAnimation('setting-phone', function (page) {
window.history.pushState(null,null,'/?'+page.name+'#'+Math.random().toString(36).substr(2,5));

if($('#code-3').length>0){
new TencentCaptcha(document.getElementById('code-3'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'phone',res.ticket,res.randstr);}
});
}

});

//---------------------------设置-修改邮箱号-----------------
myApp.onPageAfterAnimation('setting-email', function (page) {
window.history.pushState(null,null,'/?'+page.name+'#'+Math.random().toString(36).substr(2,5));

if($('#code-4').length>0){
new TencentCaptcha(document.getElementById('code-4'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'mail',res.ticket,res.randstr);}
});
}

});


myApp.onPageAfterAnimation('bbs',function(page){
bbs_loading = false; 
//渲染瀑布流
var container = $('.page-on-center .wuju-bbs-post-list-3');
container.imagesLoaded(function(){
container.masonry({
itemSelector : '.grid',
gutter: 0,
isAnimated: true,
isRTL:false,
isResizable: true,//是否自动布局默认true
gutterWidth:0,
animationOptions:{
duration: 800,
easing: 'easeOutBounce',
queue: false
}
});
});

});

//--------------------论坛页面-------
myApp.onPageAfterAnimation('bbs',function(page){
$('[data-page=bbs] .navbar').removeClass('color');//移除color
bbs_id=page.query.bbs_id;

if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?cat='+bbs_id+'#'+Math.random().toString(36).substr(2,5));	
}



//滚动事件
$('.wuju-bbs-content').scroll(function(){
scrollTop =$(this).scrollTop();//滚动高度

if(scrollTop>50){
$('[data-page=bbs] .navbar').addClass('color');
}else{
$('[data-page=bbs] .navbar').removeClass('color');
};

});

bbs_loading = false;
bbs_page=2;
//bbs_post_list=$('.page-on-center .wuju-bbs-post-list');
bbs_post_list=$('[data-page="bbs"] .wuju-bbs-post-list');
$('.wuju-bbs-content.infinite-scroll').on('infinite',function(){
if (bbs_loading) return;
bbs_loading = true;
bbs_post_list.after(wuju.loading_post);
type=$('.wuju-bbs-menu-'+bbs_id+' li.on').attr('type');
topic=$('.wuju-bbs-menu-'+bbs_id+' li.on').attr('topic');
if(type==''){type='new';}
// console.log(type);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/bbs.php",
data: {page:bbs_page,bbs_id:bbs_id,type:type,topic:topic},
success: function(msg){
if(msg!=0){

if(bbs_post_list.hasClass('wuju-bbs-post-list-3')){//瀑布流
container=$('.page-on-center .wuju-bbs-post-list-3');
$(msg).find('img').each(function(index){
wuju_loadImage($(this).attr('src'));
})
var $newElems = $(msg).css({ opacity: 1}).appendTo(container);
$newElems.imagesLoaded(function(){
// $newElems.animate({ opacity: 1},800);
container.masonry( 'appended', $newElems,true);
});
}else{
bbs_post_list.append(msg);
}

bbs_loading = false; 
bbs_page++;
}else{
bbs_loading = true; 
}
$('.wuju-load-post').remove();
}
});


}); 



}); 

//---------------------------话题页面-----------------
myApp.onPageBeforeInit('topic',function(page){
$('[data-page=topic] .navbar').removeClass('color');//移除color
topic_id=page.query.topic_id;

if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?tag='+topic_id+'#'+Math.random().toString(36).substr(2,5));	
}

wuju_lightbox();

//滚动事件
$('.wuju-topic-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度

if(scrollTop>30){
$('[data-page=topic] .navbar').addClass('color');
}else{
$('[data-page=topic] .navbar').removeClass('color');
};


if(contentH - viewH - scrollTop-navbarH <20){ //到达底部时,加载新内容
if($('.wuju-topic-content .wuju-loading').length==0&&$('.wuju-topic-content .wuju-empty-page').length==0){
more_list=$('.wuju-topic-post-list');
page=parseInt(more_list.attr('page'));
more_list.after(wuju.loading);
type=more_list.attr('type');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/topic.php",
data: {page:page,topic_id:topic_id,type:type},
success: function(msg){
if(msg!=0){
more_list.append(msg);
page=page+1;
more_list.attr('page',page);
}else{
more_list.append('<div class="wuju-empty-page">没有更多内容</div>'); 
}
$('.wuju-load').remove();
}
});


}
}

});



});
//--------------------------我关注的论坛页面-----------------
myApp.onPageBeforeInit('bbs-like',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
//--------------------------我关注的话题页面-----------------
myApp.onPageBeforeInit('topic-like',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
//--------------------------推荐论坛页面-----------------
myApp.onPageBeforeInit('bbs-commend',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//--------------------------大转盘页面-----------------
myApp.onPageBeforeInit('lottery',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
$('.wuju-lottery-money span.add').click(function(){
number=$('#wuju-lottery-money').val();
if(number){
number=parseInt(number);
}else{
number=0;
}
add_number=parseInt($(this).attr('data'));
$('#wuju-lottery-money').val(number+add_number);

});

});

//---------------------------个人主页-自己-----------------


myApp.onPageBeforeInit('member-mine',function(page){
$('[data-page=member-mine] .navbar').removeClass('color');//移除color
wuju_lightbox();
author_id=page.query.author_id;

if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?author='+author_id+'#'+Math.random().toString(36).substr(2,5));	
}

});


myApp.onPageAfterAnimation('member-mine', function (page) {
author_id=page.query.author_id;

//滚动事件
$('.page-on-center #wuju-member-mine-page').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度


if(scrollTop>200){
$('[data-page=member-mine] .navbar').addClass('color');
}else{
$('[data-page=member-mine] .navbar').removeClass('color');
};

if(contentH - viewH - scrollTop-navbarH <1){ //到达底部时,加载新内容
if($('#wuju-member-mine-page .wuju-loading').length==0&&$('#wuju-member-mine-page .wuju-empty-page').length==0){
more_list=$(this).find('.wuju-member-mine-post-list');
type=$(this).find('.wuju-member-menu li.on').attr('data');
page=parseInt(more_list.attr('page'));
more_list.after(wuju.loading);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/data.php",
data: {page:page,type:type,load_type:'more',author_id:author_id},
success: function(msg){
if(msg==0){
more_list.append('<div class="wuju-empty-page">没有更多内容</div>'); 
}else{    
more_list.append(msg);
wuju_lightbox();
page=page+1;
more_list.attr('page',page);
}
$('.wuju-load').remove();
}
});
}
}


});

//查看自己头像
$('.wuju-member-header .avatarimg').on('click',function(){
avatar_url=$(this).children('img').attr('src');
show_avatar = myApp.photoBrowser({
photos : [avatar_url],
theme:'dark',
toolbar:false,
type:'popup',
});
show_avatar.open();
});

}); 

//---------------------------个人主页-别人-----------------

myApp.onPageBeforeInit('member-other',function(page){
$('[data-page=member-other] .navbar').removeClass('color');//移除color
wuju_lightbox();
author_id=page.query.author_id;

if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?author='+author_id+'#'+Math.random().toString(36).substr(2,5));	
}

});

myApp.onPageAfterAnimation('member-other', function (page) {
author_id=page.query.author_id;

//滚动事件
$('.page-on-center #wuju-member-other-page').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度

if(scrollTop>200){
$('[data-page=member-other] .navbar').addClass('color');
}else{
$('[data-page=member-other] .navbar').removeClass('color');
};

if(contentH - viewH - scrollTop-navbarH <1){ //到达底部时,加载新内容
if($('#wuju-member-other-page .wuju-loading').length==0&&$('#wuju-member-other-page .wuju-empty-page').length==0){
more_list=$(this).find('.wuju-member-other-post-list');
type=$(this).find('.wuju-member-menu li.on').attr('data');
page=parseInt(more_list.attr('page'));
more_list.after(wuju.loading);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/data.php",
data: {page:page,type:type,load_type:'more',author_id:author_id},
success: function(msg){
if(msg==0){
more_list.append('<div class="wuju-empty-page">没有更多内容</div>'); 
}else{    
more_list.append(msg);
wuju_lightbox();
page=page+1;
more_list.attr('page',page);
}
$('.wuju-load').remove();
}
});
}
}


});



//查看他人头像
$('.wuju-member-header .avatarimg').on('click',function(){
avatar_url=$(this).children('img').attr('src');
show_avatar = myApp.photoBrowser({
photos : [avatar_url],
theme:'dark',
toolbar:false,
type:'popup',
});
show_avatar.open();
});


}); 




//===========================消息页面================================

//消息页面下拉刷新
var ptrContent = $('#wuju-view-notice .pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
setTimeout(function (){//显示刷新成功
$('#wuju-view-notice .preloader').hide();
$('#wuju-view-notice .wuju-refresh-success').show();
}, 800);

//下拉刷新完成
setTimeout(function (){
myApp.pullToRefreshDone();
$('#wuju-view-notice .preloader').show();
$('#wuju-view-notice .wuju-refresh-success').hide();


}, 1600);

});


//---------------------------单对单聊天-----------------
myApp.onPageBeforeInit('chat-one',function(page){
author_id=page.query.author_id;
window.history.pushState(null,null,'/?chat='+author_id+'&r='+Math.random().toString(36).substr(2,5));
wuju_lightbox();
$('#wuju-chat-user-'+author_id+' .tips').remove();//消灭提示
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);


wuju_ajax_get_messages(author_id);//长轮询

//图片加载完成
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
});


//点击内容 撤回菜单
// $('.wuju-chat-message-list-content').on('click',function(){
// myApp.popover('.wuju-chat-tap-popover',this);
// });

$('.wuju-chat-list-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
if(contentH - viewH - scrollTop-navbarH*2 >5){ //到达底部时,加载新内容
$('.wuju-msg-tips').show();
}else{
$('.wuju-msg-tips').hide().html('底部');	
}
});


});

//关闭聊天
myApp.onPageBack('chat-one', function (page){//返回
wuju_stop_user_Ajax();//关闭长轮询   
})



//---------------------群聊-------
myApp.onPageBeforeInit('chat-group',function(page){
bbs_id=page.query.bbs_id;
window.history.pushState(null,null,'/?group='+bbs_id+'&r='+Math.random().toString(36).substr(2,5));
wuju_lightbox();
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);

wuju_ajax_get_messages_group(bbs_id);//长轮询

//图片加载完成
$('.wuju-chat-message-list-content img').on('load',function(){
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);
});

//点击内容 撤回菜单
// $('.wuju-chat-message-list-content').on('click',function(){
// myApp.popover('.wuju-chat-tap-popover',this);
// });


$('.wuju-chat-group-list-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
console.log(navbarH);
if(contentH - viewH - scrollTop-navbarH*2 >5){ //到达底部时,加载新内容
$('.wuju-msg-tips').show();
}else{
$('.wuju-msg-tips').hide().html('底部');	
}
});

});


//关闭群聊
myApp.onPageBack('chat-group', function (page){//返回
wuju_stop_group_Ajax();//关闭长轮询   
})





//---------------------------发布动态页面-----------------
myApp.onPageAfterAnimation('publish',function(page){
type=page.query.type;

if(type=='words'){
if($('#publish-'+type).length>0){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_words(res.ticket,res.randstr);}
});
}
}else if(type=='music'){
if($('#publish-'+type).length>0){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_music_video('music',res.ticket,res.randstr);}
});
}
}else if(type=='video'){
if($('#publish-'+type).length>0){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_music_video('video',res.ticket,res.randstr);}
});
}
}else if(type=='single'){
if($('#publish-'+type).length>0){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_single(res.ticket,res.randstr);}
});
}	
}else{
if($('#publish-bbs').length>0){
new TencentCaptcha(document.getElementById('publish-bbs'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_bbs(type,res.ticket,res.randstr);}
});
}
}

if(type!='video'&&type!='music'){
document.querySelector('#file').addEventListener('change', function () {
var that = this;
var number=that.files.length;

if(type=='words'){
var words_images_max=wuju.words_images_max;//最大上传数量
}else{
var words_images_max=40;	
}

if(number>words_images_max||$('#wuju-publish-images-list li').length>=words_images_max){
layer.open({content:'最多只能上传'+words_images_max+'张图片！',skin:'msg',time:2});
return false;
}

a=0;//计时器
for(i = 0; i< number; i ++) {
$('.wuju-publish-words-form .add i').hide();//显示加载loading
$('.wuju-publish-words-form .add span').css('display','inline-block');//显示加载loading
info=that.files[i];
if(info.type!='image/gif'){
lrz(info)
.then(function (rst) {
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/words-base64.php",
data:{base64:rst.base64},
success: function(msg){
img_count=$('#wuju-publish-images-list li').length;//获取已经上传的图片数量
if(img_count>=words_images_max-1){//如果已经上传了9张
$('.wuju-publish-words-form .add').hide();//隐藏添加按钮
}
if(img_count<words_images_max){//如果上传的超过了9张就不载入容器
if(msg.code==1){
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.url+'" data-fancybox="gallery-publish"><img src="'+msg.url+'"></a></li>');
wuju_lightbox();//渲染灯箱
a++;

if(a==number){//如果照片已经上传完成就关闭
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画	
}

}
});
});

}else{//gif图片上传
if(info.size/(1024*1024)<wuju.mobile_gif_size_max){
var reader = new FileReader();
reader.onload = function (evt) {
image=evt.target.result;
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/words-base64.php",
data:{base64:image},
success: function(msg){
img_count=$('#wuju-publish-images-list li').length;//获取已经上传的图片数量
if(img_count>=words_images_max-1){//如果已经上传了9张
$('.wuju-publish-words-form .add').hide();//隐藏添加按钮
}
if(img_count<words_images_max){//如果上传的超过了9张就不载入容器
if(msg.code==1){
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.url+'" data-fancybox="gallery-publish"><img src="'+msg.url+'"></a></li>');
wuju_lightbox();//渲染灯箱
a++;

if(a==number){//如果照片已经上传完成就关闭
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}

}else{
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画	
}

}
});


}
reader.readAsDataURL(info);
}else{
layer.open({content:'上传的动图不能超过'+wuju.mobile_gif_size_max+'MB！',skin:'msg',time:2});
$('#file').val('');//清空已选状态
$('.wuju-publish-words-form .add i').show();//关闭loading动画
$('.wuju-publish-words-form .add span').hide();	//关闭loading动画
}



}

}
});

//图片拖动排序
var el = document.getElementById('wuju-publish-images-list');
var sortable = Sortable.create(el);
}

if(type=='video'){
document.querySelector('#wuju-upload-video').addEventListener('change', function () {
var percent = $('.wuju-upload-video-btn .percent');
var progress = $(".wuju-upload-video-btn p");

$("#wuju-upload-video-form").ajaxSubmit({
dataType:'json',
uploadProgress: function(event, position, total, percentComplete) {
var percentVal = percentComplete + '%';
percent.width(percentVal);
progress.html(percentVal);
if(percentVal=='100%'){
progress.html('视频正在处理中...');	
}
},
success:function(msg){
$('#wuju-upload-video').val('');
if(msg.code==0){
layer.open({content:msg.msg,skin:'msg',time:2});
percent.width(0);
progress.html('选择一个视频');
}else if(msg.code==1){
$('#wuju-upload-video-form').hide();
$('.wuju-remove-video-toolbar').css('display','flex');
$('#wuju-video-url').val(msg.file_url);

var wuju_view_video = new Player({
id: 'wuju-publish-video-demo',
url:msg.file_url,
'x5-video-player-type': 'h5',
'x5-video-player-fullscreen': false,
playbackRate: [0.5,1,2,6,8],
fitVideoSize:'fixWidth',
playsinline: true,
videoInit: true,
autoplay:true,
ignores: ['volume','pc'],
closeVideoTouch: true,
rotate:{
innerRotate: true, //只旋转内部video
clockwise: false // 旋转方向是否为顺时针
}
});

video = $('#wuju-publish-video-demo video');
video.attr('crossOrigin','Anonymous');

wuju_view_video.on("canplay", function(){
video_time=$('#wuju-publish-video-demo .xgplayer-time em').text();
video_time_s=video_time.split(':')[video_time.split(':').length - 1];
video_time_m=video_time.split(':',1);
$('#wuju-video-time').val(parseInt(video_time_m)*60+parseInt(video_time_s));
});

$('.wuju-remove-video-toolbar .del').click(function(){
$('#wuju-publish-video-demo').empty().attr('class','').attr('style','');
$('.wuju-remove-video-toolbar').css('display','none');
$('#wuju-upload-video-form').show();
percent.width(0);
progress.html('选择一个视频');
$('.wuju-remove-video-toolbar .read').removeClass('on').text('截取封面');
$('.wuju-publish-video-set-cover-content').empty();
$('#wuju-video-img-url,#wuju-video-url').val('');
});

$('.wuju-remove-video-toolbar .read').click(function(){
if(!$(this).hasClass('on')){
var canvas = document.createElement("canvas");
// canvas.width = video[0].videoWidth;
// canvas.height = video[0].videoHeight;
video_width=$('#wuju-publish-video-demo').width();
video_height=$('#wuju-publish-video-demo').height();
canvas.width=video_width;
canvas.height=video_height;
var ctx=canvas.getContext("2d");
if(myApp.device.os=='ios'&&wuju_get_file_type(msg.file_url)=='.mov'&&(video_height>video_width)){
ctx.rotate(90*Math.PI/180);
ctx.translate(0,-video_width);
ctx.drawImage(video[0], 0, 0, canvas.width*2, canvas.height);
}else{
ctx.drawImage(video[0], 0, 0, canvas.width, canvas.height);	
}
video_cover=canvas.toDataURL("image/jpeg");

$('.wuju-publish-video-set-cover-content').html('<img src="'+video_cover+'">');
$.ajax({
type:"POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/video-img-base64.php",
data:{base64:video_cover},
success: function(rel){
if(rel.code==1){
$('#wuju-video-img-url').val(rel.url);	
$('.wuju-remove-video-toolbar span.read').addClass('on').text('已截取封面');
$('.wuju-publish-video-set-cover-content').html('<img src="'+rel.url+'">');
}else{
layer.open({content:rel.msg,skin:'msg',time:2});
$('.wuju-remove-video-toolbar span.read').addClass('on').removeAttr('data-popup').removeClass('open-popup');
}
}
});	
}
});

$('#wuju-publish-remove-video-cover').click(function(){
$('.wuju-remove-video-toolbar .read').removeClass('on').text('截取封面');
$('.wuju-publish-video-set-cover-content').empty();
$('#wuju-video-img-url').val('');
});

}


}, 
error:function(){
$('#wuju-upload-video-form').show();
percent.width(0);
progress.html('选择一个视频');
layer.open({content:'上传失败！',skin:'msg',time:2});
$('#wuju-upload-video').val('');
return false;
} 
});

});
}


if(type=='music'){//上传音乐
document.querySelector('#wuju-upload-music').addEventListener('change', function () {
var percent = $('.wuju-upload-music-btn .percent');
var progress = $(".wuju-upload-music-btn p");

$("#wuju-upload-music-form").ajaxSubmit({
dataType:'json',
uploadProgress: function(event, position, total, percentComplete) {
var percentVal = percentComplete + '%';
percent.width(percentVal);
progress.html(percentVal);
if(percentVal=='100%'){
progress.html('音频正在处理中...');	
}
},
success:function(msg){
$('#wuju-upload-music').val('');
if(msg.code==0){
layer.open({content:msg.msg,skin:'msg',time:2});
percent.width(0);
progress.html('选择一个音频');
}else if(msg.code==1){
$('#wuju-music-url').val(msg.file_url);
progress.html('音频已经上传');
}


}, 
error:function(){
$('#wuju-upload-music-form').show();
percent.width(0);
progress.html('选择一个音频');
layer.open({content:'上传失败！',skin:'msg',time:2});
$('#wuju-upload-music').val('');
return false;
} 
});

});


}




//发布@好友
$('.wuju-publish-aite-popup').on('opened',function (){//打开
if($('.wuju-publish-aite-form .list.aite li').length==0){
myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/user/following.php",
success: function(msg){
myApp.hideIndicator();
html='';
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li onclick="wuju_aite_selete_user(this)" data="'+msg.data[i].nickname+'">\
<div class="avatarimg">'+msg.data[i].avatar+msg.data[i].verify+'</div>\
<div class="name">'+msg.data[i].name+msg.data[i].vip+'</div>\
</li>';
}
$('.wuju-publish-aite-form .list.aite').html(html);
}
}); 

}
});

//选择话题
$('.wuju-publish-topic-popup').on('opened',function (){//打开
if($('.wuju-publish-aite-form .list.topic li').length==0){
myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/topic/topic-hot.php",
success: function(msg){
myApp.hideIndicator();
html='';
for (var i = 0; i < msg.data.length; i++){
html+='\
<li onclick="wuju_publish_topic_selete(this)" data="'+msg.data[i].name+'">\
<div class="avatarimg">'+msg.data[i].avatar+'</div>\
<div class="name">#'+msg.data[i].name+'#</div>\
<div class="hot"><i class="wuju-icon wuju-huo"></i> '+msg.data[i].hot+'</div>\
</li>';
}
$('.wuju-publish-aite-form .list.topic').html(html);
}
}); 

}
});

//选择话题
$('.wuju-publish-power-popup').on('opened',function (){//打开
if($('.wuju-publish-power-form li').length==0){
myApp.showIndicator();
post_type=$('.wuju-publish-words-form .tool .power i').attr('post_type');
$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/publish/power-form.php",
data:{post_type:post_type},
success: function(msg){
myApp.hideIndicator();
$('.wuju-publish-power-form').html(msg);
}
}); 
}
});



$('.wuju-publish-words-form .smile').click(function(){
layer.open({
type: 1,
content: $(this).next().html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;height:65vw;border:none;'
});
});


});





//---------------------------//充值金币页面-----------------
myApp.onPageAfterAnimation('recharge-credit',function(page){
$('.wuju-recharge-number li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
$('#wuju-credit-recharge-number').val($(this).children('.bottom').attr('data'));
});
$('.wuju-recharge-type li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
type=$(this).attr('data');
$('#wuju-recharge-type').val(type);
if(type=='alipay'){
$('#wuju-credit-recharge-form').attr('action',wuju.theme_url+'/mobile/module/pay/alipay-h5.php');	
}else if(type=='wechat-jsapi'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/pay/wechat/wechat-mp.php');	
}
});
});

//---------------------------//开通会员页面-----------------
myApp.onPageAfterAnimation('recharge-vip',function(page){
$('.wuju-recharge-number li').click(function() {
$(this).addClass('on').siblings().removeClass('on');

if($('.wuju-recharge-type li.on').length>0){
if($('.wuju-recharge-type li.on').attr('data')=='creditpay'){
$('#wuju-credit-recharge-number').val($(this).children('.bottom').attr('credit_price'));	
}else{
$('#wuju-credit-recharge-number').val($(this).children('.bottom').attr('rmb_price'));	
}
}
});	



$('.wuju-recharge-type li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
type=$(this).attr('data');
$('#wuju-recharge-type').val(type);
if(type=='creditpay'){
$('#wuju-credit-recharge-number').val($('.wuju-recharge-number li.on').children('.bottom').attr('credit_price'));

$(".wuju-recharge-number li").each(function(){
$(this).children('.bottom').find('m').html($(this).children('.bottom').attr('credit_price'));
});
$('.wuju-recharge-number li .bottom i').html(wuju.credit_name);
}else{
$('#wuju-credit-recharge-number').val($('.wuju-recharge-number li.on').children('.bottom').attr('rmb_price'));	

$(".wuju-recharge-number li").each(function(){
$(this).children('.bottom').find('m').html($(this).children('.bottom').attr('rmb_price'));
});
$('.wuju-recharge-number li .bottom i').html('元');
if(type=='alipay'){
$('#wuju-credit-recharge-form').attr('action',wuju.theme_url+'/mobile/module/pay/alipay-h5.php');	
}else if(type=='wechat-jsapi'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/pay/wechat/wechat-mp.php');	
}	
}

});
});

//---------------------------//发送礼物页面-----------------
myApp.onPageAfterAnimation('send-gift',function(page){
$('.wuju-send-gift-form li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-send-gift-toolbar span.send i').html($(this).children('.bottom').attr('data'));
});
});



//---------------------与我相关-------
myApp.onPageBeforeInit('item-notice',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
$('.wuju-chat-user-list li').click(function(){//消除红点
$(this).find('.item-media').find('span').remove();
});
});
//---------------------评论回复-------
myApp.onPageBeforeInit('comment-notice',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
$('.wuju-chat-user-list li').click(function(){//消除红点
$(this).find('.item-media').find('span').remove();
});
});
//---------------------喜欢关注-------
myApp.onPageBeforeInit('like-follow-notice',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
$('.wuju-chat-user-list li').click(function(){//消除红点
$(this).find('.item-media').find('span').remove();
});
});
//---------------------系统通知------
myApp.onPageBeforeInit('system-notice',function(page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
$('.wuju-chat-user-list li').click(function(){//消除红点
$(this).find('.item-media').find('span').remove();
});


system_notice_loading = false;
system_notice_page=2;
system_notice_list=$('.wuju-site-notice-content');
$('.wuju-site-notice-content.infinite-scroll').on('infinite',function(){
if (system_notice_loading) return;
system_notice_loading = true;
system_notice_list.append(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/system-notice.php",
data: {page:system_notice_page},
success: function(msg){
if(msg!=0){
system_notice_list.append(msg);
system_notice_loading = false; 
system_notice_page++;
}else{
system_notice_loading = true; 
}
$('.wuju-load-post').remove();
}
});


}); 
});



//我的粉丝页面
myApp.onPageAfterAnimation('follower', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
type=page.query['type'];

//滚动事件
$('.wuju-follower-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
if(contentH - viewH - scrollTop-navbarH <20){ //到达底部时,加载新内容
if($('.wuju-follower-content .wuju-loading').length==0&&$('.wuju-follower-content .wuju-empty-page').length==0){
more_list=$('.wuju-chat-user-list.follower');
page=parseInt(more_list.attr('page'));
user_id=more_list.attr('user_id');
more_list.after(wuju.loading);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/user/follower.php",
data: {page:page,user_id:user_id,type:type},
success: function(msg){
if(msg.code!=0){  

html='';
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li>\
<div class="item-content">\
<div class="item-media">\
<a href="'+msg.data[i].link+'" class="link">\
'+msg.data[i].avatar+msg.data[i].verify+'\
</a>\
</div>\
<div class="item-inner">\
<div class="item-title">\
<a href="'+msg.data[i].link+'" class="link">\
<div class="name">'+msg.data[i].nickname+msg.data[i].vip+'</div>\
<div class="desc">'+msg.data[i].desc+'</div>\
</a>\
</div>\
</div>\
'+msg.data[i].follow+'\
</div>\
</li>';
}
more_list.append(html);
page=page+1;
more_list.attr('page',page);
}else{
more_list.append('<div class="wuju-empty-page">暂时没有更多了</div>'); 
}
$('.wuju-load').remove();
}
});
}
}

});

}); 


//---------------------我的访客-------
myApp.onPageBeforeInit('visitor',function(page){
window.history.pushState(null,null,'/?visitor&r='+Math.random().toString(36).substr(2,5));
$('.wuju-mine-page li.visitor .item-title>i').remove();//移除红点
});







//收入记录
myApp.onPageBeforeInit('income', function (page) {
window.history.pushState(null,null,'/?income&r='+Math.random().toString(36).substr(2,5));
//滚动事件
$('.wuju-recharge-note-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
if(contentH - viewH - scrollTop-navbarH <20){ //到达底部时,加载新内容
if($('.wuju-recharge-note-content .wuju-loading').length==0&&$('.wuju-recharge-note-content .wuju-empty-page').length==0){
more_list=$('.wuju-chat-user-list.recharge-note');
page=parseInt(more_list.attr('page'));
type=more_list.attr('type');
more_list.after(wuju.loading);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/note/credit.php",
data: {page:page,type:type},
success: function(msg){
if(msg.code!=0){  

html='';
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li>\
<div class="item-content">\
<div class="item-media">\
'+msg.data[i].avatar+'\
</div>\
<div class="item-inner">\
<div class="item-title">\
<div class="name">'+msg.data[i].content+'</div>\
<div class="desc">'+msg.data[i].time+'</div>\
</div>\
</div>\
<div class="item-after">+'+msg.data[i].number+'</div>\
</div>\
</li>';
}
more_list.append(html);
page=page+1;
more_list.attr('page',page);
}else{
more_list.append('<div class="wuju-empty-page">没有更多记录</div>'); 
}
$('.wuju-load').remove();
}
});
}
}

});

}); 

//支出记录
myApp.onPageBeforeInit('outlay', function (page) {
window.history.pushState(null,null,'?outlay&r='+Math.random().toString(36).substr(2,5));
//滚动事件
$('.wuju-recharge-note-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
if(contentH - viewH - scrollTop-navbarH <20){ //到达底部时,加载新内容
if($('.wuju-recharge-note-content .wuju-loading').length==0&&$('.wuju-recharge-note-content .wuju-empty-page').length==0){
more_list=$('.wuju-chat-user-list.recharge-note');
page=parseInt(more_list.attr('page'));
type=more_list.attr('type');
more_list.after(wuju.loading);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/note/credit.php",
data: {page:page,type:type},
success: function(msg){
if(msg.code!=0){  

html='';
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li>\
<div class="item-content">\
<div class="item-media">\
'+msg.data[i].avatar+'\
</div>\
<div class="item-inner">\
<div class="item-title">\
<div class="name">'+msg.data[i].content+'</div>\
<div class="desc">'+msg.data[i].time+'</div>\
</div>\
</div>\
<div class="item-after out">-'+msg.data[i].number+'</div>\
</div>\
</li>';
}
more_list.append(html);
page=page+1;
more_list.attr('page',page);
}else{
more_list.append('<div class="wuju-empty-page">没有更多记录</div>'); 
}
$('.wuju-load').remove();
}
});
}
}

});

}); 



//充值记录
myApp.onPageBeforeInit('recharge-note', function (page) {
window.history.pushState(null,null,'?recharge-note&r='+Math.random().toString(36).substr(2,5));
//滚动事件
$('.wuju-recharge-note-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
if(contentH - viewH - scrollTop-navbarH <20){ //到达底部时,加载新内容
if($('.wuju-recharge-note-content .wuju-loading').length==0&&$('.wuju-recharge-note-content .wuju-empty-page').length==0){
more_list=$('.wuju-chat-user-list.recharge-note');
page=parseInt(more_list.attr('page'));
type=more_list.attr('type');
more_list.after(wuju.loading);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/note/credit.php",
data: {page:page,type:type},
success: function(msg){
if(msg.code!=0){  

html='';
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li>\
<div class="item-content">\
<div class="item-media">\
'+msg.data[i].avatar+'\
</div>\
<div class="item-inner">\
<div class="item-title">\
<div class="name">'+msg.data[i].content+'</div>\
<div class="desc">'+msg.data[i].time+'</div>\
</div>\
</div>\
<div class="item-after">+'+msg.data[i].number+'</div>\
</div>\
</li>';
}
more_list.append(html);
page=page+1;
more_list.attr('page',page);
}else{
more_list.append('<div class="wuju-empty-page">没有更多记录</div>'); 
}
$('.wuju-load').remove();
}
});
}
}

});

}); 



//活动报名表单
myApp.onPageAfterAnimation('activity-form', function (page) {


$('.wuju-upload-activity-form-1 input').change(function(){
$(".wuju-upload-activity-form-1").ajaxSubmit({
dataType:'json',
success:function(msg){
if(msg.code==0){
layer.open({content:msg.msg,skin:'msg',time:2});	
}
$(".wuju-upload-activity-form-1").parent().hide().next().val(msg.file_url).after('<img src="'+msg.file_url+'">');
}, 
error:function(){
layer.open({content:'上传失败！',skin:'msg',time:2});
} 
});
});

$('.wuju-upload-activity-form-2 input').change(function(){
$(".wuju-upload-activity-form-2").ajaxSubmit({
dataType:'json',
success:function(msg){
if(msg.code==0){
layer.open({content:msg.msg,skin:'msg',time:2});	
}
$(".wuju-upload-activity-form-2").parent().hide().next().val(msg.file_url).after('<img src="'+msg.file_url+'">');
}, 
error:function(){
layer.open({content:'上传失败！',skin:'msg',time:2});
} 
});
});

$('.wuju-upload-activity-form-3 input').change(function(){
$(".wuju-upload-activity-form-3").ajaxSubmit({
dataType:'json',
success:function(msg){
if(msg.code==0){
layer.open({content:msg.msg,skin:'msg',time:2});	
}
$(".wuju-upload-activity-form-3").parent().hide().next().val(msg.file_url).after('<img src="'+msg.file_url+'">');
}, 
error:function(){
layer.open({content:'上传失败！',skin:'msg',time:2});
} 
});
});


});

//任务
myApp.onPageBeforeInit('task', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//宝箱任务
myApp.onPageBeforeInit('task-treasure', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//任务事件
myApp.onPageAfterAnimation('task', function (page) {
$('#wuju-task-navbar-center span').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-task-form-content').find('ul').eq($(this).index()).show().siblings().hide();
});
});


//生成内容海报
myApp.onPageBeforeInit('content-playbill',function(page){
url=page.query['url'];
// console.log(page.query);
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
wuju_qrcode('wuju-content-playbill-code',60,60,url);
$('#wuju-add-content-playbill').click(function(){
obj=$(this);
obj.html('<i class="fa fa-spinner fa-spin"></i> 海报生成中...')
const vm = this;
const domObj = document.getElementById('wuju-content-playbill');
const left = domObj.getBoundingClientRect().left;
const top = domObj.offsetTop;
const width = domObj.offsetWidth;
const height = domObj.offsetHeight;
const scale = 3;
const canvas = document.createElement('canvas');
canvas.width = width*scale;
canvas.height = height*scale;
canvas.style.width=width+"px";
canvas.style.height=height+"px";
const context = canvas.getContext("2d");
context.scale(scale,scale);
context.translate(-left,-top);
html2canvas(domObj,{
// dpi:1,
scale: scale,
canvas: canvas,
useCORS: true,
logging: false,
// allowTaint:true,
width:width,
height:height,
}).then(function(canvas) {


vm.posterImg = canvas.toDataURL('image/jpeg')
vm.mask = true;
$('#wuju-content-playbill').html('<img src="'+vm.posterImg+'">');
obj.after('<div class="wuju-save-content-playbill">「 海报已生成，长按图片进行保存 」</div>');
obj.remove()
});
});

});


//推广
myApp.onPageBeforeInit('referral', function (page) {
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));

//复制推广链接
var clipboard = new ClipboardJS('#wuju-referral-cover');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});
});



//直播
myApp.onPageBeforeInit('live', function (page) {
post_id=$('.wuju-live-content').attr('post_id');
if(wuju.permalink_structure){//固定连接
window.history.pushState(null,null,page.query['url']+'#'+Math.random().toString(36).substr(2,5));	
}else{//朴素
window.history.pushState(null,null,'/?p='+post_id+'#'+Math.random().toString(36).substr(2,5));	
}

video_url=$('#wuju-video-live').attr('data');
if(video_url){
cover=$('#wuju-video-live').attr('cover');
video_type=wuju_video_type(video_url);
window.player=new window[video_type]({
id:'wuju-video-live',
url:video_url,
poster:cover,
'x5-video-player-type': 'h5',
'x5-video-player-fullscreen': false,
playsinline: true,
// fluid: true,
// autoplay:true,
ignores: ['volume','pc'],
closeVideoTouch: true,
rotate:{
innerRotate: true, //只旋转内部video
clockwise: false // 旋转方向是否为顺时针
}
});
}


//菜单
$('.wuju-live-page-nav li').click(function(){
$('.wuju-live-toolbar textarea,.wuju-live-toolbar').removeAttr('style');
$('.wuju-live-toolbar,.wuju-home-right-bar').hide();
$(this).addClass('on').siblings().removeClass('on');
$(this).parents('.wuju-live-page-header').next().children('ul').eq($(this).index()).show().siblings().hide();
if($(this).hasClass('comment')){
$('.wuju-live-toolbar,.wuju-home-right-bar').show();
$('.wuju-live-page-nav-list').scrollTop($('.wuju-live-page-nav-list')[0].scrollHeight);//互动评论向下啦
}
});

wuju_ajax_get_live_comment();//发起
wuju_lightbox();
});

myApp.onPageAfterAnimation('live', function (page) {
$('.wuju-live-page-nav-list').scrollTop($('.wuju-live-page-nav-list')[0].scrollHeight);//互动评论向下啦
});

//关闭直播界面
myApp.onPageBack('live',function (page){//返回
ajax_get_live_comment.abort();
})


//宠物乐园
myApp.onPageBeforeInit('pet-mine', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});
myApp.onPageBeforeInit('pet-other', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//宠物窝
myApp.onPageBeforeInit('pet-nest-mine', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));

if($('#pet-1').length>0){
pet_id=$('#pet-1').attr('data-id');
pet_number=$('#pet-1').attr('data-number');
new TencentCaptcha(document.getElementById('pet-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pet_sell(pet_id,pet_number,document.getElementById('pet-1'),res.ticket,res.randstr);}
});
}

});
myApp.onPageBeforeInit('pet-nest-other', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));

if($('#pet-1').length>0){
pet_id=$('#pet-1').attr('data-id');
pet_number=$('#pet-1').attr('data-number');
new TencentCaptcha(document.getElementById('pet-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pet_steal(pet_id,pet_number,document.getElementById('pet-1'),res.ticket,res.randstr);}
});
}

});

//宠物商城
myApp.onPageBeforeInit('pet-store', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//宠物列表
myApp.onPageBeforeInit('pet-list', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});

//宠物记录
myApp.onPageBeforeInit('pet-note', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
});


//收藏
myApp.onPageBeforeInit('collect', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
wuju_lightbox();//灯箱


//加载更多
collect_loading = false;
collect_page = 2;
collect_post_list=$('.wuju-collect-content .wuju-post-list');
$('.wuju-collect-content.infinite-scroll').on('infinite',function(){
if(collect_loading) return;
collect_loading = true;
collect_post_list.after(wuju.loading_post);
type=$('.wuju-collect-tab li.on').attr('type');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/collect.php",
data: {page:collect_page,type:type,load_type:'more'},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
collect_loading = true; 
}else{
collect_post_list.append(msg);
wuju_lightbox()
collect_page++;
collect_loading = false;  
} 
}
});
});


});


//收藏-图片
myApp.onPageBeforeInit('collect-img', function (page){
window.history.pushState(null,null,'/?'+page.name+'&r='+Math.random().toString(36).substr(2,5));
wuju_lightbox();//灯箱



//加载更多
collect_img_loading = false;
collect_img_page = 2;
collect_img_post_list=$('.wuju-collect-img-content');
$('.wuju-collect-img-content.infinite-scroll').on('infinite',function(){
if(collect_img_loading) return;
collect_img_loading = true;
collect_img_post_list.after(wuju.loading_post);
type=$('.wuju-collect-tab li.on').attr('type');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/collect-img.php",
data: {page:collect_img_page,type:type,load_type:'more'},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
collect_img_loading = true; 
}else{
collect_img_post_list.append(msg);
wuju_lightbox()
collect_img_page++;
collect_img_loading = false;  
} 
}
});
});
});