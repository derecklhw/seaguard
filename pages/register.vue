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
    <Card class="w-[500px] m-2">
      <CardHeader>
        <CardTitle>Skipper Registration</CardTitle>
        <CardDescription
          >Fill up your details by uploading or capturing your boat
          license.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <div class="grid items-center w-full gap-4">
            <FormField v-slot="{ componentField }" name="registration_no">
              <FormItem>
                <FormLabel>Registration No</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Registration No"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="licensee">
              <FormItem>
                <FormLabel>Licensee</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Licensee name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="address">
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Address"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="mooring_place">
              <FormItem>
                <FormLabel>Mooring Place</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Mooring Place/Embarkation Point"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="receipt_no">
              <FormItem>
                <FormLabel>Receipt No</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Receipt No"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="date_issued">
              <FormItem>
                <FormLabel>Date Issued</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Date Issued"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="flex justify-between items-end gap-4 my-4">
            <AppCamera
              :type="'license'"
              :disable-button="submittingLoading"
              @photo-analysis="photoAnalysis"
            />
            <p class="uppercase font-bold">or</p>
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Input id="picture" type="file" @change="handleFileChange" />
            </div>
          </div>
          <div class="flex justify-between py-1">
            <Button variant="outline" @click="navigateTo(localePath('/map'))">
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

const profileStore = useProfileStore();
const localePath = useLocalePath();

const files = ref(null);
const extractionLoading = ref(false);
const submittingLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    licensee: z.string().min(5).max(50),
    address: z.string().min(5).max(50),
    registration_no: z.string().min(12).max(15),
    mooring_place: z.string().min(5).max(50),
    receipt_no: z.string().min(5).max(10),
    date_issued: z.string().min(10).max(50),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  submittingLoading.value = true;
  const response = await $fetch("/api/insert-licensee", {
    method: "POST",
    body: {
      ...values,
      email: profileStore.getUserMail,
      userPrincipalName: profileStore.getUserPrincipalName,
    },
  });
  submittingLoading.value = false;
  if (response.success) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "License submitted successfully.",
      confirmButtonText: "OK",
    }).then(() => {
      reloadNuxtApp({ path: localePath("/map") });
    });
  } else {
    Swal.fire({
      icon: "Error",
      title: "Error",
      text: "Error submitting license.",
      confirmButtonText: "OK",
    });
  }
});

const photoAnalysis = (data) => {
  if (data.extracting === true) {
    extractionLoading.value = true;
    return;
  } else if (data.extracting === false && data.response) {
    fillFields(data.response);
  } else {
    Swal.fire({
      icon: "Error",
      title: "Error",
      text: "Error extracting details from license.",
      confirmButtonText: "OK",
    }).then(() => {
      reloadNuxtApp();
    });
  }
};

const handleFileChange = async (event) => {
  extractionLoading.value = true;

  files.value = event.target.files;

  if (files.value) {
    const fd = new FormData();
    if (files.value) {
      fd.append(`index`, files.value[0]);
      fd.append("isPhotoTaken", "false");
      fd.append("model", "MruBoatLicenseModel");
    }
    const data = await $fetch("/api/extract-text-from-document", {
      method: "POST",
      body: fd,
    });
    fillFields(data);
  }
};

const fillFields = (data) => {
  if (data.success === true) {
    const fields = data.message.documents[0].fields;

    if (fields) {
      // License Field
      if (fields.Licensee && fields.Licensee.valueString)
        form.setFieldValue("licensee", fields.Licensee.valueString);
      // Address Field
      if (fields.Address && fields.Address.valueString)
        form.setFieldValue("address", fields.Address.valueString);
      // RegistrationNo Field
      if (fields.RegistrationNo && fields.RegistrationNo.valueString)
        form.setFieldValue(
          "registration_no",
          fields.RegistrationNo.valueString
        );
      // MooringPlace Field
      if (fields.MooringPlace && fields.MooringPlace.valueString)
        form.setFieldValue("mooring_place", fields.MooringPlace.valueString);
      // ReceiptNo Field
      if (fields.ReceiptNo && fields.ReceiptNo.valueString)
        form.setFieldValue("receipt_no", fields.ReceiptNo.valueString);
      // DateIssued Field
      if (fields.DateIssued && fields.DateIssued.valueString) {
        const date = new Date(fields.DateIssued.valueString);
        if (date instanceof Date && !isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;
          console.log(formattedDate);
          form.setFieldValue("date_issued", formattedDate);
        }
      }
    }
    extractionLoading.value = false;
  } else {
    Swal.fire({
      icon: "Error",
      title: "Error",
      text: "Error extracting details from license.",
      confirmButtonText: "OK",
    }).then(() => {
      reloadNuxtApp();
    });
  }
};
</script>
