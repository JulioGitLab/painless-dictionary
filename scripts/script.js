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

   // Creates a <p> for each definition
   for (let m = 0; m < data[0].meanings.length; m++) {
      for (let d = 0; d < data[0].meanings[m].definitions.length; d++) {
         let par = document.createElement("p");

         defs.appendChild(par);
         
         if (m === 0 && d === 0) { par.innerText = "Origin: " + data[0].origin + "\n\n"; }

         par.innerText += "* [" + data[0].meanings[m].partOfSpeech + "] " + data[0].meanings[m].definitions[d].definition
         + "\n- Example: " + data[0].meanings[m].definitions[d].example;

         if (d === data[0].meanings[m].definitions.length - 1) {
            par.innerText += "\n\nSynonyms: " + data[0].meanings[m].synonyms.join(', ') + "\nAntonyms: " + data[0].meanings[m].antonyms.join(', ');
         }
      }
   }
}