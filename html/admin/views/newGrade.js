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
            newInput.html('<button class="layui-btn layui-btn-blue" lay-submit lay-filter="formSubmit">提交</button>');
            newDiv.append(newInput);
            $('#thisForm').append(newDiv);

            form.render();
        });
    },
    error:function(e){
        console.log(e);
    }
});

layui.use(['form','layer'], function(){   
    layui.form.on('submit(formSubmit)', function(dataForm){
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
});