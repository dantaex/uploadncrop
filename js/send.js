/*
	package forms.files
	Ajax file sender made by 
	Jesus Israel Cruz Rojas 
	@dantaex
	June 2012
	
	data:      		form data to send. 
	done:    		callback function executed when send finishes as:
					 done(TRUE)   -> sucess
					 done(string)  -> ERROR
	mode:  		'POST'	or 'GET'	
	comments: jquery would do this much easier.
*/

if (!window.FormData) throw "HTML5 formdata not supported";

function send( data, to, done, mode , meanwhile, header){
	var sender = new XMLHttpRequest(), allsent;	
	mode =  ( typeof mode != 'undefined' && (mode == 'POST' || mode == 'GET') )? mode : "POST" ;
	header = (typeof header == 'string')? header : false ;
	if (sender.upload) 
	{
		if(typeof meanwhile == 'function' ) sender.upload.addEventListener("progress", function(e) {  meanwhile(e.loaded, e.total);  }, false);
		sender.onreadystatechange = function() {if (sender.readyState == 4) done(sender.responseText); };
		sender.open( mode, to, true );//async
		if(header)	sender.setRequestHeader("IMAGE_FILES", data.name);
		sender.send( data );
	}
	else{
		throw "Broswer does not support XMLHttpRequest2 object";
	}
}