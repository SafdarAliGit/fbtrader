# In your custom Python server script (e.g., custom_script.py)
import frappe
from frappe import throw, _


def validate_duplicate_rows(doc, method):
    for row in doc.receipt_form_item:
        # Query the database to check for duplicate values
        duplicate_rows = frappe.db.sql("""
            SELECT name FROM `tabReceipt Form Item`
            WHERE cheque_no = %s
        """, (row.cheque_no))

        # If duplicate rows are found, raise an exception
        if duplicate_rows:
            error = _('Duplicate value found in row {0}').format(row.idx)
            throw(error)
