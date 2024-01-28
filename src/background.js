import { setupUrlRecorderListener } from './url_recorder.js';
import { setupFormRecorderListener} from './form_recorder.js';

async function getManagedSettings() {
    console.log("inside getManagedSettings");
    return new Promise((resolve, reject) => {
        if (chrome.storage.managed == null) {
            return resolve(null);
        }

        chrome.storage.managed.get("settings", (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            console.log("Made it here at least");
            resolve(result.settings);
        });
    });
}

async function init() {
    console.log("Start Init");
    const settings = await getManagedSettings();
    setupUrlRecorderListener(settings);
    // TODO: Finish implementing this
    //setupFormRecorderListener(settings);
    console.log("End Init");
}

init();