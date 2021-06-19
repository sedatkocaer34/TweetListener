const needle = require('needle');
const token = "AAAAAAAAAAAAAAAAAAAAAId4PQEAAAAAodThV09XPsgy1VsVX3VG8cB6JO4%3Drx8b9htZMbQSsrCmiY7CnK0Fp2FoRhJFe2DOwlqAuKktm6BM3a";
const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

function addRules(ruleList)
{
    const rules=[];
    for (let index = 0; index < ruleList.length; index++) {
        const element = ruleList[index];
        const addValue ={'value': `from:${element.from} ${element.text}`,'tag': `${element.tag}`};
        rules[index]=addValue;
    }
    return rules;
}

async function getAllRules() {
    const response = await needle('get', rulesURL, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        console.log("Error:", response.statusMessage, response.statusCode)
        throw new Error(response.body);
    }

    return (response.body);
}

async function deleteAllRules(rules) {

    if (!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);

}

async function setRules(ruleList) {

    const data = {
        "add": addRules(ruleList)
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 201) {
        throw new Error(response.body);
    }

    return (response.body);

}

function streamConnect(retryAttempt,socket) {

    const stream = needle.get(streamURL, {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            "Authorization": `Bearer ${token}`
        },
        timeout: 20000
    });

    stream.on('data', data => {

        try {

            const json = JSON.parse(data);
            console.log(json);
            socket.sockets.emit("newTweet",{title:json.matching_rules[0].tag + " " + " has a new tweet.",
            message:json.matching_rules[0].tag + ":" +json.data.text} );
            retryAttempt = 0;
            
        } catch (e) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
            } else {
                
            }
        }

    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            process.exit(1);
        } else {
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                streamConnect(++retryAttempt,socket);
            }, 2 ** retryAttempt)
        }
    });

    return stream;
}


 exports.startStream = async function(ruleList,socket)  {
    let currentRules;

    try {
        currentRules = await getAllRules();

        await deleteAllRules(currentRules);

        await setRules(ruleList);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    return streamConnect(1,socket);
};