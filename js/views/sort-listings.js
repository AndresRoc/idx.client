/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'text!templates/sort-listings.hbs'
], function ($, _, Backbone, Handlebars, Utils, sortListingsTemplate) {
    'use strict';

    var SORT_BY_DATE_FIELD = 'listingContractDate';
    var SORT_BY_PRICE_FIELD = 'listPrice';
    var SORT_BY_BEDS_FIELD = 'bedsTotal';
    var SORT_BY_BATHS_FIELD = 'bathsFull';

    var getSortQuery = function(sortByTxt) {
        var sortBy, sortOrder;

        switch(sortByTxt) {
            case 'Newest':
                sortBy = SORT_BY_DATE_FIELD;
                sortOrder = 'desc';
                break;
            case 'Oldest':
                sortBy = SORT_BY_DATE_FIELD;
                sortOrder = 'asc';
                break;
            case 'Highest Price':
                sortBy = SORT_BY_PRICE_FIELD;
                sortOrder = 'desc';
                break;
            case 'Lowest Price':
                sortBy = SORT_BY_PRICE_FIELD;
                sortOrder = 'asc';
                break;
            case 'Most Beds':
                sortBy = SORT_BY_BEDS_FIELD;
                sortOrder = 'desc';
                break;
            case 'Least Beds':
                sortBy = SORT_BY_BEDS_FIELD;
                sortOrder = 'asc';
                break;
            case 'Most Baths':
                sortBy = SORT_BY_BATHS_FIELD;
                sortOrder = 'desc';
                break;
            case 'Least Baths':
                sortBy = SORT_BY_BATHS_FIELD;
                sortOrder = 'asc';
                break;
        }

        return sortBy && sortOrder ? {sortBy: sortBy, sortOrder: sortOrder} : undefined;
    };

    var SortListingsView = Backbone.View.extend({

        template: Handlebars.compile(sortListingsTemplate),

        initialize: function () {

            Utils.eventDispatcher.on({
                'listings:sync': this.setQueryState
            }, this);
        },

        events: {
            'click #sort-drop-down-menu a': "sortListing"
        },

        render: function () {
            this.$el.append(this.template());

            return this;
        },

        setQueryState: function(searchMeta) {

            var query = searchMeta.query;

            //set active sort
            _.each(this.$el.find('#sort-drop-down-menu .dropdown-menu').children(), function(el) {
                this.$el.find(el).removeClass('active');
            }, this);

            var sortBy = query.sortBy;
            var sortOrder = query.sortOrder;

            if (sortBy === SORT_BY_DATE_FIELD) {
                sortOrder === 'desc' ? this.$el.find('.sort-newest').addClass('active') :
                    this.$el.find('.sort-oldest').addClass('active');
            }
            else if (sortBy === SORT_BY_PRICE_FIELD) {
                sortOrder === 'desc' ? this.$el.find('.sort-highest-price').addClass('active') :
                    this.$el.find('.sort-lowest-price').addClass('active');
            }
            else if (sortBy === SORT_BY_BEDS_FIELD) {
                sortOrder === 'desc' ? this.$el.find('.sort-most-beds').addClass('active') :
                    this.$el.find('.sort-least-beds').addClass('active');
            }
            else if (sortBy === SORT_BY_BATHS_FIELD) {
                sortOrder === 'desc' ? this.$el.find('.sort-most-baths').addClass('active') :
                    this.$el.find('.sort-least-baths').addClass('active');
            }

        },

        sortListing:function(e) {
            e.preventDefault();

            var query = getSortQuery(e.target.text);

            if (query) {
                Utils.eventDispatcher.trigger('listings:query', query);
            }
        },

        onClose: function () {

        }
    });

    return SortListingsView;
});