//-*- coding: utf-8 -*-
//############################################################################
//
//   OpenERP, Open Source Management Solution
//   This module copyright (C) 2015 Therp BV <http://therp.nl>.
//
//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU Affero General Public License as
//   published by the Free Software Foundation, either version 3 of the
//   License, or (at your option) any later version.
//
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU Affero General Public License for more details.
//
//   You should have received a copy of the GNU Affero General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//############################################################################

openerp.web_widget_x2many_graph = function(instance)
{
    instance.web.form.widgets.add(
        'x2many_graph',
        'instance.web_widget_x2many_graph.FieldX2ManyGraph');

    instance.web_widget_x2many_graph.FieldX2ManyGraph = instance.web.form.FieldOne2Many.extend({
        template: 'FieldX2ManyGraph',
        widget_class: 'oe_form_field_x2many_graph',

        // those will be filled with rows from the dataset
        by_x_axis: {},
        by_y_axis: {},
        field_x_axis: 'x',
        field_label_x_axis: 'x',
        field_y_axis: 'y',
        field_label_y_axis: 'y',
        field_value: 'value',
        // information about our datatype
        is_numeric: false,
        show_row_totals: true,
        show_column_totals: true,
        // this will be filled with the model's fields_get
        fields: {},

        // read parameters
        init: function(field_manager, node)
        {
            this.field_x_axis = node.attrs.field_x_axis || this.field_x_axis;
            this.field_y_axis = node.attrs.field_y_axis || this.field_y_axis;
            this.field_label_x_axis = node.attrs.field_label_x_axis || this.field_x_axis;
            this.field_label_y_axis = node.attrs.field_label_y_axis || this.field_y_axis;
            return this._super.apply(this, arguments);
        },

        // return a field's value, id in case it's a one2many field
        get_field_value: function(row, field, many2one_as_name)
        {
            if(this.fields[field].type == 'many2one' && _.isArray(row[field]))
            {
                if(many2one_as_name)
                {
                    return row[field][1];
                }
                else
                {
                    return row[field][0];
                }
            }
            return row[field];
        },

        // set value from line graph not implemented yet.
        set_value: function()
        {},

        start: function()
        {
            var self = this;
            return this._super.apply(this, arguments);
        },

        // deactivate view related functions
        load_views: function() {},
        reload_current_view: function() {},
        get_active_view: function() {},
    });
}
