// blocksConfig.js
const createBlocks = (data) => {
  const assigneesText =
    data.assignee && data.assignee.length > 0
      ? data.assignee.map((assignee) => `*<${assignee}>*`).join(", ")
      : "*No assignees*";

  // companyId,
  //   taskDescription,
  //   targetDate,
  //   status,
  //   remarks,
  //   serviceAgreement,
  //   serviceAgreementFileLink,
  //   assignee,

  return [
    {
      type: "image",
      image_url: `${data.companyHeader}`,
      alt_text: "company header",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `A new task has been assigned to:\n${assigneesText}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<${data.serviceAgreementFileLink}|${data.serviceAgreement} : Link>`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Target Date:*\n${data.targetDate}`,
        },
        {
          type: "mrkdwn",
          text: `*Task Description:*\n${data.taskDescription}`,
        },
        {
          type: "mrkdwn",
          text: `*Current Status:*\n${data.status}`,
        },
        {
          type: "mrkdwn",
          text: `*Current Remarks:*\n${data.remarks}`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "<https://staging-coms.vercel.app/|For More Info Login to CoMS>",
      },
    },
  ];
};

export default createBlocks;
