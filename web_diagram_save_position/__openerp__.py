{
    'name': 'Web Diagram Save Position',
    'category': 'Tools',
    'description': """
Save the position of each node when place is changed in the diagram.
=========================
In order to use this module the diagram node must have 2 position (integer) attributes to save its position, and the
definition on the diagram goes like the following example.


<diagram string="Relation Editor">
    <node object="builder.ir.model" position_x="diagram_position_x" position_y="diagram_position_y">
        <field name="model"/>
        <field name="name"/>
        <field name="osv_memory" invisible="1"/>
    </node>
    <arrow object="builder.ir.model.fields" source="model_id" destination="relation_model_id">
    </arrow>
</diagram>
""",
    'version': '1.0',
    'depends': ['web_diagram'],
    'data' : [
        'views/backend_assets.xml',
    ],
    'auto_install': True,
}
