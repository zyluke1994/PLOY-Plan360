app.controller('inputAttractionCtrl', function ($scope, $http, $compile, $rootScope, $sce, $ngConfirm) {
    $("select.image-picker").imagepicker();

    console.log('inside inputAttractionCtrl');
    console.log('username in inputAttractionCtrl: ' + $rootScope.globals.currentUser.username);
    var dateNow = new Date();
    var userLogin = $rootScope.globals.currentUser.username;
    $scope.attractionList = [];
    $scope.loadingHide = true;
    $scope.wikiLinks = true;
    $scope.imageSelect = true;
    $scope.insertToForm = function (url) {
        console.log('insertForm');

        if ($scope.photoURL1 == "" || $scope.photoURL1 == null) {
            $scope.photoURL1 = url;
            $scope.attractionPhotoListFilter = _.without($scope.attractionPhotoListFilter, url);


        } else if ($scope.photoURL2 == "" || $scope.photoURL2 == null) {
            $scope.photoURL2 = url;
            $scope.attractionPhotoListFilter = _.without($scope.attractionPhotoListFilter, url)

        }
        console.log($scope.photoURL1.length);

        if ($scope.photoURL1.length > 0 && $scope.photoURL2.length > 0) {
            console.log("filled");

            $scope.imageSelect = true;
            //$scope.attractionName=$scope.wikiTempPageName;



        }

    }
    $scope.getAttractionFromWiki = function (val) {

        $http.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: "opensearch",
                search: val,
                limit: "500",
            },

        }).then(function (response) {
            console.log(response);
            $scope.wikiPageList = response.data[1];
            $scope.wikiLinks = false;
            return response;

        });
    };

    $scope.getWikiLinkContent = function (page) {

        $http.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: "query",
                titles: page,
                prop: "extracts",
                exintro: true,
                explaintext: true,
                format: "json"
            },

        }).then(function (response) {
            console.log(response.data.query.pages);
            var pageObject = response.data.query.pages;
            $scope.wikiContent = pageObject[Object.keys(pageObject)[0]];
            console.log($scope.wikiContent.extract);
            $scope.details = $scope.wikiContent.extract;
            $scope.wikiLinks = true;
            $scope.wikiTempPageName = page;
            if (typeof $scope.website === "undefined" || $scope.website.length <= 0) {
                $scope.website = "https://en.wikipedia.org/wiki/" + page;
            }
            $scope.getPhotosListForAttraction(page);

            return response;


        });
    };
    $scope.getPhotosListForAttraction = function (val) {

        $http.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: "query",
                titles: val,
                prop: "images",
                imlimit: "50",
                format: "json"
            },

        }).then(function (response) {
            var pageObject = response.data.query.pages;
            var attractionPhotoList = pageObject[Object.keys(pageObject)[0]].images;
            var count = 0;
            $scope.attractionPhotoListFilter = [];

            attractionPhotoList.forEach(function (n) {
                if (n.title.endsWith(".jpg") && count < 20) {
                    $scope.getPhotosLinkForAttraction(n.title);
                    count++;
                }

            }
            );
            $scope.imageSelect = false;

            console.log($scope.attractionPhotoListFilter);

            return response;

        });


    };
    $scope.getPhotosLinkForAttraction = function (val) {

        $http.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: "query",
                titles: val,
                prop: "imageinfo",
                format: "json",
                iiprop: "url"
            },

        }).then(function (response) {
            var pageObject = response.data.query.pages;

            var first = pageObject[Object.keys(pageObject)[0]];
            $scope.attractionPhotoListFilter.push(first.imageinfo[0].url);
            return first.imageinfo[0].url;

        });
    };

    $scope.getLocation = function (val) {

        return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false,
                // key: "AIzaSyAgwJFMjT3_ScuTzHJEQwURQ7_Mz7cGNX4"
            },

        }).then(function (response) {
            return response.data.results.map(function (item) {
                console.log(item);
                $scope.GPS = item.geometry.location.lat + ', ' + item.geometry.location.lng;
                $scope.address = item.formatted_address;
                return item;
            });
        });
    };
    $scope.getAttractionID = function (val) {

        return $http.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: val,
                sensor: false,
                key: "AIzaSyBCwnthqJGd-U5uva7tiv9Pc8FKjUr_Op8"
            },

        }).then(function (response) {
            return response.data.results.map(function (item) {

                //   console.log(item);
                //$scope.GPS=item.geometry.location.lat + ', '+item.geometry.location.lng;
                $scope.attraction = item.name;
                $scope.attractionList = response.data.results;

                console.log($scope.attractionList);
                console.log($scope.attractionSelected);

                return item;
            });
        });
    };


    $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
        $scope.loadingHide = false;
        var place = $scope.attractionName.getPlace();
        var address_componentsLength = place.address_components.length;
        console.log(address_componentsLength);

        console.log(place);
        var cityDecode = "";
        var stateDecode = "";
        var countryDecode = "";

        $scope.addressIn = place.formatted_address;
        $scope.attractionName = place.name;
        $scope.photoURL1 = "";
        $scope.photoURL2 = "";
        $scope.details = "";

        place.address_components.forEach(function (i) {

            if (i.types.includes("locality")) {
                cityDecode = i.long_name;

            }
            // if (i.types.includes("administrative_area_level_2") && !i.types.includes("locality")) {
            //     cityDecode = i.long_name;
            // };
            if (i.types.includes("administrative_area_level_1")) {
                stateDecode = i.short_name;
            }
            if (i.types.includes("country")) {
                countryDecode = i.long_name;
            }

        });

        $scope.state = stateDecode;

        $scope.city = cityDecode;
        $scope.country = countryDecode;


        $scope.GPS = place.geometry.location.lat() + ', ' + place.geometry.location.lng();
        $scope.phone = place.international_phone_number;
        $scope.attractionIcon = place.icon;
        $scope.website = place.website;
        if (place.opening_hours != null) {
            $scope.hours = place.opening_hours.weekday_text[0] + " , \n" + place.opening_hours.weekday_text[1] + " , \n" +
                place.opening_hours.weekday_text[2] + " , \n" + place.opening_hours.weekday_text[3] + " , \n" +
                place.opening_hours.weekday_text[4] + " , \n" + place.opening_hours.weekday_text[5] + " , \n" + place.opening_hours.weekday_text[6];

        } else {
            $scope.hours = "";
        }
        $scope.publicTrans = place.url;
        $scope.recommend = place.rating;
        $scope.inputBy = userLogin;
        $scope.fourSquareSearchResult = $scope.findFoursquare($scope.attractionName, $scope.GPS);
        // console.log(  $scope.fourSquareSearchResult);
        // $scope.fourSqaureSearchResultID = $scope.fourSquareSearchResult.response.venues[0].id;
        // $scope.fourSqaureSearchResultName = $scope.fourSquareSearchResult.response.venues[0].name;
        $scope.notes = "Google PlaceID: " + place.place_id;

        $scope.loadingHide = true;


        $scope.$apply();
    });
    $scope.findFoursquare = function (name, location) {
        var clientID = "O2TETJE1W3AFQPTVVPCGS2BJCBPVW4BK1GCNETKMNEF0FUEJ";
        var clientSecret = "BPU3PG0GQBBKDA3MMEHA2BHJ3GLSWSYLPCXATDAOYSALZ1RP";
        var url = "https://api.foursquare.com/v2/venues/search?query=" + name + "&near=" + location + "&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20180509";
        $.getJSON(url, function (data) {
            //data is the JSON string
            console.log(data);
            $scope.notes = $scope.notes + "\n" + "Foursquare ID: " + data.response.venues[0].id + "\n" + "Foursquare Name: " + data.response.venues[0].name;
            var venueURL = "https://api.foursquare.com/v2/venues/"+data.response.venues[0].id+"?client_id=" + clientID+ "&client_secret=" + clientSecret + "&v=20180509";

            $.getJSON(venueURL, function (data) {
                console.log(data);
                $scope.photoURL1 = data.response.venue.bestPhoto.prefix+"original"+data.response.venue.bestPhoto.suffix;
                $scope.details = data.response.venue.description;

            });
        });
        //return toReturn;


        // $http.get("https://api.foursquare.com/v2/venues/search", {
        //     params: {
        //       query: name,
        //       near:location,
        //       client_id:clientID,
        //       client_secret:clientSecret,
        //       v:"20180509"

        //     },
        //     headers: {
        //         'Content-Type': 'application/json', /*or whatever type is relevant */
        //         'Accept': 'application/json' /* ditto */
        //     }
        //   })
        //     .then(function (response) {
        //         console.log(response);

        //     });
    }

    $scope.insertAttraction = function () {


        $ngConfirm({
            title: 'Confirm',
            content: "Confirm to insert?",
            type: 'orange',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Save',
                    btnClass: 'btn-orange',
                    action: function () {
                        $http.post(
                            "../api/attractions/insertAttraction.php", {
                                'attractionName': $scope.attractionName,
                                'country': $scope.country,
                                'state': $scope.state,
                                'city': $scope.city,
                                'gps': $scope.GPS,
                                'category': $scope.category,
                                'duration': $scope.duration,
                                'address': $scope.addressIn,
                                'phone': $scope.phone,
                                'website': $scope.website,
                                'ticket': $scope.ticket,
                                'parking': $scope.parking,
                                'publicTrans': $scope.publicTrans,
                                'hours': $scope.hours,
                                'details': $scope.details,
                                'notes': $scope.notes,
                                'photoURL1': $scope.photoURL1,
                                'photoURL2': $scope.photoURL2,
                                'recommend': $scope.recommend,
                                'reservation': $scope.reservation,
                                'updatedBy': userLogin,
                            }
                        ).then(function (response) {
                            console.log("Data Inserted");
                            clearTable();
                        })
                    }
                },
                close: function () {
                }
            }
        });
    };

    function clearTable() {
        $scope.attractionName = "";
        $scope.state = "";
        $scope.city = "";
        $scope.GPS = "";
        $scope.category = "";
        $scope.duration = "";
        $scope.addressIn = "";
        $scope.phone = "";
        $scope.website = "";
        $scope.ticket = "";
        $scope.parking = "";
        $scope.publicTrans = "";
        $scope.hours = "";
        $scope.details = "";
        $scope.notes = "";
        $scope.photoURL1 = "";
        $scope.photoURL2 = "";
        $scope.recommend = "";
        $scope.reservation = "";


    }

});
