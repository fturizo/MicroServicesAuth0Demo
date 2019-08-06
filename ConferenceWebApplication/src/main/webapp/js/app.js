// The Auth0 client, initialized in configureClient()
let auth0 = null;

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
    try {
        console.log("Logging in", targetUrl);
        const options = {
            redirect_uri: window.location.origin
        };
        if (targetUrl) {
            options.appState = {targetUrl};
        }

        await auth0.loginWithRedirect(options);
    } catch (err) {
        console.log("Log in failed", err);
    }
};

/**
 * Executes the logout flow
 */
const logout = () => {
    try {
        console.log("Logging out");
        auth0.logout({
            returnTo: window.location.origin
        });
    } catch (err) {
        console.log("Log out failed", err);
    }
};

/**
 * Retrieves the Auth0 configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth0-config.json");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience
    });
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        return fn();
    }
    return login(targetUrl);
};

const fetchWithAuth = async (url, options) => {
    const token = await auth0.getTokenSilently();
    var init = options || {headers: {}};
    init.headers = Object.assign({
        Authorization: `Bearer ${token}`
    }, init.headers);
    return fetch(url, init);
};

// Will run when page finishes loading
window.onload = async () => {
    await configureClient();

    // If unable to parse the history hash, default to the root URL
    if (!showContentFromUrl(window.location.pathname)) {
        showContentFromUrl("/");
        window.history.replaceState({url: "/"}, {}, "/");
    }

    // Listen out for clicks on any hyperlink that navigates to a #/ URL
    $("body").click(e => {
        if (isRouteLink(e.target)) {
            const url = e.target.getAttribute("href");

            if (showContentFromUrl(url)) {
                e.preventDefault();
                window.history.pushState({url}, {}, url);
            }
        } else if (e.target.getAttribute("id") === "add-session") {
            e.preventDefault();
            addNewSession();
        } else if (e.target.getAttribute("id") === "show-register-speaker") {
            e.preventDefault();
            showRegisterSpeaker();
        } else if (e.target.getAttribute("id") === "register-speaker") {
            e.preventDefault();
            registerSpeaker();
        }
    });

    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        window.history.replaceState({}, document.title, window.location.pathname);
        updateUI();
        return;
    }

    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");

    if (shouldParseResult) {
        console.log("> Parsing redirect");
        try {
            const result = await auth0.handleRedirectCallback();

            if (result.appState && result.appState.targetUrl) {
                showContentFromUrl(result.appState.targetUrl);
            }

            console.log("Logged in!");
        } catch (err) {
            console.log("Error parsing redirect:", err);
        }

        window.history.replaceState({}, document.title, "/");
    }
    updateUI();
};
