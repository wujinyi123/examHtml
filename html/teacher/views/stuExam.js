layui.use(['form','layer'], function(){   
    layui.form.on('submit(formExams)', function(dataForm) {
        pageExam();
        return false;
    });
});


function seeExam(examCode) {
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: '查看试卷',
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['90%', '90%'],
            content: '/html/exam/seeExam.html?examCode='+examCode
        });
    });
}

function deleteExam(examCode) {
    $.ajax({
        type: "POST",
        url: "/back/exam/deleteExam?examCode="+examCode,
        dataType: "json",
        success: function(data){
            console.log(data);
            if (data.data==0 || data.data=='0') {
                layui.use('layer', function () {
                    layui.layer.alert('<span style="font-size:16px;">删除失败</span>', {icon: 2});
                });
            } else {
                layui.use('layer', function () {
                    layui.layer.alert('<span style="font-size:16px;">删除成功</span>', {icon: 1});
                });
            }
            pageExam();
        },
        error:function(e){
            console.log(e);
        }
    });
}

function examNotice(examCode) {
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: '通知班级',
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['80%', '80%'],
            content: '/html/exam/notice.html?examCode='+examCode
        });
    });
}

function pageExam() {
    examTerm = $('#examTerm').val();
    $('#exams').html("");
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#exams',
            url: '/back/exam/pageExam?examTerm='+examTerm,
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                limits: [5, 10, 15],
                limit: 5,
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
                {field: 'examCode', title: '考试码', sort: true},
                {field: 'examName', title: '名称', sort: true},
                {field: 'score', width:80, title: '总分', sort: true},
                {field: 'time', width:100, title: '总时间', sort: true},
                {field: 'pdDate', width:160, title: '开始时间', sort: true},
                {field: 'expDate', width:160, title: '结束时间', sort: true},
                {
                    field: 'id', width:240, title: '操作', sort: true, templet: function (data) {
                        return '<a class="layui-btn layui-btn-blue layui-btn-mini links_edit" href="#" onclick="seeExam(\''+data.examCode+'\')"><i class="iconfont icon-edit"></i>查看</a>'
                        +'<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="deleteExam(\''+data.examCode+'\')"><i class="iconfont icon-edit"></i>删除</a>'
                        +'<a class="layui-btn layui-btn-blue layui-btn-mini links_edit" href="#" onclick="examNotice(\''+data.examCode+'\')"><i class="iconfont icon-edit"></i>通知</a>';
                    }
                }
            ]]
        });
    });
}

pageExam();