$(document).ready(function () {

	var theorists = new Array(4);
	theorists[0] = new Theorist ('Horkheimer', 'horkheimer.jpg', 120, 16, 23);
	theorists[1] = new Theorist ('Adorno', 'adorno.jpg', 130, 18, 24);
	theorists[2] = new Theorist ('Marcuse', 'marcuse.jpg', 140, 20, 35);
	theorists[3] = new Theorist ('Habermas', 'habermas.jpg', 150, 22, 59);

	var hitpoints = [120, 130, 140, 150];

	var player = -1;
	var opponent = -1;
	var defeatedRow = new Array;  // Array of defeated opponents
	var roundOver = false;
	var numWins = 0;

	function Theorist(name, image, health, attack, counter) {
		this.name = name;
		this.image = image;
		this.health = health;
		this.attack = attack;
		this.counter = counter;
		this.status = 'available';
	}

	//fade in header
	$(':header').hide().fadeIn(1500);
	$('#action').hide().fadeIn(1500);

	function showTheoristPool() {
		$('#theorists').empty();
		for (ctr = 0; ctr < theorists.length; ctr++) {
			// Check to see if they have been selected to play first
			// Will also need to check if they have been eliminated
			if (theorists[ctr].status == 'available') {
				var $newTheorist = $('<div>')
					.addClass('theorist col-sm-3')
					.attr('theorist-id', ctr)
					.html('<span class="name">'+ theorists[ctr].name + '</span><img src="assets/images/'+ theorists[ctr].image +'"><span class="points">Health:'+ theorists[ctr].health + '</span>');
					//$newTheorist.on('click', selectTheorist(ctr));
				$('#theorists').append($newTheorist);				
			}
		}
		$('.theorist').on('click', function() {
			selectTheorist(this.getAttribute('theorist-id'));
		});
	}

	function showPlayer(index) {
		var $newPlayer = $('<div>')
			.addClass(' player col-sm-offset-1 col-sm-3 ')
			.html('<span class="name">'+ theorists[index].name + ' (' + theorists[index].health + ')</span><img src="assets/images/'+ theorists[index].image +'"><span class="points">'+ 'Attack ' + theorists[index].attack + ' | Counter ' +  + theorists[index].counter +'</span>');
		$('#player').html($newPlayer);
		$('#player-header').html('Player');
		$('#versus').html('<img src="assets/images/vs3.png">');
	}

	function showOpponent(index) {
		var $newOpponent = $('<div>')
			.addClass('opponent col-sm-offset-1 col-sm-3 ')
			.html('<span class="name">'+ theorists[index].name + ' (' + theorists[index].health + ')</span><img src="assets/images/'+ theorists[index].image +'"><span class="points">'+ 'Attack ' + theorists[index].attack + ' | Counter ' +  + theorists[index].counter +'</span>');
		$('#opponent').html($newOpponent);
		$('#opponent-header').html('Opponent');
		$('#versus').html('<img src="assets/images/lectern.jpg"><h3>Click the lectern to debate!<h3>');
	}

	function debate() {
		theorists[opponent].health = theorists[opponent].health	- theorists[player].attack;
		theorists[player].health = theorists[player].health	- theorists[opponent].counter;		
		if (theorists[opponent].health < 1) {
			// Round over, player wins
			theorists[opponent].health = 0;
			theorists[opponent].status = 'lost';
			nextRound();
		} else if (theorists[player].health < 1) {
			// Round over, opponent wins
			theorists[player].health = 0;
			gameOver();
		}
		theorists[player].attack = theorists[player].attack + 5;
		refreshDisplay();
	}

	function nextRound() {
		defeatedRow.push(opponent);
		numWins++;
		if (numWins > 2) {
			playerWins();
		}
		opponent = -1;
		theorists[player].health = hitpoints[player];
		$('#opponent').empty();		
		refreshDisplay();
		$('#lost').empty();
		showDefeatedRow();		
	}

	function gameOver() {
		$('#debate').html("<h2>Game Over<h2>" + '<button type="button" button class="btn btn-danger" onClick="window.location.reload()">reset</button>');
	}

	function playerWins() {
		$('#debate').html('<h2>You win, and we all win when we use deliberation in the pursuit of truth and justice!<span class="name">'+ theorists[player].name + '</span><img src="assets/images/'+ theorists[player].image +'"><span class="points"> </span><button type="button" button class="btn btn-danger" onClick="window.location.reload()">reset</button></h2>');
	}


	function refreshDisplay () {
		showTheoristPool();
		if (player != -1) {
			showPlayer(player);
			if (defeatedRow.length > 1) {
				$('#action').html("Final debate");			
			} else if (defeatedRow.length > 0) {
				$('#action').html("Select your next opponent");			
			} else {
				$('#action').html("Select your opponent");			
			}
		}
		if (opponent != -1) {
			showOpponent(opponent);
			if (defeatedRow.length < 2) {
				// Don't show this for the final debate
				$('#action').html("Choose another opponent!");	
			}
		}
	}
	function showDefeatedRow() {
		for (ctr = 0; ctr < theorists.length; ctr++) {
			$('#lost').empty;
				if (theorists[ctr].status == 'lost') {
					var $lostTheorist = $('<div>')
						.addClass('lostTheorist col-sm-3 ')
						.html('<span class="name">'+ theorists[ctr].name + '</span><img src="assets/images/'+ theorists[ctr].image +'"><span> </span>');
					$('#lost').append($lostTheorist);
				}
		}
		$("#defeated").hide();
	}	

	function selectTheorist(index) {
		if (player === -1 && opponent === -1 ) {
			// Nothing selected so this is the player
			player = index;
			theorists[player].status = 'player';
		} else if (opponent === -1) {
			// player already picked, so pick the opponent
			opponent = index;
			theorists[opponent].status = 'opponent';			
		}
		refreshDisplay();
	}

	$('#versus').on('click', function () {
		if (player > -1 && opponent > -1) {
			debate();
		}
	});

	showTheoristPool();

});