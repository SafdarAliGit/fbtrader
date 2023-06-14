# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt


import frappe
from erpnext.accounts.doctype.purchase_invoice.purchase_invoice import PurchaseInvoice


class WarehouseMissingError(frappe.ValidationError):
    pass


form_grid_templates = {"items": "templates/form_grid/item_grid.html"}


class PurchaseInvoiceOverrides(PurchaseInvoice):
    def __init__(self, *args, **kwargs):
        super(PurchaseInvoiceOverrides, self).__init__(*args, **kwargs)

    def before_save(self):
        total = 0
        for item in self.items:
            item.amount = item.rate_per_lbs * item.lbs
            total += item.amount
        self.total = total
        self.grand_total = total
        self.rounded_total = total
        self.outstanding_amount = total

    def before_submit(self):
        total = 0
        for item in self.items:
            item.amount = item.rate_per_lbs * item.lbs
            total += item.amount
        self.total = total
        self.grand_total = total
        self.rounded_total = total
        self.outstanding_amount = total

    def onload(self):
        total = 0
        for item in self.items:
            item.amount = item.rate_per_lbs * item.lbs
            total += item.amount
        self.total = total
        self.grand_total = total
        self.rounded_total = total
        self.outstanding_amount = total
     
