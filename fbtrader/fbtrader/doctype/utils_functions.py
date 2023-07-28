import frappe


def get_doctype_by_field(doctype_name, field_name, field_value):
    query = frappe.get_all(doctype_name, filters={field_name: field_value},
                           fields=["name", "docstatus", "amended_from"])

    if query:
        docname = query[0].name
        doc = frappe.get_doc(doctype_name, docname)
        return doc
    else:
        return None


def get_purchase_related_jv(reference_name):
    query = f"""
        SELECT parent
        FROM `tabJournal Entry Account`
        WHERE reference_name = '{reference_name}'
        ORDER BY creation
        LIMIT 1
    """
    jea = frappe.db.sql(query, as_dict=True)[0]
    je = frappe.get_doc('Journal Entry', jea.parent)
    if je:
        return je
    else:
        return None
