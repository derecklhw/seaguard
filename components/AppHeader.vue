<template>
  <header
    class="sticky top-0 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6"
  >
    <nav
      class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8"
    >
      <img src="/images/logo.png" alt="Logo" class="h-12 w-12" />
      <NuxtLink
        :to="localePath('/')"
        class="text-foreground transition-colors hover:text-foreground"
      >
        Home
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
      <a
        href="#"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        Incidents
      </a>
      <a
        href="#"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        Donation
      </a>
      <a
        href="#"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        Quiz
      </a>
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
          <img src="/images/logo.png" alt="Logo" class="h-12 w-12" />
          <span class="sr-only">Acme Inc</span>

          <a href="#" class="hover:text-foreground"> Home </a>
          <a href="#" class="text-muted-foreground hover:text-foreground">
            E-Learning
          </a>
          <a href="#" class="text-muted-foreground hover:text-foreground">
            Map
          </a>
          <a href="#" class="text-muted-foreground hover:text-foreground">
            Incidents
          </a>
          <a href="#" class="text-muted-foreground hover:text-foreground">
            Donation
          </a>
          <a href="#" class="text-muted-foreground hover:text-foreground">
            Quiz
          </a>
        </nav>
      </SheetContent>
    </Sheet>
    <div
      class="flex w-80 items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4"
    >
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="secondary" size="icon" class="rounded-full">
            <IconCircleUser class="h-5 w-5" />
            <span class="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
<script setup>
const localePath = useLocalePath();
</script>
