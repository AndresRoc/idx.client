/*global define*/
define([
    'handlebars',
], function (Handlebars) {
    'use strict';

    Handlebars.registerHelper('property-type', function(propertyType, options) {

        var split = propertyType.split("/");

        var retVal = "";

        if (split.length < 1) {
            retVal = propertyType;
        }
        else {
            for(var i = 0; i < split.length; i++) {
                retVal += split[i];

                if (i !== split.length-1) {
                    retVal += ' / ';
                }
            }
        }

        return options.fn({propertyType:retVal});
    });

});