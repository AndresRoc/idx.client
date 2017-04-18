/*global define*/
define([
    '../../../bower_components/jquery/dist/jquery.min',
    'underscore',
    'backbone',
    'handlebars',
    'views/search-criteria-helper/input-display',
    'views/search-criteria-helper/input-submit'
], function ($, _, Backbone, Handlebars, InputDisplay, InputSubmit) {
    'use strict';

    //params: $el, inputId, criteriaType
    var applyHandler = function(params) {

        var inputId = params.inputId;

        if (inputId.search('Checkbox') > -1 || inputId.search('Radio') > -1) {
            applyCheckboxHandler(params);
        }
        else {
            applyTextBoxHandler(params);
        }
    };

    var applyTextBoxHandler = function(params) {

        var $el = params.$el;
        var inputId = params.inputId;
        var criteriaType = params.criteriaType;

        var typingTimer;
        var doneTypingIntervalMS = 1500;

        var inputEl = $el.find('#' + inputId);

        inputEl.blur(function(e) {
            processInput({
                $el: $el,
                criteriaType: criteriaType,
                inputEl: inputEl,
                isOnBlur: true
            });
        });

        inputEl.focus(function(e) {
            var inputVal = e.target.value;

            if (inputVal && criteriaType === "currency") {
                e.target.value = InputDisplay.unformatCurrency(inputVal);
            }
        });

        inputEl.on('keyup', function() {
            clearTimeout(typingTimer);

            typingTimer = _.delay(function() {
                processInput({
                    $el: $el,
                    criteriaType: criteriaType,
                    inputEl: inputEl,
                    isOnBlur: false
                });
            }, doneTypingIntervalMS);

        });

        inputEl.on('keydown', function() {
            clearTimeout(typingTimer);
        });
    };

    var applyCheckboxHandler = function(params) {
        var $el = params.$el;
        var inputId = params.inputId;

        $el.find('#' + inputId).change(function() {
            InputSubmit.submitSearchCriteria($el);
        });
    };

    var processInput = function(params) {

        var $el = params.$el;
        var criteriaType = params.criteriaType;
        var inputEl = params.inputEl;
        var isOnBlur = params.isOnBlur;

        if (!inputEl.val()) {
            InputDisplay.clearInput($el, criteriaType, inputEl);
        }
        else {
            InputDisplay.formatInput({
                $el: $el,
                criteriaType: criteriaType,
                inputEl: inputEl,
                isOnBlur: isOnBlur
            });
        }

        InputSubmit.submitSearchCriteria($el);
    };


    var InputHandler = {

        //params: $el, criteriaType, inputIds
        applyInputHandlers: function(params) {

            var $el = params.$el;
            var criteriaType = params.criteriaType;
            var inputIds = params.inputIds;

            _.each(inputIds, function(inputId) {
                applyHandler({
                    $el: $el,
                    inputId: inputId,
                    criteriaType: criteriaType
                });
            });
        }
    };

    return InputHandler;
});