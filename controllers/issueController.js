const {
  createIssue,
  deleteIssue,
  getAllIssues,
  updateIssue
} = require("./utils/issueFetching");

// EXPORTS!!!
module.exports = {
  deleteIssueController,
  getIssueController,
  postIssueController,
  putIssueController
};

async function deleteIssueController(req, res) {
  console.log("VIEW REQ.BODY");
  console.log(req.body);
  const { _id } = req.body;
  const deleteMessage = await deleteIssue({ _id });
  res.status(200).send(deleteMessage);
}

async function getIssueController(req, res) {
  const project = req.params.project;
  const { query } = req;
  const theIssues = await getAllIssues(project, query);
  res.status(200).send(theIssues);
}

async function postIssueController(req, res) {
  const project = req.params.project;
  const reqBody = req.body;
  reqBody.project = project;
  const newIssue = await createIssue(reqBody);
  res.status(200).send(newIssue);
}

async function putIssueController(req, res) {
  const updatedIssue = await updateIssue(req.body);
  res.status(200).send(updatedIssue);
}
