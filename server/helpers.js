const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Isemail = require('isemail');
const uuidv4 = require('uuid/v4');

this.error = (type = 'Server', title = 'Unkown error occured', message = 'An unknown error occured') => {
  return {
    type,
    title,
    message
  }
}

this.hashPass = (pass) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(pass, salt);
  // console.log(password, helpers.comparePass(password, hash));
  return hash;
}

this.generateUid = (length = 30, uuid = false) => {
  if (uuid === true) {
    return uuidv4();
  };
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

this.isFunction = (functionToCheck) => {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

this.verboseMessage = (type, message) => {
  return { type, message }
}

this.validateEmail = (email, arr = process.env.Blacklist, verbose = false) => {
  console.log('Blacklist: ', arr.split(','));
  if (typeof arr !== 'array') {
    if (arr.indexOf(',') >= 0) {
      arr = arr.split(',');
    } else {
      arr = [arr];
    }
  }
  let emailDomain = email.split('@')[1];
  console.log(email, emailDomain, arr.indexOf(emailDomain));
  if (email !== "" || email !== undefined || email !== null) {
    // if email is not empty string or undefined
    let erx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    let emailFormat = erx.test(email);
    if (!emailFormat) {
      // check reason as to why the email is invalid
      return false;
    }
    // email is valid!
    // check if domain matches any in blacklist [arr]
    if (arr.length > 0 && Array.isArray(arr)) {
      if (arr.indexOf(emailDomain) >= 0) {
        // if email domain is in the blacklist
        return verbose === false ? false : verboseMessage('error', 'Email address in blacklist');
      } else {
        // if email is NOT in the blacklist
        return true;
      }
    } else {
      // if there was no blacklist provided
      return true;
    }
  } else {
    // email is empty or undefined or null
    return verbose === false ? false : verboseMessage('error', 'email is empty or undefined or null');
  }
}

this.generateToken = (data, secret = process.env.SK) => {
  return jwt.sign(data, secret, { expiresIn: '30d' });
}

this.verifyToken = (token, secret = process.env.SK) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(this.error('Server', 'Token unauthorized'));
      } else {
        resolve(decoded);
      }
    });
  });
}

this.comparePass = (userPassword, databasePassword) => {
  return bcrypt.compareSync(userPassword, databasePassword);
}

module.exports = this;