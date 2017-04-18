/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'utils',
    'collections/listing',
    'collections/search-term-filter',
    'collections/range-filter',
    'collections/field-filter',
    'text!templates/listings.hbs',
    'view-helpers/format-currency',
    'view-helpers/property-type',
    'view-helpers/photos-url',
    'infinity'
], function ($, _, Backbone, Handlebars, Utils, Listings, SearchTermFilters, RangeFilters, FieldFilters, listingsTemplate) {
    'use strict';
    var ListingsView = Backbone.View.extend({

        template: Handlebars.compile(listingsTemplate),

        initialize: function (options) {

            this.queryPage = 0;
            this.queryOptions = options;

            if (this.queryOptions && this.queryOptions.page) {
                this.queryPage = this.queryOptions.page;
            }

            this.fetchListings();

            this.loadingData = false;

            this.openHouseQuery = null;

        },

        events: {
            'click .request-listings-link a': "retryListingsRequest"
        },

        render: function () {

            this.initInfiniteScroll();

            //setup event listeners
            Utils.eventDispatcher.on({
                'listings-search-term:add-search-term': this.addSearchTerm,
                'listings-search-term:remove-search-term': this.removeSearchTerm,
                'listings-search-criteria:criteria-term-update': this.setCriteriaTerms,
                'listings-search-criteria:open-house-update': this.setOpenHouseQuery,
                'listings-search-criteria:range-update': this.setRanges,
                'listings:query': this.queryListings
            }, this);

            return this;
        },

        retryListingsRequest: function(e) {
            e.preventDefault();
            this.fetchListings();
        },

        initInfiniteScroll: function() {

            this.listenTo(Listings, 'sync', function() {

                //ensure that error banner is hidden
                this.$el.find(".listings-error").addClass('hidden');

                var items = this.template({listings:Listings.toJSON()});
                if (!this.listView) {
                    this.listView = new infinity.ListView(this.$el);
                }

                this.listView.append(items);
                this.loadingData = false;

                var searchMeta = {
                    query: this.buildQuery(this.queryOptions),
                    totalPages: Listings.totalPages,
                    totalCount: Listings.totalCount
                };

                Utils.eventDispatcher.trigger('listings:sync', searchMeta);

            });

            this.listenTo(Listings, 'error', function() {
                this.$el.html(this.template({}));
                this.$el.find(".listings-error").removeClass('hidden');
            });

            this.handleScrollLogic();
        },

        handleScrollLogic: function() {

            var scrollLogic = function() {

                var $parent = this.$el.parent();

                var margin = 200;

                if(!this.loadingData && ($parent.scrollTop() + margin) + $parent.innerHeight() >= $parent[0].scrollHeight) {
                    this.loadingData = true;

                    if (this.queryPage < (Listings.totalPages-1)) {
                        this.queryPage++;

                        this.fetchListings();
                    }
                }
            };

            this.$el.parent().on('scroll', _.bind(scrollLogic, this));

        },

        buildQuery: function(options) {
            var query = {
                page: this.queryPage,
                perPage: 25
            };

            _.extend(query, options);

            SearchTermFilters.each(function(model) {

                if (!query.searchTermFilters) {
                    query.searchTermFilters = [];
                }

                //field filter
                query.searchTermFilters.push({
                    field: model.get('field'),
                    values: model.get('values')
                });
            });

            RangeFilters.each(function(model) {

                if (!query.rangeFilters) {
                    query.rangeFilters = [];
                }

                //range field
                query.rangeFilters.push({
                    field: model.get('field'),
                    from: model.get('from'),
                    to: model.get('to')
                });
            });

            FieldFilters.each(function(model) {

                if (!query.fieldFilters) {
                    query.fieldFilters = [];
                }

                //field filter
                query.fieldFilters.push({
                    field: model.get('field'),
                    values: model.get('values')
                });
            });

            if (this.openHouseQuery) {
                if (!query.openHouseFilter) {
                    query.openHouseFilter = {
                        fromDate: this.openHouseQuery.fromDate,
                        toDate: this.openHouseQuery.toDate
                    }
                }
            }

            return query;
        },
        setRanges: function(ranges) {

            //clear previous ranges
            RangeFilters.reset(null);

            _.each(ranges, function(range) {
                var rangeField = range.field;
                var rangeFrom = range.from;
                var rangeTo = range.to;

                RangeFilters.add({
                    field:rangeField,
                    from: rangeFrom,
                    to: rangeTo
                });
            });
        },
        setCriteriaTerms: function(criteriaTerm) {

            //clear previous included fields
            FieldFilters.reset(null);

            criteriaTerm.forEach(function(criteriaTerm) {

                var termType = criteriaTerm.get('type');
                var termValue = criteriaTerm.get('value');

                var fieldFilter = FieldFilters.findWhere({field:criteriaTerm.get('type')});

                if (!fieldFilter) {
                    FieldFilters.add({
                        field:termType,
                        values:[
                            termValue
                        ]
                    });
                }
                else {
                    var values = fieldFilter.get('values');
                    values.push(termValue);
                    fieldFilter.set('values', values);
                }
            });
        },
        setOpenHouseQuery: function(openHouseQuery) {
            this.openHouseQuery = openHouseQuery;
        },
        addSearchTerm: function(searchTerm) {
            this.modifySearchTerm(searchTerm, 'add');
        },

        removeSearchTerm: function(searchTerm) {
            this.modifySearchTerm(searchTerm, 'remove');
        },

        modifySearchTerm: function(searchTerm, action) {

            var termType = searchTerm.get('type');
            var termValue = searchTerm.get('value');

            //treat street types as mlsNumber since street is a composite type
            if (termType === 'street') {
                termType = "mlsNumber";
                termValue = searchTerm.get('mlsNumber');
            }

            var fieldFilter = SearchTermFilters.findWhere({field:termType});

            var values;

            if (action === 'add') {
                if (!fieldFilter) {
                    SearchTermFilters.add({
                        field:termType,
                        values:[
                            termValue
                        ]
                    });
                }
                else {
                    values = fieldFilter.get('values');
                    values.push(termValue);
                    fieldFilter.set('values', values);
                }
            }
            else if (action === 'remove') {
                values = fieldFilter.get('values');

                values = _.filter(values, function(val){
                    return val !== termValue;
                });

                if (values.length < 1) {
                    SearchTermFilters.remove(fieldFilter);
                }
                else {
                    fieldFilter.set('values', values);
                }
            }
        },

        onClose: function() {
            if (this.listView) {
                this.listView.remove();

                if (this.listView.onClose) {
                    this.listView.onClose();
                }
            }
        },
        queryListings: function(queryOptions) {

            this.queryOptions = _.extend(this.queryOptions, queryOptions);

            if (this.listView) {
                this.listView.remove();
                this.listView = null;
            }

            Listings.reset();

            this.queryPage = 0;

            this.fetchListings();
        },

        fetchListings: function() {
            Listings.fetch({

                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },

                data: JSON.stringify(this.buildQuery(this.queryOptions)),

                type: 'POST'
            });
        }
    });

    return ListingsView;
});