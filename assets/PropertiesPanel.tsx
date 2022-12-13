import * as React from 'react';
import {useEffect, useState} from 'react';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import {Mesh} from 'babylonjs';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import selectContainer from "./selectContainers";

interface IEditMenu {
    open: boolean;
    top: number;
    left: number;
    mesh: Mesh | undefined;
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    applyBouncing: (mesh: Mesh | undefined, amplitude: number, duration: number) => void
}

export default function PropertyPanel({open, top, left, mesh, handleClose, handleChange, applyBouncing}: IEditMenu): JSX.Element {
    const {x, y, z} = mesh?.scaling || {};
    const {length} = mesh?._geometry?._indices || {};

    const [amplitude, setAmplitude] = useState(5);
    const [duration, setDuration] = useState(1000);

    useEffect(() => {
    }, [x, y, z, length]);

    const containerName = mesh?.name || "Plane";
    // @ts-ignore => const containerName: keyof typeof GetContainer = mesh?.name; Babylons Mesh.name issue
    const container: React.ReactNode = selectContainer[containerName](mesh, handleChange, length);

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
                               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmplitude(parseFloat(e.target.value))}/>
                    <TextField id="outlined-basic" label="Duration" type="number" variant="outlined" value={duration}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                   setDuration(parseFloat(e.target.value))
                               }}/>
                    <Button
                        onClick={() => applyBouncing(mesh, amplitude, duration)}> Jump </Button>
                </div>
            </Typography>
        </Popover>
    );
}