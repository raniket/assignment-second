<template>
  <v-container >

      <v-layout row v-if="error" >
        <v-flex xs12 sm6 offset-sm3>
          <app-alert @dismissed="onErrorDismissed" :text="error"></app-alert>
        </v-flex>
      </v-layout>

      <v-form ref="form" @submit.prevent="onSubmit" lazy-validation>
        <v-layout row mt-5>
          <v-flex xs12 sm6 offset-sm3>
            <v-text-field
            v-model="userName"
            label="GitHub username"
            required
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-text-field
            v-model="repositoryName" 
            label="Repository name"
            required
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row> 
          <v-flex class="text-md-center" xs12 sm6 offset-3 ml-5>
            <v-btn :loading="loading" type="submit" :disabled="!valid" >
              submit
            </v-btn>
          </v-flex>
        </v-layout>
      
    </v-form>

    <v-layout row mt-5>
      <v-flex xs12 sm6 offset-sm3>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <div slot="header">Read Note</div>
            <v-card>
              <v-card-text>
                - For example you can enter robin850 in 'GitHub username*' field and carrierwave-dropbox in 'Repository name*' field.<br>
                - Sometime it may not work if you are trying to access repository that has a large number of closed issues, because of github api call limit.</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      repositoryName: ''
    }
  },
  computed: {
    valid() {
      return (this.userName !== '' && this.repositoryName !== '' );
    },
    loading() {
      return this.$store.getters.loading;
    },
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.getError;
    },
  },
  watch: {
    user (value) {
      if(value !== null && value !== undefined) {
        this.$router.push('/closed-issues');
      }
    }
  }, 
  methods: {
    onSubmit() {
      this.$store.dispatch('getClosedIssues', {userName: this.userName, repositoryName: this.repositoryName});
    },
    onErrorDismissed () {
      this.$store.dispatch('clearError');
    }
  },
}
</script>
