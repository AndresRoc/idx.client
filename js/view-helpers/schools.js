/*global define*/
define([
    'handlebars',
], function (Handlebars) {
    'use strict';

    Handlebars.registerHelper('schools', function(context, options) {

        if (context.highSchool || context.middleOrJuniorSchool || context.elementarySchool) {
            return options.fn({
                hasSchools: true,
                highSchool:context.highSchool,
                middleOrJuniorSchool: context.middleOrJuniorSchool,
                elementarySchool: context.elementarySchool
            });
        }

        return options.fn({
           hasSchools: false
        });
    });

});