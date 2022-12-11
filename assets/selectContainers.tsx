import Slider from "@mui/material/Slider";
import * as React from "react";

const marks = [{value: 0.1, label: '0.1',}, {value: 2, label: '2',}];
const marks2 = [{value: 1, label: '1',}, {value: 10, label: '10',}];

function valuetext(value: number) {
    return `${value}°C`;
}

export const getContainer: any = {
    Plane: (mesh: any, handleChange: any) => {
        const {x, y, z} = mesh?.scaling || {};

        return <div style={{width: "200px", height: "300px"}}>
            <Slider
                aria-label="Width"
                value={x}
                onChange={(e) => handleChange(e, "width")}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marks}
                min={0.1}
                max={2.0}
            />
            <Slider
                aria-label="Height"
                value={y}
                onChange={(e) => handleChange(e, "height")}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marks}
                min={0.1}
                max={2.0}
            />
            <Slider
                aria-label="Depth"
                value={z}
                onChange={(e) => handleChange(e, "depth")}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marks}
                min={0.1}
                max={2.0}
            />
        </div>
    },
    Cylinder: (mesh: any, handleChange: any) => {
        const {x, y, z} = mesh?.scaling || {};

        return <div style={{width: "200px", height: "300px"}}>
            <Slider
                aria-label="Height"
                value={y}
                onChange={(e) => handleChange(e, "height")}
                defaultValue={1}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marks}
                min={0.1}
                max={2}
            />
            <Slider
                aria-label="Diameter"
                value={x}
                onChange={(e) => handleChange(e, "diameter")}
                defaultValue={1}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marks}
                min={0.1}
                max={2}
            />
        </div>
    },
    IcoSphere: (mesh: any, handleChange: any, sphereVertexLength: number) => {
        const {x} = mesh?.scaling || {};

        let subdivisions = 0;
        let verticesCounted = 60;
        let nextPlus = 60;
        while (sphereVertexLength >= verticesCounted) {
            subdivisions++;
            nextPlus = 120 + nextPlus;
            verticesCounted += nextPlus;
            console.log("here", sphereVertexLength, verticesCounted)
        }
        console.log("here2", subdivisions, length, mesh)

        return <div style={{width: "200px", height: "300px"}}>
            <Slider
                aria-label="diameterSphere"
                value={x}
                onChange={(e) => handleChange(e, "diameterSphere")}
                defaultValue={1}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.1}
                marks={marks}
                min={0.1}
                max={2}
            />
            <Slider
                aria-label="subdivisions"
                value={subdivisions}
                onChange={(e) => handleChange(e, "subdivisions")}
                defaultValue={10}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks={marks2}
                min={1}
                max={10}
            />
        </div>
    }

}