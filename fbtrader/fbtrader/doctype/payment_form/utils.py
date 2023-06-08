import json

import frappe
from frappe import _, qb


@frappe.whitelist()
def fetch_child_records(**args):
    child_records = frappe.get_all("Receipt Form Item", filters={"payment_form_id": args.get("master_name")},
                                   fields=["name",
                                           "mode_of_payment",
                                           "in_date",
                                           "bank_name",
                                           "account_title",
                                           "cheque_no",
                                           "bank_date",
                                           "amount",
                                           "in_party",
                                           "out_party",
                                           "out_date"]
                                   )
    return child_records


@frappe.whitelist()
def get_receipts(**args):
    rfi = frappe.qb.DocType("Receipt Form Item")
    query = (
        frappe.qb.from_(rfi)
        .select(rfi.name,
                rfi.mode_of_payment,
                rfi.in_date,
                rfi.bank_name,
                rfi.account_title,
                rfi.cheque_no,
                rfi.bank_date,
                rfi.amount,
                rfi.out_party,
                rfi.in_party,
                rfi.out_date
                )
        .where(
            (rfi.status == 'In')
            # & (je.posting_date.lte(self.filters.report_date))
            # & (je.voucher_type == "Exchange Rate Revaluation")
        )
    )

    if args.get("from_date", None) and args.get("to_date", None):
        query = query.where(
            rfi.in_date.between(args.get("from_date"), args.get("to_date"))
        )
    if args.get("bank_name", None):
        query = query.where(
            rfi.bank_name.like(f"%{args.get('bank_name')}%")
        )
    if args.get("account_title", None):
        query = query.where(
            rfi.account_title.like(f"%{args.get('account_title')}%")
        )
    if args.get("mode_of_payment", None):
        query = query.where(
            rfi.mode_of_payment == args.get('mode_of_payment')
        )
    if args.get("cheque_no", None):
        query = query.where(
            rfi.cheque_no.like(f"%{args.get('cheque_no')}%")
        )
    if args.get("bank_date", None):
        query = query.where(
            rfi.bank_date == args.get('bank_date')
        )
    return query.run(as_dict=True)


@frappe.whitelist()
def cancel_payment_form(**args):
    receipt_form_item = json.loads(args.get('receipt_form_item'))
    for item in receipt_form_item:
        rfi = frappe.get_doc("Receipt Form Item", item['id'])
        rfi.reload()
        rfi.payment_form_id = None
        rfi.status = 'In'
        rfi.out_party = None
        rfi.out_date = None
        rfi.save()
    frappe.db.delete("Payment Form", args.get('parent'))
    return "Cancelled"
