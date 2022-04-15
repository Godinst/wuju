

//首页或个人主页获取内容数据
var wuju_post_status=1;
function wuju_post(type,obj){

if($('.wuju-load-post').length==0){
$('.wuju-post-list').prepend(wuju.loading_post);
}

if(wuju_post_status==0){
return false;	
}

$(obj).addClass('on').siblings().removeClass('on');

author_id=$(obj).attr('author_id');
wuju_post_status=0;
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/post.php",
data: {type:type,author_id:author_id},
success: function(msg){   
$('.wuju-post-list').html(msg);
wuju_post_js();//ajax后加载要执行的脚本
wuju_post_status=1;
}
});
}



//首页或个人主页加载更多数据
function wuju_post_more(type,obj){
page=$(obj).attr('page');

author_id=$(obj).attr('author_id');

if($('.wuju-load-post').length==0){
$(obj).before(wuju.loading_post);
$(obj).hide();
}

$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/more/data.php",
data: {type:type,page:page,author_id:author_id},
success: function(msg){   
$('.wuju-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);
page=parseInt(page)+1;
$(obj).attr('page',page);	
}
wuju_post_js();//ajax后加载要执行的脚本
}
});
}


//ajax后加载要执行的脚本
function wuju_post_js(){
$(".wuju-post-read-more").click(function(){
if($(this).prev().hasClass('hidden')){
$(this).prev().removeClass('hidden');
$(this).html("收起内容");
}else{
$(this).prev().addClass('hidden');
$(this).html("查看全文");
}
});

//评论框点击变高
$('.wuju-post-comments').focus(function(){
$(this).css('height','85px');
});

//资料小卡片
$(".wuju-post-user-info-avatar").hover(function(){
$this=$(this);
$this.children('.wuju-user-info-card').show()
author_id=$this.attr('user-data');
if($this.find('.wuju-info-card').length==0){
$this.children('.wuju-user-info-card').html(wuju.loading_info);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/info-card.php",
data: {author_id:author_id,info_card:1},
success: function(msg){
$this.children('.wuju-user-info-card').html(msg);
}
});
}
},function(){
$(this).children('.wuju-user-info-card').hide();
});


}



//搜索页面======ajax加载
function wuju_ajax_search(type,obj){

if($('.wuju-load-post').length==0){
$('.wuju-search-content').prepend(wuju.loading_post);
}

if(wuju_post_status==0){
return false;	
}

keyword=$('#wuju-search-val').val();
$(obj).addClass('on').siblings().removeClass('on');
wuju_post_status=0;
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/ajax/search.php",
data: {type:type,keyword:keyword},
success: function(msg){   
$('.wuju-search-content').html(msg);
wuju_post_js();
wuju_post_status=1;
}
});
}


//===========搜索页面加载更多
function wuju_more_search(obj){
type=$(obj).attr('type');
page=$(obj).attr('data');
keyword=$('#wuju-search-val').val();
if($('.wuju-load-post').length==0){
$(obj).before(wuju.loading_post);
$(obj).hide();
}
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/more/search.php",
data: {page:page,type:type,keyword:keyword},
success: function(msg){   
$('.wuju-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);
paged=parseInt(page)+1;
$(obj).attr('data',paged);	
}
//ajax后加载要执行的脚本
wuju_post_js();

}
});
}


//=======================================话题页面加载数据===================
function wuju_topic_data(type,obj){

if($('.wuju-load-post').length==0){
$('.wuju-topic-post-list').prepend(wuju.loading_post);
}

if(wuju_post_status==0){
return false;	
}
topic_id=$('.wuju-topic-info').attr('data');
post_list=$('.wuju-topic-post-list');
$(obj).addClass('on').siblings().removeClass('on');
wuju_post_status=0;
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/topic.php",
data: {type:type,topic_id:topic_id},
success: function(msg){   
post_list.html(msg);
wuju_post_js();
wuju_post_status=1;
}
});
}


//加载更多话题
function wuju_topic_data_more(type,obj){
topic_id=$('.wuju-topic-info').attr('data');
page=$(obj).attr('data');
if($('.wuju-load-post').length==0){
$(obj).before(wuju.loading_post);
$(obj).hide();
}
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/topic.php",
data: {type:type,topic_id:topic_id,page:page},
success: function(msg){   
$('.wuju-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);
paged=parseInt(page)+1;
$(obj).attr('data',paged);	
}

//ajax后加载要执行的脚本
wuju_post_js();

}
});
}



//电脑端动态加载更多评论
function wuju_more_comment(post_id,obj){
if($('.wuju-load-post').length==0){
$(obj).before(wuju.loading_post);
$(obj).hide();
}
page=$(obj).attr('page');
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/more/post-comment.php",
data: {post_id:post_id,page:page},
success: function(msg){   
$('.wuju-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多评论！');
$(obj).remove();
}else{
$('.wuju-post-comment-list').append(msg);
paged=parseInt(page)+1;
$(obj).attr('page',paged);	
}

}
});

}