var backgroundColor1 = '#44506A';
var backgroundColor2 = '#343E52';
var primaryTextColor = '#FFFFFF';
var secondaryTextColor = '#697896';
var font = 'Menlo-Bold';
var fontSize = 22;
var charactersInRow = 9;

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
var words = {
    '1': 'abcdefghklmnrstv',
    '2': ['an', 'in', 'ne', 'so', 'es', 'ja', 'on', 'si', 'de', 'ko', 'er'],
    '3': ['der', 'vor', 'uhr', 'los', 'min', 'mit', 'ton', 'tag', 'elf', 'vor', 'für', 'ist'],
    '4': ['zeit', 'nach', 'auto', 'plan', 'zone', 'acht', 'drei', 'eins', 'fünf', 'halb', 'nach', 'neun', 'vier', 'zehn', 'zwei'],
    '5': ['neben', 'diese', 'abend', 'druck', 'punkt', 'reise', 'nacht', 'punkt', 'sechs', 'zwölf'],
    '6': ['ablauf', 'angabe', 'gefühl', 'minute', 'mittag', 'nehmen', 'planer', 'raffer', 'stunde', 'anzeige', 'sieben'],
    '7': ['schrift', 'sekunde', 'sekunde', 'stempel', 'uhrwerk', 'verlauf', 'schalter', 'lesbar', 'viertel', 'zwanzig']
}

function getReadableTime(now) {
    var fifthMinutes = Number.parseInt(now.getMinutes() / 5);

    var currentHour = now.getHours();
    if (now.getMinutes() > 25) {
        currentHour = currentHour + 1;
    }
    if (currentHour > 12) {
        currentHour = currentHour - 12;
    }

    var readableHour = hours[currentHour];
    var readableMinutes = minutes[fifthMinutes];
    var words = (readableMinutes + ' ' + readableHour).split(' ');
    return words;
}

function randomWord(length) {
    if (length == 0) { return ''; }
    var wordArray = words[`${length}`];
    var word = wordArray[Math.floor(Math.random() * wordArray.length)];
    return word;
}

function getTwoRundomWordsWithTotalLength(totalLength) {
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
    var prefix = firstLength > 5 ? getTwoRundomWordsWithTotalLength(firstLength) : randomWord(firstLength);
    var suffix = restLength > 5 ? getTwoRundomWordsWithTotalLength(restLength) : randomWord(restLength);
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
    var filledTimes = time.map((word) => getRandomFilledRow(word, charactersInRow));

    // Create new empty ListWidget instance
    let listwidget = new ListWidget();

    // Set new background color
    listwidget.backgroundColor = new Color(backgroundColor1);
    let gradient = new LinearGradient();
    gradient.colors = [new Color(backgroundColor1), new Color(backgroundColor2)];
    gradient.locations = [0.6, 1];
    listwidget.backgroundGradient = gradient;

    // Add widget heading
    filledTimes.forEach((timeRow) => {
        let st1 = listwidget.addStack();

        let a = st1.addText(timeRow[0]);
        let b = st1.addText(timeRow[1]);
        let c = st1.addText(timeRow[2]);

        a.font = new Font(font, fontSize);
        b.font = new Font(font, fontSize);
        c.font = new Font(font, fontSize);

        a.textColor = new Color(secondaryTextColor);
        b.textColor = new Color(primaryTextColor);
        c.textColor = new Color(secondaryTextColor);
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
