# Copyright (c) 2023, Tech Ventures and contributors
# For license information, please see license.txt
import frappe
from fbtrader.fbtrader.doctype.utils_functions import get_doctype_by_field
# import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname


class SalesForm(Document):
    def before_submit(self):
        source_name = frappe.get_doc("Sales Form", self.name)
        try:
            si = frappe.new_doc("Sales Invoice")
            si.posting_date = source_name.posting_date
            si.customer = source_name.customer
            si.sales_form_id = source_name.name
            si.payment_terms = source_name.payment_terms
            si.company = frappe.defaults.get_defaults().company
            si.write_off_percentage = source_name.commission_percentage
            si.write_off_amount = source_name.commission
            si.commission_amount = source_name.commission
            si.update_stock = 1

            sii = si.append("items", {})
            sii.item_code = source_name.item_code
            sii.qty = source_name.qty
            sii.rate = source_name.rate
            sii.rate_per_lbs = source_name.rate_per_lbs
            sii.lbs = source_name.lbs
            sii.batch_no = source_name.batch_no
            sii.lbs_per_ctn = source_name.lbs_per_ctn
            sii.kg_per_ctn = source_name.kg_per_ctn
            sii.kgs = source_name.kgs
            sii.amount = source_name.amount
            sii.uom = frappe.defaults.get_defaults().uom
            sii.stock_qty = source_name.qty
            sii.base_rate = source_name.rate
            sii.base_amount = source_name.amount

            si.save()
            si.submit()
        except Exception as error:
            frappe.throw(f"{error}")

    # def on_cancel(self):
    #     si = get_doctype_by_field('Sales Invoice', 'sales_form_id', self.name)
    #     # if si.docstatus != 2:  # Ensure the document is in the "Submitted" state
    #     si.cancel()
    #     frappe.db.commit()
    #     # else:
    #     #     frappe.throw("Document is not in the 'Submitted' state.")
    #     if si.amended_from:
    #         new_name = int(si.name.split("-")[-1]) + 1
    #     else:
    #         new_name = f"{si.name}-{1}"
    #     make_autoname(new_name, 'Sales Invoice')
