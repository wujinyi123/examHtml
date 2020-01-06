/**
 *  入口文件索引
 *  使用说明：将此文件引入到页面中，可在script标签上定义一个data-main=""属性，
 *  此属性指定页面入口文件。
 *
**/
(function () {

    var entry,
        // 配置所有应用的入口文件，程序将会按照data-main属性中设置的值进行索引查找
        // 如果你在引入此脚本的script标签上没有设置data-main属性，程序将会默认访问home.js文件
        app = {
            home : '{/}home',
            login : '{/}login'
        };

    (function(){

        var dataMain, scripts = document.getElementsByTagName('script'),
            eachScripts = function(el){
                dataMain = el.getAttribute('data-main');
                if(dataMain){
                    entry = dataMain;
                }
            };

        [].slice.call(scripts).forEach(eachScripts);

    })();

    layui.config({
        base: 'assets/lay/modules/'
    }).extend(app).use(entry || 'home');

})();

$.ajax({
    type: "POST",
    url: "/back/user/getUserMsg",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify({userType:"student"}),
    success: function(data){
        $("#realName").html(data.data.name);
        $("#userNumber").html(data.data.number);
    },
    error:function(e){
        console.log(e);
    }
});

$("#updatepassword").click(function(){
    layui.use('layer', function() {
        layui.layer.open({
            type: 2,
            title: '修改密码',
            shadeClose: true,
            shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['35%', '50%'],
            content: 'views/updatePassword.html'
        });
    });
});

$("#exit").click(function(){
    $.cookie('student'+configData.projectName, null);
    window.location.href='../../login.html';
});