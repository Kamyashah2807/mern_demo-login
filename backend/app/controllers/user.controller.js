const Issue = require("../models/issue.model");
const fs = require("fs")
const User = require("../models/user.model");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.getuserBoard = (req, res) => {
  var query = {};
  query["$and"] = [];
  query["$and"].push({
    is_delete: false,
  });
  if (req.query && req.query.search) {
    query["$and"].push({
      title: { $regex: req.query.search }
    });
  }
  var perPage = 5;
  var page = req.query.page || 1;
  Issue.find(query, { date: 1, title: 1, id: 1, description: 1, status: 1, image: 1 }).sort({date: -1})
    .skip((perPage * page) - perPage).limit(perPage)
    .then((data) => {
      Issue.find(query).count()
        .then((count) => {
          if (data && data.length > 0) {
            res.status(200).json({
              status: true,
              title: 'Issue retrived.',
              issues: data,
              current_page: page,
              total: count,
              pages: Math.ceil(count / perPage),
            });
          } else {
            res.status(400).json({
              errorMessage: 'There is no issue!',
              status: false
            });
          }
        });
    }).catch(err => {
      res.status(400).json({
        errorMessage: err.message || err,
        status: false
      });
    });
}

exports.adduserBoard = (req, res) => {
    req.body.user = req.userId
    let new_issue = new Issue();
    new_issue.title = req.body.title;
    new_issue.description = req.body.description;
    new_issue.status = req.body.status;
    new_issue.image = req.files[0].filename;
    new_issue.user = req.userId;
    new_issue.save((err, data) => {
      if (err) {
        res.status(400).json({
          errorMessage: err,
          status: false
        });
      } else {
        res.status(200).json({
          status: true,
          title: 'Issue Added successfully.'
        });
      }
    })
}

exports.updateuserBoard = (req, res) => {
  Issue.findById(req.body.id, (err, new_issue) => {
    if (req.files && req.files[0] && req.files[0].filename && new_issue.image) {
      var path = `./uploads/${new_issue.image}`;
      fs.unlinkSync(path);
    }

    if (req.files && req.files[0] && req.files[0].filename) {
      new_issue.image = req.files[0].filename;
    }
    if (req.body.title) {
      new_issue.title = req.body.title;
    }
    if (req.body.description) {
      new_issue.description = req.body.description;
    }
    if (req.body.status) {
      new_issue.status = req.body.status;
    }

    new_issue.save((err, data) => {
      if (err) {
        res.status(400).json({
          errorMessage: err,
          status: false
        });
      } else {
        res.status(200).json({
          status: true,
          title: 'Issue updated.'
        });
      }
    });
  });
};

exports.deleteuserBoard = (req, res) => {
  if (req.body && req.body.id) {
    Issue.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
      if (data.is_delete) {
        res.status(200).json({
          status: true,
          title: 'Issue deleted.'
        });
      } else {
        res.status(400).json({
          errorMessage: err,
          status: false
        });
      }
    });
  } else {
    res.status(400).json({
      errorMessage: 'Add proper parameter first!',
      status: false
    });
  }
}

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
