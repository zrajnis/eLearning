angular.module('eLearning').controller('UserCtrl', ['$rootScope', '$scope', '$http', '$window', 'validateService', 'cleanUpService', 'courseService', 'constants',
($rootScope, $scope, $http, $window, validateService, cleanUpService, courseService, constants) => {
    //get relevant user data thats going to be displayed in side menu
    $http({
        method: "GET",
        url: "/Account/Load",
    }).then(response => {
        $scope.user = {
            myCourses: response.data.myCourses,
            subscribedCourses: response.data.subscribedCourses
        };
    });

    $('#settingsModal').on('hidden.bs.modal', () => {
        $scope.clearSettingsData();
        $scope.$apply();
    });

    $scope.firstNameError = true,
    $scope.lastNameError = true;
    $scope.oldPasswordError = true;
    $scope.passwordError = true;
    $scope.rePasswordError = true;

    $scope.courseService = courseService;
    $scope.constants = constants;

    $rootScope.$on('subscribe', (event, newCourse) => {
        console.log(JSON.stringify(newCourse.id));
        $scope.user.subscribedCourses.push(newCourse);
    });

    $rootScope.$on('unsubscribe', (event, courseId) => {
        console.log(JSON.stringify(courseId));

        $scope.user.subscribedCourses.forEach((course, index) => {
            if (course.id === courseId) {
                $scope.user.subscribedCourses.splice(index, 1);
            }
        });
    });

    $scope.signOut = () => {
        $http({
            method: "POST",
            url: "/Account/SignOut"
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/';
                return;
            }
            alert(JSON.stringify(response.data.message)); //pretty much impossible scenario
           
        });
    };

    $scope.settingsValidateField = fieldId => validateService.validateField(fieldId, $scope);
    $scope.clearSettingsData = () => cleanUpService.clearSettingsData($scope);

    $scope.changeDataHttpRequest = (name, inputId, data) => {
        $http({
            method: "PUT",
            url: "/Account/Change/" + name,
            data: data
        }).then(response => {
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
                        validateService.errorMsg(item.inputId, item.message);
                    });
                }
                else { //otherwise its a single error from first or last name change
                    validateService.errorMsg(inputId, response.data.message);
                }
            }
        });
    };

    $scope.change = inputId => {
        const name = $('#' + inputId).attr('name');
        //if we're changing password check if any of password fields have an error, for other types of changes check if their field has an error
        if (name !== 'password' && !$scope[name + 'Error'] || name === 'password' && !$scope.oldPasswordError && !$scope.passwordError && !$scope.rePasswordError) {
            let data = null;
            switch (name) {
                case 'firstName':
                    data = { FirstName: $scope[inputId] };
                    break;
                case 'lastName':
                    data = { LastName: $scope[inputId] };
                    break;
                case 'password':
                    data = {
                        OldPassword: $scope.settingsOldPassword,
                        NewPassword: $scope.settingsNewPassword,
                        RePassword: $scope.settingsRePassword
                    };
                    break;
            }
            $scope.changeDataHttpRequest(name, inputId, data);
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

}]);