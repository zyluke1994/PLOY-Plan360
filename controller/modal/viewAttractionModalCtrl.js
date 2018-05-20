app.controller('viewAttractionModalInstanceCtrl', function ($uibModalInstance, attractionSelected, $http,$ngConfirm) {
    console.log('inside viewAttractionModalInstanceCtrl');
    var $ctrl = this;
    $ctrl.attraction = attractionSelected;
    console.log("attractionSelected");
    console.log(attractionSelected);

    $ctrl.selected = {
        item: $ctrl.attractionSelected
    };

    $ctrl.ok = function (id) {
        $uibModalInstance.close($ctrl.selected.attractionSelected);
    };
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $ctrl.updateAttraction = function (attraction) {
        console.log("update" + attraction.attractionName);

        $ngConfirm({
                    title: 'Confirm',
                    content: "Confirm to update: "+attraction.attractionID+"-"+attraction.attractionName,
                    type: 'orange',
                    typeAnimated: true,
                    buttons: {
                        tryAgain: {
                            text: 'Save',
                            btnClass: 'btn-orange',
                            action: function(){
                                $http.post(
                                    "../../api/attractions/updateAttraction.php", {
                                        'attractionName': attraction.attractionName,
                                        'country': attraction.country,
                                        'state': attraction.state,
                                        'city': attraction.city,
                                        'gps': attraction.GPSCoordinates,
                                        'category': attraction.category,
                                        'duration': attraction.durationSuggest,
                                        'address': attraction.address,
                                        'phone': attraction.phone,
                                        'website': attraction.website,
                                        'ticket': attraction.ticketInfo,
                                        'parking': attraction.parkingInfo,
                                        'publicTrans': attraction.publicTransport,
                                        'hours': attraction.hours,
                                        'details': attraction.description,
                                        'notes': attraction.notes,
                                        'photoURL1': attraction.picture1URL,
                                        'photoURL2': attraction.picture2URL,
                                        'recommend': attraction.recommendRating,
                                        'reservation': attraction.reservationNeeded,
                                        'attractionID': attraction.attractionID,
                                        'google_places_id': attraction.google_places_id,
                                        'foursquare_places_id': attraction.foursquare_places_id,
                                    }
                                ).then(function (response) {
                                    console.log("Data Updated");
                                    $uibModalInstance.close($ctrl.selected.attractionSelected);
                    
                                });
                            }
                        },
                        close: function () {
                        }
                    }
                });


    };
});

