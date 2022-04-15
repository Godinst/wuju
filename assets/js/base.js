$(function(){

layui.use(['layer', 'form','element'], function(){
var form = layui.form;
var element = layui.element;
// var laydate = layui.laydate;
var layer = layui.layer;
});

var header_height=$('.wuju-header').height();


//全站滚动条事件
$(window).scroll(function(){
if($(window).scrollTop()>=header_height){
$('.wuju-header').addClass('fixed');
}else{
$('.wuju-header').removeClass('fixed');
}
});



//文章、帖子页面左侧栏小工具悬浮
if($('.wuju-single-left-bar').length>0){
var elm = $('.wuju-single-left-bar'); 
var startPos = $(elm).offset().top; //计算当前模块离顶部距离
$.event.add(window, "scroll", function() { 
var p2 = $(window).scrollTop()+header_height;//加上导航栏高度
if(p2>startPos){
elm.css({'position':'fixed','top':'60px','margin-left':'-60px','left':'inherit'});
}else{
elm.css({'position':'absolute'});	
}
});
}//判断是否存在模块




//弹窗搜索 


//点击弹出搜索
$('li.search').on('click', function(event){
event.preventDefault();
$('.wuju-pop-search').addClass('show');
$('body').css('overflow','hidden');
$('.wuju-pop-search-content input').focus();
});

//点击关闭搜索
$('.wuju-pop-search .close').click(function() {
$('.wuju-pop-search').removeClass('show');
$('body').css('overflow','auto');
});

//按esc键关闭 弹窗搜索
$(document).keyup(function(event){
if(event.which=='27'){
$('.wuju-pop-search').removeClass('show');
$('body').css('overflow','auto');
}
});

//提交搜索
$(".wuju-pop-search-content span").click(function(){
search_val =$.trim($(".wuju-pop-search-content input").val());
if(search_val==''){
layer.msg('搜索的内容不能为空！');
return false;
}
window.location.href=wuju.home_url+'/?s='+search_val;
});

// 回车搜索
$(".wuju-pop-search-content input").keypress(function(e) {  
if(e.which == 13) {  
search_val =$.trim($(".wuju-pop-search-content input").val());
if(search_val==''){
layer.msg('搜索的内容不能为空！');
return false;
}
window.location.href=wuju.home_url+'/?s='+search_val;
}  
}); 


//论坛ajax搜索 回车搜索
$("#wuju-bbs-search").keypress(function(e) {  
if(e.which == 13) {  
wuju_ajax_bbs_search();
}  
}); 



//弹出更换背景封面表单
$('.wuju-member-change-bg,.wuju-member-change-bg-head .close').click(function() {
if($('.wuju-member-change-bg-form').css('display')=='none'){
$(".wuju-member-change-bg-form").show();
$(".wuju-member-change-bg-form").animate({bottom:"0px"});
}else{
$(".wuju-member-change-bg-form").animate({bottom:"-300px"});
function d(){$(".wuju-member-change-bg-form").hide();}setTimeout(d,300);
}
});


//更换用户中心背景封面
$('.wuju-member-change-bg-content li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
bg=$(this).attr('bg');
color=$(this).attr('color');
number=$(this).attr('number');
author_id=$('.wuju-member-main').attr('data');
$('.wuju-member-main').css('background-color',color);
$('.wuju-member-bg').css('background-image','url('+bg+')');
$.ajax({
type: "POST",
url:  wuju.module_url+"/action/skin.php",
data: {number:number,author_id:author_id},
success: function(msg){
if(msg.code==2){
wuju_recharge_vip_form();
function c(){layer.msg(msg.msg);}setTimeout(c,1000);
}
}
});
});

//个人主页查看更多资料
$(".wuju-member-left-profile-more").click(function(){
$('.wuju-member-left-profile-hide').show();
$(this).hide();
});

// --------------------------下拉事件-------------





//动态右上角下拉
$('.wuju-posts-list,.wuju-post-list,.wuju-search-content,.wuju-topic-post-list').on('click','.wuju-post-setting',function(event){
event.stopPropagation();
$(this).children(".wuju-post-setting-box").toggle(100);
});
//文章左侧栏自动目录
$('#wuju-single-title-list').click(function(event){
event.stopPropagation();
$(this).children(".wuju-single-title-list-content").toggle(0);
});
//个人主页拉黑下拉
$('.wuju-member-follow-info span:last-child').click(function(event){
event.stopPropagation();
$(this).children(".wuju-member-follow-box").toggle(100);
});
//通知栏
$('.wuju-notice').click(function(event){
event.stopPropagation();
$(this).children('ul').toggle(0);
$(this).find('.number').remove();//移除闪烁

if($('.wuju-notice-content li').length==0&&$('.wuju-notice-content .a .wuju-notice-empty').length==0){
$('.wuju-notice-content .a,.wuju-notice-content .b,.wuju-notice-content .c').html(wuju.loading);
$.ajax({   
url:wuju.wuju_ajax_url+"/action/notice.php",//获取关于动态/帖子的消息
type:'POST',   
data:{notice:1},    
success:function(msg){
$('.wuju-notice-content .wuju-load').remove();
item_arr=msg.item.data;
like_arr=msg.like.data;
follow_arr=msg.follow.data;
item='';
like='';
follow='';


if(msg.item.code==1){
for (var i = 0; i < item_arr.length; i++) {
type=item_arr[i].type;
if(type=='cash'||type=='reg'||type=='post_agree'||type=='post_refuse'||type=='bbs-apply-refuse'||type=='order-send'){
item+='\
<li class="clear">\
'+item_arr[i].status+'\
<a href="'+item_arr[i].post_link+'" class="url">\
'+item_arr[i].action+'\
</a>\
<span>'+item_arr[i].time+'</span>\
</li>';
}else{
item+='\
<li class="clear">\
'+item_arr[i].status+'\
<a href="'+item_arr[i].author_link+'" target="_blank" class="name">'+item_arr[i].user_name+'</a>\
<a href="'+item_arr[i].post_link+'" target="_blank" class="url">\
'+item_arr[i].action+'\
</a>\
<span>'+item_arr[i].time+'</span>\
</li>';
}
}
}else{
item='<div class="wuju-notice-empty">有关动态、帖子、系统的消息会显示在这里</div>';	
}
$('.wuju-notice-content .a').html(item);

if(msg.follow.code==1){
for (var i = 0; i < follow_arr.length; i++) {
follow+='\
<li class="clear">\
'+follow_arr[i].status+'\
<a href="'+follow_arr[i].author_link+'" target="_blank" class="name">'+follow_arr[i].user_name+'</a>\
<a href="'+follow_arr[i].author_link+'" target="_blank" class="url">\
'+follow_arr[i].action+'\
</a>\
<span>'+follow_arr[i].time+'</span>\
</li>';
}
}else{
follow='<div class="wuju-notice-empty">有人关注你时会显示在这里</div>';	
}
$('.wuju-notice-content .b').html(follow);

if(msg.like.code==1){
for (var i = 0; i < like_arr.length; i++) {
like+='\
<li class="clear">\
'+like_arr[i].status+'\
<a href="'+like_arr[i].author_link+'" target="_blank" class="name">'+like_arr[i].user_name+'</a>\
<a href="'+like_arr[i].post_link+'" target="_blank" class="url">\
'+like_arr[i].action+'\
</a>\
<span>'+like_arr[i].time+'</span>\
</li>';
}
}else{
like='<div class="wuju-notice-empty">有人喜欢你动态/帖子时会显示在这里</div>';	
}
$('.wuju-notice-content .c').html(like);


$('.wuju-notice-content li').click(function(e){//点击之后 移除小红点
$(this).children('m').remove();
});


}   
});
}


});



//点击通知栏内容区禁止关闭
$(".wuju-header-right").on("click",'.wuju-notice ul', function(e){
e.stopPropagation();
});

//委派事件
$(document).on('click', function(event){
$('.wuju-post-setting-box').hide();
$('.wuju-smile-form').hide();//显示表情
$('.wuju-single-title-list-content').hide();//文章左侧栏自动目录
$('.wuju-notice ul').hide();
$('.wuju-member-follow-box').hide();
});


//IM
$('.wuju-chat-header-user').click(function(){
$(this).addClass('on');
$(this).siblings().removeClass('on');
$(".wuju-chat-content-group").animate({left:'240px'},250);
$(".wuju-chat-content-recent").animate({left:'240px'},250);
$('.wuju-chat-clear-icon').hide();
});
$('.wuju-chat-header-group').click(function(){
$(this).addClass('on');
$(this).siblings().removeClass('on');
$(".wuju-chat-content-group").animate({left:'0px'},250);
$(".wuju-chat-content-recent").animate({left:'240px'},250);
$('.wuju-chat-clear-icon').hide();
});
$('.wuju-chat-header-recent').click(function(){
$(this).addClass('on');
$(this).siblings().removeClass('on');
$(".wuju-chat-content-group").animate({left:'0px'},250);
$(".wuju-chat-content-recent").animate({left:'0px'},250);
$('.wuju-chat-clear-icon').show();
});
//自动跟随屏幕高度
screen_height=$(window).height()-139;
$(".wuju-chat-content").css('height',screen_height+'px');
$(window).resize(function() { 
screen_height=$(window).height()-139;
$(".wuju-chat-content").css('height',screen_height+'px');
});



//关闭IM
$('.wuju-chat-close-icon').click(function(){
$(".wuju-chat").animate({right:'-280px'},280);
});
//打开IM
$('.wuju-right-bar-im').click(function(){
$(this).children('.number').remove();
$(".wuju-chat").animate({right:'0px'},280);
$('.wuju-chat-content-recent-user').empty();
$('.wuju-chat-content-follow-user').empty();
$('.wuju-chat-content-group').empty();
$('.wuju-chat-content-recent-user').append('<div class="wuju-chat-loading"></div>');
$('.wuju-chat-content-follow-user').append('<div class="wuju-chat-loading"></div>');
$('.wuju-chat-content-group').append('<div class="wuju-chat-loading"></div>');
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/user-list.php",
data: {recent:1},
success: function(msg){
$('.wuju-chat-content-recent-user').empty();
$('.wuju-chat-content-recent-user').append(msg);  
}
});


$.ajax({
type: "POST",
url:wuju.module_url+"/chat/user-list.php",
data: {group:1},
success: function(msg){
$('.wuju-chat-content-group').empty();
$('.wuju-chat-content-group').append(msg);  
}
});

$.ajax({
type: "POST",
url:wuju.module_url+"/chat/user-list.php",
data: {follow:1},
success: function(msg){
$('.wuju-chat-content-follow-user').empty();
$('.wuju-chat-content-follow-user').append(msg);  
}
});

});



// 回车发送消息-单对单
$('body').on('keypress','.wuju-chat-textarea',function(e){
if(e.which == 13) {  
e.preventDefault();
wuju_send_msg();//发送消息
}  
}); 


// 回车发送消息-群组
$('body').on('keypress','.wuju-chat-textarea-group',function(e){
if(e.which == 13) {  
e.preventDefault();
wuju_send_group_msg();//发送群聊消息
}  
}); 




wuju_post_js();//ajax后加载要执行的脚本




//侧栏小功能切换浏览排序
$('.wuju-content-sort>li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
name=$(this).attr('data');
if(name=='rand'){
$('.wuju-right-bar li.sort').attr('title','随机排序').html('<i class="wuju-icon wuju-suijibofang"></i>');	
}if(name=='comment_count'){
$('.wuju-right-bar li.sort').attr('title','热门排序').html('<i class="wuju-icon wuju-huo"></i>');	
}else{
$('.wuju-right-bar li.sort').attr('title','顺序查看').html('<i class="wuju-icon wuju-shunxu-"></i>');	
}
SetCookie('sort',name);	
window.location.reload();
});	

//侧栏浮动按钮浏览排序切换
$('.wuju-right-bar li.sort').click(function() {
$('.wuju-content-sort>li').removeClass('on');
if($(this).children().hasClass('wuju-suijibofang')){
$(this).attr('title','顺序查看').html('<i class="wuju-icon wuju-shunxu-"></i>');
$('.wuju-content-sort>li[data="normal"]').addClass('on');
name='normal';
}else if($(this).children().hasClass('wuju-shunxu-')){//如果是顺序切换热门
$(this).attr('title','热门排序').html('<i class="wuju-icon wuju-huo"></i>');
$('.wuju-content-sort>li[data="comment_count"]').addClass('on');
name='comment_count';
}else{
$(this).attr('title','随机排序').html('<i class="wuju-icon wuju-suijibofang"></i>');
$('.wuju-content-sort>li[data="rand"]').addClass('on');
name='rand';	
}
SetCookie('sort',name);	
window.location.reload();
});	

//右侧、个人主页左侧工具悬浮
$('.wuju-content-right,.wuju-member-left,.wuju-publish-single-form .left').wujuSidebarFixed({additionalMarginTop: 50});





// -------------------------------以下待优化


//返回顶部
$(".totop").click(function(){
$('html,body').animate({ scrollTop: 0 },500);
});
//返回底部
$(".tobottom").click(function(){
$('html,body').animate({scrollTop:$('.wuju-bottom').offset().top},500);
});

//滚动事件
$(window).scroll(function(){
all_height=$(document).height();
height =$(document).scrollTop();//滚动条高度
if(height > 500){$(".totop").show()}else{$(".totop").hide();};
if((all_height-$(window).height()-height)<300){$(".tobottom").hide();}else{$(".tobottom").show();}
});



//动态风格
$(".wuju-preference-content .post-style n").click(function(){
if($(this).html()=='时光轴'){
$(this).html('矩状');
$(".wuju-post-list").addClass('block').removeClass('time');
wuju_set_cookie('post-style','post-style-block.css');
}else{
$(this).html('时光轴');
$(".wuju-post-list").addClass('time').removeClass('block');  
wuju_set_cookie('post-style','post-style-time.css');
}
});

//动态风格
$(".wuju-preference-content .sidebar-style n").click(function(){
if($(this).html()=='左'){
$(this).html('右');
wuju_set_cookie('sidebar-style','sidebar-style-right.css');
}else{
$(this).html('左'); 
wuju_set_cookie('sidebar-style','sidebar-style-left.css');
}
});

//单栏布局
$(".wuju-preference-content .single-column").click(function(){
if($(this).children().hasClass('fa-toggle-off')){
$(this).html('单栏布局<i class="fa fa-toggle-on"></i>');
wuju_set_cookie('layout-style','layout-single.css');
}else{
$(this).html('单栏布局<i class="fa fa-toggle-off"></i>');
wuju_set_cookie('layout-style','layout-double.css');
}
});


//帖子间隔
$(".wuju-preference-content .post-space").click(function(){
if($(this).children().hasClass('fa-toggle-off')){
$(this).html('帖子间隔<i class="fa fa-toggle-on"></i>');
wuju_set_cookie('space-style','bbs-post-space-on.css');
}else{
$(this).html('帖子间隔<i class="fa fa-toggle-off"></i>');
wuju_set_cookie('space-style','bbs-post-space-off.css');
}
});


//偏好设置-换背景图
$('.wuju-preference-list').on('click','li',function(){
$(this).addClass('on').siblings().removeClass('on');
bg=$(this).attr('bg');
if(bg=='default'){
DelCookie('preference-bg');
$('#wuju-bg-style').attr('href','');
}else{
wuju_set_cookie('preference-bg',bg);
}
});



//头部通知栏 tab切换
$('.wuju-notice-title').children().click(function(e){
e.stopPropagation();
$(this).siblings().removeClass('on');
$(this).addClass('on').children('.tip').remove();
num=$(this).index();
$(this).parent().next().children().hide();
$(this).parent().next().children().eq(num).show();
});
$('.wuju-notice').on('click','a',function(e){//阻止冒泡
e.stopPropagation();
});

//复制侧栏分享链接
var clipboard = new ClipboardJS('#wuju-copy-share-link');
clipboard.on('success', function(e) {
e.clearSelection();
$('#wuju-copy-share-link').append('<g>复制成功！</g>');
function d(){$('#wuju-copy-share-link').children('g').remove()}
setTimeout(d,1000);
});







});


//瀑布流图片预加载
function wuju_loadImage(url) {
var img = new Image(); 
img.src = url;
if (img.complete) {
return img.src;
}
img.onload = function () {
return img.src;
};
};


