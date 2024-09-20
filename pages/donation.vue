<template>
  <div class="mt-6 flex justify-center items-center w-full">
    <div class="bg-full-page rounded-2xl h-full lg:h-5/12">
      <div class="block">
        <h1 class="font-mono text-lg lg:text-4xl font-semibold lg:font-medium text-center mb-5
        ">Welcome to SeaGuard Donation Page</h1>
        <p class="font-mono text-sm lg:text-base text-center lg:mb-24
        ">Together we can save our marine freinds with a simple donation.</p>
        <div class="flex flex-col lg:flex-row lg:m-10 items-center justify-center mt-5 lg:mt-36">
          <DonationCards class="my-3 mx-10 lg:my-0" murAmount="100.00" priceId="price_1Q0qZqIhTzcXEuxzZduuijl1" />
          <DonationCards class="my-3 mx-10 lg:my-0" murAmount="500.00" priceId="price_1Q0qa3IhTzcXEuxzrKIiyXNr" />
          <DonationCards class="my-3 mx-10 lg:my-0" murAmount="1,000.00" priceId="price_1Q0qaIIhTzcXEuxzmR39qPaW" />
        </div>
      </div>
  </div>
  </div>
  
</template>


<style scoped>
.bg-full-page {
  background-image: url('/images/sea_donation.jpeg');
  background-size: cover;
  background-position: center;
  filter: grayscale(30%); 
  background-repeat: no-repeat; 
  height: 100vh;             
  width: 90vw;             
  justify-content: center;     
  align-items: center;     
  display: flex;                       
  position: relative;
  overflow: hidden;
  flex-grow: auto;
}

@media (min-width: 1150px) {
  .bg-full-page {
    height: 70vh; /* Height for screens above 1600px */
  }
}
</style>