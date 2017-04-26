var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var config = require('./config');
var _ = require('underscore');
var request = require('request');
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

var url = '';
var topic = 'lava';
var chapter = 'Volcanoes';
var queryObject =  {
   "userID":"IOK_Postman_Testing",
   "parameters":{
        "parameterInstance":[
            {"name":"complexity","value":5},
            {"name":"duration","value":4}, 
            {"name":"topic","value":topic},
            {"name":"chapter","value":chapter}
          ]
       }
} ;
var favourites = {};
request({
    url: "http://kdeg-vm-43.scss.tcd.ie/ALMANAC_Personalised_Composition_Service/composer/atomiccompose",
    method: "POST",
    json: true,   // <--Very important!!!
    body: queryObject,
     headers: {
        "content-type": "application/json",  // <--Very important!!!
    },
}, function (error, response, body){

    console.log("post query" + response.body);
      favourites = response.body;
      console.log(favourites.sections.section.length);
       for(var i=0; i< favourites.sections.section.length; i++) 
       {  
            url = url + " <h3>Images from section "+ (i+1) + " are as under</h3>";
            url = url + "<h4>" +  favourites.sections.section[i].text.text + "</h4>";
            var image_len = favourites.sections.section[i].images.image.length;
            for(var j=0; j< image_len;j++)
            {
              url = url+ "<p><img src=" + "\"" + favourites.sections.section[i].images.image[j].url + "\"" + "/></p>";
              console.log(url);
            }


           }
      


      var htmlPayload =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title> "+ favourites.title + "</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p>" + favourites.title   + " <i>formatted</i></p>" + 
        "    <b>test task management</b></p>" +
        "</body>" +
        "</html>";
});


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
            writetonote(access_token);
          res.end('Signed in ');
        }
      });
});

function writetonote(token)
{
  

    var htmlPayload =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title>"+ favourites.title +"</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p> View Your Page <i>formatted</i></p>" +
         url +
        "</body>" +
        "</html>";
      createPage(token, htmlPayload, false);

}


function dateTimeNowISO() {
      return new Date().toISOString();
    }

    function createPage(accessToken, payload, multipart) {
      var options = {
        url: oneNotePagesApiUrl,
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      };
      console.log(accessToken , payload);
      // Build simple request
      if (!multipart) {
        options.headers['Content-Type'] = 'text/html';
        options.body = payload;
      }
      var r = request.post(options);
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