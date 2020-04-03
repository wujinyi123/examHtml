function pageStudent() {
    sex = $('select[name="sex"]').val();
    term = $('input[name="term"]').val();
    $('#students').html("");
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#students',
            url: '/back/manage/pageStudent?sex='+sex+'&term='+term,
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
                {field: 'number', title: '学号', sort: true},
                {field: 'name', title: '姓名', sort: true},
                {field: 'sex', title: '性别', sort: true},
                {field: 'college', title: '学院', sort: true},
                {field: 'collegeCode', title: '学院代码', sort: true},
                {field: 'clazz', title: '班级号', sort: true},
                {field: 'clazzName', title: '专业', sort: true},
                {field: 'tel', title: '电话', sort: true},
                {field: 'email', title: '邮箱', sort: true}
            ]]
        });
    });
}

var errorStudent = {};
layui.use('upload', function(){
    var upload = layui.upload;
     
    //执行实例
    var uploadInst = upload.render({
      elem: '#insert' //绑定元素
      ,url: '/back/manage/insert?type=student' //上传接口
      ,accept: 'file'
      ,done: function(res){
        //上传完毕回调
        if (res.data.msg!='ok') {
            layui.use('layer', function () {
                layui.layer.alert('<span style="color:red; font-size:16px;">'+res.data.msg+'</span>', {icon: 2});
            });
            return;
        }
        if (res.data.fail=='0') {
            layui.use('layer', function () {
                layui.layer.alert('<span style="font-size:16px;">全部数据上传成功，共'+res.data.success+'条</span>', {icon: 1});
            });
        } else {
            $('#errorTbodys').children().remove();
            $('#errorSpan').html("以下是导入出错的信息，共"+res.data.fail+"条  ");
            errorStudent = {type:"student",dataList:res.data.dataList};
            $.each(res.data.dataList, function (index, value) {
                newTr = $('<tr>');

                td1 = $('<td>');
                td1.html(value[0]);
                newTr.append(td1);
                
                td2 = $('<td>');
                td2.html(value[1]);
                newTr.append(td2);
                
                td3 = $('<td>');	
                td3.html(value[2]);
                newTr.append(td3);
                
                td4 = $('<td>');
                td4.html(value[3]);
                newTr.append(td4);

                td5 = $('<td>');
                td5.html(value[4]);
                newTr.append(td5);

                td6 = $('<td>');
                td6.html(value[5]);
                newTr.append(td6);

                td7 = $('<td>');
                td7.html(value[6]);
                newTr.append(td7);

                td8 = $('<td>');
                td8.html(value[7]);
                newTr.append(td8);

                $('#errorTbodys').append(newTr);
            });
            $('#errorExcel').attr("href","/back/manage/insertError?type=student&uuid="+res.data.uuid);
            $('#insertError').css('display','block');
            window.location.hash = "#insertError";
            layui.use('layer', function () {
                layui.layer.alert('<span style="color:red; font-size:16px;">部分数据上传失败，成功'+res.data.success+'条，失败'+res.data.fail+'条</span>', {icon: 2});
            });
        }
      }
      ,error: function(){
        //请求异常回调
      }
    });
  });