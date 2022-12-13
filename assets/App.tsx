import React from 'react';
import {Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion, Mesh} from 'babylonjs';
import 'babylonjs-loaders';
import PropertyPanel from "./PropertiesPanel";
import {Nullable} from "babylonjs/types";
import {PickingInfo} from "babylonjs/Collisions/pickingInfo";

class App extends React.Component<{}, {}> {
    private scene: Scene | undefined;
    private engine: Engine | undefined;
    private plane: Mesh | undefined;
    private icosphere: Mesh | undefined;
    private cylinder: Mesh | undefined;
    private bouncedMesh: Mesh | undefined;
    private startAnimation: boolean | undefined;
    private animationParameters: {
        startTime: number;
        amplitude: number;
        duration: number;
    } | undefined;

    state: {
        openParameters: boolean,
        left: number,
        top: number,
        mesh: Mesh | undefined,
        startAnimation: boolean,
    } = {
        openParameters: false,
        left: 0,
        top: 0,
        mesh: undefined,
        startAnimation: false,
    }

    componentDidMount(): void {
        const canvas: React.ReactInstance | undefined = this.refs?.canvas;
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error("Couldn't find a canvas. Aborting the demo");
        } else {
            this.prepareScene(canvas);

            window.addEventListener("resize", () => {
                this.engine?.resize();
            })

            canvas.addEventListener("click", (e: MouseEvent) => {
                const {offsetX, offsetY}: { offsetX: number, offsetY: number } = e;
                const pick: Nullable<PickingInfo> | undefined = this.scene?.pick(offsetX, offsetY);

                if (!this.state.openParameters && pick?.hit) {
                    this.setState({openParameters: true, left: offsetX, top: offsetY, mesh: pick.pickedMesh});
                }
            });
        }
    }

    bounce(timeFraction: number): number {
        for (let a = 0, b = 1; 1; a += b, b /= 2) {
            if (timeFraction >= (7 - 4 * a) / 11) { // 4 and 7 coefficient are used to control bounce and smooth y axis fall
                return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)// Math.pow(b, 2) to keep the same x axis for bounce
            }
        }
        return 1;
    }

    createEcoSphere(options = {}, scale?: number): void {
        this.icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", options, this.scene);
        this.icosphere.position.set(-2, 0, 0);

        if (scale) {
            this.icosphere.scaling.x = scale;
            this.icosphere.scaling.y = scale;
            this.icosphere.scaling.z = scale;
        }
    }

    prepareScene(canvas: HTMLCanvasElement): void {
        this.engine = new Engine(canvas, true, {});
        this.scene = new Scene(this.engine);

        // Camera
        const camera: ArcRotateCamera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), this.scene);
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
            this.scene?.render();

            if (this.startAnimation) {

                const mesh = this.bouncedMesh;
                if (mesh) {
                    let {
                        startTime,
                        duration,
                        amplitude,
                    } = this.animationParameters || {startTime: 0, duration: 1, amplitude: 0};
                    const timeFraction = (new Date().getTime() - startTime) / duration;
                    if ((new Date().getTime() - startTime) < duration) {
                        mesh.position.y = amplitude * this.bounce(1 - timeFraction);
                    } else {
                        this.startAnimation = false;
                        mesh.position.y = 0;
                    }
                }
            }
        });
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>, type: string): void {
        const value = parseFloat(e.target.value);
        let {mesh} = this.state;

        if (mesh) {
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
                    break;
                }
                case "subdivisions": {
                    const scale = mesh.scaling.x;
                    this.icosphere?.dispose();
                    this.icosphere = undefined;
                    this.createEcoSphere({subdivisions: value}, scale);
                    mesh = this.icosphere;
                    break;
                }

            }
            this.setState({mesh: mesh});
        }
    }

    handleClose(): void {
        this.setState({openParameters: false})
    }

    applyBouncing(mesh: Mesh | undefined, amplitude: number, duration: number): void {
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
                <PropertyPanel
                    open={openParameters}
                    left={left}
                    top={top}
                    mesh={mesh}
                    handleClose={() => this.handleClose()}
                    handleChange={(e: React.ChangeEvent<HTMLInputElement>, type: string) => this.handleChange(e, type)}
                    applyBouncing={(mesh: Mesh | undefined, amplitude: number, duration: number) => this.applyBouncing(mesh, amplitude, duration)}
                />
            </div>);
    }
}

export default App;