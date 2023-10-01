# my_custom_app.my_custom_app.report.daily_activity_report.daily_activity_report.py
import frappe
from frappe import _


def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data


def decimal_format(value, decimals):
    formatted_value = "{:.{}f}".format(value, decimals)
    return formatted_value


def get_columns():
    columns = [
        {
            "label": _("In Date"),
            "fieldname": "in_date",
            "fieldtype": "Date",
            "width": 120

        }, {
            "label": _("Out Date"),
            "fieldname": "out_date",
            "fieldtype": "Date",
            "width": 120

        },
        {
            "label": _("In Party"),
            "fieldname": "in_party",
            "fieldtype": "Data",
            "width": 120
        },
        {
            "label": _("Out Party"),
            "fieldname": "out_party",
            "fieldtype": "Data",
            "width": 100
        },
        {
            "label": _("Mode Of Payment"),
            "fieldname": "mode_of_payment",
            "fieldtype": "Data",
            "width": 100
        },
        {
            "label": _("Bank"),
            "fieldname": "bank_name",
            "fieldtype": "Data",
            "width": 100
        },
        {
            "label": _("AC Title"),
            "fieldname": "account_title",
            "fieldtype": "Data",
            "width": 100
        },
        {
            "label": _("Cheque No"),
            "fieldname": "cheque_no",
            "fieldtype": "Data",
            "width": 100
        },
        {
            "label": _("Bank Date"),
            "fieldname": "bank_date",
            "fieldtype": "Date",
            "width": 100
        },
        {
            "label": _("Slip No"),
            "fieldname": "slip_no",
            "fieldtype": "Data",
            "width": 100
        },
        {
            "label": _("Amount"),
            "fieldname": "amount",
            "fieldtype": "Currency",
            "width": 100
        },
        {
            "label": _("Status"),
            "fieldname": "status",
            "fieldtype": "Data",
            "width": 100
        }
    ]
    return columns


def get_conditions(filters, doctype):
    conditions = []

    if filters.get("mode_of_payment"):
        conditions.append(f"`tab{doctype}`.mode_of_payment = %(mode_of_payment)s")
    return " AND ".join(conditions)


def get_data(filters):
    data = []

    try:
        sfi = """
               SELECT
                 `tabReceipt Form Item`.in_date,
                 `tabReceipt Form Item`.out_date,
                 `tabReceipt Form Item`.in_party,
                 `tabReceipt Form Item`.out_party,
                 `tabReceipt Form Item`.mode_of_payment,
                 `tabReceipt Form Item`.bank_name,
                 `tabReceipt Form Item`.account_title,
                 `tabReceipt Form Item`.cheque_no,
                 `tabReceipt Form Item`.bank_date,
                 `tabReceipt Form Item`.slip_no,
                 `tabReceipt Form Item`.amount,
                 `tabReceipt Form Item`.status
               FROM
                 `tabReceipt Form Item`
               WHERE
                `tabReceipt Form Item`.status ='In' AND 
                 {conditions}
            """.format(conditions=get_conditions(filters, "Receipt Form Item"))

        sfi_result = frappe.db.sql(sfi, filters, as_dict=1)
        data.extend(sfi_result)
    except Exception as e:
        print(f"An error occurred: {e}")

    return data
