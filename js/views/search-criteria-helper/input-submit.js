/*global define*/
define([
    '../../../bower_components/jquery/dist/jquery.min',
    'underscore',
    'backbone',
    'handlebars',
    'accounting',
    'moment',
    'utils'
], function ($, _, Backbone, Handlebars, Accounting, Moment, Utils) {
    'use strict';

    var CriteriaTerm = Backbone.Model.extend();

    var submitSearchCriteria = function($el) {

        var rangeQueries = getRangeQueries($el);
        var criteriaTerms = getCriteriaTerms($el);
        var openHouseQuery = getOpenHouseQuery($el);

        Utils.eventDispatcher.trigger('listings-search-criteria:range-update', rangeQueries);
        Utils.eventDispatcher.trigger('listings-search-criteria:criteria-term-update', criteriaTerms);
        Utils.eventDispatcher.trigger('listings-search-criteria:open-house-update', openHouseQuery);

        _.delay(function() {
            Utils.eventDispatcher.trigger('listings:query');
        }, 100);
    };

    var getRangeQueries = function($el) {
        var ranges = [];

        var priceRange = getRange({
            $el: $el,
            field: 'listPrice',
            minSel: '#price-min',
            maxSel: '#price-max',
            rangeHandler: function(priceMin, priceMax) {

                var result = {};
                if (priceMin) {
                    result.min = Accounting.unformat(priceMin);
                }

                if (priceMax) {
                    result.max = Accounting.unformat(priceMax);
                }

                return result;
            }
        });

        if (priceRange) {
            ranges.push(priceRange);
        }

        var homeSqftRange = getRange({
            $el: $el,
            field: 'sqftTotal',
            minSel: '#sqft-min',
            maxSel: '#sqft-max'
        });

        if (homeSqftRange) {
            ranges.push(homeSqftRange);
        }

        var beds = getRange({
            $el: $el,
            field: 'bedsTotal',
            minSel: '#beds-amt',
            maxSel: '#beds-amt',
            rangeHandler: function(min, max) {
                return {
                    min: min,
                    max: 99
                }
            }
        });

        if (beds) {
            ranges.push(beds);
        }

        var baths = getRange({
            $el: $el,
            field: 'bathsFull',
            minSel: '#baths-amt',
            maxSel: '#baths-amt',
            rangeHandler: function(min, max) {
                return {
                    min: min,
                    max: 99
                }
            }
        });

        if (baths) {
            ranges.push(baths);
        }

        var yearBuiltRange = getRange({
            $el: $el,
            field: 'yearBuilt',
            minSel: '#year-built-min',
            maxSel: '#year-built-max'
        });

        if (yearBuiltRange) {
            ranges.push(yearBuiltRange);
        }

        var parking = getRange({
            $el: $el,
            field: 'parkingTotal',
            minSel: '#parking-amt',
            maxSel: '#parking-amt',
            rangeHandler: function(min, max) {
                return {
                    min: min,
                    max: 99
                }
            }
        });

        if (parking) {
            ranges.push(parking);
        }

        //has photos
        if ($el.find('#has-photos-checkbox').is(':checked')) {
            ranges.push({
                field:'photoCount',
                from:1,
                to:9999
            })
        }

        return ranges;
    };

    //params: $el, field, minSel, maxSel, rangeHandler
    var getRange = function(params) {

        var $el = params.$el;
        var field = params.field;
        var minSel = params.minSel;
        var maxSel = params.maxSel;
        var rangeHandler = params.rangeHandler;

        var min = $el.find(minSel).val();
        var max = $el.find(maxSel).val();

        if (!min && !max) {
            return;
        }

        if (rangeHandler) {
            var result = rangeHandler(min, max);
            min = result.min;
            max = result.max;
        }

        return {
            field:field,
            from:  min,
            to: max
        }
    };

    var getCriteriaTerms = function($el) {

        var CriteriaTerms = Backbone.Collection.extend({
            model: CriteriaTerm
        });

        var terms = new CriteriaTerms();

        if ($el.find('#feature-golf-course-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "propertyFrontage", "GOLCOU");
        }

        if ($el.find('#feature-hardwood-floors-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "flooring", "HARDWO");
        }

        if ($el.find('#feature-land-tenure-fee-simple-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "landTenure", "FS");
        }

        if ($el.find('#feature-land-tenure-leasehold-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "landTenure", "LH");
        }

        if ($el.find('#feature-pool-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "amenities", "POOL");
        }

        if ($el.find('#feature-view-all-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "view", "MOUNTA");
            addCriteriaTerm(terms, "view", "OCEAN");
        }

        if ($el.find('#feature-view-mountain-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "view", "MOUNTA");
        }

        if ($el.find('#feature-view-ocean-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "view", "OCEAN");
        }

        if ($el.find('#feature-waterfront-checkbox').is(':checked')) {
            addCriteriaTerm(terms, "propertyFrontage", "WATERF");
        }

        return terms;
    };

    var addCriteriaTerm = function(terms, type, value) {
        var featureTerm = new CriteriaTerm({
            type: type,
            value: value
        });

        terms.add(featureTerm);
    };

    var getOpenHouseQuery = function($el) {
        var radioVal = $el.find('input[name="openHouseRadio"]:checked').val();

        var fromDate, toDate;
        switch(radioVal) {
            default:
            case "none":
                break;
            case "thisWeekend":

                //if today is Sunday
                if (Moment().day() === 0) {
                    fromDate = Moment().startOf('week').subtract(1, 'day');
                    toDate = Moment();
                }
                else {
                    fromDate = Moment().startOf('week').subtract(1, 'day').add(7, 'days');
                    toDate = Moment().startOf('week').add(7, 'days');
                }
                break;
            case "nextWeekend":
                if (Moment().day() === 0) {
                    fromDate = Moment().endOf('week');
                    toDate = Moment().endOf('week').add(1, 'day');
                }
                else {
                    fromDate = Moment().endOf('week').add(7, 'days');
                    toDate = Moment().endOf('week').add(8, 'days');
                }
                break;
            case "30Days":
                fromDate = Moment().startOf('day');
                toDate = Moment().startOf('day').add(30, 'days');
                break;
        }

        var openHouseQuery = null;
        if (fromDate || toDate) {
            openHouseQuery = {
                fromDate: fromDate.format('YYYY-MM-DD'),
                toDate: toDate.format('YYYY-MM-DD')
            };
        }

        return openHouseQuery;
    };

    var InputSubmit = {
        submitSearchCriteria: submitSearchCriteria
    };

    return InputSubmit;
});