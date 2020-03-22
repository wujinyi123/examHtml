layui.use(['form','layer'], function(){   
    layui.form.on('submit(formExams)', function(dataForm) {
        pageExam();
        return false;
    });
});

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
                {field: 'examName', title: '小测名称', sort: true},
                {field: 'score', title: '小测总分', sort: true},
                {field: 'time', title: '总时间', sort: true},
                {field: 'pdDate', title: '开始时间', sort: true},
                {field: 'expDate', title: '结束时间', sort: true},
                {
                    field: 'id', title: '操作', sort: true, templet: function (data) {
                        return '<a class="layui-btn layui-btn-blue layui-btn-mini links_edit" href="#" onclick="seeExam(\''+data.examCode+'\')"><i class="iconfont icon-edit"></i>查看</a>'
                        +'<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="seeExam(\''+data.examCode+'\')"><i class="iconfont icon-edit"></i>删除</a>';
                    }
                }
            ]]
        });
    });
}

pageExam();