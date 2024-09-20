import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    givenName: "",
    id: "",
    mail: "",
    surname: "",
    userPrincipalName: "",
    role: "",
  }),
  getters: {
    getUserPrincipalName: (state) => state.userPrincipalName,
    getUserMail: (state) => state.mail,
    getUserRole: (state) => state.role,
  },
  actions: {
    async setProfile(profile) {
      if (profile) {
        this.givenName = profile.givenName;
        this.id = profile.id;
        this.mail = profile.mail;
        this.surname = profile.surname;
        this.userPrincipalName = profile.userPrincipalName;
        const response = await $fetch("/api/insert-user", {
          method: "POST",
          body: {
            givenName: this.givenName,
            id: this.id,
            mail: this.mail,
            surname: this.surname,
            userPrincipalName: this.userPrincipalName,
          },
        });
        this.role = response.message.Role;
      }
    },
    clearProfile() {
      this.givenName = "";
      this.id = "";
      this.mail = "";
      this.surname = "";
      this.userPrincipalName = "";
    },
  },
});
