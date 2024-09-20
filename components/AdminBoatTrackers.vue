<template>
  <div
    class="flex flex-1 items-start justify-start rounded-lg border border-dashed shadow-sm"
  >
    <div class="flex flex-col items-start gap-1 text-center">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Title</TableHead>
                <TableHead class="hidden md:table-cell">Description</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead class="hidden md:table-cell">Status</TableHead>
                <TableHead>
                  <span class="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="incident in formattedIncidents"
                :key="incident.Id"
              >
                <TableCell class="font-medium">{{ incident.Id }}</TableCell>
                <TableCell class="max-w-sm max-h-16 truncate">{{
                  incident.Title
                }}</TableCell>
                <TableCell
                  class="hidden md:table-cell text-start max-w-xl max-h-16 truncate"
                >
                  {{ incident.Description }}
                </TableCell>
                <TableCell>{{ incident.formattedTimestamp }}</TableCell>
                <TableCell class="hidden md:table-cell">{{
                  incident.Status
                }}</TableCell>
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
import { computed } from "vue";
const adminStore = useAdminStore();

// Helper function to convert timestamp
function formatTimestamp(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  return date.toLocaleString(); // Adjust this for specific locale/date format
}

// Computed property to format the incidents
const formattedIncidents = computed(() =>
  adminStore.getIncidents.map((incident) => ({
    ...incident,
    formattedTimestamp: formatTimestamp(incident.Timestamp),
  }))
);
</script>
