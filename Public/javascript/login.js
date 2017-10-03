let step = 0;
let stepInput = null;
let search = null;
let searchMode = null;
let isFilmLoading = null;
let state = null;
let defaultLanguage = null;
defaultLanguage = navigator.languages[0];
isFilmLoading = false;
searchMode = false;
state = 0;
search = 0;
stepInput = [['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', '']];
step = 1;
include('/javascript/includes/_nextStep.js');
include('/javascript/includes/_stepBefore.js');
$(document).ready(() => {
	$('#i2 input').hide();
	$('#b1').hide();
	$('#b2').hide();
	$('#b1, #b3').click(() => {
		stepInput[step][0] = $('#i1 input').val();
		stepInput[step][1] = $('#i2 input').val();
		$('#b1, #b3').prop('disabled', true);
		nextStep();
	});
	$('#b2').click(() => {
		stepInput[step][0] = $('#i1 input').val();
		stepInput[step][1] = $('#i2 input').val();
		$('#b2').prop('disabled', true);
		if (step >= 1) { stepBefore(step); }
	});
	$('#step1').on('keypress', (e) => {
		if (e.keyCode === 13) {
			stepInput[step][0] = $('#i1 input').val();
			stepInput[step][1] = $('#i2 input').val();
			$('#b1, #b3').prop('disabled', true);
			nextStep();
		}
	});
	$('#resetPassword').click(() => {
		if (validateEmail($('#i1 input').val())) {
			$.get('/forgot', { email: $('#i1 input').val() }, (data) => {
				if (data === true) {
					$('.form-group').addClass('has-success');
					$('#i1 small').html($('#emailSended').html());
				} else {
					throwError(data);
				}
			});
		}
	});
	$('#resetForm').prop('action', window.location.href);
});

function getUser(data) {
	user = data;
	window.location.replace('/');
}
