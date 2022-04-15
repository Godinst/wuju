
//弹出对应类型的表单
function wuju_editor_form(type,post_id){
if(type=='single'){
window.location.href=wuju.member_url_permalink+'info=editor-single&post_id='+post_id;
return false;
}

if(type!='words'&&type!='video'&&type!='music'){
window.location.href=wuju.member_url_permalink+'info=editor-bbs&post_id='+post_id;
return false;
}

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/editor/"+type+"-form.php",
data:{type:type,post_id:post_id},
success: function(msg){
layer.closeAll('loading');

wuju_publish_form=layer.open({
type:1,
title:false,
btn: false,
fixed: false,
resize:false,
closeBtn: 0,
shade:0.4,
area: ['550px', 'auto'],
skin: 'wuju-publish-form',
content: msg
})

layui.use('form', function(){
var form = layui.form;
form.render('checkbox');
});


//移除已经选择的话题
$(".wuju-publish-words-topic").on("click","span",function(){
$(this).remove();
if($('.wuju-publish-words-topic span').length==0){
$('.wuju-publish-words-bar .topic').removeClass('on');	
}
});


//发表动态上传图片
if(type=='words'){
words_images_max=wuju.words_images_max;//最大上传数量
status=1;
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.wuju-publish-words-upload',
url: wuju.wuju_ajax_url+'/upload/words.php',
multiple:true,
number:words_images_max,
accept:'file',
before: function(obj){
$('.wuju-publish-words-image').show();
$('.wuju-upload-add-icon').html('<img src="'+wuju.admin_url+'/images/spinner.gif" />');
},
done: function(res, index, upload){
number=$('.wuju-publish-words-image li').length;//获取当前上传图片的数量

if(number>=words_images_max-1){//如果已经上传了9张
$('.wuju-upload-add-icon').hide();//隐藏添加按钮
}


if(number<words_images_max){
if(res.code == 1){
$('.wuju-publish-words-image').prepend('<li><a href="'+res.file_url+'" data-fancybox="publish-gallery"><img src="'+res.file_thum_url+'" class="img"></a><div class="bar"><i class="wuju-icon wuju-fanhui2" onclick="wuju_img_left(this)"></i><i class="wuju-icon wuju-bangzhujinru" onclick="wuju_img_right(this)"></i><i class="wuju-icon wuju-guanbi" onclick="wuju_remove_publish_img(this)"></i></div></li>');
}else{
layer.msg(res.msg);	
}
}
},
allDone: function(obj){
$('.wuju-upload-add-icon').html('+');
},
error: function(index, upload){
layer.msg('上传失败！');
$('.wuju-upload-add-icon').html('+');
}
});
});//upload
}

//上传视频封面
if(type=='video'){
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.wuju-publish-set-video-img-upload',
url: wuju.wuju_ajax_url+'/upload/video-img.php',
multiple:true,
number:12,
accept:'file',
before: function(obj){
$('.wuju-publish-set-video-img-upload').html('<i class="fa fa-spin fa-circle-o-notch"></i> 上传中...');
},
done: function(res, index, upload){
$('.wuju-publish-set-video-img-upload').html('<i class="wuju-icon wuju-shangchuan"></i> 上传封面');
layer.msg(res.msg);
if(res.code == 1){
$('#wuju-video-img-url').val(res.file_url);
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('.wuju-publish-set-video-img-upload').html('<i class="wuju-icon wuju-shangchuan"></i> 上传封面');
}
});
});//upload
}


//关闭发表窗口
$(".wuju-publish-words-btn .cancel").click(function(){
layer.confirm('你确定要关闭窗口吗？', {
btnAlign: 'c',
btn: ['确定','取消']
}, function(index){
layer.close(wuju_publish_form); 
layer.close(index);
});
});


}//success
}); //ajax





}//wuju_publish_power


//编辑动态
function wuju_editor_words(post_id,obj){
if($(obj).parent().siblings('#wuju-pop-title').length>0){
if($.trim($(obj).parent().siblings('#wuju-pop-title').val())==''){
layer.msg('请输入标题！');
return false;
}
}

if($.trim($(obj).parent().siblings('.content').children('#wuju-pop-content').val())==''){
layer.msg('请输入内容！');
return false;	
}

power=$(obj).parent().siblings('#wuju-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($(obj).parent().siblings('.wuju-publish-words-power').find('.price').val()==''){
layer.msg('请输入售价！');
return false;	
}
}
if(power==2){
if($.trim($(obj).parent().siblings('.wuju-publish-words-power').find('.password').val())==''){
layer.msg('请输入密码！');
return false;	
}
}
if($.trim($(obj).parent().siblings('.wuju-publish-words-power').find('textarea[name="hide-content"]').val())==''){
layer.msg('请输入隐藏内容！');
return false;		
}
}

data=$(obj).parents('.wuju-publish-words-form').serialize();
if($(obj).parent().siblings('.wuju-publish-words-topic').children('span').length>0){
topic='&topic=';
$(obj).parent().siblings('.wuju-publish-words-topic').children('span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

if($(obj).parent().siblings('.wuju-publish-words-image').children('li').length>0){
img='&img=';
img_thum='&img_thum=';
$(obj).parent().siblings('.wuju-publish-words-image').children('li').each(function(){
img+=$(this).children('a').attr('href')+',';
img_thum+=$(this).find('img').attr('src')+',';
});
img=img.substr(0,img.length-1);
img_thum=img_thum.substr(0,img_thum.length-1);
data=data+img+img_thum;
}

data=data+'&post_id='+post_id;

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/editor/words.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('.wuju-publish-words-btn .publish').removeAttr('onclick');
function d(){window.location.href=msg.url;}setTimeout(d,2000);
}

}
});  
}


//编辑视频
function wuju_editor_video(post_id){

if($('#wuju-pop-title').length>0){
if($.trim($('#wuju-pop-title').val())==''){
layer.msg('请输入标题！');
return false;
}
}

if($.trim($("#wuju-pop-content").val())==''){
layer.msg('请输入内容！');
return false;	
}

power=$('#wuju-pop-power').val();
if(power==1){
if($('.wuju-publish-words-power-content .price').val()==''){
layer.msg('请输入售价！');
return false;	
}
}
if(power==2){
if($.trim($('.wuju-publish-words-power-content .password').val())==''){
layer.msg('请输入密码！');
return false;	
}
}

video_url=$("#wuju-video-url").val();
if(video_url==''){
layer.msg('请输入视频地址或上传视频！');
return false;	
}


video_img=$('#wuju-video-img-url').val();


data=$(".wuju-publish-words-form").serialize();
if($('.wuju-publish-words-topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

video='&video-url='+video_url;
video_img='&video-img-url='+video_img;
data=data+video+video_img;
data=data+'&post_id='+post_id;

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/editor/video.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('.wuju-publish-words-btn .publish').removeAttr('onclick');
function d(){window.location.href=msg.url;}setTimeout(d,2000);
}

}
});  


}


//编辑文章
function wuju_editor_single(post_id){
content=ue_single.getContent();
if($.trim($('.wuju-single-title').val())==''){
layer.msg('请输入标题！');
return false;
}

if($.trim(content)==''){
layer.msg('请输入内容！');
return false;	
}

power=$('#wuju-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($('.wuju-publish-words-power.single .price').val()==''){
layer.msg('请输入售价！');
return false;	
}
}
if(power==2){
if($.trim($('.wuju-publish-words-power.single .password').val())==''){
layer.msg('请输入密码！');
return false;	
}
}

hide_content=ue_single_pay.getContent();
if($.trim(hide_content)==''){
layer.msg('隐藏内容不能为空！');
return false; 
}

}

data=$(".wuju-publish-single-form").serialize();
if($('.wuju-publish-words-topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

// data=data+'&post_id='+post_id+'&content='+content;
data=data+'&post_id='+post_id;

layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/editor/single.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('.wuju-publish-words-btn .publish').removeAttr('onclick');
$(window).unbind('beforeunload');
ue_single.execCommand('clearlocaldata');
ue_single_pay.execCommand('clearlocaldata');
function d(){window.location.href=msg.url;}setTimeout(d,2000);
}

}
});  


}


//编辑音乐
function wuju_editor_music(post_id){

if($('#wuju-pop-title').length>0){
if($.trim($('#wuju-pop-title').val())==''){
layer.msg('请输入标题！');
return false;
}
}

if($.trim($("#wuju-pop-content").val())==''){
layer.msg('请输入内容！');
return false;	
}

power=$('#wuju-pop-power').val();
if(power==1){
if($('.wuju-publish-words-power-content .price').val()==''){
layer.msg('请输入售价！');
return false;	
}
}
if(power==2){
if($.trim($('.wuju-publish-words-power-content .password').val())==''){
layer.msg('请输入密码！');
return false;	
}
}

music_url=$("#wuju-music-url").val();
if(music_url==''){
layer.msg('请输入音乐地址或上传音乐！');
return false;	
}

// music_ret=/^https?:\/\/\S+\.mp3$/;
// if (!music_ret.test(music_url)){
// layer.msg('请输入一个mp3后缀的正确的音乐地址！带https://'); 
// return false;
// }  


data=$(".wuju-publish-words-form").serialize();
if($('.wuju-publish-words-topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

data=data+'&post_id='+post_id;
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/editor/music.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('.wuju-publish-words-btn .publish').removeAttr('onclick');
function d(){window.location.href=msg.url;}setTimeout(d,2000);
}

}
});  


}//编辑音乐



//发布帖子
function wuju_editor_bbs_post(post_id){
title= $.trim($('.wuju-bbs-title').val());
post_type= $('#wuju-bbs-type').val();
content=ue.getContent();

if(title==''){
layer.msg('标题不能为空！');
return false;
}

if($.trim(content)==''){
layer.msg('内容不能为空！');
return false; 
}

if(post_type=='pay_see'||post_type=='vip_see'||post_type=='login_see'||post_type=='comment_see'){
hide_content=ue_pay.getContent();
if($.trim(hide_content)==''){
layer.msg('隐藏内容不能为空！');
return false; 
}

if(post_type=='pay_see'){
if($('#wuju-bbs-price').val()==''){
layer.msg('售价不能为空！');
return false; 
}  
}

}

if(post_type=='answer'){//问答
if($('#wuju-bbs-answer-price').val()==''){
layer.msg('悬赏金额不能为空！');
return false; 
}  
}



data = $('#wuju-bbs-publish-form').serialize();

//投票
if(post_type=='vote'){

var vote_list_num=$('.wuju-bbs-publish-vote-list .layui-form-item').length;//获取项数
var vote_times=$('#wuju-vote-times').val();

if(vote_times>vote_list_num-1){
layer.msg('次数不能大于或等于投票项数！'); 
return false;
}
vote_arr=[];
for (var i=0; i < vote_list_num; i++) {
vote_list_text=$(".wuju-bbs-publish-vote-list").children('.layui-form-item').eq(i).find('input').val();

if($.trim(vote_list_text)==''){
layer.msg('投票项内容不能为空！');  
return false; 
}


reg=/,/g;
vote_list_text=vote_list_text.replace(reg,'，');
vote_arr.push(vote_list_text);
vote_arr.push(0);//写入每项的初始投票值
}

vote_arr.push(0);//写入总投票值。

vote_data=vote_arr.join(",");//投票数据
data=data+'&vote-data='+vote_data;//加上投票数据
}

//活动帖子
if(post_type=='activity'){

var activity_list_num=$('.wuju-bbs-publish-activity-list .layui-form-item').length;//获取项数
activity_arr=[];
for (var i=0; i < activity_list_num; i++) {
activity_type=$(".wuju-bbs-publish-activity-list").children('.layui-form-item').eq(i).find('select').val();//选项类型
activity_text=$(".wuju-bbs-publish-activity-list").children('.layui-form-item').eq(i).find('.activity_type_name').val();//选项名称

if($.trim(activity_text)==''){
layer.msg('活动选项名称不能为空！');  
return false; 
}

// reg=/,/g;
// activity_text=activity_text.replace(reg,'，');
activity_arr.push(activity_type);
activity_arr.push(activity_text);
}


activity_data=activity_arr.join(",");//活动数据
data=data+'&activity-data='+activity_data;//加上活动数据
}

if($('.wuju-publish-words-topic.bbs span').length>0){
topic='&topic=';
$('.wuju-publish-words-topic.bbs span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

// data=data+'&post_id='+post_id+'&content='+content;
data=data+'&post_id='+post_id;
layer.load(1);
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/editor/bbs.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('#wuju-bbs-publish-btn').removeAttr('onclick');
$(window).unbind('beforeunload');

ue.execCommand('clearlocaldata');
if(post_type=='pay_see'||post_type=='vip_see'||post_type=='login_see'||post_type=='comment_see'){
ue_pay.execCommand('clearlocaldata');
}

function d(){window.location.href=msg.url;}setTimeout(d,2000);
}

}
}); 


}
