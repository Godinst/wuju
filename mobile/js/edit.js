
//打开编辑表单
function wuju_post_edit_form(post_id,type){
layer.closeAll();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/edit/'+type+'.php?post_id='+post_id});
}


//编辑动态
function wuju_edit_words(post_id){

power=$('#wuju-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($('.wuju-publish-words-form .power-content .price').val()==''){
layer.open({content:'请输入售价！',skin:'msg',time:2});
return false;	
}
}
if(power==2){
if($.trim($('.wuju-publish-words-form .power-content .password').val())==''){
layer.open({content:'请输入密码！',skin:'msg',time:2});
return false;	
}
}
}

data=$("#wuju-publish-form").serialize();
if($('.wuju-publish-words-form .topic span').length>0){
topic='&topic=';
$('.wuju-publish-words-form .topic span').each(function(){
topic+=$(this).attr('data')+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}


if($('#wuju-publish-images-list li').length>0){
img='&img=';
img_thum='&img_thum=';
$('#wuju-publish-images-list li').each(function(){
img+=$(this).children('a').attr('href')+',';
img_thum+=$(this).find('img').attr('src')+',';
});
img=img.substr(0,img.length-1);
img_thum=img_thum.substr(0,img_thum.length-1);
data=data+img+img_thum;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: wuju.wuju_ajax_url+"/editor/words.php",
data:data+'&post_id='+post_id,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('[data-page="publish"] .right a').removeAttr('onclick');
$('.wuju-home-menu li.on').addClass('no-voice').click();//重新加载内容
function d(){myApp.getCurrentView().router.back();}setTimeout(d,2500);
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,3000);
}else if(msg.code==5){
function a(){wuju_publish_add_topic_form();}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
});  

}