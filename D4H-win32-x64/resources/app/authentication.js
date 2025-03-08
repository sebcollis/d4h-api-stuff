
window.addEventListener("load", () => {
    //DO NOT GET RID OF ^ BTW ITS MAKING SURE EVERYTHINGS LOADED BEFORE THE CODE RUNS

    //PERSONAL ACCESS TOKEN VALIDATION
    const form = document.getElementById('access');
    form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents the default form submission
    const result = form.elements['access_token']; 
    sessionStorage.setItem("token", result.value) //this just saves the token while the app is open
    authenticate_validate();
  });
});

async function authenticate_validate() {
    const  url = 'https://api.team-manager.us.d4h.com/v3/whoami';
    const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
      "Access-Control-Allow-Headers" : "*",
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS, GET'
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
      BetterErrorMessages(error.message)
      //document.getElementById("auth_output").innerHTML = error.message;
    }
  }

function BetterErrorMessages(errormessage){
  if(errormessage.includes(401)){
    bettererrormessage = errormessage + "<br>" + "You are Unauthorized. This means your authentication credentials are invalid - Check that your API key is entered correctly and in-date."
    document.getElementById("auth_output").innerHTML = bettererrormessage
  }
  if(errormessage.includes(404)){
    bettererrormessage = errormessage + "<br>" + "The D4H server cannot be found."
    document.getElementById("auth_output").innerHTML = bettererrormessage
  }
}