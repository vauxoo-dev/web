odoo.define('web_widget_email_validator', function(require){
	'use strict';

	var basic_fields = require('web.basic_fields');
	var fieldRegistry = require('web.field_registry');
	var core = require('web.core');
	var _t = core._t;

	var FieldEmailValidator = basic_fields.InputField.extend({
		className: 'o_field_email',
		prefix: 'mailto',
		supportedFieldTypes: ['char'],
		events: {
			'change': '_onChange',
		},
	    init: function () {
	        this._super.apply(this, arguments);
	        this.tagName = this.mode === 'readonly' ? 'a' : 'input';
	    },
	    start: function () {
	    	var self = this;
        	return this._super.apply(this, arguments).then(function () {
            	self.$el.attr('type', 'email');
            	return self._render();
        	});	    	
	    },
	    getFocusableElement: function () {
	        return this.mode === 'readonly' ? this.$el : this._super.apply(this, arguments);
	    },
	    _onChange: function() {
	        this._super.apply(this, arguments);
	        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	            value = this.$input.val();
	        if (!value){
	            return true;
	        }
	        var res =  re.test(String(this.$input.val()).toLowerCase());
	    	this._isValid = res;
	    },
	    _renderReadonly: function () {
	        this.$el.text(this.value)
	            .addClass('o_form_uri o_text_overflow')
	            .attr('href', this.prefix + ':' + this.value);
	    },
	    _prepareInput: function($input) {
	        var $inp = this._super.apply(this, arguments);
	        $inp.attr({
	        	type: 'email',
	        });
	        return $inp;	    	
	    }
	});
	fieldRegistry.add('email_validator', FieldEmailValidator);
	return {
		FieldEmailValidator: FieldEmailValidator
	};
});
