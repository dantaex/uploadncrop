<?php
	if(isset( $_FILES ))
	{
		for ($j=0;$j<30;$j++)
			if ( file_exists ( "uploads/image_$j.png" ) )
				unlink("uploads/image_$j.png");
		
		foreach ($_FILES["images"]["error"] as $i => $error)		
				if ($error == UPLOAD_ERR_OK){
					move_uploaded_file( $_FILES["images"]["tmp_name"][$i]
								, "uploads/image_$i.png");
					echo "[".file_exists('uploads/image_$i.png')."]\n";
				}
		echo "SUCESS";
	}
	else
		echo "Didn't receive anything";
