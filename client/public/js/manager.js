//Định vị địa chỉ gốc của người dùng
$(document).on("click", ".dinhvi", function () {
    var id = $(this).parent().attr('class'); //id request 
    var status = $("#status" + id).text();
    var addr = $("#Addr" + id).text();
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

    if (status == 'Đã nhận xe') {
        if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }
        var tempstartcoor = $("#startcoor" + id).val();
        var startcoor = JSON.parse(tempstartcoor);
        var tempendcoor = $("#endcoor" + id).val();
        var endcoor = JSON.parse(tempendcoor);
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        calcRoute(directionsService, directionsDisplay, startcoor, endcoor);
        console.log(startcoor);
    } else {
        if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }
        codeAddress(addr);
    }
});

//map, geocoder, marker
var map, geocoder, marker;
var pos = {
    lat: -34.397,
    lng: 150.644
};
var directionsDisplay = null;
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
    geocoder.geocode({
        'address': address
    }, function (results, status) {
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
        geocoder.geocode({
            'location': evt.latLng
        }, function (results, status) {
            //check OK
            if (status == 'OK') {
                if (results[0]) {
                    //check dòng nào đang được chọn (actived)
                    $.each($('tr'), function (index, val) {
                        //check bởi css (dòng actived sẽ được highlight)
                        if ($(val).css("font-weight") == 700) {
                            //cập nhật địa chỉ mới
                            $("#newAddr" + $(val).attr('id')).text(results[0].formatted_address);
                        }
                    });
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
        console.log("marker is being dragged");
    });
}

var s = '';
var id = 0;
var loadRequest = function () {
    // Chỉ load request khi đã đăng nhập
    if (Cookies.get('manager_auth') == "true") {
        var instance = axios.create({
            baseURL: 'http://localhost:3000/manager',
            timeout: 15000
        });

        instance.get(s)
            .then(function (res) {
                if (res.status === 200) {
                    s = 'receiving';
                    var source = document.getElementById('template').innerHTML;
                    var template = Handlebars.compile(source);
                    var html = template(res.data.requests);
                    id = Math.max.apply(Math, res.data.requests.map(function (o) {
                        return o.Id;
                    }));
                    document.getElementById('list').innerHTML = html;
                } else if (res.status === 204) {
                    $.ajax({
                        method: 'GET',
                        url: '/manager/getExistDataChanged',
                        data: {
                            id: id
                        },
                        success: (res) => {
                            res.newData.forEach(request => {
                                if ($("#status" + request.Id).text() !== request.Status) {
                                    $("#status" + request.Id).text(request.Status);
                                }
                            });
                        },
                        error: (err) => {
                            console.log(err);
                        }
                    });
                }
            }).catch(function (err) {
                console.log(err);
                if (err.response.status === 401) {
                    alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                    logout();
                    $("#loginModal").modal('show');
                }
            }).then(function () {
                loadRequest();
            });
    }
};

$(document).ready(function () {
    //check login
    if (Cookies.get('manager_auth') == "true") {
        loadRequest();
        //thêm tên user
        var user = JSON.parse(Cookies.get('manager').substring(2));
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
});

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
});

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
            var user = JSON.parse(Cookies.get('manager').substring(2));
            $("#userDropdown").append(user.Name);
            $("#loginModal").modal('hide');
            loadRequest();
            setTimeout(function () {
                alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                logout();
                $("#loginModal").modal('show');
            }, 600000);
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
    Cookies.remove('manager_token');
    Cookies.remove('manager');
    Cookies.set('manager_auth', false);
    $("#userDropdown").text("");
    $("#userDropdown").append('\<i class="fa fa-user-circle fa-fw"></i>');
    setDropDownItem(false);
    //clear table data
    $("#dataTable tbody").empty();
    //set s request = ''
    s = '';
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

// tìm đường đi
function calcRoute(directionsService, directionsDisplay, startcoor, endcoor) {
    var start = new google.maps.LatLng(startcoor.lat, startcoor.lng);
    var end = new google.maps.LatLng(endcoor.lat, endcoor.lng);
    var bounds = new google.maps.LatLngBounds();
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
        } else {
            alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
    });
}