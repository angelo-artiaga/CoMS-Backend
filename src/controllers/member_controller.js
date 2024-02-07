const viewAllMembers = (req, res) => {
  /**
   * req.params.org_id = organization ID
   */
  // query all members on the org_id
};

const viewMember = (req, res) => {
  /**
   * req.params.org_id = organization ID
   * req.params.id = member ID
   */
  // query member information from org_id
};

const addMember = (req, res) => {
  /**
   * req.params.org_id = organization ID
   */
  // add member_id to org
};

const removeMember = (req, res) => {
  /**
   * req.params.org_id = organization ID
   * req.params.id = member ID
   */
  // remove member from org
};

export { viewAllMembers, viewMember, addMember, removeMember };
