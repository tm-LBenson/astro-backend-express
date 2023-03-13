/** @format */

function proofOfLife(req, res) {
  console.log(req.params);
  res.status(200).send({
    connected: 'connected',
  });
}

module.exports = proofOfLife;
