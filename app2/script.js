let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0 };

function makeMove(index) {
    if (board[index] === "" && !checkWinner()) {
        board[index] = currentPlayer;
        document.getElementById("board").children[index].innerText =
            currentPlayer;

        if (checkWinner()) {
            scores[currentPlayer]++;
            saveScoresToLocalStorage();
            setTimeout(() => {
                // Using SweetAlert for win alert
                Swal.fire({
                    title: `Player ${currentPlayer} wins!`,
                    icon: "success",
                    confirmButtonText: "Play Again",
                    customClass: {
                        popup: "custom-swal-popup",
                        title: "custom-swal-title",
                        confirmButton: "custom-swal-confirm",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        restartGame();
                    }
                });
            }, 100);
        } else if (board.every((cell) => cell !== "")) {
            setTimeout(() => {
                Swal.fire({
                    title: "It's a draw!",
                    icon: "error",
                    confirmButtonText: "Play Again",
                    customClass: {
                        popup: "custom-swal-popup",
                        title: "custom-swal-title",
                        confirmButton: "custom-swal-confirm",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        restartGame();
                    }
                });
            }, 100);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateCurrentPlayerDisplay();
        }
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winPatterns.some((pattern) => {
        const [a, b, c] = pattern;
        return (
            board[a] !== "" && board[a] === board[b] && board[b] === board[c]
        );
    });
}

function restartGame() {
    window.location.reload();
}

function saveScoresToLocalStorage() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

function loadScoresFromLocalStorage() {
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
        scores = JSON.parse(storedScores);
        updateScoreLabels();
    }
}

loadScoresFromLocalStorage();

function updateScoreLabels() {
    var xLabel = document.getElementById("x");
    var oLabel = document.getElementById("o");

    if (xLabel && oLabel) {
        xLabel.innerText = `${scores["X"] || 0}`;
        oLabel.innerText = `${scores["O"] || 0}`;
    }
}

function resetScore() {
    scores = { X: 0, O: 0 };
    saveScoresToLocalStorage();
    updateScoreLabels();
}

function updateCurrentPlayerDisplay() {
    var currentPlayerLabel = document.getElementById("currentPlayer");
    if (currentPlayerLabel) {
        currentPlayerLabel.innerText = `Current Player: ${currentPlayer}`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const lightButton = document.querySelector(".theme.light");
    const darkButton = document.querySelector(".theme.dark");

    // Function to update UI based on theme
    function updateThemeUI(theme) {
        if (theme === "light") {
            body.classList.add("light-mode");
            lightButton.style.display = "none";
            darkButton.style.display = "inline-block";
        } else {
            body.classList.remove("light-mode");
            lightButton.style.display = "inline-block";
            darkButton.style.display = "none";
        }
    }

    // Check for saved theme in localStorage and apply it
    const savedTheme = localStorage.getItem("theme") || "dark";
    updateThemeUI(savedTheme);

    lightButton.addEventListener("click", function () {
        localStorage.setItem("theme", "light");
        updateThemeUI("light");
    });

    darkButton.addEventListener("click", function () {
        localStorage.setItem("theme", "dark");
        updateThemeUI("dark");
    });

    // Modify SweetAlert to match the theme dynamically
    function updateSweetAlertTheme() {
        const swalStyles = document.querySelector(".swal2-popup");
        if (swalStyles) {
            if (body.classList.contains("light-mode")) {
                swalStyles.style.backgroundColor = "#fff";
                swalStyles.style.color = "#000";
            } else {
                swalStyles.style.backgroundColor = "#202020";
                swalStyles.style.color = "#fff";
            }
        }
    }

    // Observe changes in the body class to dynamically update SweetAlert popups
    const observer = new MutationObserver(updateSweetAlertTheme);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
});
