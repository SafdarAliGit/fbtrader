// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Receipt Form', {
    refresh: function (frm) {
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
                    }
                });

            }).addClass("btn-primary")
        }

        // PAYMENT RECEIT END
    },
    party: function (frm) {
        var master_party = frm.doc.party;
        frm.doc.receipt_form_item.forEach(function (row) {
            row.in_party = master_party
        });
        frm.refresh_field('receipt_form_item');
    },
    after_save:function (frm){
        $.each(frm.doc.receipt_form_item || [], function (i, d) {
                d.name_id= d.name;
            });
    },
    before_submit:function (frm){
        $.each(frm.doc.receipt_form_item || [], function (i, d) {
                d.name_id= d.name;
            });
    }



});
frappe.ui.form.on('Receipt Form Item', {

    receipt_form_item_add: function (frm, cdt, cdn) {
        var master_party = frm.doc.party;
        if (master_party) {
            var row = locals[cdt][cdn];
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
    }
})
;