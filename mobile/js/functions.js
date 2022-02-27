document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/post.js?ver=123'></script>");//文章相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/login.js'></script>");//登录相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/chat.js'></script>");//聊天相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/comment.js'></script>");//评论相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/publish.js'></script>");//发布相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/recharge.js'></script>");//发布相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/shop.js'></script>");//商城相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/jquery.fancybox.min.js'></script>");//图片灯箱
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/mobile/js/edit.js'></script>");//编辑

//置顶内容：全局置顶==板块置顶==主页置顶==推荐==加精
function wuju_sticky(post_id,bbs_id,type,obj){
layer.closeAll();
layer.open({
content: '你确定要'+$(obj).children('p').html()+'吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/commend-post.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1||msg.code==2){
$(obj).html(msg.html);
}else if(msg.code==3){//打开开通会员页面
function c(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
}
}
});
layer.close(index);
}
});
}



//删除动态内容
function wuju_delete_post(post_id,obj,type){
layer.closeAll();
layer.open({
content: '你要删除这个内容吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/delete/post.php",
data: {post_id:post_id,type:'post'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
if(type=='single'){
history.back(-1);	
}
$('.wuju-post-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});

}
}
});

layer.close(index);
}
});
}

//刷新内容时间
function wuju_reload_post(post_id){
layer.closeAll();
layer.open({
content: '你确定要刷新该内容吗？<br><font style="color: #f44336;">刷新之后，内容的时间变更为当前的时间</font>'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/reload-post.php",
data: {post_id:post_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
}
});
layer.close(index);
}
});
}


//采纳答案
function wuju_answer_adopt(obj,post_id){
this_dom=$(obj);
comment_id=$(obj).attr('data');
layer.open({
content: '你要采纳这个答案吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/answer.php",
data: {comment_id:comment_id,post_id:post_id,type:'adopt'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function a(){layer.closeAll();}setTimeout(a,2000); 
this_dom.parent().siblings('.content').prepend('<i class="wuju-icon wuju-yicaina"></i>');
$('.wuju-single-comment-list-'+post_id+' .footer span.answer').remove();
// $('.wuju-bbs-single-footer .add').remove();
$('.wuju-post-'+post_id+' h1 .wuju-bbs-post-type-answer').addClass('ok').html('');
}	
}
});
}
});
}

//删除帖子内容
function wuju_delete_bbs_post(post_id,bbs_id,obj,type){
layer.closeAll();
layer.open({
content: '你要删除这个内容吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/delete/post.php",
data: {post_id:post_id,bbs_id:bbs_id,type:'bbs'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
if(type=='single'){
history.back(-1);	
}
$('.wuju-post-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});

}
}
});

layer.close(index);
}
});
}

//删除动态评论
function wuju_delete_post_comments(comment_id,obj){//我的评论页面
layer.open({
content: '你确定要删除该评论？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:  wuju.wuju_ajax_url+"/delete/comment.php",
data: {comment_id:comment_id,type:'post'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){//成功
comment_dom=$(obj).parent('.footer');
comment_dom.siblings('.wuju-comment-image-list').remove();
comment_dom.siblings('.content').html(msg.delete_content);
$(obj).remove();
}
}
});
}
}); 
}

//删除一级/二级回帖
function wuju_delete_bbs_post_comments(comment_id,bbs_id,type,obj){
layer.open({
content: '你确定要删除该评论？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:  wuju.wuju_ajax_url+"/delete/comment.php",
data: {comment_id:comment_id,type:type,bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).parents('.wuju-comment-'+comment_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function() {
$(this).remove();
});
});
}
}
});
}
}); 
}



//喜欢内容
function wuju_like(post_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}

like_num=$('.wuju-post-'+post_id+' .footer .like_num');
like_dom=$('.wuju-post-'+post_id).children('.footer').find('i.like');
user_id=wuju.user_id;
avatar=wuju.avatar;

if($(obj).children('i').hasClass('had')){
like_num.html(parseInt(like_num.html())-1); 
like_dom.removeClass('wuju-xihuan1 had').addClass('wuju-xihuan2');   
$('.wuju-post-'+post_id+' .footer').next('.wuju-post-like').children('#had_like_'+user_id).remove();

}else{
audio=document.getElementById('wuju-like-up-music');
audio.play();
like_num.html(parseInt(like_num.html())+1); 
like_dom.removeClass('wuju-xihuan2').addClass('wuju-xihuan1 had');   
$('.wuju-post-'+post_id+' .footer').next('.wuju-post-like').prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+'</a>');  
layer.open({content:'喜欢成功！',skin:'msg',time:2});
}

$.ajax({   
url:wuju.wuju_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},
success: function(msg){
if(msg.author_id){

ws.send('{"from_url":"'+wuju.home_url+'","type":"like_post","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');

}
}
}); 

}


function wuju_select_like(post_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}

like_num=$(obj).children('span');
if($(obj).children('i').hasClass('had')){
like_num.text(parseInt(like_num.text())-1); 
$(obj).children('i').removeClass('wuju-xihuan1 had').addClass('wuju-xihuan2'); 
}else{
like_num.text(parseInt(like_num.text())+1); 
$(obj).children('i').removeClass('wuju-xihuan2').addClass('wuju-xihuan1 had');
}

$.ajax({   
url:wuju.wuju_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},
success: function(msg){
if(msg.author_id){

ws.send('{"from_url":"'+wuju.home_url+'","type":"like_post","notice_user_id":"'+msg.author_id+'"}');

}
}
});

}




//打开@链接
function wuju_post_link(obj){
type=$(obj).attr('type');
if(type=='at'){
user_id=$(obj).attr('user_id');
if(user_id==wuju.user_id){
myApp.getCurrentView().router.loadPage(wuju.theme_url+'/mobile/templates/page/member-mine.php?author_id='+user_id);
}else{
myApp.getCurrentView().router.loadPage(wuju.theme_url+'/mobile/templates/page/member-other.php?author_id='+user_id);    
}
}else if(type=='link'){
window.open($(obj).attr('data'));  
}
}


//喜欢音乐
function wuju_like_music(obj){
post_id=$('.wuju-player-footer-btn .play').attr('post_id');

like_num=$('.wuju-post-'+post_id+' .footer .like_num');
like_dom=$('.wuju-post-'+post_id).children('.footer').find('i.like');
user_id=wuju.user_id;
avatar=wuju.avatar;

if($(obj).hasClass('wuju-xihuan2')){
$(obj).removeClass('wuju-xihuan2').addClass('wuju-xihuan1');

like_num.html(parseInt(like_num.html())+1); 
like_dom.removeClass('wuju-xihuan2').addClass('wuju-xihuan1 had');   
$('.wuju-post-'+post_id+' .footer').next().prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+'</a>'); 
layer.open({content:'喜欢成功！',skin:'msg',time:2});
}else{
$(obj).removeClass('wuju-xihuan1').addClass('wuju-xihuan2');    

like_num.html(parseInt(like_num.html())-1); 
like_dom.removeClass('wuju-xihuan1 had').addClass('wuju-xihuan2');   
$('.wuju-post-'+post_id+' .footer').next().children('#had_like_'+user_id).remove();
}

$.ajax({   
url:wuju.wuju_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},    
success:function(results){}   
});
}



//签到
function wuju_sign(obj,ticket,randstr){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/sign.php",
data: {sign:1,ticket:ticket,randstr:randstr},
dataType:'json',
success: function(msg){ 
myApp.hideIndicator();
if(msg.code==0){//签到失败
layer.open({content:msg.msg,skin:'msg',time:2});
}else if(msg.code==1||msg.code==2){//已经签到|签到成功
audio=document.getElementById('wuju-sign-music');
audio.play();
layer.open({
content:'<div class="wuju-sign-success-form">'+msg.content+'</div>'
});

$(obj).addClass('had').html(msg.text_mobile);
$(obj).parent().prev().find('span').html(msg.sign_c);
month_day=parseInt($('.wuju-sign-page-month-days span').text());
$('.wuju-sign-page-month-days span').html(month_day+1);
$('.wuju-mine-page .list-block li.sign .item-after').html('累计'+msg.sign_c+'天');
$('.wuju-sign-page-content tbody td.today').removeClass('no-sign').addClass('had-sign').children('span').append('<i class="wuju-icon wuju-dagou"></i>');
$('#sign-1').after($('#sign-1').clone());
$('.wuju-sign-header .right .btn.had').first().remove();
}else if(msg.code==8){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==9){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
});
}


//补签表单
function wuju_sign_add_form(day){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/sign-add.php",
data:{day:day},
success: function(msg){
myApp.hideIndicator();
layer.open({
content:'<div class="wuju-sign-add-form">'+msg+'</div>'
});
}
});
}

//补签
function wuju_sign_add(day){
if(!wuju.is_login){
layer.closeAll();
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/sign-add.php",
data:{day:day},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({
content:'<div class="wuju-sign-success-form">'+msg.content+'</div>'
});

//前端渲染
$('.wuju-sign-header .left p:first-child span').text(msg.sign_c);
$('.wuju-mine-page .list-block li.sign .item-after').html('累计'+msg.sign_c+'天');
$('.wuju-sign-page-all-days span').html(msg.sign_c);
month_day=parseInt($('.wuju-sign-page-month-days span').text());
$('.wuju-sign-page-month-days span').html(month_day+1);
$('#wuju-sign-day-'+day).removeClass('no-sign').addClass('had-sign').children('span').html(day+'<i class="wuju-icon wuju-dagou"></i>');

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});
}


//查看签到宝箱
function wuju_sign_treasure_form(number){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/sign-treasure.php",
data:{number:number},
success: function(msg){
myApp.hideIndicator();
layer.open({
content:'<div class="wuju-sign-treasure-form">'+msg+'</div>'
});
}
});	
}


//领取宝箱奖励
function wuju_sign_treasure(number,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/sign-treasure.php",
data:{number:number},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
audio=document.getElementById('wuju-sign-music');
audio.play();
layer.open({
content:'<div class="wuju-sign-success-form">'+msg.content+'</div>'
});

//前端渲染
$(obj).addClass('had').html('已领取').removeAttr('onclick');
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});
}








//关注
function wuju_follow(author_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/follow.php",
data: {author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
follow_dom=$('.wuju-follow-'+author_id);
if(msg.code==1){//取消关注
follow_dom.removeClass('had');  
follow_dom.html('<i class="wuju-icon wuju-guanzhu"></i>关注');

}else if(msg.code==2||msg.code==3){
if(msg.code==2){//关注成功
audio=document.getElementById('wuju-follow-music');
audio.play();
follow_dom.addClass('had');
follow_dom.html('<i class="wuju-icon wuju-yiguanzhu"></i>已关');

if($(obj).hasClass('follow-see')){
function d(){window.open($(obj).attr('data'),'_self');}setTimeout(d,1000);
}
}
if(msg.code==3){//相互关注成功
audio=document.getElementById('wuju-follow-music');
audio.play();
follow_dom.addClass('had');
follow_dom.html('<i class="wuju-icon wuju-xianghuguanzhu"></i>互关');    
}

if(msg.author_id){

ws.send('{"from_url":"'+wuju.home_url+'","type":"follow","notice_user_id":"'+msg.author_id+'"}');

}

}

}
}); 
}



//动态播放视频
function wuju_play_video(post_id,video_url,obj){
post_id=parseInt(Math.random() * (999999 - 9999 + 1) + 9999);
$(obj).before('<div id="wuju-video-'+post_id+'" post_id="'+post_id+'"></div>');
$(obj).remove();
video_type=wuju_video_type(video_url);
window['video_'+post_id]=new window[video_type]({
id:'wuju-video-'+post_id,
url:video_url,
'x5-video-player-type': 'h5',
'x5-video-player-fullscreen': false,
playbackRate: [0.5,1,1.5,2,6],
fitVideoSize:'fixWidth',
playsinline: true,
autoplay:true,
ignores: ['volume','pc'],
closeVideoTouch: true,
rotate:{
innerRotate: true, //只旋转内部video
clockwise: false // 旋转方向是否为顺时针
}
});
window['video_'+post_id].on('play',function(){
if($('.wuju-video-playing').length>0){
current_post_id=$('.wuju-video-playing').attr('post_id');
window['video_'+current_post_id].pause();
}

$('#wuju-video-'+post_id).addClass('wuju-video-playing');
})
window['video_'+post_id].on('pause',function(){
$('#wuju-video-'+post_id).removeClass('wuju-video-playing');
})
}

//获取视频播放类型
function wuju_video_type(video_url){
var index1=video_url.lastIndexOf(".");
var index2=video_url.length;
var type=video_url.substring(index1,index2);
if(type=='.m3u8'){
return 'HlsJsPlayer';
}else if(type=='.flv'){
return 'FlvJsPlayer';
}else{
return 'Player';	
}
}




//拉黑
function wuju_add_blacklist(type,author_id,obj){
layer.closeAll();
if(type=='add'){
title='你要将对方加入黑名单吗？';	
}else{
title='你要将对方移出黑名单吗？';		
}
layer.open({
content:title
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/add-blacklist.php",
data: {author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).html('拉黑').attr('onclick','wuju_add_blacklist("add",'+author_id+',this)');	
}else if(msg.code==2){
$(obj).html('取消拉黑').attr('onclick','wuju_add_blacklist("remove",'+author_id+',this)');	
}
}
});
}
});

}


//标为已读
function wuju_chat_set_hadread(author_id,obj){
$(obj).parent().prev().find('.tips').remove();

//将底部数量减少
all_tips=parseInt($('.wuju-xiaoxizhongxin .badge').html());
this_tips=parseInt($(obj).find('.badge').html());
now_tips=all_tips-this_tips;
if(now_tips){//如果还有未读消息
$('.wuju-xiaoxizhongxin .badge').html(now_tips);	
}else{
$('.wuju-xiaoxizhongxin .badge').remove();
}

$.ajax({   
url:wuju.wuju_ajax_url+"/action/read-msg.php",
type:'POST',   
data:{author_id:author_id},    
});
}




//查看密码动态
function wuju_post_password(post_id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.prompt('请输入查看密码', 
function (password){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/password-post.php",
data: {post_id:post_id,password:password},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function d(){window.open(msg.url,'_self');}setTimeout(d,1500);
}
}
});
}
);
}


//购买付费内容
function wuju_buy_post_form(post_id){
if(!wuju.is_login){
myApp.closeModal();
myApp.loginScreen();  
return false;
}
myApp.closeModal();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/post-buy.php?post_id='+post_id});
}


//查看全文
function wuju_moren_content(obj){
if($(obj).prev().hasClass('hidden')){
$(obj).prev().removeClass('hidden');
$(obj).html("收起内容");
}else{
$(obj).prev().addClass('hidden');
$(obj).html("查看全文");
}
}


//购买付费内容
function wuju_pay_for_visible(post_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/pay-for-visible.php",
dataType:'json',
data: {post_id:post_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).removeAttr('onclick');
function a(){history.back(-1);}setTimeout(a,1000);

ws.send('{"from_url":"'+wuju.home_url+'","type":"buy","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');

myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/hidden-content.php",
dataType:'json',
data: {post_id:post_id,type:'pay'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
if(msg.video_url){//视频
$('.wuju-post-'+post_id+' .wuju-video-tips').after('<div onclick=\'wuju_play_video("'+post_id+'-single","'+msg.video_url+'",this)\' class="wuju-video-img" style="background-image: url('+msg.video_cover+');"><i class="wuju-icon wuju-bofang-"></i></div>');
$('.wuju-post-'+post_id+' .wuju-video-tips').remove();
}else{//动态、文章、帖子
if(msg.hidden){
$('.wuju-tips-'+post_id).after('<div class="wuju-hide-content"><p>'+msg.hidden+'</p></div>');
}
$('.wuju-tips-'+post_id).remove();
if(msg.img){
$('.wuju-post-'+post_id+' .wuju-post-images-list').html(msg.img);
}
}

}
}
});


}else if(msg.code==3){//弹出金币充值窗口
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});
}else if(msg.code==8){//弹出余额充值窗口
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-money.php'});
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
});    
}


//关注论坛
function wuju_bbs_like(bbs_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/bbs-like.php",
data: {bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){//关注成功
audio=document.getElementById('wuju-follow-music');
audio.play();
$(obj).removeClass('no').addClass('had');
$(obj).html('<i class="wuju-icon wuju-yiguanzhu"></i> 已关');  


if($('.wuju-bbs-like-content.publish').length>0){//如果在发表界面

html='<li id="wuju-bbs-like-'+bbs_id+'">\
<div class="item-content">\
<div class="item-media">\
<a href=\'javascript:wuju_publish_power("bbs",'+bbs_id+',"")\' class="link">\
'+msg.bbs_avatar+'\
</a>\
</div>\
<div class="item-inner">\
<div class="item-title">\
<a href=\'javascript:wuju_publish_power("bbs",'+bbs_id+',"")\' class="link">\
<div class="name">'+msg.bbs_name+'</div>\
<div class="desc">'+msg.bbs_desc+'</div>\
</a>\
</div></div></div>\
</li>';

if($('.wuju-bbs-like-content.publish .wuju-empty-page').length>0){
$('.wuju-bbs-like-content.publish').html('<div class="wuju-chat-user-list bbs-commend list-block">'+html+'</div>');
}else{
$('.wuju-bbs-like-content.publish .wuju-chat-user-list').prepend(html);
}
}//如果在发表界面

//消息界面实时添加
$('#wuju-chat-tab-group .wuju-chat-user-list').prepend('<li class="swipeout chat wuju-chat-group-'+bbs_id+'" id="wuju-chat-group-'+bbs_id+'">\
<div class="swipeout-content item-content" onclick="wuju_open_group_chat('+bbs_id+')">\
<div class="item-media">'+msg.bbs_avatar+'</div>\
<div class="item-inner">\
<div class="item-title">\
<div class="name">'+msg.im_name+'</div>\
<div class="desc">'+msg.im_notice+'</div>\
</div>\
</div>\
</div>\
<div class="swipeout-actions-right"><a href="#" class="swipeout-delete">取消关注</a></div>\
</li>');

}else{//取消关注
$(obj).removeClass('had').addClass('no');  
$(obj).html('<i class="wuju-icon wuju-guanzhu"></i> 关注');  

$('#wuju-bbs-like-'+bbs_id).remove();//移除我关注的论坛
$('.wuju-chat-group-'+bbs_id).remove();//移除消息里面我关注的论坛

}
}
}); 
}


//打赏
function wuju_reward(post_id,type,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
number=$(obj).attr('data');
myApp.showIndicator();
$.ajax({   
url:wuju.wuju_ajax_url+"/action/reward.php",
type:'POST',   
data:{number:number,post_id:post_id,type:type},    
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){


ws.send('{"from_url":"'+wuju.home_url+'","type":"reward","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');


function d(){history.back(-1);}setTimeout(d,1000);	
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,1600);



// myApp.getCurrentView().router.back();

// comment_num=$('.wuju-post-'+post_id+' .footer .comment_number');
// comment_num.html(parseInt(comment_num.html())+1); 
// $('.wuju-post-'+post_id).next('.wuju-single-comment').children('.header').find('span').html(parseInt(comment_num.html()));
// $('.wuju-post-'+post_id).parent().prev().find('.number').html(parseInt(comment_num.html())+'条评论');
// comment_list=$('.wuju-single-comment-list-'+post_id);
// comment_list.prepend('\
// <div class="wuju-comment-'+msg.id+'">\
// <div class="up" onclick="wuju_comment_up('+msg.id+',this)"><i class="fa fa-thumbs-o-up"></i><m>0</m></div>\
// <div class="header clear">\
// <div class="avatarimg">'+wuju.avatar+wuju.verify+'</div>\
// <div class="info">\
// <div class="name">'+wuju.nickname+wuju.lv+wuju.vip+'</div>\
// <div class="from"><span class="time">刚刚</span><span>手机端</span></div>\
// </div>\
// </div>\
// <div class="content"><m class="reward"><span class="wuju-redbag-icon"></span>打赏了'+number+wuju.credit_name+'。</m></div>\
// <div class="footer clear">\
// <span class="comment">\
// <a href="'+wuju.theme_url+'/mobile/templates/page/comment.php?post_id='+post_id+'&name='+wuju.nickname_base+'" class="link">回复</a>\
// </span>\
// </div>\
// </div>\
// ');



}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
});
}



//提交卡密兑换
function wuju_keypay(){
key=$('#wuju-pop-key').val();
if(key==''){
layer.open({content:'请输入卡密！',skin:'msg',time:2});
return false;	
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/key-use.php",
data:{key:key},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#wuju-pop-key').val('');
myApp.getCurrentView().router.back();
if(msg.type=='credit'){
current_credit=parseInt($('.wuju-mywallet-header .number span').html());
recharge_credit=parseInt(msg.number);
$('.wuju-mywallet-header .number span').html(current_credit+recharge_credit);
}
}
}
});	
}



//大转盘
function wuju_lottery(obj){
if($(obj).hasClass('on')){
return false;
}

number=$('#wuju-lottery-money').val();
if(number==''){
layer.open({content:'请输入下注金额！',skin:'msg',time:2});
return false;	
}
$(obj).addClass('on').html('抽奖中...');

//点击抽奖，然后ajax后台获取json数据，返回来抽奖的角度。
$.ajax({   
url:wuju.mobile_ajax_url+"/action/lottery.php",
dataType:'json',
type:'POST',   
data:{number:number},    
success:function(msg){

if(msg.code==0){
$(obj).removeClass('on').html('开始翻倍');
layer.open({content:msg.msg,skin:'msg',time:2});	
}else{

$('.wuju-lottery-arrow').rotate({
duration:5000,//转动时间
angle: 0,//起始角度
animateTo:1440+msg.rand,//结束的角度
callback: function(){
$(obj).removeClass('on').html('开始翻倍');
layer.open({content:msg.msg,skin:'msg',time:2});//简单的弹出获奖信息

lottery_times=parseInt($('.wuju-lottery-info .times span').html());
$('.wuju-lottery-info .times span').html(lottery_times-1);

count_money=parseInt($('.wuju-lottery-info .credit span').html());
$('.wuju-lottery-info .credit span,.wuju-mywallet-header .number span,.wuju-mine-list-credit').html(count_money+msg.count-number);


}
});
}


}   
});


}

//====================================设置类===================

//上传头像菜单
function wuju_upload_avatar_menu(obj,user_id){
var buttons1 = [{text: '查看头像',onClick:function(){

avatar_url=$(obj).find('img').attr('src');
show_avatar = myApp.photoBrowser({
photos : [avatar_url],
theme:'dark',
toolbar:false,
type:'popup',
});
show_avatar.open();	
}},
{text: '上传头像',onClick:function(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/upload-avatar.php?user_id='+user_id});
}}];
var buttons2 = [{text: '取消',color:'red'}
];
var groups = [buttons1, buttons2];
myApp.actions(groups);
}





//查看二维码
function wuju_show_user_code(user_id){
url=wuju.member_url_permalink+wuju.referral_link_name+'='+user_id;
html='<div class="popup wuju-publish-type-form profile-qrcode"><div class="page-content"><div id="wuju-qrcode"></div><p class="tips">扫码加关注我</p><div class="close"><a href="#" class="link icon-only close-popup"><i class="wuju-icon wuju-xiangxia2"></i></a></div>';
myApp.popup(html);
wuju_qrcode('wuju-qrcode',200,200,url);
}

//修改昵称
function wuju_update_nickname_form(author_id,obj){
myApp.prompt('', function (value) {
myApp.showIndicator();
$.ajax({
type:"POST",
url:wuju.wuju_ajax_url+"/update/nickname.php",
data:{nickname:value,author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).find('.value').html(msg.nickname);

if(msg.self){//管理团队修改自己资料或者普通用户修改自己资料
if($('.wuju-mine-page .list-block li .item-title .name font').length>0){
$('.wuju-mine-page .list-block li .item-title .name font').html(msg.nickname);	
}else{
$('.wuju-mine-page .list-block li .item-title .name').html(msg.nickname);	
}
}

}
}
});	
});
$('.modal-text-input').val($(obj).find('.value').html()).focus();
}



//修改资料==管理员
//update_type=='admin' 管理员修改
function wuju_update_profile(author_id,type,obj,update_type){
if(update_type=='admin'){
url='profile-admin.php';
}else{
url='profile.php';
}
myApp.prompt('', function (value) {
myApp.showIndicator();
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/"+url,
data:{value:value,author_id:author_id,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).find('.value').html(value);
}
}
});	
});
$('.modal-text-input').val($(obj).find('.value').html()).focus();	
}

//修改个人说明
function wuju_update_desc(author_id){
description=$('#wuju-setting-desc').val();
myApp.showIndicator();
$.ajax({
type:"POST",
url:wuju.wuju_ajax_url+"/update/profile.php",
data:{author_id:author_id,description:description,mobile:1},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('.wuju-setting-box li.desc .value').html(description);
history.back(-1);//返回上一页
}
}
});	
}




//搜索
function wuju_search(keyword){
search_loading = false;
search_page=2;
keyword=$.trim(keyword);
if(keyword==''){
layer.open({content:'请输入搜索关键词！',skin:'msg',time:2});	
return false;
}
type=$('.wuju-search-post-list').attr('type');
$('.wuju-search-tab').show();
$('.wuju-search-content').addClass('result');
$('.wuju-search-hot,.wuju-pop-search-bbs,.wuju-pop-search-topic,.wuju-search-custom-html').remove();
$('#wuju-search').val(keyword);
wuju_search_js(keyword,type);
}

//搜索
function wuju_search_post(type,obj){
search_loading = false;
search_page=2;
$(obj).addClass('on').siblings().removeClass('on');
keyword=$.trim($('#wuju-search').val());
if(keyword==''){
layer.open({content:'请输入搜索关键词！',skin:'msg',time:2});	
return false;
}
$('.page-content').animate({ scrollTop: 0 },0);
list.attr('type',type);

wuju_search_js(keyword,type);
}


function wuju_search_js(keyword,type){
data_=$('.wuju-search-tab li.on').attr('data');
list=$('.wuju-search-post-list');
list.prepend(wuju.loading_post);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/post/search.php",
data:{keyword:keyword,type:type,page:1,data_:data_},
success: function(msg){
if(msg!=0){
list.html(msg);
}else{
list.html('<div class="wuju-empty-page">没有更多内容</div>');	
}
}
});	


//加载更多
search_loading = false;
search_page=2;
search_post_list=$('.wuju-search-post-list');
$('.wuju-search-content.infinite-scroll').on('infinite',function(){
search_type=$('.wuju-search-tab li.on').attr('type');
if(search_type=='user'||search_type=='forum'||search_type=='topic') return;
if (search_loading) return;
search_loading = true;
search_post_list.after(wuju.loading_post);
keyword=$.trim($('#wuju-search').val());
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/search.php",
data: {keyword:keyword,type:search_type,page:search_page,data_:data_},
success: function(msg){
if(msg!=0){
search_post_list.append(msg);
search_loading = false; 
search_page++;
}else{
search_loading = true; 
}
$('.wuju-load-post').remove();
}
});


});


}


//关注话题
function wuju_topic_like(topic_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
n=parseInt($(".wuju-topic-page-header .info .number span:nth-child(2) i").html());
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/topic-like.php",
data: {topic_id:topic_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
audio=document.getElementById('wuju-follow-music');
audio.play();
$(obj).addClass("had").html('<i class="wuju-icon wuju-yiguanzhu"></i> 已 关');
n++;	
}else if(msg.code==2){
$(obj).removeClass("had").html('<i class="wuju-icon wuju-guanzhu"></i> 关 注');
n--;	
}
$(".wuju-topic-page-header .info .number span:nth-child(2) i").text(n); 
}
});

}


//打开赠送礼物页面
function wuju_send_gift_page(author_id,post_id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/send-gift.php?author_id='+author_id+'&post_id='+post_id});
}


//送礼物
function wuju_send_gift(author_id,post_id){
if($('.wuju-send-gift-form li.on').length==0){
layer.open({content:'请选择需要赠送的礼物！',skin:'msg',time:2});	
return false;
}
name=$('.wuju-send-gift-form li.on .top .name').text();

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/send-gift.php",
data: {name:name,author_id:author_id,post_id:post_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

ws.send('{"from_url":"'+wuju.home_url+'","type":"gift","notice_user_id":"'+author_id+'","notice_user_name":"'+msg.notice_user_name+'","do_user_id":"'+wuju.user_id+'","do_user_name":"'+msg.do_user_name+'","do_user_avatar":"'+msg.do_user_avatar+'","content":"'+msg.content+'","message":"'+msg.gift_name+'"}');

if(post_id){
function d(){history.back(-1);}setTimeout(d,1000);	
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,1600);
}else{
function c(){history.back(-1);}setTimeout(c,2000);
}
}
}
});
}

//投票
function wuju_bbs_vote(post_id){
i=0;
data = [];
$(".wuju-bbs-vote-form input").each(function(){
if($(this).is(':checked')){
data.push(i+1);	
}
i++;
});

if(data.length>0){
data_arr = data.join(",");
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/vote.php",
data: {post_id:post_id,vote:data_arr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
myApp.getCurrentView().router.refreshPage();
//function d(){window.location.reload();}setTimeout(d,1500);	
}

}
});
}else{ //判断是否选择了投票选项
layer.open({content:'请至少选择一项进行投票！',skin:'msg',time:2});
}
}


//清除未读消息===
function wuju_clear_notice(){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/notice-clear.php",
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});	
if(msg.code==1){
$('.wuju-chat .tips,.toolbar .tips,.wuju-mine-box li.notice .tips').remove();
}
}
});
}

//提交选择头衔
function wuju_use_honor(user_id){
dom=$('.wuju-user_honor-select-form .list li.on');
if(dom.length==0){
layer.open({content:'请选择要使用的头衔！',skin:'msg',time:2});	
return false;
}
honor=dom.text();
myApp.showIndicator();
$.ajax({   
url:wuju.wuju_ajax_url+"/action/use-honor.php",
type:'POST', 
data:{user_id:user_id,honor:honor},
success:function(msg){
myApp.hideIndicator();
if(msg.code==1){
$('.wuju-setting-box li.honor .value').text(msg.honor);
function d(){window.location.reload();}setTimeout(d,1500);
layer.open({content:msg.msg,skin:'msg',time:2});	
}else{
layer.open({content:msg.msg,skin:'msg',time:2});	
}
}   
});
}


//每日领取成长值
function wuju_get_vip_number(obj){
myApp.showIndicator();
$.ajax({   
url:wuju.wuju_ajax_url+"/action/get-vip-number.php",
type:'POST', 
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).addClass('had').html('今日已领取成长值');
}else if(msg.code==2){
$(obj).addClass('had').html('今日已领取成长值');	
old_number=parseInt($('.wuju-vip-page-header-card .info span m').text());
new_number=parseInt(msg.number)+old_number;
$('.wuju-vip-page-header-card .info span m').text(new_number);
}
}   
});

}


//报名
function wuju_activity(post_id){
if($(".wuju-activity-form-list li").children('.item').val()==''){
layer.open({content:'内容不能为空！',skin:'msg',time:2});
return false;	
}
// if($(".wuju-activity-form-list li").children('.upload').val()==''){
// layer.open({content:'请上传内容！',skin:'msg',time:2});
// return false;	
// }

data='<div class="wuju-bbs-comment-activity">';
$(".wuju-activity-form-list li").each(function(){
data+='<li>';
data+='<label>'+$(this).children('label').html()+'</label>';
value=$(this).children('.item').val();
if($(this).children('.item').hasClass('upload')){
data+='<div class="content"><a href="'+value+'" target="_blank" download="" class="wuju-post-link"><i class="fa fa-link"></i> 附件下载</a></div>';
}else{
data+='<div class="content">'+value+'</div>';	
}
data+='</li>';
});
data+='</div>';

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/activity.php",
data: {content:data,post_id:post_id},
success: function(msg){	
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
myApp.getCurrentView().router.back();
// myApp.getCurrentView().router.refreshPage();
$('.wuju-post-'+post_id+' .wuju-bbs-activity-btn').addClass('no').removeAttr('onClick').html('你已经参与');
}else if(msg.code==2){//没有绑定手机号
function d(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});}setTimeout(d,2000);
}
}
});

}


//获取文件后缀
function wuju_get_file_type(filename){
var index1=filename.lastIndexOf(".");
var index2=filename.length;
var type=filename.substring(index1,index2);
return type;
}


//内容更多操作
function wuju_post_more_form(post_id,bbs_id,type){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/stencil/post-more.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){	
myApp.hideIndicator();
layer.open({
type: 1,
content:msg,
anim: 'up',
style:'position:fixed;bottom:2vw;left:2vw;width:96vw;border:none;box-sizing:border-box;border-radius:2vw;padding:2vw;'
});	

//复制侧栏分享链接
var clipboard = new ClipboardJS('#wuju-copy-share-link');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});

}
});
}


//切换排行榜数据
function wuju_leaderboard_data(post_id,obj){
$(obj).addClass('on').siblings().removeClass('on');
$('.wuju-leaderboard-content').prepend(wuju.loading_post);
$('.wuju-leaderboard-page-content').animate({scrollTop: 0 },0);
number=$(obj).index();
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/stencil/leaderboard.php",
data: {post_id:post_id,number:number},
success: function(msg){	
audio=document.getElementById('wuju-reload-music');
audio.play();
$('.wuju-leaderboard-content').html(msg);
}
});
}

//快捷回复
function wuju_quick_reply(a,obj){
content=$(obj).parent().next().children('textarea');
content.val(content.val()+a);
}

//快捷插入表情
function wuju_add_smile(a,type,obj){//普通
if(type=='im-one'){//单聊
content=$('#wuju-msg-content');
}else if(type=='im-group'){//群聊
content=$('#wuju-msg-group-content');
}else{
content=$('.wuju-smile-textarea');	
}
content.val(content.val()+a);
layer.closeAll();
}

//保释黑名单用户
function wuju_blacklist_bail(author_id,credit,obj){
layer.open({
content: '你确定要花费'+credit+'保释吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/blacklist-bail.php",
data:{author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).parents('li').remove();
}
}
}); 
layer.close(index);
}
});	
}

//幸运抽奖
function wuju_luck_start(post_id,text,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
$(obj).text('抽奖中...');
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/luck-draw.php",
data:{post_id:post_id},
success: function(msg){
layer.open({content:msg.msg,skin:'msg',time:2});
$(obj).text('开始抽奖 ('+text+')');
if(msg.code==1){

if(msg.author_id){

ws.send('{"from_url":"'+wuju.home_url+'","type":"luck_draw","notice_user_id":"'+msg.author_id+'","do_user_id":"'+msg.author_id+'","content":"'+msg.content+'"}');

}

$('.wuju-luck-draw-current-credit .credit span').html(msg.credit);
$('.wuju-luck-draw-current-credit .ticket span').html(msg.ticket);
if($('.wuju-luck-draw-list .a .wuju-empty-page').length>0){
$('.wuju-luck-draw-list .a').empty();
}
$('.wuju-luck-draw-list .a').prepend("<li><span class='img' style='background-image:url("+msg.cover+")'></span><span class='name'>"+msg.name+"</span></li>");
$('.wuju-luck-draw-cover .img').css('background-image','url('+msg.cover+')');
$('.wuju-luck-draw-cover .img .name').html(msg.name);
}
}
});

}


//提现
function wuju_cash(){
number=$('#wuju-cash-number').val();
type=$('.wuju-cash-form-content .type m.on').attr('type');
name=$('#wuju-cash-name').val();
alipay=$('#wuju-cash-alipay-phone').val();
wechat=$('#wuju-cash-wechat-phone').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/cash.php",
data:{number:number,type:type,name:name,alipay:alipay,wechat:wechat},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('.wuju-cash-form-content').html('<div class="wuju-cash-form-end"><i class="wuju-icon wuju-zhifuchenggong"></i><p>已提交申请，等待审核中</p></div>');
}
}
});
}


//驳回内容
//where:暂时无效
function wuju_content_management_refuse(post_id,bbs_id,where,obj){
layer.closeAll();
myApp.prompt('请输入驳回的原因', function (reason) {
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/content-management.php",
data:{post_id:post_id,bbs_id:bbs_id,type:'refuse',reason:reason,where:1},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

if(where=='single'){
history.back(-1);	
}
$('.wuju-post-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});

}
}
});
});
}

//打开转发页面
function wuju_reprint_form(post_id){
layer.closeAll();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/reprint.php?post_id='+post_id});
}

//转发
function wuju_reprint(post_id){
content = $('#wuju-reprint-value').val();
comment_a=$('#wuju-reprint-check-a').is(':checked');
comment_b=$('#wuju-reprint-check-b').is(':checked');
if($('#wuju-reprint-check-b').length>0){
type='b';
}else{
type='a';
}

if(content==''){content='转发了';}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/reprint.php",
data: {content:content,post_id:post_id,comment_a:comment_a,comment_b:comment_b,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,2000);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}
}
});

}


//抢红包
function wuju_get_redbag(post_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/get-redbag.php?post_id='+post_id});
$('.wuju-redbag-'+post_id).find('.tips').addClass('no').text('已打开');
}


//切换马甲
function wuju_exchange_majia(majia_user_id){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/majia.php",
data:{majia_user_id:majia_user_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
}

//领取任务奖励
function wuju_task_finish(task_id,type,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/task.php",
data:{task_id:task_id,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
audio=document.getElementById('wuju-sign-music');
audio.play();
$(obj).addClass('had').removeClass('on').text('已领取');
$('.wuju-task-form-header .header .number n').text(msg.task);
$('.wuju-mine-page .list-block li.task .item-after n').text(msg.task);
}

}
});
}

//打开宝箱
function wuju_task_treasure_form(task_id){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/task-treasure.php?task_id='+task_id});	
}

//打开宝箱任务
function wuju_task_treasure(task_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/task-treasure.php",
data:{task_id:task_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
audio=document.getElementById('wuju-sign-music');
audio.play();
$(obj).addClass('had').text('已领取');
}
}
});
}


//访问密码论坛，输入密码
function wuju_bbs_visit_password(bbs_id){
pass=$('#wuju-bbs-visit-psssword').val();
if(pass==''){
layer.open({content:'请输入访问密码！',skin:'msg',time:2});
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.module_url+"/action/bbs-visit-password.php",
data: {bbs_id:bbs_id,pass:pass,visit:1},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({content:msg.msg,skin:'msg',time:2});
function d(){window.location.reload();}setTimeout(d,2000);
}else if(msg.code==3){
myApp.loginScreen(); 
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});
}

//更换语言
function wuju_change_language(obj,type){
$(obj).addClass('on').siblings().removeClass('on');
SetCookie('lang',type);
window.location.reload();
}


//付费访问论坛
function wuju_bbs_visit_pay(bbs_id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
layer.open({
content: '你确定要支付吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/bbs-visit-pay.php",
data:{bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==3){
function c(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});
}
setTimeout(c,1500);
}else if(msg.code==5){
function c(){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-money.php'});
}
setTimeout(c,1500);
}
}
});
}
});
}


//生成二维码
function wuju_qrcode(dom,width,height,link){
$('#'+dom).qrcode({
width:width,
height:height,
text:link
});
}

//打开海报页面
function wuju_content_playbill_page(post_id,url){
layer.closeAll();
myApp.getCurrentView().router.load({
url:wuju.theme_url+'/mobile/templates/page/playbill-content.php?post_id='+post_id,
query:{url:url}
});	
}

//打开推广海报页面
function wuju_referral_playbill_page(url){
layer.closeAll();
myApp.getCurrentView().router.load({
url:wuju.theme_url+'/mobile/templates/page/playbill-referral.php',
query:{url:url}
});	
}

//直播评论互动
function wuju_comment_live(post_id){
content=$.trim($('#wuju-live-comment-content').val());
myApp.showIndicator();
$.ajax({
type:"POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/comment-live.php",
data: {content:content,post_id:post_id},
success: function(msg) {
myApp.hideIndicator();
if(msg.code==1){//成功
$('#wuju-live-comment-content').val('');
comment_html='\
<li>\
<div class="left">'+msg.avatar+'</div>\
<div class="right">\
<div class="name">'+msg.nickname+'</div>\
<div class="content">'+msg.content+'</div>\
</div>\
</li>\
';
if($('.wuju-live-page-nav-list ul.comment-list .wuju-empty-page').length>0){
$('.wuju-live-page-nav-list ul.comment-list').html(comment_html);
}else{
$('.wuju-live-page-nav-list ul.comment-list').append(comment_html);
}
$('.wuju-live-page-nav-list').scrollTop($('.wuju-live-page-nav-list')[0].scrollHeight);//互动评论向下啦
count=parseInt($('.wuju-live-content').attr('count'));
$('.wuju-live-content').attr('count',count+1);


}else if(msg.code==2){//没有绑定手机号
layer.open({content:msg.msg,skin:'msg',time:2});
function d(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});}setTimeout(d,2000);
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
},
});
}


//直播精彩视频切换
function wuju_live_jingcai_video_play(url,obj){
$(obj).addClass('on').siblings().removeClass('on');
if($('.wuju-no-video-live').length>0){
$('.wuju-no-video-live').before('<div id="wuju-video-live"></div>');
$('.wuju-no-video-live').remove();
}
$('#wuju-video-live').empty();
video_type=wuju_video_type(url);
new window[video_type]({
id: 'wuju-video-live',
url: url,
autoplay: true,
playsinline: true,
'x5-video-player-type': 'h5',
'x5-video-player-fullscreen': false,
});
}



//打赏界面
function wuju_reward_form(post_id,type){
wuju_page('reward.php?post_id='+post_id+'&type='+type,1,'page');
}


//生成推广地址
function wuju_referral_url(obj){
$(obj).append('<i class="fa fa-spinner fa-spin"></i>');
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.mobile_ajax_url+"/action/referral-url.php",
success: function(msg){
myApp.hideIndicator();
$(obj).children('i').remove();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('.wuju-referral-url').show();
$('#wuju-referral-url-cover').html(msg.url);
// $(obj).remove();
}
}
});
}


//首页sns模块
function wuju_index_sns_js_load(){
wuju_lightbox();//图片灯箱

//首页下拉刷新
var ptrContent = $('.wuju-sns-page-content.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
myApp.pullToRefreshDone();
// $('.wuju-home-menu li.on').click();
type=$('.wuju-home-menu li.on').attr('type');
wuju_post(type,'pull','.wuju-home-menu li.on');
if($('[id^=wuju-view-notice]').length>0&&wuju.is_login){
wuju_index_notice_js_load();//加载消息页面
}

if($('.wuju-mine-box li.notice').length>0&&$('.toolbar .notice').length==0){//如果我的里面开启了消息、并且tab没有开启消息
$.ajax({   
url:wuju.wuju_ajax_url+"/action/notice-all.php",
type:'POST',    
success:function(msg){
if($.trim(msg)){
$('.wuju-mine-box li.notice i,.navbar i.tips').html('<m class="badge bg-red tips">'+msg+'</m>');
$('.toolbar .mine m').remove();
$('.toolbar .mine').prepend('<m class="badge bg-red tips">'+msg+'</m>');	
$('.navbar .notice-tips').html(msg);
}
}
});	
}


});



//首页加载更多内容
sns_loading = false;
sns_page = 2;
index_post_list=$('.wuju-post-list');
$('.wuju-sns-page-content.infinite-scroll').on('infinite',function(){
if(sns_loading) return;
sns_loading = true;
index_post_list.after(wuju.loading_post);
type=$('.wuju-home-menu li.on').attr('type');
data=$('.wuju-home-menu li.on').attr('data');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/data.php",
data: {page:sns_page,type:type,load_type:'more',data:data,index:$('.wuju-home-menu li.on').index()},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
sns_loading = true; 
}else{

index_post_list.append(msg);


wuju_lightbox()
sns_page++;
sns_loading = false;  

if($('.wuju-home-menu li.on').attr('waterfall')==1){//瀑布流渲染
var grid=$('.wuju-post-list-sns').masonry({
itemSelector:'li',
gutter:0,
transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});
}


} 
}
});
}); 
}

//消息页面js加载
function wuju_index_notice_js_load(){
$.ajax({   
url:wuju.mobile_ajax_url+"/stencil/notice-page.php",
type:'POST',    
success:function(msg){
$('.wuju-chat').html(msg);

wuju_update_notice_tips();//同步消息数

$('.wuju-chat-notice li').click(function(event){//消除红点
$(this).children('.tips').remove();
wuju_update_notice_tips();//同步消息数
});

}
});
}

//我的页面js加载
function wuju_index_mine_js_load(){
$.ajax({   
url:wuju.mobile_ajax_url+"/stencil/mine-page.php",
type:'POST',    
success:function(msg){
$('.wuju-mine-page').html(msg);

if($('.wuju-mine-box li.notice').length>0&&$('.toolbar .notice').length==0){
$.ajax({   
url:wuju.wuju_ajax_url+"/action/notice-all.php",
type:'POST',    
success:function(msg){
if($.trim(msg)){
$('.wuju-mine-box li.notice i').html('<span class="badge bg-red tips">'+msg+'</span>');	
$('.toolbar .mine m').remove();
$('.toolbar .mine').prepend('<m class="badge bg-red tips">'+msg+'</m>');	
}
}
});	
}

if($('.wuju-mine-box li.notice').length>0&&$('.toolbar .notice').length>0&&$('.toolbar .notice m').length>0){
count_tips=parseInt($('.toolbar .notice m').text());
$('.wuju-mine-box li.notice i').html('<span class="badge bg-red tips">'+count_tips+'</span>');	
$('.toolbar .mine m').remove();
$('.toolbar .mine').prepend('<m class="badge bg-red tips">'+count_tips+'</m>');		
}

}
});
}


//视频专题后加载js
function wuju_index_video_special_js_load(obj){
var video_loading = false;
var video_page = 2;
$(obj+' .infinite-scroll').on('infinite',function(){
if (video_loading) return;
video_loading = true;

video_list=$(obj+' .wuju-video-special-list');
number=video_list.attr('number');
video_list.after(wuju.loading_post);
topic=$('.wuju-video-special-menu li.on').attr('data');

if(video_list.hasClass('waterfall')){
waterfall=1;
}else{
waterfall=0
}

$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/video-special.php",
data: {topic:topic,page:video_page,number:number,type:'more',waterfall:waterfall},
success: function(msg){
if(msg==0){ 
video_list.append('<div class="wuju-empty-page">没有更多内容</div>'); 
video_loading = true; 
}else{
video_list.append(msg);
video_page++;
video_loading = false;  

if(video_list.hasClass('waterfall')){//瀑布流渲染
var grid=$('.wuju-video-special-list').masonry({
itemSelector:'.waterfall',
gutter:0,
transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
}); 
}

}
$('.wuju-load-post').remove();
}
});

}); 
}



//点击广告
function wuju_click_ad(){
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/click-ad.php",
});	
}

//出售宠物
function wuju_pet_sell(id,number,obj,ticket,randstr){
myApp.showIndicator();
$.ajax({   
url:wuju.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{id:id,type:'sell',ticket:ticket,randstr:randstr},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
//$(obj).after('<div class="wuju-pet-nest-btn" onclick="wuju_pet_store('+number+')">'+msg.text+'</div>').remove();
$(obj).remove();
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).find('a').attr('href','javascript:wuju_pet_store('+number+')');
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).find('.pet_img').remove();
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).find('.green').text(msg.text);
$('.wuju-pet-nest-list.single .pet_img').remove();
$('.navbar-on-center .center').text('');
function d(){history.back(-1);}setTimeout(d,1200);
}

}
});
}

//偷宠物
function wuju_pet_steal(id,number,obj,ticket,randstr){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({   
url:wuju.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{id:id,type:'steal',ticket:ticket,randstr:randstr},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
$(obj).remove();
$('.wuju-pet-content.other .wuju-pet-nest-list li').eq(number).find('.pet_img').remove();
$('.wuju-pet-content.other .wuju-pet-nest-list li').eq(number).find('.green').text(msg.text);
$('.wuju-pet-content.other .wuju-pet-nest-list li').eq(number).children('a').removeAttr('href');
$('.wuju-pet-nest-list.single .pet_img').remove();
$('.wuju-pet-nest-list.single li .nest p').text(msg.text).addClass('green');
// function d(){history.back(-1);}setTimeout(d,1500);
}

}
});
}



//购买窝、解锁窝
function wuju_pet_buy_nest(number,obj){
myApp.showIndicator();
$.ajax({   
url:wuju.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{number:number,type:'deblocking'},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).after('<div class="wuju-pet-nest-btn" onclick="wuju_pet_store('+number+')">'+msg.text+'</div>').remove();
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).removeClass('gray');
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).find('.no').text(msg.text).addClass('green');
$('.wuju-pet-nest-list.single li').removeClass('gray');
}

}
});
}

//购买宠物蛋
function wuju_pet_buy(number,iiii){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({   
url:wuju.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{number:number,iiii:iiii,type:'buy'},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
// $('.wuju-pet-nest-btn').remove();
// $('.wuju-pet-nest-list.single li .animal').html('<img class="egg_img" src="'+msg.img_egg+'">');
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).find('.animal').html('<img class="egg_img" src="'+msg.img_egg+'">');
// $('.wuju-pet-nest-list.single li .nest').append('<p>'+msg.text+' '+msg.hatch_time+'</p>');
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).find('.green').text(msg.text+' '+msg.hatch_time).removeClass('green');
$('.wuju-pet-content.mine .wuju-pet-nest-list li').eq(number).find('a').attr('href','');
// $('.navbar-on-center').prev().children('.center').text(msg.pet_name);
history.back(-1);
// function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,700);
}

}
});	
}

//打开商店界面
function wuju_pet_store(number){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/pet-store.php?number='+number});	
}



//收藏内容
function wuju_collect(post_id,type,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
if(type=='img'){
url=$(obj).parent().siblings('.fancybox-stage').find('img').attr('src');
}else{
url='';	
}


$.ajax({   
url:wuju.wuju_ajax_url+"/action/collect.php",
type:'POST',   
data:{post_id:post_id,type:type,url:url},  
success:function(msg){
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==2){
$('.collect-post-'+post_id).children('i').addClass('wuju-shoucang1').removeClass('wuju-shoucang');
$('.collect-post-'+post_id).children('p').text(msg.text);
if($(obj).hasClass('fancybox-button')){
$(obj).children('i').addClass('wuju-shoucang1').removeClass('wuju-shoucang');
}
}else{
$('.collect-post-'+post_id).children('i').addClass('wuju-shoucang').removeClass('wuju-shoucang1');
$('.collect-post-'+post_id).children('p').text(msg.text);
if($(obj).hasClass('fancybox-button')){
$(obj).children('i').addClass('wuju-shoucang').removeClass('wuju-shoucang1');
}
}


}
}); 
}


//图片灯箱
function wuju_lightbox(){
$("[data-fancybox]").fancybox({
// loop : true,
arrows : false,
protect:false,
buttons : ['collect','download','thumbs','close'],
btnTpl: {
collect:
'<a  onclick=\'wuju_collect("","img",this)\' class="fancybox-button fancybox-button--collect" href="javascript:;"><i class="wuju-icon wuju-shoucang1"></i></a>'
},
mobile:{
clickSlide: function(current, event){
return "close";
},
clickContent: function(current, event){
return "close";
},
},
hash:false,
afterShow: function(instance,current){
window.history.pushState(null,null,window.location.href+'#'+Math.random().toString(36).substr(2,5));
// console.log($.fancybox.getInstance().current.src);

$.ajax({   
url:wuju.wuju_ajax_url+"/action/collect-is.php",
type:'POST',   
data:{url:$.fancybox.getInstance().current.src}, 
success:function(msg){ 
if(msg.code==1){
$('.fancybox-button--collect i').addClass('wuju-shoucang').removeClass('wuju-shoucang1');
}else{
$('.fancybox-button--collect i').addClass('wuju-shoucang1').removeClass('wuju-shoucang');	
}
} 
}); 


},
});	
}


//评论置顶
function wuju_up_comment(comment_id,bbs_id,obj){
title=$(obj).text();
layer.open({
content: '你确定要'+title+'吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:  wuju.wuju_ajax_url+"/action/up-comment.php",
data: {comment_id:comment_id,bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
$(obj).text(msg.name);
$(obj).parents('.wuju-single-comment-list').find('.up-comment').remove();	
if(msg.code==1){//成功
$(obj).parents('.wuju-comment-li').find('.from').prepend('<span class="up-comment">'+title+'</span>');
$(obj).parents('.wuju-single-comment-list').prepend($(obj).parents('.wuju-comment-li'));
$(obj).parents('.wuju-comment-li').siblings().find('.comment-up').text(title);
}
}
});
}
}); 
}


//表情
function wuju_smile_form(obj){
layer.open({
type: 1,
content: $(obj).next().html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;height:50vh;border:none;'
});	
$('.wuju-smile-form .header li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children('ul').eq($(this).index()).show().siblings().hide();
});
}



//排序
function wuju_sort(){
sort_type=GetCookie('sort');
if(!sort_type){
sort_type=wuju.sort;
}
buttons=[
{text:'最新发布',onClick:function(){SetCookie('sort','normal');$('.wuju-home-menu li.on').click();}},
{text:'最新回复',onClick:function(){SetCookie('sort','comment');$('.wuju-home-menu li.on').click();}},
{text:'随机内容',onClick:function(){SetCookie('sort','rand');$('.wuju-home-menu li.on').click();}},
{text:'本月热门',onClick:function(){SetCookie('sort','comment_count_month');$('.wuju-home-menu li.on').click();}},
{text:'所有热门',onClick:function(){SetCookie('sort','comment_count');$('.wuju-home-menu li.on').click();}},
{text:'取消',color: 'red'},
];
if(sort_type=='comment'){
buttons[1]['bold']=true;	
}else if(sort_type=='rand'){
buttons[2]['bold']=true;	
}else if(sort_type=='comment_count_month'){
buttons[3]['bold']=true;	
}else if(sort_type=='comment_count'){
buttons[4]['bold']=true;	
}else{
buttons[0]['bold']=true;
}
myApp.actions(buttons);
}

//评论排序
function wuju_comment_sort(type){
if(type=='bbs'){
cookie_name='comment_sort_bbs';
}else{
cookie_name='comment_sort';	
}

sort_type=GetCookie(cookie_name);
if(!sort_type){
if(type=='bbs'){
sort_type='ASC';
}else{
sort_type='DESC';//倒序
}
}

buttons=[
{text:'正序（旧 -> 新）',onClick:function(){
SetCookie(cookie_name,'ASC');
dom='.page-on-center .wuju-single-comment-list';
wuju_comment_data(1,$(dom).attr('post_id'),$(dom).attr('type'),$(dom).attr('bbs_id'),dom);
$('.wuju-single-comment>.header .sort span').text('正序');
}},
{text:'倒序（新 ->旧 ）',onClick:function(){
SetCookie(cookie_name,'DESC');
dom='.page-on-center .wuju-single-comment-list';
wuju_comment_data(1,$(dom).attr('post_id'),$(dom).attr('type'),$(dom).attr('bbs_id'),dom);
$('.wuju-single-comment>.header .sort span').text('倒序');
}},
{text:'取消',color: 'red'},
];

if(sort_type=='DESC'){//倒序
buttons[1]['bold']=true;	
}else{
buttons[0]['bold']=true;
}

myApp.actions(buttons);
}

//返回顶部
function wuju_totop(){
current=myApp.getCurrentView().selector;
if($(current+' .page-on-center').length>0){
$('.page-on-center .page-content').animate({scrollTop:0},500);
}else{
$(current+' .page-content').animate({scrollTop:0},500);
}	
}

//收起/展开右侧悬浮按钮
function wuju_hide_right_bar(){
if($('.wuju-right-bar').hasClass('hidden')){
$('.wuju-right-bar').removeClass('hidden');
$('.wuju-right-bar li.close').siblings().show();
number=$('[data-page="wuju-mine-page"] .wuju-right-bar li').length;
height=(number-1)*17-5;
$('.wuju-right-bar').css('height',height+'vw');
$('.wuju-right-bar li.close i').addClass('wuju-guanbi').removeClass('wuju-mulu1');
}else{
$('.wuju-right-bar').addClass('hidden');
$('.wuju-right-bar li.close').siblings().hide();	
$('.wuju-right-bar').css('height','5vw');
$('.wuju-right-bar li.close i').removeClass('wuju-guanbi').addClass('wuju-mulu1');
}
$('.wuju-right-bar li.music').hide();
}


//喜欢秘密 匿名
function wuju_like_secret(post_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}

if(!$(obj).hasClass('had')){
audio=document.getElementById('wuju-like-up-music');
audio.play();
$(obj).addClass('had');
like_num=parseInt($(obj).children('n').text())+1;
$(obj).children('n').text(like_num);
$.ajax({
type: "POST",
dataType:'json',
url:  wuju.mobile_ajax_url+"/action/secret.php",
data: {post_id:post_id,type:'like'},
success: function(msg){
if(msg.code==1){

ws.send('{"from_url":"'+wuju.home_url+'","type":"secret_like","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');

}
}
});
}
}

//删除秘密
function wuju_delete_secret(post_id){
layer.closeAll();
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/action/secret.php",
data:{post_id:post_id,type:'delete'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
history.back(-1);	
$('#wuju-secret-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});

}
}
});

layer.close(index);
}
});
}

//评论私密
function wuju_secret_comment(){
post_id=$('.wuju-post-secret-list.single').attr('data');
content=$('#wuju-secret-comment-content').val();
myApp.showIndicator();
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/action/secret.php",
data:{post_id:post_id,content:content,type:'comment'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#wuju-secret-comment-content').val('');
$('.wuju-secret-comment-list').prepend(msg.html);

ws.send('{"from_url":"'+wuju.home_url+'","type":"secret_comment","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');

}
}
});
}

//删除秘密评论
function wuju_secret_comment_delete(comment_id){
layer.closeAll();
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){

post_id=$('.wuju-post-secret-list.single').attr('data');
myApp.showIndicator();
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/action/secret.php",
data:{comment_id:comment_id,post_id:post_id,type:'comment-delete'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#wuju-secret-comment-'+comment_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});
}
}
});
layer.close(index);
}
});
}


//打开页面
function wuju_is_page_repeat(page_name,url){
if($('.pages [data-page='+page_name+']').length>0){
history.back(-1);
}else{
myApp.getCurrentView().router.load({url:url});
}
}


/*
加载评论
page：页数
post_id：文章id
type：如果是帖子填：bbs，否则留空
bbs_id：论坛ID
dom：列表dom
*/
function wuju_comment_data(page,post_id,type,bbs_id,dom){
$(dom).prepend(wuju.loading_post);
comment_loading=false;
comment_page=2;
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/comment.php",
data: {page:page,post_id:post_id,type:type,bbs_id:bbs_id},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
$(dom).html(wuju.empty); 
}else{
$(dom).html(msg); 
wuju_lightbox();//灯箱
} 
}
});	
}


//iframe弹窗
function wuju_iframe(url,title){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/url.php?link='+url+'&type=iframe&title='+title});
}

//弹窗
function wuju_popup(e){
myApp.popup(e);
history.pushState('','','#'+Math.random().toString(36).substr(2,5));
}

//打开页面
function wuju_page(url,login,type){
if(login){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
}
if(type=='page'){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/'+url});
}else{
myApp.getCurrentView().router.load({url:url});
}
}

//清除阅读历史记录
function wuju_history_single_clear(obj){
layer.open({
content: '你确定要清空吗？'
,btn: ['确定', '取消']
,yes: function(index){
$('.wuju-history-single-content').html(wuju.empty);
layer.open({content:'已经清空！',skin:'msg',time:2});
DelCookie('history_single');
$(obj).text('').removeAttr('onclick');
}
});	
}

//清除历史搜索
function wuju_history_search_clear(){
layer.open({
content: '你确定要清除历史搜索吗？'
,btn: ['确定', '取消']
,yes: function(index){
$('.wuju-search-hot.history').remove();
layer.open({content:'已经清除！',skin:'msg',time:2});
DelCookie('history-search');
}
});	
}

//下载次数
function wuju_download_times(post_id){
$.ajax({   
url:wuju.wuju_ajax_url+"/action/download-times.php",
type:'POST',   
data:{post_id:post_id},  
}); 
}

//申请论坛
function wuju_apply_bbs(){
title=$('#wuju-apply-bbs-title').val();
reason=$('#wuju-apply-bbs-reason').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/apply-bbs.php",
data:{title:title,reason:reason},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#wuju-apply-bbs-title,#wuju-apply-bbs-reason').val('');
}
}
});
}

//打开登录注册页面
function wuju_load_login_page(name){
layer.closeAll();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/login/'+name+'.php'});
function d(){myApp.closeModal();}setTimeout(d,300);
}


//显示注册类型
function wuju_reg_type_form(){
layer.open({
type: 1,
content: $('.wuju-reg-type-form').html(),
anim: 'up',
className:'wuju-reg-type-form-content',
style: 'position:fixed;bottom:2vw;left:2vw;width:96vw;border:none;box-sizing:border-box;border-radius:2vw;padding:2vw;'
});	
}

//记录社交登录 返回地址 登录返回 登录回调
function wuju_login_back_url(){
url=window.location.href;
document.cookie="login_back="+url;
}


//获取get参数
function wuju_get_para(name){
var query = window.location.search.substring(1);
var vars = query.split("&");
for (var i=0;i<vars.length;i++) {
var pair = vars[i].split("=");
if(pair[0] == name){return pair[1];}
}
return(false);
}


//第三方地址的更多功能
function wuju_url_page_more(url){
var buttons1 = [{text: '新窗口打开',onClick:function(){
window.open(url);
}},
{text: '复制地址',onClick:function(){
var clipboard = new ClipboardJS('.actions-modal-button:last-child');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});

}}];
var buttons2 = [{text: '取消',color:'red'}
];
var groups = [buttons1, buttons2];
myApp.actions(groups);
$('.actions-modal-button:last-child').attr('data-clipboard-text',url);
}



//评论艾特aite@好友
function wuju_comment_aite_user_js(){
$('.wuju-publish-aite-popup').on('opened',function (){//打开
if($('.wuju-load-post').length>0){
return false;	
}
if($('.wuju-publish-aite-form .list.aite li').length==0){
$('.wuju-publish-aite-form .list.aite').prepend(wuju.loading_post);
$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/user/following.php",
success: function(msg){
if(msg.code==1){
html='';
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li onclick="wuju_aite_selete_user(this)" data="'+msg.data[i].nickname+'">\
<div class="avatarimg">'+msg.data[i].avatar+msg.data[i].verify+'</div>\
<div class="name">'+msg.data[i].name+msg.data[i].vip+'</div>\
</li>';
}
}else{
html=wuju.empty;
}
$('.wuju-publish-aite-form .list.aite').html(html);
}
}); 

}
});
}


//发起挑战
function wuju_challenge(){
type=$('.wuju-publish-challenge-content .type>li.on').attr('data');
value=$('.wuju-publish-challenge-content .shitou li.on p').text();
price=$('.wuju-publish-challenge-content .price li.on').index();
desc=$('.wuju-publish-challenge-content .desc textarea').val();
if(!value){
layer.open({content:'请选择你要出的！',skin:'msg',time:2});
return false;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/action/challenge.php",
data:{type:type,value:value,price:price,desc:desc},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
type=$('.wuju-challenge-menu li.on').attr('type');
wuju_challenge_data(type,this);
if(msg.code==1){
function d(){history.back(-1);}setTimeout(d,1500);
}
}
}); 	
}

//参与挑战
function wuju_challenge_join(id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
value=$('.wuju-challenge-content.join .shitou li.on p').text();
if(!value&&$('.wuju-challenge-content .shitou').length>0){
layer.open({content:'请选择你要出的！',skin:'msg',time:2});
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/action/challenge-join.php",
data:{id:id,value:value},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code!=0){
$('.wuju-challenge-content.join .price').after(msg.html);
$('.wuju-challenge-content.join .btn,.wuju-challenge-content.join .shitou,.wuju-challenge-content.join .tips').remove();
$('#wuju-challenge-'+id).find('.btn').children('a').addClass('no').text('已结束');
}
}
}); 	
}

//切换挑战数据
function wuju_challenge_data(type,obj){
$(obj).addClass('on').siblings().removeClass('on');
$('.wuju-challenge-content').animate({scrollTop: 0 },0);
challenge_post_list=$('.wuju-challenge-post-list');
challenge_loading=false;
challenge_page=2;
challenge_post_list.before(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/challenge.php",
data: {page:1,type:type},
success: function(msg){
$('.wuju-load-post').remove();
challenge_post_list.html(msg);
}
});
}

//我的订单数据
function wuju_order_data(type,link_type,obj){
$(obj).addClass('on').siblings().removeClass('on');
$('.wuju-shop-order-mine-content').animate({scrollTop: 0 },0);
order_list=$('.wuju-shop-order-mine-list');
order_loading=false;
order_page=2;
order_list.before(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/order.php",
data: {page:1,type:type,link_type:link_type},
success: function(msg){
$('.wuju-load-post').remove();
order_list.html(msg);
}
});
}

//插入商品应用
function wuju_publish_add_application_shop(obj){
post_id=$(obj).parent().attr('data');
title=$(obj).find('.title').text();
history.back(-1);
$('.wuju-publish-words-form .add-application .left span').text(title);
$('.wuju-publish-words-form .add-application .left i').removeAttr('class').addClass('wuju-icon wuju-shangcheng');
$('#wuju-publish-application-type').val('shop');
$('#wuju-publish-application-value').val(post_id);
}

//插入网址链接
function wuju_publish_add_application_link(){
layer.closeAll();
myApp.prompt('', function (value) {

var Expression =/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/; 

var objExp=new RegExp(Expression);

if(objExp.test(value) != true){
layer.open({content:'请输入一个合法的url链接！',skin:'msg',time:2});
return false; 
} 

$('.wuju-publish-words-form .add-application .left span').text(value);
$('.wuju-publish-words-form .add-application .left i').removeAttr('class').addClass('wuju-icon wuju-tuiguang');
$('#wuju-publish-application-type').val('url');
$('#wuju-publish-application-value').val(value);
});
$('.modal-text-input').focus();
}

//插入我的挑战
function wuju_publish_add_application_challenge(obj){
layer.closeAll();
application_name=$(obj).children('span').text();
$('.wuju-publish-words-form .add-application .left span').text(application_name);
$('.wuju-publish-words-form .add-application .left i').removeAttr('class').addClass('wuju-icon wuju-jirou');
$('#wuju-publish-application-type').val('challenge');
}
//插入我的宠物
function wuju_publish_add_application_pet(obj){
name=$(obj).children('p').text();
img=$(obj).children('img').attr('src');
history.back(-1);
application_name=$(obj).attr('data');
$('.wuju-publish-words-form .add-application .left span').text(application_name+'-['+name+']');
$('.wuju-publish-words-form .add-application .left i').removeAttr('class').addClass('wuju-icon wuju-chongwu');
$('#wuju-publish-application-type').val('pet');
$('#wuju-publish-application-value').val(name+','+img);
}
//插入我的摇钱树
function wuju_publish_add_application_tree(obj){
layer.closeAll();
application_name=$(obj).children('span').text();
$('.wuju-publish-words-form .add-application .left span').text(application_name);
$('.wuju-publish-words-form .add-application .left i').removeAttr('class').addClass('wuju-icon wuju-yaoqianshu');
$('#wuju-publish-application-type').val('tree');
}


//打开移动版块页面
function wuju_open_change_bbs_form(post_id,bbs_id){
layer.closeAll();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/change-bbs.php?post_id='+post_id+'&bbs_id='+bbs_id});	
}

//提交移动版块
function wuju_change_bbs(post_id,bbs_id){
new_bbs_id='';
$('.wuju-change-bbs-content li input:checkbox:checked').each(function (index, item) {
new_bbs_id+=$(this).val()+',';
});

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/change-bbs.php",
data:{post_id:post_id,bbs_id:bbs_id,new_bbs_id:new_bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){window.open(msg.url,'_self');}setTimeout(c,2000);
}
});
}


//打开举报页面
function wuju_report_page(type,report_id){
layer.closeAll();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/report.php?type='+type+'&report_id='+report_id});
}

//提交举报
function wuju_report(report_id,from){
reason=$('#wuju-report-reason').val();
type=$('#wuju-report-type').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/report.php",
data:{report_id:report_id,reason:reason,type:type,from:from},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,1500);	
}
}
});
}

//摇钱树 摇一下
function wuju_tree_yao(obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
time=parseInt($('.wuju-tree-btn .yao m').text());
if(time){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.mobile_ajax_url+"/action/tree.php",
data:{type:'yao'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
$('.wuju-tree-btn .yao m').text(time-1);//次数
health=parseInt($('.wuju-tree-name .health span m').text());
yao_health=parseInt($('.wuju-tree-name .health').attr('b'));//每次消耗健康值
$('.wuju-tree-name .health span m').text(health-yao_health);
$('.wuju-tree-icon img').addClass('yaohuang');
audio=document.getElementById('wuju-tree-yao-music');
audio.play();
function d(){$('.wuju-tree-icon img').removeClass('yaohuang');}setTimeout(d,2000);
}
}
});
}else{
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}
}

//浇水
function wuju_tree_jiao(obj,author_id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
time=parseInt($('.wuju-tree-btn .jiao m').text());
if(time){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.mobile_ajax_url+"/action/tree.php",
data:{type:'jiao',author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
audio=document.getElementById('wuju-tree-jiao-music');
audio.play();

$('.wuju-tree-btn .jiao m').text(time-1);//次数
health=parseInt($('.other .wuju-tree-name .health span m').text());
health_max=parseInt($('.other .wuju-tree-name .health span n').text());
jiao_health=parseInt($('.other .wuju-tree-name .health').attr('c'));//每次浇水恢复的健康值

if(health+jiao_health>health_max){
hui_health=health_max;
}else{
hui_health=health+jiao_health;
}

$('.other .wuju-tree-name .health span m').text(hui_health);
}
}
});
}else{
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}
}

//破坏
function wuju_tree_po(obj,author_id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
time=parseInt($('.wuju-tree-btn .po m').text());
if(time){
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.mobile_ajax_url+"/action/tree.php",
data:{type:'po',author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
audio=document.getElementById('wuju-tree-po-music');
audio.play();

$('.wuju-tree-btn .po m').text(time-1);//次数
$('.other .wuju-tree-name .health span m').text(msg.health);
}
}
});
}else{
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}
}


//治疗
function wuju_tree_help(obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
if(parseInt($('.wuju-tree-name .health span m').text())>=parseInt($('.wuju-tree-name .health span n').text())){
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}else{
help_credit=parseInt($(obj).attr('a'));
n=parseInt($('.wuju-tree-name .health span n').text());
m=parseInt($('.wuju-tree-name .health span m').text());
need_credit=(n-m)*help_credit;

layer.open({
content: '<font style="color:#f00;">'+$(obj).attr('tips')+need_credit+wuju.credit_name+'</font>'
,btn: ['确定', '取消']
,yes: function(index){

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.mobile_ajax_url+"/action/tree.php",
data:{type:'help'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
$('.wuju-tree-main .help').show();
audio=document.getElementById('wuju-tree-help-music');
audio.play();
$('.wuju-tree-name .health span m').text(msg.health);
function d(){$('.wuju-tree-main .help').hide();}setTimeout(d,3000);	
}

}
});

}
});

}
}

//打开邻居页面
function wuju_tree_list_page(){
layer.closeAll();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/tree-list.php'});
}

//打开升级页面
function wuju_tree_update_page(){
layer.closeAll();
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/tree-update.php'});
}

//升级摇钱树
function wuju_tree_update(obj){
if($(obj).hasClass('no')){
return false;
}
$(obj).addClass('no');
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.mobile_ajax_url+"/action/tree.php",
data:{type:'update'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
history.back(-1);
audio=document.getElementById('wuju-tree-update-music');
audio.play();
$(obj).removeClass('no');
function d(){layer.open({content:msg.msg,skin:'msg',time:2});}setTimeout(d,500);
function c(){
$('.wuju-tree-icon img').attr('src',msg.img);
$('.wuju-tree-name .name').text(msg.name);
$('.wuju-tree-name .health span').html('<m>'+msg.health+'</m> / <n>'+msg.health+'</n>');
$('.wuju-tree-name .income span').text(msg.income+wuju.credit_name+' / 次');
$('.wuju-tree-btn .yao m').text(msg.yao);//重置摇的次数
}setTimeout(c,1500);	
}else if(msg.code==2){
audio1=document.getElementById('wuju-tree-update-fail-music');
audio1.play();
layer.open({content:msg.msg,skin:'msg',time:2});
audio1.addEventListener('ended', function(){$(obj).removeClass('no');},false);	
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$(obj).removeClass('no');
}
}
});

}


//弹出登录框
function wuju_login_form(){
myApp.loginScreen();
}

//转换表情
function wuju_content_to_smile(content){
smile_add_arr=$.parseJSON(wuju.smile_add);
if(smile_add_arr){
content=content.replace(/\[s\-(\d+)\]/g,'<img src="'+wuju.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content=content.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+wuju.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}
return content;
}


//同步消息数量
function wuju_update_notice_tips(){
notice=0;

if($('.toolbar .notice').length>0){//底部tab开启了消息
$("[data-page='wuju-notice-page'] .wuju-chat .tips").each(function(){
if($(this).text()){
notice+=parseInt($(this).text());
}
});
}else if($('.wuju-mine-box li.notice').length>0){//我的里面开启了消息
if($("[data-page='notice']").length>0){
$("[data-page='notice'] .wuju-chat .tips").each(function(){
if($(this).text()){
notice+=parseInt($(this).text());
}
});
}else{
notice+=parseInt($('.toolbar .mine m').text());
}
}

if(notice){
if($('.toolbar .notice').length>0){
$('.toolbar .notice m').remove();
$('.toolbar .notice').prepend('<m class="badge bg-red tips">'+notice+'</m>');
}
if($('.wuju-mine-box li.notice').length>0){
$('.toolbar .mine m,.wuju-mine-box li.notice .tips').remove();
$('.toolbar .mine,.wuju-mine-box li.notice i').prepend('<m class="badge bg-red tips">'+notice+'</m>');	
}
}else{
$('.wuju-chat .tips,.toolbar .tips,.wuju-mine-box li.notice .tips').remove();	//清除所有消息
}
}

//监控聊天正在输入
function wuju_chat_input_ing(author_id,obj){
if($(obj).val()){
ws.send('{"from_url":"'+wuju.home_url+'","type":"input-ing","notice_user_id":"'+author_id+'","do_user_id":"'+wuju.user_id+'","do_user_name":"'+wuju.nickname_base+'"}');
}
}



function wuju_htmlspecialchars_decode(str){
str=str.replace(/&amp;/g,'&');
str=str.replace(/&lt;/g,'<');
str=str.replace(/&gt;/g,'>');
str=str.replace(/&quot;/g,'"');
str=str.replace(/&#039;/g,"'");
str=str.replace(/\n/g,"<br>");
return str;
}

function wuju_htmlspecialchars(str){
str = str.replace(/&/g, '&amp;');  
str = str.replace(/</g, '&lt;');  
str = str.replace(/>/g, '&gt;');  
str = str.replace(/"/g, '&quot;');  
str = str.replace(/'/g, '&#039;');  
return str; 
}

//设置cookie
function SetCookie(name,value){
var Days = 30*12*10;//十年
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//获取cookie
function GetCookie(name){
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg)){
return unescape(arr[2]);
}else{
return null;
}
}

//删除cookie
function DelCookie(name){
var exp = new Date();
exp.setTime(exp.getTime() - 1);
var cval=GetCookie(name);
if(cval!=null){
document.cookie= name + "="+cval+";expires="+exp.toGMTString();
} 
}

