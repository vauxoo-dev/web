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
odoo.define('web.web_widget_x2many_graph', function (require) {
"use strict";

    var core = require('web.core'),
        form_common = require('web.form_common'),
        QWeb = core.qweb;

    var FieldX2ManyGraphWidget = form_common.AbstractField.extend(form_common.ReinitializeFieldMixin, {
        render_value: function(){
            var info = JSON.parse(this.get('value'));
            this.$el.html(QWeb.render('FieldX2ManyGraph', {}));
            nv.addGraph(function() {
                var chart = nv.models.lineChart()
                    .useInteractiveGuideline(true);

                chart.xAxis
                    .axisLabel(info.label_x)
                    .tickFormat(d3.format(',r'));

                chart.yAxis
                    .axisLabel(info.label_y)
                    .tickFormat(d3.format('.02f'));

                d3.select('.nv_content svg')
                    .datum(info.content)
                    .transition().duration(500)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });
        },
        destroy: function () {
            return this._super();
        },
    });
    core.form_widget_registry.add('x2many_graph', FieldX2ManyGraphWidget);

});