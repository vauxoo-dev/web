A email validator for Odoo Web Client
=====================================

This App allows to validate email format on input fields


Features
========

* The widget validates that the string on the input field has a
  valid email address.


Usage
=====

In the view declaration of the field, put widget='email_validator' attribute in
the field tag::

    ...
    <field name="arch" type="xml">
        <form string="View name">
            ...
            <field name="email" widget="email_validator"/>
            ...
        </form>
    </field>
    ...


.. image:: https://odoo-community.org/website/image/ir.attachment/5784_f2813bd/datas
   :alt: Try me on Runbot
   :target: https://runbot.odoo-community.org/runbot/162/11.0

Bug Tracker
===========

Bugs are tracked on `GitHub Issues
<https://github.com/OCA/OCA/issues>`_. In case of trouble, please
check there if your issue has already been reported. If you spotted it first,
help us smashing it by providing a detailed and welcomed feedback.

Credits
=======

Contributors
------------

* Oscar Alcala <oscar@vauxoo.com>

Maintainer
----------

.. image:: https://odoo-community.org/logo.png
   :alt: Odoo Community Association
   :target: https://odoo-community.org

This module is maintained by the OCA.

OCA, or the Odoo Community Association, is a nonprofit organization whose
mission is to support the collaborative development of Odoo features and
promote its widespread use.

To contribute to this module, please visit https://odoo-community.org.