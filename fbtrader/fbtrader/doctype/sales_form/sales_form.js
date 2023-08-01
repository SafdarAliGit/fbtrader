// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sales Form', {
        onload: function(frm) {
        frm.fields_dict['batch_no'].get_query = function(doc) {
            return {

                      filters: [
                     ["Batch", "item", "=", doc.item_code], ["Batch", "batch_qty", ">", 0]
                ]

            };
        };
    },
    // refresh: function(frm) {

    // }
    // CUSTOM GETTING CUSTOMER BALANCE
    // customer: function (frm) {
    //     frappe.call({
    //         method: 'erpnext.accounts.utils.get_balance_on',
    //         args: {
    //             doctype: 'Sales Form',
    //             party_type: 'Customer',
    //             party: frm.doc.customer,
    //             outstanding_only: 1
    //         },
    //         callback: function (r) {
    //             if (r.message) {
    //                 frm.set_value('current_outstanding_amount', r.message);
    //             }
    //         }
    //     });
    // },
    // FETCHING ITEM INFO FROM PURCHASE INVOICE ITEM UISNG BATCH NO AND ITEM CODE
    batch_no: function (frm) {

        if (frm.doc.item_code && frm.doc.batch_no) {
            frappe.call({
                method: 'fbtrader.fbtrader.doctype.utils.fetch_do',
                args: {
                    'item_code': frm.doc.item_code,
                    'batch_no': frm.doc.batch_no,
                },
                callback: function (r) {
                    if (!r.exc) {
                        if (r.message.length === 1) {
                            frm.set_value('kg_per_ctn', r.message[0].kg_per_ctn);
                            frm.set_value('lbs_per_ctn', r.message[0].lbs_per_ctn);
                            frm.set_value('qty', r.message[0].qty);
                            frm.set_value('kgs', r.message[0].kgs);
                            frm.set_value('lbs', r.message[0].lbs);
                            frm.set_value('lot_no', r.message[0].lot_no);
                            frm.set_value('pkg_mode', r.message[0].pkg_mode);
                            frm.set_value('grade', r.message[0].grade);
                        } else if (r.message.length > 1) {
                            frappe.msgprint(`Multiple Items found under batch no ${frm.doc.batch_no}`)
                        } else {
                            frappe.msgprint(`No any Item found under batch no ${frm.doc.batch_no}`)
                        }
                    }
                }
            });
        } else {
            msgprint(__("Item Not selected"));
        }

    },
    rate_per_lbs: function (frm) {
        var rate_per_lbs = frm.doc.rate_per_lbs;
        var lbs_per_ctn = frm.doc.lbs_per_ctn;
        var rate = lbs_per_ctn * rate_per_lbs
        var qty = frm.doc.qty;
        frm.set_value("rate", rate);
        frm.set_value("amount", rate * qty);
        frm.set_value("net_amount", rate * qty);

    },
    commission_percentage: function (frm) {
        var commission_percentage = frm.doc.commission_percentage;
        var amount = frm.doc.amount;
        var commission = amount * (commission_percentage / 100);
        var net_amount = amount - commission;
        frm.set_value("commission", commission);
        frm.set_value("net_amount", net_amount);
    },
});
