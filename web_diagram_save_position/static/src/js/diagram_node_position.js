(function() {

    var instance = openerp;
    var _t = instance.web._t,
        _lt = instance.web._lt;
    var QWeb = instance.web.qweb;

    function setup_diagram(){
        instance.web.DiagramView.include({
            get_diagram_info: function() {
                var self = this;
                var params = {
                    'id': this.id,
                    'model': this.model,
                    'node': this.node,
                    'connector': this.connector,
                    'bgcolor': this.nodes.attrs.bgcolor,
                    'canvas_position_x': this.nodes.attrs.canvas_position_x || false,
                    'canvas_position_y': this.nodes.attrs.canvas_position_y || false,
                    'node_position_x': this.nodes.attrs.position_x || false,
                    'node_position_y': this.nodes.attrs.position_y || false,
                    'shape': this.nodes.attrs.shape,
                    'src_node': this.connectors.attrs.source,
                    'des_node': this.connectors.attrs.destination,
                    'label': this.connectors.attrs.label || false,
                    'visible_nodes': [],
                    'invisible_nodes': [],
                    'node_fields': [],
                    'connectors': [],
                    'connectors_fields': []
                };

                _.each(this.nodes.children, function(child) {
                    if(child.attrs.invisible == '1')
                        params['invisible_nodes'].push(child.attrs.name);
                    else {
                        params['visible_nodes'].push(child.attrs.name);
                        params['node_fields'].push(self.fields[child.attrs.name]['string']|| this.toTitleCase(child.attrs.name));
                    }
                });

                _.each(this.connectors.children, function(conn) {
                    params['connectors_fields'].push(self.fields[conn.attrs.name]['string']|| this.toTitleCase(conn.attrs.name));
                    params['connectors'].push(conn.attrs.name);
                });
                this.rpc(
                    '/web_diagram/diagram/get_diagram_info',params).done(function(result) {
                        self.draw_diagram(result);
                    }
                );
            },

            draw_diagram: function(result) {
                var self = this;
                var res_nodes  = result['nodes'];
                var res_edges  = result['conn'];
                this.parent_field = result.parent_field;
                this.$el.find('h3.oe_diagram_title').text(result.name);

                var id_to_node = {};


                var style = {
                    edge_color: "#A0A0A0",
                    edge_label_color: "#555",
                    edge_label_font_size: 10,
                    edge_width: 2,
                    edge_spacing: 100,
                    edge_loop_radius: 100,

                    node_label_color: "#333",
                    node_label_font_size: 12,
                    node_outline_color: "#333",
                    node_outline_width: 1,
                    node_selected_color: "#0097BE",
                    node_selected_width: 2,
                    node_size_x: 110,
                    node_size_y: 80,
                    connector_active_color: "#FFF",
                    connector_radius: 4,

                    close_button_radius: 8,
                    close_button_color: "#333",
                    close_button_x_color: "#FFF",

                    gray: "#DCDCDC",
                    white: "#FFF",

                    viewport_margin: 50
                };

                // remove previous diagram
                var canvas = self.$el.find('div.oe_diagram_diagram')
                                     .empty().get(0);

                var r  = new Raphael(canvas, '100%','100%');

                var graph  = new CuteGraph(r,style,canvas.parentNode);

                _.each(res_nodes, function(node) {
                    var n = new CuteNode(
                        graph,
                        node.x,  //FIXME the +50 should be in the layout algorithm
                        node.y,
                        CuteGraph.wordwrap(node.name, 14),
                        node.shape === 'rectangle' ? 'rect' : 'circle',
                        node.color === 'white' ? style.white : style.gray);

                    n.id = node.id;
                    id_to_node[node.id] = n;
                });

                _.each(res_edges, function(edge) {
                    var e =  new CuteEdge(
                        graph,
                        CuteGraph.wordwrap(edge.signal, 32),
                        id_to_node[edge.s_id],
                        id_to_node[edge.d_id] || id_to_node[edge.s_id]  );  //WORKAROUND
                    e.id = edge.id;
                });

                CuteNode.double_click_callback = function(cutenode){
                    self.edit_node(cutenode.id);
                };
                var i = 0;
                CuteNode.destruction_callback = function(cutenode){
                    if(!confirm(_t("Deleting this node cannot be undone.\nIt will also delete all connected transitions.\n\nAre you sure ?"))){
                        return $.Deferred().reject().promise();
                    }
                    return new instance.web.DataSet(self,self.node).unlink([cutenode.id]);
                };
                CuteNode.move_callback = function(cutenode){
                    if (self.nodes.attrs.position_x && self.nodes.attrs.position_y){
                        var data = {};
                        var pos = cutenode.get_pos();
                        data[self.nodes.attrs.position_x] = pos.x;
                        data[self.nodes.attrs.position_y] = pos.y;

                        return new instance.web.DataSet(self,self.node).write(cutenode.id, data);
                    }
                };
                CuteEdge.double_click_callback = function(cuteedge){
                    self.edit_connector(cuteedge.id);
                };

                CuteEdge.creation_callback = function(node_start, node_end){
                    return {label: ''};
                };
                CuteEdge.new_edge_callback = function(cuteedge){
                    self.add_connector(cuteedge.get_start().id,
                                       cuteedge.get_end().id,
                                       cuteedge);
                };
                CuteEdge.destruction_callback = function(cuteedge){
                    if(!confirm(_t("Deleting this transition cannot be undone.\n\nAre you sure ?"))){
                        return $.Deferred().reject().promise();
                    }
                    return new instance.web.DataSet(self,self.connector).unlink([cuteedge.id]);
                };

            }
        });
    }


    function wait_for_diagram(){
      if (!instance.web.DiagramView){
        setTimeout(wait_for_diagram, 100);
      } else {
        setup_diagram();
      }
    }

    wait_for_diagram();

})();