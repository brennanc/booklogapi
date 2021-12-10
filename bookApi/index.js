const { TableServiceClient } = require("@azure/data-tables");
const { DefaultAzureCredential } = require("@azure/identity");

// DefaultAzureCredential expects the following three environment variables:
// - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
// - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
// - AZURE_CLIENT_SECRET: The client secret for the registered application
const credential = new DefaultAzureCredential();
const account = "booklogsa";

const clientWithAAD = new TableServiceClient(
  `https://${account}.table.core.windows.net`,
  credential
);

const tableName = "booklog";


module.exports = async function (context, req) {

    context.res = undefined;

    const method = req.method;
    const id = req.params.id;
    const name = (req.query.name || (req.body && req.body.name));

    let tablesIter = clientWithAAD.listTables();
    for await (const table of tablesIter) {
        console.log(`Table${i}: ${table.name}`);
        i++;
    }

    if (method === "GET") {
        context.log('Processed GET request');
        if (id) {
            context.log('with id ' + id);
        } else {
            context.log('for all');
        }
    } else if (method === "POST") {
        context.log('Processed POST request');
        if (id) {
            context.res = {
                status: 400
            };
        } else {
            context.log('for all');
        }
    }


    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    if (context.res == undefined) {
        context.log('setting default response');
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: responseMessage
        };
    }
};