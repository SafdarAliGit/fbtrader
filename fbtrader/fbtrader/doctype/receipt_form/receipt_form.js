// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Receipt Form', {
    refresh: function (frm) {
        frm.set_value("tr_no", frm.doc.name);
    },
    party: function (frm) {
        var master_party = frm.doc.party;
        frm.doc.receipt_form_item.forEach(function (row) {
            row.in_party = master_party
        });
        frm.refresh_field('receipt_form_item');
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

    }
});