import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/nodes',
    component: Layout,
    redirect: '/nodes/nodelist',
    name: 'Nodes',
    meta: { title: '节点管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'nodelist',
        name: 'Nodelist',
        component: () => import('@/views/nodes/nodelist'),
        meta: { title: '节点管理', icon: 'table' },
      },
      {
        path: 'nodedetail',
        name: 'Nodedatail',
        component: () => import('@/views/nodes/nodedetail'),
        meta: { title: '节点详情', icon: 'table' },
        hidden:true,
      },
      {
        path: 'nodeshell',
        name: 'Nodeshell',
        component: () => import('@/views/nodes/nodeshell'),
        meta: { title: '节点shell', icon: 'table' },
        hidden:true,
      }
    ]
  },
  {
    path: '/rbac',
    component: Layout,
    redirect: '/rbac/rolelist',
    name: 'RBAC',
    meta: { title: 'RBAC管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'serviceaccountlist',
        name: 'ServiceAccountlist',
        component: () => import('@/views/rbac/serviceaccountslist'),
        meta: { title: 'ServiceAccount列表', icon: 'table' },
      },
      {
        path: 'creatserviceaccount',
        name: 'Createserrrviceaccount',
        component: () => import('@/views/rbac/createrole'),
        meta: { title: '创建ServiceAccount', icon: 'table' },
      },
      {
        path: 'rolelist',
        name: 'Rolelist',
        component: () => import('@/views/rbac/roleslist'),
        meta: { title: 'Role列表', icon: 'table' },
      },
      {
        path: 'createrole',
        name: 'Createrole',
        component: () => import('@/views/rbac/createrole'),
        meta: { title: '创建Role', icon: 'table' },
      },
      {
        path: 'rolebindinglist',
        name: 'Rolebindinglist',
        component: () => import('@/views/rbac/rolebindingslist'),
        meta: { title: 'RoleBinding列表', icon: 'table' },
      },
      {
        path: 'createrolebinding',
        name: 'Createrolebinding',
        component: () => import('@/views/rbac/createrolebinding'),
        meta: { title: '创建RoleBinding', icon: 'table' },
      }
    ]
  },
  {
    path: '/workloads',
    component: Layout,
    redirect: '/workloads/deployments',
    name: 'Example',
    meta: { title: '工作负载', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'deployments',
        name: 'Deployments',
        component: () => import('@/views/workloads/deplist'),
        meta: { title: 'deployments列表', icon: 'table' }
      },
      {
        path: 'pods',
        name: 'Pods',
        component: () => import('@/views/workloads/podslist'),
        meta: { title: 'Pods列表', icon: 'tree' }
      },
      {
        path: 'podlogs',
        name: 'Podlogs',
        component: () => import('@/views/workloads/podlogs'),
        meta: { title: '查看Pods日志', icon: 'tree' },
        hidden:true
      },
      {
        path: 'podshell',
        name: 'Podshell',
        component: () => import('@/views/workloads/podshell'),
        meta: { title: 'Podshell', icon: 'tree' },
        hidden:true,
      },
      {
        path: 'serivces',
        name: 'Serivces',
        component: () => import('@/views/workloads/svclist'),
        meta: { title: 'Service列表', icon: 'tree' }
      }

    ]
  },
  {
    path: '/ingress',
    component: Layout,
    redirect: '/ingress/ingress-list',
    name: 'ingress',
    meta: { title: 'Ingress管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'ingress-list',
        name: 'Ingress-list',
        component: () => import('@/views/ingress/ingress-list'),
        meta: { title: 'Ingress列表', icon: 'table' }
      },
      {
        path: 'createingress',
        name: 'Createingress',
        component: () => import('@/views/ingress/ingress-create'),
        meta: { title: '创建ingress', icon: 'tree' }
      },

    ]
  },
  {
    path: '/resources',
    component: Layout,
    redirect: '/resources/secrets-list',
    name: 'ingress',
    meta: { title: '资源管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'secrets-list',
        name: 'Secrets-list',
        component: () => import('@/views/resources/secrets-list'),
        meta: { title: 'Secrets列表', icon: 'table' }
      },
      {
        path: 'createsecret',
        name: 'Createsecret',
        component: () => import('@/views/resources/secrets-create'),
        meta: { title: '创建Secrets', icon: 'tree' }
      },
      {
        path: 'secretget',
        name: 'SecretGet',
        component: () => import('@/views/resources/secrets-get'),
        meta: { title: '查看Secrets', icon: 'tree' },
        hidden:true
      },
      {
        path: 'configmap-list',
        name: 'ConfigMap-list',
        component: () => import('@/views/resources/configmap-list'),
        meta: { title: 'ConfigMap列表', icon: 'table' }
      },
      {
        path: 'createconfigmap',
        name: 'Createconfigmap',
        component: () => import('@/views/resources/configmap-create'),
        meta: { title: '创建ConfigMap', icon: 'tree' }
      },
      {
        path: 'configmapget',
        name: 'ConfigmapGet',
        component: () => import('@/views/resources/configmap-get'),
        meta: { title: '查看ConfigMap', icon: 'tree' },
        hidden:true
      },

    ]
  },





  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
