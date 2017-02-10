jQuery(document).ready(function($){

  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;

  if (!SpeechRecognition) {
    update_intro('fail');
    return null;
  }


  window.swears = {};
  window.swears['total'] = 0;

  // configure dollar values
  var minor = 5;
  var major = 10;
  var serious = 20;
  var hang_your_head = 125;

  var kaching = 'audio/cash_register_2.wav';
  // https://github.com/TalAter/annyang

  if (annyang) {

    // commands are parsed in order and the system stops at the first one matched
    window.phrases = {

      'Grab them by the pussy' : hang_your_head,
      'President Trump' : major,
      'Muslim Ban' : major,
      'Steve Bannon' : major,
      'Betsy DeVos' : major,
      'Donald Trump' : minor,
      'Trump' : minor,

      'Equality' : -minor,
      'Rule of Law' : -minor

    }

    // load commands
    for (var property in phrases) {
      if (phrases.hasOwnProperty(property)) {
        add_phrase(property, phrases[property]);
      }
    }


    // debug
    annyang.addCallback('result', function(userSaid, commandText, phrases) {
      console.log(userSaid); // sample output: 'hello'
      console.log(commandText); // sample output: 'hello (there)'
      console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
    });


    annyang.addCallback('start', function() {
      update_intro('listening');
    });

    window.setTimeout ( update_intro, 500 );

    // Start listening.
    annyang.start();
  }

// initialize counter
if ( CountUp ) {

  var easingFn = function (t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
  }

  var options = {
    useEasing : true,
    easingFn : easingFn,
    useGrouping : true,
    separator : ',',
    decimal : '.',
    prefix : '$',
    suffix : ''
  };

  window.swears['counter'] = new CountUp("swears-total", 0, 0, 2, 2, options);
  window.swears.counter.start();
}


function add_phrase (phrase, amount) {
  var command = {};
  command[phrase] = { 'regexp': new RegExp( phrase ),
                      'callback' : function() { add_to_jar ( phrase, amount ) }
                    };
  annyang.addCommands (command);
}


function add_to_jar(phrase, amount) {
  window.swears.total += amount;

  // no negative numbers please
  if ( window.swears.total < 0 ) {
    window.swears.total = 0
  }

  // play ka-ching sound
  var register = new Audio(kaching);
  register.play();

  // update the total and animate it
  if (window.swears.counter) {
    window.swears.counter.update(window.swears.total);
  } else {
    $('#swears-total').html(window.swears.total);
  }

  // show the latest swear and deduction/credits
  if ( amount > 0 ) {
    var amount_text = '<span class="amount">$' + amount + '</span>';
  } else {
    var amount_text = '<span class="amount credit">-$' + amount + '</span>';
  }

  var $message = $('<div class="swear"><span class="phrase">' + phrase + '</span>' + amount_text + '</div>');

  $message.on('webkitAnimationEnd', function() {
    $(this).remove();
  });

  $('#swears').append($message);

  // that is all
}


function update_intro(state) {

  // if this is the initial call, and there's no other element visible, show the intro
  if (typeof state == "undefined") {
    if ( !$('#messages >div:visible').length ) {
        $('#message-initial').fadeIn();
    }
    return;
  }


  $('#messages >div:visible').fadeOut();

  switch (state) {

    case 'fail':
      $('#message-fail').fadeIn();
      break;
    case 'listening':
      $('#message-listening').fadeIn();
      break;
  }
}










}); // end jQuery
