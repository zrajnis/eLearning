﻿angular.module('eLearning').controller('UserCtrl', ['$scope', '$http', '$window', 'validateService', 'cleanUpService', 'constants', ($scope, $http, $window, validateService, cleanUpService, constants) => {
    $scope.firstNameError = true,
    $scope.lastNameError = true;
    $scope.oldPasswordError = true;
    $scope.passwordError = true;
    $scope.rePasswordError = true;

    $('#settingsModal').on('hidden.bs.modal', () => {
        $scope.clearSettingsData();
        $scope.$apply();
    });

    $scope.signOut = () => {
        $http({
            method: "POST",
            url: "/Account/SignOut",
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/';
            }
            else {
                alert(JSON.stringify(response.data.message)); //pretty much impossible scenario
            }
        });
    }

    $scope.settingsValidateField = (fieldID) => validateService.validateField(fieldID, $scope);
    $scope.clearSettingsData = () => cleanUpService.clearSettingsData($scope);

    $scope.settingsHttpRequest = (name, inputID, data) => {
        $http({
            method: "POST",
            url: "/Account/Change/" + name,
            data: data
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $('#' + name + 'ChangeBtn').addClass('successBtn').text('Success');
                setTimeout(() => {
                    $('#' + name + 'ChangeBtn').removeClass('successBtn').text('Change');
                }, 2000); 
            }
            else {
                alert(JSON.stringify(response.data.message)); //pretty much impossible scenario
            }

            $scope[inputID] = '';
            if (name === 'password') { //if it was password change,reset old password and re password fields as well
                $scope.settingsOldPassword = '';
                $scope.settingsRePassword = '';
            }
        });
    }
    $scope.change = (inputID) => {
        const name = document.getElementById(inputID).name;
        //if we're changing password check if any of password fields have an error, for other types of changes check if their field has an error
        if ((name !== 'password' && !$scope[name + 'Error']) || (name === 'password' && !$scope.oldPasswordError && !$scope.passwordError && !$scope.rePasswordError)) {
            let data = null;
            switch (name) {
                case 'firstName':
                    data = { FirstName: $scope[inputID] };
                    break;
                case 'lastName':
                    data = { LastName: $scope[inputID] };
                    break;
                case 'password':
                    data = {
                        OldPassword: $scope.settingsOldPassword,
                        NewPassword: $scope.settingsNewPassword,
                        RePassword: $scope.settingsRePassword
                    };
                    break;
            }
            $scope.settingsHttpRequest(name, inputID, data);
        }
    };

}]);