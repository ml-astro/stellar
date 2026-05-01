function roundup(number, degree) {
	return parseInt(number * degree) / degree;
}

function show(unhidden, hidden) {
	let unh = document.getElementsByClassName(unhidden)
	for (let index = 0; index < unh.length; index++) {
		unh[index].style.display = 'initial'
	}

	let hid = document.getElementsByClassName(hidden)
	for (let index = 0; index < hid.length; index++) {
		hid[index].style.display = 'none'
	}
}

function reset(form) {
	document.getElementById('aperture').value = 0;
	document.getElementById('focalLength').value = 0;
	document.getElementById('eyepieceFocal').value = 0;
	document.getElementById('matrixSize').value = 0;
	document.getElementById('maxResolution').value = 0;
}

function telescope(form) {
	//var diam=parseFloat(form.aperture.value);
	var diam = parseFloat(document.getElementById('aperture').value);
	//угловое разрешение
	document.getElementById('redResult').value = roundup(176.15031 / diam, 10) + "\"";
	document.getElementById('blueResult').value = roundup(98.140887 / diam, 10) + "\"";
	//светосила
	document.getElementById('power').value = roundup((0.0816326530611768 * Math.pow(diam / 2, 2)), 1) + "x";
	var fnum = parseInt(document.getElementById('focalLength').value) / diam;
	document.getElementById('focal').value = "F/" + roundup(fnum, 10);

	//увеличение
	var magnification = parseFloat(document.getElementById('focalLength').value) / parseFloat(document.getElementById('eyepieceFocal').value);
	document.getElementById('magnification').value = roundup(magnification, 10);
	//предельная звёздная величина
	document.getElementById('magLimit').value = 5.5 + roundup((Math.log(diam) / Math.log(2.512) + Math.log(magnification) / Math.log(2.512)), 10);
	//поле зрения
	document.getElementById('fov').value = roundup(57.3 * document.getElementById('matrixSize').value / document.getElementById('focalLength').value, 100);
	//угловое разрешение камеры
	document.getElementById('cameraResolution').value = roundup(document.getElementById('fov').value * 3600 / parseFloat(document.getElementById('maxResolution').value), 10) + "\"";
	//максимально разумная длина фокуса для камеры
	matrix = parseFloat(document.getElementById('matrixSize').value);
	blue = parseFloat(document.getElementById('blueResult').value);
	resolution = parseInt(document.getElementById('maxResolution').value);
	document.getElementById('limitFocal').value = parseInt(206280 * matrix / resolution / blue) + " mm";
	//предельная длина фокуса для глаза

}
