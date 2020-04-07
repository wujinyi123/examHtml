var laydate = layui.laydate;
//日期时间选择器
laydate.render({
    elem: '#expDate'
    ,type: 'datetime'
    ,trigger: 'click'
});

var thisNewExam = {};
var newExamData = {};

//转化正整数
function zhzs(value){
    value = value.replace(/[^\d]/g,'');
    if(''!=value){
     value = parseInt(value);
    }
    return value;
}

function zhzs2(value){
    value = value.replace(/[^\d]/g,'');
    if(''!=value){
     value = parseInt(value);
    }

    if ($('#singleScore').val()!='' && $('#examScore').val()!='') {
        $('#multipleScore').val(parseInt($('#examScore').val())-parseInt($('#singleScore').val()));
        return value;
    }

    return value;
}

function imgUpload(imgName) {
    arr = imgName.split("_");
    titleName = '';
    if (arr[0]=='single') {
        titleName = '单选题-第' + (parseInt(arr[1])) + '题-';
    } else {
        titleName = '多选题-第' + (parseInt(arr[1])) + '题-';
    }

    if (arr[2]=='question') {
        titleName = titleName + '题目';
    } else if (arr[2]=='analysis') {
        titleName = titleName + '答案解析';
    } else {
        titleName = titleName + arr[2] + '选项';
    }
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: titleName,
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['50%', '80%'],
            content: '/html/exam/img.html?examCode='+$('#examCode').val()+'&imgName=' + imgName + '&imgsrc=' + $('#'+imgName+'_img').text()
        });
    });
    window.location.hash = "#"+imgName;
}

function deleteImg(imgId) {
    if ($('#'+imgId).html()=='') {
        layui.use('layer', function () {
            layui.layer.alert('<span style="color: #FF0000; font-size:16px;">没有该图片</span>', {icon: 2});
        });
        return;
    }

    $.ajax({
        type: "POST",
        url: "/back/exam/deleteImg",
        dataType: "json",
        data: 'imgUrl='+$('#'+imgId).html(),
        success: function(data){
            if (data.data=='ok') {
                layui.use('layer', function () {
                    layui.layer.alert('<span style="font-size:16px;">已删除图片</span>', {icon: 1});
                });
                $('#'+imgId).html('');
            } else {
                layui.use('layer', function () {
                    layui.layer.alert('<span style="color: #FF0000; font-size:16px;">没有该图片</span>', {icon: 2});
                });
            }
        },
        error:function(e){
            console.log(e);
        }
    });
}

function enterQuestions(name,type,num,score) {
    questions = $('<div>');
    questions.html(name+"（共"+num+"题，共"+score+"分）");
    $("#examForm").append(questions);
    $("#examForm").append($('<hr class="layui-bg-red">'));
    for(i=0; i<num; i++) {
        questionScore = parseInt(score/num);
        getMod = score - num*questionScore;
        if (getMod+i>=num) {
            questionScore = questionScore+1;
        }

        labels = ['第'+(i+1)+'题,'+questionScore+'分','A选项','B选项','C选项','D选项','答案','答案解析'];
        idNames = ['question','A','B','C','D','ans','analysis'];
        $.each(labels, function (index, value) {
            thisDiv = $('<div class="layui-form-item">');
            thisLabel = $('<label class="layui-form-label">');
            thisLabel.html(value);

            thisIdName = type+'_'+(i+1)+'_'+idNames[index];
            thisInputDiv = $('<div class="layui-input-block">');
            if (index==5) {
                if (type=='single') {
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="A" title="A" checked>'));
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="B" title="B">'));
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="C" title="C">'));
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="D" title="D">'));
                } else {
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="A" title="A">'));
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="B" title="B">'));
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="C" title="C">'));
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="D" title="D">'));
                }
            } else {
                thisInputDiv.append($('<input type="text" id="'+thisIdName+'" name="'+thisIdName+'" required lay-verify="required" placeholder="请输入内容" autocomplete="off" class="layui-input">'));
                btn = $('<a class="layui-btn layui-btn-blue" href="#">上传/查看图片</a>');
                btn.attr('onclick', 'imgUpload("'+thisIdName+'")');
                thisInputDiv.append(btn);
                thisInputDiv.append('<button type="button" onclick="deleteImg(\''+thisIdName+'_img'+'\')" class="layui-btn layui-btn-danger"><i class="layui-icon"></i></button>');
                thisInputDiv.append($('<label id="'+thisIdName+'_img">'))
            }

            thisDiv.append(thisLabel);
            thisDiv.append(thisInputDiv);
            $("#examForm").append(thisDiv);
        });
        $("#examForm").append($('<hr class="layui-bg-blue">'));
    }
}

function theFormEnd(thisData) {
    $("#examForm").append('<input type="text" id="examCode" name="examCode" value="'+thisData.examCode+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="examName" name="examName" value="'+thisData.examName+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="teacherNumber" name="teacherNumber" value="'+thisData.teacherNumber+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="score" name="score" value="'+thisData.score+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="time" name="time" value="'+thisData.time+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="expTime" name="expTime" value="'+thisData.expTime+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="singles" name="singles" value="'+thisData.singles+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="singleScore" name="singleScore" value="'+thisData.singleScore+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="multiples" name="multiples" value="'+thisData.multiples+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="multipleScore" name="multipleScore" value="'+thisData.multipleScore+'" style="display:none;"/>');

    formSubmit = $('<div class="layui-form-item">');

    finishDiv = $('<div class="layui-input-block">');
    finishDiv.append($('<input type="checkbox" id="isOK" name="isOK" lay-skin="primary" required lay-verify="required" value="ok" title="确定无误">'));
    formSubmit.append(finishDiv);

    formSubmitDiv = $('<div class="layui-input-block">');
    buttonSubmit = $('<button class="layui-btn layui-btn-blue" lay-submit lay-filter="formExam">');
    buttonSubmit.html("立即提交");
    buttonReset = $('<button type="reset" class="layui-btn layui-btn-primary">');
    buttonReset.html("重置");
    formSubmitDiv.append(buttonSubmit);
    formSubmitDiv.append(buttonReset);
    formSubmit.append(formSubmitDiv);
    $("#examForm").append(formSubmit);
}

function getList(examCode,typeCode,type,score,num) {
    dataList = [];
    for(i=0; i<num; i++) {
        questionScore = parseInt(score/num);
        getMod = score - num*questionScore;
        if (getMod+i>=num) {
            questionScore = questionScore+1;
        }

        answer = '';
        $('input[name="'+type+'_'+(i+1)+'_ans'+'"]:checked').each(function(){   
            answer = answer + $(this).val();  
        });
        if (answer=='' || (type=='multiple' && answer.length==1)) {
            return null;
        }

        data = {
            id:(i+1),
            examCode:examCode,
            type:typeCode,
            score:questionScore,
            question:$('#'+type+'_'+(i+1)+'_question').val(),
            optionA:$('#'+type+'_'+(i+1)+'_A').val(),
            optionB:$('#'+type+'_'+(i+1)+'_B').val(),
            optionC:$('#'+type+'_'+(i+1)+'_C').val(),
            optionD:$('#'+type+'_'+(i+1)+'_D').val(),
            answer:answer,
            analysis:$('#'+type+'_'+(i+1)+'_analysis').val(),
            imgQuestion:$('#'+type+'_'+(i+1)+'_question_img').html(),
            imgA:$('#'+type+'_'+(i+1)+'_A_img').html(),
            imgB:$('#'+type+'_'+(i+1)+'_B_img').html(),
            imgC:$('#'+type+'_'+(i+1)+'_C_img').html(),
            imgD:$('#'+type+'_'+(i+1)+'_D_img').html(),
            imgAnalysis:$('#'+type+'_'+(i+1)+'_analysis_img').html()
        };
        dataList.push(data);
    }
    return dataList;
}

// function examNotice(examCode) {
//     layui.use('layer', function () {
//         layui.layer.open({
//             type: 2,
//             title: '通知班级',
//             // shadeClose: false,
//             // shade: false,
//             //maxmin: true, //开启最大化最小化按钮
//             area: ['80%', '80%'],
//             content: '/html/exam/notice.html?examCode='+examCode
//         });
//     });
// }

layui.use(['form','layer'], function(){   
    layui.form.on('submit(newExam)', function(dataForm){
        examName = $('#examName').val();
        examScore = $('#examScore').val();
        examTime =  $('#examTime').val();
        expDate =  $('#expDate').val();
        singles =  $('#singles').val();
        singleScore =  $('#singleScore').val();
        multiples =  $('#multiples').val();
        multipleScore =  $('#multipleScore').val();
        if (parseInt(examScore)==NaN || parseInt(examTime)==NaN || parseInt(singles)==NaN
            || parseInt(singleScore)==NaN || parseInt(multiples)==NaN || parseInt(multipleScore)==NaN
            || parseInt(examScore)!=parseInt(singleScore)+parseInt(multipleScore)
            || parseInt(singles)>parseInt(singleScore)
            || parseInt(multiples)>parseInt(multipleScore)) {
            layui.use('layer', function () {
                layui.layer.alert('<div style="color: #FF0000; font-size:16px;"><div>正整数输入有误，请重新检查数据，使之符合以下条件</div><div>总分=单选题总分+多选题总分</div><div>单选题总分>=单选题数</div><div>多选题数>=多选题数</div></div>', {icon: 2});
            });
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/back/exam/getNewExamCode",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({}),
            success: function(data){

                thisNewExam = {
                    examCode:data.data.code,
                    examName:examName,
                    teacherNumber:data.data.number,
                    score:examScore,
                    time:examTime,
                    expTime:expDate,
                    singles:singles,
                    singleScore:singleScore,
                    multiples:multiples,
                    multipleScore:multipleScore
                };
                $("#examForm").html("");
                layui.use('form', function(){
                    var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                    enterQuestions("单选题","single",thisNewExam.singles,thisNewExam.singleScore);
                    enterQuestions("多选题","multiple",thisNewExam.multiples,thisNewExam.multipleScore);
                    theFormEnd(thisNewExam);
                    form.render();
                });

                layui.use('upload', function(){
                    var upload = layui.upload;
                    //执行实例
                    var uploadInst = upload.render({
                      elem: '#insert' //绑定元素
                      ,url: '/back/exam/importExam?singles='+singles+'&multiples='+multiples //上传接口
                      ,accept: 'file'
                      ,done: function(res){
                        //上传完毕回调
                        function get(type,list) {
                            $.each(list,function(index,value){
                                $('#'+type+'_'+(index+1)+'_question').val(value.question);
                                $('#'+type+'_'+(index+1)+'_A').val(value.optionA);
                                $('#'+type+'_'+(index+1)+'_B').val(value.optionB);
                                $('#'+type+'_'+(index+1)+'_C').val(value.optionC);
                                $('#'+type+'_'+(index+1)+'_D').val(value.optionD);
                                $('#'+type+'_'+(index+1)+'_analysis').val(value.analysis);
                                if (value.answer!=undefined && value.answer!=null && value.answer!='') {
                                    $('input[name="'+type+'_'+(i+1)+'_ans'+'"]').each(function(){ 
                                        if(value.answer.indexOf($(this).val())>=0) {
                                            $(this).prop("checked",true);
                                        }
                                    });
                                }
                                layui.use('form', function(){
                                    var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                                    form.render();
                                });
                            });
                        }

                        get('single',res.data.singleList);
                        get('multiple',res.data.multipleList);
                      }
                      ,error: function(){
                        //请求异常回调
                      }
                    });
                });
                
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });

    layui.form.on('submit(formExam)', function(dataForm){
        examCode =  $('#examCode').val();
        examName =  $('#examName').val();
        teacherNumber =  $('#teacherNumber').val();
        score =  $('#score').val();
        time =  $('#time').val();
        expTime =  $('#expTime').val();
        singles =  $('#singles').val();
        singleScore =  $('#singleScore').val();
        multiples =  $('#multiples').val();
        multipleScore =  $('#multipleScore').val();

        singleList = getList(examCode,'1','single',singleScore,singles);
        multipleList = getList(examCode,'2','multiple',multipleScore,multiples);

        if (singleList==null || multipleList==null) {
            layui.use('layer', function () {
                layui.layer.alert('<span style="color: #FF0000; font-size:16px;">部分多选题，答案未选或只选了一个，请重新检查</span>', {icon: 2});
            });
            return false;
        }

        isOK = '';
        $('input[name="isOK"]:checked').each(function(){   
            isOK = isOK + $(this).val();  
        });
        if (isOK=='') {
            layui.use('layer', function () {
                layui.layer.alert('<span style="color: #FF0000; font-size:16px;">请勾选确认无误</span>', {icon: 2});
            });
            return false;
        }

        newExamData = {
            examCode:examCode,
            examName:examName,
            teacherNumber:teacherNumber,
            score:score,
            time:time,
            expTime:expTime,
            singleList:singleList,
            multipleList:multipleList
        };
        $.ajax({
            type: "POST",
            url: "/back/exam/newBuiltExam",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(newExamData),
            success: function(data){
                if (data.data.state=='ok') {
                    $("#examForm").html("");

                    itemDiv = $('<div class="layui-form-item">');
                    inputDiv = $('<div class="layui-input-block">');
                    inputDiv.append('<input type="text" class="layui-input" disabled="disabled" value="'+data.data.examCode+'">');
                    itemDiv.append('<label class="layui-form-label">考试码</label>');
                    itemDiv.append(inputDiv);
                    $("#examForm").append(itemDiv);

                    itemDiv = $('<div class="layui-form-item">');
                    inputDiv = $('<div class="layui-input-block">');
                    inputDiv.append('<input type="text" class="layui-input" disabled="disabled" value="'+data.data.examName+'">');
                    itemDiv.append('<label class="layui-form-label">小测名称</label>');
                    itemDiv.append(inputDiv);
                    $("#examForm").append(itemDiv);

                    itemDiv = $('<div class="layui-form-item">');
                    inputDiv = $('<div class="layui-input-block">');
                    inputDiv.append('<input type="text" class="layui-input" disabled="disabled" value="'+data.data.score+'">');
                    itemDiv.append('<label class="layui-form-label">小测总分</label>');
                    itemDiv.append(inputDiv);
                    $("#examForm").append(itemDiv);

                    itemDiv = $('<div class="layui-form-item">');
                    inputDiv = $('<div class="layui-input-block">');
                    inputDiv.append('<input type="text" class="layui-input" disabled="disabled" value="'+data.data.time+'分钟">');
                    itemDiv.append('<label class="layui-form-label">小测时间</label>');
                    itemDiv.append(inputDiv);
                    $("#examForm").append(itemDiv);

                    itemDiv = $('<div class="layui-form-item">');
                    inputDiv = $('<div class="layui-input-block">');
                    inputDiv.append('<input type="text" class="layui-input" disabled="disabled" value="'+data.data.expTime+'">');
                    itemDiv.append('<label class="layui-form-label">截止时间</label>');
                    itemDiv.append(inputDiv);
                    $("#examForm").append(itemDiv);

                    // itemDiv = $('<div class="layui-form-item">');
                    // inputDiv = $('<div class="layui-input-block">');
                    // inputDiv.append('<button class="layui-btn layui-btn-blue" onclick="examNotice(\''+data.data.examCode+'\')">通知班级</button>');
                    // itemDiv.append(inputDiv);
                    // $("#examForm").append(itemDiv);

                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">新建成功</span>', {icon: 1});
                    });
                } else {
                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">新建失败</span>', {icon: 2});
                    });
                }
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });
});


