<template>
    <Card class=" w-64 h-44 2xl:w-96 2xl:h-80 md:w-72 md:h-64 rounded-3xl text-center">
      <CardHeader>
        <CardTitle>Donation Amount</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="md:text-lg md:mt-5 md:mb-5 2xl:text-3xl 2xl:mt-14 2xl:mb-10">Rs {{ murAmount }}</p>
      </CardContent>
      <CardFooter class="justify-center">
          <Button @click="createCheckoutSession">Donate</Button>
      </CardFooter>
    </Card>
  </template>
  
  <script setup>
    import { useFetch } from '#app';
    import { defineProps } from 'vue';
  
    const props = defineProps({
      murAmount: {
        type: String,
        required: true
      },
      priceId: {
        type: String,
        required: true
      }
    });
  
    const createCheckoutSession = async () => {
      try {
        const { data, error } = await useFetch('/api/checkout-session', {
          method: 'POST',
          body: {
            Id: props.priceId,
          },
        });
    
        if (error.value) {
          console.error('Error creating checkout session:', error.value);
        } else {
          window.location.href = data.value.url; 
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };
  </script>
  