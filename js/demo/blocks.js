var HOST = "http://165.22.254.243:1234";
var data = [];
var first_page = 1;
var last_page = 1;
var current_page = 1;

$("#publicKeys").on("change", function() {
    selectedText = this.selectedOptions[0].text;
    selectedValue = this.selectedOptions[0].value;
    console.log(selectedText)
    console.log(selectedValue)
    $("#publicKeyAddress").val($("#publicKeys").val())
    loadBlocksAddress(selectedValue)
    clearAllChart()
})

function loadFirstBlock() {
    loadBlocks()
}

function loadFirstBlockAddress() {
    loadBlocksAddress($("#publicKeys").val())
}

async function loadBlocks(page=1, record_per_page=10, reversed=1) {
    var url = `${HOST}/block/get?page=${page}&limit=${record_per_page}&reversed=${reversed}`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.json();
            })
            .then(result => {
                console.log(result);
                load_data_to_table(result.data);
            })
            .catch(error => {
                console.log('error', error)
            })
}

async function loadBlocksAddress(address, page=1, record_per_page=10, reversed=1) {
    var url = `${HOST}/block/get/${address}?page=${page}&limit=${record_per_page}&reversed=${reversed}`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.json();
            })
            .then(result => {
                if (result.success) {
                    console.log(result);
                    load_data_to_table(result.data);
                } else {
                    console.log('error', result.message)
                }
            })
            .catch(error => {
                console.log('error', error)
            })
}

function load_data_to_table(result) {
    $("tbody").empty();

    data = result.data;
    page = result.page;
    console.log(page)
    $("#ContentPlaceHolder1_ddlRecordsPerPage").val(page.record_per_page)
    $("#current_page").text(page.current_page)
    $('#total_page').text(page.total_page)
    // Disabled First Page if current page = 1
    if ($("#current_page").text() == "1") {
        $(".page-item")[0].classList.add('disabled')
        $(".page-item")[1].classList.add('disabled')
    } else {
        $(".page-item")[0].classList.remove('disabled')
        $(".page-item")[1].classList.remove('disabled')
    }

    // Disabled Last Page if current page = lastpage
    if ($("#current_page").text() == page.total_page) {
        console.log("OK")
        $(".page-item")[3].classList.add('disabled')
        $(".page-item")[4].classList.add('disabled')
    } else {
        $(".page-item")[3].classList.remove('disabled')
        $(".page-item")[4].classList.remove('disabled')
        // $(".page-item")[4].removeAttr('onclick')
        // $(".page-item")[4].attr("onclick", loadBlocks(page.current_page + 1, record_per_page));
        // $(".page-item")[4].children[0].on("click", loadBlocks(page.current_page + 1, record_per_page));
    }

    for (let i = 0; i < data.length; i++) {
        try {
            if (data[i].input.address == selectedValue) {
                method = "Transfer";
            } else {
                method = "Deposit";
            }
        } catch {
            method="Transfer";
        }
        $("tbody").append(`
        <tr>
            
            <td>
                <a role="button" tabindex="0" type="button" class="js-txnAdditional-1 btn btn-xs btn-icon btn-soft-secondary myFnExpandBox"><i class="far fa-eye btn-icon__inner"></i></a>
            </td>
            <td>
                <span class="hash-tag text-truncate"><a href="/tx/${data[i].hash}" class="myFnExpandBox_searchVal">${data[i].hash}</a></span>
            </td>
            <td>
                <span style="min-width:68px;" class="u-label u-label--xs u-label--info rounded text-dark text-center" data-toggle="tooltip" data-boundary="viewport" data-html="true" title="" data-original-title="${method}">${method}</span>
            </td>
            <td class="d-none d-sm-table-cell">
                <a href="/blocks/">${data[i]._id.$oid}</a>
            </td>
            <td class="showDate " style="display:none !important; ">
                <span rel="tooltip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="12 secs ago">${convertTimestampToDate(data[i].input.timestamp)}</span>
            </td>
            <td style="" class="showAge ">
                <span rel="tooltip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="${convertTimestampToDate(data[i].input.timestamp)}">${convertTimestampToDate(data[i].input.timestamp)}</span>
            </td>

            <td>
                <a class="hash-tag text-truncate" href="/address/${data[i].input.address}" data-toggle="tooltip" data-boundary="viewport" data-html="true" title="" data-original-title="${data[i].input.address}">${data[i].input.address}</a>
            </td>
            <td class="text-center">
                <span class="btn btn-xs btn-icon btn-soft-success rounded-circle"><i class="fas fa-long-arrow-alt-right btn-icon__inner"></i></span>
            </td>

            <td>
                <span style="white-space: nowrap;"><i class="far fa-file-alt text-secondary" data-toggle="tooltip" title="" data-original-title="Contract"></i> <a class="hash-tag text-truncate" href="/address/${data[i].output.address}" data-boundary="viewport" data-html="true" data-toggle="tooltip" title="" data-original-title="${data[i].output.address}">${data[i].output.address}</a></span>
            </td>
            <td>
                CPU ${data[i].output.cpu}, RAM ${data[i].output.ram}, DISK ${data[i].output.disk}
            </td>
            <td style="" class="showTxnFee">
                <span class="small text-secondary">0</span>
            </td>
            <td style="display:none !important; " class="showGasPrice">
                <span class="small text-secondary">0</span>
            </td>

        </tr>
        `)
    }
}


function convertTimestampToDate(timestamp) {
    var utcTime = new Date(timestamp);
    var m = new Date(utcTime.toLocaleString())
    var dateString =
        m.getFullYear() + "/" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
        ("0" + m.getDate()).slice(-2) + " " +
        ("0" + m.getHours()).slice(-2) + ":" +
        ("0" + m.getMinutes()).slice(-2) + ":" +
        ("0" + m.getSeconds()).slice(-2);
    return dateString;
}