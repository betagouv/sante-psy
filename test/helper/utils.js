module.exports.getCsrfTokenHtml = function getCsrfToken(request) {
  return request.res.text.split('<input type="hidden" name="_csrf" value="')[1].split('">')[0];
}

module.exports.getCsrfTokenCookie = function getCsrfToken(request) {
  return request.headers['set-cookie'];
}