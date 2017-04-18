/*global define*/
define([
    'handlebars',
    'accounting'
], function (Handlebars, accounting) {
    'use strict';

    Handlebars.registerHelper('format-currency', function(currency, options) {
        var formattedCurrency = accounting.formatMoney(currency, {precision:0});
        return options.fn({formattedCurrency:formattedCurrency});
    });

});