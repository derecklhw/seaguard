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
        {{ $t("home.welcome_message") }}
        
      </h1>
      <Button size="lg" class="m-6 text-lg" @click="scrollTo('about-us')"
        >{{ $t("home.learn_more") }}</Button
      >
    </div>
    <div
      id="about-us"
      class="grid grid-cols-1 sm:grid-cols-2 items-center my-14 mx-8 md:mx-24"
    >
      <div>
        <h2 class="text-3xl md:text-4xl font-bold uppercase">{{ $t("home.about_us") }}</h2>
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
      <h2 class="text-3xl md:text-4xl font-bold uppercase">{{ $t("home.features") }}</h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-16 w-10/12 mt-14"
      >
        <Card>
          <CardContent
            class="bg-DAEDFF hover:bg-DAEDFF/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('map'))"
          >
            <IconMapInformation class="size-12 m-3" />
            <span class="text-2xl font-semibold">{{ $t("home.map") }}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-A4C8F9 hover:bg-A4C8F9/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('e-learning'))"
          >
            <IconLaptop class="size-12 m-3" />
            <span class="text-2xl font-semibold">{{ $t("home.e-learning") }}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-5C98CC hover:bg-5C98CC/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('incident-reporting'))"
          >
            <IconDangerOutline class="size-12 m-3" />
            <span class="text-2xl font-semibold">{{ $t("home.incident-reporting") }}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-4E6D98 hover:bg-4E6D98/90 flex flex-col aspect-video items-center justify-center text-center p-6 cursor-pointer"
            @click="$router.push(localePath('donation'))"
          >
            <IconMoneyBag class="size-12 m-3" />
            <span class="text-2xl font-semibold">{{ $t("home.donation") }}</span>
          </CardContent>
        </Card>
      </div>
    </div>
    <div class="flex flex-col items-center my-14">
      <h2 class="text-3xl md:text-4xl font-bold uppercase">{{ $t("home.interactive_map") }}</h2>
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
          {{ $t("home.interactive_map_text") }}
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
      <h2 class="text-3xl md:text-4xl font-bold uppercase">{{ $t("home.incident-reporting") }}</h2>
      <div
        v-if="incidents.length <= 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-16 w-11/12 md:w-10/12 mt-12"
      >
        <Card
          v-for="n in 3"
          :key="n"
          class="flex flex-col aspect-square items-center justify-center text-center p-6 border-A4C8F9 border-solid"
        >
          <CardHeader>
            <Skeleton class="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-[125px] w-[250px] rounded-xl" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-[250px]" />
              <Skeleton class="h-4 w-[200px]" />
            </div>
          </CardContent>
          <CardFooter class="flex items-center space-x-2 text-4E6D98">
            <Skeleton class="h-4 w-[250px]" />
          </CardFooter>
        </Card>
      </div>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-16 w-11/12 md:w-10/12 mt-12"
      >
        <Card
          v-for="incident in incidents"
          :key="incident.id"
          class="flex flex-col aspect-square items-center justify-center text-center p-6 border-A4C8F9 border-solid"
        >
          <CardHeader>
            <h3 class="text-lg font-bold">{{ incident.Title }}</h3>
          </CardHeader>
          <CardContent>
            <p>
              {{ incident.Description }}
            </p>
          </CardContent>
          <CardFooter class="flex items-center space-x-2 text-4E6D98">
            <span
              :class="{
                'bg-green-500': incident.Status === 'Resolved',
                'bg-yellow-500': incident.Status === 'Pending',
                'bg-red-500': incident.Status === 'Critical',
              }"
              class="h-2 w-2 rounded-full"
            />
            <p>
              Posted {{ getRelativeTime(incident.Timestamp) }} -
              {{ incident.Status }}
            </p>
          </CardFooter>
        </Card>
      </div>
      <Button
        size="lg"
        class="mt-12 text-md md:text-lg"
        @click="$router.push(localePath('incident-reporting'))"
        >{{ $t("home.incident-reporting") }}</Button
      >
    </div>
    <div class="flex flex-col items-center mt-10 py-8">
      <h2 class="text-3xl md:text-4xl font-bold uppercase">
        {{ $t("home.donation") }}
      </h2>
      <Progress v-model="progress" class="w-4/5 md:w-3/5 my-16" />
      <div class="flex w-4/5 md:w-3/5 justify-around mb-16">
        <div class="text-center">
          <p class="font-bold md:text-2xl">Rs 0.00</p>
          <p class="md:text-xl">{{ $t("home.donation.raised") }}</p>
        </div>
        <div class="text-center">
          <p class="font-bold md:text-2xl">0</p>
          <p class="md:text-xl">{{ $t("home.donation") }}</p>
        </div>
        <div class="text-center">
          <p class="font-bold md:text-2xl">Rs 20,000</p>
          <p class="md:text-xl">{{ $t("home.donation.goal") }}</p>
        </div>
      </div>
      <Button
        size="lg"
        class="text-md md:text-lg"
        @click="$router.push(localePath('donation'))"
        >{{ $t("home.donation.now") }}</Button
      >
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect, onMounted } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const localePath = useLocalePath();
const progress = ref(13);
const incidents = ref([]);
dayjs.extend(relativeTime);

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => (progress.value = 0), 500);
  cleanupFn(() => clearTimeout(timer));
});
const scrollTo = (id) => {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
};
onMounted(async () => {
  // TODO: need to cater for the case where there are no incidents
  const response = await $fetch("/api/get-incidents");
  if (response.success) {
    // sort the incidents by timestamp in descending order
    response.message.recordset.sort((a, b) => b.Timestamp - a.Timestamp);
    incidents.value = response.message.recordset.slice(0, 3);
  }
});

// Function to calculate the time difference in a human-readable format
const getRelativeTime = (timestamp) => {
  const incidentDate = dayjs.unix(timestamp);
  return incidentDate.fromNow();
};
</script>
<style lang="scss" scoped></style>
