# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt



from erpnext.accounts.doctype.purchase_invoice.purchase_invoice import PurchaseInvoice


form_grid_templates = {"items": "templates/form_grid/item_grid.html"}


class PurchaseInvoiceOverrides(PurchaseInvoice):
    def autoname(self):
        self.name = self.purchase_form_id

