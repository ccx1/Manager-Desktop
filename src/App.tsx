import {BrowserRouter, Link, HashRouter} from 'react-router-dom';
import '@/App.less';
import * as React from "react";
import * as Routers from '@/conts/routers.ts';
import renderRoutes from "@/utils/renderRoute.tsx";
import {Provider} from "react-redux";
import {Spin} from "antd";
import {MutableRefObject, useEffect, useRef, useState} from "react";

// const {Suspense} = React;

// 懒加载添加Suspense
const App: React.FC = (props: any) => {

    const minWidth = 200;
    const routineWidth = 220;
    const maxWidth = 500;

    const [mouseDownX, setMouseDownX] = useState(0);
    const [width, setWidth] = useState(routineWidth);
    const [isDown, setIsDown] = useState(false);
    const leftRef: MutableRefObject<any> = useRef();

    const onMouseUp = (e) => {
        setIsDown(false);
        setMouseDownX(0)
    }
    const onMouseMove = (e) => {
        if (isDown) {
            e.preventDefault()
            let leftWidth = e.clientX + mouseDownX;
            if (minWidth > leftWidth) {
                return;
            }
            if (leftWidth > maxWidth) {
                return;
            }
            setWidth(leftWidth);
        }
    }

    useEffect(() => {
        if (mouseDownX) {
            document.onmousemove = onMouseMove
            document.onmouseup = onMouseUp
        } else {
            document.onmousemove = null
            document.onmouseup = null
        }
    }, [mouseDownX]);

    return (<Provider store={props.store}>
        <React.Suspense fallback={<Spin style={
            {width: '100%', height: '100%', paddingTop: '20%'}}/>}>
            <HashRouter
                basename={Routers.basename}>
                <div className="app-wrapper-left" ref={leftRef} style={{width: width}}>
                    <div>
                        <Link to={"/home"}> 文件管理器</Link>
                        <br/>
                        <Link to={"/commands"}>命令行</Link>
                        <br/>
                        <Link to={"/process"}>进程管理</Link>
                    </div>
                    <div className="app-wrapper-left-drag-line"
                         onMouseDown={(e) => {
                             setIsDown(true);
                             setMouseDownX(e.clientX - leftRef.current.offsetWidth);
                         }}
                    />
                </div>
                <div className="app-wrapper-right">
                    {
                        renderRoutes(Routers.routers)
                    }
                </div>
            </HashRouter>
        </React.Suspense>
    </Provider>)
};

export default App;

