function throwError(type, mode) {
	if (mode === 1) {
		$('#i1').addClass('has-warning');
		$('#i1 small').html($(`#${type}`).html());
	} else if (mode === 2) {
		$('.form-group').addClass('has-warning');
		$('#i1 small').html($(`#${type}`).html());
		$('#i2 small').html($(`#${type}`).html());
	} else if (mode === 3) {
		$('#i1 small').html(`${$('#i1 small').html()}${$(`#${type}`).html()}<br />`);
	} else if (mode === 4) {
		$('#i2').addClass('has-warning');
		$('#i2 small').html($(`#${type}`).html());
	} else if (mode === 5) {
		console.log(`${type}`);
		$('#commentary').addClass('has-danger');
		$('#commentary small').html($(`#${type}`).html());
	}
	$('#b1, #b3, #b2').prop('disabled', false);
}
function stopError() {
	$('.form-group, #input1, #input2, #input3, #i2, #i1').removeClass('has-warning');
	$('.form-group, #input1, #input2, #input3, #i2, #i1, #commentary').removeClass('has-danger');
	$('.form-group').removeClass('has-success');
	$('#i1 small, #i2 small, #input1 small, #input2 small, #input3 small, #commentary small').html('');
}
