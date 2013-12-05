/*
	Data URL converter, made by
	Steven Thurlow "Stoive"
	github.com/stoive
	Feb 2011
	
	Updated by 
	Jesus Israel Cruz Rojas
	on March 2012
	twitter: @dantaex
	
	We got data URI:					data:image/png;base64,iVBORw0KG.... ...GHFTYh==
	splitting to get only:					iVBORw0KG.... ...GHFTYh==
	now ascii to bytes:					< image data file >
	serialize them:						<serialized data file>
	create blob to match width form data:	<blob>
	
	append it to form data in your code.	
*/
function dataURItoBlob(dataURI) {

	var byteString 
		= (dataURI.split(',')[0].indexOf('base64') >= 0)? 
		byteString = atob(dataURI.split(',')[1]) :
		byteString = unescape(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	/*
	Write the bytes of the string to an ArrayBuffer..
	
	An array buffer is necesary to hanlde bytes from bytesString, 
	but a casting is needed, we choose Uint8, why?
	Suppose you try to assign a Uint8Array element a number greater 
	than 255, it will be truncated, and if you put a string, it’ll become 0.
	
	This form of the constructor creates a new Uint8Array object, 
	using the specified ArrayBuffer as its storage. 
	This lets you access the existing buffer in a different format. 
	If specified, the byteOffset and length parameters let you create 
	the new view to only a portion of the buffer.
	*/
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++)
		ia[i] = byteString.charCodeAt(i);

	try{
		return new Blob([ab], {type: mimeString});
	}
	catch(e){
		var BlobBuilder = (window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder);
		var bb = new BlobBuilder();	
		bb.append(ab);	
		return bb.getBlob(mimeString);
	}
}


