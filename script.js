//import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";

async function set_checkpoint_1() {
  const res = await fetch ("https://api.coronavirus.data.gov.uk/v1/data");
  const record = await res.json();
  console.log(record);
  document.getElementById("checkpoint1").innerHTML=record.data[0].date;
}
set_checkpoint_1();

//const importUMD = async (url, module = {exports:{}}) =>
  //(Function('module', 'exports', await (await fetch(url)).text()).call(module, module, module.exports), module).exports



async function login1() {
  // 1. Call the handleIncomingRedirect() function,
  //    - Which completes the login flow if redirected back to this page as part of login; or
  //    - Which is a No-op if not part of login.
  await solidClientAuthentication.handleIncomingRedirect();
  document.getElementById("checkpoint2").innerHTML='handle incoming redirect passing';
  // 2. Start the Login Process if not already logged in.
  try{
  if (!solidClientAuthentication.getDefaultSession().info.isLoggedIn) {
    await solidClientAuthentication.login({
      oidcIssuer: "https://login.inrupt.com",
      //oidcIssuer:"http://localhost:3004",
      redirectUrl: window.location.href,
      clientName: "Papaya Chrome Extension"
    });
  }
  document.getElementById("checkpoint3").innerHTML='logged in';
  }
  catch(e) {
    document.getElementById("checkpoint3").innerHTML=e.stack;
  }

  
  
  const script2 = document.createElement('script');
  script2.type = 'text/javascript';
  script2.src = 'https://cdn.jsdelivr.net/gh/rammkripa/solid-client-js/solid-client-bundle.js';
  script2.onload = accessData;
  document.head.appendChild(script2);
}

async function accessData() {
  // READING
  const webID = await solidClientAuthentication.getDefaultSession().info.webId;
  document.getElementById("webID").innerHTML=webID;
  const webIDrelatedPodUrl = await solidClient.getPodUrlAll(webID, {fetch: fetch});
  document.getElementById("podUrl").innerHTML = webIDrelatedPodUrl;
  const pod1 = webIDrelatedPodUrl;
  const exampleSolidDatasetURL = pod1 + 'papaya/chromeExtension/data/test';
  document.getElementById("datasetName").innerHTML = exampleSolidDatasetURL;
  // CREATE NEW SOLID DATASET
  let PersonPapayaSolidDataset = solidClient.createSolidDataset();
  document.getElementById("checkpoint4").innerHTML = 'create dataset';
  // add some random thing to the dataset
  const newBookThing1 = await solidClient.buildThing(solidClient.createThing({ name: "book1" }))
  .addStringNoLocale("https://schema.org/name", "ABC123 of Example Literature")
  .addUrl("http://www.w3.org/2000/01/rdf-schema#Datatype", "https://schema.org/Book")
  .build();           
  document.getElementById("checkpoint5").innerHTML = 'create thing';
  PersonPapayaSolidDataset = solidClient.setThing(PersonPapayaSolidDataset, newBookThing1);
  document.getElementById("checkpoint6").innerHTML = 'set thing';

  // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
  // For example, the user must be someone with Read access to the specified URL.
  // SAVE DATASET
  try {
  
  const savedSolidDataset = await solidClient.saveSolidDatasetAt(
    exampleSolidDatasetURL,
    PersonPapayaSolidDataset,
    {fetch: fetch}// fetch function from authenticated session
  );
  document.getElementById("checkpoint7").innerHTML = 'save dataset passing?';
  }
  catch(e) {
    document.getElementById("checkpoint7").innerHTML = e.stack;
  }

}

const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://cdn.jsdelivr.net/npm/@inrupt/solid-client-authn-browser@1.12.2/dist/solid-client-authn.bundle.js';
script.onload = login1;
document.head.appendChild(script);
