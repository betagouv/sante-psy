$( function() {
  $( "#date" ).datepicker($.datepicker.regional[ "fr" ] );
  // Hidden field which uses a different format, which is easier to parse for the backend.
  $( "#date" ).datepicker( "option", "altField", "#iso-date" );
  $( "#date" ).datepicker( "option", "altFormat", "yy-mm-dd" );
} );