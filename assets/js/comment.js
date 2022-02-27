//===================================动态评论 、帖子回复（一级、二级）==================

//评论动态
function wuju_comment_posts(post_id,obj,ticket,randstr){
content=$.trim($(obj).siblings('.wuju-post-comments').val());
layer.load(1);
$.ajax({
type:"POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/comment.php",
data: {content:content,post_id:post_id,ticket:ticket,randstr:randstr},
success: function(msg) {
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//成功
$(obj).siblings('.wuju-post-comments').val('');


ws.send('{"from_url":"'+wuju.home_url+'","type":"comment","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');
if(msg.at_user_id){
ws.send('{"from_url":"'+wuju.home_url+'","type":"at","notice_user_id":"'+msg.at_user_id+'","do_user_id":"'+wuju.user_id+'"}');
}

if($(obj).parents('.wuju-comment-form').siblings('.comment-see').length>0||$(obj).parents('.wuju-comment-form').siblings('.wuju-single-content').children('.comment-see').length>0||$(obj).parents('.wuju-comment-form').siblings('.wuju-post-video').find('.comment-see').length>0){//如果是回复可见直接刷新
function d(){window.open(msg.url,'_self');}setTimeout(d,1500);
}else{
$(obj).parent('.wuju-comment-textarea').next('.wuju-post-comment-list').prepend('\
<li>\
<div class="wuju-comment-avatar">'+wuju.avatar+wuju.verify+'</div>\
<div class="wuju-comment-header">\
<span class="wuju-comment-up" onclick="wuju_single_comment_up('+msg.id+',this)">\
<i class="fa fa-thumbs-o-up"></i><m>0</m>\
</span>\
<div class="wuju-comment-info">'+wuju.nickname_link+wuju.lv+wuju.vip+wuju.honor+'</div>\
<span class="wuju-comment-time">1秒前</span><span class="wuju-comment-from">来自 电脑端</span>\
</div>\
<div class="wuju-comment-content">'+msg.content+'</div>\
<div class="wuju-comment-footer"></div>\
</li>');   
}

}else if(msg.code==2){//没有绑定手机号
function d(){wuju_update_phone_form(wuju.user_id);}setTimeout(d,1500);
}else if(msg.code==3){//弹窗开通会员
function c(){wuju_recharge_vip_form();}setTimeout(c,1500);
}else if(msg.code==4){//绑定邮箱
function e(){wuju_update_mail_form(wuju.user_id,2);}setTimeout(e,1500);
}
},
});
}


//回复帖子 一级回复
//type:回帖类型 1为一级回帖 2：为二级回帖
function wuju_bbs_comment(post_id,bbs_id,ticket,randstr){
content =ue.getContent();
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/comment-bbs.php",
data: {content:content,post_id:post_id,bbs_id:bbs_id,type:1,ticket:ticket,randstr:randstr},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//成功


ws.send('{"from_url":"'+wuju.home_url+'","type":"comment","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');
if(msg.at_user_id){
ws.send('{"from_url":"'+wuju.home_url+'","type":"at","notice_user_id":"'+msg.at_user_id+'","do_user_id":"'+wuju.user_id+'"}');
}

if($('.wuju-tips').hasClass('wuju-comment-can-see')){//回复可见的自动刷新
function d(){window.location.reload();}setTimeout(d,2000);
}else{
content = msg.content.replace(/\\/g,'');
$(".wuju-bbs-comment-list").append('\
<div class="wuju-bbs-single-box clear">\
<div class="left">\
<div class="avatar">\
'+wuju.vip_icon+'\
'+wuju.avatar+'\
'+wuju.verify+'\
</div>\
<div class="name">'+wuju.nickname_link+'</div>\
<div class="info">\
<div class="lv">'+wuju.lv+'</div>\
<div class="vip">'+wuju.vip+'</div>\
<div class="honor">'+wuju.honor+'</div>\
</div>\
</div>\
<div class="right">\
<div class="wuju-bbs-single-content">'+content+'</div>\
<div class="wuju-bbs-single-footer"><span class="delete" onclick="wuju_delete_bbs_comments('+msg.id+','+bbs_id+',this);">删除</span><span>1秒前</span><span>电脑端</span></div>\
</div>\
</div>');
}
ue.execCommand('cleardoc');
}else if(msg.code==2){//没有绑定手机号
function d(){wuju_update_phone_form(wuju.user_id);}setTimeout(d,2000);
}else if(msg.code==3){//弹窗开通会员
function c(){wuju_recharge_vip_form();}setTimeout(c,1500);
}else if(msg.code==4){//绑定邮箱
function e(){wuju_update_mail_form(wuju.user_id,2);}setTimeout(e,1500);
}

}

});
}


//回复帖子 二级回复
function wuju_bbs_comment_floor(comment_id,post_id,bbs_id,obj,ticket,randstr){
content =$(obj).siblings('.wuju-post-comments').val();
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/comment-bbs.php",
data: {content:content,comment_id:comment_id,post_id:post_id,bbs_id:bbs_id,type:2,ticket:ticket,randstr:randstr},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//成功

ws.send('{"from_url":"'+wuju.home_url+'","type":"comment","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');
if(msg.at_user_id){
ws.send('{"from_url":"'+wuju.home_url+'","type":"at","notice_user_id":"'+msg.at_user_id+'","do_user_id":"'+wuju.user_id+'"}');
}

$(obj).siblings('.wuju-bbs-comment-floor-list').append('\
<li class="clear">\
<div class="floor-left">\
'+wuju.avatar+'\
'+wuju.verify+'\
</div>\
<div class="floor-right">\
<div class="name">'+wuju.nickname_link+'：<span class="content">'+msg.content+'</span></div>\
</div>\
<div class="bottom">\
<span>刚刚</span>\
<span>来自 电脑端</span>\
</div>\
</li>');
$(obj).siblings('.wuju-post-comments').val('');
}else if(msg.code==2){//没有绑定手机号
function d(){wuju_update_phone_form(wuju.user_id);}setTimeout(d,2000);
}else if(msg.code==3){//弹窗开通会员
function c(){wuju_recharge_vip_form();}setTimeout(c,1500);
}else if(msg.code==4){//绑定邮箱
function e(){wuju_update_mail_form(wuju.user_id,2);}setTimeout(e,1500);
}

}
});
}



//评论表单toggle
function wuju_comment_toggle(boj){
$(boj).parent().siblings('.wuju-comment-form').toggle().find('textarea').focus();//动态回复可见
$(boj).parents('.wuju-single-content').siblings('.wuju-comment-form').find('textarea').focus();//文章回复可见
$(boj).parents('.wuju-post-video').siblings('.wuju-comment-form').toggle().find('textarea').focus();//视频回复可见
}




//ajax 加载更多评论
function wuju_ajax_comment(post_id,number,page){
bbs_id=$('.wuju-bbs-single-header').attr('data');
$('.wuju-bbs-comment-list').append(wuju.loading);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/more/comment.php",
data: {page:page,post_id:post_id,number:number,bbs_id:bbs_id},
success: function(msg){   
if(msg==0){
layer.msg('没有更多内容！');
}else{
$('html,body').animate({scrollTop:$('.wuju-bbs-single-footer').offset().top}, 800);
$('.wuju-bbs-comment-list').html(msg);
$('.wuju-post-comments').focus(function(){
if(!$(this).next().hasClass('wuju-stop-comment-tips')){
$(this).css('height','85px');
}
});
}

}
});
}



//评论点赞
function wuju_single_comment_up(comment_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
if($(obj).hasClass('on')){
layer.msg('你已经点赞！');
}else{
audio=document.getElementById('wuju-like-up-music');
audio.play();
number=parseInt($(obj).children('m').html())+1;	
$(obj).html('<i class="fa fa-thumbs-up"></i><m>'+number+'</m>');
$(obj).addClass('on');	
layer.msg('点赞成功！');	
$.ajax({
type: "POST",
url:wuju.module_url+"/action/comment-up.php",
data: {comment_id:comment_id,type:2},//点赞
success: function(msg){

ws.send('{"from_url":"'+wuju.home_url+'","type":"comment_up","notice_user_id":"'+msg.author_id+'","do_user_id":"'+wuju.user_id+'"}');

}
});

}
}