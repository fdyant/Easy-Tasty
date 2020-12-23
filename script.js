// use fetch to retrieve the products and pass them to init
// report any errors that occur in the fetch operation
// once the recipes have been successfully loaded and formatted as a JSON object using response.json(), run the initialize() function

fetch('recipes.json').then(function(response) {
    return response.json();
  }).then(function(json) {
  let recipes= json;
  initialize(recipes);
}).catch(function(err) {
console.log(`Fetch problem: ${err.message}`);
});

// sets up the app logic, declares required variables, contains all the other functions
function initialize(recipes) {
    // grab the UI elements that we need to manipulate
    const category = document.querySelector('select');
    const searchTerm = document.querySelector('input');
    const searchBtn = document.querySelector('button');
    const main = document.querySelector('main');
// keep a record of what the last category and search term entered were
    let lastCategory = category.value;
// no search has been made yet
    let lastSearch = '';
// these contain the results of filtering by category, and search term finalGroup will contain the recipes that need to be displayed after
// the searching has been done. Each will be an array containing objects. Each object will represent a recipes
    let categoryGroup;
    let finalGroup;
// To start with, set finalGroup to equal the entire recipes database then run updateDisplay(), so ALL recipes are displayed initially.
    finalGroup = recipes;
    updateDisplay();
// Set both to equal an empty array, in time for searches to be run
    categoryGroup = [];
    finalGroup = [];
// when the search button is clicked, invoke selectCategory() to start a search running to select the category of products we want to display
    searchBtn.onclick = selectCategory;

    function selectCategory(e) {
// Use preventDefault() to stop the form submitting — that would ruin the experience
    e.preventDefault();
// Set these back to empty arrays, to clear out the previous search
    categoryGroup = [];
    finalGroup = [];
// if the category and search term are the same as they were the last time a search was run, the results will be the same, so there is no point running
// it again — just return out of the function
    if(category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
      } else {
// update the record of last category and search term
    lastCategory = category.value;
    lastSearch = searchTerm.value.trim();

// In this case we want to select all products, then filter them by the search term, so we just set categoryGroup to the entire JSON object, then run selectRecipes()
    
    if(category.value === 'Choose all') {
    categoryGroup = recipes;
    selectRecipes();
// If a specific category is chosen, we need to filter out the recipes not in that category, then put the remaining products inside categoryGroup, before running
// selectRecipes()
    } else {
// the values in the <option> elements are uppercase, whereas the categories store in the JSON (under "type") are lowercase. We therefore need to convert
// to lower case before we do a comparison
    let lowerCaseType = category.value.toLowerCase();
    for(let i = 0; i <recipes.length ; i++) {
// If a recipes type property is the same as the chosen category, we want to display it, so we push it onto the categoryGroup array
        if(recipes[i].type === lowerCaseType) {
        categoryGroup.push(recipes[i]);
            }
        }
// Run selectRecipes() after the filtering has been done
          selectRecipes();
        }
      }
    }
  
// selectRecipes() Takes the group of recipes selected by selectCategory(), and further filters them by the tiered search term (if one has been entered)
    function selectRecipes() {
// If no search term has been entered, just make the finalGroup array equal to the categoryGroup array — we don't want to filter the recipes further — then run updateDisplay().
      if(searchTerm.value.trim() === '') {
        finalGroup = categoryGroup;
        updateDisplay();
      } else {
// Make sure the search term is converted to lower case before comparison. We've kept the recipes names all lower case to keep things simple
        let lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
// For each product in categoryGroup, see if the search term is contained inside the product name (if the indexOf() result doesn't return -1, it means it is) — if it is, then push the product
// onto the finalGroup array
        for(let i = 0; i < categoryGroup.length ; i++) {
          if(categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
            finalGroup.push(categoryGroup[i]);
          }
        }
// run updateDisplay() after this second round of filtering has been done
        updateDisplay();
      }
    }
  
// start the process of updating the display with the new set of recipes
    function updateDisplay() {
// remove the previous contents of the <main> element
      while (main.firstChild) {
        main.removeChild(main.firstChild);
      }
// if no products match the search term, display a "No results to display" message
      if(finalGroup.length === 0) {
        const heading = document.createElement('h4');
        heading.textContent = 'Opsst, no recipe found!';
        main.appendChild(heading);
// for each recipes we want to display, pass its recipes object to fetchBlob()
      } else {
        for(let i = 0; i < finalGroup.length; i++) {
          fetchBlob(finalGroup[i]);
        }
      }
    }
  
// fetchBlob uses fetch to retrieve the image for that recipes, and then sends the resulting image display URL and recipes object on to showRecipes() to finally
// display it
    function fetchBlob(recipes) {
// construct the URL path to the image file from the recipes.image property
      let url = 'resources/' + recipes.image;
// Use fetch to fetch the image, and convert the resulting response to a blob Again, if any errors occur we report them in the console.
      fetch(url).then(function(response) {
          return response.blob();
      }).then(function(blob) {
// Convert the blob to an object URL — this is basically an temporary internal URL that points to an object stored inside the browser
        let objectURL = URL.createObjectURL(blob);
// invoke showRecipes
        showRecipes(objectURL, recipes);
      });
    }
// Display a product inside the <main> element
    function showRecipes(objectURL, recipes) {
    const section = document.createElement('section');
    const image = document.createElement('img');
    const heading = document.createElement('h4');
    
// give the <section> a classname equal to the recipes "type" property so it will display the correct icon
    section.setAttribute('class', recipes.type);
  
// Give the <h4> textContent equal to the product "name" property, but with the first character replaced with the uppercase version of the first character
    heading.textContent = recipes.name.replace(recipes.name.charAt(0), recipes.name.charAt(0).toUpperCase());
    
// Set the src of the <img> element to the ObjectURL, and the alt to the product "name" property
      image.src = objectURL;
      image.alt = recipes.name;
  
// append the elements to the DOM as appropriate, to add the product to the UI
      main.appendChild(section);
      section.appendChild(image);
      section.appendChild(heading);
    }
  }

// view recipe on click
let buttonView = document.querySelector('a');
function buttonView = onclick;