/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'models/range-filter'
], function ($, _, Backbone, RangeFilterModel) {
    'use strict';

    var RangeFilterCollection = Backbone.Collection.extend({
        model: RangeFilterModel
    });

    return new RangeFilterCollection();
});