// DOM elements
const wordInput = document.getElementById("word");
const defineBtn = document.getElementById("get-def");
const defsContainer = document.getElementById("defs");

// Retrieve the text input, prepare it and fetch the definition
const getDefinition = async () => {
  clearDefinitions();

  try {
    const word = wordInput.value.toLowerCase().trim();

    // Check if the input is empty ("")
    if (!word) throw new Error("Please enter a word to get its definition.");

    // Fetch the definition from the API
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    // Check if the request was successful
    if (!response.ok) {
      switch (response.status) {
        case 404: {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        // break;
        default:
          throw new Error(
            `Could not get definition (status code: ${response.status})`
          );
        // break;
      }
    }

    const data = await response.json();

    printDefinitions(data);
    resetInput();
  } catch (error) {
    displayError(error.message);
  }
};

// Clear previous definitions and error messages
const clearDefinitions = () => {
  defsContainer.innerHTML = "";
};

// Print error message
const displayError = (errorMessage) => {
  const pError = document.createElement("p");
  pError.innerText = errorMessage;
  defsContainer.appendChild(pError);
};

// Reset the input field
const resetInput = () => {
  wordInput.value = "";
  wordInput.focus();
};

// Print the definitions in the DOM
const printDefinitions = (data) => {
  // Create an <h3> and print the searched word
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

  // Loop through the definitions
  data[0].meanings.forEach((meaning, index) => {
    // Display origin if available and if it's the first definition
    if (index === 0 && data[0].origin) {
      const originP = document.createElement("p");
      // originP.style.fontSize = "larger";
      originP.innerText = `Origin: ${data[0].origin}`;
      defsContainer.appendChild(originP);
    }

    // Display synonyms and antonyms
    const pSynAnt = document.createElement("p");
    pSynAnt.classList.add("syn-ant");

    const synonyms = meaning.synonyms.join(", ");
    const antonyms = meaning.antonyms.join(", ");
    pSynAnt.innerText = `Synonyms: ${synonyms}\nAntonyms: ${antonyms}`;

    defsContainer.appendChild(pSynAnt);

    // Display definitions
    meaning.definitions.forEach((definition) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
        <small>[${meaning.partOfSpeech}]</small> ${definition.definition}
      `.trim();

      // Add example if available
      if (definition.example) {
        listItem.innerHTML += `
          <br /><small>e.g., <q>${definition.example}</q></small>
        `.trim();
      }

      defsContainer.appendChild(listItem);
    });
  });
};

/* Event listeners for "DEFINE" button and input field */

defineBtn.addEventListener("click", getDefinition);

wordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") getDefinition();
});
