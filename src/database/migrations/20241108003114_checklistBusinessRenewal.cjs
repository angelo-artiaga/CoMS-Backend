/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("checklistBusinessRenewal", function (table) {
    table.uuid("businessChecklistId").defaultTo(knex.fn.uuid()).primary();
    table.uuid("company_id").references("companyId").inTable("companies");
    table.integer("year").notNullable();
    table.string("brgyClearance");
    table.string("cedula");
    table.string("billingAssesment");
    table.string("businessPermit");
    table.string("sanitaryPermit");
    table.string("insurance");
    table.string("fireSafetyInspectionCertificate");
    table.string("secDocuments");
    table.string("vatFillings");
    table.string("annualFinancialStatement");
    table.string("certificateOfGrossReceipts");
    table.string("contractOfLeaseAndTaxDeclarations");
    table.string("secCertAuthorizationorSPA");
    table.string("affidavitOfLoss");
    table.string("listOfRegularEmployees");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
