/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://digital-defiance-dev.us.auth0.com/';

  // Check if the user has roles in app_metadata or user_metadata
  let roles = [];
  if (event.user.app_metadata && event.user.app_metadata.roles) {
    roles = event.user.app_metadata.roles;
  } else if (event.user.user_metadata && event.user.user_metadata.roles) {
    roles = event.user.user_metadata.roles;
  }
  console.log(event.user.app_metadata.roles);
  console.log(event.user.user_metadata.roles);
  console.log(roles);

  // Append roles to the ID and/or Access Token
  api.idToken.setCustomClaim(namespace + 'roles', roles);
  api.accessToken.setCustomClaim(namespace + 'roles', roles);
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
