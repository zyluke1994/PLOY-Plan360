
app.controller('viewAttractionCtrl', function ($scope, $http, $rootScope, $uibModal, $log, $document,$ngConfirm) {
    console.log('inside viewAttractionCtrl');
    console.log("username: " + $rootScope.globals.currentUser.username);

    $scope.displayData = function () {
        $http.get("../api/attractions/getAttraction.php")
            .then(function (response) {
                $scope.data = response.data;
                $scope.userLogin = $rootScope.globals.currentUser.username;

            });
    }
    $scope.deleteAttraction = function (id) {
        $ngConfirm({
            title: 'Confirm',
            content: "Are you sure you want to delete this entry?",
            type: 'red',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Delete',
                    btnClass: 'btn-red',
                    action: function () {
                        $http.post("../api/attractions/deleteAttraction.php", { 'attractionID': id })
                            .then(function (response) {
                                $ngConfirm(response.data);
                                $scope.displayData();
                            });
                    }
                },
                close: function () {
                }
            }
        });

    }
    var $ctrl = this;
    $ctrl.item = ['item1', 'item2', 'item3'];

    $ctrl.animationsEnabled = true;

    $scope.openEditModal = function (size, attractionSelected, parentSelector) {
        console.log("open");
        console.log(attractionSelected);

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/viewAttractionModal.html',
            controller: 'viewAttractionModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                attractionSelected: function () {
                    return attractionSelected;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.openAddToPlanModal = function (size, attractionSelected, parentSelector) {
        console.log("open");
        console.log(attractionSelected);

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/addToPlanModal.html',
            controller: 'addToPlanModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                attractionSelected: function () {
                    return attractionSelected;
                }, 
                prePlanSelected: function () {
                    return null;
                },
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




});

