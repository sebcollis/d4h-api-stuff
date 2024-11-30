var csv;

window.addEventListener("load", () => {
  //DO NOT GET RID OF ^ BTW ITS MAKING SURE EVERYTHINGS LOADED BEFORE THE CODE RUNS

  //GET UPLOADED FILE
  document.getElementById('bulkupload').addEventListener('submit', (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('docpicker');
    csv = fileInput.files[0];

    //async bullshit. idk sue me
    if (csv) {
      csv.text().then(result =>{
        upload_exercises(result)
      });      
    }
    });

});

function isDstObserved(date) {
  var control = new  Date(2024, 8, 1) //this will always not be dst
  return date.getTimezoneOffset() < control.getTimezoneOffset();
}

function date_time_parser(date, time){
  var year, month, day, hour, minute
  //probably could have done this with regex but i hate that so sue me

  //update from self a few months later: i like regex now and also WHY did i do it like this?????
  if (date && typeof date === 'string') {
    var date_array = date.split("");
  } else {
      console.error('Invalid date value:', date);
  }

  console.log("date: " + date)
  console.log("date array: " + date_array)

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

  console.log("time: " + time)
  console.log("time array: " + time_array)

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
  console.log("called")
  var uploaded_csv = CSVToJSON(file)
  for(exercise in uploaded_csv){
    if(uploaded_csv[exercise].Code == null || uploaded_csv[exercise].Code == ""){
      console.log("error with exercise: " + uploaded_csv[exercise])
    }
    else{
    //context n context id r hardcoded in
    const url = 'https://api.team-manager.us.d4h.com/v3/team/289/exercises';
    //need to parse this all from csv!!
    const data = {
      "reference": uploaded_csv[exercise].Code,
      "referenceDescription": uploaded_csv[exercise].Title,
      "description": uploaded_csv[exercise].Description ,
      "plan": uploaded_csv[exercise].Plan,
      "shared": "false",
      "fullTeam": "false",
      "startsAt": date_time_parser(uploaded_csv[exercise].Date, uploaded_csv[exercise].Start),
      "endsAt": date_time_parser(uploaded_csv[exercise].Date, uploaded_csv[exercise].End),
      "locationBookmarkId" : uploaded_csv[exercise].Location
    };
    const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
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



