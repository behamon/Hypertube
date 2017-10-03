function nextStep() {
	stopError();
  /* Etape Email */

	if (step === 1) {
		$('.progress-bar').animate({
			width: '33%',
		}, 0, () => {
			if (validateEmail($('#i1 input').val())) {
				$.get('/login/hasAccount', { email: $('#i1 input').val() }, (data) => {
					if (data === 'local') {
						step = 5;
						nextStep();
					} else if (data !== false) {
						window.location.replace(`/login/${data}`);
					} else {
						$('#b1').show().html("<span class='glyphicon glyphicon-chevron-right'></span>");
						$('#b3').hide();
						$('#b2').show();
						$('.progress-bar').animate({
							width: '50%',
						}, 0, () => {
							$('#b1, #b3, #b2').prop('disabled', false);
							step += 1;
							$('.progress-bar').html($('#password').html());
							$('#i1 input').focus();
							changeText($('#password'), $('#i1 label'), 2);
							$('#i1 input').attr('placeholder', '********');
							$('#i1 input').attr('type', 'password');
							changeText($('#repassword'), $('#i2 label'), 2);
							$('#i2 input').attr('type', 'password');
							$('#i2 input').fadeIn('fast');
							$('#i1 input').val(stepInput[step][0]);
							$('#i2 input').val(stepInput[step][1]);
							$('#i1 input').focus().select();
						});
					}
				});
			} else {
				$('.progress-bar').animate({
					width: '25%',
				}, 0, () => {
					$('#b1, #b3, #b2').prop('disabled', false);
					throwError('wMail', 1);
				});
			}
		});
	} else if (step === 2) {
		$('.progress-bar').animate({
			width: '60%',
		}, 0, () => {
			if ($('#i1 input').val().length >= 6) {
				if ($('#i1 input').val() === $('#i2 input').val()) {
					$('.progress-bar').animate({
						width: '75%',
					}, 0, () => {
						$('#b2').show();
						$('#b1').show().html($('#finish').html());
						$('#b3').hide();
						$('#b1, #b3, #b2').prop('disabled', false);
						step += 1;
						$('.progress-bar').html(`${$('#userLastname').html()} / ${$('#userFirstname').html()}`);
						changeText($('#userFirstname'), $('#i1 label'), 2);
						changeText($('#userLastname'), $('#i2 label'), 2);
						$('#i1 input').attr('placeholder', $('#userFirstname').html());
						$('#i2 input').attr('placeholder', $('#userLastname').html());
						$('#i1 input').attr('type', 'text');
						$('#i2 input').attr('type', 'text');
						$('.btn-styler').blur();
						$('#i1 input').val(stepInput[step][0]);
						$('#i2 input').val(stepInput[step][1]);
						$('#i1 input').focus().select();
					});
				} else {
					$('.progress-bar').animate({
						width: '50%',
					}, 0, () => {
						$('#b1, #b3, #b2').prop('disabled', false);
						throwError('noMatch', 2);
					});
				}
			} else {
				$('.progress-bar').animate({
					width: '50%',
				}, 0, () => {
					$('#b1, #b3, #b2').prop('disabled', false);
					throwError('wPwdLen', 1);
				});
			}
		});
	} else if (step === 3) {
		$('.progress-bar').animate({
			width: '86%',
		}, 0, () => {
			if ($('#i1 input').val() && $('#i2 input').val()) {
				$.post('/register/local', {
					email: stepInput[1][0],
					password: stepInput[2][0],
					'password-confirm': stepInput[2][1],
					firstName: stepInput[3][0],
					lastName: stepInput[3][1],
				}, (data) => {
					console.log(data);
					if (data.username) {
						$('.progress-bar').animate({
							width: '100%',
						}, 0, () => {
							getUser(data);
						});
					} else {
						$('.progress-bar').animate({
							width: '75%',
						}, 0, () => {
							if (data.name === 'UserExistsError') {
								step = 5;
								nextStep();
							} else {
								data.errors.forEach((error) => {
									throwError(error.msg, 3);
								});
							}
						});
					}
				});
			} else {
				$('.progress-bar').animate({
					width: '75%',
				}, 0, () => {
					if (!$('#i1 input').val()) {
						throwError('needToBeFilled', 1);
					}
					if (!$('#i2 input').val()) {
						throwError('needToBeFilled', 4);
					}
				});
			}
		});
	} else if (step === 5) {
		$('.form-group').addClass('has-success');
		$('#i1 small').html($('#connect').html());
		$('#b2').show();
		$('#b1').show().html($('#finish').html());
		$('#b3').hide();
		$('.progress-bar').animate({
			width: '75%',
		}, 0, () => {
			$('#b1, #b3, #b2').prop('disabled', false);
			$('#i1 input').prop('disabled', true);
			$('#i1 small').html();
			$('.progress-bar').html($('#mail').html());
			$('#i1 input').val(stepInput[1][0]);
			changeText($('#mail'), $('#i1 label'), 2);
			step += 1;
			$('.progress-bar').html($('#password').html());
			changeText($('#password'), $('#i2 label'), 2);
			changeText($('#login'), $('h3'));
			$('#i2 input').fadeIn('fast');
			$('#i2 input').attr('placeholder', '********');
			$('#i2 input').attr('type', 'password');
			$('#i2 input').focus().select();
		});
	} else if (step === 6) {
		$('.progress-bar').animate({
			width: '85%',
		}, 0, () => {
			$.post('/login/local', { email: $('#i1 input').val(), password: $('#i2 input').val() }, (data) => {
				if (data) {
					$('.progress-bar').animate({
						width: '100%',
					}, 0, () => {
						getUser(data);
					});
				} else {
					$('.progress-bar').animate({
						width: '75%',
					}, 0, () => {
						throwError('wPassWd', 4);
					});
				}
			});
		});
	}
}
