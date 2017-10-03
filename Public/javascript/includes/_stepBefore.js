function stepBefore() {
	stopError();
	if (step === 2) {
		$('#b1').hide();
		$('#b3').show();
		$('#b2').hide();
		$('.progress-bar').animate({
			width: '25%',
		}, 250, () => {
			step -= 1;
			$('#b1, #b3, #b2, #i1 input').prop('disabled', false);
			$('#i1 small').html();
			$('.progress-bar').html($('#mail').html());
			changeText($('#mail'), $('#i1 label'), 2);
			$('#i1 input').attr('placeholder', 'Email');
			$('#i1 input').attr('type', 'email');
			$('#i2 label').html('');
			$('#i2 input').fadeOut('fast');
			$('.btn-styler').blur();
			$('#i1 input').val(stepInput[step][0]);
			$('#i2 input').val(stepInput[step][1]);
			changeText($('#signup'), $('h3'));
			$('#i1 input').focus().select();
		});
	}
	if (step === 3) {
		$('#b1').show().html('<span class="glyphicon glyphicon-chevron-right"></span>');
		$('#b3').hide();
		$('#b2').show();
		$('.progress-bar').animate({ width: '40%' }, 250, () => {
			step -= 1;
			$('#b1, #b3, #b2, #i1 input').prop('disabled', false);
			$('.progress-bar').html($('#password').html());
			changeText($('#password'), $('#i1 label'), 2);
			$('#i1 input').attr('placeholder', '********');
			$('#i1 input').attr('type', 'password');
			changeText($('#repassword'), $('#i2 label'), 2);
			$('#i2 input').attr('placeholder', '********');
			$('#i2 input').attr('type', 'password');
			$('#i2 input').fadeIn('fast');
			$('.btn-styler').blur();
			$('#i1 input').val(stepInput[step][0]);
			$('#i2 input').val(stepInput[step][1]);
			changeText($('#signup'), $('h3'));
			$('#i1 input').focus().select();
		});
	}
	if (step === 6) {
		step = 2;
		stepBefore();
	}
}
