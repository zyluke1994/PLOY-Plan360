<?php


# Include the Autoloader (see "Libraries" for install instructions)
require '../vendor/autoload.php';
use Mailgun\Mailgun;


# Instantiate the client.
$mgClient = new Mailgun('key-175e4343933d87926572197351c35bd4');
$domain = "mg.ploytrip.com";

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$recepientEmail = $request->recepientEmail;
$recepientName = $request->recepientName;
$emailSubject = $request->emailSubject;
$emailContent = $request->emailContent;
$senderName = $request->senderName;
$senderEmail = $request->senderEmail;
$attachments = $request->attachments;
$fileName = $request->fileName;

if($attachments==""){
    $attachments=null;
}

// $attachments = "data:text/rtf;base64,e1xydGYxXGFuc2lcYW5zaWNwZzEyNTJcY29jb2FydGYxNTA0XGNvY29hc3VicnRmNjAwCntcZm9udHRibFxmMFxmc3dpc3NcZmNoYXJzZXQwIEhlbHZldGljYTt9CntcY29sb3J0Ymw7XHJlZDI1NVxncmVlbjI1NVxibHVlMjU1O30Ke1wqXGV4cGFuZGVkY29sb3J0Ymw7XGNzZ3JheVxjMTAwMDAwO30KXG1hcmdsMTQ0MFxtYXJncjE0NDBcdmlld3cxMDgwMFx2aWV3aDg0MDBcdmlld2tpbmQwClxwYXJkXHR4NzIwXHR4MTQ0MFx0eDIxNjBcdHgyODgwXHR4MzYwMFx0eDQzMjBcdHg1MDQwXHR4NTc2MFx0eDY0ODBcdHg3MjAwXHR4NzkyMFx0eDg2NDBccGFyZGlybmF0dXJhbFxwYXJ0aWdodGVuZmFjdG9yMAoKXGYwXGZzMjQgXGNmMCAxc30=";
// $pdf_decoded = $attachments;
// //Write data back to pdf file
// $pdf = fopen ('test.pdf','w');
// fwrite ($pdf,$pdf_decoded);
// fclose ($pdf);

// $attachments = base64_decode ($attachments);

// $attachments = "C:\fakepath\PMRoles.pdf";

// $attachments = $_FILES['uploaded_file']['name'];




if($senderEmail == ""){
    # Make the call to the client.
    if($attachments == ""){
        $result = $mgClient->sendMessage("$domain",
        array('from'    => 'Ploy Trip <noreply@mg.ploytrip.com>',
              'to'      => $recepientEmail,
              'subject' => $emailSubject,
              'html'    => $emailContent,
              
          )
          ,array(
            //   'attachment' => array($attachments)
              'attachment' => array('fileContent' => $attachments)
            // 'attachment' => array('test.pdf')
            
          )
        );
    }else{
        $result = $mgClient->sendMessage("$domain",
        array('from'    => 'Ploy Trip <noreply@mg.ploytrip.com>',
              'to'      => $recepientEmail,
              'subject' => $emailSubject,
              'html'    => $emailContent,
              
          )
          ,array(
            //   'attachment' => array($attachments)
              'attachment' => array('fileContent' => $attachments)
            // 'attachment' => array('test.pdf')
            
          )
        );
    }


$darr=json_encode($result);
$data=json_decode($darr,true);

# Prints out the individual elements of the array
echo $data["http_response_body"]["message"]."<br>";
echo $data["http_response_body"]["id"]."<br>";
echo $data["http_response_code"];

}else{
# Make the call to the client.
if($attachments == ""){
    $result = $mgClient->sendMessage("$domain",
    array('from'    => 'Ploy Trip <noreply@mg.ploytrip.com>',
          'to'      => $recepientEmail,
          'bcc'     => $senderEmail,
          
          'subject' => $emailSubject,
          'html'    => $emailContent
      )
      ,array(
        //   'attachment' => array($attachments)
          'attachment' => array('fileContent' => $attachments)
        // 'attachment' => array('test.pdf')
        
      )
      
    );
}else{
    $result = $mgClient->sendMessage("$domain",
    array('from'    => 'Ploy Trip <noreply@mg.ploytrip.com>',
          'to'      => $recepientEmail,
          'bcc'     => $senderEmail,
          
          'subject' => $emailSubject,
          'html'    => $emailContent
      )
      ,array(
        //   'attachment' => array($attachments)
          'attachment' => array('fileContent' => $attachments)
        // 'attachment' => array('test.pdf')
        
      )
    );
} 


$darr=json_encode($result);
$data=json_decode($darr,true);

# Prints out the individual elements of the array
echo $data["http_response_body"]["message"]."<br>";
echo $data["http_response_body"]["id"]."<br>";
echo $data["http_response_code"];
}


?>
