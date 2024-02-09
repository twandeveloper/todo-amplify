<script setup>
import * as mutations from '@/graphql/mutations'
import * as queries from '@/graphql/queries'
import * as subscriptions from '@/graphql/subscriptions'
import { Authenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'
import { generateClient } from 'aws-amplify/api'
import { onMounted, ref } from 'vue'

const name = ref('')
const description = ref('')
const todos = ref([])

const links = ['Dashboard', 'Messages', 'Profile', 'Updates']
const client = generateClient()

async function addTodo() {
  if (!name.value || !description.value) return
  const todo = { name: name.value, description: description.value }
  await client.graphql({
    query: mutations.createTodo,
    variables: { input: todo }
  })
  name.value = ''
  description.value = ''
}

async function fetchTodos() {
  const fetchTodos = await client.graphql({
    query: queries.listTodos
  })
  todos.value = fetchTodos.data.listTodos.items
}

function subscribeToNewTodos() {
  client
    .graphql({
      query: subscriptions.onCreateTodo
    })
    .subscribe({
      next: ({ data }) => {
        todos.value = [...todos.value, data.onCreateTodo]
      }
    })
}

onMounted(() => {
  fetchTodos()
  subscribeToNewTodos()
})
</script>
<template v-slot="{ user, signOut }">
  <v-app id="inspire">
    <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar class="me-4" color="grey-darken-1" size="32"></v-avatar>

        <v-btn v-for="link in links" :key="link" :text="link" variant="text" />

        <v-spacer></v-spacer>

        <v-responsive max-width="160">
          <v-text-field
            density="compact"
            flat
            hide-details
            label="Search"
            rounded="lg"
            single-line
            variant="solo-filled"
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3" style="min-width: 1200px">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet class="theme--dark" rounded="lg">
              <v-list rounded="lg">
                <v-list-item v-for="n in 5" :key="n" link :title="`List Item ${n}`"></v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item color="grey-lighten-4" link title="Refresh"></v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <h1>Todo App</h1>

              <v-card class="mx-auto" max-width="344" variant="elevated">
                <v-card-item>
                  <div>
                    <div class="text-overline mb-1"></div>
                    <div class="text-h6 mb-1">Headline</div>
                    <div class="text-caption">
                      <v-text-field type="text" v-model="name" placeholder="Todo name" />
                      <v-text-field
                        type="text"
                        v-model="description"
                        placeholder="Todo description"
                      />

                      <div v-for="item in todos" :key="item.id">
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.description }}</p>
                      </div>
                    </div>
                  </div>
                </v-card-item>

                <v-card-actions>
                  <v-btn variant="outlined" v-on:click="addTodo">Create Todo</v-btn>
                </v-card-actions>
              </v-card>
              <authenticator>
                <template v-slot="{ user, signOut }">
                  <h1>Hello {{ user.username }}!</h1>
                  <button @click="signOut">Sign Out</button>
                  <!-- Other content from before-->
                </template>
              </authenticator>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<!-- <h1>Todo App</h1>
<input type="text" v-model="name" placeholder="Todo name" />
<input type="text" v-model="description" placeholder="Todo description" />
<v-btn v-on:click="addTodo">Create Todo</v-btn>

<div v-for="item in todos" :key="item.id">
  <h3>{{ item.name }}</h3>
  <p>{{ item.description }}</p>
</div> -->
