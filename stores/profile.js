import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    givenName: "",
    id: "",
    mail: "",
    surname: "",
    userPrincipalName: "",
  }),
  getters: {
    getUserPrincipalName: (state) => state.userPrincipalName,
    getUserMail: (state) => state.mail,
  },
  actions: {
    async setProfile(profile) {
      if (profile) {
        this.givenName = profile.givenName;
        this.id = profile.id;
        this.mail = profile.mail;
        this.surname = profile.surname;
        this.userPrincipalName = profile.userPrincipalName;
        await $fetch("/api/insert-user", {
          method: "POST",
          body: {
            givenName: this.givenName,
            id: this.id,
            mail: this.mail,
            surname: this.surname,
            userPrincipalName: this.userPrincipalName,
          },
        });
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
