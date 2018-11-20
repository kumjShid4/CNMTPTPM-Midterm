//Định vị địa chỉ gốc của người dùng
$(document).on("click", ".dinhvi", function () {
    var id = $(this).parent().attr('class'); //id request 
    var newAddr = $("#newAddr" + id).text(); //địa chỉ mới
    //set normat text cho tất cả các dòng
    $('tr').css({
        "color": "#000", 
        "font-weight": "normal"
    });
    //highlight dòng được click (active)
    $('#' + id).css({
        "color": "#00B140", 
        "font-weight": "bold"
    });
    //kiểm tra địa chỉ mới đã cập nhật chưa
    //nếu chưa cập nhật địa chỉ mới thì định vị địa chỉ cũ
    //ngược lại định vị địa chỉ mới
    if (newAddr == "") {
        $.ajax({
            method: 'POST',
            url: '/data/update',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
            }),
            success: (res) => {
                $("#status" + id).text("Đã định vị");
                //định vị địa chỉ gốc trên map
                codeAddress($("#addr" + id).children().text());
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
    else {
        //định vị địa chỉ mới trên map
        codeAddress(newAddr);
    }
})

//map, geocoder, marker
var map, geocoder, marker;
var pos = { lat: -34.397, lng: 150.644 };
//initMap
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 17
    });
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: pos
    });
    marker.addListener('click', toggleBounce);
    markerCoords(marker);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            marker.setPosition(pos);
        });
    }
}

//event drag marker
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.DROP);
    }
}

//gecoding
function codeAddress(address) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//reverse gecoding
function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
        geocoder.geocode({'location': evt.latLng}, function(results, status){
            //check OK
            if (status == 'OK') {
                if (results[0]) {
                    //check dòng nào đang được chọn (actived)
                    $.each($('tr'), function(index, val){
                        //check bởi css (dòng actived sẽ được highlight)
                        if ($(val).css("font-weight") == 700) {
                            //cập nhật địa chỉ mới
                            $("#newAddr" + $(val).attr('id')).text(results[0].formatted_address);
                        }
                    })
                }
                else {
                    console.log('No results found');
                }
            }
            else {
                console.log('Geocoder failed due to: ' + status);
            }
        })
    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
        console.log("marker is being dragged");
    });
}

var s = '';
var loadRequest = function () {
    // Chỉ load request khi đã đăng nhập
    if (Cookies.get('identifier_auth') == "true") {
        var instance = axios.create({
            baseURL: 'http://localhost:3002/data',
            timeout: 15000
        });

        instance.get(s)
        .then(function(res) {
            if (res.status === 200) {
                s = 'receiving';
                var source = document.getElementById('template').innerHTML;
                var template = Handlebars.compile(source);
                var html = template(res.data.requests);

                console.log(res.data.requests);

                if (res.data.isAll) {
                    document.getElementById('list').innerHTML = html;
                }
                else {
                    if (document.getElementById(`status${res.data.requests[0].Id}`)) {
                        // Đổi trạng thái
                        document.getElementById(`status${res.data.requests[0].Id}`).innerHTML = res.data.requests[0].Status;

                        // Thông tin tài xế
                        if (res.data.requests[0].DriverId != null) {
                            document.getElementById(`driver${res.data.requests[0].Id}`).innerHTML = res.data.requests[0].DriverId.Name + "<br>" + 
                                                                                                    res.data.requests[0].DriverId.Phone + "<br>" + 
                                                                                                    res.data.requests[0].DriverId.Email + "<br>" + 
                                                                                                    res.data.requests[0].DriverId.Status;
                        } else {
                            document.getElementById(`driver${res.data.requests[0].Id}`).innerHTML = '';
                        }
                    } else {
                        // Thêm request
                        document.getElementById('list').innerHTML = html + document.getElementById('list').innerHTML;
                    }
                }
            }
        }).catch(function(err) {
            console.log(err);
        }).then(function() {
            loadRequest();
        })
    }
}

$(document).ready(function () {
    //check login
    if (Cookies.get('identifier_auth') == "true") {
        loadRequest();
        //thêm tên user
        $("#userDropdown").append(Cookies.get('identifier_name'));
        //hidden login, signup dropdown item
        //show logout
        setDropDownItem(true);
    } else {
        //show login, signup dropdown item
        //hidden logout
        setDropDownItem(false);
    }
})

//Kiểm tra các input của form login
//Nếu có một input rỗng, disable button login
//ngược lại enable
$("#loginForm").keyup(function () {
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
})

//Kiểm tra các input của form signup
//Nếu có một input rỗng, disable button signup
//ngược lại enable
$("#signupForm").keyup(function () {
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
})

// event login button click
$("#loginBtn").click(function (e) {
    // cancel submit form
    e.preventDefault();
    // get data
    var data = $("#loginForm").serialize();
    // ajax
    $.ajax({
        method: 'POST',
        url: '/user/login',
        data: data,
        success: (res) => {
            alert("Thành công");
            setDropDownItem(true);
            //thêm tên user
            $("#userDropdown").append(Cookies.get('identifier_name'));
            $("#loginModal").modal('hide');
            loadRequest();
        },
        error: (err) => {
            alert("Đăng nhập không thành công, vui lòng thử lại");
            console.log(err);
        }
    })
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
                alert("Đăng kí không thành công, vui lòng thử lại");
                console.log(err);
            }
        })
    } else {
        alert("Mật khẩu xác nhận không đúng");
    }
});

//logout
$("#logoutDropdown").click(function () {
    //remove token, name user trong cookie
    Cookies.remove('identifier_token');
    Cookies.remove('identifier_name');
    Cookies.set('identifier_auth', false);
    $("#userDropdown").text("");
    $("#userDropdown").append('\<i class="fa fa-user-circle fa-fw"></i>')
    setDropDownItem(false);
    //clear table data
    $("#dataTable tbody").empty();
    //set s request = ''
    s = '';
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