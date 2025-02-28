const wordInput = document.getElementById("word");
const defineBtn = document.getElementById("get-def");
const defsContainer = document.getElementById("defs");

// Retrieves the text input, prepares it and fetches the definition
const getDefinition = async () => {
   clearDefinitions();
   
   try {
      const word = wordInput.value.toLowerCase().trim();

      // Checks if the input is empty ("")
      if (!word) throw new Error("Please enter a word to get its definition.");

      // Fetches the definition from the API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      // Checks if the request was successful
      if (!response.ok) {
         switch (response.status) {
            case 404:
               const errorData = await response.json();
               throw new Error(errorData.message);
               break;
            default:
               throw new Error(`Could not get definition (status code: ${response.status})`);
               break;
         }
      }

      const data = await response.json();

      printDefinitions(data);
      resetInput();
   } catch (error) {
      displayError(error.message);
   }
};

// Clears previous definitions and error messages
const clearDefinitions = () => {
   defsContainer.innerHTML = "";
};

// Prints error message
const displayError = (errorMessage) => {
   const pError = document.createElement("p");
   pError.innerText = errorMessage;
   defsContainer.appendChild(pError);
};

// Resets the input field
const resetInput = () => {
   wordInput.value = "";
   wordInput.focus();
};

// Prints the definitions in the DOM
const printDefinitions = (data) => {
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
            const originP = document.createElement("p");
            // originP.style.fontSize = "larger";
            originP.innerText = `Origin: ${data[0].origin}`;
            defsContainer.appendChild(originP);
         }

         // Displays synonyms and antonyms
         if (d === 0) {
            const pSynAnt = document.createElement("p");
            pSynAnt.classList.add('syn-ant');
            pSynAnt.innerText = `Synonyms: ${data[0].meanings[m].synonyms.join(', ')}\nAntonyms: ${data[0].meanings[m].antonyms.join(', ')}`;
            defsContainer.appendChild(pSynAnt);
         }

         // Displays definitions
         const listItem = document.createElement("li");
         listItem.innerHTML = `<small>[${data[0].meanings[m].partOfSpeech}]</small> ${data[0].meanings[m].definitions[d].definition}<br />`;
         // Adds example if available
         if (data[0].meanings[m].definitions[d].example !== undefined) {
            listItem.innerHTML += `<small>e.g., <i>"${data[0].meanings[m].definitions[d].example}"</i></small>`;
         }
         defsContainer.appendChild(listItem);
      }
   }
}

// Event listeners for "DEFINE" button and input field
defineBtn.addEventListener("click", getDefinition);

wordInput.addEventListener("keydown", (e) => {
   if (e.key === "Enter") getDefinition();
});