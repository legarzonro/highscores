var express = require('express');
var router = express.Router();
const readline = require('readline');
const fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  var numberOfTest = 0;
  var dataTables = [];  //use to store objects for each high score table
  var dataTemp = []; //use to store scores from 1 table
  var numberOfPlayers = 0;
  var numberOfScores = 0;
  var lineData = [];

  const readInterface = readline.createInterface({
    input: fs.createReadStream('./public/docs/input.in'),
    output: process.stdout,
    console: false
  });

  readInterface.on('line', function (line) {
    lineData.push(line.split(' '));
  });

  readInterface.on('close', function () {
    var lineIndex = 0;
    numberOfTest = lineData[lineIndex][0];
    lineIndex++;
    for (let i = 0; i < numberOfTest; i++) {
      dataTemp = [];
      numberOfPlayers = lineData[lineIndex][0];
      numberOfScores = lineData[lineIndex][1];
      lineIndex++;
      for (let j = 0; j < numberOfPlayers; j++) {
        dataTemp.push({ player: lineData[lineIndex][0], score: lineData[lineIndex][1] });
        lineIndex++;
      }
      getHighScoresTable(dataTemp, numberOfScores);
    }
    console.log(dataTables);
    res.render('index', { title: 'Express', data: dataTables });
  });


  function getHighScoresTable(data, numberOfScores) {
    data.sort((a, b) => { return b.score - a.score });
    data = data.slice(0, numberOfScores);
    for (let i = data.length; i < numberOfScores; i++) {
      data.push({ player: '***', score: '***' })
    }
    for (let i = 0; i < data.length; i++) {
      data[i].rank = (i == 0) ? 1 : ((data[i - 1].score == data[i].score) ? data[i - 1].rank : i + 1);
    }
    dataTables.push(data);
  }

});




module.exports = router;
