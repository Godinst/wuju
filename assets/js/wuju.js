
//引人js
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/login.js'></script>");//登录相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/comment.js'></script>");//评论相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/delete.js'></script>");//删除相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/chat.js'></script>");//IM相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/publish.js'></script>");//发表相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/editor.js'></script>");//编辑相关
document.write("<script type='text/javascript' src='"+wuju.cdn_url+"/assets/js/post.js'></script>");//内容相关

//置顶动态
function wuju_sticky_post(post_id,type,obj){
if(type=='no'){
title='你要取消置顶吗？';
}else{
title='你要置顶这篇内容吗？';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/commend-post.php",
data: {post_id:post_id,type:'sticky-post'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//置顶成功
$(obj).html('取消置顶');
}else if(msg.code==2){//取消置顶
$(obj).html('置顶内容');
}
}
});
});
}



//推荐动态
function wuju_commend_post(post_id,type,obj){
if(type=='no'){
title='你要取消推荐这条内容吗？';
}else{
title='你要推荐这条内容吗？';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/commend-post.php",
data: {post_id:post_id,type:'commend-post'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//推荐成功
$(obj).html('取消推荐');	
}else if(msg.code==2){//取消置顶
$(obj).html('推荐内容');
}
}
});
});
}



//置顶帖子
function wuju_sticky_bbs_post(post_id,bbs_id,type,obj){
if(type=='no'){
title='你要取消置顶吗？';
}else{
title='你要置顶这篇内容吗？';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/commend-post.php",
data: {post_id:post_id,bbs_id:bbs_id,type:'sticky-bbs-post'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//置顶成功
$(obj).parents('.do').prev().append('<span class="wuju-bbs-post-type-up"></span>');
$(obj).html('取消置顶');
}else if(msg.code==2){//取消置顶
$(obj).parents('.do').prev().children('.wuju-bbs-post-type-up').remove();
$(obj).html('置顶内容');
}
}
});
});
}




//加精帖子
function wuju_commend_bbs_post(post_id,bbs_id,type,obj){
if(type=='no'){
title='你要取消加精吗？';
}else{
title='你要加精这篇内容吗？';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/commend-post.php",
data: {post_id:post_id,bbs_id:bbs_id,type:'commend-bbs-post'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//加精成功
$(obj).parents('.do').prev().append('<span class="wuju-bbs-post-type-nice"></span>');
$(obj).html('取消加精');
}else if(msg.code==2){//取消加精
$(obj).parents('.do').prev().children('.wuju-bbs-post-type-nice').remove();
$(obj).html('加精帖子');
}
}
});
});
}



//电脑签到
function wuju_sign(ticket,randstr,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1); 
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/sign.php",
data: {sign:1,ticket:ticket,randstr:randstr},
dataType:'json',
success: function(msg){ 
layer.closeAll('loading');
if(msg.code==0){//签到失败
layer.msg(msg.msg);
}else if(msg.code==1||msg.code==2){//签到成功

if(msg.code==2){
layer.msg(msg.msg);
}else{
layer.open({
title:false,
type: 1,
skin:'wuju-sign-success-form',
area: ['300px','auto'],
resize:false,
content: msg.content
});
}
$(obj).addClass('had').html(msg.text);
$('.wuju-sign-page-all-days span').html(msg.sign_c);
month_day=parseInt($('.wuju-sign-page-month-days span').text());
$('.wuju-sign-page-month-days span').html(month_day+1);
$('.wuju-sign-page-content tbody td.today').removeClass('no-sign').addClass('had-sign').children('span').append('<i class="wuju-icon wuju-dagou"></i>');
}
}
});
return false;
}

//补签表单
function wuju_sign_add_form(day){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/sign-add.php",
data:{day:day},
success: function(msg){
layer.closeAll(); 
layer.open({
title:false,
btn: false,
skin:'wuju-sign-add-form',
area: ['300px','auto'],
resize:false,
content:msg
})
}
});
}

//补签
function wuju_sign_add(day){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/sign-add.php",
data:{day:day},
success: function(msg){
layer.closeAll(); 
if(msg.code==1){
layer.open({
title:false,
type: 1,
skin:'wuju-sign-success-form',
area: ['300px','auto'],
resize:false,
content: msg.content
});

//前端渲染
$('.wuju-sign-page-all-days span').html(msg.sign_c);
month_day=parseInt($('.wuju-sign-page-month-days span').text());
$('.wuju-sign-page-month-days span').html(month_day+1);
$('#wuju-sign-day-'+day).removeClass('no-sign').addClass('had-sign').children('span').html(day+'<i class="wuju-icon wuju-dagou"></i>');

}else{
layer.msg(msg.msg);
}
}
});
}


//查看签到宝箱
function wuju_sign_treasure_form(number){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/sign-treasure.php",
data:{number:number},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
fixed: false,
skin:'wuju-sign-treasure-form',
area: ['300px','auto'],
resize:false,
content: msg
});
}
});	
}


//领取宝箱奖励
function wuju_sign_treasure(number,obj){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/sign-treasure.php",
data:{number:number},
success: function(msg){
layer.closeAll(); 
if(msg.code==1){
layer.open({
title:false,
type: 1,
skin:'wuju-sign-success-form',
area: ['300px','auto'],
resize:false,
content: msg.content
});

//前端渲染
$(obj).addClass('had').html('已领取').parents('li').removeClass('shake');

}else{
layer.msg(msg.msg);
}
}
});
}


//弹出推广规则说明表单
function wuju_referral_info(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/referral-info.php",
success: function(msg){
layer.closeAll(); 
layer.open({
title:'推广规则说明',
btn: false,
area: ['500px','auto'],
resize:false,
content: msg
})
}
}); 
}


//更新论坛设置信息
function wuju_update_bbs_setting(){
select_value=parseInt($("#power_form").val());
power_lv=$("input[name='power_lv']").val();
showposts=$("input[name='showposts']").val();
credit_post_number=$("input[name='credit_post_number']").val();
credit_reply_number=$("input[name='credit_reply_number']").val();
credit_post_times=$("input[name='credit_post_times']").val();
credit_reply_times=$("input[name='credit_reply_times']").val();
last_reply_time=$("input[name='last_reply_time']").val();
if(select_value==6){
if(power_lv==''){//若选择了权限为指定等级，判断是否输入值
setTimeout(function(){layer.closeAll('loading');});
layer.msg('请输入发帖权限->满足经验的用户');
return false;
}
}

//判断必填项是否为空
if(!showposts){layer.msg('请输入帖子相关->帖子数量');return false;}
if(showposts<5){layer.msg('帖子数量要大于或等于5');return false;}

enabled='';
disabled='';
$('#wuju-bbs-menu-setting-1 li').each(function(){
enabled+=$(this).attr('data')+',';
});
$('#wuju-bbs-menu-setting-2 li').each(function(){
disabled+=$(this).attr('data')+',';
});

data=$('#wuju-bbs-setting-form').serialize();
data+='&enabled_menu='+enabled+'&disabled_menu='+disabled;
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/update/bbs-setting.php",
data: data,
success: function(msg){
layer.closeAll('loading');
layer.msg('更新成功！');
}
});
return false;
}

//更新子论坛设置
function wuju_update_bbs_child_setting(){
layer.load(1);
data = $('#wuju-bbs-setting-form').serialize();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/update/bbs-setting-child.php",
data: data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});
}


//喜欢动态
function wuju_like_posts(post_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}

var like_num=$(obj).children('span');
var like_dom=$(obj).parents('.wuju-post-bar').siblings('.wuju-single-left-bar').children().first();
var user_id=wuju.user_id;
var avatar=wuju.avatar;
if($(obj).hasClass('wuju-had-like')){
$(obj).removeClass('wuju-had-like');    
$(obj).addClass('wuju-no-like');
$(obj).children('i').addClass('wuju-xihuan2').removeClass('wuju-shiliangzhinengduixiang31');
like_dom.removeClass('wuju-had-like');//文章左侧栏
like_dom.addClass('wuju-no-like');//文章左侧栏
like_dom.children('i').addClass('wuju-xihuan2').removeClass('wuju-shiliangzhinengduixiang31');//文章左侧栏
like_num.html(parseInt(like_num.html())-1); 
$(obj).parent().next().children('.wuju-post-like-list').find('#had_like_'+user_id).remove();
}else{
$(obj).removeClass('wuju-no-like');    
$(obj).addClass('wuju-had-like');
$(obj).children('i').addClass('wuju-shiliangzhinengduixiang31').removeClass('wuju-xihuan2');
like_dom.removeClass('wuju-no-like');//文章左侧栏    
like_dom.addClass('wuju-had-like');//文章左侧栏
like_dom.children('i').addClass('wuju-shiliangzhinengduixiang31').removeClass('wuju-xihuan2');//文章左侧栏
like_num.html(parseInt(like_num.html())+1);  
$(obj).parent().next().children('.wuju-post-like-list').prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+wuju.verify+'</a>');
// layer.msg('喜欢成功！');
}
$.ajax({   
url:wuju.wuju_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},    
}); 
}

//文章侧栏喜欢
function wuju_single_sidebar_like(post_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();   
return false;
}

var like_dom=$(obj).parent('.wuju-single-left-bar').siblings('.wuju-post-bar').children('.like');
var like_num=like_dom.find('span');
var user_id=wuju.user_id;
var avatar=wuju.avatar;
if($(obj).hasClass('wuju-had-like')){
like_dom.removeClass('wuju-had-like'); 
$(obj).removeClass('wuju-had-like');    
like_dom.addClass('wuju-no-like');
$(obj).addClass('wuju-no-like');
$(obj).children('i').addClass('wuju-xihuan2').removeClass('wuju-shiliangzhinengduixiang31');
like_dom.children('i').addClass('wuju-xihuan2').removeClass('wuju-shiliangzhinengduixiang31');
like_num.html(parseInt(like_num.html())-1); 
like_dom.parent().next().children('.wuju-post-like-list').find('#had_like_'+user_id).remove();
}else{
like_dom.removeClass('wuju-no-like');  
$(obj).removeClass('wuju-no-like');   
like_dom.addClass('wuju-had-like');
$(obj).addClass('wuju-had-like');
$(obj).children('i').addClass('wuju-shiliangzhinengduixiang31').removeClass('wuju-xihuan2');
like_dom.children('i').addClass('wuju-shiliangzhinengduixiang31').removeClass('wuju-xihuan2');
like_num.html(parseInt(like_num.html())+1);  
like_dom.parent().next().children('.wuju-post-like-list').prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+wuju.verify+'</a>');
// layer.msg('喜欢成功！');
}
$.ajax({   
url:wuju.wuju_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},     
}); 
}


//收藏商品
function wuju_like_goods(post_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
if($(obj).hasClass('had')){
$(obj).removeClass('had').children('i').removeClass('wuju-shoucang').addClass('wuju-shoucang1');	
$(obj).children('span').text('收藏');
}else{
$(obj).addClass('had').children('i').removeClass('wuju-shoucang1').addClass('wuju-shoucang');	
$(obj).children('span').text('已收藏');	
}

$.ajax({   
url:wuju.wuju_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},    
});	
}



//关注论坛
function wuju_bbs_like(bbs_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
n=parseInt($(".wuju-bbs-follow-info .num").html());
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/bbs-like.php",
data: {bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).addClass("had");
$(obj).html('<i class="wuju-icon wuju-yiguanzhu"></i> 已 关');
n++; 	
}else if(msg.code==2){
$(obj).removeClass("had");
$(obj).html('<i class="wuju-icon wuju-guanzhu"></i> 关 注');
n--;	
}
$(".wuju-bbs-follow-info .num").text(n);

}
});

}

//关注话题
function wuju_topic_like(topic_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
n=parseInt($(".wuju-topic-info-content .right span").last().children('i').html());
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/topic-like.php",
data: {topic_id:topic_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).addClass("had");
$(obj).html('<i class="wuju-icon wuju-yiguanzhu"></i> 已 关');
n++;	
}else if(msg.code==2){
$(obj).removeClass("had");
$(obj).html('<i class="wuju-icon wuju-guanzhu"></i> 关 注');
n--;	
}
$(".wuju-topic-info-content .right span i").text(n); 
}
});

}






//===============================打赏============================

//展示打赏页面
function wuju_reward_form(post_id,type){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/reward.php",
type:'POST',   
data:{post_id:post_id,type:type},    
success:function(results){
layer.open({
title:false,
type: 1,
closeBtn: 0,
skin: 'wuju-reward-form', 
area: ['300px'], 
resize:false,
content: results
});
layer.closeAll('loading');
$('.wuju-reward-close').click(function(){
layer.closeAll();//关闭打赏页面
});

}   
});  
}
//修改打赏金额
function wuju_reward_edior(number){
this_dom=$('.wuju-reward-edior');
if(this_dom.hasClass('on')){
this_dom.removeClass('on').html('修改金额');
$('.wuju-reward-money span').html('<input type="hidden" id="wuju-reward-number" value="'+number+'"><m>'+number+'</m>');
}else{
this_dom.addClass('on').html('取消');
$('.wuju-reward-money span').html('<input type="text"  maxlength="4"  id="wuju-reward-number">');
$('#wuju-reward-number').focus();
}
}

//提交打赏
function wuju_reward(post_id,type){
number=parseInt($("#wuju-reward-number").val());
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/action/reward.php",
type:'POST',   
data:{number:number,post_id:post_id,type:type},    
success:function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function d(){layer.closeAll();}setTimeout(d,2000);
}   
}
});
}


//==============================打赏结束==========================







//弹出转发表单、分享表单
function wuju_reprint_form(post_id){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/reprint.php",
type:'POST',   
data:{post_id:post_id},    
success:function(results){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
skin: 'wuju-reprint-form', 
area: ['475px', '270px'], 
resize:false,
content: results
});
layui.use('form', function(){
var form = layui.form;
form.render();//表单重渲染
});

//复制文章分享链接
var clipboard = new ClipboardJS('#wuju-copy-share-link-single');
clipboard.on('success', function(e) {
e.clearSelection();
$('#wuju-copy-share-link-single').append('<g>复制成功！</g>');
function d(){$('#wuju-copy-share-link-single').children('g').remove()}
setTimeout(d,1000);
});

}   
});
}



// 一级转载
function wuju_reprint(post_id){
content = $('#wuju-reprint-value').val();
comment_a=$('#wuju-reprint-check-a').is(':checked');
if(content==''){content='转发了';}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/reprint.php",
data: {content:content,post_id:post_id,comment_a:comment_a,type:'a'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==2){
wuju_update_phone_form(msg.user_id);//弹出绑定手机号界面
}
}
});

}



// 二级转载
function wuju_reprint_again(post_id){
content = $('#wuju-reprint-value').val();
comment_a=$('#wuju-reprint-check-a').is(':checked');
comment_b=$('#wuju-reprint-check-b').is(':checked');
if(content==''){content='转发了';}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/reprint.php",
data: {content:content,post_id:post_id,comment_a:comment_a,comment_b:comment_b,type:'b'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==2){
wuju_update_phone_form(msg.user_id);//弹出绑定手机号界面
}
}
});

}



//弹出论坛设置界面
function wuju_bbs_setting_form(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/bbs-setting.php",
data: {bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'父级论坛设置',
skin: 'wuju-bbs-setting-form', 
type: 1,
area: ['800px', '600px'], 
resize:false,
content: msg
});

$('.wuju-bbs-setting-form .layui-layer-content').after('<div class="wuju-update-bbs-setting-btn opacity" onclick="wuju_update_bbs_setting();">保存设置</div>');


//论坛上传头像
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.wuju-bbs-child-setting-avatar span',
url: wuju.wuju_ajax_url+'/upload/term.php',
data: {bbs_id:bbs_id},
accept:'file',
before: function(obj){
$('.wuju-bbs-child-setting-avatar span').show().html(wuju.loading);
},
done: function(res, index, upload){
$('.wuju-bbs-child-setting-avatar span').hide().html('点击上传头像');
if(res.code == 1){
if($('.wuju-bbs-child-setting-avatar img').length>0){
$('.wuju-bbs-child-setting-avatar img').attr('src',res.file_url);
}else{
$('.wuju-bbs-child-setting-avatar no-img').remove();
$('.wuju-bbs-child-setting-avatar').prepend('<img src="'+res.file_url+'" class="avatar opacity">');
}
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('.wuju-bbs-child-setting-avatar span').hide().html('点击上传头像');
}
});

});


layui.use('form', function(){
var form = layui.form;
form.render();

//发表
form.on('select(power_form)', function(data){
$select_value=parseInt($("#power_form").val());
if($select_value==6){
$("#wuju-publish-power-lv").show();    
}else{
$("#wuju-publish-power-lv").hide();     
}
if($select_value==7){
$("#wuju-publish-power-honor").show();    
}else{
$("#wuju-publish-power-honor").hide();     
}
if($select_value==8){
$("#wuju-publish-power-verify").show();    
}else{
$("#wuju-publish-power-verify").hide();     
}
});

//回帖
form.on('select(comment_power)', function(data){
$select_value=parseInt($("#wuju-bbs-comment-power").val());
if($select_value==6){
$("#wuju-bbs-comment-power-lv").show();    
}else{
$("#wuju-bbs-comment-power-lv").hide();     
}
if($select_value==7){
$("#wuju-bbs-comment-power-honor").show();    
}else{
$("#wuju-bbs-comment-power-honor").hide();     
}
if($select_value==8){
$("#wuju-bbs-comment-power-verify").show();    
}else{
$("#wuju-bbs-comment-power-verify").hide();     
}
});

//布局
form.on('select(layout)',function(data){
if(data.value==0){
$('#wuju-layout-sidebar-setting').show();
}else{
$('#wuju-layout-sidebar-setting').hide();
}
});

//访问
form.on('select(visit_power_form)',function(data){
$select_value=parseInt($("#visit_power_form").val());
if($select_value==5){
$("#wuju-visit-power-pass").show();    
}else{
$("#wuju-visit-power-pass").hide();     
}
if($select_value==6){
$("#wuju-visit-power-exp").show();    
}else{
$("#wuju-visit-power-exp").hide();     
}
if($select_value==7){
$("#wuju-visit-power-user").show();    
}else{
$("#wuju-visit-power-user").hide();     
}
if($select_value==9){
$("#wuju-visit-power-honor").show();    
}else{
$("#wuju-visit-power-honor").hide();     
}
if($select_value==10){
$("#wuju-visit-power-verify").show();    
}else{
$("#wuju-visit-power-verify").hide();     
}
if($select_value==11){
$("#wuju-visit-power-pay").show();    
}else{
$("#wuju-visit-power-pay").hide();     
}
});

});
}

});    
}




//弹出子论坛设置界面 子论坛
function wuju_bbs_setting_form_child(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/bbs-setting-child.php",
data: {bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'子论坛设置',
skin: 'wuju-bbs-setting-form', 
type: 1,
area: ['500px', '400px'], 
resize:false,
content: msg
});

$('.wuju-bbs-setting-form .layui-layer-content').after('<div class="wuju-update-bbs-setting-btn opacity" onclick="wuju_update_bbs_child_setting();">保存设置</div>');



//子论坛上传头像
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.wuju-bbs-child-setting-avatar span',
url: wuju.wuju_ajax_url+'/upload/term.php',
data: {bbs_id:bbs_id},
accept:'file',
before: function(obj){
$('.wuju-bbs-child-setting-avatar span').show().html(wuju.loading);
},
done: function(res, index, upload){
$('.wuju-bbs-child-setting-avatar span').hide().html('点击上传头像');
if(res.code == 1){
if($('.wuju-bbs-child-setting-avatar img').length>0){
$('.wuju-bbs-child-setting-avatar img').attr('src',res.file_url);
}else{
$('.wuju-bbs-child-setting-avatar no-img').remove();
$('.wuju-bbs-child-setting-avatar').prepend('<img src="'+res.file_url+'" class="avatar opacity">');
}
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('.wuju-bbs-child-setting-avatar span').hide().html('点击上传头像');
}
});

});

}

});    
}


//话题设置表单
function wuju_topic_setting_form(topic_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/topic-setting.php",
data: {topic_id:topic_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'话题设置',
skin: 'wuju-bbs-setting-form', 
type: 1,
area: ['500px', '400px'], 
resize:false,
content: msg
});

$('.wuju-bbs-setting-form .layui-layer-content').after('<div class="wuju-update-bbs-setting-btn opacity" onclick="wuju_update_topic();">保存设置</div>');


//话题上传头像
layui.use(['upload','form'], function(){
var upload = layui.upload;
var form = layui.form;
form.render();
upload.render({
elem: '.wuju-topic-setting-avatar span',
url: wuju.wuju_ajax_url+'/upload/term.php',
data: {bbs_id:topic_id},
accept:'file',
before: function(obj){
$('.wuju-topic-setting-avatar span').show().html(wuju.loading);
},
done: function(res, index, upload){
$('.wuju-topic-setting-avatar span').hide().html('点击上传头像');
if(res.code == 1){
if($('.wuju-topic-setting-avatar img').length>0){
$('.wuju-topic-setting-avatar img').attr('src',res.file_url);
}else{
$('.wuju-topic-setting-avatar no-img').remove();
$('.wuju-topic-setting-avatar').prepend('<img src="'+res.file_url+'" class="avatar opacity">');
}
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('.wuju-topic-setting-avatar span').hide().html('点击上传头像');
}
});

});



layui.use('form', function(){
var form = layui.form;
form.render();
form.on('select(topic_power)', function(data){
$select_value=$("#wuju-topic-power").val();
if($select_value=='user'){
$("#wuju-topic-power-user").show();    
}else{
$("#wuju-topic-power-user").hide();     
}
});

});






}

});    
}


//提交话题设置
function wuju_update_topic(){
layer.load(1);
data = $('#wuju-topic-setting-form').serialize();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/update/topic.php",
data: data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});
}







//弹出购买付费可见内容-表单
function wuju_show_pay_form(post_id){
if(!wuju.is_login){
wuju_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/pay-form.php",
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
area: ['600px','auto'], 
resize:false,
content: msg
});
}
});
}

//提交付费可见
function wuju_pay_for_visible(post_id){
layer.load(1);
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/pay-for-visible.php",
dataType:'json',
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function d(){window.location.href=wuju.home_url+'/?p='+post_id;}
setTimeout(d,1500);
}else if(msg.code==3){//弹出金币充值窗口
function c(){wuju_recharge_credit_form();}
setTimeout(c,1500);
}
}
});    
}



//显示二级评论框
function wuju_bbs_show_comment_form(obj){
$(obj).parents('.wuju-bbs-single-footer').next().toggle();
}


//快速添加内容到输入框
function wuju_set_input(dom_id,content) {
$("#"+dom_id).val($("#"+dom_id).val()+content);
$("#"+dom_id).focus();
}


// =====================我的钱包模块===================

//我的钱包
function wuju_mywallet_form(user_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/mywallet.php",
data:{user_id:user_id},
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'我的钱包',
type: 1,
area: ['700px', '560px'], 
resize:false,
fixed: false,
offset: '50px',
content: msg
});
}
});
}




//卡密兑换表单
function wuju_keypay_form(){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/keypay.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:'卡密兑换',
btn: false,
resize:false,
area: '350px',
skin: 'wuju-login-form',
content: msg
});
}
});	
}

//提交卡密兑换
function wuju_keypay(){
key=$('#wuju-pop-key').val();
if(key==''){
layer.msg('请输入卡密！');
return false;	
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/key-use.php",
data:{key:key},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('#wuju-pop-key').val('');
if(msg.type=='credit'){
current_credit=parseInt($('.wuju-mycredit-credit-info .credit i').html());
recharge_credit=parseInt(msg.number);
$('.wuju-mycredit-credit-info .credit i').html(current_credit+recharge_credit);
}
}
}
});	
}


//支付宝充值金币||微信充值金币界面
function wuju_recharge_credit_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/recharge-credit.php",
success: function(msg){
layer.closeAll('loading');
window.recharge_credit_form=layer.open({
type:1,
title:wuju.credit_name+'充值',
btn: false,
fixed:false,
resize:false,
area: ['600px', 'auto'], 
skin: 'wuju-credit-recharge-form',
content: msg
});
}
});
}

//支付宝||微信||金币开通会员
function wuju_recharge_vip_form(type){
if(!wuju.is_login){
wuju_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/recharge-vip.php",
data:{type:type},
success: function(msg){
layer.closeAll('loading');
window.recharge_vip_form=layer.open({
type:1,
title:'开通会员',
fixed:false,
btn: false,
resize:false,
area: ['600px', 'auto'], 
skin: 'wuju-credit-recharge-form',
content: msg
});
}
});
}


//提交支付宝金币充值付款
function wuju_recharge_alipay(type){
number=$('#wuju-credit-recharge-number').val();
data=$('#wuju-credit-recharge-form').serialize();
data=data+'&type='+type;

//创建订单
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/create-trade-no.php",
data:data,
success: function(msg){}
});

if(type=='alipay'){
$('#wuju-credit-recharge-form').attr('action',wuju.theme_url+'/extend/alipay/'+type+'.php').submit();

layer.confirm(
'<p style="text-align:center;">请您在新窗口完成付款操作！</p>', 
{title:false,btn:['已支付完成','支付失败'],btnAlign: 'c'}, 
function(index){
layer.close(index);
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/action/check-trade.php",
type:'POST',   
data:data,
success:function(msg){   
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
// if(msg.type=='credit'){//充值金币
// layer.close(recharge_credit_form);//关闭充值窗口
// credit=parseInt($('.wuju-mycredit-credit-info .credit i').html());
// recharge_number=parseInt(msg.recharge_number);
// count=credit+recharge_number;
// $('.wuju-mycredit-credit-info .credit i').html(count);
// }else{
// $('.wuju-mycredit-user-info .vip m').html(msg.content);//开通会员
// }
}else{
layer.close(index);
}
}   
}); 
}
); 
}else{//当面付


//生成当面付二维码
layer.load(1);
$.ajax({   
url:wuju.theme_url+'/extend/alipay/'+type+'.php',
type:'GET',   
data:data,
success:function(msg){   
layer.closeAll('loading');
window.wechatpay_code_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'wuju-wechatpay-code-form',
content: '<div class="wuju-wechatpay-code-content"><div id="wuju-qrcode"></div><p style="color: #00a7ff;"><i class="wuju-icon wuju-zhifubaozhifu" style="color: #00a7ff;font-size: 24px;vertical-align: -3px;"></i> 支付宝扫码支付</p></div>',
cancel: function(index,layero){ 
$('#wuju-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
wuju_check_order_wechatpay_ajax.abort();
},
success:function(){
wuju_qrcode('wuju-qrcode',200,200,msg);
}
});

wuju_check_order_wechatpay(data);

}   
});


}



}


//提交微信支付充值
function wuju_recharge_wechatpay(type){
number=$('#wuju-credit-recharge-number').val();
if(number<=0){
layer.msg('充值的金额不合法！');
return false;
}

if(type=='wechat'){
ajax_url=wuju.wuju_ajax_url+"/stencil/wechatpay-code.php";
}else{
ajax_url=wuju.wuju_ajax_url+"/stencil/wechatpay-xunhu-code.php";	
}

data=$('#wuju-credit-recharge-form').serialize();
data=data+'&type=wechatpay';
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/create-trade-no.php",
data:data,
success: function(msg){}
});



//生成二维码
if(type=='wechat'){
layer.load(1);
$.ajax({   
url:ajax_url,
type:'POST',   
data:data,
success:function(msg){   
layer.closeAll('loading');
window.wechatpay_code_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'wuju-wechatpay-code-form',
content: '<div class="wuju-wechatpay-code-content"><div id="wuju-qrcode"></div><p><i class="wuju-icon wuju-weixinzhifu"></i> 微信扫码支付</p></div>',
cancel: function(index, layero){ 
$('#wuju-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
wuju_check_order_wechatpay_ajax.abort();
},
success:function(){
wuju_qrcode('wuju-qrcode',200,200,msg);
}
});

wuju_check_order_wechatpay(data);

}   
}); 


}else{
layer.load(1);
$.ajax({   
url:ajax_url,
type:'POST',   
data:data,
success:function(msg){   
layer.closeAll('loading');
window.wechatpay_code_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'wuju-wechatpay-code-form',
content: '<div class="wuju-wechatpay-code-content"><img style="width:200px;height:200px;" src="'+msg+'"><p><i class="wuju-icon wuju-weixinzhifu"></i> 微信扫码支付</p></div>',
cancel: function(index, layero){ 
$('#wuju-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
wuju_check_order_wechatpay_ajax.abort();
}
});

wuju_check_order_wechatpay(data);

}   
});	
}


}




function wuju_recharge_credit(){
if($('.wuju-credit-recharge-type li.on').length>0){
type=$('.wuju-credit-recharge-type li.on').attr('data');
if(type=='alipay'||type=='qrcode'){
wuju_recharge_alipay(type);
}else if(type=='wechat'){
wuju_recharge_wechatpay('wechat');
}else if(type=='keypay'){
wuju_keypay_form();	
}else if(type=='xunhu-wechat'){
wuju_recharge_wechatpay('xunhu');
}else if(type=='creditpay'){
wuju_recharge_vip_credit();
}

}else{
layer.msg('请选择充值类型！');
}	
}









function wuju_check_order_wechatpay(data){
//长轮询付款
wuju_check_order_wechatpay_ajax=$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/check-trade.php",
data:data,
success: function(msg){
if(msg.code==0){
wuju_check_order_wechatpay(data);
}else if(msg.code==1){
$('.wuju-wechatpay-code-content').html(msg.msg);
if(msg.type=='credit'){
credit=parseInt($('.wuju-mycredit-credit-info .credit i').html());
recharge_number=parseInt(msg.recharge_number);
count=credit+recharge_number;
$('.wuju-mycredit-credit-info .credit i').html(count);
}else{//开通会员
$('.wuju-mycredit-user-info .vip m').html(msg.content);
}
}else{
wuju_check_order_wechatpay(data);	
}
}
});	
}


//用金币开通会员
function wuju_recharge_vip_credit(){
number=$('#wuju-credit-recharge-number').val();
if(number<=0){
layer.msg('充值的金额不合法！');
return false;
}

data=$('#wuju-credit-recharge-form').serialize();
data=data+'&type=creditpay';
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/recharge-vip-credit.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('.wuju-mycredit-user-info .vip m').html(msg.content);
}



}
});


}


//转账表单-输入转账用户的昵称
function wuju_transfer_one_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/transfer-one.php",
success: function(msg){
layer.closeAll('loading');
window.transfer_one_form=layer.open({
type:1,
title:'转账',
btn: false,
resize:false,
area: '350px',
skin: 'wuju-login-form',
content: msg
});

//回车
$("#wuju-pop-nickname").keypress(function(e) {  
if(e.which == 13) {  
wuju_transfer_one();
}  
}); 

}
});	
}

//提交转账表单--第一步
function wuju_transfer_one(){
nickname=$('#wuju-pop-nickname').val();
if(nickname==''){
layer.msg('请输入需要转账用户的昵称！');
return false;
}

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/transfer-one.php",
data:{nickname:nickname},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
window.transfer_confirm_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: '350px',
skin: 'wuju-transfer-form',
content: msg.content
});
$('#wuju-pop-transfer-number').focus();
layer.close(transfer_one_form);
}else{
layer.msg(msg.msg);	
}
}
});
}

//确定转账
function wuju_transfer_confirm(){
author_id=$('.wuju-transfer-confirm-form').attr('data');
number=$('#wuju-pop-transfer-number').val();
mark=$('#wuju-pop-transfer-mark').val();
if(number==''){
layer.msg('请输入转账金额！');
return false;	
}

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/transfer-confirm.php",
data:{author_id:author_id,number:number,mark:mark},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);	
if(msg.code==1){
credit=parseInt($('.wuju-mycredit-credit-info .credit i').html());
recharge_number=parseInt(msg.transfer_number);
count=credit-recharge_number;
$('.wuju-mycredit-credit-info .credit i').html(count);
layer.close(transfer_confirm_form);
}
}
});

}





//=============================我的钱包模块结束===========================









//查看密码动态
function wuju_get_password_posts(post_id,type,obj){
if(!wuju.is_login){
wuju_pop_login_style();
return false;
}

if(type=='pop'){//弹窗
password= $(obj).parent().prev().children('input').val();
}else{
password= $(obj).prev('#wuju-post-password').val();	
}

if(password==''){
layer.msg('请输入密码！');
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/password-post.php",
data: {post_id:post_id,password:password},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function d(){window.location.href=wuju.home_url+'/?p='+post_id;}
setTimeout(d,2500);
}
}
});
}


//下载密码音乐表单
function wuju_music_password_form(post_id){
if(!wuju.is_login){
wuju_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/music-password.php",
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'请输入密码',
btn: false,
type: 1,
resize:false,
area: '350px',
skin: 'wuju-login-form',
content: msg
});

}
});
}







//论坛移除图片
function wuju_remove_multiple_img(obj){
$(obj).parent().remove();
}





//关注按钮
function wuju_follow(author_id,obj){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/follow.php",
data: {author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//取消关注
$(obj).removeClass('has').addClass('no');
$(obj).html('<i class="wuju-icon wuju-guanzhu"></i>关注');
}else if(msg.code==2){//关注成功
$(obj).removeClass('no').addClass('has'); 
$(obj).html('<i class="wuju-icon wuju-yiguanzhu"></i> 已关');     
}else if(msg.code==3){//相互关注成功
$(obj).removeClass('no').addClass('has');  
$(obj).html('<i class="wuju-icon wuju-xianghuguanzhu"></i>互关');    
}
}
}); 
}




//更新用户资料
function wuju_setting(type){
if(type=='base'){
input_data = $('#wuju-setting-base').serialize();	
}else if(type=='account'){
input_data = $('#wuju-setting-account').serialize();	
}else if(type=='social'){
input_data = $('#wuju-setting-social').serialize();	
}else if(type=='privacy'){
input_data = $('#wuju-setting-privacy').serialize();	
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/update/profile.php",
data: input_data,
dataType:'json',
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}

}); 
}

//修改背景音乐
function wuju_update_profile_bg_music(){
author_id =$('.wuju-page').attr('author_id');
bg_music_url=$('#wuju-bg-music-url').val();
bg_music_on_off=$('#wuju-bg-music-on-off').is(':checked');
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/update/profile.php",
data: {author_id:author_id,bg_music_url:bg_music_url,bg_music_on_off:bg_music_on_off},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}

});
}













//弹窗转发 分享到微信功能
function wuju_singe_share_wechat(url){
layer.open({
title:'分享到微信',
btn: false,
type: 1,
resize:false,
area: ['240px', '315px'],
skin: 'wuju-pop-share',
content: '<div id="wuju-qrcode"></div><p>打开微信“扫一扫”</p>',
success: function(layero, index){
wuju_qrcode('wuju-qrcode',200,200,url);
}
});    
}

function wuju_singe_share_qq(url){
layer.open({
title:'分享到QQ',
btn: false,
type: 1,
resize:false,
area: ['240px', '315px'],
skin: 'wuju-pop-share',
content: '<div id="wuju-qrcode"></div><p>打开QQ“扫一扫”</p>',
success: function(layero, index){
wuju_qrcode('wuju-qrcode',200,200,url);
}
});    
}



//侧栏小工具 分享到微信功能
function wuju_sidebar_share_wechat(title,url){
layer.open({
title:title,
btn: false,
type: 1,
resize:false,
area: ['240px', '315px'],
skin: 'wuju-pop-share',
content: '<div id="wuju-qrcode"></div><p>打开微信“扫一扫”</p>',
success: function(layero, index){
wuju_qrcode('wuju-qrcode',200,200,url);
}
});    
}

function wuju_sidebar_share_qq(){
url=$('#wuju-sidebar-share-link').html();
layer.open({
title:'分享到QQ',
btn: false,
type: 1,
resize:false,
area: ['240px', '315px'],
skin: 'wuju-pop-share',
content: '<div id="wuju-qrcode"></div><p>打开QQ“扫一扫”</p>',
success: function(layero, index){
wuju_qrcode('wuju-qrcode',200,200,url);
}
});    
}

//分享到QQ空间
function wuju_sidebar_share_qzone(){
qzone_url='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+wuju.site_name+'&url=';
share_url=$('#wuju-sidebar-share-link').html();
window.open(qzone_url+share_url);
}

//分享到微博
function wuju_sidebar_share_weibo(key){
weibo_url='http://service.weibo.com/share/share.php?title='+wuju.site_name+'&url=';
share_url=$('#wuju-sidebar-share-link').html();
window.open(weibo_url+share_url);
}




//ajax获取设置页面
function wuju_setting_form(obj){
user_id=$(obj).attr('author_id');
$(obj).addClass('on').siblings().removeClass('on');
$('.wuju-post-list').prepend(wuju.loading_post);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/profile.php",
data: {user_id:user_id},
success: function(msg){   
$('.wuju-post-list').children('.wuju-load').remove();
$('.wuju-post-list').html(msg);
layui.use(['upload','form','element'], function(){
var upload = layui.upload;
var form = layui.form;
var element = layui.element;
element.render();
form.render();//表单重渲染


//个人主页背景音乐
upload.render({
elem: '#test-upload-music',
url: wuju.wuju_ajax_url+'/upload/user-bg-music.php',
multiple:true,
accept:'file',
data: {author_id:$('#wuju-bg-music-url').attr('data')},
before: function(obj){
$('#wuju-bbs-comment-upload').html('<i class="fa fa-spin fa-refresh">');
},
done: function(res, index, upload){
$('#wuju-bbs-comment-upload').html('<i class="fa fa-picture-o"></i>');
if(res.code == 0){
$('#wuju-bg-music-url').val(res.data['src']);
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('#wuju-bbs-comment-upload').html('<i class="fa fa-picture-o"></i>');
}, 
xhr:function (index,e) {
var percent=e.loaded / e.total;//计算百分比
percent = parseFloat(percent.toFixed(2));
element.progress('wuju-bg-music', percent*100+'%');
// console.log("-----"+percent);
}
});

});



}
});
}




//论坛列表加载更多
function wuju_ajax_bbs(obj,type){
page=$(obj).attr('data');
bbs_id=$('.wuju-bbs-header').attr('data');
topic=$('.wuju-bbs-box-header .left li.on').attr('topic');
$(obj).html(wuju.loading);
ajax_obj=obj;
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/ajax/bbs.php",
data: {page:page,bbs_id:bbs_id,type:type,topic:topic},
success: function(msg){   
$(ajax_obj).html('加载更多');
if(msg==0){
layer.msg('没有更多内容！');
$(ajax_obj).remove();
}else{


if($(obj).parent().hasClass('wuju-bbs-list-4')){
container=$('#wuju-bbs-list-4');
$(msg).find('img').each(function(index){
wuju_loadImage($(this).attr('src'));
})
var $newElems = $(msg).css({ opacity: 0}).appendTo(container);
$newElems.imagesLoaded(function(){
$newElems.animate({ opacity: 1},800);
container.masonry( 'appended', $newElems,true);
});
}else{
$(ajax_obj).before(msg);	
}



paged=parseInt(page)+1;
$(ajax_obj).attr('data',paged);	
}


}
});
}









//---------------------ajax加载更多结束


//=================论坛ajax加载内容

//comment:按最新回复排序
//new:按最新发表排序
//nice:精品帖子
function wuju_ajax_bbs_menu(type,obj){
$(obj).addClass('on').siblings().removeClass('on');
var bbs_id=$('.wuju-bbs-header').attr('data');
$('.wuju-bbs-list-box').html(wuju.loading);
topic=$(obj).attr('topic');
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/ajax/bbs.php",
data: {page:1,bbs_id:bbs_id,type:type,topic:topic},
success: function(msg){   

$('.wuju-bbs-list-box').empty();
if($(obj).parents('.wuju-bbs-box').next().hasClass('wuju-bbs-list-4')){
container=$('#wuju-bbs-list-4');
$(msg).find('img').each(function(index){
wuju_loadImage($(this).attr('src'));
})
var $newElems = $(msg).css({ opacity: 0}).appendTo(container);
$newElems.imagesLoaded(function(){
$newElems.animate({ opacity: 1},800);
container.masonry( 'reload', $newElems,true);
});
}else{
$('.wuju-bbs-list-box').html(msg);	
}


}
});
}


//论坛ajax搜索
function wuju_ajax_bbs_search(){
content=$('#wuju-bbs-search').val();
bbs_id=$('.wuju-bbs-header').attr('data');
if($.trim(content)==''){
layer.msg('请输入你要搜索的内容！');
return false;
}

$('.wuju-bbs-list-box').html(wuju.loading);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/ajax/search-bbs.php",
data: {page:1,bbs_id:bbs_id,content:content},
success: function(msg){   

$('.wuju-bbs-list-box').empty();
if($('.wuju-bbs-list-box').hasClass('wuju-bbs-list-4')){
container=$('#wuju-bbs-list-4');
$(msg).find('img').each(function(index){
wuju_loadImage($(this).attr('src'));
})
var $newElems = $(msg).css({ opacity: 0}).appendTo(container);
$newElems.imagesLoaded(function(){
$newElems.animate({ opacity: 1},800);
container.masonry( 'reload', $newElems,true);
});
}else{
$('.wuju-bbs-list-box').html(msg);	
}

}
});
}


//论坛ajax搜索 加载更多
function wuju_ajax_bbs_search_more(obj){
$(obj).html(wuju.loading);
page=parseInt($(obj).attr('data'));
content=$('#wuju-bbs-search').val();
bbs_id=$('.wuju-bbs-header').attr('data');
if($.trim(content)==''){
layer.msg('请输入你要搜索的内容！');
return false;
}
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/ajax/search-bbs.php",
data: {page:page,bbs_id:bbs_id,content:content},
success: function(msg){   
$('.wuju-bb-search-more').html('加载更多');
if(msg==0){
layer.msg('没有更多的内容！');
$('.wuju-bb-search-more').remove();
}else{

$('.wuju-bb-search-more').attr('data',page+1);


if($(obj).parent().hasClass('wuju-bbs-list-4')){
container=$('#wuju-bbs-list-4');
$(msg).find('img').each(function(index){
wuju_loadImage($(this).attr('src'));
})
var $newElems = $(msg).css({ opacity: 0}).appendTo(container);
$newElems.imagesLoaded(function(){
$newElems.animate({ opacity: 1},800);
container.masonry( 'appended', $newElems,true);
});
}else{
$('.wuju-bb-search-more').before(msg);	
}
	
}

}
});
}


//论坛查看更多置顶
function wuju_more_bbs_commend_posts(obj){
if($(obj).prev('.wuju-bbs-post-list').hasClass('had')){
$(obj).prev('.wuju-bbs-post-list').removeClass('had');
$(obj).html('收起列表 <i class="fa fa-angle-up">');	
}else{
$(obj).prev('.wuju-bbs-post-list').addClass('had');
$(obj).html('查看更多 <i class="fa fa-angle-down">');
}
}


//投票
function wuju_bbs_vote(post_id){
i=0;
data = [];
$(".wuju-bbs-vote-form input").each(function(){
if($(this).is(':checked')){
data.push(i+1);	
}
i++;
});

if(data.length>0){
data_arr = data.join(",");
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/vote.php",
data: {post_id:post_id,vote:data_arr},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function d(){window.location.reload();}setTimeout(d,1500);	
}

}
});
}else{ //判断是否选择了投票选项
layer.msg('请至少选择一项进行投票！');
}
}

//打开链接
function wuju_post_link(obj){
var post_url=$(obj).parents('a').attr('href');
$(obj).parents('a').removeAttr('href');
var link=$(obj).attr('data');
window.open(link);
function d(){$(obj).parents('a').attr('href',post_url);}
setTimeout(d,1500);
}


//论坛附件类型
function wuju_bbs_file_style(type){
if(wuju.is_black){
layer.msg('你是黑名单用户，禁止设置操作！');	
return false;
}
layer.open({
content: '请选择你要上传附件的类型'
,btn: ['本地', '外链', '网盘']
,btnAlign: 'c'
,yes: function(index, layero){
layer.closeAll(); 
wuju_bbs_file_local_add(type);

}
,btn2: function(index, layero){
wuju_bbs_file_outlink_add(type);
}
,btn3: function(index, layero){
wuju_bbs_file_pan_add(type);
}
,cancel: function(){ 
}
});
}
//添加本地上传 
function wuju_bbs_file_local_add(type){

layer.open({
title:'添加附件-本地',
type: 1,
area: ['282px', '230px'], //宽高
content: '<div class="bbs_add_file_form"><div class="file_progress"><span class="file_bar"></span><span class="file_percent">0%</span></div><div id="bbs_file_local_select_btn" class="bbs_file_local_select_btn opacity"><i class="fa fa-plus"></i> 选择文件<form id="add_file_local" method="post" enctype="multipart/form-data" action="'+wuju.wuju_ajax_url+'/upload/file.php"><input id="bbs_file_local_input" type="file" name="file"></form></div><input type="text"  placeholder="请输入附件名称" id="file_name"><input type="hidden"  placeholder="附件地址，需要带http://" id="file_url"><div class="bbs_add_file_btn opacity" onclick="wuju_bbs_file_insert_local('+type+');">插入附件</div></div>'
});


}




//添加外链 
function wuju_bbs_file_outlink_add(type){
layer.open({
title:'添加附件-外链',
type: 1,
area: ['282px', '230px'], //宽高
content: '<div class="bbs_add_file_form"><input type="text"  placeholder="附件地址，需要带http://" id="file_url"><input type="text"  placeholder="附件名称" id="file_name"><div class="bbs_add_file_btn opacity" onclick="wuju_bbs_file_insert_out('+type+');">插入附件</div></div>'
});
$('#file_url').focus();
}
//添加网盘 
function wuju_bbs_file_pan_add(type){
layer.open({
title:'添加附件-网盘',
type: 1,
area: ['282px', '280px'], //宽高
content: '<div class="bbs_add_file_form"><input type="text"  placeholder="附件地址，需要带http://" id="file_url"><input type="text"  placeholder="附件名称" id="file_name"><input type="text"  placeholder="下载密码" id="file_pass"><div class="bbs_add_file_btn opacity" onclick="wuju_bbs_file_insert_pan('+type+');">插入附件</div></div>'
});
$('#file_url').focus();
}

//编辑器插入-网盘
function wuju_bbs_file_insert_pan(type){	
var file_url=$('#file_url').val();
var name=$('#file_name').val();
var pass=$('#file_pass').val();
if((name&&file_url)==''){
layer.msg('信息不能为空！');	
return false;
}
if(type==1){
ue.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+pass+'" type="3"] ');	
}else if(type==2){
ue_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+pass+'" type="3"] ');	
}else{
ue_single.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+pass+'" type="3"] ');	
}
layer.closeAll(); 
}


//编辑器插入-外链
function wuju_bbs_file_insert_out(type){	
var file_url=$('#file_url').val();
var name=$('#file_name').val();
if((name&&file_url)==''){
layer.msg('信息不能为空！');	
return false;
}

if(type==1){
ue.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" type="2"] ');	
}else if(type==2){
ue_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" type="2"] ');	
}else{
ue_single.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" type="2"] ');	
}
layer.closeAll(); 
}





//==========================提现相关=================


//显示提现二维码
function wuju_show_cash_code(obj){
down_url=$(obj).attr('data');
layer.load(1);
layer.open({
title:false,
btn: false,
type: 1,
resize:false,
area: ['200px', '200px'],
skin: 'wuju-show-cash-code',
content: '<img src="'+down_url+'"/>',
success: function(layero, index){
layer.closeAll('loading');
}
}); 	
}



//弹出提现表单
function wuju_show_cash_form(){
var cash_ratio=parseInt(wuju.cash_ratio);
var credit=parseInt(wuju.credit);
var yuan=parseInt(credit/cash_ratio);
if(wuju.wechat_cash){
var wechat_cash='<input type="radio" name="cash_type" class="cash_form_type" checked="" title="微信" value="1">';	
}else{
var wechat_cash='';	
}
if(wuju.alipay_cash){
var alipay_cash='<input type="radio" name="cash_type" class="cash_form_type" checked="" title="支付宝" value="2">';	
}else{
var alipay_cash='';	
}
window.cash_form=layer.open({
title:'发起提现 - '+wuju.current_user_name,
type: 1,
area: ['282px', '265px'], //宽高
content: '<div class="show_cash_form layui-form"><div class="cash_form_tip"><p>'+cash_ratio+' '+wuju.credit_name+' = 1 人民币</p><p>你最多可以申请提现 '+yuan+' 元</p></div><input type="number" id="cash_number"placeholder="提现金额至少'+wuju.cash_mini_number+'元起"><div class="cash_form_select_type">'+wechat_cash+alipay_cash+'</div><div class="cash_form_btn opacity" onclick="wuju_add_cash();">申请提现</div></div>'
});
layui.use('form', function(){
var form = layui.form;
form.render();//表单重渲染
});
}

//删除提现收款二维码
function wuju_delete_cash_img(type,user_id,obj){
$(obj).next('img').remove();
$(obj).remove();
$.ajax({   
url:wuju.wuju_ajax_url+"/update_user_profile.php",
type:'POST',   
data:{cash_type:type,user_id:user_id},    
success:function(results){}
});
}

//提交提现
function wuju_add_cash(){
var number =$('#cash_number').val();
var type =$("input[name='cash_type']:checked").val();
if(number==''){
layer.msg('请输入提现金额！');	
return false;	
}
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{add_cash:1,number:number,type:type},    
success:function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);
function c(){layer.close(cash_form);}
setTimeout(c,2000);	
}else{
layer.msg(msg.msg);
}

}
});

}

//拒绝提现
function wuju_refuse_cash(id,user_id,number){
layer.prompt({title: '请填写拒绝原因', formType: 2}, function(text, index){
if(text==''){
layer.msg('原因不能为空！');
return false;	
}else{
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{update_cash:id,content:text,status:2,user_id:user_id,number:number},    
success:function(msg){
layer.closeAll('loading');
layer.msg('已经拒绝！');
function c(){layer.close(index);}
setTimeout(c,2000);	
}
});


}
});
}

//通过提现
function wuju_agree_cash(id){
layer.confirm('你确定要通过吗？', {
btn: ['确定','取消'] 
}, function(){

layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{update_cash:id,status:1},    
success:function(msg){
layer.closeAll('loading');
layer.msg('已经通过！');
}
});

});
}

//删除提现
function wuju_delete_cash(id,obj){
var this_dom=obj;
layer.confirm('你确定要删除记录吗？', {
btn: ['确定','取消'] 
}, function(){

layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{delete_cash:id},    
success:function(msg){
layer.closeAll('loading');
layer.msg('删除成功！');
$(this_dom).parents('tr').remove();
}
});

});
}


//==============================提现相关结束=========================








//偏好设置
function wuju_preference_setting(){
this_dom=$(".wuju-preference-setting");
if(this_dom.css("display")=='none'){
this_dom.show();
if ($(".wuju-preference-list li").length==0&&$('.wuju-preference-list .wuju-empty-page').length==0){
$(".wuju-preference-list").append('<div class="wuju-load"><div class="wuju-loading"><i></i><i></i><i></i></div></div>');
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/preference.php",
success: function(msg){
$('.wuju-load').remove();
$('.wuju-preference-list').append(msg);


//设置单栏
bg_skin=GetCookie("bg-style");
if(bg_skin=='01.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_01').addClass('on');
}else if(bg_skin=='02.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_02').addClass('on');    
}else if(bg_skin=='03.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_03').addClass('on');    
}else if(bg_skin=='04.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_04').addClass('on');    
}else if(bg_skin=='05.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_05').addClass('on');    
}else if(bg_skin=='06.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_06').addClass('on');    
}else if(bg_skin=='07.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_07').addClass('on');    
}else if(bg_skin=='08.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_08').addClass('on');    
}else if(bg_skin=='09.css'){
$('.wuju-preference-list .default').removeClass('on');
$('.bg_09').addClass('on');    
}
}
});
}    
}else{
this_dom.hide();
}
}



//偏好设置记录cookie
function wuju_set_cookie(type,val){
if(val!=''){
if(type=='post-style'){
$('#wuju-post-style').attr('href',wuju.theme_url+'/assets/style/'+val);	
}else if(type=='layout-style'){
$('#wuju-layout-style').attr('href',wuju.theme_url+'/assets/style/'+val);	
}else if(type=='space-style'){
$('#wuju-space-style').attr('href',wuju.theme_url+'/assets/style/'+val);		
}else if(type=='sidebar-style'){
$('#wuju-sidebar-style').attr('href',wuju.theme_url+'/assets/style/'+val);		
}else if(type=='preference-bg'){
$('#wuju-bg-style').attr('href',val);		
}
SetCookie(type,val);
}	
}





//追加悬赏
function wuju_add_bbs_answer_number(post_id){
layer.prompt({title:'请输入要追加的金额',btnAlign: 'c'},function(value, index, elem){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/answer.php",
data: {number:value,post_id:post_id,type:'add'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function a(){layer.closeAll();}setTimeout(a,2000); 
}
}
});

});	
}

//采纳答案
function wuju_answer_adopt(obj,post_id){
this_dom=$(obj);
comment_id=$(obj).attr('data');
layer.confirm('你要采纳这个答案吗？', {
btnAlign: 'c'
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/answer.php",
data: {comment_id:comment_id,post_id:post_id,type:'adopt'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function a(){layer.closeAll();}setTimeout(a,2000); 
this_dom.parents('.right').prepend('<i class="wuju-icon answer-icon wuju-yicaina"></i>');
$('.wuju-bbs-single-footer .answer').remove();
$('.wuju-bbs-single-footer .add').remove();
$('.wuju-bbs-post-type-answer').addClass('ok').html('');
}else if(msg.code==3){
function d(){window.location.reload();}setTimeout(d,2000);	
}	
}
});
});
}











//快捷插入表情
function wuju_add_smile(a,type,obj){
if(type==1){//IM
content=$(obj).parents('.wuju-chat-windows-footer-bar').next('textarea');
content.val(content.val()+a);
content.focus();	
}else{//普通
content=$(obj).parents('.wuju-single-expression-btn').prev('textarea');
content.val(content.val()+a);
content.focus();
}
}



//访问密码论坛，输入密码
function wuju_bbs_visit_password(){
bbs_id=$('.wuju-bbs-visit').attr('data');
pass=$('#wuju-bbs-visit-psssword').val();
if(pass==''){
layer.msg('请输入访问密码！');
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.module_url+"/action/bbs-visit-password.php",
data: {bbs_id:bbs_id,pass:pass,visit:1},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);	
function d(){window.location.reload();}setTimeout(d,2000);
}else if(msg.code==3){
wuju_pop_login_style();
}else{
layer.msg(msg.msg);	
}
}
});
}
//删除已经输入的访问密码
function wuju_delete_bbs_visit_password(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.module_url+"/action/bbs-visit-password.php",
data: {bbs_id:bbs_id,delete:1},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);	
}
});
}




//查看更多喜欢的用户
function wuju_post_more_like(post_id){
layer.open({
type: 1,
title:'更多喜欢的用户',
resize:false,
scrollbar:true,
skin: 'wuju-more-like-form',
area: ['250px', '420px'],
content: '<div class="wuju-more-like-content"><div class="wuju-load"><div class="wuju-loading"><i></i><i></i><i></i></div></div></div>',
success: function(layero,index){
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/more-like.php",
type:'POST',      
data: {post_id:post_id},
success:function(msg){
$('.wuju-more-like-content').html(msg);
}
});	
}
});
}


//用户设置邮件通知开关
function wuju_emali_notice_form(){
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/emali-notice.php",
type:'POST',      
success:function(msg){
layer.closeAll('loading');
layer.open({
type: 1,
title:'邮件通知设置',
resize:false,
area: ['200px', 'auto'],
content: msg
});	
layui.use('form', function(){
var form = layui.form;
form.render();

form.on('switch(system)', function(data){
if(data.elem.checked){
value=1
}else{
value=0	
}
$.ajax({   
url:wuju.wuju_ajax_url+"/action/email-notice.php",
type:'POST',   
data:{type:'system',value:value},   
success:function(msg){}
});	
}); 

form.on('switch(user)', function(data){
if(data.elem.checked){
value=1
}else{
value=0	
}
$.ajax({   
url:wuju.wuju_ajax_url+"/action/email-notice.php",
type:'POST',   
data:{type:'user',value:value},   
success:function(msg){}
});	
}); 

form.on('switch(comment)', function(data){
if(data.elem.checked){
value=1
}else{
value=0	
}
$.ajax({   
url:wuju.wuju_ajax_url+"/action/email-notice.php",
type:'POST',   
data:{type:'comment',value:value}, 
success:function(msg){}
});	
}); 


});	

}
});	

}



//拉黑
function wuju_add_blacklist(type,author_id,obj){
if(type=='add'){
title='你要将对方加入黑名单吗？';	
}else{
title='你要将对方移出黑名单吗？';		
}
layer.confirm(title,{
btnAlign: 'c',
btn: ['确定','取消']
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/add-blacklist.php",
data: {author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).html('拉黑名单').attr('onclick','wuju_add_blacklist("add",'+author_id+',this)');	
}else if(msg.code==2){
$(obj).html('取消拉黑').attr('onclick','wuju_add_blacklist("remove",'+author_id+',this)');	
}
}
});
});
}


//弹出活动报名表单
function wuju_activity_form(post_id){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/activity.php",
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
fixed: false,
resize:false,
skin:'wuju-activity-form',
type: 1,
area: ['500px'], 
content:msg
});


layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.wuju-activity-upload',
url:wuju.wuju_ajax_url+'/upload/file.php',
multiple:false,
accept:'file',
before: function(obj){
layer.load(1);
},
done: function(res, index, upload){
layer.closeAll('loading');
layer.msg(res.msg);	
if(res.code == 1){
$(this.item[0]).siblings('.item').val(res.file_url).after('<img src="'+res.file_url+'">');
$(this.item[0]).remove();
}
},
error: function(index, upload){
layer.msg('上传失败！');
layer.closeAll('loading');
}
});
});

}
});
}

//报名
function wuju_activity(post_id){
if($(".wuju-activity-form-list input.item").val()==''){
layer.msg('内容不能为空！');	
return false;	
}
// if($(".wuju-activity-form-list li").children('.upload').val()==''){
// layer.msg('请上传内容！');	
// return false;	
// }

// $(".wuju-activity-form-list input.item").each(function(){
// if($(this).val()==''){
// layer.msg('选项不能为空！');	
// return false;	
// }
// });


data='<div class="wuju-bbs-comment-activity">';
$(".wuju-activity-form-list li").each(function(){
data+='<li>';
data+='<label>'+$(this).children('label').html()+'</label>';
value=$(this).children('.item').val();
if($(this).children('.item').hasClass('upload')){
if(value){
data+='<div class="content"><a href="'+value+'" target="_blank" download="" class="wuju-post-link"><i class="fa fa-link"></i> 附件下载</a></div>';
}
}else{
data+='<div class="content">'+value+'</div>';	
}
data+='</li>';
});
data+='</div>';

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/activity.php",
data: {content:data,post_id:post_id},
success: function(msg){	
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==2){
function d(){wuju_update_phone_form(msg.user_id);}setTimeout(d,2000);
}
}
});

}


//选择附件类型
function wuju_upload_file_form(type){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/file-type.php",
data:{type:type},
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:false,
btn: false,
resize:false,
shade:0.4,
area: ['220px'],
content: msg
});
}
});	
}

//插入附件表单
function wuju_insert_file_form(upload_type,editor_type){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/file-type-file.php",
data:{editor_type:editor_type,upload_type:upload_type},
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:false,
btn: false,
resize:false,
fixed: false,
skin:'wuju-insert-file-main',
shade:0.4,
area: ['350px','auto'],
content: msg
});
}
});	
}

//编辑器插入-文件
function wuju_bbs_insert_file(type){	
file_url=$('#wuju-insert-file-url').val();
name=$('#wuju-insert-file-name').val();
name=name.replace(/\[|]/g,'');
info=$('#wuju-insert-file-info').val();
info=info.replace(/\[|]/g,'');
if(file_url==''||name==''){
layer.msg('文件地址和名称不能为空！');	
return false;
}
if(type==1){
ue.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'"] ');//论坛编辑器
}else if(type==2){
ue_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'"] ');//论坛付费编辑器
}else if(type==3){
ue_single_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'"] ');//文章付费编辑器
}else{
ue_single.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'"] ');//文章编辑器
}
layer.closeAll();//关闭插入的表单
}
//编辑器插入-视频
function wuju_bbs_insert_video(type){	
file_url=$('#wuju-insert-file-url').val();
video_cover=$('#wuju-insert-video-cover').val();
if(file_url==''){
layer.msg('视频地址不能为空！');	
return false;
}
if(type==1){
ue.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//论坛编辑器
}else if(type==2){
ue_pay.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//论坛付费编辑器
}else if(type==3){
ue_single_pay.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//文章付费编辑器
}else{
ue_single.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//文章编辑器
}
layer.closeAll();//关闭插入的表单
}
//编辑器插入-文件
function wuju_bbs_insert_music(type){	
file_url=$('#wuju-insert-file-url').val();
if(file_url==''){
layer.msg('音乐地址不能为空！');	
return false;
}
if(type==1){
ue.execCommand('inserthtml',' [music url="'+file_url+'"] ');//论坛编辑器
}else if(type==2){
ue_pay.execCommand('inserthtml',' [music url="'+file_url+'"] ');//论坛付费编辑器
}else if(type==3){
ue_single_pay.execCommand('inserthtml',' [music url="'+file_url+'"] ');//文章付费编辑器
}else{
ue_single.execCommand('inserthtml',' [music url="'+file_url+'"] ');//文章编辑器
}
layer.closeAll();//关闭插入的表单
}


//赠送礼物表单
function wuju_send_gift_form(author_id){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/send-gift.php",
data:{author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:'赠送礼物',
btn: false,
resize:false,
area: ['600px', 'auto'], 
skin: 'wuju-send-gift-form',
content: msg
});
}
});
}

//送礼物
function wuju_send_gift(author_id){
if($('.wuju-send-gift-form li.on').length==0){
layer.msg('请选择需要赠送的礼物！');	
return false;
}
name=$('.wuju-send-gift-form li.on .top .name').text();

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/send-gift.php",
data: {name:name,author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function d(){window.location.reload();}setTimeout(d,2000);
}
}
});


}

//视频播放
function wuju_post_video(post_id,video_url,cover,autoplay){
video_type=wuju_video_type(video_url);
window['video_'+post_id]=new window[video_type]({
id:'wuju-video-'+post_id,
url:video_url,
poster:cover,
playbackRate: [0.5,1,2,6,8],
fitVideoSize:'fixWidth',
autoplay:autoplay,
// enterLogo:{
// url: wuju.video_logo,
// width: 120,
// height: 50
// },
});
window['video_'+post_id].on('play',function(){
if($('.wuju-video-playing').length>0){
current_post_id=$('.wuju-video-playing').attr('post_id');
window['video_'+current_post_id].pause();
}
	
$('#wuju-video-'+post_id).addClass('wuju-video-playing');
})
window['video_'+post_id].on('pause',function(){
$('#wuju-video-'+post_id).removeClass('wuju-video-playing');
})
}

//获取视频播放类型
function wuju_video_type(video_url){
var index1=video_url.lastIndexOf(".");
var index2=video_url.length;
var type=video_url.substring(index1,index2);
if(type=='.m3u8'){
return 'HlsJsPlayer';
}else if(type=='.flv'){
return 'FlvJsPlayer';
}else{
return 'Player';	
}
}

//弹窗视频
function wuju_pop_video(video_url,video_img,obj){
var rand = Math.floor(Math.random()*(100000 - 9999999) + 9999999);
var title =$(obj).attr('data');
if(title==''){title='每日视频推荐';}
layer.open({
type: 1,
title: title,
area: ['600px','380px'],
fixed:false,
resize:false,
skin:'wuju-pop-video',
content: '<div id="wuju-video-'+rand+'"></div>'
});
wuju_post_video(rand,video_url,video_img,true);
}


//弹窗展示我关注的论坛
function wuju_follow_bbs_form(topic_name){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/follow-bbs.php",
data:{topic_name:topic_name},
type:'POST', 
success:function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
fixed: false,
skin: 'wuju-follow-bbs-form', 
area: ['570px', 'auto'], 
content: msg
});

}   
});
}

//显示IM表情
function wuju_im_smile(obj,type){
window.event.stopPropagation();
this_dom=$(obj);
if(this_dom.children('.wuju-smile-form').length>0){
this_dom.children('.wuju-smile-form').toggle(100);
}else{
layer.load(1);
$.ajax({
type: "POST",
url:wuju.module_url+"/stencil/smile-im.php",
data:{type:type},
success: function(msg){
layer.closeAll('loading');

if(type==1){
$(this_dom).append(msg);//普通
}else{
$(this_dom).html(msg);//IM
}

$(this_dom).children('.wuju-smile-form').show();
}
});
}
}

//显示内容表情
function wuju_post_smile(obj){
window.event.stopPropagation();
$(obj).children('.wuju-smile-form').toggle(100);
}


//清除未读IM消息
function wuju_clear_im_notice(){
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/notice-clear.php",
success: function(msg){
layer.msg(msg.msg);
if(msg.code==1){
$('.wuju-chat-list-tips,.wuju-right-bar-im span').remove();
}
}
});
}


//弹窗选择佩戴头衔
function wuju_use_honor_form(user_id){
if(!wuju.is_login){
wuju_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/use-honor.php",
type:'POST', 
data:{user_id:user_id},
success:function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
skin: 'wuju-select-honor-form', 
area: ['400px', 'auto'], 
content: msg
});
$('.wuju-user_honor-select-form .list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});

}   
});
}

//提交选择头衔
function wuju_use_honor(user_id){
dom=$('.wuju-user_honor-select-form .list li.on');
if(dom.length==0){
layer.msg('请选择要使用的头衔！');
return false;
}
honor=dom.text();
layer.load(1);
$.ajax({   
url:wuju.wuju_ajax_url+"/action/use-honor.php",
type:'POST', 
data:{user_id:user_id,honor:honor},
success:function(msg){
layer.closeAll('loading');
if(msg.code==1){
$('#wuju-honor').val(msg.honor);
layer.closeAll();
layer.msg(msg.msg);
}else{
layer.msg(msg.msg);	
}
}   
});
}


//打开实时动态
function wuju_open_now(){
// $(".wuju-main").animate({left:"-300px"});
$(".wuju-now").animate({right:"0px"});

if($('.wuju-now-content li').length==0){
$('.wuju-now-content').html(wuju.loading);
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/now.php",
data:{page:1,type:1},
type:'POST', 
success:function(msg){
$('.wuju-now-content').html(msg);
}   
});
}
}

//关闭实时动态
function wuju_close_now(){
// $(".wuju-main").animate({left:"0px"},250);
$(".wuju-now").animate({right:"-350px"},250);
}

//刷新实时动态
function wuju_refresh_now(){
$('.wuju-now-content').html(wuju.loading);
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/now.php",
data:{page:1,type:1},
type:'POST', 
success:function(msg){
$('.wuju-now-content').html(msg);
$('.wuju-now-content').attr('page',2);
}   
});	
}

//加载更多实时动态
function wuju_more_now(){
page=parseInt($('.wuju-now-content').attr('page'));
$.ajax({   
url:wuju.wuju_ajax_url+"/stencil/now.php",
data:{page:page,type:2},
type:'POST', 
success:function(msg){
if(msg==0){
$('.wuju-now-more').remove();	
layer.msg('没有更多内容！');
}else{
$('.wuju-now-more').before(msg);
$('.wuju-now-content').attr('page',page+1);
}
}   
});	
}

//提现表单
function wuju_cash_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/cash.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'提现',
skin:'wuju-cash-form',
type: 1,
area: ['380px', '405px'], 
content: msg
});
}
});
}

//提现
function wuju_cash(){
number=$('#wuju-cash-number').val();
type=$('.wuju-cash-form-content .type m.on').attr('type');
name=$('#wuju-cash-name').val();
alipay=$('#wuju-cash-alipay-phone').val();
wechat=$('#wuju-cash-wechat-phone').val();
index=layer.index;

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/cash.php",
data:{number:number,type:type,name:name,alipay:alipay,wechat:wechat},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.close(index);}setTimeout(c,2000);
}
}
});
}

//查看提现详情
function wuju_cash_more(ID){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/cash-more.php",
data:{ID:ID},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
skin:'wuju-cash-form',
type: 1,
area: ['380px', 'auto'], 
content: msg
});
}
});
}

//==============内容审核



//内容管理
function wuju_content_management_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/content-management.php",
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'内容管理',
type: 1,
area: ['700px', '560px'], 
resize:false,
content: msg
});
}
});
}


//通过审核
function wuju_content_management_agree(post_id,obj){
layer.confirm('你要通过该内容吗',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'agree'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parent().html('<m style="color:#5fb878">已通过</m>');
}
}
});
});
}

//驳回内容
//where:==1 在列表 ==2 在内容管理页面
function wuju_content_management_refuse(post_id,bbs_id,where,obj){
layer.prompt({title: '请输入驳回的原因',btnAlign: 'c',formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/content-management.php",
data:{post_id:post_id,bbs_id:bbs_id,type:'refuse',reason:reason,where:where},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(where==1){
if($('.wuju-main-content').hasClass('single')){//如果在内容页面删除，直接返回首页
if(bbs_id){
back_url=msg.url;
}else{
back_url='/';
}
function d(){window.location.href=back_url;}setTimeout(d,2000);	
}else{
$(obj).parents('.wuju-posts-list').fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function() {
$(this).remove();
});
});
}
}else{
$(obj).parent().html('<m style="color:#f00">已驳回</m>');
}
layer.close(index);
}
}
});
});
}

//取消审核
function wuju_content_management_pending_refuse(post_id,obj){
layer.confirm('取消的内容将显示在驳回列表，你确定吗',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'pending_refuse'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parent().html('<m style="color:#f00">已取消</m>');
}
}
});
});
}

//查看驳回原因
function wuju_content_management_reason_form(post_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'read_reason'},
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'驳回原因',
type: 1,
area: ['300px'], 
resize:false,
content: msg
});
}
});
}


//切换马甲表单
function wuju_majia_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/majia.php",
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'切换马甲帐号',
type: 1,
fixed: false,
area: ['500px'],
offset: '50px',
resize:false,
content: msg
});
}
});
}

//切换马甲
function wuju_exchange_majia(majia_user_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/majia.php",
data:{majia_user_id:majia_user_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
}

//抢红包
function wuju_get_redbag(post_id,obj){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/get-redbag.php",
data:{post_id:post_id},
success: function(msg){
layer.closeAll('loading');
if(msg==0){
layer.msg('需要关注作者才可以领取红包！');
}else{
mywallet_form=layer.open({
title:false,
type: 1,
fixed: false,
area: ['300px'],
content: msg
});

if($(obj).text()=='打开'){
if($('.wuju-get-redbag-my-credit').text()=='红包被领完了'){
$(obj).addClass('had').removeClass('open').text('红包被领完');
}else{
$(obj).addClass('had').removeClass('open').text('红包已打开');
}
}

}

}
});
}

//任务表单
function wuju_task_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/task.php",
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'做任务',
type: 1,
fixed: false,
skin:'wuju-pop-task-form',
offset: '50px',
area: ['700px'],
resize:false,
content: msg
});
}
});
}

//领取任务奖励
function wuju_task_finish(task_id,type,obj){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/task.php",
data:{task_id:task_id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).addClass('had').removeClass('on').text('已领取');
number_obj=$('.wuju-task-form-header .header .number n');
number=parseInt(number_obj.text());
number_obj.text(number+1);
}

}
});
}

//打开宝箱任务表单
function wuju_task_treasure_form(task_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/task-treasure.php",
data:{task_id:task_id},
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:false,
type: 1,
fixed: false,
area: ['300px','auto'],
skin:'wuju-pop-task-form',
resize:false,
content: msg
});
}
});
}
//打开宝箱任务
function wuju_task_treasure(task_id,obj){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/task-treasure.php",
data:{task_id:task_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).addClass('had').text('已领取');
}
}
});
}

//转移板块表单
function wuju_change_bbs_form(post_id,bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/change-bbs.php",
data:{post_id:post_id,bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'转移板块',
type: 1,
fixed: false,
skin:'wuju-change-bbs-form',
offset: '50px',
area: ['300px'],
resize:false,
content: msg
});
}
});
}

//转移板块
function wuju_change_bbs(post_id,bbs_id){
new_bbs_id='';
$('.wuju-change-bbs-content li input:checkbox:checked').each(function (index, item) {
new_bbs_id+=$(this).val()+',';
});

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/change-bbs.php",
data:{post_id:post_id,bbs_id:bbs_id,new_bbs_id:new_bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
function c(){window.location.reload();}setTimeout(c,2000);
}
});
}


//弹出通知表单
function wuju_system_notice_form(obj){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/system-notice.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'通知消息',
type: 1,
fixed: false,
skin:'wuju-system-notice-form',
// offset: '50px',
area: ['400px','550px'],
resize:false,
content: msg
});
$(obj).children('.tips').remove();
}
});
}

//加载更多消息通知
function wuju_system_notice_more(obj){
page=parseInt($(obj).attr('data'));
$(obj).before(wuju.loading_post);
$(obj).hide();
$.ajax({
type: "POST",
url:wuju.mobile_ajax_url+"/post/system-notice.php",
data:{page:page},
success: function(msg){
$('.wuju-load-post').remove();

if(msg!='0'){
$(obj).before(msg);
page=page+1;
$(obj).attr('data',page);
$(obj).show();	
}else{
layer.msg('没有更多通知！');
$(obj).remove();
}
}
});
}

//更换语言
function wuju_change_language(obj,type){
$(obj).addClass('on').siblings().removeClass('on');
SetCookie('lang',type);
window.location.reload();
}


//申请版主表单
function wuju_apply_bbs_admin_form(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/apply-bbs-admin.php",
data:{bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'申请',
type: 1,
skin:'wuju-apply-bbs-admin-form',
area: ['300px','300px'],
resize:false,
content: msg
});

layui.use('form', function(){
var form = layui.form;
form.render();
});

}
});
}


//申请版主
function wuju_apply_bbs_admin(bbs_id){
type=$('#wuju-apply-bbs-admin-type').val();
reason=$('#wuju-apply-bbs-admin-reason').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/apply-bbs-admin.php",
data:{bbs_id:bbs_id,type:type,reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
}


//申请论坛表单
function wuju_apply_bbs_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/apply-bbs.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'申请',
type: 1,
skin:'wuju-apply-bbs-form',
area: ['300px','300px'],
resize:false,
content: msg
});
}
});
}

//申请论坛
function wuju_apply_bbs(){
title=$('#wuju-apply-bbs-title').val();
reason=$('#wuju-apply-bbs-reason').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/apply-bbs.php",
data:{title:title,reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
}


//付费访问论坛
function wuju_bbs_visit_pay(bbs_id){
layer.confirm('你确定要支付吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/bbs-visit-pay.php",
data:{bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==3){
function c(){wuju_recharge_credit_form();}
setTimeout(c,1500);
}
}
});
});
}


//生成二维码
function wuju_qrcode(dom,width,height,link){
$('#'+dom).qrcode({
width:width,
height:height,
text:link
});
}


//订单确定表单
function wuju_goods_order_confirmation_form(post_id){
var number=$('#wuju-goods-number').val();
var select_arr={};
var i=0;
$(".wuju-goods-single-header .right .select li").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('span').text();
select_arr[i]['value']=$(this).children('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.wuju-goods-single-header .right .select-price').length>0){//存在价格套餐
length=$('.wuju-goods-single-header .right .select li').length;
select_arr[length]={};
select_arr[length]['name']=$('.wuju-goods-single-header .right .select-price li span').text();
select_arr[length]['value']=$('.wuju-goods-single-header .right .select-price li n.on').text();
select_price=$('.wuju-goods-single-header .right .select-price li n.on').index();//价格套餐选择的位置
}

select_arr=JSON.stringify(select_arr);
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/order-confirmation.php",
data:{select_arr:select_arr,post_id:post_id,number:number,select_price:select_price},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'订单确定',
type: 1,
fixed: false,
offset: '100px',
skin:'wuju-goods-order-confirmation-form',
area: ['500px','auto'],
resize:false,
content: msg
});
}
});
}


//提交购买商品
function wuju_goods_buy(post_id){
var number=$('#wuju-goods-number').val();
var address=$('.wuju-goods-order-confirmation-content .address li input:radio:checked').val();
var marks=$('.wuju-goods-order-confirmation-content .marks textarea').val();

var pay_type='creditpay';
if($('.wuju-credit-recharge-type').length>0){
if($('.wuju-credit-recharge-type li.on').length==0){
layer.msg('请选择支付方式！');
return false;
}
pay_type=$('.wuju-credit-recharge-type li.on').attr('data');
}


//下单信息
if($('.wuju-goods-order-confirmation-content .pass-info').length>0){
var info_arr={};
var a=0;
var b='';
$(".wuju-goods-order-confirmation-content .pass-info .list li").each(function(){
info_arr[a]={};
info_arr[a]['name']=$(this).children('span').text();
info_arr[a]['value']=$(this).children('input').val();
b+=$(this).children('input').val();
a++;
});
info_arr=JSON.stringify(info_arr);
}else{
info_arr='';	
}

if(b==''){
layer.msg('下单信息不能为空！');
return false;	
}


var select_arr={};
var i=0;
$(".wuju-goods-single-header .right .select li").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('span').text();
select_arr[i]['value']=$(this).children('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.wuju-goods-single-header .right .select-price').length>0){//存在价格套餐
length=$('.wuju-goods-single-header .right .select li').length;
select_arr[length]={};
select_arr[length]['name']=$('.wuju-goods-single-header .right .select-price li span').text();
select_arr[length]['value']=$('.wuju-goods-single-header .right .select-price li n.on').text();
select_price=$('.wuju-goods-single-header .right .select-price li n.on').index();//价格套餐选择的位置
}

select_arr=JSON.stringify(select_arr);
trade_no=$('#wuju-goods-trade-no').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/goods-buy.php",
data:{info_arr:info_arr,select_arr:select_arr,post_id:post_id,number:number,address:address,marks:marks,select_price:select_price,pay_type:pay_type,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);
function c(){layer.closeAll();wuju_goods_order_form();}setTimeout(c,2000);
}else if(msg.code==2){//充值页面
layer.msg(msg.msg);
function c(){layer.closeAll();wuju_recharge_credit_form();}setTimeout(c,1500);
}else if(msg.code==3){//人民币付款
wuju_goods_order_pay(pay_type,trade_no);//发起订单支付
}else if(msg.code==5){//我的订单
layer.closeAll();
layer.msg(msg.msg);
function c(){layer.closeAll();wuju_goods_order_form();}setTimeout(c,1800);
}else{//其他失败情况
layer.msg(msg.msg);
}

}
});

}

//商品订单支付
function wuju_goods_order_pay(pay_type,trade_no){
if(pay_type=='alipay'){
window.location.href=wuju.theme_url+'/extend/alipay/alipay.php?trade_no='+trade_no;
}else if(pay_type=='qrcode'||pay_type=='wechat'||pay_type=='xunhu-wechat'){
ajax_type='POST';
pay_tips='<p><i class="wuju-icon wuju-weixinzhifu"></i> 微信扫码支付</p>';
if(pay_type=='qrcode'){
ajax_type='GET';
pay_tips='<p style="color: #00a7ff;"><i class="wuju-icon wuju-zhifubaozhifu" style="color: #00a7ff;font-size: 24px;vertical-align: -3px;"></i> 支付宝扫码支付</p>';
pay_url=wuju.theme_url+'/extend/alipay/qrcode.php';
}else if(pay_type=='wechat'){
pay_url=wuju.wuju_ajax_url+"/stencil/wechatpay-code.php";
}else if(pay_type=='xunhu-wechat'){
pay_url=wuju.wuju_ajax_url+"/stencil/wechatpay-xunhu-code.php";
}
	

//生成二维码
layer.load(1);
$.ajax({   
url:pay_url,
type:ajax_type,   
data:{trade_no:trade_no},
success:function(msg){   
layer.closeAll('loading');
if(pay_type=='xunhu-wechat'){
pay_code='<img style="width:200px;height:200px;" src="'+msg+'">';
}else{
pay_code='<div id="wuju-qrcode"></div>';
}

layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'wuju-wechatpay-code-form',
content: '<div class="wuju-wechatpay-code-content">'+pay_code+pay_tips+'</div>',
cancel: function(index,layero){ 
$('#wuju-goods-trade-no').val(new Date().getTime());
wuju_check_goods_order_ajax.abort();//取消长轮询
},
success:function(){
if(pay_type!='xunhu-wechat'){
wuju_qrcode('wuju-qrcode',200,200,msg);
}
wuju_check_goods_order(trade_no);//发起长轮询
}
});


}   
});


}
}


//检查订单状态
function wuju_check_goods_order(trade_no){
wuju_check_goods_order_ajax=$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/check-trade-goods.php",
data:{trade_no:trade_no},
success: function(msg){
if(msg.code==0){
wuju_check_goods_order(trade_no);
}else if(msg.code==1){
$('.wuju-wechatpay-code-content').html(msg.msg);
function c(){window.location.reload();}setTimeout(c,2000);
}else{
wuju_check_goods_order(trade_no);	
}
}
});	
}


//我的订单表单
function wuju_goods_order_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/goods-order.php",
success: function(msg){
layer.closeAll('loading');

layer.open({
type:1,
title:'我的订单',
resize:false,
fixed: false,
area: ['700px', '580px'], 
skin: 'wuju-goods-order-form',
content: msg
});

}
});

}


//提交订单之后再次进行支付的确定表单
function wuju_goods_order_confirmation_buy_form(trade_no,type){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/order-confirmation-buy.php",
data:{trade_no:trade_no,type:type},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'订单支付',
type: 1,
fixed: false,
offset: '100px',
skin:'wuju-goods-order-confirmation-form',
area: ['500px','auto'],
resize:false,
content: msg
});
}
});
}


//删除商品订单
function wuju_goods_order_delete(trade_no,obj){
layer.confirm('你确定要删除吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/goods-order-delete.php",
data: {trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
$(obj).parents('li').fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function() {
$(this).remove();
});
});
}
});
});
}


//商品评价表单
function wuju_goods_order_comment_form(post_id,trade_no){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/stencil/goods-order-comment.php",
data:{post_id:post_id,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'订单评价',
type: 1,
fixed: false,
skin:'wuju-goods-order-comment-form',
area: ['500px','auto'],
resize:false,
content: msg
});

layui.use(['rate'], function(){
var rate = layui.rate;
rate.render({
elem: '#wuju-goods-order-comment-star',
value:5
})
});

}
});
}

//商品评价
function wuju_goods_order_comment(post_id,trade_no){
star=$('.wuju-goods-order-comment-content .layui-icon-rate-solid').length;
content=$('#wuju-goods-order-comment-val').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/goods-order-comment.php",
data: {star:star,content:content,post_id:post_id,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.closeAll();wuju_goods_order_form();}setTimeout(c,2000);
}

}
});
}


//点击广告
function wuju_click_ad(){
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/click-ad.php",
});	
}


//评论置顶
function wuju_up_comment(comment_id,bbs_id,obj){
title=$(obj).text();
layer.confirm('你确定要'+title+'吗？', {
btnAlign: 'c',
btn: ['确定','取消'] 
}, function(){
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:  wuju.wuju_ajax_url+"/action/up-comment.php",
data: {comment_id:comment_id,bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);  
$(obj).text(msg.name);

if(!bbs_id){//动态类
$(obj).parents('.wuju-post-comment-list').find('.up-comment').remove();	
if(msg.code==1){//成功
$(obj).parents('li').find('.wuju-comment-info-footer').prepend('<span class="up-comment">'+title+'</span>');
$(obj).parents('.wuju-post-comment-list').prepend($(obj).parents('li'));
$(obj).parents('li').siblings().find('.comment-up').text(title);
}
}else{//帖子
$(obj).parents('.wuju-bbs-comment-list').find('.up-comment').remove();	
if(msg.code==1){//成功
$(obj).parents('.wuju-bbs-single-box').children('.right').prepend('<span class="up-comment">'+title+'</span>');
$(obj).parents('.wuju-bbs-comment-list').prepend($(obj).parents('.wuju-bbs-single-box'));
$(obj).parents('.wuju-bbs-single-box').siblings().find('.comment-up').text(title);
}
}


}
});
}); 
}




//设置cookie
function SetCookie(name,value){
var Days = 30*12*10;//十年
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//获取cookie
function GetCookie(name){
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg)){
return unescape(arr[2]);
}else{
return null;
}
}

//删除cookie
function DelCookie(name){
var exp = new Date();
exp.setTime(exp.getTime() - 1);
var cval=GetCookie(name);
if(cval!=null){
document.cookie= name + "="+cval+";expires="+exp.toGMTString();
} 
}


//测试提示
function wuju_test(){
layer.msg('该功能开发中，即将开启。');
}



$(".xgplayer-start").click(function(){
title=$(this).parents('.wuju-post-video').next('h2').text();
return title;
});