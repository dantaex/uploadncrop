/*
	package forms.files.images

	Image resizer & cropper made by
	Jesus Israel Cruz Rojas 
	@dantaex
	May 2012
	
	Crops and resizes image as:
	__________________  
	| _ _ _ _ _ _ _ _ _ _ _ _| <-- big undesired image (input)
	|				|
	|				| <-- cool shape, small desired image (output)
	| _ _ _ _ _ _ _ _ _ _ _ _|
	|_________________	|
	
	or
	   big undesired shape   
	    |				     	  
	_\|/_________________________
	|	| 				 |	 |
	|	|				 |	 |
	|	|				 |	 |
	|	|				 |	 |
	|____|__________________|____|
				 /|\
				  |
				Cool shape, small desired image.
	or any.
	
	Params:
		image_file	: image file or image URL.
		max_width	: maximum width to which resize.
		max_height	: maximum height to which resize.
		proportion	: cropping proportion, i.e:  4/3  (fullscreen),  5/3 (widescreen)
		callback		: called function after resize is finished: callback( IMAGE_SOURCE )
*/

// shortcut
function resizeAll(  images ,max_width,max_height,proportion,callback ){
	var i , cropped_images = new Array(), all_done = images.legth;
	
	function push( image ){
		cropped_images.push(image);
		if(all_done > 1)	all_done--;
		else			callback(cropped_images);
	}
	
	for(i=0;i<images.legth;i++)
		resizeAndCrop( images[i] ,max_width,max_height,proportion, push );
}

function resizeAndCrop( image_file ,max_width,max_height,proportion,callback){

	//image url or file..
	if( typeof image_file == "string" ){
		image = new Image;
		image.onload = resample; // if string, this will wait for it to load.. 
		image.onerror = function(e){alert("Error: "+e)};
	}
	else
		image = image_file;
	
	//save parameters in object why not?
	image.max_width = max_width;
	image.max_height = max_height;
	image.proportion = proportion;
	image.callback = callback;
	
	//load it if URL,   
	(typeof image_file == "string") ?  image.src = image_file  : resample.call(image);
}

function resample(){
	var img = this;
	var max_width = this.max_width,max_height = this.max_height, aux_width, aux_height, sx,sy;
	var callback = img.callback, actual_proportion = img.width/img.height ;

	if(typeof canvas == "undefined") canvas    = document.createElement("canvas");
	if(typeof context == "undefined") context = canvas.getContext("2d");
	
	// wider   |  or wide applied to tall *
	if( actual_proportion < img.proportion )
	{
		canvas.width	= (img.width < max_width)? img.width : max_width ;
		canvas.height	= Math.round(1/img.proportion * canvas.width); 
		
		// within limits
		if( canvas.height > max_height)
		{
			canvas.height = max_height;
			canvas.width = Math.round(1/img.proportion * canvas.height); 
		}
		
		aux_height          = Math.round(1/img.proportion * img.width); 
		aux_width 	= img.width;
		sx = 0;		sy =   Math.round(  (img.height > aux_height)?  img.height/2 - aux_height/2  :   aux_height/2 - img.height/2 );
	}
	// taller  |  or tall applied to wide *
	else
	{
		canvas.height = (img.height < max_height)? img.height : max_height ;
		canvas.width =  Math.round( img.proportion * canvas.height );
		
		// within limits
		if( canvas.width > max_width)
		{
			canvas.width = max_width;
			canvas.height = Math.round(1/img.proportion * canvas.width); 
		}
		
		aux_width      =  Math.round( img.proportion * img.height );
		aux_height     = img.height;
		sy = 0;    	      sx = Math.round(  (img.width > aux_width )? img.width/2 - aux_width/2  :    aux_width/2  - img.width/2  );
	}
	
	delete img.max_width;	delete img.max_height;	delete img.proportion;	
	delete img.onload;		delete img.onerror;		delete img.callback;

	//HTML5 magic goes here
	context.drawImage( img, sx,sy, aux_width, aux_height, 0,0,canvas.width,canvas.height );
	callback( canvas.toDataURL("image/png") );
}
/*
	* Explanation
	
	Suppose we have a picture of  400px X 300px,
	this describes a proportion of 4/3...
	
	Then suppose we choose 5/3 as new cropping proportion ;
	comparing 4/3 to 5/3 will tell us that 5/3 is a bigger number,
	we are trying to turn wider a yet wide image.
	
	Thus first option is choosen:
	* take image width as new image's width
	* obtain new image's height as input proportion indicates...
	
	Same thing can be applied to a similar case: wide proportion applied to 
	a tall image:
		
		4/3 applied to a 200 x 400 image
		4/3 > 2/4 ... 
	
	The same	whole thing can be applied to opposite cases:
	a tall image meant to be taller, or a tall proportion applied to a wide image.
*/