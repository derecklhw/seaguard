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
                <TableHead>UserEmail</TableHead>
                <TableHead class="hidden md:table-cell">Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead class="hidden md:table-cell">StartTime</TableHead>
                <TableHead class="hidden md:table-cell">EndTime</TableHead>
                <TableHead class="hidden md:table-cell">MarkerId</TableHead>
                <TableHead>
                  <span class="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="boatTracker in adminStore.getBoatTrackers"
                :key="boatTracker.Id"
              >
                <TableCell class="font-medium">{{ boatTracker.Id }}</TableCell>
                <TableCell class="text-start max-w-sm max-h-16 truncate">{{
                  boatTracker.userEmail
                }}</TableCell>
                <TableCell
                  class="hidden md:table-cell text-start max-w-xl max-h-16 truncate"
                >
                  {{ boatTracker.latitude }}
                </TableCell>
                <TableCell>{{ boatTracker.longitude }}</TableCell>
                <TableCell class="hidden md:table-cell">{{
                  boatTracker.startTime
                }}</TableCell>
                <TableCell class="hidden md:table-cell">{{
                  boatTracker.endTime
                }}</TableCell>
                <TableCell class="hidden md:table-cell">{{
                  boatTracker.markerId
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
const adminStore = useAdminStore();
</script>
