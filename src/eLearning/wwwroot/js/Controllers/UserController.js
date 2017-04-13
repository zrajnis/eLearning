angular.module('eLearning').controller('UserCtrl', ['$scope', '$http', '$window', 'validateService', 'cleanUpService', 'courseService', 'constants',
($scope, $http, $window, validateService, cleanUpService, courseService, constants) => {
    $scope.firstNameError = true,
    $scope.lastNameError = true;
    $scope.oldPasswordError = true;
    $scope.passwordError = true;
    $scope.rePasswordError = true;

    $scope.courseService = courseService;
    $scope.constants = constants;

    $('#settingsModal').on('hidden.bs.modal', () => {
        $scope.clearSettingsData();
        $scope.$apply();
    });

    $scope.signOut = () => {
        $http({
            method: "POST",
            url: "/Account/SignOut"
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/';
            }
            else {
                alert(JSON.stringify(response.data.message)); //pretty much impossible scenario
            }
        });
    };

    $scope.settingsValidateField = (fieldID) => validateService.validateField(fieldID, $scope);
    $scope.clearSettingsData = () => cleanUpService.clearSettingsData($scope);

    $scope.changeDataHttpRequest = (name, inputID, data) => {
        $http({
            method: "PUT",
            url: "/Account/Change/" + name,
            data: data
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $('#' + name + 'ChangeBtn').addClass('successBtn').text('Success');

                setTimeout(() => {
                    $('#' + name + 'ChangeBtn').removeClass('successBtn').text('Change');
                }, 2000);

                cleanUpService.clearSettingsData($scope);
            }
            else {
                if (response.data.errorList) { //password change can return multiple errors
                    validateService.removeErrorMsg('settingsOldPassword');
                    validateService.removeErrorMsg('settingsNewPassword');
                    validateService.removeErrorMsg('settingsRePassword');

                    response.data.errorList.forEach((item) => {
                        validateService.errorMsg(item.inputID, item.message);
                    });
                }
                else { //otherwise its a single error from first or last name change
                    validateService.errorMsg(inputID, response.data.message);
                }
            }
        });
    };

    $scope.change = (inputID) => {
        const name = $('#' + inputID).attr('name');
        //if we're changing password check if any of password fields have an error, for other types of changes check if their field has an error
        if (name !== 'password' && !$scope[name + 'Error'] || name === 'password' && !$scope.oldPasswordError && !$scope.passwordError && !$scope.rePasswordError) {
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
            $scope.changeDataHttpRequest(name, inputID, data);
        }
    };

    $scope.deactivate = () => {
        $http({
            method: "DELETE",
            url: "/Account/Deactivate"
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/';
            }
            else {
                $scope.deactivateDecision = false;
                validateService.errorMsg('settingsDeactivate', response.data.message);
            }
        });
    };

    $scope.handleFile = () => { alert('aa');}
}]);