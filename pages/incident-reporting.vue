<template>
  <div class="w-full flex justify-center">
    <!-- Loading Overlay -->
    <div
      v-if="extractionLoading"
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div
        class="bg-white p-4 rounded-md shadow-md flex flex-col items-center justify-center"
      >
        <p class="text-lg font-semibold">Extracting data...</p>
        <IconSpinner class="my-2" />
      </div>
    </div>
    <!-- Main Content -->
    <Card class="md:w-7/12">
      <CardHeader>
        <CardTitle>Incident Reporting</CardTitle>
        <CardDescription
          >Provide a brief title for the incident you're
          reporting.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <!-- TODO: Add time picker -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="col-span-1 md:col-span-2 space-y-6">
              <FormField v-slot="{ componentField }" name="date">
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="summary">
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summary of incident"
                      v-bind="componentField"
                      class="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div
              class="col-span-1 flex flex-col items-center justify-center space-y-4 w-full"
            >
              <div class="w-full flex justify-center">
                <AppCamera
                  :type="'image'"
                  :disable-button="true"
                  class="w-full max-w-xs flex items-center justify-center"
                  @photo-analysis="photoAnalysis"
                />
              </div>

              <p class="uppercase font-bold text-center">or</p>

              <div class="w-full flex justify-center">
                <Input
                  id="picture"
                  type="file"
                  class="w-full max-w-xs"
                  disabled
                  @change="handleFileChange"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between pt-4">
            <Button variant="outline" @click="navigateTo(localePath('/'))">
              Cancel
            </Button>
            <Button :disabled="submittingLoading" type="submit"
              ><IconSpinner
                v-if="submittingLoading"
                class="size-5 mr-2"
              />Submit</Button
            >
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
<script setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import Swal from "sweetalert2";
import { ref } from "vue";

import * as z from "zod";

const localePath = useLocalePath();

const files = ref(null);
const extractionLoading = ref(false);
const submittingLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    summary: z.string().min(10).max(500),
    date: z.string().min(10).max(50),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  submittingLoading.value = true;
  const geminiResponse = await $fetch("/api/gemini", {
    method: "POST",
    body: {
      document,
      prompt: `Summarize the following description into a single, clear, and readable sentence of exactly five words: ${values.summary}`,
    },
  });
  const response = await $fetch("/api/insert-incident", {
    method: "POST",
    body: {
      ...values,
      title: JSON.parse(geminiResponse.message).summary,
    },
  });
  submittingLoading.value = false;
  if (response.success) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Incident reported successfully.",
      confirmButtonText: "OK",
    }).then(() => {
      reloadNuxtApp({ path: localePath("/") });
    });
  } else {
    Swal.fire({
      icon: "Error",
      title: "Error",
      text: "Error reporting incident.",
      confirmButtonText: "OK",
    });
  }
});

// const photoAnalysis = (data) => {
//   // if (data.extracting === true) {
//   //   extractionLoading.value = true;
//   //   return;
//   // } else if (data.extracting === false && data.response) {
//   //   fillFields(data.response);
//   // } else {
//   //   Swal.fire({
//   //     icon: "Error",
//   //     title: "Error",
//   //     text: "Error extracting details from license.",
//   //     confirmButtonText: "OK",
//   //   }).then(() => {
//   //     reloadNuxtApp();
//   //   });
//   // }
// };

// const handleFileChange = async (event) => {
//   extractionLoading.value = true;

//   files.value = event.target.files;

//   if (files.value) {
//     const fd = new FormData();
//     if (files.value) {
//       fd.append(`index`, files.value[0]);
//       fd.append("isPhotoTaken", "false");
//       fd.append("model", "MruBoatLicenseModel");
//     }
//     const data = await $fetch("/api/extract-text-from-document", {
//       method: "POST",
//       body: fd,
//     });
//     fillFields(data);
//   }
// };

// const fillFields = (data) => {
//   if (data.success === true) {
//     const fields = data.message.documents[0].fields;

//     if (fields) {
//       // License Field
//       if (fields.Licensee && fields.Licensee.valueString)
//         form.setFieldValue("licensee", fields.Licensee.valueString);
//       // Address Field
//       if (fields.Address && fields.Address.valueString)
//         form.setFieldValue("address", fields.Address.valueString);
//       // RegistrationNo Field
//       if (fields.RegistrationNo && fields.RegistrationNo.valueString)
//         form.setFieldValue(
//           "registration_no",
//           fields.RegistrationNo.valueString
//         );
//       // MooringPlace Field
//       if (fields.MooringPlace && fields.MooringPlace.valueString)
//         form.setFieldValue("mooring_place", fields.MooringPlace.valueString);
//       // ReceiptNo Field
//       if (fields.ReceiptNo && fields.ReceiptNo.valueString)
//         form.setFieldValue("receipt_no", fields.ReceiptNo.valueString);
//       // DateIssued Field
//       if (fields.DateIssued && fields.DateIssued.valueString) {
//         const date = new Date(fields.DateIssued.valueString);
//         if (date instanceof Date && !isNaN(date.getTime())) {
//           const year = date.getFullYear();
//           const month = String(date.getMonth() + 1).padStart(2, "0");
//           const day = String(date.getDate()).padStart(2, "0");
//           const formattedDate = `${year}-${month}-${day}`;
//           console.log(formattedDate);
//           form.setFieldValue("date_issued", formattedDate);
//         }
//       }
//     }
//     extractionLoading.value = false;
//   } else {
//     Swal.fire({
//       icon: "Error",
//       title: "Error",
//       text: "Error extracting details from license.",
//       confirmButtonText: "OK",
//     }).then(() => {
//       reloadNuxtApp();
//     });
//   }
// };
</script>
