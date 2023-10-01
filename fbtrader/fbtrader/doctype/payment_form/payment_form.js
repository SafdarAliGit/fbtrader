// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt
frappe.ui.form.on('Payment Form', {
    refresh: function (frm) {

        function calculate_net_total(frm) {
            var total_amount = 0;
            $.each(frm.doc.receipt_form_item || [], function (i, d) {
                total_amount += flt(d.amount);
            });
            frm.set_value("detail_total", total_amount);
            frm.set_value("total_amount", total_amount + frm.doc.cash_payment);

        }

        calculate_net_total(frm)
        frm.set_value("tr_no", frm.doc.name);
        frm.page.btn_secondary.hide()
        // PAYMENT
        if (frm.doc.docstatus === 1 && !frm.doc.payment_entry_done) {
            frm.add_custom_button(__('Generate Payment Entry'), function () {

                frappe.call({
                    method: 'fbtrader.fbtrader.doctype.utils.payment_entry_from_payment_form',
                    args: {
                        receipt_form_item: frm.doc.receipt_form_item,
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

        // PAYMENT END
        const CHILDS = {}
        frappe.call({
            method: 'fbtrader.fbtrader.doctype.utils.fetch_child_records',
            args: {
                master_name: frm.doc.name
            },
            callback: function (response) {
                if (response.message) {
                    var childRecords = response.message;
                    // Process child records as needed
                    frm.doc.receipt_form_item = []

                    $.each(childRecords, function (_i, e) {
                        let entry = frm.add_child("receipt_form_item");
                        entry.id = e.name
                        entry.mode_of_payment = e.mode_of_payment,
                            entry.in_date = e.in_date,
                            entry.bank_name = e.bank_name,
                            entry.account_title = e.account_title,
                            entry.cheque_no = e.cheque_no,
                            entry.bank_date = e.bank_date,
                            entry.amount = e.amount,
                            entry.in_party = e.in_party,
                            entry.out_party = frm.doc.party_name,
                            entry.out_date = frm.doc.receipt_date,
                            entry.name_id = e.name_id
                    })
                    refresh_field("receipt_form_item")
                }
            }
        });

        frm.add_custom_button(__("Fetch Receipts"), function () {
            let d = new frappe.ui.Dialog({
                title: 'Enter Filters',
                fields: [
                    // {
                    //     label: 'From Date',
                    //     fieldname: 'from_date',
                    //     fieldtype: 'Date'
                    // },
                    // {
                    //     label: 'To Date',
                    //     fieldname: 'to_date',
                    //     fieldtype: 'Date'
                    // },
                    {
                        label: 'Mode Of Payment',
                        fieldname: 'mode_of_payment',
                        fieldtype: 'Link',
                        options: 'Mode of Payment',
                        reqd: 1,
                        "get_query": function () {
                            return {
                                "filters": [
                                    ['Mode of Payment', 'mode_of_payment', 'in', 'Cheque,Online Deposit']
                                ]
                            }
                        }
                    },
                    {
                        label: 'Bank Name',
                        fieldname: 'bank_name',
                        fieldtype: 'Link',
                        options: "Bank"
                    },
                    {
                        label: 'Account Title',
                        fieldname: 'account_title',
                        fieldtype: 'Link',
                        options: 'Account Title'
                    },
                    {
                        label: 'Cheque #',
                        fieldname: 'cheque_no',
                        fieldtype: 'Data'
                    },
                    {
                        label: 'Slip #',
                        fieldname: 'slip_no',
                        fieldtype: 'Data'
                    },
                    {
                        label: 'Bank Date',
                        fieldname: 'bank_date',
                        fieldtype: 'Date'
                    },


                ],
                primary_action_label: 'Fetch',
                primary_action(filters) {
                    // Ajax call
                    frappe.call({
                        method: 'fbtrader.fbtrader.doctype.utils.get_receipts',
                        args: {
                            from_date: filters.from_date,
                            to_date: filters.to_date,
                            bank_name: filters.bank_name,
                            account_title: filters.account_title,
                            mode_of_payment: filters.mode_of_payment,
                            cheque_no: filters.cheque_no,
                            bank_date: filters.bank_date
                        },
                        callback: function (response) {
                            if (response.message) {
                                var childRecords = response.message;
                                // Process child records as needed
                                frm.doc.receipt_form_item = []

                                $.each(childRecords, function (_i, e) {
                                    let entry = frm.add_child("receipt_form_item");
                                    entry.id = e.name
                                    entry.mode_of_payment = e.mode_of_payment,
                                        entry.in_date = e.in_date,
                                        entry.bank_name = e.bank_name,
                                        entry.account_title = e.account_title,
                                        entry.cheque_no = e.cheque_no,
                                        entry.bank_date = e.bank_date,
                                        entry.amount = e.amount,
                                        entry.in_party = e.in_party,
                                        entry.out_party = frm.doc.party_name,
                                        entry.out_date = frm.doc.receipt_date,
                                        entry.name_id = e.name_id,
                                        entry.slip_no = e.slip_no
                                })
                                frm.refresh_field("receipt_form_item")
                            }

                            function calculate_net_total(frm) {
                                var total_amount = 0;
                                $.each(frm.doc.receipt_form_item || [], function (i, d) {
                                    total_amount += flt(d.amount);
                                });
                                frm.set_value("detail_total", total_amount);
                                frm.set_value("total_amount", total_amount + frm.doc.cash_payment);
                            }

                            calculate_net_total(frm)

                        }
                    });
                    // Ajax call end
                    d.hide();
                }
            });

            d.show();


        }).addClass("btn-primary")

        if (frm.doc.docstatus === 1 && !frm.doc.payment_entry_done) {
            frm.add_custom_button(__("Cancel Payment Form"), function () {

                frappe.confirm('Are you sure you want to proceed?',
                    () => {

                        // Ajax call
                        frappe.call({
                            method: 'fbtrader.fbtrader.doctype.utils.cancel_payment_form',
                            args: {
                                receipt_form_item: frm.doc.receipt_form_item,
                                parent: frm.doc.name,
                            },
                            callback: function (response) {
                                if (response.message) {
                                    frappe.msgprint(`Payment form : ${frm.doc.name} cancelled`);
                                    frappe.set_route('List', 'Payment Form')
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
      cash_payment: function (frm) {
        frm.set_value('total_amount',frm.doc.total_amount + frm.doc.cash_payment);
        frm.set_value('detail_total',frm.doc.detail_total + frm.doc.cash_payment);
    },

    // validate: function (frm) {
    //     // Remove child documents before saving
    //     frm.doc.receipt_form_item = []
    // },
    // before_save: function (frm) {
    //     // Remove child documents before saving
    //     frm.doc.receipt_form_item = []
    // }
    after_save: function (frm) {
        frappe.set_route('List', 'Payment Form');
    },
    before_cancel: function (frm) {
        frappe.msgprint('you are about to cancel');
    },
    party: function (frm) {
        frappe.call({
                    method: 'fbtrader.fbtrader.doctype.utils.get_primary_party',
                    args: {
                        secondary_party: frm.doc.party,
                    },
                    callback: function (r) {
                        if (!r.exc) {
                            frm.set_value('party_name', r.message);
                             frm.doc.receipt_form_item.forEach(function (row) {
                                    row.out_party = r.message
                             });
                            frm.refresh_field('receipt_form_item');
                        }
                    }
                });

    }

});

frappe.ui.form.on('Receipt Form Item', {
    receipt_form_item_remove: function (frm) {
        function calculate_net_total(frm) {
            var total_amount = 0;
            $.each(frm.doc.receipt_form_item || [], function (i, d) {
                total_amount += flt(d.amount);
            });
             frm.set_value("detail_total", total_amount);
            frm.set_value("total_amount", total_amount + frm.doc.cash_payment);
        }

        calculate_net_total(frm)
    },
    amount: function (frm) {
        function calculate_net_total(frm) {
            var total_amount = 0;
            $.each(frm.doc.receipt_form_item || [], function (i, d) {
                total_amount += flt(d.amount);
            });
             frm.set_value("detail_total", total_amount);
            frm.set_value("total_amount", total_amount + frm.doc.cash_payment);
        }

        calculate_net_total(frm)
    }

});

