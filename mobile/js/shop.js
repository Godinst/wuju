//选择套餐
function wuju_shop_select_form(post_id,type){
layer.open({
type: 1,
content: $('.wuju-shop-select-form-'+post_id).html(),
anim: 'up',
className :'wuju-shop-select-pop-form wuju-shop-select-pop-form-'+post_id,
style: 'position:fixed;bottom:0;left:0;width:100%;border:none;border-radius: 2vw 2vw 0 0;'
});	


//属性套餐选择
$('.wuju-shop-select-content-'+post_id+' .select-box .list .content li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});

//价格套餐选择
$('.wuju-shop-select-content-'+post_id+' .select-box.price .list .content li').click(function(){
price=$(this).attr('price');
price_discount=$(this).attr('price_discount');
if(price_discount){
price=price_discount;
$('.wuju-shop-select-header .info .price n').show();
$('.wuju-shop-select-header .info .price n d').html($(this).attr('price'))
}else{
$('.wuju-shop-select-header .info .price n').hide();
}
$('.wuju-shop-select-header .info .price c').html(price);
});

//减号
$('.wuju-shop-select-content-'+post_id+' .select-box.number .right i.wuju-jianhao').click(function(){
if(!$(this).hasClass('on')){
var number=parseInt($(this).siblings('input').val());
if(number>2){
$(this).siblings('input').val(number-1);
}else{
$(this).siblings('input').val(1);	
$(this).addClass('on');
}
}
});

//加号
$('.wuju-shop-select-content-'+post_id+' .select-box.number .right i.wuju-hao').click(function(){
var number=parseInt($(this).siblings('input').val());
$(this).siblings('input').val(number+1);
if((number+1)>1){
$(this).siblings('.wuju-jianhao').removeClass('on');
}
if((number+1)>99){
$(this).siblings('input').val(99);
}
});


if(type=='car'){
$('.wuju-shop-select-pop-form .btn span.buy').remove();
}else{
$('.wuju-shop-select-pop-form .btn span.car').remove();
}
}


//提交购买
function wuju_shop_buy(post_id,obj){
var number=$(obj).parent().prev().find('#wuju-goods-number').val();
var address='';
var marks=$(obj).parent().prev().find('#wuju-goods-marks').val();

//下单信息
info_arr='';
if($('.wuju-shop-select-pop-form-'+post_id+' .select-box.pass-info').length>0){
var info_arr={};
var a=0;
var b='';
$(".wuju-shop-select-pop-form-"+post_id+" .select-box.pass-info .list li").each(function(){
info_arr[a]={};
info_arr[a]['name']=$(this).children('span').text();
info_arr[a]['value']=$(this).children('input').val();
b+=$(this).children('input').val();
a++;
});
info_arr=JSON.stringify(info_arr);
}

if(b==''){
layer.open({content:'下单信息不能为空！',skin:'msg',time:2});
return false;	
}

var select_arr={};
var i=0;
$(".wuju-shop-select-pop-form-"+post_id+" .select-box.select .list").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('.title').text();
select_arr[i]['value']=$(this).find('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.wuju-shop-select-pop-form-'+post_id+' .select-box.price').length>0){//存在价格套餐
length=$('.wuju-shop-select-pop-form-'+post_id+' .select-box.select .list').length;
select_arr[length]={};
select_arr[length]['name']=$('.wuju-shop-select-pop-form-'+post_id+' .select-box.price .title').text();
select_arr[length]['value']=$('.wuju-shop-select-pop-form-'+post_id+' .select-box.price li.on').text();
select_price=$('.wuju-shop-select-pop-form-'+post_id+' .select-box.price li.on').index();//价格套餐选择的位置
}
select_price=parseInt(select_price)+1;

select_arr=JSON.stringify(select_arr);
trade_no=new Date().getTime();

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/goods-buy.php",
data:{info_arr:info_arr,select_arr:select_arr,post_id:post_id,number:number,address:address,marks:marks,select_price:select_price,trade_no:trade_no},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){layer.closeAll();myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/shop/order-mine.php?read_type='+msg.status});}setTimeout(c,1500);
}else if(msg.code==2){//充值页面
layer.closeAll();
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});}setTimeout(c,1500);
}else if(msg.code==3){//支付界面
layer.closeAll();
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){wuju_order_details(msg.order_id);}setTimeout(c,1500);
}else if(msg.code==5){//我的订单
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){
layer.closeAll();
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/shop/order-mine.php'});
}setTimeout(c,1500);
}else{//其他失败情况
layer.open({content:msg.msg,skin:'msg',time:2});
}

}
});



}



//查看订单详情
function wuju_order_details(id){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/shop/order-details.php?id='+id});
}

//删除商品订单
function wuju_goods_order_delete(trade_no){
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/goods-order-delete.php",
data: {trade_no:trade_no},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
$('#wuju-order-'+trade_no).remove();
function d(){history.back(-1);}setTimeout(d,1500);	
}
});
}
});
}



//提交订单
function wuju_recharge_goods(){
if($('#wuju-shop-address').length>0){
address_number=$('#wuju-shop-address').val();
if(address_number==''){
layer.open({content:'请添加收货地址！',skin:'msg',time:2});
return false;
}
}


trade_no=$('input[name="trade_no"]').val();
openid=$('input[name="openid"]').val();
pay_type=$('.wuju-recharge-type li.on').attr('data');

if(pay_type==''){
layer.open({content:'请选择支付方式！',skin:'msg',time:2});
return false;	
}


// address_number=parseInt(address_number)-1;
//ajax后端插入地址
if($('#wuju-shop-address').length>0){
$.ajax({   
url:wuju.wuju_ajax_url+"/action/address-order-add.php",
type:'POST',   
data:{trade_no:trade_no,address_number:address_number},
});
}

if(pay_type=='alipay_code'){//当面付
data=$('#wuju-goods-recharge-form').serialize();
myApp.showIndicator();
$.ajax({   
url:wuju.home_url+'/Extend/pay/alipay/qrcode.php',
type:'GET',   
data:data,
success:function(msg){   
myApp.hideIndicator();
if(myApp.device.os=='ios'){
window.location.href=msg;	
}else{
window.open(msg);	
}

layer.open({
content: '是否已经完成付款？'
,btn: ['已完成', '已取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({   
url:wuju.wuju_ajax_url+"/action/check-trade.php",
type:'POST',   
data:{trade_no:trade_no},
success:function(msg){   
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){
// history.back(-1);
myApp.getCurrentView().router.refreshPage();
}setTimeout(c,2000);
}
}   
}); 
layer.close(index);
}
});

}   
});

}else if(pay_type=='alipay_mobile'||pay_type=='wechatpay_mp'||pay_type=='epay_wechatpay'||pay_type=='epay_alipay'){//提交表单
$('#wuju-goods-recharge-form').submit();
}else if(pay_type=='wechatpay_mobile'){//微信H5支付
$.ajax({   
url:wuju.home_url+"/Extend/pay/wechatpay/wechat-h5.php",
type:'POST',   
data:{trade_no:trade_no},    
success:function(msg){
if(myApp.device.os=='ios'){
window.location.href=msg.url;
}else{
window.open(msg.url);	
}
}   
}); 	
}else if(pay_type=='xunhupay_wechat_mobile'){//迅虎微信支付
$.ajax({   
url:wuju.home_url+"/Extend/pay/xunhupay/wechatpay-xunhu-code.php",
type:'POST',   
data:{trade_no:trade_no},   
success:function(msg){
if(myApp.device.os=='ios'){
window.location.href=msg;
}else{
window.open(msg);		
}
}   
}); 	
}



}





//打开我的地址管理页面
function wuju_my_address_page(author_id,type){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-address.php?type='+type+'&author_id='+author_id});
}

//插入地址||编辑地址
function wuju_my_address_do(author_id,number,type,obj){
if(type=='insert'){//选择地址
address=$(obj).children('.a').text();
name=$(obj).find('.name').text();
phone=$(obj).find('.phone').text();
history.back(-1);

if($('.wuju-goods-order-confirmation-content .add-address').length>0){
$('.wuju-goods-order-confirmation-content .address-list').html('<li onclick=wuju_my_address_page('+wuju.user_id+',"insert")><i class="wuju-icon wuju-arrow-right"></i>\
<p class="address"><span>地址</span><m>'+address+'</m></p>\
<p class="name"><span>收货人</span><m>'+name+'</m></p>\
<p class="phone"><span>手机号</span><m>'+phone+'</m></p>\
</li>\
<input type="hidden" id="wuju-shop-address" value="'+number+'">');
}else{
$('.address-list.order .address m').text(address);
$('.address-list.order .name m').text(name);
$('.address-list.order .phone m').text(phone);
$('#wuju-shop-address').val(number);
}

}else{//编辑地址
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-address-add.php?type=edit&number='+number+'&author_id='+author_id});
}
}

//打开我新建地址页面
function wuju_add_address_page(author_id,type){
myApp.getCurrentView().router.load({url:wuju.theme_url+'/mobile/templates/page/setting/setting-address-add.php?type=add&author_id='+author_id});
}


//提交添加地址
function wuju_address_add(type,number){
province=$('#wuju-address-province').val();
city=$('#wuju-address-city').val();
district=$('#wuju-address-district').val();
address=$('#wuju-address-detailed').val();
name=$('#wuju-address-name').val();
phone=$('#wuju-address-phone').val();


if(!province||!city||!district){
layer.open({content:'请选择省份/城市/区县！',skin:'msg',time:2});
return false;
}
console.log(province,city,district)

if(province=='海外地区'){
province='';	
}else if(province=='香港特别行政区'||province=='澳门特别行政区'){
province=province+city;
}else if(province=='台湾省'){
}else if(province){
province=province+city+district;	
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:wuju.wuju_ajax_url+"/action/address-add.php",
data:{city:province,address:address,name:name,phone:phone,type:type,number:number},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
if(msg.type=='add'){//新增地址
history.back(-1);
number=$('.wuju-setting-content.address .address-list li').length;
type='edit';
if($('.wuju-goods-order-confirmation-content').length>0){
type='insert';
}

html="\
<li id='wuju-address-"+number+"' onclick=wuju_my_address_do("+wuju.user_id+","+(number)+",'"+type+"',this)><i class='wuju-icon wuju-fabiao1'></i>\
<p class='a'>"+province+address+"</p>\
<p class='b'><span class='name'>"+name+"</span><span class='phone'>"+phone+"</span></p>\
</li>\
";
if($('.wuju-setting-content.address .address-list .wuju-empty-page').length>0){
number=0;
$('.wuju-setting-content.address .address-list').html(html);
}else{
$('.wuju-setting-content.address .address-list').append(html);	
}
}else{
number=parseInt(msg.number);
$('.wuju-setting-content.address .address-list li').eq(number).children('.a').html(province+address);
$('.wuju-setting-content.address .address-list li').eq(number).find('.name').html(name);
$('.wuju-setting-content.address .address-list li').eq(number).find('.phone').html(phone);
}


}

}
});
}


//删除地址
function wuju_address_del(number){
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){
layer.close(index);
myApp.showIndicator();
$.ajax({
type: "POST",
url:  wuju.wuju_ajax_url+"/action/address-add.php",
data: {number:number,type:'del'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
history.back(-1);
$('#wuju-address-'+number).remove();
}
}
});
}
});
}