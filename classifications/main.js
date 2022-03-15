function captureFilters() {
    let filterElements = document.getElementsByTagName("input");
    let filters = [];
    [...filterElements].forEach(element => filters.push(element.value.toUpperCase()))
    filter(filters);
}
function filter(filters) {
    let clearFilters = true;
    filters.forEach(f => { if (f !== "") { clearFilters = false; } })
    let table = document.getElementsByTagName("table")[0];
    let tableRecords = table.getElementsByTagName("tr");
    for (let i = 0; i < tableRecords.length; i++) {
        let rowData = tableRecords[i].getElementsByTagName("td");
        let display = [];
        if (!clearFilters) {
            for (let column = 0; column <= rowData.length; column++) {
                let cell = rowData[column];
                if (column === 7) {//classifications are in child node
                    cell = cell.getElementsByTagName("DIV")[0];
                }
                let filter = filters[column];
                if (cell && filter) {
                    let cellData = cell.textContent || cell.innerText;
                    let fullEqualityColumns = [1, 3, 4]
                    let startsWithColumns = [7];
                    if (fullEqualityColumns.includes(column)) {
                        if (cellData.toUpperCase() === filter) {
                            display.push(true);
                        } else {
                            display.push(false);
                        }
                    } else if (startsWithColumns.includes(column)) {
                        if (cellData.toUpperCase().startsWith(filter)) {
                            display.push(true);
                        } else {
                            display.push(false);
                        }
                    } else {
                        if (cellData.toUpperCase().indexOf(filter) > -1) {
                            display.push(true);
                        } else {
                            display.push(false);
                        }
                    }

                }
            }
        }
        let show = display.every(boolean => boolean === true)
        if (clearFilters || show)
            tableRecords[i].style.display = "";
        else if (rowData.length > 0)
            tableRecords[i].style.display = "none";
    }
}
function classify(elem, classification) {
    let parent = elem.parentElement.parentElement;
    let div = parent.getElementsByTagName("DIV")[0];
    div.innerHTML = classification;
}
function deleteButtons(elem) {
    let parent = elem.parentElement;
    parent.innerHTML = '';
}
function saveRecordsToCSV() {
    let tbody = document.getElementsByTagName("tbody");
    let trs = tbody[0].getElementsByTagName("tr");
    let csv = "webpage,ID,type,rangeMin,rangeMax,failureImage,classification,widerPatch,narrowerPatch,xpath1,xpath2\n";
    for (let tr of trs) {
        let td = tr.getElementsByTagName("td");
        let webpage = td[0].innerHTML.trim();
        let ID = td[1].innerHTML.trim();
        let type = td[2].innerHTML.trim();
        let min = td[3].innerHTML.trim();
        let max = td[4].innerHTML.trim();
        let fImage = td[5].getElementsByTagName("a")[0].getAttribute("href").trim();;
        let classification = td[6].getElementsByTagName("div")[0].innerHTML.trim();
        let wImage = td[7].getElementsByTagName("a")[0].getAttribute("href").trim();;
        let aNarrower = td[8].getElementsByTagName("a")[0];
        let nImage = td[8].innerHTML.trim();
        if (aNarrower !== undefined)
            nImage = td[8].getElementsByTagName("a")[0].getAttribute("href").trim();;

        let xpath1 = td[9].innerHTML.trim();
        let xpath2 = td[10].innerHTML.trim();
        csv += webpage + "," + ID + "," + type + "," + min + "," + max + "," + fImage + "," + classification + "," + wImage + "," + nImage + "," + xpath1 + "," + xpath2 + "\n";
    }
    return csv;
}
function loadClassificationsFromCSV(csv) {
    let lines = csv.split("\n");
    let unmatched = "";
    for (line of lines) {
        if (line.trim() === "")
            continue;
        column = line.split(",");
        let tbody = document.getElementsByTagName("tbody");
        let trs = tbody[0].getElementsByTagName("tr");
        let found = false;
        for (let tr of trs) {
            let td = tr.getElementsByTagName("td");
            let fImage = td[5].getElementsByTagName("a")[0].getAttribute("href");;
            if (column[4] !== undefined) {
                column[4] = column[4].replace("Minute-Journal", "MinuteJournal");
                column[4] = column[4].replace("Consumer-Reports", "ConsumerReports");
                column[4] = column[4].replace("Days-Old", "DaysOld"); 
                column[4] = column[4].replace("Covered-Calendar", "CoveredCalendar");
                if (column[4].toLocaleLowerCase() === fImage.toLocaleLowerCase()) {
                    found = true;
                    if (column[6].toLowerCase() === "failure")
                        column[6] = "Definite"
                    td[6].getElementsByTagName("div")[0].innerHTML = column[6];
                    break;
                }
            }

        }
        if (!found)
            unmatched += column[0] + "\n";
        //unmatched += line + "\n";

    }
    return unmatched;

}
