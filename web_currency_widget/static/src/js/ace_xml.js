odoo.define('web_currency_widget.ace_xml', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var _t = core._t;
var QWeb = core.qweb;
var rpc = require('web.rpc');
var ListView = require('web.ListView');
var FormView = require('web.FormView');
var Model = require('web.BasicModel');
var formats = {}
var AbstractField = require('web.AbstractField');
var field_registry = require('web.field_registry');

var AceXml = AbstractField.extend({
    template: "AceXml",
    willStart: function() {
        if (!window.ace && !this.loadJS_def) {
            this.loadJS_def = ajax.loadJS('/web/static/lib/ace/ace.odoo-custom.js').then(function () {
                return $.when(ajax.loadJS('/web/static/lib/ace/mode-xml.js'));
            });
        }
        return $.when(this._super(), this.loadJS_def);
    },
    render_value: function() {
	var txt = this.get("value") || false;
	if(txt === false){
		return;
	}
	this.$el.text(txt);
	var aceEditor = false;
	try {
		var aceEditor = window.ace.edit(this.$el[0]);
	}
	catch(err) {
	    return;
	}
	aceEditor.setOptions({"maxLines": Infinity, readOnly: true});
	var aceSession = aceEditor.getSession();
        aceSession.setMode("ace/mode/xml");
    }
});

function _get_currency_rate(self){
    debugger;
    rpc.query(
    {model: 'res.currency',
     method: 'get_currency_rate',
     args: []}).then(function (result) {
            if(!result){
                $.find('#rate').parent().remove();
                return;
            }
            var currency = [];
            _.forEach(result, function(r){
            currency.push(r.name+ ": "+ formats.format_value(1/r.rate, {type: "float"}));
            });
            $.find('#rate').text(currency.join(' / '));
        });
}

ListView.include({
    render_buttons: function($node) {
        this._super($node);
        var self = this;
        _get_currency_rate(self);
    },
});

FormView.include({
    init: function() {
        this._super.apply(this, arguments);
        var self = this;
        _get_currency_rate(self);
    },
});

field_registry.add('ace_xml', AceXml);

});
