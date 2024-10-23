const _defaultCashtags = ["dboi2lit", "aimeemartin83", "DougRaley", "rebeccakayknight", "DorkyDomains"];
let _cashtags;

function begin() {
    // Load the script dynamically with a cache buster
    var script = document.createElement('script');
    script.src = 'index.js?v=' + new Date().getTime();
    document.body.appendChild(script);

    // Add event listener for the submit button
    document.getElementById('submitButton').addEventListener('click', handleSubmit);

    // Add event listener for the Enter key on the input field
    document.getElementById('inputField').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });

    updateCashtagList();
}

function updateCashtagList() {
    let param = window.location.search.substring(1);
    if (param) {
        _cashtags = decodeCashtags(param);
    }
    else {
        _cashtags = _defaultCashtags;
        reloadPage();
    }
    _cashtags = param ? decodeCashtags(param) : _defaultCashtags;
    let cashtagList = document.getElementById('cashtagList');
    cashtagList.innerHTML = '<ul>' + _cashtags.slice(0, 5).map(cashtag => '<li>$' + cashtag + '</li>').join('') + '</ul>';
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

function encodeCashtags(cashtags) {
    const cashtagsString = cashtags.join('|');
    const encoded = btoa(cashtagsString);
    return reverseString(encoded);
}

function decodeCashtags(encodedString) {
    try {
        const reversed = reverseString(encodedString);
        const decoded = atob(reversed);
        return decoded.split('|');
    } catch (e) {
        return [];
    }
}

function handleSubmit() {
    let newCashtag = document.getElementById('inputField')
        .value
        .trim()
        .replace(/\$/g, ''); // Remove any $ signs

    if (newCashtag) {
        // Normalize both the cashtags and new entry to lowercase for comparison
        if (_cashtags.some(cashtag => cashtag.toLowerCase() === newCashtag.toLowerCase())) {
            alert("That cashtag is already on the list!");
            document.getElementById('inputField').value = ''; // Clear input field
        } else {
            _cashtags.push(newCashtag);

            if (_cashtags.length > 5) {
                _cashtags.shift();
            }

            reloadPage();

        }
    }
}

function reloadPage() {
    const encodedCashtags = encodeCashtags(_cashtags);
    const newUrl = window.location.pathname + '?' + encodedCashtags;
    location.replace(newUrl);
}
