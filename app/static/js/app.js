$(function(){

  $('.alert').delay(2500).fadeOut(250);

  $(':file').on('fileselect', function(event, numFiles, label) {

    var input = $(this).parents('.form-group').find('.custom-file-label'),
    log = numFiles > 1 ? numFiles + ' files selected' : label;

    if( input.length ) {
        input.text(log);
    } else {
      console.log(log);
    }
  });

  $(document).on('change', ':file', function() {
    var input = $(this),
    numFiles = input.get(0).files ? input.get(0).files.length : 1,
    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
  });
});