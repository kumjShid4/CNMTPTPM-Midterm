$("#bookingBtn").click(function () {
    $("html, body").animate({ scrollTop: $(document).height() }, 1500);
});

//Kiểm tra các input của form request (ngoại trừ input note)
//Nếu có một input rỗng, disable button request
//ngược lại enable
function doCheck() {
    var allFilled = true;
    $('.request:not(#note)').each(function () {
        if ($(this).val() == '') {
            allFilled = false;
        }
    });
    $('#requestBtn').prop('disabled', !allFilled);
    if (allFilled) {
        $('#requestBtn').removeAttr('disabled');
    }
}

//ready event
$(document).ready(function () {
    //check
    doCheck();
    //event key up request form
    $('.request').keyup(doCheck);
    //check login
    if (Cookies.get('user_auth') == "true") {
        //thêm tên user
        var user = JSON.parse(Cookies.get('user').substring(2));
        $("#userDropdown").append(user.Name);
        //hidden login, signup dropdown item
        //show logout
        setDropDownItem(true);
    } else {
        //show login, signup dropdown item
        //hidden logout
        setDropDownItem(false);
    }
});

//Kiểm tra các input của form login
//Nếu có một input rỗng, disable button login
//ngược lại enable
$("#loginForm").keyup(function() {
    var allFilled = true;
    $('.login').each(function () {
        if ($(this).val() == '') {
            allFilled = false;
        }
    });

    $('#loginBtn').prop('disabled', !allFilled);
    if (allFilled) {
        $('#loginBtn').removeAttr('disabled');
    }
});

//Kiểm tra các input của form signup
//Nếu có một input rỗng, disable button signup
//ngược lại enable
$("#signupForm").keyup(function() {
    var allFilled = true;
    $('.signup').each(function () {
        if ($(this).val() == '') {
            allFilled = false;
        }
    });

    $('#signupBtn').prop('disabled', !allFilled);
    if (allFilled) {
        $('#signupBtn').removeAttr('disabled');
    }
});

//event click request button
$("#requestBtn").click(function (e) {
    //cancel submit form
    e.preventDefault();
    //get form data
    var data = $("#requestForm").serialize();
    //ajax request
    $.ajax({
        method: 'POST',
        url: '/receiver',
        data: data,
        success: (res) => {
            alert("Thành công");
        },
        statusCode: 
        {            
            401 : function() {
                alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                logout();
            },
            403: function() {
                alert("Vui lòng đăng nhập trước khi đặt xe");
                $("#loginModal").modal('show');
            }       
        },
        error: (err) => {
            console.log(err);
        }
    });
});

//event login button click
$("#loginBtn").click(function (e) {
    //cancel submit form
    e.preventDefault();
    //get data
    var data = $("#loginForm").serialize();
    //ajax
    $.ajax({
        method: 'POST',
        url: '/user/login',
        data: data,
        success: (res) => {
            alert("Thành công");
            setDropDownItem(true);
            //thêm tên user
            var user = JSON.parse(Cookies.get('user').substring(2));
            $("#userDropdown").append(user.Name);
            $("#loginModal").modal('hide');
            setTimeout(function(){  alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                                    logout();},600000);
        },
        error: (err) => {
            alert("Đăng nhập không thành công, vui lòng thử lại");
            console.log(err);
        }
    });
});

//event signup button click
$("#signupBtn").click(function (e) {
    //cancel submit form
    e.preventDefault();
    //get data
    var data = $("#signupForm").serialize();
    //check confirm password
    if ($("#signupPassword").val() == $("#confirmPassword").val()) {
        //ajax
        $.ajax({
            method: 'POST',
            url: '/user/register',
            data: data,
            success: (res) => {
                alert("Thành công");
                $("#signupModal").modal('hide');
            },
            error: (err) => {
                if (err.status == 400) {
                    alert("Tài khoản đã tồn tại");
                } else {
                    alert("Đăng kí không thành công, vui lòng thử lại");                    
                }
            }
        });
    } else {
        alert("Mật khẩu xác nhận không đúng");
    }
});

//logout
function logout() {
  //remove token, name user trong cookie
  Cookies.remove('user_token');
  Cookies.remove('user');
  Cookies.set('user_auth', false);
  $("#userDropdown").text("");
  $("#userDropdown").append('\<i class="fa fa-user-circle fa-fw"></i>');
  setDropDownItem(false);
}

$("#logoutDropdown").click(function () {
  logout();
});

//set trạng thái cho các dropdown item
function setDropDownItem(isAuth) {
    if (isAuth) {
        $("#loginDropdown").attr("hidden", true);
        $("#signupDropdown").attr("hidden", true);
        $("#logoutDropdown").attr("hidden", false);
    } else {
        $("#loginDropdown").attr("hidden", false);
        $("#signupDropdown").attr("hidden", false);
        $("#logoutDropdown").attr("hidden", true);
    }
}
