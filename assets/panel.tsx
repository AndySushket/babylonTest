import * as React from 'react';
import {useEffect, useState} from 'react';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import {getContainer} from "./selectContainers";

export default function EditMenu({open, top, left, mesh, handleClose, handleChange, applyBouncing}: any) {
    const {x, y, z} = mesh?.scaling || {};
    const {length} = mesh?._geometry?._indices || {};

    const [amplitude, setAmplitude]: any = useState(5);
    const [duration, setDuration]: any = useState(1000);

    useEffect(() => {
    }, [x, y, z, length]);

    const containerName = mesh?.name || "Plane";

    const container = getContainer[containerName](mesh, handleChange, length);

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
                        onClick={() => {
                            console.log("====should", amplitude, duration)
                            applyBouncing(mesh, amplitude, duration);
                        }}
                    > Jump </Button>
                </div>
            </Typography>
        </Popover>
    );
}