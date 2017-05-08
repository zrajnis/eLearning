const app = angular.module('eLearning', ['ngRoute', 'ngFileUpload']);

app.constant('constants', {
    firstNameRegex: /^[a-zA-Z0-9.'\s]{2,32}$/,
    lastNameRegex: /^[a-zA-Z0-9.'\s]{2,32}$/,
    emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    passwordRegex: /^(?=.*\d).{6,}$/,
    pointsRegex: /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/,
    lengthRegex: /^[2-5]$/,

    fileError: 'Please upload a file in .pdf format.',
    sizeError: 'File must be smaller than 10MB.',
    answersLengthError: 'Must provide between 2 and 5 answers.',
    lessonsLengthError: 'Must provide between 1 and 10 lessons.',
    exercisesLengthError: 'Maximum of 10 exercises reached.',
    questionsLengthError: 'Must provide between 1 and 100 questions.',
    nameError: 'Please enter a valid name.',
    courseDescriptionError: 'Please enter a valid description.',
    descriptionError: 'Please enter a valid description.',
    sentenceError: 'Please enter a valid sentence.',
    pointsError: 'Please enter a valid amount of points.',
    firstNameError: 'Please enter a valid first name.',
    lastNameError: 'Please enter a valid last name.',
    emailError: 'Please enter a valid email address.',
    passwordError: 'Must have at least 1 digit and length of 6.',
    rePasswordError: 'Passwords must match.',
    signUpError: 'Sign up failed.',
    signInError: 'Sign in failed.'
});

app.directive('validWhen', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            return scope.$watch(attrs.validWhen, function (newVal) {
                return ngModel.$setValidity('validWhen', newVal);
            });
        }
    };
});

interact('.draggable')
  .draggable({
      restrict: {
          //restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      autoScroll: true,
      onmove: window.dragMoveListener
  })
  .resizable({
      edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
      var target = event.target;
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      y = (parseFloat(target.getAttribute('data-y')) || 0);

      // update the element's style
      target.style.width = event.rect.width + 'px';
      target.style.height = event.rect.height + 'px';

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
     
  });

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
};