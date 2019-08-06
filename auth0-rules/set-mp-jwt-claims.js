function (user, context, callback) {
    
    const jtiClaim = 'https://payara.fish/mp-jwt/' + 'jti';
    const groupsClaim = 'https://payara.fish/mp-jwt/' + 'groups';

    context.accessToken[jtiClaim] = require('uuid').v4();
    context.accessToken[groupsClaim] = user.roles;
    callback(null, user, context);
}