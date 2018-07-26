const randomstring = require('randomstring');

exports.createGame = async (req, res) => {
  const gameId = randomstring.generate({
    length: 4,
    charset: 'numeric'
  });
  const adminId = randomstring.generate(12);
  res.status(201).send({gameId, adminId});
};