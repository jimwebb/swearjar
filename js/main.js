jQuery(document).ready(function($){

  // if nothing happens immediately, display the intro text
  window.setTimeout ( update_intro, 500 );


  // Check for speech recognition capability
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;

  if (!SpeechRecognition) {
    update_intro('fail');
    return null;
  }

  // ----------- CONFIGURATION ------------

  // configure dollar values
  var minor = 5;
  var major = 10;
  var serious = 20;
  var hang_your_head = 125;

  var kaching = 'audio/cash_register_2.wav';
  // https://github.com/TalAter/annyang

  // commands are parsed in order and the system stops at the first one matched
  var phrases = {

    'Grab them by the pussy' : hang_your_head,
    'President Trump' : major,
    'Muslim Ban' : serious,
    'Sean Spicer' : major,
    'Make America Great Again' : serious,
    'Steve Bannon' : major,
    'Betsy DeVos' : major,
    'Donald Trump' : minor,
    'Michael Flynn' : minor,
    'Mike Pence' : minor,
    'Kellyanne Conway' : minor,
    'Kelly Ann Conway' : minor,
    'Ivanka Trump' : minor,
    'Jeff Sessions' : minor, 
    'See You In Court' : minor,
    'Bad Dude' : minor,
    'Bad Hombre' : minor,
    'Nasty Woman' : major,
    'Bigly' : minor,
    'Fake News' : minor,

    'Elizabeth Warren' : -major,
    'Equality' : -minor,
    'Rule of Law' : -minor,
    'Rule of Law' : -minor,
    'Fuck Trump' : -minor,

    'Trump' : minor
  }

  window.swears = {};
  window.swears['total'] = 0;
  window.swears['count'] = 0;

  if (annyang) {

    // load commands
    for (var property in phrases) {
      if (phrases.hasOwnProperty(property)) {
        add_phrase(property, phrases[property]);
      }
    }

    // debug
    annyang.addCallback('result', function(userSaid, commandText, phrases) {
      console.log(userSaid); // sample output: 'hello'
    });

    annyang.addCallback('start', function() {
      update_intro('listening');
    });

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
  window.swears.count++;


  // no negative numbers please
  if ( window.swears.total < 0 ) {
    window.swears.total = 0
  }

  // show donate buttons if we have something to donate
  if ( window.swears.count > 2 || window.swears.total > 10 ) {
    $('#donate-buttons').removeClass('hidden');
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

// set up donation buttons; they're weird
$('a.button.donate').on('click', function(e) {
  var $this = $(this);

  var qs_append = $this.data('append');
  var qs_amt = $this.data('amount');

  if (qs_amt) {
    e.preventDefault();
  }

  var url = $this.prop('href') + qs_append + qs_amt + "=" + window.swears.total;
  location.href = url;
});





}); // end jQuery
