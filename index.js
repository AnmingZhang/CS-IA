//update the score in sessionStorage
function updateScore(game, score) {
    let scores = JSON.parse(sessionStorage.getItem('scores')) || {};

    if (!scores[game]) {
        scores[game] = [];
    }
    scores[game].push(score); 
    sessionStorage.setItem('scores', JSON.stringify(scores)); 
}

//display scores on the homepage
function displayScores() {
    let scores = JSON.parse(sessionStorage.getItem('scores')) || {};

    // Display the scores on the page
    document.getElementById('2048-scores').textContent = scores['2048'] ? scores['2048'].join(', ') : 'No scores yet';
    document.getElementById('minesweeper-scores').textContent = scores['minesweeper'] ? scores['minesweeper'].join(', ') : 'No scores yet';
    document.getElementById('clicker-scores').textContent = scores['clicker'] ? scores['clicker'].join(', ') : 'No scores yet';
}

//clear all scores
function clearScores() {
    sessionStorage.removeItem('scores'); 
    displayScores(); 
}

//use `pageshow` to ensure scores are loaded even when navigating back
window.addEventListener('pageshow', function(event) {
    if (event.persisted || document.readyState === 'complete') {
        displayScores();
    }
});
