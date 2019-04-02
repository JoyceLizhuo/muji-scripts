const random = () => Math.ceil(Math.random() * 10) * 300

module.exports = () => (req, res) => {
  setTimeout(() => {
    res.json({
      data: {
        query: req.query,
        body: req.body,
      },
    })
  }, req.query.a * 500)
}
