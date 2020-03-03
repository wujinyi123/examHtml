var login = $('input[name="login"]').val("100001");
var pwd = $('input[name="pwd"]').val("123456");

var canGetCookie = 1;//是否支持存储Cookie 0 不支持 1 支持
var CodeVal = 0;
Code();
function Code() {
	if(canGetCookie == 1){
		createCode("AdminCode");
		var AdminCode = getCookieValue("AdminCode");
		showCheck(AdminCode);
	}else{
		showCheck(createCode(""));
	}
}
function showCheck(a) {
	CodeVal = a;
	var code = $('input[name="code"]').val(a);
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.font = "80px 'Hiragino Sans GB'";
	ctx.fillStyle = "#E8DFE8";
	ctx.fillText(a, 0, 100);
}
$(document).keypress(function (e) {
	// 回车键事件  
	if (e.which == 13) {
		$('input[type="button"]').click();
	}
});
//粒子背景特效
$('body').particleground({
	dotColor: '#E8DFE8',
	lineColor: '#133b88'
});
$('input[name="pwd"]').focus(function () {
	$(this).attr('type', 'password');
});
$('input[type="text"]').focus(function () {
	$(this).prev().animate({ 'opacity': '1' }, 200);
});
$('input[type="text"],input[type="password"]').blur(function () {
	$(this).prev().animate({ 'opacity': '.5' }, 200);
});
$('input[name="login"],input[name="pwd"]').keyup(function () {
	var Len = $(this).val().length;
	if (!$(this).val() == '' && Len >= 5) {
		$(this).next().animate({
			'opacity': '1',
			'right': '30'
		}, 200);
	} else {
		$(this).next().animate({
			'opacity': '0',
			'right': '20'
		}, 200);
	}
});
var open = 0;
layui.use('layer', function () {
	//非空验证
	$('input[type="button"]').click(function () {
		var login = $('input[name="login"]').val();
		var pwd = $('input[name="pwd"]').val();
		var user_type = $('input[name="user_type"]:checked').val();
		var code = $('input[name="code"]').val();
		if (login == '') {
			ErroAlert('请输入您的账号');
		} else if (pwd == '') {
			ErroAlert('请输入密码');
		} else if (code == '' || code.length != 4 || code.toUpperCase()!=CodeVal.toUpperCase()) {
			ErroAlert('输入正确的验证码');
			Code();
		} else {
			//认证中..
			$('.login').addClass('test'); //倾斜特效
			setTimeout(function () {
				$('.login').addClass('testtwo'); //平移特效
			}, 300);
			setTimeout(function () {
				$('.authent').show().animate({ right: -320 }, {
					easing: 'easeOutQuint',
					duration: 600,
					queue: false
				});
				$('.authent').animate({ opacity: 1 }, {
					duration: 200,
					queue: false
				}).addClass('visible');
			}, 500);

			//登录
			var JsonData = {
			    number: login,
                password: pwd,
                userType: user_type,
                enterCode: code.toUpperCase(),
                trueCode: CodeVal.toUpperCase()
			};
			Code();
			$.ajax({
				type: "POST",
				url: "/back/user/login",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(JsonData),
				success: function(data){
					check_login(data.data);
				},
				error:function(e){
					console.log(e);
				}
			});
		}
	});
})
 
function check_login(data){
	setTimeout(function () {
		$('.authent').show().animate({ right: 90 }, {
			easing: 'easeOutQuint',
			duration: 600,
			queue: false
		});
		$('.authent').animate({ opacity: 0 }, {
			duration: 200,
			queue: false
		}).addClass('visible');
		$('.login').removeClass('testtwo'); //平移特效
	}, 1000);
	
	setTimeout(function () {
		$('.authent').hide();
		$('.login').removeClass('test');
		if (data.state == 'ok') {
			//登录成功
			$('.login div').fadeOut(100);
			$('.success').fadeIn(1000);
			$('.success').html("登录成功<br /><br />欢迎回来");
			setTimeout(function () {
				$.cookie(data.userType+configData.projectName ,data.msg);
				window.location.href="html/" + data.userType + "/index.html";
			}, 2000);
		} else {
			AjaxErro({"Status":"Erro","Erro":data.msg});
		}
	}, 1300);
}
