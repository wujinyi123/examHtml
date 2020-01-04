$.ajax({
    type: "POST",
    url: "/login/getStudent",
    dataType: "json",
    success: function (data) {
        if (data.state == 0 || data.state == "0") {
            layui.use('layer', function () {
                layui.layer.alert('<span style="color: #FF0000; font-size:16px;">登录已超时或未登录</span>', {icon: 2}, function () {
                    window.location.href = "/login.html";
                });
            });
            setTimeout(function () {
                window.location.href = "/login.html";
            }, 3000);
        } else {
            $('input[name="student_id"]').val(data.id);
            $('#student_name').val("姓名：" + data.name);
            $('#student_number').val("学号：" + data.number);
        }
    },
    error: function (e) {
        console.log(e);
    }
});

var sec = 1;
var min;
var type = ["single", "multiple"];
var input_type = ["radio", "checkbox"];
var number = window.location.href.split('=')[1];
$.ajax({
    type: "POST",
    url: "/test/getTestByNumber",
    data: {"number": number},
    dataType: "json",
    success: function (data) {
        function forEach(questions, num) {
            $.each(questions, function (index, value) {
                liElement = $('<li>');
                liElement.html('<a href="#qu_' + num + '_' + index + '">' + (index + 1) + '</a>');
                $("#" + type[num] + "_tree").append(liElement);

                question_li = $('<li id="qu_' + num + '_' + index + '">');

                question_div = $('<div class="test_content_nr_tt">');
                question_div.html('<i>' + (index + 1) + '</i><span>(' + value.score + '分)</span><font>' + value.question + '</font><b class="icon iconfont">&#xe881;</b>');

                answer_div = $('<div class="test_content_nr_main">');

                answer_ul = $('<ul>');
                var options = ["A", "B", "C", "D"];
                var answers = [value.option_a, value.option_b, value.option_c, value.option_d];
                for (i = 0; i < 4; i++) {
                    answer_li = $('<li class="option">');
                    answer_li.html('<input value="' + options[i] + '" onclick="changeClass(' + num + ',' + index + ')" type="' + input_type[num] + '" class="radioOrCheck" name="' + type[num] + '_answer_' + index + '" id="' + type[num] + '_answer_' + index + '_option_' + options[i] + '" /><label for="' + type[num] + '_answer_' + index + '_option_' + options[i] + '">&nbsp;&nbsp;' + options[i] + '.<p class="ue" style="display: inline;">' + answers[i] + '</p></label>');
                    answer_ul.append(answer_li);
                }
                answer_div.append(answer_ul);
                question_li.append(question_div);
                question_li.append(answer_div);
                $("#" + type[num] + "_questions").append(question_li);

            });
        }

        min = data.time;
        min = 1;
        $("#test_number").text("考试码：" + data.number);
        $("#test_name").text("考试名：" + data.test_name);
        $("#test_points").text("总分：" + data.test_points);
        $('input[name="number"]').val(data.number);
        $('input[name="single_num"]').val(data.single_num);
        $('input[name="multiple_num"]').val(data.multiple_num);
        $("#single_num").text(data.single_num);
        $("#single_num2").text(data.single_num);
        $("#single_score").text(data.single_score);
        $("#multiple_num").text(data.multiple_num);
        $("#multiple_num2").text(data.multiple_num);
        $("#multiple_score").text(data.multiple_score);

        forEach(data.singles, 0);
        forEach(data.multiples, 1);
        setCountDown_time();
    },
    error: function (e) {
        console.log(e);
    }
});

function changeClass(num, index) {
    the_answer = $('input[name="' + type[num] + '_answer_' + index + '"]:checked').val();
    cardLi = $('a[href=#qu_' + num + '_' + index + ']'); // 根据题目ID找到对应答题卡
    // 设置已答题
    if (!cardLi.hasClass('hasBeenAnswer')) {
        cardLi.addClass('hasBeenAnswer');
    }
    if (the_answer == undefined || the_answer == null || the_answer == "") {
        cardLi.removeClass('hasBeenAnswer');
    }
}

var idt;
var format = function (str) {
    if (parseInt(str) < 10) {
        return "0" + str;
    }
    return str;
};

function setCountDown_time() {
    idt = window.setInterval("ls()", 1000);
}

function ls() {
    sec--;
    if (sec == 0) {
        min--;
        sec = 59;
    }

    if (min == 0 && sec == 1) {
        window.clearInterval(idt);
        $('#test_submit').remove();
        layui.use('layer', function () {
            layui.layer.alert('<span style="color: #FF0000; font-size:16px;">考试时间已到，试卷已被提交。正在计算成绩，请稍等。</span><br/><br/><span style="color: springgreen; font-size:18px;">感谢您的使用！</span>', {icon: 1});
        });
        submit_form();
    }
    $('#test_time').html(format(min) + ":" + format(sec));
}

function update_index(data) {

    $('#test_time').html("考试成绩：" + data.points);
    layui.use('layer', function () {
        layui.layer.alert('<span style="font-size:16px;">考试成绩：<span style="color: #FF0000; font-size:18px;">' + data.points + '</span></span>', {icon: 1});
    });

    function resultEach(checkAnswer, stuAnswer, num) {
        $.each(checkAnswer, function (index, value) {
            var str = "";
            var tanswer = value.answer;
            var result_div = $('<div class="test_content_nr_tt">');
            if (stuAnswer[index] == tanswer) {
                result_div.html('<span style="width: 200px; display:inline-block; font-size:16px;">本题结果：<span style="color: springgreen; font-size:18px;">正确</span></span><span style="width: 200px; display:inline-block; font-size:16px;">正确答案：<span style="color: springgreen; font-size:18px;">' + tanswer + '</span></span>');
                $('a[href="' + '#qu_' + num + '_' + index + '"]').css("background-color", "rgba(0,238,0,0.5)");
            } else {
                if (stuAnswer[index].trim() == "") {
                    result_div.html('<span style="width: 200px; display:inline-block; font-size:16px;">本题结果：<span style="color: #FF0000; font-size:18px;">错误</span></span><span style="width: 200px; display:inline-block; font-size:16px;">正确答案：<span style="color: springgreen; font-size:18px;">' + tanswer + '</span></span><span style="width: 200px; display:inline-block; font-size:16px;">你的答案：<span style="color: #FF0000; font-size:18px;">无</span></span>');
                } else {
                    result_div.html('<span style="width: 200px; display:inline-block; font-size:16px;">本题结果：<span style="color: #FF0000; font-size:18px;">错误</span></span><span style="width: 200px; display:inline-block; font-size:16px;">正确答案：<span style="color: springgreen; font-size:18px;">' + tanswer + '</span></span><span style="width: 200px; display:inline-block; font-size:16px;">你的答案：<span style="color: #FF0000; font-size:18px;">' + stuAnswer[index] + '</span></span>');
                }
                $('a[href="' + '#qu_' + num + '_' + index + '"]').css("background-color", "rgba(238,0,0,0.5)");
                for (i = 0; i < stuAnswer[index].length; i++) {
                    $('label[for="' + type[num] + '_answer_' + index + '_option_' + stuAnswer[index][i] + '"]').css("background-color", "rgba(238,0,0,0.3)");
                }
            }
            for (i = 0; i < tanswer.length; i++) {
                $('label[for="' + type[num] + '_answer_' + index + '_option_' + tanswer[i] + '"]').css("background-color", "rgba(0,238,0,0.3)");
            }
            $('#qu_' + num + '_' + index).append(result_div);
        });
    }

    resultEach(data.singleList, data.student_singles, 0);
    resultEach(data.multipleList, data.student_multiples, 1);
}

function submit_form() {
    $.ajax({
        type: "POST",
        url: "/answer/submitAnswer",
        data: $('#test_form').serialize(),
        dataType: "json",
        success: function (data) {
            var ti = 0;
            wait_time = window.setInterval(function () {
                ti++;
                if (ti == 5) update_index(data);
            }, 1000);

        },
        error: function (e) {
            console.log(e);
        },
    });
}

$('#test_submit').click(function () {
    window.clearInterval(idt);
    $('#test_submit').remove();
    layui.use('layer', function () {
        layui.layer.alert('<span style="color: #FF0000; font-size:16px;">试卷已被提交。正在计算成绩，请稍等。</span><br/><br/><span style="color: springgreen; font-size:18px;">感谢您的使用！</span>', {icon: 1});
    });
    submit_form();
})