import React from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion } from 'babylonjs';
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
    }


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
                const {offsetX, offsetY} = e ;
                const pick = this.scene.pick(offsetX, offsetY);
                console.log("==========",this.state.openParameters)
                if (!this.state.openParameters && pick.hit) {
                    this.setState({openParameters: true, left: offsetX, top: offsetY, mesh: pick.pickedMesh});
                }

                console.log(pick)
            });
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
        const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), this.scene);
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
        console.log("closed")
        this.setState({openParameters: false})
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
                    handleChange={(e: any, type: string)=> this.handleChange(e, type)}
                />
            </div>);
    }
}

export default App;