<template>
  <v-layout row pt-5>
    <v-flex xs12 sm6 offset-sm3>
      <v-card >
        <v-card-media

        >
        <img :src="closedIssues.avatarUrl" height="500px" width="200px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <div class="headline">{{closedIssues.title}}</div>
            <br>
            <span ><b>Total Issues Closed: {{closedIssues.totalClosedIssues}}</b></span>
            <br>
            <span v-for="item in closedIssues.users" :key="item.name">{{item.name}} ({{item.totalIssues}})<br></span>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      name: 'Closed Issues',
      isDataAvailabe: ''
    }
  },
  computed: {
    closedIssues() {
      if(this.$store.getters.closedIssues.title === null) this.$router.push('/');
      return this.$store.getters.closedIssues;
    }
  }
}
</script>

<style scoped>
</style>
