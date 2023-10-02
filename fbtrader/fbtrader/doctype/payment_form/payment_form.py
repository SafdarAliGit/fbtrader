# Copyright (c) 2023, Tech Ventures and contributors
# For license information, please see license.txt
import frappe
from frappe.model.docstatus import DocStatus
# import frappe
from frappe.model.document import Document


class PaymentForm(Document):

    def before_save(self):
        if len(self.receipt_form_item) > 0 or self.cash_payment > 0:
            self.tr_no = self.name
            self.docstatus = DocStatus.submitted()

            for item in self.receipt_form_item:
                rfi = frappe.get_doc(doctype="Receipt Form Item", name=item.id)
                rfi.reload()
                rfi.payment_form_id = self.name
                rfi.out_party = self.party_name
                rfi.out_date = self.posting_date
                rfi.docstatus = DocStatus.submitted()
                rfi.save()
            self.receipt_form_item = []
        else:
            frappe.throw("Detail record not found")
