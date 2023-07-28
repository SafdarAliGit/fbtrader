# Copyright (c) 2023, Tech Ventures and contributors
# For license information, please see license.txt
import frappe
from fbtrader.fbtrader.doctype.utils_functions import get_doctype_by_field, get_purchase_related_jv
from frappe.model.document import Document
from frappe.model.naming import make_autoname


class PurchaseForm(Document):
    def before_submit(self):
        source_name = frappe.get_doc("Purchase Form", self.name)
        try:
            pi = frappe.new_doc("Purchase Invoice")
            pi.posting_date = source_name.posting_date
            pi.bill_no = source_name.bill_no
            pi.bill_date = source_name.bill_date
            pi.supplier = source_name.supplier
            pi.purchase_form_id = source_name.name
            pi.payment_terms = source_name.payment_terms
            pi.company = frappe.defaults.get_defaults().company
            pi.write_off_percentage = source_name.commission_percentage
            pi.write_off_amount = source_name.commission

            pii = pi.append("items", {})
            pii.item_code = source_name.item_code
            pii.qty = source_name.qty
            pii.rate = source_name.rate
            pii.rate_per_lbs = source_name.rate_per_lbs
            pii.lbs = source_name.lbs
            pii.batch_id = source_name.batch_id
            pii.batch_no = source_name.batch_id
            pii.lbs_per_ctn = source_name.lbs_per_ctn
            pii.kg_per_ctn = source_name.kg_per_ctn
            pii.kgs = source_name.kgs
            pii.amount = source_name.amount
            pii.uom = frappe.defaults.get_defaults().uom
            pii.stock_qty = source_name.qty
            pii.base_rate = source_name.rate
            pii.base_amount = source_name.amount

            pi.insert()
            pi.submit()
        except Exception as error:
            frappe.throw(f"{error}")

    def on_cancel(self):
        pi = get_doctype_by_field('Purchase Invoice', 'purchase_form_id', self.name)
        je = get_purchase_related_jv(self.name)
        if je:
            je.reload()
            je.cancel()
        if pi.docstatus != 2:  # Ensure the document is in the "Submitted" state
            pi.cancel()

            frappe.db.commit()
        else:
            frappe.throw("Document is not in the 'Submitted' state.")
        if pi.amended_from:
            new_name = int(pi.name.split("-")[-1]) + 1
        else:
            new_name = f"{pi.name}-{1}"
        make_autoname(new_name, 'Purchase Invoice')
