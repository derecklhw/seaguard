import { PublicClientApplication } from "@azure/msal-browser";
export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const msalConfig = {
    auth: {
      clientId: config.public.clientId,
      authority: config.public.authority,
      redirectUri: config.public.redirectUri,
    },
  };
  const msal = new PublicClientApplication(msalConfig);
  await msal.initialize();

  const login = async () => {
    let loginRequest = {
      scopes: ["user.read"],
    };
    try {
      let loginResponse = await msal.loginPopup(loginRequest);
      return loginResponse;
    } catch (err) {
      console.log(err);
    }
  };
  let tokenResponse;
  const acquireTokenSilent = async () => {
    const account = msal.getAllAccounts();
    if (account.length > 0) {
      let tokenRequest = {
        scopes: ["user.read"],
        account: account[0],
      };
      tokenResponse = await msal.acquireTokenSilent(tokenRequest);
      return tokenResponse;
    } else {
      return null;
    }
  };
  const getAccounts = () => {
    return msal.getAllAccounts();
  };
  const profileInfo = async () => {
    try {
      let payload = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });
      let json = await payload.json();
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const profileImg = async () => {
    try {
      let profileImageResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/photo/$value`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );
      let imageUrl;
      if (profileImageResponse.ok) {
        let blob = await profileImageResponse.blob();
        imageUrl = URL.createObjectURL(blob);
      } else {
        console.error(
          "Failed to fetch profile image:",
          profileImageResponse.statusText
        );
      }
      return { data: imageUrl, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  };
  const logout = async () => {
    const token = await acquireTokenSilent();
    const homeAccountId = token.account.homeAccountId;
    const currentAccount = msal.getAccount(homeAccountId);
    await msal.logoutRedirect({ account: currentAccount });
  };

  return {
    provide: {
      login,
      acquireTokenSilent,
      getAccounts,
      profileInfo,
      profileImg,
      logout,
    },
  };
});
