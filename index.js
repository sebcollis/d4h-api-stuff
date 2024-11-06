var token = "";
var csv;

window.addEventListener("load", () => {
  //DO NOT GET RID OF ^ BTW ITS MAKING SURE EVERYTHINGS LOADED BEFORE THE CODE RUNS

  //PERSONAL ACCESS TOKEN VALIDATION
  const form = document.getElementById('access');
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents the default form submission
    const result = form.elements['access_token']; 
    token = result.value
    authenticate_validate();
  });

  //GET UPLOADED FILE
  document.getElementById('bulkupload').addEventListener('submit', (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('docpicker');
    csv = fileInput.files[0];

    //async bullshit. idk sue me
    if (csv) {
      csv.text().then(result =>{
        console.log(result)
        upload_exercises(result)
      });      
    }
    });

});

async function authenticate_validate() {
  const  url = 'https://api.team-manager.us.d4h.com/v3/whoami';
  const options = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
  try {
    document.getElementById("auth_output").innerHTML = "Loading authentication...";
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    document.getElementById("auth_output").innerHTML = json;
  } catch (error) {
    document.getElementById("auth_output").innerHTML = error.message;
  }
}

//STOLE THIS OFF THE INTERNET
function isDstObserved(date) {
  var control = new  Date(2024, 8, 1) //this will always not be dst
  return date.getTimezoneOffset() < control.getTimezoneOffset();
}

//HATE HATE HATE HATE HATE
function date_time_parser(date, time){
  var year, month, day, hour, minute
  //probably could have done this with regex but i hate that so sue me

  //update from self a few months later: i like regex now and also WHY did i do it like this?????
  var date_array = date.split("")

  if(date_array.length == 9){ 
    day = "0" + date_array[0] 
    month = date_array[2] + date_array[3] + ""
    year = date_array[5] + date_array[6] + date_array[7] + date_array[8] +""
  }
  else{ 
    day = date_array[0] + "" + date_array[1]  
    month = date_array[3] + date_array[4] + ""
    year = date_array[6] + date_array[7] + date_array[8] + date_array[9] +""
  }

  var time_array = time.split("")
  if(time_array.length == 3){ //fix leading 0 problem (sharknado)
    hour = 0 + time_array[0] + ""
    minute = time_array[1] + time_array[2] + ""
  }
  else{
    hour = time_array[0] + time_array[1] + ""
    minute = time_array[2] + time_array[3] + ""
  }

  //if anything is gonna break itll be this btw
  var ex_date = new Date(year, month, day)
  if (isDstObserved(ex_date)) { return Date.parse(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":00.000+13:00") }
  else{ return Date.parse(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":00.000+12:00") }
  
}

async function upload_exercises(file){
  var uploaded_csv = CSVToJSON(file)
  for(exercise in uploaded_csv){
    console.log(uploaded_csv[exercise])
    //context n context id r hardcoded in
  const url = 'https://api.team-manager.us.d4h.com/v3/team/289/exercises';
  //need to parse this all from csv!!
  const data = {
    "reference": uploaded_csv[exercise].Code,
    "referenceDescription": uploaded_csv[exercise].Title,
    "description": uploaded_csv[exercise].Description ,
    "plan": uploaded_csv[exercise].Plan,
    "shared": false,
    "fullTeam": true,
    "startsAt": date_time_parser(uploaded_csv[exercise].Date, uploaded_csv[exercise].Start),
    "endsAt": date_time_parser(uploaded_csv[exercise].Date, uploaded_csv[exercise].End),
    "locationBookmarkId" : uploaded_csv[exercise].Location
  };
  console.log(data)
  const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
};
  try {
    document.getElementById("auth_upload").innerHTML = "Loading upload...";
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    document.getElementById("auth_upload").innerHTML += json;
  } catch (error) {
    document.getElementById("auth_upload").innerHTML += error.message;
  }
  }
}

//nicked this from the internet god fucking bless
const CSVToJSON = csv => {
  const lines = csv.split('\n'); 
  const keys = lines[0].split(','); 
  return lines.slice(1).map(line => { 
      return line.split(',').reduce((acc, cur, i) => { 
          const toAdd = {}; 
          toAdd[keys[i]] = cur; 
          return { ...acc, ...toAdd }; 
      }, {}); 
  }); 
}; 



