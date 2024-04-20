import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import StraightenIcon from '@mui/icons-material/Straighten';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";

const minTailBaseWidth = 3;
const unit = 'mm';

export default function App() {
    const [result, setResult] = React.useState(<></>);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const length = parseFloat(data.get('length') as string);
        const depth = parseFloat(data.get('depth') as string);
        const pin = parseFloat(data.get('pin') as string);
        const loff = parseFloat(data.get('loff') as string);
        const roff = parseFloat(data.get('roff') as string);
        const slope = parseFloat(data.get('slope') as string);


        if (isNaN(length) || isNaN(depth) || isNaN(pin) || isNaN(loff) || isNaN(roff) || isNaN(slope)) {
            setResult(
                <Alert severity="error">
                    All fields must contain valid numbers.
                </Alert>
            );
            return;
        }

        if (loff < 0 || roff < 0) {
            setResult(
                <Alert severity="error">
                    Left and right offset has to be at least 0.
                </Alert>
            );
            return;
        }

        const ptw = pin - depth * 2 / slope;
        if (ptw < 0) {
            setResult(
                <Alert severity="error">
                    Pin too narrow. It must be at least {depth * 2 / slope}.
                </Alert>
            );
            return;
        }

        const tl = length - loff - roff + ptw;
        const maxCount = Math.floor(tl / (minTailBaseWidth + pin));

        if (maxCount < 1) {
            setResult(
                <Alert severity="error">
                    Length is too short. Adjust left and right offsets.
                </Alert>
            );
            return;
        }

        const variants = [];
        for (let count = 1; count < maxCount; count++) {
            const stops: number[] = [loff, length - roff];
            const tpw = tl / count;
            for (let i = 1; i < count; i++) {
                stops.push(tpw * i + loff);
                stops.push(length - roff - tpw * i);
            }

            stops.sort((a, b) => a - b);
            console.log(stops);

            variants.push(
                <Accordion key={count}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {count} tail(s), {(tpw - ptw).toFixed(1)} {unit} wide
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            stops.map((stop, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <StraightenIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={stop.toFixed(1)}/>
                                </ListItem>
                            ))
                        }
                    </AccordionDetails>
                </Accordion>
            );
        }

        setResult(
            <>
                { variants }
            </>
        );
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">Dovetail Layout Calculator</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="length"
                        label={`Total length (in ${unit})`}
                        name="length"
                        type="number"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="depth"
                        label={`Depth (opposite stock thickness in ${unit})`}
                        name="depth"
                        type="number"
                        defaultValue={18}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="pin"
                        label={`Pin width at base (in ${unit})`}
                        name="pin"
                        type="number"
                        defaultValue={19}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="loff"
                        label={`Offset left (in ${unit})`}
                        name="loff"
                        type="number"
                        defaultValue={10}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="roff"
                        label={`Offset right (in ${unit})`}
                        name="roff"
                        type="number"
                        defaultValue={10}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="slope"
                        label="Tail slope (1:x)"
                        name="slope"
                        type="number"
                        defaultValue={6}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Calculate
                    </Button>
                </Box>

                <Box sx={{mt: 3, width: '100%'}}>
                    {result}
                </Box>
            </Box>
        </Container>
    );
}