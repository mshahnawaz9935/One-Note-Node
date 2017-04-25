var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var config = require('./config');
var _ = require('underscore');

var oneNotePagesApiUrl = 'https://www.onenote.com/api/v1.0/pages';


var OAuth = require('oauth');
var OAuth2 = OAuth.OAuth2;
var oauth2 = new OAuth2(config.clientID, config.clientSecret, config.baseSite, config.authorizePath, config.tokenURL, null);
    var token ;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port
  var params = {
      'redirect_uri': config.redirectUrl.toString(),
      'grant_type': config.grant_type
    }


app.get('/', function(req, res,next){
 


 var authURL = oauth2.getAuthorizeUrl(
    _.extend({
      redirect_uri: config.redirectUrl
    }, config.authURLParams)
  );

  console.log("..authURL.....", authURL);

     res.redirect(authURL);
});

app.get('/callback', function(req, res,next){
    var code = req.query.code;


    console.log('code is' + code);
     oauth2.getOAuthAccessToken(
      code, params,
      function(e, access_token, refresh_token, results) {
        if (e) {
          console.log("Error:==>", e);
          res.end(e);
        } else if (results.error) {
          console.log(results);
          res.end(JSON.stringify(results));
        } else {
          token = access_token;
          res.end('Signed in ');
        }
      });

       this.createPageWithSimpleText = function(token, callback) {
      var htmlPayload =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title>TASK MANAGEMENT</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p>TASK MANAGEMENT <i>formatted</i></p>" +
        "    <b>test task mamangement</b></p>" +
        "</body>" +
        "</html>";

      createPage(token, htmlPayload, false, callback);
    };



});

    function createPage(accessToken, payload, multipart, callback) {
      var options = {
        url: oneNotePagesApiUrl,
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      };
      // Build simple request
      if (!multipart) {
        options.headers['Content-Type'] = 'text/html';
        options.body = payload;
      }
      var r = request.post(options, callback);
      // Build multi-part request
      if (multipart) {
        var CRLF = '\r\n';
        var form = r.form(); // FormData instance
        _.each(payload, function(partData, partId) {
          form.append(partId, partData.body, {
            // Use custom multi-part header
            header: CRLF +
              '--' + form.getBoundary() + CRLF +
              'Content-Disposition: form-data; name=\"' + partId + '\"' + CRLF +
              'Content-Type: ' + partData.contentType + CRLF + CRLF
          });
        });
      }
    }



app.listen(port);
console.log('Magic happens on port ' + port);