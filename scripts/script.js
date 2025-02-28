const word = document.getElementById("word");
const defineBtn = document.getElementById("get-def");
const defs = document.getElementById("defs");

const getDefinition = async () => {
   try {
      const w = word.value.toLowerCase().trim();
      // console.log(w);

      if (w === "") { throw new Error("Please enter a word to get its definition."); }

      // const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/Asynchronous`); // for testing
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`);

      if (!response.ok) {
         throw new Error(`Could not get definition (status code: ${response.status})`);
      } else {
         const data = await response.json();

         printDefs(data);

         word.value = "";
         word.focus();
      }
   } catch (error) {
      defs.innerText = error;
      // console.error(error);
   }
};

const clearDefs = () => {
   // Removes <p> elements inside defs and error message if exist
   let pDel = defs.querySelectorAll("p");

   for (let i = 0; i < pDel.length; i++) { pDel[i].remove(); }

   /* // Alt common pattern used to delete all of the contents of a DOM element. Must check
   while (defs.firstChild) { defs.removeChild(defs.firstChild); } */

   defs.innerText = "";
};

function printDefs(data) {
   clearDefs();

   // Creates an <h3> to print the searched word
   let searchedWord = document.createElement("h3");
   defs.appendChild(searchedWord);
   searchedWord.style.margin = "0";
   searchedWord.style.color = "goldenrod";
   searchedWord.style.textAlign = "left";
   searchedWord.style.textTransform = "capitalize";
   searchedWord.style.fontSize = "max(2.3vw, 1.9rem)";
   searchedWord.style.letterSpacing = "0.1px";
   searchedWord.innerText = data[0].word;

   // Creates a <p> for each definition
   for (let m = 0; m < data[0].meanings.length; m++) {
      for (let d = 0; d < data[0].meanings[m].definitions.length; d++) {
         if (m === 0 && d === 0 && data[0].origin !== undefined) {
            let originP = document.createElement("p");
            defs.appendChild(originP);
            // originP.style.fontSize = "larger";
            originP.innerText = "Origin: " + data[0].origin;
         }

         if (d === 0) {
            let syn_ant_p = document.createElement("p");
            defs.appendChild(syn_ant_p);
            syn_ant_p.classList.add('syn-ant');
            syn_ant_p.innerText += "Synonyms: " + data[0].meanings[m].synonyms.join(', ') + "\nAntonyms: " + data[0].meanings[m].antonyms.join(', ');
         }

         let par = document.createElement("li");

         defs.appendChild(par);

         par.innerHTML += "<small>[" + data[0].meanings[m].partOfSpeech + "]</small> " + data[0].meanings[m].definitions[d].definition + "<br />";

         if (data[0].meanings[m].definitions[d].example !== undefined) {
            par.innerHTML += "<small>e.g., <i>\"" + data[0].meanings[m].definitions[d].example + "\"</i>";
         }

         /* if (d === data[0].meanings[m].definitions.length - 1) {
            let syn_ant_p = document.createElement("p");
            defs.appendChild(syn_ant_p);
            // syn_ant_p.style.margin = "0.7em 1em";
            // syn_ant_p.style.fontSize = "smaller";
            syn_ant_p.innerText += "Synonyms: " + data[0].meanings[m].synonyms.join(', ') + "\nAntonyms: " + data[0].meanings[m].antonyms.join(', ');
         } */
      }
   }
}

defineBtn.addEventListener("click", getDefinition);

word.addEventListener("keydown", (e) => {
   if (e.key === "Enter") getDefinition();
});