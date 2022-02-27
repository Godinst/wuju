

//---------------------------内容详情页面-----------------
myApp.onPageBeforeInit('post-single',function(page){
post_id=page.query['post_id'];

if($('.wuju-video-playing').length>0){
current_post_id=$('.wuju-video-playing').attr('post_id');
window['video_'+current_post_id].pause();
}

wuju_lightbox();//灯箱

// $('.wuju-single.video .wuju-video-img').trigger("click");


//音乐模块
play_post_id=$('.wuju-player-footer-btn .play').attr('post_id');
if(play_post_id==post_id&&!player.paused){//正在播放的文章id和点击查看的文章id是一致，并且播放器是在播放的状态
$('.wuju-music-voice-'+post_id).html('<i class="wuju-icon wuju-yuyin1 tiping"> </i> 播放中...');	
}


$('.wuju-single-comment>.header li').click(function(){
$(this).addClass('on').siblings('li').removeClass('on');
SetCookie('comment_author',$(this).attr('data'));
dom='.page-on-center .wuju-single-comment-list';
wuju_comment_data(1,post_id,$(dom).attr('type'),$(dom).attr('bbs_id'),dom);
})

//记录历史访问
history_single=GetCookie('history_single');
if(history_single){

history_single_arr= new Array();
history_single_arr=history_single.split(",");

if(history_single_arr.includes(post_id)){
history_single_arr.splice($.inArray(post_id,history_single_arr),1);//删除指定的文章id
history_single_arr.push(post_id);
}else{
if(history_single_arr.length>30){
history_single_arr.shift();
}
history_single_arr.push(post_id);
}
SetCookie('history_single',history_single_arr.join(','));
}else{
SetCookie('history_single',post_id);
}


//加载更多评论
comment_loading = false;
comment_page = 2;
post_id=page.query['post_id'];
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
});//加载更多评论


//点击滑动到评论区域
$('.toolbar a.comment').click(function(){
$('.wuju-page-single-content-'+post_id).animate({scrollTop:$(".wuju-single-comment-"+post_id).offset().top},500);
});


});




//---------------------------案例页面-----------------
myApp.onPageBeforeInit('case',function(page){
$('.wuju-home-menu.case li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$(this).parents('.navbar').next().children('.page-on-center').find('ul').eq($(this).index()).show().siblings().hide();
});
});


//---------------------------动态评论-----------------
myApp.onPageAfterAnimation('comment-post',function(page){
post_id=page.query['post_id'];
name=page.query['name'];
//$('#wuju-comment-content-'+post_id).focus();
if(name!='undefined'){
$('#wuju-comment-content-'+post_id).val('@'+name+' ');
}

if($('#comment-1').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('comment-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_comment(post_id,$('#comment-1').attr('reload'),res.ticket,res.randstr);}
});
}



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

//获取长宽
// var bi;
// var reader = new FileReader();
// reader.readAsDataURL(info);
// reader.onload = function(theFile) {
// var image = new Image();
// image.src = theFile.target.result;
// image.onload = function() {
// bi=this.height/this.width;
// console.log(bi);
// };
// };
// if(info.type!='image/gif'&&bi<3){
if(info.type!='image/gif'){
lrz(info,{quality:parseFloat(wuju.comment_img_quality)})
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
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.file_url+'" data-fancybox="gallery-publish"><img src="'+msg.file_url+'"></a></li>');
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
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.file_url+'" data-fancybox="gallery-publish"><img src="'+msg.file_url+'"></a></li>');
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


wuju_comment_aite_user_js();//评论@好友


});



//--------------------------- 一级回帖-----------------
myApp.onPageAfterAnimation('comment-bbs-post',function(page){
post_id=page.query['post_id'];
bbs_id=page.query['bbs_id'];

if($('#comment-2').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('comment-2'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_bbs_comment(post_id,bbs_id,res.ticket,res.randstr);}
});
}


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

//获取长宽
// var bi;
// var reader = new FileReader();
// reader.readAsDataURL(info);
// reader.onload = function(theFile) {
// var image = new Image();
// image.src = theFile.target.result;
// image.onload = function() {
// bi=this.height/this.width;
// console.log(bi);
// };
// };
// if(info.type!='image/gif'&&bi<3){
if(info.type!='image/gif'){
lrz(info,{quality:parseFloat(wuju.comment_img_quality)})
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
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.file_url+'" data-fancybox="gallery-publish"><img src="'+msg.file_url+'"></a></li>');
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
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.file_url+'" data-fancybox="gallery-publish"><img src="'+msg.file_url+'"></a></li>');
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

wuju_comment_aite_user_js();//评论@好友


});

//--------------------------- 二级回帖-----------------
myApp.onPageAfterAnimation('comment-bbs-post-floor',function(page){
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



wuju_comment_aite_user_js();//评论@好友


});


//---------------------------搜索页面-----------------
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
navbar_height=parseInt($('.navbar').height());
w_height=parseInt($(window).height());
$('.wuju-topic-show-form').height(w_height-navbar_height);
});

//---------------------------商城分类中心-----------------
myApp.onPageBeforeInit('shop-tax-show',function(page){
navbar_height=parseInt($('.navbar').height());
w_height=parseInt($(window).height());
$('.wuju-topic-show-form').height(w_height-navbar_height);
});


//--------------------------sns默认页面-----------------
myApp.onPageBeforeInit('sns',function(page){
$('#wuju-sns-slider').owlCarousel({
items: 1,
margin:15,
autoplay:true,
autoplayTimeout:5000,
loop: true,
});
wuju_index_sns_js_load();
});


//--------------------------实时动态-----------------
myApp.onPageBeforeInit('now',function(page){
//加载更多
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



//---------------------------提现-----------------
myApp.onPageBeforeInit('cash',function(page){
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
number=Math.floor($(this).val()/$(this).attr('data'));
$('.wuju-cash-form-content .number n').text(number+'元');
});
});


//签到
myApp.onPageBeforeInit('sign', function (page){
if($('#sign-1').length>0&&!wuju.is_admin){
if(wuju.is_login){
new TencentCaptcha(document.getElementById('sign-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_sign(document.getElementById('sign-1'),res.ticket,res.randstr);}
});
}else{
$('#sign-1').click(function(){
myApp.loginScreen();
});
}
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


//补签
var $$_ = function(id) {
return "string" == typeof id ? document.getElementById(id) : id;
};
var Class = {
create: function() {
return function() {
this.initialize.apply(this, arguments);
}
}
}
Object.extend = function(destination, source) {
for(var property in source) {
destination[property] = source[property];
}
return destination;
}
var Calendar = Class.create();
Calendar.prototype = {
initialize: function(container, options) {
this.Container = $$_(container); //容器(table结构)
this.Days = []; //日期对象列表
this.SetOptions(options);
this.Year = this.options.Year;
this.Month = this.options.Month;
this.qdDay = this.options.qdDay;
this.Draw();
},
//设置默认属性
SetOptions: function(options) {
this.options = { //默认值
Year: new Date().getFullYear(), //显示年
Month: new Date().getMonth() + 1, //显示月
qdDay: null,
};
Object.extend(this.options, options || {});
},
//画日历
Draw: function() {
//签到日期
var day = this.qdDay;
//日期列表
var arr = [];
//用当月第一天在一周中的日期值作为当月离第一天的天数
for(var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
arr.push("&nbsp;");
}
//用当月最后一天在一个月中的日期值作为当月的天数
for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
arr.push(i);
}
var frag = document.createDocumentFragment();
this.Days = [];
while(arr.length > 0) {
//每个星期插入一个tr
var row = document.createElement("tr");
//每个星期有7天
for(var i = 1; i <= 7; i++) {
var cell = document.createElement("td");
cell.innerHTML = "<span>&nbsp;</span>";
if(arr.length > 0) {
var d = arr.shift();
cell.innerHTML = "<span>" + d + "</span>";
if(d > 0 && day.length) {
cell.className = "no-sign";	
$(cell).attr('onclick','wuju_sign_add_form('+d+')');
$(cell).attr('id','wuju-sign-day-'+d);
a=0;
for(var ii = 0; ii < day.length; ii++) {
this.Days[d] = cell;
had_sign=this.IsSame(new Date(this.Year, this.Month - 1, d), day[ii]);//是否签到
if(had_sign) {
cell.className = "had-sign";
$(cell).children('span').html(d+'<i class="wuju-icon wuju-dagou"></i>');
a=1;
}
// console.log(1);
}
if(d <new Date().getDate()&&!a){
$(cell).addClass('no').children('span').html(d+'<m>补</m>');
}
if(d ==new Date().getDate()){
$(cell).addClass('today');
}
if(d >new Date().getDate()){
$(cell).addClass('in');
}
}
}
row.appendChild(cell);
}
frag.appendChild(row);
}
//先清空内容再插入(ie的table不能用innerHTML)
while(this.Container.hasChildNodes()) {
this.Container.removeChild(this.Container.firstChild);
}
this.Container.appendChild(frag);
},
//是否签到
IsSame: function(d1, d2) {
d2 = new Date(d2 * 1000);
return(d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
},
};

var cale = new Calendar("wuju-sign-body", {
qdDay: hadsign,
});

});

//签到排行榜
myApp.onPageBeforeInit('sign-rank', function (page){
$('.wuju-chat-tab.sign>a').click(function(){
$('.wuju-sign-rank-content').animate({scrollTop: 0 },0);
});
});

//简单注册
myApp.onPageBeforeInit('reg-simple', function (page) {
if($('#reg-2').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('reg-2'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pop_reg_simple(res.ticket,res.randstr);}
});
}
});


//邮件注册
myApp.onPageBeforeInit('reg-email', function (page) {
if($('#code-2').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('code-2'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'email',res.ticket,res.randstr);}
});
}
if($('#reg-2').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('reg-2'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pop_reg_mail(res.ticket,res.randstr);}
});
}
});


//手机号注册
myApp.onPageBeforeInit('reg-phone', function (page) {
if($('#code-1').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('code-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'phone',res.ticket,res.randstr);}
});
}
if($('#reg-1').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('reg-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pop_reg_phone(res.ticket,res.randstr);}
});
}
});

//邀请注册
myApp.onPageBeforeInit('reg-invite', function (page) {
if($('#reg-3').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('reg-3'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pop_reg_invite(res.ticket,res.randstr);}
});
}
});

//忘记密码-手机号
myApp.onPageBeforeInit('forget-password-phone', function (page){
if($('#code-8').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('code-8'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'pass-phone',res.ticket,res.randstr);}
});
}
});

//忘记密码-邮箱
myApp.onPageBeforeInit('forget-password-email', function (page){
if($('#code-9').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('code-9'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'pass-email',res.ticket,res.randstr);}
});
}
});

//手机号登录
myApp.onPageBeforeInit('login-phone', function (page) {
if($('#code-5').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('code-5'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'phone-login',res.ticket,res.randstr);}
});
}
if($('#reg-5').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('reg-5'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_login_phone(res.ticket,res.randstr);}
});
}
});



//发布红包
myApp.onPageBeforeInit('publish-redbag', function (page) {
$('.wuju-publish-redbag-form .type li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-publish-redbag-form .tips').html($(this).attr('title'));
});

$('.wuju-publish-redbag-form .img-list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});
});

//幸运抽奖
myApp.onPageBeforeInit('luck-draw', function (page) {
$('.wuju-luck-draw-list li').click(function(){//列表tab切换
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children().eq($(this).index()).show().siblings().hide();
});
});


//消息
myApp.onPageBeforeInit('notice', function (page){
$('.wuju-mine-box li.notice i,.toolbar .mine i').empty();//移除红点
wuju_index_notice_js_load();

//下拉刷新
var ptrContent = $('.wuju-notice-page-content.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
if($('.wuju-load-post').length>0){//防止多次下拉
return false;	
}
$('.wuju-chat').prepend(wuju.loading_post);
myApp.pullToRefreshDone();
// //下拉刷新完成
setTimeout(function (){
wuju_index_notice_js_load();
$('.wuju-chat-tab a').first().addClass('active').siblings().removeClass('active');
layer.open({content:'刷新成功',skin:'msg',time:2});
}, 800);

});
});

//---------------------------内页视频专题-----------------
myApp.onPageBeforeInit('video-special',function(page){
wuju_index_video_special_js_load('#wuju-page-video-special');//视频专题需要加载的js

if($('.wuju-video-special-list').hasClass('waterfall')){//瀑布流渲染
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

});

//---------------------------上传头像页面-----------------
myApp.onPageBeforeInit('upload-avatar',function(page){
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
data:{base64:data,user_id:page.query['user_id']},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
$('.wuju-setting-box .avatarimg img.avatar').attr('src',msg.file_url);
if(msg.self){//如果是自己操作
$('.wuju-mine-user-info img.avatar,.wuju-setting-box .avatarimg img.avatar,.wuju-home-navbar img.avatar').attr('src',msg.file_url);
}
history.back(-1);//返回上一页
}else if(msg.code==3){//打开开通会员页面
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
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

$('.wuju-setting-box li.user_power select').change(function(event){//设置用户组
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
this_dom.siblings('.value').html('巡查员');
}else if(user_power==4){
this_dom.siblings('.value').html('风险账户');
}else if(user_power==5){
this_dom.siblings('.value').html('审核员');
}
}
}
});
});

});
//---------------------------更多设置页面-----------------
myApp.onPageInit('setting-more', function (page) {

//下拉选择器
$('.wuju-setting-box li.select select').change(function(event) {
value=$(this).val();
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile.php",
data:{value:value,author_id:author_id,type:this_dom.parents('li').attr('data')},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
this_dom.siblings('.value').html(this_dom.children('option:selected').text());
}
}
});
});


//设置生日
$('.wuju-setting-box li.birthday').change(function(event) {
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
});

});


//---------------------------更多设置页面-----------------
myApp.onPageInit('setting-email-notice', function (page) {

//下拉选择器
$('.wuju-setting-box li.select select').change(function(event) {
value=$(this).val();
author_id=$('.wuju-setting-content').attr('data');
this_dom=$(this);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/setting/profile.php",
data:{value:value,author_id:author_id,type:this_dom.parents('li').attr('data')},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
this_dom.siblings('.value').html(this_dom.children('option:selected').text());
}
}
});
});


});


//---------------------------更多个人说明页面-----------------
myApp.onPageAfterAnimation('setting-desc', function (page) {
t=$('#wuju-setting-desc').val(); 
$('#wuju-setting-desc').val("").focus().val(t); 
});

//---------------------------更多头衔设置页面-----------------
myApp.onPageAfterAnimation('setting-honor', function (page) {
$('.wuju-user_honor-select-form .list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});

});


//---------------------------设置-修改手机号-----------------
myApp.onPageAfterAnimation('setting-phone', function (page) {
if($('#code-3').length>0){
new TencentCaptcha(document.getElementById('code-3'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'phone',res.ticket,res.randstr);}
});
}
});

//---------------------------设置-修改邮箱号-----------------
myApp.onPageAfterAnimation('setting-email', function (page) {
if($('#code-4').length>0){
new TencentCaptcha(document.getElementById('code-4'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_get_code(120,'email',res.ticket,res.randstr);}
});
}

});



//--------------------论坛页面-------
myApp.onPageInit('bbs',function(page){
//$('[data-page=bbs] .navbar').removeClass('color');//移除color
bbs_id=page.query.bbs_id;


//渲染瀑布流
if($('.wuju-bbs-post-list-3').length>0){
waterfull_margin=$('#wuju-waterfull-margin').height();
var grid=$('.wuju-bbs-post-list-3').masonry({
itemSelector:'.grid',
gutter:waterfull_margin,
transitionDuration:0
});
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});   
} 


//滚动事件
$('.wuju-bbs-content').scroll(function(){
scrollTop =$(this).scrollTop();//滚动高度

if(scrollTop>50){
$('[data-page=bbs] .navbar-inner.navbar-on-center').addClass('color');
}else{
$('[data-page=bbs] .navbar-inner.navbar-on-center').removeClass('color');
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
if(type==''||type==undefined){type='new';}

$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/bbs.php",
data: {page:bbs_page,bbs_id:bbs_id,type:type,topic:topic},
success: function(msg){
if(msg!=0){
bbs_post_list.append(msg);

if(bbs_post_list.hasClass('wuju-bbs-post-list-3')){//瀑布流
grid.masonry('reloadItems');  
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});
}

bbs_loading = false; 
bbs_page++;
}else{
// layer.open({content:'没有更多内容！',skin:'msg',time:2});
bbs_loading = true; 
}
$('.wuju-load-post').remove();
}
});


}); //滚动事件



}); 

//---------------------------话题页面-----------------
myApp.onPageBeforeInit('topic',function(page){
topic_id=page.query.topic_id;


wuju_lightbox();

//滚动事件
$('.wuju-topic-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度

if(scrollTop>30){
$('[data-page=topic] .navbar-inner.navbar-on-center').addClass('color');
}else{
$('[data-page=topic] .navbar-inner.navbar-on-center').removeClass('color');
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

//--------------------------大转盘页面-----------------
myApp.onPageBeforeInit('lottery',function(page){
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
// $('[data-page=member-mine] .navbar').removeClass('color');//移除color
wuju_lightbox();
});


myApp.onPageAfterAnimation('member-mine', function (page){
author_id=page.query.author_id;

//加载更多
mine_loading=false;

$('.page-on-center #wuju-member-mine-page').on('infinite',function(){
if(mine_loading) return;
mine_page=parseInt($('.wuju-member-'+author_id).attr('page'));
mine_post_list=$('.page-on-center .wuju-member-mine-post-list');
mine_loading = true;
mine_post_list.after(wuju.loading_post);
type=$('.page-on-center .wuju-member-menu li.on').attr('type');
data=$('.page-on-center .wuju-member-menu li.on').attr('data');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/data.php",
data: {page:mine_page,type:type,load_type:'more',data:data,author_id:author_id},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
mine_loading = true; 
}else{
mine_post_list.append(msg);
wuju_lightbox()
$('.wuju-member-'+author_id).attr('page',mine_page+1);
mine_loading = false;  
} 
}
});
}); 


$('.page-on-center #wuju-member-mine-page').scroll(function(){
scrollTop=$(this).scrollTop();//滚动高度
if(scrollTop>200){
$('[data-page=member-mine] .navbar-inner.navbar-on-center').addClass('color');
}else{
$('[data-page=member-mine] .navbar-inner.navbar-on-center').removeClass('color');
};
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
// $('[data-page=member-other] .navbar').removeClass('color');//移除color
wuju_lightbox();
});

myApp.onPageAfterAnimation('member-other', function (page) {
author_id=page.query.author_id;

//加载更多
other_loading=false;

$('.page-on-center #wuju-member-other-page').on('infinite',function(){
if(other_loading) return;
other_page=parseInt($('.wuju-member-'+author_id).attr('page'));	
other_post_list=$('.page-on-center .wuju-member-other-post-list');
other_loading = true;
other_post_list.after(wuju.loading_post);
type=$('.page-on-center .wuju-member-menu li.on').attr('type');
data=$('.page-on-center .wuju-member-menu li.on').attr('data');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/data.php",
data: {page:other_page,type:type,load_type:'more',data:data,author_id:author_id},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
other_loading = true; 
}else{
other_post_list.append(msg);
wuju_lightbox()
$('.wuju-member-'+author_id).attr('page',other_page+1);
other_loading = false;  
} 
}
});
}); 

//滚动事件
$('.page-on-center #wuju-member-other-page').scroll(function(){
scrollTop =$(this).scrollTop();//滚动高度
if(scrollTop>200){
$('[data-page=member-other] .navbar-inner.navbar-on-center').addClass('color');
}else{
$('[data-page=member-other] .navbar-inner.navbar-on-center').removeClass('color');
};
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
wuju_lightbox();

$('#wuju-chat-user-'+author_id+' .tips').remove();//消灭提示
wuju_update_notice_tips();//同步消息数

$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);


//图片加载完成
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
});



$('.wuju-chat-list-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
if(contentH - viewH - scrollTop-navbarH*2 >200){ //到达底部时,加载新内容
$('.wuju-msg-tips').show();
}else{
$('.wuju-msg-tips').hide().html('底部');	
}
});


document.querySelector('#im-file').addEventListener('change',function(){
myApp.showPreloader('上传中...');
data=new FormData($("#wuju-im-upload-form")[0]);
$.ajax({
type: "POST",
dataType:'json',
contentType: false,
processData: false, 
url:wuju.wuju_ajax_url+"/upload/im-one.php",
data:data,
success: function(msg){
myApp.hidePreloader();
$('#im-file').val('');
if(msg.code==1){


ws.send('{"from_url":"'+wuju.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_name":"'+wuju.nickname_base+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');

if($('#wuju-chat-user-'+author_id).length>0){//当前会话置顶
$('#wuju-chat-tab-recently .wuju-group-top-br').after($('#wuju-chat-user-'+author_id));
$('#wuju-chat-user-'+author_id+' .desc').text('[图片]');
}

$('.wuju-chat-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content"><a href="'+msg.file_url+'" data-fancybox="gallery"><img src="'+msg.file_url+'"></a></div></li>');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
});
}else{
layer.open({content:msg.msg,skin:'msg',time:2});	
}
}
});
});


//头部下拉刷新加载历史记录
var ptrContent = $('.wuju-chat-list-content.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
myApp.pullToRefreshDone();
if($('.wuju-load-post').length>0){
return false;	
}
page=parseInt($('.wuju-chat-list-content').attr('page'));
if(page>3){
if(!wuju.is_vip){
layer.open({content:'非VIP用户只能查看3页聊天记录！',skin:'msg',time:2});
return false;	
}
}
if(page>15){
layer.open({content:'最多只能查看15页聊天记录！',skin:'msg',time:2});
return false;	
}
$('.wuju-chat-list').before(wuju.loading_post);//加载动画
$('.wuju-chat-list').prepend('<div id="wuju-chat-group-mao"></div>');
author_id=$('.wuju-chat-list-content').attr('data');
$.ajax({   
url:wuju.wuju_ajax_url+"/chat/history-one.php",
type:'POST',    
data:{page:page,author_id:author_id},
success:function(msg){
$('.wuju-load-post').remove();
if(msg!=0){
$('#wuju-chat-group-mao').before(msg);
$(".wuju-chat-list-content").animate({scrollTop:$("#wuju-chat-group-mao").offset().top},0);
$('#wuju-chat-group-mao').remove();
$('.wuju-chat-list-content').attr('page',page+1);
}else{
layer.open({content:'没有更多记录！',skin:'msg',time:2});
}
}
});	
});

if(wuju.websocket_chat_inputing){
$("#wuju-msg-content").blur(function(){
ws.send('{"from_url":"'+wuju.home_url+'","type":"input-close","notice_user_id":"'+author_id+'","do_user_id":"'+wuju.user_id+'","do_user_name":"'+wuju.nickname_base+'"}');
});
}


});



//---------------------群聊-------
myApp.onPageBeforeInit('chat-group',function(page){
bbs_id=page.query.bbs_id;
wuju_lightbox();
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);



//图片加载完成
$('.wuju-chat-message-list-content img').on('load',function(){
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);
});


$('.wuju-chat-group-list-content').scroll(function(){
navbarH=$('.navbar').height();
viewH =Math.round($(this).height()),//可见高度
contentH =$(this).get(0).scrollHeight,//内容高度
scrollTop =$(this).scrollTop();//滚动高度
// console.log(navbarH);
if(contentH - viewH - scrollTop-navbarH*2 >200){ //到达底部时,加载新内容
$('.wuju-msg-tips').show();
}else{
$('.wuju-msg-tips').hide().html('底部');	
}
});



//头部下拉刷新加载历史记录
var ptrContent = $('.wuju-chat-group-list-content.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
myApp.pullToRefreshDone();
if($('.wuju-load-post').length>0){
return false;	
}
page=parseInt($('.wuju-chat-group-list-content').attr('page'));
if(page>3){
if(!wuju.is_vip){
layer.open({content:'非VIP用户只能查看3页群聊记录！',skin:'msg',time:2});
return false;	
}
}
if(page>15){
layer.open({content:'最多只能查看15页群聊记录！',skin:'msg',time:2});
return false;	
}
$('.wuju-chat-group-list').before(wuju.loading_post);//加载动画
$('.wuju-chat-group-list').prepend('<div id="wuju-chat-group-mao"></div>');
bbs_id=$('.wuju-chat-group-list-content').attr('data');
$.ajax({   
url:wuju.wuju_ajax_url+"/chat/history-group.php",
type:'POST',    
data:{page:page,bbs_id:bbs_id},
success:function(msg){
$('.wuju-load-post').remove();
if(msg!=0){
$('#wuju-chat-group-mao').before(msg);
$(".wuju-chat-group-list-content").animate({scrollTop:$("#wuju-chat-group-mao").offset().top},0);
$('#wuju-chat-group-mao').remove();
$('.wuju-chat-group-list-content').attr('page',page+1);
}else{
layer.open({content:'没有更多记录！',skin:'msg',time:2});
}
}
});	
});

document.querySelector('#im-file').addEventListener('change',function(){
myApp.showPreloader('上传中...');
data=new FormData($("#wuju-im-upload-form")[0]);
$.ajax({
type: "POST",
dataType:'json',
contentType: false,
processData: false, 
url:wuju.wuju_ajax_url+"/upload/im-group.php",
data:data,
success: function(msg){
myApp.hidePreloader();
$('#im-file').val('');
if(msg.code==1){


ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group","do_user_id":"'+msg.do_user_id+'","bbs_id":"'+msg.bbs_id+'","group_type":"'+msg.group_type+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'","content":"'+msg.id+'"}');


$('.wuju-chat-group-list').append('<li class="myself"  id="wuju-chat-content-'+msg.id+'"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content" onclick="wuju_chat_content_more('+msg.id+','+wuju.user_id+','+bbs_id+')"><a href="'+msg.file_url+'" data-fancybox="gallery"><img src="'+msg.file_url+'"></a></div></li>');
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);
});
}else{
layer.open({content:msg.msg,skin:'msg',time:2});	
}
}
});
});

});

//加入群聊
myApp.onPageBeforeInit('chat-group',function(page){
bbs_id=$('.wuju-chat-group-list-content').attr('data');

ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group_join","do_user_id":"'+wuju.user_id+'","bbs_id":"'+bbs_id+'","do_user_name":"'+wuju.nickname_base+'","chat_group_join_text":"'+wuju.chat_group_join_text+'"}');

});

//关闭群聊
myApp.onPageBack('chat-group', function (page){//返回
bbs_id=$('.wuju-chat-group-list-content').attr('data');

ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group_back","do_user_id":"'+wuju.user_id+'","bbs_id":"'+bbs_id+'","do_user_name":"'+wuju.nickname_base+'"}');
 
})





//---------------------------发布动态页面-----------------
myApp.onPageBeforeInit('publish',function(page){
type=page.query.type;

if(type=='words'){
if($('#publish-'+type).length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_words(res.ticket,res.randstr);}
});
}
}else if(type=='music'){
if($('#publish-'+type).length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_music_video('music',res.ticket,res.randstr);}
});
}
}else if(type=='video'){
if($('#publish-'+type).length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_music_video('video',res.ticket,res.randstr);}
});
}
}else if(type=='single'){
if($('#publish-'+type).length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_single(res.ticket,res.randstr);}
});
}	
}else if(type=='secret'){
if($('#publish-'+type).length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('publish-'+type),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_secret(res.ticket,res.randstr);}
});
}	
}else if(type=='bbs'){//帖子类型||发布帖子||发表帖子
if($('#publish-bbs').length>0&&!wuju.is_admin){
new TencentCaptcha(document.getElementById('publish-bbs'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_publish_bbs(res.ticket,res.randstr);}
});
}

if($('.wuju-publish-words-form .download-box').length>0){
$(".wuju-bbs-download-add").click(function(){
add=$('.download-box .li').html();
$(this).before('<div class="li"><i class="wuju-icon wuju-guanbi"></i>'+add+'</div>');
}); 
$('.wuju-publish-words-form .download-box').on('click','.li>i',function(){
$(this).parent().remove();
});
}

//选择子分类
$('.wuju-publish-select-cat .select-content li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('input[name="bbs_child_id"]').val($(this).attr('data'));
});

$('.wuju-publish-power-list').children('li').eq(0).addClass('on');
type=$('.wuju-publish-power-list').children('li').eq(0).attr('type');
$('input[name="post-type"]').val(type);

if(type=='pay_see'){
$('.power-content .price,.power-content .credit-type').show();
}
if(type=='answer'){
$('.power-content .answer-price').show();
}
if(type=='pay_see'||type=='vip_see'||type=='login_see'||type=='comment_see'){
$('.power-content textarea').show();
}

$("body").on("click",'.wuju-publish-power-list li', function(e){
$('.wuju-publish-power-list-form li').eq($(this).index()).addClass('on').siblings().removeClass('on');
type=$(this).attr('type');
$('input[name="post-type"]').val(type);

if(type=='pay_see'){
$('.power-content .price,.power-content .credit-type').show();
}
if(type=='answer'){
$('.power-content .price,.power-content .credit-type,.power-content textarea').hide();
$('.power-content .answer-price').show();
}
if(type=='pay_see'||type=='vip_see'||type=='login_see'||type=='comment_see'){
$('.power-content textarea').show();
$('.power-content .answer-price').hide();
if(type!='pay_see'){
$('.power-content .price,.power-content .credit-type,.power-content .credit-type').hide();	
}
}
if(type=='activity'||type=='vote'||type=='normal'){
$('.power-content .price,.power-content .credit-type,.power-content .answer-price,.power-content textarea').hide();
}
layer.closeAll();
});

}


if(type!='bbs'&&type!='secret'){//不是帖子
$("body").on("click",'.wuju-publish-power-list li', function(e){
$('.wuju-publish-power-list-form li').eq($(this).index()).addClass('on').siblings().removeClass('on');
type=$(this).attr('type');
$('#wuju-pop-power').val($(this).attr('data'));


if(type=='pay'||type=='password'||type=='vip'||type=='login'||type=='comment'||type=='verify'||type=='follow'){
$('.power-content textarea,.power-content label,.power-content .img-power').show();

if(type=='pay'){
$('.power-content .price,.power-content .credit-type').show();
$('.power-content .password').hide();
}
if(type=='password'){
$('.power-content .password').show();
$('.power-content .price,.power-content .credit-type').hide();
}
if(type=='vip'||type=='login'){
$('.power-content .price,.power-content .credit-type,.power-content .password').hide();
}
}else if(type=='open'||type=='private'){
$('.power-content .price,.power-content .credit-type,.power-content .password,.power-content textarea,.power-content label,.power-content .img-power').hide();
}
layer.closeAll();
});
}



if(type!='video'&&type!='music'&&type!='secret'){
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

//获取长宽
// var bi;
// var reader = new FileReader();
// reader.readAsDataURL(info);
// reader.onload = function(theFile) {
// var image = new Image();
// image.src = theFile.target.result;
// image.onload = function() {
// bi=this.height/this.width;
// console.log(bi);
// };
// };
// if(info.type!='image/gif'&&bi<3){
if(info.type!='image/gif'){
lrz(info,{quality:parseFloat(wuju.publish_img_quality)})
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
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.file_url+'" data-fancybox="gallery-publish"><img src="'+msg.file_url+'"></a></li>');
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
$('#wuju-publish-images-list').append('<li><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_image('+words_images_max+',this)"></i><a href="'+msg.file_url+'" data-fancybox="gallery-publish"><img src="'+msg.file_url+'"></a></li>');
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

}//图片上传结束




if(type=='video'){
document.querySelector('#wuju-upload-video').addEventListener('change', function () {

//判断后缀
var location=$(this).val();
var point=location.lastIndexOf(".");
type=location.substr(point+1);
if(wuju.upload_video_type.indexOf(type)== -1 ){
layer.open({content:'不支持该文件类型！'+type,skin:'msg',time:2});
$('#wuju-upload-video').val('');
return false;
}

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
playbackRate: [0.5,1,1.5,2,6],
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
$('.wuju-remove-video-toolbar .read').removeClass('on').text('设置封面');
$('.wuju-publish-video-set-cover-content .cover').empty();
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

$('.wuju-publish-video-set-cover-content .cover').html('<img src="'+video_cover+'">');
$.ajax({
type:"POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/upload/video-img-base64.php",
data:{base64:video_cover},
success: function(rel){
if(rel.code==1){
$('#wuju-video-img-url').val(rel.file_url);	
$('.wuju-remove-video-toolbar span.read').addClass('on').text('已设置封面');
$('.wuju-publish-video-set-cover-content .cover').html('<img src="'+rel.file_url+'">');
}else{
layer.open({content:rel.msg,skin:'msg',time:2});
$('.wuju-remove-video-toolbar span.read').addClass('on').removeAttr('data-popup').removeClass('open-popup');
}
}
});	
}
});

$('#wuju-publish-remove-video-cover').click(function(){
$('.wuju-remove-video-toolbar .read').removeClass('on').text('设置封面');
$('.wuju-publish-video-set-cover-content .cover').empty();
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


document.querySelector('#video-cover-file').addEventListener('change',function(){
myApp.showPreloader('上传中...');
data=new FormData($("#wuju-video-cover-upload-form")[0]);
$.ajax({
type: "POST",
dataType:'json',
contentType: false,
processData: false, 
url:wuju.wuju_ajax_url+"/upload/video-img.php",
data:data,
success: function(msg){
myApp.hidePreloader();
$('#video-cover-file').val('');
if(msg.code==1){
$('.wuju-publish-video-set-cover-content .cover').html('<img src="'+msg.file_url+'">');
$('#wuju-video-img-url').val(msg.file_url);
}else{
layer.open({content:msg.msg,skin:'msg',time:2});	
}
}
});
});


}


if(type=='music'){//上传音乐
document.querySelector('#wuju-upload-music').addEventListener('change', function () {

//判断后缀
var location=$(this).val();
var point=location.lastIndexOf(".");
type=location.substr(point+1);
if(wuju.upload_music_type.indexOf(type)== -1 ){
layer.open({content:'不支持该文件类型！'+type,skin:'msg',time:2});
return false;
}
	
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



if(type!='select'){

wuju_comment_aite_user_js();//发布@好友

//选择话题
$('.wuju-publish-topic-popup').on('opened',function (){//打开
if($('.wuju-publish-aite-form .list.topic li').length==0){
$('.wuju-publish-aite-form .list.topic').prepend(wuju.loading_post);
$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/topic/topic-hot.php",
success: function(msg){
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

}

if(type=='secret'){
$('.wuju-publish-secret-color-list li').click(function(){
$(this).parent().prev().children('textarea').css('background',$(this).attr('data'));
$('[name=color]').val($(this).attr('data'));
});
$('.wuju-publish-secret-type-list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});
}

$('.wuju-publish-words-form .power-content .credit-type m').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('#wuju-pay-credit-type').val($(this).attr('data'));
});

});


//---------------------------//充值余额页面-----------------
myApp.onPageAfterAnimation('recharge-money',function(page){
$('.wuju-recharge-number li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-recharge-money-input input').val($(this).children('.bottom').find('m').text());
});
$('.wuju-recharge-type li').click(function() {
$('#wuju-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
$(this).addClass('on').siblings().removeClass('on');
type=$(this).attr('data');
$('#wuju-recharge-type').val(type);
if(type=='alipay_mobile'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/alipay/alipay-h5.php');	
}else if(type=='wechatpay_mp'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/wechatpay/wechat-mp.php');	
}else if(type=='epay_alipay'||type=='epay_wechatpay'){
$('#wuju-credit-recharge-form').append('<input type="hidden" name="pay_type" value="'+type+'">');
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/epay/index.php');	
}
});
$('.wuju-recharge-type li.on').click();
});


//---------------------------//充值金币页面-----------------
myApp.onPageAfterAnimation('recharge-credit',function(page){
$('.wuju-recharge-number li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
$('#wuju-credit-recharge-number').val($(this).children('.bottom').attr('data'));
});
$('.wuju-recharge-type li').click(function() {
$('#wuju-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
$(this).addClass('on').siblings().removeClass('on');
type=$(this).attr('data');
$('#wuju-recharge-type').val(type);
if(type=='alipay_mobile'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/alipay/alipay-h5.php');	
}else if(type=='wechatpay_mp'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/wechatpay/wechat-mp.php');	
}else if(type=='epay_alipay'||type=='epay_wechatpay'){
$('#wuju-credit-recharge-form').append('<input type="hidden" name="pay_type" value="'+type+'">');
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/epay/index.php');	
}
});
$('.wuju-recharge-type li.on').click();
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
$('#wuju-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
$(this).addClass('on').siblings().removeClass('on');
type=$(this).attr('data');
$('#wuju-recharge-type').val(type);
if(type=='creditpay'){
$('#wuju-credit-recharge-number').val($('.wuju-recharge-number li.on').children('.bottom').attr('credit_price'));
$('.wuju-recharge-number li .top z').hide();//隐藏赠送
$(".wuju-recharge-number li").each(function(){
$(this).children('.bottom').find('m').html($(this).children('.bottom').attr('credit_price'));
});
$('.wuju-recharge-number li .bottom i').html(wuju.credit_name);
}else{
$('#wuju-credit-recharge-number').val($('.wuju-recharge-number li.on').children('.bottom').attr('rmb_price'));	
$('.wuju-recharge-number li .top z').css('display','block');//显示赠送
$(".wuju-recharge-number li").each(function(){
$(this).children('.bottom').find('m').html($(this).children('.bottom').attr('rmb_price'));
});
$('.wuju-recharge-number li .bottom i').html('元');
if(type=='alipay_mobile'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/alipay/alipay-h5.php');	
}else if(type=='wechatpay_mp'){
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/wechatpay/wechat-mp.php');	
}else if(type=='epay_alipay'||type=='epay_wechatpay'){
$('#wuju-credit-recharge-form').append('<input type="hidden" name="pay_type" value="'+type+'">');
$('#wuju-credit-recharge-form').attr('action',wuju.home_url+'/Extend/pay/epay/index.php');	
}	
}
});


$('.wuju-recharge-type li.on').click();

});

//---------------------------//发送礼物页面-----------------
myApp.onPageAfterAnimation('send-gift',function(page){
$('.wuju-send-gift-form li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-send-gift-toolbar span.send i').html($(this).children('.bottom').attr('data'));
});
});


//---------------------系统通知------
myApp.onPageBeforeInit('system-notice',function(page){
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
$('.wuju-mine-page li.visitor .item-title>i,.wuju-mine-page li.visitor p>i').remove();//移除红点
});







//收入记录
myApp.onPageBeforeInit('income', function (page) {
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
data: {page:page,type:type,author_id:$('.wuju-recharge-note-content').attr('data')},
success: function(msg){
if(msg.code!=0){  

html='';
for (var i = 0; i < msg.data.length; i++) {
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
<div class="item-after">'+msg.data[i].number+'</div>\
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
data: {page:page,type:type,author_id:$('.wuju-recharge-note-content').attr('data')},
success: function(msg){
if(msg.code!=0){  

html='';
for (var i = 0; i < msg.data.length; i++) {
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
<div class="item-after out">'+msg.data[i].number+'</div>\
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
for (var i = 0; i < msg.data.length; i++) {
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
<div class="item-after">'+msg.data[i].number+'</div>\
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



//任务事件
myApp.onPageBeforeInit('task', function (page) {

$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/commend-post.php",
data: {},
success: function(msg){

}
});

$('#wuju-task-navbar-center span').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-task-form-content').find('ul').eq($(this).index()).show().siblings().hide();
});
});


//生成内容海报
myApp.onPageBeforeInit('content-playbill',function(page){
url=page.query['url'];
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

//复制推广链接
var clipboard = new ClipboardJS('#wuju-referral-cover');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});
});



//直播
myApp.onPageBeforeInit('live', function (page) {
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
// $('#wuju-video-live .xgplayer-start').click();
}


//直播tab菜单
$('.wuju-live-page-nav li').click(function(){
$('.wuju-live-toolbar textarea,.wuju-live-toolbar').removeAttr('style');
$('.wuju-live-toolbar,.wuju-right-bar').hide();
$(this).addClass('on').siblings().removeClass('on');
$(this).parents('.wuju-live-page-header').next().children('ul').eq($(this).index()).show().siblings().hide();
if($(this).hasClass('comment')){
$('.wuju-live-toolbar,.wuju-right-bar').show();
$('.wuju-live-page-nav-list').scrollTop($('.wuju-live-page-nav-list')[0].scrollHeight);//互动评论向下啦
}
});

wuju_lightbox();
});

myApp.onPageAfterAnimation('live', function (page) {
$('.wuju-live-page-nav-list').scrollTop($('.wuju-live-page-nav-list')[0].scrollHeight);//互动评论向下啦
});





//宠物窝-自己
myApp.onPageBeforeInit('pet-nest-mine', function (page){
if($('#pet-1').length>0&&!wuju.is_admin){
pet_id=$('#pet-1').attr('data-id');
pet_number=$('#pet-1').attr('data-number');
new TencentCaptcha(document.getElementById('pet-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pet_sell(pet_id,pet_number,document.getElementById('pet-1'),res.ticket,res.randstr);}
});
}
});

//宠物窝-别人
myApp.onPageBeforeInit('pet-nest-other', function (page){
if($('#pet-1').length>0&&!wuju.is_admin){
pet_id=$('#pet-1').attr('data-id');
pet_number=$('#pet-1').attr('data-number');
new TencentCaptcha(document.getElementById('pet-1'),wuju.machine_verify_appid,function(res){
if(res.ret === 0){wuju_pet_steal(pet_id,pet_number,document.getElementById('pet-1'),res.ticket,res.randstr);}
});
}
});



//收藏
myApp.onPageBeforeInit('collect', function (page){
wuju_lightbox();//灯箱
//加载更多
collect_loading = false;
var collect_page;
if(!collect_page){
collect_page=2;
}

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
wuju_lightbox();
collect_page++;
collect_loading = false;  
} 
}
});
});


});


//收藏-图片
myApp.onPageBeforeInit('collect-img', function (page){
wuju_lightbox();//灯箱

var grid=$('.wuju-collect-img-content').masonry({//渲染瀑布流
itemSelector:'li',
gutter:7.5,
// transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
}); 

//加载更多
collect_img_loading = false;
var collect_img_page;
if(!collect_img_page){
collect_img_page=2;
}

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
var grid=$('.wuju-collect-img-content').masonry({//渲染瀑布流
itemSelector:'li',
gutter:7.5,
transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
}); 

wuju_lightbox();
collect_img_page++;
collect_img_loading = false;  
} 
}
});
});
});



//树洞
myApp.onPageBeforeInit('secret',function(page){


//下拉刷新
ptrContent = $('.wuju-secret-content.pull-to-refresh-content');
ptrContent.on('refresh', function (e){
myApp.pullToRefreshDone();
type=$('.wuju-secret-menu li.on').attr('data');
wuju_secret_post(type,'pull',this);
});


//加载更多
secret_loading = false;
secret_page = 2;
$('.wuju-secret-content.infinite-scroll').on('infinite',function(){
if(secret_loading) return;
secret_post_list=$('.wuju-post-secret-list');
secret_loading = true;
secret_post_list.after(wuju.loading_post);
type=$('.wuju-secret-menu li.on').attr('data');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/secret.php",
data: {page:secret_page,type:type,load_type:'more'},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
secret_loading = true; 
}else{
secret_post_list.append(msg);
wuju_lightbox()
secret_page++;
secret_loading = false;  
} 
}
});
});
});


//匿名-我的
myApp.onPageBeforeInit('secret-mine',function(page){

//加载更多
secret_mine_loading = false;
secret_mine_page = 2;
$('.wuju-secret-mine-content.infinite-scroll').on('infinite',function(){
if(secret_mine_loading) return;
secret_post_list=$('.wuju-post-secret-list.mine');
secret_mine_loading = true;
secret_post_list.after(wuju.loading_post);
type=$('.wuju-secret-menu li.on').attr('data');
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/secret.php",
data: {page:secret_mine_page,type:type,load_type:'more',author_id:1},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
secret_mine_loading = true; 
}else{
secret_post_list.append(msg);
wuju_lightbox()
secret_mine_page++;
secret_mine_loading = false;  
} 
}
});
});

});

//匿名详情页
myApp.onPageBeforeInit('post-secret',function(page){
$('.wuju-secret-comment-btn .text').click(function(){
obj=$(this).parent();
obj.html('<textarea id="wuju-secret-comment-content"></textarea>');
obj.after('<div class="wuju-secret-comment-content-btn" onclick="wuju_secret_comment()">唠叨一下</div>');
$('#wuju-secret-comment-content').focus();
});
});


//筛选页面
myApp.onPageBeforeInit('select',function(page){

//点击论坛板块切换
$('.wuju-select-subnavbar-list>div .list li').click(function(){
$('.topic-list .bbs-topic').remove();
$('.wuju-select-left-more-content .topic-list').prepend($('.bbs-topic-hidden').children('yyy').eq($(this).index()).html());
});
	
$('.wuju-select-subnavbar-list .bbs,.wuju-select-subnavbar-list .sort').click(function(){
$(this).siblings().removeClass('on').children('.list').hide().siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
$(this).addClass('on').children('.list').show().siblings('i').removeClass('wuju-lower-triangle').addClass('wuju-triangle');
});
$('.wuju-select-subnavbar-list .list').click(function(e){
window.event.stopPropagation();
$(this).hide().siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
$(this).parent().removeClass('on');

// select_loading=false;
// $('.wuju-select-content').attr('page',2);
// $('.wuju-select-content').animate({scrollTop:0},0);
// wuju_page_select_submit_form();//筛选数据
});
$('.wuju-select-subnavbar-list>div .list li').click(function(e){
window.event.stopPropagation();
$(this).addClass('on').siblings().removeClass('on');
$(this).parents('.list').hide().siblings('span').text($(this).text());
$(this).parents('.list').siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
$(this).parents('.on').removeClass('on');

select_loading=false;
$('.wuju-select-content').attr('page',2);
$('.wuju-select-content').animate({scrollTop:0},0);
wuju_page_select_submit_form();//筛选数据
});

$('.wuju-select-subnavbar-list .more').click(function(){
$(this).siblings().removeClass('on').children('.list').hide().siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
layer.open({
type: 1,
className:'wuju-select-left-more-form',
content: $('.wuju-select-more-content').html(),
anim: 'left',
});	


$('.wuju-select-left-more-content .topic-list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-select-more-content').html($(this).parents('.layui-m-layercont').html());
layer.closeAll();

select_loading=false;
$('.wuju-select-content').animate({scrollTop:0},0);
$('.wuju-select-content').attr('page',2);
wuju_page_select_submit_form();//筛选数据
});	

});


//获取表单数据
function wuju_get_select_data(){
url='';
//论坛
if($('.wuju-select-subnavbar-list>.bbs .list li.on').length>0){
url+='bbs_id='+$('.wuju-select-subnavbar-list>.bbs .list li.on').attr('data');	
}
//话题
if($('.wuju-select-left-more-content .topic-select').length>0){
topic_select_i=0;
topic_str='';
$('.wuju-select-left-more-content .topic-select').each(function(){
topic_id=$(this).find('.on').attr('data');
if(topic_id==undefined){
topic_id='all';
// $('.wuju-select-left-more-content .topic-select').eq(topic_select_i).find('[data=all]').addClass('on');
}
topic_str+=topic_id+',';
topic_select_i++;
});
if(topic_str){
topic_str=topic_str.substring(0,topic_str.lastIndexOf(','));
url+='&topic_id='+topic_str;	
}
}

//字段
if($('.wuju-select-left-more-content .field-select').length>0){
field_select_i=0;
field_str='';
$('.wuju-select-left-more-content .field-select').each(function(){
field=$(this).find('.on').attr('data');
if(field==undefined){
field='all';
// $('.wuju-page-select-header-box .field-select').eq(field_select_i).find('[data=all]').addClass('on');
}
field_str+=field+',';
field_select_i++;
});
if(field_str){
field_str=field_str.substring(0,field_str.lastIndexOf(','));
url+='&field='+field_str;    
}
}

//权限
if($('.wuju-select-left-more-content .power li.on').length>0){
url+='&power='+$('.wuju-select-left-more-content .power li.on').attr('data');	
}
//排序
if($('.wuju-select-subnavbar-list>.sort .list li.on').length>0){
url+='&sort='+$('.wuju-select-subnavbar-list>.sort .list li.on').attr('data');	
}


//页面ID
post_id=$('.wuju-select-content').attr('post_id');
url+='&post_id='+post_id;
	

keyword=$('#wuju-select-input').val();
if(keyword){
url+='&search='+keyword;	
}
return url;
}


//提交筛选表单
function wuju_page_select_submit_form(){
waterfull_margin=$('#wuju-waterfull-margin').height();
$('.wuju-page-select-post-list').before(wuju.loading_post);
url=wuju_get_select_data()+'&page=1';
$.ajax({
type:"POST",
url:wuju.wuju_ajax_url+"/data/select.php",
data:url,
success: function(msg){
$('.wuju-load-post').remove();
$('.wuju-page-select-post-list').html(msg);
wuju_lightbox();
if($('.wuju-select-content').hasClass('waterfall')){//渲染瀑布流
var grid=$('.wuju-page-select-post-list').masonry({
itemSelector:'li',
gutter:waterfull_margin,
// transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});    
}



}//success
});



}//wuju_page_select_submit_form

wuju_page_select_submit_form();//筛选数据


//提交搜索
$('#wuju-select-search-form').submit(function (event) {
event.preventDefault();//动作：阻止表单的默认行为
select_loading=false;
$('.wuju-select-content').attr('page',2);
$('.wuju-select-content').animate({scrollTop:0},0);
wuju_page_select_submit_form();//筛选数据
});
$('#wuju-select-input').focus(function(){
$(this).parents('.center').siblings('.subnavbar').find('.wuju-select-subnavbar-list').children().removeClass('on').find('.list').hide();
$(this).parents('.center').siblings('.subnavbar').find('.wuju-select-subnavbar-list').children().removeClass('on').find('.wuju-triangle').addClass('wuju-lower-triangle').removeClass('wuju-triangle');
});




//加载更多
select_loading=false;
select_list=$('.wuju-page-select-post-list');
$('.wuju-select-content.infinite-scroll').on('infinite',function(){

//页数
page=$('.wuju-select-content').attr('page');
url=wuju_get_select_data()+'&page='+page;

if(select_loading) return;
select_page=parseInt($('.wuju-select-content').attr('page'));
select_loading=true;
select_list.after(wuju.loading_post);
waterfull_margin=$('#wuju-waterfull-margin').height();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/select.php",
data:url,
success: function(msg){
$('.wuju-load-post').remove();
if(msg!=0){
select_list.append(msg);
wuju_lightbox();
if($('.wuju-select-content').hasClass('waterfall')){//渲染瀑布流
var grid=$('.wuju-page-select-post-list').masonry({
itemSelector:'li',
gutter:waterfull_margin,
transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});
}

select_loading=false; 
select_page++;
$('.wuju-select-content').attr('page',select_page);
}else{
// layer.open({content:'没有更多内容！',skin:'msg',time:2});
select_loading=true; 
}


//喜欢
$('.wuju-select-content li .bar .like').click(function(){
num=parseInt($(this).children('span').text());
if($(this).children('i').hasClass('had')){
$(this).children('i').removeClass('wuju-xihuan1 had').addClass('wuju-xihuan2');
$(this).children('span').text(num-1);
}else{
$(this).children('i').removeClass('wuju-xihuan2').addClass('wuju-xihuan1 had');
$(this).children('span').text(num+1);	
}
}); 

}
});
}); 

});




//挑战列表页面
myApp.onPageBeforeInit('challenge',function(page){

//加载更多
challenge_loading=false;
challenge_page=2;
$('.wuju-challenge-content.infinite-scroll').on('infinite',function(){
if(challenge_loading) return;
challenge_post_list=$('.wuju-challenge-post-list');
challenge_loading=true;
if($('.wuju-challenge-post-list.mine-join').length>0){
type=$('.wuju-challenge-post-list.mine-join').attr('type');
}else if($('.wuju-challenge-post-list.mine').length>0){
type=$('.wuju-challenge-post-list.mine').attr('type');
}else{
type=$('.wuju-challenge-menu li.on').attr('type');
}

challenge_post_list.after(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/challenge.php",
data: {page:challenge_page,type:type},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
challenge_loading=true; 
}else{
challenge_post_list.append(msg);
challenge_page++;
challenge_loading=false;  
} 
}
});
});

});

//发起挑战
myApp.onPageBeforeInit('challenge-publish',function(page){
$('.wuju-publish-challenge-content .type li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children('div').hide().eq($(this).index()).show();
if($(this).hasClass('a')){
$(this).parent().siblings('.shitou').show();
}else{
$(this).parent().siblings('.shitou').hide();
}
}); 
$('.wuju-publish-challenge-content .shitou li,.wuju-publish-challenge-content .price li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
}); 
});


//参与挑战
myApp.onPageBeforeInit('challenge-join',function(page){
$('.wuju-challenge-content .shitou li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});
});


//我的订单页面
myApp.onPageBeforeInit('order-mine',function(page){

read_type=page.query['read_type'];
if(read_type==2){
$('[type="status-2"]').click();	
}else if(read_type==1){
$('[type="status-1"]').click();
}else if(read_type=='collect'){
$('[type="collect"]').click();	
}

//加载更多
order_loading=false;
order_page=2;
$('.wuju-shop-order-mine-content').on('infinite',function(){
if(order_loading) return;
order_list=$('.wuju-shop-order-mine-list');
order_loading=true;
type=$('.wuju-shop-menu li.on').attr('type');

order_list.after(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/order.php",
data: {page:order_page,type:type},
success: function(msg){
$('.wuju-load-post').remove();
if(msg==0){
order_loading=true; 
}else{
order_list.append(msg);
order_page++;
order_loading=false;  
} 
}
});
});

});



//商品详情页面
myApp.onPageBeforeInit('post-goods',function(page){
$('.navbar-inner').removeClass('color');
post_id=page.query['post_id'];
rand=page.query['rand'];
wuju_lightbox();
var owlCar=$('#wuju-goods-slider-'+rand).owlCarousel({
items: 1,
loop: true,
autoHeight: true,
dots:false,
onInitialized: counter,
onChanged: counter,
});

var carTimer = setInterval(function() {
if(owlCar.height() > 1) clearInterval(carTimer);
owlCar.trigger('refresh.owl.carousel', [100]);
}, 300);

function counter(event) {
if (!event.namespace) {
return;
}
var slides = event.relatedTarget;
$('.slider-counter').text(slides.relative(slides.current()) + 1 + '/' + slides.items().length);
}


$('.wuju-page-goods-content').scroll(function(){
scrollTop=$(this).scrollTop();//滚动高度
if(scrollTop>100){
$('[data-page=post-goods] .navbar-inner.navbar-on-center').addClass('color');
}else{
$('[data-page=post-goods] .navbar-inner.navbar-on-center').removeClass('color');
};
});


//菜单点击
$('.wuju-goods-single-box .title>li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children('ul').hide().eq($(this).index()).show();
});



});

//---------------------------//订单界面-----------------
myApp.onPageAfterAnimation('order-details',function(page){
$('.wuju-recharge-type li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
type=$(this).attr('data');
if(type=='alipay_mobile'){
$('#wuju-goods-recharge-form').attr('action',wuju.home_url+'/Extend/pay/alipay/alipay-h5.php');	
}else if(type=='wechatpay_mp'){
$('#wuju-goods-recharge-form').attr('action',wuju.home_url+'/Extend/pay/wechatpay/wechat-mp.php');	
}else if(type=='epay_alipay'||type=='epay_wechatpay'){
$('#wuju-goods-recharge-form').append('<input type="hidden" name="pay_type" value="'+type+'">');
$('#wuju-goods-recharge-form').attr('action',wuju.home_url+'/Extend/pay/epay/index.php');	
}
});
$('.wuju-recharge-type li.on').click();
});


//商品筛选页面 商城筛选
myApp.onPageBeforeInit('shop-select',function(page){
$('.wuju-select-subnavbar-list .bbs,.wuju-select-subnavbar-list .sort').click(function(){
$(this).siblings().removeClass('on').children('.list').hide().siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
$(this).addClass('on').children('.list').show().siblings('i').removeClass('wuju-lower-triangle').addClass('wuju-triangle');
});


$('.wuju-select-subnavbar-list .bbs,.wuju-select-subnavbar-list .sort').click(function(){
$(this).siblings().removeClass('on').children('.list').hide().siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
$(this).addClass('on').children('.list').show().siblings('i').removeClass('wuju-lower-triangle').addClass('wuju-triangle');
});
$('.wuju-select-subnavbar-list .list').click(function(e){
window.event.stopPropagation();
$(this).hide().siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
$(this).parent().removeClass('on');
});

$('.wuju-select-subnavbar-list>div .list li').click(function(e){
window.event.stopPropagation();
$(this).addClass('on').siblings().removeClass('on');
$(this).parents('.list').hide().siblings('span').text($(this).text());
$(this).parents('.list').siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
$(this).parents('.on').removeClass('on');

select_loading=false;
$('.wuju-shop-select-post-list').attr('page',1);
$('.wuju-shop-goods-select-content').animate({scrollTop:0},0);
wuju_shop_select_submit_form();//筛选数据
});


$('.wuju-select-subnavbar-list .more').click(function(){
$(this).siblings().removeClass('on').children('.list').hide().siblings('i').removeClass('wuju-triangle').addClass('wuju-lower-triangle');
layer.open({
type: 1,
className:'wuju-select-left-more-form',
content: $('.wuju-select-more-content').html(),
anim: 'left',
});	


$('.wuju-select-left-more-content .topic-list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$('.wuju-select-more-content').html($(this).parents('.layui-m-layercont').html());
layer.closeAll();

select_loading=false;
$('.wuju-shop-goods-select-content').animate({scrollTop:0},0);
$('.wuju-shop-select-post-list').attr('page',1);
wuju_shop_select_submit_form();//筛选数据
});	

});
wuju_shop_select_submit_form();

//提交搜索
$('#wuju-shop-select-search-form').submit(function (event) {
event.preventDefault();//动作：阻止表单的默认行为
select_loading=false;
$('.wuju-shop-goods-select-content').animate({scrollTop:0},0);
$('.wuju-shop-select-post-list').attr('page',1);
wuju_shop_select_submit_form();//筛选数据
});

$('#wuju-shop-select-input').focus(function(){
$(this).parents('.center').siblings('.subnavbar').find('.wuju-select-subnavbar-list').children().removeClass('on').find('.list').hide();
$(this).parents('.center').siblings('.subnavbar').find('.wuju-select-subnavbar-list').children().removeClass('on').find('.wuju-triangle').addClass('wuju-lower-triangle').removeClass('wuju-triangle');
});


//加载更多
select_loading=false;
select_list=$('.wuju-shop-select-post-list');
$('.wuju-shop-goods-select-content.infinite-scroll').on('infinite',function(){
page=parseInt(select_list.attr('page'));
// select_list.attr('page',page+1);
if(select_loading) return;
select_loading=true;
wuju_shop_select_submit_form();
}); 


//提交筛选表单
function wuju_shop_select_submit_form(){
page=parseInt($('.wuju-shop-select-post-list').attr('page'));
url='';
//论坛
if($('.wuju-select-subnavbar-list>.bbs .list li.on').length>0){
url+='cat_id='+$('.wuju-select-subnavbar-list>.bbs .list li.on').attr('data');	
}
//排序
if($('.wuju-select-subnavbar-list>.sort .list li.on').length>0){
url+='&sort='+$('.wuju-select-subnavbar-list>.sort .list li.on').attr('data');	
}
//页数
url+='&page='+page;
//列表布局
list_style=$('.wuju-shop-select-post-list').attr('list_style');
url+='&list_style='+list_style;
//价格类型
url+='&price_type='+$('.wuju-select-left-more-content .price_type li.on').attr('data');
//价格范围
url+='&price='+$('.wuju-select-left-more-content .price li.on').attr('data');
//关键词
url+='&search='+$('#wuju-shop-select-input').val();
console.log(url);
waterfull_margin=$('#wuju-waterfull-margin').height();

if(page==1){
$('.wuju-shop-select-post-list').before(wuju.loading_post);
}else{
$('.wuju-shop-select-post-list').after(wuju.loading_post);	
}
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/post/goods-select.php",
data:url,
success: function(msg){
$('.wuju-load-post').remove();
$('.wuju-shop-select-post-list').attr('page',page+1);
if(page==1){
$('.wuju-shop-select-post-list').html(msg);
}else{
if(msg!=0){
$('.wuju-shop-select-post-list').append(msg);
select_loading=false;
}else{
select_loading=true;	
}	
}

if(list_style=='waterfall'){//渲染瀑布流
var grid=$('.wuju-shop-select-post-list').masonry({
itemSelector:'li',
gutter:waterfull_margin,
transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});    
}
}//success
});

}//wuju_shop_select_submit_form

});



//新增地址
myApp.onPageBeforeInit('setting-address-add',function(page){

if($('#wuju-address-province').length>0){
$.ajax({
type: "POST",
dataType:"json",
url:wuju.wuju_ajax_url+"/action/address-get.php",
data: {type:'province'},
success: function(msg){
$('#wuju-address-province').append(msg.html);
}
});


$("#wuju-address-province").change(function(){
selected=$(this).children('option:selected').val();
if(selected=='香港特别行政区'||selected=='澳门特别行政区'){
$('.wuju-setting-content-address-add-box li.district').hide();
}else{
$('.wuju-setting-content-address-add-box li.district').show();	
}
$("#wuju-address-city,#wuju-address-district").empty();
$.ajax({
type: "POST",
dataType:"json",
url:wuju.wuju_ajax_url+"/action/address-get.php",
data: {type:'city',keywords:selected},
success: function(msg){
html='<option selected hidden disabled value="">请选择</option>';
$('#wuju-address-city').append(html+msg.html);
}
});
});

$("#wuju-address-city").change(function(){
selected=$(this).children('option:selected').val();
$("#wuju-address-district").empty();
$.ajax({
type: "POST",
dataType:"json",
url:wuju.wuju_ajax_url+"/action/address-get.php",
data: {type:'districts',keywords:selected},
success: function(msg){
html='<option selected hidden disabled value="">请选择</option>';
$('#wuju-address-district').append(html+msg.html);
}
});
});
}
});



//--------------------------摇钱树-----------------
myApp.onPageBeforeInit('tree-list',function(page){
//加载更多
tree_loading = false;
tree_page=2;
tree_list=$('.wuju-tree-list-content .wuju-chat-user-list.tree');
$('.wuju-tree-list-content.infinite-scroll').on('infinite',function(){
if (tree_loading) return;
tree_loading = true;
tree_list.append(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/tree.php",
data: {page:tree_page},
success: function(msg){
if(msg!=0){
tree_list.append(msg);
tree_loading = false; 
tree_page++;
}else{
tree_loading = true; 
}
$('.wuju-load-post').remove();
}
});
}); 

});


//--------------------------商城分类-----------------
myApp.onPageBeforeInit('shop-tax',function(page){

//加载更多
shop_id=$('.wuju-shop-select-post-list.tax').attr('shop_id');
shop_tax_loading = false;
shop_tax_page=2;
shop_tax_list=$('.wuju-shop-tax-content .wuju-shop-select-post-list.tax');
$('.wuju-shop-tax-content.infinite-scroll').on('infinite',function(){
if (shop_tax_loading) return;
shop_tax_loading = true;
shop_tax_list.append(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/shop-tax.php",
data: {page:shop_tax_page,shop_id:shop_id},
success: function(msg){
if(msg!=0){
shop_tax_list.append(msg);
shop_tax_loading = false; 
shop_tax_page++;
}else{
shop_tax_loading = true; 
}
$('.wuju-load-post').remove();
}
});
}); 

});