export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;
  const { $acquireTokenSilent } = useNuxtApp();
  const accessToken = (await $acquireTokenSilent())?.accessToken;
  const isAdminRoute = /admin/.test(to.name);
  if (isAdminRoute && !accessToken) {
    return navigateTo("/login");
  } else if (to.name === "login" && accessToken) {
    return navigateTo("/");
  } else {
    return;
  }
});
