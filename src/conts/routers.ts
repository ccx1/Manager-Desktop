import * as React from 'react';

export const basename = '';

interface IRoute {
    path: string,
    exact: boolean,
    component: any,
    name: string,
    title: string
}

const routerConfig: IRoute[] = [
    {
        path: '/',
        exact: true,
        component: '/home',
        name: 'home',
        title: '首页'
    },
    {
        path: '/home',
        exact: true,
        component: '/home',
        name: 'home',
        title: '首页'
    },
    {
        path: '/commands',
        exact: true,
        component: '/command',
        name: 'commands',
        title: '命令行'
    },
    {
        path: '/process',
        exact: true,
        component: '/process',
        name: 'process',
        title: '进程管理'
    },
    {
        path: '/login',
        exact: true,
        component: '/login',
        name: 'home',
        title: '登陆'
    },
    {
        path: '*',
        exact: true,
        component: '/home',
        name: '404',
        title: '404'
    }
];


function wrapAsyncRoute(componentPath) {
    return React.lazy(() => import(`@/page${componentPath}`));
}


function wrapRoutePath(routers: Array<IRoute>) {
    return routers.map((router) => ({
        ...router,
        component: wrapAsyncRoute(router.component)
    }));
}

// 需要懒加载,因为webpack不支持完全动态注入，所以@拼字符串。然后再动态变量
export const routers = wrapRoutePath(routerConfig);

// 加载路由前
export const beforeRouter = (route: IRoute) => {
    document.title = route.title;
};



