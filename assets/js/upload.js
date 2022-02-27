//上传类
$(function(){

//上传头像
$('#wuju-upload-avatar').off('click').on('change', function(){
$('.wuju-member-avatar span').css('display','inline-block');
$('.wuju-member-avatar span').html('<i class="fa fa-spinner fa-spin"></i> 上传中...');

$("#wuju-upload-avatar-form").ajaxSubmit({
dataType:'json',
success:function(data){
$('.wuju-member-avatar span').hide();
$('.wuju-member-avatar span').html('点击修改头像');
$('#wuju-upload-avatar').val('');
if(data.code == 1){
$('.wuju-member-avatar img').attr('src',data.file_url);
}else if(data.code == 3){
layer.msg(data.msg);
function c(){wuju_recharge_vip_form();}setTimeout(c,1500);
}else{
layer.msg(data.msg);
}
}, 
error:function(){
$('.wuju-member-avatar span').hide();
$('.wuju-member-avatar span').html('点击修改头像');
$('#wuju-upload-avatar').val('');    
layer.msg('上传失败！'); 
} 
});
});


//上传本地视频
$('body').off('click').on('change','#wuju-upload-video', function(){
var bar = $('.wuju-video-bar');
var percent = $('.wuju-video-percent');
var progress = $(".wuju-video-progress");

//判断后缀
var location=$(this).val();
var point=location.lastIndexOf(".");
type=location.substr(point+1);
if(wuju.upload_video_type.indexOf(type)== -1 ){
layer.msg('不支持该文件类型！');
return false;
}

$("#wuju-upload-video-form").ajaxSubmit({
dataType:'json',
beforeSend: function(data) {
progress.show();
var percentVal = '0%';
bar.width(percentVal);
percent.html(percentVal);
},
uploadProgress: function(event, position, total, percentComplete) {
var percentVal = percentComplete + '%';
bar.width(percentVal);
percent.html(percentVal);
if(percentVal=='100%'){
percent.html('正在处理中...<i class="fa fa-spinner fa-spin"></i>');	
}
},
success:function(msg){
$('.wuju-video-progress').hide();
layer.msg(msg.msg);
percent.children('i').remove();
$('#wuju-upload-video').val('');
if(msg.code==0){
bar.width('0');
}else if(msg.code==1){
$('#wuju-video-url').val(msg.file_url);
}


}, 
error:function(){
percent.children('i').remove();
layer.msg('上传失败！');
bar.width('0');
$('.wuju-video-progress').hide();
$('#wuju-upload-video').val('');
return false;
} 
});
});

//上传本地音乐
$('body').off('click').on('change','#wuju-upload-music', function(){

//判断后缀
var location=$(this).val();
var point=location.lastIndexOf(".");
type=location.substr(point+1);
if(wuju.upload_music_type.indexOf(type)== -1 ){
layer.msg('不支持该文件类型！');
return false;
}

var bar = $('.wuju-music-bar');
var percent = $('.wuju-music-percent');
var progress = $(".wuju-music-progress");

$("#wuju-upload-music-form").ajaxSubmit({
dataType:'json',
beforeSend: function() {
progress.show();
var percentVal = '0%';
bar.width(percentVal);
percent.html(percentVal);
},
uploadProgress: function(event, position, total, percentComplete) {
var percentVal = percentComplete + '%';
bar.width(percentVal);
percent.html(percentVal);
if(percentVal=='100%'){
percent.html('正在处理中...<i class="fa fa-spinner fa-spin"></i>');	
}
},
success:function(msg){
$('.wuju-music-progress').hide();
layer.msg(msg.msg);
percent.children('i').remove();
$('#wuju-upload-music').val('');
if(msg.code==0){
bar.width('0');
}else if(msg.code==1){
$('#wuju-music-url').val(msg.file_url);
}


}, 
error:function(){
percent.children('i').remove();
layer.msg('上传失败！');
bar.width('0');
$('.wuju-music-progress').hide();
$('#wuju-upload-music').val('');
return false;
} 
});
});


//上传背景音乐
$('.wuju-member-right').off('click').on('change','#wuju-upload-user-bg-music', function(){

//判断后缀
var location=$(this).val();
var point=location.lastIndexOf(".");
type=location.substr(point+1);
if(wuju.upload_music_type.indexOf(type)== -1 ){
layer.msg('不支持该文件类型！');
return false;
}

var bar = $('.wuju-bg-music-bar');
var percent = $('.wuju-bg-music-percent');
var progress = $(".wuju-bg-music-progress");

$("#wuju-upload-user-bg-music-form").ajaxSubmit({
beforeSend: function() {
progress.show();
var percentVal = '0%';
bar.width(percentVal);
percent.html(percentVal);
},
uploadProgress: function(event, position, total, percentComplete) {
var percentVal = percentComplete + '%';
bar.width(percentVal);
percent.html(percentVal);
},
success:function(msg){
$('.wuju-bg-music-progress').hide();
layer.msg(msg.msg);

if(msg.code == 0){
bar.width('0');
}else if(msg.code == 1){
$('#wuju-bg-music-url').val(msg.file_url);
$('#wuju-upload-user-bg-music').val('');
}

}, 
error:function(){
layer.msg('上传失败！');
bar.width('0');
$('.wuju-bg-music-progress').hide();
$('#wuju-upload-user-bg-music').val('');
return false;
} 
});
});





//上传本地附件
$('body').off('click').on('change','#wuju-insert-file-input', function(){

//判断后缀
var location=$(this).val();
var point=location.lastIndexOf(".");
type=location.substr(point+1);
if(wuju.upload_file_type.indexOf(type)== -1 ){
layer.msg('不支持该文件类型！');
return false;
}

bar=$('.wuju-file-bar');
percent=$('.wuju-file-percent');
progress=$(".wuju-file-progress");
if(percent.children('i').length==0){

$("#wuju-insert-file-form").ajaxSubmit({
dataType : "json",
timeout: 120000,//120秒退出
beforeSend: function() {
$('#wuju-insert-file').hide();
progress.show();
var percentVal = '0%';
bar.width(percentVal);
percent.html(percentVal);
},
uploadProgress: function(event, position, total, percentComplete) {
var percentVal = percentComplete + '%';
bar.width(percentVal);
percent.html(percentVal+' <i class="fa fa-spinner fa-spin"></i>');
if(percentVal=='100%'){
percent.html('正在处理中...<i class="fa fa-spinner fa-spin"></i>');	
}
},
success:function(data){
$('#wuju-insert-file').show();
$('#wuju-insert-file-input').val('');
if(data.code == 1){
$('#wuju-insert-file-url').val(data.file_url);
$('#wuju-insert-file-name').val(data.name);
percent.html('上传成功！100%').children('i').remove();
}else{
progress.hide();
percent.children('i').remove();
layer.msg(data.msg);
}
}, 
error:function(){
$('#wuju-insert-file-input').val('');
layer.msg('上传失败！服务器配置问题！');
$('#wuju-insert-file').show();
progress.hide();
return false;
} 
});

}
});




//上传
layui.use(['upload'], function(){
var upload = layui.upload;

//文章上传图片
upload.render({
elem: '#wuju-single-upload',
url: wuju.wuju_ajax_url+'/upload/bbs.php',
multiple:true,
accept:'file',
before: function(obj){
$('#wuju-single-upload').html('<i class="fa fa-spin fa-refresh">');
},
done: function(res, index, upload){
if(res.code == 1){
ue_single.focus();
ue_single.execCommand('inserthtml','<img src="'+res.file_url+'">');
}else{
layer.msg(res.msg);	
}
},
allDone: function(obj){
$('#wuju-single-upload').html('<i class="fa fa-picture-o"></i>');
},
error: function(index, upload){
layer.msg('上传失败！');
$('#wuju-single-upload').html('<i class="fa fa-picture-o"></i>');
}
});

//论坛上传图片
upload.render({
elem: '#wuju-bbs-upload',
url: wuju.wuju_ajax_url+'/upload/bbs.php',
multiple:true,
accept:'file',
before: function(obj){
$('#wuju-bbs-upload').html('<i class="fa fa-spin fa-refresh">');
},
done: function(res, index, upload){
if(res.code == 1){
ue.focus();
ue.execCommand('inserthtml','<img src="'+res.file_url+'">');
}else{
layer.msg(res.msg);	
}
},
allDone: function(obj){
$('#wuju-bbs-upload').html('<i class="fa fa-picture-o"></i>');
},
error: function(index, upload){
layer.msg('上传失败！');
$('#wuju-bbs-upload').html('<i class="fa fa-picture-o"></i>');
}
});

//文章权限区图片上传
upload.render({
elem: '#wuju-single-pay-upload',
url: wuju.wuju_ajax_url+'/upload/bbs.php',
multiple:true,
accept:'file',
before: function(obj){
$('#wuju-single-pay-upload').html('<i class="fa fa-spin fa-refresh">');
},
done: function(res, index, upload){
if(res.code == 1){
ue_single_pay.focus();
ue_single_pay.execCommand('inserthtml','<img src="'+res.file_url+'">');
}else{
layer.msg(res.msg);	
}
},
allDone: function(obj){
$('#wuju-single-pay-upload').html('<i class="fa fa-picture-o"></i>');
},
error: function(index, upload){
layer.msg('上传失败！');
$('#wuju-single-pay-upload').html('<i class="fa fa-picture-o"></i>');
}
});

//论坛上传图片==权限框框(付费区)
upload.render({
elem: '#wuju-bbs-pay-upload',
url: wuju.wuju_ajax_url+'/upload/bbs.php',
multiple:true,
accept:'file',
before: function(obj){
$('#wuju-bbs-pay-upload').html('<i class="fa fa-spin fa-refresh">');
},
done: function(res, index, upload){
if(res.code == 1){
ue_pay.focus();
ue_pay.execCommand('inserthtml','<img src="'+res.file_url+'">');
}else{
layer.msg(res.msg);	
}
},
allDone: function(obj){
$('#wuju-bbs-pay-upload').html('<i class="fa fa-picture-o"></i>');
},
error: function(index, upload){
layer.msg('上传失败！');
$('#wuju-bbs-pay-upload').html('<i class="fa fa-picture-o"></i>');
}
});

//论坛回复上传图片
upload.render({
elem: '#wuju-bbs-comment-upload',
url: wuju.wuju_ajax_url+'/upload/bbs.php',
multiple:false,
accept:'file',
before: function(obj){
$('#wuju-bbs-comment-upload').html('<i class="fa fa-spin fa-refresh">');
},
done: function(res, index, upload){
$('#wuju-bbs-comment-upload').html('<i class="fa fa-picture-o"></i>');
if(res.code == 1){
ue.focus();
ue.execCommand('inserthtml','<img src="'+res.file_url+'">');
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('#wuju-bbs-comment-upload').html('<i class="fa fa-picture-o"></i>');
}
});













});//layui











});