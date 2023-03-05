import React, { useRef, useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";


import ClearIcon from '@mui/icons-material/Clear';


import { Button, IconButton, Box, Avatar, Typography } from '@mui/material';

import DeviceDetector from "device-detector-js";
import NFTDetails from "./NFTDetails";

const NFTpage = (props) => {

    const canvasRef = useRef()
    const startARRef = useRef()

    console.log(props.nft)

    const nftImageUrl = props.nft.rawMetadata.image || "./assets/nft/nft1.png"

    const ARHandler = () => {
        console.log("enter AR")

        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(navigator.userAgent);
        // console.log(device)
        window.dispatchEvent(new CustomEvent('enter-ar', { detail: { os: device.os.name } }));
    }

    useEffect(() => {
        const canvas = canvasRef.current
        // const canvasContainer = canvasContainerRef.current;
        let camera, scene, renderer, controls

        const { XRWebGLLayer, XRRay } = window;
        let light
        let arScene = new THREE.Group();


        let height = 0.75

        let mixer

        let table
        let legs

        let lastCameraPosition = new THREE.Vector3();

        let shadowPlane


        // ar 
        let placeMode = true;
        let initPlaced = false;
        let session;
        let gl = null;
        let localReferenceSpace = null;
        let viewerReferenceSpace = null;
        let hitTestSourceRequested = false;
        let hitTestSource = null;
        let transientHitTestSource = null;

        let initScene = false;
        let raycaster = new THREE.Raycaster();
        let rayCasterProxy;

        let mouse = new THREE.Vector2();
        let offsetDirection = new THREE.Vector4(0, 0, -1, 0);

        let lastAngle = 0;
        let initialScale = 1;
        let initRatio = 1;
        let needInitScale = true;

        let xrAnimate


        placeMode = true;
        initPlaced = false;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 3;
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });

        renderer.xr.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        // container.appendChild( renderer.domElement );
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        scene.environment = pmremGenerator.fromScene(
            new RoomEnvironment(),
            0.04
        ).texture;

        scene.add(arScene)



        const nftTexture = new THREE.TextureLoader().load(
            "./assets/nft/nft1.png",
            function (texture) {
                // in this example we create the material when the texture is loaded
                texture.encoding = THREE.sRGBEncoding;
                texture.flipY = false


                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    transparent: true,
                    side:THREE.DoubleSide
                });

                console.log({ texture });
                const ratio = texture.image.height / texture.image.width;
                const geometry = new THREE.PlaneGeometry(1, ratio);
                const plane = new THREE.Mesh(geometry, material);
                // plane.scale.set(1,-1,1)
                // arScene.add(plane);


                rayCasterProxy = new THREE.Mesh(new THREE.BoxGeometry(1, ratio, 0.1));
                rayCasterProxy.visible = false;
                arScene.add(rayCasterProxy);


                loadPlane(texture,1, ratio)
                loadFrame(1, ratio)




            },
        );


        const loadPlane = (texture,width, height) => {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load(
                "./assets/plane.glb",
                function (gltf) {

                    let material

                    gltf.scene.traverse((obj) => {
                        if (obj instanceof THREE.Mesh) {
                            material = obj.material
                        }

                    })

                    material.map = texture
                    material.emissiveMap = texture

                    gltf.scene.scale.set(width,height,1)
                    arScene.add(gltf.scene);

                    

                },
                (xhr) => {
                    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                    let amount = Math.floor((xhr.loaded / xhr.total) * 100);
                    if (amount > 100) amount = 100;
                    console.log(amount);

                },
                // called when loading has errors
                function (error) {
                    console.log("An error happened when loading loading gltf content");
                }
            );


        }

        const loadFrame = (width, height) => {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load(
                "./assets/frame.glb",
                function (gltf) {

                    let material

                    gltf.scene.traverse((obj) => {
                        if (obj instanceof THREE.Mesh) {
                            material = obj.material
                        }

                    })
                    const geometry = new THREE.PlaneGeometry(width, height);
                    geometry.rotateY(Math.PI)
                    geometry.translate(0, 0, -0.01)
                    const plane = new THREE.Mesh(geometry, material);
                    arScene.add(plane);
                    arScene.position.y = height / 2


                    const frameTop = gltf.scene.clone()
                    frameTop.position.y = height / 2
                    frameTop.scale.x = width + 0.1

                    const frameBotom = gltf.scene.clone()
                    frameBotom.position.y = -height / 2
                    frameBotom.scale.x = width + 0.1
                    frameBotom.rotateZ(Math.PI)

                    const frameLeft = gltf.scene.clone()
                    frameLeft.position.x = -width / 2
                    frameLeft.rotateZ(Math.PI / 2)
                    frameLeft.scale.x = height + 0.1


                    const frameRight = gltf.scene.clone()
                    frameRight.position.x = width / 2
                    frameRight.rotateZ(-Math.PI / 2)
                    frameRight.scale.x = height + 0.1



                    arScene.add(frameTop)
                    arScene.add(frameBotom)
                    arScene.add(frameLeft)
                    arScene.add(frameRight)



                    controls.update();
                    renderer.render(scene, camera);
                },
                (xhr) => {
                    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                    let amount = Math.floor((xhr.loaded / xhr.total) * 100);
                    if (amount > 100) amount = 100;
                    console.log(amount);

                },
                // called when loading has errors
                function (error) {
                    console.log("An error happened when loading loading gltf content");
                }
            );


        }

        console.log(nftTexture)
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);



        window.addEventListener("enter-ar", async (e) => {

            console.log(e.detail)

            const os = e.detail.os
            // enterWebXR();

            if (os === "iOS") {
                enterIOS()
            } else {

                if (window.navigator.xr) {
                    const isARSupported = await window.navigator.xr.isSessionSupported(
                        "immersive-ar"
                    );
                    if (isARSupported) {
                        enterAndroidAR();
                    } else {
                        console.log("AR not support. no Immersive-AR")
                    }
                } else {
                    console.log("AR not support. No Navigator XR")
                }
            }
        })

        const enterAndroidAR = async () => {

            console.log("enter webxr api")

            placeMode = true;
            initPlaced = false;
            session = await navigator.xr.requestSession("immersive-ar", {
                requiredFeatures: ["hit-test"],
                optionalFeatures: ["dom-overlay"],
                domOverlay: { root: document.querySelector("#ar-overlay") },
            });

            localReferenceSpace = await session.requestReferenceSpace("local");
            viewerReferenceSpace = await session.requestReferenceSpace("viewer");

            session.addEventListener("end", onSessionEnded);
            session.addEventListener("selectstart", onSelectStart);
            session.addEventListener("selectend", onSelectEnd);

            renderer.xr.setReferenceSpaceType("local");
            await renderer.xr.setSession(session);
            session.requestAnimationFrame(onXRFrame);

            session
                .requestHitTestSourceForTransientInput({ profile: "generic-touchscreen" })
                .then((hitTestSource) => {
                    transientHitTestSource = hitTestSource;
                });
            document.querySelector("#ar-overlay").style.display = "block"
            // 
            document.querySelector("#ar-close-btn").addEventListener("click", () => {
                session.end()

            })

            // scene.remove(gridHelper);
            // scene.remove(newgridHelper);
            // cancelAnimationFrame(webAnimate);


        }

        function onSelectStart() {
            lastAngle = 0;
            initialScale = scene.scale.x;
            needInitScale = true;
            hitTestSourceRequested = false;
        }

        function onSelectEnd() {
            hitTestSourceRequested = true;
            placeMode = false;
            mouse.set(0, 0);
        }


        function onSessionEnded(/*event*/) {
            session.removeEventListener("end", onSessionEnded);
            session.removeEventListener("selectstart", onSelectStart);
            session.removeEventListener("selectend", onSelectEnd);

            session = null;

            // light.position.set(4, 6, 8);

            cancelAnimationFrame(xrAnimate);
            // onWindowResize()

            scene.position.set(0, 0, 0);
            scene.rotation.set(0, 0, 0);
            scene.scale.set(1, 1, 1);

            camera.position.set(0, 1.56, 2);
            controls.update();
            document.querySelector("#ar-overlay").style.display = "none"

            // renderer.render(scene, camera);
        }

        const enterIOS = () => {
            console.log("enter ios ar quick look")

            const exporter = new USDZExporter();
            exporter.parse(scene).then((object) => {
                const blob = new Blob([object], { type: "application/octet-stream" });
                const anchor = document.createElement("a");
                anchor.setAttribute("href", "");
                anchor.href = URL.createObjectURL(blob);
                anchor.setAttribute("download", "asset.usdz");
                anchor.setAttribute("rel", "ar");
                anchor.appendChild(document.createElement("img"));
                anchor.click();
            });

        }

        // function webAnimate() {
        //     controls.update();
        //     requestAnimationFrame(webAnimate);
        //     renderer.render(scene, camera);
        // }

        // webAnimate()



        function onXRFrame(t, frame) {
            let session = frame.session;

            xrAnimate = session.requestAnimationFrame(onXRFrame);

            // console.log("webxr");

            if (!hitTestSourceRequested) {
                offsetDirection = placeMode
                    ? new THREE.Vector4(mouse.x * 0.35, mouse.y * 0.65, -1, 0).normalize()
                    : new THREE.Vector4(0, 0, -1, 0);

                const XrayOffset = new XRRay(new DOMPoint(0, 0, 0), offsetDirection);

                session
                    .requestHitTestSource({
                        space: viewerReferenceSpace,
                        offsetRay: XrayOffset,
                    })
                    .then((source) => {
                        hitTestSource = source;
                        processInput(frame, source);
                    });
            }

            if (hitTestSource && placeMode) {
                const hitTestResults = frame.getHitTestResults(hitTestSource);
                if (hitTestResults.length) {
                    const hit = hitTestResults[0];
                    const positions = hit.getPose(localReferenceSpace).transform.position;
                    scene.position.copy(positions);
                    // placeMode = false;
                    if (!initPlaced) {
                        placeMode = false;
                        hitTestSourceRequested = true;
                        initPlaced = true;
                    }
                }
            }

            renderer.render(scene, camera);
        }


        function processInput(frame, hitSource) {
            if (!transientHitTestSource) {
                return;
            }

            const fingers = frame.getHitTestResultsForTransientInput(
                transientHitTestSource
            );
            if (fingers.length === 2) {
                const { separation, deltaYaw } = fingerPolar(fingers);
                if (Math.abs(deltaYaw) < 0.5) {
                    scene.rotateY(deltaYaw);
                }
                if (needInitScale) {
                    initRatio = separation;
                    needInitScale = false;
                }
            } else if (fingers.length === 1) {
                xrayPosition(fingers);
            }
        }


        function xrayPosition(fingers) {
            // const touchPoint =  new THREE.Vector2(..fingers[0].inputSource.gamepad.axes);
            mouse.set(
                fingers[0].inputSource.gamepad.axes[0],
                -fingers[0].inputSource.gamepad.axes[1]
            );

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(rayCasterProxy, true);
            // const intersects = this.raycaster.intersectObject(this.cube);

            if (intersects.length > 0) {
                placeMode = true;
                hitTestSourceRequested = false;

                // console.log("moving");
            }
        }

        function fingerPolar(fingers) {
            const fingerOne = fingers[0].inputSource.gamepad.axes;
            const fingerTwo = fingers[1].inputSource.gamepad.axes;
            const deltaX = fingerTwo[0] - fingerOne[0];
            const deltaY = fingerTwo[1] - fingerOne[1];
            const angle = Math.atan2(deltaY, deltaX);
            let deltaYaw = lastAngle - angle;
            if (deltaYaw > Math.PI) {
                deltaYaw -= 2 * Math.PI;
            } else if (deltaYaw < -Math.PI) {
                deltaYaw += 2 * Math.PI;
            }
            lastAngle = angle;
            return {
                separation: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                deltaYaw: deltaYaw,
            };
        }

    })


    return (
        <React.Fragment>

            <Box
                sx={{
                    width: "100%",
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px"
                }}
            >

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "400px",
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                        zIndex: "10"
                    }}
                >
                    <Avatar alt="XR-Goods-Company" variant="square" src="./assets/images/xrgoodsLogo.svg"
                        sx={{
                            width: 50, height: 50,
                            padding: "10px",
                            "& img": {
                                padding: "10px",
                            }
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            fontWeight: "600"
                        }}
                    >ETHDenver AR NFT</Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: "200"
                    }}
                >Your NFT Details</Typography>

            </Box>








<NFTDetails nft={props.nft} />
<Button variant="contained" ref={startARRef}
                onClick={ARHandler}
                sx={{
                    width: "200px",
                    left: "calc(50% - 100px)"

                }}
            >Start AR</Button>
            <Box
                ref={canvasRef}
                component="canvas"
                sx={{
                    display:"none",
                    width: "100%",
                    height: "100%",
                    position: 'absolute',
                    top: "0",
                    zIndex: "-10"
                }}
            >

            </Box>



            <Box sx={{
                display: "block",
            }}>
                <Box sx={{
                    display: "none",
                }} id="ar-overlay">
                    <IconButton
                        id="ar-close-btn"
                        width="40"
                        height="40"
                        sx={{
                            color: "white",
                            position: 'absolute',
                            margin: "30px",
                            top: "0",
                            right: "0",
                            width: "40px",
                            height: '40px',
                            borderRadius: "40px",
                            fontSize: "1.2rem",
                            textAlign: 'center',
                            backgroundColor: "#6767677a",
                            '&:hover': {
                                boxShadow: "inset 0px 5px 15px rgb(0 0 0 / 8%)",

                            }
                        }}
                    ><ClearIcon /></IconButton>

                </Box>
            </Box>
        </React.Fragment >
    );
};

export default NFTpage;