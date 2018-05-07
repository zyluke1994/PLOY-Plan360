app.controller('editPlanEntryModalCtrl', function ($scope, $http, $uibModalInstance, $rootScope, $uibModal, $log, $document, $timeout, $location, $route, $compile, uiCalendarConfig,$rootScope, $window, $ngConfirm, entry, Upload) {
    console.log(entry);
    var userLogin = $rootScope.globals.currentUser.username;
    
    var $ctrl = this;

    $ctrl.attraction = entry;
    if($ctrl.attraction.reservationFileLocation != $scope.finalFileName){
        $scope.finalFileName = $ctrl.attraction.reservationFileLocation;
    };

    $ctrl.clearConfirmation = function(){
        console.log("clearConfirmation");
        $scope.finalFileName = "";
        $ctrl.attraction.reservationFileLocation = "";
    }
    $ctrl.updatePlanEntry = function () {
        console.log("update planEntry");
        $http.post(
            "../api/planEntry/updatePlanEntry.php", {
                'updateType': "updateTime",
                'entryID':  $ctrl.attraction.entryID,
                'visitStart':  $ctrl.attraction.visitStart,
                'visitEnd':  $ctrl.attraction.visitEnd,
                'inputBy': userLogin,
                'planEntrymemo':$ctrl.attraction.planEntrymemo,
                'reservationFileLocation': $scope.finalFileName

            }
        ).then(function (response) {
            console.log("Data Updated");
            $ctrl.alertMessage = response.data;
            if($scope.finalFileName!=""){
                $ctrl.attraction.reservationFileLocation = $scope.finalFileName;

            }
        });
    };
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.addEndTime = function (hours) {
        console.log("addendtime called");
        var dateVisitEnd = moment($ctrl.attraction.visitStart).add(hours,'hours');
        $ctrl.attraction.visitEnd = new Date(dateVisitEnd);
    };
    $ctrl.uploadFiles = function (files) {
        console.log("uploadFiles")
        $ctrl.files = files;
        console.log(files);
        
        if (files && files.length) {
            Upload.base64DataUrl($ctrl.files).then(function (base64Data) {
                console.log(base64Data);
                $ctrl.fileAttached = base64Data;

              });
              Upload.upload({
                url: '../api/fileUpload.php',
                method: 'POST',
                file: $ctrl.files[0],
                data: {
                    'targetPath': '../assets/Uploads/reservation/' ,
                    'filenameDetail':'Entry_'+$ctrl.attraction.entryID+'_Reservation_'
                              //^--to go back one directory and into different directory
                }
            }).then(function(response){
                console.log(response);
                $scope.finalFileName = response.config.data.filenameDetail+response.config.file.name;
                console.log($scope.finalFileName);
                


            });
            //$ctrl.fileAttached = $ctrl.files[0];
            //To cloud
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