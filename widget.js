function getReadableTime(now) {
    var minutes = [
      'punkt',
      'fünf nach',
      'zehn nach',
      'viertel nach',
      'zwanzig nach',
      'fünf vor halb',
      'halb',
      'fünf nach halb',
      'zwanzig vor',
      'viertel vor',
      'zehn vor',
      'fünf vor',
    ];
    var hours = [
      'zwölf',
      'eins',
      'zwei',
      'drei',
      'vier',
      'fünf',
      'sechs',
      'sieben',
      'acht',
      'neun',
      'zehn',
      'elf',
      'zwölf',
    ];
  
    var fifthMinutes = Number.parseInt(now.getMinutes() / 5);
  
    var currentHour = now.getHours();
    if (now.getMinutes() > 25) {
      currentHour = currentHour + 1;
    }
    // console.log(currentHour);
    if (currentHour > 12) {
      currentHour = currentHour - 12;
    }
  
    var readableHour = hours[currentHour];
    var readableMinutes = minutes[fifthMinutes];
    var words = (readableMinutes + ' ' + readableHour).split(' ');
    return words;
  }
  var words = {
    '1': 'abcdefghklmnrstv',
    '2': ['es', 'ja', 'no', 'si', 'de', 'ko', 'er', 'fa'],
    '3': ['der', 'vor', 'uhr', 'los','min','mit','not', 'ton', 'tag', 'elf','vor'],
    '4': ['zeit', 'nach', 'auto','lupe','plan','raum','zone', 'acht', 'drei', 'eins', 'fünf', 'halb', 'nach', 'neun', 'vier', 'zehn', 'zwei'],
    '5': ['neben', 'diese','abend','alter','druck','geist','punkt','reise', 'nacht', 'punkt', 'sechs', 'zwölf'],
    '6': ['ablauf','angabe','gefühl','kapsel','messer','minute','mittag','nehmen','planer','raffer','stunde','anzeige', 'sieben'],
    '7': ['schrift', 'sekunde', 'sekunde', 'stempel', 'uhrwerk', 'verlauf', 'schalter', 'lesbar', 'viertel', 'zwanzig']
  }
  function randomWord(length) {
    if(length == 0){ return '';}
    var wordArray = words[`${length}`];
    var word = wordArray[Math.floor(Math.random() * wordArray.length)];
    return word;
  }

  function getTwoRundomWordsWithTotalLength(totalLength){
    var firstLength = Math.floor(Math.random() * totalLength);
    var restLength = totalLength - firstLength;
    var prefix = randomWord(firstLength);
    var suffix = randomWord(restLength);
    return prefix + suffix;
  }
  
  function getRandomFilledRow(word, length) {
    var puffer = length - word.length;
    var firstLength = Math.floor(Math.random() * puffer);
    var restLength = length - (word.length + firstLength);
    var prefix = firstLength > 4 ? getTwoRundomWordsWithTotalLength(firstLength) : randomWord(firstLength);
    var suffix = restLength > 4 ? getTwoRundomWordsWithTotalLength(restLength) : randomWord(restLength);
    return [prefix, word, suffix];
  }
  
  async function createWidget() {
    var time = getReadableTime(new Date());

    if (time.length < 3) {
      time.unshift('');
    }
    if (time.length < 4) {
      time.push('uhr');
    }
    console.log(time);
    var filledTimes = time.map((word) => getRandomFilledRow(word, 9));
  
    // Create new empty ListWidget instance
    let listwidget = new ListWidget();
  
    //   // Set new background color
    listwidget.backgroundColor = new Color('#738BB1');
    let gradient = new LinearGradient();
    gradient.colors = [new Color('#44506A'), new Color('#343E52')];
    gradient.locations = [0.6, 1];
    listwidget.backgroundGradient = gradient;
  
    //   // Add widget heading
    filledTimes.forEach((timeRow) => {
      let st1 = listwidget.addStack();
      // st1.spacing = -0.2;
  
      let a = st1.addText(timeRow[0]);
      let b = st1.addText(timeRow[1]);
      let c = st1.addText(timeRow[2]);
  
      a.font = new Font('Menlo-Bold', 22);
      b.font = new Font('Menlo-Bold', 22);
      c.font = new Font('Menlo-Bold', 22);
  
      // a.textColor = new Color('#2E384C');
      // b.textColor = new Color('#12151B');
      // c.textColor = new Color('#2E384C');
      a.textColor = new Color('#697896');
      b.textColor = new Color('#ffffff');
      c.textColor = new Color('#697896');
    });
  
    return listwidget;
  }
  
  let widget = await createWidget();
  
  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentSmall();
  }
  Script.complete();
  