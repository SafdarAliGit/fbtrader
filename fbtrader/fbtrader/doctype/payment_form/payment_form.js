// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt
frappe.ui.form.on('Payment Form', {
    refresh: function (frm) {
        frm.page.btn_secondary.hide()
        frappe.call({
            method: 'fbtrader.fbtrader.doctype.payment_form.utils.fetch_child_records',
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
                            entry.party_type = e.party_type,
                            entry.party = e.party,
                            entry.out_date = e.out_date
                    })
                    refresh_field("receipt_form_item")
                }
            }
        });

        frm.add_custom_button(__("Fetch Receipts"), function () {
            let d = new frappe.ui.Dialog({
                title: 'Enter Filters',
                fields: [
                    {
                        label: 'From Date',
                        fieldname: 'from_date',
                        fieldtype: 'Date'
                    },
                    {
                        label: 'To Date',
                        fieldname: 'to_date',
                        fieldtype: 'Date'
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
                        fieldtype: 'Data'
                    },
                    {
                        label: 'Cheque #',
                        fieldname: 'cheque_no',
                        fieldtype: 'Data'
                    },
                    {
                        label: 'Bank Date',
                        fieldname: 'bank_date',
                        fieldtype: 'Date'
                    },
                    {
                        label: 'Mode Of Payment',
                        fieldname: 'mode_of_payment',
                        fieldtype: 'Select',
                        options: ['Online deposit', 'PDC', 'Cash']
                    }
                ],
                primary_action_label: 'Fetch',
                primary_action(filters) {
                    console.log(filters.mode_of_payment);
                    // Ajax call
                    frappe.call({
                        method: 'fbtrader.fbtrader.doctype.payment_form.utils.get_receipts',
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
                                        entry.party_type = e.party_type,
                                        entry.party = e.party,
                                        entry.out_date = e.out_date
                                })
                                refresh_field("receipt_form_item")
                            }
                        }
                    });
                    // Ajax call end
                    d.hide();
                }
            });

            d.show();


        }).addClass("btn-primary")

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
        frappe.set_route('List', 'Payment Form')

    },
    before_cancel:function (frm){
        frappe.msgprint('you are about to cancel');
    }

});
