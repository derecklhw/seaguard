<template>
  <div
    class="flex flex-1 items-start justify-start rounded-lg border border-dashed shadow-sm"
  >
    <div class="flex flex-col items-start gap-1 text-center">
      <Button size="sm" class="h-7 gap-1 mb-3"> Add Document </Button>
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
const adminStore = useAdminStore();
</script>
