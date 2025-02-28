const wordInput = document.getElementById("word");
const defineBtn = document.getElementById("get-def");
const defsContainer = document.getElementById("defs");

// Retrieves the text input, prepares it and fetches the definition
const getDefinition = async () => {
   try {
      const word = wordInput.value.toLowerCase().trim();

      // Checks if the input is empty ("")
      if (!word) throw new Error("Please enter a word to get its definition.");

      // Fetches the definition from the API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      // Checks if the request was successful
      if (!response.ok) {
         throw new Error(`Could not get definition (status code: ${response.status})`);
      } else {
         const data = await response.json();

         printDefinitions(data);
         resetInput();
      }
   } catch (error) {
      defsContainer.innerText = error;
   }
};

// Clears previous definitions and error messages
const clearDefinitions = () => {
   let pDel = defsContainer.querySelectorAll("p");

   for (let i = 0; i < pDel.length; i++) { pDel[i].remove(); }

   /* // Alt common pattern used to delete all of the contents of a DOM element. Must check
   while (defsContainer.firstChild) { defsContainer.removeChild(defsContainer.firstChild); } */

   defsContainer.innerText = "";
};

// Resets the input field
const resetInput = () => {
   wordInput.value = "";
   wordInput.focus();
};

// Prints the definitions in the DOM
function printDefinitions(data) {
   clearDefinitions();

   // Creates an <h3> and prints the searched word
   const searchedWord = document.createElement("h3");
   searchedWord.innerText = data[0].word;
   searchedWord.style.cssText = `
      text-align: left;
      text-transform: capitalize;
      color: goldenrod;
      font-size: max(2.3vw, 1.9rem);
      letter-spacing: 0.2px;
   `;
   // searchedWord.style.textAlign = "left";
   // searchedWord.style.textTransform = "capitalize";
   // searchedWord.style.color = "goldenrod";
   // searchedWord.style.fontSize = "max(2.3vw, 1.9rem)";
   // searchedWord.style.letterSpacing = "0.2px";
   defsContainer.appendChild(searchedWord);

   // Loops through the definitions
   for (let m = 0; m < data[0].meanings.length; m++) {
      for (let d = 0; d < data[0].meanings[m].definitions.length; d++) {
         // Displays origin if available and if it's the first definition
         if (m === 0 && d === 0 && data[0].origin !== undefined) {
            let originP = document.createElement("p");
            defsContainer.appendChild(originP);
            // originP.style.fontSize = "larger";
            originP.innerText = "Origin: " + data[0].origin;
         }

         // Displays synonyms and antonyms
         if (d === 0) {
            let pSynAnt = document.createElement("p");
            defsContainer.appendChild(pSynAnt);
            pSynAnt.classList.add('syn-ant');
            pSynAnt.innerText += "Synonyms: " + data[0].meanings[m].synonyms.join(', ') + "\nAntonyms: " + data[0].meanings[m].antonyms.join(', ');
         }

         // Displays definitions
         const listItem = document.createElement("li");
         defsContainer.appendChild(listItem);
         listItem.innerHTML += "<small>[" + data[0].meanings[m].partOfSpeech + "]</small> " + data[0].meanings[m].definitions[d].definition + "<br />";
         // Adds example if available
         if (data[0].meanings[m].definitions[d].example !== undefined) {
            listItem.innerHTML += "<small>e.g., <i>\"" + data[0].meanings[m].definitions[d].example + "\"</i>";
         }
      }
   }
}

// Event listeners for "DEFINE" button click and Enter key press
defineBtn.addEventListener("click", getDefinition);
wordInput.addEventListener("keydown", (e) => {
   if (e.key === "Enter") getDefinition();
});