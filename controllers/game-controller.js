const randomstring = require('randomstring');

exports.createGame = async (req, res) => {
  const room = randomstring.generate({
    length: 4,
    charset: 'numeric'
  });
  const adminCode = randomstring.generate(12);
  res.status(201).send({room, adminCode});
};