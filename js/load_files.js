/*
	package forms.files.images

	File reader/loader made by
	Jesus Israel Cruz Rojas 
	@dantaex
	June 2012
	
	usage: loadImages(input,callback,as_array);
		input: a real input type file element <input type='file' /> or a list of files
		callback: the function that will be executed when done, or when script detects that any file is accepted.
		as_array: is a boolean optional value (default is true) that indicates if callback
			function will be called as:
			callback( array with result files )   when 	as_array == true
			callback( each_file_loaded 	)   when 	as_array == false 		* this will happen n times for n files
			
			Note:
			callback(); will be called if none of the selected files match with MIME type specified by:			
		adm_regexp : MIME type regular expression  that will be accepted, default is "image".
			
	you could use it as:
		input_type_file.addEventListener("change",function(event){
			loadImages( input_type_file, manager_function );
		});
		
	IMPORTANT:
		if you want the output as an array of file results, you must specify "as_array" as true or leave it blank.
		but if you want the output as a single file result, the callback function will be called as much valid image
		files the user enters (if "multiple" attrib is enabled in html input object ), also you MUST specify "as_array" 
		as TRUE if your callback function is not prepared to handle or discriminate between both posssible 
		results (array or single file), otherwise an ERROR will be produced.
*/
if ( !window.FileReader ) throw "Browser does not support HTML5 FileReader object";	
	
function threadSleep(time){
	time--;
}	
	
function loadFiles(input,callback,as_array,adm_regexp)
{

	var files = (typeof input.length == 'undefined' )?  input.files : input , 
	as_array = (typeof as_array  == 'undefined')? true : as_array,
	loadedfiles = new Array(), 
	all_done = files.length, reader, notImages = 0;
	
	adm_regexp = (typeof adm_regexp == "undefined")? /image.*/ : adm_regexp ;
	
	if ( typeof callback != 'undefined' )
	{
		for(i=0;i<files.length;i++)
		{
			if( !!files[i].type.match(adm_regexp) ){
				//html5 magic goes here, but one reader per file is needed
				reader = new FileReader();
				// as loading can take any amount of time depending on a variety of factors...
				reader.onload = function(e){
					if(as_array) loadedfiles.push( e.target.result );
					else		   callback( e.target.result );
				};
				
				if( as_array )
					reader.onloadend = function(e){
						// wait for every image to load, as they are on diff sizes, i.e:
						// loading first big image can take more time than loading all of the rest together.
						if(all_done > 1)	all_done--; 
						else			callback(loadedfiles); 
					};
				
				//begin to read				
				reader.readAsDataURL(files[i]);				
			}
			else{
				notImages++;
				all_done--;
				// throw "["+files[i].name+"] wrong file type";
			}
		}
		
		if(notImages == files.length){
			callback();
		}	
	}
	else{
		throw "Missing parameters, check input and callback function";
		return false;
	}
}