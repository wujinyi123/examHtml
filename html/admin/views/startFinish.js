var listCollege = {};

//转化正整数
function zhzs(value){
    value = value.replace(/[^\d]/g,'');
    if(''!=value){
     value = parseInt(value);
    }
    return value;
}

$.ajax({
    type: "POST",
    url: "/back/mb/listCollege",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    success: function(data){
        listCollege = data.data;
        layui.use('form', function(){
            var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
            
            $.each(data.data,function(index,value){
                newDiv = $('<div class="layui-form-item">');

                newInline = $('<div class="layui-inline">');
                newInline.append('<label class="layui-form-label">'+value.name+'</label>');
                newDiv.append(newInline);

                newInline = $('<div class="layui-inline">');
                newInline.append('<label class="layui-form-label">男生人数</label>');
                newInput = $('<div class="layui-input-inline">');
                newInput.html('<input type="text" value="'+(index+1)+'" id="'+value.code+'_boy" name="'+value.code+'_boy" onkeyup="value=zhzs(this.value)" required  lay-verify="number" placeholder="请输入男生人数" autocomplete="off" class="layui-input">');
                newInline.append(newInput);
                newDiv.append(newInline);

                newInline = $('<div class="layui-inline">');
                newInline.append('<label class="layui-form-label">女生人数</label>');
                newInput = $('<div class="layui-input-inline">');
                newInput.html('<input type="text" value="'+(index+1)+'" id="'+value.code+'_girl" name="'+value.code+'_girl" onkeyup="value=zhzs(this.value)" required  lay-verify="number" placeholder="请输入女生人数" autocomplete="off" class="layui-input">');
                newInline.append(newInput);
                newDiv.append(newInline);

                $('#thisForm').append(newDiv);
            });

            newDiv = $('<div class="layui-form-item">');
            newInput = $('<div class="layui-input-block">');
            newInput.html('<button class="layui-btn layui-btn-blue" lay-submit lay-filter="start">提交</button>');
            newDiv.append(newInput);
            $('#thisForm').append(newDiv);

            form.render();
        });
    },
    error:function(e){
        console.log(e);
    }
});

function changeClazz() {
    $('#clazz').html("");
    $('#clazz').append('<option value="0">全部</option>');
    var collegeCode = $("#collegeCode").val();
    var year = $("#year").val();
    $.ajax({
        type: "POST",
        url: "/back/mb/listClazzByCY",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({collegeCode:collegeCode,year:year}),
        success: function(data){
            layui.use('form', function(){
                $.each(data.data,function(index,value){
                    $('#clazz').append('<option value="'+value.code+'">'+value.name+'</option>');
                });
                layui.form.render('select');
            });
        },
        error:function(e){
            console.log(e);
        }
    });
}

$.ajax({
    type: "POST",
    url: "/back/mb/collegeAndYear",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    success: function(data){
        layui.use('form', function(){
            $.each(data.data.college,function(index,value){
                $('#collegeCode').append('<option value="'+value.code+'">'+value.name+'</option>');
            });
            $.each(data.data.year,function(index,value){
                $('#year').append('<option value="'+value.code+'">'+value.name+'</option>');
                if (index==0 || index=='0') {
                    $('#year').val(value.code);
                }
            });
            layui.form.render();
        });
        changeClazz();
    },
    error:function(e){
        console.log(e);
    }
});

layui.use(['form','layer'], function(){   
    layui.form.on('submit(start)', function(dataForm){
        jsonData = [];
        $.each(listCollege,function(index,value){
            dat = {
                collegeCode:value.code,
                collegeName:value.name,
                boy:$('#'+value.code+'_boy').val(),
                girl:$('#'+value.code+'_girl').val()
            };
            jsonData.push(dat);
        });
        
        $.ajax({
            type: "POST",
            url: "/back/manage/newStuNumber",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(jsonData),
            success: function(data){
                window.open("/back/manage/newStuNum?uuid="+data.data);
            },
            error:function(e){
                console.log(e);
            }
        });

        return false;
    });

    layui.form.on("select(collegeCode)",function () {
        changeClazz();
    });

    layui.form.on("select(year)",function () {
        changeClazz();
    });

    layui.form.on('submit(finish)', function(dataForm){
        collegeCode = $('#collegeCode').val();
        year = $('#year').val();
        clazz = $('#clazz').val();
        layer.confirm('确定此操作？', {
            btn: ['确定','取消'], //按钮
        }, function(index){
            $.ajax({
                type: "POST",
                url: "/back/manage/graduated",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({collegeCode:collegeCode,year:year,clazz,clazz}),
                success: function(data){
                    if (data.data!=undefined && data.data!=null && data.data!='' && data.data!='0' && data.data!=0) {
                        layui.use('layer', function () {
                            layui.layer.alert('<span style="font-size:16px;">操作成功，'+data.data+'</span>', {icon: 1});
                        });
                    } else {
                        layui.use('layer', function () {
                            layui.layer.alert('<span style="font-size:16px;">删除失败</span>', {icon: 2});
                        });
                    }
                },
                error:function(e){
                    console.log(e);
                }
            });
            layer.close(index);
        });
        return false;
    });
});