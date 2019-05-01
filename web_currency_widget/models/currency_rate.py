# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.addons.base.models.res_currency import CurrencyRate, Currency


class ResCurrencyRate(CurrencyRate):
    _inherit = 'res.currency.rate'

    CurrencyRate.rate = fields.Float(
        digits=(16, 18),
        help='The rate of the currency to the currency of rate 1')


class ResCurrency(Currency):
    _inherit = 'res.currency'

    Currency.rate = fields.Float(
        compute='_compute_current_rate',
        string='Current Rate', digits=(16, 18),
        help='The rate of the currency to the currency of rate 1.')


class ResCurrency(models.Model):
    _inherit = 'res.currency'

    @api.model
    def get_currency_rate(self):
        cr = self.env.cr
        query = """
        SELECT DISTINCT ON (rc.id)
            rc.id,
            rcr.name as date,
            rcr.rate as rate, rc.name as name
        FROM
            res_currency rc
        INNER JOIN
            res_currency_rate rcr ON rcr.currency_id = rc.id
        ORDER BY
            rc.id,
            rcr.name DESC;"""
        cr.execute(query)
        result = cr.dictfetchall()
        if not len(result):
            return False
        return result
