app.service('sendEmailService', function ($http, $rootScope,$timeout) {
    this.sendEmailNoAttachment = function (emailSubject, emailContent, recepientEmail, recepientName, senderName, senderEmail) {
        console.log("inside sendEmailService");
        // $ctrl.successAlert = false;
        // $ctrl.errorAlert = false;
        $http.post(
            "../api/sendEmail.php", {

                'recepientEmail': recepientEmail,
                'recepientName': recepientName,
                'emailSubject': emailSubject,
                'emailContent': emailContent,
                'senderName': senderName,
                'senderEmail': senderEmail

            }
        ).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(response);
            // $ctrl.successAlert = true;
            return response;

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response);
            // $ctrl.errorAlert = true;
            return response;


        });


    }
});