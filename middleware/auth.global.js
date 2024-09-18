export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;
  const { $acquireTokenSilent } = useNuxtApp();
  const accessToken = (await $acquireTokenSilent())?.accessToken;

  if (/admin/.test(to.name) && !accessToken) {
    return navigateTo("/login");
  } else if (/login/.test(to.name) && accessToken) {
    return navigateTo("/");
  } else {
    return;
  }
});
