
(function() {
  function creatingAjaxRequest(){
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = appendingDataToSelectTag;
    httpRequest.open('GET', 'https://api.myjson.com/bins/wsz47');
    httpRequest.send();
  }

  function appendingDataToSelectTag() {
    if (httpRequest.readyState === 4) {
      var myData = (httpRequest.responseText);
      var myJsonData = JSON.parse(myData);
      var temp = '<option value="">Please select a Country</option>';
      var selectedCountry = document.querySelector('#selecting-country');
      for(var i in myJsonData.countryList) {
        var countryName = myJsonData.countryList[i].countryName;
        temp = temp + '<option value="'+countryName+'">'+countryName+'</option>';
      }
      document.querySelector('#selecting-country').innerHTML = temp;
    }
  }

  function gettingDataOfSMS(){
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = showPriceForSMS;
    httpRequest.open('GET', 'https://api.myjson.com/bins/wsz47');
    httpRequest.send();
  }

  function showPriceForSMS() {
    var selectedCountry = document.querySelector('#selecting-country').value;
    if (httpRequest.readyState === 4) {
      var priceData = (httpRequest.responseText);
      var priceJosn = JSON.parse(priceData);
      for(var i in priceJosn.countryList){
        if( priceJosn.countryList[i].countryName == selectedCountry){
          var countryObject = priceJosn.countryList[i];
          document.querySelector('#country').innerHTML = countryObject.countryName;
          document.querySelector('#g-price').innerHTML = countryObject.price;
          document.querySelector('#l-price').innerHTML = countryObject.localprice;
        }
      }
    }
  }
  function downloadCSV(csv, filename){
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type:"text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  function exportableCSV(filename){
    var csv = [];
    var rows = document.querySelectorAll('table tr');
    for(var i = 0; i<rows.length; i++){
      var row = [], cols = rows[i].querySelectorAll('td, th');
      for(var j=0; j<cols.length; j++){
        row.push(cols[j].innerText);
        csv.push(row.join(','));
      }
    }
    downloadCSV(csv.join('\n'), filename);
  }

  function csvFileData() {
    localFileRequest = new XMLHttpRequest();
    localFileRequest.onreadystatechange = processingCsvData;
    localFileRequest.open('GET', 'plivo_outbound_rates_copy.csv', true);
    localFileRequest.send(null);
  }

  function processingCsvData(){
    var trimedData = localFileRequest.responseText.split(/\r?\n|\r/);
    var splitingCell;
    var countryNameInCSV = [];
    for(var i=0; i<trimedData.length; i++) {
      if(i !== 0){
        splitingCell = trimedData[i].split(',');
        countryNameInCSV.push(splitingCell[0]);
      }
    }
    uniqueArray(countryNameInCSV);
  }

  function uniqueArray(data){
    var uniqeCountryName = [];
    for(var names = 0; names < data.length; names++){
      if(uniqeCountryName.indexOf(data[names]) == -1){
        uniqeCountryName.push(data[names])
      }
    }
    passingSelectOptions(uniqeCountryName);
  }

  function passingSelectOptions(arrayList){
    var listOfCountry = '<option value="">Please a select a country</option>' ;
    for (var uniqueNames = 0; uniqueNames < arrayList.length; uniqueNames++) {
      listOfCountry = listOfCountry + '<option value="'+arrayList[uniqueNames]+'">' + arrayList[uniqueNames] + '</option>'
    }
    document.querySelector('#voice-price-select').innerHTML = listOfCountry;
  }

  function csvFileDataOnClick() {
    localFileRequest = new XMLHttpRequest();
    localFileRequest.onreadystatechange = processingCsvDataOnClick;
    localFileRequest.open('GET', 'plivo_outbound_rates_copy.csv', true);
    localFileRequest.send(null);
  }

  function processingCsvDataOnClick(){
    var trimedData = localFileRequest.responseText.split(/\r?\n|\r/);
    var splitingCell;
    var countryNameInCSV = [];
    for(var i=0; i<trimedData.length; i++) {
      if(i !== 0){
        splitingCell = trimedData[i].split(',');
        countryNameInCSV.push(splitingCell[0]);
        gettingList(splitingCell);
        // creatingList(splitingCell);
      }
    }
  }

  function creatingList(tableDat){
    console.log(tableDat);
  }

  function gettingList(list){
    var selectedCountry = document.querySelector('#voice-price-select').value;
    for(var n in list){
      if(list[n] === selectedCountry) {
        document.querySelector('#td-country').innerHTML = list[0];
        document.querySelector('#td-prifix').innerHTML = list[3];
        document.querySelector('#td-price').innerHTML = list[4];
      }
    }
    // matchingCountryName(arrayList[0]);
  }

  // function matchingCountryName(data){
  //   // console.log(data);
  //   // for(var z in data){
  //   //   console.log([z]);
  //   // }
  // }

  creatingAjaxRequest();
  csvFileData();
  document.querySelector('#voice-price-select').addEventListener("change", csvFileDataOnClick);
  document.querySelector('#selecting-country').addEventListener("change", gettingDataOfSMS);
  document.querySelector('#download').onclick = function() {
    exportableCSV('price.csv');
  }
})();
