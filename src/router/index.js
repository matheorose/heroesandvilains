import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { levelAuth: 0 },

  },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue'),
        meta: { levelAuth: 0 },
    }
    ,
  {
    path: '/login',
    name: 'Login',

    component: () => import('../views/LoginView.vue'),
      meta: { levelAuth: 0 },

  },
    {
        path: '/org',
        name: 'org',
        component: () => import('../views/OrgView.vue'),
        meta: { levelAuth: 0 },

    },

    {
        path : '/org/:id',
        name : 'orgById',
        component : () => import('../views/OrgByIdView.vue'),
        props: true,
        meta: { levelAuth: 1 },

    }

  ,
  {
    path: '/team',
    name : 'team',
      component : () => import('../views/TeamView.vue'),
      children : [
        {
            path: '',
            name: 'teamView',
            component : () => import('../views/AllTeam.vue'),
            meta: { levelAuth: 0 },

        },
        {
                path : ':id',
                name : 'teamById',
                component : () => import('../views/TeamByIdView.vue'),
                props: true,
                meta: { levelAuth: 1 },


        }
        ]

  },
    {
        path: '/hero',
        name: 'hero',
        component: () => import('../views/UserHeroUpdateView.vue'),
        meta: { levelAuth: 0 },
    }
    ,
    {
        path:'*',
        name:'error404',
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


function checkAccess(to) {
    return !((to.meta.levelAuth) && (to.meta.levelAuth === 1) && (store.getters["organisationModule/getSecretPhrase"] === null));

}

router.beforeEach((to, from, next) => {
    if (to.name === 'error404') {
        store.commit('errorModule/pushError','Invalid route')
        next('/')
    }
    else if (checkAccess(to)) {
        next()
    }
    else {
        store.commit('errorModule/pushError','You need to login')
        next('/login');
    }
});

export default router
