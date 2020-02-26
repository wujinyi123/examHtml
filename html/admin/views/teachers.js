$.ajax({
    type: "POST",
    url: "/back/mb/listCollege",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify({}),
    success: function(data){
        colleges = data.data;
        $.each(colleges, function (index, value) {
            $("#college").append('<option value="'+value.code+'">'+value.name+'</option>');
        });
    },
    error:function(e){
        console.log(e);
    }
});