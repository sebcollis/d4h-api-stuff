var token = "";

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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    document.getElementById("auth_output").innerHTML = json;
  } catch (error) {
    document.getElementById("auth_output").innerHTML = error.message;
  }
}

