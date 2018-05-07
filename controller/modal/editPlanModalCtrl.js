app.controller('editPlanModalCtrl', function ($uibModalInstance, planSelected, $http, $rootScope,$ngConfirm) {
    console.log('inside editPlanModalCtrl');
            var userLogin = $rootScope.globals.currentUser.username;

    var $ctrl = this;
    $ctrl.plan = planSelected;
    console.log("planSelected");
    console.log(planSelected);
        console.log(userLogin);

    $ctrl.selected = {
        item: $ctrl.planSelected
    };

    $ctrl.ok = function (id) {
        $uibModalInstance.close($ctrl.selected.planSelected);
    };
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

//    $ctrl.testButton = function(){
//     $ngConfirm({
//         title: 'Confirm',
//         content: "Confirm to update: "+plan.planID+"-"+plan.tripName,
//         type: 'orange',
//         typeAnimated: true,
//         buttons: {
//             tryAgain: {
//                 text: 'Save',
//                 btnClass: 'btn-orange',
//                 action: function(){
//                 }
//             },
//             close: function () {
//             }
//         }
//     });
//    }

    $ctrl.updatePlan = function (plan) {
        console.log("update" + plan.tripName);

        $ngConfirm({
            title: 'Are you sure?',
            content: "Confirm to update: "+plan.planID+"-"+plan.tripName,
            type: 'orange',
            theme: 'light',                                
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Save',
                    btnClass: 'btn-orange',
                    action: function(){
                        $http.post(
                            "../../api/plans/updatePlan.php", {
                                'planID': plan.planID,
                                'tripName': plan.tripName,
                                'tripStart': plan.tripStart,
                                'tripEnd': plan.tripEnd,
                                'tripOrigin': plan.tripOrigin,
                                'tripStops': plan.tripStops,
                                'tripFinalDestination': plan.tripFinalDestination,
                                'planStart': plan.planStart,
                                'planDeadline': plan.planDeadline,
                                'notes': plan.notes,
                                'inputBy': userLogin,
                               
                            }
                        ).then(function (response) {
                            console.log("Data Updated");
                            $uibModalInstance.close($ctrl.selected.planSelected);
            
                        });
                    
                    }
                },
                close: function () {
                }
            }
        });



           
        

    };
});

