
app.controller('destinationInfoTemplateCtrl', ['$scope', '$http', '$compile', '$rootScope', 'uiGridConstants', '$ngConfirm', function ($scope, $http, $compile, $rootScope, uiGridConstants, $ngConfirm) {
    console.log('inside destinationInfoTemplateCtrl');
    console.log('username in destinationInfoTemplateCtrl: ' + $rootScope.globals.currentUser.username);
    var dateNow = new Date();
    var userLogin = $rootScope.globals.currentUser.username;
    var userRole = $rootScope.globals.currentUser.role;
    $scope.isAdmin = false;
    $scope.activeTemplate = {};
    $scope.ifSave = true;


    if (userRole == "admin") {
        $scope.isAdmin = true;
    }
    $http.get("../api/destinationPlanInfoTemplate/getTemplate.php")
        .then(function (response) {
            $scope.templateList = response.data;
            console.log($scope.templateList);

        });

    $scope.importTemplate = function (templateSelected) {

        var ifContain = _.findWhere($scope.templateList, { templateID: templateSelected.templateID });

        if (ifContain != null) {
            console.log("Matched");

        } else {
            console.log("Not Matched");
            $scope.templateSelected = "";

        }

        if ($scope.templateSelected == "") {
            $scope.ifSave = true;

        } else {
            $scope.ifSave = false;
        }
        $scope.activeTemplate = templateSelected;
        $scope.initialSelectedCity = $scope.activeTemplate.destinationCity;
        console.log( $scope.initialSelectedCity);
        


    }
    $scope.deleteTemplate = function (templateID) {

        console.log("delete: " + templateID)
        $ngConfirm({
            title: 'Confirm',
            content: "Are you sure to delete?",
            type: 'red',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Delete',
                    btnClass: 'btn-red',
                    action: function () {
                        $http.post(
                            "../api/destinationPlanInfoTemplate/deleteTemplate.php", {
                                'templateID': templateID,


                            }
                        ).then(function (response) {
                            console.log("Data deleted");
                            $scope.insertResponse = response.data;
                            $scope.activeTemplate = "";
                            $scope.templateSelected = "";
                        });
                    }
                },
                close: function () {
                }
            }
        });




    };

    $scope.updateTemplate = function (templateID) {

        console.log("update: " + templateID)


        $ngConfirm({
            title: 'Confirm',
            content: "Are you sure to update?",
            type: 'green',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Update',
                    btnClass: 'btn-green',
                    action: function () {
                       
                        $http.post(
                            "../api/destinationPlanInfoTemplate/updateTemplate.php", {
                                'templateID': templateID,
                                'destinationCity': $scope.activeTemplate.destinationCity,
                                'destinationState': $scope.activeTemplate.destinationState,
                                'destinationCountry': $scope.activeTemplate.destinationCountry,
                                'version': $scope.activeTemplate.version,
                                'briefing': $scope.activeTemplate.briefing,
                                'aboutDestination': $scope.activeTemplate.aboutDestination,
                                'packing': $scope.activeTemplate.packing,
                                'dressing': $scope.activeTemplate.dressing,
                                'weather': $scope.activeTemplate.weather,
                                'payments': $scope.activeTemplate.payments,
                                'electronics': $scope.activeTemplate.electronics,
                                'medical': $scope.activeTemplate.medical,
                                'timeZone': $scope.activeTemplate.timeZone,
                                'language': $scope.activeTemplate.language,
                                'transportation': $scope.activeTemplate.transportation,
                                'telecommunication': $scope.activeTemplate.telecommunication,
                                'hotel': $scope.activeTemplate.hotel,
                                'airport': $scope.activeTemplate.airport,
                                'shopping': $scope.activeTemplate.shopping,
                                'electricity': $scope.activeTemplate.electricity,
                                'drinkingWater': $scope.activeTemplate.drinkingWater,
                                'dining': $scope.activeTemplate.dining,
                                'tips': $scope.activeTemplate.tips,
                                'publicAreas': $scope.activeTemplate.publicAreas,
                                'culture': $scope.activeTemplate.culture,
                                'religion': $scope.activeTemplate.religion,
                                'borderSecurity': $scope.activeTemplate.borderSecurity,
                                'safety': $scope.activeTemplate.safety,
                                'driving': $scope.activeTemplate.driving,
                                'locals': $scope.activeTemplate.locals,
                                'usefulPhone': $scope.activeTemplate.usefulPhone,
                                'others': $scope.activeTemplate.others,
                                'suggestions': $scope.activeTemplate.suggestions,
                                'updatedBy': userLogin,

                            }
                        ).then(function (response) {
                            console.log("Data Updated");
                            $scope.insertResponse = response.data;


                        });
                    }
                },
                close: function () {
                }
            }
        });




    };


    $scope.insertTemplate = function () {
        console.log($scope.activeTemplate);
        if( $scope.initialSelectedCity == $scope.activeTemplate.destinationCity){
            $ngConfirm('New City Needed', 'New City');
            
        }else{
            
        $http.post(
            "../api/destinationPlanInfoTemplate/insertTemplate.php", {
                'destinationCity': $scope.activeTemplate.destinationCity,
                'destinationState': $scope.activeTemplate.destinationState,
                'destinationCountry': $scope.activeTemplate.destinationCountry,
                'version': $scope.activeTemplate.version,
                'briefing': $scope.activeTemplate.briefing,
                'aboutDestination': $scope.activeTemplate.aboutDestination,
                'packing': $scope.activeTemplate.packing,
                'dressing': $scope.activeTemplate.dressing,
                'weather': $scope.activeTemplate.weather,
                'payments': $scope.activeTemplate.payments,
                'electronics': $scope.activeTemplate.electronics,
                'medical': $scope.activeTemplate.medical,
                'timeZone': $scope.activeTemplate.timeZone,
                'language': $scope.activeTemplate.language,
                'airport': $scope.activeTemplate.airport,
                'transportation': $scope.activeTemplate.transportation,
                'telecommunication': $scope.activeTemplate.telecommunication,
                'hotel': $scope.activeTemplate.hotel,
                'shopping': $scope.activeTemplate.shopping,
                'electricity': $scope.activeTemplate.electricity,
                'drinkingWater': $scope.activeTemplate.drinkingWater,
                'dining': $scope.activeTemplate.dining,
                'tips': $scope.activeTemplate.tips,
                'publicAreas': $scope.activeTemplate.publicAreas,
                'culture': $scope.activeTemplate.culture,
                'religion': $scope.activeTemplate.religion,
                'borderSecurity': $scope.activeTemplate.borderSecurity,
                'safety': $scope.activeTemplate.safety,
                'driving': $scope.activeTemplate.driving,
                'locals': $scope.activeTemplate.locals,
                'usefulPhone': $scope.activeTemplate.usefulPhone,
                'others': $scope.activeTemplate.others,
                'suggestions': $scope.activeTemplate.suggestions,
                'updatedBy': userLogin,

            }
        ).then(function (response) {

            console.log(response.data);

            $scope.insertResponse = response.data;
            clearTable();




        })
    }
    };

    function clearTable() {

        $scope.activeTemplate = {};

    }

}]);
