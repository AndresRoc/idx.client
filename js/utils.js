/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'json!appconfig.json',
    'mobileDetect',
    'jqueryPrint'
], function ($, _, Backbone, Moment, AppConfig, MobileDetect, Clipboard) {
    'use strict';

    var utils = {

        eventDispatcher:_.clone(Backbone.Events),

        assignSubviews: function (selector, view) {
            var selectors;
            if (_.isObject(selector)) {
                selectors = selector;
            }
            else {
                selectors = {};
                selectors[selector] = view;
            }
            if (!selectors) return;
            _.each(selectors, function (view, selector) {
                view.setElement(this.$(selector)).render();
            }, this);
        },

        getAppConfig: function() {
            return AppConfig;
        },

        printDiv: function(divId) {
            $('#' + divId).print({
                timeout: 1000
            });
        },

        isMobile: function() {
            var md = new MobileDetect(window.navigator.userAgent);
            return md.mobile() != null;
        }
    };

    return utils;
});