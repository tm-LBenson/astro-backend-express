/** @format */

function proofOfLife(req, res) {
  
  res.status(200).send({
    connected: 'connected',
  });
}

module.exports = proofOfLife;
