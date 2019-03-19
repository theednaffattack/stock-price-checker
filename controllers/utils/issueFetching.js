const { Issue } = require("../../models/Issue");

module.exports = { createIssue, deleteIssue, getAllIssues, updateIssue };

function testRequiredFields(issue) {
  let { issue_title, issue_text, created_by } = issue;
  let requiredKeys = ["project", "issue_title", "issue_text", "created_by"];
  let issueKeys = Object.keys(issue);
  let missingKeys = [];
  let foundKeys = [];
  let success = requiredKeys.every(value => {
    issueKeys.includes(value) ? foundKeys.push(value) : missingKeys.push(value);
    return issueKeys.includes(value);
  });

  if (missingKeys.length > 0) {
    return `Required field(s) missing: ${missingKeys}`;
  }
  if (missingKeys.length === 0) {
    return `All required keys present`;
  }
}

async function createIssue(issue) {
  let { issue_title, issue_text, created_by } = issue;
  let requiredFieldsPresent = await testRequiredFields(issue);
  if (requiredFieldsPresent === "All required keys present") {
    let newIssue = new Issue(issue);
    // should these Promise returns be inside a try catch?
    // I'd prefer it but I'm not sure about
    // `return`ing out of a try at this point.

    return await new Promise((resolve, reject) => {
      newIssue.save(async (err, doc) => {
        if (err) reject(err);
        let formattedDoc = await formatDoc(doc);
        resolve(formattedDoc);
      });
    });
  }

  if (requiredFieldsPresent !== "All required keys present") {
    return await new Promise((resolve, reject) => {
      resolve(requiredFieldsPresent);
    });
  }
}

async function deleteIssue({ _id }) {
  return await new Promise((resolve, reject) => {
    if (_id === undefined || _id === null || _id.length < 1)
      return resolve("_id error");
    Issue.findByIdAndRemove(_id).exec((err, msg) => {
      if (err) return reject(err);
      if (!msg) return resolve("could not delete " + _id);
      resolve("deleted " + _id);
    });
  });
}

async function getAllIssues(project, query = {}) {
  query.project = project;
  return await new Promise((resolve, reject) => {
    Issue.find(query).exec(async (err, docs) => {
      if (err) reject(err);

      let formattedDocs = await Promise.all(
        docs.map(async doc => {
          return await formatDoc(doc);
        })
      );
      resolve(formattedDocs);
    });
  });
}

async function updateIssue(issue) {
  let { _id } = issue;
  return await new Promise((resolve, reject) => {
    delete issue._id;
    let numberOfKeys = Object.keys(issue).length;
    if (numberOfKeys < 1) return resolve("no updated fields sent");
    Issue.findByIdAndUpdate(_id, issue, {
      new: true // the `new` option returns the mutated doc, default is false
    }).exec(async (err, doc) => {
      // Can the ifs below be an enum? I wish I had more time to experiment
      if (err) return reject(doc);
      if (!doc) return resolve("could not update " + _id);
      if (doc) return resolve("successfully updated");
    });
  });
}

// UTILITY FUNCS
async function formatDoc(doc) {
  if (!doc) {
    throw Error("Error formatting mongo doc, doc is undefined");
  }

  if (doc) {
    let obDoc = doc.toObject();
    obDoc.created_on = obDoc.createdAt;
    obDoc.updated_on = obDoc.updatedAt;
    delete obDoc.createdAt;
    delete obDoc.updatedAt;
    return obDoc;
  }
}
