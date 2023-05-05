

document.getElementById("get").addEventListener('click', () => {
    document.getElementById('landingPage').style.display = "none";
    document.getElementById('mainPage').style.display = "block";
});


let ipDetails = document.getElementById('details');
let map = document.getElementById('map');
let timeZoneDetails = document.getElementById('details2');
let posts = document.getElementById('posts');

async function fetchIP() {

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json()
        document.getElementById('ip').innerHTML = data.ip;
        fetchDetails(data);
    }
    catch (e) {
        console.log(e);
    }

}

fetchIP();

async function fetchDetails(data) {
    try {
        const response = await fetch(`https://ipinfo.io/${data.ip}?token=4f60a7a492abb0`);
        const details = await response.json();
        addDetails(details);
        fetchDateAndTimeZone(details);
    }
    catch (e) {
        console.log(e);
    }
}






function addDetails(details) {

    let location = details.loc.split(",");
    ipDetails.innerHTML = `<div class="details">Lat: ${location[0]}</div>
        <div class="details">Long: &nbsp &nbsp ${location[1]}</div>
        <div class="details">City: &nbsp &nbsp ${details.city}</div>
        <div class="details">Region: &nbsp &nbsp ${details.region}</div>
        <div class="details">Organisation: &nbsp &nbsp ${details.org}</div>
        <div class="details">Country: &nbsp &nbsp ${details.country}</div>
      `

    map.innerHTML = `<iframe src="https://maps.google.com/maps?q=${location[0]}, ${location[1]}&z=15&output=embed" width="100%" height="270" frameborder="0" style="border:0"></iframe>`;
}


let postOffices = [];
async function fetchDateAndTimeZone(details) {
    let tzDatetime = new Date().toLocaleString("en-US", { timeZone: `${details.timezone}` });
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${details.postal}`);
        const postalData = await response.json();
        postOffices = [postalData[0].PostOffice];
        addTimeZoneData(details, tzDatetime, postalData[0].Message);
        addPostOfficesDetails(postalData[0].PostOffice);
    }
    catch (e) {
        console.log(e);
    }
}


function addTimeZoneData(details, dateAndTime, msg) {
    timeZoneDetails.innerHTML = `
         <div>Time Zone: &nbsp ${details.timezone}</div>
         <div>Date and Time: &nbsp ${dateAndTime}</div>
         <div>Pincode: &nbsp ${details.postal}</div>
         <div>Message: &nbsp ${msg}</div>`
}

function addPostOfficesDetails(postalData) {


    postalData.map((item) => {
        posts.innerHTML += `<div class="post">
            <p>Name: &nbsp &nbsp${item.Name}</p>
            <p>Branch Type: &nbsp &nbsp${item.BranchType}</p>
            <p>Delivery Status: &nbsp &nbsp${item.DeliveryStatus}</p>
            <p>District: &nbsp &nbsp ${item.District}</p>
            <p>Division:&nbsp &nbsp ${item.Division}</p>
        </div>`
    })
    localStorage.setItem("postalData", JSON.stringify(postalData));

}

function filterItems() {
    let value = document.getElementById('filter').value;
    let postalData = JSON.parse(localStorage.getItem("postalData"));

    value = value.toLowerCase();
    postalData = postalData.filter((item) => {
        if (item.Name.toLowerCase() == value || item.BranchType.toLowerCase() == value) return true;
        return false;
    });

    posts.innerHTML = "";
    postalData.map((item) => {
        posts.innerHTML += `<div class="post">
            <p>Name: &nbsp &nbsp${item.Name}</p>
            <p>Branch Type: &nbsp &nbsp${item.BranchType}</p>
            <p>Delivery Status: &nbsp &nbsp${item.DeliveryStatus}</p>
            <p>District: &nbsp &nbsp ${item.District}</p>
            <p>Division:&nbsp &nbsp ${item.Division}</p>
        </div>`
    })

}


