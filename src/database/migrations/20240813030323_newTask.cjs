/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("tasks", function (table) {
    table.dropColumn("companyId");
    table.dropColumn("remarks");
    table.dropColumn("serviceAgreement");
    table.dropColumn("serviceAgreementFileLink");
    table.string("assignedBy").nullable();
    table.string("priorityLevel").nullable();
    table.uuid("workFlowId").references("workFlowId").inTable("workFlow");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("tasks", function (table) {
    table.uuid("companyId").references("companyId").inTable("companies");
    table.string("remarks").nullable();
    table.string("serviceAgreement").nullable();
    table.string("serviceAgreementFileLink").nullable();
    table.dropColumn("assignedBy");
    table.dropColumn("priorityLevel");
    table.dropColumn("workFlowId");
  });
};
