<script setup>
import { Authenticator } from '@aws-amplify/ui-vue'
import { useRouter } from 'vue-router'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useAuthStore } from '@/stores/auth'

import '@aws-amplify/ui-vue/styles.css'
import { Hub } from 'aws-amplify/utils'

const router = useRouter()
const authStore = useAuthStore()

async function currentSession() {
  try {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {}
    console.log(accessToken.payload)
    console.log(idToken)
    authStore.auth.value = accessToken.payload
    console.log(authStore.auth)
  } catch (err) {
    console.log(err)
  }
}

Hub.listen('auth', ({ payload }) => {
  currentSession()
  switch (payload.event) {
    case 'signedIn':
      console.log('user have been signedIn successfully.')
      router.push({ name: 'home' })
      break
    case 'signedOut':
      console.log('user have been signedOut successfully.')
      router.push({ name: 'login' })

      break
    case 'tokenRefresh':
      console.log('auth tokens have been refreshed.')
      break
    case 'tokenRefresh_failure':
      console.log('failure while refreshing auth tokens.')
      break
    case 'signInWithRedirect':
      console.log('signInWithRedirect API has successfully been resolved.')
      break
    case 'signInWithRedirect_failure':
      console.log('failure while trying to resolve signInWithRedirect API.')
      break
    case 'customOAuthState':
      console.info('custom state returned from CognitoHosted UI')
      break
  }
})
</script>

<template>
  <authenticator>
    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user.username }}!</h1>
      <button @click="signOut">Sign Out</button>
      <!-- Other content from before-->
    </template>
  </authenticator>
</template>
