$(function(){

navbar_height=parseInt($('.navbar').height());
toolbar_height=parseInt($('.toolbar').height());
w_height=parseInt($(window).height());
$('.wuju-topic-show-form').height(w_height-(navbar_height+toolbar_height));


//论坛大厅 tab点击	
$('.wuju-bbs-tab-post-header>li').click(function(event){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children().eq($(this).index()).show().siblings().hide();
});


//首页sns点击切换
$('.wuju-home-sns-subnavbar .wuju-home-menu li').click(function(event){
if($(this).index()==0){
$('.wuju-mobile-home-sns-top').show();
}else{
$('.wuju-mobile-home-sns-top').hide();	
}
});


//话题中心切换
$(document).on('click','.wuju-topic-show-form .left>li',function(){
$(this).parent().next().animate({scrollTop: 0 },0);
$(this).addClass('on').siblings().removeClass('on').parent().next().children().eq($(this).index()).show().siblings().hide();
});

//与我相关-消除红点
$("body").on("click",'.wuju-chat .wuju-chat-user-list li,.wuju-notice-tips-content .wuju-chat-user-list li', function(e){
$(this).find('.item-media').find('span').remove();
});

//全站滚动事件
if($('.wuju-right-bar').length>0){
$('.page-content').scroll(function(){
$('.wuju-right-bar').addClass('right-bar-hidden');
clearTimeout($.data(this,'scrollTimer'));
$.data(this,'scrollTimer',setTimeout(function(){
$('.wuju-right-bar').removeClass('right-bar-hidden');
},800));
});
}


//点击底部tab返回顶部
$(document).on('click','.tabbar a.active',function(){
// console.log('aaa');
if($('.view.active .page-content').scrollTop()>100){
$('.view.active .page-content').animate({scrollTop:0},200);	
if($('.wuju-home-menu li.on').length>0){
if($('.wuju-home-menu li.on').attr('waterfall')!=1){
type=$('.wuju-home-menu li.on').attr('type');
wuju_post(type,'pull','.wuju-home-menu li.on');
}
}

wuju_index_notice_js_load();

}
}); 


//点击隐藏图片
$(document).on('click','.wuju-post-images-list a.blur',function(){
console.log(1);
$(this).parents('.wuju-post-images-list').prev().children('.wuju-btn').click();
});


//自动滑动菜单
$(document).on('click','.wuju-home-menu li,.wuju-member-menu li,.wuju-topic-menu li,.wuju-bbs-menu li,.wuju-bbs-tab-post-header>li',function(){
menu_width=0;
for(var i=0;i<$(this).index();i++){
menu_width+=$(this).parent().children('li').eq(i).outerWidth(true);
}
$(this).parent().animate({
scrollLeft:menu_width-$(window).width()/2+$(this).outerWidth()
});
});





//ajax错误/超时
// $.ajaxSetup({
// timeout: 18000,//18秒
// error: function(XHR, Status, Error){
// console.log(Status)
// myApp.hideIndicator();
// $('.wuju-load-post').remove();
// if(Status=="error"){//发生错误
// console.log('页面请求失败，请重新尝试！');
// layer.open({
// content: '页面请求失败，请重新尝试！',
// btn: '确定',
// shadeClose: false,
// yes: function(){
// layer.closeAll();
// }
// });
// }else if(Status=="timeout"){//超时处理
// layer.open({
// content: '页面请求超时，请重新尝试！',
// btn: '确定',
// shadeClose: false,
// yes: function(){
// layer.closeAll();
// }
// });
// }else if(Status=="abort"){//中断
// console.log('操作中断！');
// }else{//其他情况
// console.log('页面请求发生未知错误，请重新尝试！');
// layer.open({
// content: '页面请求发生未知错误，请重新尝试！',
// btn: '确定',
// shadeClose: false,
// yes: function(){
// layer.closeAll();
// }
// });
// }
// }
// });

});