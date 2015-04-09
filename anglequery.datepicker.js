(function () {
    'use strict';
    
    angular.module('nsAnglequery', [])
        .directive('nsDatepicker', nsDatepicker);
    
    function nsDatepicker() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope:{
                options = '&'
            },
            link : link
        };
        return directive;
        
        function link(scope, element, attrs, ngModelCtrl) {
            var _defaults = {
                onSelect: _onSelect
            };
            
            var _options = scope.options || {};
            
            scope.settings = $.extend({}, _defaults, _options);
            scope.instance = element.datepicker(scope.settings);
            
            var _onSelect = function(value) {
                scope.$apply(function(){
                    ngModelCtrl.$setViewValue(value);
                });
            }
            
            var _maxValidator = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (ngModelCtrl.$isEmpty(value) || ngModelCtrl.$isEmpty(scope.settings.maxDate)) return true;
                var dtMaxValue = $.datepicker._determineDate(scope.dpInstance, scope.settings.maxDate, new Date());
                var dtValue = new Date(value);
                return !angular.isDate(dtValue) || dtValue <= dtMaxValue;
            };

            var _formatValidator = function (modelValue, viewValue) {
                var value = viewValue;
                if (ngModelCtrl.$isEmpty(value)) return true;
                try {
                    $.datepicker.parseDate(scope.settings.dateFormat, value);
                    return true;
                }
                catch (err) {}
                return false;
            }

            var _dateFormatter = function (value) {
                //skip empty values
                if (ngModelCtrl.$isEmpty(value)) return;
                return $.datepicker.formatDate(scope.settings.dateFormat, new Date(value));
            }

            if (!ngModelCtrl.$isEmpty(scope.settings.maxDate)) {
                ngModelCtrl.$validators.maxDate = _maxValidator;
            }

            if (!ngModelCtrl.$isEmpty(scope.settings.dateFormat)) {
                ngModelCtrl.$formatters.push(_dateFormatter);

                ngModelCtrl.$validators.format = _formatValidator;
            }
        }
    }
})();
