# Copyright (c) 2023, Tech Ventures and contributors
# For license information, please see license.txt
import frappe
# import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus


class ReceiptForm(Document):

    def before_save(self):
        if len(self.receipt_form_item) < 1:
            frappe.throw("Detail Record not found !")

    def on_submit(self):
        self.docstatus = DocStatus.submitted()
