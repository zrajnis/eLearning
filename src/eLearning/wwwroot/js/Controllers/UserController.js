angular.module('eLearning').controller('UserCtrl', ['$rootScope', '$scope', '$http', '$window', 'validateService', 'cleanUpService', 'courseService', 'constants', '$timeout',
($rootScope, $scope, $http, $window, validateService, cleanUpService, courseService, constants, $timeout) => {
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
        validateService.resetValidity($scope.settingsFirstNameForm);
        validateService.resetValidity($scope.settingsLastNameForm);
        validateService.resetValidity($scope.settingsPasswordForm);
        $scope.$apply();
    });

    $scope.courseService = courseService;
    $scope.constants = constants;

    $rootScope.$on('subscribe', (event, newCourse) => {
        $scope.user.subscribedCourses.push(newCourse);
    });

    $rootScope.$on('unsubscribe', (event, courseId) => {
        $scope.user.subscribedCourses.forEach((course, index) => {
            if (course.id === courseId) {
                $scope.user.subscribedCourses.splice(index, 1);
            }
        });
    });

    $rootScope.$on('updateScore', event => {
        $scope.$apply();
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

    $scope.changeDataHttpRequest = (name, inputId, data, formName) => {
        $http({
            method: "PUT",
            url: "/Account/Change/" + name,
            data: data
        }).then(response => {
            if (response.data.message === 'Success!') {
                $('#' + name + 'ChangeBtn').addClass('btn-success').text('Success');
                $timeout(() => {
                    $('#' + name + 'ChangeBtn').removeClass('btn-success').text('Change');
                }, 2000);

                validateService.resetValidity(formName);
                cleanUpService.clearSettingsData($scope);
            }
            else { 
                validateService.resetValidity(formName);
                if (response.data.errorList) {
                    response.data.errorList.forEach((item) => {
                        $scope[item.inputId + 'Error'] = true;                       
                        let defaultMessage = $('#' + item.inputId + 'Error').text();
                      
                        $('#' + item.inputId + 'Error').text(item.message);
                        $('#' + item.inputId).addClass('hasError');
                        $timeout(() => {
                            $scope[item.inputId + 'Error'] = false;
                            $('#' + item.inputId + 'Error').text(defaultMessage);
                            $('#' + item.inputId).removeClass('hasError');
                        }, 2000);
                    });
                    return;
                }
                    validateService.touchOnSubmit(formName);
            }
        });
    };

    $scope.change = (inputId, formName) => {
        const name = $('#' + inputId).attr('name');

        if (!formName.$valid) {
            validateService.touchOnSubmit(formName);
            return;
        }

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
        $scope.changeDataHttpRequest(name, inputId, data, formName);
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
                $scope.deactivateErrorMsg = response.data.message;
                $timeout(() => {
                    $scope.deactivateErrorMsg = '';
                }, 2000);
            }
        });
    };

}]);