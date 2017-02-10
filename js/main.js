jQuery(document).ready(function($){

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
      'Steve Bannon' : major,
      'Trump' : minor
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

    // Start listening.
    annyang.start();
  }


function add_phrase (phrase, amount) {
  var command = {};
  command[phrase] = { 'regexp': new RegExp( phrase ),
                      'callback' : function() { add_to_jar ( phrase, amount ) }
                    };
  annyang.addCommands (command);
}

function add_to_jar(phrase, amount) {
  console.log('adding', phrase, amount);
  window.swears.total += amount;
  update_jar(phrase, amount);
}


function update_jar(phrase, amount) {

  // play ka-ching!

  var register = new Audio(kaching);
  register.play();

  // update the total
  $('#swears-total').html(window.swears.total);

  // show the latest swear
  $('#messages').append('<div class="message"><span class="phrase">' + phrase + '</span><span class=:"amount">+$' + amount + '</span></div>');
}


}); // end jQuery
