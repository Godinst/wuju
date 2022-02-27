var wuju_user_chat_ajax = null,wuju_user_chat_group_ajax = null; 

//点击发送消息-单对单
function wuju_send_msg(author_id){
content= $('#wuju-msg-content').val();
if($.trim(content)==''){
$('#wuju-msg-content').val('');
return false;  
}
content_a=content;
smile_add_arr=$.parseJSON(wuju.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+wuju.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+wuju.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}

content_a=content_a.replace(/\n/g,"<br/>");

$('.wuju-chat-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+content_a+'</div></li>');
$('#wuju-msg-content').val('');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);

$('.messagebar.messagebar-init').css('height','12vw');
$('#wuju-msg-content').css('height','8vw');
$('.wuju-msg-tips').hide();

$.ajax({
type: "POST",
url:wuju.module_url+"/chat/msg.php",
data: {author_id:author_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.wuju-chat-list .myself').last().children('.wuju-chat-message-list-content').prepend('<i class="wuju-icon wuju-shibai error"></i>');
$('.wuju-chat-list').append('<p class="wuju-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
if(msg.code==3){
function c(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);	
}
}else if(msg.code==1){//聊天隐私

ws.send('{"from_url":"'+wuju.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_name":"'+wuju.nickname_base+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');

if($('#wuju-chat-user-'+author_id).length>0){//当前会话置顶
current_user_li=$('#wuju-chat-user-'+author_id);
$('.wuju-chat-user-'+author_id).remove();
$('#wuju-chat-tab-recently .wuju-group-top-br').after(current_user_li);
$('.wuju-chat-user-'+author_id+' .desc').text(content);
}

if(msg.im_privacy==1){
$('.wuju-chat-list').append('<p class="wuju-chat-message-tips error"><span>'+msg.im_privacy_tips+'</span></p>');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
}
}
}
});

}



//打开单对单聊天
function wuju_open_user_chat(author_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}

if(author_id==wuju.user_id){
layer.open({content:'你不能给自己发起聊天！',skin:'msg',time:2});
return false;	
}


if($('[data-page="chat-one"]').length>0){
layer.open({content:'只能同时打开一个单人聊天，请返回！',skin:'msg',time:2});
return false;	
}


if($(obj).attr('goods')){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/chat-one.php?author_id='+author_id+'&goods='+$(obj).attr('goods')});
}else{
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/chat-one.php?author_id='+author_id});
}
}

//打开群聊
function wuju_open_group_chat(bbs_id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
if($('[data-page="chat-group"]').length>0){
layer.open({content:'只能同时打开一个群聊，请返回！',skin:'msg',time:2});
return false;	
}
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/chat-group.php?bbs_id='+bbs_id});
$('#wuju-chat-group-'+bbs_id+' .tips').remove();
}


//打开购买入场特效界面
function wuju_open_group_chat_join_buy(){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/chat-group-join-buy.php'});
}

//购买入场特效
function wuju_group_join_buy(id,obj){
layer.open({
content: '你确定要购买吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/chat/group-join-do.php",
data: {id:id,type:'buy'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
wuju.chat_group_join_text=msg.content;
$(obj).removeAttr('onclick').text('已购买').addClass('had');
}else if(msg.code==3){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});
}
}
});
layer.close(index);
}
});
}

//使用入场特效
function wuju_group_join_use(id,obj){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/chat/group-join-do.php",
data: {id:id,type:'use'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).text('使用中').addClass('had').parents('li').siblings().find('.btn').removeClass('had').text('使用');
wuju.chat_group_join_text=msg.content;
}
}
});
}


//点击发送消息-群聊
function wuju_send_msg_group(bbs_id){
content= $('#wuju-msg-group-content').val();
if($.trim(content)==''){
$('#wuju-msg-group-content').val('');
return false;  
}

smile_add_arr=$.parseJSON(wuju.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+wuju.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+wuju.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}
content_a=content_a.replace(/\n/g,"<br/>");//换行

$('.wuju-chat-group-list').append('<li class="myself ing"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content" copy="'+content+'">'+content_a+'</div></li>');
$('#wuju-msg-group-content').val('');
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);

$('.messagebar.messagebar-init').css('height','12vw');
$('#wuju-msg-group-content').css('height','8vw');
$('.wuju-msg-tips').hide();

$.ajax({
type: "POST",
url:wuju.module_url+"/chat/msg-group.php",
data: {bbs_id:bbs_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.wuju-chat-group-list .myself').last().children('.wuju-chat-message-list-content').prepend('<i class="wuju-icon wuju-shibai error"></i>');
$('.wuju-chat-group-list').append('<p class="wuju-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);
if(msg.code==3){
function c(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);	
}
$('.wuju-chat-group-list .ing').first().removeClass('ing');
}else if(msg.code==1){
$('.wuju-chat-group-list .ing').first().attr('id','wuju-chat-content-'+msg.id);
$('.wuju-chat-group-list .ing').first().find('.wuju-chat-message-list-content').attr('onclick','wuju_chat_content_more('+msg.id+','+wuju.user_id+','+bbs_id+')');
$('.wuju-chat-group-list .ing').first().removeClass('ing');
ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group","do_user_id":"'+msg.do_user_id+'","bbs_id":"'+msg.bbs_id+'","group_type":"'+msg.group_type+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'","content":"'+msg.id+'"}');

//机器人
if(msg.rebot_name){
ws.send('{"from_url":"'+wuju.home_url+'","type":"chat_group","do_user_id":"'+msg.rebot_user_id+'","bbs_id":"'+bbs_id+'","message":"'+wuju_htmlspecialchars_decode(msg.rebot_message)+'","do_user_avatar":"'+msg.rebot_avatar+'","do_user_name":"'+msg.rebot_name+'","content":"'+msg.rebot_insert_id+'"}');
}

}

}
});

}



//加入群聊
function wuju_join_group_chat(bbs_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
if(wuju.is_black){
layer.open({content:'你是黑名单用户，禁止互动操作！',skin:'msg',time:2});
return false;
}
$.ajax({
type: "POST",
url:wuju.module_url+"/wuju-join-group-chat.php",
data: {bbs_id:bbs_id},
success: function(msg){
if(msg==1){
wuju_open_group_chat(bbs_id);
}else if(msg==2){
layer.open({content:'请先关注'+wuju.bbs_name+'才允许加入群聊！',skin:'msg',time:2});
}else if(msg==3){
myApp.loginScreen();
}
}
});	
}



//发送商品消息
function wuju_send_msg_goods(post_id,author_id,obj){
if(!$(obj).hasClass('had')){
$(obj).addClass('had').text('已发送');
content_a='商品：<a class="back">'+$(obj).prev().children('.title').text()+'</a>';
$('.wuju-chat-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info avatarimg-'+wuju.user_id+'">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+content_a+'</div></li>');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/msg.php",
data: {post_id:post_id,author_id:author_id},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.wuju-chat-list .myself').last().children('.wuju-chat-message-list-content').prepend('<i class="wuju-icon wuju-shibai error"></i>');
$('.wuju-chat-list').append('<p class="wuju-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
if(msg.code==3){
function c(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);	
}
}else if(msg.code==1){//聊天隐私


ws.send('{"from_url":"'+wuju.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');


if(msg.im_privacy==1){
$('.wuju-chat-list').append('<p class="wuju-chat-message-tips error"><span>'+msg.im_privacy_tips+'</span></p>');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);
}
}
}
});
}
}


//撤回 复制
function wuju_chat_content_more(id,user_id,bbs_id){
buttons=[
{text:'复制',onClick:function(){

clipboard = new ClipboardJS('#wuju-chat-copy');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});

}},
{text:'@Ta',onClick:function(){

name=$('#wuju-chat-content-'+id).find('font').text();
if(name){
content=$("#wuju-msg-group-content");
content.val(content.val()+'@'+name+' ').focus();	
}

}},
{text:'撤回',onClick:function(){

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/chat-do.php",
data:{id:id,bbs_id:bbs_id,type:'che'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
name=$('#wuju-chat-content-'+id).find('font').text();
if(user_id==wuju.user_id){
$('#wuju-chat-content-'+id).after('<p class="wuju-chat-message-tips"><span><n>你</n>撤回了一条消息</span></p>');
$('#wuju-chat-content-'+id).remove();
}else{
$('#wuju-chat-content-'+id).after('<p class="wuju-chat-message-tips"><span><n>你</n>撤回了<n>'+name+'</n>的一条消息</span></p>');
$('#wuju-chat-content-'+id).remove();
}

ws.send('{"from_url":"'+wuju.home_url+'","type":"group_che","bbs_id":"'+bbs_id+'","notice_user_id":"'+user_id+'","notice_user_name":"'+name+'","do_user_id":"'+wuju.user_id+'","do_user_name":"'+wuju.nickname_base+'","message":"'+id+'"}');


}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});

}},
{text:'禁言/撤销禁言',onClick:function(){

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.module_url+"/chat/chat-do.php",
data:{id:id,bbs_id:bbs_id,type:'stop'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

}
}
});

}},
{text:'取消',color: 'red'},
];

if(!wuju.is_admin_x||(wuju.is_admin_x&&user_id==wuju.user_id)){
buttons.splice(3,1);	
}

if(user_id!=wuju.user_id&&!wuju.is_admin_x){
buttons.splice(2,1);
}

if(user_id==wuju.user_id){
buttons.splice(1,1);	
}

if($('#wuju-chat-content-'+id+' .wuju-chat-message-list-content .wuju-group-img').length>0){
buttons.splice(0,1);
}

myApp.actions(buttons);

$('.actions-modal-button').first().attr('id','wuju-chat-copy');
$('.actions-modal-button').first().attr('data-clipboard-text',$('#wuju-chat-content-'+id+' .wuju-chat-message-list-content').attr('copy'));


}