/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'models/search-term-filter'
], function ($, _, Backbone, SearchTermFilterModel) {
    'use strict';

    var SearchTermFilterCollection = Backbone.Collection.extend({
        model: SearchTermFilterModel
    });

    return new SearchTermFilterCollection();
});