/*! trulioo-js  */
import TruliooClient from './TruliooClient.js';

// const truliooClient = new TruliooClient(
//     "PQoy64YSbLQR25aJ",
//     "http://localhost:3222/generateAccessToken"
// );
 
window.truliooClient = new TruliooClient();
window.TruliooClient = TruliooClient;

window.addEventListener("DOMContentLoaded", function () {
    console.log('CURRENT VALUES:', truliooClient)
    const embedIDBackendURL = "http://localhost:8855/embedid/";
    const element = document.createElement('iframe');
    element.setAttribute('id', 'embedid-module');
    element.setAttribute('src', `${embedIDBackendURL}${truliooClient.publicKey}`);
    document.getElementById('trulioo-embedid').appendChild(element);

    window.addEventListener('message', async (e) => {
        const originURL = 'http://localhost:8855'; //embedID BE URL
        if (e.origin === originURL) {
            const response = await fetch(`${truliooClient.accessTokenGeneratorURL}`);
            const accessToken = JSON.parse(response.data.AccessToken);
            //console.log('Sending Access Access Token fron client to EmbedID-BE:', accessToken);
            //e.source.postMessage(`Ihackedyou;D`, '*');
            //TODO change
            e.source.postMessage(`${accessToken}`, '*');
        }
    });

    const embedIDModule = document.getElementById("embedid-module");
    embedIDModule.style.width = "100%";
    embedIDModule.style.height = "100%";
    embedIDModule.border = "none";
}, false);