# Copyright (c) 2023, Tech Ventures and contributors
# For license information, please see license.txt
import frappe
from frappe.model.docstatus import DocStatus
# import frappe
from frappe.model.document import Document


class PaymentForm(Document):
    def save(self):
        doc = frappe.new_doc("Payment Form")
        doc.posting_date = self.posting_date
        doc.party = self.party
        doc.receipt_date = self.receipt_date
        doc.tr_no = self.tr_no
        doc.docstatus = DocStatus.submitted()
        doc.insert()
        for item in self.receipt_form_item:
            rfi = frappe.get_doc(doctype="Receipt Form Item", name=item.id)
            rfi.reload()
            rfi.payment_form_id = doc.name
            rfi.status = 'Out'
            rfi.out_party = self.party
            rfi.out_date = self.posting_date
            rfi.save()
