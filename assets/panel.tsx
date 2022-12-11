import * as React from 'react';
import { useEffect } from 'react';
import Popover from '@mui/material/Popover';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import {getContainer} from "./selectContainers";
export default function EditMenu({open, top, left, mesh, handleClose, handleChange }: any) {
    const {x, y, z} = mesh?.scaling || {};
    const {length} = mesh?._geometry?._indices || {};

    useEffect(() => {
    }, [x, y, z, length]);

    const containerName = mesh?.name || "Plane";

    const container = getContainer[containerName](mesh, handleChange, length);
    console.log("open", open)
    return (
        <Popover
            open={open}
            anchorReference="anchorPosition"
            anchorPosition={{ top, left }}
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
            <Typography sx={{ p: 2 }}>
                <div>
                    {container}
                </div>
            </Typography>
        </Popover>
    );
}