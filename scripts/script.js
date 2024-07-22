const defineBtn = document.getElementById("get-def");
const defs = document.getElementById("defs");

defineBtn.addEventListener("click", async () => {
   try {
      const word = document.getElementById("word").value.toLowerCase();
      // console.log(word);

      if (word === "") { throw new Error("Please enter a word to get its definition."); }

      // const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/Asynchronous`); // for testing
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      if (!response.ok) {
         throw new Error("Could not get definition.");
      } else {
         const data = await response.json();

         printDefs(data);
      }
   } catch (error) {
      defs.innerText = error;
      // console.error(error);
   }
})

function printDefs(data) {
   // Removes <p> elements inside defs and error message if exist
   let pDel = defs.querySelectorAll("p");

   for (let i = 0; i <pDel.length; i++) { pDel[i].remove(); }

   defs.innerText = "";

   // Creates an <h3> to print the searched word
   let searchedWord = document.createElement("h3");
   defs.appendChild(searchedWord);
   searchedWord.style.color = "goldenrod";
   searchedWord.style.textTransform = "capitalize";
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
            syn_ant_p.style.margin = "1.3em 0 0.5em";
            syn_ant_p.style.fontSize = "smaller";
            syn_ant_p.innerText += "Synonyms: " + data[0].meanings[m].synonyms.join(', ') + "\nAntonyms: " + data[0].meanings[m].antonyms.join(', ');
         }

         let par = document.createElement("li");

         defs.appendChild(par);

         par.innerHTML += "<small>[" + data[0].meanings[m].partOfSpeech + "]</small> " + data[0].meanings[m].definitions[d].definition + "<br />";

         if (data[0].meanings[m].definitions[d].example !== undefined) {
            par.innerHTML += "<small>e.g., <i>\"" + data[0].meanings[m].definitions[d].example + "\"</i></small><br /><br />";
         } else if (d !== data[0].meanings[m].definitions.length - 1) { par.innerHTML += "<br />"; }

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