$(function() {
    $('.month-picker')
    .datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'M yy',
        onClose: function(dateText, inst) { 
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
            $('#month-form').trigger('submit');
        },
        altField: "#isoDate",
        altFormat: "yy-mm-dd"
    })
    .keypress(function(e) {
        e.preventDefault();
    })
    .datepicker('setDate', new Date($('.month-picker').val()));
});
