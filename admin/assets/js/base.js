// 后台面板
jQuery(document).ready(function($) {


var patterns={validate:/^(?!_nonce)[a-zA-Z0-9_-]*(?:\[(?:\d*|(?!_nonce)[a-zA-Z0-9_-]+)\])*$/i,key:/[a-zA-Z0-9_-]+|(?=\[\])/g,named:/^[a-zA-Z0-9_-]+$/,push:/^$/,fixed:/^\d+$/};function FormSerializer(helper,$form){var data={},pushes={};function build(base,key,value){base[key]=value;return base;}
function makeObject(root,value){var keys=root.match(patterns.key),k;while((k=keys.pop())!==undefined){if(patterns.push.test(k)){var idx=incrementPush(root.replace(/\[\]$/,''));value=build([],idx,value);}
else if(patterns.fixed.test(k)){value=build([],k,value);}
else if(patterns.named.test(k)){value=build({},k,value);}}
return value;}
function incrementPush(key){if(pushes[key]===undefined){pushes[key]=0;}
return pushes[key]++;}
function addPair(pair){if(!patterns.validate.test(pair.name))return this;var obj=makeObject(pair.name,pair.value);data=helper.extend(true,data,obj);return this;}
function addPairs(pairs){if(!helper.isArray(pairs)){throw new Error("formSerializer.addPairs expects an Array");}
for(var i=0,len=pairs.length;i<len;i++){this.addPair(pairs[i]);}
return this;}
function serialize(){return data;}
function serializeJSON(){return JSON.stringify(serialize());}
this.addPair=addPair;this.addPairs=addPairs;this.serialize=serialize;this.serializeJSON=serializeJSON;}
FormSerializer.patterns=patterns;FormSerializer.serializeObject=function serializeObject(){return new FormSerializer($,this).addPairs(this.serializeArray()).serialize();};FormSerializer.serializeJSON=function serializeJSON(){return new FormSerializer($,this).addPairs(this.serializeArray()).serializeJSON();};if(typeof $.fn!=="undefined"){$.fn.serializeObjectLightSNS=FormSerializer.serializeObject;$.fn.serializeJSONLightSNS=FormSerializer.serializeJSON;}



//切换WordPress面板
$(".wuju-panel-header-left").click(function() {
if ($("#adminmenumain").css('display')=='block') {
$("#wpcontent").css("margin-left", "0px");
$("#adminmenumain").hide(0);
$(".wuju-admin-logo").removeClass('had_show')
} else {
$("#adminmenumain").show(0);
$("#wpcontent").css("margin-left", "160px");
$(".wuju-admin-logo").addClass('had_show')
}
});


//折叠菜单
$(".wuju-show-menu").click(function() {
if ($(".wuju-panel-nav").css('width')=='180px') {
$(this).children('i').addClass('fa-expand').removeClass('fa-compress');
$(".wuju-panel-nav").css("width", "48px").addClass('on');
$(".wuju-panel-content").css("margin-left", "48px");
$(".wuju-panel-nav ul li a span").hide();
$('.wuju-panel-nav ul li .wuju-panel-arrow:after').css('right','2px');

$('.wuju-panel-nav.on ul li').hover(function() {
if($('.wuju-panel-nav').hasClass('on')){
layer.tips($(this).find('span').html(), $(this));
}
}, function() {
layer.closeAll('tips');
});

} else {
$(this).children('i').addClass('fa-compress').removeClass('fa-expand');
$(".wuju-panel-nav ul li a span").show();
$(".wuju-panel-content").css("margin-left", "180px");
$('.wuju-panel-nav ul li .wuju-panel-arrow:after').css('right','10px');
$(".wuju-panel-nav").css("width", "180px").removeClass('on');

$('.wuju-panel-nav.on ul li').hover(function() {
}, function() {
});

}
});

//切换肤色
$('[name="wuju_options[wuju_panel_skin]"]').click(function(){
skin=$(this).val();
if(skin=='dark'){
$('.wuju-panel').addClass('wuju-panel-theme-dark').removeClass('wuju-panel-theme-light');
}else{
$('.wuju-panel').addClass('wuju-panel-theme-light').removeClass('wuju-panel-theme-dark');
}
});

//监听面板
$("input[name='wuju_options[wuju_panel_name]']").bind("input propertychange",function(event){
$('.wuju-panel-header-inner h1').html($(this).val());
});

//获取最新版本提示
layui.use(['layer'], function() {
$("#wuju-get-update-info").click(function() {
layer.load(1);
url=wuju.update_url+"/update.php?callback=?&url=123";
jQuery.getJSON(url,function(data) {
layer.closeAll('loading');
layer.alert(data.version)
})
});
});



//设置页回车搜索
$(".wuju-panel-search input").keypress(function(e) {  
if(e.which == 13) {  
return false;
}  
}); 

//layui模块引入
layui.use('element',function(){
var element=layui.element
})

//用户列表筛选
wuju_user_type_el=$('[name="wuju_user_type"]');
wuju_user_type_el.change(function(){
wuju_user_type_el.val(jQuery(this).val());
});

});//ready




// =================================函数开始



//退出登录
function wuju_login_out(){
layer.confirm('你确定要退出本帐号吗？',{
title:'退出登录',
btnAlign: 'c',
btn: ['确定','按错了'] 
}, function(){
layer.msg('已退出，欢迎再次回来！');
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/update/profile.php",
data: {login_out:1},
success: function(msg){}
});
function d(){window.location.href='/';}setTimeout(d,2500);
});
}


//导入备份
function wuju_admin_backup_export(){
backup=$('#wuju-admin-backup-export-val').val();
if(backup=='delete'){
title='你要确定要清空所有的设置选项吗？清空之后将恢复默认设置！';
}else{
title='你确定要导入备份设置吗？你之前的设置选项会被覆盖！';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type:"POST",
url: wuju.wuju_ajax_url+"/admin/action/admin-setting.php",
data:{backup:backup},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
});
}

//metabox导出备份
function wuju_amdin_backup_metabox(){
post_id=wuju_getUrlParam('post');
if(!post_id){
alert('请新建页面之后再进行导出数据操作！');
return false;
}
type=$('.components-select-control__input').val();
window.open(wuju.theme_url+"/module/admin/action/admin-setting-metabox-back.php?download&post_id="+post_id+"&type="+type);
}


//metabox导入备份
function wuju_amdin_backup_metabox_import(){
post_id=wuju_getUrlParam('post');
if(!post_id){
alert('请新建页面之后再进行导入数据操作！');
return false;
}
type=$('.components-select-control__input').val();
backup=$('#wuju-admin-backup-metabox-val').val();
if(backup=='delete'){
title='你要确定要清空所有的设置选项吗？清空之后将恢复默认设置！';
}else{
title='你确定要导入备份设置吗？你之前的设置选项会被覆盖！';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type:"POST",
url: wuju.wuju_ajax_url+"/admin/action/admin-setting-metabox-back.php",
data:{backup:backup,post_id:post_id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
});
}


//保存设置
function wuju_admin_save_setting(tips){
data=$('#wuju-panel-form').serializeJSONLightSNS();
time=$('#wuju-setting-time').attr('data');
layer.load(1);
$.ajax({
type:"POST",
url: wuju.wuju_ajax_url+"/admin/action/admin-save.php",
data:{data:data,time:time},
success: function(msg){
layer.closeAll('loading');
if(tips){
layer.msg(msg.msg);
}
if(msg.code==1){
$('#wuju-setting-time').attr('data',msg.time);
}
}
});
}


//弹出卡密表单
function wuju_admin_key_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/key.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'卡密管理',
type: 1,
area: ['700px', '520px'], 
content: msg
});
}
});	
}

//弹出卡密生成的表单
function wuju_admin_key_add_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/key-add.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'卡密生成',
type: 1,
area: ['540px', '500px'], 
content: msg
});
layui.use(['form','laydate'], function () {
var form = layui.form;
var laydate = layui.laydate;
form.render('radio');
form.on('radio(add-key)', function(data){
$('#wuju-add-key-form li.number i').html($(data.elem).attr('data'));
}); 
laydate.render({elem:'#wuju-key-expiry',type:'date'});
});
}
});		
}

//生成卡密
function wuju_admin_key_add(){
data=$('#wuju-add-key-form').serialize();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/key-add.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
layer.close(admin_key_add_form);
}
}
});		
}


//弹出卡密查询表单
function wuju_admin_key_search_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/key-search.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_search_form=layer.open({
title:'卡密查询',
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

//卡密查询
function wuju_admin_key_search(){
key=$('#wuju-pop-key-search').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/key-search.php",
data:{key:key},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.close(admin_key_search_form);
layer.open({
title:'查询结果',
type: 1,
content:msg.msg
});
}else{
layer.msg(msg.msg);	
}
}
});		
}


//弹出导出卡密的表单
function wuju_admin_key_export_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/key-export.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'卡密导出',
type: 1,
area: ['640px', '400px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');

form.on('radio(wuju-custom-key-number)', function(data){
if(data.value=='custom'){
$('#wuju-custom-key-number').show();
}else{
$('#wuju-custom-key-number').hide();	
}
}); 

});
}
});		
}

//提交导出表单
function wuju_admin_key_export(){
$('#wuju-export-key-form').submit();	
}


//弹出删除卡密的表单
function wuju_admin_key_delete_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/key-delete.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'卡密删除',
type: 1,
area: ['630px', '320px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');
});
}
});		
}

//删除卡密
function wuju_admin_key_delete(){
data=$('#wuju-delete-key-form').serialize();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/key-delete.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});		
}


//弹出批量注册表单
function wuju_multiple_reg_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/multiple-reg.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'批量注册',
type: 1,
area: ['700px', 'auto'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('checkbox');
});
}
});	
}


//提交批量注册
function wuju_multiple_reg(){
username=$('.wuju-multiple-reg-username').val();	
password=$('.wuju-multiple-reg-password').val();
city=$('.wuju-multiple-city:checkbox:checked').val();	
sex=$('.wuju-multiple-sex:checkbox:checked').val();	
if(username==''){
layer.msg('请输入用户名！');
return false;	
}
$('.wuju-multiple-reg-form .btn').html('<i class="fa fa-superpowers fa-spin"></i> 批量注册中...');
layer.load(1);
$.ajax({
type: "POST",
data:{username:username,password:password,city:city,sex:sex},
url:wuju.wuju_ajax_url+"/admin/action/multiple-reg.php",
success: function(msg){
layer.closeAll('loading');
$('.wuju-multiple-reg-form .btn').html('<i class="fa fa-superpowers"></i> 开始注册');
if(msg.code==1){
$('.wuju-multiple-reg-form .username .show').html(msg.content);	
$('.wuju-multiple-userdata').val(msg.user_data);
$('.wuju-multiple-reg-form .lable p span').show();
}else{
layer.msg(msg.msg);	
}
}
});	
}

//显示已经注册成功的用户id
function wuju_multiple_userdata_form(){
userdata=$('.wuju-multiple-userdata').val();
layer.prompt({title: '已经注册成功的用户id集合',formType: 2,btnAlign: 'c',value:userdata}); 	
}


//弹出邀请码表单
function wuju_admin_invite_code_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/invite-code.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'邀请码管理',
type: 1,
area: ['700px', '520px'], 
content: msg
});
}
});	
}


//弹出生成邀请码表单
function wuju_admin_invite_code_add_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/invite-code-add.php",
success: function(msg){
layer.closeAll('loading');
window.admin_invite_code_add_form=layer.open({
title:'生成邀请码',
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

//生成邀请码
function wuju_admin_invite_code_add(){
number=$('#wuju-pop-invite-code-number').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/invite-code-add.php",
data:{number:number},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
layer.close(admin_invite_code_add_form);
}
}
});		
}



//弹出邀请码查询表单
function wuju_admin_invite_code_search_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/invite-code-search.php",
success: function(msg){
layer.closeAll('loading');
window.admin_invite_code_search_form=layer.open({
title:'邀请码查询',
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

//邀请码查询
function wuju_admin_invite_code_search(){
code=$('#wuju-pop-invite-code').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/invite-code-search.php",
data:{code:code},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.close(admin_invite_code_search_form);
layer.open({
type: 1,
title:'查询结果',
content:msg.msg
});
}else{
layer.msg(msg.msg);	
}
}
});		
}


//弹出导出邀请码的表单
function wuju_admin_invite_code_export_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/invite-code-export.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'邀请码导出',
type: 1,
area: ['440px', '212px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');
});
}
});		
}


//提交导出邀请码表单
function wuju_admin_invite_code_export(){
$('#wuju-export-invite-code-form').submit();	
}


//弹出删除邀请码的表单
function wuju_admin_invite_code_delete_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/invite-code-delete.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'邀请码删除',
type: 1,
area: ['440px', '176px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');
});
}
});		
}

//删除邀请码
function wuju_admin_invite_code_delete(){
data=$('#wuju-delete-invite-code-form').serialize();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/invite-code-delete.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});		
}




//弹出批量导入视频表单
function wuju_multiple_import_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/multiple-import.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'批量导入视频',
type: 1,
area: ['700px', 'auto'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('checkbox');
});
}
});	
}


//提交批量注册
function wuju_multiple_import(){
ids=$('.wuju-multiple-import-ids').val();	
content=$('.wuju-multiple-import-content').val();
if(ids==''||content==''){
layer.msg('请输入信息！');
return false;	
}
$('.wuju-multiple-import-form .btn').html('<i class="fa fa-superpowers fa-spin"></i> 导入中...');
layer.load(1);
$.ajax({
type: "POST",
data:{ids:ids,content:content},
url:wuju.wuju_ajax_url+"/admin/action/multiple-import.php",
success: function(msg){
layer.closeAll('loading');
$('.wuju-multiple-import-form .btn').html('<i class="fa fa-superpowers"></i> 开始导入<span></span>');
layer.msg(msg.msg);	
if(msg.code==1){
$('.wuju-multiple-import-content').val('');
}
}
});	
}


//弹出充值记录表单
function wuju_admin_recharge_form(type){
if(type=='money'){
url=wuju.wuju_ajax_url+"/admin/stencil/recharge-money.php";
title=wuju.money_name+'充值记录';
}else{
url=wuju.wuju_ajax_url+"/admin/stencil/recharge.php";
title=wuju.credit_name+'充值记录';
}

layer.load(1);
$.ajax({
type: "POST",
url:url,
success: function(msg){
layer.closeAll('loading');
layer.open({
title:title,
type: 1,
area: ['700px', '520px'], 
content: msg
});
}
});	
}


//弹出查看聊天记录表单
function wuju_admin_chat_note_form(){
layer.confirm('选择你要查看的聊天记录类型',{
btn: ['单聊记录','群聊记录'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/chat-note-one.php",
success: function(msg){
layer.closeAll();
layer.open({
title:'单聊记录',
type: 1,
area: ['850px', '520px'], 
content: msg
});
}
});	
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/chat-note-group.php",
success: function(msg){
layer.closeAll();
layer.open({
title:'群聊记录',
type: 1,
area: ['800px', '520px'], 
content: msg
});
}
});
}
);
}

//删除聊天记录
function wuju_admin_del_chat_note(type,id,obj){
layer.confirm('删除之后将不可恢复，你确定？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/chat-note-delete.php",
data:{type:type,id:id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parents('li').remove();	
}
}
});
});
}

//查看聊天记录详情
function wuju_admin_read_chat_note(type,id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/chat-note-all.php",
data:{type:type,id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'聊天记录详情',
type: 1,
area: ['600px', '500px'], 
content: msg.msg
});
}
});
}



//弹出提现记录表单
function wuju_admin_cash_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/cash.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'全站提现记录',
type: 1,
area: ['900px', '530px'], 
content: msg
});
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

//通过提现
function  wuju_cash_agree(ID,obj){
layer.confirm('你要通过该提现记录吗',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/cash-do.php",
data:{ID:ID,type:'agree'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).siblings('.refuse').remove();
$(obj).parent().prev().text('成功');
$(obj).remove();
}
}
});
});
}

//拒绝提现
function  wuju_cash_refuse(ID,obj){
layer.prompt({title: '请输入拒绝通过的原因', formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/cash-do.php",
data:{ID:ID,type:'refuse',reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).siblings('.agree').remove();
$(obj).parent().prev().text('失败');
$(obj).remove();
layer.close(index);
}
}
});
});
}


//弹出全站通知表单
function wuju_admin_notice_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/notice.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'全站通知',
type: 1,
fixed: false,
area: ['700px', '485px'], 
content: msg
});
}
});	
}

//弹出发表全站通知表单
function wuju_admin_notice_add_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/notice-add.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'全站通知',
type: 1,
fixed: false,
area: ['500px'], 
skin: 'wuju-admin-notice-add-form',
content: msg
});
}
});	
}


//发表全站通知
function wuju_admin_notice_add(){
title=$('#wuju-admin-notice-add-title').val();
content=$('#wuju-admin-notice-add-val').val();
if(content==''||title==''){
layer.msg("通知内容或标题不能为空！");
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/notice-do.php",
data:{content:content,title:title,type:'add'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.closeAll();}setTimeout(c,2000);
}
}
});
}


//弹出编辑全站通知表单
function wuju_admin_notice_edit_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/notice-edit.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'全站通知',
type: 1,
fixed: false,
area: ['500px'], 
skin: 'wuju-admin-notice-add-form',
content: msg
});
}
});	
}

//编辑全站通知
function wuju_admin_notice_edit(id){
title=$('#wuju-admin-notice-add-title').val();
content=$('#wuju-admin-notice-add-val').val();
if(content==''||title==''){
layer.msg("通知内容或标题不能为空！");
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/notice-do.php",
data:{content:content,title:title,type:'edit',id:id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.closeAll();}setTimeout(c,2000);
}
}
});
}

//查看全站通知
function wuju_admin_notice_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/notice-read.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'通知详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
skin: 'wuju-admin-notice-read-form',
content: msg
});
}
});	
}

//删除聊天记录
function wuju_admin_notice_del(id,obj){
layer.confirm('你确定要删除这条通知？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/notice-do.php",
data:{type:'delete',id:id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parents('li').remove();	
}
}
});
});
}


//版主申请表单
function wuju_admin_apply_bbs_admin_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/apply-bbs-admin.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'版主申请',
type: 1,
fixed: false,
area: ['700px','410px'], 
content: msg
});
}
});	
}

//查看版主申请
function wuju_admin_apply_bbs_admin_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/apply-bbs-admin-do.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
window.admin_apply_bbs_admin_read_form=layer.open({
title:'申请详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
content: msg
});
}
});	
}

//版主申请操作
function wuju_admin_apply_bbs_admin_do(type,id,obj){

if(type=='refuse'){//拒绝
layer.prompt({title: '请输入拒绝通过的原因', formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/apply-bbs-admin-do.php",
data:{ID:id,type:type,reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('#wuju-admin-apply-bbs-admin-'+id+' span m').html('已经拒绝').attr('style','');
layer.close(index);
layer.close(admin_apply_bbs_admin_read_form);
}
}
});
});
}else{//删除或通过


if(type=='agree'){
title="通过";
}else{
title="删除";	
}

layer.confirm('你确定要'+title+'吗？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/apply-bbs-admin-do.php",
data:{ID:id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(type=='del'){
$('#wuju-admin-apply-bbs-admin-'+id).remove();
}else if(type=='agree'){
$('#wuju-admin-apply-bbs-admin-'+id+' span m').html('已经通过').attr('style','');
}
layer.close(admin_apply_bbs_admin_read_form);
}
}
});	
});	


}

}


//论坛开通申请表单
function wuju_admin_apply_bbs_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/apply-bbs.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:wuju.bbs_name+'申请开通',
type: 1,
fixed: false,
area: ['700px','410px'], 
content: msg
});
}
});	
}

//查看论坛申请表单
function wuju_admin_apply_bbs_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/apply-bbs-do.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
window.admin_apply_bbs_read_form=layer.open({
title:'申请详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
content: msg
});
}
});	
}

//论坛申请操作
function wuju_admin_apply_bbs_do(type,id,obj){

if(type=='refuse'){//拒绝
layer.prompt({title: '请输入拒绝通过的原因', formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/apply-bbs-do.php",
data:{ID:id,type:type,reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('#wuju-admin-apply-bbs-admin-'+id+' span m').html('已经拒绝').attr('style','');
layer.close(index);
layer.close(admin_apply_bbs_read_form);
}
}
});
});
}else{//删除或通过


if(type=='agree'){
title="通过";
}else{
title="删除";	
}

layer.confirm('你确定要'+title+'吗？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/apply-bbs-do.php",
data:{ID:id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(type=='del'){
$('#wuju-admin-apply-bbs-admin-'+id).remove();
}else if(type=='agree'){
$('#wuju-admin-apply-bbs-admin-'+id+' span m').html('已经通过').attr('style','');
}
layer.close(admin_apply_bbs_read_form);
}
}
});	
});	




}



}

//商城订单
function wuju_admin_shop_order_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/shop-order.php",
success: function(msg){
layer.closeAll('loading');
window.admin_apply_bbs_read_form=layer.open({
title:'订单详情',
type: 1,
fixed: false,
offset: '61px',
area: ['750px','680px'], 
content: msg
});
}
});	
}




//查看订单
function wuju_goods_order_view_form(trade_no){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/order-view.php",
data:{trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
window.goods_order_view_form=layer.open({
title:'订单查看',
type: 1,
fixed: false,
offset: '100px',
skin:'wuju-goods-order-view-form',
area: ['500px','auto'],
resize:false,
content: msg
});
}
});
}

//发货表单
function wuju_goods_order_send_form(trade_no){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/order-send.php",
data:{trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
window.goods_order_send_form=layer.open({
title:'订单发货',
type: 1,
fixed: false,
skin:'wuju-goods-order-send-form',
area: ['500px','auto'],
resize:false,
content: msg
});
}
});
}

//发货
function wuju_goods_order_send(trade_no){
content=$('#wuju-goods-order-send-content').val();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/order-send.php",
data:{content:content,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
function c(){
layer.close(goods_order_send_form);
layer.close(goods_order_view_form);
}setTimeout(c,2000);
}
});
}


//删除聊天记录
function wuju_goods_order_delete(trade_no){
layer.confirm('你确定要删除该订单？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/order-delete.php",
data:{trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
$('.order-'+trade_no).remove();
layer.close(goods_order_view_form);
}
});
});
}



//举报表单
function wuju_admin_report_form(){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/report.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'举报列表',
type: 1,
fixed: false,
area: ['700px','410px'], 
content: msg
});
}
});	
}

//查看举报详情表单
function wuju_admin_report_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/report-read.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
window.admin_report_read_form=layer.open({
title:'举报详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
content: msg
});
}
});	
}

//举报操作
function wuju_admin_report_do(type,id,obj){

if(type=='do'){
title="你确定要标记为处理吗？";
}else{
title="你确定要删除吗？";	
}

layer.confirm(title,{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/action/report-do.php",
data:{ID:id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(type=='del'){
$('#wuju-admin-report-'+id).remove();
}else if(type=='do'){
$('#wuju-admin-report-'+id+' span m').html('已经处理').attr('style','');
}
layer.close(admin_report_read_form);
}
}
});	
});	



}




//导出手机号/邮箱
function wuju_phone_email_export(){
layer.confirm('选择你要导出的用户数据',{
btn: ['手机号','邮箱号'],
btnAlign: 'c',
},
function(){
$('#wuju-export-phone-email-form input').attr('value','phone');
$('#wuju-export-phone-email-form').submit();
layer.closeAll();	
},
function(){
$('#wuju-export-phone-email-form input').attr('value','email');
$('#wuju-export-phone-email-form').submit();
layer.closeAll();
}
);
}


//插入图标表单
function wuju_add_icon_form(obj){
id=$(obj).siblings('input').attr('name');
// $('#'+id).find('.wuju-panel-icon-remove').hide();
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/admin/stencil/add-icon.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
fixed: false,
skin:'wuju-add-icon-form',
area: ['620px','450px'], 
content: msg
});
}
});
}








function wuju_no(){
layer.msg("还没有写好啦！预留接口");	
}


//获取get参数
function wuju_getUrlParam(name){
var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
var r = window.location.search.substr(1).match(reg);
if(r!=null)return  unescape(r[2]); return null;
}


