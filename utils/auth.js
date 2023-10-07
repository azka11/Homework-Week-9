const jwt = require('jsonwebtoken');

const signToken = data => {
    const token = jwt.sign( data, 'datasangatrahasia', { expiresIn: '1h' });
    return token;
};

const verifyToken = token => {
    const data = jwt.verify(token, 'datasangatrahasia');
    return data;
};

module.exports = { signToken, verifyToken };