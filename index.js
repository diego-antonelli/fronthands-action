const core = require("@actions/core");
const { o } = require("o.js");
const { xml2js } = require("xml-js");

const amount = core.getInput("amount");
const country = core.getInput("country");

async function main(){
    const handler = o("https://hrsampleapp.mendixcloud.com/odata/PubOdataEmployeeDirectory/v1/");
    const data = await (await handler
        .get("Employees")
        .fetch({
            $top: Number(amount),
            $filter: `country eq '${country}'`
        } ))
        .text();

    if (data) {
        const resultJson = xml2js(data, { compact: true, spaces: 4 });
        if(resultJson.feed && Array.isArray(resultJson.feed.entry)) {
            const employees = convertXmlObjectToObject(resultJson.feed.entry.map(entry => entry.content));
            core.info(JSON.stringify(employees));
            core.setOutput("employees", employees);
        } else {
            core.setOutput("employees", []);
        }
    }else{
        throw new Error("Data not found");
    }
}

function convertXmlObjectToObject(entries){
    return entries.map(e => e["m:properties"]).map(entry => ({
        firstName: entry["d:firstName"]._text,
        lastName: entry["d:lastName"]._text,
        email: entry["d:email"]._text,
        phone: entry["d:phone"]._text,
        zip: entry["d:zip"]._text,
        country: entry["d:country"]._text,
    }))
}

if(amount && country) {
    main().catch(err => core.setFailed(err.message));
} else {
    if (!amount) {
        core.setFailed("Missing required attribute 'amount'");
    }
    if (!country) {
        core.setFailed("Missing required attribute 'country'");
    }
}
