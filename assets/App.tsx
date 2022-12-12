import React from 'react';
import {Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion} from 'babylonjs';
import 'babylonjs-loaders';
import BasicCard from "./panel";

class App extends React.Component<{}, {}> {
    private scene: any;
    private engine: any;
    private plane: any;
    private icosphere: any;
    private cylinder: any;

    state = {
        openParameters: false,
        left: 0,
        top: 0,
        mesh: null,
        startAnimation: false,
    }
    private bouncedMesh: any;
    private startAnimation: boolean;
    private animationParameters: {
        startTime: number,
        amplitude: number,
        duration: number,
    };


    componentDidMount() {

        const canvas = this.refs?.canvas;
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error("Couldn't find a canvas. Aborting the demo");
        } else {
            this.prepareScene(canvas);

            window.addEventListener("resize", () => {
                this.engine.resize();
            })

            canvas.addEventListener("click", (e) => {
                const {offsetX, offsetY} = e;
                const pick = this.scene.pick(offsetX, offsetY);

                if (!this.state.openParameters && pick.hit) {
                    this.setState({openParameters: true, left: offsetX, top: offsetY, mesh: pick.pickedMesh});
                }
            });
        }
    }

     bounce(timeFraction: number) {
        for (let a = 0, b = 1; 1; a += b, b /= 2) {
            if (timeFraction >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
            }
        }
    }

    createEcoSphere(options = {}) {
        this.icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", options, this.scene);
        this.icosphere.position.set(-2, 0, 0);
    }

    prepareScene(canvas: any): void {
        this.engine = new Engine(canvas, true, {});
        this.scene = new Scene(this.engine);

        // Camera
        const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 5), this.scene);
        camera.attachControl(canvas, true);

        // Light
        new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), this.scene);

        // Objects
        this.plane = MeshBuilder.CreateBox("Plane", {}, this.scene);
        this.plane.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);

        this.cylinder = MeshBuilder.CreateCylinder("Cylinder", {}, this.scene);
        this.cylinder.position.set(2, 0, 0);

        this.createEcoSphere({subdivisions: 4});

        this.engine.runRenderLoop(() => {
            this.scene.render();

            if (this.startAnimation) {
                const mesh = this.bouncedMesh;
                let {
                    startTime,
                    duration,
                    amplitude,
                } = this.animationParameters;
                const timeFraction = (new Date().getTime() - startTime) / duration;

                if ((new Date().getTime() - startTime) < duration) {
                    mesh.position.y = amplitude * this.bounce(1 - timeFraction);
                } else {
                    this.startAnimation = false;
                    mesh.position.y = 0;
                }
            }
        });
    }

    handleChange(e: any, type: string) {
        const {value} = e.target;
        let {mesh}: any = this.state;

        switch (type) {
            case "width": {
                mesh.scaling.x = value;
                break;
            }
            case "height": {
                mesh.scaling.y = value;
                break;
            }
            case "depth": {
                mesh.scaling.z = value;
                break;
            }
            case "diameter": {
                mesh.scaling.x = value;
                mesh.scaling.z = value;
                break;
            }
            case "diameterSphere": {

                mesh.scaling.x = value;
                mesh.scaling.y = value;
                mesh.scaling.z = value;
                console.log("value", value, mesh.scaling)
                break;
            }
            case "subdivisions": {
                const scale = mesh.scaling.x;
                this.icosphere.dispose();
                this.icosphere = null;
                this.createEcoSphere({subdivisions: value});

                mesh = this.icosphere;
                mesh.scaling.x = scale;
                mesh.scaling.y = scale;
                mesh.scaling.z = scale;
                break;
            }

        }
        this.setState({mesh: mesh});
    }

    handleClose() {
        this.setState({openParameters: false})
    }

    applyBouncing(mesh: any, amplitude: number, duration: number) {
        this.bouncedMesh = mesh;
        this.startAnimation = true;
        this.animationParameters = {
            startTime: new Date().getTime(),
            duration,
            amplitude,
        }
    }

    render(): React.ReactNode {
        const {openParameters, left, top, mesh} = this.state
        return (
            <div className="App">
                <canvas ref="canvas" className="canvas"/>
                <BasicCard
                    open={openParameters}
                    left={left}
                    top={top}
                    mesh={mesh}
                    handleClose={() => this.handleClose()}
                    handleChange={(e: any, type: string) => this.handleChange(e, type)}
                    applyBouncing={(mesh: any, amplitude: number, duration: number) => this.applyBouncing(mesh, amplitude, duration)}
                />
            </div>);
    }
}

export default App;