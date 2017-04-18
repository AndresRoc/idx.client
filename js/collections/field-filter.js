/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'models/field-filter'
], function ($, _, Backbone, FieldFilterModel) {
    'use strict';

    var FieldFilterCollection = Backbone.Collection.extend({
        model: FieldFilterModel
    });

    return new FieldFilterCollection();
});