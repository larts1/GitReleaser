const axios = require('axios');
const http = require('http');
const fs = require('fs');

//column IDs
originIDs = [];
targetID = ;
token = ""; //git webmaster access token
port = ;


const Options = 
{
    headers: {
        'Accept': "application/vnd.github.inertia-preview+json",
        'Authorization': "token " + token,
    }
}

function moveAll(labelName) {
  originIDs.forEach((i) => {
    axios.get("https://api.github.com/projects/columns/"+i+"/cards", Options)
         .then((resp) => reqListener(resp.data, labelName));
  });
}

function reqListener(data, labelName) {
  var issues = data.map(c => c.content_url);
  var cards = data.map(c => c.url);
  issues.forEach(i => i && setLabel(i, labelName));
  cards.forEach(i => moveToProd(i));
}

function setLabel(i, labelName) {
    axios.patch(i, JSON.stringify({ "labels": [labelName] }), Options);
}

function moveToProd(i) {
    axios.post(i+"/moves", JSON.stringify({
        "position": "top",
        "column_id": targetID
    }), Options);
}

const server = http.createServer((req,res) => {
    if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
            branch = JSON.parse(jsonString).ref;
            if ( branch && branch.startsWith("Release-") ) {
                moveAll(branch);
            }
            res.end();
        });
    }
});

server.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
  
    console.log(`server is listening on ${port}`)
  })
