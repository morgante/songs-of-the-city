// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Songs = new Meteor.Collection("songs");

lastfm_api = 'd38cf8df461b96a3a6ef4cb8acc1b9cc';
lastfm_secret = 'b8b8288e69ea9b7bae5be0fb0449f522';

basic_list = {
	'love': {
		
	}
}

function citySearch( emotion, city, cb ) {
	// if( city == 'Paris')
	// cb( 'https://soundcloud.com/to-rome-with-love/sets/to-rome-with-love-soundtrack' );
	
	findPlaylist( 'I ' + emotion + ' ' + city, cb );
}

function findPlaylist( query, cb ) {
	SC.get('/playlists', { q: query, limit: 1 }, function(playlists) {
	  cb( playlists[0].permalink_url );
	});
}

function playPlaylist( playlist, cb ) {
	SC.oEmbed( playlist, { auto_play: true }, function(oEmbed) {
		cb( oEmbed );
	});
}

if (Meteor.isClient) {
	
	Template.playlist.songs = function() {
		return Songs.find({});
	}
	
	$(document).ready( function() {
		SC.initialize({
	    client_id: "55f24606d1da07028a80594aa2418c7e",
	    redirect_uri: "http://localhost:3000",
	  });		
	});
	
	
	
  /* Create a LastFM object */
	// var lastfm = new LastFM({
	// 	apiKey    : 'f21088bf9097b49ad4e7f487abab981e',
	// 	apiSecret : '7ccaec2093e33cded282ec7bc81c6fca',
	// 	cache     : cache
	// });

	// /* Load some artist info. */
	// lastfm.artist.getInfo({artist: 'The xx'}, {success: function(data){
	// 	/* Use data. */
	// }, error: function(code, message){
	// 	/* Show error message. */
	// }});
	
	Template.prompt.events({
		'keyup #city, keydown #city, focusout #city': function (evt) {
	    if (evt.type === "keyup" && evt.which === 13 || evt.type === "focusout") {
	      	
				$('#prompt').fadeOut();
				$('#playlist').fadeIn();
				
				citySearch( $('#verb').val(), $('#city').val(), function( playlist ) {
					playPlaylist( playlist, function( oEmbed ) {
						$('#player').html( oEmbed.html );
					})
				});
	    }
	  }
		
	});
	
	// var okcancel_events = function (selector) {
	//   return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
	// };
	// 
	// // Creates an event handler for interpreting "escape", "return", and "blur"
	// // on a text field and calling "ok" or "cancel" callbacks.
	// var make_okcancel_handler = function (options) {
	//   var ok = options.ok || function () {};
	//   var cancel = options.cancel || function () {};
	// 
	//   return function (evt) {
	//     if (evt.type === "keydown" && evt.which === 27) {
	//       // escape = cancel
	//       cancel.call(this, evt);
	// 
	//     } else if (evt.type === "keyup" && evt.which === 13 ||
	//                evt.type === "focusout") {
	//       // blur/return/enter = ok/submit if non-empty
	//       var value = String(evt.target.value || "");
	//       if (value)
	//         ok.call(this, value, evt);
	//       else
	//         cancel.call(this, evt);
	//     }
	//   };
	// };

  // Template.leaderboard.events({
  //   'click input.inc': function () {
  //     Players.update(Session.get("selected_player"), {$inc: {score: 5}});
  //   }
  // });
  // 
  // Template.player.events({
  //   'click': function () {
  //     Session.set("selected_player", this._id);
  //   }
  // });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  // Meteor.startup(function () {
  //   if (Players.find().count() === 0) {
  //     var names = ["Ada Lovelace",
  //                  "Grace Hopper",
  //                  "Marie Curie",
  //                  "Carl Friedrich Gauss",
  //                  "Nikola Tesla",
  //                  "Claude Shannon"];
  //     for (var i = 0; i < names.length; i++)
  //       Players.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
  //   }
  // });
}
