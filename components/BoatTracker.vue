<template>
  <div>
    <section class="border-t-2 border-gray-300" style="background-color: #aad3df;">
        <div id="controls" class="flex flex-col lg:flex-row justify-center items-center h-fit lg:h-20">
        <div class="mx-5 my-1">
          <DatePicker type="date" id="selectedDate" v-model="selectedDate" required />
        </div>
        <div class="mx-5 my-1">
          <TimeSelect
          id="startDateTime"
          label="Start Time"
          start="06:00"
          end="12:00"
          :step="15"
          v-model="startDateTime"
          />
        </div>

        <div class="mx-5 my-1">
          <TimeSelect
          id="endDateTime"
          label="End Time"
          start="06:00"
          end="12:00"
          :step="15"
          v-model="endDateTime"
          />
        </div>
        <div class="mx-5 my-1">
          <Button @click="submitTimes">Submit Times</Button>
        </div>
        <div class="mx-5 my-1">      
          <Button id="sendData" style="display: none" @click="sendMarkerData">
          Send Data
          </Button>
        </div>
      </div>
    </section>

    <client-only>
      <div id="mapContainer" class="h-screen z-0 w-screen" style=" width: 100%; z-index: 0;"></div>
    </client-only>
  </div>
</template>

<script setup>
import TimeSelect from './TimeSelect.vue';
import DatePicker from './DatePicker.vue';
import Swal from 'sweetalert2';
import { ref, onMounted, watch } from "vue";
import { useFetch } from "#app";
import "leaflet/dist/leaflet.css";

const map = ref(null);
const L = ref(null);
const mapInitialized = ref(false);
const currentMarker = ref(null);
const ellipses = ref([]);
const ellipseMarkersCount = ref({});
const startTime = ref(null);
const selectedDate = ref(null);
const endTime = ref(null);
const startDateTime = ref(null);
const endDateTime = ref(null);

const userEmail = ref("john.doe@example.com"); // Placeholder email

onMounted(async () => {
  if (process.client) {
    await loadLeaflet();
    initializeMap();
    await fetchAllMarkersAndUserBookings();
  }
});

const loadLeaflet = async () => {
  if (process.client && !L.value) {
    const leaflet = await import("leaflet");
    await import("leaflet/dist/leaflet.css");
    await import("leaflet-ellipse");
    L.value = leaflet.default || leaflet;
  }
};

const initializeMap = async () => {
  if (process.client && L.value) {
    map.value = L.value.map("mapContainer", {
      center: [-20.348404, 57.552152],
      zoom: 10,
      minZoom: 10,
      maxZoom: 16,
    });

    L.value
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(map.value);
    ellipses.value = createEllipses();
    setMapBounds();

    const currentIcon = updateIconSize(map.value.getZoom());

    map.value.on("click", (e) => handleMapClick(e, currentIcon));
    map.value.on("zoomend", () => updateMarkerIconSize(map.value.getZoom()));

    mapInitialized.value = true;
  }
};

const setMapBounds = () => {
  const bounds = L.value.latLngBounds(
    L.value.latLng(-20.8, 57.2),
    L.value.latLng(-19.8, 58.0)
  );
  map.value.setMaxBounds(bounds);
  map.value.on("drag", () => {
    map.value.panInsideBounds(bounds, { animate: false });
  });
};

const handleMapClick = (e, icon) => {
  const latlng = e.latlng;
  const insideEllipse = ellipses.value.some((ellipse) =>
    ellipse.getBounds().contains(latlng)
  );

  if (insideEllipse) {
    if (currentMarker.value) {
      alert(
        "You already have a marker. Please remove it before adding a new one."
      );
    } else {
      currentMarker.value = L.value.marker(latlng, { icon }).addTo(map.value);
      updateEllipseColors(
        currentMarker.value.getLatLng().lat,
        currentMarker.value.getLatLng().lng
      );
      currentMarker.value
        .bindPopup(
          `
        <div class="justify-center items-center">
          <p>Your New Marker</p>
          <button class="remove-pin-btn border-2 border-gray-900 justify-center items-center rounded">Remove the marker</button>
        </div>
      `
        )
        .on("popupopen", () => {
          document
            .querySelector(".remove-pin-btn")
            .addEventListener("click", () => {
              removeMarker(currentMarker.value._leaflet_id);
            });
        })
        .openPopup();
    }
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Notice',
      text: 'Click within an ellipse to add a marker.',
      confirmButtonText: 'OK'
    });
  }
};

const removeMarker = (markerId) => {
  if (currentMarker.value && currentMarker.value._leaflet_id === markerId) {
    map.value.removeLayer(currentMarker.value);
    updateEllipseColorsOnRemove(
      currentMarker.value.getLatLng().lat,
      currentMarker.value.getLatLng().lng
    );
    currentMarker.value = null;
  }
};

const updateMarkerIconSize = (zoom) => {
  const newIcon = updateIconSize(zoom);
  if (currentMarker.value) {
    currentMarker.value.setIcon(newIcon);
  }
};

const updateIconSize = (zoom) => {
  const baseSize = 20;
  const newSize = baseSize * (zoom / 10);
  const iconSize = [newSize, newSize * 1.64];

  return L.value.icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=H48KNciLSEu5&format=png&color=000000",
    iconSize: iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [1, -iconSize[1] / 2],
  });
};

const fetchAllMarkersAndUserBookings = async () => {
  if (process.client && L.value) {
    // console.log(startTime.value, endTime.value);
    let isoStartTime = new Date(startTime.value).toISOString(); // Converts to ISO format
    let isoEndTime = new Date(endTime.value).toISOString(); // Converts to ISO format

    // console.log(isoStartTime, isoEndTime);
    try {
      const userBookings = await $fetch("/api/check-user-booking", {
        method: "GET",
        params: {
          startTime: isoStartTime,
          endTime: isoEndTime,
          userEmail: userEmail.value,
        },
      });

      const markers = await $fetch("/api/get-markers", {
        method: "GET",
        params: {
          startTime: isoStartTime,
          endTime: isoEndTime,
          userEmail: userEmail.value,
        },
      });

      clearMarkers();

      // Process user bookings
      if (userBookings && Array.isArray(userBookings)) {
        // console.log(userBookings);
        userBookings.forEach((booking) => {
          let startDate = new Date(booking.startTime);
          let endDate = new Date(booking.endTime);
          console.log(startDate, endDate);

          const userMarker = L.value
            .marker([booking.Latitude, booking.Longitude], {
              icon: getUserBoatIcon(),
            })
            .bindPopup(
              `
          <b>Your Booking:</b><br>
          Start: ${startDate.toLocaleString()}<br>
          End: ${endDate.toLocaleString()}<br>
          <button class="deleteBookingBtn" data-booking-id="${
            booking.Id
          }">Delete Booking</button>
        `
            )
            .addTo(map.value);

          currentMarker.value = userMarker;

          userMarker.on("popupopen", () => {
            const deleteButton = document.querySelector(".deleteBookingBtn");
            deleteButton.addEventListener("click", async () => {
              const bookingId = deleteButton.getAttribute("data-booking-id");
              if (bookingId) {
                await deleteUserBooking(bookingId, userMarker, userEmail.value);
              }
            });
          });

          userMarker.openPopup();
          updateEllipseColors(booking.Latitude, booking.Longitude);
        });
      }

      // Process other markers

      // console.log(markers);
      if (markers && Array.isArray(markers)) {
        markers.forEach((marker) => {
          let startDate = new Date(marker.startTime);
          let endDate = new Date(marker.endTime);

          L.value
            .marker([marker.Latitude, marker.Longitude], {
              icon: getBoatIcon(),
            })
            .bindPopup(
              `
          <div>
            <p>Start Time: ${startDate.toLocaleString()}</p>
            <p>End Time: ${endDate.toLocaleString()}</p>
          </div>
        `
            )
            .addTo(map.value);

          updateEllipseColors(marker.Latitude, marker.Longitude);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

const deleteUserBooking = async (bookingId, marker, userEmail) => {
  const { data } = await useFetch("/api/delete-user-booking", {
    method: "POST",
    body: { bookingId, userEmail },
  });

  if (data.value.success) {
    alert("Booking deleted successfully");
    map.value.removeLayer(marker);
    resetMap();
    initializeMap();
  } else {
    alert("Error deleting booking: " + data.value.message);
  }
};

const updateEllipseColors = (lat, lng) => {
  ellipses.value.forEach((ellipse, index) => {
    if (ellipse.getBounds().contains([lat, lng])) {
      ellipseMarkersCount.value[index]++;
      const count = ellipseMarkersCount.value[index];
      let color = "blue";

      if (count > 8) {
        color = "red";
      } else if (count > 5) {
        color = "orange";
      } else if (count > 3) {
        color = "yellow";
      }

      ellipse.setStyle({
        color,
        fillColor: color,
      });
    }
  });
};

const updateEllipseColorsOnRemove = (lat, lng) => {
  ellipses.value.forEach((ellipse, index) => {
    if (ellipse.getBounds().contains([lat, lng])) {
      ellipseMarkersCount.value[index]--;
      const count = ellipseMarkersCount.value[index];
      let color = "blue";

      if (count > 8) {
        color = "red";
      } else if (count > 5) {
        color = "orange";
      } else if (count > 3) {
        color = "yellow";
      }

      ellipse.setStyle({
        color,
        fillColor: color,
      });
    }
  });
};

const submitTimes = () => {
  console.log(selectedDate.value)
  if (selectedDate.value && startDateTime.value && endDateTime.value) {
    startTime.value = new Date(`${selectedDate.value}T${startDateTime.value}`);
    endTime.value = new Date(`${selectedDate.value}T${endDateTime.value}`);

    // console.log(startTime.value, endTime.value);
    if (startTime.value >= endTime.value) {
      alert("Start time must be earlier than end time.");
      return;
    }

    if (mapInitialized.value) {
      resetMap();
      initializeMap();
    } else {
      initializeMap();
    }

    mapInitialized.value = true;
    document.getElementById("mapContainer").style.display = "block";
    document.getElementById("sendData").style.display = "inline";

    fetchAllMarkersAndUserBookings();
  } else {
    alert("Please select a date and valid start and end times.");
  }
};

const clearMarkers = () => {
  map.value.eachLayer((layer) => {
    if (layer instanceof L.value.Marker) {
      map.value.removeLayer(layer);
    }
  });
};

const getBoatIcon = () => {
  if (!L.value) return null;
  return L.value.icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=15133&format=png&color=000000",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const getUserBoatIcon = () => {
  if (!L.value) return null;
  return L.value.icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=UWVpDObu20sy&format=png&color=000000",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const resetMap = () => {
  if (map.value) {
    map.value.off();
    map.value.remove();
    map.value = null;
  }
  currentMarker.value = null;
  ellipseMarkersCount.value = {};
};

const createEllipses = () => {
  if (!L.value) return [];

  const ellipseData = [
    { center: [-19.940723, 57.593748], size: [10000, 5000], angle: -20 },
    { center: [-20.042508, 57.479437], size: [7500, 5000], angle: -50 },
    { center: [-20.152414, 57.39657], size: [8000, 5000], angle: -30 },
    { center: [-20.269537, 57.320869], size: [8000, 5000], angle: -70 },
    { center: [-20.397202, 57.31483], size: [7000, 4500], angle: -70 },
    { center: [-20.508699, 57.324432], size: [7000, 4500], angle: 30 },
    { center: [-20.540205, 57.450513], size: [6500, 4000], angle: 0 },
  ];

  return ellipseData.map((data, index) => {
    ellipseMarkersCount.value[index] = 0;
    return L.value
      .ellipse(data.center, data.size, data.angle, {
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.2,
      })
      .addTo(map.value);
  });
};

const sendMarkerData = async () => {
  if (currentMarker.value) {
    const markerData = {
      userEmail: userEmail.value,
      latitude: currentMarker.value.getLatLng().lat,
      longitude: currentMarker.value.getLatLng().lng,
      startTime: new Date(startTime.value).toISOString(),
      endTime: new Date(endTime.value).toISOString(),
      markerId: currentMarker.value._leaflet_id,
    };

    const { data } = await useFetch("/api/send-boat-data", {
      method: "POST",
      body: markerData,
    });

    if (data.value.success) {
      alert("Marker data sent successfully.");
    } else {
      alert("Error sending marker data: " + data.value.message);
    }
  } else {
    alert("Please add a marker before sending data.");
  }
};
</script>

