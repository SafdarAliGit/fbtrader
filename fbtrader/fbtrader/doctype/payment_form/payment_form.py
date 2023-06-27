# Copyright (c) 2023, Tech Ventures and contributors
# For license information, please see license.txt
import frappe
from frappe.model.docstatus import DocStatus
# import frappe
from frappe.model.document import Document


class PaymentForm(Document):

    def before_save(self):
        if len(self.receipt_form_item) > 0:
            self.posting_date = self.posting_date
            self.party = self.party
            self.receipt_date = self.receipt_date
            self.tr_no = self.name
            self.docstatus = DocStatus.submitted()

            for item in self.receipt_form_item:
                rfi = frappe.get_doc(doctype="Receipt Form Item", name=item.id)
                rfi.reload()
                rfi.payment_form_id = self.name
                rfi.status = 'Out'
                rfi.out_party = self.party
                rfi.out_date = self.posting_date
                rfi.save()
            self.receipt_form_item = []
        else:
            frappe.msgprint("Detail record not found")
