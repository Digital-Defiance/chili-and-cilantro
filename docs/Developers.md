# Developers

## Development Environment

This game is best developed using the included Visual Studio Code DevContainer. This will ensure that all dependencies are installed and configured correctly.

Open the project in Visual Studio Code, and you should be prompted to open the project in a DevContainer- Don't do this right away if you haven't yet configured your .env for the devcontainer. Under .devcontainer, copy .env.example to .env and update the values to suit your needs. You can run ```npm run new:secret``` to generate a new database secret. You'll want to copy the other .env.example file under chili-and-cilantro-api with matching values. Once you have modified the environment configuration files, you can open the command palette and search for "Reopen in Container". (control+shift+p)

  If you wish to change the database password later, you'll need to delete the mongo volume in Docker Desktop and restart the container.

Once you have reopened the project in the DevContainer, you'll have a running mongo instance available on localhost:27017 and your application will be able to use it. The DevContainer will automatically run yarn install for you and this will take a few minutes the first time you load the container. Once it is done you can run ```yarn build-serve:dev``` to build the shared library, react app, and run the node api server in development mode. The application will be available at localhost:3000.

See the root package.json for additional commands available to you. ```yarn serve:dev``` will just build and serve the node portion if the library and react apps are unchanged.

## Application Structure

This project is an [NX](https://nx.dev) monorepo. The root package.json contains scripts for building and serving the shared library, react app, and node api server. The shared library is a collection of common types and functions that are used by both the react app and the node api server. The react app is a standard create-react-app application. The node api server is a standard express application.

In the root directory, there are sub-directories for the API, shared library, and react application under chili-and-cilantro-api, chili-and-cilantro-lib, and chili-and-cilantro-react, respectively. Additionally there are -e2e variants of the api and react application intended for end-to-end testing. These are not currently used.

The library has the mongoose schema and model definitions, as well as the typescript interfaces for the models. We have built a custom model framework underneath src/lib/models/BaseModel.ts and we have a custom schema class that references all of the models under src/schema.ts. The model descriptions, etc are in src/lib/schemaModelData.ts. If you add a new model, it must also be added to the ModelName enum in src/lib/enumerations/modelName.ts and src/lib/enumerations/modelNameCollection.ts which has the collection name. The model name is used to reference the model in the schema and the collection name is used to reference the collection in the database. BaseModel.getModel is then used to retrieve the model from the schema.

The interfaces are in the library so that we can reference the model interfaces from the front end to deal with retrieved documents, but the front end doesn't need to know about the schema, however it made sense to leave it all together in the library. In general we have tried to put everything in the library rather than leaving them in the API server or react application.