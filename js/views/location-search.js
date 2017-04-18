/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'typeahead',
    'bloodhound',
    'utils',
    'views/location-search-term',
    'text!templates/location-search.hbs'
], function ($, _, Backbone, Handlebars, Typeahead, Bloodhound, Utils, LocationSearchTermView, locationSearchTemplate) {
    'use strict';

    var renderTypeahead = function() {
        var locations = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: Utils.getAppConfig().idxServiceUrl + '/residential/listings/search-term/all',
                transform:function(response) {
                    var results = [];
                    _.map(response, function(content) {
                        results.push({
                            type:content.type,
                            value:content.searchTerm,
                            mlsNumber:content.mlsNumber //only street will not be null on this field
                        });
                    });

                    results = _.sortBy(results, function(result) {

                        switch(result.type) {
                            case 'city':
                                return 1;
                            case 'neighbourhood':
                                return 2;
                            case 'buildingName':
                                return 3;
                            case 'street':
                                return 4;
                            case 'postalCode':
                                return 5;
                            case 'mlsNumber':
                            default:
                                return 6;
                        }
                    });

                    return results;
                }
            }
        });

        var typeahead = $('input.location-search');

        typeahead.typeahead({
                minLength:3,
                highlight:true,
                hint:true
            },
            {
                display:'value',
                name: 'listing-search',
                source: locations,
                limit:25
            });

        //display search terms
        var displaySearchTerms = _.bind(function(e, suggestion) {

            //dismiss duplicate suggestions
            if (!this.searchTerms.find(function(term) {return term.get('type') === suggestion.type && term.get('value') === suggestion.value;})) {

                var searchTerm = new this.SearchTerm({
                    type: suggestion.type,
                    value: suggestion.value,
                    mlsNumber: suggestion.mlsNumber
                });

                this.searchTerms.add(searchTerm);

                var searchTermView = new LocationSearchTermView(searchTerm);

                //display search term
                this.$el.find('.search-term-suggestions').append(searchTermView.render().$el);

                Utils.eventDispatcher.trigger('listings-search-term:add-search-term', searchTerm);
                _.delay(function() {
                    Utils.eventDispatcher.trigger('listings:query');
                }, 100);
            }

            //clear typeahead value
            typeahead.typeahead('val', '');
        }, this);

        typeahead.bind('typeahead:autocomplete typeahead:select', displaySearchTerms);
    };

    var LocationSearchView = Backbone.View.extend({

        template: Handlebars.compile(locationSearchTemplate),

        initialize: function () {
            this.SearchTerm = Backbone.Model.extend();
            var SearchTerms = Backbone.Collection.extend({
                model:this.SearchTerm
            });

            this.searchTerms = new SearchTerms();

            Utils.eventDispatcher.on('listings-search-term:remove-search-term', this.removeSearchTerm, this);
        },

        render: function () {

            this.$el.append(this.template());

            _.delay(_.bind(renderTypeahead, this), 100);

            //focus on location search input
            _.delay(_.bind(function() {
                this.$el.find('input.location-search').focus();
            }, this), 150);

            return this;
        },

        //handle remove event from an instance of LocationSearchTermView
        removeSearchTerm: function(searchTerm) {
            if (searchTerm) {
                this.searchTerms.remove(searchTerm);
            }
        },

        onClose: function () {

        }
    });

    return LocationSearchView;
});