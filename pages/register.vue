<template>
  <div class="w-full flex justify-center">
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
            <AppCamera :type="'license'" @photo-analysis="photoAnalysis" />
            <p class="uppercase font-bold">or</p>
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Input id="picture" type="file" />
            </div>
          </div>
          <div class="flex justify-between py-1">
            <Button variant="outline"> Cancel </Button>
            <Button type="submit">Save</Button>
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

import * as z from "zod";

const profileStore = useProfileStore();
const localePath = useLocalePath();

const formSchema = toTypedSchema(
  z.object({
    licensee: z.string().min(5).max(50),
    address: z.string().min(10).max(50),
    registration_no: z.string().min(12).max(50),
    mooring_place: z.string().min(10).max(50),
    receipt_no: z.string().min(10).max(50),
    date_issued: z.string().min(10).max(50),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  await $fetch("/api/insert-licensee", {
    method: "POST",
    body: {
      ...values,
      email: profileStore.getUserMail,
      userPrincipalName: profileStore.getUserPrincipalName,
    },
  }).then(() => {
    reloadNuxtApp({ path: localePath("/map") });
  });
});

const photoAnalysis = (data) => {
  if (data.loading === true) {
    return;
  } else if (data.loading === false) {
    return;
  } else {
    fillFields(data);
  }
};

const fillFields = (data) => {
  if (data.success === false) {
    Swal.fire({
      icon: "Error",
      title: "Error",
      text: "Error analyzing image",
      confirmButtonText: "OK",
    }).then(() => {
      reloadNuxtApp();
    });
  } else if (data.success === true) {
    Swal.fire({
      icon: "info",
      title: "Info",
      text: "Analysis successfully. Please review the details.",
      confirmButtonText: "OK",
    });
    const fields = data.message.documents[0].fields;

    if (fields) {
      if (fields.Licensee && fields.Licensee.valueString)
        form.setFieldValue("licensee", fields.Licensee.valueString);
      if (fields.Address && fields.Address.valueString)
        form.setFieldValue("address", fields.Address.valueString);
      if (fields.RegistrationNo && fields.RegistrationNo.valueString)
        form.setFieldValue(
          "registration_no",
          fields.RegistrationNo.valueString
        );
      if (fields.MooringPlace && fields.MooringPlace.valueString)
        form.setFieldValue("mooring_place", fields.MooringPlace.valueString);
      if (fields.ReceiptNo && fields.ReceiptNo.valueString)
        form.setFieldValue("receipt_no", fields.ReceiptNo.valueString);
      if (fields.DateIssued && fields.DateIssued.valueString)
        form.setFieldValue("date_issued", fields.DateIssued.valueString);
    }
  }
};
</script>
