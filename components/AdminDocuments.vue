<template>
  <div
    class="flex flex-1 items-start justify-start rounded-lg border border-dashed shadow-sm"
  >
    <div class="flex flex-col items-start gap-1 text-center">
      <Dialog>
        <DialogTrigger>
          <Button size="sm" class="h-7 gap-1 mb-3"> Add Document </Button>
        </DialogTrigger>
        <DialogContent>
          <form class="space-y-4" @submit.prevent="handleFileSubmit">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                <div class="">
                  <Input id="picture" type="file" @change="handleFileChange" />
                </div>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button type="submit" :disabled="submittingLoading"
                ><IconSpinner
                  v-if="submittingLoading"
                  class="size-5 mr-2"
                />Submit</Button
              >
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Title</TableHead>
                <TableHead class="hidden md:table-cell"> Content </TableHead>
                <TableHead> Type </TableHead>
                <TableHead class="hidden md:table-cell"> UserEmail </TableHead>
                <TableHead>
                  <span class="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="document in adminStore.getDocuments"
                :key="document.Id"
              >
                <TableCell class="font-medium"> {{ document.Id }} </TableCell>
                <TableCell class="max-w-sm max-h-16 truncate">
                  {{ document.Title }}
                </TableCell>
                <TableCell
                  class="hidden md:table-cell text-start max-w-xl max-h-16 truncate"
                >
                  {{ document.Content }}
                </TableCell>
                <TableCell> {{ document.Type }} </TableCell>
                <TableCell class="hidden md:table-cell">
                  {{ document.UserEmail }}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <IconMoreHorizontal class="h-4 w-4" />
                        <span class="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<script setup lang="ts">
import Swal from "sweetalert2";

const adminStore = useAdminStore();
const profileStore = useProfileStore();

const files = ref(null);
const submittingLoading = ref(false);

const handleFileSubmit = async () => {
  submittingLoading.value = true;
  if (files.value) {
    const fd = new FormData();
    if (files.value) {
      fd.append(`index`, files.value[0]);
      fd.append("isPhotoTaken", "false");
      fd.append("model", "prebuilt-layout");
    }
    const extractionResponse = await $fetch("/api/extract-text-from-document", {
      method: "POST",
      body: fd,
    });

    if (!extractionResponse.success) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error extracting text from document.",
        confirmButtonText: "OK",
      });
      submittingLoading.value = false;
    }

    const insertDocumentResponse = await $fetch("/api/insert-document", {
      method: "POST",
      body: {
        extractedText: extractionResponse.message,
        type: "formation",
        userEmail: profileStore.getUserMail,
      },
    });

    submittingLoading.value = false;
    if (insertDocumentResponse.success) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Document uploaded successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        reloadNuxtApp();
      });
    } else {
      Swal.fire({
        icon: "Error",
        title: "Error",
        text: "Error uploading document.",
        confirmButtonText: "OK",
      });
    }
  }
};

const handleFileChange = async (event) => {
  files.value = event.target.files;
  console.log(files.value);
};
</script>
