$.ajax({
    type: "POST",
    url: "/back/user/getUserInfo",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify({userType:"teacher"}),
    success: function(data){
        $("#collegeName").html(data.data.college);
        $("#teacherNumber").html(data.data.number);
        $("#teacherName").html(data.data.name);
        $("#teacherSex").html(data.data.sex);
        $("#teacherTel").val(data.data.tel);
        $("#teacherEmail").val(data.data.email);
        $('#demo1').attr('src', data.data.img);
    },
    error:function(e){
        console.log(e);
    }
});

layui.use(['form','layer'], function(){
    layui.form.on('submit(change)', function(dataForm){
        $.ajax({
            type: "POST",
            url: "/back/user/udateTelEmail",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({userType:"teacher",tel:$('#teacherTel').val(),email:$('#teacherEmail').val()}),
            success: function(data){
                if (data.data.state=='no') {
                  layui.layer.alert('<span style="color: #FF0000; font-size:16px;">'+data.data.msg+'</span>',{icon:2});
                } else {
                  layui.layer.alert('<span style="font-size:16px;">'+data.data.msg+'</span>',{icon:1},function(){
                    window.location.href = window.location.href;
                  });
                  setTimeout(function () {
                      window.location.href = window.location.href;
                  }, 2000);
                }
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });
});

layui.use('upload', function(){
    var $ = layui.jquery
    ,upload = layui.upload;
    //普通图片上传
    var uploadInst = upload.render({
      elem: '#test1'
      ,url: '/back/user/imgUpload?type=teacher' //改成您自己的上传接口
      ,before: function(obj){
        //预读本地文件示例，不支持ie8
        obj.preview(function(index, file, result){
          $('#demo1').attr('src', result); //图片链接（base64）
        });
      }
      ,done: function(res){
        //如果上传失败
        if(res.code > 0){
          return layer.msg('上传失败');
        }
        //上传成功
      }
      ,error: function(){
        //演示失败状态，并实现重传
        var demoText = $('#demoText');
        demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
        demoText.find('.demo-reload').on('click', function(){
          uploadInst.upload();
        });
      }
    });
});