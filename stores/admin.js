import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    documents: [],
    incidents: [],
  }),
  getters: {
    getDocuments: (state) => state.documents,
    getIncidents: (state) => state.incidents,
  },
  actions: {
    async setDocuments() {
      const documents = await $fetch("/api/get-documents");
      this.documents = documents.message.recordset;
    },
    async setIncidents() {
      const incidents = await $fetch("/api/get-incidents");
      this.incidents = incidents.message.recordset;
    },
  },
});
