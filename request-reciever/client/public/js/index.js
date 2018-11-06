$("#bookingBtn").click(function () {
    $("html, body").animate({ scrollTop: $(document).height() }, 1500);
});

function doCheck() {
    var allFilled = true;
    $('.form-control:not(#note)').each(function() {
      if ($(this).val() == '') {
        allFilled = false;
      }
    });
  
    $('button[type=submit]').prop('disabled', !allFilled);
    if (allFilled) {
      $('button[type=submit]').removeAttr('disabled');
    }
  }
  
  $(document).ready(function() {
    doCheck();
    $('.form-control').keyup(doCheck);
  });