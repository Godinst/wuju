$(function(){

//论坛大厅 tab点击	
$('.wuju-bbs-tab-post-header>li').click(function(event){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children().eq($(this).index()).show().siblings().hide();
});


//首页sns点击切换
$('.wuju-home-menu li').click(function(event){
if($(this).index()==0){
$('.wuju-mobile-home-sns-top').show();
}else{
$('.wuju-mobile-home-sns-top').hide();	
}
});



//侧栏浮动按钮浏览排序切换
$('.wuju-home-right-bar li.sort').click(function() {
$('.wuju-content-sort>li').removeClass('on');
if($(this).children().hasClass('wuju-suijibofang')){//如果是随机切换顺序
$(this).attr('title','顺序查看').html('<i class="wuju-icon wuju-shunxu-"></i>');
$('.wuju-content-sort>li[data="normal"]').addClass('on');
name='normal';
layer.open({content:'已切换顺序查看',skin:'msg',time:2});
}else if($(this).children().hasClass('wuju-shunxu-')){//如果是顺序切换热门
$(this).attr('title','热门排序').html('<i class="wuju-icon wuju-huo"></i>');
$('.wuju-content-sort>li[data="comment_count"]').addClass('on');
name='comment_count';
layer.open({content:'已切换热门排序',skin:'msg',time:2});
}else{//如果是热门切换随机
$(this).attr('title','随机排序').html('<i class="wuju-icon wuju-suijibofang"></i>');
$('.wuju-content-sort>li[data="rand"]').addClass('on');
name='rand';	
layer.open({content:'已切换随机排序',skin:'msg',time:2});
}
var expdate=new Date();
expdate.setTime(expdate.getTime()+(24*60*60*1000*30*12*10));
SetCookie('sort',name,expdate,"/",null,false);	
// function c(){window.location.reload();}setTimeout(c,1500);
type=$('.wuju-home-menu li.on').attr('data');
wuju_post_data(type,'pull',0,this);
});	







});