app.controller('sendEmailModalCtrl', function ($uibModalInstance, planSelected, customerSelected, $http, $rootScope, Upload, $timeout) {
    console.log('inside sendEmailModalCtrl');
    var userLogin = $rootScope.globals.currentUser.username;

    var $ctrl = this;
    $ctrl.successAlert = false;
    $ctrl.errorAlert = false;

    $ctrl.plan = planSelected;
    $ctrl.customer = customerSelected;

    $ctrl.customerName = customerSelected.fullName;
    $ctrl.customerEmail = customerSelected.email;
    $ctrl.userFullname = $rootScope.userFullname;
    $ctrl.userEmail = $rootScope.userEmail;
    $ctrl.fileAttached = "";
    $ctrl.localPath = "";

    $http.get("../api/plans/getPlans.php", {
        params: { planID: planSelected.planID }
    }).then(function (response) {
        planSelected = response.data[0];
        console.log(response.data[0]);
        $ctrl.databasePlanFileLocation = planSelected.planFileLocation;

    });

    $ctrl.emailSubject = "[PLOY] Your Plan Is Ready";
    $ctrl.emailContent = "Dear " + $ctrl.customerName + ", \n\n" + "Thank you for your patience. \nYour plan for your trip " + $ctrl.plan.tripName + " is ready, please let me know if you have any questions or concerns. Thanks! \n\n" + "If you are satisfied with this plan, please proceed with marking the order as complete on ploytrip.com." + "Regards, \n\n" + $ctrl.userFullname;
    $ctrl.emailContentHTML = "<p>Dear " + $ctrl.customerName + ", </p><p><br></p><p>Your plan for your trip " + $ctrl.plan.tripName + " is ready.</p><p><br></p><p>Please check out the attached file and let me know of any questions or concerns. Thanks!. </p><br><p>If you are satisfied with this plan, please proceed with marking the order as complete on ploytrip.com</p><br><p>Regards, </p><p><br></p><p>" + $ctrl.userFullname + "<br><br><br><br> <hr> ***This is an auto-generated email, please do not reply. Please contact your planner on ploytrip.com.***</p>";
    console.log("planSelected");
    console.log(planSelected);
    console.log($ctrl.customer);

    console.log(userLogin);

    console.log(planSelected.planFileLocation);
    $ctrl.databasePlanFileLocation = planSelected.planFileLocation;
    $http.get("../../api/fileDownload.php",{
        params: { fileName: planSelected.planFileLocation }
    })
        .then(function (response) {
            console.log(response);   
            $ctrl.loadedFromServerDataURL = "data:multipart/form-data;base64,"+response.data;
            var contentType = 'multipart/form-data';

        $ctrl.loadedFromServerInBlob=b64toBlob(response.data,contentType);
        $ctrl.loadedFromServerInFile = blobToFile($ctrl.loadedFromServerInBlob, "testFile2.png");
        $ctrl.attachmentArray = [$ctrl.loadedFromServerInFile];


        });

        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
          
            var byteCharacters = atob(b64Data);
            var byteArrays = [];
          
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              var slice = byteCharacters.slice(offset, offset + sliceSize);
          
              var byteNumbers = new Array(slice.length);
              for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
          
              var byteArray = new Uint8Array(byteNumbers);
          
              byteArrays.push(byteArray);
            }
              
            var blob = new Blob(byteArrays, {type: contentType});
            console.log(blob);

            return blob;
          };
          function blobToFile(theBlob, fileName){
            //A Blob() is almost a File() - it's just missing the two properties below which we will add
            theBlob.lastModifiedDate = new Date();
            theBlob.name = fileName;
            var file = new File([theBlob],fileName);

            console.log(file);
            return file;
        };
        

    $ctrl.send = function () {
        $ctrl.successAlert = false;
        $ctrl.errorAlert = false;
        // $ctrl.fileName = $ctrl.files[0].name;
        $ctrl.fileName = "test.pdf";

        console.log($ctrl.files);
        console.log($ctrl.fileName);

        console.log($ctrl.fileAttached);
        
        console.log($ctrl.loadedFromServerInBlob);
        $http.post(
            "../../api/sendEmail.php", {

                'recepientEmail': $ctrl.customerEmail,
                'recepientName': $ctrl.customerName,
                'emailSubject': $ctrl.emailSubject,
                'emailContent': $ctrl.emailContentHTML,
                'senderName': $ctrl.userFullname,
                'senderEmail': $ctrl.userEmail,
                'fileName': $ctrl.fileName,
                // 'attachments': $ctrl.localPath
                // 'attachments': $ctrl.fileAttached[0],
                // 'attachments': $ctrl.loadedFromServerInBlob
                'attachments': $ctrl.loadedFromServerDataURL
                // 'attachments': $ctrl.attachmentArray
                // 'attachments': $ctrl.loadedFromServerInFile



            }
        ).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(response);
            $ctrl.successAlert = true;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response);
            $ctrl.errorAlert = true;

        });

    };
    $ctrl.selected = {
        item: $ctrl.planSelected
    };

    $ctrl.ok = function (id) {
        $uibModalInstance.close($ctrl.selected.planSelected);
    };
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //work in progress, not able to get the path as mailgun requires it
    $ctrl.uploadFiles = function (files) {
        console.log("uploadFiles")
        $ctrl.files = files;
        console.log(files);

        if (files && files.length) {
            Upload.base64DataUrl($ctrl.files).then(function (base64Data) {
                console.log(base64Data);
                $ctrl.fileAttached = base64Data;
                console.log($ctrl.fileAttached);
                
                $ctrl.loadedFromServerDataURL = $ctrl.fileAttached[0];

            });
            //$ctrl.fileAttached = $ctrl.files[0];
            Upload.upload({
                url: '../api/fileUpload.php',
                method: 'POST',
                file: $ctrl.files[0],
                data: {
                    'targetPath': '../assets/Uploads/plan/',
                    'filenameDetail': 'Plan_Entry_m_',
                }
            }).then(function (response) {
                console.log(response);
            });

            Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {
                    files: files
                }
            }).then(function (response) {
                $timeout(function () {
                    console.log(response);

                    $ctrl.result = response.data;
                    console.log($ctrl.result);
                    console.log($ctrl.result.result[0].fieldName);
                    // $ctrl.fileAttached = $ctrl.result.result[0];


                });
            },
                function (response) {
                    if (response.status > 0) {
                        $ctrl.errorMsg = response.status + ': ' + response.data;
                        console.log($ctrl.errorMsg);
                    }
                }, function (evt) {
                    $ctrl.progress =
                        Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
        }
    };

});

