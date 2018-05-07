app.controller('addToPlanModalInstanceCtrl', function ($scope, $uibModalInstance, attractionSelected, prePlanSelected, $http, $rootScope, $ngConfirm) {
    console.log('inside addToPlanInstanceCtrl');
    var userLogin = $rootScope.globals.currentUser.username;

    $http.get("../api/customers/getCustomer.php")
        .then(function (response) {
            $ctrl.customerList = response.data;
            $ctrl.userLogin = $rootScope.globals.currentUser.username;
        });
    $http.get("../api/attractions/getAttraction.php")
        .then(function (response) {
            $ctrl.attractionList = response.data;
        });


    var $ctrl = this;
    $ctrl.attraction = attractionSelected;
    console.log("attractionSelected");
    console.log(attractionSelected);
    console.log("planSelected");
    console.log(prePlanSelected);
    $scope.showSelectPlanDiv = true;

    $ctrl.addEndTime = function (hours) {
        console.log("addendtime called");
        var dateVisitEnd = moment($scope.dateVisitStart).add(hours,'hours');
        $scope.dateVisitEnd = new Date(dateVisitEnd);
    };

    if (prePlanSelected != null) {
        console.log("preplanSelected has something")
        $ctrl.planSelected = prePlanSelected;
        $scope.showSelectPlanDiv = false;
    }
    console.log($ctrl.planSelected);

    $ctrl.selected = {
        item: $ctrl.attractionSelected
    };

    $ctrl.ok = function (id) {
        $uibModalInstance.close($ctrl.selected.attractionSelected);
    };
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.updateSelectedCustomer = function () {
        $ctrl.filteredPlanList = [];
        console.log("selected Customer" + $ctrl.customerSelected.fullName + $ctrl.customerSelected.customerID);
        $http.get("../api/plans/getPlans.php")
            .then(function (response) {
                $ctrl.planList = response.data;
                $ctrl.planList.forEach(function (item) {
                    if ($ctrl.customerSelected.customerID == item.customerID) {

                        console.log("MATCH: " + $ctrl.customerSelected.customerID + ":" + item.customerID);
                        $ctrl.filteredPlanList.push(item);
                    }
                })
            })
        console.log($ctrl.filteredPlanList);

        console.log($ctrl.filteredPlanList.customerID);
    }
    $ctrl.insertPlanEntry = function () {
        if ($scope.timeToTravelDay == null) {
            $scope.timeToTravelDay = 0;
        } if ($scope.timeToTravelHour == null) {
            $scope.timeToTravelHour = 0;
        } if ($scope.timeToTravelMinute == null) {
            $scope.timeToTravelMinute = 0;
        }
        $scope.timeToTravel = $scope.timeToTravelDay + "_" + $scope.timeToTravelHour + "_" + $scope.timeToTravelMinute;

        // console.log($ctrl.customerSelected.customerID);
        console.log(moment($scope.dateVisitStart).format('YYYY-MM-DDTHH:mm:ss'));
        var formattedStart = moment($scope.dateVisitStart).format('YYYY-MM-DDTHH:mm:ss');
        var formattedEnd = moment($scope.dateVisitEnd).format('YYYY-MM-DDTHH:mm:ss');
        console.log(moment($scope.dateVisitEnd).format('YYYY-MM-DDTHH:mm:ss'));
        console.log($scope.timeToTravel);
        console.log(userLogin);
        if (prePlanSelected != null) {
            console.log("preplanSelected has something")
            $ctrl.planSelected = prePlanSelected;
        }
        console.log($ctrl.planSelected.planID);

        $http.post(
            "../api/planEntry/insertPlanEntry.php", {
                'attractionID': $ctrl.attraction.attractionID,
                'visitStart': formattedStart,
                'visitEnd': formattedEnd,
                'previousAttractionID': "",
                'timeToTravel': $scope.timeToTravel,
                'planID': $ctrl.planSelected.planID,
                'inputBy': userLogin,
                'planEntryMemo': $scope.planEntryMemo,

            }
        ).then(function (response) {
            $scope.insertPlanResponse = response.data;
            console.log("Data Inserted");
            $uibModalInstance.close();

        })
    };
    /* Bindable functions
       -----------------------------------------------*/
    $scope.endDateBeforeRender = endDateBeforeRender
    $scope.endDateOnSetTime = endDateOnSetTime
    $scope.startDateBeforeRender = startDateBeforeRender
    $scope.startDateOnSetTime = startDateOnSetTime


    function startDateOnSetTime() {
        $scope.$broadcast('start-date-changed');
    }

    function endDateOnSetTime() {
        $scope.$broadcast('end-date-changed');
    }

    function startDateBeforeRender($dates) {
        if ($scope.dateVisitEnd) {
            var activeDate = moment($scope.dateVisitEnd);

            $dates.filter(function (date) {
                return date.localDateValue() >= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
        }
    }

    function endDateBeforeRender($view, $dates) {
        if ($scope.dateVisitStart) {
            var activeDate = moment($scope.dateVisitStart).subtract(1, $view).add(1, 'minute');

            $dates.filter(function (date) {
                return date.localDateValue() <= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
        }
    }

});

