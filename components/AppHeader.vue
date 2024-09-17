<template>
  <header
    class="sticky top-0 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6 z-10"
  >
    <nav
      class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8"
    >
      <img src="/images/logo.png" alt="Logo" class="size-12" />
      <NuxtLink
        :to="localePath('/')"
        class="text-foreground transition-colors hover:text-foreground"
      >
        {{ $t("home") }}
      </NuxtLink>

      <NuxtLink
        :to="localePath('e-learning')"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        {{ $t("e-learning") }}
      </NuxtLink>
      <NuxtLink
        :to="localePath('map')"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        {{ $t("map") }}
      </NuxtLink>
      <NuxtLink
        :to="localePath('incidents')"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        {{ $t("incidents") }}
      </NuxtLink>
      <NuxtLink
        :to="localePath('donation')"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        {{ $t("donation") }}
      </NuxtLink>
      <p class="text-muted-foreground transition-colors hover:text-foreground">
        Quiz
      </p>
    </nav>
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="outline" size="icon" class="shrink-0 md:hidden">
          <IconMenu class="h-5 w-5" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav class="grid gap-6 text-lg font-medium">
          <img src="/images/logo.png" alt="Logo" class="size-12" />
          <SheetClose as-child>
            <NuxtLink :to="localePath('/')" class="hover:text-foreground">
              {{ $t("home") }}
            </NuxtLink>
          </SheetClose>
          <SheetClose as-child>
            <NuxtLink
              :to="localePath('e-learning')"
              class="text-muted-foreground hover:text-foreground"
            >
              {{ $t("e-learning") }}
            </NuxtLink>
          </SheetClose>
          <SheetClose as-child>
            <NuxtLink
              :to="localePath('map')"
              class="text-muted-foreground hover:text-foreground"
            >
              {{ $t("map") }}
            </NuxtLink>
          </SheetClose>
          <SheetClose as-child>
            <NuxtLink
              :to="localePath('incidents')"
              class="text-muted-foreground hover:text-foreground"
            >
              {{ $t("incidents") }}
            </NuxtLink>
          </SheetClose>
          <SheetClose as-child>
            <NuxtLink
              :to="localePath('donation')"
              class="text-muted-foreground hover:text-foreground"
            >
              {{ $t("donation") }}
            </NuxtLink>
          </SheetClose>
          <SheetClose as-child>
            <p class="text-muted-foreground hover:text-foreground">Quiz</p>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
    <div
      class="flex w-80 items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4"
    >
      <Button v-if="!store.getUserPrincipalName" @click="loginUser"
        >Login</Button
      >
      <DropdownMenu v-else>
        <DropdownMenuTrigger as-child>
          <Button variant="secondary" size="icon" class="rounded-full">
            <IconCircleUser class="h-5 w-5" />
            <span class="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <!-- <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem> -->
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="logout">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
<script setup>
const localePath = useLocalePath();
const { $login, $logout } = useNuxtApp();
const store = useProfileStore();

onMounted(async () => {});
const loginUser = async () => {
  clearSiteData();
  const loginResponse = await $login();
  if (loginResponse) reloadNuxtApp();
};
const logout = async () => {
  await $logout();
};
function clearSiteData() {
  document.cookie.split(";").forEach((cookie) => {
    const [name, _] = cookie.split("=").map((c) => c.trim());
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  store.clearProfile();
  localStorage.clear();
  sessionStorage.clear();
}
</script>
