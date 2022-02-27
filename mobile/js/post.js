//内容相关的js


//pull和ajax
function wuju_post(type,load_type,obj){
if($('.wuju-load-post').length>0){
return false;	
}

$('.wuju-websocket-new-posts-tips').remove();

author_id=$(obj).attr('author_id');

// if(!author_id){
// if($(obj).attr('waterfall')!=0&&$(obj).index()!=0){
// $('.wuju-sns-page-content').addClass('waterfall');
// }else if($(obj).attr('waterfall')==1&&$(obj).index()==0){
// $('.wuju-post-list-sns').addClass('waterfall');
// }else{
// $('.wuju-sns-page-content,.wuju-post-list-sns').removeClass('waterfall');
// }
// }


if(load_type=='ajax'){//点击菜单
if(author_id){
if(author_id==wuju.user_id){
post_list=$('.pages .page:last-child .wuju-member-mine-post-list');	
}else{
post_list=$('.pages .page:last-child .wuju-member-other-post-list');
}
}else{
post_list=$('.wuju-post-list-sns');
$('.page-content').animate({scrollTop: 0 },0);	
}
data=$(obj).attr('data');




index=$(obj).index();

}else{//下拉
data=$('.wuju-home-menu li.on').attr('data');
post_list=$('.wuju-post-list-sns');
if(author_id){
index=$('.wuju-member-menu li.on').index();
}else{
index=$('.wuju-home-menu li.on').index();
}
}

if(author_id){
post_list.before(wuju.loading_post);//加载动画
}else{
$('.pull-to-refresh-layer').after(wuju.loading_post);
}

sns_page=2;
sns_loading=false;
$(obj).addClass('on').siblings().removeClass('on');

$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/post/data.php",
data:{page:1,type:type,load_type:load_type,index:index,author_id:author_id,data:data},
success:function(msg){

if(!$(obj).hasClass('no-voice')){
audio=document.getElementById('wuju-reload-music');
audio.play();
}else{
$(obj).removeClass('no-voice');
}

$('.wuju-load-post').remove();
post_list.html(msg);
wuju_lightbox();//图片灯箱
if(load_type=='pull'){
layer.open({content:'刷新成功',skin:'msg',time:2});
}
if($(obj).attr('waterfall')!=0&&!author_id){//瀑布流渲染
var grid=$('.wuju-post-list-sns').masonry({
itemSelector:'.waterfall',
gutter:0,
// transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
}); 
}

if($(obj).attr('waterfall')!=0&&!author_id&&type=='follow-user'){
$('.wuju-mobile-home-sns-top').after($('.wuju-post-list-sns .wuju-post-follow-user-list'));
}else{
if($(obj).attr('waterfall')!=0){
$('.wuju-post-follow-user-list').remove();
}
}

}
});

}






//论坛内容切换 
function wuju_bbs_post(bbs_id,type,obj){
if($('.wuju-load-post').length>0){//防止多次点击
return false;	
}

bbs_page=2;
bbs_loading = false; 
$(obj).addClass('on').siblings().removeClass('on');
post_list=$(obj).parent().next();
post_list.attr('type',type);
post_list.attr('page',2);
topic=$(obj).attr('topic');
post_list.prepend(wuju.loading_post);

if($(obj).parent().next().hasClass('wuju-bbs-post-list-3')){
post_list.html(wuju.loading_post);
}

$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/bbs.php",
data: {bbs_id:bbs_id,type:type,topic:topic},
success: function(msg){
if(msg!=0){

audio=document.getElementById('wuju-reload-music');
audio.play();

post_list.html(msg);

//渲染瀑布流
if($(obj).parent().next().hasClass('wuju-bbs-post-list-3')){
waterfull_margin=$('#wuju-waterfull-margin').height();
var grid=$('.page-on-center .wuju-bbs-post-list-3').masonry({
itemSelector:'.grid',
gutter:waterfull_margin,
});

grid.masonry('reloadItems');  
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});
}



}else{
post_list.html(wuju.empty);	
}
}
});	
}



//话题内容切换
function wuju_topic_data(type,obj){
if($('.wuju-load-post').length>0){//防止多次点击
return false;	
}

topic_id=$('.wuju-topic-page-header').attr('data');
$(obj).addClass('on').siblings().removeClass('on');
more_list=$('.wuju-topic-post-list');
more_list.attr('type',type);
more_list.attr('page',2);
more_list.prepend(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/topic.php",
data: {topic_id:topic_id,type:type},
success: function(msg){
if(msg!=0){
audio=document.getElementById('wuju-reload-music');
audio.play();
more_list.html(msg);
}else{
more_list.html(wuju.empty);	
}
}
});	
}

//视频专题切换
function wuju_video_post_data(obj){
if($('.wuju-load-post').length>0){//防止多次点击
return false;	
}
$('.wuju-video-page-content').animate({scrollTop:0},0);
video_page = 2;
number=$(obj).parents('.navbar').next().find('.wuju-video-special-list').attr('number');
$(obj).addClass('on').siblings().removeClass('on');
post_list=$('.wuju-video-special-list');
topic=$(obj).attr('data');
post_list.before(wuju.loading_post);

if(post_list.hasClass('waterfall')){
waterfall=1;
}else{
waterfall=0
}

$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/video-special.php",
data: {topic:topic,page:1,type:'click',number:number,waterfall:waterfall},
success: function(msg){
$('.wuju-load-post').remove();
audio=document.getElementById('wuju-reload-music');
audio.play();
post_list.html(msg);

if(post_list.hasClass('waterfall')){//瀑布流渲染
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
});
}


function wuju_collect_post(type,obj){
if($('.wuju-load-post').length>0){//防止多次点击
return false;	
}
$('.page-content').animate({ scrollTop: 0 },0);
collect_loading = false;
collect_page = 2;
$(obj).addClass('on').siblings().removeClass('on');
post_list=$('.wuju-collect-content .wuju-post-list');
post_list.prepend(wuju.loading_post);
$.ajax({
type: "POST",
url:  wuju.mobile_ajax_url+"/post/collect.php",
data: {type:type,page:1},
success: function(msg){
post_list.html(msg);
wuju_lightbox();//灯箱
}
});
}


//树洞
function wuju_secret_post(type,load_type,obj){
if($('.wuju-load-post').length>0){//防止多次点击
return false;	
}
$('.wuju-secret-content').animate({ scrollTop: 0 },0);
secret_loading=false;
secret_page=2;
$(obj).addClass('on').siblings().removeClass('on');
post_list=$('.wuju-post-secret-list');
post_list.prepend(wuju.loading_post);
$.ajax({
type:"POST",
url:wuju.mobile_ajax_url+"/post/secret.php",
data:{page:1,type:type,load_type:load_type},
success: function(msg){
audio=document.getElementById('wuju-reload-music');
audio.play();
post_list.html(msg);
if(load_type=='pull'){
layer.open({content:'刷新成功',skin:'msg',time:2});
}
}
});
}