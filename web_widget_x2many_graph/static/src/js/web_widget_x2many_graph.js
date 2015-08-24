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

    instance.web_widget_x2many_graph.FieldX2ManyGraph = instance.web.form.AbstractField.extend( {
        template: 'FieldX2ManyGraph',
        widget_class: 'oe_form_field_x2many_graph',
        by_x_axis: {},
        by_y_axis: {},
        field_x_axis: 'sequence',
        field_label_x_axis: 'Sequence',
        field_y_axis: 'value',
        field_label_y_axis: 'Value',
        is_numeric: false,
        fields: {},
        init: function (field_manager, node) {
            this._super(field_manager, node);
            this.dataset = new instance.web.form.One2ManyDataSet(this, this.field.relation);
            this.dataset.o2m = this;
            this.dataset.parent_view = this.view;
            this.dataset.child_name = this.name;
            this.set_value([]);
        },
        start: function()
        {
            var self = this;
            this._super.apply(this, arguments);
        },
        data: function() {
            var sin = [],
                cos = [];
            // Field View Information (trying to set the list of views to bring fields ordered)

            arrangement = [{
              values: sin,
              key: 'Sine Wave',
              color: '#ff7f0e'
            },{
              values: cos,
              key: 'Cosine Wave',
              color: '#2ca02c'
            }];
        },
        get_value: function () {
            var value = this.get('value');
            return value
        },
        render_value: function(){
            var self = this,
                sin = [],
                show_value = this.get_value();
            if (this.field.views.graph){
                var fields = this.field.views.graph.fields;
            }
            this.dataset.read_ids(show_value, fields).done(function(elements){
                _.each(elements, function(elem){
                   sin.push({x: elem.sequence, y: elem.value})
                });
                data = [{
                    values: sin,
                    key: 'Labels',
                    color: '#ff7f0e'
                }];
                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                        .useInteractiveGuideline(true);

                    chart.xAxis
                        .axisLabel('Time (ms)')
                        .tickFormat(d3.format(',r'));

                    chart.yAxis
                        .axisLabel('Voltage (v)')
                        .tickFormat(d3.format('.02f'));

                    d3.select('.nv_content svg')
                        .datum(data)
                        .transition().duration(500)
                        .call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            });

        }
    });
}
