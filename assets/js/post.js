

//获取内容数据
function wuju_post(type,load_type,obj){
if($('.wuju-load-post').length>0){
return false;	
}
author_id=$(obj).attr('author_id');
if(load_type=='more'){//加载更多
page=$(obj).attr('page');
$(obj).before(wuju.loading_post);
$(obj).hide();	

if(author_id){
menu_list=$('.wuju-member-menu li.on');
}else{
menu_list=$('.wuju-index-menu li.on');
}

data=menu_list.attr('data');
index=menu_list.index();

}else{//ajax切换



page=1;
$(obj).addClass('on').siblings().removeClass('on');//菜单切换效果
$('.wuju-post-list').prepend(wuju.loading_post);//加载动画
data=$(obj).attr('data');
index=$(obj).index();

if(!author_id&&wuju.sns_home_load_type=='page'){//首页显示
history.pushState('','','?type='+type+'&index='+index+'&page=1');
}
}


$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/post.php",
data: {type:type,page:page,load_type:load_type,index:index,author_id:author_id,data:data},
success: function(msg){
if(load_type=='more'){//加载更多
$('.wuju-load-post').remove();
$(obj).show();
if(msg==0){//没有数据
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);
page=parseInt(page)+1;
$(obj).attr('page',page);	
}
}else{//ajax切换
audio=document.getElementById('wuju-reload-music');
audio.play();
$('.wuju-post-list').html(msg);
}

if(!author_id&&$('#wuju-sns-home-ajax-page').length>0){//分页
layui.use('laypage', function(){
var laypage = layui.laypage;
laypage.render({
elem:'wuju-sns-home-ajax-page',
count:$('#wuju-sns-home-ajax-page').attr('count'),
limit:$('#wuju-sns-home-ajax-page').attr('number'),
theme:'var(--wuju-color)',
jump:function(obj,first){
type=$('.wuju-index-menu li.on').attr('type');
index=$('.wuju-index-menu li.on').index();
page=obj.curr;
if(!first){
window.open('/?type='+type+'&index='+index+'&page='+page,'_self');
}
}
});
});
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
if(!$(this).next().hasClass('wuju-stop-comment-tips')){
$(this).css('height','85px');
}
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


wuju_lightbox();
}



//搜索页面======ajax加载
function wuju_search_post(type,obj){
if($('.wuju-load-post').length>0){
return false;
}


$('.wuju-search-content').prepend(wuju.loading_post);//加载动画
keyword=$('#wuju-search-val').val();
data=$(obj).attr('data');
$(obj).addClass('on').siblings().removeClass('on');
wuju_post_status=0;
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/search.php",
data: {type:type,keyword:keyword,page:1,load_type:'menu',data:data},
success: function(msg){   
audio=document.getElementById('wuju-reload-music');
audio.play();
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
data=$('.wuju-search-tab li.on').attr('data');
keyword=$('#wuju-search-val').val();
if($('.wuju-load-post').length==0){
$(obj).before(wuju.loading_post);
$(obj).hide();
}
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/search.php",
data: {page:page,type:type,keyword:keyword,load_type:'more',data:data},
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
if($('.wuju-load-post').length>0){
return false;
}

$('.wuju-topic-post-list').prepend(wuju.loading_post);//加载动画
topic_id=$('.wuju-topic-info').attr('data');
post_list=$('.wuju-topic-post-list');
$(obj).addClass('on').siblings().removeClass('on');
wuju_post_status=0;
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/data/topic.php",
data: {type:type,topic_id:topic_id},
success: function(msg){  
audio=document.getElementById('wuju-reload-music');
audio.play(); 
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



//图片灯箱
function wuju_lightbox(){
$("[data-fancybox]").fancybox({
hash:false,
});	
}