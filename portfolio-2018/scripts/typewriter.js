//Takes an array of strings as a parameter, we have a default one set if no array is specified

//Takes the id of the DOM element where you want the typed text to appear.
//default is #twe-typed-text

//requires css stylesheet typewriter.css to be called for cursor blinking to work, cursor needs to have class "cursor"

var typeWriterEffect = function(textArray = ["Clean, hand-written code.", "Creative ideas.", "Beautiful design.", "User-friendly interface."], domelement = "twe-typed-text", repeat = true) {

	let textInputField = document.getElementById(domelement);
	let textInput = "";
	let arrayPosition = 0;
	let currentLetter;
	let originalString;


	function changeArray(){
		(function chooseText() {
			originalString = textArray[arrayPosition];
			textInput = originalString + "             "; //space adds pause at the end and gives cursor time to blink
		}());
		(function moveArrayPosition() {
			if (arrayPosition < textArray.length - 1) {
				arrayPosition++;
			}
			else {
				arrayPosition = 0;
			}
		}());
		direction = "forwards";
	};

	let stringArrayPosition = 0;
	let typedText = [];
	let direction = "forwards";
	let cursor = document.getElementById("cursor");

	changeArray();
	function typeString() {
		if(typedText.length >= originalString.length) {
			cursor.classList.add("cursor");
		}
		else {
			cursor.classList.remove("cursor");
		}
		let stringArray = textInput.split("");

		(function chooseLetter() {
			currentLetter = stringArray[stringArrayPosition];
		}());

		(function typeLetter() {
			if(direction === "forwards"){
				typedText.push(currentLetter);
				textInputField.textContent = typedText.join("");
				stringArrayPosition++;
				if(stringArrayPosition < textInput.length) {
					direction = "forwards";
				}
				else{
					if (repeat == false) {
						return;
					}
					else {
						direction = "backwards";
				}
			}
			}
			else {
				if(stringArrayPosition > 0) {
					typedText.pop();
					textInputField.textContent = typedText.join("");
					stringArrayPosition--;
				}
				else {
					changeArray();
				}
			}

		}());
	}

	setInterval(typeString, 50);

};
