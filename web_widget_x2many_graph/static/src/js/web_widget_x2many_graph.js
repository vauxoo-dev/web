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
        field_x: 'sequence',
        field_label_x: 'Sequence',
        field_y: 'value',
        field_label_y: 'Value',
        init: function (field_manager, node) {
            this._super(field_manager, node);
            this.field_x = node.attrs.field_x ? node.attrs.field_x : this.field_x;
            this.field_y = node.attrs.field_y ? node.attrs.field_y : this.field_y;
            this.field_label_x = node.attrs.field_label_x ? node.attrs.field_label_x : this.field_label_x;
            this.field_label_y = node.attrs.field_label_y ? node.attrs.field_label_y : this.field_label_y;
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
                   sin.push({x: elem[self.field_x], y: elem[self.field_y]})
                });
                data = [{
                    values: sin,
                    key: self.field.string,
                    color: '#ff7f0e'
                }];
                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                        .useInteractiveGuideline(true);

                    chart.xAxis
                        .axisLabel(self.field_label_x)
                        .tickFormat(d3.format(',r'));

                    chart.yAxis
                        .axisLabel(self.field_label_y)
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
