import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {marksDimensions, marksSubdivisions} from "./constants";
import {Mesh} from "babylonjs";

function valuetext(value: number) {
    return `${value}`;
}

export default class selectContainer {
    static Plane(mesh: Mesh, handleChange: (e: Event, type: string) => void) {
        const {x, y, z} = mesh?.scaling || {};

        return <div className={'planeContainer'}>
            <Typography gutterBottom>
                Width
            </Typography>
            <Slider
                aria-label="Width"
                value={x}
                onChange={(e: Event) => handleChange(e, "width")}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marksDimensions}
                min={0.1}
                max={2.0}
            />
            <Typography gutterBottom>
                Height
            </Typography>
            <Slider
                aria-label="Height"
                value={y}
                onChange={(e: Event) => handleChange(e, "height")}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marksDimensions}
                min={0.1}
                max={2.0}
            />
            <Typography gutterBottom>
                Depth
            </Typography>
            <Slider
                aria-label="Depth"
                value={z}
                onChange={(e: Event) => handleChange(e, "depth")}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marksDimensions}
                min={0.1}
                max={2.0}
            />
        </div>
    }

    static Cylinder(mesh: Mesh, handleChange: (e: Event, type: string) => void) {
        const {x, y} = mesh?.scaling || {};

        return <div className={'cylinderContainer'}>
            <Typography gutterBottom>
                Height
            </Typography>
            <Slider
                aria-label="Height"
                value={y}
                onChange={(e: Event) => handleChange(e, "height")}
                defaultValue={1}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marksDimensions}
                min={0.1}
                max={2}
            />
            <Typography gutterBottom>
                Diameter
            </Typography>
            <Slider
                aria-label="Diameter"
                value={x}
                onChange={(e: Event) => handleChange(e, "diameter")}
                defaultValue={1}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marksDimensions}
                min={0.1}
                max={2}
            />
        </div>
    };

    static IcoSphere(mesh: Mesh, handleChange: (e: Event, type: string) => void, sphereVertexLength: number) {
        const {x} = mesh?.scaling || {};

        let subdivisions = 0;
        let verticesCounted = 60;
        let nextPlus = 60;
        while (sphereVertexLength >= verticesCounted) {
            subdivisions++;
            nextPlus = 120 + nextPlus;
            verticesCounted += nextPlus;
        }

        return <div className={'sphereContainer'}>
            <Typography gutterBottom>
                Diameter
            </Typography>
            <Slider
                aria-label="diameterSphere"
                value={x}
                onChange={(e: Event) => handleChange(e, "diameterSphere")}
                defaultValue={1}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marksDimensions}
                min={0.1}
                max={2}
            />
            <Typography gutterBottom>
                Subdivisions
            </Typography>
            <Slider
                aria-label="subdivisions"
                value={subdivisions}
                onChange={(e: Event) => handleChange(e, "subdivisions")}
                defaultValue={10}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks={marksSubdivisions}
                min={1}
                max={10}
            />
        </div>
    }
}