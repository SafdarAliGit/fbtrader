// Copyright (c) 2023, Tech Ventures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Receipt Form', {
	refresh: function(frm) {
      frm.set_value("tr_no", frm.doc.name);
	}
});
