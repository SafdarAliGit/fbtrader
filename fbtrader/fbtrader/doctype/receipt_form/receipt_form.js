// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt
const Obj = {
    n: 0
}
frappe.ui.form.on('Receipt Form', {

    refresh: function (frm) {
        function any_item_whose_payment_is_done(frm) {
            // frm.refresh_field('receipt_form_item');
            var statuses = [];
            $.each(frm.doc.receipt_form_item || [], function (i, d) {
                statuses.push(d.status);
            });
            return statuses;
        }


        frm.set_query('mode_of_payment', 'receipt_form_item', function (doc, cdt, cdn) {
            return {
                filters: [
                    ["Mode of Payment", "mode_of_payment", "in", ["Cheque", "Online Deposit", "Cash"]]
                ]
            };
        });
        Obj.n = 0;

        function calculate_net_total(frm) {
            var total_amount = 0;
            $.each(frm.doc.receipt_form_item || [], function (i, d) {
                total_amount += flt(d.amount);
            });
            frm.set_value("total_amount", total_amount)
        }

        calculate_net_total(frm)

        frm.set_value("tr_no", frm.doc.name);
        // PAYMENT RECEIT
        if (frm.doc.docstatus === 1 && !frm.doc.payment_entry_done) {
            frm.add_custom_button(__('Generate Payment Entry'), function () {

                frappe.call({
                    method: 'fbtrader.fbtrader.doctype.utils.payment_entry_from_receipt_form',
                    args: {
                        'source_name': frm.doc.name
                    },
                    callback: function (r) {
                        if (!r.exc) {
                            // frappe.model.sync(r.message);
                            frappe.show_alert("Payment Entry Created");
                        }
                        frm.reload_doc();
                    }
                });

            }).addClass("btn-primary")
        }


        // PAYMENT RECEIT END
        if (frm.doc.docstatus === 1 && !any_item_whose_payment_is_done(frm).includes('Out')) {

            frm.add_custom_button(__("Cancel Receipt Form"), function () {

                frappe.confirm('Are you sure you want to proceed?',
                    () => {

                        // Ajax call
                        frappe.call({
                            method: 'fbtrader.fbtrader.doctype.utils.cancel_receipt_form',
                            args: {
                                parent: frm.doc.name,
                            },
                            callback: function (response) {
                                if (response.message) {
                                    frappe.msgprint(`Receipt form : ${frm.doc.name} cancelled`);
                                    frappe.set_route('List', 'Receipt Form')
                                }
                            }
                        });
                        // Ajax call end
                    }, () => {
                        // action to perform if No is selected
                    })


            }).addClass("btn-primary")

        }
    },
    party: function (frm) {
        var master_party = frm.doc.party;
        frm.doc.receipt_form_item.forEach(function (row) {
            row.in_party = master_party
        });
        frm.refresh_field('receipt_form_item');
    },
    // after_save:function (frm){
    //     $.each(frm.doc.receipt_form_item || [], function (i, d) {
    //             d.name_id= d.name;
    //         });
    // },
    // before_submit:function (frm){
    //     $.each(frm.doc.receipt_form_item || [], function (i, d) {
    //             d.name_id= d.name;
    //         });
    // }


});


frappe.ui.form.on('Receipt Form Item', {

    receipt_form_item_add: function (frm, cdt, cdn) {
        frappe.call({
            method: 'fbtrader.fbtrader.doctype.utils.get_receipt_form_item_count',
            callback: function (response) {
                Obj.n += 1
                frappe.model.set_value(cdt, cdn, 'name_id', `PD-${(response.message) + Obj.n}`);
            }
        });


        var master_party = frm.doc.party;
        if (master_party) {
            frappe.model.set_value(cdt, cdn, 'in_party', master_party);
        } else {
            frappe.msgprint("Select Party First");
            return true;
        }

    },
    amount: function (frm) {
        function calculate_net_total(frm) {
            var total_amount = 0;
            $.each(frm.doc.receipt_form_item || [], function (i, d) {
                total_amount += flt(d.amount);
            });
            frm.set_value("total_amount", total_amount)
        }

        calculate_net_total(frm)
    },
    mode_of_payment: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var mode_of_payment = row.mode_of_payment;
        if (mode_of_payment == 'Cheque') {
            frappe.meta.get_docfield('Receipt Form Item', 'bank_name', row.name).reqd = 1;
            frappe.meta.get_docfield('Receipt Form Item', 'cheque_no', row.name).reqd = 1;
        }
        if (mode_of_payment == 'Online Deposit') {
            frappe.meta.get_docfield('Receipt Form Item', 'bank_name', row.name).reqd = 1;
            frappe.meta.get_docfield('Receipt Form Item', 'slip_no', row.name).reqd = 1;
            // frappe.meta.get_docfield('Receipt Form Item', 'account_title', row.name).reqd = 1;
        }

    },
    slip_no: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if (row.slip_no) {
            frappe.call({
                method: 'fbtrader.fbtrader.doctype.utils.slip_no_found',
                args: {
                    slip_no: row.slip_no
                },
                callback: function (response) {
                    if (response.message) {
                        frappe.throw(`Slip No ${row.slip_no} already taken`);
                        frappe.model.set_value('slip_no', cdt, cdn, '');
                    }
                }
            });
        }
    }

});
