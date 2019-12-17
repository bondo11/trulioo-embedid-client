/*! trulioo-js  */
window.addEventListener("DOMContentLoaded", function () {
    const element = document.createElement('iframe');
    element.setAttribute('id', 'embedid-module');
    element.setAttribute('src', "http://localhost:8855/embedid/PQoy64YSbLQR25aJ");
    document.getElementById('trulioo-embedid').appendChild(element);

    window.addEventListener('message', async (e) => {
        if (e.origin === 'http://localhost:8855') {
            const response = await axios.get('http://localhost:3222/generateAccessToken');
            const accessToken = JSON.parse(response.data.AccessToken);
            //console.log('Sending Access Access Token fron client to EmbedID-BE:', accessToken);
            //e.source.postMessage(`Ihackedyou;D`, '*');
            e.source.postMessage(`${accessToken}`, '*');
        }
    });

    const embedIDModule = document.getElementById("embedid-module");
    embedIDModule.style.width = "100%";
    embedIDModule.style.height = "100%";
    embedIDModule.border = "none";

}, false);