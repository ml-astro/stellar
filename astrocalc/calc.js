function roundup(number, degree){
	return parseInt(number*degree)/degree;
}

function JDnow(){
	var now = new Date().getTime();
	document.getElementById("JD").innerHTML=roundup((now/1000/3600/24+2440587.5),100000);
}

function reset(form){
	document.getElementById('aperture').value=0;
	document.getElementById('focalLength').value=0;
	document.getElementById('eyepieceFocal').value=0;
	document.getElementById('matrixSize').value=0;
	document.getElementById('maxResolution').value=0;
}

function telescope(form){
//var diam=parseFloat(form.aperture.value);
var diam=parseFloat(document.getElementById('aperture').value);
//угловое разрешение
document.getElementById('redResult').value=roundup(176.15031/diam,10)+"\"";
document.getElementById('blueResult').value=roundup(98.140887/diam,10)+"\"";
//светосила
document.getElementById('power').value=roundup((0.0816326530611768*Math.pow(diam/2,2)),1)+"x";
var fnum=parseInt(document.getElementById('focalLength').value)/diam;
document.getElementById('focal').value="F/"+roundup(fnum,10);

//увеличение
var magnification=parseFloat(document.getElementById('focalLength').value)/parseFloat(document.getElementById('eyepieceFocal').value);
document.getElementById('magnification').value=roundup(magnification,10);
//предельная звёздная величина
document.getElementById('magLimit').value=5.5+roundup((Math.log(diam)/Math.log(2.512)+Math.log(magnification)/Math.log(2.512)),10);
//поле зрения
document.getElementById('fov').value=roundup(57.3*document.getElementById('matrixSize').value/document.getElementById('focalLength').value,100);
//угловое разрешение камеры
document.getElementById('cameraResolution').value=roundup(document.getElementById('fov').value*3600/parseFloat(document.getElementById('maxResolution').value),10)+"\"";
//максимально разумная длина фокуса для камеры
matrix=parseFloat(document.getElementById('matrixSize').value);
blue=parseFloat(document.getElementById('blueResult').value);
resolution=parseInt(document.getElementById('maxResolution').value);
document.getElementById('limitFocal').value = parseInt(206280*matrix/resolution/blue)+" mm";
//предельная длина фокуса для глаза

}

function refraction(form){
	var alt=parseFloat(document.getElementById('altHor').value);
	if (alt<0){
		document.getElementById('ref').value='Ниже горизонта';
	}
	else if (alt>80){
		document.getElementById('ref').value=0+"'";
	}
	else if (alt>15 && alt<=80){
		alt = alt/57.29577951308232;
		var refraction = 271.2/(283 * Math.tan(alt));
		document.getElementById('ref').value=roundup(refraction,10)+"'";
	}
	else{
		subRef = 283*(1.0 + 0.505*alt + 0.0845*alt*alt);
		refraction = 60000 * (0.1594 + 0.0196*alt + 0.00002*alt*alt)/subRef;
		document.getElementById('ref').value=roundup(refraction,10)+"'";
	}

	var ok=true;
	var height = document.getElementById('altHor').value;
	var v = document.getElementById('altObs').value;
	if (height<0) {
	document.getElementById('extinction').value='Ниже горизонта';
	ok=false;
	}
	if (height>90) {
	height=90-(90-height);
	ok=false;
	}
	if (ok) {
	var x1 = 0;
	x1 = (1/(Math.cos((90-height)*0.01745329251)+0.025*Math.exp(-11*Math.cos((90-height)*0.01745329251))));
	x2 = (0.1451*Math.exp(-v*0.001/7.996))*x1;
	x3b = (0.12*Math.exp(-v*0.001/1.5))*x1;
	x4 = 0.016*x1;
	document.getElementById('extinction').value = roundup(x2+x3b+x4,100)+'m';
	}
}