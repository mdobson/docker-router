var argo = require('argo'),
    db = require('nano')('http://mdob.io:49159/deploys');

argo()
  .use(function(handle) {
    handle("request", function(env, next) {
      var host = env.request.headers['host'].split('.');
      var subdomain = '/'+host[0];
      db.get(subdomain, function(err, result) {
        if(err) {
          env.response.statusCode = 500;
          env.response.headers = { 'Content-Type':'application/json'};
          env.response.body = err;
          next(env);
        } else {
          env.target.url = "http://mdob.io:"+result.port+"/";
          next(env);
        }
      });
    });
  })
  .listen(3000);


