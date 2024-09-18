<template>
  <div>
    <div
      class="bg-cover bg-center h-screen flex flex-col justify-center items-center"
      style="
        background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.5),
            transparent
          ),
          url('/images/home_hero.png');
      "
    >
      <h1 class="text-2xl sm:text-3xl md:text-5xl uppercase font-extrabold">
        Welcome to Seaguard
      </h1>
      <Button size="lg" class="m-6 text-lg" @click="scrollTo('about-us')"
        >Learn more about us!</Button
      >
    </div>
    <div
      id="about-us"
      class="grid grid-cols-1 sm:grid-cols-2 items-center my-14 mx-8 md:mx-24"
    >
      <div>
        <h2 class="text-3xl md:text-4xl font-bold uppercase">About us</h2>
        <p class="text-xl md:text-2xl my-2 leading-relaxed">
          {{ $t("home.about_us_text") }}
        </p>
      </div>
      <div
        class="relative w-11/12 sm:w-10/12 lg:w-3/4 xl:w-1/2 aspect-square max-w-s mx-auto mt-6 md:mt-0"
      >
        <div class="absolute top-0 left-0 w-2/3 h-2/3 z-0">
          <img
            src="/images/home_dolphin.jpg"
            alt="Dolphins jumping"
            class="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div class="absolute bottom-0 right-0 w-2/3 h-2/3 z-0">
          <img
            src="/images/home_whale.jpg"
            alt="Whales swimming"
            class="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center my-14">
      <h2 class="text-3xl md:text-4xl font-bold uppercase">Our Features</h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-16 w-10/12 mt-14"
      >
        <Card>
          <CardContent
            class="bg-DAEDFF hover:bg-DAEDFF/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('map'))"
          >
            <IconMapInformation class="size-12 m-3" />
            <span class="text-2xl font-semibold">Interactive Map</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-A4C8F9 hover:bg-A4C8F9/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('e-learning'))"
          >
            <IconLaptop class="size-12 m-3" />
            <span class="text-2xl font-semibold">E-Learning Platform</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-5C98CC hover:bg-5C98CC/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('incidents'))"
          >
            <IconDangerOutline class="size-12 m-3" />
            <span class="text-2xl font-semibold">Incident Reporting</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-4E6D98 hover:bg-4E6D98/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('donation'))"
          >
            <IconMoneyBag class="size-12 m-3" />
            <span class="text-2xl font-semibold">Donation Platform</span>
          </CardContent>
        </Card>
      </div>
    </div>
    <div class="flex flex-col items-center my-14">
      <h2 class="text-3xl md:text-4xl font-bold uppercase">Interactive Map</h2>
      <div
        class="bg-cover bg-center w-screen flex flex-col justify-center items-center mt-10"
        style="
          height: 36rem;
          background-image: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.85),
              transparent
            ),
            url('/images/home_interactive_map.png');
        "
      >
        <p class="w-10/12 md:w-2/5 text-lg md:text-xl font-bold text-center">
          Navigate Mauritius’ waters with our Interactive Map, featuring red and
          yellow zones to indicate restricted areas. Skippers can log boat
          details, including time-in and time-out, and track their location
          safely.
        </p>
        <Button
          size="lg"
          class="m-6 text-md md:text-lg"
          @click="$router.push(localePath('map'))"
          >Check Zones Colors</Button
        >
      </div>
    </div>
    <div class="flex flex-col items-center my-14">
      <h2 class="text-3xl md:text-4xl font-bold uppercase">Incident Reports</h2>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-16 w-11/12 md:w-10/12 mt-12"
      >
        <Card
          class="flex flex-col aspect-square items-center justify-center text-center p-6 border-A4C8F9 border-solid"
        >
          <CardHeader>
            <h3 class="text-lg font-bold">Incident 1</h3>
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consectetur ea, dolorum distinctio ipsum ex maiores. Error
              incidunt aliquam numquam exercitationem, unde, autem tenetur
              temporibus est a, impedit sapiente delectus veritatis!
            </p>
          </CardContent>
          <CardFooter class="flex items-center space-x-2 text-4E6D98">
            <span class="h-2 w-2 rounded-full bg-green-500" />
            <p>Posted 2 hours ago - resolved</p>
          </CardFooter>
        </Card>
        <Card
          class="flex flex-col aspect-square items-center justify-center text-center p-6 border-A4C8F9 border-solid"
        >
          <CardHeader>
            <h3 class="text-lg font-bold">Incident 2</h3>
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consectetur ea, dolorum distinctio ipsum ex maiores. Error
              incidunt aliquam numquam exercitationem, unde, autem tenetur
              temporibus est a, impedit sapiente delectus veritatis!
            </p>
          </CardContent>
          <CardFooter class="flex items-center space-x-2 text-4E6D98">
            <span class="h-2 w-2 rounded-full bg-yellow-500" />
            <p>Posted 3 hours ago - pending</p>
          </CardFooter>
        </Card>
        <Card
          class="flex flex-col aspect-square items-center justify-center text-center p-6 border-A4C8F9 border-solid"
        >
          <CardHeader>
            <h3 class="text-lg font-bold">Incident 3</h3>
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consectetur ea, dolorum distinctio ipsum ex maiores. Error
              incidunt aliquam numquam exercitationem, unde, autem tenetur
              temporibus est a, impedit sapiente delectus veritatis!
            </p>
          </CardContent>
          <CardFooter class="flex items-center space-x-2 text-4E6D98">
            <span class="h-2 w-2 rounded-full bg-yellow-500" />
            <p>Posted 4 hours ago - pending</p>
          </CardFooter>
        </Card>
      </div>
      <Button
        size="lg"
        class="mt-12 text-md md:text-lg"
        @click="$router.push(localePath('incidents'))"
        >Report an incident</Button
      >
    </div>
    <div class="flex flex-col items-center mt-10 py-8">
      <h2 class="text-3xl md:text-4xl font-bold uppercase">
        Donation Platform
      </h2>
      <Progress v-model="progress" class="w-4/5 md:w-3/5 my-16" />
      <div class="flex w-4/5 md:w-3/5 justify-around mb-16">
        <div class="text-center">
          <p class="font-bold md:text-2xl">$101,173.29</p>
          <p class="md:text-xl">Raised</p>
        </div>
        <div class="text-center">
          <p class="font-bold md:text-2xl">1,173</p>
          <p class="md:text-xl">Donations</p>
        </div>
        <div class="text-center">
          <p class="font-bold md:text-2xl">$200,000.00</p>
          <p class="md:text-xl">Goal</p>
        </div>
      </div>
      <Button
        size="lg"
        class="text-md md:text-lg"
        @click="$router.push(localePath('donation'))"
        >Donate now</Button
      >
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect, onMounted } from "vue";
const localePath = useLocalePath();
const progress = ref(13);

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => (progress.value = 66), 500);
  cleanupFn(() => clearTimeout(timer));
});
const scrollTo = (id) => {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
};
onMounted(async () => {});
</script>
<style lang="scss" scoped></style>
