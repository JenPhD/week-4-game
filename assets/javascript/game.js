$( document ).ready(function(){

	//click event to pick a theorist
	var theorist = new Array(4);
	theorist[0] = new Theorist ('Horkheimer', 'horkheimer.jpg', 120, 16, 23);
	theorist[1] = new Theorist ('Adorno', 'adorno.jpg', 130, 18, 24);
	theorist[2] = new Theorist ('Marcuse', 'marcuse.jpg', 140, 20, 35);
	theorist[3] = new Theorist ('Habermas', 'habermas.jpg', 150, 22, 59);

	var hitpoints = [120, 130, 140, 150];

	var player = -1;
	var opponent = -1;
	var defeatedArray = new Array;  // Array of defeated opponents
	var roundOver = false;
	var numWins = 0;

	function Theorist(name, image, health, attack, counter) {
		this.name = 'name';
		this.image = 'image';
		this.health = 'health';
		this.attack = 'attack';
		this.counter = 'counter';
		this.status = 'available';
	}

	function showTheoristPool() {
		//$('#theorist').empty();
		var ctr;
		for (ctr = 0; ctr < theorist.length; ctr++) {
			// Check to see if they have been selected to play first
			// Will also need to check if they have been eliminated
			if (theorist[ctr].status == 'opponent') {
				var $newTheorist = $('<div>')
					//.addClass('theorist col-sm-3')
					.attr('theorist-id', ctr)
					.html('<span class="name">'+ theorist[ctr].name + '</span><img src="../assets/images/'+ theorist[ctr].image +'"><span class="points">('+ theorist[ctr].health + ')</span>');
					// $newTheorist.on('click', selectTheorist(ctr));
				$('#theorist').append($newTheorist);				
			}
		}
		$('.theorist').on('click', function() {
			selectTheorist(this.getAttribute('theorist-id'));
		});
	}

	function showPlayer(index) {
		var $newPlayer = $('<div>')
			.addClass(' player col-sm-offset-1 col-sm-3 ')
			.html('<span class="name">'+ theorist[index].name + ' (' + theorist[index].health + ')</span><img src="../assets/images/'+ theorist[index].image +'"><span class="points">'+ 'Attack ' + theorist[index].attack + ' | Counter ' +  + theorist[index].counter +'</span>');
		$('#player').html($newPlayer);
		$('#player-header').html('Player');
		$('#versus').html('<img src="..assets/images/vs.png">');
	}

	function showOpponent(index) {
		var $newOpponent = $('<div>')
			.addClass('opponent col-sm-offset-1 col-sm-3 ')
			.html('<span class="name">'+ theorist[index].name + ' (' + theorist[index].health + ')</span><img src="../assets/images/'+ theorist[index].image +'"><span class="points">'+ 'Attack ' + theorist[index].attack + ' | Counter ' +  + theorist[index].counter +'</span>');
		$('#opponent').html($newOpponent);
		$('#opponent-header').html('Opponent');
		$('#versus').html('<img src="../assets/images/#.png"><h3>Communicative Action!<h3>');
	}
	function battle() {
		theorist[opponent].health = theorist[opponent].health	- theorist[player].attack;
		theorist[player].health = theorist[player].health	- theorist[opponent].counter;		
		if (theorist[opponent].health < 1) {
			// Round over, player wins
			theorist[opponent].health = 0;
			theorist[opponent].status = 'lost';
			nextRound();
		} else if (theorist[player].health < 1) {
			// Round over, opponent wins
			theorist[player].health = 0;
			gameOver();
		}
		theorist[player].attack = theorist[player].attack + 5;
		refreshDisplay();
	}

	function nextRound() {
		defeatedArray.push(opponent);
		numWins++;
		if (numWins > 2) {
			playerWins();
		}
		opponent = -1;
		theorist[player].health = hitpoints[player];
		$('#opponent').empty();		
		refreshDisplay();
		$('#lost').empty();
		showDefeatedArray();		
	}
	function gameOver() {
		$('#battle').html("<h2>Game Over!<h2>");
	}
	function playerWins() {
		$('#battle').html('<h2>You win! Now go read something!<span class="name">'+ theorist[player].name + '</span><img src="assets/images/'+ theorist[player].image +'"><span class="points"> </span></h2>');
	}
	function refreshDisplay () {
		showTheoristPool();
		if (player != -1) {
			showPlayer(player);
			if (defeatedArray.length > 1) {
				$('#action').html("Final battle");			
			} else if (defeatedArray.length > 0) {
				$('#action').html("Select your next opponent");			
			} else {
				$('#action').html("Select your opponent");			
			}
		}
		if (opponent != -1) {
			showOpponent(opponent);
			if (defeatedArray.length < 2) {
				// Don't show this for the final battle
				$('#action').html("Start your engines!");	
			}
		}
	}
	function showDefeatedArray() {
		for (ctr = 0; ctr < theorist.length; ctr++) {
			$('#lost').empty;
				if (theorist[ctr].status == 'lost') {
					var $lostTheorist = $('<div>')
						.addClass('lostTheorist col-sm-3 ')
						.html('<span class="name">'+ theorist[ctr].name + '</span><img src="assets/images/'+ theorist[ctr].image +'"><span> </span>');
					$('#lost').append($lostTheorist);	
				}
		}
	}
	function selectTheorist(index) {
		if (player === -1 && opponent === -1 ) {
			// Nothing selected so this is the player
			player = index;
			theorist[player].status = 'player';
		} else if (opponent === -1) {
			// player already picked, so pick the opponent
			opponent = index;
			theorist[opponent].status = 'opponent';			
		}
		refreshDisplay();
	}

	$('#versus').on('click', function () {
		if (player > -1 && opponent > -1) {
			battle();
		}
	});

	showTheoristPool();

});