//登录
function wuju_login(ticket,randstr){
username=$('#wuju-pop-username').val();
password=$('#wuju-pop-password').val();
if(username==''||password==''){
layer.open({content:'帐号或者密码不能为空！',skin:'msg',time:2});
return false;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/login.php",
data: {username:username,password:password,ticket:ticket,randstr:randstr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function d(){window.location.reload();}setTimeout(d,2000);
}
}
});
}

//退出登录
function wuju_login_out(){
layer.open({
content: '你确定要退出本帐号吗？'
,btn: ['确定', '取消']
,yes: function(index){
layer.open({content:'已退出，欢迎下次回来！',skin:'msg',time:2});
function d(){window.location.reload();}setTimeout(d,2000);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/update/profile.php",
data: {login_out:1},
});
}
});
}


//完善用户名
function wuju_perfect(){
username=$('#username').val();
if(username==''){
layer.open({content:'请输入用户名！',skin:'msg',time:2});
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/perfect.php",
data: {username:username},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function a(){window.location.reload();}setTimeout(a,2000);  
}
}
});

}


//获取验证码（手机注册、邮箱注册、修改手机号、修改邮箱）
function wuju_get_code(t,type,ticket,randstr){
if(type=='phone'){
phone=$('.wuju-reg-phone .phone input').val();
if(phone==''){layer.open({content:'手机号不能为空！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/get-code.php",
data: {phone:phone,type:'reg-phone',ticket:ticket,randstr:randstr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){//成功
$('.wuju-get-code-'+type).attr("disabled",true); 
for(i=1;i<=t;i++) {
window.setTimeout("wuju_reg_update_time('"+type+"',"+i+","+t+")",i*1000);
}    
}
}
}); 
}else if(type=='mail'){
mail=$('.wuju-reg-mail .mail input').val();
if(mail==''){layer.open({content:'邮箱不能为空！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/get-code.php",
data: {mail:mail,type:'reg-mail',ticket:ticket,randstr:randstr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){//成功
$('.wuju-get-code-'+type).attr("disabled",true); 
for(i=1;i<=t;i++) {
window.setTimeout("wuju_reg_update_time('"+type+"',"+i+","+t+")",i*1000);
}    
}
}
}); 	
}else if(type=='pass-mail'){
user_id=$('#wuju-pop-password-id').val();
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/get-code.php",
data: {user_id:user_id,type:'pass-mail',ticket:ticket,randstr:randstr},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){//成功
layer.msg(msg.msg);  
$('.wuju-get-code').attr("disabled",true); 
for(i=1;i<=t;i++) {
window.setTimeout("wuju_reg_update_time('"+type+"',"+i+","+t+")",i*1000);
}    
}else{
layer.msg(msg.msg); //失败
}
}
}); 	
}else if(type=='pass-phone'){
user_id=$('#wuju-pop-password-id').val();
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/get-code.php",
data: {user_id:user_id,type:'pass-phone',ticket:ticket,randstr:randstr},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){//成功
layer.msg(msg.msg);  
$('.wuju-get-code').attr("disabled",true); 
for(i=1;i<=t;i++) {
window.setTimeout("wuju_reg_update_time('"+type+"',"+i+","+t+")",i*1000);
}    
}else{
layer.msg(msg.msg); //失败
}
}
}); 	
}
}

//更新获取验证码的倒计时
function wuju_reg_update_time(type,num,t){
if(num == t) {
$('.wuju-get-code-'+type).val('获取验证码');
$('.wuju-get-code-'+type).attr("disabled",false); 
$('.wuju-get-code-'+type).removeClass('no');
}else {
printnr = t-num;
$('.wuju-get-code-'+type).val('('+ printnr +')重新获取');
$('.wuju-get-code-'+type).addClass('no');
}
}



//提交手机号注册
function wuju_pop_reg_phone(ticket,randstr){
username=$('.wuju-reg-phone .name input').val();
phone=$('.wuju-reg-phone .phone input').val();
password=$('.wuju-reg-phone .pass input').val();
code=$('.wuju-reg-phone .code input').val();
if(username==''){layer.open({content:'用户名不能为空！',skin:'msg',time:2});return false;}
if(phone==''){layer.open({content:'手机号不能为空！',skin:'msg',time:2});return false;}
if(password==''){layer.open({content:'密码不能为空！',skin:'msg',time:2});return false;}
if(!$('.wuju-reg-phone .wuju-reg-doc input').is(':checked')){layer.open({content:'请仔细阅读并勾选用户注册条款！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/reg.php",
data: {username:username,phone:phone,password:password,code:code,type:'phone',ticket:ticket,randstr:randstr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function a(){window.location.reload();}setTimeout(a,2000);  
}
}
}); 
}

//提交邮箱注册
function wuju_pop_reg_mail(ticket,randstr){
username=$('.wuju-reg-mail .name input').val();
mail=$('.wuju-reg-mail .mail input').val();
password=$('.wuju-reg-mail .pass input').val();
code=$('.wuju-reg-mail .code input').val();
if(username==''){layer.open({content:'用户名不能为空！',skin:'msg',time:2});return false;}
if(mail==''){layer.open({content:'邮箱不能为空！',skin:'msg',time:2});return false;}
if(code==''){layer.open({content:'验证码不能为空！',skin:'msg',time:2});return false;}
if(password==''){layer.open({content:'密码不能为空！',skin:'msg',time:2});return false;}
if(!$('.wuju-reg-mail .wuju-reg-doc input').is(':checked')){layer.open({content:'请仔细阅读并勾选用户注册条款！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/reg.php",
data: {username:username,mail:mail,password:password,code:code,type:'mail',ticket:ticket,randstr:randstr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function a(){window.location.reload();}setTimeout(a,2000); 
}
}
}); 
}

//提交邀请码注册
function wuju_pop_reg_invite(ticket,randstr){
username=$('.wuju-reg-invite .name input').val();
password=$('.wuju-reg-invite .pass input').val();
code=$('.wuju-reg-invite .code input').val();
if(username==''){layer.open({content:'用户名不能为空！',skin:'msg',time:2});return false;}
if(code==''){layer.open({content:'邀请码不能为空！',skin:'msg',time:2});return false;}
if(password==''){layer.open({content:'密码不能为空！',skin:'msg',time:2});return false;}
if(!$('.wuju-reg-invite .wuju-reg-doc input').is(':checked')){layer.open({content:'请仔细阅读并勾选用户注册条款！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType: 'json',
url:wuju.wuju_ajax_url+"/action/reg.php",
data: {username:username,code:code,password:password,type:'reg-invite',ticket:ticket,randstr:randstr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){//注册成功
function a(){window.location.reload();}setTimeout(a,2000); 
}
}
});

}


//解绑QQ登录
function wuju_social_login_off(type,author_id,obj){
if(type=='qq'){
title='你确定要解除QQ登录吗？';	
}else if(type=='weibo'){
title='你确定要解除微博登录吗？';	
}else if(type=='wechat'){
title='你确定要解除微信登录吗？';	
}
layer.open({
content: title
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/action/social-login-off.php",
data: {type:type,author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).children('.title').html('已经解绑QQ登录');
$(obj).children('.a').remove();
}
}
});  
}  
});
}


//修改手机号
function wuju_update_phone(user_id){
phone=$('#wuju-mobile-update-phone').val();
code=$('#wuju-mobile-update-code').val();
if(phone==''){layer.open({content:'请输入手机号！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/update/phone.php",
data: {user_id:user_id,phone:phone,code:code},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,2000);
$('.wuju-setting-box .phone .value').html(phone);
}
}
});
}

//修改邮箱号
function wuju_update_email(user_id){
email=$('#wuju-mobile-update-email').val();
code=$('#wuju-mobile-update-code').val();
if(email==''){layer.open({content:'请输入邮箱号！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/update/mail.php",
data: {user_id:user_id,mail:email,code:code},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,2000);
$('.wuju-setting-box .email .value').html(email);
}
}
});
}

//修改密码
function wuju_update_password(user_id){
var password_1= $.trim($('#wuju-mobile-update-password-a').val());
var password_2= $.trim($('#wuju-mobile-update-password-b').val());
if(password_1==''||password_2==''){layer.open({content:'请输入要修改的密码！',skin:'msg',time:2});return false;}
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/update/password.php",
data: {pass1:password_1,pass2:password_2,user_id:user_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,2000); 
}
}

});     
}

//修改安全问题
function wuju_update_question(user_id){
var question= $.trim($('#wuju-mobile-update-question').val());
var answer= $.trim($('#wuju-mobile-update-answer').val());
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:wuju.wuju_ajax_url+"/update/question.php",
data: {question:question,answer:answer,user_id:user_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,2000); 
}
}

});     
}