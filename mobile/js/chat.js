var wuju_user_chat_ajax = null,wuju_user_chat_group_ajax = null; 

//点击发送消息-单对单
function wuju_send_msg(author_id){
content= $('#wuju-msg-content').val();
if($.trim(content)==''){
$('#wuju-msg-content').val('');
return false;  
}
$('.wuju-chat-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+content+'</div></li>');
$('#wuju-msg-content').val('');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);

$('.messagebar.messagebar-init').css('height','12vw');
$('#wuju-msg-content').css('height','11vw');
$('.wuju-msg-tips').hide();

$.ajax({
type: "POST",
url:wuju.module_url+"/chat/msg.php",
data: {author_id:author_id,content:content},
success: function(msg){
if(msg.code==0){
$('.wuju-chat-list .myself').last().children('.wuju-chat-message-list-content').prepend('<i class="wuju-icon wuju-shibai error"></i>');
$('.wuju-chat-list').append('<p class="wuju-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.wuju-chat-list-content').scrollTop($('.wuju-chat-list-content')[0].scrollHeight);

}
}
});

}


//单对单 长轮询
function wuju_ajax_get_messages(author_id){
count=$('.wuju-chat-list').attr('count');
wuju_user_chat_ajax = $.ajax({
type: "POST",
url:wuju.module_url+"/chat/message-list-ajax.php",
timeout:30000,
dataType: 'json',
data: {user_id:author_id,count:count},
success: function(msg){
if(msg.code==1){
wuju_ajax_get_messages(author_id);	
}else if(msg.code==2){
$('.wuju-chat-list').append(msg.msg);	
$('.wuju-chat-list').attr('count',msg.count);

if(msg.msg!=''){
$('.wuju-msg-tips').show().html('消息');
}

wuju_ajax_get_messages(author_id);
}else if(msg.code==3){
}else if(msg.code==5){
$('.wuju-chat-list').attr('count',msg.count);
wuju_ajax_get_messages(author_id); 
}else{
wuju_ajax_get_messages(author_id);	
}
},
error:function(XMLHttpRequest,textStatus,errorThrown){ 
if(textStatus=="timeout"){ 
wuju_ajax_get_messages(author_id);
} 
} 
});
}

//终止单对单ajax长轮询
function wuju_stop_user_Ajax(){   
if(wuju_user_chat_ajax) {wuju_user_chat_ajax.abort();}  
}  


//打开单对单聊天
function wuju_open_user_chat(author_id,obj){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
if($(obj).find('.badge').length>0){
all_notice=parseInt($('.wuju-footer-toolbar .tips').html());
current_notice=parseInt($(obj).find('.badge').html());
number=all_notice-current_notice;
if(number){//如果还有未读消息
$('.wuju-xiaoxizhongxin .badge').html(number);	
}else{
$('.wuju-xiaoxizhongxin .badge').remove();
}
}
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/chat-one.php?author_id='+author_id});
}

//打开群聊
function wuju_open_group_chat(bbs_id){
if(!wuju.is_login){
myApp.loginScreen();  
return false;
}
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/chat-group.php?bbs_id='+bbs_id});
}





//点击发送消息-群聊
function wuju_send_msg_group(bbs_id){
content= $('#wuju-msg-group-content').val();
if($.trim(content)==''){
$('#wuju-msg-group-content').val('');
return false;  
}
$('.wuju-chat-group-list').append('<li class="myself"><div class="wuju-chat-message-list-user-info">'+wuju.avatar+'</div><div class="wuju-chat-message-list-content">'+content+'</div></li>');
$('#wuju-msg-group-content').val('');
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);

$('.messagebar.messagebar-init').css('height','12vw');
$('#wuju-msg-group-content').css('height','11vw');
$('.wuju-msg-tips').hide();

$.ajax({
type: "POST",
url:wuju.module_url+"/chat/msg-group.php",
data: {bbs_id:bbs_id,content:content},
success: function(msg){
if(msg.code==0){
$('.wuju-chat-group-list .myself').last().children('.wuju-chat-message-list-content').prepend('<i class="wuju-icon wuju-shibai error"></i>');
$('.wuju-chat-group-list').append('<p class="wuju-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.wuju-chat-group-list-content').scrollTop($('.wuju-chat-group-list-content')[0].scrollHeight);
}

}
});

}



//群组聊天长轮询
function wuju_ajax_get_messages_group(bbs_id){
count=$('.wuju-chat-group-list').attr('count');
wuju_user_chat_group_ajax = $.ajax({
type: "POST",
url:wuju.theme_url+"/mobile/module/chat/message-group-list-ajax.php",
timeout:30000,
dataType: 'json',
data: {bbs_id:bbs_id,count:count},
success: function(msg){
if(msg.code==2){//有新消息
$('.wuju-chat-group-list').append(msg.msg);	
$('.wuju-chat-group-list').attr('count',msg.count);
wuju_ajax_get_messages_group(bbs_id);

if(msg.msg!=''){
$('.wuju-msg-tips').show().html('消息');
}


}else if(msg.code==9){//超时
wuju_ajax_get_messages_group(bbs_id);	
}
},
error:function(XMLHttpRequest,textStatus,errorThrown){ 
if(textStatus=="timeout"){ 
wuju_ajax_get_messages_group(bbs_id);
} 
} 
});	
}


//终止群组ajax长轮询
function wuju_stop_group_Ajax(){   
if(wuju_user_chat_group_ajax) {wuju_user_chat_group_ajax.abort();}  
}  
