// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Purchase Form', {

    refresh: function (frm) {
     // if (frm.doc.docstatus === 2) {
            const amendButton = frm.page
            .find('[data-label="Amend"]');

        // Hide the button
        amendButton.hide();
        // }
    },
    kg_per_ctn: function (frm) {
        var kg_per_ctn = frm.doc.kg_per_ctn;
        var qty = frm.doc.qty;
        var kgs = kg_per_ctn * qty;
        var lbs_per_ctn = kg_per_ctn * 2.20462;
        var lbs = qty * lbs_per_ctn
        frm.set_value("lbs_per_ctn", lbs_per_ctn);
        frm.set_value("lbs", lbs);
        frm.set_value("kgs", kgs);


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
    batch_id: function (frm) {
        if (frm.doc.item_code && frm.doc.batch_id && frm.doc.qty) {
            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'Batch',
                        item: frm.doc.item_code,
                        batch_id: frm.doc.batch_id,
                        batch_qty: frm.doc.qty
                    }
                }
            });
            frappe.show_alert(`${frm.doc.batch_id} DO Created`);
        } else {
            frm.set_value("batch_id", ''); // Clear the batch_id field first
            frappe.show_alert("Item, batch and ctn all are required")
        }
    }

});


