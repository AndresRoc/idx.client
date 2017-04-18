/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'utils'
], function ($, _, Backbone, Utils) {
    'use strict';

    var SyncStatModel = Backbone.Model.extend({
        urlRoot: Utils.getAppConfig().idxServiceUrl + '/residential/recentSyncStat'
    });

    return SyncStatModel;
});