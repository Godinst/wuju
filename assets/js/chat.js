

//打开单人聊天模式
function wuju_open_user_chat(user_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}

$('.wuju-group-user-info').remove();//资料卡片打开IM聊天

//计算提醒数量
if($(obj).children('.wuju-chat-list-tips').length>0){
current_tips=parseInt($(obj).children('.wuju-chat-list-tips').text());
all_tips=parseInt($('.wuju-right-bar-im .number').text());
last_tips=all_tips-current_tips;
if(last_tips>0){
$('.wuju-right-bar-im .number').text(last_tips);
}else{
$('.wuju-right-bar-im .number').remove();	
}
$(obj).children('.wuju-chat-list-tips').remove();//移除提醒
}

layer.load(1);
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/chat-info.php",
data: {author_id:user_id,type:'one'},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
status=msg.status;	
name=msg.nickname;
desc=msg.desc;
avatar=msg.avatar;

if($('.wuju-chat-user-window').length==0){//防止重复打开窗口
layer.open({
type:1,
anim: 5,
skin: 'wuju-chat-user-window',
area: ['600px', '540px'],
title: ' ',
shade: 0,
maxmin: true,
// zIndex: layer.zIndex,
resizing: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
$('.wuju-chat-message-list').css('height',content_height);
},
full: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
$('.wuju-chat-message-list').css('height',content_height);	
},
restore: function(layero){
$('.wuju-chat-user-window').css({"top":"50px","bottom":"0","height":540});
$('.wuju-chat-message-list').css('height',250);

},
content: 
'<div class="wuju-chat-message-list" data-no-instant></div>'+
'<div class="wuju-chat-windows-footer"><div class="wuju-msg-tips" onclick=\'wuju_im_tips(this,"one")\'>底部</div>'+
'<div class="wuju-chat-windows-footer-bar one clear">'+
'<span onclick=\'wuju_smile(this,"im-one","")\' class="wuju-icon smile wuju-weixiao-"></span>'+
'<span class="image wuju-icon wuju-tupian1"></span>'+
'<span class="notice wuju-icon wuju-tongzhi1"></span>'+
'</div>'+
'<textarea class="wuju-chat-textarea"></textarea>'+
'<div class="wuju-chat-windows-footer-send clear">'+
'<div class="wuju-chat-send-message-btn opacity" onclick="wuju_send_msg()">发送</div></div></div>',

});  
}




//==================渲染=========================
//上传图片
$('.wuju-chat-windows-footer-bar.one .image').remove();//先移除原始模块
$('.wuju-chat-windows-footer-bar.one .smile').after('<span class="image wuju-icon wuju-tupian1"></span>');//重新添加模块
wuju_im_upload_one(user_id);

$('.wuju-chat-user-window .wuju-chat-windows-user-header').remove();
$('.wuju-chat-user-window').append('<div class="wuju-chat-windows-user-header chat-one" data="'+user_id+'"><div class="wuju-chat-windows-user-avatar">'+avatar+'</div><div class="wuju-chat-windows-user-info"><div class="wuju-chat-windows-user-name">'+name+'</div><span class="wuju-chat-online-status">'+status+'</span><div class="wuju-chat-windows-user-desc">'+desc+'</div>	</div></div>');
$('.wuju-chat-message-list').html(msg.messages_list); 
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight); 

//图片加载完毕执行
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight);
} );


$('.wuju-chat-message-list').scroll(function(){
contentH =$(this).get(0).scrollHeight;//内容高度
scrollTop =$(this).scrollTop();//滚动高度
// console.log(contentH-scrollTop);
if(contentH-scrollTop>1000){
$('.wuju-msg-tips').show();
}else{
$('.wuju-msg-tips').hide();	
}
if(contentH-scrollTop<400){
$('.wuju-msg-tips').text('底部');	
}
});



}else{
layer.msg(msg.msg);
}
}
});//获取IM聊天信息





}





//打开群组聊天模式
function wuju_open_group_chat(bbs_id){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
	
$('#wuju-chat-group-'+bbs_id+'.top .wuju-chat-list-tips').remove();//移除消息提醒

layer.load(1);
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/chat-info.php",
data: {bbs_id:bbs_id,type:'group'},
success: function(msg){
layer.closeAll('loading');

if(msg.code==1){
notice=msg.notice;
name=msg.name;
desc=msg.desc;
avatar=msg.avatar;
number=msg.number;

if($('.wuju-chat-group-window').length==0){//防止重复打开窗口
layer.open({
type:1,
anim: 5,
skin: 'wuju-chat-group-window',
area: ['750px', '540px'],
title: ' ',
shade: 0,
maxmin: true,
resizing: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
right_height=459+add_height;
$('.wuju-chat-windows-right').css('height',right_height);
$('.wuju-chat-message-group-list').css('height',content_height);
},
full: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
right_height=459+add_height;
$('.wuju-chat-windows-right').css('height',right_height);
$('.wuju-chat-message-group-list').css('height',content_height);	
},
restore: function(layero){
$('.wuju-chat-group-window').css({"top":"50px","bottom":"0","height":540});
$('.wuju-chat-message-group-list').css('height',250);
$('.wuju-chat-windows-right').css('height',459);
},
end: function(layero){
ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group_back","do_user_id":"'+wuju.user_id+'","bbs_id":"'+bbs_id+'","do_user_name":"'+wuju.nickname_base+'"}');
},
content: 
'<div class="wuju-chat-windows-left">'+
'<div class="wuju-chat-message-group-list" data-no-instant></div>'+
'<div class="wuju-chat-windows-footer"><div class="wuju-msg-tips" onclick=\'wuju_im_tips(this,"group")\'>底部</div>'+
'<div class="wuju-chat-windows-footer-bar group clear">'+
'<span onclick=\'wuju_smile(this,"im-group","")\' class="wuju-icon smile wuju-weixiao-"></span>'+
'<span class="image wuju-icon wuju-tupian1"></span>'+
'<span class="wuju-upload-group-img-loading"></span>'+
'</div>'+
'<textarea class="wuju-chat-textarea-group"></textarea>'+
'<div class="wuju-chat-windows-footer-send clear">'+
'<div class="wuju-chat-send-message-btn-group opacity" onclick="wuju_send_group_msg()">发送</div>'+
'</div></div></div>'+
'<div class="wuju-chat-windows-right">'+
'<div class="wuju-chat-group-notice">'+
'<div class="wuju-chat-group-notice-title">群公告</div>'+
'<div class="wuju-chat-group-notice-desc"></div>'+
'</div>'+
'<div class="wuju-chat-group-user">'+
'<div class="wuju-chat-group-user-number">群成员 <span></span></div>'+
'<div class="wuju-chat-group-user-list"></div>'+
'</div></div>'
});  

}




//上传图片
$('.wuju-chat-windows-footer-bar.group .image').remove();//先移除原始模块
$('.wuju-chat-windows-footer-bar.group .smile').after('<span class="image wuju-icon wuju-tupian1"></span>');//重新添加模块
wuju_im_upload_group(bbs_id);



$('.wuju-chat-group-window .wuju-chat-windows-user-header').remove();
$('.wuju-chat-group-window').append('<div class="wuju-chat-windows-user-header chat-group" data="'+bbs_id+'"><div class="wuju-chat-windows-user-avatar">'+avatar+'</div><div class="wuju-chat-windows-user-info"><div class="wuju-chat-windows-user-name">'+name+'</div><div class="wuju-chat-windows-user-desc">'+desc+'</div>	</div></div>');
$('.wuju-chat-group-notice-desc').html(notice);
$('.wuju-chat-group-user-number span').html('（'+number+'人）');
$('#wuju-upload-group-bbs-id').val(bbs_id);



$('.wuju-chat-message-group-list').html(msg.messages_list); 
$('.wuju-chat-message-group-list').scrollTop($('.wuju-chat-message-group-list')[0].scrollHeight);

//图片加载完毕执行
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-message-group-list').scrollTop($('.wuju-chat-message-group-list')[0].scrollHeight);
});


$('.wuju-chat-group-user-list').html(msg.user_list);//右侧栏用户列表


$('.wuju-chat-message-group-list').scroll(function(){
contentH =$(this).get(0).scrollHeight;//内容高度
scrollTop =$(this).scrollTop();//滚动高度
// console.log(contentH-scrollTop);
if(contentH-scrollTop>1000){
$('.wuju-msg-tips').show();
}else{
$('.wuju-msg-tips').hide();	
}
if(contentH-scrollTop<400){
$('.wuju-msg-tips').text('底部');	
}
});


ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group_join","do_user_id":"'+wuju.user_id+'","bbs_id":"'+bbs_id+'","do_user_name":"'+wuju.nickname_base+'","chat_group_join_text":"'+wuju.chat_group_join_text+'"}');



}else{
layer.msg(msg.msg);
}


}


});//获取群聊信息


}





//群聊显示用户资料卡片
function wuju_chat_group_show_user_info(author_id,obj){
this_dom=obj;
if($('.wuju-group-user-info').length==0){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.module_url+"/stencil/info-card.php",
data: {author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type:1,
zIndex: 9999999999,
area: ['375px', '265px'],
shade: 0,
skin: 'wuju-group-user-info',
move: '.wuju-info-card-bg',
content: msg
}); 
}
});	
}else{
layer.closeAll('loading');
layer.msg('请关闭另外一个资料卡');
return false;	
}
}


//加入群聊
function wuju_join_group_chat(bbs_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
if(wuju.is_black){
layer.msg('你是黑名单用户，禁止互动操作！');	
return false;
}
$(obj).html('<i class="fa fa-spinner fa-spin"></i> 进入中...');
$.ajax({
type: "POST",
url:wuju.module_url+"/wuju-join-group-chat.php",
data: {bbs_id:bbs_id},
success: function(msg){
$(obj).html('加入群聊');
if(msg==1){
wuju_open_group_chat(bbs_id);
}else if(msg==2){
layer.msg('请先关注'+wuju.bbs_name+'才允许加入群聊！');	
}else if(msg==3){
wuju_pop_login_style();
}
}
});	
}


//发送单对单聊天消息
function wuju_send_msg(){
author_id=$('.wuju-chat-windows-user-header.chat-one').attr('data');
content= $('.wuju-chat-textarea').val();
if($.trim(content)==''){
layer.msg('请输入内容！');
return false;  
}

smile_add_arr=$.parseJSON(wuju.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+wuju.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+wuju.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}
$('.wuju-chat-message-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+content_a+'</div></li>');
$('.wuju-chat-textarea').val('');
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight);
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/msg.php",
data: {author_id:author_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.wuju-chat-message-list .myself').last().children('.wuju-chat-message-list-content').prepend('<i class="wuju-icon error wuju-shibai" title="'+msg.msg+'"></i>');
$('.wuju-chat-message-list').append('<p class="wuju-chat-message-list-join error"><span>'+msg.msg+'</span></p>');
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight);
if(msg.code==3){//弹窗开通会员
function c(){wuju_recharge_vip_form();}setTimeout(c,1500);
}
}else if(msg.code==1){//聊天隐私


ws.send('{"from_url":"'+wuju.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_name":"'+wuju.nickname_base+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');

if($('.wuju-chat-content-recent-user #wuju-chat-'+author_id).length>0){//当前会话置顶
$('.wuju-chat-content-recent-user .wuju-group-top-br').after($('.wuju-chat-content-recent-user #wuju-chat-'+author_id));
$('#wuju-chat-'+author_id+' .msg').text(content);
}

if(msg.im_privacy==1){
$('.wuju-chat-message-list').append('<p class="wuju-chat-message-list-join error"><span>'+msg.im_privacy_tips+'</span></p>');
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight);
}
}
}
});
}


//发送群聊消息
function wuju_send_group_msg(){
bbs_id=$('.wuju-chat-group-window .wuju-chat-windows-user-header').attr('data');
content= $('.wuju-chat-textarea-group').val();
if($.trim(content)==''){
layer.msg('请输入内容！');
return false;  
}
smile_add_arr=$.parseJSON(wuju.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+wuju.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+wuju.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}
$('.wuju-chat-message-group-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+content_a+'</div></li>');
$('.wuju-chat-textarea-group').val('');
$('.wuju-chat-message-group-list').scrollTop($('.wuju-chat-message-group-list')[0].scrollHeight);
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/msg-group.php",
data: {bbs_id:bbs_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.wuju-chat-message-group-list .myself').last().children('.wuju-chat-message-list-content').prepend('<i class="wuju-icon error wuju-shibai" title="'+msg.msg+'"></i>');
$('.wuju-chat-message-group-list').append('<p class="wuju-chat-message-list-join error"><span>'+msg.msg+'</span></p>');
$('.wuju-chat-message-group-list').scrollTop($('.wuju-chat-message-group-list')[0].scrollHeight);
if(msg.code==3){//弹窗开通会员
function c(){wuju_recharge_vip_form();}setTimeout(c,1500);
}
}else if(msg.code==1){

ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group","do_user_id":"'+msg.do_user_id+'","bbs_id":"'+msg.bbs_id+'","group_type":"'+msg.group_type+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'"}');

//机器人
if(msg.rebot_name){
ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group","do_user_id":"'+msg.rebot_user_id+'","bbs_id":"'+bbs_id+'","message":"'+wuju_htmlspecialchars_decode(msg.rebot_message)+'","do_user_avatar":"'+msg.rebot_avatar+'","do_user_name":"'+msg.rebot_name+'","content":"'+msg.rebot_insert_id+'"}');
}

}	
}
});	
}


// IM发送图片==单对单
function wuju_im_upload_one(author_id){
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.wuju-chat-windows-footer-bar.one .image',
url:wuju.wuju_ajax_url+'/upload/im-one.php',
data:{author_id:author_id},
multiple:true,
accept:'file',
before: function(obj){
layer.load(1);
},
done: function(msg, index, upload){
layer.closeAll('loading');
if(msg.code == 1){
$('.wuju-chat-message-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+msg.img+'</div></li>');
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight);
//图片加载完毕执行
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight);
});


ws.send('{"from_url":"'+wuju.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_name":"'+wuju.nickname_base+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');

if($('#wuju-chat-'+author_id).length>0){//当前会话置顶
$('.wuju-chat-content-recent-user .wuju-group-top-br').after($('#wuju-chat-'+author_id));
$('#wuju-chat-'+author_id+' .msg').text('[图片]');
}

}else{
layer.msg(msg.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
layer.closeAll('loading');
}
});
});
}

// IM发送图片==群组
function wuju_im_upload_group(bbs_id){
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.wuju-chat-windows-footer-bar.group .image',
url:wuju.wuju_ajax_url+'/upload/im-group.php',
data:{bbs_id:bbs_id},
multiple:true,
accept:'file',
before: function(obj){
layer.load(1);
},
done: function(msg, index, upload){
layer.closeAll('loading');
if(msg.code == 1){
$('.wuju-chat-message-group-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+msg.img+'</div></li>');
$('.wuju-chat-message-group-list').scrollTop($('.wuju-chat-message-group-list')[0].scrollHeight);
//图片加载完毕执行
$(".wuju-chat-message-list-content img").on('load',function(){
$('.wuju-chat-message-group-list').scrollTop($('.wuju-chat-message-group-list')[0].scrollHeight);
});


ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group","do_user_id":"'+msg.do_user_id+'","bbs_id":"'+msg.bbs_id+'","group_type":"'+msg.group_type+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'"}');


}else{
layer.msg(msg.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
layer.closeAll('loading');
}
});
});
}


//下拉
function wuju_im_tips(obj,type){
$(obj).hide().html('底部');
if(type=='one'){
$('.wuju-chat-message-list').scrollTop($('.wuju-chat-message-list')[0].scrollHeight);
}else{
$('.wuju-chat-message-group-list').scrollTop($('.wuju-chat-message-group-list')[0].scrollHeight);
}
}



//打开右侧IM列表
function wuju_open_im_list(){
$(".wuju-chat").animate({right:'0px'},280);
if($('.wuju-chat-content-recent-user').hasClass('had')){return false;}
$('.wuju-chat-content-recent-user,.wuju-chat-content-follow-user,.wuju-chat-content-group').html(wuju.loading_post);
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/chat-list.php",
data:{type:'all'},
success: function(msg){
if(msg.code==1){
$('.wuju-chat-content-recent-user').html(msg.recent).addClass('had');  
$('.wuju-chat-content-group').html(msg.group); 
$('.wuju-chat-content-follow-user').html(msg.follow); 
}
}
});
}

//关闭右侧IM列表
function wuju_close_im_list(){
$(".wuju-chat").animate({right:'-280px'},280);
}