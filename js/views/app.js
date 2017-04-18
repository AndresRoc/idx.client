/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {
    'use strict';

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({
        el: '#main-content',

        initialize: function () {
        },

        render: function () {
            return this;
        }
    });

    return AppView;
});