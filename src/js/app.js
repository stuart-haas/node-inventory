$(function(){

  $('.alert').delay(2500).fadeOut(250);

  $('#upload-button').on('click', function() {
    $(this).prev(':file').click();
  });

  $('#upload-file').on('fileselect', function(e, files) {
    var $form = $(this).parents('#upload-form');
    $form.submit();
    var data = $form.serialize();
    console.log(data);
    $.ajax({
      type: 'POST',
      url: '/upload',
      data: data
    })
  });

  $(document).on('change', '#upload-file', function() {
    var input = $(this),
    file = input.get(0).files;
    input.trigger('fileselect', [file]);
  });
});