/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'models/sync-stat',
    'text!templates/sync-stat.hbs'
], function ($, _, Backbone, Handlebars, Utils, SyncStat, syncStatTemplate) {
    'use strict';

    var SyncStatView = Backbone.View.extend({

        template: Handlebars.compile(syncStatTemplate),

        initialize: function () {
            this.syncStat = new SyncStat();
            this.syncStat.fetch();
        },

        render: function () {

            this.listenTo(this.syncStat, 'sync', function() {
                this.$el.append(this.template(this.syncStat.toJSON()));
            });

            return this;
        },


        onClose: function () {

        }
    });

    return SyncStatView;
});