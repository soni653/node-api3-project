const express = require("express");
const db = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  // do your magic!
  db.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(error);
      res.status(500).json({
        error: "The user information could not be retrived.",
      });
    });
});
//router.use("./:id", validatePostId)
router.get("/:id", (req, res) => {
  // do your magic!
  db.getById(req.params.id)
    .then((post) => res.status(200).json(post))
    .catch((err) =>
      res.status(404).json({ err, errorMessage: "Unable to retrive the post" })
    );
});

router.delete("/:id", (req, res) => {
  // do your magic!
  db.remove(req.params.id)
    .then((count) => {
      count === 1
        ? res.status(200).json({
            message: `${count} post was removed from database.`,
          })
        : res.status(500).json({
            err,
            errorMessage: "Can't remove post.",
          });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        errorMessage: "Can't remove post.",
      });
    });
});
router.put("/:id", (req, res) => {
  // do your magic!
  db.update(req.params.id, req.body)
    .then((count) => {
      count === 1
        ? res.status(200).json({
            message: `${count} post was updated in database.`,
          })
        : res.status(500).json({
            err,
            errorMessage: "Can't update post.",
          });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        errorMessage: "Can't update post.",
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  db.getById(req.params.id)
    .then((post) => {
      post
        ? next()
        : res.status(400).json({
            message: "Invalid post id.",
          });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        message: "Error connecting to database.",
      });
    });
}

module.exports = router;
