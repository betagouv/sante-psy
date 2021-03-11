var setupFilter = function(fieldName) {
  var filterEl = document.getElementById(fieldName + "-filter-value");
  // Trigger setFilter function with correct parameters
  function updateFilter(){
    table.setFilter(fieldName,'like', filterEl.value);
  }
  filterEl.addEventListener("keyup", updateFilter);
};
setupFilter("address");
setupFilter("lastName");
setupFilter("departement");

var psyListElement = document.getElementById("psy-list");
var psyList = JSON.parse(psyListElement.textContent);

var addPrefixToUrl = (urlCell) => {
  const url = urlCell.getValue()
  if (!url.startsWith('http')) {
    return '//' + url
  }
  return url
}

var table = new Tabulator("#psy-table", {
  data: psyList, //assign data to table
  langs:{ // http://tabulator.info/docs/4.2/localize#setup
    "fr-fr":{ //French language definition
      "pagination":{
        "first":"Première",
        "first_title":"Première Page",
        "last":"Dernière",
        "last_title":"Dernière Page",
        "prev":"Précédent",
        "prev_title":"Page Précédente",
        "next":"Suivant",
        "next_title":"Page Suivante",
      },
      "headerFilters":{
      "default":"Rechercher par adresse", //default header filter placeholder text
      }
    },
  },
  tooltipsHeader:true,
  layout:"fitData",       //fit columns to width of table
  responsiveLayout:"hide",  //hide columns that dont fit on the table //@TODO
  tooltips:true,            //show tool tips on cells
  addRowPos:"top",           //when adding a new row, add it to the top of the table
  history:true,              //allow undo and redo actions on the table
  pagination:"local",         //paginate the data
  paginationSize:10,        //allow XX rows per page of data
  movableColumns:false,        //allow column order to be changed
  resizableRows:false,          //allow row order to be changed
  resizableColumns:false,
  initialSort:[             //set the initial sort order of the data
    {column:"lastName", dir:"asc"},
  ],
  columns:[
    {title:"Nom", field:"lastName", sorter:"string", responsive:0},
    {title:"Prénom(s)", field:"firstNames", sorter:"string", responsive:0},
    {title:"Département", field:"departement", sorter:"string", maxWidth: 300, responsive:0, formatter:"text"},
    {title:"Adresse", field:"address", sorter:"string", maxWidth: 300, responsive:0, formatter:"link", formatterParams:{labelField:"address",urlPrefix:"https://www.openstreetmap.org/search?query=",target:"_blank"}},
    {title:"📞", field:"phone", sorter:"string", responsive:0, formatter: "link", formatterParams:{labelField:"phone",urlPrefix:"tel:"}},
    {title:"Email", field:"email", sorter:"string", responsive:0, formatter:"link", formatterParams:{labelField:"email",urlPrefix:"mailto://"}},
    {title:"Téléconsultation", field:"teleconsultation",  headerTooltip: "Téléconsultation", responsive:0,sorter:"string", hozAlign:"center",tooltip: "Est ce que le psychologue accepte la téléconsultation ?", formatter:"tickCross"},
    {title:"Langues parlées", field:"languages", responsive:0,sorter:"string", hozAlign:"center", formatter:"textarea"},
    {title:"Site web", field:"website", sorter:"string", maxWidth:200, responsive:0, formatter:"link", formatterParams:{labelField:"website",target:"_blank", url: addPrefixToUrl}},
  ],
  headerFilterPlaceholder:"Rechercher un psychologue" // http://tabulator.info/docs/4.9/filter#header
});
table.setLocale("fr-fr");
