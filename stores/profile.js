import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    businessPhones: [],
    displayName: "",
    givenName: "",
    jobTitle: "",
    mail: "",
    mobilePhone: "",
    officeLocation: "",
    preferredLanguage: "",
    surname: "",
    userPrincipalName: "",
  }),
  getters: {
    getUserPrincipalName: (state) => state.userPrincipalName,
  },
  actions: {
    setProfile(profile) {
      if (profile) {
        this.businessPhones = profile.businessPhones;
        this.displayName = profile.displayName;
        this.givenName = profile.givenName;
        this.jobTitle = profile.jobTitle;
        this.mail = profile.mail;
        this.mobile = profile.mobilePhone;
        this.officeLocation = profile.officeLocation;
        this.preferredLanguage = profile.preferredLanguage;
        this.surname = profile.surname;
        this.userPrincipalName = profile.userPrincipalName;
      }
    },
    clearProfile() {
      this.businessPhones = [];
      this.displayName = "";
      this.givenName = "";
      this.jobTitle = "";
      this.mail = "";
      this.mobile = "";
      this.officeLocation = "";
      this.preferredLanguage = "";
      this.surname = "";
      this.userPrincipalName = "";
    },
  },
});
