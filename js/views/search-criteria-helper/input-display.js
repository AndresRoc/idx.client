/*global define*/
define([
    '../../../bower_components/jquery/dist/jquery.min',
    'underscore',
    'backbone',
    'handlebars',
    'accounting'
], function ($, _, Backbone, Handlebars, Accounting) {
    'use strict';

    var clearInput = function($el, criteriaType, inputEl) {

        var inputId = inputEl.attr('id');

        switch(criteriaType) {
            case "currency":
                clearRange($el, '#headingPrice .panel-title .range-preview', inputId);
                break;
            case 'home-size':
                clearRange($el, '#headingHomeSize .panel-title .range-preview', inputId);
                break;
            case 'year-built':
                clearRange($el, '#headingYearBuilt .panel-title .range-preview', inputId);
                break;
            case 'parking':
                $el.find('#headingParking .panel-title .range-preview .parking-amt').html("");
                break;
            case 'beds':
                $el.find('#headingBedBath .panel-title .range-preview .beds-amt').html("");
                break;
            case 'baths':
                $el.find('#headingBedBath .panel-title .range-preview .baths-amt').html("");
                break;
        }
    };

    var clearRange = function($el, rootSel, targetId) {

        var theSel;

        if (targetId.endsWith('min')) {
            theSel = rootSel + ' .range-min';
        } else if (targetId.endsWith('max')) {
            theSel = rootSel + ' .range-max';
        }

        if (theSel) {
            $el.find(theSel).html("");
        }

        setRangeSymbols($el, rootSel);
    };

    var setRangeSymbols = function($el, rootSel) {

        $el.find(rootSel + ' .range-dash').addClass('hidden');
        $el.find(rootSel + ' .range-gte').addClass('hidden');
        $el.find(rootSel + ' .range-lte').addClass('hidden');

        var minVal = $el.find(rootSel + ' .range-min').html();
        var maxVal = $el.find(rootSel + ' .range-max').html();

        if (minVal && maxVal) {
            $el.find(rootSel + ' .range-dash').removeClass('hidden');
        }
        else if (minVal && !maxVal) {
            $el.find(rootSel + ' .range-gte').removeClass('hidden');
        }
        else if (!minVal && maxVal) {
            $el.find(rootSel + ' .range-lte').removeClass('hidden');
        }
    };

    var formatInput = function(params) {

        var $el = params.$el;
        var criteriaType = params.criteriaType;
        var inputEl = params.inputEl;
        var isOnBlur = params.isOnBlur;

        var inputId = inputEl.attr('id');
        var inputVal = inputEl.val();

        switch(criteriaType) {
            case "currency":

                var formattedCurrency = Accounting.formatMoney(inputVal, {precision:0});

                if (isOnBlur) {
                    inputEl.val(formattedCurrency);
                }

                populateRange($el, '#headingPrice .panel-title .range-preview', inputId, formattedCurrency);

                break;
            case 'home-size':
                populateRange($el, '#headingHomeSize .panel-title .range-preview', inputId , inputVal + " sqft");
                break;
            case 'year-built':
                populateRange($el, '#headingYearBuilt .panel-title .range-preview', inputId , inputVal);
                break;
            case 'parking':
                $el.find('#headingParking .panel-title .range-preview .parking-amt').html(" + " + inputVal + " parking");
                break;
            case 'beds':
                $el.find('#headingBedBath .panel-title .range-preview .beds-amt').html(" + " + inputVal + " beds");
                break;
            case 'baths':
                $el.find('#headingBedBath .panel-title .range-preview .baths-amt').html(" + " + inputVal + " baths");
                break;
        }
    };

    var populateRange = function($el, rootSel, targetId, value) {

        var theSel;

        if (targetId.endsWith('min')) {
            theSel = rootSel + ' .range-min';
        } else if (targetId.endsWith('max')) {
            theSel = rootSel + ' .range-max';
        }

        if (theSel) {
            $el.find(theSel).html(value);
        }

        setRangeSymbols($el, rootSel);
    };

    var unformatCurrency = function(currencyVal) {
        return Accounting.unformat(currencyVal);
    };

    var inputDisplay = {
        clearInput: clearInput,
        formatInput: formatInput,
        unformatCurrency: unformatCurrency
    };

    return inputDisplay;
});