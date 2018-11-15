

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

$(document).ready(function () {
    //check login
    if (Cookies.get('driver_auth') == "true") {
        //thêm tên user
        var user = JSON.parse(Cookies.get('driver').substring(2));
        $("#userDropdown").append(user["Name"]);
        setStatus(user["Status"] !== "Standby");
        //hidden login, signup dropdown item
        //show logout
        setDropDownItem(true);
    } else {
        //show login, signup dropdown item
        //hidden logout
        setDropDownItem(false);
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
            initMap();
            setDropDownItem(true);
            var user = JSON.parse(Cookies.get('driver').substring(2));
            //thêm tên user
            $("#userDropdown").append(user["Name"]);
            $("#loginModal").modal('hide');
            setStatus(user["Status"] !== "Standby");
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
    Cookies.remove('driver_token');
    Cookies.remove('driver');
    Cookies.set('driver_auth', false);
    ajaxStatus(false);    
    $("#userDropdown").text("");
    $("#userDropdown").append('\<i class="fa fa-user-circle fa-fw"></i>')
    setDropDownItem(false);
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

//set status
function setStatus(ready) {
    if (ready) {
        $("#ready").addClass("active");
        $("#standby").removeClass("active");
    } else {
        $("#standby").addClass("active");
        $("#ready").removeClass("active");
    }
}

//status ready
$("#ready").click(function () {
    ajaxStatus(true);
})

//status standby
$("#standby").click(function () {
    ajaxStatus(false);    
})

function ajaxStatus(ready) {
    if (Cookies.get('driver_auth') == "true") {
        var user = JSON.parse(Cookies.get('driver').substring(2));
        $.ajax({
            method: 'POST',
            url: '/data/status',
            data: {
                id: user.Id,
                status: ready === true ? "Ready" : "Standby"
            },
            success: (res) => {
                console.log("Thành công");
                setStatus(ready);
            },
            error: (err) => {
                console.log("Không thành công, vui lòng thử lại");
                console.log(err);
            }
        })
    }
}


function ajaxCurpos(pos) {
    if (Cookies.get('driver_auth') == "true") {
        var user = JSON.parse(Cookies.get('driver').substring(2));
        $.ajax({
            method: 'POST',
            url: '/data/curpos',
            data: {
                id: user.Id,
                curpos: pos
            },
            success: (res) => {
                console.log("Cập nhập địa chỉ thành công");
                setStatus(false);
            },
            error: (err) => {
                console.log("Cập nhập địa chỉ không thành công, vui lòng thử lại");
                console.log(err);
            }
        })
    }
}

var map, infoWindow, geocoder, marker;
var pos = { lat: -34.397, lng: 150.644 };
var curpos = pos;
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
          
              pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              curpos = pos;
         
         if (Cookies.get('driver_auth') == "true") {
            var user = JSON.parse(Cookies.get('driver').substring(2));
            $.ajax({
                method: 'POST',
                url: '/data/curpos',
                data: {
                    id: user.Id,
                    curpos: pos  
                },
                success: (res) => {
                    console.log(pos);
                },
                error: (err) => {
                    console.log("Không thành công, vui lòng thử lại");
                    console.log(err);
                }
            })
        }
        
         map.setCenter(pos);
         marker.setPosition(pos);
      });
   }
}

function toggleBounce() {
   if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
   } else {
      marker.setAnimation(google.maps.Animation.DROP);
   }
}
// function calcRoute() {
//   var start = new google.maps.LatLng(37.334818, -121.884886);
//   //var end = new google.maps.LatLng(38.334818, -181.884886);
//   var end = new google.maps.LatLng(37.441883, -122.143019);
//   var bounds = new google.maps.LatLngBounds();
//   bounds.extend(start);
//   bounds.extend(end);
//   map.fitBounds(bounds);
//   var request = {
//       origin: start,
//       destination: end,
//       travelMode: google.maps.TravelMode.DRIVING
//   };
//   directionsService.route(request, function (response, status) {
//       if (status == google.maps.DirectionsStatus.OK) {
//           directionsDisplay.setDirections(response);
//           directionsDisplay.setMap(map);
//       } else {
//           alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
//       }
//   });
// }


function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
        geocoder.geocode({ 'location': evt.latLng }, function (results, status) {
        if (calcCrow(curpos.lat,curpos.lng,marker.getPosition().lat(),marker.getPosition().lng())<=0.1)
        {
        curpos.lat = marker.getPosition().lat();
        curpos.lng = marker.getPosition().lng();
        ajaxCurpos(curpos);
        } else
        {
        alert("err");
        map.setCenter(curpos);
         marker.setPosition(curpos);
        }
        })
       
    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
        console.log("marker is being dragged");
    });

}

function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}