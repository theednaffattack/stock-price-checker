const { log } = console;
const { createIssue, updateIssue } = require("./issueFetching");

module.exports = {
  deleteIssueController,
  getIssueController,
  postIssueController,
  putIssueController
};

function deleteIssueController(req, res) {
  const project = req.params.project;
}

function getIssueController(req, res) {
  const project = req.params.project;
}
async function postIssueController(req, res) {
  const project = req.params.project;

  let reqBody = req.body;
  reqBody.project = project;

  let newIssue = await createIssue(reqBody);

  return res.status(200).send(newIssue);
}

async function putIssueController(req, res) {
  const updatedIssue = await updateIssue(req.body);
  return res.status(200).send(updatedIssue);
}
