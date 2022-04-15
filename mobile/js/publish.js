
//打开发布内容表单
function wuju_publish_form(type){

if($('.wuju-topic-page-header').length>0){
topic=$('.wuju-topic-page-header').attr('topic');
}else{
topic='';	
}

if(type=='bbs'){
myApp.closeModal();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/bbs-like.php?type=publish'});
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/publish/power.php",
data:{type:type},
success: function(msg){
if(msg.code==0){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
}else if(msg.code==1){
myApp.closeModal();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/publish/'+type+'.php?topic='+topic+'&type='+type});
myApp.hideIndicator();
}
}
});
}


//移除照片
function wuju_remove_image(max,obj){
$(obj).parents('li').remove();
img_count=$('#wuju-publish-images-list li').length;
if(img_count<max){
$('.wuju-publish-words-form .add').show();
}
wuju_lightbox();
}


//@用户搜索用户
var aite_user_search=null;
function wuju_pop_aite_user_search(){
if(aite_user_search){aite_user_search.abort();}//终止事件
key=$.trim($('.wuju-publish-aite-form .search.aite input').val());
if(key==''){
return false;
}
// $('.wuju-publish-aite-form .list.aite').html(wuju.loading);
aite_user_search=$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/search/user.php",
data:{key:key},
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
$('.wuju-publish-aite-form .list.aite').html(html);
}else{
$('.wuju-publish-aite-form .list.aite').html(msg.content);	
}
}
});
}

//发布 搜索@用户  选择用户
function wuju_aite_selete_user(obj){
myApp.closeModal();
textarea=$('.wuju-publish-words-form .content textarea');
textarea.val(textarea.val()+' @'+$(obj).attr('data')+' ');
}

//发布 选择话题
function wuju_publish_topic_selete(obj){
topic_name=$(obj).attr('data');
//判断插入的话题是否和已经选择的话题一样
$('.wuju-publish-words-form .topic span').each(function(){
if($(this).attr('data')==topic_name){
$(this).remove();
}
});
// number=3;
// if($('.wuju-publish-words-form .topic span').length>=number){
// layer.open({content:'最多只能插入'+number+'个话题！',skin:'msg',time:2});
// }else{
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/publish/topic-power.php",
data:{topic_name:topic_name},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
myApp.closeModal();
$('.wuju-publish-words-form .topic').append('<span onclick="$(this).remove();" data="'+topic_name+'">#'+topic_name+'#</span>');
$('.wuju-publish-aite-form .search.topic input').val('');
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});

// }

}



//话题搜索
var topic_search=null;
function wuju_pop_topic_search(){
if(topic_search){topic_search.abort();}//终止事件
key=$.trim($('.wuju-publish-aite-form .search.topic input').val());
if(key==''){
return false;
}
// $('.wuju-publish-aite-form .list.topic').html(wuju.loading);
topic_search=$.ajax({
type: "POST",
url: wuju.mobile_ajax_url+"/search/topic.php",
data:{key:key},
success: function(msg){
if(msg.code==1){
html=msg.new;
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li class="search" onclick="wuju_publish_topic_selete(this)" data="'+msg.data[i].name+'">\
<div class="avatarimg">'+msg.data[i].avatar+'</div>\
<div class="name">#'+msg.data[i].name+'#</div>\
<div class="hot"><i class="wuju-icon wuju-huo"></i> '+msg.data[i].hot+'</div>\
</li>';
}
$('.wuju-publish-aite-form .list.topic').html(html);
}else{
$('.wuju-publish-aite-form .list.topic').html(msg.new);	
}
}
});
}


//选择权限
function wuju_publish_select_power(obj){
myApp.closeModal();
$('.wuju-publish-power-form li').children('.select').remove();
$(obj).append('<div class="select"><i class="wuju-icon wuju-yuan_quan"></i></div>');
$('.wuju-publish-words-form .tool .power').html($(obj).children('.left').html());
power=$(obj).children('.left').find('i').attr('data');
$('#wuju-pop-power').val(power);
if(power==1){
$('.wuju-publish-words-form .power-content').html('\
<input type="tel" name="price" class="price" placeholder="输入售价" class="">\
<label class="label-switch"><input type="checkbox" name="power-see-img"><div class="checkbox"></div><div class="tip">没有权限也可浏览图片</div></label>\
<textarea name="hide-content" placeholder="隐藏内容"></textarea>');
}else if(power==2){
$('.wuju-publish-words-form .power-content').html('\
<input type="text" name="password" class="password" placeholder="输入密码" class="" maxlength="20">\
<label class="label-switch"><input type="checkbox" name="power-see-img"><div class="checkbox"></div><div class="tip">没有权限也可浏览图片</div></label>\
<textarea name="hide-content" placeholder="隐藏内容"></textarea>');
}else if(power==4||power==5){
$('.wuju-publish-words-form .power-content').html('\
<label class="label-switch"><input type="checkbox" name="power-see-img"><div class="checkbox"></div><div class="tip">没有权限也可浏览图片</div></label>\
<textarea name="hide-content" placeholder="隐藏内容"></textarea>');	
}else{
$('.wuju-publish-words-form .power-content').html('');	
}
}

//发布选择评论权限开关
function wuju_publish_select_comment_power(obj){
if($(obj).children('i').hasClass('wuju-quxiaojinzhi-')){
$(obj).children('i').removeClass('wuju-quxiaojinzhi-').addClass('wuju-jinzhipinglun-');	
$('#wuju-pop-comment-status').val('closed');
layer.open({content:'已关闭评论',skin:'msg',time:2});
}else{
$(obj).children('i').removeClass('wuju-jinzhipinglun-').addClass('wuju-quxiaojinzhi-');	
$('#wuju-pop-comment-status').val('open');	
layer.open({content:'已开启评论',skin:'msg',time:2});
}
}


//设置位置 城市
function wuju_publish_city(obj){
if($(obj).hasClass('no')){
$(obj).removeClass('no');
$('#wuju-pop-city').val($(obj).children('m').html());
}else{
$(obj).addClass('no');
$('#wuju-pop-city').val('');
}
}


//发布动态
function wuju_publish_words(ticket,randstr){

if($.trim($(".wuju-publish-words-form .content textarea").val())==''){
layer.open({content:'请输入内容！',skin:'msg',time:2});
return false;	
}

power=$('#wuju-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($('.wuju-publish-words-form .power-content .price').val()==''){
layer.open({content:'请输入售价！',skin:'msg',time:2});
return false;	
}
}
if(power==2){
if($.trim($('.wuju-publish-words-form .power-content .password').val())==''){
layer.open({content:'请输入密码！',skin:'msg',time:2});
return false;	
}
}
if($.trim($(".wuju-publish-words-form .power-content textarea").val())==''){
layer.open({content:'请输入隐藏内容！',skin:'msg',time:2});
return false;		
}
}

data=$("#wuju-publish-form").serialize();
if($('.wuju-publish-words-form .topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-form .topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}


if($('#wuju-publish-images-list li').length>0){
img='&img=';
img_thum='&img_thum=';
$('#wuju-publish-images-list li').each(function(){
img+=$(this).children('a').attr('href')+',';
img_thum+=$(this).find('img').attr('src')+',';
});
img=img.substr(0,img.length-1);
img_thum=img_thum.substr(0,img_thum.length-1);
data=data+img+img_thum;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.wuju_ajax_url+"/publish/words.php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
type=$('.wuju-home-menu li.on').attr('data');
wuju_post_data(type,'pull',0,this);
function d(){myApp.getCurrentView().router.back();}setTimeout(d,2500);
}else if(msg.code==5){
function a(){myApp.popup('.wuju-publish-topic-popup');}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}

}
});  

}


//发布文章
function wuju_publish_single(ticket,randstr){
if($.trim($(".wuju-publish-words-form .title input").val())==''){
layer.open({content:'请输入标题！',skin:'msg',time:2});
return false;	
}
if($.trim($(".wuju-publish-words-form .content textarea").val())==''){
layer.open({content:'请输入内容！',skin:'msg',time:2});
return false;	
}
power=$('#wuju-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($('.wuju-publish-words-form .power-content .price').val()==''){
layer.open({content:'请输入售价！',skin:'msg',time:2});
return false;	
}
}
if(power==2){
if($.trim($('.wuju-publish-words-form .power-content .password').val())==''){
layer.open({content:'请输入密码！',skin:'msg',time:2});
return false;	
}
}
if($.trim($(".wuju-publish-words-form .power-content textarea").val())==''){
layer.open({content:'请输入隐藏内容！',skin:'msg',time:2});
return false;		
}
}
data=$("#wuju-publish-form").serialize();
if($('.wuju-publish-words-form .topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-form .topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}
if($('#wuju-publish-images-list li').length>0){
img='&img=';
$('#wuju-publish-images-list li').each(function(){
img+=$(this).children('a').html()+'</br>';
});
data=data+img;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.wuju_ajax_url+"/publish/single.php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
type=$('.wuju-home-menu li.on').attr('data');
wuju_post_data(type,'pull',0,this);
function d(){myApp.getCurrentView().router.back();}
setTimeout(d,2500);
}else if(msg.code==5){
function a(){myApp.popup('.wuju-publish-topic-popup');}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}

}
});  
}


//发布视频 | 音乐
function wuju_publish_music_video(publish_type,ticket,randstr){
if($.trim($(".wuju-publish-words-form .content textarea").val())==''){
layer.open({content:'请输入内容！',skin:'msg',time:2});
return false;	
}
power=$('#wuju-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($('.wuju-publish-words-form .power-content .price').val()==''){
layer.open({content:'请输入售价！',skin:'msg',time:2});
return false;	
}
}
if(power==2){
if($.trim($('.wuju-publish-words-form .power-content .password').val())==''){
layer.open({content:'请输入密码！',skin:'msg',time:2});
return false;	
}
}
}

video_url=$("#wuju-video-url").val();
if(video_url==''){
if(publish_type=='video'){
layer.msg('请上传视频！');	
}else{
layer.msg('请上传音频或填写音频地址！');
}
return false;	
}

data=$("#wuju-publish-form").serialize();
if($('.wuju-publish-words-form .topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-form .topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.wuju_ajax_url+"/publish/"+publish_type+".php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
type=$('.wuju-home-menu li.on').attr('data');
wuju_post_data(type,'pull',0,this);
function d(){myApp.getCurrentView().router.back();}setTimeout(d,2500);
}else if(msg.code==5){
function a(){myApp.popup('.wuju-publish-topic-popup');}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}

}
});  

}


//打开发布帖子表单
function wuju_publish_bbs_form(bbs_id,type){
if(type=='vote'||type=='activity'){
layer.open({content:'暂未开启！',skin:'msg',time:2});	
return false;
}

if($('.wuju-topic-page-header').length>0){
topic=$('.wuju-topic-page-header').attr('topic');
}else{
topic='';	
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/publish/bbs-type.php",
data:{bbs_id:bbs_id},
success: function(msg){
if(msg.code==0){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
}else if(msg.code==1){
myApp.closeModal();
if(type=='normal'||type=='pay'||type=='vip'||type=='login'||type=='comment'||type=='answer'){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/publish/bbs-normal.php?bbs_id='+bbs_id+'&type='+type+'&topic='+topic});	
}else{
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/publish/bbs-'+type+'.php?bbs_id='+bbs_id+'&topic='+topic});	
}
myApp.hideIndicator();
}
}
});
}


//发布帖子
function wuju_publish_bbs(type,ticket,randstr){
if($.trim($(".wuju-publish-words-form .title input").val())==''){
layer.open({content:'请输入标题！',skin:'msg',time:2});
return false;	
}

content=$(".wuju-publish-words-form .content textarea").val();

if($.trim(content)==''){
layer.open({content:'请输入内容！',skin:'msg',time:2});
return false;	
}

if($('#wuju-bbs-category').val()==''){
layer.open({content:'请选择分类！',skin:'msg',time:2});
return false; 
} 

if(type=='pay'){
price=$('.wuju-publish-words-form .power-content .price').val();
if(!price){
layer.open({content:'请输入内容售价！',skin:'msg',time:2});
return false;		
}
}
if(type=='answer'){
price=$('.wuju-publish-words-form .power-content .price').val();
if(!price){
layer.open({content:'请输入悬赏金额！',skin:'msg',time:2});
return false;		
}
}
if(type=='pay'||type=='vip'||type=='login'||type=='comment'){
hide_content=$('.wuju-publish-words-form .power-content textarea').val();
if(hide_content==''){
layer.open({content:'请输入隐藏的内容！',skin:'msg',time:2});
return false;		
}
}
 


data=$("#wuju-publish-form").serialize();
if($('.wuju-publish-words-form .topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-form .topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

if($('#wuju-publish-images-list li').length>0){
img='&img=';
$('#wuju-publish-images-list li').each(function(){
img+=$(this).children('a').html()+'</br>';
});
data=data+img;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.wuju_ajax_url+"/publish/bbs.php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(".wuju-publish-words-form .content textarea").val('');
myApp.getCurrentView().router.back();
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,800);
}else if(msg.code==5){
function a(){myApp.popup('.wuju-publish-topic-popup');}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}

}
});  


}



//参与话题
function wuju_join_topic(topic_name){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/publish/topic-power.php",
data:{topic_name:topic_name},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
myApp.popup('.wuju-publish-type-form');
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});
}


//提交发红包
function wuju_publish_redbag(){
credit=$('#wuju-publish-redbag-credit').val();
number=$('#wuju-publish-redbag-number').val();
type=$('.wuju-publish-redbag-form .type>li.on').attr('data');
content=$('#wuju-publish-redbag-content').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/publish/redbag.php",
data:{credit:credit,number:number,type:type,content:content},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
type=$('.wuju-home-menu li.on').attr('data');
wuju_post_data(type,'pull',0,this);
function d(){myApp.getCurrentView().router.back();}
setTimeout(d,2500);
}
}
}); 


}