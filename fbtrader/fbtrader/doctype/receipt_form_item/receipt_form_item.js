// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt


frappe.ui.form.on('Receipt Form Item', {
    refresh: function(frm) {
        // Set query for the link field in the child table
        frm.fields_dict['receipt_form_item'].grid.get_field('mode_of_payment').set_query(function() {
            return {
                filters: [
                    ["Mode Of Payment", "mode_of_payment", "in", ["Cheque", "Online Deposit"]]
                ]
            };
        });
    }
});
