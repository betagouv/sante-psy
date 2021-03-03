module.exports.getCsrfTokenHtml = function getCsrfToken(request) {
  if(request) {
    return request.res.text.split('<input type="hidden" name="_csrf" value="')[1].split('">')[0];
  } else {
    return 'no request to get CSRF token';
  }
}

module.exports.getCsrfTokenCookie = function getCsrfToken(request) {
  //console.log("request.headers['set-cookie']", request.headers['set-cookie']);
  if(request) {
    return request.headers['set-cookie'];
  } else {
    return [];
  }
}