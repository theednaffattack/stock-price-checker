const { log } = console;
const { Issue } = require("../models/Issue");

module.exports = { createIssue, updateIssue };

async function createIssue({
  project,
  issue_title,
  issue_text,
  created_by,
  assigned_to,
  status_text
}) {
  let newIssue = new Issue({
    project,
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text
  });
  return await new Promise((resolve, reject) => {
    newIssue.save(async (err, doc) => {
      if (err) reject(err);

      let formattedDoc = await formatDoc(doc);
      resolve(formattedDoc);
    });
  });
}

async function updateIssue(issue) {
  let { _id } = issue;
  console.log("VIEW ISSUE");
  console.log(issue);
  return await new Promise((resolve, reject) => {
    let updatedObj = Issue.findByIdAndUpdate(_id, issue, {
      new: true
    }).exec(async (err, doc) => {
      if (err) reject(doc);
      let formattedDoc = await formatDoc(doc);
      resolve(formattedDoc);
    });
  });
}

async function formatDoc(doc) {
  let obDoc = doc.toObject();
  obDoc.created_on = obDoc.createdAt;
  obDoc.updated_on = obDoc.updatedAt;
  delete obDoc.createdAt;
  delete obDoc.updatedAt;
  return obDoc;
}
