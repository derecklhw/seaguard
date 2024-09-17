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
      <h1 class="text-3xl md:text-5xl uppercase font-extrabold">
        Welcome to Seaguard
      </h1>
      <Button size="lg" class="m-6" @click="scrollTo('about-us')"
        >Learn more about us!</Button
      >
    </div>
    <div
      id="about-us"
      class="grid grid-cols-1 md:grid-cols-2 items-center my-14 mx-8 md:mx-24"
    >
      <div>
        <h2 class="text-3xl md:text-4xl font-bold uppercase">About us</h2>
        <p class="text-xl md:text-2xl my-2 leading-relaxed">
          {{ $t("home.about_us_text") }}
        </p>
      </div>
      <div
        class="relative w-11/12 md:w-1/2 aspect-square max-w-s mx-auto mt-6 md:mt-0"
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
    <div id="features" class="flex flex-col items-center">
      <h2 class="text-3xl md:text-4xl font-bold uppercase">Our Features</h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-16 w-9/12 my-10"
      >
        <Card>
          <CardContent
            class="bg-DAEDFF hover:bg-DAEDFF/90 flex aspect-square items-center justify-center text-center p-6 cursor-pointer"
          >
            <span class="text-2xl font-semibold">Interactive Map</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-A4C8F9 hover:bg-A4C8F9/90 flex aspect-square items-center justify-center text-center p-6 cursor-pointer"
          >
            <span class="text-2xl font-semibold">E-Learning Platform</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-5C98CC hover:bg-5C98CC/90 flex aspect-square items-center justify-center text-center p-6 cursor-pointer"
          >
            <span class="text-2xl font-semibold">Incident Reporting</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            class="bg-4E6D98 hover:bg-4E6D98/90 flex aspect-square items-center justify-center text-center p-6 cursor-pointer"
          >
            <span class="text-2xl font-semibold">E-Learning Platform</span>
          </CardContent>
        </Card>
      </div>
      <!-- <Carousel
        class="relative w-full max-w-5xl my-10"
        :opts="{
          align: 'start',
        }"
      >
        <CarouselContent>
          <CarouselItem class="md:basis-1/2 lg:basis-1/4">
            <div class="p-1">
              <Card>
                <CardContent
                  class="flex aspect-square items-center justify-center text-center p-6"
                >
                  <span class="text-2xl font-semibold">Interactive Map</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/4">
            <div class="p-1">
              <Card>
                <CardContent
                  class="flex aspect-square items-center justify-center text-center p-6"
                >
                  <span class="text-2xl font-semibold"
                    >E-Learning Platform</span
                  >
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/4">
            <div class="p-1">
              <Card>
                <CardContent
                  class="flex aspect-square items-center justify-center text-center p-6"
                >
                  <span class="text-2xl font-semibold">Incident Reporting</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/4">
            <div class="p-1">
              <Card>
                <CardContent
                  class="flex aspect-square items-center justify-center text-center p-6"
                >
                  <span class="text-2xl font-semibold">Donation Platform</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> -->
    </div>
  </div>
</template>
<script setup>
const scrollTo = (id) => {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
};
</script>
<style lang="scss" scoped></style>
