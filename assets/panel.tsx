import * as React from 'react';
import {useEffect, useState} from 'react';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import {Mesh} from 'babylonjs';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import GetContainer from "./selectContainers";

interface IEditMenu {
    open: boolean;
    top: number;
    left: number;
    mesh: Mesh | undefined;
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    applyBouncing: (mesh: Mesh | undefined, amplitude: number, duration: number) => void
}

export default function EditMenu({open, top, left, mesh, handleClose, handleChange, applyBouncing}: IEditMenu) {
    const {x, y, z} = mesh?.scaling || {};
    const {length} = mesh?._geometry?._indices || {};

    const [amplitude, setAmplitude]: any = useState(5);
    const [duration, setDuration]: any = useState(1000);

    useEffect(() => {
    }, [x, y, z, length]);

    const containerName = mesh?.name || "Plane";
    // @ts-ignore => const containerName: keyof typeof GetContainer = mesh?.name; Babylons Mesh.name issue
    const container: React.ReactNode = GetContainer[containerName](mesh, handleChange, length);

    return (
        <Popover
            open={open}
            anchorReference="anchorPosition"
            anchorPosition={{top, left}}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={handleClose}
        >
            <Typography sx={{p: 2}}>
                <div>
                    {container}
                </div>
                <div className={'bouncing-form'}>
                    <TextField id="outlined-basic" label="Amplitude" type="number" variant="outlined" value={amplitude}
                               onChange={(e: { target: { value: any; }; }) => setAmplitude(e.target.value)}/>
                    <TextField id="outlined-basic" label="Duration" type="number" variant="outlined" value={duration}
                               onChange={(e: { target: { value: any; }; }) => {
                                   console.log("====12",e.target.value)
                                   setDuration(e.target.value)
                               }}/>
                    <Button
                        onClick={() => applyBouncing(mesh, amplitude, duration)}> Jump </Button>
                </div>
            </Typography>
        </Popover>
    );
}