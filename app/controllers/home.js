/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

function home(req, res, next) {
  res.render('index');
}

module.exports = {
  home
};