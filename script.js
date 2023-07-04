
const hidebtn = document.querySelector("#ButtonClick");
const newDetails = document.querySelector(".newDetails");
const searchInput = document.querySelector("#searchInput");
const heading = document.querySelector(".heading");

hidebtn.addEventListener("click", async () => {
  hidebtn.style.display = "none";

  try {
    const ipData = await fetchIPDetails();
    const postalData = await fetchPostalCodeData(ipData.postal);
    console.log(ipData)
    const datetime_str = new Date().toLocaleString("en-US", {
      timeZone: ipData.timezone,
    });
    heading.insertAdjacentHTML("beforeend",`<b class="ipAddress">${ipData.ip}</b>`);
    const filteredPostalData = filterPostalData(postalData);



    newDetails.insertAdjacentHTML(
      "beforeend",
      `<div id="row1">
        <div class="row1data">Lat:     ${ipData.latitude}</div>
        <div class="row1data">City:     ${ipData.city}</div>
        <div class="row1data">Organisation:     ${ipData.org}</div>
      </div>
      <div id="row2">
        <div class="row2data">Long:     ${ipData.longitude}</div>
        <div class="row2data">Region:    ${ipData.region}</div>
        <div class="row2data">Hostname:     ${ipData.ip}</div>
      </div>
      <div class="map">
        <iframe src="https://maps.google.com/maps?q=${ipData.latitude},${ipData.longitude}&z=15&output=embed" width="100%" height="500" frameborder="0" style="border:0"></iframe>
      </div>
      <div class="middle1 info"><b>Time Zone:    ${ipData.timezone}</b></div>
      <div class="middle2 info"><b>Date and Time:    ${datetime_str}</b></div>
      <div class="middle3 info"><b>Pincode:    ${ipData.postal}</b></div>
      <div class="middle4 info"><span><b>Message:    </b>Number of pincode(s) found:   ${filteredPostalData.length}</span></div>
      <div>
        <input  type="text" id="searchInput" placeholder="&#x1F50D Filter" />
      </div>
      <div id="postalList">
        ${generatePostalList(filteredPostalData)}
      </div>
    `);
    let searchInput = document.querySelector("#searchInput");

        searchInput.addEventListener("keyup", () => {
            const searchValue = searchInput.value.trim().toLowerCase();
            const filteredData = filterPostalData(postalData, searchValue);
            const postalListContainer = document.querySelector("#postalList");
            postalListContainer.innerHTML = generatePostalList(filteredData);
          });
    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.trim().toLowerCase();
      const filteredData = filterPostalData(postalData, searchValue);
      const postalListContainer = document.querySelector("#postalList");
      postalListContainer.innerHTML = generatePostalList(filteredData);
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

async function fetchIPDetails() {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  const ip = data.ip;
  const url = `https://ipapi.co/${ip}/json/`;

  const ipResponse = await fetch(url);
  return await ipResponse.json();
}

async function fetchPostalCodeData(postalCode) {
  const url = `https://api.postalpincode.in/pincode/${postalCode}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0]?.PostOffice || [];
}

function filterPostalData(postalData, searchValue = "") {
  return postalData.filter((postal) => {
    const name = postal.Name.toLowerCase();
    const branch = postal.BranchType.toLowerCase();
    return name.includes(searchValue) || branch.includes(searchValue);
  });
}
function generatePostalList(postalData) {
    if (postalData.length === 0) {
      return "<div>No post offices found.</div>";
    }
  
    return postalData
      .map(
        (postal) =>
          `<div id="information" class="postal-card">
             <div class="info-item"><b>Name:</b> ${postal.Name}</div>
             <div class="info-item"><b>Branch:</b> ${postal.BranchType}</div>
             <div class="info-item"><b>Delivery Status:</b> ${postal.DeliveryStatus}</div>
             <div class="info-item"><b>District:</b> ${postal.District}</div>
             <div class="info-item"><b>Division:</b> ${postal.Division}</div>
           </div>`
      )
      .join("");
  }
  