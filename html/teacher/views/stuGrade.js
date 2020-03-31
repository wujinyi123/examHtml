$.ajax({
    type: "POST",
    url: "/back/mb/listCollege",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    success: function(data){
        layui.use('form', function(){
            $.each(data.data,function(index,value){
                $('#listCollege').append('<option value="'+value.code+'">'+value.name+'</option>');
            });
            layui.form.render();
        });
    },
    error:function(e){
        console.log(e);
    }
});

$.ajax({
    type: "POST",
    url: "/back/mb/listExam",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    success: function(data){
        layui.use('form', function(){
            $.each(data.data,function(index,value){
                $('#listExam').append('<option value="'+value.code+'">考试码：'+value.code+'，小测名称：'+value.name+'</option>');
            });
            layui.form.render();
        });
    },
    error:function(e){
        console.log(e);
    }
});

layui.use(['form','layer'], function () {
    layui.form.on("select(listCollege)",function () {
            $('#listClazz').html("");
            var code = $("#listCollege").val();
            if (code=='0') {
                layui.use('form', function(){
                    $('#listClazz').append('<option value="0">请选择</option>');
                    layui.form.render('select');
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: "/back/mb/listClazz?code="+code,
                    dataType: "json",
                    success: function(data){
                        console.log(data);
                        layui.use('form', function(){
                            $.each(data.data,function(index,value){
                                $('#listClazz').append('<option value="'+value.code+'">'+value.name+'</option>');
                            });
                            layui.form.render('select');
                        });
                    },
                    error:function(e){
                        console.log(e);
                    }
                });
            }
    });

    layui.form.on('submit(formSubmit)', function(dataForm){
        var clazz = $("#listClazz").val();
        var examCode = $('#listExam').val();
        if (clazz=='0') {
            layui.use('layer', function () {
                layui.layer.alert('<span style="font-size:16px;">请选择班级</span>', {icon: 2});
            });
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/back/exam/clazzGrade",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({examCode:examCode,clazzNumber:clazz}),
            success: function(data){
                $('#clazzResult').html('');
                fieldset = $('<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">');
                fieldset.html('<legend>考试截止时间：'+data.data.expTime+'</legend>');
                $('#clazzResult').append(fieldset);

                fieldset = $('<fieldset class="layui-elem-field">');
                fieldset.append('<legend>完成人数/班级人数</legend>');
                boxDiv = $('<div class="layui-field-box">');
                progressDiv = $('<div class="layui-progress" lay-showpercent="true">');
                progressDiv.html('<div class="layui-progress-bar" lay-percent="'+data.data.finishSize+'/'+data.data.clazzSize+'"></div>');
                boxDiv.append(progressDiv);
                fieldset.append(boxDiv);
                $('#clazzResult').append(fieldset);

                fieldset = $('<fieldset class="layui-elem-field">');
                fieldset.append('<legend>平均分/试卷总分</legend>');
                boxDiv = $('<div class="layui-field-box">');
                progressDiv = $('<div class="layui-progress" lay-showpercent="true">');
                progressDiv.html('<div class="layui-progress-bar" lay-percent="'+data.data.avgScore+'/'+data.data.examScore+'"></div>');
                boxDiv.append(progressDiv);
                fieldset.append(boxDiv);
                $('#clazzResult').append(fieldset);

                $('#clazzResult').append('<a class="layui-btn layui-btn-blue" href="/back/exam/exportClazzGrade?examCode='+examCode+'&clazzNumber='+clazz+'">导出Excel</a>');
                
                layui.use('element', function () {
                    var element = layui.element;
                    element.init();
                });
            },
            error:function(e){
                console.log(e);
            }
        });
        
        $('#grades').html("");
        layui.use('table', function () {
            var table = layui.table;
            table.render({
                elem: '#grades',
                url: '/back/exam/pageGrade?examCode='+examCode+'&clazzNumber='+clazz,
                page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                    layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                    limits: [10, 15, 20],
                    limit: 10,
                    curr: 1,
                    groups: 5, //只显示 1 个连续页码
                    first: '首页',
                    last: '尾页',
                    skin: 'row',
                    page: true,
                    even: true,
                    done: function (res) {
                        userPage.data = res.data;
                    }
                },
                cols: [[
                    {field: 'stuNumber', title: '学号', sort: true},
                    {field: 'stuName', title: '姓名', sort: true},
                    {field: 'stuScore', width:100, title: '成绩', sort: true},
                    {field: 'useTime', width:120, title: '用时', sort: true},
                    {field: 'submitTime', width:180, title: '提交时间', sort: true},
                    {
                        field: 'action', width:240,title: '操作', sort: true, templet: function (data) {
                            if (data.stuScore=='未参加') {
                                return '<a class="layui-btn layui-btn-blue layui-btn-mini links_edit" href="#" onclick="stuExam(\''+data.stuNumber+'\',\''+examCode+'\',\'0\')"><i class="iconfont icon-edit"></i>答题情况</a>'
                                +'<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="stuInfo(\''+data.stuNumber+'\')"><i class="iconfont icon-edit"></i>个人信息</a>';
                            } else {
                                return '<a class="layui-btn layui-btn-blue layui-btn-mini links_edit" href="#" onclick="stuExam(\''+data.stuNumber+'\',\''+examCode+'\',\'1\')"><i class="iconfont icon-edit"></i>答题情况</a>'
                                +'<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="stuInfo(\''+data.stuNumber+'\')"><i class="iconfont icon-edit"></i>个人信息</a>';
                            }
                        }
                    }
                ]]
            });
        });
        return false;
    });
});

function stuExam(stuNumber,examCode,code) {
    if (code=='0' || code==0) {
        layui.use('layer', function () {
            layui.layer.alert('<span style="font-size:16px;">未参加小测</span>', {icon: 2});
        });
    } else {
        layui = window.parent.layui;
        layui.use('layer', function () {
            layui.layer.open({
                type: 2,
                title: '小测情况',
                shadeClose: true,
                shade: false,
                //maxmin: true, //开启最大化最小化按钮
                area: ['100%', '100%'],
                content: '/html/exam/index.html?number=' + examCode + '&seeExamResult=1&stuNumber='+stuNumber
            });
        });
    }
}

function stuInfo(stuNumber) {
    layui = window.parent.layui;
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: '学生信息',
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['90%', '90%'],
            content: '/html/teacher/views/stuInfo.html?stuNumber='+stuNumber
        });
    });
}